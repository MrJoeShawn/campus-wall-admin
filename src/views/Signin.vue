<template>
  <div>
    <div class="container position-sticky z-index-sticky top-0">
      <div class="row">
        <div class="col-12">
          <!-- 导航栏 -->
          <nav
            class="navbar navbar-expand-lg blur border-radius-sm top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4"
          >
            <div class="container-fluid px-1">
              <a class="navbar-brand font-weight-bolder ms-lg-0" href="./index.html">CampusWall</a>
              <button
                class="navbar-toggler shadow-none ms-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navigation"
                aria-controls="navigation"
                aria-expanded="false"
                aria-label="切换导航"
              >
                <span class="navbar-toggler-icon mt-2">
                  <span class="navbar-toggler-bar bar1"></span>
                  <span class="navbar-toggler-bar bar2"></span>
                  <span class="navbar-toggler-bar bar3"></span>
                </span>
              </button>
              <div class="collapse navbar-collapse" id="navigation">
                <ul class="navbar-nav mx-auto ms-xl-auto">
                  <li class="nav-item">
                    <a class="nav-link d-flex align-items-center me-2" href="./sign-up.html">
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="opacity-6 me-1"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      注册
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link d-flex align-items-center me-2 text-dark font-weight-bold"
                      href="./sign-in.html"
                    >
                      <svg
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="text-dark me-1"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      登录
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content mt-0">
      <section>
        <div class="page-header min-vh-100">
          <div class="container">
            <div class="row">
              <div class="col-xl-4 col-md-6 d-flex flex-column mx-auto">
                <div class="card card-plain mt-8">
                  <div class="card-header pb-0 text-left bg-transparent">
                    <h3 class="font-weight-black text-dark display-6">欢迎回来</h3>
                    <p class="mb-0">欢迎回来！请输入您的信息。</p>
                  </div>
                  <div class="card-body">
                    <form role="form">
                      <label>账号</label>
                      <div class="mb-3">
                        <input
                          type="text"
                          v-model="username"
                          class="form-control"
                          placeholder="请输入您的账号"
                          aria-label="Name"
                          aria-describedby="name-addon"
                        />
                      </div>
                      <label>密码</label>
                      <div class="mb-3">
                        <input
                          type="password"
                          v-model="password"
                          class="form-control"
                          placeholder="请输入密码"
                          aria-label="Password"
                          aria-describedby="password-addon"
                        />
                      </div>
                      <div class="d-flex align-items-center"></div>
                      <div class="text-center">
                        <button
                          type="button"
                          class="btn btn-dark w-100 mt-4 mb-3"
                          @click="handleLogin"
                          :disabled="isLoading"
                        >
                          <span v-if="isLoading">登录中...</span>
                          <span v-else>登录</span>
                        </button>
                      </div>
                      <p v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</p>
                    </form>
                  </div>
                  <div class="card-footer text-center pt-0 px-lg-2 px-1">
                    <p class="mb-4 text-xs mx-auto">
                      没有账号？
                      <a href="sign-up.html" class="text-dark font-weight-bold">注册</a>
                    </p>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="position-absolute w-40 top-0 end-0 h-100 d-md-block d-none">
                  <div
                    class="oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 bg-cover ms-n8"
                    :style="{ backgroundImage: `url(${imageSrc})` }"
                  >
                    <div
                      class="blur mt-12 p-4 text-center border border-white border-radius-md position-absolute fixed-bottom m-4"
                    >
                      <h2 class="mt-3 text-dark font-weight-bold">加入我们的CampusWall社区。</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import imageSrc from "@/assets/img/image-sign-in.jpg";
import { useUserStore } from "@/stores/userStore";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const username = ref("");
const password = ref("");
const router = useRouter();

// 登录处理函数
const handleLogin = async () => {
  try {
    await userStore.setUserInfo({
      username: username.value,
      password: password.value,
    });
    ElMessage.success("欢迎回来 " + (userStore.userInfo?.fullName || "用户"));
    router.push("/"); // 登录成功后跳转到首页
  } catch (error) {
    // 尝试从错误对象中提取后端返回的错误信息
    let errorMessage = "登录出错，请稍后重试";
    if (error.response) {
      // 如果有响应数据，则尝试获取其中的错误消息
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message; // 假设后端在message字段中返回了错误信息
      } else if (error.response.statusText) {
        errorMessage = error.response.statusText; // 或者使用HTTP响应的状态文本作为错误信息
      }
    }
    ElMessage.error(errorMessage);
  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>
