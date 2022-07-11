import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    response: null
  },
  mutations: {
    SET_RESPONSE(state, payload) {
      state.response = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
