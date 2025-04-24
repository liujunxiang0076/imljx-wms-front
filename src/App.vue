<script setup lang="ts">
// 主应用入口
import { onMounted, ref } from 'vue';
import { useLayoutStore } from './store/layout';
import { ConfigProvider } from 'ant-design-vue';

// 主题配置
const themeConfig = ref({
  token: {
    colorPrimary: '#1677ff'
  }
});

// 初始化主题设置
onMounted(() => {
  // 获取本地存储的主题设置
  const savedTheme = localStorage.getItem('siderTheme');
  const theme = savedTheme === 'dark' ? 'dark' : 'light';
  
  // 初始化布局存储
  const layoutStore = useLayoutStore();
  layoutStore.siderTheme = theme;
  
  // 设置body主题类
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  } else {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  }
});
</script>

<template>
  <config-provider :theme="themeConfig">
    <router-view />
  </config-provider>
</template>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
