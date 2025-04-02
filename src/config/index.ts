/**
 * 配置文件统一入口
 * 
 * 通过这个文件导出所有配置，使其他组件可以通过一个入口获取所有配置
 */

import authConfig from './auth';
import systemConfig from './system';

export { authConfig, systemConfig };

/**
 * 整合所有配置
 */
const config = {
  /* 认证配置 */
  auth: authConfig,
  /* 系统配置 */
  system: systemConfig
};

export default config; 
