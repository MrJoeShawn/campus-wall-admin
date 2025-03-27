<template>
  <!-- 动态发布或编辑的主要内容 -->
  <section
    class="container-fluid py-4 px-5 single-block-wrapper section-padding section-padding-top"
  >
    <div class="container">
      <div class="justify-content-center">
        <!-- 富文本编辑器 -->
        <div class="tinymce-box">
          <div class="container">
            <div class="editor-container">
              <!-- 使用 transition 来包裹异步加载的编辑器 -->
              <transition name="fade">
                <!-- 异步加载的 TinyMCE 编辑器组件 -->
                <Editor
                  v-if="editorLoaded"
                  v-model="ruleForm.dynamicContent"
                  :init="editorConfig"
                  @init="onEditorInit"
                  api-key="no-api-key"
                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                />
              </transition>

              <!-- 加载动画 (只在编辑器未加载时显示) -->
              <div v-if="!editorLoaded" class="editor-loading">
                <div class="spinner"></div>
                <p>正在加载编辑器...</p>
              </div>
            </div>
            <!-- 上传进度条 -->
            <el-progress v-if="TinyMCEuploading" :percentage="TinyMCEuploadProgress" />
            <!-- 预览模态框 -->
            <div v-if="showPreview" class="modal-overlay" @click="closePreview">
              <div class="modal-content" @click.stop>
                <h2>预览</h2>
                <div v-html="sanitizedContent" class="preview-content"></div>
                <button @click="closePreview" class="close-button">关闭</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 表单部分 -->
        <div class="dynamic-form">
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="auto"
            :size="formSize"
            status-icon
            class="form-layout"
          >
            <!-- 左侧表单项 -->
            <div class="left-panel">
              <!-- 动态摘要 -->
              <el-form-item label="动态摘要" prop="dynamicSummary">
                <el-input
                  v-model="ruleForm.dynamicSummary"
                  style="width: 350px"
                  :maxlength="40"
                  size="large"
                  placeholder="请输入动态摘要(建议30个字符以内)"
                />
              </el-form-item>

              <!-- 动态分类 -->
              <!-- <el-form-item label="分类" prop="categoryId">
                <el-select
                  v-model="ruleForm.categoryId"
                  placeholder="请选择分类"
                  style="width: 350px"
                >
                  <el-option
                    v-for="category in categoriesList"
                    :key="category.categoryId"
                    :label="category.categoryName"
                    :value="category.categoryId"
                  />
                </el-select>
              </el-form-item> -->

              <!-- 动态标签 -->
              <el-form-item label="动态标签" prop="tags">
                <el-select
                  v-model="ruleForm.tags"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="选择或输入标签"
                  style="width: 350px"
                >
                  <el-option
                    v-for="tag in availableTags"
                    :key="tag.tagId"
                    :label="tag.tagName"
                    :value="tag.tagName"
                  />
                </el-select>
              </el-form-item>

              <!-- 添加封面 -->
              <el-form-item label="添加封面" prop="dynamicCover" style="font-weight: bold">
                <el-upload
                  action="#"
                  list-type="picture-card"
                  :auto-upload="false"
                  accept="image/*"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload"
                  :on-remove="handleRemove"
                  :on-preview="handlePictureCardPreview"
                  @change="handleUploadChange"
                >
                  <el-icon><Plus /></el-icon>
                  <template #file="{ file }">
                    <div>
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        alt=""
                        @click="handlePictureCardPreview(file)"
                      />
                      <span class="el-upload-list__item-actions">
                        <span @click="handlePictureCardPreview(file)">
                          <el-icon><ZoomIn /></el-icon>
                        </span>
                        <span @click="handleRemove(file)">
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
                <el-progress v-if="uploading" :percentage="uploadProgress" />
                <div v-if="uploading" class="upload-path">上传文件路径: {{ uploadedFilePath }}</div>
              </el-form-item>
            </div>

            <!-- 右侧表单项 -->
            <div class="right-panel">
              <!-- 是否公开发布 -->
              <el-form-item label="是否公开发布">
                <el-radio-group v-model="isAnonymous">
                  <el-radio :label="0">公开发布</el-radio>
                  <el-radio :label="1">匿名发布</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 是否允许评论 -->
              <el-form-item label="是否允许评论">
                <el-radio-group v-model="allowComments">
                  <el-radio :label="1">允许评论</el-radio>
                  <el-radio :label="0">不允许评论</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 提交按钮 -->
              <div class="action-buttons">
                <el-button type="primary" @click="submitForm(false)"> 发布 </el-button>
                <el-button type="warning" @click="submitForm(true)"> 保存到草稿箱 </el-button>
                <el-button @click="resetForm">重置</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </section>

  <!-- 图片预览对话框 -->
  <el-dialog v-model="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue"; // 图标
import { ElMessage } from "element-plus";
import { getTagsList } from "@/api/categories.js"; // 获取分类和标签
import { getUploadToken } from "@/api/uploadFile"; // 上传凭证
import { v4 as uuidv4 } from "uuid"; // UUID 生成
import { createCampusAnnouncements, updateGetDynamic } from "@/api/dynamic.js"; // 动态相关API

import { defineAsyncComponent, computed } from "vue";
import DOMPurify from "dompurify";
import { ElNotification } from "element-plus";

// 异步加载 TinyMCE 编辑器组件
const Editor = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    if (window.tinymce) {
      resolve(import("@tinymce/tinymce-vue"));
    } else {
      const script = document.createElement("script");
      script.src = "/tinymce/tinymce.min.js";
      script.onload = () => {
        console.log("TinyMCE loaded");
        resolve(import("@tinymce/tinymce-vue"));
      };
      script.onerror = (error) => {
        console.error("Failed to load TinyMCE", error);
        reject(error);
      };
      document.head.appendChild(script);
    }
  });
});

// 数据定义
const showPreview = ref(false);
const TinyMCEuploading = ref(false);
const TinyMCEuploadProgress = ref(0);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 最大文件大小（10MB）
const SUPPORTED_FILE_TYPES = ["image", "video"];
const editorLoaded = ref(false);
const formSize = ref("default"); // 表单大小
const ruleFormRef = ref(null); // 表单引用
const ruleForm = reactive({
  dynamicSummary: "", // 动态摘要
  categoryId: "21", // 分类ID
  tags: [], // 标签
  cleanedPostContent: "", // 清理后的内容
  dynamicContent: "", // 动态内容
  dynamicCover: "", // 封面图片
});
const fileList = ref([]); // 文件列表
const dialogImageUrl = ref(""); // 预览图片URL
const dialogVisible = ref(false); // 是否显示图片预览对话框
const isAnonymous = ref(0); // 是否匿名发布
const allowComments = ref(1); // 是否允许评论
const availableTags = ref([]); // 可用标签列表
const categoriesList = ref([]); // 分类列表
const uploading = ref(false); // 上传状态
const uploadProgress = ref(0); // 上传进度
const uploadedFilePath = ref(""); // 上传文件路径

import { useRoute } from "vue-router";
const route = useRoute();

// 编辑器配置
const editorConfig = {
  promotion: false, // 禁用编辑器推广链接，减少不必要的广告或提示
  height: 600, // 编辑器高度，单位为像素
  menubar: "insert format table", // 定义菜单栏显示的内容，可以删减菜单项以简化 UI
  branding: false, // 禁用 TinyMCE 的品牌标识，减少编辑器界面上的品牌信息
  language: "zh_CN", // 设置语言为简体中文
  language_url: "/tinymce/skins/langs/zh_CN.js", // 加载中文语言包
  plugins: [
    "advlist", // 提供高级列表插件，允许用户创建更复杂的列表（有序/无序）
    "autosave", // 自动保存编辑内容，防止丢失
    "image", // 允许插入和编辑图片
    "link", // 插入和编辑链接
    "lists", // 创建列表（无序列表、有序列表）
    "media", // 插入媒体（如视频、音频等）
    "nonbreaking", // 插入不换行符，防止自动换行
    "table", // 插入和编辑表格
    "wordcount", // 显示已输入的字数
    "emoticons", // 插入表情符号
    "charmap", // 插入特殊字符
    // "fontfamily", // 允许更改字体，提供不同字体选择
  ],

  toolbar:
    "blocks fontfamily fontsizeinput | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | lineheight bullist numlist | emoticons uploadMediaButton previewButton",
  // 定义工具栏上显示的按钮，按需移除不常用的按钮以简化界面
  font_family_formats:
    "宋体=SimSun;黑体=SimHei;微软雅黑=Microsoft YaHei;仿宋=FangSong;楷体=KaiTi;隶书=LiSu;方正兰亭黑=FZLanTingHei;华文细黑=STXihei;华文楷体=STKaiti;华文新魏=STXinwei;微软雅黑 Light=Microsoft YaHei Light;苹方=PingFang;思源黑体=Source Han Sans;思源宋体=Source Han Serif;Arial=Arial;Times New Roman=Times New Roman;Courier New=Courier New;Verdana=Verdana;Comic Sans MS=Comic Sans MS;Brush Script MT=Brush Script MT",
  // 字体格式定义，提供字体选择列表。根据需要可删减或修改

  toolbar_mode: "wrap", // 工具栏按钮换行显示，可以根据需要调整
  content_style:
    "body { font-family: 'Microsoft YaHei', 'SimSun', 'Arial', sans-serif; font-size:14px }",
  // 设置编辑器内容区域的字体样式
  setup: function (editor) {
    // 添加上传媒体按钮
    editor.ui.registry.addButton("uploadMediaButton", {
      text: "上传媒体",
      icon: "upload",
      onAction: function () {
        handleMediaUpload(editor);
      },
    });
    // 添加预览按钮
    editor.ui.registry.addButton("previewButton", {
      text: "预览",
      icon: "preview",
      onAction: function () {
        showPreview.value = true;
      },
    });
  },
};

// 获取 dynamicId 参数
const dynamicId = route.params.dynamicId;

// 加载动态详情
const loadDynamicData = async (dynamicId) => {
  try {
    const response = await updateGetDynamic(dynamicId);
    console.log("获取动态", response);
    if (response.code === 200) {
      const data = response.data;
      // 填充表单数据
      ruleForm.dynamicSummary = data.dynamicSummary || "";
      ruleForm.categoryId = data.categoryId || "21";
      ruleForm.tags = data.tagName ? data.tagName.map((tag) => tag.tagName) : [];
      ruleForm.dynamicCover = data.dynamicCover || "";
      ruleForm.dynamicContent = data.dynamicContent || ""; // 加载动态内容
      // 设置封面图列表
      fileList.value = data.dynamicCover ? [{ url: data.dynamicCover }] : [];
    } else {
      ElMessage.error("加载动态详情失败");
    }
  } catch {
    ElMessage.error("加载动态失败，请稍后重试");
  }
};

const onEditorInit = () => {
  console.log("编辑器已加载");
  editorLoaded.value = true;
};

// 处理媒体上传
async function handleMediaUpload(editor) {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*,video/*");

  input.onchange = async function () {
    for (let file of this.files) {
      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        ElNotification({
          title: "文件上传失败",
          message: "上传的文件过大，请重新选择文件（最大 10MB）",
          type: "error",
        });
        return;
      }

      let fileType = file.type.split("/")[0];
      // 检查文件类型
      if (!SUPPORTED_FILE_TYPES.includes(fileType)) {
        ElNotification({
          title: "文件上传失败",
          message: "不支持的文件类型，请重新选择",
          type: "error",
        });
        return;
      }

      // 获取上传凭证
      let uploadToken;
      try {
        const uploadTokenResponse = await getUploadToken();
        if (!uploadTokenResponse || !uploadTokenResponse.msg) {
          throw new Error("获取上传凭证失败");
        }
        uploadToken = uploadTokenResponse.msg; // 假设凭证在 msg 字段中
      } catch (error) {
        ElNotification({
          title: "获取上传凭证失败",
          message: error.message || "未知错误",
          type: "error",
        });
        return; // 退出上传处理
      }

      const key = generateFilePath(file.name); // 调用命名规则生成文件路径

      // 上传文件到七牛云
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      formData.append("token", uploadToken);

      // 创建 XMLHttpRequest 对象
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://upload-z2.qiniup.com", true);

      // 监听上传进度
      xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
          TinyMCEuploadProgress.value = (event.loaded / event.total) * 100;
          TinyMCEuploading.value = true; // 开始上传时显示进度条
        }
      };

      xhr.onload = function () {
        TinyMCEuploading.value = false; // 上传完成时隐藏进度条
        if (xhr.status === 200) {
          const uploadResult = JSON.parse(xhr.responseText);
          const fileUrl = `http://st80y4q35.hn-bkt.clouddn.com/${uploadResult.key}`; // 替换为你的七牛云域名

          // 根据文件类型插入不同内容
          if (fileType === "image") {
            editor.insertContent(
              `<img src="${fileUrl}" alt="${file.name}" style="max-width:100%; height:auto;"/>`
            );
            ElNotification({
              title: "文件上传成功",
              message: `${file.name} 图片已成功插入`,
              type: "success",
            });
          } else if (fileType === "video") {
            editor.insertContent(
              `<p><video src="${fileUrl}" width="100%" controls="controls" type="${file.type}"></video></p>`
            );
            ElNotification({
              title: "文件上传成功",
              message: `${file.name} 视频已成功插入`,
              type: "success",
            });
          }
        } else {
          ElNotification({
            title: "文件上传失败",
            message: "未知错误",
            type: "error",
          });
        }
      };

      xhr.onerror = function () {
        TinyMCEuploading.value = false; // 上传错误时隐藏进度条
        ElNotification({
          title: "文件上传失败",
          message: "网络错误",
          type: "error",
        });
      };

      // 发送请求
      xhr.send(formData);
    }
    input.value = null; // 重置输入值
  };

  input.click(); // 触发文件选择框
}

// 关闭预览模态框
function closePreview() {
  showPreview.value = false;
}

// 清理内容并返回安全的 HTML
const sanitizedContent = computed({
  get() {
    let videoPlaceholders = [];
    let cleanedContent = ruleForm.dynamicContent.replace(/<video[\s\S]*?<\/video>/g, (match) => {
      const placeholder = `##VIDEO_PLACEHOLDER_${videoPlaceholders.length}##`;
      videoPlaceholders.push(match);
      return placeholder;
    });

    cleanedContent = DOMPurify.sanitize(cleanedContent, {
      ADD_TAGS: ["img", "a", "video"],
      ADD_ATTR: ["href", "target", "alt", "title", "style"],
    });

    // Replace placeholders with original video content
    videoPlaceholders.forEach((video, index) => {
      cleanedContent = cleanedContent.replace(`##VIDEO_PLACEHOLDER_${index}##`, video);
    });

    return cleanedContent;
  },
  set(newValue) {
    ruleForm.cleanedPostContent = newValue;
  },
});

onMounted(() => {
  // 通过异步加载的方式，加载 TinyMCE 编辑器
  editorLoaded.value = true;
});

onMounted(() => {
  console.log("动态ID：", dynamicId); // 检查 dynamicId 是否存在
  if (dynamicId) {
    loadDynamicData(dynamicId); // 确保 dynamicId 存在时才调用
  } else {
    console.error("dynamicId 未找到！");
  }
});

// 获取标签和分类数据
const fetchTagsAndCategories = async () => {
  try {
    const [tagsResponse] = await Promise.all([getTagsList()]);
    if (tagsResponse.code === 200) availableTags.value = tagsResponse.data;
  } catch {
    ElMessage.error("获取数据失败，请稍后重试");
  }
};
fetchTagsAndCategories();

// 表单验证规则
const rules = reactive({
  dynamicSummary: [{ required: true, message: "请输入动态摘要", trigger: "blur" }],
  // categoryId: [{ required: true, message: "请选择动态分类", trigger: "change" }],
  tags: [{ required: true, message: "请至少添加一个标签", trigger: "change" }],
});

// 处理文件上传
const handleUploadChange = async (file, newFileList) => {
  if (newFileList.length > 1) {
    ElMessage.warning("只允许上传一张图片!");
    newFileList.splice(1);
  }
  if (file.raw && !beforeAvatarUpload(file.raw)) newFileList.pop();
  fileList.value = newFileList;

  if (file.status === "ready") {
    await uploadCoverImage(file);
  }
};

// 上传封面图片
const uploadCoverImage = async (file) => {
  let uploadToken;
  try {
    const response = await getUploadToken();
    uploadToken = response.msg;
  } catch {
    ElMessage.error("获取上传凭证失败");
    return;
  }

  const formData = new FormData();
  formData.append("file", file.raw);
  formData.append("token", uploadToken);
  formData.append("key", generateFilePath(file.name));

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "http://upload-z2.qiniup.com", true);

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      uploadProgress.value = (event.loaded / event.total) * 100;
      uploading.value = true;
    }
  };

  xhr.onload = () => {
    uploading.value = false;
    if (xhr.status === 200) {
      const fileUrl = `http://st80y4q35.hn-bkt.clouddn.com/${JSON.parse(xhr.responseText).key}`;
      fileList.value[0] = { url: fileUrl };
      uploadedFilePath.value = fileUrl;
      ruleForm.dynamicCover = fileUrl;
      ElMessage.success("封面上传成功");
    }
  };

  xhr.onerror = () => {
    uploading.value = false;
    ElMessage.error("网络错误");
  };

  xhr.send(formData);
};

// 生成文件路径
const generateFilePath = (fileName) => {
  const date = new Date();
  const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}/`;
  const uuid = uuidv4();
  const fileType = fileName.substring(fileName.lastIndexOf("."));
  return `${datePath}${uuid}${fileType}`;
};

// 文件上传前的验证
const beforeAvatarUpload = (rawFile) => {
  const isValidType = ["image/jpeg", "image/png"].includes(rawFile.type);
  const isValidSize = rawFile.size / 1024 / 1024 < 2;
  if (!isValidType) ElMessage.error("封面图片必须为 JPG 或 PNG 格式!");
  if (!isValidSize) ElMessage.error("封面图片大小不能超过 2MB!");
  return isValidType && isValidSize;
};

// 处理文件删除
const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  if (index > -1) fileList.value.splice(index, 1);
  ruleForm.dynamicCover = ""; // 清空动态封面
};

// 图片预览
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

const submitForm = async (isDraft) => {
  // 检查表单引用是否存在
  if (!ruleFormRef.value) return;

  // 验证表单数据是否有效
  ruleFormRef.value.validate(async (valid) => {
    // 如果表单数据有效，则准备提交的数据
    if (valid) {
      const postData = {
        dynamicId: dynamicId || null, // 如果有 dynamicId 则传递
        dynamicSummary: ruleForm.dynamicSummary,
        dynamicCover: uploadedFilePath.value,
        cleanedPostContent: ruleForm.cleanedPostContent,
        dynamicContent: ruleForm.dynamicContent,
        categoryId: ruleForm.categoryId,
        isAnonymous: isAnonymous.value,
        allowComments: allowComments.value,
        isDraft: isDraft ? 1 : 0,
        tagName: ruleForm.tags.map((tag) => ({ tagName: tag })),
      };

      // 打印提交的数据以便调试
      console.log(postData);

      // 尝试调用创建动态API提交数据
      try {
        const response = await createCampusAnnouncements(postData);
        // 根据API返回的结果显示成功消息或错误消息
        if (response.code === 200) {
          ElMessage.success(isDraft ? "草稿保存成功!" : "发布成功!");
          // 提交成功后重置表单
          resetForm();
        } else {
          ElMessage.error(response.message || "发布失败，请稍后重试");
        }
      } catch {
        // 如果API调用失败，显示错误消息
        ElMessage.error("发布失败，请检查网络或稍后重试");
      }
    } else {
      // 如果表单验证失败，打印错误信息
      console.log("提交失败!");
    }
  });
};

// 重置表单
const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
  fileList.value = [];
  isAnonymous.value = 0; // 重置为公开发布
  allowComments.value = 1; // 重置为允许评论
  ruleForm.dynamicCover = "";
  ruleForm.categoryId = "21"; // 重置分类
};
</script>

<style scoped>
.section-padding-top {
  padding-top: 35px;
}
.dynamic-form {
  padding-top: 30px;
  margin: 0 auto;
  margin-bottom: 45px;
}
.upload-path {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.form-layout {
  display: flex;
  justify-content: space-between;
  max-width: 900px;
}

.left-panel {
  flex: 1;
}

.right-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.action-buttons {
  display: flex;
}

.container {
  position: relative;
}

.justify-content-center {
  padding: 0 30px;
}

.editor-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.editor-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 600px; /* 编辑器占位空间 */
}

.spinner {
  border: 4px solid #f3f3f3; /* 背景色 */
  border-top: 4px solid #3498db; /* 进度条颜色 */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.editor-loading p {
  margin-top: 10px;
  color: #3498db;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 1000px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
}

.preview-content {
  max-height: 60vh;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #c82333;
}

video {
  display: block;
  margin: 0 auto;
}
</style>
