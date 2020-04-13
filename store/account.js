import { userService } from '@/assets/lib/UserService';

const user = JSON.parse(localStorage.getItem('user'));

export const state = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null };

export const mutations = {
  LOGIN_REQUEST(state, user) {
    state.status = { loggingIn: true };
    state.user = user;
  },
  LOGIN_SUCCESS(state, user) {
    state.status = { loggedIn: true };
    state.user = user;
  },
  LOGIN_FAILURE(state) {
    state.status = {};
    state.user = null;
  },
  LOGOUT(state) {
    state.status = {};
    state.user = null;
  },
  REGISTER_REQUEST(state, user) {
    state.status = { registering: true };
  },
  REGISTER_SUCCESS(state, user) {
    state.status = {};
  },
  REGISTER_FAILURE(state, error) {
    state.status = {};
  }
};

export const actions = {
  async login({ dispatch, commit }, { username, password }) {
    commit('LOGIN_REQUEST', { username });

    userService.login(username, password);

    try {
      const user = await userService.login(username, password);
      commit('LOGIN_SUCCESS', user);
    } catch (error) {
      commit('LOGIN_FAILURE', error);
      console.log('error.');
    }
  },
  logout({ commit }) {
    userService.logout();
    commit('LOGOUT');
  },
  async register({ dispatch, commit }, user) {
    commit('REGISTER_REQUEST', user);

    try {
      const user = await userService.register(user);
      commit('REGISTER_SUCCESS', user);
      console.log('registration successful');
    } catch (error) {
      commit('REGISTER_FAILURE', error);
      console.log('registration failed');
    }
  }
};

export const getters = {
  user(state) {
    return state.user;
  },
  loggedIn(state) {
    return state.loggedIn;
  },
  loggingIn(state) {
    return state.loggingIn;
  },
  registering(state) {
    return state.registering;
  }
};
