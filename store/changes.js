export const state = () => ({
    changes: [],
    pendingUndoChange: {},
})

export const mutations = {
    PUSH_CHANGE(state, change) {
        //target is a map object instance, it needs to be deleted to free memory
        delete change.target;
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
    applyChange({ commit }, change) {
        commit('PUSH_CHANGE', change)
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