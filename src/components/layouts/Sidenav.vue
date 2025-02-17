<template>
  <div class="g-sidenav-show bg-gray-100">
    <aside
      class="sidenav navbar navbar-vertical navbar-expand-xs border-0 bg-slate-900 fixed-start"
      id="sidenav-main"
    >
      <div class="sidenav-header">
        <i
          class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
          aria-hidden="true"
          id="iconSidenav"
          @click="toggleSidenav"
        ></i>
        <a class="navbar-brand d-flex align-items-center m-0" href="#">
          <span class="font-weight-bold text-lg">Campus Wall</span>
        </a>
      </div>
      <div class="collapse navbar-collapse px-4 w-auto" id="sidenav-collapse-main">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="(item, index) in navItems" :key="index">
            <a class="nav-link" :class="{ active: item.active }" :href="item.link">
              <div
                class="icon icon-shape icon-sm px-0 text-center d-flex align-items-center justify-content-center"
              ></div>
              <span class="nav-link-text ms-1">{{ item.text }}</span>
            </a>
          </li>
          <li class="nav-item mt-2">
            <div class="d-flex align-items-center nav-link">
              <span class="font-weight-normal text-md ms-2">Account Pages</span>
            </div>
          </li>
          <li
            class="nav-item border-start my-0 pt-2"
            v-for="(account, index) in accountPages"
            :key="index"
          >
            <a class="nav-link position-relative ms-0 ps-2 py-2" :href="account.link">
              <span class="nav-link-text ms-1">{{ account.text }}</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script setup>
import "@/assets/css/corporate-ui-dashboard.css"; // 局部引入样式
import { ref } from "vue";

const navItems = ref([
  { text: "Dashboard", link: "./index.html", active: true },
  { text: "Tables", link: "./tables.html", active: false },
  { text: "Wallet", link: "./wallet.html", active: false },
  { text: "RTL", link: "./rtl.html", active: false },
]);

const accountPages = ref([
  { text: "Profile", link: "./profile.html" },
  { text: "Sign In", link: "./sign-in.html" },
  { text: "Sign Up", link: "./sign-up.html" },
]);

const toggleSidenav = () => {
  console.log("Toggle sidenav");
};
</script>

<style scoped>
#sidenav-collapse-main {
  overflow: hidden; /* 或者 overflow: auto; 根据需要调整 */
}
</style>
