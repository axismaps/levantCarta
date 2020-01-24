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
    isAttributeFormValid: false,
    isMultiselect: false,
    multiselectedFeatures: [],
    isSnapActive: false,
})

export const mutations = {
    SET_MAP(state, payload) {
        state.map = payload
    },
    SET_DRAW(state, draw) {
        state.draw = draw
    },
    UPDATE_DRAW_MODE(state, drawMode) {
        console.log('UPDATE_DRAW_MODE', drawMode)

        state.drawMode = drawMode
    },
    UPDATE_SELECTED_FEATURE(state, feature) {
        console.log('UPDATE_SELECTED_FEATURE', feature)

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
    },
    UPDATE_MULTISELECT_STATUS(state, status) {
        console.log('UPDATE_MULTISELECT_STATUS', status)
        state.isMultiselect = status
    },
    UPDATE_MULTISELECT_FEATURES(state, features) {
        console.log('UPDATE_MULTISELECT_FEATURES', features)
        state.multiselectedFeatures = features
    },
    UPDATE_SNAP_STATUS(state, status) {
        console.log('UPDATE_SNAP_STATUS', status)
        state.isSnapActive = status
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
    updateSnapStatus({ commit }, status) {
        commit('UPDATE_SNAP_STATUS', status);
    },
    /** 
     * TODO: This can be refactor to a more genercit function, one that just create a new feature 
     */
    cloneFeature({ commit, dispatch }, feature) {

        const newFeature = { ...feature, 'id': uuidv4() }

        commit('UPDATE_SELECTED_FEATURE', newFeature);
        commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', true)

        const changeAction = {
            features: [newFeature],
            type: "draw.create",
            action: "feature.clone"
        }

        dispatch('changes/applyChange', changeAction)

    },

    /** 
     * TODO: This can be refactor to a more generic function, one that just start a new drawing
     */
    addGeometryToFeature({ state }) {
        const { draw, selectedFeature: { geometry: { type } } } = state

        switch (type) {
            case "Polygon", "MultiPolygon":
                draw.changeMode('draw_polygon');
                break;
            case "LineString", "MultiLineString":
                draw.changeMode('draw_line_string')
                break;
            case "Point", "MultiPoint":
                draw.changeMode('draw_point')
            default:
                break;
        }
    },
    splitMultifeature({ state, commit }) {
        commit('UPDATE_DRAW_MODE', 'split_multipart_feature')
        const { draw } = state;
        draw.uncombineFeatures()

    },
    updateAttributeForm({ commit }, attributeForm) {
        commit('UPDATE_ATTRIBUTE_FORM', attributeForm)
        commit('UPDATE_EDITION_STATUS', true)
    },
    updateAttributeFormValidity({ commit }, status) {
        commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', status)
    },
    updateSelectedFeature({ commit, state, dispatch }, features) {
        if (features.length > 1) {
            commit('UPDATE_MULTISELECT_STATUS', true)
            commit('UPDATE_MULTISELECT_FEATURES', features)
            commit('UPDATE_SELECTED_FEATURE', features[0])

        } else if (!state.isEditionInProgress) {

            commit('UPDATE_MULTISELECT_STATUS', false)
            commit('UPDATE_MULTISELECT_FEATURES', [])

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
                action: "properties.update"
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
    },
    isMultiselect(state) {
        return state.isMultiselect
    },
    multiselectedFeatures(state) {
        return state.multiselectedFeatures
    },
    isSnapActive(state) {
        return state.isSnapActive
    }
}
