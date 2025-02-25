<template>
  <!-- 轮播图 -->
  <div class="position-relative overflow-hidden">
    <div class="swiper mySwiper mt-4 mb-2">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(slide, index) in slides" :key="index">
          <div
            class="card card-background shadow-none border-radius-xl card-background-after-none align-items-start mb-0"
          >
            <div
              class="full-background bg-cover"
              :style="{ backgroundImage: `url(${slide.image})` }"
            ></div>
            <div class="card-body text-start px-3 py-0 w-100">
              <div class="row mt-10">
                <div class="col-sm-3 mt-auto">
                  <h4 class="text-color font-weight-bolder">
                    {{ slide.rank }}
                  </h4>
                  <p class="text-color opacity-6 text-xs font-weight-bolder mb-0">
                    {{ slide.category }}
                  </p>
                  <h5 class="text-color font-weight-bolder">
                    {{ slide.name }}
                  </h5>
                </div>
                <div class="col-sm-3 ms-auto mt-auto">
                  <p class="text-color opacity-6 text-xs font-weight-bolder mb-0">发布时间</p>
                  <h5 class="text-color font-weight-bolder">
                    {{ slide.date }}
                  </h5>
                  <button
                    class="btn btn-sm btn-white btn-icon d-flex align-items-center mb-0 ms-md-auto me-2"
                  >
                    <span class="btn-inner--text">
                      <router-link :to="`/dynamic/${slide.dynamicId}`">浏览公告 </router-link></span
                    >
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
  <!-- 轮播图 -->
</template>

<style src="@/assets/css/corporate-ui-dashboard.css" scoped></style>

<script setup>
import { ref, onMounted } from "vue";
import Swiper from "swiper/bundle";
import "swiper/css/bundle";
import { getCampusAnnouncements } from "@/api/dynamic.js";

// 默认图片
const defaultImage = "@/assets/default-cover.jpg";

// slides 数据
const slides = ref([]);

// 加载后端数据并处理
const fetchSlidesData = async () => {
  try {
    const response = await getCampusAnnouncements(); // 请求后端接口
    if (response.code === 200 && Array.isArray(response.data)) {
      slides.value = response.data.map((item) => ({
        rank: `#校园公告`,
        name: item.dynamicSummary || "无标题",
        date: item.createdAt.split(" ")[0], // 提取日期
        image: item.dynamicCover || defaultImage, // 动态 封面处理
        dynamicId: item.dynamicId,
      }));
    } else {
      console.error("数据格式错误:", response);
    }
  } catch (error) {
    console.error("获取动态数据失败:", error);
  }
};

// 初始化轮播图
onMounted(() => {
  fetchSlidesData().then(() => {
    new Swiper(".mySwiper", {
      effect: "cards",
      grabCursor: true,
      initialSlide: 4,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  });
});
</script>

<style scoped>
.mt-auto {
  margin-bottom: 10px;
}

.text-color {
  color: white;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
}
</style>
