import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_LOCATION: 'SET_LOCATION',
  SET_ADDRESS: 'SET_ADDRESS'
}

const state = {
  location: "",
  address: ""
}

const getters = {
  location : state => state.location,
  address : state => state.address
}
const mutations = {
  [types.SET_LOCATION](state, location){
    state.location = location ? location : null;
  },
  [types.SET_ADDRESS](state, address){
    state.address = address ? address : '';
  }
}
const actions = {
  setLocation({commit},localtion){
    commit(types.SET_LOCATION,localtion);
  },
  setAddress({commit},address){
    commit(types.SET_ADDRESS,address);
  }
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
