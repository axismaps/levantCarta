import axios from 'axios';

export const state = () => ({
    overlays: [],
    isLoading: false,
    currentItem: {}
})

export const mutations = {
    SET_ITEMS(state, items) {
        state.items = items
    },
    ADD_ITEM(state, item) {
        state.items.push(item)
    },
    REMOVE_ITEM(state, { item }) {
        state.items.splice(state.items.indexOf(item), 1)
    },
    UPDATE_ITEM(state, item) {
    },
    SET_LOADING_STATUS(state, status) {
        state.isLoading = status
    },
    SET_CURRENT_ITEM(state, item) {
        state.currentItem = item
    }

}
/** async actions */
export const actions = {
    async nuxtServerInit({ commit }, nuxtContext) {
        const { data } = await axios.get('/data/layers.json')
        commit('SET_ITEMS', data)

    },
    setItems({ commit }, items) {
        commit('SET_ITEMS', items)
    },
    setCurrentItem({ commit, state }, itemId) {
        const currentItem = state.items.filter(item => item.id === itemId)[0]
        commit('SET_CURRENT_ITEM', currentItem)
    }
}

export const getters = {
    items(state) {
        return state.items
    },
    currentItem(state) {
        return state.currentItem
    }
}