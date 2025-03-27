<template>
  <div>
    <!-- Container and Navbar -->
    <div class="container position-sticky z-index-sticky top-0">
      <div class="row">
        <div class="col-12">
          <nav
            class="navbar navbar-expand-lg blur border-radius-sm top-0 z-index-3 shadow position-absolute my-3 py-2 start-0 end-0 mx-4"
          >
            <div class="container-fluid px-1">
              <a class="navbar-brand font-weight-bolder ms-lg-0" href="./index.html">
                CampusWall
              </a>
              <button
                class="navbar-toggler shadow-none ms-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navigation"
                aria-controls="navigation"
                aria-expanded="false"
                aria-label="Toggle navigation"
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
                    <a
                      class="nav-link d-flex align-items-center me-2 text-dark font-weight-bold"
                      href="./sign-up.html"
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
                          d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      注册
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link d-flex align-items-center me-2" href="./sign-in.html">
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

    <!-- Main content and Sign-up form -->
    <main class="main-content mt-0">
      <section>
        <div class="page-header min-vh-100">
          <div class="container">
            <div class="row">
              <div class="col-md-6">
                <div class="position-absolute w-40 top-0 start-0 h-100 d-md-block d-none">
                  <div
                    class="oblique-image position-absolute d-flex fixed-top ms-auto h-100 z-index-0 bg-cover me-n8"
                    :style="{ backgroundImage: `url(${imageSrc})` }"
                  >
                    <div class="my-auto text-start max-width-350 ms-7">
                      <h1 class="mt-3 text-white font-weight-bolder">
                        开始你的 <br />
                        新旅程。
                      </h1>
                      <p class="text-white text-lg mt-4 mb-4">
                        使用这些超棒的表单在你的项目中免费注册或登录。
                      </p>
                      <div class="d-flex align-items-center">
                        <div class="avatar-group d-flex">
                          <a
                            href="javascript:;"
                            class="avatar avatar-sm rounded-circle"
                            data-bs-toggle="tooltip"
                            data-original-title="Jessica Rowland"
                          >
                            <img alt="Image placeholder" src="@/assets/img/team-3.jpg" class="" />
                          </a>
                          <a
                            href="javascript:;"
                            class="avatar avatar-sm rounded-circle"
                            data-bs-toggle="tooltip"
                            data-original-title="Audrey Love"
                          >
                            <img
                              alt="Image placeholder"
                              src="@/assets/img/team-4.jpg"
                              class="rounded-circle"
                            />
                          </a>
                          <a
                            href="javascript:;"
                            class="avatar avatar-sm rounded-circle"
                            data-bs-toggle="tooltip"
                            data-original-title="Michael Lewis"
                          >
                            <img
                              alt="Image placeholder"
                              src="@/assets/img/marie.jpg"
                              class="rounded-circle"
                            />
                          </a>
                          <a
                            href="javascript:;"
                            class="avatar avatar-sm rounded-circle"
                            data-bs-toggle="tooltip"
                            data-original-title="Audrey Love"
                          >
                            <img
                              alt="Image placeholder"
                              src="@/assets/img/team-1.jpg"
                              class="rounded-circle"
                            />
                          </a>
                        </div>
                        <p class="font-weight-bold text-white text-sm mb-0 ms-2">
                          加入 250 万+ 用户
                        </p>
                      </div>
                    </div>
                    <div class="text-start position-absolute fixed-bottom ms-7">
                      <h6 class="text-white text-sm mb-5">版权所有 © 2022 CampusWall管理系统。</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-4 d-flex flex-column mx-auto">
                <div class="card card-plain mt-8">
                  <div class="card-header pb-0 text-left bg-transparent">
                    <h3 class="font-weight-black text-dark display-6">注册</h3>
                    <p class="mb-0">很高兴见到你！请输入你的详细信息。</p>
                  </div>
                  <div class="card-body">
                    <form role="form">
                      <label>账号</label>
                      <div class="mb-3">
                        <input
                          type="text"
                          class="form-control"
                          placeholder="请输入你的账号"
                          aria-label="Name"
                          aria-describedby="name-addon"
                        />
                      </div>
                      <label>邮箱地址</label>
                      <div class="mb-3">
                        <input
                          type="email"
                          class="form-control"
                          placeholder="请输入你的邮箱地址"
                          aria-label="Email"
                          aria-describedby="email-addon"
                        />
                      </div>
                      <label>密码</label>
                      <div class="mb-3">
                        <input
                          type="password"
                          class="form-control"
                          placeholder="创建一个密码"
                          aria-label="Password"
                          aria-describedby="password-addon"
                        />
                      </div>
                      <div class="form-check form-check-info text-left mb-0">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                      </div>
                      <div class="text-center">
                        <button type="button" class="btn btn-dark w-100 mt-4 mb-3">注册</button>
                        <button type="button" class="btn btn-white btn-icon w-100 mb-3">
                          <span class="btn-inner--icon me-1">
                            <img
                              class="w-5"
                              src="@/assets/img/logos/google-logo.svg"
                              alt="google-logo"
                            />
                          </span>
                          <span class="btn-inner--text">使用 Google 注册</span>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div class="card-footer text-center pt-0 px-lg-2 px-1">
                    <p class="mb-4 text-xs mx-auto">
                      已经有账户了？
                      <a href="javascript:;" class="text-dark font-weight-bold">登录</a>
                    </p>
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
import imageSrc from "@/assets/img/image-sign-up.jpg";

// 表单数据
</script>

<style scoped></style>
