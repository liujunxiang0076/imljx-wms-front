<template>
  <div class="header-content">
    <!-- 菜单折叠按钮，只在侧边菜单模式下显示 -->
    <template v-if="!isTopMenu">
      <a-button
        class="trigger-btn"
        type="text"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <MenuFoldOutlined v-if="!collapsed" />
        <MenuUnfoldOutlined v-else />
      </a-button>
    </template>
    
    <!-- 右侧功能区 -->
    <div class="action-area">
      <!-- 通知图标 -->
      <div class="action-item notification-wrapper">
        <a-badge dot>
          <BellOutlined />
        </a-badge>
      </div>
      
      <!-- 用户头像 -->
      <UserAvatar />

      <!-- 主题模式按钮 -->
      <a-tooltip :title="isDark ? '切换到亮色模式' : '切换到暗色模式'">
        <BulbOutlined v-if="!isDark" class="header-action" @click="toggleDark" />
        <BulbFilled v-else class="header-action" @click="toggleDark" />
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons-vue';
import { useLayoutStore } from '../../store/layout';
import { message } from 'ant-design-vue';

// Props 定义
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  isTopMenu: {
    type: Boolean,
    default: false
  }
});

// Emits 定义
const emit = defineEmits(['update:collapsed']);

const layoutStore = useLayoutStore();
const isDark = ref(false);

// 全屏事件监听
const handleFullscreenChange = () => {
  // 移除未使用的全屏控制相关代码
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  // 初始化isDark状态
  isDark.value = layoutStore.siderTheme === 'dark';
  
  // 立即应用主题类名
  if(isDark.value) {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  }
  
  // 初始化主题
  setTimeout(() => {
    // 延迟执行以确保组件完全挂载
    setPrimaryColor(layoutStore.primaryColor);
    setTheme(layoutStore.siderTheme);
  }, 100);

  // 从本地存储恢复设置
  const savedTheme = localStorage.getItem('siderTheme');
  const savedFixedHeader = localStorage.getItem('fixedHeader');
  const savedShowTabs = localStorage.getItem('showTabs');

  if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
    layoutStore.siderTheme = savedTheme;
  }
  if (savedFixedHeader) {
    layoutStore.fixedHeader = savedFixedHeader === 'true';
  }
  if (savedShowTabs) {
    layoutStore.showTabs = savedShowTabs === 'true';
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

// 设置主题
const setTheme = (theme: 'light' | 'dark') => {
  layoutStore.$patch({ siderTheme: theme });
  
  // 给body添加主题类，方便全局样式适配
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  }
  
  // 重新应用主题色，确保在暗色模式下也能正确显示
  setPrimaryColor(layoutStore.primaryColor);
};

// 设置主题色
const setPrimaryColor = (color: string) => {
  // 更新store中的主题色
  layoutStore.primaryColor = color;
  localStorage.setItem('primaryColor', color);
  
  // 创建或更新样式标签
  let styleTag = document.getElementById('theme-color-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'theme-color-style';
    document.head.appendChild(styleTag);
  }
  
  // 直接注入CSS变量和全局覆盖样式
  const cssVars = `
    :root {
      --ant-primary-color: ${color} !important;
      --primary-color: ${color} !important;
      --ant-primary-color-hover: ${adjustColor(color, 15)} !important;
      --ant-primary-color-active: ${adjustColor(color, 25)} !important;
      --ant-primary-color-outline: ${color}33 !important;
      --ant-primary-color-deprecated-bg: ${adjustColor(color, 90)} !important;
      --ant-primary-color-deprecated-border: ${adjustColor(color, 60)} !important;
      --ant-primary-1: ${adjustColor(color, 80)} !important;
      --ant-primary-2: ${adjustColor(color, 60)} !important;
      --ant-primary-3: ${adjustColor(color, 40)} !important;
      --ant-primary-4: ${adjustColor(color, 20)} !important;
      --ant-primary-5: ${color} !important;
      --ant-primary-6: ${adjustColor(color, -10)} !important;
      --ant-primary-7: ${adjustColor(color, -20)} !important;
    }
    
    /* 暗色主题特殊处理 */
    .dark-theme {
      --ant-primary-color-deprecated-bg: ${adjustColor(color, 20)} !important;
      --ant-primary-1: ${adjustColor(color, 15)} !important;
      --ant-primary-2: ${adjustColor(color, 25)} !important;
    }
    
    /* 全局组件样式覆盖 */
    
    /* 进度条和滑块 */
    .ant-progress-bg {
      background-color: ${color} !important;
    }
    .ant-slider-track {
      background-color: ${color} !important;
    }
    .ant-slider-handle {
      border-color: ${color} !important;
    }
    .ant-slider-handle:focus {
      box-shadow: 0 0 0 5px ${color}33 !important;
    }
    
    /* 树形控件 */
    .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
      background-color: ${adjustColor(color, 90)} !important;
    }
    .ant-tree .ant-tree-node-content-wrapper:hover {
      background-color: ${adjustColor(color, 95)} !important;
    }
    
    /* 下拉菜单 */
    .ant-dropdown-menu-item-selected {
      color: ${color} !important;
      background-color: ${adjustColor(color, 95)} !important;
    }
    
    /* 步骤条 */
    .ant-steps .ant-steps-item-finish .ant-steps-item-icon {
      background-color: #fff !important;
      border-color: ${color} !important;
    }
    .ant-steps .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon {
      color: ${color} !important;
    }
    .ant-steps .ant-steps-item-process .ant-steps-item-icon {
      background-color: ${color} !important;
      border-color: ${color} !important;
    }
    
    /* 时间轴 */
    .ant-timeline-item-head-blue {
      color: ${color} !important;
      border-color: ${color} !important;
    }
    
    /* 标记和徽章 */
    .ant-tag-checkable:not(.ant-tag-checkable-checked):hover {
      color: ${color} !important;
    }
    .ant-tag-checkable-checked {
      background-color: ${color} !important;
    }
    
    /* 表单验证 */
    .ant-form-item-has-success.ant-form-item-has-feedback .ant-form-item-children-icon {
      color: ${color} !important;
    }
    
    /* 加载状态 */
    .ant-spin {
      color: ${color} !important;
    }
    
    /* 上传组件 */
    .ant-upload.ant-upload-select:hover {
      border-color: ${color} !important;
    }
    .ant-upload.ant-upload-drag:hover {
      border-color: ${color} !important;
    }
    
    /* 按钮相关 */
    .ant-btn-primary {
      background-color: ${color} !important;
      border-color: ${color} !important;
    }
    .ant-btn-primary:hover,
    .ant-btn-primary:focus {
      background-color: ${adjustColor(color, 15)} !important;
      border-color: ${adjustColor(color, 15)} !important;
    }
    .ant-btn-link {
      color: ${color} !important;
    }
    .ant-btn-link:hover {
      color: ${adjustColor(color, 15)} !important;
    }
    
    /* 表单控件 */
    .ant-checkbox-checked .ant-checkbox-inner,
    .ant-checkbox-indeterminate .ant-checkbox-inner {
      background-color: ${color} !important;
      border-color: ${color} !important;
    }
    .ant-radio-checked .ant-radio-inner {
      border-color: ${color} !important;
    }
    .ant-radio-checked .ant-radio-inner::after {
      background-color: ${color} !important;
    }
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
      color: ${color} !important;
      border-color: ${color} !important;
    }
    
    /* 开关、选择器等 */
    .ant-switch-checked {
      background-color: ${color} !important;
    }
    .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
      border-color: ${color} !important;
      box-shadow: 0 0 0 2px ${color}33 !important;
    }
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      background-color: ${adjustColor(color, 80)} !important;
    }
    
    /* 导航和标签 */
    .ant-menu-light .ant-menu-item-selected, 
    .ant-menu-light .ant-menu-submenu-selected {
      color: ${color} !important;
    }
    .ant-menu-light .ant-menu-item:hover, 
    .ant-menu-light .ant-menu-item-active {
      color: ${color} !important;
    }
    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: ${color} !important;
    }
    .ant-tabs-ink-bar {
      background: ${color} !important;
    }
    
    /* 链接和文字 */
    a {
      color: ${color};
    }
    a:hover {
      color: ${adjustColor(color, 15)};
    }
    .ant-typography a {
      color: ${color} !important;
    }
    
    /* 分页和日期选择器 */
    .ant-pagination-item-active {
      border-color: ${color} !important;
    }
    .ant-pagination-item-active a {
      color: ${color} !important;
    }
    .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
      background: ${color} !important;
    }
    
    /* 表格 */
    .ant-table-column-sort {
      background: ${adjustColor(color, 80)} !important;
    }
    
    /* 消息和通知 */
    .ant-message-info .anticon,
    .ant-notification-notice-info .anticon {
      color: ${color} !important;
    }
    
    /* 自定义类 */
    .text-primary {
      color: ${color} !important;
    }
    .bg-primary {
      background-color: ${color} !important;
    }
    .border-primary {
      border-color: ${color} !important;
    }
  `;
  
  styleTag.innerHTML = cssVars;
  
  // 应用到favicon（如果存在）
  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon && favicon.href && favicon.href.includes('data:image/svg+xml')) {
    const svg = decodeURIComponent(favicon.href.split(',')[1]);
    const coloredSvg = svg.replace(/fill="([^"]+)"/g, `fill="${color}"`);
    favicon.href = `data:image/svg+xml,${encodeURIComponent(coloredSvg)}`;
  }
};

// 帮助函数 - 调整颜色亮度
function adjustColor(color: string, percent: number): string {
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
}

// 切换暗黑模式
const toggleDark = () => {
  isDark.value = !isDark.value;
  const newTheme = isDark.value ? 'dark' : 'light';
  
  // 立即更新文档类名
  if(isDark.value) {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  }
  
  // 更新主题
  setTheme(newTheme);
  
  // 将主题设置保存到localStorage
  localStorage.setItem('siderTheme', newTheme);
  
  // 显示切换成功的消息
  message.success(`已切换到${isDark.value ? '暗色' : '亮色'}模式`);
};
</script>

<style lang="scss" scoped>
// 头部内容
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  // 触发按钮
  .trigger-btn {
    font-size: 18px;
    padding: 0 24px;
    height: 64px;
    line-height: 64px;
    cursor: pointer;
    transition: color 0.3s;
    display: inline-flex;
    align-items: center;
    // 鼠标悬停效果
    &:hover {
      color: #1890ff;
    }
  }
  // 触发按钮
  .action-area {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;

    // 配置按钮
    .config-btn {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      // 鼠标悬停效果
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    
  }
  // 操作区域
  .action-item {
    padding: 0 12px;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    // 鼠标悬停效果
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  
  // 修复混合模式下的样式问题
  .action-item {
    min-width: 40px;
    min-height: 40px;
    justify-content: center;
    
    // 混合模式特殊处理
    .mix-layout & {
      height: 64px;
      line-height: 64px;
    }
  }
  // 通知图标
  .notification-wrapper {
    position: relative;
    // 通知图标点
    :deep(.ant-badge-dot) {
      position: absolute;
      top: -2px;
      right: 0px;
      height: 6px;
      width: 6px;
      box-shadow: 0 0 0 1.5px #fff;
      animation: badge-breathe 1.2s ease-in-out infinite;
    }
    // 通知图标悬停效果
    &:hover :deep(.ant-badge-dot) {
      background: #ff4d4f;
      box-shadow: 0 0 0 1.5px #ff7875;
    }
  }
  
  @keyframes badge-breathe {
    0% { transform: scale(0.95); }
    50% { transform: scale(1.1); }
    100% { transform: scale(0.95); }
  }
  
  // 统一处理头像样式
  :deep(.header-action),
  :deep(.ant-avatar) {
    cursor: pointer;
    
    &:hover {
      opacity: 0.85;
    }
  }
}

/* 抽屉样式 */
:deep(.ant-drawer-header) {
  background: v-bind('layoutStore.siderTheme === "dark" ? "#001529" : "#f0f2f5"');
  transition: all 0.3s;
  border-radius: 0;
}

:deep(.ant-drawer-title) {
  color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
  font-weight: 500;
}

:deep(.ant-drawer-close) {
  color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
  
  &:hover {
    color: v-bind('layoutStore.siderTheme === "dark" ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.65)"');
  }
}

.setting-block {
  margin-bottom: 24px;
  
  .setting-title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .setting-option {
    margin-bottom: 12px;
  }

  /* 主题选择 */
  .theme-select {
    .theme-cards {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      
      .theme-card {
        flex: 1;
        height: 50px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.active {
          border: 2px solid #1890ff;
        }
        
        .theme-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          
          svg {
            width: 24px;
            height: 24px;
          }
        }
        
        &.light-theme-card {
          background-color: #f0f2f5;
          
          .theme-icon {
            color: #000;
          }
        }
        
        &.dark-theme-card {
          background-color: #1f1f1f;
          
          .theme-icon {
            color: #fff;
          }
        }
      }
    }
  }
  
  /* 开关列表样式 */
  .switch-list {
    .switch-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .switch-label {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
  
  /* 布局选择 */
  .layout-select {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    .layout-item {
      cursor: pointer;
      border-radius: 4px;
      padding: 2px;
      border: 1px solid #f0f0f0;
      
      &.active {
        border: 2px solid #1890ff;
        padding: 1px;
      }
      
      .layout-preview {
        height: 50px;
        border-radius: 2px;
        position: relative;
        
        &:hover {
          opacity: 0.8;
        }
      }

      .sider-preview {
        background: #f0f2f5;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 30%;
          height: 100%;
          background: #001529;
        }
      }

      .top-preview {
        background: #f0f2f5;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 25%;
          background: #001529;
        }
      }

      .mix-preview {
        background: #f0f2f5;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 25%;
          background: #001529;
        }
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 25%;
          width: 30%;
          height: 75%;
          background: #fff;
          border-right: 1px solid #f0f0f0;
        }
      }

      .mix-preview-2 {
        background: #f0f2f5;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          width: 100%;
          height: 25%;
          background: #001529;
        }
      }
    }
  }
  
  /* 颜色选择 */
  .color-select {
    .theme-colors {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .color-item {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        &.active::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 0 1px currentColor;
        }
        
        &.color-picker {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px dashed #d9d9d9;
        }
      }
    }
  }
}
</style>
