<template>
  <div class="app-logo" :class="{ collapsed }">
    <img :src="logo" alt="Logo" />
    <h1 v-if="!collapsed">{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import config from '../../config';

export default defineComponent({
  name: 'AppLogo',
  props: {
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
  },
  setup(props) {
    const isDarkTheme = computed(() => props.theme === 'dark');
    
    return {
      isDarkTheme
    };
  }
});
</script>

<style lang="scss" scoped>
.app-logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
  
  &.collapsed {
    padding: 16px 8px;
    justify-content: center;
  }
  
  img {
    height: 32px;
    margin-right: 12px;
    
    .collapsed & {
      margin-right: 0;
    }
  }
  
  h1 {
    color: inherit;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  :deep(.ant-layout-sider-dark) & {
    color: white;
  }
  
  :deep(.ant-layout-sider-light) & {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style> 
