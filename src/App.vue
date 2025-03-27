<template>
  <div class="grid-container" :class="{ 'no-sidebar': hideSidebar }">
    <!-- 侧边栏组件（根据路由隐藏） -->
    <Sidenar v-if="!hideSidebar" :isCollapsed="isCollapsed" />

    <!-- 页面内容展示区域 -->
    <RouterView />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Sidenar from "@/components/layouts/Sidenar.vue";

const isCollapsed = ref(false);
const route = useRoute();

// 计算属性：判断当前路由是否是登录或注册页面
const hideSidebar = computed(() => {
  return route.path === "/signin" || route.path === "/signup";
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  transition: grid-template-columns 0.3s ease-in-out;
}

/* 如果没有侧边栏，调整布局 */
.grid-container.no-sidebar {
  grid-template-columns: 1fr;
}
</style>
