<script setup lang="ts">
import { ref, reactive, defineComponent } from 'vue';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';

// 添加默认导出
defineComponent({
  name: 'LoginView'
});

// 获取路由和store
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

interface LoginForm {
  username: string;
  password: string;
  captcha: string;
  remember: boolean;
}

const loginLoading = ref(false);
const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
  captcha: '',
  remember: true
});

const handleLogin = async () => {
  loginLoading.value = true;
  
  try {
    // 调用store登录方法
    await userStore.login({
      username: loginForm.username,
      password: loginForm.password,
      captcha: loginForm.captcha
    });
    
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

// 动态生成验证码的时间戳（实际环境中应从后端获取）
const captchaTimestamp = ref(Date.now());
const refreshCaptcha = () => {
  captchaTimestamp.value = Date.now();
};
</script>

<template>
  <div class="login-container">
    <!-- 左侧背景图 -->
    <div class="login-background">
      <div class="logo-header">
        <div class="logo-container">
          <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="Logo" class="logo" />
          <span class="logo-text">数字工厂管理系统</span>
        </div>
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
                  <img :src="`https://api.multiavatar.com/${captchaTimestamp.toString()}.svg`" alt="验证码" />
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
        
        <div class="login-footer">
          <p>Copyright © 2024 SOOTRY All Rights Reserved</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.login-background {
  flex: 1.3;
  background-image: url('https://img.freepik.com/free-photo/automated-guided-vehicles-agv-robots-sorting-parcels-modern-intelligent-warehouse_93675-134573.jpg');
  background-size: cover;
  background-position: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
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

      img {
        height: 38px;
        width: 100%;
        object-fit: cover;
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
