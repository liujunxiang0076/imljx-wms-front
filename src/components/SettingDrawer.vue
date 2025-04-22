<template>
  <!-- 设置抽屉 -->
  <a-drawer
    title="页面配置"
    placement="right"
    :closable="true"
    :visible="visible"
    @close="onClose"
    :width="drawerWidth"
    class="system-setting-drawer"
    :bodyStyle="{ padding: '20px', paddingBottom: '70px' }"
    :headerStyle="{ 
      background: themeSettings.layoutStore.siderTheme === 'dark' ? '#001529' : '#f0f2f5',
      color: themeSettings.layoutStore.siderTheme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.85)',
      borderBottom: themeSettings.layoutStore.siderTheme === 'dark' ? 'none' : '1px solid #f0f0f0',
      padding: '16px 20px'
    }"
  >
    <!-- 主题模式 -->
    <div class="setting-block">
      <div class="setting-title">主题模式</div>
      <div class="setting-content">
        <div class="theme-cards">
          <div 
            class="theme-card" 
            :class="{ active: themeSettings.layoutStore.siderTheme === 'light' }"
            @click="themeSettings.updateThemeSetting(false)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 S11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0 s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
            </svg>
            <span>亮色</span>
          </div>
          <div 
            class="theme-card dark-card" 
            :class="{ active: themeSettings.layoutStore.siderTheme === 'dark' }"
            @click="themeSettings.updateThemeSetting(true)"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.34,2.02C6.59,1.82,2,6.42,2,12c0,5.52,4.48,10,10,10c3.71,0,6.93-2.02,8.66-5.02C13.15,16.73,8.57,8.55,12.34,2.02z" />
            </svg>
            <span>暗色</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航布局 -->
    <div class="setting-block">
      <div class="setting-title">导航布局</div>
      <div class="setting-content">
        <div class="layout-grid">
          <div 
            class="layout-item" 
            :class="{ active: themeSettings.layoutStore.layoutType === 'sider' }"
            @click="themeSettings.setLayoutType('sider')"
          >
            <div class="layout-preview sider-layout"></div>
            <div class="layout-name">侧边布局</div>
          </div>
          <div 
            class="layout-item" 
            :class="{ active: themeSettings.layoutStore.layoutType === 'top' }"
            @click="themeSettings.setLayoutType('top')"
          >
            <div class="layout-preview top-layout"></div>
            <div class="layout-name">顶部布局</div>
          </div>
          <div 
            class="layout-item" 
            :class="{ active: themeSettings.layoutStore.layoutType === 'mix' }"
            @click="themeSettings.setLayoutType('mix')"
          >
            <div class="layout-preview mix-layout"></div>
            <div class="layout-name">混合布局</div>
          </div>
          <div 
            class="layout-item" 
            :class="{ active: themeSettings.layoutStore.layoutType === 'mix-right' }"
            @click="themeSettings.setLayoutType('mix-right')"
          >
            <div class="layout-preview mix-right-layout"></div>
            <div class="layout-name">右侧混合</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主题色 -->
    <div class="setting-block">
      <div class="setting-title">主题色</div>
      <div class="setting-content theme-color-content">
        <div class="theme-color-grid-container">
          <div class="color-grid">
            <div 
              v-for="color in themeSettings.colorList" 
              :key="color"
              class="color-item" 
              :style="{ backgroundColor: color }"
              :class="{ active: themeSettings.layoutStore.primaryColor === color }"
              @click="themeSettings.setPrimaryColor(color)"
              @mouseenter="themeSettings.previewPrimaryColor(color)"
              @mouseleave="themeSettings.resetPreviewColor()"
            ></div>
            <div class="color-item color-picker" @click="() => { themeSettings.showColorPicker.value = true }">
              <div class="color-picker-icon">
                <svg viewBox="64 64 896 896" width="0.9em" height="0.9em" fill="currentColor">
                  <path d="M924.8 385.6a446.7 446.7 0 0 0-96-142.4 446.7 446.7 0 0 0-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 0 0-142.4 96 446.7 446.7 0 0 0-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 0 1 140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 0 0-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 0 0 0 79.2 55.95 55.95 0 0 0 79.2 0 55.87 55.87 0 0 0 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm-147.4 64.8l-31.1-31.1a8.03 8.03 0 0 0-11.3 0l-56.6 56.6a8.03 8.03 0 0 0 0 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm291.7-56.6l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6a8.03 8.03 0 0 0-11.3 0l-31.1 31.1a8.03 8.03 0 0 0 0 11.3zM312 490v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="color-preview-tooltip" v-if="themeSettings.previewColor.value">
            预览: <span class="color-dot" :style="{backgroundColor: themeSettings.previewColor.value}"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 界面功能 -->
    <div class="setting-block">
      <div class="setting-title">界面功能</div>
      <div class="setting-content">
        <div class="switch-list">
          <div class="switch-item">
            <div class="switch-info">
              <span class="switch-label">折叠菜单</span>
              <span class="switch-desc">自动展开/折叠子菜单</span>
            </div>
            <a-switch 
              :model-value="themeSettings.layoutStore.splitMenus"
              @update:model-value="themeSettings.updateSplitMenus"
            />
          </div>
          <div class="switch-item">
            <div class="switch-info">
              <span class="switch-label">页面标签栏</span>
              <span class="switch-desc">显示多标签页导航</span>
            </div>
            <a-switch 
              :model-value="themeSettings.layoutStore.showTabs"
              @update:model-value="themeSettings.toggleShowTabs"
            />
          </div>
          <div class="switch-item">
            <div class="switch-info">
              <span class="switch-label">固定页头</span>
              <span class="switch-desc">固定顶部导航栏</span>
            </div>
            <a-switch 
              :model-value="themeSettings.layoutStore.fixedHeader"
              @update:model-value="themeSettings.toggleFixedHeader"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 重置按钮 -->
    <div class="setting-footer">
      <a-button type="primary" block @click="themeSettings.resetSettings">
        <reload-outlined />
        恢复默认配置
      </a-button>
    </div>
  </a-drawer>

  <!-- 添加颜色选择器弹窗 -->
  <a-modal 
    :visible="themeSettings.showColorPicker.value" 
    @update:visible="(val) => themeSettings.showColorPicker.value = val"
    title="自定义主题色" 
    width="300px" 
    :footer="null"
    @cancel="themeSettings.cancelColorSelection"
  >
    <div class="custom-color-picker">
      <div class="color-input-row">
        <span>颜色值：</span>
        <a-input 
          :model-value="themeSettings.customColor.value" 
          @update:model-value="value => themeSettings.customColor.value = value"
          placeholder="#1890ff" 
          :maxlength="7"
          @change="themeSettings.validateColor"
        />
      </div>
      
      <div class="color-preview-row">
        <span>预览：</span>
        <div class="color-preview-box" :style="{ backgroundColor: themeSettings.isValidColor.value ? themeSettings.customColor.value : '#e0e0e0' }"></div>
      </div>
      
      <div v-if="!themeSettings.isValidColor.value && themeSettings.customColor.value" class="color-error">
        请输入有效的十六进制颜色值 (例如: #1890ff)
      </div>
    </div>
    
    <div class="suggested-colors">
      <div class="suggested-title">推荐颜色</div>
      <div class="suggested-grid">
        <div 
          v-for="(color, index) in themeSettings.suggestedColors" 
          :key="index"
          class="suggested-item"
          :style="{ backgroundColor: color }"
          @click="themeSettings.selectSuggestedColor(color)"
        ></div>
      </div>
    </div>
    
    <div class="action-buttons">
      <a-button @click="themeSettings.cancelColorSelection">取消</a-button>
      <a-button 
        type="primary" 
        :disabled="!themeSettings.isValidColor.value" 
        @click="themeSettings.confirmCustomColor"
      >确定</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from 'vue';
import { useThemeSettings } from '../hooks/useThemeSettings';
import { ReloadOutlined } from "@ant-design/icons-vue";

// 使用主题设置hooks
const themeSettings = useThemeSettings();
// 定义props
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible', 'close']);

// 关闭抽屉
const onClose = () => {
  emit('update:visible', false);
  emit('close');
};

// 定义变量
const drawerWidth = themeSettings.drawerWidth;

// 在组件挂载时初始化主题设置
onMounted(() => {
  themeSettings.initThemeSettings();
});
</script>

<script lang="ts">
export default {
  name: 'SettingDrawer'
};
</script>

<style lang="scss" scoped>
/* 新的设置抽屉样式 */
.system-setting-drawer {
  :deep(.ant-drawer-content-wrapper) {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  }

  :deep(.ant-drawer-header) {
    transition: all 0.3s;
    border-radius: 0;
    
    .ant-drawer-title {
      font-weight: 500;
      font-size: 16px;
      color: v-bind('themeSettings.layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
    }
    
    .ant-drawer-close {
      color: v-bind('themeSettings.layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
      
      &:hover {
        color: v-bind('themeSettings.layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
      }
    }
  }

  :deep(.ant-drawer-body) {
    padding: 20px;
  }

  .setting-block {
    margin-bottom: 28px;
    animation: fadeIn 0.3s ease-in-out;

    .setting-title {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 18px;
      color: rgba(0, 0, 0, 0.85);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -8px;
        width: 24px;
        height: 2px;
        background-color: #1890ff;
        border-radius: 1px;
      }
    }

    .setting-content {
      margin-bottom: 12px;
      
      &.theme-color-content {
        padding: 0 8px;
      }
    }

    /* 主题色容器 */
    .theme-color-grid-container {
      background-color: #fafafa;
      border-radius: 4px;
      padding: 8px 10px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    /* 主题模式卡片 */
    .theme-cards {
      display: flex;
      gap: 12px;
      
      .theme-card {
        flex: 1;
        height: 40px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        gap: 8px;
        transition: all 0.2s;
        
        span {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.65);
        }
        
        &:hover {
          border-color: #40a9ff;
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.1);
        }
        
        &.active {
          border: 1px solid #1890ff;
          background-color: rgba(24, 144, 255, 0.05);
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            right: 4px;
            top: 4px;
            width: 4px;
            height: 4px;
            background-color: #1890ff;
            border-radius: 50%;
          }
        }
        
        svg {
          color: #000;
        }
        
        &.dark-card {
          background-color: #141414;
          border-color: #303030;
          
          svg, span {
            color: #fff;
          }
          
          &:hover {
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }
    
    /* 布局网格 */
    .layout-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      
      .layout-item {
        cursor: pointer;
        border-radius: 2px;
        padding: 6px;
        border: 1px solid #f0f0f0;
        transition: all 0.2s;
        
        &:hover {
          border-color: #40a9ff;
          box-shadow: 0 1px 6px rgba(24, 144, 255, 0.08);
        }
        
        &.active {
          border: 1px solid #1890ff;
          background-color: rgba(24, 144, 255, 0.04);
        }
        
        .layout-preview {
          height: 40px;
          border-radius: 2px;
          position: relative;
          background: #f5f5f5;
          margin-bottom: 6px;
        }
        
        .layout-name {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
          text-align: center;
        }
        
        .sider-layout::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 20%;
          height: 100%;
          background: #001529;
        }
        
        .top-layout::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 20%;
          background: #001529;
        }
        
        .mix-layout {
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 20%;
            background: #001529;
          }
          
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 20%;
            width: 20%;
            height: 80%;
            background: #fff;
            border-right: 1px solid #f0f0f0;
          }
        }
        
        .mix-right-layout::before {
          content: '';
          position: absolute;
          top: 0;
          width: 100%;
          height: 20%;
          background: #001529;
        }
      }
    }
    
    /* 颜色网格 */
    .color-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
      margin-bottom: 6px;
      padding: 4px 0;
      
      .color-item {
        width: 100%;
        aspect-ratio: 1;
        max-width: 26px;
        max-height: 26px;
        margin: 0 auto;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        &.active::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          border: 1.5px solid white;
          border-radius: 50%;
          background-color: transparent;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        }
        
        &.color-picker {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border: 1px dashed #d9d9d9;
          
          .color-picker-icon {
            color: rgba(0, 0, 0, 0.45);
            font-size: 12px;
          }
          
          &:hover .color-picker-icon {
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }
    }
    
    .color-preview-tooltip {
      font-size: 12px;
      margin-top: 4px;
      color: rgba(0, 0, 0, 0.65);
      display: flex;
      align-items: center;
      gap: 4px;
      
      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
    }
    
    /* 开关列表 */
    .switch-list {
      .switch-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .switch-info {
          display: flex;
          flex-direction: column;
          
          .switch-label {
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            margin-bottom: 4px;
          }
          
          .switch-desc {
            color: rgba(0, 0, 0, 0.45);
            font-size: 12px;
          }
        }
      }
    }
  }

  .setting-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    text-align: center;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* 调整响应式 */
@media (max-width: 576px) {
  .system-setting-drawer {
    .layout-grid {
      grid-template-columns: 1fr;
    }
  }
}

/* 自定义颜色选择器样式 */
.custom-color-picker {
  padding: 8px 0;
  
  .color-input-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    span {
      margin-right: 8px;
      white-space: nowrap;
    }
  }
  
  .color-preview-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    span {
      margin-right: 8px;
    }
    
    .color-preview-box {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
    }
  }
  
  .color-error {
    color: #f5222d;
    font-size: 12px;
    margin-bottom: 16px;
  }
  
  .suggested-colors {
    margin-bottom: 20px;
    
    .suggested-title {
      font-size: 14px;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.85);
    }
    
    .suggested-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;
      
      .suggested-item {
        aspect-ratio: 1;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.2s;
        
        &:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}
</style>

<!-- 全局样式，不使用scoped -->
<style lang="scss">
/* 主题下抽屉样式 */
body.dark-theme {
  .ant-drawer .ant-drawer-header {
    background-color: #001529 !important;
  }
  
  .ant-drawer .ant-drawer-title {
    color: white !important;
  }
  
  .ant-drawer .ant-drawer-close {
    color: white !important;
    
    &:hover {
      color: rgba(255, 255, 255, 0.85) !important;
    }
  }
}

/* 亮色主题下抽屉文字颜色 */
body.light-theme {
  .ant-drawer .ant-drawer-header {
    background-color: #f0f2f5 !important;
  }
  
  .ant-drawer .ant-drawer-title {
    color: rgba(0, 0, 0, 0.85) !important;
  }
  
  .ant-drawer .ant-drawer-close {
    color: rgba(0, 0, 0, 0.85) !important;
    
    &:hover {
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
}
</style> 
