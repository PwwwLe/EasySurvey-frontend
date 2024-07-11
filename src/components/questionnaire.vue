<script setup>
import { defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { Edit, Share, Download, Bell, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  questionnaire: {
    type: Object,
    required: true
  }
})

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
</script>

<template>
  <el-card style="width: 100%;margin-top: 20px;padding: 5px 10px 10px 10px;">
    <template #header>
      <div class="card-header">
        <div class="head-left"><span>{{ questionnaire.title }}</span></div>
        <div class="head-right">
          <span>答卷:{{ questionnaire.responses }} &ensp;&ensp;&ensp;</span>
          <span>{{ questionnaire.date }}</span>
        </div>
      </div>
    </template>
    <div class="card-main">
      <div class="main-left">
        <div style="margin-right: 5px">
          <el-button key="编辑" type="plain" text @click="handleEdit">
            <el-icon>
              <Edit />
            </el-icon> 编辑问卷
          </el-button>
        </div>
        <div style="margin-right: 5px">
          <el-button key="转发" type="plain" text @click="handleShare">
            <el-icon>
              <Share />
            </el-icon> 转发问卷
          </el-button>
        </div>
        <div style="margin-right: 5px">
          <el-button key="分析" type="plain" text @click="handleDownload">
            <el-icon>
              <Download />
            </el-icon> 分析&下载
          </el-button>
        </div>
      </div>
      <div class="main-right">
        <div style="margin-right: 5px">
          <el-button key="删除" type="plain" text @click="handleDelete">
            <el-icon>
              <Delete />
            </el-icon> 删除
          </el-button>
        </div>
        <div style="margin-right: 5px">
          <el-button key="提醒" type="plain" text @click="handleRemind">
            <el-icon>
              <Bell />
            </el-icon> 提醒
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
