<script setup>
import { useStore } from "@/store";
import { computed, ref } from "vue";
import Card from "@/components/Card.vue";
import { Avatar } from "@element-plus/icons-vue";
import QuestionnaireItem from "@/components/QuestionnaireItem.vue";
import { get, post, getByUserId, getSurvey, createAnswers, createResponse } from "@/net";
import { format } from "date-fns";
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";

const router = useRouter();

const store = useStore();
const registerTime = computed(() => new Date(store.user.registerTime).toLocaleString());

const questionnaireList = ref([]);

const isWriting = ref(false); //开始填写问卷?

const mySubmittedQuestionnaireList = ref([]);
const myUserId = ref(0);

get("/api/user/userInfo", (data) => {
    console.log(data)
    myUserId.value = data.user.id;
    getByUserId(data.user.id, (data) => {
        console.log(data)
        console.log(data.data)
        //getByUserId(data.user.id, (data) => {
        questionnaireList.value = data.data;
        console.log(questionnaireList)
    })
});


// get(`api/answer/getMyAnswerList`, data => {
//     mySubmittedQuestionnaireList.value = data;
//     console.log(mySubmittedQuestionnaireList.value);
// });

// //拉取当前已激活的问卷列表
// get('api/questionnaire/activeQuestionnaireList', data => {
//     const isWriting = false; //开始填写问卷?
//     questionnaireList.value = data;
//     console.log(questionnaireList);
// });

const dateFormatter = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN");
};

const currentQuestionnaire = ref({});
const currentQuestionnaireDetails = ref({});

const findSubmitted = (id) => {
    return mySubmittedQuestionnaireList.value.find(item => item.id === id) !== undefined;
};

const startWrite = async (item) => {

    console.log(item)
    console.log(item.id)
    isWriting.value = true;

    currentQuestionnaire.value = item;
    console.log(currentQuestionnaire)
    console.log(currentQuestionnaire.value.id)

    //getSurvey(item.id, (data) => {
    getSurvey(12, (data) => {
        console.log(data)
        currentQuestionnaireDetails.value = data.data;
        console.log(currentQuestionnaireDetails)
        console.log(currentQuestionnaireDetails.value.id)
    })


    // // 获取问卷详情信息
    // await get(`api/questionnaire/questionnaireDetails/${item.id}`, data => {
    //     currentQuestionnaireDetails.value = data;
    //     console.log(data);
    // });
}

const answers = ref([]);//表单结果

// TODO 对已经填写过的问卷进行提示操作,并且不让二次填写
const back = () => {
    get(`api/answer/getMyAnswerList`, data => {
        mySubmittedQuestionnaireList.value = data;
    });

    get('api/questionnaire/activeQuestionnaireList', data => {
        const isWriting = false; //开始填写问卷?
        questionnaireList.value = data;
    });
    isWriting.value = false;
    currentQuestionnaire.value = null;
    currentQuestionnaireDetails.value = null;
    answers.value = [];
}

const lineNumToLetter = (lineNum) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return letters[lineNum - 1] || null; // 确保 lineNum 在 1 到 20 之间
}

//保存问卷的函数
// const storeAnswer = () => {

// }


// 提交问卷的函数
const submitQuestionnaire = () => {
    const accountId = store.user.id; // 获取当前登录用户的id
    const flag = 0
    // 判断是否至少填写了一个题目
    //if (currentQuestionnaireDetails.value.some(question => question.answer)) {
    // 遍历每个题目的答案，封装成对象并添加到答案数组中
    currentQuestionnaireDetails.value.forEach((question) => {
        if (flag == 1)
            return;
        console.log(question)
        // const { id: questionnaireId } = currentQuestionnaire.value;
        // const { id: questionnaireDetailsId, answer } = question;

        // // 将多选选项的答案拼接成字符串，使用&@@&分隔
        // const myAnswer =
        //     question.type === 2 ? (answer || []).join('&@@&') : question.answer;

        // // 创建一个包含题目答案信息的对象
        // const answerObject = {
        //     questionnaire_details_id: questionnaireDetailsId,
        //     myanswer: myAnswer,
        // };
        if (question.answer == null && question.required == true) {
            ElMessage.warning("请将问卷填写完整后提交！")
            flag = 1
            return;
        }

        if (question.type == 1) {
            const answerObject = {
                userId: myUserId.value,
                questionId: question.id,
                optionId: question.answer.id,
                textAnswer: lineNumToLetter(question.answer.lineNum)
            }
            answers.value.push(answerObject);
        }
        else if (question.type == 2) {

        }
        else if (question.type == 3) {
            const answerObject = {
                userId: myUserId.value,
                questionId: question.id,
                optionId: question.optionVos[0].id,
                textAnswer: question.answer
            }
            answers.value.push(answerObject);
        }

        // 将答案对象添加到答案数组中
        //answers.value.push(answerObject);
    });

    // 在控制台打印答案数组，用于测试
    console.log(answers)
    console.log(answers.value);

    // 提取实际值并转换为 JSON 字符串
    const actualValues = answers.value.map(item => ({ ...item }));
    const jsonList = JSON.stringify(actualValues, null, 2);

    console.log(actualValues);
    console.log(jsonList);

    createAnswers(jsonList, (data) => {
        console.log(data);
        const response = {
            //userId: myUserId.value,
            userId: 57,
            surveyId: currentQuestionnaire.value.id,
            isSubmit: true
        }
        const jsonResponse = JSON.stringify(response);
        console.log(jsonResponse);
        createResponse(jsonResponse, (data) => {
            console.log(data);
        })
    })


    answers.value = [];
    // } else {
    //     ElMessage.warning("请至少填写一个题目");
    //}
};

</script>


<template>
    <div style="display: flex">
        <div class="settings-left">
            <card title="未填写的问卷" :icon="Avatar" desc="在这里查看您还未填写的问卷调查" v-if="!isWriting">
                <div style="display: flex; flex-wrap: wrap">

                    <div v-for="(item, index) in questionnaireList" :key="index" class="questionnaire-wrapper">
                        <QuestionnaireItem :key="item.id" :title="item.title" :desc="item.description"
                            :createTime="dateFormatter(item.createTime)">
                            <el-button type="primary" plain @click="startWrite(item)"
                                v-if="!findSubmitted(item.id)">开始填写</el-button>
                            <el-button type="info" plain v-if="findSubmitted(item.id)">已填写</el-button>
                        </QuestionnaireItem>
                    </div>
                </div>
            </card>
            <card :title="currentQuestionnaire.title" :icon="Avatar" :desc="currentQuestionnaire.description"
                v-if="isWriting">
                <template v-if="currentQuestionnaireDetails && currentQuestionnaireDetails.length > 0">
                    <div v-for="(question, index ) in currentQuestionnaireDetails" :key="index">
                        <span v-if="question.required" class="required-asterisk">*</span>
                        <span>{{ index + 1 }}. {{ question.title }}</span>
                        <br>
                        <template v-if="question.type === 1">
                            <el-radio-group v-model="question.answer" class="questionnaire-details-item"
                                style="display: flex; flex-wrap: wrap;">
                                <el-radio :label="option" v-for="(option, optionIndex) in question.optionVos"
                                    :key="optionIndex">{{ option.text }}</el-radio>
                            </el-radio-group>
                        </template>
                        <template v-else-if="question.type === 2">
                            <el-checkbox-group v-model="question.answer" class="questionnaire-details-item">
                                <el-checkbox :label="option" v-for="(option, optionIndex) in question.optionVos"
                                    :key="optionIndex">{{ option.text }}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                        <template v-else-if="question.type === 3">
                            <el-input v-model="question.answer" placeholder="请输入文本" style="max-width: 900px;"
                                class="questionnaire-details-item"></el-input>
                        </template>
                    </div>
                </template>
                <template else>
                    <div>暂无题目</div>
                </template>
                <el-button type="primary" @click="back" class="questionnaire-details-item">返回</el-button>
                <!-- <el-button type="primary" @click="storeAnswer" class="questionnaire-details-item">保存</el-button> -->
                <el-button type="primary" @click="submitQuestionnaire"
                    class="questionnaire-details-item">提交问卷</el-button>
            </card>
        </div>
    </div>


</template>

<style scoped>
.settings-left {
    flex: 1;
    margin: 20px;
}

.settings-right {
    width: 300px;
    margin: 20px 30px 20px 0;
}

.questionnaire-wrapper {
    width: 25%;
    /* 每个小模块占据20%的宽度 */
    padding: 10px;
    box-sizing: border-box;
}

.questionnaire-details-item {
    margin: 10px 5px 10px 5px;
    /* margin-top: 100px; */
}

.required-asterisk {
    color: red;
    margin-right: 5px;
}
</style>
