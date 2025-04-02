<template>
  <div class="header-content">
    <div class="header-left">
      <!-- 折叠按钮 -->
      <span class="trigger" @click="toggleCollapsed">
        <MenuFoldOutlined v-if="collapsed" />
        <MenuUnfoldOutlined v-else />
      </span>
      
      <!-- 面包屑导航 -->
      <a-breadcrumb class="breadcrumb">
        <a-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
          <router-link v-if="item.path && index < breadcrumbList.length - 1" :to="item.path">
            {{ item.title }}
          </router-link>
          <span v-else>{{ item.title }}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    
    <div class="header-right">
      <!-- 消息通知 -->
      <div class="header-icon notification-wrapper">
        <a-badge dot>
          <BellOutlined style="font-size: 16px;" />
        </a-badge>
      </div>
      
      <!-- 全屏切换 -->
      <span class="header-icon" @click="toggleFullscreen">
        <FullscreenOutlined v-if="!isFullscreen" style="font-size: 16px;" />
        <FullscreenExitOutlined v-else style="font-size: 16px;" />
      </span>
      
      <!-- 设置按钮 -->
      <span class="header-icon" @click="showSettings = true">
        <SettingOutlined style="font-size: 16px;" />
      </span>
      
      <!-- 用户头像 -->
      <UserAvatar />

      <!-- 页面设置抽屉 -->
      <a-drawer
        title="页面配置"
        :visible="showSettings"
        placement="right"
        width="300"
        @close="showSettings = false"
      >
        <div class="settings-content">
          <div class="settings-section">
            <h3>主题模式</h3>
            <div class="theme-select">
              <div 
                class="theme-item light-theme" 
                :class="{ active: layoutStore.siderTheme === 'light' }"
                @click="setTheme('light')"
              >
                <div class="theme-preview">
                  <BgColorsOutlined />
                </div>
                <span>亮色</span>
              </div>
              <div 
                class="theme-item dark-theme" 
                :class="{ active: layoutStore.siderTheme === 'dark' }"
                @click="setTheme('dark')"
              >
                <div class="theme-preview">
                  <BgColorsOutlined />
                </div>
                <span>暗色</span>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>导航布局</h3>
            <div class="layout-select">
              <div 
                class="layout-item" 
                :class="{ active: layoutStore.layoutType === 'sider' }"
                @click="setLayoutType('sider')"
              >
                <div class="layout-preview side-layout-preview"></div>
                <span>侧边菜单</span>
              </div>
              <div 
                class="layout-item" 
                :class="{ active: layoutStore.layoutType === 'top' }"
                @click="setLayoutType('top')"
              >
                <div class="layout-preview top-layout-preview"></div>
                <span>顶部菜单</span>
              </div>
              <div 
                class="layout-item" 
                :class="{ active: layoutStore.layoutType === 'mix' }"
                @click="setLayoutType('mix')"
              >
                <div class="layout-preview mix-layout-preview"></div>
                <span>混合菜单</span>
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>主题色</h3>
            <div class="color-select">
              <div 
                v-for="color in themeColors" 
                :key="color" 
                class="color-item"
                :style="{ backgroundColor: color }"
                :class="{ active: layoutStore.primaryColor === color }"
                @click="setPrimaryColor(color)"
              ></div>
              <div class="color-item color-picker">
                <input type="color" v-model="customColor" @change="setPrimaryColor(customColor)">
              </div>
            </div>
          </div>

          <div class="settings-section">
            <h3>元素开关</h3>
            <div class="element-switches">
              <div class="switch-item">
                <span>折叠菜单</span>
                <a-switch 
                  :checked="layoutStore.collapsed" 
                  @change="(value: boolean) => layoutStore.$patch({ collapsed: value })" 
                />
              </div>
              <div class="switch-item">
                <span>标签栏</span>
                <a-switch 
                  :checked="layoutStore.showTabs" 
                  @change="(value: boolean) => layoutStore.$patch({ showTabs: value })" 
                />
              </div>
              <div class="switch-item">
                <span>面包屑</span>
                <a-switch :checked="true" />
              </div>
            </div>
          </div>
        </div>
      </a-drawer>
    </div>
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
    }
  },
  emits: ['update:collapsed'],
  setup(props, { emit }) {
    const layoutStore = useLayoutStore();
    const showSettings = ref(false);
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
      '#1890ff', // 蓝色
      '#13c2c2', // 青色
      '#f5222d', // 红色
      '#fa541c', // 橙色
      '#faad14', // 黄色
      '#16b775', // 绿色
      '#8b572a', // 棕色
      '#4254e5', // 紫蓝色
      '#722ed1', // 紫色
      '#52c8fa'  // 天蓝色
    ];

    // 设置主题
    const setTheme = (theme: 'light' | 'dark') => {
      if ((theme === 'light' && layoutStore.siderTheme === 'dark') || 
         (theme === 'dark' && layoutStore.siderTheme === 'light')) {
        // 手动切换主题
        layoutStore.$patch({ siderTheme: theme });
      }
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
      showSettings,
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
  height: 100%;
  padding: 0;
  
  .header-left {
    display: flex;
    align-items: center;
    
    .trigger {
      font-size: 18px;
      cursor: pointer;
      transition: color 0.3s;
      padding: 0 24px;
      
      &:hover {
        color: #1890ff;
      }
    }
    
    .breadcrumb {
      margin-left: 8px;
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    margin-right: 16px;
    
    .header-icon {
      padding: 0 12px;
      cursor: pointer;
      transition: all 0.3s;
      height: 100%;
      display: flex;
      align-items: center;
      
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    
    .notification-wrapper {
      padding: 0 12px;
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
      
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
      
      :deep(.ant-badge-dot) {
        top: 10px;
        right: 3px;
      }
    }
  }
}

// 设置面板样式
.settings-content {
  .settings-section {
    margin-bottom: 24px;
    
    h3 {
      margin-bottom: 12px;
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  
  .theme-select, .layout-select {
    display: flex;
    gap: 12px;
    
    .theme-item, .layout-item {
      text-align: center;
      cursor: pointer;
      
      .theme-preview, .layout-preview {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        margin-bottom: 8px;
        border: 1px solid #f0f0f0;
        transition: all 0.3s;
      }
      
      &.active .theme-preview, &.active .layout-preview {
        border-color: #1890ff;
        transform: scale(1.05);
      }
      
      .light-theme .theme-preview {
        background-color: #f0f2f5;
        color: #000;
      }
      
      .dark-theme .theme-preview {
        background-color: #001529;
        color: #fff;
      }
    }
  }
  
  .layout-preview {
    position: relative;
    overflow: hidden;
    
    &.side-layout-preview::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 30%;
      height: 100%;
      background-color: #001529;
    }
    
    &.top-layout-preview::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 30%;
      background-color: #001529;
    }
    
    &.mix-layout-preview::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 30%;
      background-color: #001529;
    }
    
    &.mix-layout-preview::after {
      content: '';
      position: absolute;
      left: 0;
      top: 30%;
      width: 30%;
      height: 70%;
      background-color: #f0f2f5;
    }
  }
  
  .color-select {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .color-item {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      
      &.active::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      &:hover {
        transform: scale(1.1);
      }
      
      &.color-picker {
        overflow: hidden;
        position: relative;
        background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red);
        
        input[type="color"] {
          position: absolute;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
          cursor: pointer;
          opacity: 0;
        }
      }
    }
  }
  
  .element-switches {
    .switch-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }
}
</style> 
