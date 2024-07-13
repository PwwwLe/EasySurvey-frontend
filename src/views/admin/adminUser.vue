<script setup>
import {onMounted, reactive, ref} from 'vue'
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {Search} from "@element-plus/icons-vue";

// dev 用
let userData = ref([
  {
    id: 123,
    name: '企业1',
    president: '张三',
    email: 'pwwwle@gmail.com',
    business_scope: 'IT',
    create_time: '2021-09-01',
    update_time: '2021-09-01'
  },
  {
    id: 234,
    name: '企业2',
    president: '李四',
    email: 'rtyuiohg@qq.com',
    business_scope: 'IT',
    create_time: '2021-09-01',
    update_time: '2021-09-01'
  },
  {
    id: 345,
    name: '企业3',
    president: '王五',
    email: 'sbfnioeaibfi@163.com',
    business_scope: 'IT',
    create_time: '2021-09-01',
    update_time: '2021-09-01'
  },
])
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

const input = ref('')
const results = ref([]);

// 处理搜索逻辑
const handleSearch = async () => {
  try {
    const response = await axios.get(`http://47.121.187.213:8080/admin/selectOneByNameUnClear`, {
      params: {
        name: input.value
      }
    });
    if (response.status === 200) {
      results.value = response.data
      console.log('搜索结果:', results.value)
    } else {
      console.error('搜索失败:', response.status);
    }
  } catch (error) {
    console.error('搜索失败:', error);
  }
}

// 分页变化的方法
const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchUserData(currentPage.value, pageSize.value);
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchUserData(currentPage.value, pageSize.value);
};

// 新增企业信息
const user = reactive({
  name: '',
  password: ''
});

// 管理员添加企业的方法
const handleAdd = async () => {
  console.log("add")
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

const selectedUsers = ref([]);
const userTableRef = ref(null);
const dialogVisible = ref(false)

const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭？')
      .then(() => {
        done()
      })
      .catch(() => {
        ElMessage.info('取消关闭')
      })
}

const handleSelectionChange = (selection) => {
  selectedUsers.value = selection;
  console.log('Selected users:', selectedUsers.value);
};

const clearSelections = () => {
  userTableRef.value?.clearSelection();
};

const deleteUsers = () => {
  // todo
  console.log('delete users:', selectedUsers.value);
};

const handleEdit = () => {
  // todo
  console.log('edit')
}
const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`http://47.121.187.213:8080/admin/deleteOneById`, {
      params: {
        id: id
      }
    });
    if (response.status === 200) {
      ElMessage.success("删除企业成功！");
      await fetchUserData(currentPage.value, pageSize.value);
    } else {
      ElMessage.error("删除企业失败");
    }
  } catch (error) {
    ElMessage.error("删除企业失败");
    console.error('删除企业失败: ', error);
  }
}
</script>


<template>
  <el-card style="width: 100%">
    <!-- 卡片头部 -->
    <template #header>
      <div class="card-header">
        <span>企业管理</span>
        <!-- 搜索框 -->
        <div class="search">
          <el-input
              v-model="input"
              style="max-width: 600px"
              placeholder="请输入企业名称"
              class="input-with-select"
          >
            <template #prepend>
              <el-button @click="handleSearch">
                <el-icon>
                  <Search/>
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        <el-button type="primary" size="default" plain @click="dialogVisible=true">添加</el-button>
        <!-- 添加企业信息弹窗 -->
        <el-dialog v-model="dialogVisible" title="添加企业信息" :before-close="handleClose" draggable>
          <el-form :model="user" label-width="120px">
            <el-form-item label="企业名称">
              <el-input v-model="user.name" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="user.password" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
          </el-form>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleAdd">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </template>


    <!-- 卡片内容 -->
    <el-table ref="userTableRef" :data="userData" style="width: 100% " @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" width="55"/>
      <el-table-column prop="id" label="ID" min-width="80"/>
      <el-table-column fixed prop="name" label="名称" width="120"/>
      <el-table-column prop="president" label="代表人" min-width="120"/>
      <el-table-column prop="email" label="邮箱" min-width="200"/>
      <el-table-column prop="business_scope" label="经营范围" min-width="200"/>
      <el-table-column prop="create_time" label="创建时间" min-width="120"/>
      <el-table-column prop="update_time" label="更新时间" min-width="120"/>
      <el-table-column fixed="right" prop="operation" label="操作" min-width="100">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button link type="primary" size="small" @click="handleEdit">编辑</el-button>
            <el-button link type="warning" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin-top: 20px">
      <el-button size="default" @click="clearSelections">
        重置选择
      </el-button>
      <el-button size="default" @click="deleteUsers" type="danger">批量删除</el-button>
    </div>

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

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}
</style>