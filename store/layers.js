export const state = () => ({
    items: [],
    isLoading: false,
    currentItem: null,
    currentYear: '1800',
    loadedItems: []
})

export const mutations = {
    SET_ITEMS(state, items) {
        state.items = items
    },
    REMOVE_ITEM(state, { item }) {
        state.items.splice(state.items.indexOf(item), 1)
    },
    SET_CURRENT_ITEM(state, item) {
        state.currentItem = item
    },
    SET_CURRENT_YEAR(state, year) {
        state.currentYear = year
    },
    LOAD_LAYER(state, layer) {
        state.loadedItems.push(layer)
    }
}
/** async actions */
export const actions = {
    setItems({ commit }, items) {
        commit('SET_ITEMS', items)
    },
    async setCurrentItem({ commit, dispatch, state, rootState }, itemId) {
        const currentItem = state.items.filter(item => item.id === itemId)[0]

        rootState.draw.changeMode('simple_select')
        await dispatch('features/setFeaturesFromLayer', itemId, { root: true })
        commit('SET_CURRENT_ITEM', currentItem)
        commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true })
        commit('CLEAR_ATTRIBUTE_FORM', null, { root: true })
        commit('UPDATE_SELECTED_FEATURE', null, { root: true })
    },
    setCurrentYear({ commit }, year) {
        commit('SET_CURRENT_YEAR', year)
    }
}

export const getters = {
    items(state) {
        return state.items
    },
    currentItem(state) {
        return state.currentItem
    },
    currentYear(state) {
        return state.currentYear
    }
}