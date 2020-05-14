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

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js');
		if (navigator.standalone) {
			window.console.log('Запущено с помощью iPhone');
		} else if  (matchMedia('(display-mode: standalone)').matches) {
			window.console.log('Запущено с помощью Android');
		} else {
			window.console.log('Запущено с помощью Браузера');
		}
	});
}


window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	store.commit('SET_INSTALL_PROMPT', e);
})

window.addEventListener('appinstalled', () => {
	store.commit('SET_CAN_INSTALL', false);
})
