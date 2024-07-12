<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { ElInput, ElButton, ElCheckbox } from 'element-plus';

const isEditing = ref(false);

const props = defineProps({
  question: Object,
  isEditing: Boolean,
});

const emits = defineEmits(['update-question', 'delete-question','toggle-editing']);

const localQuestion = ref({ ...props.question });

const updateOption = (index, event) => {
  console.log(value)
  localQuestion.value.options[index] = event.target.value;
  emits('update-question', localQuestion.value);
};

const addOption = () => {
  localQuestion.value.options.push('');
};

const removeOption = (index) => {
  localQuestion.value.options.splice(index, 1);
};

const deleteQuestion = () => {
  emits('delete-question');
};

const toggleEditing = () => {
  console.log("你好哈哈")
  emits('toggle-editing');
};
</script>

<template>
    <div class="question-component" :class="{ 'editing': props.isEditing }"  @click="toggleEditing">
      <el-input v-model="localQuestion.title" placeholder="题目标题" />
      <div v-if="localQuestion.type === 'single-choice'">
        <div v-for="(option, index) in localQuestion.options" :key="index" class="option">
          <el-input :value="option" @input="updateOption(index, $event)" placeholder="选项" />
          <el-button @click="removeOption(index)">删除选项</el-button>
        </div>
        <el-button @click="addOption">添加选项</el-button>
      </div>
      <div v-if="localQuestion.type === 'multiple-choice'">
        <div v-for="(option, index) in localQuestion.options" :key="index" class="option">
          <el-input :value="option" @input="updateOption(index, $event)" placeholder="选项" />
          <el-button @click="removeOption(index)">删除选项</el-button>
        </div>
        <el-button @click="addOption">添加选项</el-button>
      </div>
      <div v-if="localQuestion.type === 'short-answer'">
        <!-- 简答题内容 -->
      </div>
      <div v-if="localQuestion.type === 'dropdown'">
        <div v-for="(option, index) in localQuestion.options" :key="index" class="option">
          <el-input :value="option" @input="updateOption(index, $event)" placeholder="选项" />
          <el-button @click="removeOption(index)">删除选项</el-button>
        </div>
        <el-button @click="addOption">添加选项</el-button>
      </div>
      <el-checkbox v-model="localQuestion.required">是否必答</el-checkbox>
      <el-button @click="deleteQuestion">删除题目</el-button>
    </div>
  </template>

<style lang="less" scoped>
.question-component {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer; /* 鼠标样式改为手型，表示可以点击 */
}
.option {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.editing {
  background-color: #756969; /* 设置编辑状态的背景颜色 */
}
</style>