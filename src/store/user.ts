import { defineStore } from 'pinia';
import { login as userLogin, getUserInfo, logout as userLogout } from '@/api/user';
import router from '@/router';

interface UserState {
  token: string;
  userInfo: {
    id?: number;
    username?: string;
    name?: string;
    avatar?: string;
    roles?: string[];
    permissions?: string[];
  };
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: {},
    loading: false,
    error: null
  }),
  
  getters: {
    isLogin: (state) => !!state.token,
    username: (state) => state.userInfo.username,
    hasPermission: (state) => (permission: string) => {
      return state.userInfo.permissions?.includes(permission) || false;
    },
    hasRole: (state) => (role: string) => {
      return state.userInfo.roles?.includes(role) || false;
    }
  },
  
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    setUserInfo(userInfo: UserState['userInfo']) {
      this.userInfo = userInfo;
    },
    
    async login(loginData: { username: string; password: string; captcha?: string }) {
      this.loading = true;
      this.error = null;
      
      try {
        const res = await userLogin(loginData);
        this.setToken(res.data.token);
        this.setUserInfo(res.data.userInfo);
        return res;
      } catch (error: any) {
        this.error = error.message || '登录失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserInfo() {
      if (!this.token) return null;
      
      this.loading = true;
      
      try {
        const res = await getUserInfo();
        this.setUserInfo(res.data);
        return res.data;
      } catch (error: any) {
        this.error = error.message || '获取用户信息失败';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      if (this.token) {
        try {
          await userLogout();
        } catch (error) {
          console.error('登出失败', error);
        }
      }
      
      // 无论如何都清除本地认证状态
      this.token = '';
      this.userInfo = {};
      localStorage.removeItem('token');
      
      // 跳转到登录页
      router.push('/login');
    },
    
    // 清除错误
    clearError() {
      this.error = null;
    }
  }
}); 
