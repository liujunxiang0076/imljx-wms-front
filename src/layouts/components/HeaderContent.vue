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
      <a-dropdown placement="bottomRight">
        <span class="header-icon">
          <BellOutlined style="font-size: 16px;" />
          <a-badge dot class="notification-badge" />
        </span>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1">暂无消息</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      
      <!-- 全屏切换 -->
      <span class="header-icon" @click="toggleFullscreen">
        <FullscreenOutlined v-if="!isFullscreen" style="font-size: 16px;" />
        <FullscreenExitOutlined v-else style="font-size: 16px;" />
      </span>
      
      <!-- 用户头像 -->
      <UserAvatar />
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
  FullscreenExitOutlined
} from '@ant-design/icons-vue';
import UserAvatar from './UserAvatar.vue';

export default defineComponent({
  name: 'HeaderContent',
  components: {
    MenuFoldOutlined, 
    MenuUnfoldOutlined, 
    BellOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    UserAvatar
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:collapsed'],
  setup(props, { emit }) {
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

    return {
      toggleCollapsed,
      isFullscreen,
      toggleFullscreen,
      breadcrumbList
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
    
    .notification-badge {
      position: absolute;
      top: 16px;
      right: 9px;
    }
  }
}
</style> 
