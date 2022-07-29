// import { InjectionKey } from 'vue'
// import { Store } from "vuex";

export interface State {
  isLogin: boolean
}

const state: State = {
  isLogin: false,
};

const mutations = {
  SET_LOGIN(state: State, isLogin: boolean) {
    state.isLogin = isLogin;
  },
}

export default {
  state,
  mutations,
}