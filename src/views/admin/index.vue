<script setup>

import { get } from "@/net";
import { ref } from "vue";
import router from "@/router";
import { useStore } from "@/store";
import { Location, Memo, Setting } from "@element-plus/icons-vue";

const store = useStore()
const loading = ref(true)
</script>


<template>
    <el-container style="height: 100%">
        <el-header class="main-container-header">
            <el-text tag="b" style="margin-left: 15px; font-size: x-large">问卷易</el-text>
            <div style="flex: 1" class="user-info">
                <!-- <div class="profile">
                    <div>{{ store.user.name }}<el-tag>{{ store.user.role }}</el-tag></div>
                    <div>{{ store.user.email }}</div>
                </div> -->
                <el-avatar :src="store.avatarUrl"></el-avatar>
            </div>
        </el-header>

        <el-container>
            <el-aside width="230px" class="sidebar">
                <el-menu style="height: 100%" router :default-active="$route.path">
                    <el-menu-item index="/admin/adminQuestionnaire">
                        <template #title>
                            <el-icon>
                                <Memo />
                            </el-icon>
                            问卷管理
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/admin/adminUser">
                        <template #title>
                            <el-icon>
                                <Memo />
                            </el-icon>
                            企业管理
                        </template>
                    </el-menu-item>
                </el-menu>
            </el-aside>

            <el-main style="padding: 0">
                <el-scrollbar style="height: calc(100vh - 55px)">
                    <router-view v-slot="{ Component }">
                        <!-- <transition name="fade"> -->
                        <component :is="Component" style="height: 100%" />
                        <!-- </transition> -->
                    </router-view>
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<style lang="less" scoped>
.main-container {
    height: 100%;
    width: 100%;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>