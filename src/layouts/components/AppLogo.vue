<template>
  <div class="app-logo" :class="{ collapsed }">
    <img :src="logo" alt="Logo" class="app-logo-img" />
    <h1 v-if="!collapsed" class="app-logo-title">{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
import config from '../../config';

// Props定义
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String as () => 'light' | 'dark',
    default: 'dark'
  },
  logo: {
    type: String,
    default: () => config.system.systemLogo
  },
  title: {
    type: String,
    default: () => config.system.systemName
  }
});
</script>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  padding: 16px;
  height: 64px;
  min-height: 64px;
  overflow: hidden;
  transition: all 0.15s ease;
  box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
  
  &-img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    transition: all 0.15s ease;
  }
  
  &-title {
    height: 32px;
    line-height: 32px;
    font-size: 18px;
    font-weight: 600;
    color: inherit;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.15s ease, width 0.15s ease;
    display: inline-block;
  }
  
  &.collapsed {
    padding: 16px 0;
    justify-content: center;
    
    .app-logo-img {
      margin-right: 0;
    }
    
    .app-logo-title {
      width: 0;
      opacity: 0;
    }
  }
  
  &.dark {
    background-color: #0c2135;
    color: rgba(255, 255, 255, 0.95);
  }
  
  &.light {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style> 
