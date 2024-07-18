<script setup>
import {defineProps, defineEmits, ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {Edit, Share, Download, Bell, Delete} from '@element-plus/icons-vue'
import axios from "axios";
import {accessHeader} from "@/net/index.js";

const props = defineProps({
  questionnaire: {
    type: Object,
    required: true
  }
})

const percentage = ref(0)

const emits = defineEmits(['edit', 'share', 'download', 'delete', 'remind'])

const handleEdit = () => {
  emits('edit', props.questionnaire)
}

const handleShare = () => {
  emits('share', props.questionnaire)
}

const handleDownload = () => {
  emits('download', props.questionnaire)
}

const handleDelete = () => {
  emits('delete', props.questionnaire)
}

const handleRemind = () => {
  emits('remind', props.questionnaire)
}

const getProgress = async () => {
  try {
    const response = await axios.get('/api/publish/getHaveCompleted', {
      headers: {
        ...accessHeader()
      },
      params: {
        surveyId: props.questionnaire.id
      }
    })
    // console.log('填写进度返回: ', response)
    percentage.value = response.data.data * 100
  } catch (error) {
    console.error('获取填写进度失败: ', error)
  }
}

onMounted(() => {
  getProgress()
})
</script>

<template>
  <el-card style="width: 100%; margin-top: 20px; padding: 5px 10px 10px 10px;">
    <template #header>
      <div class="card-header">
        <div class="head-left">
          <el-text style="font-size: larger">{{ questionnaire.title }}</el-text>
        </div>
        <div class="head-right">
          <div class="time">
            <span style="margin-bottom: 2px;">创建时间: {{ questionnaire.startTime }}</span>
            <span>截止时间: {{ questionnaire.endTime }}</span>
          </div>
        </div>
      </div>
      <div class="head-progress">
        <el-text type="info" size="large">填写进度</el-text>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" class="progress-bar"/>
      </div>

    </template>
    <div class="card-main">
      <div class="main-left">
        <div style="margin-right: 5px">
          <el-button class="custom-button" key="编辑" plain text @click="handleEdit">
            <el-icon>
              <Edit/>
            </el-icon>
            编辑问卷
          </el-button>
        </div>
        <div style="margin-right: 5px">
          <el-button class="custom-button" key="转发" plain text @click="handleShare">
            <el-icon>
              <Share/>
            </el-icon>
            转发问卷
          </el-button>
        </div>
        <div style="margin-right: 5px">
          <el-button class="custom-button" key="分析" plain text @click="handleDownload">
            <el-icon>
              <Download/>
            </el-icon>
            分析&下载
          </el-button>
        </div>
      </div>
      <div class="main-right">
        <div style="margin-right: 5px">
          <el-button class="custom-button" key="删除" type="danger" text @click="handleDelete">
            <el-icon>
              <Delete/>
            </el-icon>
            删除
          </el-button>
        </div>
        <div style="margin-right: 5px">
          <el-button class="custom-button" key="提醒" type="primary" text @click="handleRemind">
            <el-icon>
              <Bell/>
            </el-icon>
            提醒
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.custom-button {
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  margin-right: 10px;
}

.custom-button:hover {
  color: #409eff;
  background-color: transparent; /* 防止默认的背景变化 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .head-left {
    display: flex;
    align-items: center;

    .el-text {
      margin-right: 10px;
    }
  }

  .head-right {
    display: flex;
    justify-content: center;
    align-items: center;

    .time {
      display: flex;
      flex-direction: column;
      font-size: smaller;
    }
  }

}

.head-progress {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.head-progress .el-text {
  margin-right: 10px;
}

.progress-bar {
  flex-grow: 1;
  margin: 0 20px;
}

.card-main {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .main-left {
    display: flex;
  }

  .main-right {
    display: flex;
  }
}
</style>
