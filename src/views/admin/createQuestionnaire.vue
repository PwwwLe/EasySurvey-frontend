<script setup>
import {ref, nextTick} from 'vue';
import {ElButton, ElInput, ElDatePicker, ElMessage} from 'element-plus';
import {Select} from '@element-plus/icons-vue'
import axios from 'axios';
import question from '@/components/question.vue';
import {useRouter} from 'vue-router'

const router = useRouter();
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

const addQuestion = (type) => {
  const newQuestion = {
    type,
    title: '',
    line_num: surveyData.value.questions.length + 1,
    required: false,
    options: [],
    isEditing: false,
  };

  if (type === 'multiple-choice' || type === 'dropdown-single' || type === 'dropdown-multiple' || type === 'single-choice' || type === 'single-choice') {
    newQuestion.options.push({text: '', line_num: 1});
    newQuestion.options.push({text: '', line_num: 2});
  }

  surveyData.value.questions.push(newQuestion);
};

const updateQuestion = (index, updatedQuestion) => {
  // console.log(updatedQuestion);
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
  console.log("你好")
  surveyData.value.questions.forEach((q, i) => {
    q.isEditing = index === i;
  });
};

const submitSurvey = async () => {
  if (!surveyData.value.title) {
    console.log(surveyData.value.title)
    ElMessage({
      message: '请填写问卷标题',
      type: 'warning',
      plain: true,
    })
  } else {
    try {
      const surveyResponse = await axios.post('/api/surveys', {
        title: surveyData.value.title,
        description: surveyData.value.description,
        start_time: surveyData.value.start_time,
        end_time: surveyData.value.end_time,
        status: surveyData.value.status,
        owner_id: surveyData.value.owner_id,
        modified: surveyData.value.modified,
      });

      const surveyId = surveyResponse.data.id;

      for (const [index, question] of surveyData.value.questions.entries()) {
        const questionResponse = await axios.post('/api/questions', {
          survey_id: surveyId,
          type: question.type,
          title: question.title,
          line_num: index + 1,
          required: question.required,
        });

        const questionId = questionResponse.data.id;

        for (const [optionIndex, option] of question.options.entries()) {
          await axios.post('/api/options', {
            question_id: questionId,
            text: option.text,
            line_num: optionIndex + 1,
          });
        }
      }

      ElMessage({
        message: '问卷发布成功！',
        type: 'success',
      });

      router.go(-1);
    } catch (error) {
      ElMessage.error('发布问卷时出错，请重试');
    }
  }
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
        <el-button @click="addQuestion('single-choice')">单选</el-button>
        <el-button @click="addQuestion('multiple-choice')">多选</el-button>
        <el-button @click="addQuestion('dropdown-single')">下拉单选</el-button>
        <el-button @click="addQuestion('dropdown-multiple')">下拉多选</el-button>
        <el-button @click="addQuestion('short-answer')">简答</el-button>
        <el-button @click="addQuestion('document')">文件上传</el-button>
      </div>
    </el-aside>
    <!-- 问卷内容 -->
    <el-main>
      <el-card>
        <template #header>
          <div class="questionnaire-header">
            <!-- 修改标题 -->
            <div @click="editTitle" v-if="!isEditingTitle" class="editable-text">
              <el-text style="font-size: 36px;
                  text-align: center;
                  display: block;
                  color: #2c3e50;
                  margin-bottom: 20px">{{
                  surveyData.title || '点击修改问卷标题'
                }}
              </el-text>
            </div>
            <el-input
                v-model="surveyData.title"
                v-if="isEditingTitle"
                placeholder="点击修改问卷标题"
                @blur="saveTitle"
                class="title-input"
                ref="titleInputRef"
                style="font-size: 36px;
                  text-align: center;
                  display: block;
                  color: #2c3e50;
                  margin-bottom: 20px"
            />
            <!-- 修改描述 -->
            <div @click="editDescription" v-if="!isEditingDescription" class="editable-text">
              <el-text type="info" style="font-size: 20px; text-align: center; display: block;">
                {{ surveyData.description || '添加问卷描述' }}
              </el-text>
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
            <div>
              <span>截止时间：</span>
              <el-date-picker v-model="surveyData.end_time" type="datetime" placeholder="选择问卷截止时间"/>
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
  border-right: 1px solid #ddd;
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

.el-input[type="textarea"] {
  resize: none;
}

.editable-text:hover {
  border-color: #dcdfe6;
}
</style>
