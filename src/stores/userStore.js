// 关键区别
// 存储位置：两者都将 token 存储在 localStorage 中，但一个是通过 Pinia 管理的响应式状态来访问，另一个是直接通过 axios 请求拦截器读取。
// 访问方式：
// 在 axios 实例 中，token 是每次发送请求时动态地从 localStorage 中读取的，并作为请求头的一部分发送。
// 在 Pinia store 中，token 是作为应用状态的一部分，通过 store 来管理，其他组件可以访问和修改它。
// 功能和使用场景：
// axios 的 token 主要用于每次请求时验证身份，它直接参与请求头的设置，作用是认证。
// Pinia 的 token 主要用于全局管理用户登录状态、提供其他组件对用户信息的访问。它也存储在 localStorage 中，确保在页面刷新时仍然可以保持登录状态。
// 总结
// 这两种 token 的存储和使用方式是不同的：
// axios 中的 token 主要用于发送请求时携带身份验证信息。
// Pinia 中的 token 是全局状态的一部分，管理用户登录状态，确保登录信息在应用中可共享，并支持持久化存储。

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)
  const token = ref(localStorage.getItem('user-Token') || null) // 从本地存储初始化 token

  const setUserInfo = async (credentials) => {
    try {
      const response = await loginAPI(credentials)
      if (response.data.token) {
        userInfo.value = response.data.userInfo
        token.value = response.data.token
        localStorage.setItem('user-Token', token.value) // 同步 token 到本地存储
        console.log('获取用户信息成功:', token.value)
      } else {
        console.error('未获取到有效的 token')
        throw new Error('未获取到有效的 token')
      }
    } catch (error) {
      console.error('获取用户信息出错:', error)
      throw error
    }
  }

  const clearUserInfo = () => {
    userInfo.value = null
    token.value = null
    localStorage.removeItem('user-Token') // 从本地存储中移除 token
    console.log('用户信息已清除')
  }

  return { userInfo, token, setUserInfo, clearUserInfo }
}, {
  persist: true // 启用持久化
})
