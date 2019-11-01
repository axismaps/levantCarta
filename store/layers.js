export const state = () => ({
    items: [],
    isLoading: false,
    currentItem: {},
    currentYear: '1800'
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
    }
}
/** async actions */
export const actions = {
    setItems({ commit }, items) {
        commit('SET_ITEMS', items)
    },
    setCurrentItem({ commit, state }, itemId) {
        const currentItem = state.items.filter(item => item._id === itemId)[0]
        commit('SET_CURRENT_ITEM', currentItem)
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