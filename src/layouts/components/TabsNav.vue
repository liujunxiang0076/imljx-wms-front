<template>
  <div class="tabs-nav">
    <a-tabs
      v-model:activeKey="activeTabKey"
      type="editable-card"
      hide-add
      @edit="onTabEdit"
    >
      <a-tab-pane
        v-for="tab in tabList"
        :key="tab.key"
        :closable="tab.key !== defaultTab"
      >
        <template #tab>
          <span>{{ tab.title }}</span>
        </template>
      </a-tab-pane>
    </a-tabs>
    
    <div class="tabs-actions">
      <a-dropdown placement="bottomRight">
        <ReloadOutlined class="tabs-action-item" @click="refreshCurrentPage" />
        <template #overlay>
          <a-menu>
            <a-menu-item key="refresh-current" @click="refreshCurrentPage">
              <span>刷新当前标签页</span>
            </a-menu-item>
            <a-menu-item key="close-others" @click="closeOtherTabs">
              <span>关闭其他标签页</span>
            </a-menu-item>
            <a-menu-item key="close-all" @click="closeAllTabs">
              <span>关闭所有标签页</span>
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="fullscreen" @click="toggleFullscreen">
              <span>{{ isFullscreen ? '退出全屏' : '全屏显示' }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { ReloadOutlined } from '@ant-design/icons-vue';

interface TabItem {
  key: string;
  title: string;
  path: string;
  closable?: boolean;
}

export default defineComponent({
  name: 'TabsNav',
  components: {
    ReloadOutlined
  },
  setup() {
    // 默认标签页
    const defaultTab = 'dashboard';

    // 标签列表
    const tabList = ref<TabItem[]>([
      { key: defaultTab, title: '仪表盘', path: '/dashboard', closable: false }
    ]);

    // 当前激活的标签页
    const activeTabKey = ref(defaultTab);

    // 全屏状态
    const isFullscreen = ref(false);

    const router = useRouter();
    const route = useRoute();

    // 通过路径获取标签页标题
    const getTabTitle = (path: string): string => {
      const routeName = path.split('/').filter(Boolean)[0] || '';
      // 根据路由名称获取标题
      const routeMap: Record<string, string> = {
        dashboard: '仪表盘',
        inventory: '库存管理',
        inbound: '入库管理',
        outbound: '出库管理',
        goods: '货物管理',
        supplier: '供应商管理',
        customer: '客户管理',
        reports: '报表管理',
        system: '系统管理'
      };
      
      return routeMap[routeName] || routeName;
    };

    // 根据路径添加标签页
    const addTab = (path: string) => {
      if (path === '/' || !path) {
        return;
      }
      
      const key = path.substring(1).replace(/\//g, '-') || defaultTab;
      
      // 检查标签是否已存在
      const existTab = tabList.value.find(tab => tab.key === key);
      if (!existTab) {
        tabList.value.push({
          key,
          title: getTabTitle(path),
          path,
          closable: key !== defaultTab
        });
      }
      
      activeTabKey.value = key;
    };

    // 监听路由变化，更新标签页
    watch(() => route.path, (newPath) => {
      if (newPath === '/login') return;
      
      const key = newPath.substring(1).replace(/\//g, '-') || defaultTab;
      addTab(newPath);
      activeTabKey.value = key;
    }, { immediate: true });

    // 标签编辑事件（关闭标签）
    const onTabEdit = (targetKey: string | MouseEvent | KeyboardEvent, action: 'add' | 'remove') => {
      if (action === 'remove' && typeof targetKey === 'string') {
        closeTab(targetKey);
      }
    };

    // 关闭标签
    const closeTab = (key: string) => {
      // 如果关闭的是当前活动的标签，则需要跳转到其他标签
      const targetIndex = tabList.value.findIndex(tab => tab.key === key);
      
      // 不能关闭默认标签
      if (key === defaultTab) {
        return;
      }
      
      // 如果关闭的是当前标签，则选择相邻的标签
      if (activeTabKey.value === key) {
        const newActiveKey = tabList.value[targetIndex - 1]?.key || tabList.value[targetIndex + 1]?.key || defaultTab;
        activeTabKey.value = newActiveKey;
        
        // 跳转到新选中的标签对应的路由
        const targetTab = tabList.value.find(tab => tab.key === newActiveKey);
        if (targetTab) {
          router.push(targetTab.path);
        }
      }
      
      // 从数组中移除关闭的标签
      tabList.value = tabList.value.filter(tab => tab.key !== key);
    };

    // 刷新当前页面
    const refreshCurrentPage = () => {
      const currentPath = route.fullPath;
      router.replace('/redirect' + currentPath);
    };

    // 关闭其他标签
    const closeOtherTabs = () => {
      tabList.value = tabList.value.filter(
        tab => tab.key === activeTabKey.value || tab.key === defaultTab
      );
    };

    // 关闭所有标签
    const closeAllTabs = () => {
      tabList.value = tabList.value.filter(tab => tab.key === defaultTab);
      activeTabKey.value = defaultTab;
      router.push('/dashboard');
    };

    // 切换全屏
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
          message.error('无法进入全屏模式：' + e.message);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    };

    // 监听全屏状态变化
    const handleFullscreenChange = () => {
      isFullscreen.value = !!document.fullscreenElement;
    };

    onMounted(() => {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    });

    return {
      defaultTab,
      tabList,
      activeTabKey,
      isFullscreen,
      onTabEdit,
      refreshCurrentPage,
      closeOtherTabs,
      closeAllTabs,
      toggleFullscreen
    };
  }
});
</script>

<style lang="scss" scoped>
.tabs-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  
  :deep(.ant-tabs) {
    flex: 1;
    overflow: hidden;
    
    .ant-tabs-nav {
      margin: 0;
    }
    
    .ant-tabs-nav-wrap {
      padding-left: 0;
    }
  }
  
  .tabs-actions {
    display: flex;
    align-items: center;
    margin-left: 16px;
    
    .tabs-action-item {
      font-size: 16px;
      padding: 0 8px;
      cursor: pointer;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style> 
