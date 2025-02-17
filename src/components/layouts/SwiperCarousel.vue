<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { defineProps } from "vue";

// 组件的 Props，接收 slides 数据
defineProps({
  slides: Array,
});
</script>

<template>
  <div class="position-relative overflow-hidden">
    <!-- Swiper 轮播组件 -->
    <Swiper
      :modules="[Navigation]"
      :slides-per-view="1"
      :space-between="10"
      navigation
      class="mySwiper mt-4 mb-2"
    >
      <SwiperSlide v-for="(slide, index) in slides" :key="index">
        <div class="card card-background shadow-none border-radius-xl align-items-start mb-0">
          <div
            class="full-background bg-cover"
            :style="{ backgroundImage: `url(${slide.image})` }"
          ></div>
          <div class="card-body text-start px-3 py-0 w-100">
            <div class="row mt-12">
              <div class="col-sm-3 mt-auto">
                <h4 class="text-dark font-weight-bolder">#{{ slide.rank }}</h4>
                <p class="text-dark opacity-6 text-xs font-weight-bolder mb-0">Name</p>
                <h5 class="text-dark font-weight-bolder">{{ slide.name }}</h5>
              </div>
              <div class="col-sm-3 ms-auto mt-auto">
                <p class="text-dark opacity-6 text-xs font-weight-bolder mb-0">Category</p>
                <h5 class="text-dark font-weight-bolder">{{ slide.category }}</h5>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Swiper 导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<style scoped>
.full-background {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
}
</style>
