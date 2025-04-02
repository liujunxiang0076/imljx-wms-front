/**
 * 认证相关配置
 */

interface AuthConfig {
  /** 是否启用验证码 */
  enableCaptcha: boolean;
  
  /** 验证码长度 */
  captchaLength: number;
  
  /** 记住登录状态 */
  rememberLoginStatus: boolean;
  
  /** 登录失败最大次数(达到后会锁定账户) */
  maxLoginAttempts: number;
  
  /** 登录会话有效期(小时) */
  sessionDuration: number;
  
  /** 会话续期 */
  autoRenewSession: boolean;
}

/**
 * 默认认证配置
 */
const authConfig: AuthConfig = {
  /* 是否启用验证码 */
  enableCaptcha: true,
  /* 验证码长度 */
  captchaLength: 4,
  /* 记住登录状态 */
  rememberLoginStatus: true,
  /* 登录失败最大次数(达到后会锁定账户) */
  maxLoginAttempts: 5,
  /* 登录会话有效期(小时) */
  sessionDuration: 24,
  /* 会话续期 */
  autoRenewSession: true
};

export default authConfig; 
