<template>
  <div class="header-content">
    <!-- 菜单折叠按钮，只在侧边菜单模式下显示 -->
    <template v-if="!isTopMenu">
      <a-button
        class="trigger-btn"
        type="text"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <MenuFoldOutlined v-if="!collapsed" />
        <MenuUnfoldOutlined v-else />
      </a-button>
    </template>
    
    <!-- 右侧功能区 -->
    <div class="action-area">
      <!-- 通知图标 -->
      <div class="action-item notification-wrapper">
        <a-badge dot>
          <BellOutlined />
        </a-badge>
      </div>
      
      <!-- 页面配置按钮 -->
      <div class="action-item config-btn" @click="drawerVisible = true">
        <SettingOutlined />
      </div>
      
      <!-- 用户头像 -->
      <UserAvatar />
    </div>
    
    <!-- 页面配置抽屉 -->
    <a-drawer
      title="页面配置"
      placement="right"
      :visible="drawerVisible"
      @close="drawerVisible = false"
      width="300"
    >
      <!-- 主题模式 -->
      <div class="setting-block">
        <div class="setting-title">主题模式</div>
        <div class="setting-option theme-select">
          <div 
            class="theme-item" 
            :class="{ active: layoutStore.siderTheme === 'light' }"
            @click="setTheme('light')"
          >
            <BgColorsOutlined />
            <div class="theme-text">亮色</div>
          </div>
          <div 
            class="theme-item" 
            :class="{ active: layoutStore.siderTheme === 'dark' }"
            @click="setTheme('dark')"
          >
            <BgColorsOutlined />
            <div class="theme-text">暗色</div>
          </div>
        </div>
      </div>
      
      <!-- 导航布局 -->
      <div class="setting-block">
        <div class="setting-title">导航布局</div>
        <div class="setting-option layout-select">
          <div 
            class="layout-item" 
            :class="{ active: layoutStore.layoutType === 'sider' }"
            @click="setLayoutType('sider')"
          >
            <div class="layout-preview sider-preview"></div>
            <div class="layout-text">侧边菜单</div>
          </div>
          <div 
            class="layout-item" 
            :class="{ active: layoutStore.layoutType === 'top' }"
            @click="setLayoutType('top')"
          >
            <div class="layout-preview top-preview"></div>
            <div class="layout-text">顶部菜单</div>
          </div>
          <div 
            class="layout-item" 
            :class="{ active: layoutStore.layoutType === 'mix' }"
            @click="setLayoutType('mix')"
          >
            <div class="layout-preview mix-preview"></div>
            <div class="layout-text">混合菜单</div>
          </div>
        </div>
      </div>
      
      <!-- 主题色 -->
      <div class="setting-block">
        <div class="setting-title">主题色</div>
        <div class="setting-option color-select">
          <div 
            v-for="color in themeColors" 
            :key="color.value"
            class="color-item" 
            :style="{ backgroundColor: color.value }"
            :class="{ active: layoutStore.primaryColor === color.value }"
            @click="setPrimaryColor(color.value)"
          ></div>
        </div>
      </div>
      
      <!-- 功能开关 -->
      <div class="setting-block">
        <div class="setting-title">界面设置</div>
        <div class="setting-option">
          <a-list :split="false">
            <a-list-item>
              <template #actions>
                <a-switch 
                  :model-value="layoutStore.fixedHeader" 
                  @update:model-value="(checked) => layoutStore.$patch({ fixedHeader: checked })"
                />
              </template>
              <a-list-item-meta title="固定头部" />
            </a-list-item>
            <a-list-item>
              <template #actions>
                <a-switch 
                  :checked="layoutStore.showTabs" 
                  @click="() => layoutStore.showTabs = !layoutStore.showTabs"
                />
              </template>
              <a-list-item-meta title="显示标签栏" />
            </a-list-item>
          </a-list>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BellOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SettingOutlined,
  BgColorsOutlined,
  CheckOutlined
} from '@ant-design/icons-vue';
import UserAvatar from './UserAvatar.vue';
import { useLayoutStore } from '../../store/layout';

export default defineComponent({
  name: 'HeaderContent',
  components: {
    MenuFoldOutlined, 
    MenuUnfoldOutlined, 
    BellOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    SettingOutlined,
    BgColorsOutlined,
    UserAvatar,
    CheckOutlined
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    isTopMenu: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:collapsed'],
  setup(props, { emit }) {
    const layoutStore = useLayoutStore();
    const drawerVisible = ref(false);
    const customColor = ref('#1890ff');

    // 切换侧边栏
    const toggleCollapsed = () => {
      emit('update:collapsed', !props.collapsed);
    };

    // 全屏控制
    const isFullscreen = ref(false);

    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
          console.error('无法进入全屏模式:', e);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    // 全屏事件监听
    const handleFullscreenChange = () => {
      isFullscreen.value = !!document.fullscreenElement;
    };

    onMounted(() => {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    });

    // 面包屑处理
    const route = useRoute();

    interface BreadcrumbItem {
      title: string;
      path?: string;
    }

    const breadcrumbList = computed<BreadcrumbItem[]>(() => {
      const result: BreadcrumbItem[] = [
        { title: '首页', path: '/' }
      ];
      
      // 根据当前路由生成面包屑
      const paths = route.path.split('/').filter(Boolean);
      
      if (paths.length) {
        let currentPath = '';
        
        paths.forEach((path, index) => {
          currentPath += `/${path}`;
          
          // 从route.matched中找到对应的路由信息
          const matchedRoute = route.matched[index];
          
          if (matchedRoute && matchedRoute.meta.title) {
            result.push({
              title: matchedRoute.meta.title as string,
              path: index === paths.length - 1 ? undefined : currentPath
            });
          }
        });
      }
      
      return result;
    });

    // 主题颜色列表
    const themeColors = [
      { name: '拂晓蓝', value: '#1890ff' },
      { name: '薄暮红', value: '#f5222d' },
      { name: '火山橙', value: '#fa541c' },
      { name: '日暮黄', value: '#faad14' },
      { name: '青柠绿', value: '#52c41a' },
      { name: '极光绿', value: '#13c2c2' },
      { name: '酱紫', value: '#722ed1' }
    ];

    // 设置主题
    const setTheme = (theme: 'light' | 'dark') => {
      layoutStore.$patch({ siderTheme: theme });
    };

    // 设置布局类型
    const setLayoutType = (type: 'sider' | 'top' | 'mix') => {
      layoutStore.$patch({ layoutType: type });
    };

    // 设置主题色
    const setPrimaryColor = (color: string) => {
      layoutStore.$patch({ primaryColor: color });
      customColor.value = color;
      
      // 更新CSS变量
      document.documentElement.style.setProperty('--ant-primary-color', color);
    };

    return {
      toggleCollapsed,
      isFullscreen,
      toggleFullscreen,
      breadcrumbList,
      drawerVisible,
      layoutStore,
      themeColors,
      customColor,
      setTheme,
      setLayoutType,
      setPrimaryColor
    };
  }
});
</script>

<style lang="scss" scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  
  .trigger-btn {
    font-size: 18px;
    padding: 0 24px;
    height: 64px;
    line-height: 64px;
    cursor: pointer;
    transition: color 0.3s;
    display: inline-flex;
    align-items: center;
    
    &:hover {
      color: #1890ff;
    }
  }
  
  .action-area {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: auto;
  }
  
  .action-item {
    padding: 0 12px;
    cursor: pointer;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  
  .notification-wrapper {
    position: relative;
    
    :deep(.ant-badge-dot) {
      position: absolute;
      top: -2px;
      right: 0px;
      height: 6px;
      width: 6px;
      box-shadow: 0 0 0 1.5px #fff;
      animation: badge-breathe 1.2s ease-in-out infinite;
    }
    
    &:hover :deep(.ant-badge-dot) {
      background: #ff4d4f;
      box-shadow: 0 0 0 1.5px #ff7875;
    }
  }
  
  @keyframes badge-breathe {
    0% { transform: scale(0.95); }
    50% { transform: scale(1.1); }
    100% { transform: scale(0.95); }
  }
  
  :deep(.ant-avatar) {
    margin-left: 12px;
    cursor: pointer;
    background: #1890ff;
    
    &:hover {
      opacity: 0.85;
    }
  }
}

/* 抽屉样式 */
.setting-block {
  margin-bottom: 24px;
  
  .setting-title {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
    font-weight: 500;
  }
  
  .setting-option {
    margin-bottom: 24px;
  }
  
  /* 主题选择 */
  .theme-select {
    display: flex;
    gap: 16px;
    
    .theme-item {
      flex: 1;
      text-align: center;
      cursor: pointer;
      height: 44px;
      background: #f0f2f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      position: relative;
      
      &.active {
        border: 1px solid #1890ff;
      }
      
      .theme-text {
        margin-left: 8px;
      }
    }
  }
  
  /* 布局选择 */
  .layout-select {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    
    .layout-item {
      flex-basis: calc(33% - 11px);
      cursor: pointer;
      text-align: center;
      
      &.active .layout-preview {
        border: 1px solid #1890ff;
      }
      
      .layout-preview {
        height: 64px;
        margin-bottom: 8px;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
        position: relative;
        overflow: hidden;
      }
      
      .layout-text {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }
      
      .sider-preview {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 100%;
          background: #001529;
        }
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 30%;
          width: 70%;
          height: 20%;
          background: #fff;
          border-bottom: 1px solid #f0f0f0;
        }
      }
      
      .top-preview {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 20%;
          background: #001529;
        }
      }
      
      .mix-preview {
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 20%;
          background: #001529;
        }
        
        &::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 0;
          width: 30%;
          height: 80%;
          background: #f0f2f5;
        }
      }
    }
  }
  
  /* 颜色选择 */
  .color-select {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .color-item {
      width: 20px;
      height: 20px;
      cursor: pointer;
      border-radius: 2px;
      
      &.active {
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px currentColor;
      }
    }
  }
}
</style>
