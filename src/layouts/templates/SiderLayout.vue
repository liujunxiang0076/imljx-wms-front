<template>
  <!-- 布局容器 -->
  <a-layout class="main-layout" :class="{ collapsed: collapsed }">
    <!-- 顶部导航 -->
    <a-layout-header
      class="main-layout-header"
      :class="{ fixed: layoutStore.fixedHeader }"
    >
      <!-- 顶部内容区 -->
      <div class="header-content">
        <div class="header-left">
          <img
            :src="config.system.systemLogo"
            alt="IMLJX"
            class="company-logo"
          />
          <div class="system-title">{{ config.system.systemName }}</div>
        </div>
        <!-- 菜单按钮 -->
        <div class="header-middle">
          <a-space size="small">
            <!-- 将菜单按钮放在文字后面 -->
            <a-button
              type="text"
              class="trigger-btn"
              @click="toggleCollapsed"
              size="small"
            >
              <menu-unfold-outlined style="font-size: 18px" v-if="collapsed" />
              <menu-fold-outlined style="font-size: 18px" v-else />
            </a-button>
            <a-button
              type="text"
              class="trigger-btn"
              size="small"
              @click="reloadPage"
              title="刷新当前页面"
            >
              <ReloadOutlined style="font-size: 18px" />
            </a-button>
          </a-space>
          <!-- 搜索框 -->
          <div class="search-container">
            <div class="custom-search-wrapper">
              <input 
                type="text" 
                class="custom-search-input" 
                placeholder="搜索功能、命令或文档..." 
                v-model="searchValue"
                @keyup.enter="handleSearch"
              />
              <button class="custom-search-button" @click="handleSearch">
                <svg viewBox="64 64 896 896" data-icon="search" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                  <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- 右侧功能区 -->
        <div class="header-right">
          <a-space size="middle">
            <!-- 通知器 -->
            <NotificationDropdown 
              useButton
              badgeSize="small"
              :count="5"
              menuWidth="200px"
            />

            <!-- 设置按钮 - 打开抽屉 -->
            <a-button
              type="text"
              shape="circle"
              class="setting-btn"
              @click="showSettingDrawer = true"
            >
              <template #icon
                ><setting-outlined style="font-size: 16px"
              /></template>
            </a-button>

            <!-- 用户个人信息 -->
            <UserAvatar class="header-avatar" />
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <!-- 中间内容区 -->
    <a-layout>
      <!-- 侧边栏 -->
      <a-layout-sider
        v-model:collapsed="collapsed"
        :theme="layoutStore.siderTheme"
        :trigger="null"
        collapsible
        class="main-layout-sider"
        width="256"
      >
        <!-- Logo -->
        <div class="sider-container">
          <!-- 侧边菜单 -->
          <SideMenu :collapsed="collapsed" :theme="layoutStore.siderTheme" />
        </div>
      </a-layout-sider>

      <!-- 右侧内容 -->
      <a-layout class="right-content" :class="{ 'show-tabs': layoutStore.showTabs }">
        <!-- 标签页 - 顶部固定位置 -->
        <div v-if="layoutStore.showTabs" class="tabs-nav-container">
          <div class="tabs-nav-content">
            <TabsNav />
          </div>
        </div>
        
        <!-- 内容滚动区域 -->
        <div class="content-scroll">
          <!-- 主内容区 -->
          <a-layout-content class="main-layout-content">
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
        </div>
      </a-layout>
    </a-layout>
  </a-layout>

  <!-- 引入设置抽屉组件 -->
  <SettingDrawer v-model:visible="showSettingDrawer" />
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, onMounted, defineAsyncComponent } from 'vue';
import type { Ref } from 'vue';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined, 
  SettingOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useLayoutStore } from '@/store/layout';
import config from '@/config';
import TabsNav from '@/layouts/components/TabsNav.vue';
import SideMenu from '@/layouts/components/SideMenu.vue';
import UserAvatar from '@/layouts/components/UserAvatar.vue';
import NotificationDropdown from '@/layouts/components/NotificationDropdown.vue';

// 动态导入SettingDrawer组件
const SettingDrawer = defineAsyncComponent(() => import("../components/SettingDrawer.vue"));

// 状态管理
const layoutStore = useLayoutStore();

// 响应式变量
const collapsed: Ref<boolean> = ref(false);
const searchValue: Ref<string> = ref('');
const showSettingDrawer: Ref<boolean> = ref(false);

// 监听布局store中的菜单折叠状态变化
watch(() => layoutStore.collapsed, (newVal) => {
  collapsed.value = newVal;
});

// 初始化从localStorage获取折叠状态
onMounted(() => {
  const savedCollapsed = localStorage.getItem('sider-collapsed');
  collapsed.value = savedCollapsed === 'true';
  window.addEventListener('resize', handleResize);
});

// 组件卸载前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// 切换侧边栏折叠状态
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  layoutStore.setCollapsed(collapsed.value);
  localStorage.setItem('sider-collapsed', String(collapsed.value));
};

// 监听窗口大小变化
const handleResize = () => {
  if (window.innerWidth < 992 && !collapsed.value) {
    collapsed.value = true;
  }
};

// 处理搜索
const handleSearch = () => {
  if (!searchValue.value) {
    message.warning('请输入搜索内容');
    return;
  }
  message.info('功能开发中...');
};

// 刷新页面
const reloadPage = () => {
  window.location.reload();
};

defineExpose({
  showSettingDrawer,
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
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 10;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
    overflow-y: overlay !important;

    /* 深色主题样式 */
    &.ant-layout-sider-dark {
      background-color: #001529;

      .sider-container {
        :deep(.ant-menu) {
          background: linear-gradient(180deg, #001529 0%, #00213d 100%);
          
          .ant-menu-item {
            color: rgba(255, 255, 255, 0.75);
            
            &:hover {
              color: #fff;
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            }
            
            &.ant-menu-item-selected {
              color: #fff;
              background: linear-gradient(90deg, rgba(24, 144, 255, 0.1), transparent) !important;
              border-left: 3px solid #1890ff;
              
              &::before {
                background: #1890ff;
              }
            }
          }
          
          .ant-menu-submenu {
            &-title {
              color: rgba(255, 255, 255, 0.85);
              
              &::after {
                background: rgba(255, 255, 255, 0.3);
              }
            }
            
            &-arrow {
              color: rgba(255, 255, 255, 0.45);
            }
            
            &-open > .ant-menu-submenu-title {
              color: #fff;
              
              .ant-menu-submenu-arrow {
                color: rgba(255, 255, 255, 0.85);
              }
            }
          }
        }
      }

      /* 深色主题滚动条 */
      &:hover {
        &::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          
          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }
    }

    /* 浅色主题样式 */
    &.ant-layout-sider-light {
      background-color: #fff;
      border-right: 1px solid #f0f0f0;

      .sider-container {
        :deep(.ant-menu) {
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          
          .ant-menu-item {
            color: rgba(0, 0, 0, 0.65);
            
            &:hover {
              color: #1890ff;
              text-shadow: 0 0 10px rgba(24, 144, 255, 0.1);
            }
            
            &.ant-menu-item-selected {
              color: #1890ff;
              background: linear-gradient(90deg, rgba(24, 144, 255, 0.05), transparent) !important;
              border-left: 3px solid #1890ff;
              
              &::before {
                background: #1890ff;
              }
            }
          }
          
          .ant-menu-submenu {
            &-title {
              color: rgba(0, 0, 0, 0.85);
              
              &::after {
                background: rgba(0, 0, 0, 0.15);
              }
            }
            
            &-arrow {
              color: rgba(0, 0, 0, 0.45);
            }
            
            &-open > .ant-menu-submenu-title {
              color: #1890ff;
              
              .ant-menu-submenu-arrow {
                color: #1890ff;
              }
            }
          }

          /* 浅色主题子菜单项样式 */
          .ant-menu-sub.ant-menu-inline {
            .ant-menu-item {
              &::before {
                background: rgba(0, 0, 0, 0.06);
              }
            }
          }
        }
      }

      /* 浅色主题滚动条 */
      &:hover {
        &::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
        }
      }
    }

    .sider-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      width: 256px;
      box-sizing: content-box;
      padding-right: 0;

      /* 菜单容器基础样式 */
      :deep(.ant-menu) {
        flex: 1;
        border-right: none;
        width: 256px !important;
        transition: all 0.3s;
        
        /* 菜单项基础样式 */
        .ant-menu-item, .ant-menu-submenu-title {
          height: 48px;
          line-height: 48px;
          margin: 4px 0;
          padding: 0 24px !important;
          width: 256px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          
          &:hover {
            background: transparent !important;
          }
        }

        /* 子菜单展开动画 */
        .ant-menu-sub.ant-menu-inline {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* 子菜单项样式 */
        .ant-menu-sub.ant-menu-inline {
          .ant-menu-item {
            height: 40px;
            line-height: 40px;
            padding-left: 48px !important;
            font-size: 13px;
          }
        }
      }
    }
  }

  &-header {
    background: #fff;
    padding: 0;
    height: 60px;
    line-height: 60px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 11;
    /* 增大层级，确保始终在最上层 */
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
      justify-content: space-between;
      /* 添加两端对齐 */
      height: 100%;
      padding: 0 16px;

      .header-left {
        width: 240px;
        display: flex;
        align-items: center;
        overflow: hidden;
      }

      // 中间区域
      .header-middle {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex: 1;
        overflow: hidden;
        margin-right: 50px;

        .trigger-btn {
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

        // 搜索框容器
        .search-container {
          display: flex;
          align-items: center;
          margin-left: 12px;

          .custom-search-wrapper {
            display: flex;
            width: 280px;
            height: 32px;
            border-radius: 4px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
            transition: all 0.3s;

            &:hover, &:focus-within {
              border-color: #40a9ff;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.08);
            }

            .custom-search-input {
              flex: 1;
              height: 100%;
              padding: 0 11px;
              border: none;
              outline: none;
              font-size: 14px;
              background: #fff;
              color: rgba(0, 0, 0, 0.85);
              line-height: 32px; /* 确保高度一致 */
              display: block;
              box-sizing: border-box;

              &::placeholder {
                color: rgba(0, 0, 0, 0.35);
                line-height: 32px; /* 确保文字居中 */
              }
            }

            .custom-search-button {
              width: 36px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #fafafa;
              border: none;
              outline: none;
              cursor: pointer;
              color: rgba(0, 0, 0, 0.45);
              transition: all 0.3s;
              border-left: 1px solid #f0f0f0;

              &:hover {
                background: #e6f7ff;
                color: #40a9ff;
              }

              svg {
                width: 16px;
                height: 16px;
              }
            }
          }

          /* 移除原来的样式 */
          .global-search {
            display: none;
          }
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

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

        .notification-btn,
        .setting-btn {
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

  /* 标签栏样式 */
  .tabs-nav-container {
    width: 100%;
    height: 40px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    overflow: visible;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    z-index: 9;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    padding-left: 256px;

    .tabs-nav-content {
      display: flex;
      align-items: center;
      width: 100%;
      position: relative;
      height: 40px;
      background: #fff;
      padding: 0 16px;
      overflow-x: auto;
      white-space: nowrap;
      
      /* 隐藏水平滚动条，但允许滚动 */
      &::-webkit-scrollbar {
        height: 0;
        display: none;
      }
      scrollbar-width: none; /* Firefox */
    }
  }

  .right-content {
    margin-left: 256px;
    transition: margin-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 60px; /* header高度 */
    
    &.show-tabs {
      padding-top: 100px; /* header + tabs高度 */
    }
  }

  /* 内容滚动区域 */
  .content-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100vh - 60px); /* 减去header高度 */
    
    .show-tabs & {
      height: calc(100vh - 100px); /* 减去header和tabs高度 */
    }

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
  }

  &-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  .main-content-container {
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    position: relative;
  }

  &-footer {
    text-align: center;
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    margin: 0 24px 24px;
  }

  &.collapsed {
    .tabs-nav-container {
      padding-left: 80px;
      transition: padding-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    
    .right-content {
      margin-left: 80px;
      transition: margin-left 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .main-layout-sider {
      width: 80px !important;
      
      .sider-container {
        width: 80px;
        
        :deep(.ant-menu) {
          width: 80px !important;
          
          .ant-menu-item, .ant-menu-submenu-title {
            width: 80px !important;
          }
        }
      }
    }
  }

  // 头部用户头像
  :deep(.header-avatar) {
    display: flex;
    align-items: center;
    height: 40px;
  }
}
</style>

