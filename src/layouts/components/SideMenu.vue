<template>
  <div class="side-menu" :class="{ collapsed: collapsed }">
    <a-menu
      v-model:openKeys="openKeys"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :theme="theme"
      :inline-collapsed="collapsed"
      @click="handleMenuClick"
    >
      <template v-for="item in menuItems" :key="item.key">
        <a-menu-item v-if="!item.children || item.children.length === 0" :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <span>{{ item.title }}</span>
        </a-menu-item>
        <a-sub-menu v-else :key="item.key">
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
    </a-menu>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from 'vue';
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

export default defineComponent({
  name: 'SideMenu',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'dark'
    }
  },
  setup(props) {
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
    const handleMenuClick = ({ key }: { key: string }) => {
      // 查找对应菜单项的路径
      let targetPath = '';
      
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

    return {
      selectedKeys,
      openKeys,
      menuItems,
      handleMenuClick
    };
  }
});
</script>

<style lang="scss" scoped>
.side-menu {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  
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
  
  &.collapsed {
    overflow-y: visible;
  }
}
</style> 
