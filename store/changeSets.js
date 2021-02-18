import { changeSetsService } from '~/store/services/ChangeSetsService';

import { Message } from 'element-ui';

export const state = {
  changeSets: [],
  changeSet: {},
  isLoading: false
};

export const actions = {
  async setAllChangeSets({ commit }) {
    commit('LOADING_REQUEST');
    try {
      const changeSets = await changeSetsService.getAllChangeSets();
      commit('GET_CHANGE_SETS_SUCCESS', changeSets);
    } catch (error) {
      commit('GET_CHANGE_SETS_FAILURE');
    }
  },
  async setChangeSetById({ commit }, changeSetId) {
    commit('LOADING_REQUEST');
    try {
      const changeSet = await changeSetsService.getChangeSetById(changeSetId);
      console.log('changeSet', changeSet);
      commit('GET_CHANGE_SET_SUCCESS', changeSet);
    } catch (error) {
      commit('GET_CHANGE_SETS_FAILURE');
    }
  },
  async approveChangeById({ commit }, { changeId, changeSetId }) {
    commit('LOADING_REQUEST');

    try {
      const changeSet = await changeSetService.updateChangeSet(changeSetId, [
        {
          id: changeId,
          approve: true
        }
      ]);
      console.log('changeSet', changeSet);
      commit('GET_CHANGE_SET_SUCCESS', changeSet);
    } catch (error) {
      commit('GET_CHANGE_SETS_FAILURE');
    }
  },
  async closeChangeSet({ commit }, changeSetId) {
    // commit('LOADING_REQUEST');
    try {
      //TODO: closeChangeSet logic, diz respeito ao bulk edit nas mudanças -> changes/Bulkapprove
      Message.success('Change set closed successfully.');
    } catch (error) {}
  },
  async submitNewChangeSet({ commit, dispatch }, changeSet) {
    commit('LOADING_REQUEST');
    try {
      await changeSetsService.createChangeSet(changeSet);
      Message.success('Change set submitted successfully.');

      commit('CREATE_CHANGE_SET_SUCCESS');
    } catch (error) {
      console.log('error', error);
      //TODO: handle error
    }
  }
};

export const mutations = {
  LOADING_REQUEST(state) {
    console.log('LOADING_REQUEST');
    state.isLoading = true;
  },
  GET_CHANGE_SETS_SUCCESS(state, changeSets) {
    state.isLoading = false;
    state.changeSets = changeSets;
  },
  GET_CHANGE_SETS_FAILURE(state) {
    state.isLoading = false;
    state.changeSets = [];
  },
  GET_CHANGE_SET_SUCCESS(state, changeSet) {
    state.isLoading = false;
    state.changeSet = changeSet;
  },
  GET_CHANGE_SET_FAILURE(state) {
    state.isLoading = false;
    state.changeSet = {};
  },
  CREATE_CHANGE_SET_SUCCESS(state) {
    console.log('CREATE_CHANGE_SET_SUCCESS');
    state.isLoading = false;
  },
  CREATE_CHANGE_SET_SUCCESS_FAILURE(state) {
    console.log('CREATE_CHANGE_SET_SUCCESS_FAILURE');
    state.isLoading = false;
  }
};

export const getters = {
  changeSets(state) {
    return state.changeSets;
  },
  changeSet(state) {
    return state.changeSet;
  },
  isLoading(state) {
    return state.isLoading;
  }
};
