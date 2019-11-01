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
    applyChange({ commit, rootState }, changeAction) {

        const currentLayer = rootState.layers.currentItem._id //this probably is going to change when we connect the backend 
        const featureForm = rootState.attributeForm
        const draw = rootState.draw
        const changeType = changeAction.type

        const featureToUpdateId = changeAction.features[0].id;


        switch (changeType) {
            case 'draw.create':
                delete changeAction.target; //target is a map object instance returned by mapbox-draw, we dont need it so it is been deleted to free memory 
                draw.setFeatureProperty(featureToUpdateId, 'name', featureForm.name)
                    .setFeatureProperty(featureToUpdateId, 'mappedFrom', featureForm.mappedFrom)
                    .setFeatureProperty(featureToUpdateId, 'mappedTo', featureForm.mappedTo)
                    .setFeatureProperty(featureToUpdateId, 'type', featureForm.type)
                    .setFeatureProperty(featureToUpdateId, 'tags', featureForm.tags);

                commit('UPDATE_EDITION_STATUS', false, { root: true })
                break;
            case 'draw.update':

                draw.setFeatureProperty(featureToUpdateId, 'name', featureForm.name)
                    .setFeatureProperty(featureToUpdateId, 'mappedFrom', featureForm.mappedFrom)
                    .setFeatureProperty(featureToUpdateId, 'mappedTo', featureForm.mappedTo)
                    .setFeatureProperty(featureToUpdateId, 'type', featureForm.type)
                    .setFeatureProperty(featureToUpdateId, 'tags', featureForm.tags);

                break;
            default:
                break;
        }


        // commit('PUSH_CHANGE', { ...changeAction, layer: currentLayer, year: currentYear })
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