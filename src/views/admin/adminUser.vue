<script setup>
import {onMounted, reactive, ref} from 'vue'
import axios from "axios";
import {ElMessage} from "element-plus";

let userData = ref([])
let total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(false)
const disabled = ref(false)


const fetchUserData = async (pageNum = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`http://47.121.187.213:8080/admin/selectAll?pageNum=${pageNum}&pageSize=${pageSize}`);
    console.log(response)
    total = response.data.total
    userData = response.data.items
  } catch (error) {
    console.error('读取用户数据时发生错误: ', error);
  }
}

onMounted(() => {
  fetchUserData(currentPage.value, pageSize.value);
})

// 分页变化的方法
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchUserData(currentPage.value, pageSize.value);
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchUserData(currentPage.value, pageSize.value);
};

// 弹出添加窗口可见行
const dialogVisible = ref(false);

// 新增企业信息
const user = reactive({
  name: '',
  password: ''
});

// 管理员添加企业的方法
const handleAdd = async () => {
  try {
    const response = await axios.post('http://47.121.187.213:8080/admin/addUser', {
      name: user.name,
      password: user.password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      ElMessage.success("新增企业成功！");
      dialogVisible.value = false;
      user.name = '';
      user.password = '';
    }
  } catch (error) {
    ElMessage.error("新增企业失败");
    console.error('新增企业失败: ', error);
  }
};

const handleEdit = () => {
  console.log('edit')
}
const handleDelete = () => {
  console.log('delete')
}

</script>


<template>
  <el-card style="width: 100%">
    <!-- 卡片头部 -->
    <template #header>
      <div class="card-header">
        <span>企业管理</span>
        <el-button type="primary" size="small" plain @click="dialogVisible = true">添加</el-button>
        <!-- 添加企业信息弹窗 -->
        <el-dialog :visible.sync="dialogVisible" title="添加企业信息" draggable>
          <el-form :model="user" label-width="120px">
            <el-form-item label="企业名称">
              <el-input v-model="user.name" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="user.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleAdd">确认</el-button>
          </span>
        </el-dialog>
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
        <template #default>
          <div class="operation-buttons">
            <el-button link type="primary" size="small" @click="handleEdit">编辑</el-button>
            <el-button link type="warning" size="small" @click="handleDelete">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 卡片底部 -->
    <div class="pagination-block">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :size="'default'"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>


<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  text-align: right;
}

.operation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.pagination-block {
  text-align: center;
  padding: 20px;
}


</style>