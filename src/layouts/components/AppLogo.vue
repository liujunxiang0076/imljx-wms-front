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
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  
  &-img {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    transition: all 0.2s;
  }
  
  &-title {
    height: 32px;
    line-height: 32px;
    font-size: 18px;
    font-weight: 600;
    color: inherit;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.2s, width 0.2s;
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
    background-color: #001529;
    color: #fff;
  }
  
  &.light {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style> 
