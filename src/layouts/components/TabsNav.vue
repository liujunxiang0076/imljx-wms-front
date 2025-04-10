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
          v-for="tab in visibleTabs"
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
      
      <!-- 标签菜单按钮 - 当标签数量超过最大显示数量时显示 -->
      <div v-if="hasHiddenTabs" class="tabs-more-btn">
        <a-dropdown :trigger="['click']" placement="bottomRight">
          <a-button type="text" size="small">
            <span class="tabs-hidden-count">+{{ hiddenTabsCount }}</span>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item 
                v-for="tab in hiddenTabs" 
                :key="tab.key"
                @click="switchToTab(tab.key)"
              >
                <span>{{ tab.title }}</span>
              </a-menu-item>
              <a-menu-divider v-if="hiddenTabs.length > 0" />
              <a-menu-item key="close-all" @click="closeAllTabs">
                <span>关闭全部标签</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

// 最大可见标签数量
const MAX_VISIBLE_TABS = 8;

// 计算可见标签和隐藏标签
const visibleTabs = computed(() => {
  // 确保当前活动标签页始终可见
  const currentTabIndex = tabList.value.findIndex(tab => tab.key === activeTabKey.value);
  const activeTab = tabList.value[currentTabIndex];
  
  if (tabList.value.length <= MAX_VISIBLE_TABS) {
    return tabList.value;
  }
  
  // 可见标签优先包含：1. 固定标签(仪表盘) 2. 当前激活标签 3. 其他标签按顺序
  const fixedTab = tabList.value.find(tab => tab.key === defaultTab);
  let result = [];
  
  // 添加固定标签
  if (fixedTab) {
    result.push(fixedTab);
  }
  
  // 如果活动标签不是固定标签，添加它
  if (activeTab && activeTab.key !== defaultTab) {
    result.push(activeTab);
  }
  
  // 填充剩余空间
  const remainingSlots = MAX_VISIBLE_TABS - result.length;
  let otherTabs = tabList.value.filter(tab => 
    tab.key !== defaultTab && tab.key !== activeTabKey.value
  );
  
  // 优先显示当前活动标签附近的标签
  if (currentTabIndex > 0 && currentTabIndex < tabList.value.length) {
    otherTabs.sort((a, b) => {
      const aIndex = tabList.value.findIndex(tab => tab.key === a.key);
      const bIndex = tabList.value.findIndex(tab => tab.key === b.key);
      return Math.abs(aIndex - currentTabIndex) - Math.abs(bIndex - currentTabIndex);
    });
  }
  
  result = [...result, ...otherTabs.slice(0, remainingSlots)];
  
  // 确保返回的数组长度不超过最大可见标签数
  return result.slice(0, MAX_VISIBLE_TABS);
});

// 隐藏的标签
const hiddenTabs = computed(() => {
  const visibleKeys = visibleTabs.value.map(tab => tab.key);
  return tabList.value.filter(tab => !visibleKeys.includes(tab.key));
});

// 是否有隐藏的标签
const hasHiddenTabs = computed(() => hiddenTabs.value.length > 0);

// 隐藏标签的数量
const hiddenTabsCount = computed(() => hiddenTabs.value.length);

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

// 切换到指定标签
const switchToTab = (key: string) => {
  const targetTab = tabList.value.find(tab => tab.key === key);
  if (targetTab) {
    activeTabKey.value = key;
    router.push(targetTab.path);
  }
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
        
        // 移除左右箭头导航按钮
        .ant-tabs-nav-operations {
          display: none !important;
        }
      }
    }
    
    // 标签菜单按钮样式
    .tabs-more-btn {
      margin-left: 8px;
      padding: 0 4px;
      height: 32px;
      display: flex;
      align-items: center;
      
      .ant-btn {
        min-width: 32px;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
        height: 24px;
        padding: 0 8px;
        background-color: #fafafa;
        
        &:hover {
          background-color: #f0f0f0;
          border-color: #d9d9d9;
        }
      }
      
      .tabs-hidden-count {
        color: rgba(0, 0, 0, 0.65);
        font-size: 12px;
        font-weight: 500;
      }
    }
  }
}
</style> 
