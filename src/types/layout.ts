export type LayoutType = 'side' | 'top' | 'mix'

export interface LayoutSettings {
  layoutType: LayoutType
  splitMenus: boolean
  showTabs: boolean
  fixedHeader: boolean
  primaryColor: string
} 
