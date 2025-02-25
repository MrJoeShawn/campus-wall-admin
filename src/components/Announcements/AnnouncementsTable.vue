<template>
  <div class="card border shadow-xs mb-4">
    <div class="card-header border-bottom pb-0">
      <div class="d-sm-flex align-items-center mb-3">
        <div>
          <h6 class="font-weight-semibold text-lg mb-0">校园公告</h6>
          <p class="text-sm mb-sm-0">下面是所有的校园公告和状态</p>
        </div>
        <div class="ms-auto d-flex">
          <div class="input-group input-group-sm ms-auto me-2">
            <span class="input-group-text text-body">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16px"
                height="16px"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                ></path>
              </svg>
            </span>
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="搜索公告"
              v-model="searchQuery"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="card-body px-0 py-0">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <thead class="bg-gray-100">
            <tr>
              <th class="text-secondary text-xs font-weight-semibold opacity-7">发布用户</th>
              <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">公告内容</th>
              <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">发布时间</th>
              <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">点赞</th>
              <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">评论</th>
              <th class="text-secondary text-xs font-weight-semibold opacity-7 ps-2">浏览</th>
              <th class="text-center text-secondary text-xs font-weight-semibold opacity-7">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(announcement, index) in filteredAnnouncements" :key="index">
              <td>
                <div class="d-flex px-2">
                  <div class="avatar avatar-sm rounded-circle bg-gray-100 me-2 my-2">
                    <img
                      :src="announcement.profilePictureUrl"
                      class="w-80"
                      :alt="announcement.fullName"
                    />
                  </div>
                  <div class="my-auto">
                    <h6 class="mb-0 text-sm">{{ announcement.fullName }}</h6>
                  </div>
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <img :src="announcement.dynamicCover" class="cover-img me-2" alt="封面" />
                  <p class="text-sm font-weight-normal mb-0 dynamic-summary">
                    {{ announcement.dynamicSummary }}
                  </p>
                </div>
              </td>

              <td>
                <span class="text-sm font-weight-normal">{{ announcement.createdAt }}</span>
              </td>
              <td>
                <span class="badge border border-success text-success bg-success">{{
                  announcement.likeCount
                }}</span>
              </td>
              <td>
                <span class="badge bg-info text-info border border-info text-info">{{
                  announcement.commentCount
                }}</span>
              </td>
              <td>
                <span
                  class="badge bg-secondary bg-secondary text-secondary border border-secondary"
                  >{{ announcement.viewCount }}</span
                >
              </td>
              <td>
                <!-- 启用 / 停用公告（置顶功能） -->
                <button
                  class="badge badge-sm border"
                  :class="
                    announcement.isTop === 1
                      ? 'bg-success border-success text-success'
                      : 'bg-secondary border-secondary text-secondary'
                  "
                  @click="toggleTopStatus(announcement)"
                >
                  {{ announcement.isTop === 1 ? "取消置顶" : "置顶公告" }}
                </button>

                <!-- 编辑公告 -->
                <button
                  class="badge badge-sm border bg-warning border-warning text-warning ms-2"
                  @click="editAnnouncement(announcement)"
                >
                  编辑公告
                </button>

                <!-- 删除公告 -->
                <button
                  class="badge badge-sm border bg-danger border-danger text-danger ms-2"
                  @click="deleteAnnouncement(announcement)"
                >
                  删除公告
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页 -->
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
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  getAdminCampusAnnouncementsList,
  updateAnnouncementStatus,
  deleteDynamic,
} from "@/api/dynamic.js";
import { ElMessage, ElMessageBox } from "element-plus";

// 搜索框数据绑定
const searchQuery = ref("");
const announcements = ref([]);
const currentPage = ref(1);
const pageSize = ref(10); // 你可以修改此值
const totalRecords = ref(0); // 存储后端返回的 total

// 计算总页数
const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value));

// 过滤后的数据（搜索）
const filteredAnnouncements = computed(() => {
  return announcements.value.filter((item) =>
    item.dynamicSummary.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 获取公告数据
const fetchAnnouncements = async () => {
  try {
    console.log("📢 正在获取第", currentPage.value, "页数据...");
    const response = await getAdminCampusAnnouncementsList(currentPage.value, pageSize.value);

    if (response.code === 200) {
      announcements.value = response.data.rows;
      totalRecords.value = parseInt(response.data.total);
      console.log("✅ 数据获取成功:", announcements.value);
    }
  } catch (error) {
    console.error("❌ 获取校园公告失败:", error);
  }
};

// 切换页码
const changePage = (newPage) => {
  if (newPage > 0 && newPage <= totalPages.value) {
    currentPage.value = newPage;
    fetchAnnouncements();
  }
};

// 组件加载时获取数据
onMounted(() => {
  fetchAnnouncements();
});

// 切换 "启用 / 停用公告" (置顶状态)
const toggleTopStatus = async (announcement) => {
  const newStatus = announcement.isTop === 1 ? 0 : 1; // 1=置顶，0=取消置顶
  const actionText = newStatus === 1 ? "置顶" : "取消置顶";

  try {
    // 显示确认框
    await ElMessageBox.confirm(`你确定要${actionText}这条公告吗？`, "操作确认", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    });

    // 调用后端 API 更新状态
    const response = await updateAnnouncementStatus(announcement.dynamicId, newStatus);

    if (response.code === 200) {
      // 更新前端 UI
      announcement.isTop = newStatus;
      ElMessage.success(`公告 ${actionText} 成功！`);
    } else {
      ElMessage.error(response.msg);
    }
  } catch (error) {
    console.error("❌ 更新公告状态失败:", error);
    ElMessage.error("操作取消或失败！");
  }
};

// 编辑公告
const editAnnouncement = (announcement) => {
  window.open(`/createAnnouncements/${announcement.dynamicId}`, "_blank");
};

// 删除公告
const deleteAnnouncement = async (announcement) => {
  try {
    // 1. 弹出确认框
    await ElMessageBox.confirm(
      `你确定要删除公告 "${announcement.dynamicSummary}" 吗？`,
      "删除确认",
      {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    // 2. 发送请求删除公告
    const response = await deleteDynamic(announcement.dynamicId);

    if (response.code === 200) {
      // 3. 从前端数据移除公告
      announcements.value = announcements.value.filter(
        (item) => item.dynamicId !== announcement.dynamicId
      );

      ElMessage.success("公告删除成功！");
    } else {
      ElMessage.error(response.msg || "删除失败");
    }
  } catch (error) {
    console.error("❌ 删除公告失败:", error);
    ElMessage.error("操作取消或删除失败！");
  }
};
</script>

<style scoped>
.cover-img {
  width: 100px; /* 设置最大宽度 */
  height: 60px; /* 设置最大高度 */
  object-fit: cover; /* 保持比例裁剪 */
  border-radius: 5px; /* 圆角优化 */
}

.dynamic-summary {
  width: 130px; /* 限制宽度 */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 限制显示 2 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分用省略号 */
  white-space: normal; /* 允许换行 */
  word-break: break-word; /* 防止单词过长不换行 */
}

/* 让表头和单元格居中 */
table th,
table td {
  text-align: center;
  vertical-align: middle;
}

/* 让表格内容（如 div）居中 */
table td div {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 让按钮（badge）居中 */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
}
</style>
