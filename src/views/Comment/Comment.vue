<template>
  <div class="container-fluid py-4 px-5">
    <div class="row">
      <div class="col-12">
        <div class="card border shadow-xs mb-4">
          <div
            class="card-header border-bottom pb-0 d-flex align-items-center justify-content-between"
          >
            <div>
              <h6 class="font-weight-semibold text-lg mb-0">评论管理</h6>
              <p class="text-sm">查看和管理所有评论</p>
            </div>
            <button class="btn btn-sm btn-primary" @click="showAddModal">添加评论</button>
          </div>

          <div class="card-body px-0 py-0">
            <div class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="text-secondary text-xs font-weight-semibold opacity-7">评论内容</th>
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
                  <tr v-if="loading">
                    <td colspan="4" class="text-center py-4">加载中...</td>
                  </tr>
                  <tr v-else-if="commentList.length === 0">
                    <td colspan="4" class="text-center py-4">暂无评论</td>
                  </tr>
                  <tr v-for="comment in commentList" :key="comment.commentId">
                    <td>{{ comment.content }}</td>
                    <td class="text-center">{{ comment.username }}</td>
                    <td class="text-center">{{ comment.createdAt }}</td>
                    <td class="text-center">
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="viewChildren(comment.commentId)"
                      >
                        查看子评论
                      </button>
                      <button class="btn btn-sm btn-outline-warning" @click="editComment(comment)">
                        编辑
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteComment(comment.commentId)"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- 分页 -->
              <div class="border-top py-3 px-3 d-flex align-items-center justify-content-between">
                <button
                  class="btn btn-sm btn-white"
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                >
                  上一页
                </button>
                <nav aria-label="分页">
                  <ul class="pagination pagination-light mb-0">
                    <li
                      v-for="(page, index) in totalPages"
                      :key="index"
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a
                        class="page-link font-weight-bold"
                        href="javascript:;"
                        @click="changePage(page)"
                      >
                        {{ page }}
                      </a>
                    </li>
                  </ul>
                </nav>
                <button
                  class="btn btn-sm btn-white"
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import httpInstance from "@/utils/http"; // 引入http实例

const commentList = ref([]);
const loading = ref(false);
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
});

// 获取评论列表
const fetchCommentList = async () => {
  loading.value = true;
  try {
    const response = await httpInstance.get("/admin/comment/list", {
      params: {
        pageNum: pagination.pageNum,
        pageSize: pagination.pageSize,
      },
    });
    if (response.code === 200) {
      commentList.value = response.data.rows;
      pagination.total = response.data.total;
    }
  } catch (error) {
    console.error("获取评论列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 计算总页数
const totalPages = computed(() => {
  return pagination.total ? Math.ceil(pagination.total / pagination.pageSize) : 1;
});

// 页码变化时更新
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    pagination.pageNum = page;
    fetchCommentList();
  }
};

// 初始化评论列表
onMounted(() => {
  fetchCommentList();
});
</script>

<style scoped>
/* 自定义分页按钮样式 */
.page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}
.page-link {
  cursor: pointer;
}
</style>
