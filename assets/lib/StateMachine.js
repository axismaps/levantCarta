import uuidv4 from 'uuid/v4';
import { Feature } from './Feature';
import { mergeFeatures, featuresToPoints, pointsToFeature } from './Helpers';

const states = {
  idle: {
    onEnter() {
      console.log('some clean up?');
    }
  },
  edit_feature: {
    editing: {
      switchTo: 'edit_feature.after_editing',
      async onEnter(app, payload) {
        const { features, action, type } = payload;
        const featureBeingEdit = features[0];
        if (featureBeingEdit) {
          // TODO: só preciso salvar a mudança da feature aqui pra o undo funcionar
          app.updateFeatureBeingDrawn(featureBeingEdit);
          return Promise.reject('Edition still in progress');
        }
        return;
      }
    },
    after_editing: {
      switchTo: 'idle',
      async onEnter(app) {
        const featureBeingEdit = JSON.parse(
          JSON.stringify(app.featureBeingDrawn)
        );
        const attributeForm = app.attributeForm;

        if (!app.isAttributeFormValid) {
          await delay(
            app.draw.changeMode('simple_select', {
              featureIds: [featureBeingEdit.id]
            })
          );
          throw 'atribute form invalid';
        }

        app.draw
          .setFeatureProperty(featureBeingEdit.id, 'name', attributeForm.name)
          .setFeatureProperty(
            featureBeingEdit.id,
            'firstyear',
            attributeForm.firstyear
          )
          .setFeatureProperty(
            featureBeingEdit.id,
            'lastyear',
            attributeForm.lastyear
          )
          .setFeatureProperty(featureBeingEdit.id, 'type', attributeForm.type)
          .setFeatureProperty(featureBeingEdit.id, 'tags', attributeForm.tags)
          .setFeatureProperty(featureBeingEdit.id, 'approved', false);

        featureBeingEdit.properties = {
          ...attributeForm,
          approved: false
        };

        await app.updateFeature(featureBeingEdit);

        app.updateSelectedFeature([]);
        app.updateFeatureBeingDrawn(null);
      }
    }
  },
  add_new_feature: {
    before_drawing: {
      switchTo: 'add_new_feature.drawing',
      onEnter(app) {
        // começa o draw, enterDrawMode(drawMode)

        const activeLayerType = app.activeLayer.geometry;
        switch (activeLayerType) {
          case 'point':
            app.createTooltip({ content: 'Click to add point' });
            app.enterDrawMode('draw_point');
            break;
          case 'line':
            app.createTooltip({ content: 'Click to start drawing line' });
            app.enterDrawMode('draw_line_string');
            break;
          case 'polygon':
            app.createTooltip({ content: 'Click to start drawing polygon' });
            app.enterDrawMode('draw_polygon');
            break;
          default:
            break;
        }
        return;
      }
    },
    drawing: {
      switchTo: 'add_new_feature.filling_form',
      async onEnter(app, payload) {
        const { features } = payload;
        console.log('enter drawing');

        app.updateFeatureBeingDrawn(app.featureBeingDrawn.lockDrawing());

        const featureBeingDrawn = app.featureBeingDrawn.feature;

        console.log('feature being drawn', featureBeingDrawn);
        await delay(app.draw.delete(features[0].id));
        await delay(app.draw.add(featureBeingDrawn));
        await delay(
          app.draw.changeMode('simple_select', {
            featureIds: [featureBeingDrawn.id]
          })
        );

        return;
      }
    },
    filling_form: {
      switchTo: 'idle',
      async onEnter(app) {
        // confirma se a form é válida
        console.log('enter filling form');
        const featureBeingDrawn = app.featureBeingDrawn.feature;

        if (!app.isAttributeFormValid) {
          await delay(
            app.draw.changeMode('simple_select', {
              featureIds: [featureBeingDrawn.id]
            })
          );
          throw 'atribute form invalid';
        }

        const attributeForm = app.attributeForm;

        featureBeingDrawn.properties = {
          ...attributeForm,
          approved: false
        };

        app.draw
          .setFeatureProperty(featureBeingDrawn.id, 'name', attributeForm.name)
          .setFeatureProperty(
            featureBeingDrawn.id,
            'firstyear',
            attributeForm.firstyear
          )
          .setFeatureProperty(
            featureBeingDrawn.id,
            'lastyear',
            attributeForm.lastyear
          )
          .setFeatureProperty(featureBeingDrawn.id, 'type', attributeForm.type)
          .setFeatureProperty(featureBeingDrawn.id, 'tags', attributeForm.tags)
          .setFeatureProperty(featureBeingDrawn.id, 'approved', false);
        console.log('salvando', featureBeingDrawn);
        app.saveFeature(featureBeingDrawn);

        await delay(app.draw.changeMode('simple_select'));
        app.updateFeatureBeingDrawn(null);
        app.updateSelectedFeature([]);

        return;
      }
    }
  },
  add_geometry_to_feature: {
    before_drawing: {
      switchTo: 'add_geometry_to_feature.drawing',
      onEnter(app) {
        app.addGeometryToFeature();

        const geometryType =
          app.selectedFeature.geometry.type === 'MultiLineString'
            ? 'LineString'
            : app.selectedFeature.geometry.type === 'MultiPolygon'
            ? 'Polygon'
            : app.selectedFeature.geometry.type === 'MultiPoint'
            ? 'Point'
            : app.selectedFeature.geometry.type;
        const newFeatureBeingDrawn = new Feature(
          app.selectedFeature.id,
          geometryType,
          {}
        );
        app.updateFeatureBeingDrawn(newFeatureBeingDrawn);

        return;
      }
    },
    drawing: {
      switchTo: 'add_geometry_to_feature.after_drawing',
      onEnter(app) {
        return;
      }
    },
    after_drawing: {
      switchTo: 'idle',
      async onEnter(app) {
        const baseFeature = app.selectedFeature;
        const newFeature = await app.featureBeingDrawn.mergeFeature(
          baseFeature
        );

        app.updateFeatureBeingDrawn(null);
        app.updateDrawMode('simple_select');

        app.draw.delete(baseFeature.id);
        app.draw.add(newFeature);
        app.draw.changeMode('simple_select', {
          featureIds: [newFeature.id]
        });

        app.handleSelectionchange({ features: [newFeature] });

        const updateFeatureAction = {
          features: [newFeature],
          type: 'draw.update',
          action: 'features.merge'
        };
        await app.applyChange(updateFeatureAction);

        return;
      }
    }
  },
  split_multipart_feature: {
    before_splitting: {
      switchTo: 'split_multipart_feature.splitting',
      onEnter(app) {
        app.featureBeingSplit = app.selectedFeature;
        app.draw.uncombineFeatures();
        return;
      }
    },
    splitting: {
      switchTo: 'split_multipart_feature.after_splitting',
      onEnter(app, payload) {
        const { features } = payload;

        console.log('select feature to keep');

        app.updateSelectedFeature(features);
        return;
      }
    },
    after_splitting: {
      switchTo: 'idle',
      async onEnter(app, payload) {
        const { features } = payload;

        const featureBeingSplit = app.featureBeingSplit;
        const splitFeature = features[0];

        const featureBeingSplitParts = app.multiselectedFeatures;

        //filter out the selected feature
        const featureBeingSplitNewParts = featureBeingSplitParts.filter(
          feature => {
            return feature.id !== splitFeature.id;
          }
        );

        const baseFeature = {
          id: featureBeingSplit.id,
          type: featureBeingSplit.type,
          properties: featureBeingSplit.properties,
          geometry: featureBeingSplitNewParts[0].geometry
        };

        const updatedFeatureBeingSplit = mergeFeatures(
          baseFeature,
          featureBeingSplitNewParts
        );

        const updateFeatureAction = {
          features: [updatedFeatureBeingSplit],
          type: 'draw.update',
          action: 'features.merge'
        };
        await app.applyChange(updateFeatureAction);

        await delay(app.draw.delete(splitFeature.id));
        await delay(
          featureBeingSplitParts.map(feature => {
            app.draw.delete(feature.id);
          })
        );
        await delay(app.draw.add(updatedFeatureBeingSplit));

        const createFeatureAction = {
          features: [{ ...splitFeature, id: uuidv4() }],
          type: 'draw.create',
          action: 'feature.clone'
        };
        await app.applyChange(createFeatureAction);
        app.updateSelectedFeature([]);
        app.updateSelectedFeature([splitFeature]);

        return;
      }
    }
  },
  merge_feature: {
    merging: {
      switchTo: 'idle',
      async onEnter(app) {
        const newFeature = await delay(
          mergeFeatures(app.selectedFeature, app.multiselectedFeatures)
        );

        const updateFeatureAction = {
          features: [newFeature],
          type: 'draw.update',
          action: 'features.merge'
        };

        await delay(app.draw.delete(app.selectedFeature.id));
        await delay(
          app.multiselectedFeatures.map(feature => {
            app.draw.delete(feature.id);
          })
        );

        await delay(app.draw.add(newFeature));
        await delay(
          app.draw.changeMode('simple_select', {
            featureIds: [newFeature.id]
          })
        );

        app.updateSelectedFeature([]);
        app.updateSelectedFeature([newFeature]);

        app.updateDrawMode('simple_select');

        await app.applyChange(updateFeatureAction);
      }
    }
  },
  clone_feature: {
    cloning: {
      switchTo: 'idle',
      async onEnter(app) {
        const newFeature = { ...app.selectedFeature, id: uuidv4() };

        const changeAction = {
          features: [newFeature],
          type: 'draw.create',
          action: 'feature.clone'
        };

        await app.applyChange(changeAction);
      }
    }
  }
};

/**
 * The transition function, which returns the state of the machine after the transition
 * @param {Object} app
 * @param {Object} actualState
 * @param {Object} payload
 *
 */
const transition = async (app, actualState, payload) => {
  console.log('actualState', actualState);
  if (actualState === 'idle') {
    console.log(`STATE MACHINE ERROR: Nothing to do, app is already idle`);
    return actualState;
  }
  let newState = {};

  try {
    let schema = states;
    const pList = actualState.split('.');
    const len = pList.length;

    for (let i = 0; i < len - 1; i++) {
      const element = pList[i];
      if (!schema[element]) schema[element] = {};
      schema = schema[element];
    }
    newState = schema[pList[len - 1]].switchTo;
    await schema[pList[len - 1]].onEnter(app, payload);
    return newState;
  } catch (error) {
    console.log(`STATE MACHINE ERROR: ${error}`);
    return actualState;
  }
};

function delay(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 200);
  });
}

export { states, transition };
