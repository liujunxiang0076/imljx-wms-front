<template>
  <a-layout class="top-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="top-layout-header" :class="{ 'fixed': layoutStore.fixedHeader }">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo-container">
          <img src="@/assets/vue.svg" alt="Logo" class="logo-img" />
          <h1 class="logo-title">IMLJX-WMS</h1>
        </div>
        
        <!-- 顶部菜单 -->
        <div class="top-menu-container">
          <a-menu
            mode="horizontal"
            :theme="layoutStore.headerTheme"
            :selectedKeys="selectedKeys"
            :openKeys="openKeys"
            class="top-menu"
          >
            <!-- 仪表盘 -->
            <a-menu-item key="dashboard">
              <router-link to="/dashboard">
                <DashboardOutlined />
                <span>仪表盘</span>
              </router-link>
            </a-menu-item>
            
            <!-- 库存管理 -->
            <a-sub-menu key="inventory">
              <template #title>
                <AppstoreOutlined />
                <span>库存管理</span>
              </template>
              <a-menu-item key="inventory-overview">
                <router-link to="/inventory/overview">
                  <span>库存总览</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inventory-detail">
                <router-link to="/inventory/detail">
                  <span>库存明细</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inventory-check">
                <router-link to="/inventory/check">
                  <span>库存盘点</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inventory-location">
                <router-link to="/inventory/location">
                  <span>库位管理</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <!-- 入库管理 -->
            <a-sub-menu key="inbound">
              <template #title>
                <InboxOutlined />
                <span>入库管理</span>
              </template>
              <a-menu-item key="inbound-receipt">
                <router-link to="/inbound/receipt">
                  <span>入库单管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inbound-plan">
                <router-link to="/inbound/plan">
                  <span>入库计划</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inbound-verify">
                <router-link to="/inbound/verify">
                  <span>入库验收</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inbound-return">
                <router-link to="/inbound/return">
                  <span>退货入库</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <!-- 出库管理 -->
            <a-sub-menu key="outbound">
              <template #title>
                <ExportOutlined />
                <span>出库管理</span>
              </template>
              <a-menu-item key="outbound-order">
                <router-link to="/outbound/order">
                  <span>出库单管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="outbound-plan">
                <router-link to="/outbound/plan">
                  <span>出库计划</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="outbound-picking">
                <router-link to="/outbound/picking">
                  <span>拣货管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="outbound-delivery">
                <router-link to="/outbound/delivery">
                  <span>发运管理</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <!-- 报表分析 -->
            <a-menu-item key="reports">
              <router-link to="/reports">
                <BarChartOutlined />
                <span>报表分析</span>
              </router-link>
            </a-menu-item>
            
            <!-- 系统设置 -->
            <a-sub-menu key="system">
              <template #title>
                <SettingOutlined />
                <span>系统设置</span>
              </template>
              <a-menu-item key="system-users">
                <router-link to="/system/users">
                  <span>用户管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="system-roles">
                <router-link to="/system/roles">
                  <span>角色管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="system-permissions">
                <router-link to="/system/permissions">
                  <span>权限管理</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </div>
        
        <!-- 右侧操作区 -->
        <div class="header-right">
          <!-- 搜索框 -->
          <a-input-search
            placeholder="搜索..."
            style="width: 200px;"
            @search="onSearch"
            class="ant-input-search"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input-search>
          
          <!-- 通知图标 -->
          <a-tooltip title="消息通知">
            <div class="notification-icon-wrapper">
              <a-badge count="5" class="notification-badge">
                <a-button type="text" class="notification-btn">
                  <BellOutlined style="font-size: 16px" />
                </a-button>
              </a-badge>
            </div>
          </a-tooltip>
          
          <!-- 用户头像下拉菜单 -->
          <a-dropdown>
            <div class="user-dropdown-btn">
              <a-avatar class="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" size="small" />
              <span class="username">{{ userStore.name || '管理员' }}</span>
              <DownOutlined style="font-size: 12px" />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="0">
                  <UserOutlined />
                  个人中心
                </a-menu-item>
                <a-menu-item key="1">
                  <SettingOutlined />
                  账户设置
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="3" @click="handleLogout">
                  <LogoutOutlined />
                  退出登录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          
          <!-- 设置按钮 -->
          <a-button
            type="text"
            class="setting-btn"
            @click="showSettingDrawer = true"
          >
            <SettingOutlined style="font-size: 16px" />
          </a-button>
        </div>
      </div>
    </a-layout-header>
    
    <!-- 标签页 -->
    <a-layout-content v-if="layoutStore.showTabs" class="tags-nav-container">
      <TabsNav />
    </a-layout-content>
    
    <!-- 内容区 -->
    <a-layout-content 
      class="top-layout-content"
      :class="{ 
        'fixed-header': layoutStore.fixedHeader,
        'show-tabs': layoutStore.showTabs 
      }"
    >
      <div class="content-container">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </a-layout-content>
    
    <!-- 页脚 -->
    <a-layout-footer class="top-layout-footer">
      IMLJX-WMS 仓储管理系统 ©2024 Created by IMLJX
    </a-layout-footer>
    
    <!-- 设置抽屉 -->
    <a-drawer
      title="页面配置"
      placement="right"
      :closable="true"
      :visible="showSettingDrawer"
      @close="showSettingDrawer = false"
      :width="drawerWidth"
      class="system-setting-drawer"
      :bodyStyle="{ padding: '20px', paddingBottom: '70px' }"
      :headerStyle="{ 
        background: layoutStore.siderTheme === 'dark' ? '#001529' : '#f0f2f5',
        color: layoutStore.siderTheme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.85)',
        borderBottom: layoutStore.siderTheme === 'dark' ? 'none' : '1px solid #f0f0f0',
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
              :class="{ active: layoutStore.siderTheme === 'light' }"
              @click="updateThemeSetting(false)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 S11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0 s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
              </svg>
              <span>亮色</span>
            </div>
            <div 
              class="theme-card dark-card" 
              :class="{ active: layoutStore.siderTheme === 'dark' }"
              @click="updateThemeSetting(true)"
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
              :class="{ active: layoutStore.layoutType === 'sider' }"
              @click="setLayoutType('sider')"
            >
              <div class="layout-preview sider-layout"></div>
              <div class="layout-name">侧边布局</div>
            </div>
            <div 
              class="layout-item" 
              :class="{ active: layoutStore.layoutType === 'top' }"
              @click="setLayoutType('top')"
            >
              <div class="layout-preview top-layout"></div>
              <div class="layout-name">顶部布局</div>
            </div>
            <div 
              class="layout-item" 
              :class="{ active: layoutStore.layoutType === 'mix' }"
              @click="setLayoutType('mix')"
            >
              <div class="layout-preview mix-layout"></div>
              <div class="layout-name">混合布局</div>
            </div>
            <div 
              class="layout-item" 
              :class="{ active: layoutStore.layoutType === 'mix-right' }"
              @click="setLayoutType('mix-right')"
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
                v-for="color in colorList" 
                :key="color"
                class="color-item" 
                :style="{ backgroundColor: color }"
                :class="{ active: layoutStore.primaryColor === color }"
                @click="setPrimaryColor(color)"
                @mouseenter="previewPrimaryColor(color)"
                @mouseleave="resetPreviewColor"
              ></div>
              <div class="color-item color-picker" @click="showColorPicker = true">
                <div class="color-picker-icon">
                  <svg viewBox="64 64 896 896" width="0.9em" height="0.9em" fill="currentColor">
                    <path d="M924.8 385.6a446.7 446.7 0 0 0-96-142.4 446.7 446.7 0 0 0-142.4-96C631.1 123.8 572.5 112 512 112s-119.1 11.8-174.4 35.2a446.7 446.7 0 0 0-142.4 96 446.7 446.7 0 0 0-96 142.4C75.8 440.9 64 499.5 64 560c0 132.7 58.3 257.7 159.9 343.1l1.7 1.4c5.8 4.8 13.1 7.5 20.6 7.5h531.7c7.5 0 14.8-2.7 20.6-7.5l1.7-1.4C901.7 817.7 960 692.7 960 560c0-60.5-11.9-119.1-35.2-174.4zM761.4 836H262.6A371.12 371.12 0 0 1 140 560c0-99.4 38.7-192.8 109-263 70.3-70.3 163.7-109 263-109 99.4 0 192.8 38.7 263 109 70.3 70.3 109 163.7 109 263 0 105.6-44.5 205.5-122.6 276zM623.5 421.5a8.03 8.03 0 0 0-11.3 0L527.7 506c-18.7-5-39.4-.2-54.1 14.5a55.95 55.95 0 0 0 0 79.2 55.95 55.95 0 0 0 79.2 0 55.87 55.87 0 0 0 14.5-54.1l84.5-84.5c3.1-3.1 3.1-8.2 0-11.3l-28.3-28.3zM490 320h44c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8h-44c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8zm-147.4 64.8l-31.1-31.1a8.03 8.03 0 0 0-11.3 0l-56.6 56.6a8.03 8.03 0 0 0 0 11.3l31.1 31.1c3.1 3.1 8.2 3.1 11.3 0l56.6-56.6c3.1-3.1 3.1-8.2 0-11.3zm291.7-56.6l56.6 56.6c3.1 3.1 8.2 3.1 11.3 0l31.1-31.1c3.1-3.1 3.1-8.2 0-11.3l-56.6-56.6a8.03 8.03 0 0 0-11.3 0l-31.1 31.1a8.03 8.03 0 0 0 0 11.3zM312 490v44c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8v-44c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="color-preview-tooltip" v-if="previewColor">
              预览: <span class="color-dot" :style="{backgroundColor: previewColor}"></span>
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
                :model-value="layoutStore.splitMenus"
                @update:model-value="updateSplitMenus"
              />
            </div>
            <div class="switch-item">
              <div class="switch-info">
                <span class="switch-label">页面标签栏</span>
                <span class="switch-desc">显示多标签页导航</span>
              </div>
              <a-switch 
                :model-value="layoutStore.showTabs"
                @update:model-value="toggleShowTabs"
              />
            </div>
            <div class="switch-item">
              <div class="switch-info">
                <span class="switch-label">固定页头</span>
                <span class="switch-desc">固定顶部导航栏</span>
              </div>
              <a-switch 
                :model-value="layoutStore.fixedHeader"
                @update:model-value="toggleFixedHeader"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="setting-footer">
        <a-button type="primary" block @click="resetSettings">
          <reload-outlined />
          恢复默认配置
        </a-button>
      </div>
    </a-drawer>

    <!-- 添加颜色选择器弹窗 -->
    <a-modal 
      v-model:visible="showColorPicker" 
      title="自定义主题色" 
      width="300px" 
      :footer="null"
      @cancel="cancelColorSelection"
    >
      <div class="custom-color-picker">
        <div class="color-input-row">
          <span>颜色值：</span>
          <a-input 
            v-model:value="customColor" 
            placeholder="#1890ff" 
            :maxlength="7"
            @change="validateColor"
          />
        </div>
        
        <div class="color-preview-row">
          <span>预览：</span>
          <div class="color-preview-box" :style="{ backgroundColor: isValidColor ? customColor : '#e0e0e0' }"></div>
        </div>
        
        <div v-if="!isValidColor && customColor" class="color-error">
          请输入有效的十六进制颜色值 (例如: #1890ff)
        </div>
        
        <div class="suggested-colors">
          <div class="suggested-title">推荐颜色</div>
          <div class="suggested-grid">
            <div 
              v-for="(color, index) in suggestedColors" 
              :key="index"
              class="suggested-item"
              :style="{ backgroundColor: color }"
              @click="selectSuggestedColor(color)"
            ></div>
          </div>
        </div>
        
        <div class="action-buttons">
          <a-button @click="cancelColorSelection">取消</a-button>
          <a-button 
            type="primary" 
            :disabled="!isValidColor" 
            @click="confirmCustomColor"
          >确定</a-button>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, defineAsyncComponent } from 'vue';
import { useLayoutStore } from '../../store/layout';
import { useRoute, useRouter } from 'vue-router';
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  InboxOutlined, 
  ExportOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  ReloadOutlined,
  BellOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import { useUserStore } from '../../store/user';

// 引入TabsNav组件
const TabsNav = defineAsyncComponent(() => import('../components/TabsNav.vue'));

// 布局状态管理
const layoutStore = useLayoutStore();
const route = useRoute();
const userStore = useUserStore();
const router = useRouter();

// 当前打开的子菜单
const openKeys = ref<string[]>([]);

// 设置抽屉显示状态
const showSettingDrawer = ref(false);
const drawerWidth = ref(360);

// 当前选中的菜单
const selectedKeys = computed(() => {
  const path = route.path;
  const paths = path.split('/').filter(Boolean);
  
  if (paths.length > 1) {
    // 如果路径有多级，选中具体的子菜单项
    return [`${paths[0]}-${paths[1]}`];
  } else {
    // 一级路径，选中主菜单
    return [paths[0] || 'dashboard'];
  }
});

// 监听路由变化，更新打开的子菜单
watch(() => route.path, (path) => {
  const paths = path.split('/').filter(Boolean);
  if (paths.length > 0) {
    openKeys.value = [paths[0]];
  }
}, { immediate: true });

onMounted(() => {
  // 在移动设备上调整布局
  if (window.innerWidth < 768) {
    layoutStore.collapsed = true;
  }
});

// 预览相关变量和颜色选择器变量
const previewColor = ref('');
const originalColor = ref('');
const showColorPicker = ref(false);
const customColor = ref('');
const isValidColor = ref(false);

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

// 在script部分添加colorList
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

// 添加setPrimaryColor方法
const setPrimaryColor = (color: string) => {
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
  message.success('主题色已更新');
};

// 帮助函数 - 调整颜色亮度
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

// 注入全局样式
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

// 添加setLayoutType方法
const setLayoutType = (type: 'sider' | 'top' | 'mix' | 'mix-right') => {
  layoutStore.setLayoutType(type);
  localStorage.setItem('layoutType', type);
};

// 更新主题设置
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

// 切换固定头部
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

// 切换显示标签页
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

// 优化updateSplitMenus方法
const updateSplitMenus = (value: boolean) => {
  // 更新store
  layoutStore.splitMenus = value;
  // 保存到本地存储
  localStorage.setItem('splitMenus', String(value));
  // 显示提示
  message.success(`已${value ? '开启' : '关闭'}子菜单自动展开/折叠`);
};

// 验证颜色是否合法
const validateColor = () => {
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  isValidColor.value = colorRegex.test(customColor.value);
  
  // 自动添加#前缀
  if (customColor.value && !customColor.value.startsWith('#')) {
    customColor.value = '#' + customColor.value;
    validateColor();
  }
};

// 选择推荐颜色
const selectSuggestedColor = (color: string) => {
  customColor.value = color;
  isValidColor.value = true;
};

// 确认自定义颜色
const confirmCustomColor = () => {
  if (isValidColor.value) {
    setPrimaryColor(customColor.value);
    showColorPicker.value = false;
    customColor.value = '';
  }
};

// 取消颜色选择
const cancelColorSelection = () => {
  showColorPicker.value = false;
  customColor.value = '';
  isValidColor.value = false;
};

// 预览主题颜色
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

// 重置预览颜色
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

// 重置所有配置为默认值
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

// 搜索功能
const onSearch = (value: string) => {
  if (!value.trim()) return;
  message.info(`搜索: ${value}`);
  // TODO: 实现搜索功能
};

// 退出登录
const handleLogout = async () => {
  try {
    Modal.confirm({
      title: '确认退出',
      content: '确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await userStore.logout();
        message.success('退出登录成功');
        router.push('/login');
      }
    });
  } catch (error) {
    message.error('操作失败，请重试');
  }
};
</script>

<style lang="scss" scoped>
// 顶部布局
.top-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  // 顶部布局头部
  &-header {
    background: #fff;
    padding: 0 !important;
    height: 64px;
    line-height: 64px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    z-index: 9;
    
    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
    }
    // 头部容器
    .header-container {
      display: flex;
      align-items: center;
      padding: 0 0 0 24px;
      height: 100%;
    }
    // 头部logo
    .logo-container {
      display: flex;
      align-items: center;
      margin-right: 24px;
      // logo图片
      .logo-img {
        height: 32px;
        width: auto;
      }
      // logo标题
      .logo-title {
        margin: 0 0 0 12px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size: 18px;
        white-space: nowrap;
      }
    }
    // 顶部菜单
    .top-menu-container {
      flex: 1;
      overflow-x: auto;
      // 顶部菜单滚动条
      &::-webkit-scrollbar {
        display: none;
      }
      // 顶部菜单
      .top-menu {
        line-height: 64px;
        border-bottom: none;
        // 顶部菜单项
        :deep(.ant-menu-item) {
          padding: 0 16px;
          // 顶部菜单项下划线
          &::after {
            left: 16px;
            right: 16px;
          }
        }
        // 顶部菜单子菜单
        :deep(.ant-menu-submenu-title) {
          padding: 0 16px;
        }
        // 顶部菜单子菜单下划线
        :deep(.ant-menu-submenu) {
          &::after {
            left: 16px;
            right: 16px;
          }
        }
      }
    }
    // 头部右侧操作区
    .header-right {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-left: auto;

      .username {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }

      .ant-badge {
        .ant-badge-count {
          box-shadow: 0 0 0 1px #fff;
          font-weight: 500;
          font-size: 12px;
          padding: 0 4px;
        }
      }

      .notification-icon-wrapper {
        position: relative;
        display: inline-block;

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          z-index: 1;
        }
      }

      .notification-btn,
      .setting-btn {
        height: 40px;
        width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: rgba(0, 0, 0, 0.03);
          color: #1890ff;
        }
      }

      .ant-btn {
        display: flex;
        align-items: center;
        padding: 0 8px;
        height: 38px;

        &-text {
          color: rgba(0, 0, 0, 0.75);
          transition: all 0.3s;
          border-radius: 4px;

          &:hover {
            background-color: rgba(0, 0, 0, 0.03);
            color: rgba(0, 0, 0, 0.95);
          }
        }
      }

      .user-dropdown-btn {
        padding: 0 12px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        height: 40px;
        cursor: pointer;
        transition: all 0.3s;

        .username {
          margin: 0 6px 0 8px;
          font-weight: 500;
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.03);
        }
      }

      .ant-avatar {
        background-color: #1890ff;
        color: #fff;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
      }

      .ant-input-search {
        margin-right: 8px;
        .ant-input {
          border-radius: 4px;
          &:hover {
            border-color: #40a9ff;
          }
          &:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24,144,255,.2);
          }
        }
      }
    }
  }
  // 标签页
  .tags-nav-container {
    background: #fff;
    margin: 0;
    padding: 0;
    height: 40px;
    line-height: initial;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    z-index: 8;
  }
  // 内容区
  &-content {
    flex: 1;
    padding: 24px;
    margin: 24px;
    background: #fff;
    border-radius: 2px;
    // 固定头部
    &.fixed-header {
      margin-top: 88px;
    }
    // 显示标签页
    &.show-tabs {
      margin-top: 128px;
    }
  }
  // 内容容器
  .content-container {
    min-height: calc(100vh - 64px - 48px - 70px);
  }
  // 页脚
  &-footer {
    text-align: center;
    padding: 14px 50px;
    background: #f0f2f5;
  }
}

/* 设置抽屉样式 */
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
      color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
    }
    
    .ant-drawer-close {
      color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
      
      &:hover {
        color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
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
/* 暗色主题下抽屉强制白色文字 */
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

/* 调整响应式 */
@media (max-width: 576px) {
  .system-setting-drawer {
    .layout-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 
