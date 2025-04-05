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
      
      <!-- 页面配置按钮 -->
      <div class="action-item config-btn" @click="drawerVisible = true">
        <SettingOutlined />
      </div>
      
      <!-- 用户头像 -->
      <UserAvatar />
    </div>
    
    <!-- 页面配置抽屉 -->
    <a-drawer
      title="页面配置"
      placement="right"
      :visible="drawerVisible"
      @close="drawerVisible = false"
      width="300"
    >
      <!-- 主题模式 -->
      <div class="setting-block">
        <div class="setting-title">主题模式</div>
        <div class="setting-option theme-select">
          <div 
            class="theme-item" 
            :class="{ active: layoutStore.siderTheme === 'light' }"
            @click="setTheme('light')"
          >
            <BgColorsOutlined />
            <div class="theme-text">亮色</div>
          </div>
          <div 
            class="theme-item" 
            :class="{ active: layoutStore.siderTheme === 'dark' }"
            @click="setTheme('dark')"
          >
            <BgColorsOutlined />
            <div class="theme-text">暗色</div>
          </div>
        </div>
      </div>
      
      <!-- 导航布局 -->
      <div class="setting-block">
        <div class="setting-title">导航布局</div>
        <div class="setting-option layout-select">
          <div 
            class="layout-item" 
            :class="{ active: layoutStore.layoutType === 'sider' }"
            @click="setLayoutType('sider')"
          >
            <div class="layout-preview sider-preview"></div>
            <div class="layout-text">侧边菜单</div>
          </div>
          <div 
            class="layout-item" 
            :class="{ active: layoutStore.layoutType === 'top' }"
            @click="setLayoutType('top')"
          >
            <div class="layout-preview top-preview"></div>
            <div class="layout-text">顶部菜单</div>
          </div>
          <div 
            class="layout-item" 
            :class="{ active: layoutStore.layoutType === 'mix' }"
            @click="setLayoutType('mix')"
          >
            <div class="layout-preview mix-preview"></div>
            <div class="layout-text">混合菜单</div>
          </div>
        </div>
      </div>
      
      <!-- 主题色 -->
      <div class="setting-block">
        <div class="setting-title">主题色</div>
        <div class="setting-option color-select">
          <div 
            v-for="color in themeColors" 
            :key="color.value"
            class="color-item" 
            :style="{ backgroundColor: color.value }"
            :class="{ active: layoutStore.primaryColor === color.value }"
            @click="setPrimaryColor(color.value)"
          ></div>
        </div>
      </div>
      
      <!-- 功能开关 -->
      <div class="setting-block">
        <div class="setting-title">界面设置</div>
        <div class="setting-option">
          <a-list :split="false">
            <a-list-item>
              <template #actions>
                <a-switch 
                  :model-value="layoutStore.fixedHeader" 
                  @update:model-value="(checked) => layoutStore.$patch({ fixedHeader: checked })"
                />
              </template>
              <a-list-item-meta title="固定头部" />
            </a-list-item>
            <a-list-item>
              <template #actions>
                <a-switch 
                  :checked="layoutStore.showTabs" 
                  @click="() => layoutStore.showTabs = !layoutStore.showTabs"
                />
              </template>
              <a-list-item-meta title="显示标签栏" />
            </a-list-item>
          </a-list>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined,
  SettingOutlined,
  BgColorsOutlined
} from '@ant-design/icons-vue';
import UserAvatar from './UserAvatar.vue';
import { useLayoutStore } from '../../store/layout';

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
const drawerVisible = ref(false);
const customColor = ref('#1890ff');

// 全屏事件监听
const handleFullscreenChange = () => {
  // 移除未使用的全屏控制相关代码
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  // 初始化主题
  setTimeout(() => {
    // 延迟执行以确保组件完全挂载
    setPrimaryColor(layoutStore.primaryColor);
    setTheme(layoutStore.siderTheme);
  }, 100);
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

// 主题颜色列表
const themeColors = [
  { name: '拂晓蓝', value: '#1890ff' },
  { name: '薄暮红', value: '#f5222d' },
  { name: '火山橙', value: '#fa541c' },
  { name: '日暮黄', value: '#faad14' },
  { name: '青柠绿', value: '#52c41a' },
  { name: '极光绿', value: '#13c2c2' },
  { name: '酱紫', value: '#722ed1' }
];

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

// 设置布局类型
const setLayoutType = (type: 'sider' | 'top' | 'mix') => {
  layoutStore.$patch({ layoutType: type });
};

// 设置主题色
const setPrimaryColor = (color: string) => {
  // 更新store中的主题色
  layoutStore.primaryColor = color;
  customColor.value = color;
  
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
</script>

<style lang="scss" scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  
  .trigger-btn {
    font-size: 18px;
    padding: 0 24px;
    height: 64px;
    line-height: 64px;
    cursor: pointer;
    transition: color 0.3s;
    display: inline-flex;
    align-items: center;
    
    &:hover {
      color: #1890ff;
    }
  }
  
  .action-area {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
  }
  
  .action-item {
    padding: 0 12px;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  
  .notification-wrapper {
    position: relative;
    
    :deep(.ant-badge-dot) {
      position: absolute;
      top: -2px;
      right: 0px;
      height: 6px;
      width: 6px;
      box-shadow: 0 0 0 1.5px #fff;
      animation: badge-breathe 1.2s ease-in-out infinite;
    }
    
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
  
  :deep(.ant-avatar) {
    margin-left: 12px;
    cursor: pointer;
    background: #1890ff;
    
    &:hover {
      opacity: 0.85;
    }
  }
}

/* 抽屉样式 */
.setting-block {
  margin-bottom: 24px;
  
  .setting-title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
    font-weight: 500;
  }
  
  .setting-option {
    margin-bottom: 24px;
  }
  
  /* 主题选择 */
  .theme-select {
    display: flex;
    gap: 16px;
    
    .theme-item {
      flex: 1;
      text-align: center;
      cursor: pointer;
      height: 44px;
      background: #f0f2f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      position: relative;
      
      &.active {
        border: 1px solid #1890ff;
      }
      
      .theme-text {
        margin-left: 8px;
      }
    }
  }
  
  /* 布局选择 */
  .layout-select {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    
    .layout-item {
      flex-basis: calc(33% - 11px);
      cursor: pointer;
      text-align: center;
      
      &.active .layout-preview {
        border: 1px solid #1890ff;
      }
      
      .layout-preview {
        height: 64px;
        margin-bottom: 8px;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
        position: relative;
        overflow: hidden;
      }
      
      .layout-text {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }
      
      .sider-preview {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 100%;
          background: #001529;
        }
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 30%;
          width: 70%;
          height: 20%;
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
        }
      }
      
      .top-preview {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 20%;
          background: #001529;
        }
      }
      
      .mix-preview {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 20%;
          background: #001529;
        }
        
        &::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 0;
          width: 30%;
          height: 80%;
          background: #f0f2f5;
        }
      }
    }
  }
  
  /* 颜色选择 */
  .color-select {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .color-item {
      width: 22px;
      height: 22px;
      cursor: pointer;
      border-radius: 4px;
      border: 2px solid transparent;
      transition: all 0.3s ease;
      
      &.active {
        border-color: #fff;
        box-shadow: 0 0 0 2px currentColor;
        transform: scale(1.1);
      }
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
}
</style>
