import { changeService } from '@/assets/lib/ChangeService';

import { Message } from 'element-ui';

export const state = {
  changes: [],
  unsubmittedChanges: [],
  change: {},
  isLoading: false
};
// TODO:
/** Adicionar lógica para lidar com o changeSet. vai funcionar da seguinte maneira:
 * o usuário vai fazer uma mudança, editar algo, o app vai criar uma mudança
 * num estado de approvedStatus: false, então o app vai ter que verificar essas
 * mudanças para o usuário logado e vai dizer que tem mudanças ainda fora do changeSet...
 * bem na verdade essas mudanças tem que estar sem change set... tem que ter uma flag
 * dizendo que elas não fazem parte de um changeSet.
 *
 * ChangeSet:
 * changeSets são simples, basta o aplicativo verificar mudanças ainda nao comitadas...
 *
 * Mapinha: ainda falta.. nao esquecer..
 *
 * Statemachine:
 * Ela ainda nao está funcionando corretamente. Tem algum problema com a seleção. isso tem que ser
 * corrigido até quinta feira
 *
 */

// UNDO:
// -simplificar o undo, no sentido de apenas salvar a ultima mudança, foda-se...
// -o undo pode ser integrado ao revertChange? ponderar... oq é o undo dentro da lógica do revertChange?

export const actions = {
  async setChangeById({ commit }, changeId) {
    commit('LOADING_REQUEST');
    try {
      const change = await changeService.getChangeById(changeId);
      commit('GET_CHANGE_SUCCESS', change);
    } catch (error) {
      commit('GET_CHANGE_FAILURE');
    }
  },
  async setUnsubmittedChanges({ commit }) {
    commit('LOADING_REQUEST');
    try {
      const changes = await changeService.getUnsubmittedChanges();
      commit('GET_UNSUBMITTED_CHANGES_SUCCESS', changes);
    } catch (error) {
      // TODO: handle error
    }
  },
  async clearUnsubmittedChanges({ commit }) {
    commit('CLEAR_UNSUBMITTED_CHANGES');
  },
  async approveChange({ commit, state }, changeId) {
    commit('LOADING_REQUEST');
    try {
      let changes = localStorage.getItem('changes');
      changes = JSON.parse(changes);

      console.log('approve', changeId);
      console.log('changes', changes);

      let change = changes.filter(change => change.id === changeId)[0];

      console.log('change buscada', change);
      change = {
        ...change,
        approvedStatus: true
      };
      console.log('change aprovada', change);
      await changeService.patchChange(change);

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

      Message.success('Change reverted successfully.');
      commit('LOADING_SUCCESS');
    } catch (error) {
      Message.error('Change could not be reverted. An error occurred.');
    }
  },
  async bulkApproveChanges({ commit }, changes) {
    try {
      Message.success('Selected changes approved successfully.');
    } catch (error) {
      //TODO: handle error
    }
  },
  async bulkRevertChanges({ commit }, changes) {
    try {
      Message.success('Selected changes reverted successfully.');
    } catch (error) {
      //TODO: handle error
    }
  },
  async createFeature({ commit, dispatch }, feature) {
    commit('LOADING_REQUEST');

    try {
      const change = {
        editType: 'create',
        approvedStatus: false,
        originalFeature: null,
        newFeature: feature
      };

      await changeService.createChange(change);
      await dispatch('setUnsubmittedChanges');
      commit('CREATE_CHANGE_SUCCESS');
    } catch (error) {
      //TODO: handle error
    }
  },

  async deleteFeature({ commit, dispatch }, feature) {
    commit('LOADING_REQUEST');

    try {
      const originalFeature = await dispatch(
        'features/getFeatureById',
        feature.id,
        {
          root: true
        }
      );

      const change = {
        editType: 'delete',
        approvedStatus: false,
        originalFeature: originalFeature, //TODO: ainda é preciso atualizar essa lógica para requisitar a feature antiga. (feature service... provavelmente)
        newFeature: feature
      };

      await changeService.createChange(change);
      await dispatch('setUnsubmittedChanges');

      commit('CREATE_CHANGE_SUCCESS');
    } catch (error) {
      //TODO: handle error
    }
  },
  async editFeature({ commit, dispatch }, feature) {
    commit('LOADING_REQUEST');

    try {
      const originalFeature = await dispatch(
        'features/getFeatureById',
        feature.id,
        {
          root: true
        }
      );

      console.log('originalFeature', originalFeature);
      const change = {
        editType: 'edit',
        approvedStatus: false,
        originalFeature,
        newFeature: feature
      };

      await changeService.createChange(change);
      await dispatch('setUnsubmittedChanges');

      commit('CREATE_CHANGE_SUCCESS');
    } catch (error) {
      //TODO: handle error
    }
  },
  async undoChange({}) {
    console.log('undoChange');
    //TODO: undo change logic here
  }
};

export const mutations = {
  CLEAR_UNSUBMITTED_CHANGES(state) {
    state.unsubmittedChanges = [];
  },
  LOADING_REQUEST(state) {
    state.isLoading = true;
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
  },
  GET_UNSUBMITTED_CHANGES_SUCCESS(state, changes) {
    console.log('GET_UNSUBMITTED_CHANGES_SUCCESS');
    state.isLoading = false;
    state.unsubmittedChanges = changes;
  }
};

export const getters = {
  change(state) {
    return state.change;
  },
  isLoading(state) {
    return state.isLoading;
  },
  unsubmittedChanges(state) {
    return state.unsubmittedChanges;
  },
  hasUnsubmittedChanges(state) {
    return state.unsubmittedChanges.length > 0;
  }
};
