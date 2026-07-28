<template>
    <view class="page-root">
        <navigation-bar :title="$t('login.title')" :back="true" color="white"
            background="linear-gradient(135deg, #1a2236 0%, #0d1526 100%);"></navigation-bar>

        <language-switch></language-switch>

        <scroll-view scroll-y class="scroll-wrap">
            <view class="login-container">
                <!-- Logo区域 -->
                <view class="logo-section">
                    <view class="logo-icon">⚙️</view>
                    <text class="logo-title">{{ $t('login.systemTitle') }}</text>
                    <text class="logo-subtitle">{{ $t('login.systemSubtitle') }}</text>
                </view>

                <!-- 登录表单 -->
                <view class="form-card">
                    <view class="form-header">
                        <view class="header-line"></view>
                        <text class="header-title">{{ $t('login.userLogin') }}</text>
                    </view>

                    <view class="form-body">
                        <!-- 用户名输入 -->
                        <view class="input-group">
                            <view class="input-label">
                                <text class="label-icon">👤</text>
                                <text class="label-text">{{ $t('login.username') }}</text>
                            </view>
                            <view class="input-wrapper" :class="{ active: usernameFocus }">
                                <input 
                                    v-model="username" 
                                    class="input-field" 
                                    :placeholder="$t('login.usernamePlaceholder')" 
                                    placeholder-class="placeholder"
                                    @focus="usernameFocus = true"
                                    @blur="usernameFocus = false; validateUsername()"
                                />
                            </view>
                            <text v-if="errors.username" class="error-text">{{ errors.username }}</text>
                        </view>

                        <!-- 密码输入 -->
                        <view class="input-group">
                            <view class="input-label">
                                <text class="label-icon">🔒</text>
                                <text class="label-text">{{ $t('login.password') }}</text>
                            </view>
                            <view class="input-wrapper" :class="{ active: passwordFocus }">
                                <input 
                                    v-model="password" 
                                    class="input-field" 
                                    type="password"
                                    :placeholder="$t('login.passwordPlaceholder')" 
                                    placeholder-class="placeholder"
                                    @focus="passwordFocus = true"
                                    @blur="passwordFocus = false; validatePassword()"
                                />
                            </view>
                            <text v-if="errors.password" class="error-text">{{ errors.password }}</text>
                        </view>

                        <!-- 记住登录 -->
                        <view class="remember-row">
                            <view class="checkbox-wrapper" @tap="toggleRemember">
                                <view class="checkbox" :class="{ checked: rememberMe }">
                                    <text v-if="rememberMe" class="check-mark">✓</text>
                                </view>
                                <text class="checkbox-label">{{ $t('login.rememberLogin') }}</text>
                            </view>
                        </view>

                        <!-- 登录按钮 -->
                        <button class="login-button" :class="{ disabled: isLoading }" @tap="handleLogin">
                            <text class="button-text">{{ isLoading ? $t('login.loggingIn') : $t('login.loginBtn') }}</text>
                        </button>
                    </view>
                </view>

                <!-- 底部信息 -->
                <view class="footer-section">
                    <text class="footer-text">{{ $t('login.contactAdmin') }}</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';
import { userApi, storage } from '@/utils/cloud-api';

export default {
    components: {
        navigationBar
    },
    data() {
        return {
            username: '',
            password: '',
            rememberMe: false,
            isLoading: false,
            usernameFocus: false,
            passwordFocus: false,
            errors: {
                username: '',
                password: ''
            }
        };
    },
    computed: {
        canSubmit() {
            return this.username.trim() && this.password.trim() && !this.isLoading;
        }
    },
    methods: {
        toggleRemember() {
            this.rememberMe = !this.rememberMe;
        },

        validateUsername() {
            if (!this.username.trim()) {
                this.errors.username = this.$t('login.usernameRequired');
            } else {
                this.errors.username = '';
            }
        },

        validatePassword() {
            if (!this.password.trim()) {
                this.errors.password = this.$t('login.passwordRequired');
            } else if (this.password.length < 6) {
                this.errors.password = this.$t('login.passwordMinLength');
            } else {
                this.errors.password = '';
            }
        },

        async handleLogin() {
            this.validateUsername();
            this.validatePassword();

            if (this.errors.username || this.errors.password) {
                return;
            }

            this.isLoading = true;

            try {
                const result = await userApi.login(this.username.trim(), this.password);
                
                storage.saveUser(result);
                
                uni.showToast({
                    title: this.$t('login.loginSuccess'),
                    icon: 'success',
                    duration: 1500
                });

                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/upload-price/upload-price'
                    });
                }, 1500);
            } catch (error) {
                console.error('登录失败:', error);
                uni.showToast({
                    title: error.message || this.$t('login.loginFail'),
                    icon: 'none',
                    duration: 2000
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>

<style lang="scss">
/* 工业深蓝钢铁风格 - 与index页面一致 */
.page-root {
    min-height: 100vh;
    background-color: #eef1f6;
    font-family: -apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

.scroll-wrap {
    height: calc(100vh - 88rpx);
}

.login-container {
    padding: 40rpx 32rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Logo区域 */
.logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50rpx;
    margin-top: 20rpx;
}

.logo-icon {
    width: 140rpx;
    height: 140rpx;
    background: linear-gradient(135deg, #1a2236 0%, #0d1526 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 70rpx;
    box-shadow: 0 10rpx 30rpx rgba(13, 21, 38, 0.3);
    margin-bottom: 24rpx;
}

.logo-title {
    font-size: 42rpx;
    font-weight: 700;
    color: #1a2236;
    letter-spacing: 2rpx;
    margin-bottom: 8rpx;
}

.logo-subtitle {
    font-size: 22rpx;
    color: #8a97aa;
    letter-spacing: 4rpx;
}

/* 表单卡片 */
.form-card {
    width: 100%;
    background: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 4rpx 20rpx rgba(13, 21, 38, 0.08);
    border: 1rpx solid #edf1f8;
    overflow: hidden;
}

.form-header {
    display: flex;
    align-items: center;
    padding: 32rpx 32rpx 24rpx;
    border-bottom: 1rpx solid #edf1f8;
}

.header-line {
    width: 8rpx;
    height: 32rpx;
    background: linear-gradient(180deg, #c8aa6e 0%, #e8cc88 100%);
    border-radius: 4rpx;
    margin-right: 16rpx;
}

.header-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1a2236;
    letter-spacing: 2rpx;
}

.form-body {
    padding: 32rpx;
}

/* 输入框组 */
.input-group {
    margin-bottom: 28rpx;
}

.input-label {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}

.label-icon {
    font-size: 28rpx;
    margin-right: 10rpx;
}

.label-text {
    font-size: 26rpx;
    font-weight: 500;
    color: #4a5568;
}

.input-wrapper {
    background: #f8fafc;
    border: 2rpx solid #e2e8f0;
    border-radius: 12rpx;
    padding: 0 24rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    transition: all 0.25s ease;
}

.input-wrapper.active {
    border-color: #c8aa6e;
    background: #ffffff;
    box-shadow: 0 0 0 4rpx rgba(200, 170, 110, 0.1);
}

.input-field {
    flex: 1;
    height: 100%;
    font-size: 30rpx;
    color: #1a2236;
}

.placeholder {
    color: #a0aec0;
}

.error-text {
    display: block;
    color: #e53e3e;
    font-size: 24rpx;
    margin-top: 8rpx;
    padding-left: 4rpx;
}

/* 记住登录 */
.remember-row {
    margin-bottom: 32rpx;
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
}

.checkbox {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid #cbd5e1;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12rpx;
    background: #ffffff;
    transition: all 0.2s ease;
}

.checkbox.checked {
    background: #c8aa6e;
    border-color: #c8aa6e;
}

.check-mark {
    color: #ffffff;
    font-size: 22rpx;
    font-weight: bold;
}

.checkbox-label {
    font-size: 26rpx;
    color: #64748b;
}

/* 登录按钮 */
.login-button {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #1a2236 0%, #0d1526 100%);
    border: none;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 20rpx rgba(13, 21, 38, 0.25);
}

.login-button.disabled {
    background: #cbd5e1;
    box-shadow: none;
}

.button-text {
    color: #ffffff;
    font-size: 32rpx;
    font-weight: 600;
    letter-spacing: 4rpx;
}

/* 底部信息 */
.footer-section {
    margin-top: 50rpx;
    text-align: center;
}

.footer-text {
    font-size: 24rpx;
    color: #a0aec0;
    letter-spacing: 1rpx;
}
</style>
