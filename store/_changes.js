import { changeSetsService } from '@/assets/lib/ChangeSetsService';

import { Message } from 'element-ui';

export const state = {
  changes: [],
  change: {},
  isLoading: false
};

// TODO:
// Transferir a lógica do modulo change para esse novo módulo.
// -salvar a mudança dos desenhos com o model novo, originalFeature e a newFeature
// -simplificar o undo, no sentido de apenas salvar a ultima mudança, foda-se...
// -desvingular toda a lógica de desenho da store, inclusive o undo
// -o undo pode ser integrado ao revert? ponderar...

export const actions = {
  async setChangeById({ commit }, changeId) {
    commit('LOADING_REQUEST');
    try {
      const change = await changeSetsService.getChangeById(changeId);
      console.log('change', change);
      commit('GET_CHANGE_SUCCESS', change);
    } catch (error) {
      commit('GET_CHANGE_FAILURE');
    }
  },
  async approveChange({ commit }, changeId) {
    commit('LOADING_REQUEST');
    try {
      //TODO: approve change logic
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
      //TODO: revert change logic
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
    } catch (error) {}
  },
  async bulkRevertChanges({ commit }, changes) {
    try {
      console.log(changes);

      Message.success('Selected changes reverted successfully.');
    } catch (error) {}
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
