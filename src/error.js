import Vue from "vue"
import Errorview from "./views/error.vue"

Vue.config.productionTip=false

import {
  Toast,
  Loading,
  Dialog,
} from "vant"

Vue.use(Toast)
Vue.use(Loading)
Vue.use(Dialog)

import api from "./api/index"
Vue.prototype.$api=api

new Vue({
  render:h=>h(Errorview),
}).$mount("#app")