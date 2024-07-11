<script setup>

import {reactive} from "vue";
import {ElButton, ElCard, ElCol, ElInput, ElOption, ElRow, ElSelect} from "element-plus";
import router from "@/router";

const editData = reactive({
  avatar: '',
  name: '',
  president: '',
  industry: [],
  email: '',
  businessScope: '',
});

function saveInfo() {
  console.log('Saving edited information:', editData);
}

</script>

<template>
  <!-- 返回按钮 -->
  <el-button type="primary"
             @click="() => router.push('/index/basicInfo')"
             class="back-button">返回
  </el-button>

  <el-card class="edit-info-card">
    <h3 slot="header"
        class="card-title">修改基本资料</h3>
    <el-row class="edit-info-row">
      <el-col :span="8">头像:</el-col>
      <el-col :span="16">
        <el-input v-model="editData.avatar"
                  placeholder="请输入头像URL"></el-input>
      </el-col>
    </el-row>
    <el-row class="edit-info-row">
      <el-col :span="8">企业名:</el-col>
      <el-col :span="16">
        <el-input v-model="editData.name"
                  placeholder="请输入企业名"></el-input>
      </el-col>
    </el-row>
    <el-row class="edit-info-row">
      <el-col :span="8">代表人:</el-col>
      <el-col :span="16">
        <el-input v-model="editData.president"
                  placeholder="请输入代表人"></el-input>
      </el-col>
    </el-row>
    <el-row class="edit-info-row">
      <el-col :span="8">所属行业:</el-col>
      <el-col :span="16">
        <el-select v-model="editData.industry"
                   multiple
                   collapse-tags
                   placeholder="请选择所属行业">
          <el-option label="IT"
                     value="IT"></el-option>
          <el-option label="Finance"
                     value="Finance"></el-option>
          <el-option label="Healthcare"
                     value="Healthcare"></el-option>
          <el-option label="Education"
                     value="Education"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="edit-info-row">
      <el-col :span="8">公司邮箱:</el-col>
      <el-col :span="16">
        <el-input v-model="editData.email"
                  placeholder="请输入公司邮箱"></el-input>
      </el-col>
    </el-row>
    <el-row class="edit-info-row">
      <el-col :span="8">经营范围:</el-col>
      <el-col :span="16">
        <el-input v-model="editData.businessScope"
                  placeholder="请输入经营范围"></el-input>
      </el-col>
    </el-row>
    <el-row class="edit-info-row">
      <el-col :span="24"
              style="text-align: center;">
        <el-button type="primary"
                   @click="saveInfo">保存修改
        </el-button>
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
</style>