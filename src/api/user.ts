import { get, post } from './index';

// 接口返回数据类型定义
interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

interface LoginParams {
  username: string;
  password: string;
  captcha?: string;
}

interface LoginResult {
  token: string;
  userInfo: {
    id: number;
    username: string;
    name: string;
    avatar: string;
    roles: string[];
    permissions: string[];
  }
}

interface UserInfo {
  id: number;
  username: string;
  name: string;
  avatar: string;
  roles: string[];
  permissions: string[];
}

// 登录API
export function login(data: LoginParams): Promise<BaseResponse<LoginResult>> {
  return post('/auth/login', data);
}

// 获取用户信息
export function getUserInfo(): Promise<BaseResponse<UserInfo>> {
  return get('/user/info');
}

// 登出API
export function logout(): Promise<BaseResponse> {
  return post('/auth/logout');
}

// 获取验证码
export function getCaptcha(): Promise<BaseResponse<string>> {
  return get('/auth/captcha');
} 
