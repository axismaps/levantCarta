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
        // const { data: { features } } = await axios.get(API + layerId);

        if (state.loadedLayers.includes(layerId)) return;

        if (layerId == 'b858c519-cff1-4a6c-887e-e37b3c245601') {
            const { data } = await axios.get('/data/schools.json');

            try {
                rootState.draw.add(data)
            } catch (error) { }
            console.log('Here is the features data', data)
            commit('SET_FEATURES', data)
        } else {
            const { data } = await axios.get('/data/features.json');


            try {
                rootState.draw.add(data)
            } catch (error) { }
            console.log('Here is the features data', data)
            commit('SET_FEATURES', data)

        }

        commit('LOAD_LAYER', layerId)



    }
}