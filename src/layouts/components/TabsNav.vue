<template>
  <div class="tabs-wrapper" v-if="layoutStore.showTabs">
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
            <a-dropdown :trigger="['contextmenu']">
              <span>{{ tab.title }}</span>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="refresh" @click="refreshCurrentPage">
                    <span>刷新当前页面</span>
                  </a-menu-item>
                  <a-menu-item 
                    key="close" 
                    @click="closeTab(tab.key)"
                    :disabled="tab.key === defaultTab"
                  >
                    <span>关闭当前页面</span>
                  </a-menu-item>
                  <a-menu-item key="close-others" @click="closeOtherTabs">
                    <span>关闭其他页面</span>
                  </a-menu-item>
                  <a-menu-item key="close-all" @click="closeAllTabs">
                    <span>关闭全部页面</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tab-pane>
      </a-tabs>
      
      <div class="tabs-actions">
        <ReloadOutlined class="tabs-action-item" @click="refreshCurrentPage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { useLayoutStore } from '../../store/layout';

// 定义TabItem接口
interface TabItem {
  key: string;
  title: string;
  path: string;
  closable?: boolean;
}

const layoutStore = useLayoutStore();

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
  
  // 处理仪表盘路由
  if (path === '/dashboard' || path === '/dashboard/index') {
    activeTabKey.value = defaultTab;
    return;
  }
  
  const key = path.substring(1).replace(/\//g, '-');
  
  // 检查标签是否已存在
  const existTab = tabList.value.find(tab => tab.key === key);
  if (!existTab) {
    tabList.value.push({
      key,
      title: getTabTitle(path),
      path,
      closable: true
    });
  }
  
  activeTabKey.value = key;
};

// 刷新当前页面
const refreshCurrentPage = () => {
  const { href } = window.location;
  window.location.replace(href);
};

// 监听路由变化，更新标签页
watch(() => route.path, (newPath) => {
  // 忽略登录页和重定向页面
  if (newPath === '/login' || newPath === '/redirect') return;
  
  // 处理仪表盘路由
  if (newPath === '/dashboard' || newPath === '/dashboard/index') {
    activeTabKey.value = defaultTab;
    return;
  }
  
  addTab(newPath);
}, { immediate: true });

// 标签编辑事件（关闭标签）
const onTabEdit = (targetKey: any, action: 'add' | 'remove') => {
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
</script>

<style lang="scss" scoped>
.tabs-wrapper {
  width: 100%;
  height: 40px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  
  .tabs-nav {
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: space-between;
    
    :deep(.ant-tabs) {
      height: 40px;
      flex: 1;
      
      .ant-tabs-nav {
        margin: 0;
        height: 40px;
        
        &::before {
          border-bottom: none;
        }
        
        .ant-tabs-tab {
          border: none;
          background-color: transparent;
          margin-right: 0;
          transition: all 0.3s;
          padding: 0;
          
          .ant-tabs-tab-btn {
            padding: 0 16px;
            transition: all 0.3s;
            color: rgba(0, 0, 0, 0.65);
          }
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.025);
          }
          
          &.ant-tabs-tab-active {
            background-color: rgba(24, 144, 255, 0.1);
            border-bottom: 2px solid #1890ff;
            z-index: 2;
            
            .ant-tabs-tab-btn {
              color: #1890ff;
            }
          }
          
          .ant-tabs-tab-remove {
            margin-right: 6px;
            margin-left: -8px;
            color: rgba(0, 0, 0, 0.45);
            
            &:hover {
              color: rgba(0, 0, 0, 0.85);
            }
          }
        }
        
        .ant-tabs-extra-content {
          display: none;
        }
      }
    }
    
    .tabs-actions {
      padding: 0 16px;
      display: flex;
      align-items: center;
      
      .tabs-action-item {
        font-size: 16px;
        padding: 0 8px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.45);
        transition: all 0.3s;
        
        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}
</style> 
