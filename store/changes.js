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

        const { draw, selectedFeature } = rootState
        const currentLayer = rootState.layers.currentItem.id
        const attributeForm = rootState.attributeForm
        const isAttributeFormValid = rootState.isAttributeFormValid
        const changeType = changeAction.type

        let featureToUpdate = changeAction.features[0];

        console.log(changeAction)
        delete changeAction.target; //changeAction.target is a map object instance returned by mapbox-draw, we dont need it so it is been deleted to free memory

        switch (changeType) {
            case 'draw.step':
                featureToUpdate.id = selectedFeature.id;
                featureToUpdate = {
                    ...featureToUpdate, properties: {
                        'name': attributeForm.name,
                        'firstyear': attributeForm.firstyear,
                        'lastyear': attributeForm.lastyear,
                        'type': attributeForm.type,
                        'tags': attributeForm.tags,
                        'approved': 'false'
                    }
                }
                break;
            case 'draw.create':

                draw.delete(featureToUpdate.id)
                featureToUpdate.id = selectedFeature.id;
                draw.add(featureToUpdate)
                draw.changeMode('simple_select', { featureIds: [featureToUpdate.id] })


                commit('UPDATE_SELECTED_FEATURE', featureToUpdate, { root: true })

                draw.setFeatureProperty(featureToUpdate.id, 'name', attributeForm.name)
                    .setFeatureProperty(featureToUpdate.id, 'firstyear', attributeForm.firstyear)
                    .setFeatureProperty(featureToUpdate.id, 'lastyear', attributeForm.lastyear)
                    .setFeatureProperty(featureToUpdate.id, 'type', attributeForm.type)
                    .setFeatureProperty(featureToUpdate.id, 'tags', attributeForm.tags)
                    .setFeatureProperty(featureToUpdate.id, 'approved', 'false');

                if (isAttributeFormValid) {
                    commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true })
                    commit('UPDATE_EDITION_STATUS', false, { root: true })
                    commit('CLEAR_ATTRIBUTE_FORM', null, { root: true })
                }
                break;
            case 'draw.update':
                draw.setFeatureProperty(featureToUpdate.id, 'name', attributeForm.name)
                    .setFeatureProperty(featureToUpdate.id, 'firstyear', attributeForm.firstyear)
                    .setFeatureProperty(featureToUpdate.id, 'lastyear', attributeForm.lastyear)
                    .setFeatureProperty(featureToUpdate.id, 'type', attributeForm.type)
                    .setFeatureProperty(featureToUpdate.id, 'tags', attributeForm.tags)
                    .setFeatureProperty(featureToUpdate.id, 'approved', 'false');

                break;
            case 'draw.delete':
                commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true })
                commit('UPDATE_EDITION_STATUS', false, { root: true })
                commit('CLEAR_ATTRIBUTE_FORM', null, { root: true })
                commit('UPDATE_SELECTED_FEATURE', null, { root: true })
            default:
                break;
        }


        commit('PUSH_CHANGE', { ...changeAction, layer: currentLayer })
    },
    undoChange({ commit, state, rootState }) {
        commit('POP_CHANGE')
        const { pendingUndoChange, changes } = state

        if (!pendingUndoChange) return

        const draw = rootState.draw

        switch (pendingUndoChange.type) {
            case 'draw.step':

                let geometry = []

                if (pendingUndoChange.features[0].type === 'Polygon') {
                    geometry = {

                        type: pendingUndoChange.features[0].type,
                        coordinates: [changes.slice().reverse().map((change) => {
                            if (change.type === 'draw.step') {
                                return change.features[0].coordinates
                            }

                        })]
                    }

                    geometry.coordinates[0].push(geometry.coordinates[0][0]) // closes the LinearRing

                } else if (pendingUndoChange.features[0].type === 'LineString') {
                    geometry = {
                        type: 'LineString',
                        coordinates: changes.slice().reverse().map((change) => {
                            if (change.type === 'draw.step') {
                                return change.features[0].coordinates
                            }

                        })
                    }
                }

                const feature = {
                    id: pendingUndoChange.features[0].id,
                    type: "Feature",
                    properties: {
                        'approved': 'false',
                        'firstyear': rootState.attributeForm.firstyear,
                        'lastyear': rootState.attributeForm.lastyear,
                        'type': rootState.attributeForm.type,
                        'tags': rootState.attributeForm.tags
                    },
                    geometry: geometry
                }

                draw.changeMode('simple_select', { featureIds: [pendingUndoChange.features[0].id] })
                commit('UPDATE_SELECTED_FEATURE', feature, { root: true })
                commit('UPDATE_EDITION_STATUS', true, { root: true })

                draw.delete(pendingUndoChange.features[0].id)
                try {
                    draw.add(feature)
                    draw.changeMode('simple_select', { featureIds: [pendingUndoChange.features[0].id] })
                    commit('UPDATE_SELECTED_FEATURE', feature, { root: true })
                    commit('UPDATE_EDITION_STATUS', true, { root: true })

                } catch (error) {
                    //if a feature is not created, the behavior is the same as a deletion
                    commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true })
                    commit('UPDATE_EDITION_STATUS', false, { root: true })
                    commit('CLEAR_ATTRIBUTE_FORM', null, { root: true })
                    commit('UPDATE_SELECTED_FEATURE', null, { root: true })
                }

                break
            case 'draw.create':
                // draw.delete(pendingUndoChange.features[0].id)
                break;
            case 'draw.update':
                //search the change stack from top to bottom
                for (let i = changes.length - 1; i >= 0; i--) {
                    if (changes[i].features[0].id === pendingUndoChange.features[0].id) {
                        draw.delete(pendingUndoChange.features[0].id)
                        draw.add(pendingUndoChange.features[0])
                        break
                    }
                }

                break;
            default:
                break;
        }

        commit('CLEAR_PENDING_CHANGE')
    }
}