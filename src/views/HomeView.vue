<script setup>
import Sidenav from "@/components/layouts/Sidenar.vue";
import Navbar from "@/components/layouts/Navbar.vue";
import { ref } from "vue";
import Carousel from "@/components/Announcements/Carousel.vue";
import AnnouncementsTable from "@/components/Announcements/AnnouncementsTable.vue";
const isCollapsed = ref(false);

const toggleSidenav = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div class="layout-container bg-gray-100">
    <Sidenav :isCollapsed="isCollapsed" @toggle="toggleSidenav" />
    <div class="container-fluid py-4 px-5">
      <Navbar />
      <hr class="my-0" />
      <div class="d-flex align-items-center Announcement-title">
        <h3 class="mb-1 mx-2 font-weight-bold">校园公告管理</h3>
      </div>
      <Carousel></Carousel>

      <div class="Announcement-Table">
        <AnnouncementsTable></AnnouncementsTable>
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

.Announcement-title {
  margin-top: 20px;
}

.Announcement-Table {
  margin: 30px 0;
}
</style>
