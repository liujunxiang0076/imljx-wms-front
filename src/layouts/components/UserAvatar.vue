<template>
  <div class="user-avatar">
    <a-dropdown>
      <div class="user-avatar-content">
        <a-avatar :src="avatar" :size="32" />
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
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  showName: {
    type: Boolean,
    default: true
  },
  showIcon: {
    type: Boolean,
    default: true
  }
});

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

// 添加默认导出
defineExpose({});
</script>

<style lang="scss" scoped>
.user-avatar {
  display: inline-block;
  
  .user-avatar-content {
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.3s;
    height: 48px;
    
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
    
    .username {
      margin: 0 8px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
    }
    
    .avatar-icon {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }
  }
}
</style> 
