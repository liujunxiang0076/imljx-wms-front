/**
 * 系统通用配置
 */

interface SystemConfig {
  /** 系统名称 */
  systemName: string;
  
  /** 系统Logo */
  systemLogo: string;
  
  /** 公司名称(用于页脚版权信息) */
  companyName: string;
  
  /** 版权年份 */
  copyrightYear: string | number;
  
  /** 是否显示页脚 */
  showFooter: boolean;
  
  /** 默认语言 */
  defaultLanguage: 'zh-CN' | 'en-US';
  
  /** 左侧轮播效果 */
  loginCarousel: {
    /** 是否启用轮播 */
    enable: boolean;
    /** 自动轮播间隔(毫秒) */
    interval: number;
    /** 轮播图片列表 */
    images: string[];
  };
}

/**
 * 默认系统配置
 */
const systemConfig: SystemConfig = {
  /** 系统名称 */
  systemName: '数字工厂管理系统',
  /** 系统Logo */
  systemLogo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  /** 公司名称 */
  companyName: 'Jason Liu',
  /** 版权年份 */
  copyrightYear: new Date().getFullYear(),
  /** 是否显示页脚 */
  showFooter: true,
  /** 默认语言 */
  defaultLanguage: 'zh-CN',
  /** 登录轮播配置 */
  loginCarousel: {
    /** 是否启用轮播 */
    enable: true,
    /** 自动轮播间隔(毫秒) */
    interval: 5000,
    /** 轮播图片列表 */
    images: [
      'https://img.freepik.com/free-photo/automated-guided-vehicles-agv-robots-sorting-parcels-modern-intelligent-warehouse_93675-134573.jpg',
      'https://img.freepik.com/free-photo/modern-factory-workshop-with-robotic-arms-automation-manufacturing-line_667260-164.jpg',
      'https://img.freepik.com/free-photo/smart-factory-management-dashboard-with-icons-statistics-worker-using-tablet-control-automation-production-line_93675-134806.jpg',
      'https://img.freepik.com/free-photo/industry-4-0-iot-smart-manufacturing-concept-wireless-network-physical-cyber-system-autonomous-robots-monitoring-digital-twin-simulation-remote-engineer-control-future-factory-innovation_43780-5583.jpg'
    ]
  }
};

export default systemConfig; 
