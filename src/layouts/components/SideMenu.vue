<template>
  <div class="side-menu" :class="{ collapsed: collapsed }">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :theme="menuTheme"
      :inline-collapsed="collapsed"
      @click="handleMenuClick"
    >
      <template v-for="item in menuItems" :key="item.key">
        <template v-if="!item.children || item.children.length === 0">
          <a-menu-item :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <span>{{ item.title }}</span>
          </a-menu-item>
        </template>
        <template v-else>
          <a-sub-menu :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <template #title>{{ item.title }}</template>
            <a-menu-item 
              v-for="child in item.children" 
              :key="child.key"
            >
              <template #icon v-if="child.icon">
                <component :is="child.icon" />
              </template>
              <span>{{ child.title }}</span>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </template>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import menuConfig from '../../config/menu';
import {
  DashboardOutlined,
  ShoppingOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  ImportOutlined,
  ExportOutlined
} from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';

// Props定义
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  theme: {
    type: String,
    default: 'dark'
  }
});

// 计算菜单主题属性，将字符串转换为MenuProps.theme类型
const menuTheme = computed<MenuProps['theme']>(() => 
  props.theme === 'light' ? 'light' : 'dark'
);

// 定义菜单图标映射
const iconMap: Record<string, any> = {
  DashboardOutlined,
  ShoppingOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  ImportOutlined,
  ExportOutlined
};

const router = useRouter();
const route = useRoute();

// 初始化菜单选中及展开状态
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);

// 处理菜单图标
const menuItems = computed(() => {
  return menuConfig.map(item => {
    const menuItem = { ...item };
    // 处理图标
    if (typeof item.icon === 'string' && iconMap[item.icon]) {
      menuItem.icon = iconMap[item.icon];
    }
    
    // 处理子菜单图标
    if (item.children && item.children.length > 0) {
      menuItem.children = item.children.map(child => {
        const childItem = { ...child };
        if (typeof child.icon === 'string' && iconMap[child.icon]) {
          childItem.icon = iconMap[child.icon];
        }
        return childItem;
      });
    }
    
    return menuItem;
  });
});

// 根据当前路由设置选中菜单
const updateSelectedMenu = () => {
  const currentPath = route.path;
  // 查找当前路径匹配的菜单项
  let currentSelectedKey = '';
  let parentKey = '';
  
  menuConfig.forEach(menu => {
    if (menu.path === currentPath) {
      currentSelectedKey = menu.key;
    } else if (menu.children && menu.children.length > 0) {
      const child = menu.children.find(child => child.path === currentPath);
      if (child) {
        currentSelectedKey = child.key;
        parentKey = menu.key;
      }
    }
  });
  
  if (currentSelectedKey) {
    selectedKeys.value = [currentSelectedKey];
    if (parentKey && !props.collapsed) {
      openKeys.value = [parentKey];
    }
  }
};

// 监听路由变化，更新菜单选中状态
watch(() => route.path, () => {
  updateSelectedMenu();
}, { immediate: true });

// 处理菜单收缩状态变化
watch(() => props.collapsed, (val) => {
  if (val) {
    openKeys.value = [];
  } else {
    updateSelectedMenu();
  }
});

// 处理菜单展开状态变化，检查滚动状态
watch(() => openKeys.value, () => {
  nextTick(() => {
    checkMenuOverflow();
  });
}, { deep: true });

// 处理菜单点击
const handleMenuClick: MenuProps['onClick'] = (info) => {
  // 查找对应菜单项的路径
  let targetPath = '';
  const key = info.key as string;
  
  menuConfig.forEach(menu => {
    if (menu.key === key) {
      targetPath = menu.path || '';
    } else if (menu.children && menu.children.length > 0) {
      const child = menu.children.find(child => child.key === key);
      if (child) {
        targetPath = child.path || '';
      }
    }
  });
  
  if (targetPath && targetPath !== route.path) {
    router.push(targetPath);
  }
};

// 检查菜单是否需要滚动
const checkMenuOverflow = () => {
  const menuEl = document.querySelector('.side-menu .ant-menu') as HTMLElement;
  if (menuEl) {
    const hasOverflow = menuEl.scrollHeight > menuEl.clientHeight;
    
    // 检测是否可以向下滚动
    const hasBottomOverflow = hasOverflow && (menuEl.scrollHeight - menuEl.scrollTop - menuEl.clientHeight > 0);
    
    // 检测是否可以向上滚动
    const hasTopOverflow = hasOverflow && menuEl.scrollTop > 0;
    
    // 设置相应的类
    if (hasBottomOverflow) {
      menuEl.classList.add('ant-menu--has-overflow-bottom');
    } else {
      menuEl.classList.remove('ant-menu--has-overflow-bottom');
    }
    
    if (hasTopOverflow) {
      menuEl.classList.add('ant-menu--has-overflow-top');
    } else {
      menuEl.classList.remove('ant-menu--has-overflow-top');
    }
  }
};

// 监听菜单滚动事件
const setupScrollListener = () => {
  const menuEl = document.querySelector('.side-menu .ant-menu') as HTMLElement;
  if (menuEl) {
    menuEl.addEventListener('scroll', checkMenuOverflow);
  }
};

// 组件挂载时初始化
onMounted(() => {
  updateSelectedMenu();
  nextTick(() => {
    checkMenuOverflow();
    setupScrollListener();
  });
});
</script>

<style lang="scss" scoped>
.side-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  :deep(.ant-menu) {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    
    // 优化滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
      background-color: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 3px;
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
    
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }
    
    // 底部渐变阴影提示
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 6px;
      height: 30px;
      background: linear-gradient(to top, rgba(12, 33, 53, 0.9), transparent);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
    }
    
    // 顶部渐变阴影提示
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 6px;
      height: 24px;
      background: linear-gradient(to bottom, rgba(12, 33, 53, 0.9), transparent);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
    }
    
    &.ant-menu--has-overflow-bottom::after {
      opacity: 1;
    }
    
    &.ant-menu--has-overflow-top::before {
      opacity: 1;
    }
    
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
  }
}

/* 全局覆盖 Ant Design Vue 样式 */
:deep(.ant-menu-submenu-title) {
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 16px !important;

  .ant-menu-title-content {
    flex: 1 !important;
    margin-left: 10px !important;
  }
  
  .ant-menu-submenu-arrow {
    position: static !important;
    margin: 0 !important;
  }
}

:deep(.ant-menu-item) {
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 16px !important;
  
  .ant-menu-title-content {
    flex: 1 !important;
    margin-left: 10px !important;
  }
}

:deep(.ant-menu-inline-collapsed) {
  .ant-menu-submenu-title,
  .ant-menu-item {
    padding: 0 !important;
    justify-content: center !important;
    
    .ant-menu-item-icon,
    .anticon {
      margin: 0 !important;
    }
    
    .ant-menu-title-content {
      display: none !important;
    }
    
    .ant-menu-submenu-arrow {
      display: none !important;
    }
  }
}

:deep(.ant-menu-dark) {
  background-color: #0c2135;
  
  .ant-menu-item-selected {
    background-color: rgba(24, 144, 255, 0.8);
  }
  
  .ant-menu-submenu-arrow {
    &::before, &::after {
      background: rgba(255, 255, 255, 0.65) !important;
    }
  }
  
  .ant-menu-sub {
    background-color: rgba(0, 0, 0, 0.2) !important;
  }
}

:deep(.ant-menu-sub) {
  .ant-menu-item {
    padding-left: 42px !important;
  }
}
</style> 
