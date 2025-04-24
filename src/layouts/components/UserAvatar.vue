<template>
  <div class="user-avatar">
    <a-dropdown :trigger="['click']">
      <div class="user-avatar-content">
        <a-avatar class="avatar" :src="avatar" :size="32">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <span v-if="shouldShowUsername" class="username">{{ username }}</span>
        <DownOutlined v-if="shouldShowIcon" class="avatar-icon" />
      </div>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="user-center">
            <template #icon>
              <UserOutlined />
            </template>
            个人中心
          </a-menu-item>
          <a-menu-item key="settings">
            <template #icon>
              <SettingOutlined />
            </template>
            账户设置
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="clear-cache">
            <template #icon>
              <ClearOutlined />
            </template>
            清除缓存
          </a-menu-item>
          <a-menu-item key="logout">
            <template #icon>
              <LogoutOutlined />
            </template>
            退出登录
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts">
export default {
  name: 'UserAvatar'
};
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { useLayoutStore } from '@/store/layout'
import { Modal, message } from 'ant-design-vue'
import { UserOutlined, SettingOutlined, ClearOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'

// 定义组件属性
const props = defineProps({
  showUsername: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

// 用户信息
const userStore = useUserStore()
const layoutStore = useLayoutStore()
const router = useRouter()

// 用户头像
const avatar = computed(() => userStore.userInfo?.avatar || '')

// 用户名
const username = computed(() => userStore.userInfo?.username || '未登录')

// 显示用户名和图标的计算属性
const shouldShowUsername = computed(() => props.showUsername)
const shouldShowIcon = computed(() => props.showIcon)

// 退出登录
const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        await userStore.logout()
        message.success('退出登录成功')
        // 清除缓存
        handleClearCache()
        // 跳转到登录页
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        message.error('退出登录失败')
      }
    }
  })
}

// 清除缓存
const handleClearCache = () => {
  layoutStore.clearCache()
  message.success('清除缓存成功')
}

// 处理菜单点击事件
const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  if (key === 'logout') {
    handleLogout()
  } else if (key === 'clear-cache') {
    handleClearCache()
  } else if (key === 'user-center') {
    // 跳转到个人中心（如果有此页面）
    // router.push('/user/center')
  } else if (key === 'settings') {
    // 跳转到账户设置（如果有此页面）
    // router.push('/user/settings')
  }
}
</script>

<style lang="scss" scoped>
// 用户头像
.user-avatar {
  display: inline-flex;
  align-items: center;
  height: 40px;
  
  // 用户头像内容
  .user-avatar-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 4px;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 4px;
    
    // 头像样式
    .avatar {
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1);
      margin: 0;
    }
    
    // 鼠标悬停效果
    &:hover {
      background: rgba(0, 0, 0, 0.03);
      color: #1890ff;
    }
    
    // 用户名
    .username {
      margin: 0 8px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
    }
    
    // 下拉图标
    .avatar-icon {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      margin-left: 4px;
    }
  }
}
</style> 

