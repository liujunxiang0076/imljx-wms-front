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
          <a-menu mode="horizontal" :theme="layoutStore.headerTheme" :selectedKeys="selectedKeys" :openKeys="openKeys"
            class="top-menu">
            <!-- 显示前4个一级菜单 -->
            <template v-for="menu in visibleMenuItems" :key="menu.key">
              <!-- 无子菜单的一级菜单 -->
              <a-menu-item v-if="!menu.children || menu.children.length === 0" :key="`item-${menu.key}`">
                <router-link :to="menu.path">
                  <component :is="getIcon(menu.icon)" v-if="menu.icon" />
                  <span>{{ menu.title }}</span>
                </router-link>
              </a-menu-item>

              <!-- 有子菜单的一级菜单 -->
              <a-sub-menu v-else :key="`sub-${menu.key}`">
                <template #title>
                  <component :is="getIcon(menu.icon)" v-if="menu.icon" />
                  <span>{{ menu.title }}</span>
                </template>
                <a-menu-item v-for="subMenu in menu.children" :key="subMenu.key">
                  <router-link :to="subMenu.path">
                    <span>{{ subMenu.title }}</span>
                  </router-link>
                </a-menu-item>
              </a-sub-menu>
            </template>

            <!-- "更多"下拉菜单，当菜单项超过4个时显示 -->
            <a-sub-menu v-if="moreMenuItems.length > 0" key="more-menu">
              <template #title>
                <EllipsisOutlined />
                <span>更多</span>
              </template>

              <!-- 遍历更多的一级菜单 -->
              <template v-for="menu in moreMenuItems" :key="menu.key">
                <!-- 无子菜单的一级菜单 -->
                <a-menu-item v-if="!menu.children || menu.children.length === 0" :key="`more-item-${menu.key}`">
                  <router-link :to="menu.path">
                    <component :is="getIcon(menu.icon)" v-if="menu.icon" />
                    <span>{{ menu.title }}</span>
                  </router-link>
                </a-menu-item>

                <!-- 有子菜单的一级菜单，转为分组 -->
                <a-sub-menu v-else :key="`more-sub-${menu.key}`">
                  <template #title>
                    <component :is="getIcon(menu.icon)" v-if="menu.icon" />
                    <span>{{ menu.title }}</span>
                  </template>
                  <a-menu-item v-for="subMenu in menu.children" :key="subMenu.key">
                    <router-link :to="subMenu.path">
                      <span>{{ subMenu.title }}</span>
                    </router-link>
                  </a-menu-item>
                </a-sub-menu>
              </template>
            </a-sub-menu>
          </a-menu>
        </div>

        <!-- 右侧操作区 -->
        <div class="header-right">
          <!-- 搜索框 -->
          <div class="custom-search-wrapper">
            <a-input v-model:value="searchValue" class="custom-search-input" placeholder="搜索功能、命令或文档..."
              @pressEnter="handleSearch" :bordered="false">
              <template #suffix>
                <a-button type="text" class="custom-search-button" @click="handleSearch">
                  <template #icon>
                    <SearchOutlined />
                  </template>
                </a-button>
              </template>
            </a-input>
          </div>

          <a-space size="middle">
            <!-- 通知器 -->
            <a-dropdown placement="bottomRight">
              <div class="notification-icon-wrapper">
                <a-badge count="5" class="notification-badge">
                  <BellOutlined style="font-size: 16px" />
                </a-badge>
              </div>
              <template #overlay>
                <a-menu style="width: 240px">
                  <a-menu-item key="notification-title" style="text-align: center; cursor: default; font-weight: 500;">
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

            <!-- 设置按钮 -->
            <a-button type="text" shape="circle" class="setting-btn" @click="showSettingDrawer = true">
              <template #icon>
                <SettingOutlined style="font-size: 16px" />
              </template>
            </a-button>

            <!-- 用户个人信息 -->
            <UserAvatar class="header-avatar" />
          </a-space>
        </div>
      </div>
    </a-layout-header>

    <!-- 标签页 -->
    <a-layout-content v-if="layoutStore.showTabs" class="tags-nav-container">
      <TabsNav />
    </a-layout-content>

    <!-- 内容区 -->
    <a-layout-content class="top-layout-content" :class="{
      'fixed-header': layoutStore.fixedHeader,
      'show-tabs': layoutStore.showTabs
    }">
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

    <!-- 设置抽屉 -->
    <SettingDrawer v-model:visible="showSettingDrawer" />

  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useLayoutStore } from '@/store/layout';
import { useRoute } from 'vue-router';
import {
  DashboardOutlined,
  AppstoreOutlined,
  InboxOutlined,
  ExportOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  EllipsisOutlined,
  ShopOutlined,
  TeamOutlined,
  SearchOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import UserAvatar from '@/layouts/components/UserAvatar.vue';

// 引入TabsNav组件
const TabsNav = defineAsyncComponent(() => import('@/layouts/components/TabsNav.vue'));

// 动态导入SettingDrawer组件
const SettingDrawer = defineAsyncComponent(() =>
  import('@/layouts/components/SettingDrawer.vue')
);

// 布局状态管理
const layoutStore = useLayoutStore();
const route = useRoute();

// 定义searchValue变量
const searchValue = ref('');

// 菜单配置 - 这里模拟菜单数据，实际应从配置或接口获取
const menuItems = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    path: '/dashboard'
  },
  {
    key: 'inventory',
    title: '库存管理',
    icon: 'InboxOutlined',
    path: '/inventory',
    children: [
      {
        key: 'inventory-list',
        title: '库存列表',
        path: '/inventory/list'
      },
      {
        key: 'inventory-check',
        title: '库存盘点',
        path: '/inventory/check'
      }
    ]
  },
  // ... 其他菜单项
];

// 显示的菜单项（前4个）
const visibleMenuItems = computed(() => menuItems.slice(0, 4));

// 更多菜单项
const moreMenuItems = computed(() => menuItems.slice(4));

// 当前选中的菜单项
const selectedKeys = computed(() => {
  const path = route.path;
  return [path];
});

// 展开的子菜单
const openKeys = ref<string[]>([]);

// 获取图标组件
const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    DashboardOutlined,
    AppstoreOutlined,
    InboxOutlined,
    ExportOutlined,
    BarChartOutlined,
    SettingOutlined,
    ShopOutlined,
    TeamOutlined
  };
  return icons[iconName];
};

onMounted(() => {
  // 在移动设备上调整布局
  if (window.innerWidth < 768) {
    layoutStore.collapsed = true;
  }
});

// 搜索功能
const handleSearch = () => {
  if (!searchValue.value.trim()) return;
  message.info(`搜索: ${searchValue.value}`);
  // TODO: 实现搜索功能
};

// 设置抽屉显示状态
const showSettingDrawer = ref(false);

defineExpose({
  showSettingDrawer: ref(false)
});
</script>

<style lang="scss" scoped>
// 顶部布局
.top-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  // 顶部布局头部
  &-header {
    background: #fff;
    padding: 0 !important;
    height: 64px;
    line-height: 64px;
    box-shadow: 0 2px 8px rgba(0, 21, 41, 0.08);
    position: relative;
    z-index: 9;

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
      padding: 0 16px;
      height: 100%;
    }

    // 头部logo
    .logo-container {
      display: flex;
      align-items: center;
      margin-right: 24px;

      // logo图片
      .logo-img {
        height: 32px;
        width: auto;
      }

      // logo标题
      .logo-title {
        margin: 0 0 0 12px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size: 18px;
        white-space: nowrap;
        background-image: linear-gradient(90deg, #1890ff, #3a77ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }

    // 顶部菜单
    .top-menu-container {
      flex: 1;
      overflow-x: auto;

      // 顶部菜单滚动条
      &::-webkit-scrollbar {
        display: none;
      }

      // 顶部菜单
      .top-menu {
        line-height: 64px;
        border-bottom: none;

        // 顶部菜单项
        :deep(.ant-menu-item) {
          padding: 0 16px;
          transition: all 0.3s;

          &:hover {
            color: #1890ff;
          }

          // 顶部菜单项下划线
          &::after {
            left: 16px;
            right: 16px;
          }

          &.ant-menu-item-selected {
            font-weight: 500;
          }
        }

        // 顶部菜单子菜单
        :deep(.ant-menu-submenu-title) {
          padding: 0 16px;
          transition: all 0.3s;

          &:hover {
            color: #1890ff;
          }
        }

        // 顶部菜单子菜单下划线
        :deep(.ant-menu-submenu) {
          &::after {
            left: 16px;
            right: 16px;
          }

          &.ant-menu-submenu-selected {
            font-weight: 500;
          }
        }
      }
    }

    // 头部右侧操作区
    .header-right {
      display: flex;
      align-items: center;
      height: 100%;

      .notification-icon-wrapper {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 0 4px;
      }

      .notification-badge {
        cursor: pointer;
      }

      // 设置头像组件样式
      :deep(.header-avatar) {
        display: flex;
        align-items: center;
        height: 40px;
      }

      .user-dropdown-btn {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
          background-color: rgba(0, 0, 0, 0.025);
        }

        .ant-avatar {
          margin-right: 8px;
        }

        .username {
          margin-right: 4px;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  // 标签页
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

  // 内容区
  &-content {
    flex: 1;
    padding: 24px;
    margin: 24px;
    background: #fff;
    border-radius: 2px;

    // 固定头部
    &.fixed-header {
      margin-top: 88px;
    }

    // 显示标签页
    &.show-tabs {
      margin-top: 128px;
    }
  }

  // 内容容器
  .content-container {
    min-height: calc(100vh - 64px - 48px - 70px);
  }

  // 页脚
  &-footer {
    text-align: center;
    padding: 14px 50px;
    background: #f0f2f5;
  }
}

// 自定义搜索框样式
.custom-search-wrapper {
  position: relative;
  width: 180px;
  height: 32px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 16px;
  transition: all 0.3s;
  margin-right: 16px;

  &:hover {
    background-color: #e8e8e8;
  }

  .custom-search-input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    padding: 0 40px 0 16px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);

    &::placeholder {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .custom-search-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    transition: color 0.3s;
    padding: 0;
    outline: none;

    &:hover {
      color: var(--primary-color);
    }
  }
}

/* 设置抽屉样式 */
.system-setting-drawer {
  :deep(.ant-drawer-content-wrapper) {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  }

  :deep(.ant-drawer-header) {
    transition: all 0.3s;
    border-radius: 0;

    .ant-drawer-title {
      font-weight: 500;
      font-size: 16px;
      color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
    }

    .ant-drawer-close {
      color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');

      &:hover {
        color: v-bind('layoutStore.siderTheme === "dark" ? "white" : "rgba(0, 0, 0, 0.85)"');
      }
    }
  }

  :deep(.ant-drawer-body) {
    padding: 20px;
  }

  .setting-block {
    margin-bottom: 28px;
    animation: fadeIn 0.3s ease-in-out;

    .setting-title {
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 18px;
      color: rgba(0, 0, 0, 0.85);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -8px;
        width: 24px;
        height: 2px;
        background-color: #1890ff;
        border-radius: 1px;
      }
    }

    .setting-content {
      margin-bottom: 12px;

      &.theme-color-content {
        padding: 0 8px;
      }
    }

    /* 主题色容器 */
    .theme-color-grid-container {
      background-color: #fafafa;
      border-radius: 4px;
      padding: 8px 10px;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    /* 主题模式卡片 */
    .theme-cards {
      display: flex;
      gap: 12px;

      .theme-card {
        flex: 1;
        height: 40px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        gap: 8px;
        transition: all 0.2s;

        span {
          font-size: 13px;
          color: rgba(0, 0, 0, 0.65);
        }

        &:hover {
          border-color: #40a9ff;
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.1);
        }

        &.active {
          border: 1px solid #1890ff;
          background-color: rgba(24, 144, 255, 0.05);
          position: relative;

          &::after {
            content: '';
            position: absolute;
            right: 4px;
            top: 4px;
            width: 4px;
            height: 4px;
            background-color: #1890ff;
            border-radius: 50%;
          }
        }

        svg {
          color: #000;
        }

        &.dark-card {
          background-color: #141414;
          border-color: #303030;

          svg,
          span {
            color: #fff;
          }

          &:hover {
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          }
        }
      }
    }

    /* 布局网格 */
    .layout-grid {
      margin-top: 16px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .layout-item {
        cursor: pointer;
        border-radius: 2px;
        padding: 6px;
        border: 1px solid #f0f0f0;
        transition: all 0.2s;

        &:hover {
          border-color: #40a9ff;
          box-shadow: 0 1px 6px rgba(24, 144, 255, 0.08);
        }

        &.active {
          border: 1px solid #1890ff;
          background-color: rgba(24, 144, 255, 0.04);
        }

        .layout-preview {
          height: 40px;
          border-radius: 2px;
          position: relative;
          background: #f5f5f5;
          margin-bottom: 6px;
        }

        .layout-name {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.65);
          text-align: center;
        }

        .sider-layout::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 20%;
          height: 100%;
          background: #001529;
        }

        .top-layout::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 20%;
          background: #001529;
        }

        .mix-layout {
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 20%;
            background: #001529;
          }

          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 20%;
            width: 20%;
            height: 80%;
            background: #fff;
            border-right: 1px solid #f0f0f0;
          }
        }

        .mix-right-layout {
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 20%;
            background: #001529;
          }

          &::after {
            content: '';
            position: absolute;
            right: 0;
            top: 20%;
            width: 20%;
            height: 80%;
            background: #fff;
            border-left: 1px solid #f0f0f0;
          }
        }
      }
    }

    /* 颜色网格 */
    .color-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
      margin-bottom: 6px;
      padding: 4px 0;

      .color-item {
        width: 100%;
        aspect-ratio: 1;
        max-width: 26px;
        max-height: 26px;
        margin: 0 auto;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        &.active::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          border: 1.5px solid white;
          border-radius: 50%;
          background-color: transparent;
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        }

        &.color-picker {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          border: 1px dashed #d9d9d9;

          .color-picker-icon {
            color: rgba(0, 0, 0, 0.45);
            font-size: 12px;
          }

          &:hover .color-picker-icon {
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }
    }

    .color-preview-tooltip {
      font-size: 12px;
      margin-top: 4px;
      color: rgba(0, 0, 0, 0.65);
      display: flex;
      align-items: center;
      gap: 4px;

      .color-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: inline-block;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
    }

    /* 开关列表 */
    .switch-list {
      .switch-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f5f5f5;

        &:last-child {
          border-bottom: none;
        }

        .switch-info {
          display: flex;
          flex-direction: column;

          .switch-label {
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            margin-bottom: 4px;
          }

          .switch-desc {
            color: rgba(0, 0, 0, 0.45);
            font-size: 12px;
          }
        }
      }
    }
  }

  .setting-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    text-align: center;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* 自定义颜色选择器样式 */
.custom-color-picker {
  padding: 8px 0;

  .color-input-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    span {
      margin-right: 8px;
      white-space: nowrap;
    }
  }

  .color-preview-row {
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    span {
      margin-right: 8px;
    }

    .color-preview-box {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
    }
  }

  .color-error {
    color: #f5222d;
    font-size: 12px;
    margin-bottom: 16px;
  }

  .suggested-colors {
    margin-bottom: 20px;

    .suggested-title {
      font-size: 14px;
      margin-bottom: 8px;
      color: rgba(0, 0, 0, 0.85);
    }

    .suggested-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 8px;

      .suggested-item {
        aspect-ratio: 1;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

/* 调整响应式 */
@media (max-width: 576px) {
  .system-setting-drawer {
    .layout-grid {
      grid-template-columns: 1fr;
    }
  }

  .top-layout {
    &-header {
      .header-container {
        padding: 0 8px;
      }

      .logo-title {
        display: none;
      }

      .header-right {
        .username {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .top-layout {
    &-header {
      .top-menu-container {
        .top-menu {

          .ant-menu-item,
          .ant-menu-submenu-title {
            padding: 0 10px;
          }
        }
      }
    }
  }
}
</style>

<!-- 全局样式，不使用scoped -->
<style lang="scss">
/* 暗色主题下抽屉强制白色文字 */
body.dark-theme {
  .ant-drawer .ant-drawer-header {
    background-color: #001529 !important;
  }

  .ant-drawer .ant-drawer-title {
    color: white !important;
  }

  .ant-drawer .ant-drawer-close {
    color: white !important;

    &:hover {
      color: rgba(255, 255, 255, 0.85) !important;
    }
  }
}

/* 亮色主题下抽屉文字颜色 */
body.light-theme {
  .ant-drawer .ant-drawer-header {
    background-color: #f0f2f5 !important;
  }

  .ant-drawer .ant-drawer-title {
    color: rgba(0, 0, 0, 0.85) !important;
  }

  .ant-drawer .ant-drawer-close {
    color: rgba(0, 0, 0, 0.85) !important;

    &:hover {
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
}

/* 设置顶部布局图标样式 */
.top-layout {
  .header-right {
    .ant-badge {
      display: flex;

      .ant-badge-count {
        box-shadow: 0 0 0 1px #fff;
        font-size: 12px;
        height: 16px;
        line-height: 16px;
        padding: 0 4px;
        min-width: 16px;
      }
    }
  }
}

/* 调整响应式 */
@media (max-width: 576px) {
  .system-setting-drawer {
    .layout-grid {
      grid-template-columns: 1fr;
    }
  }

  .top-layout {
    &-header {
      .header-container {
        padding: 0 8px;
      }

      .logo-title {
        display: none;
      }

      .header-right {
        .username {
          display: none;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .top-layout {
    &-header {
      .top-menu-container {
        .top-menu {

          .ant-menu-item,
          .ant-menu-submenu-title {
            padding: 0 10px;
          }
        }
      }
    }
  }
}
</style>
