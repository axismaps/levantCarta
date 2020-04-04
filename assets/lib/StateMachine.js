import uuidv4 from 'uuid/v4';
import { Feature } from './Feature';
import { mergeFeatures, featuresToPoints, pointsToFeature } from './Helpers';

const states = {
  idle: {
    onEnter() {
      console.log('some clean up?');
    }
  },
  add_geometry_to_feature: {
    switchTo: 'add_geometry_to_feature.before_drawing',
    onEnter() {
      return;
    },
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
        console.log('é isso aqui?');
        app.applyChange(updateFeatureAction);

        return;
      }
    }
  },
  split_multipart_feature: {
    before_splitting: {
      switchTo: 'split_multipart_feature.splitting',
      onEnter(app) {
        console.log('antes de splitting');
        app.featureBeingSplit = app.selectedFeature;
        // app.splitMultifeature();
        app.draw.uncombineFeatures();
        return;
      }
    },
    splitting: {
      switchTo: 'split_multipart_feature.after_splitting',
      onEnter(app, payload) {
        const { features } = payload;

        console.log('payload', payload);
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

        console.log('splitFeature', splitFeature);
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
        console.log('ou é isso aqui?');
        app.applyChange(updateFeatureAction);

        // app.updateDrawMode('simple_select');
        // app.draw.changeMode('simple_select');

        await resolveAfter2Seconds(app.draw.delete(splitFeature.id));
        await resolveAfter2Seconds(
          featureBeingSplitParts.map(feature => {
            app.draw.delete(feature.id);
          })
        );
        await resolveAfter2Seconds(app.draw.add(updatedFeatureBeingSplit));
        // app.handleSelectionchange({ features: [splitFeature] });

        // console.log('antes de atualizar a selectedFeature');
        console.log('antes de clonar ');
        // app.updateSelectedFeature([splitFeature]);
        // app.cloneFeature(splitFeature);

        const createFeatureAction = {
          features: [{ ...splitFeature, id: uuidv4() }],
          type: 'draw.create',
          action: 'feature.clone'
        };
        console.log('antes de drawchange mode');
        console.log('antes de appy chage');
        app.applyChange(createFeatureAction);
        console.log('antes de update selectedFeature []');
        console.log('depois de update selectedFeature []');
        // app.updateSelectedFeature([splitFeature]);

        return;
      }
    }
  }
};

const interpreter = {
  enter(app, state) {
    const actualState = app.aplicationState;
    if (actualState !== 'idle') {
      console.log(`STATE MACHINE ERROR: App actual state must be idle.`);
      return app.actualState;
    }
    app.aplicationState = 'idle_out';
    console.log('enter state', state);
    return this.interpreter(app, state);
  },
  next(app, payload) {
    const actualState = app.aplicationState;
    let schema = states;
    const pList = actualState.split('.');
    const len = pList.length;

    for (let i = 0; i < len - 1; i++) {
      const element = pList[i];
      if (!schema[element]) schema[element] = {};
      schema = schema[element];
    }

    const nextState = schema[pList[len - 1]].switchTo;

    console.log('nextState', nextState);
    return this.interpreter(app, nextState, payload);
  },
  interpreter(app, actualState, payload) {
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
      schema[pList[len - 1]].onEnter(app, payload);
    } catch (error) {
      // console.log(`STATE MACHINE ERROR: ${error}`);
      console.log(error);
      newState = actualState;
    }

    return newState;
  }
};

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 200);
  });
}

export { states, interpreter };
