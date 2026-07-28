<template>
    <view class="lang-switch" @tap="handleClick">
        <view class="lang-icon">
            <text class="icon-globe">🌐</text>
        </view>
        <view class="lang-label">
            <text class="label-text">{{ currentLang === 'zh-CN' ? 'EN' : '中' }}</text>
        </view>
    </view>
</template>

<script>
import { toggleLanguage, getCurrentLanguage } from '@/locale';

export default {
    name: 'LanguageSwitch',
    data() {
        return {
            currentLang: 'zh-CN'
        };
    },
    watch: {
        '$t(language.currentLang)': {
            handler() {
                this.currentLang = getCurrentLanguage();
            },
            deep: false
        }
    },
    created() {
        this.currentLang = getCurrentLanguage();
        this._unsubscribe = this.$localeOn(() => {
            this.currentLang = getCurrentLanguage();
        });
    },
    beforeDestroy() {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    },
    methods: {
        handleClick() {
            const newLang = toggleLanguage();
            this.currentLang = newLang;
            this.showToastMessage(newLang);
        },
        showToastMessage(lang) {
            uni.showToast({
                title: lang === 'zh-CN' ? this.$t('language.switchSuccess') : this.$t('language.switchSuccessEn'),
                icon: 'none',
                duration: 1500
            });
        }
    }
};
</script>

<style scoped>
.lang-switch {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    border-radius: 20rpx 0 0 20rpx;
    padding: 12rpx 16rpx 12rpx 12rpx;
    box-shadow: 0 4rpx 16rpx rgba(13, 21, 38, 0.25);
    transition: all 0.3s ease;
    cursor: pointer;
}

.lang-switch:active {
    opacity: 0.85;
    transform: translateY(-50%) scale(0.95);
}

.lang-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8rpx;
}

.icon-globe {
    font-size: 32rpx;
}

.lang-label {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40rpx;
}

.label-text {
    font-size: 24rpx;
    font-weight: 700;
    color: #c8aa6e;
    letter-spacing: 1rpx;
}
</style>
