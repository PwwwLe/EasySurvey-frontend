<script setup>

import { get, getImage } from "@/net";
import { ref, reactive } from "vue";
import router from "@/router";
import { useStore } from "@/store";
import { Location, Memo, Setting } from "@element-plus/icons-vue";

const store = useStore()
const loading = ref(true)

const user = reactive({
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
});
// get('/api/account/info', (data) => {
//     //这里使用pinia持久化数据
//     store.user = data
//     loading.value = false;
// })

// function userLogout() {
//     logout(() => router.push('/'))
// }

get("/api/user/userInfo", (data) => {
    //console.log(data)
    getImage(data.user.avatar, (data) => {
        //console.log(data)
        user.avatar = 'data:image/png;base64,' + data.data.data
        //console.log(user.avatar)
    })
});

</script>

<template>
    <el-container style="height: 100%">
        <el-header class="main-container-header">
            <el-text tag="b" style="margin-left: 15px; font-size: x-large">问卷易</el-text>
            <div style="flex: 1" class="user-info">
                <el-avatar :src="user.avatar"></el-avatar>
            </div>
        </el-header>

        <el-container>
            <el-aside width="230px" class="sidebar">
                <el-menu style="height: 100%" router :default-active="$route.path">
                    <el-menu-item index="/user/unfilledQuestionnaire">
                        <template #title>
                            <el-icon>
                                <Memo />
                            </el-icon>
                            未填写的问卷
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/user/completedQuestionnaire">
                        <template #title>
                            <el-icon>
                                <Memo />
                            </el-icon>
                            已填写的问卷
                        </template>
                    </el-menu-item>
                    <el-sub-menu index="1">
                        <template #title>
                            <el-icon>
                                <Setting />
                            </el-icon>
                            <span><b>设置</b></span>
                        </template>
                        <el-menu-item index="/user/basicInfo">
                            <template #title>
                                基本资料
                            </template>
                        </el-menu-item>
                        <!-- <el-menu-item index="/user/user-setting">
                            <template #title>
                                <el-button type="text" @click="userLogout">退出登录</el-button>
                            </template>
                        </el-menu-item> -->
                    </el-sub-menu>

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