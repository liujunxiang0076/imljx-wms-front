import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useLayoutStore } from '@/store/layout';

export function useTheme() {
  const layoutStore = useLayoutStore();
  const primaryColor = ref(layoutStore.primaryColor);

  // 调整颜色亮度
  const adjustColor = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;

    r = Math.min(Math.max(0, r), 255);
    g = Math.min(Math.max(0, g), 255);
    b = Math.min(Math.max(0, b), 255);

    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  // 更新主题色
  const updateThemeColor = (color: string) => {
    try {
      document.documentElement.style.setProperty('--ant-primary-color', color);
      document.documentElement.style.setProperty('--primary-color', color);
      layoutStore.setPrimaryColor(color);
      message.success('主题色更新成功');
    } catch (error) {
      message.error('主题色更新失败');
      console.error('Theme color update failed:', error);
    }
  };

  // 重置主题色
  const resetThemeColor = () => {
    updateThemeColor('#1890ff');
  };

  return {
    primaryColor,
    updateThemeColor,
    resetThemeColor,
    adjustColor
  };
} 
