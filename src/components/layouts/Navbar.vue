<template>
  <div class="g-sidenav-show bg-gray-100">
    <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <!-- Navbar -->
      <nav
        class="navbar navbar-main navbar-expand-lg mx-5 px-0 shadow-none rounded"
        id="navbarBlur"
      >
        <div class="container-fluid py-1 px-2">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent mb-1 pb-0 pt-1 px-0 me-sm-6 me-5">
              <li class="breadcrumb-item text-sm">
                <a class="opacity-5 text-dark" href="#">Dashboard</a>
              </li>
              <li class="breadcrumb-item text-sm text-dark active" aria-current="page">
                Dashboard
              </li>
            </ol>
            <h6 class="font-weight-bold mb-0">Dashboard</h6>
          </nav>
          <div class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
            <div class="ms-md-auto pe-md-3 d-flex align-items-center">
              <div class="input-group">
                <span class="input-group-text text-body bg-white border-end-0"> </span>
                <input type="text" class="form-control ps-0" placeholder="Search" />
              </div>
            </div>
            <ul class="navbar-nav justify-content-end">
              <li class="nav-item px-3 d-flex align-items-center"></li>
              <li class="nav-item dropdown pe-2 d-flex align-items-center">
                <a href="#" class="nav-link text-body p-0" @click="toggleDropdown"> </a>
                <ul class="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4" v-if="dropdownOpen">
                  <li v-for="(notification, index) in notifications" :key="index" class="mb-2">
                    <a class="dropdown-item border-radius-md" href="#">
                      <div class="d-flex py-1">
                        <div class="my-auto">
                          <img
                            :src="notification.img"
                            class="avatar avatar-sm border-radius-sm me-3"
                          />
                          11
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="text-sm font-weight-normal mb-1">
                            <span class="font-weight-bold">{{ notification.title }}</span>
                            {{ notification.message }}
                          </h6>
                          <p class="text-xs text-secondary mb-0 d-flex align-items-center">
                            <i class="fa fa-clock opacity-6 me-1"></i>
                            {{ notification.time }}
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item ps-2 d-flex align-items-center">
                <a href="#" class="nav-link text-body p-0">
                  <img src="@/assets/img/team-2.jpg" class="avatar avatar-sm" alt="avatar" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- End Navbar -->
      <div class="container-fluid py-4 px-5">
        <div class="row">
          <div class="col-md-12">
            <div class="d-md-flex align-items-center mb-3 mx-2">
              <div class="mb-md-0 mb-3">
                <h3 class="font-weight-bold mb-0">Hello, Noah</h3>
                <p class="mb-0">Apps you might like!</p>
              </div>
              <button
                class="btn btn-sm btn-white btn-icon d-flex align-items-center mb-0 ms-md-auto me-2"
              >
                <span class="btn-inner--text">Messages</span>
              </button>
              <button class="btn btn-sm btn-dark btn-icon d-flex align-items-center mb-0">
                <span class="btn-inner--text">Sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import "@/assets/css/corporate-ui-dashboard.css"; // 局部引入样式

const dropdownOpen = ref(false);
const notifications = ref([
  {
    title: "New message",
    message: "from Laur",
    time: "13 minutes ago",
    img: "@/assets/img/team-2.jpg",
  },
  {
    title: "New report",
    message: "by Google",
    time: "1 day ago",
    img: "@/assets/img/small-logos/logo-google.svg",
  },
]);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
</script>

<style scoped></style>
