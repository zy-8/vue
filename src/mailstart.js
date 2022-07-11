import Vue from "vue"
import Mailstart from "./views/mailstart.vue"

Vue.config.productionTip=false

import {
  Toast,
  Loading,
  Dialog
} from "vant"

Vue.use(Toast)
Vue.use(Loading)
Vue.use(Dialog)

import api from "./api/index"
Vue.prototype.$api=api

new Vue({
  render:h=>h(Mailstart),
}).$mount("#app")