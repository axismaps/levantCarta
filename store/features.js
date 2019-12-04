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

        try {

            await axios.post('http://beirut.georio.levantcarta.org/api/v1/make/feature', request)
        } catch (error) {
            console.log("couldn't create feature: ", error.response)

        }
    },
    async updateFeature({ rootState }, feature) {
        const layerId = rootState.layers.currentItem.id
        const featureId = feature.id

        const req = {
            ...feature.properties,
            geom: feature.geometry
        }

        try {
            console.log(`http://beirut.georio.levantcarta.org/api/v1/update/feature/${layerId}/${featureId}`)
            console.log('saving: ', req)
            await axios.post(`http://beirut.georio.levantcarta.org/api/v1/update/feature/${layerId}/${featureId}`, req)
        } catch (error) {
            console.log("couldn't update feature: ", error.response)
        }
    }
}
