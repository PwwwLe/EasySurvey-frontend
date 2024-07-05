import { createRouter, createWebHistory } from "vue-router";
import { unauthorized } from "@/net";
import { useStore } from "@/store";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            meta: {
                // 页面标题title
                title: '问卷调查系统'
            }
        },
        {
            path: '/index',
            name: 'index',
            //redirect: '/index/questionnaire-filling',
            component: () => import('@/views/IndexView.vue'),
            meta: {
                // 页面标题title
                title: '首页-问卷调查系统'
            }
        }
    ]
})

export default router