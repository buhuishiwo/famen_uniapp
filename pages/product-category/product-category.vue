<template>
    <view class="page-root">
        <navigation-bar :title="$t('product.category')" :back="false" color="white"
            background="linear-gradient(135deg, #1a2236 0%, #0d1526 100%);"></navigation-bar>

        <language-switch></language-switch>

        <scroll-view scroll-y class="scroll-wrap">

            <!-- 顶部 Hero 区 -->
            <view class="hero">

                <!-- 企业品牌区（Logo + 名称 + 标语） -->
                <view class="brand-row">
                    <view class="brand-logo-wrap">
                        <image class="brand-logo" src="/static/logo.png" mode="aspectFit"></image>
                    </view>
                    <view class="brand-info">
                        <text class="brand-name">{{ $t('product.brand') }}</text>
                        <text class="brand-tagline">{{ $t('product.brandTagline') }}</text>
                    </view>
                </view>

                <view class="hero-label">
                    <text class="hero-dot"></text>
                    <text class="hero-label-text">PRODUCT SERIES</text>
                </view>
                <text class="hero-title">{{ $t('product.title') }}</text>
                <text class="hero-sub">{{ $t('product.subtitle') }}</text>

                <!-- 搜索框 -->
                <view class="search-wrap">
                    <text class="search-icon-left">🔍</text>
                    <input
                        class="search-input"
                        type="text"
                        :placeholder="$t('product.searchPlaceholder')"
                        placeholder-class="search-placeholder"
                        v-model="searchKeyword"
                    />
                    <view class="search-clear" v-if="searchKeyword" @tap="searchKeyword = ''">
                        <text class="clear-icon">✕</text>
                    </view>
                </view>
            </view>

            <!-- 结果计数 -->
            <view class="result-bar">
                <text class="result-count">{{ $t('product.totalSeries', { count: filteredProducts.length }) }}</text>
                <view class="result-line"></view>
            </view>

            <!-- 产品网格 -->
            <view class="product-grid">
                <view
                    class="product-card"
                    v-for="(product, index) in filteredProducts"
                    :key="index"
                    @tap="onProductClick(product)"
                >
                    <!-- 序号角标 -->
                    <view class="card-index">
                        <text class="card-index-text">{{ String(index + 1).padStart(2, '0') }}</text>
                    </view>

                    <!-- 图片区 -->
                    <view class="card-image-wrap">
                        <image :src="product.image" mode="aspectFit" class="card-img"></image>
                    </view>

                    <!-- 名称 + 箭头 -->
                    <view class="card-footer">
                        <text class="card-name">{{ product.name }}</text>
                        <text class="card-arrow">›</text>
                    </view>

                    <!-- 底部金色线条装饰 -->
                    <view class="card-accent"></view>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-if="filteredProducts.length === 0">
                <text class="empty-icon">🔍</text>
                <text class="empty-text">{{ $t('product.noResult') }}</text>
                <text class="empty-sub">{{ $t('product.noResultSub') }}</text>
            </view>

            <!-- 品牌信息区（奇胜阀门企业元素） -->
            <view class="brand-section">

                <!-- 品牌故事 / 关于企业 -->
                <view class="brand-story-card">
                    <view class="story-head">
                        <image class="story-logo" src="/static/logo.png" mode="aspectFit"></image>
                        <view class="story-head-text">
                            <text class="story-title">{{ $t('quotation.companyName') }}</text>
                            <text class="story-sub">{{ $t('product.brandSince') }}</text>
                        </view>
                    </view>
                    <view class="story-divider"></view>
                    <view class="story-contact">
                        <view class="contact-item">
                            <text class="contact-icon">📞</text>
                            <text class="contact-text">{{ $t('quotation.companyPhone') }}</text>
                        </view>
                        <view class="contact-item">
                            <text class="contact-icon">📧</text>
                            <text class="contact-text">{{ $t('quotation.companyEmail') }}</text>
                        </view>
                        <view class="contact-item">
                            <text class="contact-icon">🌐</text>
                            <text class="contact-text">{{ $t('quotation.companyWebsite') }}</text>
                        </view>
                        <view class="contact-item">
                            <text class="contact-icon">📍</text>
                            <text class="contact-text">{{ $t('quotation.companyAddress') }}</text>
                        </view>
                    </view>
                </view>

                <view class="brand-copyright">
                    <text class="copyright-text">© {{ new Date().getFullYear() }} CHISUN VALVE · {{ $t('quotation.companyName') }}</text>
                </view>
            </view>

            <view class="bottom-safe"></view>

        </scroll-view>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';
import { priceApi } from '@/utils/cloud-api';

export default {
    components: { navigationBar },
    data() {
        return {
            searchKeyword: '',
            loading: true,
            products: []
        };
    },
    onLoad() {
        this.loadData();
    },
    computed: {
        filteredProducts() {
            if (!this.searchKeyword) return this.products;
            return this.products.filter(p =>
                p.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
            );
        }
    },
    methods: {
        async loadData() {
            this.loading = true;
            try {
                const seriesList = await priceApi.getSeries();
                this.products = seriesList.map(item => ({
                    name: item.name,
                    image: item.image || ''
                }));
            } catch (e) {
                console.error('加载产品系列失败:', e);
                uni.showToast({ title: this.$t('common.loadFail'), icon: 'none' });
            } finally {
                this.loading = false;
            }
        },
        onProductClick(product) {
            uni.setStorageSync('currentProductSeries', product.name);
            uni.navigateTo({ url: '/pages/index/index' });
        }
    }
};
</script>

<style scoped>
/* ============================
   工业精工 · 深蓝钢铁
   主色  #0d1526   强调 #c8aa6e
============================ */

.page-root {
    min-height: 100vh;
    background-color: #eef1f6;
    font-family: -apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

.scroll-wrap {
    height: calc(100vh - 88rpx);
}

/* ---- Hero ---- */
.hero {
    background: linear-gradient(160deg, #1a2236 0%, #0d1526 70%, #0a1020 100%);
    padding: 40rpx 32rpx 48rpx;
    position: relative;
    overflow: hidden;
}
/* ---- 企业品牌条（奇胜阀门 Logo + 名称） ---- */
.brand-row {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 10rpx 0 22rpx;
    border-bottom: 1rpx solid rgba(200,170,110,0.2);
    margin-bottom: 22rpx;
    position: relative;
    z-index: 1;
}
.brand-logo-wrap {
    width: 88rpx;
    height: 88rpx;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 10rpx;
    box-shadow: 0 4rpx 14rpx rgba(0,0,0,0.25), 0 0 0 1rpx rgba(200,170,110,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.brand-logo {
    width: 100%;
    height: 100%;
}
.brand-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6rpx;
    overflow: hidden;
}
.brand-name {
    font-size: 30rpx;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.5rpx;
    line-height: 1.2;
}
.brand-tagline {
    font-size: 22rpx;
    color: #c8aa6e;
    letter-spacing: 0.5rpx;
    line-height: 1.3;
}
/* 背景几何装饰 */
.hero::before {
    content: '';
    position: absolute;
    top: -60rpx;
    right: -60rpx;
    width: 320rpx;
    height: 320rpx;
    border-radius: 50%;
    border: 60rpx solid rgba(200,170,110,0.07);
    pointer-events: none;
}
.hero::after {
    content: '';
    position: absolute;
    bottom: -40rpx;
    left: 40rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    border: 40rpx solid rgba(200,170,110,0.04);
    pointer-events: none;
}

.hero-label {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 14rpx;
}
.hero-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: #c8aa6e;
    display: block;
    flex-shrink: 0;
}
.hero-label-text {
    font-size: 20rpx;
    font-weight: 700;
    color: #c8aa6e;
    letter-spacing: 5rpx;
}
.hero-title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.5rpx;
    margin-bottom: 8rpx;
}
.hero-sub {
    display: block;
    font-size: 24rpx;
    color: rgba(255,255,255,0.45);
    letter-spacing: 1rpx;
    margin-bottom: 32rpx;
}

/* ---- 搜索框 ---- */
.search-wrap {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.09);
    border: 1.5rpx solid rgba(255,255,255,0.14);
    border-radius: 14rpx;
    padding: 0 24rpx;
    height: 80rpx;
    backdrop-filter: blur(4px);
    position: relative;
    z-index: 1;
}
.search-icon-left {
    font-size: 28rpx;
    margin-right: 16rpx;
    opacity: 0.6;
}
.search-input {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
    color: #ffffff;
    background: transparent;
    border: none;
    padding: 0;
}
.search-placeholder {
    color: rgba(255,255,255,0.35);
}
.search-clear {
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    background: rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12rpx;
}
.clear-icon {
    font-size: 20rpx;
    color: rgba(255,255,255,0.6);
    font-weight: 600;
}

/* ---- 结果计数栏 ---- */
.result-bar {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx 8rpx;
    gap: 16rpx;
}
.result-count {
    font-size: 22rpx;
    font-weight: 700;
    color: #8a97aa;
    letter-spacing: 2rpx;
    white-space: nowrap;
}
.result-line {
    flex: 1;
    height: 1rpx;
    background: #dde3ed;
}

/* ---- 产品网格 ---- */
.product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
    padding: 16rpx 26rpx 26rpx;
}

/* ---- 产品卡片 ---- */
.product-card {
    background: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx 16rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2rpx 12rpx rgba(13, 21, 38, 0.07);
    position: relative;
    overflow: hidden;
    border: 1rpx solid #edf1f8;
    /* 点击态 */
    transition: box-shadow 0.15s;
}
.product-card:active {
    box-shadow: 0 6rpx 24rpx rgba(13, 21, 38, 0.16);
}

/* 序号角标 */
.card-index {
    position: absolute;
    top: 12rpx;
    left: 12rpx;
    background: #f0f6ff;
    border-radius: 6rpx;
    padding: 2rpx 10rpx;
}
.card-index-text {
    font-size: 18rpx;
    font-weight: 700;
    color: #4a88c8;
    letter-spacing: 1rpx;
}

/* 图片区 */
.card-image-wrap {
    width: 260rpx;
    height: 260rpx;
    margin: 20rpx 0 14rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f4f7fb;
    border-radius: 12rpx;
    overflow: hidden;
}
.card-img {
    width: 250rpx;
    height: 250rpx;
}

/* 卡片底部 */
.card-footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14rpx 8rpx 14rpx;
}
.card-name {
    font-size: 24rpx;
    font-weight: 700;
    color: #1a2236;
    letter-spacing: 0.5rpx;
}
.card-arrow {
    font-size: 30rpx;
    color: #b0bac8;
    font-weight: 300;
    line-height: 1;
}

/* 底部金线装饰 */
.card-accent {
    width: 100%;
    height: 4rpx;
    background: linear-gradient(90deg, #c8aa6e, #e8cc88);
    border-radius: 0 0 2rpx 2rpx;
}

/* ---- 空状态 ---- */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0 60rpx;
    gap: 16rpx;
}
.empty-icon { font-size: 80rpx; }
.empty-text {
    font-size: 30rpx;
    font-weight: 600;
    color: #8a97aa;
}
.empty-sub {
    font-size: 24rpx;
    color: #b0bac8;
    text-align: center;
}

/* ---- 底部安全 ---- */
.bottom-safe { height: 60rpx; }

/* ============================================
   奇胜阀门 · 品牌信息区样式
   与 Hero 保持深蓝钢铁 + 金色强调配色
============================================ */
.brand-section {
    margin: 36rpx 26rpx 20rpx;
    position: relative;
}

/* ---- 资质认证条 ---- */
.brand-certs {
    display: flex;
    gap: 14rpx;
    justify-content: center;
    margin-bottom: 24rpx;
    flex-wrap: wrap;
}
.cert-tag {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: linear-gradient(180deg, #ffffff, #f6f8fc);
    border: 1rpx solid #e2e8f1;
    border-radius: 30rpx;
    padding: 10rpx 22rpx;
    box-shadow: 0 2rpx 8rpx rgba(13, 21, 38, 0.05);
}
.cert-icon {
    font-size: 24rpx;
}
.cert-text {
    font-size: 22rpx;
    font-weight: 700;
    color: #1a2236;
    letter-spacing: 0.5rpx;
}

/* ---- 品牌故事 / 企业卡片 ---- */
.brand-story-card {
    background: linear-gradient(160deg, #1a2236 0%, #0d1526 100%);
    border-radius: 20rpx;
    padding: 28rpx 28rpx 24rpx;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8rpx 28rpx rgba(13, 21, 38, 0.18);
    border: 1rpx solid rgba(200,170,110,0.18);
}
.brand-story-card::before {
    content: '';
    position: absolute;
    top: -80rpx;
    right: -80rpx;
    width: 260rpx;
    height: 260rpx;
    border-radius: 50%;
    border: 40rpx solid rgba(200,170,110,0.08);
    pointer-events: none;
}
.brand-story-card::after {
    content: '';
    position: absolute;
    bottom: -60rpx;
    left: -40rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    border: 30rpx solid rgba(200,170,110,0.05);
    pointer-events: none;
}

/* 企业头部（Logo + 名称 + 简介） */
.story-head {
    display: flex;
    align-items: center;
    gap: 18rpx;
    position: relative;
    z-index: 1;
}
.story-logo {
    width: 80rpx;
    height: 80rpx;
    background: #ffffff;
    border-radius: 14rpx;
    padding: 8rpx;
    box-shadow: 0 3rpx 10rpx rgba(0,0,0,0.25), 0 0 0 1rpx rgba(200,170,110,0.3);
    flex-shrink: 0;
}
.story-head-text {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
    overflow: hidden;
}
.story-title {
    font-size: 28rpx;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 0.5rpx;
    line-height: 1.2;
}
.story-sub {
    font-size: 20rpx;
    color: rgba(200,170,110,0.9);
    letter-spacing: 0.3rpx;
    line-height: 1.3;
}

/* 金色分隔线 */
.story-divider {
    height: 1rpx;
    background: linear-gradient(90deg, rgba(200,170,110,0.0), rgba(200,170,110,0.6), rgba(200,170,110,0.0));
    margin: 22rpx 0 18rpx;
}

/* 联系方式 */
.story-contact {
    display: flex;
    flex-direction: column;
    gap: 14rpx;
    position: relative;
    z-index: 1;
}
.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 14rpx;
}
.contact-icon {
    font-size: 24rpx;
    flex-shrink: 0;
    width: 32rpx;
    text-align: center;
    margin-top: 2rpx;
}
.contact-text {
    font-size: 22rpx;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
    letter-spacing: 0.3rpx;
    flex: 1;
}

/* 版权 */
.brand-copyright {
    margin-top: 26rpx;
    text-align: center;
    padding: 10rpx 0 4rpx;
}
.copyright-text {
    font-size: 20rpx;
    color: #96a3b7;
    letter-spacing: 0.5rpx;
}
</style>
