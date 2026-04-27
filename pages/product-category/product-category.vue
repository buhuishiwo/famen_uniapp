<template>
    <view>
        <navigation-bar title="产品分类" :back="false" color="white" 
            background="linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);"></navigation-bar>

        <!-- 搜索框 -->
        <view class="search-container">
            <input type="text" placeholder="搜索您的商品" class="search-input" v-model="searchKeyword" />
            <view class="search-icon">
                <text class="icon-search">🔍</text>
            </view>
        </view>

        <!-- 产品系列网格 -->
        <view class="product-grid">
            <view class="product-item" v-for="(product, index) in filteredProducts" :key="index" @tap="onProductClick(product)">
                <view class="product-image">
                    <image :src="product.image" mode="aspectFit" class="product-img"></image>
                </view>
                <view class="product-name">{{ product.name }}</view>
            </view>
        </view>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';

export default {
    components: {
        navigationBar
    },
    data() {
        return {
            searchKeyword: '',
            products: [{
        name: 'QB系列',
        image: '../../static/production/QB.jpg'
      }, {
        name: 'QC系列',
        image: '../../static/production/QC.jpg'
      }, {
        name: 'QD系列',
        image: '../../static/production/QD.jpg'
      },{
        name: 'QH系列',
        image: '../../static/production/QH.jpg'
      },{
        name: 'QJ系列',
        image: '../../static/production/QJ.jpg'
      },{
        name: 'QM系列',
        image: '../../static/production/QM.jpg'
      },{
        name: 'QP系列',
        image: '../../static/production/QP.jpg'
      },{
        name: 'QS系列',
        image: '../../static/production/QS.jpg'
      },{
        name: 'QU系列',
        image: '../../static/production/QU.jpg'
      },{
        name: 'QV系列',
        image: '../../static/production/QV.jpg'
      },{
        name: 'QVY系列',
        image: '../../static/production/QVY.jpg'
      },{
        name: 'QW系列',
        image: '../../static/production/QW.jpg'
      },{
        name: 'QWL系列',
        image: '../../static/production/QWL.jpg'
      },{
        name: 'QWY系列',
        image: '../../static/production/QWY.jpg'
      },{
        name: 'QY系列',
        image: '../../static/production/QY.jpg'
      },]
        };
    },
    computed: {
        filteredProducts() {
            if (!this.searchKeyword) {
                return this.products;
            }
            return this.products.filter(product => 
                product.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
            );
        }
    },
    methods: {
        onProductClick(product) {
            // 存储当前选择的产品系列
            uni.setStorageSync('currentProductSeries', product.name);
            // 跳转到规格选择页面
            uni.navigateTo({
                url: '/pages/index/index'
            });
        }
    }
};
</script>

<style scoped>
.search-container {
    position: relative;
    padding: 10rpx 20rpx;
    background-color: #f5f5f5;
}

.search-input {
    width: 100%;
    height: 60rpx;
    background-color: white;
    border-radius: 30rpx;
	margin: 10rpx 0 0 0 ;
    padding: 0 40rpx 0 30rpx;
    font-size: 28rpx;
    border: 1rpx solid #e0e0e0;
    box-sizing: border-box;
}

.search-icon {
    position: absolute;
    right: 40rpx;
    top: 50%;
    transform: translateY(-50%);
    font-size: 32rpx;
    color: #999;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
    padding: 20rpx;
}

.product-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    background-color: white;
    border-radius: 10rpx;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.1);
}

.product-image {
    width: 180rpx;
    height: 180rpx;
    margin-bottom: 15rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    border-radius: 8rpx;
}

.product-img {
    width: 160rpx;
    height: 160rpx;
}

.product-name {
    font-size: 28rpx;
    color: #333;
    text-align: center;
    font-weight: 500;
}
</style>