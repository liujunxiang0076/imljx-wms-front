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
          <!-- 根据选中的顶部菜单显示对应的子菜单 -->
          <template v-for="item in currentSubmenu" :key="item.key">
            <!-- 有子菜单的项目 -->
            <template v-if="item.children && item.children.length">
              <a-sub-menu :key="item.key">
                <template #title>
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                </template>
                <a-menu-item v-for="child in item.children" :key="child.key">
                  <router-link :to="child.path || ''">
                    <component :is="child.icon" v-if="child.icon" />
                    <span>{{ child.title }}</span>
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>
            
            <!-- 没有子菜单的项目 -->
            <template v-else>
              <a-menu-item :key="item.key">
                <router-link :to="item.path || ''">
                  <component :is="item.icon" v-if="item.icon" />
                  <span>{{ item.title }}</span>
                </router-link>
              </a-menu-item>
            </template>
          </template>
        </a-menu>
      </a-layout-sider>

      <!-- 折叠按钮 -->
      <div v-if="showSider" class="sidebar-trigger" @click="toggleCollapsed">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </div>
    
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
  LockOutlined,
  ShoppingOutlined,
  ImportOutlined,
  // 所有可能用到的图标组件
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
import UserAvatar from '../components/UserAvatar.vue';
import TabsNav from '../components/TabsNav.vue';
import HeaderContent from '../components/HeaderContent.vue';
import menuConfig from '../../config/menu';

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
    ShoppingOutlined,
    ImportOutlined,
    // 所有可能用到的图标组件
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
    MenuFoldOutlined,
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
      // 只有dashboard和没有子菜单的一级菜单不显示侧边栏
      if (topMenu === 'dashboard') return false;
      
      const menuItem = menuConfig.find(item => item.key === topMenu);
      return menuItem && menuItem.children && menuItem.children.length > 0;
    });

    // 当前选中的顶部菜单对应的子菜单配置
    const currentSubmenu = computed(() => {
      const topMenuKey = selectedTopMenu.value[0];
      const menuItem = menuConfig.find(item => item.key === topMenuKey);
      
      if (menuItem && menuItem.children && menuItem.children.length > 0) {
        return menuItem.children;
      }
      
      return [];
    });

    // 根据图标名称获取对应的图标组件
    const getIconComponent = (iconName: string | undefined) => {
      if (!iconName) return null;
      return iconName;
    };

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

    const toggleCollapsed = () => {
      collapsed.value = !collapsed.value;
    };

    return {
      layoutStore,
      route,
      collapsed,
      selectedTopMenu,
      selectedKeys,
      openKeys,
      showSider,
      currentSubmenu,
      getIconComponent,
      menuConfig,
      toggleCollapsed
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
    color: inherit;
    
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
        background: transparent;
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
    line-height: 40px;
    border-bottom: 1px solid #f0f0f0;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    position: fixed;
    top: 64px;
    width: 100%;
    left: 0;
    z-index: 8;
    transition: all 0.3s;
  }
  
  .mix-layout-container .tags-nav-container {
    width: calc(100% - 256px);
    left: 256px;
  }
  
  .mix-layout-sider.ant-layout-sider-collapsed ~ .mix-layout-right .tags-nav-container {
    width: calc(100% - 80px);
    left: 80px;
  }
  
  &-content {
    margin: 0;
    padding: 16px;
    background: #f0f2f5;
    transition: all 0.3s;
    
    &.fixed-header {
      margin-top: 24px;
      
      &.show-tabs {
        margin-top: 64px;
      }
    }
    
    &.has-sider {
      margin-left: 256px;
      
      .mix-layout-sider.ant-layout-sider-collapsed ~ .mix-layout-right & {
        margin-left: 80px;
      }
    }
  }
  
  .content-container {
    background: #fff;
    padding: 24px;
    border-radius: 2px;
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

  // 内容区域根据侧边栏是否存在调整位置
  .mix-layout-right .mix-layout-content:not(.has-sider) {
    margin-left: 24px;
  }

  .sidebar-trigger {
    position: fixed;
    top: 72px;
    left: 256px;
    width: 32px;
    height: 32px;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    z-index: 11;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
    
    &:hover {
      background: #f0f2f5;
    }
  }
  
  .ant-layout-sider-collapsed ~ .sidebar-trigger {
    left: 80px;
  }
}
</style> 
