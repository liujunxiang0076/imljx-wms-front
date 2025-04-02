<template>
  <a-layout class="top-layout">
    <!-- 顶部导航 -->
    <a-layout-header class="top-layout-header" :class="{ 'fixed': layoutStore.fixedHeader }">
      <div class="header-container">
        <!-- Logo -->
        <div class="logo-container">
          <img src="@/assets/vue.svg" alt="Logo" class="logo-img" />
          <h1 class="logo-title">IMLJX-WMS</h1>
        </div>
        
        <!-- 顶部菜单 -->
        <div class="top-menu-container">
          <a-menu
            mode="horizontal"
            :theme="layoutStore.headerTheme"
            :selectedKeys="selectedKeys"
            :openKeys="openKeys"
            class="top-menu"
          >
            <!-- 仪表盘 -->
            <a-menu-item key="dashboard">
              <router-link to="/dashboard">
                <DashboardOutlined />
                <span>仪表盘</span>
              </router-link>
            </a-menu-item>
            
            <!-- 库存管理 -->
            <a-sub-menu key="inventory">
              <template #title>
                <AppstoreOutlined />
                <span>库存管理</span>
              </template>
              <a-menu-item key="inventory-overview">
                <router-link to="/inventory/overview">
                  <span>库存总览</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inventory-detail">
                <router-link to="/inventory/detail">
                  <span>库存明细</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inventory-check">
                <router-link to="/inventory/check">
                  <span>库存盘点</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inventory-location">
                <router-link to="/inventory/location">
                  <span>库位管理</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <!-- 入库管理 -->
            <a-sub-menu key="inbound">
              <template #title>
                <InboxOutlined />
                <span>入库管理</span>
              </template>
              <a-menu-item key="inbound-receipt">
                <router-link to="/inbound/receipt">
                  <span>入库单管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inbound-plan">
                <router-link to="/inbound/plan">
                  <span>入库计划</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inbound-verify">
                <router-link to="/inbound/verify">
                  <span>入库验收</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inbound-return">
                <router-link to="/inbound/return">
                  <span>退货入库</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <!-- 出库管理 -->
            <a-sub-menu key="outbound">
              <template #title>
                <ExportOutlined />
                <span>出库管理</span>
              </template>
              <a-menu-item key="outbound-order">
                <router-link to="/outbound/order">
                  <span>出库单管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="outbound-plan">
                <router-link to="/outbound/plan">
                  <span>出库计划</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="outbound-picking">
                <router-link to="/outbound/picking">
                  <span>拣货管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="outbound-delivery">
                <router-link to="/outbound/delivery">
                  <span>发运管理</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <!-- 报表分析 -->
            <a-menu-item key="reports">
              <router-link to="/reports">
                <BarChartOutlined />
                <span>报表分析</span>
              </router-link>
            </a-menu-item>
            
            <!-- 系统设置 -->
            <a-sub-menu key="system">
              <template #title>
                <SettingOutlined />
                <span>系统设置</span>
              </template>
              <a-menu-item key="system-users">
                <router-link to="/system/users">
                  <span>用户管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="system-roles">
                <router-link to="/system/roles">
                  <span>角色管理</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="system-permissions">
                <router-link to="/system/permissions">
                  <span>权限管理</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </div>
        
        <!-- 右侧操作区 -->
        <div class="header-right">
          <!-- 搜索框 -->
          <a-input-search
            placeholder="搜索..."
            style="width: 200px;"
          />
          
          <!-- 通知图标和配置选项 -->
          <HeaderContent :is-top-menu="true" />
        </div>
      </div>
    </a-layout-header>
    
    <!-- 标签页 -->
    <a-layout-content v-if="layoutStore.showTabs" class="tags-nav-container">
      <TabsNav />
    </a-layout-content>
    
    <!-- 内容区 -->
    <a-layout-content 
      class="top-layout-content"
      :class="{ 
        'fixed-header': layoutStore.fixedHeader,
        'show-tabs': layoutStore.showTabs 
      }"
    >
      <div class="content-container">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </a-layout-content>
    
    <!-- 页脚 -->
    <a-layout-footer class="top-layout-footer">
      IMLJX-WMS 仓储管理系统 ©2024 Created by IMLJX
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, defineComponent } from 'vue';
import { useLayoutStore } from '../../store/layout';
import { useRoute } from 'vue-router';
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  InboxOutlined, 
  ExportOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons-vue';
import UserAvatar from '../components/UserAvatar.vue';
import TabsNav from '../components/TabsNav.vue';
import HeaderContent from '../components/HeaderContent.vue';
import { menuConfig } from '../../config/menu';

export default defineComponent({
  name: 'TopLayout',
  components: {
    DashboardOutlined, 
    AppstoreOutlined, 
    InboxOutlined, 
    ExportOutlined, 
    BarChartOutlined, 
    SettingOutlined,
    BellOutlined,
    UserOutlined,
    TeamOutlined,
    UserAvatar,
    TabsNav,
    HeaderContent
  },
  setup() {
    // 布局状态管理
    const layoutStore = useLayoutStore();
    const route = useRoute();

    // 当前打开的子菜单
    const openKeys = ref<string[]>([]);

    // 当前选中的菜单
    const selectedKeys = computed(() => {
      const path = route.path;
      const paths = path.split('/').filter(Boolean);
      
      if (paths.length > 1) {
        // 如果路径有多级，选中具体的子菜单项
        return [`${paths[0]}-${paths[1]}`];
      } else {
        // 一级路径，选中主菜单
        return [paths[0] || 'dashboard'];
      }
    });

    // 监听路由变化，更新打开的子菜单
    watch(() => route.path, (path) => {
      const paths = path.split('/').filter(Boolean);
      if (paths.length > 0) {
        openKeys.value = [paths[0]];
      }
    }, { immediate: true });

    onMounted(() => {
      // 在移动设备上调整布局
      if (window.innerWidth < 768) {
        layoutStore.collapsed = true;
      }
    });

    return {
      layoutStore,
      selectedKeys,
      openKeys,
      menuConfig
    };
  }
});
</script>

<style lang="scss" scoped>
.top-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
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
      left: 0;
      width: 100%;
    }
    
    .header-container {
      display: flex;
      align-items: center;
      padding: 0 24px;
      height: 100%;
    }
    
    .logo-container {
      display: flex;
      align-items: center;
      margin-right: 24px;
      
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
        
        :deep(.ant-menu-item) {
          padding: 0 16px;
          
          &::after {
            left: 16px;
            right: 16px;
          }
        }
        
        :deep(.ant-menu-submenu-title) {
          padding: 0 16px;
        }
        
        :deep(.ant-menu-submenu) {
          &::after {
            left: 16px;
            right: 16px;
          }
        }
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      margin-left: auto;
      
      .ant-input-search {
        margin-right: 16px;
      }
      
      :deep(.header-content) {
        display: flex;
        height: 64px;
        
        .action-area {
          display: flex;
          height: 100%;
          
          .action-item {
            padding: 0 12px;
            display: flex;
            align-items: center;
            height: 100%;
            
            &:hover {
              background: rgba(0, 0, 0, 0.025);
            }
          }
        }
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
    left: 0;
    width: 100%;
    z-index: 8;
  }
  
  &-content {
    flex: 1;
    padding: 24px;
    margin: 24px;
    background: #fff;
    border-radius: 2px;
    
    &.fixed-header {
      margin-top: 88px;
      
      &.show-tabs {
        margin-top: 128px;
      }
    }
  }
  
  .content-container {
    min-height: calc(100vh - 64px - 48px - 70px);
  }
  
  &-footer {
    text-align: center;
    padding: 14px 50px;
    background: #f0f2f5;
  }
}
</style> 
