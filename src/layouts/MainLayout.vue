<template>
  <a-layout class="main-layout">
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
      <AppLogo :collapsed="collapsed" :theme="layoutStore.siderTheme" />
      
      <!-- 侧边菜单 -->
      <SideMenu :collapsed="collapsed" :theme="layoutStore.siderTheme" />
    </a-layout-sider>

    <a-layout>
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
import { useLayoutStore } from '../store/layout';
// 确保组件使用相对路径导入
import AppLogo from './components/AppLogo.vue';
import SideMenu from './components/SideMenu.vue';
import HeaderContent from './components/HeaderContent.vue';
import TabsNav from './components/TabsNav.vue';

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
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  
  &-sider {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    overflow: auto;
    z-index: 10;
    
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
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
      transition: width 0.2s;
      
      .collapsed & {
        width: calc(100% - 80px);
      }
    }
  }
  
  .tags-nav-container {
    background: #fff;
    margin: 0;
    padding: 0;
    height: 46px;
    line-height: 46px;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    position: fixed;
    top: 64px;
    width: calc(100% - 256px);
    z-index: 8;
    transition: width 0.2s;
    
    .collapsed & {
      width: calc(100% - 80px);
    }
  }
  
  &-content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    border-radius: 2px;
    margin-left: 256px;
    transition: all 0.2s;
    
    &.fixed-header {
      margin-top: 88px;
      
      &.show-tabs {
        margin-top: 134px;
      }
    }
    
    .collapsed & {
      margin-left: 80px;
    }
  }
  
  .main-content-container {
    min-height: calc(100vh - 64px - 48px - 70px);
  }
  
  &-footer {
    text-align: center;
    padding: 14px 50px;
    margin-left: 256px;
    transition: margin-left 0.2s;
    
    .collapsed & {
      margin-left: 80px;
    }
  }
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style> 
