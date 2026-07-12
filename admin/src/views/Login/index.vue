<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- 头部信息修改：改为奇胜阀门报价管理后台 -->
        <div class="login-header">
          <div class="login-logo">
            <img src="../../../public/chisun.png" alt="logo" />
          </div>
          <h1 class="login-title">奇胜阀门报价管理后台</h1>
          <p class="login-subtitle">Valve Quotation Management Dashboard</p>
        </div>

        <div class="login-tabs">
          <!-- 移除了 a-tabs 组件，直接保留账号密码登录的表单，结构更轻量 -->
          <div class="single-tab-title">账户密码登录</div>
          
          <a-form :model="form" :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }" @finish="handleLogin">
            <a-form-item>
              <a-input v-model:value="form.username" placeholder="用户名" size="large">
                <template #prefix>
                  <UserOutlined style="color: #999" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input-password v-model:value="form.password" placeholder="密码" size="large">
                <template #prefix>
                  <LockOutlined style="color: #999" />
                </template>
              </a-input-password>
            </a-form-item>
            <div class="login-options">
              <a-checkbox v-model:checked="autoLogin">自动登录</a-checkbox>
              <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">忘记密码?</a>
            </div>
            <a-form-item>
              <a-button type="primary" size="large" block html-type="submit" :loading="loading" class="submit-btn">
                {{ loading ? '登录中...' : '登 录' }}
              </a-button>
            </a-form-item>
          </a-form>
        </div>

        <!-- 保持图片中的其他登录方式 -->
        <div class="other-login">
          <span class="other-label">其他登录方式：</span>
          <div class="other-icons">
            <span class="icon-wrapper" @click="handleOtherLogin('cert')"><SafetyCertificateOutlined /></span>
            <span class="icon-wrapper" @click="handleOtherLogin('wechat')"><WechatOutlined /></span>
            <span class="icon-wrapper" @click="handleOtherLogin('dingtalk')"><DingtalkOutlined /></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚同步修改为奇胜阀门 -->
    <div class="login-footer">
      <p class="copyright">© 2026 奇胜阀门有限公司 · Designed by YaoYao Inc.</p>
      <p class="icp">v0.2.0 | 浙ICP备2026046956号-1 | 浙公网安备33032402002704号</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyCertificateOutlined,
  WechatOutlined,
  DingtalkOutlined 
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { userApi } from '../../api';

const router = useRouter();
const form = ref({ username: '', password: '' });
const autoLogin = ref(false);
const loading = ref(false);

onMounted(() => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    router.push('/series');
  }
});

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    message.warning('请输入用户名和密码');
    return;
  }
  loading.value = true;
  try {
    const result = await userApi.login(form.value.username, form.value.password);
    if (result.role !== 'admin') {
      message.error('非管理员账号无法登录');
      return;
    }
    localStorage.setItem('admin_token', JSON.stringify(result));
    message.success('登录成功');
    router.push('/series');
  } catch (error) {
    message.error(error.message || '登录失败');
  } finally {
    loading.value = false;
  }
}

function handleOtherLogin(type) {
  const messages = {
    cert: '电子证书登录接入中',
    wechat: '微信登录接入中',
    dingtalk: '钉钉登录接入中'
  };
  message.info(messages[type]);
}

function handleForgotPassword() {
  message.info('请联系管理员重置密码');
}
</script>

<style scoped>
/* 全局基础背景重置 */
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f4f6fa;
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.login-container {
  width: 100%;
  max-width: 440px;
  padding: 20px;
  z-index: 1;
}

/* 登录卡片样式 */
.login-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 40px 40px 30px 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

/* 绿色 Logo 样式 */
.login-logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 14px;
  /* background: #28a745; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-logo img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin: 0 0 6px 0;
}

.login-subtitle {
  font-size: 13px;
  color: #8c8c8c;
  margin: 0;
}

/* 单独标题样式替代原有的 a-tabs 样式 */
.single-tab-title {
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 24px;
  position: relative;
  padding-bottom: 8px;
}
.single-tab-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 3px;
  background: #1677ff;
  border-radius: 2px;
}

/* 输入框：浅灰底色、无边框感 */
:deep(.ant-input-affine-wrapper),
:deep(.ant-input) {
  background-color: #f5f5f5 !important;
  border: 1px solid transparent !important;
  border-radius: 6px !important;
  height: 44px;
}
:deep(.ant-input-affine-wrapper-focused) {
  background-color: #ffffff !important;
  border-color: #1677ff !important;
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.06) !important;
}
:deep(.ant-input) {
  background-color: transparent !important;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.forgot-password {
  font-size: 14px;
  color: #1677ff;
}

/* 登录按钮 */
.submit-btn {
  height: 44px !important;
  border-radius: 6px !important;
  font-size: 16px;
  background: #1677ff !important;
  border: none !important;
  box-shadow: none !important;
}
.submit-btn:hover {
  background: #4096ff !important;
}

/* 其他登录方式 */
.other-login {
  display: flex;
  align-items: center;
  margin-top: 12px;
  font-size: 13px;
  color: #8c8c8c;
}
.other-icons {
  display: flex;
  gap: 12px;
}
.icon-wrapper {
  cursor: pointer;
  color: #bfbfbf;
  font-size: 16px;
  transition: color 0.3s;
}
.icon-wrapper:hover {
  color: #595959;
}

/* 底部区域 */
.login-footer {
  position: absolute;
  bottom: 24px;
  left: 0;
  width: 100%;
  text-align: center;
}
.login-footer p {
  margin: 4px 0;
}
.copyright {
  font-size: 13px;
  color: #8c8c8c;
}
.icp {
  font-size: 12px;
  color: #bfbfbf;
}
</style>