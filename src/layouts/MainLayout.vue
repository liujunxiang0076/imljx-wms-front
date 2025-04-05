<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLayoutStore } from '../store/layout';



// 布局状态管理
const layoutStore = useLayoutStore();

// 根据当前布局类型动态选择布局组件
const layoutComponent = computed(() => {
  switch (layoutStore.layoutType) {
    case 'top':
      return () => import('@/layouts/templates/TopLayout.vue');
    case 'mix':
      return () => import('@/layouts/templates/MixLayout.vue');
    case 'sider':
    default:
      return () => import('@/layouts/templates/SiderLayout.vue');
  }
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
      transition: all 0.3s;
      
      .main-layout.collapsed & {
        width: calc(100% - 80px);
      }
    }
  }
  
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
    left: 256px;
    width: calc(100% - 256px);
    z-index: 8;
    transition: all 0.3s;
    
    .main-layout.collapsed & {
      width: calc(100% - 80px);
      left: 80px;
    }
  }
  
  &-content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    border-radius: 2px;
    margin-left: 280px;
    transition: all 0.3s;
    
    &.fixed-header {
      margin-top: 88px;
      
      &.show-tabs {
        margin-top: 128px;
      }
    }
    
    .main-layout.collapsed & {
      margin-left: 104px;
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
    
    .main-layout.collapsed & {
      margin-left: 80px;
    }
  }
  
  &.collapsed {
    .main-layout-sider {
      width: 80px !important;
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
