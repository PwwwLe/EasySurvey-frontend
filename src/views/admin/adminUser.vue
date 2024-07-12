<script setup>
import {ref, onMounted} from 'vue'
import axios from "axios";

const userData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(false)
const disabled = ref(false)
const size = "5"

const fetchUserData = async () => {
  try {
    const response = await axios.get('http://47.121.187.213:8080/user/userInfo');
    console.log(response)
    userData.value = response.data;
  } catch (error) {
    console.error('读取用户数据时发生错误: ', error);
  }
}

onMounted(() => {
  fetchUserData();
})

const handleAdd = () => {
  console.log('add')
}
const handleEdit = (val) => {
  console.log('edit')
}
const handleDelete = (val) => {
  console.log('delete')

}

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
}

</script>


<template>
  <el-card style="width: 100%">
    <!-- 卡片头部 -->
    <template #header>
      <div class="card-header">
        <span>企业管理</span>
        <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
      </div>
    </template>

    <!-- 卡片内容 -->
    <el-table :data="userData" style="width: 100%">
      <el-table-column fixed prop="name" label="名称" width="120"/>
      <el-table-column prop="president" label="代表人" min-width="120"/>
      <el-table-column prop="email" label="邮箱" min-width="200"/>
      <el-table-column prop="business_scope" label="经营范围" min-width="200"/>
      <el-table-column prop="create_time" label="创建时间" min-width="120"/>
      <el-table-column prop="update_time" label="更新时间" min-width="120"/>
      <el-table-column fixed="right" prop="operation" label="操作" min-width="100">
        <template #default="{row}">
          <div class="operation-buttons">
            <el-button link type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="warning" size="small" @click="handleDelete(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 卡片底部 -->
    <template #footer>
      <div class="demo-pagination-block">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :size=size
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="20"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </el-card>
</template>


<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.operation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.demo-pagination-block {
  text-align: center;
  padding: 20px;
}


</style>