<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { ElInput, ElButton, ElCheckbox } from 'element-plus';
import { Delete, Plus } from '@element-plus/icons-vue';

const props = defineProps({
  question: Object,
  isEditing: Boolean,
});

const emits = defineEmits(['update-question', 'delete-question', 'toggle-editing']);

const localQuestion = ref({ ...props.question });

watch(() => props.question, (newQuestion) => {
  localQuestion.value = { ...newQuestion };
}, { deep: true });

const updateOption = (index, event) => {
  // console.log(event);
  localQuestion.value.options[index].text = event;
  emits('update-question', localQuestion.value);
};

const addOption = () => {
  localQuestion.value.options.push({ text: '', line_num: localQuestion.value.options.length + 1 });
  emits('update-question', localQuestion.value);
};

const removeOption = (index) => {
  localQuestion.value.options.splice(index, 1);
  localQuestion.value.options.forEach((option,i) =>{
    option.line_num = i + 1;
  });
  emits('update-question', localQuestion.value);
};

const deleteQuestion = () => {
  emits('delete-question');
};

const toggleEditing = () => {
  emits('toggle-editing');
};

const updateTitle = (value) => {
  localQuestion.value.title = value;
  emits('update-question', localQuestion.value);
};

const getQuestionTypeLabel = (type) => {
  switch (type) {
    case 'single-choice':
      return '[单选题]';
    case 'multiple-choice':
      return '[多选题]';
    case 'dropdown-single':
      return '[下拉单选题]';
    case 'dropdown-multiple':
      return '[下拉多选题]'
    case 'short-answer':
      return '[简答题]';
    case 'document':
      return '[文件上传]';
    default:
      return '';
  }
};
</script>

<template>
  <div class="question-component" :class="{ 'editing': props.isEditing }" @click="toggleEditing">
    <div class="question-title">
      <el-input
        v-model="localQuestion.title"
        placeholder="题目标题"
        @input="updateTitle"
        class="title-input"
      />
      <div class="question-type">
        <span >{{ getQuestionTypeLabel(localQuestion.type) }}</span>
      </div>
    </div>
    <div v-if="localQuestion.type === 'single-choice'">
      <div v-for="(option, index) in localQuestion.options" :key="index" class="option">
        <el-input v-model="localQuestion.options[index].text" placeholder="选项" @input="updateOption(index, $event)" />
        <el-button :icon="Delete" @click="removeOption(index)">删除选项</el-button>
      </div>
      <el-button :icon="Plus" @click="addOption">添加选项</el-button>
    </div>
    <div v-if="localQuestion.type === 'multiple-choice'">
      <div v-for="(option, index) in localQuestion.options" :key="index" class="option">
        <el-input v-model="localQuestion.options[index].text" placeholder="选项" @input="updateOption(index, $event)" />
        <el-button :icon="Delete" @click="removeOption(index)">删除选项</el-button>
      </div>
      <el-button :icon="Plus" @click="addOption">添加选项</el-button>
    </div>
    <div v-if="localQuestion.type === 'short-answer'">
      <el-input type="textarea" placeholder="这是一个简答题" disabled />
    </div>
    <div v-if="localQuestion.type === 'dropdown-single'">
      <div v-for="(option, index) in localQuestion.options" :key="index" class="option">
        <el-input v-model="localQuestion.options[index].text" placeholder="选项" @input="updateOption(index, $event)" />
        <el-button :icon="Delete" @click="removeOption(index)">删除选项</el-button>
      </div>
      <el-button :icon="Plus" @click="addOption">添加选项</el-button>
    </div>
    <div v-if="localQuestion.type === 'dropdown-multiple'">
      <div v-for="(option, index) in localQuestion.options" :key="index" class="option">
        <el-input v-model="localQuestion.options[index].text" placeholder="选项" @input="updateOption(index, $event)" />
        <el-button :icon="Delete" @click="removeOption(index)">删除选项</el-button>
      </div>
      <el-button :icon="Plus" @click="addOption">添加选项</el-button>
    </div>
    <div class="footer">
      <el-checkbox v-model="localQuestion.required" @change="() => emits('update-question', localQuestion.value)">是否必答</el-checkbox>
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
  align-items: center;
  margin-bottom: 5px;
}
.editing {
  background-color: #d8d5d5;
}
.question-title {
  display: flex;
  align-items: center;
  ::v-deep(.title-input .el-input__inner) {
    font-weight: bold;
    color: #777373;
    font-size: 20px
  }
  .question-type {
    margin-left: 10px;
    color: #999;
    font-size: 14px;
  }
}
</style>
