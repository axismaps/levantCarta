import axios from 'axios';
const API = 'http://beirut.georio.levantcarta.org/api/v1/get/features/';

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

        let featureCollection = {}
        console.log(rootState)
        if (rootState.layers.loadedItems.includes(layerId)) {
            featureCollection = state.features.filter(layer => {
                console.log(layer)
                console.log(layerId)
                return layer.layerId === layerId
            })[0]
            commit('UPDATE_CURRENT_FEATURES', featureCollection)

            console.log('NO API', featureCollection)
        } else {
            const { data } = await axios.get('http://beirut.georio.levantcarta.org/api/v1/get/features/' + layerId);
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

        await axios.post('http://beirut.georio.levantcarta.org/api/v1/make/feature', request)
    },
    async updateFeature({ rootState }, feature) {
        const layerId = rootState.layers.currentItem.id
        const featureId = feature.id

        const req = {
            ...feature.properties,
            geom: feature.geometry
        }

        await axios.post(`http://beirut.georio.levantcarta.org/api/v1/update/feature/${layerId}/${featureId}`, req)
    }
}