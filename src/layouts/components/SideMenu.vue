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
import { ref, computed, watch } from 'vue';
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

// 初始化菜单状态
updateSelectedMenu();
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
    
    // 优化滚动条样式
    &::-webkit-scrollbar {
      width: 4px;
      background-color: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.4);
      }
    }
    
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    
    // 改进菜单展开/收起动画
    .ant-menu-sub {
      transition: height 0.15s ease !important;
      transition-delay: 0ms !important;
    }
    
    // 改进SubMenu样式
    .ant-menu-submenu {
      &-title {
        transition: padding 0.15s ease, 
                   background 0.15s ease, 
                   color 0.15s ease !important;
      }
      
      &-arrow {
        transition: transform 0.15s ease !important;
      }
      
      &-open > .ant-menu-submenu-title .ant-menu-submenu-arrow {
        transform: rotate(180deg) !important;
      }
    }
    
    // 优化菜单项动画
    .ant-menu-item,
    .ant-menu-submenu-title {
      transition: padding 0.15s ease, 
                 background 0.15s ease, 
                 color 0.15s ease !important;
      border-radius: 0 22px 22px 0;
      margin: 4px 0;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background-color: currentColor;
        transform: scaleY(0);
        opacity: 0;
        transition: transform 0.2s, opacity 0.2s;
      }
      
      &:hover {
        background: rgba(0, 0, 0, 0.04);
        
        .anticon {
          transform: scale(1.1);
        }
      }
      
      &.ant-menu-item-selected {
        font-weight: 500;
        
        &::before {
          transform: scaleY(1);
          opacity: 1;
        }
        
        &:hover {
          // 选中项悬停时保持相同背景色
          .anticon {
            transform: scale(1.1);
          }
        }
      }
    }
    
    // 图标动画效果
    .anticon {
      margin-right: 10px;
      transition: transform 0.15s ease, margin 0.15s ease;
    }
    
    // 收起状态优化
    &.ant-menu-inline-collapsed {
      width: 80px !important;
      
      > .ant-menu-item,
      > .ant-menu-submenu > .ant-menu-submenu-title {
        padding: 0 calc(50% - 16px) !important;
        text-align: center;
        
        .anticon {
          margin: 0;
          font-size: 16px;
          line-height: 40px;
        }
      }
      
      .ant-menu-submenu-arrow {
        display: none;
      }
    }
  }
  
  &.collapsed {
    :deep(.ant-menu-inline-collapsed) {
      width: 80px !important;
    }
  }
}

/* 确保布局结构正确 */
:global(.ant-layout-sider-children) {
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
  overflow: hidden !important;
}

/* 暗色主题下的特殊处理 */
:deep(.ant-menu-dark) {
  background-color: #0c2135 !important; /* 更柔和的深蓝色 */
  
  .ant-menu-item:hover:not(.ant-menu-item-selected),
  .ant-menu-submenu-title:hover:not(.ant-menu-item-selected) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .ant-menu-item-selected {
    background-color: rgba(24, 144, 255, 0.8); /* 半透明蓝色，更专业 */
    
    &:hover {
      background-color: rgba(24, 144, 255, 0.9) !important;
    }
  }
  
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: rgba(255, 255, 255, 0.95) !important;
  }
  
  // 一级菜单展开/收起动画
  .ant-menu-submenu {
    > .ant-menu-submenu-title {
      transition: background 0.15s ease, color 0.15s ease !important;
    }
    
    &-open {
      > .ant-menu-submenu-title {
        background-color: rgba(255, 255, 255, 0.03);
      }
    }
    
    // 子菜单内容区域
    > .ant-menu-sub {
      background-color: rgba(0, 0, 0, 0.2) !important; /* 淡化子菜单背景 */
    }
  }
  
  // 优化箭头动画
  .ant-menu-submenu-arrow {
    transition: transform 0.15s ease !important;
  }
}

/* 亮色主题下的特殊处理 */
:deep(.ant-menu-light) {
  .ant-menu-item-selected {
    background-color: #e6f7ff;
    color: #1890ff;
    
    &:hover {
      background-color: #e6f7ff !important;
    }
  }
  
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    color: #1890ff !important;
  }
  
  // 一级菜单展开/收起动画
  .ant-menu-submenu {
    > .ant-menu-submenu-title {
      transition: all 0.2s ease-out !important;
    }
    
    &-open {
      > .ant-menu-submenu-title {
        background-color: rgba(0, 0, 0, 0.02);
      }
    }
    
    // 子菜单内容区域
    > .ant-menu-sub {
      background-color: #fafafa !important;
    }
  }
}
</style> 
