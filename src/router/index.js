import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Signin from '@/views/Signin.vue'
import Signup from '@/views/Signup.vue'
import CreateAnnouncements from '@/views/Announcements/CreateAnnouncements.vue'
import UserManagement from '@/views/User/UserManagement.vue'
import DynamicManagement from '@/views/Dynamic/DynamicManagement.vue'
import Comment from '@/views/Comment/Comment.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/createAnnouncements/:dynamicId?',
      name: 'createAnnouncements',
      component: CreateAnnouncements,

    },
    {
      path: '/user/management',
      name: 'management',
      component: UserManagement,
    },
    {
      path: '/dynamic/management',
      name: 'dynamicManagement',
      component: DynamicManagement,
    },
    {
      path: '/comment/management',
      name: 'commentManagement',
      component: Comment,
    },
  ],
})

export default router
