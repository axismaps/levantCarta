import axios from 'axios';
import { Loading } from 'element-ui';

const API = process.env.API

export const state = () => ({
    features: [],
    isLoading: false,
    currentFeatures: [],

})

export const mutations = {
    SET_FEATURES(state, features) {
        state.features.push(features)
    },
    UPDATE_CURRENT_FEATURES(state, features) {
        state.currentFeatures = features
    },
}

export const actions = {
    async setFeaturesFromLayer({ commit, state, rootState }, layerId) {
        const loading = Loading.service({ fullscreen: true })

        let featureCollection = {}
        if (rootState.layers.loadedItems.includes(layerId)) {
            featureCollection = state.features.filter(layer => {
                return layer.layerId === layerId
            })[0]
            commit('UPDATE_CURRENT_FEATURES', featureCollection)
            console.log('NO API', featureCollection)
            loading.close()
        } else {
            const { data } = await axios.get(`${API}/get/features/${layerId}`);

            loading.close()
            console.log('API')
            featureCollection = data
            commit('UPDATE_CURRENT_FEATURES', { ...data, layerId })
            commit('SET_FEATURES', { ...data, layerId })
            commit('layers/LOAD_LAYER', layerId, { root: true })
        }

        rootState.draw.deleteAll()
        rootState.draw.add(featureCollection)
    },
    async saveFeature({ }, feature) {

        const request = {
            type: feature.properties.type,
            dataType: 'geojson',
            data: {
                id: feature.id,
                properties: feature.properties,
                geometry: feature.geometry
            }
        }

        console.log('CREATING FEATURE: ', request)
        try {
            await axios.post(`${API}/make/feature`, request)
        } catch (error) {
            console.log("couldn't create feature: ", error.response)
        }
    },
    async updateFeature({ rootState }, feature) {
        const layerId = rootState.layers.currentItem.id
        const featureId = feature.id

        const request = {
            ...feature.properties,
            geom: feature.geometry
        }

        console.log('SAVING FEATURE: ', request)
        try {
            await axios.post(`${API}/update/feature/${layerId}/${featureId}`, request)
        } catch (error) {
            console.log("couldn't update feature: ", error.response)
        }
    }
}
