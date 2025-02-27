<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { accessHeader, takeAccessToken } from "@/net";
import { Search, Plus } from '@element-plus/icons-vue';
import questionnaire from '@/components/questionnaire.vue';
import request from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const route = useRoute();
const searchContentnow = ref('');
const searchQuestionnaires = reactive([]);

const fetchSearchResults = async () => {
  try {
    const searchContent = route.params.searchContent;
    const response = await request.get('/survey/getSurveyByTitle', {
      headers: {
        ...accessHeader(),
      },
      params: {
        title: searchContent,
      },
    });
    console.log(searchContent);
    console.log(response);
    searchQuestionnaires.length = 0;
    searchQuestionnaires.push(...response.data.data.map(item => {
      return {
        ...item,
        startTime: item.startTime ? formatDateTime(item.startTime) : item.startTime,
        endTime: item.endTime ? formatDateTime(item.endTime) : item.endTime,
      };
    }));
  } catch (error) {
    console.error('Error searching questionnaires:', error);
    ElMessage({
      type: 'error',
      message: '搜索问卷时出错，请重试',
    });
  }
};

onMounted(() => {
  fetchSearchResults();
  console.log("参数是："+route.params.searchContent);
});

const formatDateTime = (time) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  };
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(time));
};

const handleEdit = (questionnaire) => {
  console.log('Edit:', questionnaire);
  // todo 编辑问卷逻辑
};

const handleShare = (questionnaire) => {
  console.log('Share:', questionnaire);
  // todo 转发问卷逻辑
};

const handleDownload = (questionnaire) => {
  console.log('Download:', questionnaire);
  // todo 分析&下载问卷逻辑
};

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
    );

    const config = {
      headers: {
        'Authorization': `Bearer ${takeAccessToken()}`,
      },
      params: {
        id: questionnaire.id,
      },
    };

    const response = await request.delete('/survey/deleteSurvey', config);
    console.log(response);
    const index = searchQuestionnaires.findIndex(q => q.id === questionnaire.id);
    if (index !== -1) {
      searchQuestionnaires.splice(index, 1);
    }

    ElMessage({
      type: 'success',
      message: '问卷删除成功!',
    });
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage({
        type: 'error',
        message: '删除问卷时出错，请重试',
      });
    }
  }
};

const handleRemind = (questionnaire) => {
  console.log('Remind:', questionnaire);
  // todo 提醒问卷逻辑
};
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
            v-model="searchContentnow"
            style="max-width: 600px"
            placeholder="请输入问卷标题"
            class="input-with-select"
            @keyup.enter="searchQuestionnaires"
        >
          <template #append>
            <el-button :icon="Search"/>
          </template>
        </el-input>
      </div>
    </div>

    <div class="main" @scroll="handleScroll" ref="scrollContainer">
      <questionnaire
          v-for="item in searchQuestionnaires"
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
.out {
  margin: 0;
  padding: 0;
  width: 100%;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;

    .input-with-select {
      padding-right: 20px;
    }
  }

  .main {
    height: 80vh;
    overflow-y: auto;
  }
}
</style>
