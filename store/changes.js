export const state = () => ({
    changes: [],
    pendingUndoChange: {},
})

export const mutations = {
    PUSH_CHANGE(state, change) {
        console.log('change: ', change)
        state.changes.push(change)
    },
    POP_CHANGE(state) {
        state.pendingUndoChange = state.changes[state.changes.length - 1]
        state.changes.pop()
    },
    CLEAR_PENDING_CHANGE(state) {
        state.pendingUndoChange = {}
    }
}

export const actions = {
    applyChange({ commit, rootState }, change) {
        const currentLayer = rootState.layers.currentItem._id //this probably is going to change when we connect the backend 
        const currentYear = rootState.layers.currentYear
        
        delete change.target; //target is a map object instance returned by mapbox-draw, we dont need it so it is been deleted to free memory 

        // Todo: find the property by its id and update it 
        // . 
        // .
        // .

        commit('PUSH_CHANGE', { ...change, layer: currentLayer, year: currentYear })
    },
    undoChange({ commit, state }) {
        commit('POP_CHANGE')
        const { pendingUndoChange } = state

        if (!pendingUndoChange) console.log('There is nothing more to undo') //just return

        console.log('undo action', pendingUndoChange)

        //TODO: Undo action here
        // .
        // .
        // .

        commit('CLEAR_PENDING_CHANGE')
    }
}