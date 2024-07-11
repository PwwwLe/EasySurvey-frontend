<script setup>
import { reactive, ref } from "vue";
import { get, patch, post } from "@/net";
import { ElMessage } from "element-plus";
import router from "@/router";
import { ElCard, ElRow, ElCol, ElButton, ElInput, ElSelect, ElOption, ElUpload, ElImage } from 'element-plus';

const id = ref(0)

// 获取用户基本信息并填充表单
const editData = reactive({
    avatar: '',
    president: '',
    industry: [],
    email: '',
    businessScope: '',
});

get('/api/user/userInfo', data => {
    id.value = data.user.id;
    editData.avatar = data.user.avatar || ''; // 填充头像
    editData.president = data.user.president || ''; // 填充代表人
    editData.industry = data.industry.map(item => String(item.id)); // 填充所属行业
    editData.email = data.user.email || ''; // 填充邮箱
    editData.businessScope = data.user.businessScope || ''; // 填充经营范围
});

function saveInfo() {
    console.log('Saving edited information:', editData);
    patch(
        '/api/user/updateBaseInfo',
        { industryIds: editData.industry }, // 将 industry 作为 query 参数传递
        {
            id: id.value,
            president: editData.president,
            email: editData.email,
            businessScope: editData.businessScope
        },
        () => {
            ElMessage.success('基本资料修改成功！');
            router.push('/user/basicInfo'); // 保存成功后返回基本信息页面
        }
    );
}

// 上传头像
function handleAvatarUpload(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file.raw);
    reader.onload = () => {
        const base64Data = reader.result.split(',')[1]; // 获取Base64编码数据
        post('/api/image/upload', { file: base64Data }, {}, () => {
            ElMessage.success('头像上传成功！');
            // 刷新页面或更新用户头像信息
        });
    };
    reader.onerror = () => {
        console.error('文件读取错误');
    };
}
</script>

<template>
    <!-- 返回按钮 -->
    <el-button type="primary" @click="() => router.push('/user/basicInfo')" class="back-button">返回</el-button>

    <el-card class="edit-info-card">
        <h3 slot="header" class="card-title">修改基本资料</h3>
        <el-row class="edit-info-row">
            <el-col :span="8">头像:</el-col>
            <el-col :span="16">
                <el-upload action="" :show-file-list="false" :on-exceed="handleAvatarExceed"
                    :before-upload="handleAvatarUpload">
                    <el-image v-if="editData.avatar" :src="editData.avatar" class="avatar" fit="cover"></el-image>
                    <el-button class="avatar-upload-button" type="primary" icon="el-icon-upload">点击上传头像</el-button>
                </el-upload>
            </el-col>
        </el-row>
        <el-row class="edit-info-row">
            <el-col :span="8">代表人:</el-col>
            <el-col :span="16">
                <el-input v-model="editData.president" placeholder="请输入代表人"></el-input>
            </el-col>
        </el-row>
        <el-row class="edit-info-row">
            <el-col :span="8">所属行业:</el-col>
            <el-col :span="16">
                <el-select v-model="editData.industry" multiple collapse-tags placeholder="请选择所属行业">
                    <el-option label="IT" value="1"></el-option>
                    <el-option label="Finance" value="2"></el-option>
                    <el-option label="Healthcare" value="3"></el-option>
                    <el-option label="Education" value="4"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="edit-info-row">
            <el-col :span="8">公司邮箱:</el-col>
            <el-col :span="16">
                <el-input v-model="editData.email" placeholder="请输入公司邮箱"></el-input>
            </el-col>
        </el-row>
        <el-row class="edit-info-row">
            <el-col :span="8">经营范围:</el-col>
            <el-col :span="16">
                <el-input v-model="editData.businessScope" placeholder="请输入经营范围"></el-input>
            </el-col>
        </el-row>
        <el-row class="edit-info-row">
            <el-col :span="24" style="text-align: center;">
                <el-button type="primary" @click="saveInfo">保存修改</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style scoped>
.edit-info-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.edit-info-row {
    margin-bottom: 15px;
}

.back-button {
    margin-top: 20px;
    /* 调整按钮与顶部的距离 */
    margin-left: 40px;
    /* 调整按钮与左边界的距离 */
}

.card-title {
    text-align: center;
    /* 让标题文字居中显示 */
    margin-bottom: 40px;
    /* 调整标题与内容的间距 */
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.avatar-upload-button {
    margin-top: 10px;
}
</style>
