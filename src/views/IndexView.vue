<script setup>

import { logout, get } from "@/net";
import { ref } from "vue";
import router from "@/router";
import { useStore } from "@/store";
import { Location, Memo, Setting } from "@element-plus/icons-vue";

const store = useStore()
const loading = ref(true)

// get('/api/account/info', (data) => {
//     //这里使用pinia持久化数据
//     store.user = data
//     loading.value = false;
// })

// function userLogout() {
//     logout(() => router.push('/'))
// }

</script>

<template>
    <el-container style="height: 100%">
        <el-header class="main-container-header">
            <el-text tag="b" style="margin-left: 15px; font-size: x-large">问卷调查系统</el-text>
            <div style="flex: 1" class="user-info">
                <div class="profile">
                    <div>{{ store.user.name }}<el-tag>{{ store.user.role }}</el-tag></div>
                    <div>{{ store.user.email }}</div>
                </div>
                <el-avatar :src="store.avatarUrl"></el-avatar>
            </div>
        </el-header>

        <el-container>
            <el-aside width="230px" class="sidebar">
                <el-menu style="height: 100%" router :default-active="$route.path">
                    <template #title>
                        <el-icon>
                            <Memo />
                        </el-icon>
                        <span><b>调查问卷</b></span>
                    </template>
                    <el-menu-item index="/index/unfilledQuestionnaire">
                        <template #title>
                            未填写的问卷
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/index/completedQuestionnaire">
                        <template #title>
                            已填写的问卷
                        </template>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-main style="padding: 0">
                <el-scrollbar style="height: calc(100vh - 55px)">
                    <router-view v-slot="{ Component }">
                        <transition name="el-fade-in-linear" mode="out-in">
                            <component :is="Component" style="height: 100%" />
                        </transition>
                    </router-view>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<style lang="less" scoped>
.main-container {
    height: 100vh;
    width: 100vw;
}

.main-container-header {
    border-bottom: solid 1px var(--el-border-color);
    height: 55px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .logo {
        height: 32px;
        align-items: center;
    }

    .user-info {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .profile {
            text-align: right;
            margin-right: 20px;

            :first-child {
                font-size: 18px;
                font-weight: bold;
                line-height: 20px;
            }

            :last-child {
                font-size: 10px;
                color: gray;
            }
        }
    }
}

.sidebar {
    position: relative;
    overflow-y: hidden;
    /* 隐藏垂直滚动条 */

    .logoutButton {
        position: absolute;
        bottom: 20px;
        /* 调整按钮距离底部的位置 */
        left: 0;
        width: 100%;
        padding: 20px;
    }
}
</style>