<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { takeAccessToken } from "@/net";
import { Search, Plus } from '@element-plus/icons-vue'
import questionnaire from '@/components/questionnaire.vue'
import request from '@/utils/request' // 导入封装的 axios 实例，实例导入时不加 {}
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const searchContent = ref('')
const questionnaires = reactive([])
let count = ref(1)
// const hasMoreData = ref(true)

const fetchQuestionnaires = async () => {
  try {
    const queryParams = {
      count: count.value.toString()
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${takeAccessToken()}`
      },
      params: queryParams
    };

    const response = await request.get('/survey/getSeveral', config);

    console.log(response);
      questionnaires.length = 0;
      questionnaires.push(...response.data.data);
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    ElMessage({
      type: 'error',
      message: '获取问卷时出错，请重试'
    });
  }
};

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

const handleDelete = async (questionnaire) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除问卷 "${questionnaire.title}" 吗？`,
      '删除问卷',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const config = {
      headers: {
        'Authorization': `Bearer ${takeAccessToken()}`
      },
      params: {
        id :questionnaire.id,
      }
    };

    const response = await request.delete(`/survey/deleteSurvey`, config) // 修改为实际接口
    console.log(response)
    const index = questionnaires.findIndex(q => q.id === questionnaire.id)
    if (index !== -1) {
      questionnaires.splice(index, 1)
    }

    ElMessage({
      type: 'success',
      message: '问卷删除成功!',
    })
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        type: 'error',
        message: '删除问卷时出错，请重试',
      })
    }
  }
}

const handleRemind = (questionnaire) => {
  console.log('Remind:', questionnaire)
  // 提醒问卷逻辑
}

const handleScroll = async (event) => {
  const { scrollTop, clientHeight, scrollHeight } = event.target

  if (scrollTop + clientHeight >= scrollHeight - 10 ) {
    count.value++
    console.log("count为：" + count.value)
    await fetchQuestionnaires()
  }
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
          placeholder="请输入问卷标题"
          class="input-with-select"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
    </div>

    <div class="main" @scroll="handleScroll" ref="scrollContainer">
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
      <!-- <el-empty v-if="!hasMoreData && questionnaires.length === 0" description="没有更多问卷"></el-empty> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.out{
  margin: 0;
  padding: 0;
  width: 100%;

  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    .input-with-select{
      padding-right: 20px;
    }
  }

  .main{
    height: 80vh;
    overflow-y: auto;
  }
}
</style>
