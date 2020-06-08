import Vue from 'vue'
import VueMask from 'v-mask'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import mixin from './mixin'
import VueMoment from 'vue-moment'
import vuetify from './plugins/vuetify';
import VueNumeralFilter from 'vue-numeral-filter';
import * as VueGoogleMaps from 'vue2-google-maps'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false;
Vue.use(VueMoment);
Vue.use(VueNumeralFilter);
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_API_KEY, libraries: 'places', language: 'en',
  }
});
Vue.use(VueMask);

let app;
if (!app) {
	app = new Vue({
        store,
        mixin,
        router,
        vuetify,
        render: function (h) { return h(App) }
    }).$mount('#app')
}


