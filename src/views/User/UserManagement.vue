<template>
  <div class="container-fluid py-4 px-5">
    <div class="row">
      <div class="col-12">
        <div class="card border shadow-xs mb-4">
          <div
            class="card-header border-bottom pb-0 d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="font-weight-semibold text-lg mb-0">用户列表</h6>
              <p class="text-sm">查看所有用户信息</p>
            </div>
            <button class="btn btn-sm btn-primary" @click="showAddUserModal">添加用户</button>
          </div>

          <div class="card-body px-0 py-0">
            <div class="border-bottom py-3 px-3 d-flex align-items-center">
              <div class="input-group w-sm-25 ms-auto">
                <span class="input-group-text text-body">
                  <i class="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="搜索用户"
                  v-model="filters.searchQuery"
                />
              </div>
            </div>

            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7">用户</th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">专业</th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">
                      学校
                    </th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">
                      状态
                    </th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">
                      注册时间
                    </th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in filteredUsers" :key="user.id">
                    <td>
                      <div class="d-flex px-2 py-1">
                        <img
                          :src="user.avatar"
                          class="avatar avatar-sm rounded-circle me-2"
                          alt="user"
                        />
                        <div class="d-flex flex-column justify-content-center ms-1">
                          <h6 class="mb-0 text-sm font-weight-semibold">{{ user.name }}</h6>
                          <p class="text-sm text-secondary mb-0">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td>{{ user.major }}</td>
                    <td class="text-center">{{ user.school }}</td>
                    <td class="text-center">
                      <span
                        class="badge badge-sm"
                        :class="{
                          'badge-success': user.status === '启用',
                          'badge-secondary': user.status === '注销',
                        }"
                      >
                        {{ user.status }}
                      </span>
                    </td>
                    <td class="text-center">{{ user.registeredDate }}</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-primary" @click="viewUser(user)">
                        查看详情
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="handleDeleteUser(user.id)"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="border-top py-3 px-3 d-flex align-items-center">
              <button
                class="btn btn-sm btn-white"
                @click="changePage(currentPage - 1)"
                :disabled="currentPage === 1"
              >
                上一页
              </button>
              <nav aria-label="..." class="ms-auto">
                <ul class="pagination pagination-light mb-0">
                  <li
                    v-for="(page, index) in totalPages"
                    :key="index"
                    class="page-item"
                    :class="{ active: currentPage === index + 1 }"
                  >
                    <a
                      class="page-link font-weight-bold"
                      href="javascript:;"
                      @click="changePage(index + 1)"
                    >
                      {{ index + 1 }}
                    </a>
                  </li>
                </ul>
              </nav>
              <button
                class="btn btn-sm btn-white ms-auto"
                @click="changePage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户详情模态框 -->
    <div v-if="showUserDetail" class="modal fade show" tabindex="-1" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">用户详情</h5>
            <button type="button" class="btn-close" @click="closeUserDetailModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedUser">
              <p><strong>全名:</strong> {{ selectedUser.fullName }}</p>
              <p><strong>邮箱:</strong> {{ selectedUser.email }}</p>
              <p><strong>专业:</strong> {{ selectedUser.major }}</p>
              <p><strong>学校:</strong> {{ selectedUser.school }}</p>
              <p><strong>状态:</strong> {{ selectedUser.enabled ? "启用" : "禁用" }}</p>
              <p><strong>注册时间:</strong> {{ selectedUser.createdAt }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeUserDetailModal">
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { getUserById, getAllUserInfo, addUser, deleteUser as apiDeleteUser } from "@/api/user";

const users = ref([]);
const selectedUser = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);
const totalUsers = ref(0);
const pageSize = ref(6);
const filters = reactive({ searchQuery: "" });
const showUserDetail = ref(false);

// 用户表单数据
const newUser = reactive({
  fullName: "",
  email: "",
  major: "",
  school: "",
});

// 控制添加用户模态框的显示
const showAddUser = ref(false);

// 过滤后的用户列表
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    return user.name.toLowerCase().includes(filters.searchQuery.toLowerCase());
  });
});

// 获取用户数据
const fetchUsers = async (pageNum = 1) => {
  try {
    const response = await getAllUserInfo(pageNum, pageSize.value);
    if (response.code === 200) {
      const data = response.data;
      users.value = data.records.map((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.email,
        major: user.major || "未填写",
        school: user.school || "未知",
        registeredDate: user.createdAt.split(" ")[0],
        avatar: user.profilePictureUrl || "https://via.placeholder.com/50",
        status: user.enabled ? "启用" : "注销",
      }));
      currentPage.value = Number(data.current);
      totalPages.value = Number(data.pages);
      totalUsers.value = Number(data.total);
    }
  } catch (error) {
    console.error("请求用户数据失败:", error);
  }
};

// 删除用户
const handleDeleteUser = async (id) => {
  try {
    const response = await apiDeleteUser(id); // 调用重命名后的函数
    if (response.code === 200) {
      fetchUsers(currentPage.value); // 刷新数据
    }
  } catch (error) {
    console.error("删除用户失败:", error);
  }
};

// 打开添加用户模态框
const showAddUserModal = () => {
  showAddUser.value = true;
};

// 关闭添加用户模态框
const closeAddUserModal = () => {
  showAddUser.value = false;
};

// 添加新用户
const handleAddUser = async () => {
  try {
    const response = await addUser(newUser);
    if (response.code === 200) {
      fetchUsers(currentPage.value); // 刷新数据
      closeAddUserModal();
    }
  } catch (error) {
    console.error("添加用户失败:", error);
  }
};

// 切换分页
const changePage = (pageNum) => {
  if (pageNum < 1 || pageNum > totalPages.value) return;
  currentPage.value = pageNum;
  fetchUsers(pageNum);
};

// 查看用户详情
const viewUser = async (user) => {
  console.log("查看用户详情", user);
  try {
    const response = await getUserById(user.id); // 使用用户的 ID 获取详细信息
    console.log("获取用户数据", response);

    if (response.code === 200) {
      selectedUser.value = response.data; // 将用户详情存储到 selectedUser 中
      showUserDetailModal(); // 打开模态框展示用户详情
    } else {
      console.error("获取用户详情失败:", response.message);
    }
  } catch (error) {
    console.error("获取用户详情失败:", error);
  }
};

const showUserDetailModal = () => {
  showUserDetail.value = true; // 控制模态框显示
};

// 关闭用户详情模态框
const closeUserDetailModal = () => {
  showUserDetail.value = false;
};

// 组件加载时获取数据
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped></style>
