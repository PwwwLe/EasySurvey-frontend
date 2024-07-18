<script setup>
import { ref, onMounted,computed } from 'vue'
import { getCrossReport } from "@/net";

const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
});

const formattedReportText = computed(() => {
  return reportText.value.replace(/\n/g, '<br>');
});

const selectedQuestion1 = ref(null);
const selectedQuestion2 = ref(null);
const reportGenerated = ref(false);
const reportText = ref('');
const reportTable = ref(null);
const loading = ref(false);

onMounted(() => {
  console.log('questions:', props.questions);
});

const generateReport = () => {
  if (!selectedQuestion1.value || !selectedQuestion2.value) {
    alert('请先选择两个问题');
    return;
  }

  if (selectedQuestion1.value.id === selectedQuestion2.value.id) {
    alert('请选择不同的问题');
    return;
  }
  loading.value = true;

  getCrossReport(selectedQuestion1.value.id, selectedQuestion2.value.id, (data) => {
    console.log("data:",data.data)
    const reportData = JSON.parse(data.data);
    reportText.value = reportData.chi_square;
    reportTable.value = JSON.parse(reportData.table);
    reportGenerated.value = true;
    loading.value = false;

  });
};
</script>

<template>
  <div class="report-generator">
    <div class="question-selection">
      <label for="question1">选择问题1:</label>
      <select v-model="selectedQuestion1" id="question1">
        <option v-for="(question, index) in questions" :key="index" :value="question">
          {{ question.title }}
        </option>
      </select>
      
      <label for="question2">选择问题2:</label>
      <select v-model="selectedQuestion2" id="question2">
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
      <p>问题1: {{ selectedQuestion1.title }}</p>
      <p>问题2: {{ selectedQuestion2.title }}</p>
      
      <div v-if="reportTable" class="report-table">
        <table>
          <thead>
            <tr>
              <th class="diagonal-header">
                <div class="header-container">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke="black" stroke-width="2"/>
                    <text x="30" y="70" dominant-baseline="hanging" text-anchor="middle" font-size="15">问题1</text>
                    <text x="70" y="30" dominant-baseline="middle" text-anchor="middle" font-size="15">问题2</text>
                  </svg>
                </div>
              </th>
              <th v-for="col in reportTable.columns.slice(1)" :key="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in reportTable.data" :key="index">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
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

.report-table {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.report-table table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th, .report-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.diagonal-header {
  position: relative;
  width: 100px;
  height: 100px;
}

.header-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.header-container svg {
  width: 100%;
  height: 100%;
}

.header-text {
  position: absolute;
  font-weight: bold;
}

.header-text:nth-child(1) {
  top: 2px;
  left: 2px;
}

.header-text:nth-child(3) {
  bottom: 2px;
  right: 2px;
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