import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'ant-design-vue/dist/reset.css';
import './style.css';
import router from './router';
import App from './App.vue';

const app = createApp(App);
app.use(Antd, { locale: zhCN });
app.use(router);
app.mount('#app');
