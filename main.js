import App from './App';

// 全局mixins，用于实现setData等功能，请勿删除！';
import zpMixins from '@/uni_modules/zp-mixins/index.js';
import i18n, { mixin as i18nMixin } from '@/locale';
import LanguageSwitch from '@/components/language-switch/language-switch.vue';

// #ifndef VUE3
import Vue from 'vue';

Vue.use(zpMixins);
Vue.mixin(i18nMixin);
Vue.component('language-switch', LanguageSwitch);

Vue.config.productionTip = false;
App.mpType = 'app';
const app = new Vue({
    ...App
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
    const app = createSSRApp(App);
    app.mixin(zpMixins);
    app.mixin(i18nMixin);
    app.component('language-switch', LanguageSwitch);
    return {
        app
    };
}
// #endif
