<template>
    <div>
        <h1>问卷默认报告</h1>
        <div v-for="(question, index) in questionnaireResults" :key="index">
            <h2>{{ question.question }}</h2>
            <div ref="barCharts" :style="{ width: '600px', height: '400px' }"></div>
            <div ref="pieCharts" :style="{ width: '600px', height: '400px' }"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// 示例问卷结果数据
const questionnaireResults = ref([
    {
        questionId: 1,
        question: '你喜欢的颜色是什么？',
        options: [
            { option: '红色', count: 10 },
            { option: '蓝色', count: 20 },
            { option: '绿色', count: 30 }
        ]
    },
    {
        questionId: 2,
        question: '你的年龄段是？',
        options: [
            { option: '18-25', count: 15 },
            { option: '26-35', count: 25 },
            { option: '36-45', count: 35 }
        ]
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
    questionnaireResults.value.forEach((question, index) => {
        const barChartOptions = {
            title: {
                text: '选项选择次数 - 柱状图'
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: question.options.map(o => o.option)
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
            title: {
                text: '选项选择次数 - 饼状图'
            },
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
                        name: o.option
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
</script>

<style scoped>
.barChart,
.pieChart {
    margin: 20px 0;
}
</style>