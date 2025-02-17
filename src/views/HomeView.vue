<script setup>
import Sidenav from "@/components/layouts/Sidenav.vue";
import Navbar from "@/components/layouts/Navbar.vue";
import { ref } from "vue";

const isCollapsed = ref(false);

const toggleSidenav = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div class="layout-container">
    <Sidenav :isCollapsed="isCollapsed" @toggle="toggleSidenav" />
    <div :class="['main-content', { collapsed: isCollapsed }]">
      <Navbar />
      <div class="page-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
}

/* 默认Sidenav展开时，main-content 预留侧边栏的空间 */
.main-content {
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
  transition: margin-left 0.3s ease-in-out;
}

/* 顶部导航栏固定，防止被遮挡 */
.page-content {
  padding-top: 60px; /* Navbar 高度 */
}

/* Sidenav 折叠时，main-content 填满 */
.collapsed {
  margin-left: 0;
}

/* 适配小屏幕 */
@media (max-width: 1200px) {
  .main-content {
    margin-left: 0; /* 小屏幕时，不预留侧边栏空间 */
  }
}
</style>
