<script setup>
import { ref } from 'vue';
import { ElButton, ElInput, ElDatePicker, ElMessage, ElScrollbar } from 'element-plus';
import question from '@/components/question.vue';

const title = ref('');
const description = ref('');
const questions = ref([]);
const deadline = ref(null);

const addQuestion = (type) => {
  const newQuestion = {
    type,
    title: '',
    options: [],
    required: false,
    isEditing: false,
  };

  if (type === 'multiple-choice' || type === 'dropdown' || type === 'single-choice') {
    newQuestion.options.push("");
    newQuestion.options.push("");
  }

  questions.value.push(newQuestion);
};

const updateQuestion = (index, updatedQuestion) => {
  questions.value[index] = updatedQuestion;
};

const deleteQuestion = (index) => {
  questions.value.splice(index, 1);
};

const toggleEditing = (index) => {
  questions.value.forEach((q, i) => {
    q.isEditing = index === i;
  });
};

const completeEditing = () => {
  ElMessage({
    message: '问卷编辑完成！',
    type: 'success',
  });
  // 在这里可以执行其他完成问卷编辑的逻辑
};
</script>

<template>
  <el-container style="height: 100vh;">
    <el-aside width="20%">
      <div class="left-panel">
        <el-button @click="addQuestion('single-choice')">单选</el-button>
        <el-button @click="addQuestion('multiple-choice')">多选</el-button>
        <el-button @click="addQuestion('dropdown')">下拉选择</el-button>
        <el-button @click="addQuestion('short-answer')">简答</el-button>
        <el-button @click="addQuestion('document')">文件上传</el-button>
      </div>
    </el-aside>
    <el-main>
      <el-scrollbar>
        <div class="right-panel">
          <div class="questionnaire-header">
            <el-input v-model="title" placeholder="点击修改问卷标题" class="title-input" />
            <el-input type="textarea" v-model="description" placeholder="添加问卷描述" />
          </div>
          <div class="questionnaire-body">
            <question
              v-for="(question, index) in questions"
              :key="index"
              :question="question"
              :isEditing="question.isEditing"
              @update-question="updateQuestion(index, $event)"
              @delete-question="deleteQuestion(index)"
              @toggle-editing="toggleEditing(index)"
            />
          </div>
          <div class="questionnaire-footer">
            <div>
                <span>截止时间：</span>
                <el-date-picker v-model="deadline" type="datetime" placeholder="选择问卷截止时间" />
            </div>
            <el-button type="primary" @click="completeEditing">完成问卷编辑</el-button>
          </div>
        </div>
      </el-scrollbar>
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

.left-panel .el-button {
  flex: 0 0 calc(50% - 10px); /* 每个按钮占据50%的宽度，减去间距 */
  margin: 5px; /* 设置按钮的上下间距 */
}

.right-panel {
  padding: 10px;
}

.questionnaire-header {
  margin-bottom: 20px;
}

::v-deep(.title-input .el-input__inner) {
  text-align: center; /* 文字居中 */
  font-weight: bold; /* 加粗 */
  color: #000; /* 黑色字体 */
  font-size: 20px; /* 字体加大 */
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
</style>