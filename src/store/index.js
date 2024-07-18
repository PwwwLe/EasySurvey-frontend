import {defineStore} from "pinia";
import axios from "axios";
import {ElLoading, ElMessage} from "element-plus";
import loadingService from "@/services/loadingService.js";

const authItemName = 'access_token'

export const useStore = defineStore('general', {
    state: () => {
        return {
            user: {
                username: '',
                email: '',
                role: '',
                avatar: null,
                registerTime: null,
                id: ''
            }
        }
    },
    getters: {
        avatarUrl() {
            if (this.user.avatar)
                return `${axios.defaults.baseURL}/api/file/getFile/image/${this.user.avatar}`
            else
                return `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`
        }
    },
    actions: {
        clearUser() {
            this.user = {
                username: '',
                email: '',
                role: '',
                avatar: null,
                registerTime: null,
                id: ''
            }
        },
        async logout(router) {
            loadingService.showLoading('正在登出...')
            localStorage.removeItem(authItemName)
            sessionStorage.removeItem(authItemName)
            this.clearUser()
            ElMessage.success('成功登出！')
            try {
                await router.push('/').then(() => {
                    loadingService.hideLoading()
                    location.reload();
                });
            } catch (error) {
                loadingService.hideLoading()
                console.log('登出失败：', error)
            }
        }
    }
})