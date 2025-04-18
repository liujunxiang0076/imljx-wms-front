<template>
  <!-- 布局容器 -->
  <a-layout class="main-layout" :class="{ collapsed: collapsed }">
    <!-- 顶部导航 -->
    <a-layout-header
      class="main-layout-header"
      :class="{ fixed: layoutStore.fixedHeader }"
    >
      <!-- 顶部内容区 -->
      <div class="header-content">
        <div class="header-left">
          <img
            :src="config.system.systemLogo"
            alt="IMLJX"
            class="company-logo"
          />
          <div class="system-title">{{ config.system.systemName }}</div>
        </div>
        <!-- 菜单按钮 -->
        <div class="header-middle">
          <a-space size="small">
            <!-- 将菜单按钮放在文字后面 -->
            <a-button
              type="text"
              class="trigger-btn"
              @click="toggleCollapsed"
              size="small"
            >
              <menu-unfold-outlined style="font-size: 18px" v-if="collapsed" />
              <menu-fold-outlined style="font-size: 18px" v-else />
            </a-button>
            <a-button
              type="text"
              class="trigger-btn"
              size="small"
              @click="handleRefresh"
              title="刷新当前页面"
            >
              <ReloadOutlined style="font-size: 18px" />
            </a-button>
          </a-space>
          <!-- 搜索框 -->
          <div class="search-container">
            <div class="custom-search-wrapper">
              <input 
                type="text" 
                class="custom-search-input" 
                placeholder="搜索功能、命令或文档..." 
                v-model="searchValue"
                @keyup.enter="handleSearch"
              />
              <button class="custom-search-button" @click="handleSearch">
                <svg viewBox="64 64 896 896" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                  <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- 右侧功能区 -->
        <div class="header-right">
          <a-space size="middle">
            <!-- 通知器 -->
            <a-dropdown placement="bottomRight">
              <div class="notification-icon-wrapper">
                <a-button type="text" shape="circle" class="notification-btn">
                  <template #icon
                    ><bell-outlined style="font-size: 16px"
                  /></template>
                </a-button>
                <a-badge count="5" class="notification-badge" size="small" />
              </div>
              <template #overlay>
                <a-menu style="width: 200px">
                  <a-menu-item
                    key="notification-title"
                    style="
                      text-align: center;
                      cursor: default;
                      font-weight: 500;
                    "
                  >
                    通知信息 (5条未读)
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="notification-1">
                    <div style="display: flex; align-items: flex-start">
                      <a-tag color="blue">入库</a-tag>
                      <div style="margin-left: 8px; flex: 1">
                        <div style="font-weight: 500">新的入库订单已创建</div>
                        <div
                          style="font-size: 12px; color: rgba(0, 0, 0, 0.45)"
                        >
                          刚刚
                        </div>
                      </div>
                    </div>
                  </a-menu-item>
                  <a-menu-item key="notification-2">
                    <div style="display: flex; align-items: flex-start">
                      <a-tag color="red">警告</a-tag>
                      <div style="margin-left: 8px; flex: 1">
                        <div style="font-weight: 500">
                          产品B2库存低于安全库存
                        </div>
                        <div
                          style="font-size: 12px; color: rgba(0, 0, 0, 0.45)"
                        >
                          10分钟前
                        </div>
                      </div>
                    </div>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="see-all" style="text-align: center">
                    <router-link to="/notifications">查看所有通知</router-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

            <!-- 设置按钮 - 打开抽屉 -->
            <a-button
              type="text"
              shape="circle"
              class="setting-btn"
              @click="showSettingDrawer = true"
            >
              <template #icon
                ><setting-outlined style="font-size: 16px"
              /></template>
            </a-button>

            <!-- 用户个人信息 -->
            <a-dropdown placement="bottomRight">
              <div class="user-dropdown-btn">
                <a-avatar>{{
                  userStore?.userInfo?.username?.substring(0, 1) || "用户"
                }}</a-avatar>
                <span class="username">{{
                  userStore?.userInfo?.username || "用户名"
                }}</span>
                <down-outlined
                  style="font-size: 12px; color: rgba(0, 0, 0, 0.45)"
                />
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <user-outlined />
                    个人信息
                  </a-menu-item>
                  <a-menu-item key="settings">
                    <setting-outlined />
                    个人设置
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <logout-outlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <!-- 中间内容区 -->
    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :theme="layoutStore.siderTheme"
        :trigger="null"
        collapsible
        class="main-layout-sider"
        width="256"
      >
        <!-- Logo -->
        <div class="sider-container">
          <!-- 侧边菜单 -->
          <SideMenu :collapsed="collapsed" :theme="layoutStore.siderTheme" />
        </div>
      </a-layout-sider>

      <!-- 右侧内容 -->
      <a-layout class="right-content" :class="{ 'show-tabs': layoutStore.showTabs }">
        <!-- 标签页 - 顶部固定位置 -->
        <div v-if="layoutStore.showTabs" class="tabs-nav-container">
          <div class="tabs-nav-content">
            <TabsNav />
          </div>
        </div>
        
        <!-- 内容滚动区域 -->
        <div class="content-scroll">
          <!-- 主内容区 -->
          <a-layout-content class="main-layout-content">
            <div class="main-content-container">
              <router-view v-slot="{ Component }">
                <transition name="fade-transform" mode="out-in">
                  <keep-alive>
                    <component :is="Component" />
                  </keep-alive>
                </transition>
              </router-view>
            </div>
          </a-layout-content>

          <!-- 页脚 -->
          <a-layout-footer class="main-layout-footer">
            IMLJX-WMS 仓储管理系统 ©2024 Created by IMLJX
          </a-layout-footer>
        </div>
      </a-layout>
    </a-layout>
  </a-layout>

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
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useLayoutStore } from "../../store/layout";
import { useUserStore } from "../../store/user";
import config from "../../config";
import { Modal, message } from "ant-design-vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  ReloadOutlined,
} from "@ant-design/icons-vue";

// 布局状态管理
const layoutStore = useLayoutStore();
const userStore = useUserStore();

// 侧边栏折叠状态
const collapsed = ref(layoutStore.collapsed || false);

// 搜索值
const searchValue = ref("");

// 设置抽屉显示状态
const showSettingDrawer = ref(false);

// 退出登录
const handleLogout = () => {
  // 这里可以调用退出登录的方法
  console.log("用户点击了退出登录");
  // userStore.logout();
};

// 响应式布局 - 窗口大小变化时自动调整布局
const handleResize = () => {
  if (document.documentElement.clientWidth < 992 && !collapsed.value) {
    collapsed.value = true;
  } else if (document.documentElement.clientWidth > 1200 && collapsed.value) {
    collapsed.value = false;
  }
  // 更新布局状态
  layoutStore.setCollapsed(collapsed.value);
};

// 搜索方法
const onSearch = (value: string) => {
  console.log("搜索关键词:", value);
  // 实现搜索功能
  if (value && value.trim()) {
    // 实际搜索逻辑将在此实现
  }
};

// 处理回车搜索事件
const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target && target.value) {
    onSearch(target.value);
  }
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

// 切换菜单折叠状态
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  layoutStore.setCollapsed(collapsed.value);
  // 保存到本地存储
  localStorage.setItem('collapsed', String(collapsed.value));
};

// 处理页面刷新
const handleRefresh = () => {
  // 获取当前路由
  const currentPath = window.location.pathname;
  console.log("刷新页面:", currentPath);
  
  // 重新加载当前页面内容
  // 这里可以根据实际需求选择不同的刷新方式：
  window.location.reload();
};

// 在组件挂载时初始化设置
onMounted(() => {
  // 从本地存储恢复设置
  const savedTheme = localStorage.getItem('siderTheme');
  const savedFixedHeader = localStorage.getItem('fixedHeader');
  const savedShowTabs = localStorage.getItem('showTabs');
  const savedCollapsed = localStorage.getItem('collapsed');
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
  
  // 应用侧边栏折叠状态
  if (savedCollapsed) {
    collapsed.value = savedCollapsed === 'true';
    layoutStore.setCollapsed(collapsed.value);
  }
  
  // 应用主题色
  if (savedPrimaryColor) {
    setPrimaryColor(savedPrimaryColor);
  } else {
    // 应用默认主题色
    setPrimaryColor(layoutStore.primaryColor);
  }
  
  // 应用布局类型
  if (savedLayoutType && ['sider', 'top', 'mix', 'mix-right'].includes(savedLayoutType)) {
    setLayoutType(savedLayoutType as 'sider' | 'top' | 'mix' | 'mix-right');
  }
  
  // 应用菜单设置
  if (savedSplitMenus) {
    layoutStore.splitMenus = savedSplitMenus === 'true';
  }

  // 监听窗口大小变化以响应式调整布局
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

defineExpose({
  collapsed,
});

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

// 优化updateSplitMenus方法
const updateSplitMenus = (value: boolean) => {
  // 更新store
  layoutStore.splitMenus = value;
  // 保存到本地存储
  localStorage.setItem('splitMenus', String(value));
  // 显示提示
  message.success(`已${value ? '开启' : '关闭'}子菜单自动展开/折叠`);
};

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
      // 重置侧边栏折叠状态
      collapsed.value = false;
      layoutStore.setCollapsed(false);
      
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

// 颜色选择器状态和设置抽屉宽度
const drawerWidth = ref(360);
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  &-sider {
    position: fixed;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 10;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
    overflow-y: overlay !important;

    /* 深色主题样式 */
    &.ant-layout-sider-dark {
      background-color: #001529;

      .sider-container {
        :deep(.ant-menu) {
          background: linear-gradient(180deg, #001529 0%, #00213d 100%);
          
          .ant-menu-item {
            color: rgba(255, 255, 255, 0.75);
            
            &:hover {
              color: #fff;
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            }
            
            &.ant-menu-item-selected {
              color: #fff;
              background: linear-gradient(90deg, rgba(24, 144, 255, 0.1), transparent) !important;
              border-left: 3px solid #1890ff;
              
              &::before {
                background: #1890ff;
              }
            }
          }
          
          .ant-menu-submenu {
            &-title {
              color: rgba(255, 255, 255, 0.85);
              
              &::after {
                background: rgba(255, 255, 255, 0.3);
              }
            }
            
            &-arrow {
              color: rgba(255, 255, 255, 0.45);
            }
            
            &-open > .ant-menu-submenu-title {
              color: #fff;
              
              .ant-menu-submenu-arrow {
                color: rgba(255, 255, 255, 0.85);
              }
            }
          }
        }
      }

      /* 深色主题滚动条 */
      &:hover {
        &::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }

    /* 浅色主题样式 */
    &.ant-layout-sider-light {
      background-color: #fff;
      border-right: 1px solid #f0f0f0;

      .sider-container {
        :deep(.ant-menu) {
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          
          .ant-menu-item {
            color: rgba(0, 0, 0, 0.65);
            
            &:hover {
              color: #1890ff;
              text-shadow: 0 0 10px rgba(24, 144, 255, 0.1);
            }
            
            &.ant-menu-item-selected {
              color: #1890ff;
              background: linear-gradient(90deg, rgba(24, 144, 255, 0.05), transparent) !important;
              border-left: 3px solid #1890ff;
              
              &::before {
                background: #1890ff;
              }
            }
          }
          
          .ant-menu-submenu {
            &-title {
              color: rgba(0, 0, 0, 0.85);
              
              &::after {
                background: rgba(0, 0, 0, 0.15);
              }
            }
            
            &-arrow {
              color: rgba(0, 0, 0, 0.45);
            }
            
            &-open > .ant-menu-submenu-title {
              color: #1890ff;
              
              .ant-menu-submenu-arrow {
                color: #1890ff;
              }
            }
          }

          /* 浅色主题子菜单项样式 */
          .ant-menu-sub.ant-menu-inline {
            .ant-menu-item {
              &::before {
                background: rgba(0, 0, 0, 0.06);
              }
            }
          }
        }
      }

      /* 浅色主题滚动条 */
      &:hover {
        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
        }
      }
    }

    .sider-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      width: 256px;
      box-sizing: content-box;
      padding-right: 0;

      /* 菜单容器基础样式 */
      :deep(.ant-menu) {
        flex: 1;
        border-right: none;
        width: 256px !important;
        transition: all 0.3s;
        
        /* 菜单项基础样式 */
        .ant-menu-item, .ant-menu-submenu-title {
          height: 48px;
          line-height: 48px;
          margin: 4px 0;
          padding: 0 24px !important;
          width: 256px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          
          &:hover {
            background: transparent !important;
          }
        }

        /* 子菜单展开动画 */
        .ant-menu-sub.ant-menu-inline {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 子菜单项样式 */
        .ant-menu-sub.ant-menu-inline {
          .ant-menu-item {
            height: 40px;
            line-height: 40px;
            padding-left: 48px !important;
            font-size: 13px;
          }
        }
      }
    }
  }

  &-header {
    background: #fff;
    padding: 0;
    height: 60px;
    line-height: 60px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 11;
    /* 增大层级，确保始终在最上层 */
    width: 100%;
    border-bottom: 1px solid #f0f0f0;

    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      transition: all 0.3s;
    }

    :deep(.header-content) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      /* 添加两端对齐 */
      height: 100%;
      padding: 0 16px;

      .header-left {
        width: 240px;
        display: flex;
        align-items: center;
        overflow: hidden;
      }

      // 中间区域
      .header-middle {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex: 1;
        overflow: hidden;
        margin-right: 50px;

        .trigger-btn {
          font-size: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background: transparent;
          border: none;

          &:hover {
            background-color: rgba(0, 0, 0, 0.06);
            color: #1890ff;
          }
        }

        // 搜索框容器
        .search-container {
          display: flex;
          align-items: center;
          margin-left: 12px;

          .custom-search-wrapper {
            display: flex;
            width: 280px;
            height: 32px;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
            transition: all 0.3s;

            &:hover, &:focus-within {
              border-color: #40a9ff;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.08);
            }

            .custom-search-input {
              flex: 1;
              height: 100%;
              padding: 0 11px;
              border: none;
              outline: none;
              font-size: 14px;
              background: #fff;
              color: rgba(0, 0, 0, 0.85);
              line-height: 32px; /* 确保高度一致 */
              display: block;
              box-sizing: border-box;

              &::placeholder {
                color: rgba(0, 0, 0, 0.35);
                line-height: 32px; /* 确保文字居中 */
              }
            }

            .custom-search-button {
              width: 36px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fafafa;
              border: none;
              outline: none;
              cursor: pointer;
              color: rgba(0, 0, 0, 0.45);
              transition: all 0.3s;
              border-left: 1px solid #f0f0f0;

              &:hover {
                background: #e6f7ff;
                color: #40a9ff;
              }

              svg {
                width: 16px;
                height: 16px;
              }
            }
          }

          /* 移除原来的样式 */
          .global-search {
            display: none;
          }
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

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
      }

      .company-logo {
        height: 28px;
        margin-right: 12px;
      }

      .system-title {
        font-size: 16px;
        font-weight: 600;
        background-image: linear-gradient(90deg, #1890ff, #3a77ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        letter-spacing: 0.5px;
      }
    }
  }

  /* 标签栏样式 */
  .tabs-nav-container {
    width: 100%;
    height: 40px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    overflow: visible;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    z-index: 9;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    padding-left: 256px;

    .tabs-nav-content {
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
      height: 40px;
      background: #fff;
      padding: 0 16px;
      overflow-x: auto;
      white-space: nowrap;
      
      /* 隐藏水平滚动条，但允许滚动 */
      &::-webkit-scrollbar {
        height: 0;
        display: none;
      }
      scrollbar-width: none; /* Firefox */
    }
  }

  .right-content {
    margin-left: 256px;
    transition: margin-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 60px; /* header高度 */
    
    &.show-tabs {
      padding-top: 100px; /* header + tabs高度 */
    }
  }

  /* 内容滚动区域 */
  .content-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100vh - 60px); /* 减去header高度 */
    
    .show-tabs & {
      height: calc(100vh - 100px); /* 减去header和tabs高度 */
    }

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
  }

  &-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .main-content-container {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    position: relative;
  }

  &-footer {
    text-align: center;
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    margin: 0 24px 24px;
  }

  &.collapsed {
    .tabs-nav-container {
      padding-left: 80px;
      transition: padding-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    
    .right-content {
      margin-left: 80px;
      transition: margin-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .main-layout-sider {
      width: 80px !important;
      
      .sider-container {
        width: 80px;
        
        :deep(.ant-menu) {
          width: 80px !important;
          
          .ant-menu-item, .ant-menu-submenu-title {
            width: 80px !important;
          }
        }
      }
    }
  }
}

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

/* 暗色主题全局覆盖 */
:global(.dark-theme) {
  .ant-drawer-header {
    background-color: #001529 !important;
    
    .ant-drawer-title {
      color: white !important;
    }
    
    .ant-drawer-close {
      color: white !important;
      
      &:hover {
        color: rgba(255, 255, 255, 0.85) !important;
      }
    }
  }
}

:global(.light-theme) {
  .ant-drawer-header {
    background-color: #f0f2f5 !important;
    
    .ant-drawer-title {
      color: rgba(0, 0, 0, 0.85) !important;
    }
    
    .ant-drawer-close {
      color: rgba(0, 0, 0, 0.85) !important;
      
      &:hover {
        color: rgba(0, 0, 0, 0.65) !important;
      }
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
</style>

