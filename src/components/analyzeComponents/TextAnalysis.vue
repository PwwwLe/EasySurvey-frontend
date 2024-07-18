<script setup>
import { ref, onMounted,computed } from 'vue'
import { getTextReport, get } from "@/net"

const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
});

const formattedReportText = computed(() => {
  return reportText.value.replace(/\n/g, '<br>');
});

const selectedQuestion = ref(null);
const reportGenerated = ref(false);
const reportText = ref('');
const loading = ref(false);


onMounted(() => {
  console.log('questions:', props.questions);
});

const generateReport = () => {
  loading.value = true;
  if (selectedQuestion.value) {
    getTextReport(selectedQuestion.value.id, (data) => {
      console.log("data:",data.data)
      const reportData = JSON.parse(data.data);
      reportText.value = reportData.text_analyze;
      console.log(reportText);
      reportGenerated.value = true;
      loading.value = false;

    })
  } else {
    alert('请先选择一个问题');
  }
};

</script>
<template>
  <div class="report-generator">
    <div class="question-selection">
      <label for="questionTitles">选择问题:</label>
      <select v-model="selectedQuestion" id="questionTitles">
        <option v-for="(question, index) in questions" :key="index" :value="question">
          {{ question.title }}
        </option>
      </select>
    </div>

    <button class="generate-button" @click="generateReport">生成报告</button>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div v-if="reportGenerated" class="report">
      <h3>报告</h3>
      <p>您选择了以下问题生成报告：</p>
      <p>问题: {{ selectedQuestion.title }}</p>
      <div class="report-content" v-html="formattedReportText"></div>
    </div>
  </div>
</template>



<style scoped>
.report-generator {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.question-selection {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

label {
  font-weight: bold;
}

select {
  width: 100%;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.generate-button {
  display: block;
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #409eff;
  color: white;
  cursor: pointer;
  text-align: center;
}

.generate-button:hover {
  background-color: #66b1ff;
}

.report {
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid #ccc;
}

.report-content {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #409eff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
