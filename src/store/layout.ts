/**
 * 布局状态管理
 */
import { defineStore } from 'pinia';

export type LayoutType = 'sider' | 'top' | 'mix' | 'mix-right';
export type ThemeType = 'light' | 'dark';

interface LayoutState {
  /** 布局类型：侧边菜单、顶部菜单、混合菜单 */
  layoutType: LayoutType;
  
  /** 是否折叠侧边栏 */
  collapsed: boolean;
  
  /** 侧边栏主题 */
  siderTheme: ThemeType;
  
  /** 头部主题 */
  headerTheme: ThemeType;
  
  /** 是否固定头部 */
  fixedHeader: boolean;
  
  /** 是否固定侧边栏 */
  fixedSider: boolean;
  
  /** 主题色 */
  primaryColor: string;
  
  /** 是否显示标签页 */
  showTabs: boolean;
  
  /** 内容区域宽度 */
  contentWidth: 'fixed' | 'fluid';
  
  /** 自动分割菜单 */
  splitMenus: boolean;
}

/**
 * 布局状态Store
 */
export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    layoutType: 'sider',
    collapsed: false,
    siderTheme: 'dark',
    headerTheme: 'light',
    fixedHeader: true,
    fixedSider: true,
    primaryColor: '#1890ff',
    showTabs: true,
    contentWidth: 'fluid',
    splitMenus: false
  }),
  
  getters: {
    // 是否是移动设备响应式布局
    isMobile(): boolean {
      return window.innerWidth < 768;
    }
  },
  
  actions: {
    /**
     * 切换布局类型
     */
    setLayoutType(type: LayoutType): void {
      this.layoutType = type;
    },
    
    /**
     * 切换侧边栏折叠状态
     */
    toggleCollapsed(): void {
      this.collapsed = !this.collapsed;
    },
    
    /**
     * 设置侧边栏折叠状态
     */
    setCollapsed(collapsed: boolean): void {
      this.collapsed = collapsed;
    },
    
    /**
     * 切换侧边栏主题
     */
    toggleSiderTheme(): void {
      this.siderTheme = this.siderTheme === 'dark' ? 'light' : 'dark';
    },
    
    /**
     * 切换头部主题
     */
    toggleHeaderTheme(): void {
      this.headerTheme = this.headerTheme === 'dark' ? 'light' : 'dark';
    },
    
    /**
     * 切换固定头部
     */
    toggleFixedHeader(): void {
      this.fixedHeader = !this.fixedHeader;
    },
    
    /**
     * 切换固定侧边栏
     */
    toggleFixedSider(): void {
      this.fixedSider = !this.fixedSider;
    },
    
    /**
     * 设置主题色
     */
    setPrimaryColor(color: string): void {
      this.primaryColor = color;
    },
    
    /**
     * 切换显示标签页
     */
    toggleShowTabs(): void {
      this.showTabs = !this.showTabs;
    },
    
    /**
     * 设置显示标签页
     */
    setShowTabs(show: boolean): void {
      this.showTabs = show;
    },
    
    /**
     * 设置内容区域宽度
     */
    setContentWidth(width: 'fixed' | 'fluid'): void {
      this.contentWidth = width;
    },
    
    /**
     * 重置设置
     */
    resetSettings(): void {
      this.layoutType = 'sider';
      this.collapsed = false;
      this.siderTheme = 'dark';
      this.headerTheme = 'light';
      this.fixedHeader = true;
      this.fixedSider = true;
      this.primaryColor = '#1890ff';
      this.showTabs = true;
      this.contentWidth = 'fluid';
      this.splitMenus = false;
    },
    
    /**
     * 根据视口调整布局
     */
    adjustLayoutForViewport(): void {
      if (this.isMobile) {
        this.collapsed = true;
        this.fixedHeader = false;
        this.fixedSider = false;
      }
    },
    
    /**
     * 更新主题
     */
    updateTheme(payload: Partial<LayoutState>): void {
      Object.assign(this, payload);
    }
  }
}); 
