import Vue from "vue"
import Feedback from "./views/feedback.vue"

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
  render:h=>h(Feedback),
}).$mount("#app")