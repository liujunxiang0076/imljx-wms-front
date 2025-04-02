<script setup lang="ts">
import router from '../../router';

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="not-found-code">404</h1>
      <h2 class="not-found-title">页面未找到</h2>
      <p class="not-found-desc">抱歉，您访问的页面不存在或已被移除</p>
      <div class="not-found-actions">
        <a-button type="primary" @click="goHome" class="action-btn">返回首页</a-button>
        <a-button @click="goBack" class="action-btn">返回上一页</a-button>
      </div>
    </div>
    <div class="not-found-image">
      <img src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg" alt="404" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-container {
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column-reverse;
    text-align: center;
  }
}

.not-found-content {
  padding-right: 48px;
  
  @media (max-width: 768px) {
    padding-right: 0;
    padding-top: 24px;
  }
}

.not-found-code {
  font-size: 72px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 16px;
  line-height: 1;
}

.not-found-title {
  font-size: 24px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 16px;
}

.not-found-desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 16px;
  margin-bottom: 24px;
}

.not-found-actions {
  .action-btn {
    margin-right: 16px;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      margin-right: 8px;
      margin-left: 8px;
    }
  }
}

.not-found-image {
  img {
    max-width: 100%;
    height: auto;
    max-height: 300px;
  }
}
</style> 
