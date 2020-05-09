import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import Vue from 'vue';
import ons from 'onsenui';
import VueOnsen from 'vue-onsenui';
import store from './store'

import App from './App.vue'

if (ons.platform.isIPhoneX()) {
  document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
  document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

ons.ready(function () {
  ons.disableDeviceBackButtonHandler();
});

Vue.use(VueOnsen);

import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')