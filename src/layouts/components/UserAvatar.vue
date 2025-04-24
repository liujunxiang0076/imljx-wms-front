<template>
  <div class="user-avatar">
    <a-dropdown>
      <div class="user-avatar-content">
        <a-avatar class="avatar" :src="avatar" :size="32" />
        <span v-if="showName" class="username">{{ name }}</span>
        <down-outlined v-if="showIcon" class="avatar-icon" />
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item key="0">
            <template #icon>
              <UserOutlined />
            </template>
            个人中心
          </a-menu-item>
          <a-menu-item key="1">
            <template #icon>
              <SettingOutlined />
            </template>
            账户设置
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="2" @click="handleClearCache">
            <template #icon>
              <ClearOutlined />
            </template>
            清除缓存
          </a-menu-item>
          <a-menu-item key="3" @click="handleLogout">
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
import { computed } from 'vue';
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined, ClearOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { clearCacheAndLogout } from '../../utils/cache';

// Props定义
defineProps({
  showName: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();
const userStore = useUserStore();

// 用户信息
const name = computed(() => userStore.name || '用户');
const avatar = computed(() => userStore.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png');

// 清除缓存
const handleClearCache = () => {
  clearCacheAndLogout(router);
};

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout();
    message.success('退出登录成功');
    router.push('/login');
  } catch (error) {
    message.error('退出失败，请重试');
  }
};
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
