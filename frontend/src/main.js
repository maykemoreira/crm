import axios from './plugins/axios'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import moment from 'moment'

moment.locale('pt-BR')

Vue.prototype.$moment = moment
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
