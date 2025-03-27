<template>
  <div class="container-fluid py-4 px-5">
    <div class="row">
      <div class="col-12">
        <div class="card border shadow-xs mb-4">
          <div
            class="card-header border-bottom pb-0 d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="font-weight-semibold text-lg mb-0">动态管理</h6>
              <p class="text-sm">查看和管理所有动态信息</p>
            </div>
            <button class="btn btn-sm btn-primary" @click="showAddModal">添加动态</button>
          </div>

          <div class="card-body px-0 py-0">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7">动态内容</th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">
                      发布者
                    </th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">
                      发布时间
                    </th>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7 text-center">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="dynamic in dynamicList" :key="dynamic.dynamicId">
                    <td>{{ dynamic.dynamicSummary }}</td>
                    <td class="text-center">{{ dynamic.fullName }}</td>
                    <td class="text-center">{{ dynamic.createdAt }}</td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="viewDynamic(dynamic.dynamicId)"
                      >
                        查看
                      </button>
                      <button class="btn btn-sm btn-outline-warning" @click="editDynamic(dynamic)">
                        编辑
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteDynamic(dynamic.dynamicId)"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- 分页按钮 -->
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

    <!-- 查看动态的模态框 -->
    <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">查看动态</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="content" class="form-label">动态内容</label>
                <textarea
                  id="content"
                  v-model="formData.content"
                  class="form-control"
                  readonly
                  rows="4"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="publisher" class="form-label">发布者</label>
                <input
                  type="text"
                  id="publisher"
                  v-model="formData.publisher"
                  class="form-control"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label for="createdAt" class="form-label">发布时间</label>
                <input
                  type="text"
                  id="createdAt"
                  v-model="formData.createdAt"
                  class="form-control"
                  readonly
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import httpInstance from "@/utils/http"; // 引入http实例

// 动态列表数据
const dynamicList = ref([]);
// 当前页码
const currentPage = ref(1);
// 总页数
const totalPages = ref(1);

// 控制模态框显示
const showModal = ref(false);
const isEdit = ref(false);
const formData = reactive({
  id: null,
  content: "",
  publisher: "",
});

// 获取动态列表
const fetchDynamicList = async () => {
  try {
    const response = await httpInstance.get("/admin/dynamic/list", {
      params: {
        pageNum: currentPage.value,
        pageSize: 8,
      },
    });
    console.log("获取动态列表", response.data);
    if (response.code === 200) {
      dynamicList.value = response.data.rows; // 更新动态列表
      totalPages.value = Math.ceil(response.data.total / 10); // 计算总页数
    }
  } catch (error) {
    console.error("获取动态列表失败:", error);
  }
};

// 显示添加动态模态框
const showAddModal = () => {
  isEdit.value = false;
  formData.content = "";
  formData.publisher = "";
  showModal.value = true;
};

// 显示编辑动态模态框
const editDynamic = (dynamic) => {
  isEdit.value = true;
  formData.id = dynamic.dynamicId;
  formData.content = dynamic.dynamicSummary; // 显示动态内容
  formData.publisher = dynamic.fullName; // 显示发布者
  showModal.value = true;
};

// 提交动态表单（新增或更新）
const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      // 更新动态
      await httpInstance.put(`/admin/dynamic/update/${formData.id}`, formData);
    } else {
      // 添加动态
      await httpInstance.post("/admin/dynamic/create", formData);
    }
    fetchDynamicList(); // 刷新动态列表
    closeModal(); // 关闭模态框
  } catch (error) {
    console.error("操作动态失败:", error);
  }
};

// 删除动态
const deleteDynamic = async (dynamicId) => {
  try {
    await httpInstance.delete(`/admin/dynamic/delete/${dynamicId}`);
    fetchDynamicList(); // 刷新动态列表
  } catch (error) {
    console.error("删除动态失败:", error);
  }
};

// 查看动态详情
const viewDynamic = async (dynamicId) => {
  try {
    const response = await httpInstance.get(`/admin/dynamic/${dynamicId}`);
    if (response.code === 200) {
      const dynamicData = response.data; // 假设响应数据包含动态详情
      formData.content = dynamicData.dynamicSummary;
      formData.publisher = dynamicData.fullName;
      formData.createdAt = dynamicData.createdAt; // 显示发布时间
      formData.id = dynamicData.dynamicId; // 设置动态ID，便于后续编辑

      showModal.value = true; // 显示模态框
    } else {
      console.error("获取动态详情失败:", response.message);
    }
  } catch (error) {
    console.error("获取动态详情失败:", error);
  }
};

// 关闭模态框
const closeModal = () => {
  showModal.value = false;
  formData.content = "";
  formData.publisher = "";
};

// 切换页面
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDynamicList(); // 获取对应页面的数据
  }
};

// 初始化动态列表
onMounted(() => {
  fetchDynamicList();
});
</script>

<style scoped>
/* 这里可以写一些特定的样式 */
</style>
