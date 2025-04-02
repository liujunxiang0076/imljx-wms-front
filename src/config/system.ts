/**
 * 系统配置
 */
interface SystemConfig {
  /** 系统名称 */
  systemName: string;
  
  /** 系统Logo */
  systemLogo: string;
  
  /** 公司名称 */
  companyName: string;
  
  /** 版权年份 */
  copyrightYear: string;
  
  /** 登录页轮播图 */
  loginCarousel: {
    enable: boolean;
    images: string[];
    interval: number;
  };
}

/**
 * 系统配置
 */
const systemConfig: SystemConfig = {
  systemName: 'IMLJX-WMS',
  systemLogo: '/logo.png',
  companyName: 'IMLJX',
  copyrightYear: '2024',
  loginCarousel: {
    enable: true,
    images: [
      '/images/login-bg1.jpg',
      '/images/login-bg2.jpg',
      '/images/login-bg3.jpg',
      '/images/login-bg4.jpg'
    ],
    interval: 5000
  }
};

export default systemConfig; 
