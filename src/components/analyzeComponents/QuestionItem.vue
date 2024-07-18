<script setup>
import { ref, onMounted } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import 'element-plus/theme-chalk/el-tabs.css';
import 'element-plus/theme-chalk/el-tab-pane.css';
import * as echarts from 'echarts'

const props = defineProps({
  questionTitle: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  }
});

// 示例问卷结果数据
const questionnaireResults = ref([
  {
    questionId: 1,
    question: props.questionTitle,
    options: props.options
  }
])

const barCharts = ref([])
const pieCharts = ref([])

const initBarChart = (chartElement, options) => {
  const chart = echarts.init(chartElement)
  chart.setOption(options)
}

const initPieChart = (chartElement, options) => {
  const chart = echarts.init(chartElement)
  chart.setOption(options)
}

onMounted(() => {
  console.log(props.questionTitle)
  console.log(props.options)
  questionnaireResults.value.forEach((question, index) => {
    const barChartOptions = {
      tooltip: {},
      xAxis: {
        type: 'category',
        data: question.options.map(o => o.text)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: question.options.map(o => o.count),
          type: 'bar'
        }
      ]
    }

    const pieChartOptions = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '选项',
          type: 'pie',
          radius: '50%',
          data: question.options.map(o => ({
            value: o.count,
            name: o.text
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    initBarChart(barCharts.value[index], barChartOptions)
    initPieChart(pieCharts.value[index], pieChartOptions)
  })
})

const activeTab = ref('chartView');
</script>

<template>
  <div class="questionnaire">
    <div class="title">{{ questionTitle }}</div>
    <div v-for="(option, index) in options" :key="index" class="option">
      <div class="option-container">
        <div class="option-label">{{ option.text }}</div>
        <div class="option-bar-container">
          <div class="option-bar" :style="{ width: option.percentage + '%' }"></div>
          <div class="option-text">
            <span>{{ option.label }}</span>
          </div>
          <div class="option-stats">
            <span>{{ option.percentage }}%</span>
            <span>({{ option.count }}人)</span>
          </div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeTab" class="tabs">
      <el-tab-pane label="扇形图" name="listView">
        <div v-for="(question, index) in questionnaireResults" :key="index">
          <div ref="pieCharts" :style="{ width: '600px', height: '400px' }"></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="柱状图" name="chartView">
        <div v-for="(question, index) in questionnaireResults" :key="index">
          <div ref="barCharts" :style="{ width: '600px', height: '400px' }"></div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="详情展示" name="detailView">
        <div class="detail-view">
          <p>详情展示内容</p>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>



<style scoped>
.questionnaire {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.option {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.option-container {
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.option-label {
  width: 400px;
  text-align: center;
  font-weight: bold;
  background-color: #f5f5f5;
  padding: 0 10px;
  border-right: 1px solid #ccc;
}

.option-bar-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  position: relative;
}

.option-bar {
  background-color: #409eff;
  height: 30px;
  position: absolute;
  left: 0;
  top: 0;
}

.option-text {
  padding: 0 10px;
  position: relative;
  color: #fff;
  z-index: 1;
  display: flex;
  align-items: center;
}

.option-stats {
  margin-left: auto;
  display: flex;
  gap: 10px;
  z-index: 1;
  padding-right: 10px;
  color: #000;
  position: relative;
}

.tabs {
  margin-top: 20px;
}

.chart-view,
.list-view,
.detail-view {
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 24px;
  text-align: center;
  margin: 5px 0;
}
</style>
