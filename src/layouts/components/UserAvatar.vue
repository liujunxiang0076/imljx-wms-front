<template>
  <div class="user-avatar">
    <a-dropdown>
      <div class="user-avatar-content">
        <a-avatar class="avatar" :src="avatar" :size="32" />
        <span v-if="showName" class="username">{{ name }}</span>
        <DownOutlined v-if="showIcon" class="avatar-icon" />
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

<script setup lang="ts">
import { computed } from 'vue';
import { UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';

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
  display: inline-block;
  
  // 用户头像内容
  .user-avatar-content {
    display: flex;
    align-items: center;
    // padding: 0 12px;
    cursor: pointer;
    transition: all 0.3s;
    // 头像样式
    .avatar {
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      // margin-right: 10px;
      margin-left: 10px;
    }
    // 鼠标悬停效果
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
    // 用户名
    .username {
      margin: 0 8px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 16px;
    }
    // 下拉图标
    .avatar-icon {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      padding-right: 10px;
    }
  }
}
</style> 
