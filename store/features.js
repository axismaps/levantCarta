import axios from 'axios';
import { Loading } from 'element-ui';

import { featuresService } from './services/FeaturesService';

export const state = () => ({
  features: [],
  isLoading: false,
  currentFeatures: []
});

export const mutations = {
  SET_FEATURES(state, features) {
    state.features = features;
  },
  UPDATE_CURRENT_FEATURES(state, features) {
    state.currentFeatures = features;
  }
};

export const actions = {
  async setFeaturesFromLayer({ commit, state, rootState }, layerId) {
    const loading = Loading.service({ fullscreen: true });

    const featureCollection = await featuresService.getFeaturesByLayerId(
      layerId
    );

    loading.close();

    commit('UPDATE_CURRENT_FEATURES', { ...featureCollection, layerId });
    commit('SET_FEATURES', featureCollection.features);
    commit('layers/LOAD_LAYER', layerId, { root: true });

    rootState.draw.deleteAll();
    rootState.draw.add(featureCollection);
  },
  async getFeatureById({ commit, state }, id) {
    return state.features.filter(feature => feature.id === id)[0];
  },
  async saveFeature({}, feature) {
    const request = {
      id: feature.id,
      properties: feature.properties,
      geometry: feature.geometry
    };

    console.log('CREATING FEATURE: ', request);
    try {
      const response = await featuresService.post(feature.id, request);
      console.log('response: ', response);
    } catch (error) {
      console.log('Error', error.response);
      // TODO: handle error
    }
  },
  async updateFeature({ rootState }, feature) {
    const featureId = feature.id;

    const request = {
      id: featureId,
      properties: feature.properties,
      geometry: feature.geometry
    };

    console.log('SAVING FEATURE: ', request);
    try {
      const response = await featuresService.update(featureId, request);

      console.log('update response', response);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
};

export const getters = {
  features(state) {
    return state.features;
  }
};
