import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

navigator.serviceWorker.register('/service-worker.js');


window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	store.commit('SET_INSTALL_PROMPT', e);
})
