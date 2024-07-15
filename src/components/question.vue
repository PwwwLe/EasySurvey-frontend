<script setup>
import {ref, defineProps, defineEmits, watch, nextTick} from 'vue';
import {ElInput, ElButton, ElCheckbox} from 'element-plus';
import {Delete, Plus} from '@element-plus/icons-vue';

const props = defineProps({
  question: Object,
  isEditing: Boolean,
});

const emits = defineEmits(['update-question', 'delete-question', 'toggle-editing']);

const localQuestion = ref({...props.question});

watch(() => props.question, (newQuestion) => {
  localQuestion.value = {...newQuestion};
}, {deep: true});

const updateOption = (index, event) => {
  localQuestion.value.options[index].text = event;
  emits('update-question', localQuestion.value);
};

const addOption = () => {
  localQuestion.value.options.push({text: '', line_num: localQuestion.value.options.length + 1});
  emits('update-question', localQuestion.value);
};

const removeOption = (index) => {
  localQuestion.value.options.splice(index, 1);
  localQuestion.value.options.forEach((option, i) => {
    option.line_num = i + 1;
  });
  emits('update-question', localQuestion.value);
};

const deleteQuestion = () => {
  emits('delete-question');
};

const toggleEditing = async () => {
  emits('toggle-editing');
  await nextTick();
  const input = document.querySelector('.title-input .el-input__inner');
  if (input) {
    input.focus();
    input.select();
  }
};

const updateTitle = (value) => {
  localQuestion.value.title = value;
  emits('update-question', localQuestion.value);
};

const getQuestionTypeLabel = (type) => {
  switch (type) {
    case 1:
      return '[单选题]';
    case 2:
      return '[多选题]';
    case 4:
      return '[下拉单选题]';
    case 5:
      return '[下拉多选题]';
    case 3:
      return '[简答题]';
    case 6:
      return '[文件上传]';
    default:
      return '';
  }
};

// 处理编辑逻辑
const isEditingQuestionTitle = ref(false);
const questionTitleInputRef = ref(null);

const editQuestionTitle = async () => {
  isEditingQuestionTitle.value = true;
  await nextTick();
  questionTitleInputRef.value.focus();
  questionTitleInputRef.value.select();
};

const saveQuestionTitle = () => {
  isEditingQuestionTitle.value = false;
};

const isEditingOptions = ref([]);
const optionInputRefs = ref([]);

const editOption = async (index) => {
  isEditingOptions.value[index] = true;
  await nextTick();
  optionInputRefs.value[index].focus();
  optionInputRefs.value[index].select();
};

const saveOption = (index) => {
  isEditingOptions.value[index] = false;
};

</script>

<template>
  <div class="question-component" :class="{ 'editing': props.isEditing }" @click="toggleEditing">
    <div class="question-title">
      <div @click="editQuestionTitle" v-if="!isEditingQuestionTitle" >
        <el-text class="editable-text">{{ localQuestion.title || '点击修改题目标题' }}</el-text>
        <span class="question-type">{{ getQuestionTypeLabel(localQuestion.type) }}</span>
      </div>
      <el-input
        v-model="localQuestion.title"
        v-if="isEditingQuestionTitle"
        placeholder="题目标题"
        @blur="saveQuestionTitle"
        class="title-input"
        ref="questionTitleInputRef"
        @input="updateTitle($event)"
      />
    </div>
<div v-if="localQuestion.type === 1 || localQuestion.type === 2 || localQuestion.type === 4 || localQuestion.type === 5">
  <div v-for="(option, index) in localQuestion.options" :key="index" class="option" @click="editOption(index)">
    <div class="option-text">
      <div v-if="!isEditingOptions[index]" class="editable-text">
        <el-text>{{ option.text || '点击修改选项' }}</el-text>
      </div>
      <el-input
        v-model="localQuestion.options[index].text"
        v-if="isEditingOptions[index]"
        placeholder="选项"
        @blur="saveOption(index)"
        ref="el => optionInputRefs.value[index] = el"
        @input="updateOption(index, $event)"
      />
    </div>
    <el-button class="deleteButton" :icon="Delete" @click="removeOption(index)">删除选项</el-button>
  </div>
  <el-button :icon="Plus" @click="addOption">添加选项</el-button>
</div>
<div v-if="localQuestion.type === 3">
  <el-input type="textarea" placeholder="这是一个简答题" disabled/>
</div>
    <div class="footer">
      <el-checkbox v-model="localQuestion.required" @change="() => emits('update-question', localQuestion.value)">
        是否必答
      </el-checkbox>
      <el-button :icon="Delete" @click="deleteQuestion">删除题目</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.question-component {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  .footer {
    display: flex;
    justify-content: space-between;
  }
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.editing {
  background-color: #d8d5d5;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 5px;
}

.editing:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.editable-text {
  cursor: pointer;
  border: 3px solid transparent;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.editable-text:hover {
  border-color: #dcdfe6;
}

.question-title {
  display: flex;
  align-items: center;

  ::v-deep(.title-input .el-input__inner) {
    font-weight: bold;
    color: #777373;
    font-size: 20px;
  }

  .question-type {
    display: inline-block;
    margin-left: 10px;
    color: #999;
    font-size: 14px;
  }
}
</style>
