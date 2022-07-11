import Vue from "vue"
import Guide from "./views/guide.vue"

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
  render:h=>h(Guide),
}).$mount("#app")