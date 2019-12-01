import axios from 'axios';
const API = 'http://beirut.georio.levantcarta.org/api/v1/get/features/';


// TODO: Nao sei se eu preciso dessa porra, talvez seja o caso de vincular essa lógica as layers
/* 
merge com layers
ao adicionar uma nova feature eu preciso adicionar essa na layer carregada. no redraw eu vou desenhar essa feature tbm
ao salvar a layer carregada eu vou buscar as features que faltam salvar salvar...


**/ 

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
    UPDATE_CURRENT_FEATURES(state, features) {
        state.currentFeatures = features
    },
    LOAD_LAYER(state, layer) {
        state.loadedLayers.push(layer)
    }
}

export const actions = {
    async setFeaturesFromLayer({ commit, state, rootState }, layerId) {

        let featureCollection = {}

        if (state.loadedLayers.includes(layerId)) {
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
            commit('LOAD_LAYER', layerId)
        }


        rootState.draw.deleteAll()
        rootState.draw.add(featureCollection)

    }
}