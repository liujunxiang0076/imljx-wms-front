import { defineStore } from 'pinia';
import { login as userLogin, getUserInfo, logout as userLogout } from '@/api/user';
import type { UserInfo } from '@/api/user';
import router from '@/router';
import config from '@/config';

interface UserState {
  token: string;
  userInfo: UserInfo | null;
  loginAttempts: number;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    loginAttempts: 0
  }),
  
  getters: {
    isLogin: (state) => !!state.token,
    name: (state) => state.userInfo?.name || '',
    username: (state) => state.userInfo?.username || '',
    avatar: (state) => state.userInfo?.avatar || '',
    roles: (state) => state.userInfo?.roles || [],
    permissions: (state) => state.userInfo?.permissions || []
  },
  
  actions: {
    async login(loginParams: { username: string; password: string; captcha?: string }) {
      // 验证登录次数是否超过限制
      if (config.auth.maxLoginAttempts > 0 && this.loginAttempts >= config.auth.maxLoginAttempts) {
        throw new Error(`登录失败次数过多，请稍后再试`);
      }
      
      try {
        // 仅在启用验证码时需要传递验证码参数
        const loginPayload = {
          username: loginParams.username,
          password: loginParams.password
        };
        
        if (config.auth.enableCaptcha && loginParams.captcha) {
          Object.assign(loginPayload, { captcha: loginParams.captcha });
        }
        
        const res = await userLogin(loginPayload);
        
        if (res.code === 0) {
          const { token, userInfo } = res.data;
          this.token = token;
          this.userInfo = userInfo;
          this.loginAttempts = 0; // 登录成功后重置尝试次数
          
          // 保存token到本地存储
          localStorage.setItem('token', token);
          
          // 获取session持续时间（小时）
          const sessionDuration = config.auth.sessionDuration || 24;
          
          // 如果需要记住登录状态，设置token过期时间
          if (config.auth.rememberLoginStatus) {
            const expireTime = new Date();
            expireTime.setHours(expireTime.getHours() + sessionDuration);
            localStorage.setItem('tokenExpireTime', expireTime.toString());
          }
          
          return res;
        } else {
          this.loginAttempts++;
          throw new Error(res.message || '登录失败');
        }
      } catch (error) {
        this.loginAttempts++;
        throw error;
      }
    },
    
    async getInfo() {
      try {
        const res = await getUserInfo();
        if (res.code === 0) {
          this.userInfo = res.data;
          return res.data;
        } else {
          throw new Error(res.message || '获取用户信息失败');
        }
      } catch (error) {
        throw error;
      }
    },
    
    async logout() {
      try {
        await userLogout();
      } catch (error) {
        console.error('登出错误:', error);
      } finally {
        // 无论后端请求是否成功，都清除本地状态
        this.token = '';
        this.userInfo = null;
        this.loginAttempts = 0;
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpireTime');
        router.push('/login');
      }
    },
    
    // 检查会话是否有效
    checkSession() {
      if (!this.token) return false;
      
      const tokenExpireTime = localStorage.getItem('tokenExpireTime');
      if (!tokenExpireTime) return true; // 没有设置过期时间的情况
      
      const expireTime = new Date(tokenExpireTime);
      const now = new Date();
      
      // 如果到达过期时间，清除登录状态
      if (now > expireTime) {
        this.token = '';
        this.userInfo = null;
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpireTime');
        return false;
      }
      
      // 自动续期
      if (config.auth.autoRenewSession) {
        const sessionDuration = config.auth.sessionDuration || 24;
        const newExpireTime = new Date();
        newExpireTime.setHours(newExpireTime.getHours() + sessionDuration);
        localStorage.setItem('tokenExpireTime', newExpireTime.toString());
      }
      
      return true;
    }
  }
}); 
