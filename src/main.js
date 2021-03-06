import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import Vue from 'vue';
import ons from 'onsenui';
import VueOnsen from 'vue-onsenui';
import firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyAYHxfofkeKOnMjr_8HsdzXboJEwHY1RxM",
  authDomain: "project-localmemo.firebaseapp.com",
  databaseURL: "https://project-localmemo.firebaseio.com",
  projectId: "project-localmemo",
  storageBucket: "project-localmemo.appspot.com",
  messagingSenderId: "858066370234",
  appId: "1:858066370234:web:ae2558585f4c6a8e69cc83"
};
firebase.initializeApp(firebaseConfig);

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