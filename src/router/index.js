import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            meta: {
                // 页面标题title
                title: '问卷易'
            }
        },
        {
            path: '/user',
            name: 'user',
            redirect: '/user/unfilledQuestionnaire',
            component: () => import('@/views/IndexView.vue'),
            meta: {
                // 页面标题title
                title: '首页-问卷易'
            },
            children: [
                {
                    path: 'completedQuestionnaire',
                    name: 'completedQuestionnaire',
                    meta: {
                        // 页面标题title
                        title: '已填写的问卷-问卷易'
                    },
                    component: () => import('@/views/questionnaire/completedQuestionnaire.vue')
                },
                {
                    path: 'unfilledQuestionnaire',
                    name: 'unfilledQuestionnaire',
                    meta: {
                        // 页面标题title
                        title: '未填写的问卷-问卷易'
                    },
                    component: () => import('@/views/questionnaire/unfilledQuestionnaire.vue'),
                },
                {
                    path: 'basicInfo',
                    name: 'basicInfo',
                    meta: {
                        // 页面标题title
                        title: '基本资料-问卷易'
                    },
                    component: () => import('@/views/settings/basicInfo.vue')
                },
                {
                    path: 'changeBasicInfo',
                    name: 'changeBasicInfo',
                    meta: {
                        // 页面标题title
                        title: '修改基本资料-问卷调查系统'
                    },
                    component: () => import('@/views/settings/changeBasicInfo.vue')
                },
            ]
        },
        {
            path: '/admin',
            name: 'admin',
            redirect: '/admin/adminQuestionnaire',
            component: () => import('@/views/admin/adminIndex.vue'),
            meta: {
                // 页面标题title
                title: '问卷易管理平台'
            },
            children: [
                {
                    path: 'adminQuestionnaire',
                    name: 'adminQuestionnaire',
                    meta: {
                        // 页面标题title
                        title: '问卷管理-问卷易'
                    },
                    component: () => import('@/views/admin/adminQuestionnaire.vue')
                },
                {
                    path: 'adminUser',
                    name: 'adminUser',
                    meta: {
                        // 页面标题title
                        title: '企业管理-问卷易'
                    },
                    component: () => import('@/views/admin/adminUser.vue'),
                },
                {
                    path: 'analyze/:survey_id/:survey_title',
                    name: 'analyze',
                    meta: {
                        // 页面标题title
                        title: '问卷分析-问卷易'
                    },
                    component: () => import('@/views/admin/analyze.vue'),
                }
            ]
        },
        {
            path: "/createQuestionnaire",
            name: "createQuestionnaire",
            component: () => import('@/views/admin/createQuestionnaire.vue')
        },
        {
            path: "/adminSearchQuestionnaire/:searchContent",
            name: "adminSearchQuestionnaire",
            component: () => import('@/views/admin/adminSearchQuestionnaire.vue')
        },
        {
            path:"/editQuestionnaire/:questionnaire",
            name: "editQuestionnaire",
            component: () => import('@/views/admin/editQuestionnaire.vue')
        }
    ]
})

export default router