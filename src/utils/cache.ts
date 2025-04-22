import { Modal, message } from 'ant-design-vue';
import { useLayoutStore } from '../store/layout';
import { useUserStore } from '../store/user';
import type { Router as VueRouter } from 'vue-router';

/**
 * 清除缓存并退出登录
 * @param router Vue Router实例
 * @param showConfirm 是否显示确认对话框
 * @returns Promise
 */
export const clearCacheAndLogout = (router: VueRouter, showConfirm = true) => {
  const handler = async () => {
    try {
      const layoutStore = useLayoutStore();
      const userStore = useUserStore();
      
      // 清除布局缓存
      layoutStore.clearCache();
      // 执行退出登录
      await userStore.logout();
      message.success('已清除缓存并退出登录');
      // 跳转到登录页
      router.push('/login');
    } catch (error) {
      message.error('操作失败，请重试');
      throw error;
    }
  };

  if (showConfirm) {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '确认操作',
        content: '清除缓存将同时退出登录，是否继续？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await handler();
            resolve(true);
          } catch (error) {
            reject(error);
          }
        },
        onCancel: () => {
          resolve(false);
        }
      });
    });
  }

  return handler();
}; 
