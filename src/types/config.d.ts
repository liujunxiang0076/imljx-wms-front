export interface SystemConfig {
  systemName: string;
  systemLogo: string;
  companyName: string;
  copyrightYear: number;
  showFooter: boolean;
  loginCarousel: {
    enable: boolean;
    images: string[];
    interval: number;
  };
}

export interface AuthConfig {
  enableCaptcha: boolean;
  captchaLength: number;
  loginAttempts: number;
  lockTime: number;
}

export interface Config {
  system: SystemConfig;
  auth: AuthConfig;
} 
