import { changeService } from '@/assets/lib/ChangeService';

import { Message } from 'element-ui';

export const state = {
  changes: [],
  change: {},
  isLoading: false
};

// TODO:
// -salvar a mudança dos desenhos com o model novo, originalFeature e a newFeature
// -simplificar o undo, no sentido de apenas salvar a ultima mudança, foda-se...
// -o undo pode ser integrado ao revert? ponderar...

export const actions = {
  async setChangeById({ commit }, changeId) {
    commit('LOADING_REQUEST');
    try {
      const change = await changeService.getChangeById(changeId);
      console.log('change', change);
      commit('GET_CHANGE_SUCCESS', change);
    } catch (error) {
      commit('GET_CHANGE_FAILURE');
    }
  },
  async approveChange({ commit }, changeId) {
    commit('LOADING_REQUEST');
    try {
      const change = {
        //TODO: approve change logic
        // changeStatus may be more than a flag
        approvedStatus: true
      };
      await changeService.patchChange(change);

      console.log(`Change ${changeId} approved successfully`);
      commit('LOADING_SUCCESS');

      Message.success('Change approved successfully.');
    } catch (error) {
      Message.error('Change could not be approved. An error occurred.');
    }
  },
  async revertChange({ commit }, changeId) {
    commit('LOADING_REQUEST');
    try {
      const change = {
        //TODO: revert change logic,
        // changeStatus may be more than a flag
      };
      await changeService.patchChange(change);

      console.log(`Change ${changeId} reverted successfully`);
      Message.success('Change reverted successfully.');
      commit('LOADING_SUCCESS');
    } catch (error) {
      Message.error('Change could not be reverted. An error occurred.');
    }
  },
  async bulkApproveChanges({ commit }, changes) {
    try {
      console.log(changes);
      Message.success('Selected changes approved successfully.');
    } catch (error) {
      //TODO: handle error
    }
  },
  async bulkRevertChanges({ commit }, changes) {
    try {
      console.log(changes);

      Message.success('Selected changes reverted successfully.');
    } catch (error) {
      //TODO: handle error
    }
  },
  async createFeature({ commit }, feature) {
    commit('LOADING_REQUEST');

    try {
      const change = {
        editType: 'create',
        approvedStatus: false,
        newFeature: feature
      };

      await changeService.createChange(change);
      commit('CREATE_CHANGE_SUCCESS');
    } catch (error) {
      //TODO: handle error
    }
  },

  async deleteFeature({ commit }, feature) {
    commit('LOADING_REQUEST');

    try {
      const change = {
        editType: 'delete',
        approvedStatus: false,
        oldFeature: feature.id, //TODO: ainda é preciso atualizar essa lógica para requisitar a feature antiga. (feature service... provavelmente)
        newFeature: null
      };

      await changeService.createChange(change);
      commit('CREATE_CHANGE_SUCCESS');
    } catch (error) {
      //TODO: handle error
    }
  },
  async editFeature({ commit }, feature) {
    commit('LOADING_REQUEST');

    try {
      const change = {
        editType: 'edit',
        approvedStatus: false,
        oldFeature: feature.id,
        newFeature: feature
      };

      await changeService.createChange(change);
      commit('CREATE_CHANGE_SUCCESS');
    } catch (error) {
      //TODO: handle error
    }
  },
  async undoChange({}) {
    console.log('undoChange');
  }
};

export const mutations = {
  LOADING_REQUEST(state) {
    state.isLoading = true;
    console.log('is loading', state.isLoading);
  },
  LOADING_SUCCESS(state) {
    state.isLoading = false;
  },
  GET_CHANGE_SUCCESS(state, change) {
    state.isLoading = false;
    state.change = change;
  },
  GET_CHANGE_FAILURE(state) {
    state.isLoading = false;
    state.change = {};
  },
  CREATE_CHANGE_SUCCESS(state) {
    console.log('CREATE_CHANGE_SUCCESS');
    state.isLoading = false;
  }
};

export const getters = {
  change(state) {
    return state.change;
  },
  isLoading(state) {
    return state.isLoading;
  }
};
