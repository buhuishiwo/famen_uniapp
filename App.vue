<script>
// app.js

export default {
    data() {
        return {}
    },
    globalData: {},
    onLaunch() {
        // 初始化微信云开发环境
        if (wx.cloud) {
            wx.cloud.init({
                // env: 'your-cloud-env-id', // 请替换为你的云环境ID
                env: 'cloud1-d2g6k45v21dd52696',      // TODO: 替换为实际的云环境ID
                traceUser: true
            });
            console.log('云开发环境初始化成功');
        } else {
            console.warn('当前环境不支持云开发');
        }
    }
};
</script>
<style>
/**app.wxss**/
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
