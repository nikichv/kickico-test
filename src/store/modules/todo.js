/* eslint-disable no-shadow, no-param-reassign */
import Vue from 'vue';

const state = {
  fromCache: false,
  items: {},
  lists: [[], []],
};

export const SET_ITEMS = 'SET_ITEMS';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const SET_LIST = 'SET_LIST';
export const SET_CACHE_FLAG = 'SET_CACHE_FLAG';

const getters = {};

const actions = {
  setItems({ commit }, data) {
    commit(SET_ITEMS, data);
  },
  updateItem({ commit }, { id, properties }) {
    commit(UPDATE_ITEM, { id, properties: { timestamp: Date.now(), ...properties } });
  },
  setList({ commit }, { index, items }) {
    commit(SET_LIST, { index, items });
  },
  setCacheFlag({ commit }, flag) {
    commit(SET_CACHE_FLAG, flag);
  },
};

const mutations = {
  [SET_ITEMS](state, data) {
    Vue.set(state, 'items', data);
  },
  [UPDATE_ITEM](state, { id, properties }) {
    Vue.set(state.items, id, Object.assign(
      state.items[id],
      properties,
    ));
  },
  [SET_LIST](state, { index, items }) {
    Vue.set(state.lists, index, items);
  },
  [SET_CACHE_FLAG](state, flag) {
    state.fromCache = flag;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
