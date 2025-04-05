<template>
  <a-layout class="mix-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="mix-layout-header" :class="{ 'fixed': layoutStore.fixedHeader }">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo-container">
          <img src="@/assets/vue.svg" alt="Logo" class="logo-img" />
          <h1 class="logo-title">IMLJX-WMS</h1>
        </div>
        
        <!-- 顶部主菜单 -->
        <div class="top-menu-container">
          <a-menu
            mode="horizontal"
            :theme="layoutStore.headerTheme"
            :selectedKeys="selectedTopMenu"
            class="top-menu"
          >
            <a-menu-item key="dashboard">
              <router-link to="/dashboard">
                <DashboardOutlined />
                <span>仪表盘</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="inventory">
              <router-link to="/inventory">
                <InboxOutlined />
                <span>库存管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="inbound">
              <router-link to="/inbound">
                <ImportOutlined />
                <span>入库管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="outbound">
              <router-link to="/outbound">
                <ExportOutlined />
                <span>出库管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="reports">
              <router-link to="/reports">
                <BarChartOutlined />
                <span>报表分析</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="system">
              <router-link to="/system">
                <SettingOutlined />
                <span>系统设置</span>
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
        
        <!-- 右侧操作区 -->
        <div class="header-right">
          <!-- 通知图标和配置选项 -->
          <HeaderContent :is-top-menu="true" />
        </div>
      </div>
    </a-layout-header>
    
    <a-layout class="mix-layout-container">
      <!-- 侧边栏子菜单 -->
      <a-layout-sider
        v-if="showSider"
        :theme="layoutStore.siderTheme"
        class="mix-layout-sider"
        width="256"
      >
        <!-- 子菜单 -->
        <a-menu
          :theme="layoutStore.siderTheme"
          mode="inline"
          :selectedKeys="selectedKeys"
          :openKeys="openKeys"
        >
          <!-- 根据选中的顶部菜单显示对应的子菜单 -->
          <template v-for="item in currentSubmenu" :key="item.key">
            <!-- 有子菜单的项目 -->
            <template v-if="item.children && item.children.length">
              <a-sub-menu :key="item.key">
                <template #title>
                  <component :is="getComponentIcon(item.icon)" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                </template>
                <a-menu-item v-for="child in item.children" :key="child.key">
                  <router-link :to="child.path || ''">
                    <component :is="getComponentIcon(child.icon)" v-if="child.icon" />
                    <span>{{ child.title }}</span>
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
            
            <!-- 没有子菜单的项目 -->
            <template v-else>
              <a-menu-item :key="item.key">
                <router-link :to="item.path || ''">
                  <component :is="getComponentIcon(item.icon)" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                </router-link>
              </a-menu-item>
            </template>
          </template>
        </a-menu>
      </a-layout-sider>

      <a-layout class="mix-layout-right">
        <!-- 标签页 -->
        <a-layout-content v-if="layoutStore.showTabs" class="tags-nav-container">
          <TabsNav />
        </a-layout-content>
        
        <!-- 主内容区 -->
        <a-layout-content 
          class="mix-layout-content"
          :class="{ 
            'fixed-header': layoutStore.fixedHeader,
            'show-tabs': layoutStore.showTabs,
            'has-sider': showSider
          }"
        >
          <div class="content-container">
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
        <a-layout-footer class="mix-layout-footer">
          IMLJX-WMS 仓储管理系统 ©2024 Created by IMLJX
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLayoutStore } from '../../store/layout';
// 图标
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  ClusterOutlined,
  InboxOutlined,
  ExportOutlined,
  BarChartOutlined, 
  SettingOutlined,
  BellOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  ShoppingOutlined,
  ImportOutlined,
  AimOutlined,
  AlertOutlined,
  ApiOutlined,
  AppstoreAddOutlined,
  AuditOutlined,
  BankOutlined,
  BookOutlined,
  BuildOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CloudOutlined,
  CodeOutlined,
  CommentOutlined,
  CompassOutlined,
  ContactsOutlined,
  CreditCardOutlined,
  CrownOutlined,
  DatabaseOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileOutlined,
  FolderOutlined,
  ForkOutlined,
  FundOutlined,
  GlobalOutlined,
  HomeOutlined,
  IdcardOutlined,
  InsuranceOutlined,
  LayoutOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  MonitorOutlined,
  PayCircleOutlined,
  PieChartOutlined,
  PrinterOutlined,
  ProfileOutlined,
  ProjectOutlined,
  PropertySafetyOutlined,
  ReadOutlined,
  ReconciliationOutlined,
  RedEnvelopeOutlined,
  ScanOutlined,
  ScheduleOutlined,
  SearchOutlined,
  ShopOutlined,
  SolutionOutlined,
  SoundOutlined,
  StarOutlined,
  SubnodeOutlined,
  TableOutlined,
  TagOutlined,
  ToolOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
  WalletOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue';
import TabsNav from '../components/TabsNav.vue';
import HeaderContent from '../components/HeaderContent.vue';
import menuConfig from '../../config/menu';

// 创建图标映射对象
const iconComponents = {
  DashboardOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  InboxOutlined,
  ExportOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  ShoppingOutlined,
  ImportOutlined,
  AimOutlined,
  AlertOutlined,
  ApiOutlined,
  AppstoreAddOutlined,
  AuditOutlined,
  BankOutlined,
  BookOutlined,
  BuildOutlined,
  CalculatorOutlined,
  CalendarOutlined,
  CloudOutlined,
  CodeOutlined,
  CommentOutlined,
  CompassOutlined,
  ContactsOutlined,
  CreditCardOutlined,
  CrownOutlined,
  DatabaseOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileOutlined,
  FolderOutlined,
  ForkOutlined,
  FundOutlined,
  GlobalOutlined,
  HomeOutlined,
  IdcardOutlined,
  InsuranceOutlined,
  LayoutOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined,
  MonitorOutlined,
  PayCircleOutlined,
  PieChartOutlined,
  PrinterOutlined,
  ProfileOutlined,
  ProjectOutlined,
  PropertySafetyOutlined,
  ReadOutlined,
  ReconciliationOutlined,
  RedEnvelopeOutlined,
  ScanOutlined,
  ScheduleOutlined,
  SearchOutlined,
  ShopOutlined,
  SolutionOutlined,
  SoundOutlined,
  StarOutlined,
  SubnodeOutlined,
  TableOutlined,
  TagOutlined,
  ToolOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
  WalletOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
};

// 获取图标组件的函数
const getComponentIcon = (iconName: string | undefined) => {
  if (!iconName) return null;
  return iconComponents[iconName as keyof typeof iconComponents];
};

// 布局状态管理
const layoutStore = useLayoutStore();
const route = useRoute();

// 当前顶部菜单选中项
const selectedTopMenu = computed(() => {
  const path = route.path;
  const firstLevelPath = path.split('/')[1];
  return [firstLevelPath || 'dashboard'];
});

// 当前子菜单选中项
const selectedKeys = computed(() => {
  const path = route.path;
  const pathParts = path.split('/').filter(Boolean);
  
  if (pathParts.length >= 2) {
    // 如果是操作类菜单，使用完整路径作为key
    if (pathParts[0] === 'operations' && pathParts.length >= 3) {
      return [`${pathParts[1]}-${pathParts[2]}`];
    }
    // 其他情况使用二级路径作为key
    return [`${pathParts[0]}-${pathParts[1]}`];
  }
  
  return [];
});

// 默认展开的子菜单
const openKeys = ref<string[]>([]);

// 是否显示侧边栏
const showSider = computed(() => {
  const topMenu = selectedTopMenu.value[0];
  const menuItem = menuConfig.find(item => item.key === topMenu);
  return menuItem && menuItem.children && menuItem.children.length > 0;
});

// 当前选中的顶部菜单对应的子菜单配置
const currentSubmenu = computed(() => {
  const topMenuKey = selectedTopMenu.value[0];
  const menuItem = menuConfig.find(item => item.key === topMenuKey);
  return menuItem?.children || [];
});

// 监听顶部菜单变化，更新子菜单展开状态
watch(selectedTopMenu, (newVal) => {
  const topMenuKey = newVal[0];
  const menuItem = menuConfig.find(item => item.key === topMenuKey);
  
  if (menuItem && menuItem.children) {
    // 更新侧边栏默认展开项
    const subKeys = menuItem.children
      .filter(item => item.children && item.children.length > 0)
      .map(item => item.key);
    
    if (subKeys.length > 0) {
      openKeys.value = [subKeys[0]]; // 默认展开第一个子菜单
    } else {
      openKeys.value = [];
    }
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.mix-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
  
  &-header {
    background: #fff;
    padding: 0;
    height: 64px;
    line-height: 64px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    z-index: 11;
    
    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
    }
    // 头部容器
    .header-container {
      display: flex;
      align-items: center;
      padding: 0 24px;
      height: 100%;
      
      .logo-container {
        display: flex;
        align-items: center;
        padding-right: 48px;
        
        .logo-img {
          height: 32px;
          width: auto;
        }
        
        .logo-title {
          margin: 0 0 0 12px;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 600;
          font-size: 18px;
          white-space: nowrap;
        }
      }
      
      .top-menu-container {
        flex: 1;
        overflow-x: auto;
        
        &::-webkit-scrollbar {
          display: none;
        }
        
        .top-menu {
          line-height: 64px;
          border-bottom: none;
          background: transparent;
          
          :deep(.ant-menu-item) {
            padding: 0 20px;
            margin: 0 4px;
            
            &::after {
              left: 20px;
              right: 20px;
            }
            
            &:hover {
              color: var(--ant-primary-color);
              background: rgba(0, 0, 0, 0.015);
            }
          }
        }
      }
      
      // 添加头部右侧区域样式
      .header-right {
        height: 100%;
        display: flex;
        align-items: center;
        
        :deep(.header-content) {
          height: 100%;
          
          .action-area {
            height: 100%;
            
            .action-item {
              height: 64px;
              line-height: 64px;
              min-width: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
      }
    }
  }
  
  &-container {
    flex: 1;
    margin-top: 64px;
    display: flex;
    
    .mix-layout-sider {
      position: fixed;
      top: 64px;
      left: 0;
      width: 256px !important;
      height: calc(100vh - 64px);
      overflow: auto;
      z-index: 10;
      transition: all 0.3s;
      box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
      background-color: #001529;
      
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.12);
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.06);
      }
      
      :deep(.ant-menu) {
        border-right: none;
        
        .ant-menu-item {
          margin: 4px 12px;
          padding: 0 12px 0 16px;
          border-radius: 6px;
          height: 40px;
          line-height: 40px;
          
          &:hover {
            color: var(--ant-primary-color);
            background: rgba(0, 0, 0, 0.015);
          }
          
          &.ant-menu-item-selected {
            background: var(--ant-primary-1);
            color: var(--ant-primary-color);
            font-weight: 500;
            
            &::after {
              opacity: 1;
              transform: scaleY(1);
              transition: transform 0.15s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
          }
          
          .anticon {
            font-size: 16px;
            min-width: 16px;
            transition: all 0.3s;
          }
          
          span {
            margin-left: 10px;
            transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          }
        }
        
        .ant-menu-submenu {
          &-title {
            margin: 4px 12px;
            padding: 0 12px 0 16px;
            border-radius: 6px;
            height: 40px;
            line-height: 40px;
            
            &:hover {
              color: var(--ant-primary-color);
              background: rgba(0, 0, 0, 0.015);
            }
            
            .anticon {
              font-size: 16px;
              min-width: 16px;
              transition: all 0.3s;
            }
            
            span {
              margin-left: 10px;
              transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
          }
          
          &-arrow {
            right: 12px;
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
          }
          
          &-open {
            > .ant-menu-submenu-title {
              color: var(--ant-primary-color);
              
              .ant-menu-submenu-arrow {
                color: var(--ant-primary-color);
                transform: translateY(-2px);
              }
            }
          }
        }
        
        // 暗色主题适配
        &.ant-menu-dark {
          .ant-menu-item {
            &:hover {
              background: rgba(255, 255, 255, 0.08);
            }
            
            &.ant-menu-item-selected {
              background: var(--ant-primary-color);
              color: #fff;
            }
          }
          
          .ant-menu-submenu {
            &-title:hover {
              background: rgba(255, 255, 255, 0.08);
            }
            
            &-open > .ant-menu-submenu-title {
              color: #fff;
              
              .ant-menu-submenu-arrow {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
  
  &-right {
    flex: 1;
    transition: all 0.3s;
    margin-left: 256px;
    
    .mix-layout-content {
      margin: 24px;
      padding: 24px;
      background: #fff;
      border-radius: 2px;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      
      &.fixed-header {
        margin-top: 88px;
        
        &.show-tabs {
          margin-top: 128px;
        }
      }
    }
  }
  
  .content-container {
    min-height: calc(100vh - 64px - 48px - 70px);
  }
  
  .tags-nav-container {
    background: #fff;
    margin: 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    position: fixed;
    top: 64px;
    width: calc(100% - 256px);
    left: 256px;
    z-index: 9;
    transition: all 0.3s;
  }
  
  &-footer {
    text-align: center;
    padding: 14px 50px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    background: #f0f2f5;
    margin-left: 256px;
    transition: all 0.3s;
  }
}
</style> 
