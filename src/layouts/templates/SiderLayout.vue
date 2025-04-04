<template>
  <a-layout class="main-layout" :class="{ 'collapsed': collapsed }">
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
        <AppLogo :collapsed="collapsed" :theme="layoutStore.siderTheme" />
        
        <!-- 侧边菜单 -->
        <SideMenu :collapsed="collapsed" :theme="layoutStore.siderTheme" />
      </div>
    </a-layout-sider>

    <a-layout class="main-layout-right">
      <!-- 顶部导航 -->
      <a-layout-header class="main-layout-header" :class="{ 'fixed': layoutStore.fixedHeader }">
        <HeaderContent v-model:collapsed="collapsed" />
      </a-layout-header>

      <!-- 标签页 -->
      <a-layout-content v-if="layoutStore.showTabs" class="tags-nav-container">
        <TabsNav />
      </a-layout-content>

      <!-- 主内容区 -->
      <a-layout-content 
        class="main-layout-content"
        :class="{ 
          'fixed-header': layoutStore.fixedHeader,
          'show-tabs': layoutStore.showTabs 
        }"
      >
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
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayoutStore } from '../../store/layout';

// 布局状态管理
const layoutStore = useLayoutStore();

// 侧边栏折叠状态
const collapsed = ref(false);

// 响应式布局 - 窗口大小变化时自动调整布局
const handleResize = () => {
  if (document.documentElement.clientWidth < 992 && !collapsed.value) {
    collapsed.value = true;
  } else if (document.documentElement.clientWidth > 1200 && collapsed.value) {
    collapsed.value = false;
  }
};

// 监听窗口大小变化
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

defineExpose({
  collapsed
});
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  position: relative;
  
  &-sider {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow: auto;
    z-index: 10;
    transition: width 0.15s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.12);
    background-color: #0c2135; /* 匹配菜单背景色 */
    
    .sider-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      will-change: contents; /* 优化性能 */
      
      .app-logo {
        position: relative;
        z-index: 2;
      }
      
      .side-menu {
        position: relative;
        z-index: 1;
      }
    }
    
    &::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      background-color: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.15);
      border-radius: 3px;
      transition: background-color 0.15s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }
  
  &-header {
    background: #fff;
    padding: 0;
    height: 64px;
    line-height: 64px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    z-index: 9;
    
    &.fixed {
      position: fixed;
      top: 0;
      right: 0;
      width: calc(100% - 256px);
      transition: all 0.3s;
    }
    
    :deep(.header-content) {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
  
  .tags-nav-container {
    background: #fff;
    margin: 0;
    padding: 0;
    height: 40px; /* 只保留标签栏高度 */
    line-height: initial;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    position: fixed;
    top: 64px;
    left: 256px;
    width: calc(100% - 256px);
    z-index: 8;
    transition: all 0.3s;
  }
  
  &-content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    border-radius: 2px;
    margin-left: 280px; /* 256px + 24px margin */
    transition: all 0.3s;
    
    &.fixed-header {
      margin-top: 88px;
      
      &.show-tabs {
        margin-top: 128px; /* 调整为只有标签栏的高度 */
      }
    }
  }
  
  .main-content-container {
    min-height: calc(100vh - 64px - 48px - 70px);
  }
  
  &-footer {
    text-align: center;
    padding: 14px 50px;
    margin-left: 256px;
    transition: all 0.3s;
  }
  
  &.collapsed {
    .main-layout-header.fixed {
      width: calc(100% - 80px);
    }
    
    .tags-nav-container {
      width: calc(100% - 80px);
      left: 80px;
      transition: all 0.15s ease;
    }
    
    .main-layout-content {
      margin-left: 104px; /* 80px + 24px margin */
      transition: margin 0.15s ease;
    }
    
    .main-layout-footer {
      margin-left: 80px;
      transition: margin-left 0.15s ease;
    }
    
    .main-layout-sider {
      width: 80px !important;
      transition: width 0.15s ease !important;
    }
  }
}
</style> 
