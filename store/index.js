
export const state = () => ({
    draw: {},
    drawMode: 'simple_select',
    selectedFeature: null,
    attributeForm: {
        name: '',
        mappedFrom: '',
        mappedTo: '',
        type: '',
        tags: []
    },
    isEditionInProgress: false,
    isAttributeFormValid: false
})

export const mutations = {
    SET_DRAW(state, draw) {
        state.draw = draw
    },
    UPDATE_DRAW_MODE(state, drawMode) {
        state.drawMode = drawMode
    },
    UPDATE_SELECTED_FEATURE(state, feature) {
        state.selectedFeature = feature
    },
    UPDATE_ATTRIBUTE_FORM(state, attributeForm) {
        state.attributeForm = attributeForm
    },
    CLEAR_ATTRIBUTE_FORM(state) {
        state.attributeForm = {
            name: '',
            mappedFrom: '',
            mappedTo: '',
            type: '',
            tags: []
        }
    },
    UPDATE_EDITION_STATUS(state, status) {
        console.log('UPDATE_EDITION_STATUS', status)

        state.isEditionInProgress = status
    },
    UPDATE_ATTRIBUTE_FORM_VALIDITY(state, status) {
        console.log('UPDATE_ATTRIBUTE_FORM_VALIDITY', status)
        state.isAttributeFormValid = status
    }

}

export const actions = {
    setDraw({ commit }, draw) {
        commit('SET_DRAW', draw)
    },
    updateDrawMode({ commit }, drawMode) {
        console.log('UPDATE_DRAW_MODE', drawMode)
        commit('UPDATE_DRAW_MODE', drawMode)

        if (drawMode !== 'simple_select') {
            commit('UPDATE_EDITION_STATUS', true)
        }
    },
    updateAttributeForm({ commit }, attributeForm) {
        commit('UPDATE_ATTRIBUTE_FORM', attributeForm)
        commit('UPDATE_EDITION_STATUS', true)
    },
    updateAttributeFormValidity({ commit }, status) {
        commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', status)
    },
    //this action is commmited by mapbox 
    updateSelectedFeature({ commit, state, dispatch }, features) {
        console.log('UPDATE_SELECTED_FEATURE', features[0])
        console.log('attribute form', state.attributeForm)

        if (!state.isEditionInProgress) {
            if (features[0]) {
                commit('UPDATE_SELECTED_FEATURE', features[0])
                commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', true)
                const attributeForm = {
                    name: features[0].properties.name,
                    mappedFrom: features[0].properties.mappedFrom,
                    mappedTo: features[0].properties.mappedTo,
                    type: features[0].properties.type,
                    tags: features[0].properties.tags
                }
                commit('UPDATE_ATTRIBUTE_FORM', attributeForm)

            } else {
                commit('UPDATE_SELECTED_FEATURE', null)
                commit('CLEAR_ATTRIBUTE_FORM')
                commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false)
            }
        } else if (state.isAttributeFormValid) {
            const changeAction = {
                features: [state.selectedFeature],
                type: "draw.update",
            }
            dispatch('changes/applyChange', changeAction)
            commit('UPDATE_EDITION_STATUS', false)

            if (features[0]) {
                commit('UPDATE_SELECTED_FEATURE', features[0])

            } else {
                commit('UPDATE_SELECTED_FEATURE', null)
                commit('CLEAR_ATTRIBUTE_FORM')
                commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false)
            }
        } else {
            if (state.drawMode !== 'direct_select') {
                state.draw.changeMode('simple_select', { featureIds: [state.selectedFeature.id] })
            }
        }

    }
}

export const getters = {
    draw(state) {
        return state.draw
    },
    drawMode(state) {
        return state.drawMode
    },
    selectedFeature(state) {
        return state.selectedFeature
    },
    attributeForm(state) {
        return state.attributeForm
    },
    isEditionInProgress(state) {
        return state.isEditionInProgress
    },
    isAttributeFormValid(state) {
        return state.isAttributeFormValid
    }
}