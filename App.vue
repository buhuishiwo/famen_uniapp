<script>
export default {
    data() {
        return {}
    },
    globalData: {
        loadingVisible: false,
        loadingText: '加载中...'
    },
    onLaunch() {
        if (wx.cloud) {
            wx.cloud.init({
                env: 'cloud1-d2g6k45v21dd52696',
                traceUser: true
            });
            console.log('云开发环境初始化成功');
        } else {
            console.warn('当前环境不支持云开发');
        }
    },
    onShow() {},
    onHide() {},
    showLoading(text = '加载中...') {
        this.globalData.loadingVisible = true;
        this.globalData.loadingText = text;
        uni.setStorageSync('loadingVisible', true);
        uni.setStorageSync('loadingText', text);
    },
    hideLoading() {
        this.globalData.loadingVisible = false;
        uni.setStorageSync('loadingVisible', false);
    }
};
</script>

<style>
page {
    background-color: #f5f5f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

view,
text,
button {
    box-sizing: border-box;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200rpx 0;
    box-sizing: border-box;
}
</style>