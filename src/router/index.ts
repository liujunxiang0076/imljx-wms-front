import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import config from '@/config';
import { useUserStore } from '@/store/user';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
      requiresAuth: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      title: '仪表盘',
      icon: 'dashboard',
      requiresAuth: true
    },
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'DashboardIndex',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'dashboard',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { 
      hideInMenu: true,
      requiresAuth: true
    },
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/views/redirect/index.vue'),
        meta: { 
          hideInMenu: true,
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hideInMenu: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - ${config.system.systemName}` : config.system.systemName;
  
  // 权限控制
  if (to.meta.requiresAuth) {
    // 使用pinia store可能会在路由守卫中过早访问，使用函数形式获取store
    const userStore = useUserStore();
    
    // 检查登录状态和会话是否有效
    if (!userStore.isLogin || !userStore.checkSession()) {
      // 清除失效的登录状态
      if (userStore.isLogin && !userStore.checkSession()) {
        userStore.logout();
      }
      
      next({ path: '/login', query: { redirect: to.fullPath } });
      return;
    }
  }
  
  next();
});

export default router; 
