import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
/**
 * axios
 * pinia
 * sass
 * vue-router
 * naive-ui
 * wangeditor
 */
import naive from 'naive-ui'
import axios from 'axios'
import { createPinia } from 'pinia'
import { createDiscreteApi } from 'naive-ui'
import Store from './store'
axios.defaults.baseURL = 'http://localhost:5500'

const {message,notification,dialog} = createDiscreteApi(['message','dialog','notification'])


const app = createApp(App)
app.use(naive)
app.use(createPinia())
app.use(router)
app.provide('axios', axios)
app.provide('message', message)
app.provide('notification', notification)
app.provide('dialog', dialog)
app.provide('server_URL', axios.defaults.baseURL)
const store = Store()
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前添加 token 到 request->headers
    config.headers.token = store.token;
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });




app.mount('#app')