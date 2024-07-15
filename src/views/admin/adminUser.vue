<script setup>
import {onMounted, reactive, ref} from 'vue'
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {Search} from "@element-plus/icons-vue";
import {accessHeader} from "@/net/index.js";

// dev 用
let userData = ref([])
let total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const background = ref(false)
const disabled = ref(false)
const isSearching = ref(false)

const fetchUserData = async (pageNum = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`/api/admin/selectAll?pageNum=${pageNum}&pageSize=${pageSize}`, {
      headers: {
        ...accessHeader()
      },
      params: {
        timestamp: new Date().getTime()
      }
    });
    console.log(response)
    total.value = response.data.data.totle
    userData.value = response.data.data.items.map(item => {
      item.user.createTime = formatDateTime(item.user.createTime)
      item.user.updateTime = item.user.updateTime ? formatDateTime(item.user.updateTime) : item.user.createTime
      return item
    })
  } catch (error) {
    console.error('读取用户数据时发生错误: ', error);
  }
}

onMounted(() => {
  fetchUserData(currentPage.value, pageSize.value);
})

const input = ref('')
let result = ref([]);

// 处理搜索逻辑
const handleSearch = async () => {
  isSearching.value = true
  try {
    const response = await axios.get(`/api/admin/selectOneByNameUnClear`, {
      headers: {
        ...accessHeader()
      },
      params: {
        name: input.value,
        timestamp: new Date().getTime()
      }
    });
    if (response.status === 200) {
      result.value = response.data.data.map(item => {
        item.createTime = formatDateTime(item.createTime)
        item.updateTime = item.updateTime ? formatDateTime(item.updateTime) : item.createTime
        return item
      })
      console.log('搜索结果:', result.value)
    } else {
      console.error('搜索失败:', response.status);
    }
  } catch
      (error) {
    console.error('搜索失败:', error);
  }
}

const clearSearch = () => {
  isSearching.value = false
  input.value = ''
  fetchUserData(currentPage.value, pageSize.value);
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
    const response = await axios.post('/api/admin/addUser', {
      name: user.name,
      password: user.password
    }, {
      headers: {
        'Content-Type': 'application/json',
        ...accessHeader()
      }
    });
    if (response.status === 200) {
      ElMessage.success("新增企业成功！");
      dialogVisible.value = false;
      user.name = '';
      user.password = '';
      await fetchUserData(currentPage.value, pageSize.value);
    }
  } catch (error) {
    ElMessage.error("新增企业失败");
    console.error('新增企业失败: ', error);
  }
};

const selectedUsers = ref([]);
const userTableRef = ref(null);
const searchTableRef = ref(null);
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
  searchTableRef.value?.clearSelection();
};

const deleteUsers = async () => {
  try {
    const ids = selectedUsers.value.map(item => item.user.id);
    const response = await axios.delete(`/api/admin/deleteBatchById?ids=${ids}`, {
      headers: {
        ...accessHeader()
      }
    });
    if (response.status === 200) {
      selectedUsers.value = [];
      await fetchUserData(currentPage.value, pageSize.value);
      ElMessage.success("删除用户成功！");
    } else {
      console.error('删除用户失败:', response);
    }
  } catch (error) {
    console.error('删除用户失败:', error);
  }
};

const handleEdit = (id) => {
  // todo
  console.log('edit')
}
const handleDelete = async (id) => {
  try {
    const response = await axios.delete(`/api/admin/deleteOneById`, {
      params: {
        id: id,
        timestamp: new Date().getTime()
      },
      headers: {
        ...accessHeader()
      }
    });
    if (response.status === 200) {
      ElMessage.success("删除企业成功！");
      if (isSearching.value) {
        await handleSearch();
      } else {
        await fetchUserData(currentPage.value, pageSize.value);
      }
    } else {
      ElMessage.error("删除企业失败");
    }
  } catch (error) {
    ElMessage.error("删除企业失败");
    console.error('删除企业失败: ', error);
  }
}

const formatDateTime = (time) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  return new Intl.DateTimeFormat('zh-CN', options).format(new Date(time));
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
            <template #append>
              <el-button @click="handleSearch">
                <el-icon>
                  <Search/>
                </el-icon>
              </el-button>
            </template>
          </el-input>
        </div>

      </div>
    </template>


    <!-- 卡片内容 -->
    <el-table v-show="!isSearching" ref="userTableRef" :data="userData" style="width: 100% "
              @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" width="55"/>
      <el-table-column prop="user.id" label="ID" min-width="80"/>
      <el-table-column fixed prop="user.name" label="名称" width="120"/>
      <el-table-column prop="user.president" label="代表人" min-width="120"/>
      <el-table-column prop="user.email" label="邮箱" min-width="200"/>
      <el-table-column prop="user.businessScope" label="经营范围" min-width="200"/>
      <el-table-column prop="user.createTime" label="创建时间" min-width="120"/>
      <el-table-column prop="user.updateTime" label="更新时间" min-width="120"/>
      <el-table-column fixed="right" prop="operation" label="操作" min-width="100">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row.user.id)">编辑</el-button>
            <el-button link type="warning" size="small" @click="handleDelete(scope.row.user.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-show="isSearching" ref="searchTableRef" :data="result" style="width: 100% "
              @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" width="55"/>
      <el-table-column prop="id" label="ID" min-width="80"/>
      <el-table-column fixed prop="name" label="名称" width="120"/>
      <el-table-column prop="president" label="代表人" min-width="120"/>
      <el-table-column prop="email" label="邮箱" min-width="200"/>
      <el-table-column prop="businessScope" label="经营范围" min-width="200"/>
      <el-table-column prop="createTime" label="创建时间" min-width="120"/>
      <el-table-column prop="updateTime" label="更新时间" min-width="120"/>
      <el-table-column fixed="right" prop="operation" label="操作" min-width="100">
        <template #default="scope">
          <div class="operation-buttons">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row.user.id)">编辑</el-button>
            <el-button link type="warning" size="small" @click="handleDelete(scope.row.user.id)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="button-container">
      <el-button size="default" @click="clearSelections">
        重置选择
      </el-button>
      <el-button
          size="default"
          @click="deleteUsers"
          type="danger"
          :disabled="!selectedUsers.length"
      >批量删除
      </el-button>
      <el-button type="primary" size="default" plain @click="dialogVisible = true">
        添加
      </el-button>
      <el-button v-show="isSearching" size="default" @click="clearSearch">
        退出搜索
      </el-button>
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

    <!-- 卡片底部 -->
    <div class="pagination-block">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          v-show="!isSearching"
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
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.button-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

</style>