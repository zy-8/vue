import Vue from "vue"
import Maildetail from "./views/maildetail.vue"

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
  render:h=>h(Maildetail),
}).$mount("#app")