import uuidv4 from 'uuid/v4';

export const state = () => ({
    map: null,
    draw: {},
    drawMode: 'simple_select',
    selectedFeature: null,
    attributeForm: {
        name: null,
        firstyear: '',
        lastyear: '',
        type: '',
        tags: '',
        approved: false
    },
    isEditionInProgress: false,
    isAttributeFormValid: false
})

export const mutations = {
    SET_MAP(state, payload) {
        state.map = payload
    },
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
            name: null,
            firstyear: '',
            lastyear: '',
            type: '',
            tags: '',
            approved: false,
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
    setMap({ commit }, map) {
        commit('SET_MAP', map)
    },
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
    updateEditionStatus({ commit }, status) {
        commit('UPDATE_EDITION_STATUS', status)
    },
    enterDrawMode({ commit, state }, drawMode) {
        const { draw } = state

        const feature = {
            'id': uuidv4(),
            'type': 'Feature',
            'properties': {}
        };

        commit('UPDATE_EDITION_STATUS', true)
        commit('UPDATE_SELECTED_FEATURE', feature);
        commit('UPDATE_DRAW_MODE', drawMode);

        switch (drawMode) {
            case 'draw_point':
                draw.changeMode('draw_point');
                break;
            case 'draw_line_string':
                draw.changeMode('draw_line_string');
                break;
            case 'draw_polygon':
                draw.changeMode('draw_polygon');
                break;
            default:
                break;
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
                    firstyear: features[0].properties.firstyear,
                    lastyear: features[0].properties.lastyear,
                    type: features[0].properties.type,
                    tags: features[0].properties.tags,
                    approved: features[0].properties.approved
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
    map(state) {
        return state.map
    },
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