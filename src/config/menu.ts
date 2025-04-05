/**
 * 菜单配置文件
 */

export interface MenuItem {
  /** 菜单键值，唯一标识 */
  key: string;
  /** 菜单路径 */
  path?: string;
  /** 菜单标题 */
  title: string;
  /** 菜单图标名称 */
  icon?: string;
  /** 菜单所需权限 */
  permissions?: string[];
  /** 子菜单 */
  children?: MenuItem[];
  /** 是否隐藏菜单 */
  hidden?: boolean;
  /** 是否在新标签页打开 */
  target?: '_blank' | '_self';
  /** 额外数据 */
  meta?: Record<string, any>;
}

/**
 * 系统菜单配置
 */
const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    permissions: [],
    children: [
      {
        key: 'dashboard-index',
        path: '/dashboard/index',
        title: '总览',
        icon: 'FundOutlined',
        permissions: [],
      },
      {
        key: 'dashboard-analysis',
        path: '/dashboard/analysis',
        title: '分析页',
        icon: 'AreaChartOutlined',
        permissions: [],
      },
      {
        key: 'dashboard-monitor',
        path: '/dashboard/monitor',
        title: '监控页',
        icon: 'MonitorOutlined',
        permissions: [],
      }
    ]
  },
  {
    key: 'inventory',
    title: '库存管理',
    icon: 'InboxOutlined',
    permissions: ['inventory'],
    children: [
      {
        key: 'inventory-overview',
        path: '/inventory/overview',
        title: '库存总览',
        permissions: ['inventory:view'],
      },
      {
        key: 'inventory-detail',
        path: '/inventory/detail',
        title: '库存明细',
        permissions: ['inventory:view'],
      },
      {
        key: 'inventory-check',
        path: '/inventory/check',
        title: '库存盘点',
        permissions: ['inventory:check'],
      },
      {
        key: 'inventory-location',
        path: '/inventory/location',
        title: '库位管理',
        permissions: ['inventory:location'],
      },
    ],
  },
  {
    key: 'inbound',
    title: '入库管理',
    icon: 'ImportOutlined',
    permissions: ['inbound'],
    children: [
      {
        key: 'inbound-receipt',
        path: '/inbound/receipt',
        title: '入库单管理',
        permissions: ['inbound:receipt'],
      },
      {
        key: 'inbound-plan',
        path: '/inbound/plan',
        title: '入库计划',
        permissions: ['inbound:plan'],
      },
      {
        key: 'inbound-verify',
        path: '/inbound/verify',
        title: '入库验收',
        permissions: ['inbound:verify'],
      },
      {
        key: 'inbound-return',
        path: '/inbound/return',
        title: '退货入库',
        permissions: ['inbound:return'],
      },
    ],
  },
  {
    key: 'outbound',
    title: '出库管理',
    icon: 'ExportOutlined',
    permissions: ['outbound'],
    children: [
      {
        key: 'outbound-order',
        path: '/outbound/order',
        title: '出库单管理',
        permissions: ['outbound:order'],
      },
      {
        key: 'outbound-plan',
        path: '/outbound/plan',
        title: '出库计划',
        permissions: ['outbound:plan'],
      },
      {
        key: 'outbound-picking',
        path: '/outbound/picking',
        title: '拣货管理',
        permissions: ['outbound:picking'],
      },
      {
        key: 'outbound-delivery',
        path: '/outbound/delivery',
        title: '发运管理',
        permissions: ['outbound:delivery'],
      },
    ],
  },
  {
    key: 'goods',
    title: '货物管理',
    icon: 'ShoppingOutlined',
    permissions: ['goods'],
    children: [
      {
        key: 'goods-category',
        path: '/goods/category',
        title: '货物分类',
        permissions: ['goods:category'],
      },
      {
        key: 'goods-info',
        path: '/goods/info',
        title: '货物信息',
        permissions: ['goods:info'],
      },
      {
        key: 'goods-barcode',
        path: '/goods/barcode',
        title: '条码管理',
        permissions: ['goods:barcode'],
      },
    ],
  },
  {
    key: 'supplier',
    title: '供应商管理',
    icon: 'TeamOutlined',
    permissions: ['supplier'],
    children: [
      {
        key: 'supplier-list',
        path: '/supplier/list',
        title: '供应商列表',
        permissions: ['supplier:list'],
      },
      {
        key: 'supplier-evaluation',
        path: '/supplier/evaluation',
        title: '供应商评估',
        permissions: ['supplier:evaluation'],
      },
    ],
  },
  {
    key: 'customer',
    title: '客户管理',
    icon: 'UserOutlined',
    permissions: ['customer'],
    children: [
      {
        key: 'customer-list',
        path: '/customer/list',
        title: '客户列表',
        permissions: ['customer:list'],
      },
      {
        key: 'customer-order',
        path: '/customer/order',
        title: '客户订单',
        permissions: ['customer:order'],
      },
    ],
  },
  {
    key: 'reports',
    title: '报表管理',
    icon: 'BarChartOutlined',
    permissions: ['reports'],
    children: [
      {
        key: 'reports-inventory',
        path: '/reports/inventory',
        title: '库存报表',
        permissions: ['reports:inventory'],
      },
      {
        key: 'reports-inbound',
        path: '/reports/inbound',
        title: '入库报表',
        permissions: ['reports:inbound'],
      },
      {
        key: 'reports-outbound',
        path: '/reports/outbound',
        title: '出库报表',
        permissions: ['reports:outbound'],
      },
      {
        key: 'reports-turnover',
        path: '/reports/turnover',
        title: '周转率报表',
        permissions: ['reports:turnover'],
      },
    ],
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'SettingOutlined',
    permissions: ['system'],
    children: [
      {
        key: 'system-user',
        path: '/system/user',
        title: '用户管理',
        permissions: ['system:user'],
      },
      {
        key: 'system-role',
        path: '/system/role',
        title: '角色管理',
        permissions: ['system:role'],
      },
      {
        key: 'system-permission',
        path: '/system/permission',
        title: '权限管理',
        permissions: ['system:permission'],
      },
      {
        key: 'system-log',
        path: '/system/log',
        title: '系统日志',
        permissions: ['system:log'],
      },
      {
        key: 'system-backup',
        path: '/system/backup',
        title: '数据备份',
        permissions: ['system:backup'],
      },
      {
        key: 'system-settings',
        path: '/system/settings',
        title: '系统设置',
        permissions: ['system:settings'],
      },
    ],
  },
];

export default menuConfig;
