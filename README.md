# IMLJX-WMS 前端项目

## 技术栈
- 构建工具：Vite 4.x
- 前端框架：Vue 3 + TypeScript
- UI组件库：Ant Design Vue 3.x
- 状态管理：Pinia
- 路由管理：Vue Router 4.x
- 样式预处理器：Sass

## 功能模块
### 登录系统
- 可视化登录页（背景轮播图、企业LOGO展示）
- 账号密码+验证码双因素认证
- 登录状态持久化配置

### 权限管理
- 基于角色的访问控制(RBAC)
- 动态路由加载
- 按钮级权限控制

### 仪表盘
- 数据可视化看板
- 实时运营数据监控
- 快捷入口面板

## 环境配置
```bash
# 环境变量示例 (.env.development)
VITE_API_BASE=http://localhost:8080/api
VITE_APP_TITLE=IMLJX-WMS
```

## 系统配置 (config/system.ts)
```typescript
{
  systemName: '仓储管理系统',  // 系统名称
  systemLogo: '/logo.png',     // logo路径
  companyName: '某某物流公司',  // 公司名称
  loginCarousel: {             // 登录页轮播配置
    enable: true,
    interval: 5000,
    images: ['/login-bg1.jpg', '/login-bg2.jpg']
  }
}
```

## 项目结构
```
src/
├─ api/        # 接口模块
├─ config/     # 系统配置
├─ store/      # 状态管理
├─ views/      # 页面模块
│  ├─ login/   # 登录模块
│  ├─ dashboard # 仪表盘
└─ styles/     # 全局样式
```

## 本地运行
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

## 部署指南
1. 配置Nginx反向代理
2. 设置生产环境变量
3. 构建产物部署至web服务器
4. 启用Gzip压缩和缓存优化
