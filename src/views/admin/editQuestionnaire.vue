<script setup>
import { ref, nextTick,watch, onMounted  } from 'vue';
import { ElButton, ElInput, ElDatePicker, ElMessage } from 'element-plus';
import { Select } from '@element-plus/icons-vue';
import axios from 'axios';
import question from '@/components/question.vue';
import { useRouter,useRoute } from 'vue-router';
import request from '@/utils/request.js';
import { takeAccessToken } from "@/net";

const router = useRouter();
const route = useRoute();
const surveyself = ref(null);
const surveyData = ref({
  title: '',
  description: '',
  start_time: null,
  end_time: null,
  status: 0,
  owner_id: null,
  modified: false,
  questions: [],
});
const dateRange = ref([])

const loadSurvey = async (survey) => {
  try {
    surveyData.value.title = survey.title;
    surveyData.value.description = survey.description;
    surveyData.value.start_time = new Date(survey.startTime);
    surveyData.value.end_time = new Date(survey.endTime);
    dateRange.value = [new Date(survey.startTime), new Date(survey.endTime)];
    const response = await request.get('/option/getAllOptionsStructureBySurveyId', {
      headers: {
        'Authorization': `Bearer ${takeAccessToken()}`,
      },
      params: {
        surveyId: survey.id,
      }
    });
    console.log(response)
    const questions = response.data.data;
    console.log(questions);
    surveyData.value.questions = questions.map((question, index) => ({
      ...question,
      options: question.optionVos, // 将 optionVos 重命名为 options
      isEditing: false,
    }));
    console.log(surveyData.value.questions);
  } catch (error) {
    ElMessage.error('加载问卷内容时出错，请重试');
  }
};

onMounted(() => {
  surveyself.value = JSON.parse(route.params.questionnaire);
  console.log(surveyself.value)
  if (surveyself.value) {
    loadSurvey(surveyself.value);
  }
});

// 监听dateRange的变化，将值赋给surveyData的start_time和end_time
watch(dateRange, (newVal) => {
  if (newVal.length === 2) {
    surveyData.value.start_time = newVal[0];
    surveyData.value.end_time = newVal[1];
  }
});

// 添加新问题时生成临时ID（负数）
const addQuestion = (type) => {
  const tempId = -Date.now(); // 生成负数的临时ID
  const newQuestion = {
    id: tempId, // 负数的临时ID
    type,
    title: '',
    line_num: surveyData.value.questions.length + 1,
    required: false,
    options: [],
    isEditing: false,
  };

  if (type === 1 || type === 2 || type === 4 || type === 5) {
    newQuestion.options.push({ id: tempId - 1, text: '', line_num: 1 });
    newQuestion.options.push({ id: tempId - 2, text: '', line_num: 2 });
  }

  surveyData.value.questions.push(newQuestion);
};

const updateQuestion = (index, updatedQuestion) => {
  surveyData.value.questions[index] = updatedQuestion;
  console.log(surveyData.value);
};

const deleteQuestion = (index) => {
  surveyData.value.questions.splice(index, 1);
  // Reorder line_num for remaining questions
  surveyData.value.questions.forEach((question, i) => {
    question.line_num = i + 1;
  });
};

const toggleEditing = (index) => {
  surveyData.value.questions.forEach((q, i) => {
    q.isEditing = index === i;
  });
};

const validateSurvey = () => {
  if (!surveyData.value.title) {
    ElMessage({
      message: '请填写问卷标题',
      type: 'warning',
      plain: true,
    });
    return false;
  }

  for (const question of surveyData.value.questions) {
    if (!question.title) {
      ElMessage({
        message: '请填写问题标题',
        type: 'warning',
        plain: true,
      });
      return false;
    }

    if ([1, 2, 4, 5].includes(question.type) && question.options.length === 0) {
      ElMessage({
        message: '问题至少得有一个选项',
        type: 'warning',
        plain: true,
      });
      return false;
    }
  }

  return true;
};

const submitSurvey = async () => {
  if (!validateSurvey()) {
    return;
  }

  const surveyId = surveyself.value.id;
  console.log(surveyId)

  // try {
    if (surveyId) {
      // 更新问卷
      await request.put(`/survey/updateSurvey`, {
        id: surveyId,
        title: surveyData.value.title,
        description: surveyData.value.description,
        startTime: surveyData.value.start_time,
        endTime: surveyData.value.end_time,
        status: surveyData.value.status,
        owner_id: surveyData.value.owner_id,
        modified: surveyData.value.modified,
        questions: surveyData.value.questions,
      }, {
        headers: {
          'Authorization': `Bearer ${takeAccessToken()}`,
          'Content-Type': 'application/json'
        }
      });

    // const surveyId = surveyself.value.id;
    // console.log(surveyId);

    // 构建问题列表
    const questions = surveyData.value.questions.map((question, index) => ({
      id: question.id < 0 ? question.id % 2147483648 : question.id, // 确保ID在范围内
      surveyId: surveyId,
      type: question.type,
      title: question.title,
      line_num: index + 1,
      required: question.required,
    }));

    // 更新问题
    const questionResponse = await request.put('/question/updateQuestions',
      questions, {
        headers: {
          'Authorization': `Bearer ${takeAccessToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(questionResponse);

    // 获取创建的问题ID
    const updateQueations = questionResponse.data.data;
    console.log(updateQueations);

    // 构建选项列表
    const options = [];
    surveyData.value.questions.forEach((question, index) => {
      const questionId = updateQueations[index];
      question.options.forEach((option, optionIndex) => {
        options.push({
          id: option.id < 0 ? option.id % 2147483648 : option.id, // 确保ID在范围内
          questionId: questionId,
          text: option.text,
          line_num: optionIndex + 1,
        });
      });
    });

    // 更新选项
    if (options.length > 0) {
      const optionResponse = await request.put('/option/updateOptions',
        options, {
          headers: {
            'Authorization': `Bearer ${takeAccessToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(options)
      console.log("你好");
      console.log(optionResponse.data);
    }


    // } else {
    //   // 创建新问卷
    //   const surveyResponse = await request.post('/survey/createSurvey', {
    //     title: surveyData.value.title,
    //     description: surveyData.value.description,
    //     startTime: surveyData.value.start_time,
    //     endTime: surveyData.value.end_time,
    //     status: surveyData.value.status,
    //     owner_id: surveyData.value.owner_id,
    //     modified: surveyData.value.modified,
    //   }, {
    //     headers: {
    //       'Authorization': `Bearer ${takeAccessToken()}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });

    //   const surveyId = surveyResponse.data.id;

    //   const questions = surveyData.value.questions.map((question, index) => ({
    //     surveyId: surveyId,
    //     type: question.type,
    //     title: question.title,
    //     line_num: index + 1,
    //     required: question.required,
    //   }));

    //   await request.post('/question/createQuestions', questions, {
    //     headers: {
    //       'Authorization': `Bearer ${takeAccessToken()}`,
    //       'Content-Type': 'application/json'
    //     }
    //   });
    }

    ElMessage({
      message: surveyId ? '问卷更新成功！' : '问卷发布成功！',
      type: 'success',
    });

    router.go(-1);
  // } 
  // catch (error) {
  //   ElMessage.error(surveyId ? '更新问卷时出错，请重试' : '发布问卷时出错，请重试');
  // }
};



// 处理编辑事件
const isEditingTitle = ref(false);
const isEditingDescription = ref(false);
const titleInputRef = ref(null);
const descriptionInputRef = ref(null);

const editTitle = async () => {
  isEditingTitle.value = true;
  await nextTick();
  titleInputRef.value.focus();
  titleInputRef.value.select();
};

const saveTitle = () => {
  isEditingTitle.value = false;
};

const editDescription = async () => {
  isEditingDescription.value = true;
  await nextTick();
  descriptionInputRef.value.focus();
  descriptionInputRef.value.select();
};

const saveDescription = () => {
  isEditingDescription.value = false;
};
</script>

<template>
  <el-container style="height: 100vh;">
    <!-- 题目选择 -->
    <el-aside width="20%">
      <div class="left-panel">
        <el-button type="primary" @click="addQuestion(1)">单选</el-button>
        <el-button type="primary" @click="addQuestion(2)">多选</el-button>
        <el-button type="primary" @click="addQuestion(4)">下拉单选</el-button>
        <el-button type="primary" @click="addQuestion(5)">下拉多选</el-button>
        <el-button type="primary" @click="addQuestion(3)">简答</el-button>
        <el-button type="primary" @click="addQuestion(6)">文件上传</el-button>
      </div>
    </el-aside>
    <!-- 问卷内容 -->
    <el-main>
      <el-card>
        <template #header>
          <div class="questionnaire-header">
            <!-- 修改标题 -->
            <div @click="editTitle" v-if="!isEditingTitle" class="editable-text">
              <el-text
                style="font-size: 36px; text-align: center; display: block; color: #2c3e50; margin-bottom: 20px"
                >{{ surveyData.title || '点击修改问卷标题' }}</el-text>
            </div>
            <el-input
              v-model="surveyData.title"
              v-if="isEditingTitle"
              placeholder="点击修改问卷标题"
              @blur="saveTitle"
              class="title-input"
              ref="titleInputRef"
              style="font-size: 36px; text-align: center; display: block; color: #2c3e50; margin-bottom: 20px"
            />
            <!-- 修改描述 -->
            <div @click="editDescription" v-if="!isEditingDescription" class="editable-text">
              <el-text type="info" style="font-size: 20px; text-align: center; display: block;"
                >{{ surveyData.description || '添加问卷描述' }}</el-text>
            </div>
            <el-input
              type="textarea"
              v-model="surveyData.description"
              v-if="isEditingDescription"
              placeholder="添加问卷描述"
              @blur="saveDescription"
              ref="descriptionInputRef"
              style="font-size: 20px; text-align: center; display: block;"
            />
          </div>
        </template>
        <div class="questionnaire-body">
          <question
            v-for="(question, index) in surveyData.questions"
            :key="index"
            :question="question"
            :isEditing="question.isEditing"
            @update-question="updateQuestion(index, $event)"
            @delete-question="deleteQuestion(index)"
            @toggle-editing="toggleEditing(index)"
          />
        </div>

        <template #footer>
          <div class="questionnaire-footer">
            <div class="block">
      <el-date-picker
        v-model="dateRange"
        type="datetimerange"
        start-placeholder="Start date"
        end-placeholder="End date"
        format="YYYY-MM-DD HH:mm:ss"
        date-format="YYYY/MM/DD ddd"
        time-format="A hh:mm:ss"
      />
    </div>
            <el-button type="primary" @click="submitSurvey">发布问卷</el-button>
          </div>
        </template>
      </el-card>
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
.left-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 10px;
}

.left-panel .el-button {
  flex: 0 0 calc(50% - 10px);
  margin: 5px;
}
.questionnaire-header {
  margin-bottom: 20px;
}

::v-deep(.title-input .el-input__inner) {
  text-align: center;
  font-weight: bold;
  color: #000;
  font-size: 30px;
}

.questionnaire-body {
  display: flex;
  flex-direction: column;
}

.questionnaire-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editable-text {
  cursor: pointer;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.el-input[type='textarea'] {
  resize: none;
}

.editable-text:hover {
  border-color: #dcdfe6;
}
</style>
