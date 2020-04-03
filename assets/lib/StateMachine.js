import { Feature } from './Feature';

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
        app.applyChange(updateFeatureAction);

        return;
      }
    }
  },
  split_multipart_feature: {
    before_splitting: {
      switchTo: 'split_multipart_feature.after_splitting',
      onEnter() {
        return;
      }
    },
    after_splitting: {
      switchTo: 'idle',
      onEnter() {
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
  next(app) {
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
    return this.interpreter(app, nextState);
  },
  interpreter(app, actualState) {
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
      schema[pList[len - 1]].onEnter(app);
    } catch (error) {
      console.log(`STATE MACHINE ERROR: ${error}`);
      newState = actualState;
    }

    return newState;
  }
};

export { states, interpreter };
