/**
 * 系统配置
 */
export interface SystemConfig {
  /** 系统名称 */
  systemName: string;
  
  /** 系统Logo */
  systemLogo: string;
  
  /** 公司名称 */
  companyName: string;
  
  /** 版权年份 */
  copyrightYear: string;
  
  /** 是否显示页脚 */
  showFooter: boolean;
  
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
  // 系统名称
  systemName: 'IMLJX-WMS',
  // 系统Logo
  systemLogo: '/logo.png',
  // 公司名称
  companyName: 'IMLJX',
  // 版权年份
  copyrightYear: '2024',
  // 是否显示页脚
  showFooter: true,
  // 登录页轮播图
  loginCarousel: {
    // 是否开启登录页轮播图
    enable: true,
    // 登录页轮播图
    images: [
      'src/assets/images/warehouse_1.png',
      'src/assets/images/warehouse_2.png',
    ],
    interval: 5000
  }
};

export default systemConfig; 
