import axios from 'axios';
const API = 'http://beirut.georio.levantcarta.org/api/v1/get/features/';

export const state = () => ({
    features: [],
    isLoading: false,
    loadedLayers: [],
    currentFeatures: [],

})

export const mutations = {
    SET_FEATURES(state, features) {
        state.features.push(features)
    },
    SET_CURRENT_FEATURES(state, features) {
        state.currentFeatures = features
    },
    LOAD_LAYER(state, layer) {
        state.loadedLayers.push(layer)
    }
}

export const actions = {
    async setFeaturesFromLayer({ commit, state, rootState }, layerId) {

        if (state.loadedLayers.includes(layerId)) return;

        const { data } = await axios.get('http://beirut.georio.levantcarta.org/api/v1/get/features/' + layerId);


        rootState.draw.add(data)

        commit('LOAD_LAYER', layerId)

    }
}