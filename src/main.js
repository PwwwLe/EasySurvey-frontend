import { createApp } from 'vue'
import App from './App.vue'

import router from "@/router";
import axios from "axios";
import "echarts";
import ECharts from 'vue-echarts';
import { createPinia } from "pinia";
import 'element-plus/theme-chalk/dark/css-vars.css'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

//createApp(App).mount('#app')

axios.defaults.baseURL = "http://47.121.187.213:8080"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

app.component('v-chart', ECharts)

app.mount('#app')