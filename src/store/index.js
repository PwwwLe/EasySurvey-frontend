import {defineStore} from "pinia";
import axios from "axios";
import {ElMessage} from "element-plus";

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
            localStorage.removeItem(authItemName)
            sessionStorage.removeItem(authItemName)
            this.clearUser()
            ElMessage.success('成功登出！')
            try {
                await router.push('/').then(() => {
                    location.reload();
                });
            } catch (error) {
                console.log('路由跳转失败：', error)
            }
        }
    }
})