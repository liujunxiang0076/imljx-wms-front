import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './styles/theme.scss'  // 引入主题样式

const app = createApp(App)
const pinia = createPinia()

// 挂载状态管理
app.use(pinia)

// 挂载路由
app.use(router)

app.use(Antd)

app.mount('#app')
