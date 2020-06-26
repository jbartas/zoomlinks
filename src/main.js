import Vue from 'vue'
import App from './App.vue'

import SwalVue from 'swal-vue'; 
Vue.use(SwalVue);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
