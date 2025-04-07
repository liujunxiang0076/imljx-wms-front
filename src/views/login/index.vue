<template>
  <div class="login-container">
    <!-- 左侧背景图轮播 -->
    <div class="login-background" 
         :style="{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }"
         @mouseenter="stopAutoPlay" 
         @mouseleave="startAutoPlay">
      <div class="logo-header">
        <div class="logo-container">
          <img :src="systemLogo" alt="Logo" class="logo" />
          <span class="logo-text">{{ systemName }}</span>
        </div>
      </div>
      
      <!-- 轮播控制按钮 -->
      <div v-if="loginCarousel.enable && backgroundImages.length > 1" class="carousel-controls">
        <div class="carousel-arrow carousel-arrow-left" @click="prevImage">
          <LeftOutlined />
        </div>
        <div class="carousel-arrow carousel-arrow-right" @click="nextImage">
          <RightOutlined />
        </div>
      </div>
      
      <!-- 指示器 -->
      <div v-if="loginCarousel.enable && backgroundImages.length > 1" class="carousel-indicators">
        <span 
          v-for="(_, index) in backgroundImages" 
          :key="index" 
          :class="['carousel-indicator', { active: index === currentImageIndex }]"
          @click="goToImage(index)">
        </span>
      </div>
    </div>
    
    <!-- 右侧登录表单 -->
    <div class="login-form-wrapper">
      <div class="login-form-container">
        <div class="login-header">
          <h2>欢迎登录</h2>
          <p>请使用用户名与密码登录</p>
        </div>
        
        <a-form
          :model="loginForm"
          class="login-form"
          @finish="handleLogin"
        >
          <a-form-item
            name="username"
            :rules="[{ required: true, message: '请输入用户名' }]"
          >
            <a-input
              v-model:value="loginForm.username"
              size="large"
              placeholder="请输入用户名"
            >
              <template #prefix>
                <UserOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item
            name="password"
            :rules="[{ required: true, message: '请输入密码' }]"
          >
            <a-input-password
              v-model:value="loginForm.password"
              size="large"
              placeholder="请输入密码"
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
          
          <a-form-item
            v-if="config.auth.enableCaptcha"
            name="captcha"
            :rules="[{ required: true, message: '请输入验证码' }]"
          >
            <a-row :gutter="8">
              <a-col :span="16">
                <a-input
                  v-model:value="loginForm.captcha"
                  size="large"
                  placeholder="请选择"
                >
                  <template #prefix>
                    <SafetyCertificateOutlined class="site-form-item-icon" />
                  </template>
                </a-input>
              </a-col>
              <a-col :span="8">
                <div class="captcha-container" @click="refreshCaptcha">
                  <a-spin :spinning="captchaLoading" size="small">
                    <div class="captcha-content">
                      {{ captchaText }}
                      <SyncOutlined class="refresh-icon" />
                    </div>
                  </a-spin>
                </div>
              </a-col>
            </a-row>
          </a-form-item>
          
          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              :loading="loginLoading"
              class="login-form-button"
              size="large"
              block
            >
              欢迎登录
            </a-button>
          </a-form-item>
        </a-form>
        
        <div v-if="config.system.showFooter" class="login-footer">
          <p>Copyright © {{ copyrightYear }} {{ companyName }} All Rights Reserved</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineComponent, onMounted, onUnmounted } from 'vue';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined, LeftOutlined, RightOutlined, SyncOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import router from '@/router';
import { useUserStore } from '@/store/user';
import config from '@/config';

defineComponent({
  name: 'LoginView'
});

// 获取store
const userStore = useUserStore();
const route = router.currentRoute.value;

// 使用配置文件中的系统设置
const { systemName, systemLogo, companyName, copyrightYear, loginCarousel } = config.system;

// 背景图片轮播数据
const backgroundImages = loginCarousel.images;
const currentImageIndex = ref(0);
let autoPlayTimer: number | null = null;

// 自动切换背景图
const startAutoPlay = () => {
  if (!loginCarousel.enable) return;
  
  stopAutoPlay();
  autoPlayTimer = window.setInterval(() => {
    nextImage();
  }, loginCarousel.interval); // 使用配置的间隔时间
};

// 停止自动切换
const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
};

// 下一张图片
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % backgroundImages.length;
};

// 上一张图片
const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + backgroundImages.length) % backgroundImages.length;
};

// 切换到指定图片
const goToImage = (index: number) => {
  currentImageIndex.value = index;
};

// 组件挂载时启动自动播放
onMounted(() => {
  startAutoPlay();
  if (config.auth.enableCaptcha) {
    generateCaptcha(); // 仅在启用验证码时初始化
  }
});

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoPlay();
});

interface LoginForm {
  username: string;
  password: string;
  captcha: string;
  remember: boolean;
}

const loginLoading = ref(false);
const loginForm = reactive<LoginForm>({
  username: 'admin', // 默认用户名
  password: 'admin', // 默认密码
  captcha: '',
  remember: config.auth.rememberLoginStatus
});

// 模拟登录API调用
const mockLogin = (username: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 检查用户名和密码是否匹配
      if (username === 'admin' && password === 'admin') {
        resolve({
          code: 0,
          message: '登录成功',
          data: {
            token: 'mock_token_' + Date.now(),
            userInfo: {
              id: 1,
              username: 'admin',
              name: '管理员',
              avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
              roles: ['admin'],
              permissions: ['*']
            }
          }
        });
      } else {
        reject({
          code: 401,
          message: '用户名或密码错误'
        });
      }
    }, 1000); // 延迟1秒，模拟网络请求
  });
};

const handleLogin = async () => {
  loginLoading.value = true;
  
  try {
    // 验证码验证
    if (config.auth.enableCaptcha && (!loginForm.captcha || loginForm.captcha.trim() === '')) {
      throw new Error('请输入验证码');
    }
    
    // 模拟登录调用
    const loginResult = await mockLogin(loginForm.username, loginForm.password);
    
    // 手动设置token和用户信息
    userStore.token = loginResult.data.token;
    userStore.userInfo = loginResult.data.userInfo;
    localStorage.setItem('token', loginResult.data.token);
    
    message.success('登录成功，欢迎回来！');
    
    // 处理重定向
    const redirect = route.query.redirect as string;
    router.push(redirect || '/dashboard');
  } catch (error: any) {
    message.error(error.message || '登录失败，请重试');
  } finally {
    loginLoading.value = false;
  }
};

// 生成验证码相关逻辑
const captchaText = ref('');
const captchaLoading = ref(false);

// 生成随机验证码
const generateCaptcha = () => {
  captchaLoading.value = true;
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < config.auth.captchaLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  setTimeout(() => {
    captchaText.value = result;
    captchaLoading.value = false;
  }, 300); // 模拟加载过程
};

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha();
};
</script>


<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.login-background {
  flex: 1.3;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: background-image 0.8s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
    z-index: 1;
  }

  .logo-header {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;

    .logo-container {
      display: flex;
      align-items: center;

      .logo {
        height: 28px;
        margin-right: 10px;
      }

      .logo-text {
        font-size: 18px;
        color: #fff;
        font-weight: 600;
      }
    }
  }
  
  .carousel-controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    padding: 0 20px;
    pointer-events: none;
    
    .carousel-arrow {
      width: 40px;
      height: 40px;
      background-color: rgba(0, 0, 0, 0.3);
      color: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.3s;
      pointer-events: auto;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
        transform: scale(1.1);
      }
    }
  }
  
  .carousel-indicators {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 2;
    
    .carousel-indicator {
      width: 10px;
      height: 10px;
      margin: 0 5px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      transition: all 0.3s;
      
      &.active {
        background-color: #fff;
        transform: scale(1.2);
      }
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}

.login-form-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .login-form-container {
    width: 400px;
    padding: 20px;

    .login-header {
      margin-bottom: 40px;
      text-align: center;

      h2 {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 8px;
      }

      p {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }

    .login-form {
      width: 100%;

      .login-form-button {
        height: 44px;
        font-size: 16px;
        border-radius: 4px;
      }
    }

    .captcha-container {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background: #f5f5f5;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid #d9d9d9;
      transition: all 0.3s;
      position: relative;

      &:hover {
        border-color: #1890ff;
        
        .refresh-icon {
          opacity: 1;
        }
      }

      .captcha-content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #333;
        user-select: none;
        position: relative;
        
        .refresh-icon {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: #999;
          opacity: 0;
          transition: opacity 0.3s;
        }
      }
    }

    .login-footer {
      margin-top: 60px;
      text-align: center;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }
  }
}

/* 适配移动端 */
@media (max-width: 992px) {
  .login-container {
    flex-direction: column;

    .login-background {
      flex: 0 0 200px;
    }

    .login-form-wrapper {
      .login-form-container {
        width: 100%;
        max-width: 400px;
        padding: 20px;
      }
    }
  }
}
</style> 
