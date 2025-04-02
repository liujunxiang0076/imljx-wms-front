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
                <AppstoreOutlined />
                <span>库存管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="operations">
              <router-link to="/operations">
                <ClusterOutlined />
                <span>作业管理</span>
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
        v-model:collapsed="collapsed"
        :theme="layoutStore.siderTheme"
        :trigger="null"
        collapsible
        class="mix-layout-sider"
        width="256"
      >
        <!-- 子菜单 -->
        <a-menu
          :theme="layoutStore.siderTheme"
          mode="inline"
          :selectedKeys="selectedKeys"
          :openKeys="openKeys"
          :inlineCollapsed="collapsed"
        >
          <!-- 动态子菜单，根据顶部选中的菜单项显示不同的子菜单 -->
          <template v-if="selectedTopMenu[0] === 'inventory'">
            <a-menu-item key="inventory-overview">
              <router-link to="/inventory/overview">
                <AppstoreOutlined />
                <span>库存概览</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="inventory-list">
              <router-link to="/inventory/list">
                <UnorderedListOutlined />
                <span>库存列表</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="inventory-check">
              <router-link to="/inventory/check">
                <CheckSquareOutlined />
                <span>库存盘点</span>
              </router-link>
            </a-menu-item>
          </template>
          
          <template v-else-if="selectedTopMenu[0] === 'operations'">
            <a-sub-menu key="inbound">
              <template #title>
                <InboxOutlined />
                <span>入库管理</span>
              </template>
              <a-menu-item key="inbound-list">
                <router-link to="/operations/inbound/list">
                  <span>入库单列表</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="inbound-create">
                <router-link to="/operations/inbound/create">
                  <span>新建入库单</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
            
            <a-sub-menu key="outbound">
              <template #title>
                <ExportOutlined />
                <span>出库管理</span>
              </template>
              <a-menu-item key="outbound-list">
                <router-link to="/operations/outbound/list">
                  <span>出库单列表</span>
                </router-link>
              </a-menu-item>
              <a-menu-item key="outbound-create">
                <router-link to="/operations/outbound/create">
                  <span>新建出库单</span>
                </router-link>
              </a-menu-item>
            </a-sub-menu>
          </template>
          
          <template v-else-if="selectedTopMenu[0] === 'system'">
            <a-menu-item key="system-users">
              <router-link to="/system/users">
                <UserOutlined />
                <span>用户管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="system-roles">
              <router-link to="/system/roles">
                <TeamOutlined />
                <span>角色管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="system-permissions">
              <router-link to="/system/permissions">
                <LockOutlined />
                <span>权限管理</span>
              </router-link>
            </a-menu-item>
            <a-menu-item key="system-settings">
              <router-link to="/system/settings">
                <SettingOutlined />
                <span>系统设置</span>
              </router-link>
            </a-menu-item>
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

<script lang="ts">
import { ref, computed, watch, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { useLayoutStore } from '../../store/layout';
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
  LockOutlined
} from '@ant-design/icons-vue';
import UserAvatar from '../components/UserAvatar.vue';
import TabsNav from '../components/TabsNav.vue';
import HeaderContent from '../components/HeaderContent.vue';

export default defineComponent({
  name: 'MixLayout',
  components: {
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
    UserAvatar,
    TabsNav,
    HeaderContent
  },
  setup() {
    // 布局状态管理
    const layoutStore = useLayoutStore();
    const route = useRoute();

    // 侧边栏折叠状态
    const collapsed = ref(false);

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
      return ['inventory', 'operations', 'system'].includes(topMenu);
    });

    // 监听顶部菜单变化，更新子菜单展开状态
    watch(selectedTopMenu, (newVal) => {
      if (newVal[0] === 'operations') {
        // 根据当前路径决定要展开的子菜单
        const pathParts = route.path.split('/').filter(Boolean);
        if (pathParts.length >= 2 && pathParts[0] === 'operations') {
          openKeys.value = [pathParts[1]]; // 展开当前操作类型的子菜单
        }
      }
    }, { immediate: true });

    return {
      layoutStore,
      route,
      collapsed,
      selectedTopMenu,
      selectedKeys,
      openKeys,
      showSider
    };
  }
});
</script>

<style lang="scss" scoped>
.mix-layout {
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
      padding-right: 24px;
      
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
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
      
      .notification-wrapper {
        padding: 0 12px;
        cursor: pointer;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
        
        :deep(.ant-badge-dot) {
          position: absolute;
          top: 16px;
          right: 6px;
          height: 8px;
          width: 8px;
          box-shadow: 0 0 0 1px #fff;
        }
      }
    }
  }
  
  &-container {
    flex: 1;
    margin-top: 64px;
  }
  
  &-sider {
    position: fixed;
    top: 64px;
    left: 0;
    height: calc(100vh - 64px);
    overflow: auto;
    z-index: 10;
    transition: all 0.3s;
    
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
    width: calc(100% - 256px);
    left: 256px;
    z-index: 8;
    transition: all 0.3s;
  }
  
  .mix-layout-sider.ant-layout-sider-collapsed ~ .mix-layout-right .tags-nav-container {
    width: calc(100% - 80px);
    left: 80px;
  }
  
  &-content {
    margin: 24px;
    padding: 24px;
    background: #fff;
    border-radius: 2px;
    transition: all 0.3s;
    
    &.fixed-header {
      margin-top: 24px;
      
      &.show-tabs {
        margin-top: 84px;
      }
    }
    
    &.has-sider {
      margin-left: 280px; /* 256px + 24px margin */
      
      .mix-layout-sider.ant-layout-sider-collapsed ~ & {
        margin-left: 104px; /* 80px + 24px margin */
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
    margin-left: 256px;
    transition: all 0.3s;
    
    &.has-sider {
      .mix-layout-sider.ant-layout-sider-collapsed ~ & {
        margin-left: 80px;
      }
    }
  }
  
  &-right {
    transition: all 0.3s;
  }
}
</style> 
