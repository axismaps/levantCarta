export const state = () => ({
  changes: [],
  pendingUndoChange: {},
  featureBeingDrawnPoints: [],
  isFeatureSavePending: false
});

export const mutations = {
  PUSH_CHANGE(state, change) {
    console.log('PUSH_CHANGE', change);
    state.changes.push(change);
  },
  POP_CHANGE(state) {
    state.pendingUndoChange = state.changes[state.changes.length - 1];
    state.changes.pop();
  },
  CLEAR_PENDING_CHANGE(state) {
    state.pendingUndoChange = {};
  },
  UPDATE_FEATURE_SAVE_PENDING_STATUS(state, status) {
    state.isFeatureSavePending = status;
  }
};

export const actions = {
  async applyChange({ commit, state, rootState, dispatch }, changeAction) {
    const { draw, selectedFeature } = rootState;
    const currentLayer = rootState.layers.currentItem.id;
    const attributeForm = rootState.attributeForm;
    const isAttributeFormValid = rootState.isAttributeFormValid;
    const changeType = changeAction.type;

    let featureToUpdate = changeAction.features[0];
    featureToUpdate = {
      ...featureToUpdate,
      properties: {
        name: attributeForm.name,
        firstyear: attributeForm.firstyear,
        lastyear: attributeForm.lastyear,
        type: attributeForm.type,
        tags: attributeForm.tags || '',
        approved: attributeForm.approved
      }
    };

    delete changeAction.target; //changeAction.target is a map object instance returned by mapbox-draw, we dont need it so it is been deleted to free memory

    switch (changeType) {
      case 'draw.selectionchange':
        break;
      case 'draw.step':
        featureToUpdate.id = selectedFeature.id;

        featureToUpdate = {
          ...featureToUpdate,
          properties: {
            name: attributeForm.name,
            firstyear: attributeForm.firstyear,
            lastyear: attributeForm.lastyear,
            type: attributeForm.type,
            tags: attributeForm.tags,
            approved: false
          }
        };
        break;
      case 'draw.create':
        draw.delete(featureToUpdate.id);

        if (rootState.featureBeingDrawn !== null) {
          featureToUpdate = rootState.featureBeingDrawn.feature;

          console.log('feature to update: ', featureToUpdate);

          commit('UPDATE_FEATURE_BEING_DRAWN', null, { root: true });
          commit('RESET_GEOMETRY_BEING_DRAWN_POINTS', null, { root: true });
        }

        featureToUpdate.id = selectedFeature.id;

        draw.add(featureToUpdate);
        draw.changeMode('simple_select', { featureIds: [featureToUpdate.id] });

        featureToUpdate.properties.approved = false;

        commit('UPDATE_FEATURE_SAVE_PENDING_STATUS', true);
        commit('UPDATE_SELECTED_FEATURE', featureToUpdate, { root: true });

        draw
          .setFeatureProperty(featureToUpdate.id, 'name', attributeForm.name)
          .setFeatureProperty(
            featureToUpdate.id,
            'firstyear',
            attributeForm.firstyear
          )
          .setFeatureProperty(
            featureToUpdate.id,
            'lastyear',
            attributeForm.lastyear
          )
          .setFeatureProperty(featureToUpdate.id, 'type', attributeForm.type)
          .setFeatureProperty(featureToUpdate.id, 'tags', attributeForm.tags)
          .setFeatureProperty(featureToUpdate.id, 'approved', false);

        if (isAttributeFormValid) {
          await dispatch('features/saveFeature', featureToUpdate, {
            root: true
          });
          commit('UPDATE_FEATURE_SAVE_PENDING_STATUS', false);
          commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true });
          commit('UPDATE_EDITION_STATUS', false, { root: true });
          // commit('CLEAR_ATTRIBUTE_FORM', null, { root: true })
        }
        break;
      case 'draw.update':
        switch (changeAction.action) {
          case 'properties.update':
            draw
              .setFeatureProperty(
                featureToUpdate.id,
                'name',
                attributeForm.name
              )
              .setFeatureProperty(
                featureToUpdate.id,
                'firstyear',
                attributeForm.firstyear
              )
              .setFeatureProperty(
                featureToUpdate.id,
                'lastyear',
                attributeForm.lastyear
              )
              .setFeatureProperty(
                featureToUpdate.id,
                'type',
                attributeForm.type
              )
              .setFeatureProperty(
                featureToUpdate.id,
                'tags',
                attributeForm.tags
              )
              .setFeatureProperty(featureToUpdate.id, 'approved', false);
            featureToUpdate.properties.approved = false;
            break;
          case 'features.merge':
            /** TODO:
             * the features used to generate the new merged feature need to be deleted here,
             */
            console.log('merge feature');
            draw.add(featureToUpdate);
            break;
          default:
            break;
        }

        if (state.isFeatureSavePending) {
          await dispatch('features/saveFeature', featureToUpdate, {
            root: true
          });
          commit('UPDATE_FEATURE_SAVE_PENDING_STATUS', false);
        } else {
          await dispatch('features/updateFeature', featureToUpdate, {
            root: true
          });
        }
        break;
      case 'draw.delete':
        commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true });
        commit('UPDATE_EDITION_STATUS', false, { root: true });
        commit('CLEAR_ATTRIBUTE_FORM', null, { root: true });
        commit('UPDATE_SELECTED_FEATURE', null, { root: true });
      default:
        break;
    }

    changeAction.features[0] = featureToUpdate;
    commit('PUSH_CHANGE', { ...changeAction, layer: currentLayer });
  },
  async undoChange({ commit, state, rootState, dispatch }) {
    commit('POP_CHANGE');
    const { pendingUndoChange, changes } = state;

    if (!pendingUndoChange) {
      console.log('Nothing to undo');
      return;
    }

    const draw = rootState.draw;

    switch (pendingUndoChange.type) {
      case 'draw.step':
        let geometry = [];

        if (pendingUndoChange.features[0].type === 'Polygon') {
          geometry = {
            type: pendingUndoChange.features[0].type,
            coordinates: [
              changes
                .slice()
                .reverse()
                .map(change => {
                  if (change.type === 'draw.step') {
                    return change.features[0].coordinates;
                  }
                })
            ]
          };

          geometry.coordinates[0].push(geometry.coordinates[0][0]); // closes the LinearRing
        } else if (pendingUndoChange.features[0].type === 'LineString') {
          geometry = {
            type: 'LineString',
            coordinates: changes
              .slice()
              .reverse()
              .map(change => {
                if (change.type === 'draw.step') {
                  return change.features[0].coordinates;
                }
              })
          };
        }

        const feature = {
          id: pendingUndoChange.features[0].id,
          type: 'Feature',
          properties: {
            approved: false,
            firstyear: rootState.attributeForm.firstyear,
            lastyear: rootState.attributeForm.lastyear,
            type: rootState.attributeForm.type,
            tags: rootState.attributeForm.tags
          },
          geometry: geometry
        };

        draw.changeMode('simple_select', {
          featureIds: [pendingUndoChange.features[0].id]
        });
        commit('UPDATE_SELECTED_FEATURE', feature, { root: true });
        commit('UPDATE_EDITION_STATUS', true, { root: true });

        draw.delete(pendingUndoChange.features[0].id);
        try {
          draw.add(feature);
          draw.changeMode('simple_select', {
            featureIds: [pendingUndoChange.features[0].id]
          });
          commit('UPDATE_SELECTED_FEATURE', feature, { root: true });
          commit('UPDATE_EDITION_STATUS', true, { root: true });
        } catch (error) {
          //if a feature is not created, the behavior is the same as a deletion
          commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true });
          commit('UPDATE_EDITION_STATUS', false, { root: true });
          commit('CLEAR_ATTRIBUTE_FORM', null, { root: true });
          commit('UPDATE_SELECTED_FEATURE', null, { root: true });
        }

        break;
      case 'draw.create':
        // draw.delete(pendingUndoChange.features[0].id)
        break;
      case 'draw.update':
        //search the change stack from top to bottom
        for (let i = changes.length - 1; i >= 0; i--) {
          if (changes[i].features[0].id === pendingUndoChange.features[0].id) {
            if (pendingUndoChange.action) {
              replaceFeature(
                draw,
                commit,
                dispatch,
                pendingUndoChange.features[0].id,
                changes[i].features[0]
              );
            } else {
              replaceFeature(
                draw,
                commit,
                dispatch,
                pendingUndoChange.features[0].id,
                pendingUndoChange.features[0]
              );
            }
            break;
          }
        }

        break;
      default:
        break;
    }

    commit('CLEAR_PENDING_CHANGE');
  }
};

const replaceFeature = async (
  draw,
  commit,
  dispatch,
  oldFeatureId,
  newFeature
) => {
  draw.delete(oldFeatureId);

  try {
    draw.add(newFeature);
    commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true });
    commit('UPDATE_EDITION_STATUS', false, { root: true });
    commit('CLEAR_ATTRIBUTE_FORM', null, { root: true });
    commit('UPDATE_SELECTED_FEATURE', null, { root: true });

    await dispatch('features/updateFeature', newFeature, { root: true });
  } catch (error) {
    //if a feature is not created, the behavior is the same as a deletion
    commit('UPDATE_ATTRIBUTE_FORM_VALIDITY', false, { root: true });
    commit('UPDATE_EDITION_STATUS', false, { root: true });
    commit('CLEAR_ATTRIBUTE_FORM', null, { root: true });
    commit('UPDATE_SELECTED_FEATURE', null, { root: true });
  }
};
