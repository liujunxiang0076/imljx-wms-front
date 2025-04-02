/**
 * 配置文件统一入口
 * 
 * 通过这个文件导出所有配置，使其他组件可以通过一个入口获取所有配置
 */

import authConfig from './auth';
import systemConfig from './system';

// 全局配置
export default {
  system: systemConfig,
  auth: authConfig,
  
  // 功能开关
  features: {
    // 是否启用标签页导航
    enableTabs: true,
    
    // 是否启用搜索框
    enableSearch: true
  }
}; 
