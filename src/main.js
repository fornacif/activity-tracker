import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import mixin from './mixin'
import VueMoment from 'vue-moment'
import vuetify from './plugins/vuetify';
import VueNumeralFilter from 'vue-numeral-filter';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false
Vue.use(VueMoment)
Vue.use(VueNumeralFilter);

let app;
if (!app) {
	app = new Vue({
        router,
        store,
        mixin,
        vuetify,
        render: function (h) { return h(App) }
    }).$mount('#app')
}


