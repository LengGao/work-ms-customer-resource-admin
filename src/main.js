import Vue from 'vue';

import 'default-passive-events'

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon
import '@/permission'; // permission control

import filters from '@/filters';
Object.keys(filters).forEach(function(key) {
	Vue.filter(key, filters[key]);
});
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock';
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
	mockXHR();
}

// set ElementUI lang to EN
Vue.use(ElementUI, {
	locale
});

Vue.config.productionTip = false;
// Vue.prototype.$dowmAdress = 'http://192.168.4.99:8091/customer-resources/resources/export-list'

new Vue({
	el: '#app',
	router,
	store,
	render: (h) => h(App)
});
