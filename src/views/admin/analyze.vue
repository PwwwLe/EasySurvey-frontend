<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import questionnaire from '@/components/questionnaire.vue'
import axios from 'axios'
import { getSurvey, get } from "@/net"
import { ElContainer, ElHeader, ElTabs, ElTabPane, ElMain } from 'element-plus';
import BasicReport from '@/components/analyzeComponents/BasicReport.vue';
import CrossAnalysis from '@/components/analyzeComponents/CrossAnalysis.vue';
import TextAnalysis from '@/components/analyzeComponents/TextAnalysis.vue';
const router = useRouter()

const searchContent = ref('')
const route = useRoute()
const survey_id = route.params.survey_id
const survey_title = route.params.survey_title
const activeTab = ref('basic-report');

onMounted(() => {
    
})

// 定义全局变量
const questionnaires = ref([]);
const DataForBasic = ref([]);
const DataForCross = ref([]);
const DataForText = ref([]);

getSurvey(survey_id, (data) => {
    // console.log("data:", data.data);
    questionnaires.value = data.data;
    // console.log("questionnaires:", questionnaires);
    DataForBasic.value = questionnaires.value.filter(item => item.type === 1 || item.type === 2);
    DataForCross.value = questionnaires.value.filter(item => item.type === 1 || item.type === 2);
    DataForText.value = questionnaires.value.filter(item => item.type === 3);

    // console.log("DataForBasic:", DataForBasic.value);
    // console.log("DataForCross:", DataForCross.value);
    // console.log("DataForText:", DataForText.value);

});





const goback = () => {
  router.back()
}

const handleEdit = (questionnaire) => {
  console.log('Edit:', questionnaire)
  // 编辑问卷逻辑
}

const handleShare = (questionnaire) => {
  console.log('Share:', questionnaire)
  // 转发问卷逻辑
}


</script>

<template>
  <div class="out">
    <div class="header">
      <div class="header-left">
        <el-button
          type="none"
          :icon="ArrowLeft"
          @click="goback"
          style="margin-left: 15px;"
        >
          返回
        </el-button>
      </div>
      <div style="font-size: 24px;margin-right: 60px;margin-top: 20px;">
        {{ survey_title }}
      </div>

    </div>

    <div class="main">
      
    </div>
    
  </div>
  <el-container>
    <el-header>
      <el-tabs
        v-model="activeTab"
        tab-position="top"
        type="card"
        style="width: 100%;"
      >
      <el-tab-pane label="基本报告" name="basic-report">
        <BasicReport v-if="activeTab === 'basic-report'" 
        :key="index" 
        :questions="DataForBasic"/>
      </el-tab-pane>
      <el-tab-pane label="交叉分析" name="cross-analysis">
        <CrossAnalysis v-if="activeTab === 'cross-analysis'" 
        :key="index" 
        :questions="DataForCross"/>
      </el-tab-pane>
      <el-tab-pane label="文本分析" name="text-analysis">
        <TextAnalysis v-if="activeTab === 'text-analysis'" 
        :key="index" 
        :questions="DataForText"/>
      </el-tab-pane>
      </el-tabs>
    </el-header>
  </el-container>
</template>

<style lang="scss" scoped>
.out{
  margin: 0;
  padding: 0;
  // background-color: aqua;
  width: 100%;
  // max-width: 100%;
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: red;
    height: 50px;
    .input-with-select{
      padding-right: 20px;
    }
  }
  
}


  .el-tabs__item {
    flex: 1;
    text-align: center;
    font-size: 50px;
  }

  .el-tab-pane{
    font-size: 20px;
  }
 

</style>