<script setup>

import { computed, reactive, ref } from "vue";
import { ChatDotSquare, Lock, Message, User } from "@element-plus/icons-vue";
import { login, get, post, Register } from "@/net";
import { ElMessage } from "element-plus";
import router from "@/router";
import { ElAvatar, ElCard, ElRow, ElCol } from 'element-plus';

//基本个人信息

const user = reactive({
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    name: '张三',
    email: 'zhangsan@example.com',
    company: '未编写',
    president: '未编写',
    industry: '未编写',
    businessScope: '未编写'
});


// const basicInfoForm = reactive({
//     username: '',
//     password: '',
//     role: '0',
// })

// const basicInfoRule = {
//     username: [
//         { required: true, message: '请输入用户名' }
//     ],
//     password: [
//         { required: true, message: '请输入密码' }
//     ],
//     role: [
//         { required: true, message: '请输入role' }
//     ]
// }

// const basicInfoFormRef = ref()


function getBasicInfo() {
    get("/user/userInfo", () => { router.push('/index') })
}

</script>

<template>
    basicInfo
    <button type="text" @click="getBasicInfo">拉取用户基本信息</button>


    <el-card class="user-info-card">
        <div class="avatar-container">
            <el-avatar :src="user.avatar" size="large"></el-avatar>
        </div>
        <div class="user-info-container">
            <el-row class="user-info-row">
                <el-col :span="8">姓名:</el-col>
                <el-col :span="16">{{ user.name }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="8">企业名:</el-col>
                <el-col :span="16">{{ user.company }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="8">代表人:</el-col>
                <el-col :span="16">{{ user.president }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="8">所属行业:</el-col>
                <el-col :span="16">{{ user.industry }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="8">公司邮箱:</el-col>
                <el-col :span="16">{{ user.email }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="8">经营范围:</el-col>
                <el-col :span="16">{{ user.businessScope }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="24" style="text-align: center;">
                    <el-button type="primary" @click="() => router.push('/index/changeBasicInfo')">修改信息</el-button>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<style scoped>
.user-info-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.user-info-container {
    text-align: left;
}

.user-info-row {
    margin-bottom: 40px;
}
</style>