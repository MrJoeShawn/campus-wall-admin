<template>
  <div class="g-sidenav-show bg-gray-100">
    <aside
      class="sidenav navbar navbar-vertical navbar-expand-xs border-0 bg-slate-900 fixed-start"
      :class="{ collapsed: isCollapsed }"
      id="sidenav-main"
    >
      <!-- 侧边栏头部 -->
      <div class="sidenav-header">
        <i
          class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
          @click="toggleSidenav"
        ></i>
        <a class="navbar-brand d-flex align-items-center m-0" href="#">
          <span class="font-weight-bold text-lg">Campus Wall</span>
        </a>
      </div>

      <!-- 侧边栏导航 -->
      <div class="collapse navbar-collapse px-4 w-auto" id="sidenav-collapse-main">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="(item, index) in navItems" :key="index">
            <router-link
              class="nav-link"
              :class="{ active: route.path === item.link }"
              :to="item.link"
            >
              <div
                class="icon icon-shape icon-sm px-0 text-center d-flex align-items-center justify-content-center"
              ></div>
              <span class="nav-link-text ms-1">{{ item.text }}</span>
            </router-link>
          </li>

          <!-- 分割线 -->
          <li class="nav-item mt-2">
            <div class="d-flex align-items-center nav-link">
              <span class="font-weight-normal text-md ms-2">Account Pages</span>
            </div>
          </li>

          <!-- 账户相关页面 -->
          <li
            class="nav-item border-start my-0 pt-2"
            v-for="(account, index) in accountPages"
            :key="index"
          >
            <router-link class="nav-link position-relative ms-0 ps-2 py-2" :to="account.link">
              <span class="nav-link-text ms-1">{{ account.text }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import "@/assets/css/corporate-ui-dashboard.css"; // 局部引入样式

const route = useRoute(); // 获取当前路由

// 导航项
const navItems = ref([
  { text: "校园公告管理", link: "/" },
  { text: "发布校园公告", link: "/createAnnouncements" },
]);

// 账户页面
const accountPages = ref([{ text: "Profile", link: "/createAnnouncements" }]);

// 侧边栏折叠状态
const isCollapsed = ref(false);

// 侧边栏折叠/展开切换
const toggleSidenav = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped>
#sidenav-collapse-main {
  overflow: hidden; /* 或者 overflow: auto; 根据需要调整 */
}
</style>
