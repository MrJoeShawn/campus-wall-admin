import axios from 'axios';
import { ElMessageBox, ElMessage } from 'element-plus';
import 'element-plus/dist/index.css';
import router from '@/router/index';
import errorCode from '@/utils/errorCode';

// 设置 axios 默认的请求头
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建 axios 实例
const httpInstance = axios.create({
  baseURL: 'http://localhost:8082', // 设置请求的基础 URL
  timeout: 5000, // 设置请求超时
});

// 全局标志，防止重复弹框
let isLoggingOut = false;

// 请求拦截器
httpInstance.interceptors.request.use(
  config => {
    const token = getSecureToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 在请求头中添加 Token
    }

    // 对 GET 请求的 params 进行序列化处理
    if (config.method === 'get' && config.params) {
      let url = config.url + '?';
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        let part = encodeURIComponent(propName) + '=';
        if (value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              if (value[key] !== null && typeof value[key] !== 'undefined') {
                const params = propName + '[' + key + ']';
                const subPart = encodeURIComponent(params) + '=';
                url += subPart + encodeURIComponent(value[key]) + '&';
              }
            }
          } else {
            url += part + encodeURIComponent(value) + '&';
          }
        }
      }
      url = url.slice(0, -1); // 去掉最后一个 '&'
      config.params = {}; // 清空原始 params
      config.url = url; // 更新配置中的 URL
    }

    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
httpInstance.interceptors.response.use(
  response => {
    const code = response.data.code || 200; // 获取状态码，默认为 200
    const msg = errorCode[code] || response.data.msg || errorCode['default'];

    if (code === 401) {
      return handleAuthError(msg); // 处理未认证或过期
    } else if (code !== 200) {
      showErrorMessage(msg); // 显示错误消息
      return Promise.reject(new Error(msg));
    }

    return response.data; // 正常返回数据
  },
  error => {
    let message = error.response?.data?.msg || error.message;

    // 捕获 Token 过期的错误
    if (message.includes('TOKEN_EXPIRED') || message.includes('Token 已过期')) {
      return handleAuthError('登录已过期，请重新登录。');
    }

    if (message === 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = `系统接口${message.substr(message.length - 3)}异常`;
    }

    showErrorMessage(message); // 显示错误消息
    return Promise.reject(error);
  }
);

// 获取 Token
function getSecureToken() {
  return localStorage.getItem('user-Token');
}

// 处理认证错误
function handleAuthError(msg) {
  if (!isLoggingOut) {
    isLoggingOut = true;

    ElMessageBox.confirm(
      msg || '未登录，请登录后继续访问！',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
    )
      .then(() => {
        localStorage.removeItem('user-Token'); // 清除过期 Token
        router.push('/login'); // 跳转到登录页
      })
      .catch(() => {
        ElMessage({
          message: '您选择了取消操作',
          type: 'info',
          duration: 3000,
          showClose: true,
        });
      })
      .finally(() => {
        isLoggingOut = false; // 重置状态
      });
  }

  return Promise.reject(new Error(msg || '无效的会话，请重新登录。'));
}


// 显示错误消息
function showErrorMessage(msg) {
  ElMessageBox.alert(msg, '错误', {
    type: 'error',
    center: true,
    showClose: true,
    duration: 3000,
  });
}

export default httpInstance;
