<script setup>
import {reactive, ref} from "vue";
import {accessHeader, get, patch, post, UploadImage} from "@/net";
import {ElMessage} from "element-plus";
import router from "@/router";
import {ElCard, ElRow, ElCol, ElButton, ElInput, ElSelect, ElOption, ElUpload} from 'element-plus';


import {Plus} from '@element-plus/icons-vue'

const id = ref(0);

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
      {industryIds: editData.industry}, // 将 industry 作为 query 参数传递
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

// 上传头像功能

function getBase64(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(file)
    reader.onload = function () {
      imgResult = reader.result
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.onloadend = function () {
      resolve(imgResult)
    }
  })
}

function getFile(file, fileList) {
  console.log(file)
  if (file.raw.type !== `image/jpeg` && file.raw.type !== `image/png`) {
    ElMessage.error(`头像图片只能是JPG/PNG格式`)
    return false;
  } else if (file.size / 1024 > 100) {
    ElMessage.error(`头像图片大小不能超过100kb`)
    return false;
  }

  getBase64(file.raw).then(res => {
    console.log(res)
    const url = '/api/image/upload'
    const queryParams = {
      file: res
    }
    const data = {}
    UploadImage(url, queryParams, data, () => {
    })
  })
}


function handleUploadRemove(file, fileList) {
  console.log(file)
  // proofImage = ''
  // ruleForm.message_img = ''
}

function handlePictureCardPreview(file) {
  console.log(file)
  // console.log(this.proofImage)
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
        <el-upload list-type="picture" action='' accept=".jpg, .png" :limit="1" :auto-upload="false"
                   :file-list="fileList" :on-change="getFile" :on-preview="handlePictureCardPreview"
                   :on-remove="handleUploadRemove">
          <el-button size="small" type="primary" @click="uploadimg">选择图片上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传一张jpg/png文件</div>
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
          <!-- todo 更改行业信息 -->
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
  margin-left: 40px;
}

.card-title {
  text-align: center;
  margin-bottom: 40px;
}

.avatar-upload-button {
  margin-top: 10px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>