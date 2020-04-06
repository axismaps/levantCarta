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
        app.applyChange(updateFeatureAction);

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
        app.applyChange(updateFeatureAction);

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
        app.applyChange(createFeatureAction);
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

        app.applyChange(updateFeatureAction);
      }
    }
  },
  clone_feature: {
    cloning: {
      switchTo: 'idle',
      async onEnter(app) {
        app.cloneFeature(app.selectedFeature);
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

function delay(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 200);
  });
}

export { states, interpreter };
