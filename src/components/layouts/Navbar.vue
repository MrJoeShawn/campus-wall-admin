<template>
  <div class="g-sidenav-show">
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <!-- Navbar -->
      <nav class="navbar navbar-main navbar-expand-lg px-0 shadow-none rounded" id="navbarBlur">
        <div class="container-fluid py-1 px-2">
          <div class="container-fluid" style="width: 60%">
            <div class="row">
              <div class="col-md-12">
                <div class="d-md-flex align-items-center mb-3 mx-2">
                  <div class="mb-md-0 mb-3">
                    <h3 class="font-weight-bold mb-0">你好, {{ fullName }}</h3>
                    <p class="mb-0">欢迎使用 CampusWall!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
            <div class="ms-auto d-flex"></div>
            <ul class="navbar-nav justify-content-end">
              <li class="nav-item dropdown pe-2 d-flex align-items-center">
                <a href="#" class="nav-link text-body p-0" @click="toggleDropdown">🔔</a>
                <ul class="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4" v-if="dropdownOpen">
                  <li v-for="(notification, index) in notifications" :key="index" class="mb-2">
                    <a class="dropdown-item border-radius-md" href="#">
                      <div class="d-flex py-1">
                        <img
                          :src="notification.img"
                          class="avatar avatar-sm me-2"
                          alt="notification-img"
                        />
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="text-sm font-weight-normal mb-1">
                            <span class="font-weight-bold">{{ notification.title }}</span>
                            {{ notification.message }}
                          </h6>
                          <p class="text-xs text-secondary mb-0 d-flex align-items-center">
                            <i class="fa fa-clock opacity-6 me-1"></i> {{ notification.time }}
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item ps-2 d-flex align-items-center">
                <a href="#" class="nav-link text-body p-0">
                  <img :src="userAvatar" class="avatar avatar-sm" alt="avatar" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import "@/assets/css/corporate-ui-dashboard.css"; // 局部引入样式

// 使用 store 获取用户信息
const userStore = useUserStore();
const dropdownOpen = ref(false);

const notifications = ref([
  {
    title: "新消息",
    message: "来自 Laur",
    time: "13 分钟前",
    img: new URL("@/assets/img/team-2.jpg", import.meta.url).href,
  },
  {
    title: "新报告",
    message: "来自 Google",
    time: "1 天前",
    img: new URL("@/assets/img/small-logos/logo-google.svg", import.meta.url).href,
  },
]);

console.log(userStore.userInfo);

// 使用 computed 避免不必要的 ref
const fullName = computed(() => userStore.userInfo.fullName || "管理员");
const userAvatar = computed(
  () =>
    userStore.userInfo.profilePictureUrl || new URL("@/assets/img/team-2.jpg", import.meta.url).href
);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
</script>

<style scoped>
/* 这里可以添加一些 CSS 样式优化 */
</style>
