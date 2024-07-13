<script setup>

import {get} from "@/net";
import {ref} from "vue";
import router from "@/router";
import {useStore} from "@/store";
import {Expand, Fold, Memo, User} from "@element-plus/icons-vue";

const store = useStore()
const loading = ref(true)

const isCollapse = ref(true)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};

</script>


<template>
  <el-container style="height: 100%">
    <el-header class="main-container-header">
      <div class="toggle-icon" @click="toggleCollapse">
        <el-icon v-if="isCollapse" size="20px">
          <Expand />
        </el-icon>
        <el-icon v-else size="20px">
          <Fold />
        </el-icon>
      </div>
      <el-text tag="b" style="margin-left: 15px; font-size: x-large">问卷易</el-text>
      <div style="flex: 1" class="user-info">
        <el-avatar :src="store.avatarUrl"></el-avatar>
      </div>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ? '64px' : '230px'" class="sidebar">
        <el-menu
          style="height: 100%"
          router
          :default-active="$route.path"
          :collapse="isCollapse"
        >
          <el-menu-item index="/admin/adminQuestionnaire">
            <el-icon>
              <Memo />
            </el-icon>
            <template #title>
              <span v-show="!isCollapse">问卷管理</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/admin/adminUser">
            <el-icon>
              <User />
            </el-icon>
            <template #title>
              <span v-show="!isCollapse">企业管理</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main style="padding: 0">
        <el-scrollbar style="height: calc(100vh - 55px)">
          <router-view v-slot="{ Component }">
            <component :is="Component" style="height: 100%" />
          </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
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
  transition: width 0.3s ease-in-out;

  .logoutButton {
    position: absolute;
    bottom: 20px;
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
.fade-leave-to {
  opacity: 0;
}

.sidebar-container {
  display: flex;
  align-items: center;
}

.toggle-icon {
  cursor: pointer;
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.el-menu-item .el-icon {
  display: inline-block;
  width: 24px;
  text-align: center;
}

.el-menu-item .el-icon + span {
  margin-left: 10px;
}

</style>