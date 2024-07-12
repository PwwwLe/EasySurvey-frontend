<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus } from '@element-plus/icons-vue'
import questionnaire from '@/components/questionnaire.vue'
import axios from 'axios'

const router = useRouter()
const searchContent = ref('')
const questionnaires = reactive([
{
    id: 1,
    title: 'Customer Satisfaction Survey',
    description: 'A survey to measure customer satisfaction with our services.',
    create_time: '2024-07-12T10:00:00Z',
    update_time: '2024-07-12T10:00:00Z',
    start_time: '2024-07-15T08:00:00Z',
    end_time: '2024-08-15T17:00:00Z',
    status: 1
  },
  {
    id: 2,
    title: 'Employee Feedback Form',
    description: 'A form for collecting feedback from employees about workplace conditions.',
    create_time: '2024-07-10T09:30:00Z',
    update_time: '2024-07-11T09:30:00Z',
    start_time: '2024-07-11T08:00:00Z',
    end_time: '2024-07-31T17:00:00Z',
    status: 0
  },
  {
    id: 3,
    title: 'Product Evaluation Survey',
    description: 'A survey to evaluate the new product launched last month.',
    create_time: '2024-07-05T15:00:00Z',
    update_time: '2024-07-10T12:00:00Z',
    start_time: '2024-07-07T08:00:00Z',
    end_time: '2024-07-25T17:00:00Z',
    status: 1
  }
])

const fetchQuestionnaires = async () => {
  try {
    const response = await axios.get('/api/questionnaires') // 修改为实际接口
    questionnaires.push(...response.data)
  } catch (error) {
    console.error('Error fetching questionnaires:', error)
  }
}

onMounted(() => {
  fetchQuestionnaires()
})

const navigateToCreateQuestionnaire = () => {
  router.push('/createQuestionnaire')
}

const handleEdit = (questionnaire) => {
  console.log('Edit:', questionnaire)
  // 编辑问卷逻辑
}

const handleShare = (questionnaire) => {
  console.log('Share:', questionnaire)
  // 转发问卷逻辑
}

const handleDownload = (questionnaire) => {
  console.log('Download:', questionnaire)
  // 分析&下载问卷逻辑
}

const handleDelete = (questionnaire) => {
  console.log('Delete:', questionnaire)
  // 删除问卷逻辑
}

const handleRemind = (questionnaire) => {
  console.log('Remind:', questionnaire)
  // 提醒问卷逻辑
}
</script>

<template>
  <div class="out">
    <div class="header">
      <div class="header-left">
        <el-button
          type="primary"
          :icon="Plus"
          @click="navigateToCreateQuestionnaire"
          style="margin-left: 15px;"
        >
          创建问卷
        </el-button>
      </div>
      <div>
        <el-input
          v-model="searchContent"
          style="max-width: 600px"
          placeholder="请输入问卷标题进行搜索..."
          class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
    </div>

    <div class="main">
      <questionnaire
        v-for="item in questionnaires"
        :key="item.id"
        :questionnaire="item"
        @edit="handleEdit"
        @share="handleShare"
        @download="handleDownload"
        @delete="handleDelete"
        @remind="handleRemind"
        style="margin-bottom: 10px;"
      ></questionnaire>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.out{
  margin: 0;
  padding: 0;
  // background-color: aqua;
  width: 100%;
  // max-width: 100%;
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: red;
    height: 50px;
    .input-with-select{
      padding-right: 20px;
    }
  }
  
}


</style>