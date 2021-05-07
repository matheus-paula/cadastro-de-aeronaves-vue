import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/popper.min.js';
import 'toastr/build/toastr.min.css'

/* AXIOS */ 
window.axios = axios;
axios.defaults.baseURL = 'http://localhost:8082/';

global.jQuery = require('jquery');
var $ = global.jQuery;
window.$ = $;

const app = createApp(App);
app.$ = $;
app.mount("#app");