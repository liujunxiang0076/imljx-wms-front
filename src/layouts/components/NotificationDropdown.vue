<template>
  <a-dropdown placement="bottomRight">
    <div class="notification-icon-wrapper">
      <!-- 使用按钮包裹图标 -->
      <template v-if="useButton">
        <a-button type="text" shape="circle" class="notification-btn">
          <template #icon>
            <bell-outlined style="font-size: 16px" />
          </template>
        </a-button>
        <a-badge :count="count" class="notification-badge" :size="badgeSize" />
      </template>
      
      <!-- 直接使用徽章包裹图标 -->
      <template v-else>
        <a-badge :count="count" class="notification-badge">
          <BellOutlined style="font-size: 16px" />
        </a-badge>
      </template>
    </div>
    
    <template #overlay>
      <a-menu :style="{ width: menuWidth }">
        <!-- 标题 -->
        <a-menu-item key="notification-title" class="notification-title">
          通知信息 ({{ count }}条未读)
        </a-menu-item>
        <a-menu-divider />
        
        <!-- 通知项 -->
        <template v-if="computedNotifications.length > 0">
          <a-menu-item 
            v-for="(notification, index) in computedNotifications" 
            :key="`notification-${index}`"
            @click="handleItemClick(notification)"
          >
            <div class="notification-item">
              <a-tag :color="notification.type === 'warning' ? 'red' : 'blue'">
                {{ notification.tag }}
              </a-tag>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
            </div>
          </a-menu-item>
        </template>
        <template v-else>
          <a-menu-item key="empty" class="notification-empty">
            暂无通知
          </a-menu-item>
        </template>
        
        <a-menu-divider />
        
        <!-- 查看所有链接 -->
        <a-menu-item key="see-all" class="notification-see-all" @click="handleViewAll">
          <router-link to="/notifications">查看所有通知</router-link>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BellOutlined } from '@ant-design/icons-vue';

// 使用defineOptions定义组件名称
defineOptions({
  name: 'NotificationDropdown'
});

type NotificationType = 'info' | 'warning' | 'success';
type BadgeSize = 'default' | 'small' | undefined;

// 通知类型定义
interface INotificationItem {
  id: string | number;
  title: string;
  time: string;
  tag: string;
  type: NotificationType;
  read: boolean;
}

// 组件属性
const props = defineProps({
  // 是否使用按钮包裹图标
  useButton: {
    type: Boolean,
    default: false
  },
  // 下拉菜单宽度
  menuWidth: {
    type: String,
    default: '220px'
  },
  // 通知数量
  count: {
    type: Number,
    default: 5
  },
  // 徽章大小
  badgeSize: {
    type: String as unknown as () => BadgeSize,
    default: undefined
  },
  // 通知数据
  notifications: {
    type: Array as () => INotificationItem[],
    default: () => []
  }
});

// 事件
const emit = defineEmits(['viewAll', 'itemClick']);

// 处理查看所有通知点击
const handleViewAll = () => {
  emit('viewAll');
};

// 处理通知项点击
const handleItemClick = (notification: INotificationItem) => {
  emit('itemClick', notification);
};

// 默认通知数据
const defaultNotifications: INotificationItem[] = [
  {
    id: 1,
    title: '新的入库订单已创建',
    time: '刚刚',
    tag: '入库',
    type: 'info',
    read: false
  },
  {
    id: 2,
    title: '产品B2库存低于安全库存',
    time: '10分钟前',
    tag: '警告',
    type: 'warning',
    read: false
  }
];

// 如果没有传入通知数据，使用默认数据
const computedNotifications = computed<INotificationItem[]>(() => {
  if (props.notifications && props.notifications.length > 0) {
    return props.notifications;
  }
  
  return defaultNotifications;
});
</script>

<style lang="scss" scoped>
// 通知图标包装器
.notification-icon-wrapper {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 4px;
  
  // 当使用按钮时，徽章需要绝对定位
  .notification-badge {
    cursor: pointer;
    
    // 当有按钮时的徽章样式
    .notification-btn + & {
      position: absolute;
      top: 2px;
      right: 2px;
      z-index: 1;
    }
  }
  
  // 通知按钮
  .notification-btn {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
      color: #1890ff;
    }
  }
}

// 通知菜单样式
:deep(.ant-dropdown-menu) {
  // 通知标题
  .notification-title {
    text-align: center;
    cursor: default;
    font-weight: 500;
  }
  
  // 通知项
  .notification-item {
    display: flex;
    align-items: flex-start;
    
    // 通知内容
    .notification-content {
      margin-left: 8px;
      flex: 1;
      
      // 通知标题
      .notification-title {
        font-weight: 500;
        text-align: left;
      }
      
      // 通知时间
      .notification-time {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
  
  // 无通知时的提示
  .notification-empty {
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
  }
  
  // 查看所有链接
  .notification-see-all {
    text-align: center;
  }
}
</style> 
