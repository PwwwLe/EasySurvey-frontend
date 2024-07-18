<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import QuestionItem from '@/components/analyzeComponents/QuestionItem.vue';
import { getNums, get } from "@/net"



const props = defineProps({
  questions: {
    type: Array,
    required: true
  }
});

function fetchNums(question) {
  return new Promise((resolve, reject) => {
      getNums(question.id, (response) => {
        console.log(response.data)
        if (response && Array.isArray(response.data)) {
          resolve({ question, data: response.data });
        } else {
          reject(new Error(`Data for question id ${question.id} is not an array`));
        }
      });
    });
}

const allData = ref([]);


onMounted(async () => {
  await watch(() => props.questions, async (questions) => {
    if (questions && questions.length > 0) {
      console.log("questions",props.questions)
      const promises = props.questions.map(fetchNums);

      try {
        const results = await Promise.all(promises);
        const formattedData = results.map(({ question, data }) => {
          const total = data.reduce((sum, option) => sum + option, 0);
          const options = question.optionVos.map((option, index) => ({
            label: "选项"+String.fromCharCode(65 + index), // A, B, C, D
            text: option.text,
            percentage: total ? ((data[index]/ total) * 100).toFixed(2) : 0,
            count: data[index]
          }));
          return {
            title: question.title,
            options
          };
        });

        allData.value = formattedData;
        console.log("allData:", allData.value);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  },{ immediate: true });
});



</script>
<template>
  <div class="questionnaire-list">
    <QuestionItem
      v-for="(question, index) in allData" 
      :key="index" 
      :questionTitle="question.title" 
      :options="question.options"
    />
  </div>
</template>



<style scoped>
.questionnaire-list {
  padding-top: 20px;
  padding-bottom: 50px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 50px;
}
</style>

  

  