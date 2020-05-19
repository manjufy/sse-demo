import events from "../../../api/events";

// initial state
const state = () => ({
  all: []
});

// getters
const getters = {};

// actions
const actions = {
  async getAll({ commit }) {
    const all = await events.getAll();
    commit("setEvents", all);
  }
};

// mutations
const mutations = {
  setEvents(state, events) {
    state.all = events;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
