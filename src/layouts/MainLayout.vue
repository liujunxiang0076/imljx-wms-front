<template>
  <div class="main-layout">
    <a-layout style="min-height: 100vh">
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo">
          <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="Logo" />
          <h1 v-show="!collapsed">IMLJX WMS</h1>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="inline"
        >
          <a-menu-item key="1">
            <template #icon>
              <DashboardOutlined />
            </template>
            <span>仪表盘</span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #icon>
              <InboxOutlined />
            </template>
            <template #title>仓库管理</template>
            <a-menu-item key="3">入库管理</a-menu-item>
            <a-menu-item key="4">出库管理</a-menu-item>
            <a-menu-item key="5">库存管理</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <div class="header-container">
            <span class="trigger" @click="collapsed = !collapsed">
              <MenuFoldOutlined v-if="!collapsed" />
              <MenuUnfoldOutlined v-else />
            </span>
            <div class="header-right">
              <a-dropdown>
                <a class="user-dropdown">
                  管理员 <DownOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="0">
                      <UserOutlined />
                      个人中心
                    </a-menu-item>
                    <a-menu-item key="1">
                      <SettingOutlined />
                      系统设置
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="3">
                      <LogoutOutlined />
                      退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content style="margin: 16px">
          <div style="padding: 24px; background: #fff; min-height: 360px">
            <router-view></router-view>
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          IMLJX WMS ©2024 Created by IMLJX Team
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  InboxOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined
} from '@ant-design/icons-vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    InboxOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    DownOutlined
  },
  setup() {
    const collapsed = ref(false);
    const selectedKeys = ref(['1']);

    return {
      collapsed,
      selectedKeys
    };
  }
});
</script>

<style lang="scss" scoped>
.main-layout {
  .logo {
    height: 32px;
    margin: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
      height: 32px;
      margin-right: 8px;
    }

    h1 {
      color: white;
      font-size: 18px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 100%;

    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .header-right {
      .user-dropdown {
        color: rgba(0, 0, 0, 0.65);
        padding: 0 12px;
        display: inline-block;
        
        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}
</style> 
