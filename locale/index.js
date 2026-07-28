import zhCN from './zh-CN.js';
import enUS from './en-US.js';

const LOCALE_STORAGE_KEY = 'app-language';

const messages = {
    'zh-CN': zhCN,
    'en-US': enUS
};

let currentLocale = 'zh-CN';

const listeners = [];

const getSystemLanguage = () => {
    try {
        const sysInfo = uni.getSystemInfoSync();
        const lang = sysInfo.language || 'zh-CN';
        return lang.startsWith('zh') ? 'zh-CN' : 'en-US';
    } catch (e) {
        return 'zh-CN';
    }
};

const initLocale = () => {
    const savedLang = uni.getStorageSync(LOCALE_STORAGE_KEY) || getSystemLanguage();
    currentLocale = savedLang;
};

initLocale();

export const translate = (key, params) => {
    const keys = key.split('.');
    let value = messages[currentLocale];
    
    for (const k of keys) {
        if (value && typeof value === 'object' && value[k] !== undefined) {
            value = value[k];
        } else {
            return key;
        }
    }
    
    if (typeof value === 'string' && params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
            return params[paramKey] !== undefined ? params[paramKey] : match;
        });
    }
    
    return value;
};

export const setLanguage = (lang) => {
    if (messages[lang]) {
        currentLocale = lang;
        uni.setStorageSync(LOCALE_STORAGE_KEY, lang);
        listeners.forEach(fn => {
            try { fn(lang); } catch (e) {}
        });
    }
};

export const getCurrentLanguage = () => {
    return currentLocale;
};

export const toggleLanguage = () => {
    const newLang = currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN';
    setLanguage(newLang);
    return newLang;
};

export const onChange = (fn) => {
    listeners.push(fn);
    return () => {
        const idx = listeners.indexOf(fn);
        if (idx > -1) listeners.splice(idx, 1);
    };
};

export const mixin = {
    data() {
        return {};
    },
    created() {
        this._i18nUnsubscribe = onChange(() => {
            this.$forceUpdate();
        });
    },
    beforeDestroy() {
        if (this._i18nUnsubscribe) {
            this._i18nUnsubscribe();
        }
    },
    methods: {
        $t(key, params) {
            return translate(key, params);
        },
        $localeOn(fn) {
            return onChange(fn);
        }
    }
};

export default {
    translate,
    setLanguage,
    getCurrentLanguage,
    toggleLanguage,
    onChange,
    mixin
};
