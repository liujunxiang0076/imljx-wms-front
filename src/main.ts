import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './store'
import './styles/index.scss'
import './styles/theme.scss'  // 引入全局主题样式

const app = createApp(App)

// 挂载状态管理
app.use(pinia)

// 挂载路由
app.use(router)

app.mount('#app')
