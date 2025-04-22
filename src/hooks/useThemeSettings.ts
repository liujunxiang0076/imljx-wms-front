/**
 * 主题设置相关的组合式API
 */
import { ref } from 'vue';
import { useLayoutStore } from '../store/layout';
import type { LayoutState } from '../store/layout';
import { message, Modal } from 'ant-design-vue';
import type { Ref } from 'vue';

/**
 * 使用主题设置
 */
export function useThemeSettings(): {
  layoutStore: LayoutState;
  colorList: string[];
  suggestedColors: string[];
  drawerWidth: Ref<number>;
  previewColor: Ref<string>;
  originalColor: Ref<string>;
  showColorPicker: Ref<boolean>;
  customColor: Ref<string>;
  isValidColor: Ref<boolean>;
  showSettingDrawer: Ref<boolean>;
  updateThemeSetting: (checked: boolean) => void;
  toggleFixedHeader: (value: boolean) => void;
  toggleShowTabs: (value: boolean) => void;
  setLayoutType: (type: 'sider' | 'top' | 'mix' | 'mix-right') => void;
  updateSplitMenus: (value: boolean) => void;
  setPrimaryColor: (color: string, showMessage?: boolean) => void;
  validateColor: () => void;
  selectSuggestedColor: (color: string) => void;
  confirmCustomColor: () => void;
  cancelColorSelection: () => void;
  previewPrimaryColor: (color: string) => void;
  resetPreviewColor: () => void;
  resetSettings: () => void;
  initThemeSettings: () => void;
} {
  // 获取布局状态
  const layoutStore = useLayoutStore();
  
  // 主题色列表
  const colorList = [
    '#1890ff', // 蓝色
    '#52c41a', // 绿色
    '#faad14', // 黄色
    '#f5222d', // 红色
    '#722ed1', // 紫色
    '#13c2c2', // 青色
    '#fa541c', // 橙色
    '#eb2f96', // 粉色
    '#2f54eb', // 深蓝色
    '#fadb14'  // 明黄色
  ];

  // 推荐颜色
  const suggestedColors = [
    '#f5222d', // 红色
    '#fa541c', // 橙红色
    '#fa8c16', // 橙色
    '#faad14', // 金色
    '#fadb14', // 黄色
    '#a0d911', // 青柠色
    '#52c41a', // 绿色
    '#13c2c2', // 青色
    '#1890ff', // 蓝色
    '#2f54eb', // 深蓝色
    '#722ed1', // 紫色
    '#eb2f96'  // 粉色
  ];

  // 抽屉宽度
  const drawerWidth = ref(360);

  // 预览相关变量和颜色选择器变量
  const previewColor = ref('');
  const originalColor = ref('');
  const showColorPicker = ref(false);
  const customColor = ref('');
  const isValidColor = ref(false);

  // 抽屉显示状态
  const showSettingDrawer = ref(false);

  /**
   * 更新主题设置
   */
  const updateThemeSetting = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    layoutStore.siderTheme = theme;
    
    // 保存到本地存储
    localStorage.setItem('siderTheme', theme);

    // 确保主题类名正确应用
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    
    // 显示成功消息
    message.success(`已切换到${theme === 'dark' ? '暗色' : '亮色'}模式`);
  };

  /**
   * 切换固定头部
   */
  const toggleFixedHeader = (value: boolean) => {
    // 更新store
    layoutStore.fixedHeader = value;
    // 保存到本地存储
    localStorage.setItem('fixedHeader', String(value));
    // 应用样式变更
    if (value) {
      document.body.classList.add('fixed-header');
    } else {
      document.body.classList.remove('fixed-header');
    }
    // 显示提示
    message.success(`已${value ? '开启' : '关闭'}固定页头`);
  };

  /**
   * 切换显示标签页
   */
  const toggleShowTabs = (value: boolean) => {
    // 更新store
    layoutStore.showTabs = value;
    // 保存到本地存储
    localStorage.setItem('showTabs', String(value));
    // 应用样式变更
    if (value) {
      document.body.classList.add('show-tabs');
    } else {
      document.body.classList.remove('show-tabs');
    }
    // 显示提示
    message.success(`已${value ? '开启' : '关闭'}页面标签栏`);
  };

  /**
   * 设置布局类型
   */
  const setLayoutType = (type: 'sider' | 'top' | 'mix' | 'mix-right') => {
    layoutStore.setLayoutType(type);
    localStorage.setItem('layoutType', type);
  };

  /**
   * 更新菜单设置
   */
  const updateSplitMenus = (value: boolean) => {
    // 更新store
    layoutStore.splitMenus = value;
    // 保存到本地存储
    localStorage.setItem('splitMenus', String(value));
    // 显示提示
    message.success(`已${value ? '开启' : '关闭'}子菜单自动展开/折叠`);
  };

  /**
   * 帮助函数 - 调整颜色亮度
   */
  const adjustColor = (color: string, percent: number): string => {
    // 解析颜色
    const hexToRgb = (hex: string): number[] => {
      const cleanHex = hex.replace('#', '');
      return [
        parseInt(cleanHex.substring(0, 2), 16),
        parseInt(cleanHex.substring(2, 4), 16),
        parseInt(cleanHex.substring(4, 6), 16)
      ];
    };
    
    const rgb = hexToRgb(color);
    let adjustedRgb;
    
    if (percent > 0) {
      // 变亮
      adjustedRgb = rgb.map(c => Math.min(255, Math.round(c + (255 - c) * (percent / 100))));
    } else {
      // 变暗
      adjustedRgb = rgb.map(c => Math.max(0, Math.round(c + (c * (percent / 100)))));
    }
    
    // 转回十六进制
    return `#${adjustedRgb.map(c => c.toString(16).padStart(2, '0')).join('')}`;
  };

  /**
   * 注入全局样式
   */
  const injectGlobalStyle = (color: string) => {
    const styleId = 'theme-color-style';
    let styleTag = document.getElementById(styleId);
    
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    
    const cssVars = `
      :root {
        --ant-primary-color: ${color} !important;
        --primary-color: ${color} !important;
      }
      
      .ant-btn-primary {
        background-color: ${color} !important;
        border-color: ${color} !important;
      }
      
      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${color} !important;
        border-color: ${color} !important;
      }
      
      .ant-radio-checked .ant-radio-inner {
        border-color: ${color} !important;
      }
      
      .ant-radio-checked .ant-radio-inner::after {
        background-color: ${color} !important;
      }
      
      .ant-switch-checked {
        background-color: ${color} !important;
      }
      
      .ant-menu-light .ant-menu-item-selected, 
      .ant-menu-light .ant-menu-submenu-selected {
        color: ${color} !important;
      }
      
      .ant-menu-dark .ant-menu-item-selected {
        background-color: ${color} !important;
      }
      
      .ant-tabs-ink-bar {
        background: ${color} !important;
      }
    `;
    
    styleTag.innerHTML = cssVars;
  };

  /**
   * 设置主题色
   */
  const setPrimaryColor = (color: string, showMessage = true) => {
    layoutStore.setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
    
    // 确保主题色立即生效 - 增强样式应用
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
    root.style.setProperty('--ant-primary-color', color);
    root.style.setProperty('--ant-primary-color-hover', adjustColor(color, 15));
    root.style.setProperty('--ant-primary-color-active', adjustColor(color, 25));
    root.style.setProperty('--ant-primary-color-outline', color.replace(/^#/, '#') + '33');
    
    // 应用额外的Ant Design样式变量
    root.style.setProperty('--ant-primary-1', adjustColor(color, 80));
    root.style.setProperty('--ant-primary-2', adjustColor(color, 60));
    root.style.setProperty('--ant-primary-3', adjustColor(color, 40));
    root.style.setProperty('--ant-primary-4', adjustColor(color, 20));
    root.style.setProperty('--ant-primary-5', color);
    root.style.setProperty('--ant-primary-6', adjustColor(color, -10));
    root.style.setProperty('--ant-primary-7', adjustColor(color, -20));
    
    // 注入全局样式，确保主题色应用到所有相关组件
    injectGlobalStyle(color);
    
    // 显示成功消息
    if (showMessage) {
      message.success('主题色已更新');
    }
  };

  /**
   * 验证颜色是否合法
   */
  const validateColor = () => {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    isValidColor.value = colorRegex.test(customColor.value);
    
    // 自动添加#前缀
    if (customColor.value && !customColor.value.startsWith('#')) {
      customColor.value = '#' + customColor.value;
      validateColor();
    }
  };

  /**
   * 选择推荐颜色
   */
  const selectSuggestedColor = (color: string) => {
    customColor.value = color;
    isValidColor.value = true;
  };

  /**
   * 确认自定义颜色
   */
  const confirmCustomColor = () => {
    if (isValidColor.value) {
      setPrimaryColor(customColor.value);
      showColorPicker.value = false;
      customColor.value = '';
    }
  };

  /**
   * 取消颜色选择
   */
  const cancelColorSelection = () => {
    showColorPicker.value = false;
    customColor.value = '';
    isValidColor.value = false;
  };

  /**
   * 预览主题颜色
   */
  const previewPrimaryColor = (color: string) => {
    if (!originalColor.value) {
      originalColor.value = layoutStore.primaryColor;
    }
    previewColor.value = color;
    
    // 临时应用颜色进行预览
    document.documentElement.style.setProperty('--ant-primary-color', color);
    document.documentElement.style.setProperty('--ant-primary-color-hover', color);
    
    // 添加主要UI元素的颜色更新
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
    root.style.setProperty('--ant-primary-color', color);
    root.style.setProperty('--ant-primary-color-hover', color);
    root.style.setProperty('--ant-primary-color-active', color);
    root.style.setProperty('--ant-primary-color-outline', color.replace(/^#/, '#') + '33');
    
    // 立即预览一些UI元素的颜色
    const cssText = `.active-preview {
      color: ${color} !important;
      border-color: ${color} !important;
      background-color: ${color}1a !important;
    }`;
    
    let style = document.getElementById('theme-preview-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'theme-preview-style';
      document.head.appendChild(style);
    }
    style.textContent = cssText;
  };

  /**
   * 重置预览颜色
   */
  const resetPreviewColor = () => {
    if (originalColor.value) {
      // 恢复原来的颜色
      const root = document.documentElement;
      root.style.setProperty('--primary-color', originalColor.value);
      root.style.setProperty('--ant-primary-color', originalColor.value);
      root.style.setProperty('--ant-primary-color-hover', originalColor.value);
      root.style.setProperty('--ant-primary-color-active', originalColor.value);
      root.style.setProperty('--ant-primary-color-outline', originalColor.value.replace(/^#/, '#') + '33');
      
      previewColor.value = '';
      originalColor.value = '';
      
      // 移除预览样式
      const style = document.getElementById('theme-preview-style');
      if (style) {
        style.textContent = '';
      }
    }
  };

  /**
   * 重置所有配置为默认值
   */
  const resetSettings = () => {
    Modal.confirm({
      title: '确认重置',
      content: '确定要将所有配置重置为默认值吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 重置主题为亮色
        layoutStore.siderTheme = 'light';
        // 重置布局类型为侧边栏
        layoutStore.setLayoutType('sider');
        // 重置主题色为默认蓝色
        layoutStore.setPrimaryColor('#1890ff');
        // 重置显示设置
        layoutStore.fixedHeader = true;
        layoutStore.showTabs = true;
        layoutStore.splitMenus = false;
        
        // 清除localStorage中的设置
        localStorage.removeItem('siderTheme');
        localStorage.removeItem('layoutType');
        localStorage.removeItem('primaryColor');
        localStorage.removeItem('fixedHeader');
        localStorage.removeItem('showTabs');
        localStorage.removeItem('splitMenus');
        localStorage.removeItem('collapsed');
        
        // 提示用户
        message.success('已重置所有配置');
      }
    });
  };

  /**
   * 初始化主题设置
   */
  const initThemeSettings = () => {
    // 从本地存储恢复设置
    const savedTheme = localStorage.getItem('siderTheme');
    const savedFixedHeader = localStorage.getItem('fixedHeader');
    const savedShowTabs = localStorage.getItem('showTabs');
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedLayoutType = localStorage.getItem('layoutType');
    const savedSplitMenus = localStorage.getItem('splitMenus');

    // 应用主题设置
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      layoutStore.siderTheme = savedTheme;
      
      // 确保主题类名正确应用
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    }
    
    // 应用固定头部设置
    if (savedFixedHeader) {
      const fixedHeader = savedFixedHeader === 'true';
      layoutStore.fixedHeader = fixedHeader;
      if (fixedHeader) {
        document.body.classList.add('fixed-header');
      } else {
        document.body.classList.remove('fixed-header');
      }
    }
    
    // 应用标签页设置
    if (savedShowTabs) {
      const showTabs = savedShowTabs === 'true';
      layoutStore.showTabs = showTabs;
      if (showTabs) {
        document.body.classList.add('show-tabs');
      } else {
        document.body.classList.remove('show-tabs');
      }
    }
    
    // 应用主题色
    if (savedPrimaryColor) {
      setPrimaryColor(savedPrimaryColor, false);
    } else {
      // 应用默认主题色
      setPrimaryColor(layoutStore.primaryColor, false);
    }
    
    // 应用布局类型
    if (savedLayoutType && ['sider', 'top', 'mix', 'mix-right'].includes(savedLayoutType)) {
      setLayoutType(savedLayoutType as 'sider' | 'top' | 'mix' | 'mix-right');
    }
    
    // 应用菜单设置
    if (savedSplitMenus) {
      layoutStore.splitMenus = savedSplitMenus === 'true';
    }
  };

  return {
    // 状态
    layoutStore,
    colorList,
    suggestedColors,
    drawerWidth,
    previewColor,
    originalColor,
    showColorPicker,
    customColor,
    isValidColor,
    showSettingDrawer,
    
    // 方法
    updateThemeSetting,
    toggleFixedHeader,
    toggleShowTabs,
    setLayoutType,
    updateSplitMenus,
    setPrimaryColor,
    validateColor,
    selectSuggestedColor,
    confirmCustomColor,
    cancelColorSelection,
    previewPrimaryColor,
    resetPreviewColor,
    resetSettings,
    initThemeSettings,
  };
} 
