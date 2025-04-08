<template>
  <!-- 侧边菜单容器，根据折叠状态添加collapsed类 -->
  <div class="side-menu" :class="{ collapsed: collapsed }">
    <!-- Ant Design菜单组件 -->
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :theme="menuTheme"
      :inline-collapsed="collapsed"
      @click="handleMenuClick"
    >
      <!-- 遍历渲染一级菜单项 -->
      <template v-for="item in menuItems" :key="item.key">
        <!-- 没有子菜单的情况 -->
        <template v-if="!item.children || item.children.length === 0">
          <a-menu-item :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <span>{{ item.title }}</span>
          </a-menu-item>
        </template>
        <!-- 有子菜单的情况 -->
        <template v-else>
          <a-sub-menu :key="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <template #title>{{ item.title }}</template>
            <!-- 遍历渲染子菜单项 -->
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
/**
 * SideMenu组件
 * 
 * 功能：
 * 1. 渲染侧边菜单，支持多级菜单结构
 * 2. 响应式处理菜单的展开/收起状态
 * 3. 根据路由自动匹配当前选中菜单
 * 4. 监测菜单滚动状态，显示滚动提示
 */
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
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
  /** 菜单是否折叠 */
  collapsed: {
    type: Boolean,
    default: false
  },
  /** 菜单主题 'dark' | 'light' */
  theme: {
    type: String,
    default: 'dark'
  }
});

/**
 * 计算菜单主题属性，将字符串转换为MenuProps.theme类型
 * 'dark' | 'light'
 */
const menuTheme = computed<MenuProps['theme']>(() => 
  props.theme === 'light' ? 'light' : 'dark'
);

/**
 * 菜单图标映射表
 * 将字符串图标名映射到实际的图标组件
 */
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

// 当前选中的菜单项key数组
const selectedKeys = ref<string[]>([]);
// 当前展开的子菜单key数组
const openKeys = ref<string[]>([]);

// 保存DOM引用，避免重复查询
const menuElement = ref<HTMLElement | null>(null);

/**
 * 处理菜单配置，将字符串图标转换为组件
 * @returns 处理后的菜单配置数组
 */
const menuItems = computed(() => {
  return menuConfig.map(item => {
    const menuItem = { ...item };
    // 处理一级菜单图标
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

/**
 * 查找当前路由对应的菜单项和父菜单
 * @returns {Object} 包含当前选中的key和父菜单key
 */
const findMenuKeysByPath = (path: string) => {
  let currentSelectedKey = '';
  let parentKey = '';
  
  menuConfig.forEach(menu => {
    if (menu.path === path) {
      currentSelectedKey = menu.key;
    } else if (menu.children && menu.children.length > 0) {
      const child = menu.children.find(child => child.path === path);
      if (child) {
        currentSelectedKey = child.key;
        parentKey = menu.key;
      }
    }
  });
  
  return { currentSelectedKey, parentKey };
};

/**
 * 根据当前路由路径更新菜单选中状态
 * 同时处理子菜单的展开状态
 */
const updateSelectedMenu = () => {
  const currentPath = route.path;
  const { currentSelectedKey, parentKey } = findMenuKeysByPath(currentPath);
  
  if (currentSelectedKey) {
    selectedKeys.value = [currentSelectedKey];
    if (parentKey && !props.collapsed) {
      // 只在非折叠状态下自动展开父菜单
      if (!openKeys.value.includes(parentKey)) {
        openKeys.value = [...openKeys.value, parentKey];
      }
    }
  }
};

/**
 * 根据菜单key查找对应的路由路径
 * @param key 菜单项的key
 * @returns 匹配的路由路径，未找到则返回空字符串
 */
const findPathByMenuKey = (key: string): string => {
  let targetPath = '';
  
  // 查找一级菜单
  const mainMenu = menuConfig.find(menu => menu.key === key);
  if (mainMenu && mainMenu.path) {
    return mainMenu.path;
  }
  
  // 查找子菜单
  menuConfig.forEach(menu => {
    if (menu.children && menu.children.length > 0) {
      const child = menu.children.find(child => child.key === key);
      if (child && child.path) {
        targetPath = child.path;
      }
    }
  });
  
  return targetPath;
};

// 监听路由变化，更新菜单选中状态
watch(() => route.path, () => {
  updateSelectedMenu();
}, { immediate: true });

/**
 * 监听菜单折叠状态变化
 * 折叠时清空展开项，展开时恢复选中状态
 */
watch(() => props.collapsed, (val) => {
  if (val) {
    openKeys.value = [];
  } else {
    updateSelectedMenu();
  }
});

/**
 * 监听菜单展开状态变化，检查滚动状态
 * 当菜单展开/收起时，可能会影响滚动区域
 */
watch(() => openKeys.value, () => {
  nextTick(() => {
    checkMenuOverflow();
  });
}, { deep: true });

/**
 * 处理菜单项点击事件
 * 根据点击的菜单项查找对应路由并跳转
 */
const handleMenuClick: MenuProps['onClick'] = (info) => {
  const key = info.key as string;
  const targetPath = findPathByMenuKey(key);
  
  if (targetPath && targetPath !== route.path) {
    router.push(targetPath);
  }
};

/**
 * 检查菜单是否需要滚动，并添加相应的CSS类
 * - ant-menu--has-overflow-bottom: 底部有更多内容
 * - ant-menu--has-overflow-top: 顶部有更多内容
 */
const checkMenuOverflow = () => {
  if (!menuElement.value) return;
  
  const menuEl = menuElement.value;
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
};

/**
 * 设置菜单滚动事件监听
 * 当用户滚动菜单时实时更新滚动提示状态
 */
const setupMenuEvents = () => {
  menuElement.value = document.querySelector('.side-menu .ant-menu');
  if (menuElement.value) {
    menuElement.value.addEventListener('scroll', checkMenuOverflow);
  }
};

/**
 * 清理事件监听，防止内存泄漏
 */
const cleanupMenuEvents = () => {
  if (menuElement.value) {
    menuElement.value.removeEventListener('scroll', checkMenuOverflow);
    menuElement.value = null;
  }
};

/**
 * 组件挂载时初始化
 * 1. 更新菜单选中状态
 * 2. 检查菜单滚动状态
 * 3. 设置滚动事件监听
 */
onMounted(() => {
  updateSelectedMenu();
  nextTick(() => {
    setupMenuEvents();
    checkMenuOverflow();
  });
});

/**
 * 组件卸载前清理事件监听
 */
onBeforeUnmount(() => {
  cleanupMenuEvents();
});
</script>

<style lang="scss" scoped>
/**
 * 侧边菜单样式
 */
.side-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  /* 菜单主体样式 */
  :deep(.ant-menu) {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    position: relative;
    transition: height 0.3s ease, overflow-y 0.3s ease;
    
    /* 滚动条样式优化 - 仅在悬停时显示 */
    &::-webkit-scrollbar {
      width: 6px;
      background-color: transparent;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    &:hover::-webkit-scrollbar {
      opacity: 1;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.4);
      }
    }
    
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* 深色主题下的滚动条样式 */
    .ant-menu-dark & {
      &::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      }
      
      &::-webkit-scrollbar-track {
        background-color: rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    }
    
    /* 防止菜单展开时滚动条闪烁 */
    &.ant-menu-submenu-open {
      &::-webkit-scrollbar {
        opacity: 0;
        transition: opacity 0.5s ease;
      }
    }
    
    /* 底部渐变阴影提示 - 当内容超出并可向下滚动时显示 */
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 6px; /* 为滚动条留出空间 */
      height: 30px;
      background: linear-gradient(to top, rgba(12, 33, 53, 0.9), transparent);
      pointer-events: none; /* 确保不会影响鼠标事件 */
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
    }
    
    /* 顶部渐变阴影提示 - 当内容已滚动且可向上滚动时显示 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 6px; /* 为滚动条留出空间 */
      height: 24px;
      background: linear-gradient(to bottom, rgba(12, 33, 53, 0.9), transparent);
      pointer-events: none; /* 确保不会影响鼠标事件 */
      opacity: 0;
      transition: opacity 0.3s;
      z-index: 1;
    }
    
    /* 显示底部滚动提示 */
    &.ant-menu--has-overflow-bottom::after {
      opacity: 1;
    }
    
    /* 显示顶部滚动提示 */
    &.ant-menu--has-overflow-top::before {
      opacity: 1;
    }
    
    /* 兼容Firefox滚动条样式 */
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
  }
}

/* 菜单子标题样式调整 */
:deep(.ant-menu-submenu-title) {
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 16px !important;

  /* 菜单文本样式 */
  .ant-menu-title-content {
    flex: 1 !important;
    margin-left: 10px !important;
  }
  
  /* 展开/收起箭头样式 */
  .ant-menu-submenu-arrow {
    position: static !important;
    margin: 0 !important;
  }
}

/* 菜单项样式调整 */
:deep(.ant-menu-item) {
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
  line-height: 40px !important;
  padding: 0 16px !important;
  
  /* 菜单文本样式 */
  .ant-menu-title-content {
    flex: 1 !important;
    margin-left: 10px !important;
  }
}

/* 菜单收起状态样式 */
:deep(.ant-menu-inline-collapsed) {
  .ant-menu-submenu-title,
  .ant-menu-item {
    padding: 0 !important;
    justify-content: center !important;
    
    /* 图标居中 */
    .ant-menu-item-icon,
    .anticon {
      margin: 0 !important;
    }
    
    /* 隐藏文本 */
    .ant-menu-title-content {
      display: none !important;
    }
    
    /* 隐藏箭头 */
    .ant-menu-submenu-arrow {
      display: none !important;
    }
  }
}

/* 深色主题样式调整 */
:deep(.ant-menu-dark) {
  background-color: #0c2135;
  
  /* 选中项样式 */
  .ant-menu-item-selected {
    background-color: rgba(24, 144, 255, 0.8);
  }
  
  /* 箭头颜色 */
  .ant-menu-submenu-arrow {
    &::before, &::after {
      background: rgba(255, 255, 255, 0.65) !important;
    }
  }
  
  /* 子菜单背景色 */
  .ant-menu-sub {
    background-color: rgba(0, 0, 0, 0.2) !important;
  }
}

/* 子菜单项缩进 */
:deep(.ant-menu-sub) {
  .ant-menu-item {
    padding-left: 42px !important;
  }
}
</style>
