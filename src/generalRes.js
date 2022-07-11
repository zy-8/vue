import Vue from "vue"
import GeneralRes from './views/generalRes'

Vue.config.productionTip = false

new Vue({
  render: h => h(GeneralRes),
}).$mount("#app")