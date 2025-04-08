<template>
  <!-- 布局容器 -->
  <a-layout class="main-layout" :class="{ 'collapsed': collapsed }">
    <!-- 顶部导航 -->
    <a-layout-header class="main-layout-header" :class="{ 'fixed': layoutStore.fixedHeader }">
      <div class="header-content">
        <div class="header-left">
          <img :src="config.system.systemLogo" alt="IMLJX" class="company-logo" />
          <div class="system-title">{{ config.system.systemName }}</div>
          <!-- 将菜单按钮放在文字后面 -->
          <a-button 
            type="text"
            class="trigger-btn"
            @click="collapsed = !collapsed"
            size="small"
          >
            <menu-unfold-outlined v-if="collapsed" />
            <menu-fold-outlined v-else />
          </a-button>
        </div>
        <div class="header-right">
          <a-space size="middle">
            <!-- 搜索框 -->
            <div class="search-container">
              <a-input
                placeholder="搜索..."
                style="width: 240px"
                :bordered="false"
                size="middle"
                class="global-search"
                allow-clear
                @pressEnter="handleSearch"
                v-model:value="searchValue"
              >
                <template #prefix>
                  <search-outlined style="color: #8c8c8c; font-size: 16px" />
                </template>
              </a-input>
            </div>
            
            <!-- 通知器 -->
            <a-dropdown placement="bottomRight">
              <div class="notification-icon-wrapper">
                <a-button type="text" shape="circle" class="notification-btn">
                  <template #icon><bell-outlined style="font-size: 16px" /></template>
                </a-button>
                <a-badge count="5" class="notification-badge" size="small" />
              </div>
              <template #overlay>
                <a-menu style="width: 300px">
                  <a-menu-item key="notification-title" style="text-align: center; cursor: default; font-weight: 500">
                    通知信息 (5条未读)
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="notification-1">
                    <div style="display: flex; align-items: flex-start">
                      <a-tag color="blue">入库</a-tag>
                      <div style="margin-left: 8px; flex: 1">
                        <div style="font-weight: 500">新的入库订单已创建</div>
                        <div style="font-size: 12px; color: rgba(0, 0, 0, 0.45)">刚刚</div>
                      </div>
                    </div>
                  </a-menu-item>
                  <a-menu-item key="notification-2">
                    <div style="display: flex; align-items: flex-start">
                      <a-tag color="red">警告</a-tag>
                      <div style="margin-left: 8px; flex: 1">
                        <div style="font-weight: 500">产品B2库存低于安全库存</div>
                        <div style="font-size: 12px; color: rgba(0, 0, 0, 0.45)">10分钟前</div>
                      </div>
                    </div>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="see-all" style="text-align: center">
                    <router-link to="/notifications">查看所有通知</router-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            
            <!-- 设置按钮 - 打开抽屉 -->
            <a-button type="text" shape="circle" class="setting-btn" @click="showSettingDrawer = true">
              <template #icon><setting-outlined style="font-size: 16px" /></template>
            </a-button>

            <!-- 用户个人信息 -->
            <a-dropdown placement="bottomRight">
              <div class="user-dropdown-btn">
                <a-avatar>{{ userStore?.userInfo?.username?.substring(0, 1) || '用户' }}</a-avatar>
                <span class="username">{{ userStore?.userInfo?.username || '用户名' }}</span>
                <down-outlined style="font-size: 12px; color: rgba(0, 0, 0, 0.45)" />  
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <user-outlined />
                    个人信息
                  </a-menu-item>
                  <a-menu-item key="settings">
                    <setting-outlined />
                    个人设置
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <logout-outlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <!-- 中间内容区 -->
    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider v-model:collapsed="collapsed" :theme="layoutStore.siderTheme" :trigger="null" collapsible
        class="main-layout-sider" width="256">
        <!-- Logo -->
        <div class="sider-container">
          <!-- 仅保留控制台文字，去除空白元素 -->
          <div v-if="!collapsed" class="sidebar-title">
            <h1 class="sidebar-title-text">控制台</h1>
          </div>

          <!-- 侧边菜单 -->
          <SideMenu :collapsed="collapsed" :theme="layoutStore.siderTheme" />
        </div>
      </a-layout-sider>

      <!-- 右侧内容 -->
      <a-layout class="right-content">
        <!-- 标签页 -->
        <a-layout-content v-if="layoutStore.showTabs" class="tags-nav-container">
          <TabsNav />
        </a-layout-content>

        <!-- 主内容区 -->
        <a-layout-content class="main-layout-content" :class="{
          'fixed-header': layoutStore.fixedHeader,
          'show-tabs': layoutStore.showTabs
        }">
          <div class="main-content-container">
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
        <a-layout-footer class="main-layout-footer">
          IMLJX-WMS 仓储管理系统 ©2024 Created by IMLJX
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
  
  <!-- 设置抽屉 -->
  <a-drawer
    title="系统设置"
    placement="right"
    :closable="true"
    :visible="showSettingDrawer"
    @close="showSettingDrawer = false"
    width="300"
  >
    <div class="setting-drawer-content">
      <div class="setting-block">
        <div class="setting-title">主题设置</div>
        <div class="setting-item">
          <span>暗色模式</span>
          <a-switch :modelValue="layoutStore.siderTheme === 'dark'" @update:modelValue="updateThemeSetting" />
        </div>
      </div>
      
      <div class="setting-block">
        <div class="setting-title">布局设置</div>
        <div class="setting-item">
          <span>固定头部</span>
          <a-switch :modelValue="layoutStore.fixedHeader" @update:modelValue="toggleFixedHeader" />
        </div>
        <div class="setting-item">
          <span>展开菜单</span>
          <a-switch :modelValue="!collapsed" @update:modelValue="toggleCollapsed" />
        </div>
      </div>
      
      <div class="setting-block">
        <div class="setting-title">系统设置</div>
        <div class="setting-item">
          <a-button type="primary" block>应用设置</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayoutStore } from '../../store/layout';
import { useUserStore } from '../../store/user';
import config from '../../config';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  DownOutlined
} from '@ant-design/icons-vue';

// 布局状态管理
const layoutStore = useLayoutStore();
const userStore = useUserStore();

// 侧边栏折叠状态
const collapsed = ref(layoutStore.collapsed || false);

// 搜索值
const searchValue = ref('');

// 设置抽屉显示状态
const showSettingDrawer = ref(false);

// 退出登录
const handleLogout = () => {
  // 这里可以调用退出登录的方法
  console.log('用户点击了退出登录');
  // userStore.logout();
};

// 响应式布局 - 窗口大小变化时自动调整布局
const handleResize = () => {
  if (document.documentElement.clientWidth < 992 && !collapsed.value) {
    collapsed.value = true;
  } else if (document.documentElement.clientWidth > 1200 && collapsed.value) {
    collapsed.value = false;
  }
  // 更新布局状态
  layoutStore.setCollapsed(collapsed.value);
};

// 搜索方法
const onSearch = (value: string) => {
  console.log('搜索关键词:', value);
  // 实现搜索功能
  if (value && value.trim()) {
    // 实际搜索逻辑将在此实现
  }
};

// 处理回车搜索事件
const handleSearch = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target && target.value) {
    onSearch(target.value);
  }
};

// 更新主题设置
const updateThemeSetting = (checked: boolean) => {
  // 应用暗色或亮色主题
  const theme = checked ? 'dark' : 'light';
  layoutStore.siderTheme = theme;
  console.log('更新主题:', theme);
};

// 切换菜单折叠状态
const toggleCollapsed = (value: boolean) => {
  collapsed.value = !value;
  layoutStore.setCollapsed(collapsed.value);
};

// 切换固定头部
const toggleFixedHeader = (value: boolean) => {
  layoutStore.fixedHeader = value;
};

// 监听窗口大小变化
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

defineExpose({
  collapsed
});
</script>

<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;

  &-sider {
    position: fixed;
    top: 60px; /* 放在header下方 */
    left: 0;
    height: calc(100vh - 60px); /* 减去header高度 */
    overflow: hidden; /* 默认隐藏滚动条 */
    z-index: 10;
    transition: width 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #001529; /* 更深的深蓝色调 */

    /* 鼠标进入时显示滚动条 */
    &:hover {
      overflow-y: auto;
    }

    .sider-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: relative;
      will-change: contents;
      /* 优化性能 */
      overflow-x: hidden; /* 防止水平滚动 */
      padding-bottom: 16px; /* 底部留出空间，防止菜单被截断 */



      .side-menu {
        position: relative;
        z-index: 1;
        overflow: hidden; /* 防止一闪而过的滚动条 */
      }
    }

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      transition: background-color 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 6px;
    }
  }

  &-header {
    background: #fff;
    padding: 0;
    height: 60px;
    line-height: 60px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 11; /* 增大层级，确保始终在最上层 */
    width: 100%;
    border-bottom: 1px solid #f0f0f0;

    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      transition: all 0.3s;
    }

    :deep(.header-content) {
      display: flex;
      align-items: center;
      justify-content: space-between; /* 添加两端对齐 */
      height: 100%;
      padding: 0 16px;

      .header-left {
        display: flex;
        align-items: center;
        flex: 1;
        overflow: hidden;
        
        .trigger-btn {
          margin-left: 12px;
          font-size: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          background: transparent;
          border: none;
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.06);
            color: #1890ff;
          }
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .search-container {
          background-color: #f5f5f5;
          border-radius: 6px;
          margin-right: 20px;
          transition: all 0.3s;
          border: 1px solid rgba(0, 0, 0, 0.06);
          overflow: hidden;
          height: 36px;
          
          &:hover {
            background-color: #f0f0f0;
            border-color: #e8e8e8;
          }
          
          .global-search {
            .ant-input {
              background-color: transparent;
              height: 36px;
              padding-left: 12px;
              color: rgba(0, 0, 0, 0.75);
              
              &::placeholder {
                color: #8c8c8c;
              }
              
              &:focus {
                background-color: rgba(255, 255, 255, 0.8);
              }
            }
            
            .ant-input-affix-wrapper {
              height: 36px;
              padding-top: 0;
              padding-bottom: 0;
              display: flex;
              align-items: center;
            }
            
            .ant-input-group-addon {
              background-color: transparent;
              border: none;
            }
            
            .ant-input-search-button {
              height: 36px;
              border-radius: 0 4px 4px 0;
              border: none;
              background-color: transparent;
              box-shadow: none;
              display: flex;
              align-items: center;
              justify-content: center;
              
              &:hover {
                background-color: rgba(24, 144, 255, 0.1);
                color: #1890ff;
              }
              
              &:focus, &:active {
                background-color: transparent;
                box-shadow: none;
              }
            }
          }
        }
        
        .username {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(0, 0, 0, 0.85);
          font-weight: 500;
        }
        
        .ant-badge {
          .ant-badge-count {
            box-shadow: 0 0 0 1px #fff;
            font-weight: 500;
            font-size: 12px;
            padding: 0 4px;
          }
        }
        
        .notification-icon-wrapper {
          position: relative;
          display: inline-block;
          
          .notification-badge {
            position: absolute;
            top: 2px;
            right: 2px;
            z-index: 1;
          }
        }
        
        .notification-btn, .setting-btn {
          height: 40px;
          width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.03);
            color: #1890ff;
          }
        }
        
        .ant-btn {
          display: flex;
          align-items: center;
          padding: 0 8px;
          height: 38px;
          
          &-text {
            color: rgba(0, 0, 0, 0.75);
            transition: all 0.3s;
            border-radius: 4px;
            
            &:hover {
              background-color: rgba(0, 0, 0, 0.03);
              color: rgba(0, 0, 0, 0.95);
            }
          }
        }
        
        .user-dropdown-btn {
          padding: 0 12px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          height: 40px;
          cursor: pointer;
          transition: all 0.3s;
          
          .username {
            margin: 0 6px 0 8px;
            font-weight: 500;
          }
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.03);
          }
        }
        
        .ant-avatar {
          background-color: #1890ff;
          color: #fff;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
        }
      }

      .company-logo {
        height: 28px;
        margin-right: 12px;
      }

      .system-title {
        font-size: 16px;
        font-weight: 600;
        background-image: linear-gradient(90deg, #1890ff, #3a77ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        letter-spacing: 0.5px;
      }
    }
  }

  .tags-nav-container {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(8px);
    margin: 0;
    padding: 0;
    height: 40px;
    /* 只保留标签栏高度 */
    line-height: initial;
    border-bottom: 1px solid #eaeaea;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 60px;
    width: 100%;
    z-index: 999; /* 最高层级确保标签栏始终在最上层 */
    transition: all 0.3s;
    margin-bottom: 0; /* 移除底部间距，由内容区域的padding-top管理 */
    display: flex;
    align-items: center;
    padding-left: 8px;
  }

  .right-content {
    margin-left: 256px; /* 与侧边栏宽度一致 */
    transition: margin-left 0.3s;
  }

  &.collapsed .right-content {
    margin-left: 80px; /* 折叠后的侧边栏宽度 */
  }

  &-content {
    margin: 0 20px 20px 20px; /* 增加左右和底部间距 */
    padding-top: 120px; /* 再次增加顶部与标签栏的间距，完全避免遮挡 */
    padding-bottom: 0;
    padding-left: 0;
    padding-right: 0;
    background: transparent;
    border-radius: 2px;
    transition: all 0.3s;
    
    /* 内容区域的卡片容器 */
    .dashboard-card {
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      margin-bottom: 16px;
      padding: 24px;
      transition: all 0.3s;
      
      &-header {
        margin-bottom: 16px;
        border-bottom: 1px solid #f0f0f0;
        padding-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        h2 {
          font-size: 16px;
          font-weight: 500;
          margin: 0;
          color: rgba(0, 0, 0, 0.85);
        }
      }
      
      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      }
    }

    &.fixed-header {
      padding-top: 120px;

      &.show-tabs {
        padding-top: 120px;
      }
    }
  }

  .main-content-container {
    min-height: calc(100vh - 60px - 40px - 60px - 20px); /* 考虑标签栏的高度和底部margin */
    display: flex;
    flex-direction: column;
    width: 100%;

    /* 主面板内容区域样式 */
    .dashboard-container {
      width: 100%;
      
      .card-overview {
        margin-bottom: 24px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        
        .data-card {
          text-align: center;
          padding: 24px 20px;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 3px;
            width: 100%;
            background: linear-gradient(90deg, #1890ff, #3a77ff);
            opacity: 0.8;
          }
          
          &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.09);
            transform: translateY(-2px);
          }
          
          .data-title {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            margin-bottom: 16px;
          }
          
          .data-value {
            font-size: 28px;
            font-weight: 600;
            margin: 8px 0;
            color: #1890ff;
            text-shadow: 0 0 1px rgba(24, 144, 255, 0.1);
          }
          
          .data-trend {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            margin-top: 8px;
            padding: 4px 0;
            
            &.up {
              color: #f5222d;
            }
            
            &.down {
              color: #52c41a;
            }
            
            .trend-icon {
              margin-right: 4px;
              font-size: 12px;
            }
          }
        }
      }
      
      /* 库存预警图表区域 */
      .inventory-warning {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        padding: 16px;
        margin-bottom: 16px;
        
        &-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          
          h3 {
            font-size: 16px;
            font-weight: 500;
            margin: 0;
            color: rgba(0, 0, 0, 0.85);
          }
        }
        
        &-chart {
          margin-top: 16px;
          
          .progress-item {
            margin-bottom: 12px;
            
            .progress-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              
              .progress-title {
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
              }
              
              .progress-value {
                font-weight: 500;
              }
            }
          }
        }
      }
      
      /* 库存明细表格 */
      .inventory-table {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        padding: 0;
        overflow: hidden;
        
        :deep(.ant-table) {
          font-size: 14px;
          
          .ant-table-thead > tr > th {
            background: #fafafa;
            font-weight: 500;
          }
          
          .ant-tag {
            margin-right: 0;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
          }
          
          .ant-tag-red {
            background: rgba(245, 34, 45, 0.08);
            border-color: rgba(245, 34, 45, 0.3);
            color: #cf1322;
          }
          
          .ant-tag-green {
            background: rgba(82, 196, 26, 0.08);
            border-color: rgba(82, 196, 26, 0.3);
            color: #52c41a;
          }
          
          .ant-tag-orange {
            background: rgba(250, 173, 20, 0.08);
            border-color: rgba(250, 173, 20, 0.3);
            color: #fa8c16;
          }
          
          .ant-btn-text {
            padding: 0 4px;
            font-size: 14px;
            
            &:not(:last-child) {
              margin-right: 8px;
            }
            
            &:hover {
              background: rgba(0, 0, 0, 0.03);
            }
          }
        }
      }
    }
  }

  &-footer {
    text-align: center;
    padding: 12px 50px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    transition: all 0.3s;
    margin-top: auto;
  }

  &.collapsed {
    .main-layout-header.fixed {
      width: 100%;
    }

    .tags-nav-container {
      width: 100%;
      transition: all 0.15s ease;
    }

    .main-layout-content {
      margin-left: 104px;
      /* 80px + 24px margin */
      transition: margin 0.15s ease;
    }

    .main-layout-footer {
      margin-left: 80px;
      transition: margin-left 0.15s ease;
    }

    .main-layout-sider {
      width: 80px !important;
      transition: width 0.15s ease !important;
      
      /* 折叠时的滚动条隐藏 */
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
    
    .right-content {
      margin-left: 80px;
    }
  }
}
/* 设置抽屉样式 */
.setting-drawer-content {
  .setting-block {
    margin-bottom: 24px;
    
    .setting-title {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 12px;
      color: rgba(0, 0, 0, 0.85);
      border-bottom: 1px solid #f0f0f0;
      padding-bottom: 8px;
    }
    
    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      
      span {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
</style>
