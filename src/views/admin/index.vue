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
                    <el-menu-item index="/admin/adminQueastionnaire">
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

<style scoped>

</style>