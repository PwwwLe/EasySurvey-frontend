<script setup>
import {ref, reactive, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {accessHeader, takeAccessToken} from "@/net";
import {Search, Plus} from '@element-plus/icons-vue'
import questionnaire from '@/components/questionnaire.vue'
import request from '@/utils/request'
import {ElMessage, ElMessageBox} from 'element-plus'
import axios from "axios";

const router = useRouter()
const searchContent = ref('')
const questionnaires = reactive([])
let count = ref(1)

const fetchQuestionnaires = async () => {
  try {
    const response = await request.get('/survey/getSeveral', {
      headers: {
        ...accessHeader()
      },
      params: {
        count: count.value.toString()
      }
    });
    questionnaires.length = 0;
    const data = response.data.data || [];
    for (const item of data) {
      try {
        const isPublishedResponse = await axios.get('/api/publish/isPublished', {
          headers: {
            ...accessHeader()
          },
          params: {
            surveyId: item.id
          }
        })
        item.isPublished = isPublishedResponse.data.data
      }catch (error) {
        console.error('Error fetching isPublished:', error);
      }
    }
    questionnaires.push(...data.map(item => {
      return {
        ...item,
        isPublished: item.isPublished,
        startTime: item.startTime ? formatDateTime(item.startTime) : item.startTime,
        endTime: item.endTime ? formatDateTime(item.endTime) : item.endTime,
      }
    }));
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    ElMessage({
      type: 'error',
      message: '获取问卷时出错，请重试'
    });
  }
};

const fetchIndustries = async () => {
  try {
    const response = await axios.get('/api/user/getAllIndustry', {
      headers: {
        ...accessHeader()
      }
    })
    if (response.status === 200) {
      industries.value = response.data.data.map(item => ({label: item.name, value: String(item.id)}))
    } else {
      console.warn('返回状态出错!')
    }
  } catch (error) {
    console.error('获取行业信息出错：', error)
  }
}

const fetchDistributedIndustries = async () => {
  try {
    const response = await axios.get('/api/publish/getAll', {
      headers: {
        ...accessHeader()
      }
    })
    if (response.status === 200) {
      publish.value = response.data.data
    } else {
      console.warn('返回状态出错!')
    }
  } catch (error) {
    console.error('获取已分发行业信息出错：', error)
  }
}

onMounted(() => {
  // count = 1;
  fetchQuestionnaires()
  fetchIndustries()
})

const formatDateTime = (time) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(time));
}

const navigateToCreateQuestionnaire = () => {
  router.push('/createQuestionnaire').then(() => {
    location.reload();
  });
}

//编辑逻辑
const handleEdit = (questionnaire) => {
  router.push({name: 'editQuestionnaire', params: {questionnaire: JSON.stringify(questionnaire)}});
}

const shareDrawerVisible = ref(false)
const shareLink = ref('')
const qrCode = ref('')
const currentQuestionnaire = ref(null);
const publish = ref([])

const handleShare = (questionnaire) => {
  currentQuestionnaire.value = questionnaire
  shareDrawerVisible.value = true
}

const generateQrCode = async () => {
  try {
    const response = await axios.get('/api/qr/generate', {
      headers: {
        ...accessHeader()
      },
      params: {
        content: shareLink.value
      }
    })
    qrCode.value = `data:image/png;base64,${response.data.data}`
  } catch (error) {
    console.error('生成二维码失败:', error)
    ElMessage.error('生成二维码失败')
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  }).catch(err => {
    console.error('复制链接失败:', err)
    ElMessage.error('复制链接失败')
  })
}

const openLink = () => {
  window.open(shareLink.value, '_blank')
}

const industries = ref([]);
const selectedIndustries = ref([]);
const checkAll = ref(false);
const indeterminate = ref(false);

const handleCheckAll = () => {
  if (checkAll.value) {
    selectedIndustries.value = industries.value.map(item => item.value);
  } else {
    selectedIndustries.value = [];
  }
  indeterminate.value = false;
};

const handleDistribute = async () => {
  try {
    await fetchDistributedIndustries();

    const industriesToDistribute = ref(
        selectedIndustries.value.filter(industryId => {
          return !publish.value.some(p => p.surveyId == currentQuestionnaire.value.id && p.industryId == industryId);
        })
    );

    if (industriesToDistribute.value.length === 0) {
      ElMessage.info('所有选定的行业已经分发过问卷，无需重复分发');
      return;
    }

    const requests = industriesToDistribute.value.map(industryId => {
      return request.post('/publish/send', {
        surveyId: currentQuestionnaire.value.id,
        industryId: industryId,
        required: true
      }, {
        headers: {
          ...accessHeader()
        }
      });
    });

    const responses = await Promise.allSettled(requests);
    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        console.log(`Response for industryId ${selectedIndustries.value[index]}:`, response.value);
      } else {
        console.error(`Error for industryId ${selectedIndustries.value[index]}:`, response.reason);
      }
    });

    const allSuccess = responses.every(response => response.status === 'fulfilled' && response.value.status === 200);

    if (allSuccess) {
      ElMessage.success('问卷分发成功!');
      console.log(currentQuestionnaire.value)
      const index = questionnaires.findIndex(q => q.id === currentQuestionnaire.value.id);
      if (index !== -1) {
        questionnaires[index].isPublished = true;
      }
      setTimeout(() => {
        location.reload();
      }, 200);
    } else {
      const failedRequests = responses.filter(response => response.status === 'rejected' || (response.status === 'fulfilled' && response.value.status !== 200));
      console.error('分发失败的请求: ', failedRequests);
      ElMessage.error('部分问卷分发失败!');
    }
  } catch (error) {
    console.error('分发失败: ', error);
    ElMessage.error('问卷分发失败!');
  }
};


const handleDownload = (questionnaire) => {
  console.log('Download:', questionnaire)
  // todo 分析&下载问卷逻辑
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
        id: questionnaire.id,
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

// 提醒问卷逻辑
const handleRemind = async (questionnaire) => {
  questionnaire.status = 1;
  console.log('Remind:', questionnaire)
  
  await request.put("/survey/updateSurvey", questionnaire, {
    headers: {
      'Authorization': `Bearer ${takeAccessToken()}`,
      'Content-Type': 'application/json'
    }
  })

  ElMessage({
    type: 'success',
    message: '已提醒用户',
  })

}

const handleScroll = async (event) => {
  const {scrollTop, clientHeight, scrollHeight} = event.target

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    count.value++
    console.log("count为：" + count.value)
    await fetchQuestionnaires()
  }
}

const searchQuestionnaires = () => {
  router.push({name: 'adminSearchQuestionnaire', params: {searchContent: searchContent.value}}).then(() => {
    location.reload();
  });
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
            v-model="searchContent"
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
          v-for="item in questionnaires"
          :key="item.id"
          :questionnaire="item"
          :isPublished="item.isPublished"
          @edit="handleEdit($event)"
          @share="handleShare"
          @download="handleDownload"
          @delete="handleDelete"
          @remind="handleRemind"
          style="margin-bottom: 10px;width: 80%"
      ></questionnaire>
      <!-- <el-empty v-if="!hasMoreData && questionnaires.length === 0" description="没有更多问卷"></el-empty> -->
    </div>

    <el-drawer v-model="shareDrawerVisible" title="转发问卷" size="30%" :direction="'rtl'" :with-header="true">
      <template #header>
        <h1>转发问卷</h1>
      </template>
      <template #default>
        <el-divider content-position="center"> 二维码分享</el-divider>
        <!-- todo 二维码  -->
        <div style="text-align: center;">
          <img v-if="qrCode" :src="qrCode" alt="QR Code" style="max-width: 100%; height: auto;">
        </div>

        <el-divider content-position="center"> 链接分享</el-divider>
        <!-- todo 链接  -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <el-input v-model="shareLink" readonly placeholder="分享链接" style="flex: 1;"></el-input>
          <el-button @click="copyLink" type="primary">复制</el-button>
          <el-button @click="openLink" type="success">跳转</el-button>
        </div>
        <el-divider content-position="center"> 选择发布的行业</el-divider>
        <div style="text-align: center">
          <el-select
              v-model="selectedIndustries"
              multiple
              clearable
              collapse-tags
              placeholder="选择"
              popper-class="custom-header"
              :max-collapse-tags="1"
              style="width: 240px"
          >
            <template #header>
              <el-checkbox
                  v-model="checkAll"
                  :indeterminate="indeterminate"
                  @change="handleCheckAll"
              >
                选择全部
              </el-checkbox>
            </template>
            <el-option
                v-for="industry in industries"
                :key="industry.value"
                :label="industry.label"
                :value="industry.value"
            />
          </el-select>
          <el-button type="primary" @click="handleDistribute">分发问卷</el-button>
        </div>

      </template>
      <template #footer>
      </template>
    </el-drawer>

  </div>
</template>

<style lang="scss" scoped>
.out {
  margin: 0;
  padding: 0;
  width: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;

    .input-with-select {
      padding-right: 20px;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    padding: 10px;
  }
}
</style>
