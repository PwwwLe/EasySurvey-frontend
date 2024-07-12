<script setup>
import { reactive } from "vue";
import { get, getImage } from "@/net";
import router from "@/router";
import { ElAvatar, ElCard, ElRow, ElCol, ElTag } from 'element-plus';

// 基本个人信息
const user = reactive({
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    name: '张三',
    email: '未编写',
    company: '未编写',
    president: '未编写',
    industry: [],
    businessScope: '未编写'
});

// 方法：将 industry 数组转换为行业名称数组，最多取前5个
function getIndustryNames(industryArray) {
    if (!Array.isArray(industryArray) || industryArray.length === 0) {
        return []; // 如果 industryArray 不是数组或为空，返回空数组
    }
    return industryArray.slice(0, 5).map(item => item.name || '未知行业');
}

// 获取用户基本信息
get('/api/user/userInfo', data => {
    user.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
    user.name = data.user.name || '未编写';
    user.president = data.user.president || '未编写';
    user.email = data.user.email || '未编写';
    user.businessScope = data.user.businessScope || '未编写';
    user.industry = getIndustryNames(data.industry); // 处理 industry 字段
    getImage(data.user.avatar, (data) => {
        //console.log(data)
        if (data.data.data != null)
            user.avatar = 'data:image/png;base64,' + data.data.data
    })
});

function getBasicInfo() {
    get("/api/user/userInfo", (data) => {
        getImage(data.user.avatar, (data) => {
            console.log(data)
            user.avatar = 'data:image/png;base64,' + data.data.data
            console.log(user.avatar)
        })
    });
}

function ToChangeBasicInfo() {
    router.push('/user/changeBasicInfo')
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
                <el-col :span="8">企业名:</el-col>
                <el-col :span="16">{{ user.name }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="8">代表人:</el-col>
                <el-col :span="16">{{ user.president }}</el-col>
            </el-row>
            <el-row class="user-info-row">
                <el-col :span="8">所属行业:</el-col>
                <el-col :span="16">
                    <el-tag v-for="(industry, index) in user.industry" :key="index" type="info">{{ industry }}</el-tag>
                </el-col>
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
                    <el-button type="primary" @click="ToChangeBasicInfo">修改信息</el-button>
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
    margin-bottom: 20px;
}

.el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>
