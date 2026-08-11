(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!*********************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var objectKeys = ['qy', 'env', 'error', 'version', 'lanDebug', 'cloud', 'serviceMarket', 'router', 'worklet', '__webpack_require_UNI_MP_PLUGIN__'];
var singlePageDisableKey = ['lanDebug', 'router', 'worklet'];
var target = typeof globalThis !== 'undefined' ? globalThis : function () {
  return this;
}();
var key = ['w', 'x'].join('');
var oldWx = target[key];
var launchOption = oldWx.getLaunchOptionsSync ? oldWx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof oldWx[key] === 'function';
}
function initWx() {
  var newWx = {};
  for (var _key in oldWx) {
    if (isWxKey(_key)) {
      // TODO wrapper function
      newWx[_key] = oldWx[_key];
    }
  }
  return newWx;
}
target[key] = initWx();
if (!target[key].canIUse('getAppBaseInfo')) {
  target[key].getAppBaseInfo = target[key].getSystemInfoSync;
}
if (!target[key].canIUse('getWindowInfo')) {
  target[key].getWindowInfo = target[key].getSystemInfoSync;
}
if (!target[key].canIUse('getDeviceInfo')) {
  target[key].getDeviceInfo = target[key].getSystemInfoSync;
}
var _default = target[key];
exports.default = _default;

/***/ }),
/* 2 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApp = createApp;
exports.createComponent = createComponent;
exports.createPage = createPage;
exports.createPlugin = createPlugin;
exports.createSubpackageApp = createSubpackageApp;
exports.default = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _construct2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/construct */ 15));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _uniI18n = __webpack_require__(/*! @dcloudio/uni-i18n */ 22);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var realAtob;
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== 'function') {
  realAtob = function realAtob(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, '');
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }

    // Adding the padding if missing, for semplicity
    str += '=='.slice(2 - (str.length & 3));
    var bitmap;
    var result = '';
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length;) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  // 注意atob只能在全局对象上调用，例如：`const Base64 = {atob};Base64.atob('xxxx')`是错误的用法
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
function getCurrentUserInfo() {
  var token = wx.getStorageSync('uni_id_token') || '';
  var tokenArr = token.split('.');
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  var userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error('获取当前用户信息出错，详细错误信息为：' + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1000;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(Vue) {
  Vue.prototype.uniIDHasRole = function (roleId) {
    var _getCurrentUserInfo = getCurrentUserInfo(),
      role = _getCurrentUserInfo.role;
    return role.indexOf(roleId) > -1;
  };
  Vue.prototype.uniIDHasPermission = function (permissionId) {
    var _getCurrentUserInfo2 = getCurrentUserInfo(),
      permission = _getCurrentUserInfo2.permission;
    return this.uniIDHasRole('admin') || permission.indexOf(permissionId) > -1;
  };
  Vue.prototype.uniIDTokenValid = function () {
    var _getCurrentUserInfo3 = getCurrentUserInfo(),
      tokenExpired = _getCurrentUserInfo3.tokenExpired;
    return tokenExpired > Date.now();
  };
}
var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isFn(fn) {
  return typeof fn === 'function';
}
function isStr(str) {
  return typeof str === 'string';
}
function isObject(obj) {
  return obj !== null && (0, _typeof2.default)(obj) === 'object';
}
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
function noop() {}

/**
 * Create a cached version of a pure function.
 */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
var HOOKS = ['invoke', 'success', 'fail', 'complete', 'returnValue'];
var globalInterceptors = {};
var scopedInterceptors = {};
function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}
function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}
function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}
function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}
function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}
function wrapperHook(hook, params) {
  return function (data) {
    return hook(data, params) || data;
  };
}
function isPromise(obj) {
  return !!obj && ((0, _typeof2.default)(obj) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
function queue(hooks, data, params) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      var res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {}
        };
      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    }
  };
}
function wrapperOptions(interceptor) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res, options).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, (0, _toConsumableArray2.default)(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options) {
  for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    params[_key - 3] = arguments[_key];
  }
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        // 重新访问 getApiInterceptorHooks, 允许 invoke 中再次调用 addInterceptor,removeInterceptor
        return api.apply(void 0, [wrapperOptions(getApiInterceptorHooks(method), options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}
var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return new Promise(function (resolve, reject) {
      res.then(function (res) {
        if (!res) {
          resolve(res);
          return;
        }
        if (res[0]) {
          reject(res[0]);
        } else {
          resolve(res[1]);
        }
      });
    });
  }
};
var SYNC_API_RE = /^\$|__f__|Window$|WindowStyle$|sendHostEvent|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|rpx2px|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getLocale|setLocale|invokePushCallback|getWindowInfo|getDeviceInfo|getAppBaseInfo|getSystemSetting|getAppAuthorizeSetting|initUTS|requireUTS|registerUTS|getFacialRecognitionMetaInfo/;
var CONTEXT_API_RE = /^create|Manager$/;

// Context例外情况
var CONTEXT_API_RE_EXC = ['createBLEConnection'];

// 同步例外情况
var ASYNC_API = ['createBLEConnection', 'createPushMessage'];
var CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}
function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).catch(function (err) {
    return [err];
  });
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}

/* eslint-disable no-extend-native */
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (callback) {
    var promise = this.constructor;
    return this.then(function (value) {
      return promise.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return promise.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };
}
function promisify(name, api) {
  if (!shouldPromise(name) || !isFn(api)) {
    return api;
  }
  return function promiseApi() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      params[_key2 - 1] = arguments[_key2];
    }
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, Object.assign({}, options)].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject
      })].concat(params));
    })));
  };
}
var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;
function checkDeviceWidth() {
  var windowWidth, pixelRatio, platform;
  {
    var windowInfo = typeof wx.getWindowInfo === 'function' && wx.getWindowInfo() ? wx.getWindowInfo() : wx.getSystemInfoSync();
    var deviceInfo = typeof wx.getDeviceInfo === 'function' && wx.getDeviceInfo() ? wx.getDeviceInfo() : wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}
function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}
var LOCALE_ZH_HANS = 'zh-Hans';
var LOCALE_ZH_HANT = 'zh-Hant';
var LOCALE_EN = 'en';
var LOCALE_FR = 'fr';
var LOCALE_ES = 'es';
var messages = {};
function getLocaleLanguage() {
  var localeLanguage = '';
  {
    var appBaseInfo = typeof wx.getAppBaseInfo === 'function' && wx.getAppBaseInfo() ? wx.getAppBaseInfo() : wx.getSystemInfoSync();
    var language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
var locale;
{
  locale = getLocaleLanguage();
}
function initI18nMessages() {
  if (!isEnableLocale()) {
    return;
  }
  var localeKeys = Object.keys(__uniConfig.locales);
  if (localeKeys.length) {
    localeKeys.forEach(function (locale) {
      var curMessages = messages[locale];
      var userMessages = __uniConfig.locales[locale];
      if (curMessages) {
        Object.assign(curMessages, userMessages);
      } else {
        messages[locale] = userMessages;
      }
    });
  }
}
initI18nMessages();
var i18n = (0, _uniI18n.initVueI18n)(locale, {});
var t = i18n.t;
var i18nMixin = i18n.mixin = {
  beforeCreate: function beforeCreate() {
    var _this = this;
    var unwatch = i18n.i18n.watchLocale(function () {
      _this.$forceUpdate();
    });
    this.$once('hook:beforeDestroy', function () {
      unwatch();
    });
  },
  methods: {
    $$t: function $$t(key, values) {
      return t(key, values);
    }
  }
};
var setLocale = i18n.setLocale;
var getLocale = i18n.getLocale;
function initAppLocale(Vue, appVm, locale) {
  var state = Vue.observable({
    locale: locale || i18n.getLocale()
  });
  var localeWatchers = [];
  appVm.$watchLocale = function (fn) {
    localeWatchers.push(fn);
  };
  Object.defineProperty(appVm, '$locale', {
    get: function get() {
      return state.locale;
    },
    set: function set(v) {
      state.locale = v;
      localeWatchers.forEach(function (watch) {
        return watch(v);
      });
    }
  });
}
function isEnableLocale() {
  return typeof __uniConfig !== 'undefined' && __uniConfig.locales && !!Object.keys(__uniConfig.locales).length;
}
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var lang = startsWith(locale, [LOCALE_EN, LOCALE_FR, LOCALE_ES]);
  if (lang) {
    return lang;
  }
}
// export function initI18n() {
//   const localeKeys = Object.keys(__uniConfig.locales || {})
//   if (localeKeys.length) {
//     localeKeys.forEach((locale) =>
//       i18n.add(locale, __uniConfig.locales[locale])
//     )
//   }
// }

function getLocale$1() {
  // 优先使用 $locale
  if (isFn(getApp)) {
    var app = getApp({
      allowDefault: true
    });
    if (app && app.$vm) {
      return app.$vm.$locale;
    }
  }
  return getLocaleLanguage();
}
function setLocale$1(locale) {
  var app = isFn(getApp) ? getApp() : false;
  if (!app) {
    return false;
  }
  var oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach(function (fn) {
      return fn({
        locale: locale
      });
    });
    return true;
  }
  return false;
}
var onLocaleChangeCallbacks = [];
function onLocaleChange(fn) {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
}
if (typeof global !== 'undefined') {
  global.getLocale = getLocale$1;
}
var interceptors = {
  promiseInterceptor: promiseInterceptor
};
var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  rpx2px: upx2px,
  getLocale: getLocale$1,
  setLocale: setLocale$1,
  onLocaleChange: onLocaleChange,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor,
  interceptors: interceptors
});
function findExistsPageIndex(url) {
  var pages = getCurrentPages();
  var len = pages.length;
  while (len--) {
    var page = pages[len];
    if (page.$page && page.$page.fullPath === url) {
      return len;
    }
  }
  return -1;
}
var redirectTo = {
  name: function name(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.delta) {
      return 'navigateBack';
    }
    return 'redirectTo';
  },
  args: function args(fromArgs) {
    if (fromArgs.exists === 'back' && fromArgs.url) {
      var existsPageIndex = findExistsPageIndex(fromArgs.url);
      if (existsPageIndex !== -1) {
        var delta = getCurrentPages().length - 1 - existsPageIndex;
        if (delta > 0) {
          fromArgs.delta = delta;
        }
      }
    }
  }
};
var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(function (item, index) {
        return index < currentIndex ? item !== urls[currentIndex] : true;
      });
    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
var UUID_KEY = '__DC_STAT_UUID';
var deviceId;
function useDeviceId(result) {
  deviceId = deviceId || wx.getStorageSync(UUID_KEY);
  if (!deviceId) {
    deviceId = Date.now() + '' + Math.floor(Math.random() * 1e7);
    wx.setStorage({
      key: UUID_KEY,
      data: deviceId
    });
  }
  result.deviceId = deviceId;
}
function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  /**
   * system 枚举值说明：
   *
   * weixin: 操作系统及版本
   * qq: 操作系统及版本
   * kuaishou: 操作系统及版本
   *
   * alipay、dingding: 系统版本
   * baidu: 操作系统版本
   * toutiao/douyin: 操作系统版本
   * jd: 操作系统版本
   * harmony: 操作系统版本
   *
   * lark: 文档无此字段
   */
  var osName = '';
  var osVersion = '';
  if (platform && "mp-weixin" === 'mp-harmony') {
    osName = platform;
    osVersion = system;
    system = "".concat(osName, " ").concat(osVersion);
  } else {
    {
      osName = platform;
    }
    osVersion = system.split(' ')[1] || '';
  }
  osName = osName.toLocaleLowerCase();
  switch (osName) {
    case 'harmony': // alipay
    case 'ohos': // weixin harmony
    case 'openharmonyos': // weixin 由 HarmonyOS 改为了 OpenHarmonyOS
    case 'openharmony':
      // feishu
      osName = 'harmonyos';
      break;
    case 'iphone os':
      // alipay
      osName = 'ios';
      break;
    case 'mac': // weixin qq
    case 'darwin':
      // feishu
      osName = 'macos';
      break;
    case 'windows_nt':
      // feishu
      osName = 'windows';
      break;
  }
  return {
    osName: osName,
    osVersion: osVersion,
    system: system
  };
}
function getPlatform(platform) {
  /**
   * platform 枚举值说明：
   *
   * weixin：ios、android、windows、mac、ohos、ohos_pc、devtools
   * alipay、dingding：Android，iOS / iPhone OS，Harmony
   * harmony: 固定 ohos
   *
   * toutiao: Android，iOS 无 harmony 平台，暂不处理
   * lark: 'pc' | 'mobile' | 'android' | 'ios', 无 harmony 平台，暂不处理
   *
   * baidu：无相关描述
   * qq: 无相关描述
   * kuaishou: 无相关描述
   * jd: 无相关描述
   */
  platform = platform.toLowerCase();
  {
    if (platform === 'ohos') {
      platform = 'harmonyos';
    }
  }
  return platform;
}
function populateParameters(result) {
  var _result$brand = result.brand,
    brand = _result$brand === void 0 ? '' : _result$brand,
    _result$model = result.model,
    model = _result$model === void 0 ? '' : _result$model,
    _result$system = result.system,
    system = _result$system === void 0 ? '' : _result$system,
    _result$language = result.language,
    language = _result$language === void 0 ? '' : _result$language,
    theme = result.theme,
    version = result.version,
    platform = result.platform,
    fontSizeSetting = result.fontSizeSetting,
    SDKVersion = result.SDKVersion,
    pixelRatio = result.pixelRatio,
    deviceOrientation = result.deviceOrientation;
  // const isQuickApp = "mp-weixin".indexOf('quickapp-webview') !== -1

  var extraParam = {};

  // osName osVersion
  var _getOSInfo = getOSInfo(system, platform),
    osName = _getOSInfo.osName,
    osVersion = _getOSInfo.osVersion,
    updatedSystem = _getOSInfo.system;
  var hostVersion = version;

  // deviceType
  var deviceType = getGetDeviceType(result, model);

  // deviceModel
  var deviceBrand = getDeviceBrand(brand);

  // hostName
  var _hostName = getHostName(result);

  // deviceOrientation
  var _deviceOrientation = deviceOrientation; // 仅 微信 百度 支持

  // devicePixelRatio
  var _devicePixelRatio = pixelRatio;

  // SDKVersion
  var _SDKVersion = SDKVersion;

  // hostLanguage
  var hostLanguage = (language || '').replace(/_/g, '-');

  // wx.getAccountInfoSync

  var parameters = {
    appId: "__UNI__41290F1",
    appName: "famen",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "5.15",
    uniCompilerVersion: "5.15",
    uniRuntimeVersion: "5.15",
    uniPlatform: undefined || "mp-weixin",
    deviceBrand: deviceBrand,
    deviceModel: model,
    deviceType: deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName: osName.toLocaleLowerCase(),
    osVersion: osVersion,
    hostTheme: theme,
    hostVersion: hostVersion,
    hostLanguage: hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    platform: getPlatform(platform),
    system: updatedSystem,
    // TODO
    osLanguage: undefined,
    osTheme: undefined,
    ua: undefined,
    hostPackageName: undefined,
    browserName: undefined,
    browserVersion: undefined,
    isUniAppX: false
  };
  Object.assign(result, parameters, extraParam);
}
function getGetDeviceType(result, model) {
  var platform = result.platform || '';
  var deviceType = result.deviceType || 'phone';
  {
    var deviceTypeMaps = {
      ipad: 'pad',
      windows: 'pc',
      mac: 'pc',
      linux: 'pc',
      pc: 'pc'
    };
    var deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    var _model = model.toLocaleLowerCase();
    for (var index = 0; index < deviceTypeMapsKeys.length; index++) {
      var _m = deviceTypeMapsKeys[index];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  {
    if (platform === 'ohos_pc') {
      deviceType = 'pc';
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  var deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = brand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale$1 ? getLocale$1() : defaultLanguage;
}
function getHostName(result) {
  var _platform = 'WeChat';
  var _hostName = result.hostName || _platform; // mp-jd
  {
    if (result.environment) {
      _hostName = result.environment;
    } else if (result.host && result.host.env) {
      _hostName = result.host.env;
    }
  }
  return _hostName;
}
var getSystemInfo = {
  returnValue: function returnValue(result) {
    useDeviceId(result);
    addSafeAreaInsets(result);
    populateParameters(result);
  }
};
var showActionSheet = {
  args: function args(fromArgs) {
    if ((0, _typeof2.default)(fromArgs) === 'object') {
      fromArgs.alertText = fromArgs.title;
    }
  }
};
var getAppBaseInfo = {
  returnValue: function returnValue(result) {
    var _result = result,
      version = _result.version,
      language = _result.language,
      SDKVersion = _result.SDKVersion,
      theme = _result.theme;
    var _hostName = getHostName(result);
    var hostLanguage = (language || '').replace('_', '-');
    var parameters = {
      appId: "__UNI__41290F1",
      appName: "famen",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version,
      hostLanguage: hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      isUniAppX: false,
      uniPlatform: undefined || "mp-weixin",
      uniCompileVersion: "5.15",
      uniCompilerVersion: "5.15",
      uniRuntimeVersion: "5.15"
    };
    try {
      if (typeof wx.getAccountInfoSync === 'function') {
        parameters.packagename = wx.getAccountInfoSync().miniProgram.appId;
      }
    } catch (e) {}
    result = Object.assign(result, parameters);
  }
};

/**
 * 目前仅 weixin、toutiao/douyin 支持 deviceInfo。
 * system: 操作系统及版本
 */
var getDeviceInfo = {
  returnValue: function returnValue(result) {
    var _result2 = result,
      brand = _result2.brand,
      model = _result2.model,
      _result2$system = _result2.system,
      system = _result2$system === void 0 ? '' : _result2$system,
      _result2$platform = _result2.platform,
      platform = _result2$platform === void 0 ? '' : _result2$platform;
    var deviceType = getGetDeviceType(result, model);
    var deviceBrand = getDeviceBrand(brand);
    useDeviceId(result);
    var _getOSInfo2 = getOSInfo(system, platform),
      osName = _getOSInfo2.osName,
      osVersion = _getOSInfo2.osVersion;
    result = Object.assign(result, {
      deviceType: deviceType,
      deviceBrand: deviceBrand,
      deviceModel: model,
      osName: osName,
      osVersion: osVersion,
      platform: getPlatform(platform)
    });
  }
};
var getWindowInfo = {
  returnValue: function returnValue(result) {
    addSafeAreaInsets(result);
    result = Object.assign(result, {
      windowTop: 0,
      windowBottom: 0
    });
  }
};
var getAppAuthorizeSetting = {
  returnValue: function returnValue(result) {
    var locationReducedAccuracy = result.locationReducedAccuracy;
    result.locationAccuracy = 'unsupported';
    if (locationReducedAccuracy === true) {
      result.locationAccuracy = 'reduced';
    } else if (locationReducedAccuracy === false) {
      result.locationAccuracy = 'full';
    }
  }
};

// import navigateTo from 'uni-helpers/navigate-to'

var compressImage = {
  args: function args(fromArgs) {
    // https://developers.weixin.qq.com/community/develop/doc/000c08940c865011298e0a43256800?highLine=compressHeight
    if (fromArgs.compressedHeight && !fromArgs.compressHeight) {
      fromArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !fromArgs.compressWidth) {
      fromArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = {
  redirectTo: redirectTo,
  // navigateTo,  // 由于在微信开发者工具的页面参数，会显示__id__参数，因此暂时关闭mp-weixin对于navigateTo的AOP
  previewImage: previewImage,
  getSystemInfo: getSystemInfo,
  getSystemInfoSync: getSystemInfo,
  showActionSheet: showActionSheet,
  getAppBaseInfo: getAppBaseInfo,
  getDeviceInfo: getDeviceInfo,
  getWindowInfo: getWindowInfo,
  getAppAuthorizeSetting: getAppAuthorizeSetting,
  compressImage: compressImage
};
var todos = ['vibrate', 'preloadPage', 'unPreloadPage', 'loadSubPackage'];
var canIUses = [];
var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];
function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}
function processArgs(methodName, fromArgs) {
  var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {
    // 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {
          // 不支持的参数
          console.warn("The '".concat(methodName, "' method of platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support option '").concat(key, "'"));
        } else if (isStr(keyOption)) {
          // 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {
          // {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        if (isFn(fromArgs[key])) {
          toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
        }
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}
function processReturnValue(methodName, res, returnValue) {
  var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {
    // 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}
function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {
      // 暂不支持的 api
      return function () {
        console.error("Platform '\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F' does not support '".concat(methodName, "'."));
      };
    }
    return function (arg1, arg2) {
      // 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      if (isFn(options.name)) {
        methodName = options.name(arg1);
      } else if (isStr(options.name)) {
        methodName = options.name;
      }
      var returnValue = wx[methodName].apply(wx, args);
      if (isSyncApi(methodName)) {
        // 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}
var todoApis = Object.create(null);
var TODOS = ['onTabBarMidButtonTap', 'subscribePush', 'unsubscribePush', 'onPush', 'offPush', 'share'];
function createTodoApi(name) {
  return function todoApi(_ref) {
    var fail = _ref.fail,
      complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail method '").concat(name, "' not supported")
    };
    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}
TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});
var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin']
};
function getProvider(_ref2) {
  var service = _ref2.service,
    success = _ref2.success,
    fail = _ref2.fail,
    complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service]
    };
    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail service not found'
    };
    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}
var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider
});
var getEmitter = function () {
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();
function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}
function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}
var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit
});

/**
 * 框架内 try-catch
 */
/**
 * 开发者 try-catch
 */
function tryCatch(fn) {
  return function () {
    try {
      return fn.apply(fn, arguments);
    } catch (e) {
      // TODO
      console.error(e);
    }
  };
}
function getApiCallbacks(params) {
  var apiCallbacks = {};
  for (var name in params) {
    var param = params[name];
    if (isFn(param)) {
      apiCallbacks[name] = tryCatch(param);
      delete params[name];
    }
  }
  return apiCallbacks;
}
var cid;
var cidErrMsg;
var enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e) {}
  return message;
}
function invokePushCallback(args) {
  if (args.type === 'enabled') {
    enabled = true;
  } else if (args.type === 'clientId') {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === 'pushMsg') {
    var message = {
      type: 'receive',
      data: normalizePushMessage(args.message)
    };
    for (var i = 0; i < onPushMessageCallbacks.length; i++) {
      var callback = onPushMessageCallbacks[i];
      callback(message);
      // 该消息已被阻止
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === 'click') {
    onPushMessageCallbacks.forEach(function (callback) {
      callback({
        type: 'click',
        data: normalizePushMessage(args.message)
      });
    });
  }
}
var getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid, errMsg) {
  getPushCidCallbacks.forEach(function (callback) {
    callback(cid, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
function getPushClientId(args) {
  if (!isPlainObject(args)) {
    args = {};
  }
  var _getApiCallbacks = getApiCallbacks(args),
    success = _getApiCallbacks.success,
    fail = _getApiCallbacks.fail,
    complete = _getApiCallbacks.complete;
  var hasSuccess = isFn(success);
  var hasFail = isFn(fail);
  var hasComplete = isFn(complete);
  Promise.resolve().then(function () {
    if (typeof enabled === 'undefined') {
      enabled = false;
      cid = '';
      cidErrMsg = 'uniPush is not enabled';
    }
    getPushCidCallbacks.push(function (cid, errMsg) {
      var res;
      if (cid) {
        res = {
          errMsg: 'getPushClientId:ok',
          cid: cid
        };
        hasSuccess && success(res);
      } else {
        res = {
          errMsg: 'getPushClientId:fail' + (errMsg ? ' ' + errMsg : '')
        };
        hasFail && fail(res);
      }
      hasComplete && complete(res);
    });
    if (typeof cid !== 'undefined') {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
}
var onPushMessageCallbacks = [];
// 不使用 defineOnApi 实现，是因为 defineOnApi 依赖 UniServiceJSBridge ，该对象目前在小程序上未提供，故简单实现
var onPushMessage = function onPushMessage(fn) {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
var offPushMessage = function offPushMessage(fn) {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    var index = onPushMessageCallbacks.indexOf(fn);
    if (index > -1) {
      onPushMessageCallbacks.splice(index, 1);
    }
  }
};
function __f__(type) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }
  console[type].apply(console, args);
}
var baseInfo = wx.getAppBaseInfo && wx.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx.getSystemInfoSync();
}
var host = baseInfo ? baseInfo.host : null;
var shareVideoMessage = host && host.env === 'SAAASDK' ? wx.miniapp.shareVideoMessage : wx.shareVideoMessage;
var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  shareVideoMessage: shareVideoMessage,
  getPushClientId: getPushClientId,
  onPushMessage: onPushMessage,
  offPushMessage: offPushMessage,
  invokePushCallback: invokePushCallback,
  __f__: __f__
});
var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];
function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function initBehavior(options) {
  return Behavior(options);
}
function isPage() {
  return !!this.route;
}
function initRelation(detail) {
  this.triggerEvent('__l', detail);
}
function selectAllComponents(mpInstance, selector, $refs) {
  var components = mpInstance.selectAllComponents(selector) || [];
  components.forEach(function (component) {
    var ref = component.dataset.ref;
    $refs[ref] = component.$vm || toSkip(component);
    {
      if (component.dataset.vueGeneric === 'scoped') {
        component.selectAllComponents('.scoped-ref').forEach(function (scopedComponent) {
          selectAllComponents(scopedComponent, selector, $refs);
        });
      }
    }
  });
}
function syncRefs(refs, newRefs) {
  var oldKeys = (0, _construct2.default)(Set, (0, _toConsumableArray2.default)(Object.keys(refs)));
  var newKeys = Object.keys(newRefs);
  newKeys.forEach(function (key) {
    var oldValue = refs[key];
    var newValue = newRefs[key];
    if (Array.isArray(oldValue) && Array.isArray(newValue) && oldValue.length === newValue.length && newValue.every(function (value) {
      return oldValue.includes(value);
    })) {
      return;
    }
    refs[key] = newValue;
    oldKeys.delete(key);
  });
  oldKeys.forEach(function (key) {
    delete refs[key];
  });
  return refs;
}
function initRefs(vm) {
  var mpInstance = vm.$scope;
  var refs = {};
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      selectAllComponents(mpInstance, '.vue-ref', $refs);
      // TODO 暂不考虑 for 中的 scoped
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for') || [];
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || toSkip(component));
      });
      return syncRefs(refs, $refs);
    }
  });
}
function handleLink(event) {
  var _ref3 = event.detail || event.value,
    vuePid = _ref3.vuePid,
    vueOptions = _ref3.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  vueOptions.parent = parentVm;
}
function markMPComponent(component) {
  // 在 Vue 中标记为小程序组件
  var IS_MP = '__v_isMPComponent';
  Object.defineProperty(component, IS_MP, {
    configurable: true,
    enumerable: false,
    value: true
  });
  return component;
}
function toSkip(obj) {
  var OB = '__ob__';
  var SKIP = '__v_skip';
  if (isObject(obj) && Object.isExtensible(obj)) {
    // 避免被 @vue/composition-api 观测
    Object.defineProperty(obj, OB, {
      configurable: true,
      enumerable: false,
      value: (0, _defineProperty2.default)({}, SKIP, true)
    });
  }
  return obj;
}
var WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach(function (name) {
      var matches = name.match(WORKLET_RE);
      if (matches) {
        var workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
var MPPage = Page;
var MPComponent = Component;
var customizeRE = /:/g;
var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});
function initTriggerEvent(mpInstance) {
  var oldTriggerEvent = mpInstance.triggerEvent;
  var newTriggerEvent = function newTriggerEvent(event) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    // 事件名统一转驼峰格式，仅处理：当前组件为 vue 组件、当前组件为 vue 组件子组件
    if (this.$vm || this.dataset && this.dataset.comType) {
      event = customize(event);
    } else {
      // 针对微信/QQ小程序单独补充驼峰格式事件，以兼容历史项目
      var newEvent = customize(event);
      if (newEvent !== event) {
        oldTriggerEvent.apply(this, [newEvent].concat(args));
      }
    }
    return oldTriggerEvent.apply(this, [event].concat(args));
  };
  try {
    // 京东小程序 triggerEvent 为只读
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initHook(name, options, isComponent) {
  var oldHook = options[name];
  options[name] = function () {
    markMPComponent(this);
    initTriggerEvent(this);
    if (oldHook) {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return oldHook.apply(this, args);
    }
  };
}
if (!MPPage.__$wrappered) {
  MPPage.__$wrappered = true;
  Page = function Page() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('onLoad', options);
    return MPPage(options);
  };
  Page.after = MPPage.after;
  Component = function Component() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    initHook('created', options);
    return MPComponent(options);
  };
}
var PAGE_EVENT_HOOKS = ['onPullDownRefresh', 'onReachBottom', 'onAddToFavorites', 'onShareTimeline', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap'];
function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}
function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }
  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }
  vueOptions = vueOptions.default || vueOptions;
  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super && vueOptions.super.options && Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }
  if (isFn(vueOptions[hook]) || Array.isArray(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {
      return hasHook(hook, mixin);
    });
  }
}
function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}
function initUnknownHooks(mpOptions, vueOptions) {
  var excludes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  findHooks(vueOptions).forEach(function (hook) {
    return initHook$1(mpOptions, hook, excludes);
  });
}
function findHooks(vueOptions) {
  var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  if (vueOptions) {
    Object.keys(vueOptions).forEach(function (name) {
      if (name.indexOf('on') === 0 && isFn(vueOptions[name])) {
        hooks.push(name);
      }
    });
  }
  return hooks;
}
function initHook$1(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function (args) {
      return this.$vm && this.$vm.__call_hook(hook, args);
    };
  }
}
function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  vueOptions = VueComponent.options;
  return [VueComponent, vueOptions];
}
function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}
function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;
  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}
function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};
  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"famen","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }
  if (!isPlainObject(data)) {
    data = {};
  }
  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });
  return data;
}
var PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions.behaviors;
  var vueExtends = vueOptions.extends;
  var vueMixins = vueOptions.mixins;
  var vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps.name = {
            type: String,
            default: ''
          };
          vueProps.value = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ''
          };
        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(initBehavior({
      properties: initProperties(vueExtends.props, true)
    }));
  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(initBehavior({
          properties: initProperties(vueMixin.props, true)
        }));
      }
    });
  }
  return behaviors;
}
function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function initProperties(props) {
  var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var options = arguments.length > 3 ? arguments[3] : undefined;
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: ''
    };
    {
      if (options.virtualHost) {
        properties.virtualHostStyle = {
          type: null,
          value: ''
        };
        properties.virtualHostClass = {
          type: null,
          value: ''
        };
      }
    }
    // scopedSlotsCompiler auto
    properties.scopedSlotsCompiler = {
      type: String,
      value: ''
    };
    properties.vueSlots = {
      // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots
        });
      }
    };
  }
  if (Array.isArray(props)) {
    // ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key)
      };
    });
  } else if (isPlainObject(props)) {
    // {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {
        // title:{type:String,default:''}
        var value = opts.default;
        if (isFn(value)) {
          value = value();
        }
        opts.type = parsePropType(key, opts.type);
        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key)
        };
      } else {
        // content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key)
        };
      }
    });
  }
  return properties;
}
function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}
  event.stopPropagation = noop;
  event.preventDefault = noop;
  event.target = event.target || {};
  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }
  if (hasOwn(event, 'markerId')) {
    event.detail = (0, _typeof2.default)(event.detail) === 'object' ? event.detail : {};
    event.detail.markerId = event.markerId;
  }
  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }
  return event;
}
function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {
      // ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];
      var vFor;
      if (Number.isInteger(dataPath)) {
        vFor = dataPath;
      } else if (!dataPath) {
        vFor = context;
      } else if (typeof dataPath === 'string' && dataPath) {
        if (dataPath.indexOf('#s#') === 0) {
          vFor = dataPath.substr(3);
        } else {
          vFor = vm.__get_value(dataPath, context);
        }
      }
      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }
      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}
function processEventExtra(vm, extra, event, __args__) {
  var extraObj = {};
  if (Array.isArray(extra) && extra.length) {
    /**
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *[
     *    ['data.items', 'data.id', item.data.id],
     *    ['metas', 'id', meta.id]
     *],
     *'test'
     */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {
          // model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {
            // $event
            extraObj['$' + index] = event;
          } else if (dataPath === 'arguments') {
            extraObj['$' + index] = event.detail ? event.detail.__args__ || __args__ : __args__;
          } else if (dataPath.indexOf('$event.') === 0) {
            // $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }
  return extraObj;
}
function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}
function processEventArgs(vm, event) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var isCustom = arguments.length > 4 ? arguments[4] : undefined;
  var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象

  // fixed 用户直接触发 mpInstance.triggerEvent
  var __args__ = isPlainObject(event.detail) ? event.detail.__args__ || [event.detail] : [event.detail];
  if (isCustom) {
    // 自定义事件
    isCustomMPEvent = event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {
      // 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return __args__;
    }
  }
  var extraObj = processEventExtra(vm, extra, event, __args__);
  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {
        // input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(__args__[0]);
        } else {
          // wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });
  return ret;
}
var ONCE = '~';
var CUSTOM = '^';
function isMatchEventType(eventType, optType) {
  return eventType === optType || optType === 'regionchange' && (eventType === 'begin' || eventType === 'end');
}
function getContextVm(vm) {
  var $parent = vm.$parent;
  // 父组件是 scoped slots 或者其他自定义组件时继续查找
  while ($parent && $parent.$parent && ($parent.$options.generic || $parent.$parent.$options.generic || $parent.$scope._$vuePid)) {
    $parent = $parent.$parent;
  }
  return $parent && $parent.$parent;
}
function handleEvent(event) {
  var _this2 = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn('事件信息不存在');
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn('事件信息不存在');
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;
  var ret = [];
  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];
    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;
    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this2.$vm;
          if (handlerCtx.$options.generic) {
            // mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = getContextVm(handlerCtx) || handlerCtx;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx, processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName));
            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            var _type = _this2.$vm.mpType === 'page' ? 'Page' : 'Component';
            var path = _this2.route || _this2.is;
            throw new Error("".concat(_type, " \"").concat(path, "\" does not have a method \"").concat(methodName, "\""));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          var params = processEventArgs(_this2.$vm, event, eventArray[1], eventArray[2], isCustom, methodName);
          params = Array.isArray(params) ? params : [];
          // 参数尾部增加原始事件对象用于复杂表达式内获取额外数据
          if (/=\s*\S+\.eventParams\s*\|\|\s*\S+\[['"]event-params['"]\]/.test(handler.toString())) {
            // eslint-disable-next-line no-sparse-arrays
            params = params.concat([,,,,,,,,,, event]);
          }
          ret.push(handler.apply(handlerCtx, params));
        }
      });
    }
  });
  if (eventType === 'input' && ret.length === 1 && typeof ret[0] !== 'undefined') {
    return ret[0];
  }
}
var eventChannels = {};
function getEventChannel(id) {
  var eventChannel = eventChannels[id];
  delete eventChannels[id];
  return eventChannel;
}
var hooks = ['onShow', 'onHide', 'onError', 'onPageNotFound', 'onThemeChange', 'onUnhandledRejection'];
function initEventChannel() {
  _vue.default.prototype.getOpenerEventChannel = function () {
    // 微信小程序使用自身getOpenerEventChannel
    {
      return this.$scope.getOpenerEventChannel();
    }
  };
  var callHook = _vue.default.prototype.__call_hook;
  _vue.default.prototype.__call_hook = function (hook, args) {
    if (hook === 'onLoad' && args && args.__id__) {
      this.__eventChannel__ = getEventChannel(args.__id__);
      delete args.__id__;
    }
    return callHook.call(this, hook, args);
  };
}
function initScopedSlotsParams() {
  var center = {};
  var parents = {};
  function currentId(fn) {
    var vueIds = this.$options.propsData.vueId;
    if (vueIds) {
      var vueId = vueIds.split(',')[0];
      fn(vueId);
    }
  }
  _vue.default.prototype.$hasSSP = function (vueId) {
    var slot = center[vueId];
    if (!slot) {
      parents[vueId] = this;
      this.$on('hook:destroyed', function () {
        delete parents[vueId];
      });
    }
    return slot;
  };
  _vue.default.prototype.$getSSP = function (vueId, name, needAll) {
    var slot = center[vueId];
    if (slot) {
      var params = slot[name] || [];
      if (needAll) {
        return params;
      }
      return params[0];
    }
  };
  _vue.default.prototype.$setSSP = function (name, value) {
    var index = 0;
    currentId.call(this, function (vueId) {
      var slot = center[vueId];
      var params = slot[name] = slot[name] || [];
      params.push(value);
      index = params.length - 1;
    });
    return index;
  };
  _vue.default.prototype.$initSSP = function () {
    currentId.call(this, function (vueId) {
      center[vueId] = {};
    });
  };
  _vue.default.prototype.$callSSP = function () {
    currentId.call(this, function (vueId) {
      if (parents[vueId]) {
        parents[vueId].$forceUpdate();
      }
    });
  };
  _vue.default.mixin({
    destroyed: function destroyed() {
      var propsData = this.$options.propsData;
      var vueId = propsData && propsData.vueId;
      if (vueId) {
        delete center[vueId];
        delete parents[vueId];
      }
    }
  });
}
function parseBaseApp(vm, _ref4) {
  var mocks = _ref4.mocks,
    initRefs = _ref4.initRefs;
  initEventChannel();
  {
    initScopedSlotsParams();
  }
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }
  uniIdMixin(_vue.default);
  _vue.default.prototype.mpHost = "mp-weixin";
  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }
      this.mpType = this.$options.mpType;
      this.$mp = (0, _defineProperty2.default)({
        data: {}
      }, this.mpType, this.$options.mpInstance);
      this.$scope = this.$options.mpInstance;
      delete this.$options.mpType;
      delete this.$options.mpInstance;
      if (this.mpType === 'page' && typeof getApp === 'function') {
        // hack vue-i18n
        var app = getApp();
        if (app.$vm && app.$vm.$i18n) {
          this._i18n = app.$vm.$i18n;
        }
      }
      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    }
  });
  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {
        // 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (wx.canIUse && !wx.canIUse('nextTick')) {
          // 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }
      this.$vm = vm;
      this.$vm.$mp = {
        app: this
      };
      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;
      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);
      this.$vm.__call_hook('onLaunch', args);
    }
  };

  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }
  initAppLocale(_vue.default, vm, getLocaleLanguage$1());
  initHooks(appOptions, hooks);
  initUnknownHooks(appOptions, vm.$options);
  return appOptions;
}
function getLocaleLanguage$1() {
  var localeLanguage = '';
  {
    var appBaseInfo = wx.getAppBaseInfo();
    var language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs
  });
}
function createApp(vm) {
  App(parseApp(vm));
  return vm;
}
var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function encodeReserveReplacer(c) {
  return '%' + c.charCodeAt(0).toString(16);
};
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function encode(str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};
function stringifyQuery(obj) {
  var encodeStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : encode;
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];
    if (val === undefined) {
      return '';
    }
    if (val === null) {
      return encodeStr(key);
    }
    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return;
        }
        if (val2 === null) {
          result.push(encodeStr(key));
        } else {
          result.push(encodeStr(key) + '=' + encodeStr(val2));
        }
      });
      return result.join('&');
    }
    return encodeStr(key) + '=' + encodeStr(val);
  }).filter(function (x) {
    return x.length > 0;
  }).join('&') : null;
  return res ? "?".concat(res) : '';
}
function parseBaseComponent(vueComponentOptions) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    isPage = _ref5.isPage,
    initRelation = _ref5.initRelation;
  var needVueOptions = arguments.length > 2 ? arguments[2] : undefined;
  var _initVueComponent = initVueComponent(_vue.default, vueComponentOptions),
    _initVueComponent2 = (0, _slicedToArray2.default)(_initVueComponent, 2),
    VueComponent = _initVueComponent2[0],
    vueOptions = _initVueComponent2[1];
  var options = _objectSpread({
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true
  }, vueOptions.options || {});
  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin'].options) {
      Object.assign(options, vueOptions['mp-weixin'].options);
    }
  }
  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file, options),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;
        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties
        };
        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options
        });

        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      }
    },
    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      }
    },
    methods: {
      __l: handleLink,
      __e: handleEvent
    }
  };
  // externalClasses
  if (vueOptions.externalClasses) {
    componentOptions.externalClasses = vueOptions.externalClasses;
  }
  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }
  if (needVueOptions) {
    return [componentOptions, vueOptions, VueComponent];
  }
  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}
function parseComponent(vueComponentOptions, needVueOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation
  }, needVueOptions);
}
var hooks$1 = ['onShow', 'onHide', 'onUnload'];
hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);
function parseBasePage(vuePageOptions) {
  var _parseComponent = parseComponent(vuePageOptions, true),
    _parseComponent2 = (0, _slicedToArray2.default)(_parseComponent, 2),
    pageOptions = _parseComponent2[0],
    vueOptions = _parseComponent2[1];
  initHooks(pageOptions.methods, hooks$1, vueOptions);
  pageOptions.methods.onLoad = function (query) {
    this.options = query;
    var copyQuery = Object.assign({}, query);
    delete copyQuery.__id__;
    this.$page = {
      fullPath: '/' + (this.route || this.is) + stringifyQuery(copyQuery)
    };
    this.$vm.$mp.query = query; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', query);
  };
  {
    initUnknownHooks(pageOptions.methods, vuePageOptions, ['onReady']);
  }
  {
    initWorkletMethods(pageOptions.methods, vueOptions.methods);
  }
  return pageOptions;
}
function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions);
}
function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}
function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}
function createSubpackageApp(vm) {
  var appOptions = parseApp(vm);
  var app = getApp({
    allowDefault: true
  });
  vm.$scope = app;
  var globalData = app.globalData;
  if (globalData) {
    Object.keys(appOptions.globalData).forEach(function (name) {
      if (!hasOwn(globalData, name)) {
        globalData[name] = appOptions.globalData[name];
      }
    });
  }
  Object.keys(appOptions).forEach(function (name) {
    if (!hasOwn(app, name)) {
      app[name] = appOptions[name];
    }
  });
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
function createPlugin(vm) {
  var appOptions = parseApp(vm);
  if (isFn(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow(function () {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      vm.__call_hook('onShow', args);
    });
  }
  if (isFn(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide(function () {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      vm.__call_hook('onHide', args);
    });
  }
  if (isFn(appOptions.onLaunch)) {
    var args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    vm.__call_hook('onLaunch', args);
  }
  return vm;
}
todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});
canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name : canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});
var uni = {};
if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (hasOwn(target, name)) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    }
  });
} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });
  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, extraApi[name]);
    });
  }
  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });
  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });
  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}
wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;
wx.createSubpackageApp = createSubpackageApp;
wx.createPlugin = createPlugin;
var uni$1 = uni;
var _default = uni$1;
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 5 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/slicedToArray.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(/*! ./arrayWithHoles.js */ 6);
var iterableToArrayLimit = __webpack_require__(/*! ./iterableToArrayLimit.js */ 7);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableRest = __webpack_require__(/*! ./nonIterableRest.js */ 10);
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 6 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithHoles.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 7 */
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArrayLimit.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0) {
        ;
      }
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 8 */
/*!***************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 9 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayLikeToArray.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 10 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableRest.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 11 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/defineProperty.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 12 */
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPropertyKey.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
var toPrimitive = __webpack_require__(/*! ./toPrimitive.js */ 14);
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 13 */
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(o) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 14 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toPrimitive.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 15 */
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/construct.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(/*! ./setPrototypeOf.js */ 16);
var isNativeReflectConstruct = __webpack_require__(/*! ./isNativeReflectConstruct.js */ 17);
function _construct(t, e, r) {
  if (isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && setPrototypeOf(p, r.prototype), p;
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 16 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/setPrototypeOf.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 17 */
/*!*************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/isNativeReflectConstruct.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (module.exports = _isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 18 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/toConsumableArray.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithoutHoles = __webpack_require__(/*! ./arrayWithoutHoles.js */ 19);
var iterableToArray = __webpack_require__(/*! ./iterableToArray.js */ 20);
var unsupportedIterableToArray = __webpack_require__(/*! ./unsupportedIterableToArray.js */ 8);
var nonIterableSpread = __webpack_require__(/*! ./nonIterableSpread.js */ 21);
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 19 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/arrayWithoutHoles.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(/*! ./arrayLikeToArray.js */ 9);
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 20 */
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/iterableToArray.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 21 */
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/nonIterableSpread.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 22 */
/*!*************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-i18n/dist/uni-i18n.es.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, global) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LOCALE_ZH_HANT = exports.LOCALE_ZH_HANS = exports.LOCALE_FR = exports.LOCALE_ES = exports.LOCALE_EN = exports.I18n = exports.Formatter = void 0;
exports.compileI18nJsonStr = compileI18nJsonStr;
exports.hasI18nJson = hasI18nJson;
exports.initVueI18n = initVueI18n;
exports.isI18nStr = isI18nStr;
exports.isString = void 0;
exports.normalizeLocale = normalizeLocale;
exports.parseI18nJson = parseI18nJson;
exports.resolveLocale = resolveLocale;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var isObject = function isObject(val) {
  return val !== null && (0, _typeof2.default)(val) === 'object';
};
var defaultDelimiters = ['{', '}'];
var BaseFormatter = /*#__PURE__*/function () {
  function BaseFormatter() {
    (0, _classCallCheck2.default)(this, BaseFormatter);
    this._caches = Object.create(null);
  }
  (0, _createClass2.default)(BaseFormatter, [{
    key: "interpolate",
    value: function interpolate(message, values) {
      var delimiters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDelimiters;
      if (!values) {
        return [message];
      }
      var tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }]);
  return BaseFormatter;
}();
exports.Formatter = BaseFormatter;
var RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
var RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
function parse(format, _ref) {
  var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
    startDelimiter = _ref2[0],
    endDelimiter = _ref2[1];
  var tokens = [];
  var position = 0;
  var text = '';
  while (position < format.length) {
    var char = format[position++];
    if (char === startDelimiter) {
      if (text) {
        tokens.push({
          type: 'text',
          value: text
        });
      }
      text = '';
      var sub = '';
      char = format[position++];
      while (char !== undefined && char !== endDelimiter) {
        sub += char;
        char = format[position++];
      }
      var isClosed = char === endDelimiter;
      var type = RE_TOKEN_LIST_VALUE.test(sub) ? 'list' : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? 'named' : 'unknown';
      tokens.push({
        value: sub,
        type: type
      });
    }
    //  else if (char === '%') {
    //   // when found rails i18n syntax, skip text capture
    //   if (format[position] !== '{') {
    //     text += char
    //   }
    // }
    else {
      text += char;
    }
  }
  text && tokens.push({
    type: 'text',
    value: text
  });
  return tokens;
}
function compile(tokens, values) {
  var compiled = [];
  var index = 0;
  var mode = Array.isArray(values) ? 'list' : isObject(values) ? 'named' : 'unknown';
  if (mode === 'unknown') {
    return compiled;
  }
  while (index < tokens.length) {
    var token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break;
      case 'list':
        compiled.push(values[parseInt(token.value, 10)]);
        break;
      case 'named':
        if (mode === 'named') {
          compiled.push(values[token.value]);
        } else {
          if (true) {
            console.warn("Type of token '".concat(token.type, "' and format of value '").concat(mode, "' don't match!"));
          }
        }
        break;
      case 'unknown':
        if (true) {
          console.warn("Detect 'unknown' type of token!");
        }
        break;
    }
    index++;
  }
  return compiled;
}
var LOCALE_ZH_HANS = 'zh-Hans';
exports.LOCALE_ZH_HANS = LOCALE_ZH_HANS;
var LOCALE_ZH_HANT = 'zh-Hant';
exports.LOCALE_ZH_HANT = LOCALE_ZH_HANT;
var LOCALE_EN = 'en';
exports.LOCALE_EN = LOCALE_EN;
var LOCALE_FR = 'fr';
exports.LOCALE_FR = LOCALE_FR;
var LOCALE_ES = 'es';
exports.LOCALE_ES = LOCALE_ES;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = function hasOwn(val, key) {
  return hasOwnProperty.call(val, key);
};
var defaultFormatter = new BaseFormatter();
function include(str, parts) {
  return !!parts.find(function (part) {
    return str.indexOf(part) !== -1;
  });
}
function startsWith(str, parts) {
  return parts.find(function (part) {
    return str.indexOf(part) === 0;
  });
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, '-');
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === 'chinese') {
    // 支付宝
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf('zh') === 0) {
    if (locale.indexOf('-hans') > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf('-hant') > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ['-tw', '-hk', '-mo', '-cht'])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  var locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  var lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
var I18n = /*#__PURE__*/function () {
  function I18n(_ref3) {
    var locale = _ref3.locale,
      fallbackLocale = _ref3.fallbackLocale,
      messages = _ref3.messages,
      watcher = _ref3.watcher,
      formater = _ref3.formater;
    (0, _classCallCheck2.default)(this, I18n);
    this.locale = LOCALE_EN;
    this.fallbackLocale = LOCALE_EN;
    this.message = {};
    this.messages = {};
    this.watchers = [];
    if (fallbackLocale) {
      this.fallbackLocale = fallbackLocale;
    }
    this.formater = formater || defaultFormatter;
    this.messages = messages || {};
    this.setLocale(locale || LOCALE_EN);
    if (watcher) {
      this.watchLocale(watcher);
    }
  }
  (0, _createClass2.default)(I18n, [{
    key: "setLocale",
    value: function setLocale(locale) {
      var _this = this;
      var oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        // 可能初始化时不存在
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      // 仅发生变化时，通知
      if (oldLocale !== this.locale) {
        this.watchers.forEach(function (watcher) {
          watcher(_this.locale, oldLocale);
        });
      }
    }
  }, {
    key: "getLocale",
    value: function getLocale() {
      return this.locale;
    }
  }, {
    key: "watchLocale",
    value: function watchLocale(fn) {
      var _this2 = this;
      var index = this.watchers.push(fn) - 1;
      return function () {
        _this2.watchers.splice(index, 1);
      };
    }
  }, {
    key: "add",
    value: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach(function (key) {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
  }, {
    key: "f",
    value: function f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join('');
    }
  }, {
    key: "t",
    value: function t(key, locale, values) {
      var message = this.message;
      if (typeof locale === 'string') {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn("Cannot translate the value of keypath ".concat(key, ". Use the value of keypath as default."));
        return key;
      }
      return this.formater.interpolate(message[key], values).join('');
    }
  }]);
  return I18n;
}();
exports.I18n = I18n;
function watchAppLocale(appVm, i18n) {
  // 需要保证 watch 的触发在组件渲染之前
  if (appVm.$watchLocale) {
    // vue2
    appVm.$watchLocale(function (newLocale) {
      i18n.setLocale(newLocale);
    });
  } else {
    appVm.$watch(function () {
      return appVm.$locale;
    }, function (newLocale) {
      i18n.setLocale(newLocale);
    });
  }
}
function getDefaultLocale() {
  if (typeof uni !== 'undefined' && uni.getLocale) {
    return uni.getLocale();
  }
  // 小程序平台，uni 和 uni-i18n 互相引用，导致访问不到 uni，故在 global 上挂了 getLocale
  if (typeof global !== 'undefined' && global.getLocale) {
    return global.getLocale();
  }
  return LOCALE_EN;
}
function initVueI18n(locale) {
  var messages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallbackLocale = arguments.length > 2 ? arguments[2] : undefined;
  var watcher = arguments.length > 3 ? arguments[3] : undefined;
  // 兼容旧版本入参
  if (typeof locale !== 'string') {
    var _ref4 = [messages, locale];
    locale = _ref4[0];
    messages = _ref4[1];
  }
  if (typeof locale !== 'string') {
    // 因为小程序平台，uni-i18n 和 uni 互相引用，导致此时访问 uni 时，为 undefined
    locale = getDefaultLocale();
  }
  if (typeof fallbackLocale !== 'string') {
    fallbackLocale = typeof __uniConfig !== 'undefined' && __uniConfig.fallbackLocale || LOCALE_EN;
  }
  var i18n = new I18n({
    locale: locale,
    fallbackLocale: fallbackLocale,
    messages: messages,
    watcher: watcher
  });
  var _t = function t(key, values) {
    if (typeof getApp !== 'function') {
      // app view
      /* eslint-disable no-func-assign */
      _t = function t(key, values) {
        return i18n.t(key, values);
      };
    } else {
      var isWatchedAppLocale = false;
      _t = function t(key, values) {
        var appVm = getApp().$vm;
        // 可能$vm还不存在，比如在支付宝小程序中，组件定义较早，在props的default里使用了t()函数（如uni-goods-nav），此时app还未初始化
        // options: {
        // 	type: Array,
        // 	default () {
        // 		return [{
        // 			icon: 'shop',
        // 			text: t("uni-goods-nav.options.shop"),
        // 		}, {
        // 			icon: 'cart',
        // 			text: t("uni-goods-nav.options.cart")
        // 		}]
        // 	}
        // },
        if (appVm) {
          // 触发响应式
          appVm.$locale;
          if (!isWatchedAppLocale) {
            isWatchedAppLocale = true;
            watchAppLocale(appVm, i18n);
          }
        }
        return i18n.t(key, values);
      };
    }
    return _t(key, values);
  };
  return {
    i18n: i18n,
    f: function f(message, values, delimiters) {
      return i18n.f(message, values, delimiters);
    },
    t: function t(key, values) {
      return _t(key, values);
    },
    add: function add(locale, message) {
      var override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      return i18n.add(locale, message, override);
    },
    watch: function watch(fn) {
      return i18n.watchLocale(fn);
    },
    getLocale: function getLocale() {
      return i18n.getLocale();
    },
    setLocale: function setLocale(newLocale) {
      return i18n.setLocale(newLocale);
    }
  };
}
var isString = function isString(val) {
  return typeof val === 'string';
};
exports.isString = isString;
var formater;
function hasI18nJson(jsonObj, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  return walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        return true;
      }
    } else {
      return hasI18nJson(value, delimiters);
    }
  });
}
function parseI18nJson(jsonObj, values, delimiters) {
  if (!formater) {
    formater = new BaseFormatter();
  }
  walkJsonObj(jsonObj, function (jsonObj, key) {
    var value = jsonObj[key];
    if (isString(value)) {
      if (isI18nStr(value, delimiters)) {
        jsonObj[key] = compileStr(value, values, delimiters);
      }
    } else {
      parseI18nJson(value, values, delimiters);
    }
  });
  return jsonObj;
}
function compileI18nJsonStr(jsonStr, _ref5) {
  var locale = _ref5.locale,
    locales = _ref5.locales,
    delimiters = _ref5.delimiters;
  if (!isI18nStr(jsonStr, delimiters)) {
    return jsonStr;
  }
  if (!formater) {
    formater = new BaseFormatter();
  }
  var localeValues = [];
  Object.keys(locales).forEach(function (name) {
    if (name !== locale) {
      localeValues.push({
        locale: name,
        values: locales[name]
      });
    }
  });
  localeValues.unshift({
    locale: locale,
    values: locales[locale]
  });
  try {
    return JSON.stringify(compileJsonObj(JSON.parse(jsonStr), localeValues, delimiters), null, 2);
  } catch (e) {}
  return jsonStr;
}
function isI18nStr(value, delimiters) {
  return value.indexOf(delimiters[0]) > -1;
}
function compileStr(value, values, delimiters) {
  return formater.interpolate(value, values, delimiters).join('');
}
function compileValue(jsonObj, key, localeValues, delimiters) {
  var value = jsonObj[key];
  if (isString(value)) {
    // 存在国际化
    if (isI18nStr(value, delimiters)) {
      jsonObj[key] = compileStr(value, localeValues[0].values, delimiters);
      if (localeValues.length > 1) {
        // 格式化国际化语言
        var valueLocales = jsonObj[key + 'Locales'] = {};
        localeValues.forEach(function (localValue) {
          valueLocales[localValue.locale] = compileStr(value, localValue.values, delimiters);
        });
      }
    }
  } else {
    compileJsonObj(value, localeValues, delimiters);
  }
}
function compileJsonObj(jsonObj, localeValues, delimiters) {
  walkJsonObj(jsonObj, function (jsonObj, key) {
    compileValue(jsonObj, key, localeValues, delimiters);
  });
  return jsonObj;
}
function walkJsonObj(jsonObj, walk) {
  if (Array.isArray(jsonObj)) {
    for (var i = 0; i < jsonObj.length; i++) {
      if (walk(jsonObj, i)) {
        return true;
      }
    }
  } else if (isObject(jsonObj)) {
    for (var key in jsonObj) {
      if (walk(jsonObj, key)) {
        return true;
      }
    }
  }
  return false;
}
function resolveLocale(locales) {
  return function (locale) {
    if (!locale) {
      return locale;
    }
    locale = normalizeLocale(locale) || locale;
    return resolveLocaleChain(locale).find(function (locale) {
      return locales.indexOf(locale) > -1;
    });
  };
}
function resolveLocaleChain(locale) {
  var chain = [];
  var tokens = locale.split('-');
  while (tokens.length) {
    chain.push(tokens.join('-'));
    tokens.pop();
  }
  return chain;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 23 */
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 24 */
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toPropertyKey = __webpack_require__(/*! ./toPropertyKey.js */ 12);
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 25 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global, Buffer) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2026 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator && window.navigator.userAgent && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      if (vm.$options && vm.$options.__file) { // fixed by xxxxxx
        return ('') + vm.$options.__file
      }
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm && vm.$options.name !== 'PageBody') {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        !vm.$options.isReserved && tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
  Dep.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
  Dep.target = Dep.SharedObject.target;
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue &&
    !value.__v_isMPComponent
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i, i++)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject,
  slotVm
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, slotVm || this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu' || vm.mpHost === 'mp-kuaishou' || vm.mpHost === 'mp-xhs'){//百度、快手、小红书 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    !vm._$fallback && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    !vm._$fallback && initProvide(vm); // resolve provide after data/props
    !vm._$fallback && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
var NULLTYPE = '[object Null]';
var UNDEFINEDTYPE = '[object Undefined]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function nullOrUndefined(currentType, preType) {
    if(
        (currentType === NULLTYPE || currentType === UNDEFINEDTYPE) && 
        (preType === NULLTYPE || preType === UNDEFINEDTYPE)
    ) {
        return false
    }
    return true
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue !== pre[key] && nullOrUndefined(currentType, preType)) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/**
 * rfdc v1.4.1
 * David Mark Clements <david.clements@nearform.com>
 * Really Fast Deep Clone
 * [npm](https://www.npmjs.com/package/rfdc) [homePage](https://github.com/davidmarkclements/rfdc.git)
 */

/**
 * @typedef {{proto?: boolean; circles?: boolean; reviver: (key: string, value: any) => any; constructorHandlers?: any[];}} Options
 */

function copyBuffer(cur) {
  if (typeof Buffer !== 'undefined' && cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  var length = cur instanceof DataView ? cur.byteLength : cur.length;
  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, length)
}

/**
 *
 * @param {Options} opts
 * @returns {(o: any) => any}
 */
function rfdc(opts) {
  opts = opts || {};
  if (opts.circles) { return rfdcCircles(opts) }

  var constructorHandlers = new Map();
  constructorHandlers.set(Date, function (o) { return o.toJSON(); });
  constructorHandlers.set(Map, function (o, fn) { return new Map(cloneArray(Array.from(o), fn)); });
  constructorHandlers.set(Set, function (o, fn) { return new Set(cloneArray(Array.from(o), fn)); });
  if (opts.constructorHandlers) {
    opts.constructorHandlers.forEach(function (handler) {
      constructorHandlers.set(handler[0], handler[1]);
    });
  }

  var handler = null;

  return opts.proto ? cloneProto : clone

  function cloneArray(a, fn) {
    var keys = Object.keys(a);
    var a2 = new Array(a.length);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var cur = a[k];
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        a2[k] = handler(cur, fn);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        a2[k] = fn(opts.reviver ? opts.reviver(k, cur) : cur);
      }
    }
    return a2
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, clone) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, clone)
    }
    var o2 = {};
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) { continue }
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, clone);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = clone(opts.reviver ? opts.reviver(k, cur) : cur);
      }
    }
    return o2
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, cloneProto) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, cloneProto)
    }
    var o2 = {};
    for (var k in o) {
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, cloneProto);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        o2[k] = cloneProto(opts.reviver ? opts.reviver(k, cur) : cur);
      }
    }
    return o2
  }
}

function rfdcCircles(opts) {
  var refs = [];
  var refsNew = [];

  var constructorHandlers = new Map();
  constructorHandlers.set(Date, function (o) { return o.toJSON(); });
  constructorHandlers.set(Map, function (o, fn) { return new Map(cloneArray(Array.from(o), fn)); });
  constructorHandlers.set(Set, function (o, fn) { return new Set(cloneArray(Array.from(o), fn)); });
  if (opts.constructorHandlers) {
    opts.constructorHandlers.forEach(function (handler) {
      constructorHandlers.set(handler[0], handler[1]);
    });
  }

  var handler = null;
  return opts.proto ? cloneProto : clone

  function cloneArray(a, fn) {
    var keys = Object.keys(a);
    var a2 = new Array(a.length);
    refs.push(a);
    refsNew.push(a2);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var cur = a[k];
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        a2[k] = handler(cur, fn);
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur);
      } else {
        var index = refs.indexOf(cur);
        if (index !== -1) {
          a2[k] = refsNew[index];
        } else {
          a2[k] = fn(opts.reviver ? opts.reviver(k, cur) : cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return a2
  }

  function clone(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, clone) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, clone)
    }
    var o2 = {};
    refs.push(o);
    refsNew.push(o2);
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) { continue }
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, clone);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        var i = refs.indexOf(cur);
        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = clone(opts.reviver ? opts.reviver(k, cur) : cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return o2
  }

  function cloneProto(o) {
    if (typeof o !== 'object' || o === null) { return o }
    if (Array.isArray(o)) { return cloneArray(o, cloneProto) }
    if (o.constructor !== Object && (handler = constructorHandlers.get(o.constructor))) {
      return handler(o, cloneProto)
    }
    var o2 = {};
    refs.push(o);
    refsNew.push(o2);
    for (var k in o) {
      var cur = o[k];
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur;
      } else if (cur.constructor !== Object && (handler = constructorHandlers.get(cur.constructor))) {
        o2[k] = handler(cur, cloneProto);
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur);
      } else {
        var i = refs.indexOf(cur);
        if (i !== -1) {
          o2[k] = refsNew[i];
        } else {
          o2[k] = cloneProto(opts.reviver ? opts.reviver(k, cur) : cur);
        }
      }
    }
    refs.pop();
    refsNew.pop();
    return o2
  }
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"famen","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"famen","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"famen","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function clearInstance(key, value) {
  // 简易去除 Vue 和小程序组件实例
  if (value) {
    if (value._isVue || value.__v_isMPComponent) {
      return {}
    }
  }
  return value
}

var cloneDeepCircles = rfdc({ circles: true, reviver: clearInstance });

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);

  // vue-composition-api
  var compositionApiState = vm.__composition_api_state__ || vm.__secret_vfa_state__;
  var rawBindings = compositionApiState && compositionApiState.rawBindings;
  if (rawBindings) {
    Object.keys(rawBindings).forEach(function (key) {
      ret[key] = vm[key];
    });
  }

  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return cloneDeepCircles(ret)
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = this.$shouldDiffData === false ? data : diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_DARK_MODE":"false","VUE_APP_NAME":"famen","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  !vm._$fallback && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err, vm, info) {
    Vue.util.warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    console.error(err);
    /* eslint-disable no-undef */
    var app = typeof getApp === 'function' && getApp();
    if (app && app.onError) {
      app.onError(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      var triggerEvent = this.$scope['_triggerEvent'] || this.$scope['triggerEvent'];
      if (triggerEvent) {
        try {
          triggerEvent.call(this.$scope, event, {
            __args__: toArray(arguments, 1)
          });
        } catch (error) {

        }
      }
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    // 解决动态属性添加
    Vue.set(target, key, value);
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0, l = val; i < l; i++) {
        // 第一个参数暂时仍和小程序一致
        ret[i] = iteratee(i, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onPageNotFound',
    'onThemeChange',
    'onError',
    'onUnhandledRejection',
    //Page
    'onInit',
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onAddToFavorites',
    'onShareTimeline',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    'onUploadDouyinVideo',
    'onNFCReadMessage',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../../../../../buffer/index.js */ 26).Buffer))

/***/ }),
/* 26 */
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ 27)
var ieee754 = __webpack_require__(/*! ieee754 */ 28)
var isArray = __webpack_require__(/*! isarray */ 29)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ 3)))

/***/ }),
/* 27 */
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),
/* 28 */
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 29 */
/*!***************************************!*\
  !*** ./node_modules/isarray/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 30 */
/*!********************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages.json ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    if (!options.components) {
      options.components = {}
    }
    var hasOwn = Object.prototype.hasOwnProperty
    for (var name in components) {
      if (hasOwn.call(components, name) && !hasOwn.call(options.components, name)) {
        options.components[name] = components[name]
      }
    }
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    if(typeof renderjs.beforeCreate === 'function'){
			renderjs.beforeCreate = [renderjs.beforeCreate]
		}
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 37 */
/*!****************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/index.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _pageLifetimes = __webpack_require__(/*! ./lifecycle/pageLifetimes */ 38);
var _clone = __webpack_require__(/*! ./methods/clone */ 39);
var _dataset = __webpack_require__(/*! ./methods/dataset */ 40);
var _escape = __webpack_require__(/*! ./methods/escape */ 41);
var _event = __webpack_require__(/*! ./methods/event */ 42);
var _getTabBar = __webpack_require__(/*! ./methods/getTabBar */ 43);
var _relation = __webpack_require__(/*! ./methods/relation */ 44);
var _selectComponent = __webpack_require__(/*! ./methods/selectComponent */ 45);
var _setData = __webpack_require__(/*! ./methods/setData */ 46);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var _default = {
  install: function install(Vue, option) {
    Vue.mixin(_objectSpread(_objectSpread({}, _pageLifetimes.pageLifetimes), {}, {
      methods: {
        clone: _clone.clone,
        handleDataset: _dataset.handleDataset,
        escape2Html: _escape.escape2Html,
        html2Escape: _escape.html2Escape,
        parseEventDynamicCode: _event.parseEventDynamicCode,
        getTabBar: _getTabBar.getTabBar,
        getRelationNodes: _relation.getRelationNodes,
        zpSelectComponent: _selectComponent.selectComponent,
        zpSelectAllComponents: _selectComponent.selectAllComponents,
        setData: _setData.setData
      }
    }));
  }
};
exports.default = _default;

/***/ }),
/* 38 */
/*!**********************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/lifecycle/pageLifetimes.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageLifetimes = void 0;
/**
 * 组件pageLifetimes处理，需在页面生命周期里调用
 * @param {Object} node
 * @param {Object} lifeName
 */
function handlePageLifetime(node, lifeName) {
  node.$children.map(function (child) {
    if (typeof child[lifeName] == 'function') child[lifeName]();
    handlePageLifetime(child, lifeName);
  });
}
var pageLifetimes = {
  onLoad: function onLoad() {
    // uni.onWindowResize(CALLBACK)  监听窗口尺寸变化事件
    // 平台差异说明
    // App	H5	微信小程序	支付宝小程序	百度小程序	抖音小程序	飞书小程序	QQ小程序
    // √	√	√	x	x	x	√	√
  },
  onShow: function onShow() {
    handlePageLifetime(this, "handlePageShow");
  },
  onHide: function onHide() {
    handlePageLifetime(this, "handlePageHide");
  },
  onResize: function onResize() {
    //onResize	监听窗口尺寸变化	App、微信小程序、快手小程序

    handlePageLifetime(this, "handlePageResize");
  }
};
exports.pageLifetimes = pageLifetimes;

/***/ }),
/* 39 */
/*!************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/clone.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
/**
 * 用于处理对props进行赋值的情况
 * //简单处理一下就行了
 *
 * @param {*} target
 * @returns
 */
function clone(target) {
  return JSON.parse(JSON.stringify(target));
}

/***/ }),
/* 40 */
/*!**************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/dataset.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleDataset = handleDataset;
/**
 * 用于处理dataset
 * 自定义组件的事件里，是获取不到e.currentTarget.dataset的
 * 因此收集data-参数，手动传进去
 *
 * @param {*} event
 * @param {*} dataSet
 */
function handleDataset(event) {
  var dataSet = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (event && !event.currentTarget) {
    if (dataSet.tagId) {
      event.currentTarget = {
        id: dataSet.tagId
      };
    } else {
      event.currentTarget = {
        dataset: dataSet
      };
    }
  }
}

/***/ }),
/* 41 */
/*!*************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/escape.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escape2Html = escape2Html;
exports.html2Escape = html2Escape;
/**
 * 转义符换成普通字符
 * @param {*} str
 * @returns
 */
function escape2Html(str) {
  if (!str) return str;
  var arrEntities = {
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'amp': '&',
    'quot': '"'
  };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
}

/**
 * 普通字符转换成转义符
 * @param {*} sHtml
 * @returns
 */
function html2Escape(sHtml) {
  if (!sHtml) return sHtml;
  return sHtml.replace(/[<>&"]/g, function (c) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;'
    }[c];
  });
}

/***/ }),
/* 42 */
/*!************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/event.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEventDynamicCode = parseEventDynamicCode;
/**
 * 解析事件里的动态函数名，这种没有()的函数名，在uniapp不被执行
 * 比如：<view bindtap="{{openId==undefined?'denglu':'hy_to'}}">立即</view>
 * @param {*} exp
 */
function parseEventDynamicCode(e, exp) {
  if (typeof this[exp] === 'function') {
    this[exp](e);
  }
}

/***/ }),
/* 43 */
/*!****************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/getTabBar.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTabBar = getTabBar;
/**
 * 接管getTabBar函数，默认uni-app是没有这个函数的
 * 适用于使用custom-tab-bar自定义导航栏的小程序项目
 * 需注意：
 * 1.custom-tab-bar下面仍是小程序文件
 * 2.pages.json里面需使用条件编译区分好小程序和非小程序的tabBar配置
 */
function getTabBar() {
  return {
    setData: function setData(obj) {
      var _this$$mp, _this$$mp$page, _this$$mp2, _this$$mp2$page;
      if (typeof ((_this$$mp = this.$mp) === null || _this$$mp === void 0 ? void 0 : (_this$$mp$page = _this$$mp.page) === null || _this$$mp$page === void 0 ? void 0 : _this$$mp$page.getTabBar) === 'function' && (_this$$mp2 = this.$mp) !== null && _this$$mp2 !== void 0 && (_this$$mp2$page = _this$$mp2.page) !== null && _this$$mp2$page !== void 0 && _this$$mp2$page.getTabBar()) {
        this.$mp.page.getTabBar().setData(obj);
      } else {
        console.log("当前平台不支持getTabBar()，已稍作处理，详细请参见相关文档。");
      }
    }
  };
}

/***/ }),
/* 44 */
/*!***************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/relation.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRelationNodes = getRelationNodes;
/**
 * 组件间关系
 * 注意：须与p-f-unicom配合使用！！！
 * @param {*} name
 * @returns
 */
function getRelationNodes(name) {
  if (!this.$unicom) throw "this.getRelationNodes()需与p-f-unicom配合使用！";
  return this.$unicom('@' + name);
}

/***/ }),
/* 45 */
/*!**********************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/selectComponent.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectAllComponents = selectAllComponents;
exports.selectComponent = selectComponent;
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var createTraverse = function createTraverse() {
  var stop = false;
  return function traverse(root, callback) {
    if (!stop && typeof callback === 'function') {
      var children = root.$children;
      for (var index = 0; !stop && index < children.length; index++) {
        var element = children[index];
        stop = callback(element) === true;
        traverse(element, callback);
      }
    }
  };
};

/**
 * 安全的JSON.stringify
 * @param {Object} node
 */
function safeStringify(node) {
  var cache = [];
  var str = JSON.stringify(node, function (key, value) {
    if ((0, _typeof2.default)(value) === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // 移除
        return;
      }
      // 收集所有的值
      cache.push(value);
    }
    return value;
  });
  cache = null; // 清空变量，便于垃圾回收机制回收
  return str;
}
var match = function match(node, selector) {
  var _vnode$context$$vnode, _vnode, _vnode$context;
  var vnode = node._vnode;

  //好家伙，在微信小程序里，node里面根本找不到class，因此这种方式没法搞了

  //关键之处！
  // console.log("attrs", (vnode.context.$vnode.data));
  vnode = (_vnode$context$$vnode = (_vnode = vnode) === null || _vnode === void 0 ? void 0 : (_vnode$context = _vnode.context) === null || _vnode$context === void 0 ? void 0 : _vnode$context.$vnode) !== null && _vnode$context$$vnode !== void 0 ? _vnode$context$$vnode : "";
  //console.log(vnode.data) -->  [Object] {"staticClass":"bar","attrs":{"_i":0}}  at selectComponent.js:72
  if (!vnode || !vnode.data) {
    return false;
  }
  var attrs = vnode.data.attrs || {};
  var staticClass = vnode.data.staticClass || '';
  var id = attrs.id || '';
  if (selector[0] === '#') {
    return selector.substr(1) === id;
  } else {
    staticClass = staticClass.trim().split(' ');
    selector = selector.substr(1).split('.');
    return selector.reduce(function (a, c) {
      return a && staticClass.includes(c);
    }, true);
  }
};
var selectorBuilder = function selectorBuilder(selector) {
  selector = selector.replace(/>>>/g, '>');
  selector = selector.split('>').map(function (s) {
    return s.trim().split(' ').join("').descendant('");
  }).join("').child('");

  // 替换掉new Function方式，因为小程序不支持new Function和eval
  //return new Function('Selector', 'node', 'all', `return new Selector(node, all).descendant('` + selector + `')`);
  return function (Selector, node, all) {
    return new Selector(node, all).descendant(selector);
  };
};
var Selector = /*#__PURE__*/function () {
  function Selector(node) {
    var all = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    (0, _classCallCheck2.default)(this, Selector);
    this.nodes = [node];
    this.all = all;
  }
  (0, _createClass2.default)(Selector, [{
    key: "child",
    value: function child(selector) {
      var matches = [];
      if (this.all) {
        this.nodes.forEach(function (node) {
          var _matches;
          (_matches = matches).push.apply(_matches, (0, _toConsumableArray2.default)(node.$children.filter(function (node) {
            return match(node, selector);
          })));
        });
      } else {
        if (this.nodes.length > 0) {
          var node = this.nodes[0].$children.find(function (node) {
            return match(node, selector);
          });
          matches = node ? [node] : [];
        }
      }
      this.nodes = matches;
      return this;
    }
  }, {
    key: "descendant",
    value: function descendant(selector) {
      var _this = this;
      var matches = [];
      this.nodes.forEach(function (root) {
        createTraverse()(root, function (node) {
          if (match(node, selector)) {
            matches.push(node);
            return !_this.all;
          }
        });
      });
      this.nodes = matches;
      return this;
    }
  }]);
  return Selector;
}(); ////////////////////////////////////////////selectComponent//////////////////////////////////////////////////
/**
 * 其他平台，如APP
 * @param {Object} selector
 */
function selectComponentOther(selector) {
  var selectors = selector.split(',').map(function (s) {
    return s.trim();
  });
  if (!selectors[0]) {
    return null;
  }
  var querySelector = selectorBuilder(selectors[0]);
  return querySelector(Selector, this, false, selector).nodes[0];
}

/**
 * 还是用这个微信小程序的实现吧
 * @param {Object} selector
 */
var selectComponentWeiXin2 = function selectComponentWeiXin2(selector) {
  var _this$$scope$selectCo;
  console.log(".$scope", this.$scope.selectComponent(selector));
  return ((_this$$scope$selectCo = this.$scope.selectComponent(selector)) === null || _this$$scope$selectCo === void 0 ? void 0 : _this$$scope$selectCo.data) || undefined;
};

/**
 * selectComponent
 * @param {Object} args
 */
function selectComponent(args) {
  // console.log(".$scope",this.$scope)

  //H5和小程序能正常使用这个函数
  //重写selectComponent函数，因为默认会多一层$vm
  return selectComponentWeiXin2.call(this, args);
}

////////////////////////////////////////////selectAllComponents//////////////////////////////////////////////////
/**
 * 其他平台，如APP
 * @param {Object} selector
 */
function selectAllComponentsOther(selector) {
  var _this2 = this;
  var selectors = selector.split(',').map(function (s) {
    return s.trim();
  });
  var selected = [];
  selectors.forEach(function (selector) {
    var querySelector = selectorBuilder(selector);
    selected = selected.concat(querySelector(Selector, _this2, true, selector).nodes);
  });
  return selected;
}

/**
 * 还是用这个微信小程序的实现吧
 * @param {Object} selector
 */
var selectAllComponentsWeiXin2 = function selectAllComponentsWeiXin2(selector) {
  var list = this.$scope.selectAllComponents(selector) || [];
  list = list.map(function (item) {
    return item.data;
  });
  return list;
};

/**
 * selectAllComponents
 * @param {Object} args
 */
function selectAllComponents(args) {
  //H5和小程序能正常使用这个函数
  //重写selectComponent函数，因为默认会多一层$vm
  return selectAllComponentsWeiXin2.call(this, args);
}

/***/ }),
/* 46 */
/*!**************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/methods/setData.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setData = setData;
var _set2 = _interopRequireDefault(__webpack_require__(/*! ../utils/_set */ 47));
var _debounce = _interopRequireDefault(__webpack_require__(/*! ../utils/debounce */ 48));
/**
 * 老setData polyfill
 * 用于转换后的uniapp的项目能直接使用this.setData()函数
 * @param {*} obj
 * @param {*} callback
 */
function oldSetData(obj, callback) {
  var that = this;
  var handleData = function handleData(tepData, tepKey, afterKey) {
    var tepData2 = tepData;
    tepKey = tepKey.split('.');
    tepKey.forEach(function (item) {
      if (tepData[item] === null || tepData[item] === undefined) {
        var reg = /^[0-9]+$/;
        tepData[item] = reg.test(afterKey) ? [] : {};
        tepData2 = tepData[item];
      } else {
        tepData2 = tepData[item];
      }
    });
    return tepData2;
  };
  var isFn = function isFn(value) {
    return typeof value == 'function' || false;
  };
  Object.keys(obj).forEach(function (key) {
    var val = obj[key];
    key = key.replace(/\]/g, '').replace(/\[/g, '.');
    var front, after;
    var index_after = key.lastIndexOf('.');
    if (index_after != -1) {
      after = key.slice(index_after + 1);
      front = handleData(that, key.slice(0, index_after), after);
    } else {
      after = key;
      front = that;
    }
    if (front.$data && front.$data[after] === undefined) {
      Object.defineProperty(front, after, {
        get: function get() {
          return front.$data[after];
        },
        set: function set(newValue) {
          front.$data[after] = newValue;
          that.hasOwnProperty("$forceUpdate") && that.$forceUpdate();
        },
        enumerable: true,
        configurable: true
      });
      front[after] = val;
    } else {
      that.$set(front, after, val);
    }
  });
  // this.$forceUpdate();
  isFn(callback) && this.$nextTick(callback);
}

/**
 * 变量名正则
 */
var variableNameReg = /^([^\x00-\xff]|[a-zA-Z_$])([^\x00-\xff]|[a-zA-Z0-9_$])*$/;

/**
 * 2022-10-31 重写setData
 * 2023-05-08 增加微信“简易双向绑定”支持
 * 用于转换后的uniapp的项目能直接使用this.setData()函数
 * @param {Object} obj
 * @param {Object} callback
 */
function setData(obj) {
  var _this = this;
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  Object.keys(obj).forEach(function (key) {
    (0, _set2.default)(_this, key, obj[key]);

    //处理微信“简易双向绑定”
    if (variableNameReg.test(key) && key.endsWith("Clone")) {
      var propName = key.replace(/Clone$/, "");
      if (_this.$options && _this.$options.propsData[propName]) {
        _this.$emit("update:".concat(propName), obj[key]);
      }
    }
  });
  this.$forceUpdate();
  if (typeof callback == 'function') this.$nextTick(callback);
}

/***/ }),
/* 47 */
/*!*********************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/utils/_set.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * lodash set
 * @param {*} obj
 * @param {*} path
 * @param {*} value
 * @returns
 */
function _set(obj, path, value) {
  if (Object(obj) !== obj) return obj; // When obj is not an object
  // If not yet an array, get the keys from the string-path
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];
  path.slice(0, -1).reduce(function (a, c, i) {
    return (
      // Iterate all of them except the last one
      Object(a[c]) === a[c] // Does the key exist and is its value an object?
      // Yes: then follow that path
      ? a[c]
      // No: create the key. Is the next key a potential array-index?
      : a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] // Yes: assign a new array object
      : {}
    );
  },
  // No: assign a new plain object
  obj)[path[path.length - 1]] = value; // Finally assign the value to the last key
  return obj; // Return the top-level object to allow chaining
}
var _default = _set;
exports.default = _default;

/***/ }),
/* 48 */
/*!*************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/uni_modules/zp-mixins/utils/debounce.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * 防抖
 * @param {Object} scope  //引用的this，发现不显式传this，拿不到。
 * @param {Object} fn
 * @param {Object} delay
 */
var t = null;
var debounce = function debounce(scope, fn, delay) {
  if (t !== null) {
    clearTimeout(t);
  }
  t = setTimeout(function () {
    scope[fn]();
  }, delay);
};
var _default = debounce;
exports.default = _default;

/***/ }),
/* 49 */
/*!*************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/locale/index.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translate = exports.toggleLanguage = exports.setLanguage = exports.onChange = exports.mixin = exports.getCurrentLanguage = exports.default = void 0;
var _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ 13));
var _zhCN = _interopRequireDefault(__webpack_require__(/*! ./zh-CN.js */ 50));
var _enUS = _interopRequireDefault(__webpack_require__(/*! ./en-US.js */ 51));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var LOCALE_STORAGE_KEY = 'app-language';
var messages = {
  'zh-CN': _zhCN.default,
  'en-US': _enUS.default
};
var currentLocale = 'zh-CN';
var listeners = [];
var getSystemLanguage = function getSystemLanguage() {
  try {
    var sysInfo = uni.getSystemInfoSync();
    var lang = sysInfo.language || 'zh-CN';
    return lang.startsWith('zh') ? 'zh-CN' : 'en-US';
  } catch (e) {
    return 'zh-CN';
  }
};
var initLocale = function initLocale() {
  var savedLang = uni.getStorageSync(LOCALE_STORAGE_KEY) || getSystemLanguage();
  currentLocale = savedLang;
};
initLocale();
var translate = function translate(key, params) {
  var keys = key.split('.');
  var value = messages[currentLocale];
  var _iterator = _createForOfIteratorHelper(keys),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var k = _step.value;
      if (value && (0, _typeof2.default)(value) === 'object' && value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (typeof value === 'string' && params) {
    return value.replace(/\{(\w+)\}/g, function (match, paramKey) {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }
  return value;
};
exports.translate = translate;
var setLanguage = function setLanguage(lang) {
  if (messages[lang]) {
    currentLocale = lang;
    uni.setStorageSync(LOCALE_STORAGE_KEY, lang);
    listeners.forEach(function (fn) {
      try {
        fn(lang);
      } catch (e) {}
    });
  }
};
exports.setLanguage = setLanguage;
var getCurrentLanguage = function getCurrentLanguage() {
  return currentLocale;
};
exports.getCurrentLanguage = getCurrentLanguage;
var toggleLanguage = function toggleLanguage() {
  var newLang = currentLocale === 'zh-CN' ? 'en-US' : 'zh-CN';
  setLanguage(newLang);
  return newLang;
};
exports.toggleLanguage = toggleLanguage;
var onChange = function onChange(fn) {
  listeners.push(fn);
  return function () {
    var idx = listeners.indexOf(fn);
    if (idx > -1) listeners.splice(idx, 1);
  };
};
exports.onChange = onChange;
var mixin = {
  data: function data() {
    return {};
  },
  created: function created() {
    var _this = this;
    this._i18nUnsubscribe = onChange(function () {
      _this.$forceUpdate();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  },
  methods: {
    $t: function $t(key, params) {
      return translate(key, params);
    },
    $localeOn: function $localeOn(fn) {
      return onChange(fn);
    }
  }
};
exports.mixin = mixin;
var _default = {
  translate: translate,
  setLanguage: setLanguage,
  getCurrentLanguage: getCurrentLanguage,
  toggleLanguage: toggleLanguage,
  onChange: onChange,
  mixin: mixin
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 50 */
/*!*************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/locale/zh-CN.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  common: {
    confirm: '确认',
    cancel: '取消',
    loading: '加载中...',
    loadFail: '加载失败',
    saveSuccess: '保存成功',
    saveFail: '保存失败',
    search: '搜索',
    copy: '复制',
    close: '关闭',
    submit: '提交',
    delete: '删除',
    edit: '编辑',
    confirmAction: '确认操作'
  },
  nav: {
    back: '返回',
    home: '首页'
  },
  login: {
    title: '登录',
    systemTitle: '阀门报价系统',
    systemSubtitle: 'VALVE QUOTATION SYSTEM',
    userLogin: '用户登录',
    username: '用户名',
    password: '密码',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
    passwordMinLength: '密码长度不能少于6位',
    rememberLogin: '记住登录状态',
    loginBtn: '登 录',
    loggingIn: '登录中...',
    loginSuccess: '登录成功',
    loginFail: '登录失败，请检查账号密码',
    contactAdmin: '如有疑问请联系系统管理员'
  },
  product: {
    category: '产品分类',
    brand: '奇胜阀门 · CHISUN VALVE',
    brandTagline: '专注工业阀门 · 成就品质之源',
    brandSince: '创立于浙江温州 · 多年工业阀门制造经验',
    title: '阀门产品系列',
    subtitle: '选择产品系列，进入规格配置与报价',
    searchPlaceholder: '搜索产品系列…',
    searchPlaceholderEn: 'Search product series…',
    totalSeries: '共 {count} 个系列',
    noResult: '未找到匹配的系列',
    noResultSub: '尝试搜索 "QB" 或 "QW" 等关键词',
    noSeriesData: '暂无数据',
    noSeriesDataMsg: '{series} 暂未录入产品数据，请先导入价格后再试。',
    certIso: 'ISO 9001',
    certCe: 'CE 认证',
    certApi: 'API 资质',
    footerAbout: '关于企业',
    footerContact: '联系我们'
  },
  index: {
    valveSelection: '阀门选择',
    configQuote: '配置报价',
    configTitle: '请依次选择以下参数生成报价',
    productConfig: '产品配置',
    valveModel: '阀门型号',
    selectValveModel: '请选择阀门型号',
    specSize: '规格尺寸 (DN)',
    selectSpecSize: '请选择规格尺寸',
    bodyMaterial: '阀体材质',
    selectBodyMaterial: '请选择阀体材质',
    gateMaterial: '闸板材质',
    selectGateMaterial: '请选择闸板材质',
    stemMaterial: '阀杆材质',
    selectStemMaterial: '请选择阀杆材质',
    yokeMaterial: '支架材质',
    selectYokeMaterial: '请选择支架材质',
    productType: '产品类型',
    quantity: '数量',
    inputQuantity: '请输入数量',
    moqHint: '最低起订量：{moq}',
    branding: '磨商标',
    yes: '是',
    no: '否',
    unitPrice: '单　价',
    originalUnitPrice: '单价',
    modifiedUnitPrice: '修订单价',
    estimatedTotal: '预估总价',
    priceTip: '如需改价，请编辑修订单价。',
    addToQuote: '添加到报价表',
    generateQuote: '生成报价表',
    quoteDetails: '报价明细',
    totalItems: '{count} 项',
    totalAmount: '合计金额',
    noQuoteItems: '暂无报价项目',
    noQuoteItemsSub: '配置好参数后点击「添加到报价表」',
    loadingData: '加载数据中...',
    calculating: '计算中...',
    dataLoadFail: '加载数据失败',
    addSuccess: '已添加到报价表',
    fillCompleteInfo: '请填写完整信息',
    comboNotAvailable: '该组合不可用',
    addFirst: '请先添加阀门到报价表',
    regular: '常规品',
    newProduct: '新品',
    moqMetOEM: '达到起订量-OEM',
    moqMetOriginal: '达到起订量-原标',
    moqUnmetOEM: '未达起订量-OEM',
    moqUnmetOriginal: '未达起订量-原标'
  },
  quotation: {
    title: '报 价 单',
    generateAndSave: '生成并保存报价表',
    generateContractExcel: '生成购销合同（Excel）',
    shareQuotation: '分享报价表',
    backToAdd: '返回继续添加',
    contractGenerating: '正在生成购销合同…',
    contractExported: '合同已生成',
    contractExportedDesc: '已保存到小程序本地；点击「预览保存」后，可通过右上角「…」菜单选择「用其他应用打开」→「保存到文件」，保存到手机；也可直接转发到微信好友/文件传输助手',
    contractFileNameLabel: '文件名',
    contractOpenPreview: '预览保存',
    // ⚠️ 微信 showModal 按钮文字最多 4 个汉字！不能再多
    contractShareDirectly: '直接分享',
    // ⚠️ 4 字上限
    contractShareTip: '也可直接转发到微信好友/文件传输助手，再下载保存',
    contractGenerated: '合同生成成功',
    contractGenerateFail: '合同生成失败',
    contractSaved: '合同已保存到本地',
    salePerson: '报价员',
    salePersonPlaceholder: '请输入报价员姓名',
    customerName: '客户名称',
    customerPlaceholder: '请输入客户名称',
    productName: '产品名称',
    modelSpec: '型号规格',
    gateMaterialCol: '闸板材质',
    stemMaterialCol: '阀杆材质',
    quantityCol: '数量',
    unitPriceCol: '单价',
    brandingFeeCol: '磨标费',
    totalPriceCol: '总价',
    selectedProducts: '选购产品信息',
    spec: '规格',
    productTypeCol: '产品类型',
    bodyMaterialCol: '阀体材质',
    yokeMaterialCol: '支架材质',
    pieces: '件',
    totalAmount: '合计金额',
    finalPrice: '确认报价金额',
    finalPricePlaceholder: '请输入最终报价金额',
    remark: '备注信息',
    remarkPlaceholder: '请输入备注信息',
    paymentMethod: '付款方式',
    paymentMethodPlaceholder: '请输入付款方式',
    packaging: '包装方式',
    packagingPlaceholder: '请输入包装方式',
    quoter: '报 价 人',
    quoterPlaceholder: '请输入报价人',
    contactPhone: '联系手机',
    contactPhonePlaceholder: '请输入手机号码',
    validity: '报有效期',
    validityPlaceholder: '请输入有效期',
    quoteDate: '报价日期',
    companyName: '奇胜阀门有限公司',
    companyNameEn: 'CHISUN VALVE CO., LTD.',
    companyWebsite: '官网：www.chisun.cn / www.qishengvalve.com',
    companyEmail: '邮箱：qs@chisun.cn',
    companyAddress: '地址：浙江省温州市空港新区兴业路8号 邮编：325013',
    companyPhone: '电话：15777828587',
    priceGenerating: '正在制作报价表...',
    saveSuccess: '报价数据已保存',
    saveFail: '保存失败，请检查网络',
    savedToAlbum: '报价单已妥善存储到相册',
    needAlbumPermission: '请开启相册读写权限',
    needPermissionTitle: '需要相册权限',
    needAlbumPermissionDesc: '保存报价单图片需要使用相册读写权限，请在设置中开启「保存到相册」后重试。',
    toOpenSettings: '去设置',
    cancel: '取消',
    permissionGranted: '权限已开启',
    renderFail: '高精度渲染失败',
    logoLoadFail: '企业徽标调取失败',
    shareTitle: '您的特约报价单',
    pricingInfo: '规格参数：',
    maxPressure: '最高承压',
    unitWeight: '单重',
    laps: '圈数',
    torque: '扭矩',
    remarkAndTech: '备注及技术要求：',
    confirmAmount: '确认报价金额：',
    quoterSign: '报价制单人：',
    quoterPhoneLabel: '联系电话：',
    validityLabel: '报价有效期：',
    issueDate: '发布日期：',
    defaultPayment: '预定定金30%，付清余款发货。',
    defaultPackaging: '木箱包装。可以提供产品使用说明，产品材质报告，产品检测报告。',
    defaultQuoter: '报价人 1',
    defaultQuoterPhone: '15988785557',
    defaultValidity: '15天',
    noSalePerson: '未指定报价员',
    noCustomer: '未指定客户',
    weightUnit: 'KG',
    torqueUnit: 'N.M',
    dateFormat: 'YYYY年MM月DD日'
  },
  language: {
    switchLang: '切换语言',
    currentLang: '中文',
    switchSuccess: '已切换为中文',
    switchSuccessEn: 'Switched to English'
  }
};
exports.default = _default;

/***/ }),
/* 51 */
/*!*************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/locale/en-US.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    loading: 'Loading...',
    loadFail: 'Loading failed',
    saveSuccess: 'Saved successfully',
    saveFail: 'Save failed',
    search: 'Search',
    copy: 'Copy',
    close: 'Close',
    submit: 'Submit',
    delete: 'Delete',
    edit: 'Edit',
    confirmAction: 'Confirm Action'
  },
  nav: {
    back: 'Back',
    home: 'Home'
  },
  login: {
    title: 'Login',
    systemTitle: 'Valve Quotation System',
    systemSubtitle: '阀门报价系统',
    userLogin: 'User Login',
    username: 'Username',
    password: 'Password',
    usernamePlaceholder: 'Enter username',
    passwordPlaceholder: 'Enter password',
    usernameRequired: 'Please enter username',
    passwordRequired: 'Please enter password',
    passwordMinLength: 'Password must be at least 6 characters',
    rememberLogin: 'Remember login',
    loginBtn: 'LOGIN',
    loggingIn: 'Logging in...',
    loginSuccess: 'Login successful',
    loginFail: 'Login failed, please check your credentials',
    contactAdmin: 'Contact system administrator if you have any questions'
  },
  product: {
    category: 'Products',
    brand: 'CHISUN VALVE · 奇胜阀门',
    brandTagline: 'Industrial Valve Excellence · Quality That Endures',
    brandSince: 'Founded in Wenzhou, Zhejiang · Years of industrial valve manufacturing',
    title: 'Valve Product Series',
    subtitle: 'Select a product series to configure specifications and generate quotations',
    searchPlaceholder: 'Search product series...',
    searchPlaceholderEn: 'Search product series...',
    totalSeries: '{count} series total',
    noResult: 'No matching series found',
    noResultSub: 'Try searching for "QB" or "QW"',
    noSeriesData: 'No Data',
    noSeriesDataMsg: 'No product data entered for {series}, please import prices first.',
    certIso: 'ISO 9001',
    certCe: 'CE Certified',
    certApi: 'API Compliant',
    footerAbout: 'About Us',
    footerContact: 'Contact'
  },
  index: {
    valveSelection: 'Valve Selection',
    configQuote: 'Configure Quotation',
    configTitle: 'Select the following parameters to generate a quotation',
    productConfig: 'Product Configuration',
    valveModel: 'Valve Model',
    selectValveModel: 'Please select valve model',
    specSize: 'Size (DN)',
    selectSpecSize: 'Please select size',
    bodyMaterial: 'Body Material',
    selectBodyMaterial: 'Please select body material',
    gateMaterial: 'Gate Material',
    selectGateMaterial: 'Please select gate material',
    stemMaterial: 'Stem Material',
    selectStemMaterial: 'Please select stem material',
    yokeMaterial: 'Yoke Material',
    selectYokeMaterial: 'Please select yoke material',
    productType: 'Product Type',
    quantity: 'Quantity',
    inputQuantity: 'Enter quantity',
    moqHint: 'MOQ: {moq}',
    branding: 'Branding',
    yes: 'Yes',
    no: 'No',
    unitPrice: 'Unit Price',
    originalUnitPrice: 'Unit Price',
    modifiedUnitPrice: 'Adjusted',
    estimatedTotal: 'Estimated Total',
    priceTip: 'To adjust the price, please edit the adjusted price.',
    addToQuote: 'Add to Quotation',
    generateQuote: 'Generate Quotation',
    quoteDetails: 'Quotation Details',
    totalItems: '{count} items',
    totalAmount: 'Total Amount',
    noQuoteItems: 'No quotation items',
    noQuoteItemsSub: 'Configure parameters and click "Add to Quotation"',
    loadingData: 'Loading data...',
    calculating: 'Calculating...',
    dataLoadFail: 'Failed to load data',
    addSuccess: 'Added to quotation',
    fillCompleteInfo: 'Please fill in complete information',
    comboNotAvailable: 'This combination is not available',
    addFirst: 'Please add valves to quotation first',
    regular: 'Regular',
    newProduct: 'New',
    moqMetOEM: 'MOQ Met - OEM',
    moqMetOriginal: 'MOQ Met - Original',
    moqUnmetOEM: 'Below MOQ - OEM',
    moqUnmetOriginal: 'Below MOQ - Original'
  },
  quotation: {
    title: 'QUOTATION',
    generateAndSave: 'Generate & Save Quotation',
    generateContractExcel: 'Generate Purchase Contract (Excel)',
    shareQuotation: 'Share Quotation',
    backToAdd: 'Back to Add',
    contractGenerating: 'Generating Purchase Contract…',
    contractExported: 'Contract Generated',
    contractExportedDesc: 'Saved locally in Mini Program. Tap "Open & Save" → tap "..." in the top-right → "Open in Other App" → "Save to Files" to store on your device.',
    contractFileNameLabel: 'File name',
    contractOpenPreview: 'Open',
    // ⚠️ WeChat showModal confirmText/cancelText length limit (~4 Chinese chars ≈ short English)
    contractShareDirectly: 'Share',
    // Keep it short, else 'cancelText length should not larger than 4 Chinese chars' equivalent
    contractShareTip: 'Or share to File Transfer Assistant / friend and download from chat.',
    contractGenerated: 'Contract generated successfully',
    contractGenerateFail: 'Failed to generate contract',
    contractSaved: 'Contract saved locally',
    salePerson: 'Salesperson',
    salePersonPlaceholder: 'Enter salesperson name',
    customerName: 'Customer Name',
    customerPlaceholder: 'Enter customer name',
    productName: 'Product Name',
    modelSpec: 'Model/Spec',
    gateMaterialCol: 'Gate Material',
    stemMaterialCol: 'Stem Material',
    quantityCol: 'Quantity',
    unitPriceCol: 'Unit Price',
    brandingFeeCol: 'Branding Fee',
    totalPriceCol: 'Total Price',
    selectedProducts: 'Selected Products',
    spec: 'Size',
    productTypeCol: 'Product Type',
    bodyMaterialCol: 'Body Material',
    yokeMaterialCol: 'Yoke Material',
    pieces: ' pcs',
    totalAmount: 'Total Amount',
    finalPrice: 'Confirmed Amount',
    finalPricePlaceholder: 'Enter final quotation amount',
    remark: 'Remarks',
    remarkPlaceholder: 'Enter remarks',
    paymentMethod: 'Payment Method',
    paymentMethodPlaceholder: 'Enter payment method',
    packaging: 'Packaging',
    packagingPlaceholder: 'Enter packaging method',
    quoter: 'Quotation By',
    quoterPlaceholder: 'Enter quoter name',
    contactPhone: 'Contact Phone',
    contactPhonePlaceholder: 'Enter phone number',
    validity: 'Validity',
    validityPlaceholder: 'Enter validity period',
    quoteDate: 'Quotation Date',
    companyName: 'CHISUN VALVE CO., LTD.',
    companyNameEn: '奇胜阀门有限公司',
    companyWebsite: 'Website: www.chisun.cn / www.qishengvalve.com',
    companyEmail: 'Email: qs@chisun.cn',
    companyAddress: 'Address: No.8 Xingye Road, Airport New District, Wenzhou, Zhejiang, China 325013',
    companyPhone: 'Tel: +86-15777828587',
    priceGenerating: 'Generating quotation...',
    saveSuccess: 'Quotation data saved',
    saveFail: 'Save failed, please check network',
    savedToAlbum: 'Quotation saved to album',
    needAlbumPermission: 'Please enable album access permission',
    needPermissionTitle: 'Album Permission Required',
    needAlbumPermissionDesc: 'Saving the quotation image requires album access. Please enable "Save to Photos" in Settings and try again.',
    toOpenSettings: 'Open Settings',
    cancel: 'Cancel',
    permissionGranted: 'Permission granted',
    renderFail: 'High-precision rendering failed',
    logoLoadFail: 'Failed to load company logo',
    shareTitle: 'Your Special Quotation',
    pricingInfo: 'Specs:',
    maxPressure: 'Max Pressure',
    unitWeight: 'Unit Weight',
    laps: 'Laps',
    torque: 'Torque',
    remarkAndTech: 'Remarks & Technical Requirements:',
    confirmAmount: 'Confirmed Amount:',
    quoterSign: 'Quotation By:',
    quoterPhoneLabel: 'Contact Phone:',
    validityLabel: 'Validity:',
    issueDate: 'Issue Date:',
    defaultPayment: '30% deposit in advance, balance paid before delivery.',
    defaultPackaging: 'Wooden box packaging. Product manual, material report, and inspection report available.',
    defaultQuoter: 'Quoter 1',
    defaultQuoterPhone: '+86-15988785557',
    defaultValidity: '15 Days',
    noSalePerson: 'Unspecified',
    noCustomer: 'Unspecified',
    weightUnit: 'KG',
    torqueUnit: 'N.M',
    dateFormat: 'YYYY-MM-DD'
  },
  language: {
    switchLang: 'Switch Language',
    currentLang: 'English',
    switchSuccess: 'Switched to Chinese',
    switchSuccessEn: '已切换为英文'
  }
};
exports.default = _default;

/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */
/*!************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/@babel/runtime/regenerator/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! @babel/runtime/helpers/regeneratorRuntime */ 59)();
module.exports = runtime;

/***/ }),
/* 59 */
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(/*! ./typeof.js */ 13)["default"];
function _regeneratorRuntime() {
  "use strict";

  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return e;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function define(t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function value(t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) {
              if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            }
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(_typeof(e) + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) {
      r.push(n);
    }
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) {
        "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      }
    },
    stop: function stop() {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function complete(t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function finish(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    "catch": function _catch(t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 60 */
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 61 */
/*!****************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/utils/cloud-api.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userApi = exports.storage = exports.quotationApi = exports.priceApi = exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 58));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 60));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
// 微信云开发 API 封装
// 替换原来的 HTTP 请求为云函数调用
// 调用云函数的通用封装
function callCloudFunction(_x, _x2) {
  return _callCloudFunction.apply(this, arguments);
} // 调用云函数并返回完整结果（用于需要message等额外字段的场景）
function _callCloudFunction() {
  _callCloudFunction = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(name, data) {
    var result;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return wx.cloud.callFunction({
              name: name,
              data: data
            });
          case 3:
            result = _context3.sent;
            if (!result.result.success) {
              _context3.next = 8;
              break;
            }
            return _context3.abrupt("return", result.result.data);
          case 8:
            throw new Error(result.result.message || '请求失败');
          case 9:
            _context3.next = 15;
            break;
          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](0);
            console.error('云函数调用失败 [' + name + ']:', _context3.t0);
            throw _context3.t0;
          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 11]]);
  }));
  return _callCloudFunction.apply(this, arguments);
}
function callCloudFunctionRaw(_x3, _x4) {
  return _callCloudFunctionRaw.apply(this, arguments);
} // 报价相关API
function _callCloudFunctionRaw() {
  _callCloudFunctionRaw = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(name, data) {
    var result;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return wx.cloud.callFunction({
              name: name,
              data: data
            });
          case 3:
            result = _context4.sent;
            return _context4.abrupt("return", result.result);
          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            console.error('云函数调用失败 [' + name + ']:', _context4.t0);
            throw _context4.t0;
          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));
  return _callCloudFunctionRaw.apply(this, arguments);
}
var quotationApi = {
  // 创建报价单
  create: function create(data) {
    return callCloudFunction('quotation', {
      action: 'createQuotation',
      customerName: data.customerName,
      note: data.note,
      paymentMethod: data.paymentMethod,
      packaging: data.packaging,
      quoter: data.quoter,
      quoterPhone: data.quoterPhone,
      validity: data.validity,
      items: data.items
    });
  },
  // 获取报价单列表
  getList: function getList() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    var status = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var params = {
      action: 'getQuotationList',
      page: page,
      limit: limit
    };
    if (status) params.status = status;
    return callCloudFunction('quotation', params);
  },
  // 获取报价单详情
  getDetail: function getDetail(id) {
    return callCloudFunction('quotation', {
      action: 'getQuotationDetail',
      id: id
    });
  },
  // 更新报价单
  update: function update(id, data) {
    return callCloudFunction('quotation', _objectSpread({
      action: 'updateQuotation',
      id: id
    }, data));
  },
  // 删除报价单
  delete: function _delete(id) {
    return callCloudFunction('quotation', {
      action: 'deleteQuotation',
      id: id
    });
  }
};

// 价格库相关API
exports.quotationApi = quotationApi;
var priceApi = {
  // 获取价格数据
  getPrices: function getPrices() {
    var series = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var params = {
      action: 'getPrices'
    };
    if (series) params.series = series;
    return callCloudFunction('price', params);
  },
  // 获取产品图片（云存储临时链接）
  getImages: function getImages() {
    return callCloudFunction('images');
  },
  // 获取所有产品系列
  getSeries: function getSeries() {
    return callCloudFunction('price', {
      action: 'getAllSeries'
    });
  },
  // 获取所有阀门型号
  getModels: function getModels() {
    return callCloudFunction('price', {
      action: 'getAllModels'
    });
  },
  // 根据系列名称获取阀门型号
  getModelsBySeries: function getModelsBySeries(seriesName) {
    return callCloudFunction('price', {
      action: 'getModelsBySeries',
      seriesName: seriesName
    });
  },
  // 获取报价系数规则
  getPricingRules: function getPricingRules() {
    return callCloudFunctionRaw('price', {
      action: 'getPricingRules'
    });
  },
  // 获取系统配置
  getSystemConfig: function getSystemConfig(keys) {
    return callCloudFunctionRaw('price', {
      action: 'getSystemConfig',
      keys: keys
    });
  },
  // 获取所有材质数据
  getMaterials: function getMaterials(seriesName) {
    return callCloudFunctionRaw('price', {
      action: 'getMaterials',
      seriesName: seriesName
    });
  },
  // 根据型号ID获取材质
  getMaterialByModel: function getMaterialByModel(modelId) {
    return callCloudFunctionRaw('price', {
      action: 'getMaterialByModel',
      modelId: modelId
    });
  },
  // 获取材质价差数据
  getMaterialDiffs: function getMaterialDiffs(seriesName) {
    return callCloudFunctionRaw('price', {
      action: 'getMaterialDiffs',
      seriesName: seriesName
    });
  },
  // 获取单个材质价差
  getMaterialDiff: function getMaterialDiff(seriesName, partName, baseMaterial, targetMaterial, dn) {
    return callCloudFunctionRaw('price', {
      action: 'getMaterialDiff',
      seriesName: seriesName,
      partName: partName,
      baseMaterial: baseMaterial,
      targetMaterial: targetMaterial,
      dn: dn
    });
  },
  // 获取所有可用材质列表
  getAllMaterials: function getAllMaterials() {
    return callCloudFunctionRaw('price', {
      action: 'getAllMaterials'
    });
  },
  // 获取模板下载链接
  getTemplateUrl: function getTemplateUrl() {
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", callCloudFunction('template'));
            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  // 获取材质库模板下载链接
  getMaterialLibraryTemplateUrl: function getMaterialLibraryTemplateUrl() {
    return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", callCloudFunction('template', {
                action: 'materialLibrary'
              }));
            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  },
  // 获取营销员列表
  getSalespersons: function getSalespersons() {
    return callCloudFunctionRaw('price', {
      action: 'getSalespersons'
    });
  },
  // 获取客户列表
  getCustomers: function getCustomers() {
    var salespersonId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var params = {
      action: 'getCustomers'
    };
    if (salespersonId) params.salespersonId = salespersonId;
    return callCloudFunctionRaw('price', params);
  },
  // 获取规格参数
  getModelSpecs: function getModelSpecs(valveName, size) {
    return callCloudFunctionRaw('price', {
      action: 'getModelSpec',
      valveName: valveName,
      size: size
    });
  }
};

// 用户相关API
exports.priceApi = priceApi;
var userApi = {
  // 用户登录
  login: function login(username, password) {
    return callCloudFunction('user', {
      action: 'login',
      username: username,
      password: password
    });
  },
  // 用户注册
  register: function register(username, password, nickname, email, phone) {
    return callCloudFunction('user', {
      action: 'register',
      username: username,
      password: password,
      nickname: nickname,
      email: email,
      phone: phone
    });
  },
  // 获取用户信息
  getProfile: function getProfile(id) {
    return callCloudFunction('user', {
      action: 'getProfile',
      id: id
    });
  },
  // 获取所有用户
  getAllUsers: function getAllUsers() {
    return callCloudFunction('user', {
      action: 'getAllUsers'
    });
  },
  // 更新用户信息
  update: function update(id, data) {
    return callCloudFunction('user', _objectSpread({
      action: 'updateUser',
      id: id
    }, data));
  },
  // 修改密码
  changePassword: function changePassword(id, oldPassword, newPassword) {
    return callCloudFunction('user', {
      action: 'changePassword',
      id: id,
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  },
  // 删除用户
  delete: function _delete(id) {
    return callCloudFunction('user', {
      action: 'deleteUser',
      id: id
    });
  }
};

// 本地存储工具
exports.userApi = userApi;
var storage = {
  // 保存用户信息
  saveUser: function saveUser(user) {
    uni.setStorageSync('user', JSON.stringify(user));
  },
  // 获取用户信息
  getUser: function getUser() {
    var user = uni.getStorageSync('user');
    return user ? JSON.parse(user) : null;
  },
  // 删除用户信息
  removeUser: function removeUser() {
    uni.removeStorageSync('user');
  },
  // 检查是否登录
  isLoggedIn: function isLoggedIn() {
    return !!this.getUser();
  }
};
exports.storage = storage;
var _default = {
  quotation: quotationApi,
  price: priceApi,
  user: userApi,
  storage: storage
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/*!****************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/utils/jszip.min.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer, global, process) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;var _typeof = __webpack_require__(/*! @babel/runtime/helpers/typeof */ 13);
/*!

JSZip v3.10.1 - A JavaScript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2016 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/main/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/main/LICENSE
*/

!function (e) {
  if ("object" == ( false ? undefined : _typeof(exports)) && "undefined" != typeof module) module.exports = e();else if (true) !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (e),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {}
}(function () {
  return function s(a, o, h) {
    function u(r, e) {
      if (!o[r]) {
        if (!a[r]) {
          var t = "function" == typeof require && require;
          if (!e && t) return require(r, !0);
          if (l) return l(r, !0);
          var n = new Error("Cannot find module '" + r + "'");
          throw n.code = "MODULE_NOT_FOUND", n;
        }
        var i = o[r] = {
          exports: {}
        };
        a[r][0].call(i.exports, function (e) {
          var t = a[r][1][e];
          return u(t || e);
        }, i, i.exports, s, a, o, h);
      }
      return o[r].exports;
    }
    for (var l = "function" == typeof require && require, e = 0; e < h.length; e++) {
      u(h[e]);
    }
    return u;
  }({
    1: [function (e, t, r) {
      "use strict";

      var d = e("./utils"),
        c = e("./support"),
        p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      r.encode = function (e) {
        for (var t, r, n, i, s, a, o, h = [], u = 0, l = e.length, f = l, c = "string" !== d.getTypeOf(e); u < e.length;) {
          f = l - u, n = c ? (t = e[u++], r = u < l ? e[u++] : 0, u < l ? e[u++] : 0) : (t = e.charCodeAt(u++), r = u < l ? e.charCodeAt(u++) : 0, u < l ? e.charCodeAt(u++) : 0), i = t >> 2, s = (3 & t) << 4 | r >> 4, a = 1 < f ? (15 & r) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
        }
        return h.join("");
      }, r.decode = function (e) {
        var t,
          r,
          n,
          i,
          s,
          a,
          o = 0,
          h = 0,
          u = "data:";
        if (e.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
        var l,
          f = 3 * (e = e.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (e.charAt(e.length - 1) === p.charAt(64) && f--, e.charAt(e.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
        for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e.length;) {
          t = p.indexOf(e.charAt(o++)) << 2 | (i = p.indexOf(e.charAt(o++))) >> 4, r = (15 & i) << 4 | (s = p.indexOf(e.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e.charAt(o++))), l[h++] = t, 64 !== s && (l[h++] = r), 64 !== a && (l[h++] = n);
        }
        return l;
      };
    }, {
      "./support": 30,
      "./utils": 32
    }],
    2: [function (e, t, r) {
      "use strict";

      var n = e("./external"),
        i = e("./stream/DataWorker"),
        s = e("./stream/Crc32Probe"),
        a = e("./stream/DataLengthProbe");
      function o(e, t, r, n, i) {
        this.compressedSize = e, this.uncompressedSize = t, this.crc32 = r, this.compression = n, this.compressedContent = i;
      }
      o.prototype = {
        getContentWorker: function getContentWorker() {
          var e = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")),
            t = this;
          return e.on("end", function () {
            if (this.streamInfo.data_length !== t.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), e;
        },
        getCompressedWorker: function getCompressedWorker() {
          return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        }
      }, o.createWorkerFrom = function (e, t, r) {
        return e.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t.compressWorker(r)).pipe(new a("compressedSize")).withStreamInfo("compression", t);
      }, t.exports = o;
    }, {
      "./external": 6,
      "./stream/Crc32Probe": 25,
      "./stream/DataLengthProbe": 26,
      "./stream/DataWorker": 27
    }],
    3: [function (e, t, r) {
      "use strict";

      var n = e("./stream/GenericWorker");
      r.STORE = {
        magic: "\0\0",
        compressWorker: function compressWorker() {
          return new n("STORE compression");
        },
        uncompressWorker: function uncompressWorker() {
          return new n("STORE decompression");
        }
      }, r.DEFLATE = e("./flate");
    }, {
      "./flate": 7,
      "./stream/GenericWorker": 28
    }],
    4: [function (e, t, r) {
      "use strict";

      var n = e("./utils");
      var o = function () {
        for (var e, t = [], r = 0; r < 256; r++) {
          e = r;
          for (var n = 0; n < 8; n++) {
            e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
          }
          t[r] = e;
        }
        return t;
      }();
      t.exports = function (e, t) {
        return void 0 !== e && e.length ? "string" !== n.getTypeOf(e) ? function (e, t, r, n) {
          var i = o,
            s = n + r;
          e ^= -1;
          for (var a = n; a < s; a++) {
            e = e >>> 8 ^ i[255 & (e ^ t[a])];
          }
          return -1 ^ e;
        }(0 | t, e, e.length, 0) : function (e, t, r, n) {
          var i = o,
            s = n + r;
          e ^= -1;
          for (var a = n; a < s; a++) {
            e = e >>> 8 ^ i[255 & (e ^ t.charCodeAt(a))];
          }
          return -1 ^ e;
        }(0 | t, e, e.length, 0) : 0;
      };
    }, {
      "./utils": 32
    }],
    5: [function (e, t, r) {
      "use strict";

      r.base64 = !1, r.binary = !1, r.dir = !1, r.createFolders = !0, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
    }, {}],
    6: [function (e, t, r) {
      "use strict";

      var n = null;
      n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = {
        Promise: n
      };
    }, {
      lie: 37
    }],
    7: [function (e, t, r) {
      "use strict";

      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
        i = e("pako"),
        s = e("./utils"),
        a = e("./stream/GenericWorker"),
        o = n ? "uint8array" : "array";
      function h(e, t) {
        a.call(this, "FlateWorker/" + e), this._pako = null, this._pakoAction = e, this._pakoOptions = t, this.meta = {};
      }
      r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function (e) {
        this.meta = e.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e.data), !1);
      }, h.prototype.flush = function () {
        a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], !0);
      }, h.prototype.cleanUp = function () {
        a.prototype.cleanUp.call(this), this._pako = null;
      }, h.prototype._createPako = function () {
        this._pako = new i[this._pakoAction]({
          raw: !0,
          level: this._pakoOptions.level || -1
        });
        var t = this;
        this._pako.onData = function (e) {
          t.push({
            data: e,
            meta: t.meta
          });
        };
      }, r.compressWorker = function (e) {
        return new h("Deflate", e);
      }, r.uncompressWorker = function () {
        return new h("Inflate", {});
      };
    }, {
      "./stream/GenericWorker": 28,
      "./utils": 32,
      pako: 38
    }],
    8: [function (e, t, r) {
      "use strict";

      function A(e, t) {
        var r,
          n = "";
        for (r = 0; r < t; r++) {
          n += String.fromCharCode(255 & e), e >>>= 8;
        }
        return n;
      }
      function n(e, t, r, n, i, s) {
        var a,
          o,
          h = e.file,
          u = e.compression,
          l = s !== O.utf8encode,
          f = I.transformTo("string", s(h.name)),
          c = I.transformTo("string", O.utf8encode(h.name)),
          d = h.comment,
          p = I.transformTo("string", s(d)),
          m = I.transformTo("string", O.utf8encode(d)),
          _ = c.length !== h.name.length,
          g = m.length !== d.length,
          b = "",
          v = "",
          y = "",
          w = h.dir,
          k = h.date,
          x = {
            crc32: 0,
            compressedSize: 0,
            uncompressedSize: 0
          };
        t && !r || (x.crc32 = e.crc32, x.compressedSize = e.compressedSize, x.uncompressedSize = e.uncompressedSize);
        var S = 0;
        t && (S |= 8), l || !_ && !g || (S |= 2048);
        var z = 0,
          C = 0;
        w && (z |= 16), "UNIX" === i ? (C = 798, z |= function (e, t) {
          var r = e;
          return e || (r = t ? 16893 : 33204), (65535 & r) << 16;
        }(h.unixPermissions, w)) : (C = 20, z |= function (e) {
          return 63 & (e || 0);
        }(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B(p), 4) + m, b += "uc" + A(y.length, 2) + y);
        var E = "";
        return E += "\n\0", E += A(S, 2), E += u.magic, E += A(a, 2), E += A(o, 2), E += A(x.crc32, 4), E += A(x.compressedSize, 4), E += A(x.uncompressedSize, 4), E += A(f.length, 2), E += A(b.length, 2), {
          fileRecord: R.LOCAL_FILE_HEADER + E + f + b,
          dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n, 4) + f + b + p
        };
      }
      var I = e("../utils"),
        i = e("../stream/GenericWorker"),
        O = e("../utf8"),
        B = e("../crc32"),
        R = e("../signature");
      function s(e, t, r, n) {
        i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t, this.zipPlatform = r, this.encodeFileName = n, this.streamFiles = e, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      I.inherits(s, i), s.prototype.push = function (e) {
        var t = e.meta.percent || 0,
          r = this.entriesCount,
          n = this._sources.length;
        this.accumulate ? this.contentBuffer.push(e) : (this.bytesWritten += e.data.length, i.prototype.push.call(this, {
          data: e.data,
          meta: {
            currentFile: this.currentFile,
            percent: r ? (t + 100 * (r - n - 1)) / r : 100
          }
        }));
      }, s.prototype.openedSource = function (e) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = e.file.name;
        var t = this.streamFiles && !e.file.dir;
        if (t) {
          var r = n(e, t, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({
            data: r.fileRecord,
            meta: {
              percent: 0
            }
          });
        } else this.accumulate = !0;
      }, s.prototype.closedSource = function (e) {
        this.accumulate = !1;
        var t = this.streamFiles && !e.file.dir,
          r = n(e, t, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(r.dirRecord), t) this.push({
          data: function (e) {
            return R.DATA_DESCRIPTOR + A(e.crc32, 4) + A(e.compressedSize, 4) + A(e.uncompressedSize, 4);
          }(e),
          meta: {
            percent: 100
          }
        });else for (this.push({
          data: r.fileRecord,
          meta: {
            percent: 0
          }
        }); this.contentBuffer.length;) {
          this.push(this.contentBuffer.shift());
        }
        this.currentFile = null;
      }, s.prototype.flush = function () {
        for (var e = this.bytesWritten, t = 0; t < this.dirRecords.length; t++) {
          this.push({
            data: this.dirRecords[t],
            meta: {
              percent: 100
            }
          });
        }
        var r = this.bytesWritten - e,
          n = function (e, t, r, n, i) {
            var s = I.transformTo("string", i(n));
            return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e, 2) + A(e, 2) + A(t, 4) + A(r, 4) + A(s.length, 2) + s;
          }(this.dirRecords.length, r, e, this.zipComment, this.encodeFileName);
        this.push({
          data: n,
          meta: {
            percent: 100
          }
        });
      }, s.prototype.prepareNextSource = function () {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, s.prototype.registerPrevious = function (e) {
        this._sources.push(e);
        var t = this;
        return e.on("data", function (e) {
          t.processChunk(e);
        }), e.on("end", function () {
          t.closedSource(t.previous.streamInfo), t._sources.length ? t.prepareNextSource() : t.end();
        }), e.on("error", function (e) {
          t.error(e);
        }), this;
      }, s.prototype.resume = function () {
        return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
      }, s.prototype.error = function (e) {
        var t = this._sources;
        if (!i.prototype.error.call(this, e)) return !1;
        for (var r = 0; r < t.length; r++) {
          try {
            t[r].error(e);
          } catch (e) {}
        }
        return !0;
      }, s.prototype.lock = function () {
        i.prototype.lock.call(this);
        for (var e = this._sources, t = 0; t < e.length; t++) {
          e[t].lock();
        }
      }, t.exports = s;
    }, {
      "../crc32": 4,
      "../signature": 23,
      "../stream/GenericWorker": 28,
      "../utf8": 31,
      "../utils": 32
    }],
    9: [function (e, t, r) {
      "use strict";

      var u = e("../compressions"),
        n = e("./ZipFileWorker");
      r.generateWorker = function (e, a, t) {
        var o = new n(a.streamFiles, t, a.platform, a.encodeFileName),
          h = 0;
        try {
          e.forEach(function (e, t) {
            h++;
            var r = function (e, t) {
                var r = e || t,
                  n = u[r];
                if (!n) throw new Error(r + " is not a valid compression method !");
                return n;
              }(t.options.compression, a.compression),
              n = t.options.compressionOptions || a.compressionOptions || {},
              i = t.dir,
              s = t.date;
            t._compressWorker(r, n).withStreamInfo("file", {
              name: e,
              dir: i,
              date: s,
              comment: t.comment || "",
              unixPermissions: t.unixPermissions,
              dosPermissions: t.dosPermissions
            }).pipe(o);
          }), o.entriesCount = h;
        } catch (e) {
          o.error(e);
        }
        return o;
      };
    }, {
      "../compressions": 3,
      "./ZipFileWorker": 8
    }],
    10: [function (e, t, r) {
      "use strict";

      function n() {
        if (!(this instanceof n)) return new n();
        if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = Object.create(null), this.comment = null, this.root = "", this.clone = function () {
          var e = new n();
          for (var t in this) {
            "function" != typeof this[t] && (e[t] = this[t]);
          }
          return e;
        };
      }
      (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.1", n.loadAsync = function (e, t) {
        return new n().loadAsync(e, t);
      }, n.external = e("./external"), t.exports = n;
    }, {
      "./defaults": 5,
      "./external": 6,
      "./load": 11,
      "./object": 15,
      "./support": 30
    }],
    11: [function (e, t, r) {
      "use strict";

      var u = e("./utils"),
        i = e("./external"),
        n = e("./utf8"),
        s = e("./zipEntries"),
        a = e("./stream/Crc32Probe"),
        l = e("./nodejsUtils");
      function f(n) {
        return new i.Promise(function (e, t) {
          var r = n.decompressed.getContentWorker().pipe(new a());
          r.on("error", function (e) {
            t(e);
          }).on("end", function () {
            r.streamInfo.crc32 !== n.decompressed.crc32 ? t(new Error("Corrupted zip : CRC32 mismatch")) : e();
          }).resume();
        });
      }
      t.exports = function (e, o) {
        var h = this;
        return o = u.extend(o || {}, {
          base64: !1,
          checkCRC32: !1,
          optimizedBinaryString: !1,
          createFolders: !1,
          decodeFileName: n.utf8decode
        }), l.isNode && l.isStream(e) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e, !0, o.optimizedBinaryString, o.base64).then(function (e) {
          var t = new s(o);
          return t.load(e), t;
        }).then(function (e) {
          var t = [i.Promise.resolve(e)],
            r = e.files;
          if (o.checkCRC32) for (var n = 0; n < r.length; n++) {
            t.push(f(r[n]));
          }
          return i.Promise.all(t);
        }).then(function (e) {
          for (var t = e.shift(), r = t.files, n = 0; n < r.length; n++) {
            var i = r[n],
              s = i.fileNameStr,
              a = u.resolve(i.fileNameStr);
            h.file(a, i.decompressed, {
              binary: !0,
              optimizedBinaryString: !0,
              date: i.date,
              dir: i.dir,
              comment: i.fileCommentStr.length ? i.fileCommentStr : null,
              unixPermissions: i.unixPermissions,
              dosPermissions: i.dosPermissions,
              createFolders: o.createFolders
            }), i.dir || (h.file(a).unsafeOriginalName = s);
          }
          return t.zipComment.length && (h.comment = t.zipComment), h;
        });
      };
    }, {
      "./external": 6,
      "./nodejsUtils": 14,
      "./stream/Crc32Probe": 25,
      "./utf8": 31,
      "./utils": 32,
      "./zipEntries": 33
    }],
    12: [function (e, t, r) {
      "use strict";

      var n = e("../utils"),
        i = e("../stream/GenericWorker");
      function s(e, t) {
        i.call(this, "Nodejs stream input adapter for " + e), this._upstreamEnded = !1, this._bindStream(t);
      }
      n.inherits(s, i), s.prototype._bindStream = function (e) {
        var t = this;
        (this._stream = e).pause(), e.on("data", function (e) {
          t.push({
            data: e,
            meta: {
              percent: 0
            }
          });
        }).on("error", function (e) {
          t.isPaused ? this.generatedError = e : t.error(e);
        }).on("end", function () {
          t.isPaused ? t._upstreamEnded = !0 : t.end();
        });
      }, s.prototype.pause = function () {
        return !!i.prototype.pause.call(this) && (this._stream.pause(), !0);
      }, s.prototype.resume = function () {
        return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
      }, t.exports = s;
    }, {
      "../stream/GenericWorker": 28,
      "../utils": 32
    }],
    13: [function (e, t, r) {
      "use strict";

      var i = e("readable-stream").Readable;
      function n(e, t, r) {
        i.call(this, t), this._helper = e;
        var n = this;
        e.on("data", function (e, t) {
          n.push(e) || n._helper.pause(), r && r(t);
        }).on("error", function (e) {
          n.emit("error", e);
        }).on("end", function () {
          n.push(null);
        });
      }
      e("../utils").inherits(n, i), n.prototype._read = function () {
        this._helper.resume();
      }, t.exports = n;
    }, {
      "../utils": 32,
      "readable-stream": 16
    }],
    14: [function (e, t, r) {
      "use strict";

      t.exports = {
        isNode: "undefined" != typeof Buffer,
        newBufferFrom: function newBufferFrom(e, t) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e, t);
          if ("number" == typeof e) throw new Error('The "data" argument must not be a number');
          return new Buffer(e, t);
        },
        allocBuffer: function allocBuffer(e) {
          if (Buffer.alloc) return Buffer.alloc(e);
          var t = new Buffer(e);
          return t.fill(0), t;
        },
        isBuffer: function isBuffer(e) {
          return Buffer.isBuffer(e);
        },
        isStream: function isStream(e) {
          return e && "function" == typeof e.on && "function" == typeof e.pause && "function" == typeof e.resume;
        }
      };
    }, {}],
    15: [function (e, t, r) {
      "use strict";

      function s(e, t, r) {
        var n,
          i = u.getTypeOf(t),
          s = u.extend(r || {}, f);
        s.date = s.date || new Date(), null !== s.compression && (s.compression = s.compression.toUpperCase()), "string" == typeof s.unixPermissions && (s.unixPermissions = parseInt(s.unixPermissions, 8)), s.unixPermissions && 16384 & s.unixPermissions && (s.dir = !0), s.dosPermissions && 16 & s.dosPermissions && (s.dir = !0), s.dir && (e = g(e)), s.createFolders && (n = _(e)) && b.call(this, n, !0);
        var a = "string" === i && !1 === s.binary && !1 === s.base64;
        r && void 0 !== r.binary || (s.binary = !a), (t instanceof c && 0 === t.uncompressedSize || s.dir || !t || 0 === t.length) && (s.base64 = !1, s.binary = !0, t = "", s.compression = "STORE", i = "string");
        var o = null;
        o = t instanceof c || t instanceof l ? t : p.isNode && p.isStream(t) ? new m(e, t) : u.prepareContent(e, t, s.binary, s.optimizedBinaryString, s.base64);
        var h = new d(e, o, s);
        this.files[e] = h;
      }
      var i = e("./utf8"),
        u = e("./utils"),
        l = e("./stream/GenericWorker"),
        a = e("./stream/StreamHelper"),
        f = e("./defaults"),
        c = e("./compressedObject"),
        d = e("./zipObject"),
        o = e("./generate"),
        p = e("./nodejsUtils"),
        m = e("./nodejs/NodejsStreamInputAdapter"),
        _ = function _(e) {
          "/" === e.slice(-1) && (e = e.substring(0, e.length - 1));
          var t = e.lastIndexOf("/");
          return 0 < t ? e.substring(0, t) : "";
        },
        g = function g(e) {
          return "/" !== e.slice(-1) && (e += "/"), e;
        },
        b = function b(e, t) {
          return t = void 0 !== t ? t : f.createFolders, e = g(e), this.files[e] || s.call(this, e, null, {
            dir: !0,
            createFolders: t
          }), this.files[e];
        };
      function h(e) {
        return "[object RegExp]" === Object.prototype.toString.call(e);
      }
      var n = {
        load: function load() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        },
        forEach: function forEach(e) {
          var t, r, n;
          for (t in this.files) {
            n = this.files[t], (r = t.slice(this.root.length, t.length)) && t.slice(0, this.root.length) === this.root && e(r, n);
          }
        },
        filter: function filter(r) {
          var n = [];
          return this.forEach(function (e, t) {
            r(e, t) && n.push(t);
          }), n;
        },
        file: function file(e, t, r) {
          if (1 !== arguments.length) return e = this.root + e, s.call(this, e, t, r), this;
          if (h(e)) {
            var n = e;
            return this.filter(function (e, t) {
              return !t.dir && n.test(e);
            });
          }
          var i = this.files[this.root + e];
          return i && !i.dir ? i : null;
        },
        folder: function folder(r) {
          if (!r) return this;
          if (h(r)) return this.filter(function (e, t) {
            return t.dir && r.test(e);
          });
          var e = this.root + r,
            t = b.call(this, e),
            n = this.clone();
          return n.root = t.name, n;
        },
        remove: function remove(r) {
          r = this.root + r;
          var e = this.files[r];
          if (e || ("/" !== r.slice(-1) && (r += "/"), e = this.files[r]), e && !e.dir) delete this.files[r];else for (var t = this.filter(function (e, t) {
              return t.name.slice(0, r.length) === r;
            }), n = 0; n < t.length; n++) {
            delete this.files[t[n].name];
          }
          return this;
        },
        generate: function generate() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        },
        generateInternalStream: function generateInternalStream(e) {
          var t,
            r = {};
          try {
            if ((r = u.extend(e || {}, {
              streamFiles: !1,
              compression: "STORE",
              compressionOptions: null,
              type: "",
              platform: "DOS",
              comment: null,
              mimeType: "application/zip",
              encodeFileName: i.utf8encode
            })).type = r.type.toLowerCase(), r.compression = r.compression.toUpperCase(), "binarystring" === r.type && (r.type = "string"), !r.type) throw new Error("No output type specified.");
            u.checkSupport(r.type), "darwin" !== r.platform && "freebsd" !== r.platform && "linux" !== r.platform && "sunos" !== r.platform || (r.platform = "UNIX"), "win32" === r.platform && (r.platform = "DOS");
            var n = r.comment || this.comment || "";
            t = o.generateWorker(this, r, n);
          } catch (e) {
            (t = new l("error")).error(e);
          }
          return new a(t, r.type || "string", r.mimeType);
        },
        generateAsync: function generateAsync(e, t) {
          return this.generateInternalStream(e).accumulate(t);
        },
        generateNodeStream: function generateNodeStream(e, t) {
          return (e = e || {}).type || (e.type = "nodebuffer"), this.generateInternalStream(e).toNodejsStream(t);
        }
      };
      t.exports = n;
    }, {
      "./compressedObject": 2,
      "./defaults": 5,
      "./generate": 9,
      "./nodejs/NodejsStreamInputAdapter": 12,
      "./nodejsUtils": 14,
      "./stream/GenericWorker": 28,
      "./stream/StreamHelper": 29,
      "./utf8": 31,
      "./utils": 32,
      "./zipObject": 35
    }],
    16: [function (e, t, r) {
      "use strict";

      t.exports = e("stream");
    }, {
      stream: void 0
    }],
    17: [function (e, t, r) {
      "use strict";

      var n = e("./DataReader");
      function i(e) {
        n.call(this, e);
        for (var t = 0; t < this.data.length; t++) {
          e[t] = 255 & e[t];
        }
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function (e) {
        return this.data[this.zero + e];
      }, i.prototype.lastIndexOfSignature = function (e) {
        for (var t = e.charCodeAt(0), r = e.charCodeAt(1), n = e.charCodeAt(2), i = e.charCodeAt(3), s = this.length - 4; 0 <= s; --s) {
          if (this.data[s] === t && this.data[s + 1] === r && this.data[s + 2] === n && this.data[s + 3] === i) return s - this.zero;
        }
        return -1;
      }, i.prototype.readAndCheckSignature = function (e) {
        var t = e.charCodeAt(0),
          r = e.charCodeAt(1),
          n = e.charCodeAt(2),
          i = e.charCodeAt(3),
          s = this.readData(4);
        return t === s[0] && r === s[1] && n === s[2] && i === s[3];
      }, i.prototype.readData = function (e) {
        if (this.checkOffset(e), 0 === e) return [];
        var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
        return this.index += e, t;
      }, t.exports = i;
    }, {
      "../utils": 32,
      "./DataReader": 18
    }],
    18: [function (e, t, r) {
      "use strict";

      var n = e("../utils");
      function i(e) {
        this.data = e, this.length = e.length, this.index = 0, this.zero = 0;
      }
      i.prototype = {
        checkOffset: function checkOffset(e) {
          this.checkIndex(this.index + e);
        },
        checkIndex: function checkIndex(e) {
          if (this.length < this.zero + e || e < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e + "). Corrupted zip ?");
        },
        setIndex: function setIndex(e) {
          this.checkIndex(e), this.index = e;
        },
        skip: function skip(e) {
          this.setIndex(this.index + e);
        },
        byteAt: function byteAt() {},
        readInt: function readInt(e) {
          var t,
            r = 0;
          for (this.checkOffset(e), t = this.index + e - 1; t >= this.index; t--) {
            r = (r << 8) + this.byteAt(t);
          }
          return this.index += e, r;
        },
        readString: function readString(e) {
          return n.transformTo("string", this.readData(e));
        },
        readData: function readData() {},
        lastIndexOfSignature: function lastIndexOfSignature() {},
        readAndCheckSignature: function readAndCheckSignature() {},
        readDate: function readDate() {
          var e = this.readInt(4);
          return new Date(Date.UTC(1980 + (e >> 25 & 127), (e >> 21 & 15) - 1, e >> 16 & 31, e >> 11 & 31, e >> 5 & 63, (31 & e) << 1));
        }
      }, t.exports = i;
    }, {
      "../utils": 32
    }],
    19: [function (e, t, r) {
      "use strict";

      var n = e("./Uint8ArrayReader");
      function i(e) {
        n.call(this, e);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function (e) {
        this.checkOffset(e);
        var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
        return this.index += e, t;
      }, t.exports = i;
    }, {
      "../utils": 32,
      "./Uint8ArrayReader": 21
    }],
    20: [function (e, t, r) {
      "use strict";

      var n = e("./DataReader");
      function i(e) {
        n.call(this, e);
      }
      e("../utils").inherits(i, n), i.prototype.byteAt = function (e) {
        return this.data.charCodeAt(this.zero + e);
      }, i.prototype.lastIndexOfSignature = function (e) {
        return this.data.lastIndexOf(e) - this.zero;
      }, i.prototype.readAndCheckSignature = function (e) {
        return e === this.readData(4);
      }, i.prototype.readData = function (e) {
        this.checkOffset(e);
        var t = this.data.slice(this.zero + this.index, this.zero + this.index + e);
        return this.index += e, t;
      }, t.exports = i;
    }, {
      "../utils": 32,
      "./DataReader": 18
    }],
    21: [function (e, t, r) {
      "use strict";

      var n = e("./ArrayReader");
      function i(e) {
        n.call(this, e);
      }
      e("../utils").inherits(i, n), i.prototype.readData = function (e) {
        if (this.checkOffset(e), 0 === e) return new Uint8Array(0);
        var t = this.data.subarray(this.zero + this.index, this.zero + this.index + e);
        return this.index += e, t;
      }, t.exports = i;
    }, {
      "../utils": 32,
      "./ArrayReader": 17
    }],
    22: [function (e, t, r) {
      "use strict";

      var n = e("../utils"),
        i = e("../support"),
        s = e("./ArrayReader"),
        a = e("./StringReader"),
        o = e("./NodeBufferReader"),
        h = e("./Uint8ArrayReader");
      t.exports = function (e) {
        var t = n.getTypeOf(e);
        return n.checkSupport(t), "string" !== t || i.uint8array ? "nodebuffer" === t ? new o(e) : i.uint8array ? new h(n.transformTo("uint8array", e)) : new s(n.transformTo("array", e)) : new a(e);
      };
    }, {
      "../support": 30,
      "../utils": 32,
      "./ArrayReader": 17,
      "./NodeBufferReader": 19,
      "./StringReader": 20,
      "./Uint8ArrayReader": 21
    }],
    23: [function (e, t, r) {
      "use strict";

      r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\b";
    }, {}],
    24: [function (e, t, r) {
      "use strict";

      var n = e("./GenericWorker"),
        i = e("../utils");
      function s(e) {
        n.call(this, "ConvertWorker to " + e), this.destType = e;
      }
      i.inherits(s, n), s.prototype.processChunk = function (e) {
        this.push({
          data: i.transformTo(this.destType, e.data),
          meta: e.meta
        });
      }, t.exports = s;
    }, {
      "../utils": 32,
      "./GenericWorker": 28
    }],
    25: [function (e, t, r) {
      "use strict";

      var n = e("./GenericWorker"),
        i = e("../crc32");
      function s() {
        n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      e("../utils").inherits(s, n), s.prototype.processChunk = function (e) {
        this.streamInfo.crc32 = i(e.data, this.streamInfo.crc32 || 0), this.push(e);
      }, t.exports = s;
    }, {
      "../crc32": 4,
      "../utils": 32,
      "./GenericWorker": 28
    }],
    26: [function (e, t, r) {
      "use strict";

      var n = e("../utils"),
        i = e("./GenericWorker");
      function s(e) {
        i.call(this, "DataLengthProbe for " + e), this.propName = e, this.withStreamInfo(e, 0);
      }
      n.inherits(s, i), s.prototype.processChunk = function (e) {
        if (e) {
          var t = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = t + e.data.length;
        }
        i.prototype.processChunk.call(this, e);
      }, t.exports = s;
    }, {
      "../utils": 32,
      "./GenericWorker": 28
    }],
    27: [function (e, t, r) {
      "use strict";

      var n = e("../utils"),
        i = e("./GenericWorker");
      function s(e) {
        i.call(this, "DataWorker");
        var t = this;
        this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, e.then(function (e) {
          t.dataIsReady = !0, t.data = e, t.max = e && e.length || 0, t.type = n.getTypeOf(e), t.isPaused || t._tickAndRepeat();
        }, function (e) {
          t.error(e);
        });
      }
      n.inherits(s, i), s.prototype.cleanUp = function () {
        i.prototype.cleanUp.call(this), this.data = null;
      }, s.prototype.resume = function () {
        return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, n.delay(this._tickAndRepeat, [], this)), !0);
      }, s.prototype._tickAndRepeat = function () {
        this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
      }, s.prototype._tick = function () {
        if (this.isPaused || this.isFinished) return !1;
        var e = null,
          t = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max) return this.end();
        switch (this.type) {
          case "string":
            e = this.data.substring(this.index, t);
            break;
          case "uint8array":
            e = this.data.subarray(this.index, t);
            break;
          case "array":
          case "nodebuffer":
            e = this.data.slice(this.index, t);
        }
        return this.index = t, this.push({
          data: e,
          meta: {
            percent: this.max ? this.index / this.max * 100 : 0
          }
        });
      }, t.exports = s;
    }, {
      "../utils": 32,
      "./GenericWorker": 28
    }],
    28: [function (e, t, r) {
      "use strict";

      function n(e) {
        this.name = e || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = {
          data: [],
          end: [],
          error: []
        }, this.previous = null;
      }
      n.prototype = {
        push: function push(e) {
          this.emit("data", e);
        },
        end: function end() {
          if (this.isFinished) return !1;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = !0;
          } catch (e) {
            this.emit("error", e);
          }
          return !0;
        },
        error: function error(e) {
          return !this.isFinished && (this.isPaused ? this.generatedError = e : (this.isFinished = !0, this.emit("error", e), this.previous && this.previous.error(e), this.cleanUp()), !0);
        },
        on: function on(e, t) {
          return this._listeners[e].push(t), this;
        },
        cleanUp: function cleanUp() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        },
        emit: function emit(e, t) {
          if (this._listeners[e]) for (var r = 0; r < this._listeners[e].length; r++) {
            this._listeners[e][r].call(this, t);
          }
        },
        pipe: function pipe(e) {
          return e.registerPrevious(this);
        },
        registerPrevious: function registerPrevious(e) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = e.streamInfo, this.mergeStreamInfo(), this.previous = e;
          var t = this;
          return e.on("data", function (e) {
            t.processChunk(e);
          }), e.on("end", function () {
            t.end();
          }), e.on("error", function (e) {
            t.error(e);
          }), this;
        },
        pause: function pause() {
          return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
        },
        resume: function resume() {
          if (!this.isPaused || this.isFinished) return !1;
          var e = this.isPaused = !1;
          return this.generatedError && (this.error(this.generatedError), e = !0), this.previous && this.previous.resume(), !e;
        },
        flush: function flush() {},
        processChunk: function processChunk(e) {
          this.push(e);
        },
        withStreamInfo: function withStreamInfo(e, t) {
          return this.extraStreamInfo[e] = t, this.mergeStreamInfo(), this;
        },
        mergeStreamInfo: function mergeStreamInfo() {
          for (var e in this.extraStreamInfo) {
            Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e) && (this.streamInfo[e] = this.extraStreamInfo[e]);
          }
        },
        lock: function lock() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = !0, this.previous && this.previous.lock();
        },
        toString: function toString() {
          var e = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + e : e;
        }
      }, t.exports = n;
    }, {}],
    29: [function (e, t, r) {
      "use strict";

      var h = e("../utils"),
        i = e("./ConvertWorker"),
        s = e("./GenericWorker"),
        u = e("../base64"),
        n = e("../support"),
        a = e("../external"),
        o = null;
      if (n.nodestream) try {
        o = e("../nodejs/NodejsStreamOutputAdapter");
      } catch (e) {}
      function l(e, o) {
        return new a.Promise(function (t, r) {
          var n = [],
            i = e._internalType,
            s = e._outputType,
            a = e._mimeType;
          e.on("data", function (e, t) {
            n.push(e), o && o(t);
          }).on("error", function (e) {
            n = [], r(e);
          }).on("end", function () {
            try {
              var e = function (e, t, r) {
                switch (e) {
                  case "blob":
                    return h.newBlob(h.transformTo("arraybuffer", t), r);
                  case "base64":
                    return u.encode(t);
                  default:
                    return h.transformTo(e, t);
                }
              }(s, function (e, t) {
                var r,
                  n = 0,
                  i = null,
                  s = 0;
                for (r = 0; r < t.length; r++) {
                  s += t[r].length;
                }
                switch (e) {
                  case "string":
                    return t.join("");
                  case "array":
                    return Array.prototype.concat.apply([], t);
                  case "uint8array":
                    for (i = new Uint8Array(s), r = 0; r < t.length; r++) {
                      i.set(t[r], n), n += t[r].length;
                    }
                    return i;
                  case "nodebuffer":
                    return Buffer.concat(t);
                  default:
                    throw new Error("concat : unsupported type '" + e + "'");
                }
              }(i, n), a);
              t(e);
            } catch (e) {
              r(e);
            }
            n = [];
          }).resume();
        });
      }
      function f(e, t, r) {
        var n = t;
        switch (t) {
          case "blob":
          case "arraybuffer":
            n = "uint8array";
            break;
          case "base64":
            n = "string";
        }
        try {
          this._internalType = n, this._outputType = t, this._mimeType = r, h.checkSupport(n), this._worker = e.pipe(new i(n)), e.lock();
        } catch (e) {
          this._worker = new s("error"), this._worker.error(e);
        }
      }
      f.prototype = {
        accumulate: function accumulate(e) {
          return l(this, e);
        },
        on: function on(e, t) {
          var r = this;
          return "data" === e ? this._worker.on(e, function (e) {
            t.call(r, e.data, e.meta);
          }) : this._worker.on(e, function () {
            h.delay(t, arguments, r);
          }), this;
        },
        resume: function resume() {
          return h.delay(this._worker.resume, [], this._worker), this;
        },
        pause: function pause() {
          return this._worker.pause(), this;
        },
        toNodejsStream: function toNodejsStream(e) {
          if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
          return new o(this, {
            objectMode: "nodebuffer" !== this._outputType
          }, e);
        }
      }, t.exports = f;
    }, {
      "../base64": 1,
      "../external": 6,
      "../nodejs/NodejsStreamOutputAdapter": 13,
      "../support": 30,
      "../utils": 32,
      "./ConvertWorker": 24,
      "./GenericWorker": 28
    }],
    30: [function (e, t, r) {
      "use strict";

      if (r.base64 = !0, r.array = !0, r.string = !0, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = !1;else {
        var n = new ArrayBuffer(0);
        try {
          r.blob = 0 === new Blob([n], {
            type: "application/zip"
          }).size;
        } catch (e) {
          try {
            var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
          } catch (e) {
            r.blob = !1;
          }
        }
      }
      try {
        r.nodestream = !!e("readable-stream").Readable;
      } catch (e) {
        r.nodestream = !1;
      }
    }, {
      "readable-stream": 16
    }],
    31: [function (e, t, s) {
      "use strict";

      for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) {
        u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
      }
      u[254] = u[254] = 1;
      function a() {
        n.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function l() {
        n.call(this, "utf-8 encode");
      }
      s.utf8encode = function (e) {
        return h.nodebuffer ? r.newBufferFrom(e, "utf-8") : function (e) {
          var t,
            r,
            n,
            i,
            s,
            a = e.length,
            o = 0;
          for (i = 0; i < a; i++) {
            55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
          }
          for (t = h.uint8array ? new Uint8Array(o) : new Array(o), i = s = 0; s < o; i++) {
            55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
          }
          return t;
        }(e);
      }, s.utf8decode = function (e) {
        return h.nodebuffer ? o.transformTo("nodebuffer", e).toString("utf-8") : function (e) {
          var t,
            r,
            n,
            i,
            s = e.length,
            a = new Array(2 * s);
          for (t = r = 0; t < s;) {
            if ((n = e[t++]) < 128) a[r++] = n;else if (4 < (i = u[n])) a[r++] = 65533, t += i - 1;else {
              for (n &= 2 === i ? 31 : 3 === i ? 15 : 7; 1 < i && t < s;) {
                n = n << 6 | 63 & e[t++], i--;
              }
              1 < i ? a[r++] = 65533 : n < 65536 ? a[r++] = n : (n -= 65536, a[r++] = 55296 | n >> 10 & 1023, a[r++] = 56320 | 1023 & n);
            }
          }
          return a.length !== r && (a.subarray ? a = a.subarray(0, r) : a.length = r), o.applyFromCharCode(a);
        }(e = o.transformTo(h.uint8array ? "uint8array" : "array", e));
      }, o.inherits(a, n), a.prototype.processChunk = function (e) {
        var t = o.transformTo(h.uint8array ? "uint8array" : "array", e.data);
        if (this.leftOver && this.leftOver.length) {
          if (h.uint8array) {
            var r = t;
            (t = new Uint8Array(r.length + this.leftOver.length)).set(this.leftOver, 0), t.set(r, this.leftOver.length);
          } else t = this.leftOver.concat(t);
          this.leftOver = null;
        }
        var n = function (e, t) {
            var r;
            for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) {
              r--;
            }
            return r < 0 ? t : 0 === r ? t : r + u[e[r]] > t ? r : t;
          }(t),
          i = t;
        n !== t.length && (h.uint8array ? (i = t.subarray(0, n), this.leftOver = t.subarray(n, t.length)) : (i = t.slice(0, n), this.leftOver = t.slice(n, t.length))), this.push({
          data: s.utf8decode(i),
          meta: e.meta
        });
      }, a.prototype.flush = function () {
        this.leftOver && this.leftOver.length && (this.push({
          data: s.utf8decode(this.leftOver),
          meta: {}
        }), this.leftOver = null);
      }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function (e) {
        this.push({
          data: s.utf8encode(e.data),
          meta: e.meta
        });
      }, s.Utf8EncodeWorker = l;
    }, {
      "./nodejsUtils": 14,
      "./stream/GenericWorker": 28,
      "./support": 30,
      "./utils": 32
    }],
    32: [function (e, t, a) {
      "use strict";

      var o = e("./support"),
        h = e("./base64"),
        r = e("./nodejsUtils"),
        u = e("./external");
      function n(e) {
        return e;
      }
      function l(e, t) {
        for (var r = 0; r < e.length; ++r) {
          t[r] = 255 & e.charCodeAt(r);
        }
        return t;
      }
      e("setimmediate"), a.newBlob = function (t, r) {
        a.checkSupport("blob");
        try {
          return new Blob([t], {
            type: r
          });
        } catch (e) {
          try {
            var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return n.append(t), n.getBlob(r);
          } catch (e) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var i = {
        stringifyByChunk: function stringifyByChunk(e, t, r) {
          var n = [],
            i = 0,
            s = e.length;
          if (s <= r) return String.fromCharCode.apply(null, e);
          for (; i < s;) {
            "array" === t || "nodebuffer" === t ? n.push(String.fromCharCode.apply(null, e.slice(i, Math.min(i + r, s)))) : n.push(String.fromCharCode.apply(null, e.subarray(i, Math.min(i + r, s)))), i += r;
          }
          return n.join("");
        },
        stringifyByChar: function stringifyByChar(e) {
          for (var t = "", r = 0; r < e.length; r++) {
            t += String.fromCharCode(e[r]);
          }
          return t;
        },
        applyCanBeUsed: {
          uint8array: function () {
            try {
              return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
            } catch (e) {
              return !1;
            }
          }(),
          nodebuffer: function () {
            try {
              return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
            } catch (e) {
              return !1;
            }
          }()
        }
      };
      function s(e) {
        var t = 65536,
          r = a.getTypeOf(e),
          n = !0;
        if ("uint8array" === r ? n = i.applyCanBeUsed.uint8array : "nodebuffer" === r && (n = i.applyCanBeUsed.nodebuffer), n) for (; 1 < t;) {
          try {
            return i.stringifyByChunk(e, r, t);
          } catch (e) {
            t = Math.floor(t / 2);
          }
        }
        return i.stringifyByChar(e);
      }
      function f(e, t) {
        for (var r = 0; r < e.length; r++) {
          t[r] = e[r];
        }
        return t;
      }
      a.applyFromCharCode = s;
      var c = {};
      c.string = {
        string: n,
        array: function array(e) {
          return l(e, new Array(e.length));
        },
        arraybuffer: function arraybuffer(e) {
          return c.string.uint8array(e).buffer;
        },
        uint8array: function uint8array(e) {
          return l(e, new Uint8Array(e.length));
        },
        nodebuffer: function nodebuffer(e) {
          return l(e, r.allocBuffer(e.length));
        }
      }, c.array = {
        string: s,
        array: n,
        arraybuffer: function arraybuffer(e) {
          return new Uint8Array(e).buffer;
        },
        uint8array: function uint8array(e) {
          return new Uint8Array(e);
        },
        nodebuffer: function nodebuffer(e) {
          return r.newBufferFrom(e);
        }
      }, c.arraybuffer = {
        string: function string(e) {
          return s(new Uint8Array(e));
        },
        array: function array(e) {
          return f(new Uint8Array(e), new Array(e.byteLength));
        },
        arraybuffer: n,
        uint8array: function uint8array(e) {
          return new Uint8Array(e);
        },
        nodebuffer: function nodebuffer(e) {
          return r.newBufferFrom(new Uint8Array(e));
        }
      }, c.uint8array = {
        string: s,
        array: function array(e) {
          return f(e, new Array(e.length));
        },
        arraybuffer: function arraybuffer(e) {
          return e.buffer;
        },
        uint8array: n,
        nodebuffer: function nodebuffer(e) {
          return r.newBufferFrom(e);
        }
      }, c.nodebuffer = {
        string: s,
        array: function array(e) {
          return f(e, new Array(e.length));
        },
        arraybuffer: function arraybuffer(e) {
          return c.nodebuffer.uint8array(e).buffer;
        },
        uint8array: function uint8array(e) {
          return f(e, new Uint8Array(e.length));
        },
        nodebuffer: n
      }, a.transformTo = function (e, t) {
        if (t = t || "", !e) return t;
        a.checkSupport(e);
        var r = a.getTypeOf(t);
        return c[r][e](t);
      }, a.resolve = function (e) {
        for (var t = e.split("/"), r = [], n = 0; n < t.length; n++) {
          var i = t[n];
          "." === i || "" === i && 0 !== n && n !== t.length - 1 || (".." === i ? r.pop() : r.push(i));
        }
        return r.join("/");
      }, a.getTypeOf = function (e) {
        return "string" == typeof e ? "string" : "[object Array]" === Object.prototype.toString.call(e) ? "array" : o.nodebuffer && r.isBuffer(e) ? "nodebuffer" : o.uint8array && e instanceof Uint8Array ? "uint8array" : o.arraybuffer && e instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, a.checkSupport = function (e) {
        if (!o[e.toLowerCase()]) throw new Error(e + " is not supported by this platform");
      }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function (e) {
        var t,
          r,
          n = "";
        for (r = 0; r < (e || "").length; r++) {
          n += "\\x" + ((t = e.charCodeAt(r)) < 16 ? "0" : "") + t.toString(16).toUpperCase();
        }
        return n;
      }, a.delay = function (e, t, r) {
        setImmediate(function () {
          e.apply(r || null, t || []);
        });
      }, a.inherits = function (e, t) {
        function r() {}
        r.prototype = t.prototype, e.prototype = new r();
      }, a.extend = function () {
        var e,
          t,
          r = {};
        for (e = 0; e < arguments.length; e++) {
          for (t in arguments[e]) {
            Object.prototype.hasOwnProperty.call(arguments[e], t) && void 0 === r[t] && (r[t] = arguments[e][t]);
          }
        }
        return r;
      }, a.prepareContent = function (r, e, n, i, s) {
        return u.Promise.resolve(e).then(function (n) {
          return o.blob && (n instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n))) && "undefined" != typeof FileReader ? new u.Promise(function (t, r) {
            var e = new FileReader();
            e.onload = function (e) {
              t(e.target.result);
            }, e.onerror = function (e) {
              r(e.target.error);
            }, e.readAsArrayBuffer(n);
          }) : n;
        }).then(function (e) {
          var t = a.getTypeOf(e);
          return t ? ("arraybuffer" === t ? e = a.transformTo("uint8array", e) : "string" === t && (s ? e = h.decode(e) : n && !0 !== i && (e = function (e) {
            return l(e, o.uint8array ? new Uint8Array(e.length) : new Array(e.length));
          }(e))), e) : u.Promise.reject(new Error("Can't read the data of '" + r + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, {
      "./base64": 1,
      "./external": 6,
      "./nodejsUtils": 14,
      "./support": 30,
      setimmediate: 54
    }],
    33: [function (e, t, r) {
      "use strict";

      var n = e("./reader/readerFor"),
        i = e("./utils"),
        s = e("./signature"),
        a = e("./zipEntry"),
        o = e("./support");
      function h(e) {
        this.files = [], this.loadOptions = e;
      }
      h.prototype = {
        checkSignature: function checkSignature(e) {
          if (!this.reader.readAndCheckSignature(e)) {
            this.reader.index -= 4;
            var t = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t) + ", expected " + i.pretty(e) + ")");
          }
        },
        isSignature: function isSignature(e, t) {
          var r = this.reader.index;
          this.reader.setIndex(e);
          var n = this.reader.readString(4) === t;
          return this.reader.setIndex(r), n;
        },
        readBlockEndOfCentral: function readBlockEndOfCentral() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var e = this.reader.readData(this.zipCommentLength),
            t = o.uint8array ? "uint8array" : "array",
            r = i.transformTo(t, e);
          this.zipComment = this.loadOptions.decodeFileName(r);
        },
        readBlockZip64EndOfCentral: function readBlockZip64EndOfCentral() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var e, t, r, n = this.zip64EndOfCentralSize - 44; 0 < n;) {
            e = this.reader.readInt(2), t = this.reader.readInt(4), r = this.reader.readData(t), this.zip64ExtensibleData[e] = {
              id: e,
              length: t,
              value: r
            };
          }
        },
        readBlockZip64EndOfCentralLocator: function readBlockZip64EndOfCentralLocator() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        },
        readLocalFiles: function readLocalFiles() {
          var e, t;
          for (e = 0; e < this.files.length; e++) {
            t = this.files[e], this.reader.setIndex(t.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t.readLocalPart(this.reader), t.handleUTF8(), t.processAttributes();
          }
        },
        readCentralDir: function readCentralDir() {
          var e;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER);) {
            (e = new a({
              zip64: this.zip64
            }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e);
          }
          if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        },
        readEndOfCentral: function readEndOfCentral() {
          var e = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (e < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
          this.reader.setIndex(e);
          var t = e;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, (e = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(e), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var r = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (r += 20, r += 12 + this.zip64EndOfCentralSize);
          var n = t - r;
          if (0 < n) this.isSignature(t, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n);else if (n < 0) throw new Error("Corrupted zip: missing " + Math.abs(n) + " bytes.");
        },
        prepareReader: function prepareReader(e) {
          this.reader = n(e);
        },
        load: function load(e) {
          this.prepareReader(e), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        }
      }, t.exports = h;
    }, {
      "./reader/readerFor": 22,
      "./signature": 23,
      "./support": 30,
      "./utils": 32,
      "./zipEntry": 34
    }],
    34: [function (e, t, r) {
      "use strict";

      var n = e("./reader/readerFor"),
        s = e("./utils"),
        i = e("./compressedObject"),
        a = e("./crc32"),
        o = e("./utf8"),
        h = e("./compressions"),
        u = e("./support");
      function l(e, t) {
        this.options = e, this.loadOptions = t;
      }
      l.prototype = {
        isEncrypted: function isEncrypted() {
          return 1 == (1 & this.bitFlag);
        },
        useUTF8: function useUTF8() {
          return 2048 == (2048 & this.bitFlag);
        },
        readLocalPart: function readLocalPart(e) {
          var t, r;
          if (e.skip(22), this.fileNameLength = e.readInt(2), r = e.readInt(2), this.fileName = e.readData(this.fileNameLength), e.skip(r), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if (null === (t = function (e) {
            for (var t in h) {
              if (Object.prototype.hasOwnProperty.call(h, t) && h[t].magic === e) return h[t];
            }
            return null;
          }(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t, e.readData(this.compressedSize));
        },
        readCentralPart: function readCentralPart(e) {
          this.versionMadeBy = e.readInt(2), e.skip(2), this.bitFlag = e.readInt(2), this.compressionMethod = e.readString(2), this.date = e.readDate(), this.crc32 = e.readInt(4), this.compressedSize = e.readInt(4), this.uncompressedSize = e.readInt(4);
          var t = e.readInt(2);
          if (this.extraFieldsLength = e.readInt(2), this.fileCommentLength = e.readInt(2), this.diskNumberStart = e.readInt(2), this.internalFileAttributes = e.readInt(2), this.externalFileAttributes = e.readInt(4), this.localHeaderOffset = e.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          e.skip(t), this.readExtraFields(e), this.parseZIP64ExtraField(e), this.fileComment = e.readData(this.fileCommentLength);
        },
        processAttributes: function processAttributes() {
          this.unixPermissions = null, this.dosPermissions = null;
          var e = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), 0 == e && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
        },
        parseZIP64ExtraField: function parseZIP64ExtraField() {
          if (this.extraFields[1]) {
            var e = n(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4));
          }
        },
        readExtraFields: function readExtraFields(e) {
          var t,
            r,
            n,
            i = e.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); e.index + 4 < i;) {
            t = e.readInt(2), r = e.readInt(2), n = e.readData(r), this.extraFields[t] = {
              id: t,
              length: r,
              value: n
            };
          }
          e.setIndex(i);
        },
        handleUTF8: function handleUTF8() {
          var e = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);else {
            var t = this.findExtraFieldUnicodePath();
            if (null !== t) this.fileNameStr = t;else {
              var r = s.transformTo(e, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(r);
            }
            var n = this.findExtraFieldUnicodeComment();
            if (null !== n) this.fileCommentStr = n;else {
              var i = s.transformTo(e, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(i);
            }
          }
        },
        findExtraFieldUnicodePath: function findExtraFieldUnicodePath() {
          var e = this.extraFields[28789];
          if (e) {
            var t = n(e.value);
            return 1 !== t.readInt(1) ? null : a(this.fileName) !== t.readInt(4) ? null : o.utf8decode(t.readData(e.length - 5));
          }
          return null;
        },
        findExtraFieldUnicodeComment: function findExtraFieldUnicodeComment() {
          var e = this.extraFields[25461];
          if (e) {
            var t = n(e.value);
            return 1 !== t.readInt(1) ? null : a(this.fileComment) !== t.readInt(4) ? null : o.utf8decode(t.readData(e.length - 5));
          }
          return null;
        }
      }, t.exports = l;
    }, {
      "./compressedObject": 2,
      "./compressions": 3,
      "./crc32": 4,
      "./reader/readerFor": 22,
      "./support": 30,
      "./utf8": 31,
      "./utils": 32
    }],
    35: [function (e, t, r) {
      "use strict";

      function n(e, t, r) {
        this.name = e, this.dir = r.dir, this.date = r.date, this.comment = r.comment, this.unixPermissions = r.unixPermissions, this.dosPermissions = r.dosPermissions, this._data = t, this._dataBinary = r.binary, this.options = {
          compression: r.compression,
          compressionOptions: r.compressionOptions
        };
      }
      var s = e("./stream/StreamHelper"),
        i = e("./stream/DataWorker"),
        a = e("./utf8"),
        o = e("./compressedObject"),
        h = e("./stream/GenericWorker");
      n.prototype = {
        internalStream: function internalStream(e) {
          var t = null,
            r = "string";
          try {
            if (!e) throw new Error("No output type specified.");
            var n = "string" === (r = e.toLowerCase()) || "text" === r;
            "binarystring" !== r && "text" !== r || (r = "string"), t = this._decompressWorker();
            var i = !this._dataBinary;
            i && !n && (t = t.pipe(new a.Utf8EncodeWorker())), !i && n && (t = t.pipe(new a.Utf8DecodeWorker()));
          } catch (e) {
            (t = new h("error")).error(e);
          }
          return new s(t, r, "");
        },
        async: function async(e, t) {
          return this.internalStream(e).accumulate(t);
        },
        nodeStream: function nodeStream(e, t) {
          return this.internalStream(e || "nodebuffer").toNodejsStream(t);
        },
        _compressWorker: function _compressWorker(e, t) {
          if (this._data instanceof o && this._data.compression.magic === e.magic) return this._data.getCompressedWorker();
          var r = this._decompressWorker();
          return this._dataBinary || (r = r.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r, e, t);
        },
        _decompressWorker: function _decompressWorker() {
          return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
        }
      };
      for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function l() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, f = 0; f < u.length; f++) {
        n.prototype[u[f]] = l;
      }
      t.exports = n;
    }, {
      "./compressedObject": 2,
      "./stream/DataWorker": 27,
      "./stream/GenericWorker": 28,
      "./stream/StreamHelper": 29,
      "./utf8": 31
    }],
    36: [function (e, l, t) {
      (function (t) {
        "use strict";

        var r,
          n,
          e = t.MutationObserver || t.WebKitMutationObserver;
        if (e) {
          var i = 0,
            s = new e(u),
            a = t.document.createTextNode("");
          s.observe(a, {
            characterData: !0
          }), r = function r() {
            a.data = i = ++i % 2;
          };
        } else if (t.setImmediate || void 0 === t.MessageChannel) r = "document" in t && "onreadystatechange" in t.document.createElement("script") ? function () {
          var e = t.document.createElement("script");
          e.onreadystatechange = function () {
            u(), e.onreadystatechange = null, e.parentNode.removeChild(e), e = null;
          }, t.document.documentElement.appendChild(e);
        } : function () {
          setTimeout(u, 0);
        };else {
          var o = new t.MessageChannel();
          o.port1.onmessage = u, r = function r() {
            o.port2.postMessage(0);
          };
        }
        var h = [];
        function u() {
          var e, t;
          n = !0;
          for (var r = h.length; r;) {
            for (t = h, h = [], e = -1; ++e < r;) {
              t[e]();
            }
            r = h.length;
          }
          n = !1;
        }
        l.exports = function (e) {
          1 !== h.push(e) || n || r();
        };
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}],
    37: [function (e, t, r) {
      "use strict";

      var i = e("immediate");
      function u() {}
      var l = {},
        s = ["REJECTED"],
        a = ["FULFILLED"],
        n = ["PENDING"];
      function o(e) {
        if ("function" != typeof e) throw new TypeError("resolver must be a function");
        this.state = n, this.queue = [], this.outcome = void 0, e !== u && d(this, e);
      }
      function h(e, t, r) {
        this.promise = e, "function" == typeof t && (this.onFulfilled = t, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r && (this.onRejected = r, this.callRejected = this.otherCallRejected);
      }
      function f(t, r, n) {
        i(function () {
          var e;
          try {
            e = r(n);
          } catch (e) {
            return l.reject(t, e);
          }
          e === t ? l.reject(t, new TypeError("Cannot resolve promise with itself")) : l.resolve(t, e);
        });
      }
      function c(e) {
        var t = e && e.then;
        if (e && ("object" == _typeof(e) || "function" == typeof e) && "function" == typeof t) return function () {
          t.apply(e, arguments);
        };
      }
      function d(t, e) {
        var r = !1;
        function n(e) {
          r || (r = !0, l.reject(t, e));
        }
        function i(e) {
          r || (r = !0, l.resolve(t, e));
        }
        var s = p(function () {
          e(i, n);
        });
        "error" === s.status && n(s.value);
      }
      function p(e, t) {
        var r = {};
        try {
          r.value = e(t), r.status = "success";
        } catch (e) {
          r.status = "error", r.value = e;
        }
        return r;
      }
      (t.exports = o).prototype.finally = function (t) {
        if ("function" != typeof t) return this;
        var r = this.constructor;
        return this.then(function (e) {
          return r.resolve(t()).then(function () {
            return e;
          });
        }, function (e) {
          return r.resolve(t()).then(function () {
            throw e;
          });
        });
      }, o.prototype.catch = function (e) {
        return this.then(null, e);
      }, o.prototype.then = function (e, t) {
        if ("function" != typeof e && this.state === a || "function" != typeof t && this.state === s) return this;
        var r = new this.constructor(u);
        this.state !== n ? f(r, this.state === a ? e : t, this.outcome) : this.queue.push(new h(r, e, t));
        return r;
      }, h.prototype.callFulfilled = function (e) {
        l.resolve(this.promise, e);
      }, h.prototype.otherCallFulfilled = function (e) {
        f(this.promise, this.onFulfilled, e);
      }, h.prototype.callRejected = function (e) {
        l.reject(this.promise, e);
      }, h.prototype.otherCallRejected = function (e) {
        f(this.promise, this.onRejected, e);
      }, l.resolve = function (e, t) {
        var r = p(c, t);
        if ("error" === r.status) return l.reject(e, r.value);
        var n = r.value;
        if (n) d(e, n);else {
          e.state = a, e.outcome = t;
          for (var i = -1, s = e.queue.length; ++i < s;) {
            e.queue[i].callFulfilled(t);
          }
        }
        return e;
      }, l.reject = function (e, t) {
        e.state = s, e.outcome = t;
        for (var r = -1, n = e.queue.length; ++r < n;) {
          e.queue[r].callRejected(t);
        }
        return e;
      }, o.resolve = function (e) {
        if (e instanceof this) return e;
        return l.resolve(new this(u), e);
      }, o.reject = function (e) {
        var t = new this(u);
        return l.reject(t, e);
      }, o.all = function (e) {
        var r = this;
        if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
        var n = e.length,
          i = !1;
        if (!n) return this.resolve([]);
        var s = new Array(n),
          a = 0,
          t = -1,
          o = new this(u);
        for (; ++t < n;) {
          h(e[t], t);
        }
        return o;
        function h(e, t) {
          r.resolve(e).then(function (e) {
            s[t] = e, ++a !== n || i || (i = !0, l.resolve(o, s));
          }, function (e) {
            i || (i = !0, l.reject(o, e));
          });
        }
      }, o.race = function (e) {
        var t = this;
        if ("[object Array]" !== Object.prototype.toString.call(e)) return this.reject(new TypeError("must be an array"));
        var r = e.length,
          n = !1;
        if (!r) return this.resolve([]);
        var i = -1,
          s = new this(u);
        for (; ++i < r;) {
          a = e[i], t.resolve(a).then(function (e) {
            n || (n = !0, l.resolve(s, e));
          }, function (e) {
            n || (n = !0, l.reject(s, e));
          });
        }
        var a;
        return s;
      };
    }, {
      immediate: 36
    }],
    38: [function (e, t, r) {
      "use strict";

      var n = {};
      (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
    }, {
      "./lib/deflate": 39,
      "./lib/inflate": 40,
      "./lib/utils/common": 41,
      "./lib/zlib/constants": 44
    }],
    39: [function (e, t, r) {
      "use strict";

      var a = e("./zlib/deflate"),
        o = e("./utils/common"),
        h = e("./utils/strings"),
        i = e("./zlib/messages"),
        s = e("./zlib/zstream"),
        u = Object.prototype.toString,
        l = 0,
        f = -1,
        c = 0,
        d = 8;
      function p(e) {
        if (!(this instanceof p)) return new p(e);
        this.options = o.assign({
          level: f,
          method: d,
          chunkSize: 16384,
          windowBits: 15,
          memLevel: 8,
          strategy: c,
          to: ""
        }, e || {});
        var t = this.options;
        t.raw && 0 < t.windowBits ? t.windowBits = -t.windowBits : t.gzip && 0 < t.windowBits && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
        var r = a.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
        if (r !== l) throw new Error(i[r]);
        if (t.header && a.deflateSetHeader(this.strm, t.header), t.dictionary) {
          var n;
          if (n = "string" == typeof t.dictionary ? h.string2buf(t.dictionary) : "[object ArrayBuffer]" === u.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, (r = a.deflateSetDictionary(this.strm, n)) !== l) throw new Error(i[r]);
          this._dict_set = !0;
        }
      }
      function n(e, t) {
        var r = new p(t);
        if (r.push(e, !0), r.err) throw r.msg || i[r.err];
        return r.result;
      }
      p.prototype.push = function (e, t) {
        var r,
          n,
          i = this.strm,
          s = this.options.chunkSize;
        if (this.ended) return !1;
        n = t === ~~t ? t : !0 === t ? 4 : 0, "string" == typeof e ? i.input = h.string2buf(e) : "[object ArrayBuffer]" === u.call(e) ? i.input = new Uint8Array(e) : i.input = e, i.next_in = 0, i.avail_in = i.input.length;
        do {
          if (0 === i.avail_out && (i.output = new o.Buf8(s), i.next_out = 0, i.avail_out = s), 1 !== (r = a.deflate(i, n)) && r !== l) return this.onEnd(r), !(this.ended = !0);
          0 !== i.avail_out && (0 !== i.avail_in || 4 !== n && 2 !== n) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i.output, i.next_out))) : this.onData(o.shrinkBuf(i.output, i.next_out)));
        } while ((0 < i.avail_in || 0 === i.avail_out) && 1 !== r);
        return 4 === n ? (r = a.deflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === l) : 2 !== n || (this.onEnd(l), !(i.avail_out = 0));
      }, p.prototype.onData = function (e) {
        this.chunks.push(e);
      }, p.prototype.onEnd = function (e) {
        e === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
      }, r.Deflate = p, r.deflate = n, r.deflateRaw = function (e, t) {
        return (t = t || {}).raw = !0, n(e, t);
      }, r.gzip = function (e, t) {
        return (t = t || {}).gzip = !0, n(e, t);
      };
    }, {
      "./utils/common": 41,
      "./utils/strings": 42,
      "./zlib/deflate": 46,
      "./zlib/messages": 51,
      "./zlib/zstream": 53
    }],
    40: [function (e, t, r) {
      "use strict";

      var c = e("./zlib/inflate"),
        d = e("./utils/common"),
        p = e("./utils/strings"),
        m = e("./zlib/constants"),
        n = e("./zlib/messages"),
        i = e("./zlib/zstream"),
        s = e("./zlib/gzheader"),
        _ = Object.prototype.toString;
      function a(e) {
        if (!(this instanceof a)) return new a(e);
        this.options = d.assign({
          chunkSize: 16384,
          windowBits: 0,
          to: ""
        }, e || {});
        var t = this.options;
        t.raw && 0 <= t.windowBits && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(0 <= t.windowBits && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), 15 < t.windowBits && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
        var r = c.inflateInit2(this.strm, t.windowBits);
        if (r !== m.Z_OK) throw new Error(n[r]);
        this.header = new s(), c.inflateGetHeader(this.strm, this.header);
      }
      function o(e, t) {
        var r = new a(t);
        if (r.push(e, !0), r.err) throw r.msg || n[r.err];
        return r.result;
      }
      a.prototype.push = function (e, t) {
        var r,
          n,
          i,
          s,
          a,
          o,
          h = this.strm,
          u = this.options.chunkSize,
          l = this.options.dictionary,
          f = !1;
        if (this.ended) return !1;
        n = t === ~~t ? t : !0 === t ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e ? h.input = p.binstring2buf(e) : "[object ArrayBuffer]" === _.call(e) ? h.input = new Uint8Array(e) : h.input = e, h.next_in = 0, h.avail_in = h.input.length;
        do {
          if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r = c.inflateSetDictionary(this.strm, o)), r === m.Z_BUF_ERROR && !0 === f && (r = m.Z_OK, f = !1), r !== m.Z_STREAM_END && r !== m.Z_OK) return this.onEnd(r), !(this.ended = !0);
          h.next_out && (0 !== h.avail_out && r !== m.Z_STREAM_END && (0 !== h.avail_in || n !== m.Z_FINISH && n !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i = p.utf8border(h.output, h.next_out), s = h.next_out - i, a = p.buf2string(h.output, i), h.next_out = s, h.avail_out = u - s, s && d.arraySet(h.output, h.output, i, s, 0), this.onData(a)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = !0);
        } while ((0 < h.avail_in || 0 === h.avail_out) && r !== m.Z_STREAM_END);
        return r === m.Z_STREAM_END && (n = m.Z_FINISH), n === m.Z_FINISH ? (r = c.inflateEnd(this.strm), this.onEnd(r), this.ended = !0, r === m.Z_OK) : n !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
      }, a.prototype.onData = function (e) {
        this.chunks.push(e);
      }, a.prototype.onEnd = function (e) {
        e === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
      }, r.Inflate = a, r.inflate = o, r.inflateRaw = function (e, t) {
        return (t = t || {}).raw = !0, o(e, t);
      }, r.ungzip = o;
    }, {
      "./utils/common": 41,
      "./utils/strings": 42,
      "./zlib/constants": 44,
      "./zlib/gzheader": 47,
      "./zlib/inflate": 49,
      "./zlib/messages": 51,
      "./zlib/zstream": 53
    }],
    41: [function (e, t, r) {
      "use strict";

      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
      r.assign = function (e) {
        for (var t = Array.prototype.slice.call(arguments, 1); t.length;) {
          var r = t.shift();
          if (r) {
            if ("object" != _typeof(r)) throw new TypeError(r + "must be non-object");
            for (var n in r) {
              r.hasOwnProperty(n) && (e[n] = r[n]);
            }
          }
        }
        return e;
      }, r.shrinkBuf = function (e, t) {
        return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e);
      };
      var i = {
          arraySet: function arraySet(e, t, r, n, i) {
            if (t.subarray && e.subarray) e.set(t.subarray(r, r + n), i);else for (var s = 0; s < n; s++) {
              e[i + s] = t[r + s];
            }
          },
          flattenChunks: function flattenChunks(e) {
            var t, r, n, i, s, a;
            for (t = n = 0, r = e.length; t < r; t++) {
              n += e[t].length;
            }
            for (a = new Uint8Array(n), t = i = 0, r = e.length; t < r; t++) {
              s = e[t], a.set(s, i), i += s.length;
            }
            return a;
          }
        },
        s = {
          arraySet: function arraySet(e, t, r, n, i) {
            for (var s = 0; s < n; s++) {
              e[i + s] = t[r + s];
            }
          },
          flattenChunks: function flattenChunks(e) {
            return [].concat.apply([], e);
          }
        };
      r.setTyped = function (e) {
        e ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
      }, r.setTyped(n);
    }, {}],
    42: [function (e, t, r) {
      "use strict";

      var h = e("./common"),
        i = !0,
        s = !0;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch (e) {
        i = !1;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (e) {
        s = !1;
      }
      for (var u = new h.Buf8(256), n = 0; n < 256; n++) {
        u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
      }
      function l(e, t) {
        if (t < 65537 && (e.subarray && s || !e.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e, t));
        for (var r = "", n = 0; n < t; n++) {
          r += String.fromCharCode(e[n]);
        }
        return r;
      }
      u[254] = u[254] = 1, r.string2buf = function (e) {
        var t,
          r,
          n,
          i,
          s,
          a = e.length,
          o = 0;
        for (i = 0; i < a; i++) {
          55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), o += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
        }
        for (t = new h.Buf8(o), i = s = 0; s < o; i++) {
          55296 == (64512 & (r = e.charCodeAt(i))) && i + 1 < a && 56320 == (64512 & (n = e.charCodeAt(i + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320), i++), r < 128 ? t[s++] = r : (r < 2048 ? t[s++] = 192 | r >>> 6 : (r < 65536 ? t[s++] = 224 | r >>> 12 : (t[s++] = 240 | r >>> 18, t[s++] = 128 | r >>> 12 & 63), t[s++] = 128 | r >>> 6 & 63), t[s++] = 128 | 63 & r);
        }
        return t;
      }, r.buf2binstring = function (e) {
        return l(e, e.length);
      }, r.binstring2buf = function (e) {
        for (var t = new h.Buf8(e.length), r = 0, n = t.length; r < n; r++) {
          t[r] = e.charCodeAt(r);
        }
        return t;
      }, r.buf2string = function (e, t) {
        var r,
          n,
          i,
          s,
          a = t || e.length,
          o = new Array(2 * a);
        for (r = n = 0; r < a;) {
          if ((i = e[r++]) < 128) o[n++] = i;else if (4 < (s = u[i])) o[n++] = 65533, r += s - 1;else {
            for (i &= 2 === s ? 31 : 3 === s ? 15 : 7; 1 < s && r < a;) {
              i = i << 6 | 63 & e[r++], s--;
            }
            1 < s ? o[n++] = 65533 : i < 65536 ? o[n++] = i : (i -= 65536, o[n++] = 55296 | i >> 10 & 1023, o[n++] = 56320 | 1023 & i);
          }
        }
        return l(o, n);
      }, r.utf8border = function (e, t) {
        var r;
        for ((t = t || e.length) > e.length && (t = e.length), r = t - 1; 0 <= r && 128 == (192 & e[r]);) {
          r--;
        }
        return r < 0 ? t : 0 === r ? t : r + u[e[r]] > t ? r : t;
      };
    }, {
      "./common": 41
    }],
    43: [function (e, t, r) {
      "use strict";

      t.exports = function (e, t, r, n) {
        for (var i = 65535 & e | 0, s = e >>> 16 & 65535 | 0, a = 0; 0 !== r;) {
          for (r -= a = 2e3 < r ? 2e3 : r; s = s + (i = i + t[n++] | 0) | 0, --a;) {
            ;
          }
          i %= 65521, s %= 65521;
        }
        return i | s << 16 | 0;
      };
    }, {}],
    44: [function (e, t, r) {
      "use strict";

      t.exports = {
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        Z_BUF_ERROR: -5,
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,
        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,
        Z_BINARY: 0,
        Z_TEXT: 1,
        Z_UNKNOWN: 2,
        Z_DEFLATED: 8
      };
    }, {}],
    45: [function (e, t, r) {
      "use strict";

      var o = function () {
        for (var e, t = [], r = 0; r < 256; r++) {
          e = r;
          for (var n = 0; n < 8; n++) {
            e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;
          }
          t[r] = e;
        }
        return t;
      }();
      t.exports = function (e, t, r, n) {
        var i = o,
          s = n + r;
        e ^= -1;
        for (var a = n; a < s; a++) {
          e = e >>> 8 ^ i[255 & (e ^ t[a])];
        }
        return -1 ^ e;
      };
    }, {}],
    46: [function (e, t, r) {
      "use strict";

      var h,
        c = e("../utils/common"),
        u = e("./trees"),
        d = e("./adler32"),
        p = e("./crc32"),
        n = e("./messages"),
        l = 0,
        f = 4,
        m = 0,
        _ = -2,
        g = -1,
        b = 4,
        i = 2,
        v = 8,
        y = 9,
        s = 286,
        a = 30,
        o = 19,
        w = 2 * s + 1,
        k = 15,
        x = 3,
        S = 258,
        z = S + x + 1,
        C = 42,
        E = 113,
        A = 1,
        I = 2,
        O = 3,
        B = 4;
      function R(e, t) {
        return e.msg = n[t], t;
      }
      function T(e) {
        return (e << 1) - (4 < e ? 9 : 0);
      }
      function D(e) {
        for (var t = e.length; 0 <= --t;) {
          e[t] = 0;
        }
      }
      function F(e) {
        var t = e.state,
          r = t.pending;
        r > e.avail_out && (r = e.avail_out), 0 !== r && (c.arraySet(e.output, t.pending_buf, t.pending_out, r, e.next_out), e.next_out += r, t.pending_out += r, e.total_out += r, e.avail_out -= r, t.pending -= r, 0 === t.pending && (t.pending_out = 0));
      }
      function N(e, t) {
        u._tr_flush_block(e, 0 <= e.block_start ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, F(e.strm);
      }
      function U(e, t) {
        e.pending_buf[e.pending++] = t;
      }
      function P(e, t) {
        e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t;
      }
      function L(e, t) {
        var r,
          n,
          i = e.max_chain_length,
          s = e.strstart,
          a = e.prev_length,
          o = e.nice_match,
          h = e.strstart > e.w_size - z ? e.strstart - (e.w_size - z) : 0,
          u = e.window,
          l = e.w_mask,
          f = e.prev,
          c = e.strstart + S,
          d = u[s + a - 1],
          p = u[s + a];
        e.prev_length >= e.good_match && (i >>= 2), o > e.lookahead && (o = e.lookahead);
        do {
          if (u[(r = t) + a] === p && u[r + a - 1] === d && u[r] === u[s] && u[++r] === u[s + 1]) {
            s += 2, r++;
            do {} while (u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && u[++s] === u[++r] && s < c);
            if (n = S - (c - s), s = c - S, a < n) {
              if (e.match_start = t, o <= (a = n)) break;
              d = u[s + a - 1], p = u[s + a];
            }
          }
        } while ((t = f[t & l]) > h && 0 != --i);
        return a <= e.lookahead ? a : e.lookahead;
      }
      function j(e) {
        var t,
          r,
          n,
          i,
          s,
          a,
          o,
          h,
          u,
          l,
          f = e.w_size;
        do {
          if (i = e.window_size - e.lookahead - e.strstart, e.strstart >= f + (f - z)) {
            for (c.arraySet(e.window, e.window, f, f, 0), e.match_start -= f, e.strstart -= f, e.block_start -= f, t = r = e.hash_size; n = e.head[--t], e.head[t] = f <= n ? n - f : 0, --r;) {
              ;
            }
            for (t = r = f; n = e.prev[--t], e.prev[t] = f <= n ? n - f : 0, --r;) {
              ;
            }
            i += f;
          }
          if (0 === e.strm.avail_in) break;
          if (a = e.strm, o = e.window, h = e.strstart + e.lookahead, u = i, l = void 0, l = a.avail_in, u < l && (l = u), r = 0 === l ? 0 : (a.avail_in -= l, c.arraySet(o, a.input, a.next_in, l, h), 1 === a.state.wrap ? a.adler = d(a.adler, o, l, h) : 2 === a.state.wrap && (a.adler = p(a.adler, o, l, h)), a.next_in += l, a.total_in += l, l), e.lookahead += r, e.lookahead + e.insert >= x) for (s = e.strstart - e.insert, e.ins_h = e.window[s], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[s + x - 1]) & e.hash_mask, e.prev[s & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = s, s++, e.insert--, !(e.lookahead + e.insert < x));) {
            ;
          }
        } while (e.lookahead < z && 0 !== e.strm.avail_in);
      }
      function Z(e, t) {
        for (var r, n;;) {
          if (e.lookahead < z) {
            if (j(e), e.lookahead < z && t === l) return A;
            if (0 === e.lookahead) break;
          }
          if (r = 0, e.lookahead >= x && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== r && e.strstart - r <= e.w_size - z && (e.match_length = L(e, r)), e.match_length >= x) {
            if (n = u._tr_tally(e, e.strstart - e.match_start, e.match_length - x), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= x) {
              for (e.match_length--; e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart, 0 != --e.match_length;) {
                ;
              }
              e.strstart++;
            } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
          } else n = u._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
          if (n && (N(e, !1), 0 === e.strm.avail_out)) return A;
        }
        return e.insert = e.strstart < x - 1 ? e.strstart : x - 1, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
      }
      function W(e, t) {
        for (var r, n, i;;) {
          if (e.lookahead < z) {
            if (j(e), e.lookahead < z && t === l) return A;
            if (0 === e.lookahead) break;
          }
          if (r = 0, e.lookahead >= x && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = x - 1, 0 !== r && e.prev_length < e.max_lazy_match && e.strstart - r <= e.w_size - z && (e.match_length = L(e, r), e.match_length <= 5 && (1 === e.strategy || e.match_length === x && 4096 < e.strstart - e.match_start) && (e.match_length = x - 1)), e.prev_length >= x && e.match_length <= e.prev_length) {
            for (i = e.strstart + e.lookahead - x, n = u._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - x), e.lookahead -= e.prev_length - 1, e.prev_length -= 2; ++e.strstart <= i && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + x - 1]) & e.hash_mask, r = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 != --e.prev_length;) {
              ;
            }
            if (e.match_available = 0, e.match_length = x - 1, e.strstart++, n && (N(e, !1), 0 === e.strm.avail_out)) return A;
          } else if (e.match_available) {
            if ((n = u._tr_tally(e, 0, e.window[e.strstart - 1])) && N(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return A;
          } else e.match_available = 1, e.strstart++, e.lookahead--;
        }
        return e.match_available && (n = u._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < x - 1 ? e.strstart : x - 1, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
      }
      function M(e, t, r, n, i) {
        this.good_length = e, this.max_lazy = t, this.nice_length = r, this.max_chain = n, this.func = i;
      }
      function H() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function G(e) {
        var t;
        return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = i, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? C : E, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = l, u._tr_init(t), m) : R(e, _);
      }
      function K(e) {
        var t = G(e);
        return t === m && function (e) {
          e.window_size = 2 * e.w_size, D(e.head), e.max_lazy_match = h[e.level].max_lazy, e.good_match = h[e.level].good_length, e.nice_match = h[e.level].nice_length, e.max_chain_length = h[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = x - 1, e.match_available = 0, e.ins_h = 0;
        }(e.state), t;
      }
      function Y(e, t, r, n, i, s) {
        if (!e) return _;
        var a = 1;
        if (t === g && (t = 6), n < 0 ? (a = 0, n = -n) : 15 < n && (a = 2, n -= 16), i < 1 || y < i || r !== v || n < 8 || 15 < n || t < 0 || 9 < t || s < 0 || b < s) return R(e, _);
        8 === n && (n = 9);
        var o = new H();
        return (e.state = o).strm = e, o.wrap = a, o.gzhead = null, o.w_bits = n, o.w_size = 1 << o.w_bits, o.w_mask = o.w_size - 1, o.hash_bits = i + 7, o.hash_size = 1 << o.hash_bits, o.hash_mask = o.hash_size - 1, o.hash_shift = ~~((o.hash_bits + x - 1) / x), o.window = new c.Buf8(2 * o.w_size), o.head = new c.Buf16(o.hash_size), o.prev = new c.Buf16(o.w_size), o.lit_bufsize = 1 << i + 6, o.pending_buf_size = 4 * o.lit_bufsize, o.pending_buf = new c.Buf8(o.pending_buf_size), o.d_buf = 1 * o.lit_bufsize, o.l_buf = 3 * o.lit_bufsize, o.level = t, o.strategy = s, o.method = r, K(e);
      }
      h = [new M(0, 0, 0, 0, function (e, t) {
        var r = 65535;
        for (r > e.pending_buf_size - 5 && (r = e.pending_buf_size - 5);;) {
          if (e.lookahead <= 1) {
            if (j(e), 0 === e.lookahead && t === l) return A;
            if (0 === e.lookahead) break;
          }
          e.strstart += e.lookahead, e.lookahead = 0;
          var n = e.block_start + r;
          if ((0 === e.strstart || e.strstart >= n) && (e.lookahead = e.strstart - n, e.strstart = n, N(e, !1), 0 === e.strm.avail_out)) return A;
          if (e.strstart - e.block_start >= e.w_size - z && (N(e, !1), 0 === e.strm.avail_out)) return A;
        }
        return e.insert = 0, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : (e.strstart > e.block_start && (N(e, !1), e.strm.avail_out), A);
      }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function (e, t) {
        return Y(e, t, v, 15, 8, 0);
      }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G, r.deflateSetHeader = function (e, t) {
        return e && e.state ? 2 !== e.state.wrap ? _ : (e.state.gzhead = t, m) : _;
      }, r.deflate = function (e, t) {
        var r, n, i, s;
        if (!e || !e.state || 5 < t || t < 0) return e ? R(e, _) : _;
        if (n = e.state, !e.output || !e.input && 0 !== e.avail_in || 666 === n.status && t !== f) return R(e, 0 === e.avail_out ? -5 : _);
        if (n.strm = e, r = n.last_flush, n.last_flush = t, n.status === C) if (2 === n.wrap) e.adler = 0, U(n, 31), U(n, 139), U(n, 8), n.gzhead ? (U(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)), U(n, 255 & n.gzhead.time), U(n, n.gzhead.time >> 8 & 255), U(n, n.gzhead.time >> 16 & 255), U(n, n.gzhead.time >> 24 & 255), U(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), U(n, 255 & n.gzhead.os), n.gzhead.extra && n.gzhead.extra.length && (U(n, 255 & n.gzhead.extra.length), U(n, n.gzhead.extra.length >> 8 & 255)), n.gzhead.hcrc && (e.adler = p(e.adler, n.pending_buf, n.pending, 0)), n.gzindex = 0, n.status = 69) : (U(n, 0), U(n, 0), U(n, 0), U(n, 0), U(n, 0), U(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0), U(n, 3), n.status = E);else {
          var a = v + (n.w_bits - 8 << 4) << 8;
          a |= (2 <= n.strategy || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6, 0 !== n.strstart && (a |= 32), a += 31 - a % 31, n.status = E, P(n, a), 0 !== n.strstart && (P(n, e.adler >>> 16), P(n, 65535 & e.adler)), e.adler = 1;
        }
        if (69 === n.status) if (n.gzhead.extra) {
          for (i = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), F(e), i = n.pending, n.pending !== n.pending_buf_size));) {
            U(n, 255 & n.gzhead.extra[n.gzindex]), n.gzindex++;
          }
          n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), n.gzindex === n.gzhead.extra.length && (n.gzindex = 0, n.status = 73);
        } else n.status = 73;
        if (73 === n.status) if (n.gzhead.name) {
          i = n.pending;
          do {
            if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), F(e), i = n.pending, n.pending === n.pending_buf_size)) {
              s = 1;
              break;
            }
            s = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0, U(n, s);
          } while (0 !== s);
          n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), 0 === s && (n.gzindex = 0, n.status = 91);
        } else n.status = 91;
        if (91 === n.status) if (n.gzhead.comment) {
          i = n.pending;
          do {
            if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), F(e), i = n.pending, n.pending === n.pending_buf_size)) {
              s = 1;
              break;
            }
            s = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0, U(n, s);
          } while (0 !== s);
          n.gzhead.hcrc && n.pending > i && (e.adler = p(e.adler, n.pending_buf, n.pending - i, i)), 0 === s && (n.status = 103);
        } else n.status = 103;
        if (103 === n.status && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && F(e), n.pending + 2 <= n.pending_buf_size && (U(n, 255 & e.adler), U(n, e.adler >> 8 & 255), e.adler = 0, n.status = E)) : n.status = E), 0 !== n.pending) {
          if (F(e), 0 === e.avail_out) return n.last_flush = -1, m;
        } else if (0 === e.avail_in && T(t) <= T(r) && t !== f) return R(e, -5);
        if (666 === n.status && 0 !== e.avail_in) return R(e, -5);
        if (0 !== e.avail_in || 0 !== n.lookahead || t !== l && 666 !== n.status) {
          var o = 2 === n.strategy ? function (e, t) {
            for (var r;;) {
              if (0 === e.lookahead && (j(e), 0 === e.lookahead)) {
                if (t === l) return A;
                break;
              }
              if (e.match_length = 0, r = u._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, r && (N(e, !1), 0 === e.strm.avail_out)) return A;
            }
            return e.insert = 0, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
          }(n, t) : 3 === n.strategy ? function (e, t) {
            for (var r, n, i, s, a = e.window;;) {
              if (e.lookahead <= S) {
                if (j(e), e.lookahead <= S && t === l) return A;
                if (0 === e.lookahead) break;
              }
              if (e.match_length = 0, e.lookahead >= x && 0 < e.strstart && (n = a[i = e.strstart - 1]) === a[++i] && n === a[++i] && n === a[++i]) {
                s = e.strstart + S;
                do {} while (n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && n === a[++i] && i < s);
                e.match_length = S - (s - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
              }
              if (e.match_length >= x ? (r = u._tr_tally(e, 1, e.match_length - x), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (r = u._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), r && (N(e, !1), 0 === e.strm.avail_out)) return A;
            }
            return e.insert = 0, t === f ? (N(e, !0), 0 === e.strm.avail_out ? O : B) : e.last_lit && (N(e, !1), 0 === e.strm.avail_out) ? A : I;
          }(n, t) : h[n.level].func(n, t);
          if (o !== O && o !== B || (n.status = 666), o === A || o === O) return 0 === e.avail_out && (n.last_flush = -1), m;
          if (o === I && (1 === t ? u._tr_align(n) : 5 !== t && (u._tr_stored_block(n, 0, 0, !1), 3 === t && (D(n.head), 0 === n.lookahead && (n.strstart = 0, n.block_start = 0, n.insert = 0))), F(e), 0 === e.avail_out)) return n.last_flush = -1, m;
        }
        return t !== f ? m : n.wrap <= 0 ? 1 : (2 === n.wrap ? (U(n, 255 & e.adler), U(n, e.adler >> 8 & 255), U(n, e.adler >> 16 & 255), U(n, e.adler >> 24 & 255), U(n, 255 & e.total_in), U(n, e.total_in >> 8 & 255), U(n, e.total_in >> 16 & 255), U(n, e.total_in >> 24 & 255)) : (P(n, e.adler >>> 16), P(n, 65535 & e.adler)), F(e), 0 < n.wrap && (n.wrap = -n.wrap), 0 !== n.pending ? m : 1);
      }, r.deflateEnd = function (e) {
        var t;
        return e && e.state ? (t = e.state.status) !== C && 69 !== t && 73 !== t && 91 !== t && 103 !== t && t !== E && 666 !== t ? R(e, _) : (e.state = null, t === E ? R(e, -3) : m) : _;
      }, r.deflateSetDictionary = function (e, t) {
        var r,
          n,
          i,
          s,
          a,
          o,
          h,
          u,
          l = t.length;
        if (!e || !e.state) return _;
        if (2 === (s = (r = e.state).wrap) || 1 === s && r.status !== C || r.lookahead) return _;
        for (1 === s && (e.adler = d(e.adler, t, l, 0)), r.wrap = 0, l >= r.w_size && (0 === s && (D(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0), u = new c.Buf8(r.w_size), c.arraySet(u, t, l - r.w_size, r.w_size, 0), t = u, l = r.w_size), a = e.avail_in, o = e.next_in, h = e.input, e.avail_in = l, e.next_in = 0, e.input = t, j(r); r.lookahead >= x;) {
          for (n = r.strstart, i = r.lookahead - (x - 1); r.ins_h = (r.ins_h << r.hash_shift ^ r.window[n + x - 1]) & r.hash_mask, r.prev[n & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = n, n++, --i;) {
            ;
          }
          r.strstart = n, r.lookahead = x - 1, j(r);
        }
        return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = x - 1, r.match_available = 0, e.next_in = o, e.input = h, e.avail_in = a, r.wrap = s, m;
      }, r.deflateInfo = "pako deflate (from Nodeca project)";
    }, {
      "../utils/common": 41,
      "./adler32": 43,
      "./crc32": 45,
      "./messages": 51,
      "./trees": 52
    }],
    47: [function (e, t, r) {
      "use strict";

      t.exports = function () {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      };
    }, {}],
    48: [function (e, t, r) {
      "use strict";

      t.exports = function (e, t) {
        var r, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
        r = e.state, n = e.next_in, z = e.input, i = n + (e.avail_in - 5), s = e.next_out, C = e.output, a = s - (t - e.avail_out), o = s + (e.avail_out - 257), h = r.dmax, u = r.wsize, l = r.whave, f = r.wnext, c = r.window, d = r.hold, p = r.bits, m = r.lencode, _ = r.distcode, g = (1 << r.lenbits) - 1, b = (1 << r.distbits) - 1;
        e: do {
          p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
          t: for (;;) {
            if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;else {
              if (!(16 & y)) {
                if (0 == (64 & y)) {
                  v = m[(65535 & v) + (d & (1 << y) - 1)];
                  continue t;
                }
                if (32 & y) {
                  r.mode = 12;
                  break e;
                }
                e.msg = "invalid literal/length code", r.mode = 30;
                break e;
              }
              w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
              r: for (;;) {
                if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                  if (0 == (64 & y)) {
                    v = _[(65535 & v) + (d & (1 << y) - 1)];
                    continue r;
                  }
                  e.msg = "invalid distance code", r.mode = 30;
                  break e;
                }
                if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                  e.msg = "invalid distance too far back", r.mode = 30;
                  break e;
                }
                if (d >>>= y, p -= y, (y = s - a) < k) {
                  if (l < (y = k - y) && r.sane) {
                    e.msg = "invalid distance too far back", r.mode = 30;
                    break e;
                  }
                  if (S = c, (x = 0) === f) {
                    if (x += u - y, y < w) {
                      for (w -= y; C[s++] = c[x++], --y;) {
                        ;
                      }
                      x = s - k, S = C;
                    }
                  } else if (f < y) {
                    if (x += u + f - y, (y -= f) < w) {
                      for (w -= y; C[s++] = c[x++], --y;) {
                        ;
                      }
                      if (x = 0, f < w) {
                        for (w -= y = f; C[s++] = c[x++], --y;) {
                          ;
                        }
                        x = s - k, S = C;
                      }
                    }
                  } else if (x += f - y, y < w) {
                    for (w -= y; C[s++] = c[x++], --y;) {
                      ;
                    }
                    x = s - k, S = C;
                  }
                  for (; 2 < w;) {
                    C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                  }
                  w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                } else {
                  for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3);) {
                    ;
                  }
                  w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                }
                break;
              }
            }
            break;
          }
        } while (n < i && s < o);
        n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e.next_in = n, e.next_out = s, e.avail_in = n < i ? i - n + 5 : 5 - (n - i), e.avail_out = s < o ? o - s + 257 : 257 - (s - o), r.hold = d, r.bits = p;
      };
    }, {}],
    49: [function (e, t, r) {
      "use strict";

      var I = e("../utils/common"),
        O = e("./adler32"),
        B = e("./crc32"),
        R = e("./inffast"),
        T = e("./inftrees"),
        D = 1,
        F = 2,
        N = 0,
        U = -2,
        P = 1,
        n = 852,
        i = 592;
      function L(e) {
        return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
      }
      function s() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function a(e) {
        var t;
        return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = P, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new I.Buf32(n), t.distcode = t.distdyn = new I.Buf32(i), t.sane = 1, t.back = -1, N) : U;
      }
      function o(e) {
        var t;
        return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, a(e)) : U;
      }
      function h(e, t) {
        var r, n;
        return e && e.state ? (n = e.state, t < 0 ? (r = 0, t = -t) : (r = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || 15 < t) ? U : (null !== n.window && n.wbits !== t && (n.window = null), n.wrap = r, n.wbits = t, o(e))) : U;
      }
      function u(e, t) {
        var r, n;
        return e ? (n = new s(), (e.state = n).window = null, (r = h(e, t)) !== N && (e.state = null), r) : U;
      }
      var l,
        f,
        c = !0;
      function j(e) {
        if (c) {
          var t;
          for (l = new I.Buf32(512), f = new I.Buf32(32), t = 0; t < 144;) {
            e.lens[t++] = 8;
          }
          for (; t < 256;) {
            e.lens[t++] = 9;
          }
          for (; t < 280;) {
            e.lens[t++] = 7;
          }
          for (; t < 288;) {
            e.lens[t++] = 8;
          }
          for (T(D, e.lens, 0, 288, l, 0, e.work, {
            bits: 9
          }), t = 0; t < 32;) {
            e.lens[t++] = 5;
          }
          T(F, e.lens, 0, 32, f, 0, e.work, {
            bits: 5
          }), c = !1;
        }
        e.lencode = l, e.lenbits = 9, e.distcode = f, e.distbits = 5;
      }
      function Z(e, t, r, n) {
        var i,
          s = e.state;
        return null === s.window && (s.wsize = 1 << s.wbits, s.wnext = 0, s.whave = 0, s.window = new I.Buf8(s.wsize)), n >= s.wsize ? (I.arraySet(s.window, t, r - s.wsize, s.wsize, 0), s.wnext = 0, s.whave = s.wsize) : (n < (i = s.wsize - s.wnext) && (i = n), I.arraySet(s.window, t, r - n, i, s.wnext), (n -= i) ? (I.arraySet(s.window, t, r - n, n, 0), s.wnext = n, s.whave = s.wsize) : (s.wnext += i, s.wnext === s.wsize && (s.wnext = 0), s.whave < s.wsize && (s.whave += i))), 0;
      }
      r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function (e) {
        return u(e, 15);
      }, r.inflateInit2 = u, r.inflate = function (e, t) {
        var r,
          n,
          i,
          s,
          a,
          o,
          h,
          u,
          l,
          f,
          c,
          d,
          p,
          m,
          _,
          g,
          b,
          v,
          y,
          w,
          k,
          x,
          S,
          z,
          C = 0,
          E = new I.Buf8(4),
          A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return U;
        12 === (r = e.state).mode && (r.mode = 13), a = e.next_out, i = e.output, h = e.avail_out, s = e.next_in, n = e.input, o = e.avail_in, u = r.hold, l = r.bits, f = o, c = h, x = N;
        e: for (;;) {
          switch (r.mode) {
            case P:
              if (0 === r.wrap) {
                r.mode = 13;
                break;
              }
              for (; l < 16;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              if (2 & r.wrap && 35615 === u) {
                E[r.check = 0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0), l = u = 0, r.mode = 2;
                break;
              }
              if (r.flags = 0, r.head && (r.head.done = !1), !(1 & r.wrap) || (((255 & u) << 8) + (u >> 8)) % 31) {
                e.msg = "incorrect header check", r.mode = 30;
                break;
              }
              if (8 != (15 & u)) {
                e.msg = "unknown compression method", r.mode = 30;
                break;
              }
              if (l -= 4, k = 8 + (15 & (u >>>= 4)), 0 === r.wbits) r.wbits = k;else if (k > r.wbits) {
                e.msg = "invalid window size", r.mode = 30;
                break;
              }
              r.dmax = 1 << k, e.adler = r.check = 1, r.mode = 512 & u ? 10 : 12, l = u = 0;
              break;
            case 2:
              for (; l < 16;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              if (r.flags = u, 8 != (255 & r.flags)) {
                e.msg = "unknown compression method", r.mode = 30;
                break;
              }
              if (57344 & r.flags) {
                e.msg = "unknown header flags set", r.mode = 30;
                break;
              }
              r.head && (r.head.text = u >> 8 & 1), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 3;
            case 3:
              for (; l < 32;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              r.head && (r.head.time = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, E[2] = u >>> 16 & 255, E[3] = u >>> 24 & 255, r.check = B(r.check, E, 4, 0)), l = u = 0, r.mode = 4;
            case 4:
              for (; l < 16;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              r.head && (r.head.xflags = 255 & u, r.head.os = u >> 8), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0, r.mode = 5;
            case 5:
              if (1024 & r.flags) {
                for (; l < 16;) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                r.length = u, r.head && (r.head.extra_len = u), 512 & r.flags && (E[0] = 255 & u, E[1] = u >>> 8 & 255, r.check = B(r.check, E, 2, 0)), l = u = 0;
              } else r.head && (r.head.extra = null);
              r.mode = 6;
            case 6:
              if (1024 & r.flags && (o < (d = r.length) && (d = o), d && (r.head && (k = r.head.extra_len - r.length, r.head.extra || (r.head.extra = new Array(r.head.extra_len)), I.arraySet(r.head.extra, n, s, d, k)), 512 & r.flags && (r.check = B(r.check, n, d, s)), o -= d, s += d, r.length -= d), r.length)) break e;
              r.length = 0, r.mode = 7;
            case 7:
              if (2048 & r.flags) {
                if (0 === o) break e;
                for (d = 0; k = n[s + d++], r.head && k && r.length < 65536 && (r.head.name += String.fromCharCode(k)), k && d < o;) {
                  ;
                }
                if (512 & r.flags && (r.check = B(r.check, n, d, s)), o -= d, s += d, k) break e;
              } else r.head && (r.head.name = null);
              r.length = 0, r.mode = 8;
            case 8:
              if (4096 & r.flags) {
                if (0 === o) break e;
                for (d = 0; k = n[s + d++], r.head && k && r.length < 65536 && (r.head.comment += String.fromCharCode(k)), k && d < o;) {
                  ;
                }
                if (512 & r.flags && (r.check = B(r.check, n, d, s)), o -= d, s += d, k) break e;
              } else r.head && (r.head.comment = null);
              r.mode = 9;
            case 9:
              if (512 & r.flags) {
                for (; l < 16;) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                if (u !== (65535 & r.check)) {
                  e.msg = "header crc mismatch", r.mode = 30;
                  break;
                }
                l = u = 0;
              }
              r.head && (r.head.hcrc = r.flags >> 9 & 1, r.head.done = !0), e.adler = r.check = 0, r.mode = 12;
              break;
            case 10:
              for (; l < 32;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              e.adler = r.check = L(u), l = u = 0, r.mode = 11;
            case 11:
              if (0 === r.havedict) return e.next_out = a, e.avail_out = h, e.next_in = s, e.avail_in = o, r.hold = u, r.bits = l, 2;
              e.adler = r.check = 1, r.mode = 12;
            case 12:
              if (5 === t || 6 === t) break e;
            case 13:
              if (r.last) {
                u >>>= 7 & l, l -= 7 & l, r.mode = 27;
                break;
              }
              for (; l < 3;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              switch (r.last = 1 & u, l -= 1, 3 & (u >>>= 1)) {
                case 0:
                  r.mode = 14;
                  break;
                case 1:
                  if (j(r), r.mode = 20, 6 !== t) break;
                  u >>>= 2, l -= 2;
                  break e;
                case 2:
                  r.mode = 17;
                  break;
                case 3:
                  e.msg = "invalid block type", r.mode = 30;
              }
              u >>>= 2, l -= 2;
              break;
            case 14:
              for (u >>>= 7 & l, l -= 7 & l; l < 32;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              if ((65535 & u) != (u >>> 16 ^ 65535)) {
                e.msg = "invalid stored block lengths", r.mode = 30;
                break;
              }
              if (r.length = 65535 & u, l = u = 0, r.mode = 15, 6 === t) break e;
            case 15:
              r.mode = 16;
            case 16:
              if (d = r.length) {
                if (o < d && (d = o), h < d && (d = h), 0 === d) break e;
                I.arraySet(i, n, s, d, a), o -= d, s += d, h -= d, a += d, r.length -= d;
                break;
              }
              r.mode = 12;
              break;
            case 17:
              for (; l < 14;) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              if (r.nlen = 257 + (31 & u), u >>>= 5, l -= 5, r.ndist = 1 + (31 & u), u >>>= 5, l -= 5, r.ncode = 4 + (15 & u), u >>>= 4, l -= 4, 286 < r.nlen || 30 < r.ndist) {
                e.msg = "too many length or distance symbols", r.mode = 30;
                break;
              }
              r.have = 0, r.mode = 18;
            case 18:
              for (; r.have < r.ncode;) {
                for (; l < 3;) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                r.lens[A[r.have++]] = 7 & u, u >>>= 3, l -= 3;
              }
              for (; r.have < 19;) {
                r.lens[A[r.have++]] = 0;
              }
              if (r.lencode = r.lendyn, r.lenbits = 7, S = {
                bits: r.lenbits
              }, x = T(0, r.lens, 0, 19, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) {
                e.msg = "invalid code lengths set", r.mode = 30;
                break;
              }
              r.have = 0, r.mode = 19;
            case 19:
              for (; r.have < r.nlen + r.ndist;) {
                for (; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                if (b < 16) u >>>= _, l -= _, r.lens[r.have++] = b;else {
                  if (16 === b) {
                    for (z = _ + 2; l < z;) {
                      if (0 === o) break e;
                      o--, u += n[s++] << l, l += 8;
                    }
                    if (u >>>= _, l -= _, 0 === r.have) {
                      e.msg = "invalid bit length repeat", r.mode = 30;
                      break;
                    }
                    k = r.lens[r.have - 1], d = 3 + (3 & u), u >>>= 2, l -= 2;
                  } else if (17 === b) {
                    for (z = _ + 3; l < z;) {
                      if (0 === o) break e;
                      o--, u += n[s++] << l, l += 8;
                    }
                    l -= _, k = 0, d = 3 + (7 & (u >>>= _)), u >>>= 3, l -= 3;
                  } else {
                    for (z = _ + 7; l < z;) {
                      if (0 === o) break e;
                      o--, u += n[s++] << l, l += 8;
                    }
                    l -= _, k = 0, d = 11 + (127 & (u >>>= _)), u >>>= 7, l -= 7;
                  }
                  if (r.have + d > r.nlen + r.ndist) {
                    e.msg = "invalid bit length repeat", r.mode = 30;
                    break;
                  }
                  for (; d--;) {
                    r.lens[r.have++] = k;
                  }
                }
              }
              if (30 === r.mode) break;
              if (0 === r.lens[256]) {
                e.msg = "invalid code -- missing end-of-block", r.mode = 30;
                break;
              }
              if (r.lenbits = 9, S = {
                bits: r.lenbits
              }, x = T(D, r.lens, 0, r.nlen, r.lencode, 0, r.work, S), r.lenbits = S.bits, x) {
                e.msg = "invalid literal/lengths set", r.mode = 30;
                break;
              }
              if (r.distbits = 6, r.distcode = r.distdyn, S = {
                bits: r.distbits
              }, x = T(F, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, S), r.distbits = S.bits, x) {
                e.msg = "invalid distances set", r.mode = 30;
                break;
              }
              if (r.mode = 20, 6 === t) break e;
            case 20:
              r.mode = 21;
            case 21:
              if (6 <= o && 258 <= h) {
                e.next_out = a, e.avail_out = h, e.next_in = s, e.avail_in = o, r.hold = u, r.bits = l, R(e, c), a = e.next_out, i = e.output, h = e.avail_out, s = e.next_in, n = e.input, o = e.avail_in, u = r.hold, l = r.bits, 12 === r.mode && (r.back = -1);
                break;
              }
              for (r.back = 0; g = (C = r.lencode[u & (1 << r.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              if (g && 0 == (240 & g)) {
                for (v = _, y = g, w = b; g = (C = r.lencode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                u >>>= v, l -= v, r.back += v;
              }
              if (u >>>= _, l -= _, r.back += _, r.length = b, 0 === g) {
                r.mode = 26;
                break;
              }
              if (32 & g) {
                r.back = -1, r.mode = 12;
                break;
              }
              if (64 & g) {
                e.msg = "invalid literal/length code", r.mode = 30;
                break;
              }
              r.extra = 15 & g, r.mode = 22;
            case 22:
              if (r.extra) {
                for (z = r.extra; l < z;) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                r.length += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra;
              }
              r.was = r.length, r.mode = 23;
            case 23:
              for (; g = (C = r.distcode[u & (1 << r.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l);) {
                if (0 === o) break e;
                o--, u += n[s++] << l, l += 8;
              }
              if (0 == (240 & g)) {
                for (v = _, y = g, w = b; g = (C = r.distcode[w + ((u & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l);) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                u >>>= v, l -= v, r.back += v;
              }
              if (u >>>= _, l -= _, r.back += _, 64 & g) {
                e.msg = "invalid distance code", r.mode = 30;
                break;
              }
              r.offset = b, r.extra = 15 & g, r.mode = 24;
            case 24:
              if (r.extra) {
                for (z = r.extra; l < z;) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                r.offset += u & (1 << r.extra) - 1, u >>>= r.extra, l -= r.extra, r.back += r.extra;
              }
              if (r.offset > r.dmax) {
                e.msg = "invalid distance too far back", r.mode = 30;
                break;
              }
              r.mode = 25;
            case 25:
              if (0 === h) break e;
              if (d = c - h, r.offset > d) {
                if ((d = r.offset - d) > r.whave && r.sane) {
                  e.msg = "invalid distance too far back", r.mode = 30;
                  break;
                }
                p = d > r.wnext ? (d -= r.wnext, r.wsize - d) : r.wnext - d, d > r.length && (d = r.length), m = r.window;
              } else m = i, p = a - r.offset, d = r.length;
              for (h < d && (d = h), h -= d, r.length -= d; i[a++] = m[p++], --d;) {
                ;
              }
              0 === r.length && (r.mode = 21);
              break;
            case 26:
              if (0 === h) break e;
              i[a++] = r.length, h--, r.mode = 21;
              break;
            case 27:
              if (r.wrap) {
                for (; l < 32;) {
                  if (0 === o) break e;
                  o--, u |= n[s++] << l, l += 8;
                }
                if (c -= h, e.total_out += c, r.total += c, c && (e.adler = r.check = r.flags ? B(r.check, i, c, a - c) : O(r.check, i, c, a - c)), c = h, (r.flags ? u : L(u)) !== r.check) {
                  e.msg = "incorrect data check", r.mode = 30;
                  break;
                }
                l = u = 0;
              }
              r.mode = 28;
            case 28:
              if (r.wrap && r.flags) {
                for (; l < 32;) {
                  if (0 === o) break e;
                  o--, u += n[s++] << l, l += 8;
                }
                if (u !== (4294967295 & r.total)) {
                  e.msg = "incorrect length check", r.mode = 30;
                  break;
                }
                l = u = 0;
              }
              r.mode = 29;
            case 29:
              x = 1;
              break e;
            case 30:
              x = -3;
              break e;
            case 31:
              return -4;
            case 32:
            default:
              return U;
          }
        }
        return e.next_out = a, e.avail_out = h, e.next_in = s, e.avail_in = o, r.hold = u, r.bits = l, (r.wsize || c !== e.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== t)) && Z(e, e.output, e.next_out, c - e.avail_out) ? (r.mode = 31, -4) : (f -= e.avail_in, c -= e.avail_out, e.total_in += f, e.total_out += c, r.total += c, r.wrap && c && (e.adler = r.check = r.flags ? B(r.check, i, c, e.next_out - c) : O(r.check, i, c, e.next_out - c)), e.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0), (0 == f && 0 === c || 4 === t) && x === N && (x = -5), x);
      }, r.inflateEnd = function (e) {
        if (!e || !e.state) return U;
        var t = e.state;
        return t.window && (t.window = null), e.state = null, N;
      }, r.inflateGetHeader = function (e, t) {
        var r;
        return e && e.state ? 0 == (2 & (r = e.state).wrap) ? U : ((r.head = t).done = !1, N) : U;
      }, r.inflateSetDictionary = function (e, t) {
        var r,
          n = t.length;
        return e && e.state ? 0 !== (r = e.state).wrap && 11 !== r.mode ? U : 11 === r.mode && O(1, t, n, 0) !== r.check ? -3 : Z(e, t, n, n) ? (r.mode = 31, -4) : (r.havedict = 1, N) : U;
      }, r.inflateInfo = "pako inflate (from Nodeca project)";
    }, {
      "../utils/common": 41,
      "./adler32": 43,
      "./crc32": 45,
      "./inffast": 48,
      "./inftrees": 50
    }],
    50: [function (e, t, r) {
      "use strict";

      var D = e("../utils/common"),
        F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
        N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
        U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
        P = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      t.exports = function (e, t, r, n, i, s, a, o) {
        var h,
          u,
          l,
          f,
          c,
          d,
          p,
          m,
          _,
          g = o.bits,
          b = 0,
          v = 0,
          y = 0,
          w = 0,
          k = 0,
          x = 0,
          S = 0,
          z = 0,
          C = 0,
          E = 0,
          A = null,
          I = 0,
          O = new D.Buf16(16),
          B = new D.Buf16(16),
          R = null,
          T = 0;
        for (b = 0; b <= 15; b++) {
          O[b] = 0;
        }
        for (v = 0; v < n; v++) {
          O[t[r + v]]++;
        }
        for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) {
          ;
        }
        if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
        for (y = 1; y < w && 0 === O[y]; y++) {
          ;
        }
        for (k < y && (k = y), b = z = 1; b <= 15; b++) {
          if (z <<= 1, (z -= O[b]) < 0) return -1;
        }
        if (0 < z && (0 === e || 1 !== w)) return -1;
        for (B[1] = 0, b = 1; b < 15; b++) {
          B[b + 1] = B[b] + O[b];
        }
        for (v = 0; v < n; v++) {
          0 !== t[r + v] && (a[B[t[r + v]]++] = v);
        }
        if (d = 0 === e ? (A = R = a, 19) : 1 === e ? (A = F, I -= 257, R = N, T -= 257, 256) : (A = U, R = P, -1), b = y, c = s, S = v = E = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e && 852 < C || 2 === e && 592 < C) return 1;
        for (;;) {
          for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u;) {
            ;
          }
          for (h = 1 << b - 1; E & h;) {
            h >>= 1;
          }
          if (0 !== h ? (E &= h - 1, E += h) : E = 0, v++, 0 == --O[b]) {
            if (b === w) break;
            b = t[r + a[v]];
          }
          if (k < b && (E & f) !== l) {
            for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0);) {
              x++, z <<= 1;
            }
            if (C += 1 << x, 1 === e && 852 < C || 2 === e && 592 < C) return 1;
            i[l = E & f] = k << 24 | x << 16 | c - s | 0;
          }
        }
        return 0 !== E && (i[c + E] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
      };
    }, {
      "../utils/common": 41
    }],
    51: [function (e, t, r) {
      "use strict";

      t.exports = {
        2: "need dictionary",
        1: "stream end",
        0: "",
        "-1": "file error",
        "-2": "stream error",
        "-3": "data error",
        "-4": "insufficient memory",
        "-5": "buffer error",
        "-6": "incompatible version"
      };
    }, {}],
    52: [function (e, t, r) {
      "use strict";

      var i = e("../utils/common"),
        o = 0,
        h = 1;
      function n(e) {
        for (var t = e.length; 0 <= --t;) {
          e[t] = 0;
        }
      }
      var s = 0,
        a = 29,
        u = 256,
        l = u + 1 + a,
        f = 30,
        c = 19,
        _ = 2 * l + 1,
        g = 15,
        d = 16,
        p = 7,
        m = 256,
        b = 16,
        v = 17,
        y = 18,
        w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
        k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
        x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
        S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
        z = new Array(2 * (l + 2));
      n(z);
      var C = new Array(2 * f);
      n(C);
      var E = new Array(512);
      n(E);
      var A = new Array(256);
      n(A);
      var I = new Array(a);
      n(I);
      var O,
        B,
        R,
        T = new Array(f);
      function D(e, t, r, n, i) {
        this.static_tree = e, this.extra_bits = t, this.extra_base = r, this.elems = n, this.max_length = i, this.has_stree = e && e.length;
      }
      function F(e, t) {
        this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
      }
      function N(e) {
        return e < 256 ? E[e] : E[256 + (e >>> 7)];
      }
      function U(e, t) {
        e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255;
      }
      function P(e, t, r) {
        e.bi_valid > d - r ? (e.bi_buf |= t << e.bi_valid & 65535, U(e, e.bi_buf), e.bi_buf = t >> d - e.bi_valid, e.bi_valid += r - d) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += r);
      }
      function L(e, t, r) {
        P(e, r[2 * t], r[2 * t + 1]);
      }
      function j(e, t) {
        for (var r = 0; r |= 1 & e, e >>>= 1, r <<= 1, 0 < --t;) {
          ;
        }
        return r >>> 1;
      }
      function Z(e, t, r) {
        var n,
          i,
          s = new Array(g + 1),
          a = 0;
        for (n = 1; n <= g; n++) {
          s[n] = a = a + r[n - 1] << 1;
        }
        for (i = 0; i <= t; i++) {
          var o = e[2 * i + 1];
          0 !== o && (e[2 * i] = j(s[o]++, o));
        }
      }
      function W(e) {
        var t;
        for (t = 0; t < l; t++) {
          e.dyn_ltree[2 * t] = 0;
        }
        for (t = 0; t < f; t++) {
          e.dyn_dtree[2 * t] = 0;
        }
        for (t = 0; t < c; t++) {
          e.bl_tree[2 * t] = 0;
        }
        e.dyn_ltree[2 * m] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
      }
      function M(e) {
        8 < e.bi_valid ? U(e, e.bi_buf) : 0 < e.bi_valid && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
      }
      function H(e, t, r, n) {
        var i = 2 * t,
          s = 2 * r;
        return e[i] < e[s] || e[i] === e[s] && n[t] <= n[r];
      }
      function G(e, t, r) {
        for (var n = e.heap[r], i = r << 1; i <= e.heap_len && (i < e.heap_len && H(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !H(t, n, e.heap[i], e.depth));) {
          e.heap[r] = e.heap[i], r = i, i <<= 1;
        }
        e.heap[r] = n;
      }
      function K(e, t, r) {
        var n,
          i,
          s,
          a,
          o = 0;
        if (0 !== e.last_lit) for (; n = e.pending_buf[e.d_buf + 2 * o] << 8 | e.pending_buf[e.d_buf + 2 * o + 1], i = e.pending_buf[e.l_buf + o], o++, 0 === n ? L(e, i, t) : (L(e, (s = A[i]) + u + 1, t), 0 !== (a = w[s]) && P(e, i -= I[s], a), L(e, s = N(--n), r), 0 !== (a = k[s]) && P(e, n -= T[s], a)), o < e.last_lit;) {
          ;
        }
        L(e, m, t);
      }
      function Y(e, t) {
        var r,
          n,
          i,
          s = t.dyn_tree,
          a = t.stat_desc.static_tree,
          o = t.stat_desc.has_stree,
          h = t.stat_desc.elems,
          u = -1;
        for (e.heap_len = 0, e.heap_max = _, r = 0; r < h; r++) {
          0 !== s[2 * r] ? (e.heap[++e.heap_len] = u = r, e.depth[r] = 0) : s[2 * r + 1] = 0;
        }
        for (; e.heap_len < 2;) {
          s[2 * (i = e.heap[++e.heap_len] = u < 2 ? ++u : 0)] = 1, e.depth[i] = 0, e.opt_len--, o && (e.static_len -= a[2 * i + 1]);
        }
        for (t.max_code = u, r = e.heap_len >> 1; 1 <= r; r--) {
          G(e, s, r);
        }
        for (i = h; r = e.heap[1], e.heap[1] = e.heap[e.heap_len--], G(e, s, 1), n = e.heap[1], e.heap[--e.heap_max] = r, e.heap[--e.heap_max] = n, s[2 * i] = s[2 * r] + s[2 * n], e.depth[i] = (e.depth[r] >= e.depth[n] ? e.depth[r] : e.depth[n]) + 1, s[2 * r + 1] = s[2 * n + 1] = i, e.heap[1] = i++, G(e, s, 1), 2 <= e.heap_len;) {
          ;
        }
        e.heap[--e.heap_max] = e.heap[1], function (e, t) {
          var r,
            n,
            i,
            s,
            a,
            o,
            h = t.dyn_tree,
            u = t.max_code,
            l = t.stat_desc.static_tree,
            f = t.stat_desc.has_stree,
            c = t.stat_desc.extra_bits,
            d = t.stat_desc.extra_base,
            p = t.stat_desc.max_length,
            m = 0;
          for (s = 0; s <= g; s++) {
            e.bl_count[s] = 0;
          }
          for (h[2 * e.heap[e.heap_max] + 1] = 0, r = e.heap_max + 1; r < _; r++) {
            p < (s = h[2 * h[2 * (n = e.heap[r]) + 1] + 1] + 1) && (s = p, m++), h[2 * n + 1] = s, u < n || (e.bl_count[s]++, a = 0, d <= n && (a = c[n - d]), o = h[2 * n], e.opt_len += o * (s + a), f && (e.static_len += o * (l[2 * n + 1] + a)));
          }
          if (0 !== m) {
            do {
              for (s = p - 1; 0 === e.bl_count[s];) {
                s--;
              }
              e.bl_count[s]--, e.bl_count[s + 1] += 2, e.bl_count[p]--, m -= 2;
            } while (0 < m);
            for (s = p; 0 !== s; s--) {
              for (n = e.bl_count[s]; 0 !== n;) {
                u < (i = e.heap[--r]) || (h[2 * i + 1] !== s && (e.opt_len += (s - h[2 * i + 1]) * h[2 * i], h[2 * i + 1] = s), n--);
              }
            }
          }
        }(e, t), Z(s, u, e.bl_count);
      }
      function X(e, t, r) {
        var n,
          i,
          s = -1,
          a = t[1],
          o = 0,
          h = 7,
          u = 4;
        for (0 === a && (h = 138, u = 3), t[2 * (r + 1) + 1] = 65535, n = 0; n <= r; n++) {
          i = a, a = t[2 * (n + 1) + 1], ++o < h && i === a || (o < u ? e.bl_tree[2 * i] += o : 0 !== i ? (i !== s && e.bl_tree[2 * i]++, e.bl_tree[2 * b]++) : o <= 10 ? e.bl_tree[2 * v]++ : e.bl_tree[2 * y]++, s = i, u = (o = 0) === a ? (h = 138, 3) : i === a ? (h = 6, 3) : (h = 7, 4));
        }
      }
      function V(e, t, r) {
        var n,
          i,
          s = -1,
          a = t[1],
          o = 0,
          h = 7,
          u = 4;
        for (0 === a && (h = 138, u = 3), n = 0; n <= r; n++) {
          if (i = a, a = t[2 * (n + 1) + 1], !(++o < h && i === a)) {
            if (o < u) for (; L(e, i, e.bl_tree), 0 != --o;) {
              ;
            } else 0 !== i ? (i !== s && (L(e, i, e.bl_tree), o--), L(e, b, e.bl_tree), P(e, o - 3, 2)) : o <= 10 ? (L(e, v, e.bl_tree), P(e, o - 3, 3)) : (L(e, y, e.bl_tree), P(e, o - 11, 7));
            s = i, u = (o = 0) === a ? (h = 138, 3) : i === a ? (h = 6, 3) : (h = 7, 4);
          }
        }
      }
      n(T);
      var q = !1;
      function J(e, t, r, n) {
        P(e, (s << 1) + (n ? 1 : 0), 3), function (e, t, r, n) {
          M(e), n && (U(e, r), U(e, ~r)), i.arraySet(e.pending_buf, e.window, t, r, e.pending), e.pending += r;
        }(e, t, r, !0);
      }
      r._tr_init = function (e) {
        q || (function () {
          var e,
            t,
            r,
            n,
            i,
            s = new Array(g + 1);
          for (n = r = 0; n < a - 1; n++) {
            for (I[n] = r, e = 0; e < 1 << w[n]; e++) {
              A[r++] = n;
            }
          }
          for (A[r - 1] = n, n = i = 0; n < 16; n++) {
            for (T[n] = i, e = 0; e < 1 << k[n]; e++) {
              E[i++] = n;
            }
          }
          for (i >>= 7; n < f; n++) {
            for (T[n] = i << 7, e = 0; e < 1 << k[n] - 7; e++) {
              E[256 + i++] = n;
            }
          }
          for (t = 0; t <= g; t++) {
            s[t] = 0;
          }
          for (e = 0; e <= 143;) {
            z[2 * e + 1] = 8, e++, s[8]++;
          }
          for (; e <= 255;) {
            z[2 * e + 1] = 9, e++, s[9]++;
          }
          for (; e <= 279;) {
            z[2 * e + 1] = 7, e++, s[7]++;
          }
          for (; e <= 287;) {
            z[2 * e + 1] = 8, e++, s[8]++;
          }
          for (Z(z, l + 1, s), e = 0; e < f; e++) {
            C[2 * e + 1] = 5, C[2 * e] = j(e, 5);
          }
          O = new D(z, w, u + 1, l, g), B = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
        }(), q = !0), e.l_desc = new F(e.dyn_ltree, O), e.d_desc = new F(e.dyn_dtree, B), e.bl_desc = new F(e.bl_tree, R), e.bi_buf = 0, e.bi_valid = 0, W(e);
      }, r._tr_stored_block = J, r._tr_flush_block = function (e, t, r, n) {
        var i,
          s,
          a = 0;
        0 < e.level ? (2 === e.strm.data_type && (e.strm.data_type = function (e) {
          var t,
            r = 4093624447;
          for (t = 0; t <= 31; t++, r >>>= 1) {
            if (1 & r && 0 !== e.dyn_ltree[2 * t]) return o;
          }
          if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return h;
          for (t = 32; t < u; t++) {
            if (0 !== e.dyn_ltree[2 * t]) return h;
          }
          return o;
        }(e)), Y(e, e.l_desc), Y(e, e.d_desc), a = function (e) {
          var t;
          for (X(e, e.dyn_ltree, e.l_desc.max_code), X(e, e.dyn_dtree, e.d_desc.max_code), Y(e, e.bl_desc), t = c - 1; 3 <= t && 0 === e.bl_tree[2 * S[t] + 1]; t--) {
            ;
          }
          return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
        }(e), i = e.opt_len + 3 + 7 >>> 3, (s = e.static_len + 3 + 7 >>> 3) <= i && (i = s)) : i = s = r + 5, r + 4 <= i && -1 !== t ? J(e, t, r, n) : 4 === e.strategy || s === i ? (P(e, 2 + (n ? 1 : 0), 3), K(e, z, C)) : (P(e, 4 + (n ? 1 : 0), 3), function (e, t, r, n) {
          var i;
          for (P(e, t - 257, 5), P(e, r - 1, 5), P(e, n - 4, 4), i = 0; i < n; i++) {
            P(e, e.bl_tree[2 * S[i] + 1], 3);
          }
          V(e, e.dyn_ltree, t - 1), V(e, e.dyn_dtree, r - 1);
        }(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, a + 1), K(e, e.dyn_ltree, e.dyn_dtree)), W(e), n && M(e);
      }, r._tr_tally = function (e, t, r) {
        return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & r, e.last_lit++, 0 === t ? e.dyn_ltree[2 * r]++ : (e.matches++, t--, e.dyn_ltree[2 * (A[r] + u + 1)]++, e.dyn_dtree[2 * N(t)]++), e.last_lit === e.lit_bufsize - 1;
      }, r._tr_align = function (e) {
        P(e, 2, 3), L(e, m, z), function (e) {
          16 === e.bi_valid ? (U(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);
        }(e);
      };
    }, {
      "../utils/common": 41
    }],
    53: [function (e, t, r) {
      "use strict";

      t.exports = function () {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}],
    54: [function (e, t, r) {
      (function (e) {
        !function (r, n) {
          "use strict";

          if (!r.setImmediate) {
            var i,
              s,
              t,
              a,
              o = 1,
              h = {},
              u = !1,
              l = r.document,
              e = Object.getPrototypeOf && Object.getPrototypeOf(r);
            e = e && e.setTimeout ? e : r, i = "[object process]" === {}.toString.call(r.process) ? function (e) {
              process.nextTick(function () {
                c(e);
              });
            } : function () {
              if (r.postMessage && !r.importScripts) {
                var e = !0,
                  t = r.onmessage;
                return r.onmessage = function () {
                  e = !1;
                }, r.postMessage("", "*"), r.onmessage = t, e;
              }
            }() ? (a = "setImmediate$" + Math.random() + "$", r.addEventListener ? r.addEventListener("message", d, !1) : r.attachEvent("onmessage", d), function (e) {
              r.postMessage(a + e, "*");
            }) : r.MessageChannel ? ((t = new MessageChannel()).port1.onmessage = function (e) {
              c(e.data);
            }, function (e) {
              t.port2.postMessage(e);
            }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function (e) {
              var t = l.createElement("script");
              t.onreadystatechange = function () {
                c(e), t.onreadystatechange = null, s.removeChild(t), t = null;
              }, s.appendChild(t);
            }) : function (e) {
              setTimeout(c, 0, e);
            }, e.setImmediate = function (e) {
              "function" != typeof e && (e = new Function("" + e));
              for (var t = new Array(arguments.length - 1), r = 0; r < t.length; r++) {
                t[r] = arguments[r + 1];
              }
              var n = {
                callback: e,
                args: t
              };
              return h[o] = n, i(o), o++;
            }, e.clearImmediate = f;
          }
          function f(e) {
            delete h[e];
          }
          function c(e) {
            if (u) setTimeout(c, 0, e);else {
              var t = h[e];
              if (t) {
                u = !0;
                try {
                  !function (e) {
                    var t = e.callback,
                      r = e.args;
                    switch (r.length) {
                      case 0:
                        t();
                        break;
                      case 1:
                        t(r[0]);
                        break;
                      case 2:
                        t(r[0], r[1]);
                        break;
                      case 3:
                        t(r[0], r[1], r[2]);
                        break;
                      default:
                        t.apply(n, r);
                    }
                  }(t);
                } finally {
                  f(e), u = !1;
                }
              }
            }
          }
          function d(e) {
            e.source === r && "string" == typeof e.data && 0 === e.data.indexOf(a) && c(+e.data.slice(a.length));
          }
        }("undefined" == typeof self ? void 0 === e ? this : e : self);
      }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }, {}]
  }, {}, [10])(10);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/buffer/index.js */ 26).Buffer, __webpack_require__(/*! ./../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/webpack/buildin/global.js */ 3), __webpack_require__(/*! ./../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/node-libs-browser/mock/process.js */ 79)))

/***/ }),
/* 79 */
/*!********************************************************!*\
  !*** ./node_modules/node-libs-browser/mock/process.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports.nextTick = function nextTick(fn) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    setTimeout(function () {
        fn.apply(null, args);
    }, 0);
};

exports.platform = exports.arch = 
exports.execPath = exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.env = {};
exports.argv = [];

exports.binding = function (name) {
	throw new Error('No such module. (Possibly not yet loaded)')
};

(function () {
    var cwd = '/';
    var path;
    exports.cwd = function () { return cwd };
    exports.chdir = function (dir) {
        if (!path) path = __webpack_require__(/*! path */ 80);
        cwd = path.resolve(dir, cwd);
    };
})();

exports.exit = exports.kill = 
exports.umask = exports.dlopen = 
exports.uptime = exports.memoryUsage = 
exports.uvCounters = function() {};
exports.features = {};


/***/ }),
/* 80 */
/*!***********************************************!*\
  !*** ./node_modules/path-browserify/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// .dirname, .basename, and .extname methods are extracted from Node.js v8.11.1,
// backported and transplited with Babel, with backwards-compat fixes

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function (path) {
  if (typeof path !== 'string') path = path + '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0);
  var hasRoot = code === 47 /*/*/;
  var end = -1;
  var matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i) {
    code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
      // We saw the first non-path separator
      matchedSlash = false;
    }
  }

  if (end === -1) return hasRoot ? '/' : '.';
  if (hasRoot && end === 1) {
    // return '//';
    // Backwards-compat fix:
    return '/';
  }
  return path.slice(0, end);
};

function basename(path) {
  if (typeof path !== 'string') path = path + '';

  var start = 0;
  var end = -1;
  var matchedSlash = true;
  var i;

  for (i = path.length - 1; i >= 0; --i) {
    if (path.charCodeAt(i) === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // path component
      matchedSlash = false;
      end = i + 1;
    }
  }

  if (end === -1) return '';
  return path.slice(start, end);
}

// Uses a mixed approach for backwards-compatibility, as ext behavior changed
// in new Node.js versions, so only basename() above is backported here
exports.basename = function (path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};

exports.extname = function (path) {
  if (typeof path !== 'string') path = path + '';
  var startDot = -1;
  var startPart = 0;
  var end = -1;
  var matchedSlash = true;
  // Track the state of characters (if any) we see before our first dot and
  // after any path separator we find
  var preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47 /*/*/) {
        // If we reached a path separator that was not part of a set of path
        // separators at the end of the string, stop now
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
    if (end === -1) {
      // We saw the first non-path separator, mark this as the end of our
      // extension
      matchedSlash = false;
      end = i + 1;
    }
    if (code === 46 /*.*/) {
        // If this is our first dot, mark it as the start of our extension
        if (startDot === -1)
          startDot = i;
        else if (preDotState !== 1)
          preDotState = 1;
    } else if (startDot !== -1) {
      // We saw a non-dot and non-path separator before our dot, so we should
      // have a good chance at having a non-empty extension
      preDotState = -1;
    }
  }

  if (startDot === -1 || end === -1 ||
      // We saw a non-dot character immediately before the dot
      preDotState === 0 ||
      // The (right-most) trimmed path component is exactly '..'
      preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return '';
  }
  return path.slice(startDot, end);
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node-libs-browser/mock/process.js */ 79)))

/***/ }),
/* 81 */
/*!**************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/utils/contract_template.json ***!
  \**************************************************************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 839, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 868, 869, 870, 871, 872, 873, 874, 875, 876, 877, 878, 879, 880, 881, 882, 883, 884, 885, 886, 887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899, 900, 901, 902, 903, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999, 1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035, 1036, 1037, 1038, 1039, 1040, 1041, 1042, 1043, 1044, 1045, 1046, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1059, 1060, 1061, 1062, 1063, 1064, 1065, 1066, 1067, 1068, 1069, 1070, 1071, 1072, 1073, 1074, 1075, 1076, 1077, 1078, 1079, 1080, 1081, 1082, 1083, 1084, 1085, 1086, 1087, 1088, 1089, 1090, 1091, 1092, 1093, 1094, 1095, 1096, 1097, 1098, 1099, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109, 1110, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120, 1121, 1122, 1123, 1124, 1125, 1126, 1127, 1128, 1129, 1130, 1131, 1132, 1133, 1134, 1135, 1136, 1137, 1138, 1139, 1140, 1141, 1142, 1143, 1144, 1145, 1146, 1147, 1148, 1149, 1150, 1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161, 1162, 1163, 1164, 1165, 1166, 1167, 1168, 1169, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189, 1190, 1191, 1192, 1193, 1194, 1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1224, 1225, 1226, 1227, 1228, 1229, 1230, 1231, 1232, 1233, 1234, 1235, 1236, 1237, 1238, 1239, 1240, 1241, 1242, 1243, 1244, 1245, 1246, 1247, 1248, 1249, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1259, 1260, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1271, 1272, 1273, 1274, 1275, 1276, 1277, 1278, 1279, 1280, 1281, 1282, 1283, 1284, 1285, 1286, 1287, 1288, 1289, 1290, 1291, 1292, 1293, 1294, 1295, 1296, 1297, 1298, 1299, 1300, 1301, 1302, 1303, 1304, 1305, 1306, 1307, 1308, 1309, 1310, 1311, 1312, 1313, 1314, 1315, 1316, 1317, 1318, 1319, 1320, 1321, 1322, 1323, 1324, 1325, 1326, 1327, 1328, 1329, 1330, 1331, 1332, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 1349, 1350, 1351, 1352, 1353, 1354, 1355, 1356, 1357, 1358, 1359, 1360, 1361, 1362, 1363, 1364, 1365, 1366, 1367, 1368, 1369, 1370, 1371, 1372, 1373, 1374, 1375, 1376, 1377, 1378, 1379, 1380, 1381, 1382, 1383, 1384, 1385, 1386, 1387, 1388, 1389, 1390, 1391, 1392, 1393, 1394, 1395, 1396, 1397, 1398, 1399, 1400, 1401, 1402, 1403, 1404, 1405, 1406, 1407, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415, 1416, 1417, 1418, 1419, 1420, 1421, 1422, 1423, 1424, 1425, 1426, 1427, 1428, 1429, 1430, 1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438, 1439, 1440, 1441, 1442, 1443, 1444, 1445, 1446, 1447, 1448, 1449, 1450, 1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458, 1459, 1460, 1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469, 1470, 1471, 1472, 1473, 1474, 1475, 1476, 1477, 1478, 1479, 1480, 1481, 1482, 1483, 1484, 1485, 1486, 1487, 1488, 1489, 1490, 1491, 1492, 1493, 1494, 1495, 1496, 1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511, 1512, 1513, 1514, 1515, 1516, 1517, 1518, 1519, 1520, 1521, 1522, 1523, 1524, 1525, 1526, 1527, 1528, 1529, 1530, 1531, 1532, 1533, 1534, 1535, 1536, 1537, 1538, 1539, 1540, 1541, 1542, 1543, 1544, 1545, 1546, 1547, 1548, 1549, 1550, 1551, 1552, 1553, 1554, 1555, 1556, 1557, 1558, 1559, 1560, 1561, 1562, 1563, 1564, 1565, 1566, 1567, 1568, 1569, 1570, 1571, 1572, 1573, 1574, 1575, 1576, 1577, 1578, 1579, 1580, 1581, 1582, 1583, 1584, 1585, 1586, 1587, 1588, 1589, 1590, 1591, 1592, 1593, 1594, 1595, 1596, 1597, 1598, 1599, 1600, 1601, 1602, 1603, 1604, 1605, 1606, 1607, 1608, 1609, 1610, 1611, 1612, 1613, 1614, 1615, 1616, 1617, 1618, 1619, 1620, 1621, 1622, 1623, 1624, 1625, 1626, 1627, 1628, 1629, 1630, 1631, 1632, 1633, 1634, 1635, 1636, 1637, 1638, 1639, 1640, 1641, 1642, 1643, 1644, 1645, 1646, 1647, 1648, 1649, 1650, 1651, 1652, 1653, 1654, 1655, 1656, 1657, 1658, 1659, 1660, 1661, 1662, 1663, 1664, 1665, 1666, 1667, 1668, 1669, 1670, 1671, 1672, 1673, 1674, 1675, 1676, 1677, 1678, 1679, 1680, 1681, 1682, 1683, 1684, 1685, 1686, 1687, 1688, 1689, 1690, 1691, 1692, 1693, 1694, 1695, 1696, 1697, 1698, 1699, 1700, 1701, 1702, 1703, 1704, 1705, 1706, 1707, 1708, 1709, 1710, 1711, 1712, 1713, 1714, 1715, 1716, 1717, 1718, 1719, 1720, 1721, 1722, 1723, 1724, 1725, 1726, 1727, 1728, 1729, 1730, 1731, 1732, 1733, 1734, 1735, 1736, 1737, 1738, 1739, 1740, 1741, 1742, 1743, 1744, 1745, 1746, 1747, 1748, 1749, 1750, 1751, 1752, 1753, 1754, 1755, 1756, 1757, 1758, 1759, 1760, 1761, 1762, 1763, 1764, 1765, 1766, 1767, 1768, 1769, 1770, 1771, 1772, 1773, 1774, 1775, 1776, 1777, 1778, 1779, 1780, 1781, 1782, 1783, 1784, 1785, 1786, 1787, 1788, 1789, 1790, 1791, 1792, 1793, 1794, 1795, 1796, 1797, 1798, 1799, 1800, 1801, 1802, 1803, 1804, 1805, 1806, 1807, 1808, 1809, 1810, 1811, 1812, 1813, 1814, 1815, 1816, 1817, 1818, 1819, 1820, 1821, 1822, 1823, 1824, 1825, 1826, 1827, 1828, 1829, 1830, 1831, 1832, 1833, 1834, 1835, 1836, 1837, 1838, 1839, 1840, 1841, 1842, 1843, 1844, 1845, 1846, 1847, 1848, 1849, 1850, 1851, 1852, 1853, 1854, 1855, 1856, 1857, 1858, 1859, 1860, 1861, 1862, 1863, 1864, 1865, 1866, 1867, 1868, 1869, 1870, 1871, 1872, 1873, 1874, 1875, 1876, 1877, 1878, 1879, 1880, 1881, 1882, 1883, 1884, 1885, 1886, 1887, 1888, 1889, 1890, 1891, 1892, 1893, 1894, 1895, 1896, 1897, 1898, 1899, 1900, 1901, 1902, 1903, 1904, 1905, 1906, 1907, 1908, 1909, 1910, 1911, 1912, 1913, 1914, 1915, 1916, 1917, 1918, 1919, 1920, 1921, 1922, 1923, 1924, 1925, 1926, 1927, 1928, 1929, 1930, 1931, 1932, 1933, 1934, 1935, 1936, 1937, 1938, 1939, 1940, 1941, 1942, 1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950, 1951, 1952, 1953, 1954, 1955, 1956, 1957, 1958, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050, 2051, 2052, 2053, 2054, 2055, 2056, 2057, 2058, 2059, 2060, 2061, 2062, 2063, 2064, 2065, 2066, 2067, 2068, 2069, 2070, 2071, 2072, 2073, 2074, 2075, 2076, 2077, 2078, 2079, 2080, 2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 2090, 2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2100, 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109, 2110, 2111, 2112, 2113, 2114, 2115, 2116, 2117, 2118, 2119, 2120, 2121, 2122, 2123, 2124, 2125, 2126, 2127, 2128, 2129, 2130, 2131, 2132, 2133, 2134, 2135, 2136, 2137, 2138, 2139, 2140, 2141, 2142, 2143, 2144, 2145, 2146, 2147, 2148, 2149, 2150, 2151, 2152, 2153, 2154, 2155, 2156, 2157, 2158, 2159, 2160, 2161, 2162, 2163, 2164, 2165, 2166, 2167, 2168, 2169, 2170, 2171, 2172, 2173, 2174, 2175, 2176, 2177, 2178, 2179, 2180, 2181, 2182, 2183, 2184, 2185, 2186, 2187, 2188, 2189, 2190, 2191, 2192, 2193, 2194, 2195, 2196, 2197, 2198, 2199, 2200, 2201, 2202, 2203, 2204, 2205, 2206, 2207, 2208, 2209, 2210, 2211, 2212, 2213, 2214, 2215, 2216, 2217, 2218, 2219, 2220, 2221, 2222, 2223, 2224, 2225, 2226, 2227, 2228, 2229, 2230, 2231, 2232, 2233, 2234, 2235, 2236, 2237, 2238, 2239, 2240, 2241, 2242, 2243, 2244, 2245, 2246, 2247, 2248, 2249, 2250, 2251, 2252, 2253, 2254, 2255, 2256, 2257, 2258, 2259, 2260, 2261, 2262, 2263, 2264, 2265, 2266, 2267, 2268, 2269, 2270, 2271, 2272, 2273, 2274, 2275, 2276, 2277, 2278, 2279, 2280, 2281, 2282, 2283, 2284, 2285, 2286, 2287, 2288, 2289, 2290, 2291, 2292, 2293, 2294, 2295, 2296, 2297, 2298, 2299, 2300, 2301, 2302, 2303, 2304, 2305, 2306, 2307, 2308, 2309, 2310, 2311, 2312, 2313, 2314, 2315, 2316, 2317, 2318, 2319, 2320, 2321, 2322, 2323, 2324, 2325, 2326, 2327, 2328, 2329, 2330, 2331, 2332, 2333, 2334, 2335, 2336, 2337, 2338, 2339, 2340, 2341, 2342, 2343, 2344, 2345, 2346, 2347, 2348, 2349, 2350, 2351, 2352, 2353, 2354, 2355, 2356, 2357, 2358, 2359, 2360, 2361, 2362, 2363, 2364, 2365, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2384, 2385, 2386, 2387, 2388, 2389, 2390, 2391, 2392, 2393, 2394, 2395, 2396, 2397, 2398, 2399, 2400, 2401, 2402, 2403, 2404, 2405, 2406, 2407, 2408, 2409, 2410, 2411, 2412, 2413, 2414, 2415, 2416, 2417, 2418, 2419, 2420, 2421, 2422, 2423, 2424, 2425, 2426, 2427, 2428, 2429, 2430, 2431, 2432, 2433, 2434, 2435, 2436, 2437, 2438, 2439, 2440, 2441, 2442, 2443, 2444, 2445, 2446, 2447, 2448, 2449, 2450, 2451, 2452, 2453, 2454, 2455, 2456, 2457, 2458, 2459, 2460, 2461, 2462, 2463, 2464, 2465, 2466, 2467, 2468, 2469, 2470, 2471, 2472, 2473, 2474, 2475, 2476, 2477, 2478, 2479, 2480, 2481, 2482, 2483, 2484, 2485, 2486, 2487, 2488, 2489, 2490, 2491, 2492, 2493, 2494, 2495, 2496, 2497, 2498, 2499, 2500, 2501, 2502, 2503, 2504, 2505, 2506, 2507, 2508, 2509, 2510, 2511, 2512, 2513, 2514, 2515, 2516, 2517, 2518, 2519, 2520, 2521, 2522, 2523, 2524, 2525, 2526, 2527, 2528, 2529, 2530, 2531, 2532, 2533, 2534, 2535, 2536, 2537, 2538, 2539, 2540, 2541, 2542, 2543, 2544, 2545, 2546, 2547, 2548, 2549, 2550, 2551, 2552, 2553, 2554, 2555, 2556, 2557, 2558, 2559, 2560, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2568, 2569, 2570, 2571, 2572, 2573, 2574, 2575, 2576, 2577, 2578, 2579, 2580, 2581, 2582, 2583, 2584, 2585, 2586, 2587, 2588, 2589, 2590, 2591, 2592, 2593, 2594, 2595, 2596, 2597, 2598, 2599, 2600, 2601, 2602, 2603, 2604, 2605, 2606, 2607, 2608, 2609, 2610, 2611, 2612, 2613, 2614, 2615, 2616, 2617, 2618, 2619, 2620, 2621, 2622, 2623, 2624, 2625, 2626, 2627, 2628, 2629, 2630, 2631, 2632, 2633, 2634, 2635, 2636, 2637, 2638, 2639, 2640, 2641, 2642, 2643, 2644, 2645, 2646, 2647, 2648, 2649, 2650, 2651, 2652, 2653, 2654, 2655, 2656, 2657, 2658, 2659, 2660, 2661, 2662, 2663, 2664, 2665, 2666, 2667, 2668, 2669, 2670, 2671, 2672, 2673, 2674, 2675, 2676, 2677, 2678, 2679, 2680, 2681, 2682, 2683, 2684, 2685, 2686, 2687, 2688, 2689, 2690, 2691, 2692, 2693, 2694, 2695, 2696, 2697, 2698, 2699, 2700, 2701, 2702, 2703, 2704, 2705, 2706, 2707, 2708, 2709, 2710, 2711, 2712, 2713, 2714, 2715, 2716, 2717, 2718, 2719, 2720, 2721, 2722, 2723, 2724, 2725, 2726, 2727, 2728, 2729, 2730, 2731, 2732, 2733, 2734, 2735, 2736, 2737, 2738, 2739, 2740, 2741, 2742, 2743, 2744, 2745, 2746, 2747, 2748, 2749, 2750, 2751, 2752, 2753, 2754, 2755, 2756, 2757, 2758, 2759, 2760, 2761, 2762, 2763, 2764, 2765, 2766, 2767, 2768, 2769, 2770, 2771, 2772, 2773, 2774, 2775, 2776, 2777, 2778, 2779, 2780, 2781, 2782, 2783, 2784, 2785, 2786, 2787, 2788, 2789, 2790, 2791, 2792, 2793, 2794, 2795, 2796, 2797, 2798, 2799, 2800, 2801, 2802, 2803, 2804, 2805, 2806, 2807, 2808, 2809, 2810, 2811, 2812, 2813, 2814, 2815, 2816, 2817, 2818, 2819, 2820, 2821, 2822, 2823, 2824, 2825, 2826, 2827, 2828, 2829, 2830, 2831, 2832, 2833, 2834, 2835, 2836, 2837, 2838, 2839, 2840, 2841, 2842, 2843, 2844, 2845, 2846, 2847, 2848, 2849, 2850, 2851, 2852, 2853, 2854, 2855, 2856, 2857, 2858, 2859, 2860, 2861, 2862, 2863, 2864, 2865, 2866, 2867, 2868, 2869, 2870, 2871, 2872, 2873, 2874, 2875, 2876, 2877, 2878, 2879, 2880, 2881, 2882, 2883, 2884, 2885, 2886, 2887, 2888, 2889, 2890, 2891, 2892, 2893, 2894, 2895, 2896, 2897, 2898, 2899, 2900, 2901, 2902, 2903, 2904, 2905, 2906, 2907, 2908, 2909, 2910, 2911, 2912, 2913, 2914, 2915, 2916, 2917, 2918, 2919, 2920, 2921, 2922, 2923, 2924, 2925, 2926, 2927, 2928, 2929, 2930, 2931, 2932, 2933, 2934, 2935, 2936, 2937, 2938, 2939, 2940, 2941, 2942, 2943, 2944, 2945, 2946, 2947, 2948, 2949, 2950, 2951, 2952, 2953, 2954, 2955, 2956, 2957, 2958, 2959, 2960, 2961, 2962, 2963, 2964, 2965, 2966, 2967, 2968, 2969, 2970, 2971, 2972, 2973, 2974, 2975, 2976, 2977, 2978, 2979, 2980, 2981, 2982, 2983, 2984, 2985, 2986, 2987, 2988, 2989, 2990, 2991, 2992, 2993, 2994, 2995, 2996, 2997, 2998, 2999, 3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3011, 3012, 3013, 3014, 3015, 3016, 3017, 3018, 3019, 3020, 3021, 3022, 3023, 3024, 3025, 3026, 3027, 3028, 3029, 3030, 3031, 3032, 3033, 3034, 3035, 3036, 3037, 3038, 3039, 3040, 3041, 3042, 3043, 3044, 3045, 3046, 3047, 3048, 3049, 3050, 3051, 3052, 3053, 3054, 3055, 3056, 3057, 3058, 3059, 3060, 3061, 3062, 3063, 3064, 3065, 3066, 3067, 3068, 3069, 3070, 3071, 3072, 3073, 3074, 3075, 3076, 3077, 3078, 3079, 3080, 3081, 3082, 3083, 3084, 3085, 3086, 3087, 3088, 3089, 3090, 3091, 3092, 3093, 3094, 3095, 3096, 3097, 3098, 3099, 3100, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109, 3110, 3111, 3112, 3113, 3114, 3115, 3116, 3117, 3118, 3119, 3120, 3121, 3122, 3123, 3124, 3125, 3126, 3127, 3128, 3129, 3130, 3131, 3132, 3133, 3134, 3135, 3136, 3137, 3138, 3139, 3140, 3141, 3142, 3143, 3144, 3145, 3146, 3147, 3148, 3149, 3150, 3151, 3152, 3153, 3154, 3155, 3156, 3157, 3158, 3159, 3160, 3161, 3162, 3163, 3164, 3165, 3166, 3167, 3168, 3169, 3170, 3171, 3172, 3173, 3174, 3175, 3176, 3177, 3178, 3179, 3180, 3181, 3182, 3183, 3184, 3185, 3186, 3187, 3188, 3189, 3190, 3191, 3192, 3193, 3194, 3195, 3196, 3197, 3198, 3199, 3200, 3201, 3202, 3203, 3204, 3205, 3206, 3207, 3208, 3209, 3210, 3211, 3212, 3213, 3214, 3215, 3216, 3217, 3218, 3219, 3220, 3221, 3222, 3223, 3224, 3225, 3226, 3227, 3228, 3229, 3230, 3231, 3232, 3233, 3234, 3235, 3236, 3237, 3238, 3239, 3240, 3241, 3242, 3243, 3244, 3245, 3246, 3247, 3248, 3249, 3250, 3251, 3252, 3253, 3254, 3255, 3256, 3257, 3258, 3259, 3260, 3261, 3262, 3263, 3264, 3265, 3266, 3267, 3268, 3269, 3270, 3271, 3272, 3273, 3274, 3275, 3276, 3277, 3278, 3279, 3280, 3281, 3282, 3283, 3284, 3285, 3286, 3287, 3288, 3289, 3290, 3291, 3292, 3293, 3294, 3295, 3296, 3297, 3298, 3299, 3300, 3301, 3302, 3303, 3304, 3305, 3306, 3307, 3308, 3309, 3310, 3311, 3312, 3313, 3314, 3315, 3316, 3317, 3318, 3319, 3320, 3321, 3322, 3323, 3324, 3325, 3326, 3327, 3328, 3329, 3330, 3331, 3332, 3333, 3334, 3335, 3336, 3337, 3338, 3339, 3340, 3341, 3342, 3343, 3344, 3345, 3346, 3347, 3348, 3349, 3350, 3351, 3352, 3353, 3354, 3355, 3356, 3357, 3358, 3359, 3360, 3361, 3362, 3363, 3364, 3365, 3366, 3367, 3368, 3369, 3370, 3371, 3372, 3373, 3374, 3375, 3376, 3377, 3378, 3379, 3380, 3381, 3382, 3383, 3384, 3385, 3386, 3387, 3388, 3389, 3390, 3391, 3392, 3393, 3394, 3395, 3396, 3397, 3398, 3399, 3400, 3401, 3402, 3403, 3404, 3405, 3406, 3407, 3408, 3409, 3410, 3411, 3412, 3413, 3414, 3415, 3416, 3417, 3418, 3419, 3420, 3421, 3422, 3423, 3424, 3425, 3426, 3427, 3428, 3429, 3430, 3431, 3432, 3433, 3434, 3435, 3436, 3437, 3438, 3439, 3440, 3441, 3442, 3443, 3444, 3445, 3446, 3447, 3448, 3449, 3450, 3451, 3452, 3453, 3454, 3455, 3456, 3457, 3458, 3459, 3460, 3461, 3462, 3463, 3464, 3465, 3466, 3467, 3468, 3469, 3470, 3471, 3472, 3473, 3474, 3475, 3476, 3477, 3478, 3479, 3480, 3481, 3482, 3483, 3484, 3485, 3486, 3487, 3488, 3489, 3490, 3491, 3492, 3493, 3494, 3495, 3496, 3497, 3498, 3499, 3500, 3501, 3502, 3503, 3504, 3505, 3506, 3507, 3508, 3509, 3510, 3511, 3512, 3513, 3514, 3515, 3516, 3517, 3518, 3519, 3520, 3521, 3522, 3523, 3524, 3525, 3526, 3527, 3528, 3529, 3530, 3531, 3532, 3533, 3534, 3535, 3536, 3537, 3538, 3539, 3540, 3541, 3542, 3543, 3544, 3545, 3546, 3547, 3548, 3549, 3550, 3551, 3552, 3553, 3554, 3555, 3556, 3557, 3558, 3559, 3560, 3561, 3562, 3563, 3564, 3565, 3566, 3567, 3568, 3569, 3570, 3571, 3572, 3573, 3574, 3575, 3576, 3577, 3578, 3579, 3580, 3581, 3582, 3583, 3584, 3585, 3586, 3587, 3588, 3589, 3590, 3591, 3592, 3593, 3594, 3595, 3596, 3597, 3598, 3599, 3600, 3601, 3602, 3603, 3604, 3605, 3606, 3607, 3608, 3609, 3610, 3611, 3612, 3613, 3614, 3615, 3616, 3617, 3618, 3619, 3620, 3621, 3622, 3623, 3624, 3625, 3626, 3627, 3628, 3629, 3630, 3631, 3632, 3633, 3634, 3635, 3636, 3637, 3638, 3639, 3640, 3641, 3642, 3643, 3644, 3645, 3646, 3647, 3648, 3649, 3650, 3651, 3652, 3653, 3654, 3655, 3656, 3657, 3658, 3659, 3660, 3661, 3662, 3663, 3664, 3665, 3666, 3667, 3668, 3669, 3670, 3671, 3672, 3673, 3674, 3675, 3676, 3677, 3678, 3679, 3680, 3681, 3682, 3683, 3684, 3685, 3686, 3687, 3688, 3689, 3690, 3691, 3692, 3693, 3694, 3695, 3696, 3697, 3698, 3699, 3700, 3701, 3702, 3703, 3704, 3705, 3706, 3707, 3708, 3709, 3710, 3711, 3712, 3713, 3714, 3715, 3716, 3717, 3718, 3719, 3720, 3721, 3722, 3723, 3724, 3725, 3726, 3727, 3728, 3729, 3730, 3731, 3732, 3733, 3734, 3735, 3736, 3737, 3738, 3739, 3740, 3741, 3742, 3743, 3744, 3745, 3746, 3747, 3748, 3749, 3750, 3751, 3752, 3753, 3754, 3755, 3756, 3757, 3758, 3759, 3760, 3761, 3762, 3763, 3764, 3765, 3766, 3767, 3768, 3769, 3770, 3771, 3772, 3773, 3774, 3775, 3776, 3777, 3778, 3779, 3780, 3781, 3782, 3783, 3784, 3785, 3786, 3787, 3788, 3789, 3790, 3791, 3792, 3793, 3794, 3795, 3796, 3797, 3798, 3799, 3800, 3801, 3802, 3803, 3804, 3805, 3806, 3807, 3808, 3809, 3810, 3811, 3812, 3813, 3814, 3815, 3816, 3817, 3818, 3819, 3820, 3821, 3822, 3823, 3824, 3825, 3826, 3827, 3828, 3829, 3830, 3831, 3832, 3833, 3834, 3835, 3836, 3837, 3838, 3839, 3840, 3841, 3842, 3843, 3844, 3845, 3846, 3847, 3848, 3849, 3850, 3851, 3852, 3853, 3854, 3855, 3856, 3857, 3858, 3859, 3860, 3861, 3862, 3863, 3864, 3865, 3866, 3867, 3868, 3869, 3870, 3871, 3872, 3873, 3874, 3875, 3876, 3877, 3878, 3879, 3880, 3881, 3882, 3883, 3884, 3885, 3886, 3887, 3888, 3889, 3890, 3891, 3892, 3893, 3894, 3895, 3896, 3897, 3898, 3899, 3900, 3901, 3902, 3903, 3904, 3905, 3906, 3907, 3908, 3909, 3910, 3911, 3912, 3913, 3914, 3915, 3916, 3917, 3918, 3919, 3920, 3921, 3922, 3923, 3924, 3925, 3926, 3927, 3928, 3929, 3930, 3931, 3932, 3933, 3934, 3935, 3936, 3937, 3938, 3939, 3940, 3941, 3942, 3943, 3944, 3945, 3946, 3947, 3948, 3949, 3950, 3951, 3952, 3953, 3954, 3955, 3956, 3957, 3958, 3959, 3960, 3961, 3962, 3963, 3964, 3965, 3966, 3967, 3968, 3969, 3970, 3971, 3972, 3973, 3974, 3975, 3976, 3977, 3978, 3979, 3980, 3981, 3982, 3983, 3984, 3985, 3986, 3987, 3988, 3989, 3990, 3991, 3992, 3993, 3994, 3995, 3996, 3997, 3998, 3999, 4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4011, 4012, 4013, 4014, 4015, 4016, 4017, 4018, 4019, 4020, 4021, 4022, 4023, 4024, 4025, 4026, 4027, 4028, 4029, 4030, 4031, 4032, 4033, 4034, 4035, 4036, 4037, 4038, 4039, 4040, 4041, 4042, 4043, 4044, 4045, 4046, 4047, 4048, 4049, 4050, 4051, 4052, 4053, 4054, 4055, 4056, 4057, 4058, 4059, 4060, 4061, 4062, 4063, 4064, 4065, 4066, 4067, 4068, 4069, 4070, 4071, 4072, 4073, 4074, 4075, 4076, 4077, 4078, 4079, 4080, 4081, 4082, 4083, 4084, 4085, 4086, 4087, 4088, 4089, 4090, 4091, 4092, 4093, 4094, 4095, 4096, 4097, 4098, 4099, 4100, 4101, 4102, 4103, 4104, 4105, 4106, 4107, 4108, 4109, 4110, 4111, 4112, 4113, 4114, 4115, 4116, 4117, 4118, 4119, 4120, 4121, 4122, 4123, 4124, 4125, 4126, 4127, 4128, 4129, 4130, 4131, 4132, 4133, 4134, 4135, 4136, 4137, 4138, 4139, 4140, 4141, 4142, 4143, 4144, 4145, 4146, 4147, 4148, 4149, 4150, 4151, 4152, 4153, 4154, 4155, 4156, 4157, 4158, 4159, 4160, 4161, 4162, 4163, 4164, 4165, 4166, 4167, 4168, 4169, 4170, 4171, 4172, 4173, 4174, 4175, 4176, 4177, 4178, 4179, 4180, 4181, 4182, 4183, 4184, 4185, 4186, 4187, 4188, 4189, 4190, 4191, 4192, 4193, 4194, 4195, 4196, 4197, 4198, 4199, 4200, 4201, 4202, 4203, 4204, 4205, 4206, 4207, 4208, 4209, 4210, 4211, 4212, 4213, 4214, 4215, 4216, 4217, 4218, 4219, 4220, 4221, 4222, 4223, 4224, 4225, 4226, 4227, 4228, 4229, 4230, 4231, 4232, 4233, 4234, 4235, 4236, 4237, 4238, 4239, 4240, 4241, 4242, 4243, 4244, 4245, 4246, 4247, 4248, 4249, 4250, 4251, 4252, 4253, 4254, 4255, 4256, 4257, 4258, 4259, 4260, 4261, 4262, 4263, 4264, 4265, 4266, 4267, 4268, 4269, 4270, 4271, 4272, 4273, 4274, 4275, 4276, 4277, 4278, 4279, 4280, 4281, 4282, 4283, 4284, 4285, 4286, 4287, 4288, 4289, 4290, 4291, 4292, 4293, 4294, 4295, 4296, 4297, 4298, 4299, 4300, 4301, 4302, 4303, 4304, 4305, 4306, 4307, 4308, 4309, 4310, 4311, 4312, 4313, 4314, 4315, 4316, 4317, 4318, 4319, 4320, 4321, 4322, 4323, 4324, 4325, 4326, 4327, 4328, 4329, 4330, 4331, 4332, 4333, 4334, 4335, 4336, 4337, 4338, 4339, 4340, 4341, 4342, 4343, 4344, 4345, 4346, 4347, 4348, 4349, 4350, 4351, 4352, 4353, 4354, 4355, 4356, 4357, 4358, 4359, 4360, 4361, 4362, 4363, 4364, 4365, 4366, 4367, 4368, 4369, 4370, 4371, 4372, 4373, 4374, 4375, 4376, 4377, 4378, 4379, 4380, 4381, 4382, 4383, 4384, 4385, 4386, 4387, 4388, 4389, 4390, 4391, 4392, 4393, 4394, 4395, 4396, 4397, 4398, 4399, 4400, 4401, 4402, 4403, 4404, 4405, 4406, 4407, 4408, 4409, 4410, 4411, 4412, 4413, 4414, 4415, 4416, 4417, 4418, 4419, 4420, 4421, 4422, 4423, 4424, 4425, 4426, 4427, 4428, 4429, 4430, 4431, 4432, 4433, 4434, 4435, 4436, 4437, 4438, 4439, 4440, 4441, 4442, 4443, 4444, 4445, 4446, 4447, 4448, 4449, 4450, 4451, 4452, 4453, 4454, 4455, 4456, 4457, 4458, 4459, 4460, 4461, 4462, 4463, 4464, 4465, 4466, 4467, 4468, 4469, 4470, 4471, 4472, 4473, 4474, 4475, 4476, 4477, 4478, 4479, 4480, 4481, 4482, 4483, 4484, 4485, 4486, 4487, 4488, 4489, 4490, 4491, 4492, 4493, 4494, 4495, 4496, 4497, 4498, 4499, 4500, 4501, 4502, 4503, 4504, 4505, 4506, 4507, 4508, 4509, 4510, 4511, 4512, 4513, 4514, 4515, 4516, 4517, 4518, 4519, 4520, 4521, 4522, 4523, 4524, 4525, 4526, 4527, 4528, 4529, 4530, 4531, 4532, 4533, 4534, 4535, 4536, 4537, 4538, 4539, 4540, 4541, 4542, 4543, 4544, 4545, 4546, 4547, 4548, 4549, 4550, 4551, 4552, 4553, 4554, 4555, 4556, 4557, 4558, 4559, 4560, 4561, 4562, 4563, 4564, 4565, 4566, 4567, 4568, 4569, 4570, 4571, 4572, 4573, 4574, 4575, 4576, 4577, 4578, 4579, 4580, 4581, 4582, 4583, 4584, 4585, 4586, 4587, 4588, 4589, 4590, 4591, 4592, 4593, 4594, 4595, 4596, 4597, 4598, 4599, 4600, 4601, 4602, 4603, 4604, 4605, 4606, 4607, 4608, 4609, 4610, 4611, 4612, 4613, 4614, 4615, 4616, 4617, 4618, 4619, 4620, 4621, 4622, 4623, 4624, 4625, 4626, 4627, 4628, 4629, 4630, 4631, 4632, 4633, 4634, 4635, 4636, 4637, 4638, 4639, 4640, 4641, 4642, 4643, 4644, 4645, 4646, 4647, 4648, 4649, 4650, 4651, 4652, 4653, 4654, 4655, 4656, 4657, 4658, 4659, 4660, 4661, 4662, 4663, 4664, 4665, 4666, 4667, 4668, 4669, 4670, 4671, 4672, 4673, 4674, 4675, 4676, 4677, 4678, 4679, 4680, 4681, 4682, 4683, 4684, 4685, 4686, 4687, 4688, 4689, 4690, 4691, 4692, 4693, 4694, 4695, 4696, 4697, 4698, 4699, 4700, 4701, 4702, 4703, 4704, 4705, 4706, 4707, 4708, 4709, 4710, 4711, 4712, 4713, 4714, 4715, 4716, 4717, 4718, 4719, 4720, 4721, 4722, 4723, 4724, 4725, 4726, 4727, 4728, 4729, 4730, 4731, 4732, 4733, 4734, 4735, 4736, 4737, 4738, 4739, 4740, 4741, 4742, 4743, 4744, 4745, 4746, 4747, 4748, 4749, 4750, 4751, 4752, 4753, 4754, 4755, 4756, 4757, 4758, 4759, 4760, 4761, 4762, 4763, 4764, 4765, 4766, 4767, 4768, 4769, 4770, 4771, 4772, 4773, 4774, 4775, 4776, 4777, 4778, 4779, 4780, 4781, 4782, 4783, 4784, 4785, 4786, 4787, 4788, 4789, 4790, 4791, 4792, 4793, 4794, 4795, 4796, 4797, 4798, 4799, 4800, 4801, 4802, 4803, 4804, 4805, 4806, 4807, 4808, 4809, 4810, 4811, 4812, 4813, 4814, 4815, 4816, 4817, 4818, 4819, 4820, 4821, 4822, 4823, 4824, 4825, 4826, 4827, 4828, 4829, 4830, 4831, 4832, 4833, 4834, 4835, 4836, 4837, 4838, 4839, 4840, 4841, 4842, 4843, 4844, 4845, 4846, 4847, 4848, 4849, 4850, 4851, 4852, 4853, 4854, 4855, 4856, 4857, 4858, 4859, 4860, 4861, 4862, 4863, 4864, 4865, 4866, 4867, 4868, 4869, 4870, 4871, 4872, 4873, 4874, 4875, 4876, 4877, 4878, 4879, 4880, 4881, 4882, 4883, 4884, 4885, 4886, 4887, 4888, 4889, 4890, 4891, 4892, 4893, 4894, 4895, 4896, 4897, 4898, 4899, 4900, 4901, 4902, 4903, 4904, 4905, 4906, 4907, 4908, 4909, 4910, 4911, 4912, 4913, 4914, 4915, 4916, 4917, 4918, 4919, 4920, 4921, 4922, 4923, 4924, 4925, 4926, 4927, 4928, 4929, 4930, 4931, 4932, 4933, 4934, 4935, 4936, 4937, 4938, 4939, 4940, 4941, 4942, 4943, 4944, 4945, 4946, 4947, 4948, 4949, 4950, 4951, 4952, 4953, 4954, 4955, 4956, 4957, 4958, 4959, 4960, 4961, 4962, 4963, 4964, 4965, 4966, 4967, 4968, 4969, 4970, 4971, 4972, 4973, 4974, 4975, 4976, 4977, 4978, 4979, 4980, 4981, 4982, 4983, 4984, 4985, 4986, 4987, 4988, 4989, 4990, 4991, 4992, 4993, 4994, 4995, 4996, 4997, 4998, 4999, 5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008, 5009, 5010, 5011, 5012, 5013, 5014, 5015, 5016, 5017, 5018, 5019, 5020, 5021, 5022, 5023, 5024, 5025, 5026, 5027, 5028, 5029, 5030, 5031, 5032, 5033, 5034, 5035, 5036, 5037, 5038, 5039, 5040, 5041, 5042, 5043, 5044, 5045, 5046, 5047, 5048, 5049, 5050, 5051, 5052, 5053, 5054, 5055, 5056, 5057, 5058, 5059, 5060, 5061, 5062, 5063, 5064, 5065, 5066, 5067, 5068, 5069, 5070, 5071, 5072, 5073, 5074, 5075, 5076, 5077, 5078, 5079, 5080, 5081, 5082, 5083, 5084, 5085, 5086, 5087, 5088, 5089, 5090, 5091, 5092, 5093, 5094, 5095, 5096, 5097, 5098, 5099, 5100, 5101, 5102, 5103, 5104, 5105, 5106, 5107, 5108, 5109, 5110, 5111, 5112, 5113, 5114, 5115, 5116, 5117, 5118, 5119, 5120, 5121, 5122, 5123, 5124, 5125, 5126, 5127, 5128, 5129, 5130, 5131, 5132, 5133, 5134, 5135, 5136, 5137, 5138, 5139, 5140, 5141, 5142, 5143, 5144, 5145, 5146, 5147, 5148, 5149, 5150, 5151, 5152, 5153, 5154, 5155, 5156, 5157, 5158, 5159, 5160, 5161, 5162, 5163, 5164, 5165, 5166, 5167, 5168, 5169, 5170, 5171, 5172, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180, 5181, 5182, 5183, 5184, 5185, 5186, 5187, 5188, 5189, 5190, 5191, 5192, 5193, 5194, 5195, 5196, 5197, 5198, 5199, 5200, 5201, 5202, 5203, 5204, 5205, 5206, 5207, 5208, 5209, 5210, 5211, 5212, 5213, 5214, 5215, 5216, 5217, 5218, 5219, 5220, 5221, 5222, 5223, 5224, 5225, 5226, 5227, 5228, 5229, 5230, 5231, 5232, 5233, 5234, 5235, 5236, 5237, 5238, 5239, 5240, 5241, 5242, 5243, 5244, 5245, 5246, 5247, 5248, 5249, 5250, 5251, 5252, 5253, 5254, 5255, 5256, 5257, 5258, 5259, 5260, 5261, 5262, 5263, 5264, 5265, 5266, 5267, 5268, 5269, 5270, 5271, 5272, 5273, 5274, 5275, 5276, 5277, 5278, 5279, 5280, 5281, 5282, 5283, 5284, 5285, 5286, 5287, 5288, 5289, 5290, 5291, 5292, 5293, 5294, 5295, 5296, 5297, 5298, 5299, 5300, 5301, 5302, 5303, 5304, 5305, 5306, 5307, 5308, 5309, 5310, 5311, 5312, 5313, 5314, 5315, 5316, 5317, 5318, 5319, 5320, 5321, 5322, 5323, 5324, 5325, 5326, 5327, 5328, 5329, 5330, 5331, 5332, 5333, 5334, 5335, 5336, 5337, 5338, 5339, 5340, 5341, 5342, 5343, 5344, 5345, 5346, 5347, 5348, 5349, 5350, 5351, 5352, 5353, 5354, 5355, 5356, 5357, 5358, 5359, 5360, 5361, 5362, 5363, 5364, 5365, 5366, 5367, 5368, 5369, 5370, 5371, 5372, 5373, 5374, 5375, 5376, 5377, 5378, 5379, 5380, 5381, 5382, 5383, 5384, 5385, 5386, 5387, 5388, 5389, 5390, 5391, 5392, 5393, 5394, 5395, 5396, 5397, 5398, 5399, 5400, 5401, 5402, 5403, 5404, 5405, 5406, 5407, 5408, 5409, 5410, 5411, 5412, 5413, 5414, 5415, 5416, 5417, 5418, 5419, 5420, 5421, 5422, 5423, 5424, 5425, 5426, 5427, 5428, 5429, 5430, 5431, 5432, 5433, 5434, 5435, 5436, 5437, 5438, 5439, 5440, 5441, 5442, 5443, 5444, 5445, 5446, 5447, 5448, 5449, 5450, 5451, 5452, 5453, 5454, 5455, 5456, 5457, 5458, 5459, 5460, 5461, 5462, 5463, 5464, 5465, 5466, 5467, 5468, 5469, 5470, 5471, 5472, 5473, 5474, 5475, 5476, 5477, 5478, 5479, 5480, 5481, 5482, 5483, 5484, 5485, 5486, 5487, 5488, 5489, 5490, 5491, 5492, 5493, 5494, 5495, 5496, 5497, 5498, 5499, 5500, 5501, 5502, 5503, 5504, 5505, 5506, 5507, 5508, 5509, 5510, 5511, 5512, 5513, 5514, 5515, 5516, 5517, 5518, 5519, 5520, 5521, 5522, 5523, 5524, 5525, 5526, 5527, 5528, 5529, 5530, 5531, 5532, 5533, 5534, 5535, 5536, 5537, 5538, 5539, 5540, 5541, 5542, 5543, 5544, 5545, 5546, 5547, 5548, 5549, 5550, 5551, 5552, 5553, 5554, 5555, 5556, 5557, 5558, 5559, 5560, 5561, 5562, 5563, 5564, 5565, 5566, 5567, 5568, 5569, 5570, 5571, 5572, 5573, 5574, 5575, 5576, 5577, 5578, 5579, 5580, 5581, 5582, 5583, 5584, 5585, 5586, 5587, 5588, 5589, 5590, 5591, 5592, 5593, 5594, 5595, 5596, 5597, 5598, 5599, 5600, 5601, 5602, 5603, 5604, 5605, 5606, 5607, 5608, 5609, 5610, 5611, 5612, 5613, 5614, 5615, 5616, 5617, 5618, 5619, 5620, 5621, 5622, 5623, 5624, 5625, 5626, 5627, 5628, 5629, 5630, 5631, 5632, 5633, 5634, 5635, 5636, 5637, 5638, 5639, 5640, 5641, 5642, 5643, 5644, 5645, 5646, 5647, 5648, 5649, 5650, 5651, 5652, 5653, 5654, 5655, 5656, 5657, 5658, 5659, 5660, 5661, 5662, 5663, 5664, 5665, 5666, 5667, 5668, 5669, 5670, 5671, 5672, 5673, 5674, 5675, 5676, 5677, 5678, 5679, 5680, 5681, 5682, 5683, 5684, 5685, 5686, 5687, 5688, 5689, 5690, 5691, 5692, 5693, 5694, 5695, 5696, 5697, 5698, 5699, 5700, 5701, 5702, 5703, 5704, 5705, 5706, 5707, 5708, 5709, 5710, 5711, 5712, 5713, 5714, 5715, 5716, 5717, 5718, 5719, 5720, 5721, 5722, 5723, 5724, 5725, 5726, 5727, 5728, 5729, 5730, 5731, 5732, 5733, 5734, 5735, 5736, 5737, 5738, 5739, 5740, 5741, 5742, 5743, 5744, 5745, 5746, 5747, 5748, 5749, 5750, 5751, 5752, 5753, 5754, 5755, 5756, 5757, 5758, 5759, 5760, 5761, 5762, 5763, 5764, 5765, 5766, 5767, 5768, 5769, 5770, 5771, 5772, 5773, 5774, 5775, 5776, 5777, 5778, 5779, 5780, 5781, 5782, 5783, 5784, 5785, 5786, 5787, 5788, 5789, 5790, 5791, 5792, 5793, 5794, 5795, 5796, 5797, 5798, 5799, 5800, 5801, 5802, 5803, 5804, 5805, 5806, 5807, 5808, 5809, 5810, 5811, 5812, 5813, 5814, 5815, 5816, 5817, 5818, 5819, 5820, 5821, 5822, 5823, 5824, 5825, 5826, 5827, 5828, 5829, 5830, 5831, 5832, 5833, 5834, 5835, 5836, 5837, 5838, 5839, 5840, 5841, 5842, 5843, 5844, 5845, 5846, 5847, 5848, 5849, 5850, 5851, 5852, 5853, 5854, 5855, 5856, 5857, 5858, 5859, 5860, 5861, 5862, 5863, 5864, 5865, 5866, 5867, 5868, 5869, 5870, 5871, 5872, 5873, 5874, 5875, 5876, 5877, 5878, 5879, 5880, 5881, 5882, 5883, 5884, 5885, 5886, 5887, 5888, 5889, 5890, 5891, 5892, 5893, 5894, 5895, 5896, 5897, 5898, 5899, 5900, 5901, 5902, 5903, 5904, 5905, 5906, 5907, 5908, 5909, 5910, 5911, 5912, 5913, 5914, 5915, 5916, 5917, 5918, 5919, 5920, 5921, 5922, 5923, 5924, 5925, 5926, 5927, 5928, 5929, 5930, 5931, 5932, 5933, 5934, 5935, 5936, 5937, 5938, 5939, 5940, 5941, 5942, 5943, 5944, 5945, 5946, 5947, 5948, 5949, 5950, 5951, 5952, 5953, 5954, 5955, 5956, 5957, 5958, 5959, 5960, 5961, 5962, 5963, 5964, 5965, 5966, 5967, 5968, 5969, 5970, 5971, 5972, 5973, 5974, 5975, 5976, 5977, 5978, 5979, 5980, 5981, 5982, 5983, 5984, 5985, 5986, 5987, 5988, 5989, 5990, 5991, 5992, 5993, 5994, 5995, 5996, 5997, 5998, 5999, 6000, 6001, 6002, 6003, 6004, 6005, 6006, 6007, 6008, 6009, 6010, 6011, 6012, 6013, 6014, 6015, 6016, 6017, 6018, 6019, 6020, 6021, 6022, 6023, 6024, 6025, 6026, 6027, 6028, 6029, 6030, 6031, 6032, 6033, 6034, 6035, 6036, 6037, 6038, 6039, 6040, 6041, 6042, 6043, 6044, 6045, 6046, 6047, 6048, 6049, 6050, 6051, 6052, 6053, 6054, 6055, 6056, 6057, 6058, 6059, 6060, 6061, 6062, 6063, 6064, 6065, 6066, 6067, 6068, 6069, 6070, 6071, 6072, 6073, 6074, 6075, 6076, 6077, 6078, 6079, 6080, 6081, 6082, 6083, 6084, 6085, 6086, 6087, 6088, 6089, 6090, 6091, 6092, 6093, 6094, 6095, 6096, 6097, 6098, 6099, 6100, 6101, 6102, 6103, 6104, 6105, 6106, 6107, 6108, 6109, 6110, 6111, 6112, 6113, 6114, 6115, 6116, 6117, 6118, 6119, 6120, 6121, 6122, 6123, 6124, 6125, 6126, 6127, 6128, 6129, 6130, 6131, 6132, 6133, 6134, 6135, 6136, 6137, 6138, 6139, 6140, 6141, 6142, 6143, 6144, 6145, 6146, 6147, 6148, 6149, 6150, 6151, 6152, 6153, 6154, 6155, 6156, 6157, 6158, 6159, 6160, 6161, 6162, 6163, 6164, 6165, 6166, 6167, 6168, 6169, 6170, 6171, 6172, 6173, 6174, 6175, 6176, 6177, 6178, 6179, 6180, 6181, 6182, 6183, 6184, 6185, 6186, 6187, 6188, 6189, 6190, 6191, 6192, 6193, 6194, 6195, 6196, 6197, 6198, 6199, 6200, 6201, 6202, 6203, 6204, 6205, 6206, 6207, 6208, 6209, 6210, 6211, 6212, 6213, 6214, 6215, 6216, 6217, 6218, 6219, 6220, 6221, 6222, 6223, 6224, 6225, 6226, 6227, 6228, 6229, 6230, 6231, 6232, 6233, 6234, 6235, 6236, 6237, 6238, 6239, 6240, 6241, 6242, 6243, 6244, 6245, 6246, 6247, 6248, 6249, 6250, 6251, 6252, 6253, 6254, 6255, 6256, 6257, 6258, 6259, 6260, 6261, 6262, 6263, 6264, 6265, 6266, 6267, 6268, 6269, 6270, 6271, 6272, 6273, 6274, 6275, 6276, 6277, 6278, 6279, 6280, 6281, 6282, 6283, 6284, 6285, 6286, 6287, 6288, 6289, 6290, 6291, 6292, 6293, 6294, 6295, 6296, 6297, 6298, 6299, 6300, 6301, 6302, 6303, 6304, 6305, 6306, 6307, 6308, 6309, 6310, 6311, 6312, 6313, 6314, 6315, 6316, 6317, 6318, 6319, 6320, 6321, 6322, 6323, 6324, 6325, 6326, 6327, 6328, 6329, 6330, 6331, 6332, 6333, 6334, 6335, 6336, 6337, 6338, 6339, 6340, 6341, 6342, 6343, 6344, 6345, 6346, 6347, 6348, 6349, 6350, 6351, 6352, 6353, 6354, 6355, 6356, 6357, 6358, 6359, 6360, 6361, 6362, 6363, 6364, 6365, 6366, 6367, 6368, 6369, 6370, 6371, 6372, 6373, 6374, 6375, 6376, 6377, 6378, 6379, 6380, 6381, 6382, 6383, 6384, 6385, 6386, 6387, 6388, 6389, 6390, 6391, 6392, 6393, 6394, 6395, 6396, 6397, 6398, 6399, 6400, 6401, 6402, 6403, 6404, 6405, 6406, 6407, 6408, 6409, 6410, 6411, 6412, 6413, 6414, 6415, 6416, 6417, 6418, 6419, 6420, 6421, 6422, 6423, 6424, 6425, 6426, 6427, 6428, 6429, 6430, 6431, 6432, 6433, 6434, 6435, 6436, 6437, 6438, 6439, 6440, 6441, 6442, 6443, 6444, 6445, 6446, 6447, 6448, 6449, 6450, 6451, 6452, 6453, 6454, 6455, 6456, 6457, 6458, 6459, 6460, 6461, 6462, 6463, 6464, 6465, 6466, 6467, 6468, 6469, 6470, 6471, 6472, 6473, 6474, 6475, 6476, 6477, 6478, 6479, 6480, 6481, 6482, 6483, 6484, 6485, 6486, 6487, 6488, 6489, 6490, 6491, 6492, 6493, 6494, 6495, 6496, 6497, 6498, 6499, 6500, 6501, 6502, 6503, 6504, 6505, 6506, 6507, 6508, 6509, 6510, 6511, 6512, 6513, 6514, 6515, 6516, 6517, 6518, 6519, 6520, 6521, 6522, 6523, 6524, 6525, 6526, 6527, 6528, 6529, 6530, 6531, 6532, 6533, 6534, 6535, 6536, 6537, 6538, 6539, 6540, 6541, 6542, 6543, 6544, 6545, 6546, 6547, 6548, 6549, 6550, 6551, 6552, 6553, 6554, 6555, 6556, 6557, 6558, 6559, 6560, 6561, 6562, 6563, 6564, 6565, 6566, 6567, 6568, 6569, 6570, 6571, 6572, 6573, 6574, 6575, 6576, 6577, 6578, 6579, 6580, 6581, 6582, 6583, 6584, 6585, 6586, 6587, 6588, 6589, 6590, 6591, 6592, 6593, 6594, 6595, 6596, 6597, 6598, 6599, 6600, 6601, 6602, 6603, 6604, 6605, 6606, 6607, 6608, 6609, 6610, 6611, 6612, 6613, 6614, 6615, 6616, 6617, 6618, 6619, 6620, 6621, 6622, 6623, 6624, 6625, 6626, 6627, 6628, 6629, 6630, 6631, 6632, 6633, 6634, 6635, 6636, 6637, 6638, 6639, 6640, 6641, 6642, 6643, 6644, 6645, 6646, 6647, 6648, 6649, 6650, 6651, 6652, 6653, 6654, 6655, 6656, 6657, 6658, 6659, 6660, 6661, 6662, 6663, 6664, 6665, 6666, 6667, 6668, 6669, 6670, 6671, 6672, 6673, 6674, 6675, 6676, 6677, 6678, 6679, 6680, 6681, 6682, 6683, 6684, 6685, 6686, 6687, 6688, 6689, 6690, 6691, 6692, 6693, 6694, 6695, 6696, 6697, 6698, 6699, 6700, 6701, 6702, 6703, 6704, 6705, 6706, 6707, 6708, 6709, 6710, 6711, 6712, 6713, 6714, 6715, 6716, 6717, 6718, 6719, 6720, 6721, 6722, 6723, 6724, 6725, 6726, 6727, 6728, 6729, 6730, 6731, 6732, 6733, 6734, 6735, 6736, 6737, 6738, 6739, 6740, 6741, 6742, 6743, 6744, 6745, 6746, 6747, 6748, 6749, 6750, 6751, 6752, 6753, 6754, 6755, 6756, 6757, 6758, 6759, 6760, 6761, 6762, 6763, 6764, 6765, 6766, 6767, 6768, 6769, 6770, 6771, 6772, 6773, 6774, 6775, 6776, 6777, 6778, 6779, 6780, 6781, 6782, 6783, 6784, 6785, 6786, 6787, 6788, 6789, 6790, 6791, 6792, 6793, 6794, 6795, 6796, 6797, 6798, 6799, 6800, 6801, 6802, 6803, 6804, 6805, 6806, 6807, 6808, 6809, 6810, 6811, 6812, 6813, 6814, 6815, 6816, 6817, 6818, 6819, 6820, 6821, 6822, 6823, 6824, 6825, 6826, 6827, 6828, 6829, 6830, 6831, 6832, 6833, 6834, 6835, 6836, 6837, 6838, 6839, 6840, 6841, 6842, 6843, 6844, 6845, 6846, 6847, 6848, 6849, 6850, 6851, 6852, 6853, 6854, 6855, 6856, 6857, 6858, 6859, 6860, 6861, 6862, 6863, 6864, 6865, 6866, 6867, 6868, 6869, 6870, 6871, 6872, 6873, 6874, 6875, 6876, 6877, 6878, 6879, 6880, 6881, 6882, 6883, 6884, 6885, 6886, 6887, 6888, 6889, 6890, 6891, 6892, 6893, 6894, 6895, 6896, 6897, 6898, 6899, 6900, 6901, 6902, 6903, 6904, 6905, 6906, 6907, 6908, 6909, 6910, 6911, 6912, 6913, 6914, 6915, 6916, 6917, 6918, 6919, 6920, 6921, 6922, 6923, 6924, 6925, 6926, 6927, 6928, 6929, 6930, 6931, 6932, 6933, 6934, 6935, 6936, 6937, 6938, 6939, 6940, 6941, 6942, 6943, 6944, 6945, 6946, 6947, 6948, 6949, 6950, 6951, 6952, 6953, 6954, 6955, 6956, 6957, 6958, 6959, 6960, 6961, 6962, 6963, 6964, 6965, 6966, 6967, 6968, 6969, 6970, 6971, 6972, 6973, 6974, 6975, 6976, 6977, 6978, 6979, 6980, 6981, 6982, 6983, 6984, 6985, 6986, 6987, 6988, 6989, 6990, 6991, 6992, 6993, 6994, 6995, 6996, 6997, 6998, 6999, 7000, 7001, 7002, 7003, 7004, 7005, 7006, 7007, 7008, 7009, 7010, 7011, 7012, 7013, 7014, 7015, 7016, 7017, 7018, 7019, 7020, 7021, 7022, 7023, 7024, 7025, 7026, 7027, 7028, 7029, 7030, 7031, 7032, 7033, 7034, 7035, 7036, 7037, 7038, 7039, 7040, 7041, 7042, 7043, 7044, 7045, 7046, 7047, 7048, 7049, 7050, 7051, 7052, 7053, 7054, 7055, 7056, 7057, 7058, 7059, 7060, 7061, 7062, 7063, 7064, 7065, 7066, 7067, 7068, 7069, 7070, 7071, 7072, 7073, 7074, 7075, 7076, 7077, 7078, 7079, 7080, 7081, 7082, 7083, 7084, 7085, 7086, 7087, 7088, 7089, 7090, 7091, 7092, 7093, 7094, 7095, 7096, 7097, 7098, 7099, 7100, 7101, 7102, 7103, 7104, 7105, 7106, 7107, 7108, 7109, 7110, 7111, 7112, 7113, 7114, 7115, 7116, 7117, 7118, 7119, 7120, 7121, 7122, 7123, 7124, 7125, 7126, 7127, 7128, 7129, 7130, 7131, 7132, 7133, 7134, 7135, 7136, 7137, 7138, 7139, 7140, 7141, 7142, 7143, 7144, 7145, 7146, 7147, 7148, 7149, 7150, 7151, 7152, 7153, 7154, 7155, 7156, 7157, 7158, 7159, 7160, 7161, 7162, 7163, 7164, 7165, 7166, 7167, 7168, 7169, 7170, 7171, 7172, 7173, 7174, 7175, 7176, 7177, 7178, 7179, 7180, 7181, 7182, 7183, 7184, 7185, 7186, 7187, 7188, 7189, 7190, 7191, 7192, 7193, 7194, 7195, 7196, 7197, 7198, 7199, 7200, 7201, 7202, 7203, 7204, 7205, 7206, 7207, 7208, 7209, 7210, 7211, 7212, 7213, 7214, 7215, 7216, 7217, 7218, 7219, 7220, 7221, 7222, 7223, 7224, 7225, 7226, 7227, 7228, 7229, 7230, 7231, 7232, 7233, 7234, 7235, 7236, 7237, 7238, 7239, 7240, 7241, 7242, 7243, 7244, 7245, 7246, 7247, 7248, 7249, 7250, 7251, 7252, 7253, 7254, 7255, 7256, 7257, 7258, 7259, 7260, 7261, 7262, 7263, 7264, 7265, 7266, 7267, 7268, 7269, 7270, 7271, 7272, 7273, 7274, 7275, 7276, 7277, 7278, 7279, 7280, 7281, 7282, 7283, 7284, 7285, 7286, 7287, 7288, 7289, 7290, 7291, 7292, 7293, 7294, 7295, 7296, 7297, 7298, 7299, 7300, 7301, 7302, 7303, 7304, 7305, 7306, 7307, 7308, 7309, 7310, 7311, 7312, 7313, 7314, 7315, 7316, 7317, 7318, 7319, 7320, 7321, 7322, 7323, 7324, 7325, 7326, 7327, 7328, 7329, 7330, 7331, 7332, 7333, 7334, 7335, 7336, 7337, 7338, 7339, 7340, 7341, 7342, 7343, 7344, 7345, 7346, 7347, 7348, 7349, 7350, 7351, 7352, 7353, 7354, 7355, 7356, 7357, 7358, 7359, 7360, 7361, 7362, 7363, 7364, 7365, 7366, 7367, 7368, 7369, 7370, 7371, 7372, 7373, 7374, 7375, 7376, 7377, 7378, 7379, 7380, 7381, 7382, 7383, 7384, 7385, 7386, 7387, 7388, 7389, 7390, 7391, 7392, 7393, 7394, 7395, 7396, 7397, 7398, 7399, 7400, 7401, 7402, 7403, 7404, 7405, 7406, 7407, 7408, 7409, 7410, 7411, 7412, 7413, 7414, 7415, 7416, 7417, 7418, 7419, 7420, 7421, 7422, 7423, 7424, 7425, 7426, 7427, 7428, 7429, 7430, 7431, 7432, 7433, 7434, 7435, 7436, 7437, 7438, 7439, 7440, 7441, 7442, 7443, 7444, 7445, 7446, 7447, 7448, 7449, 7450, 7451, 7452, 7453, 7454, 7455, 7456, 7457, 7458, 7459, 7460, 7461, 7462, 7463, 7464, 7465, 7466, 7467, 7468, 7469, 7470, 7471, 7472, 7473, 7474, 7475, 7476, 7477, 7478, 7479, 7480, 7481, 7482, 7483, 7484, 7485, 7486, 7487, 7488, 7489, 7490, 7491, 7492, 7493, 7494, 7495, 7496, 7497, 7498, 7499, 7500, 7501, 7502, 7503, 7504, 7505, 7506, 7507, 7508, 7509, 7510, 7511, 7512, 7513, 7514, 7515, 7516, 7517, 7518, 7519, 7520, 7521, 7522, 7523, 7524, 7525, 7526, 7527, 7528, 7529, 7530, 7531, 7532, 7533, 7534, 7535, 7536, 7537, 7538, 7539, 7540, 7541, 7542, 7543, 7544, 7545, 7546, 7547, 7548, 7549, 7550, 7551, 7552, 7553, 7554, 7555, 7556, 7557, 7558, 7559, 7560, 7561, 7562, 7563, 7564, 7565, 7566, 7567, 7568, 7569, 7570, 7571, 7572, 7573, 7574, 7575, 7576, 7577, 7578, 7579, 7580, 7581, 7582, 7583, 7584, 7585, 7586, 7587, 7588, 7589, 7590, 7591, 7592, 7593, 7594, 7595, 7596, 7597, 7598, 7599, 7600, 7601, 7602, 7603, 7604, 7605, 7606, 7607, 7608, 7609, 7610, 7611, 7612, 7613, 7614, 7615, 7616, 7617, 7618, 7619, 7620, 7621, 7622, 7623, 7624, 7625, 7626, 7627, 7628, 7629, 7630, 7631, 7632, 7633, 7634, 7635, 7636, 7637, 7638, 7639, 7640, 7641, 7642, 7643, 7644, 7645, 7646, 7647, 7648, 7649, 7650, 7651, 7652, 7653, 7654, 7655, 7656, 7657, 7658, 7659, 7660, 7661, 7662, 7663, 7664, 7665, 7666, 7667, 7668, 7669, 7670, 7671, 7672, 7673, 7674, 7675, 7676, 7677, 7678, 7679, 7680, 7681, 7682, 7683, 7684, 7685, 7686, 7687, 7688, 7689, 7690, 7691, 7692, 7693, 7694, 7695, 7696, 7697, 7698, 7699, 7700, 7701, 7702, 7703, 7704, 7705, 7706, 7707, 7708, 7709, 7710, 7711, 7712, 7713, 7714, 7715, 7716, 7717, 7718, 7719, 7720, 7721, 7722, 7723, 7724, 7725, 7726, 7727, 7728, 7729, 7730, 7731, 7732, 7733, 7734, 7735, 7736, 7737, 7738, 7739, 7740, 7741, 7742, 7743, 7744, 7745, 7746, 7747, 7748, 7749, 7750, 7751, 7752, 7753, 7754, 7755, 7756, 7757, 7758, 7759, 7760, 7761, 7762, 7763, 7764, 7765, 7766, 7767, 7768, 7769, 7770, 7771, 7772, 7773, 7774, 7775, 7776, 7777, 7778, 7779, 7780, 7781, 7782, 7783, 7784, 7785, 7786, 7787, 7788, 7789, 7790, 7791, 7792, 7793, 7794, 7795, 7796, 7797, 7798, 7799, 7800, 7801, 7802, 7803, 7804, 7805, 7806, 7807, 7808, 7809, 7810, 7811, 7812, 7813, 7814, 7815, 7816, 7817, 7818, 7819, 7820, 7821, 7822, 7823, 7824, 7825, 7826, 7827, 7828, 7829, 7830, 7831, 7832, 7833, 7834, 7835, 7836, 7837, 7838, 7839, 7840, 7841, 7842, 7843, 7844, 7845, 7846, 7847, 7848, 7849, 7850, 7851, 7852, 7853, 7854, 7855, 7856, 7857, 7858, 7859, 7860, 7861, 7862, 7863, 7864, 7865, 7866, 7867, 7868, 7869, 7870, 7871, 7872, 7873, 7874, 7875, 7876, 7877, 7878, 7879, 7880, 7881, 7882, 7883, 7884, 7885, 7886, 7887, 7888, 7889, 7890, 7891, 7892, 7893, 7894, 7895, 7896, 7897, 7898, 7899, 7900, 7901, 7902, 7903, 7904, 7905, 7906, 7907, 7908, 7909, 7910, 7911, 7912, 7913, 7914, 7915, 7916, 7917, 7918, 7919, 7920, 7921, 7922, 7923, 7924, 7925, 7926, 7927, 7928, 7929, 7930, 7931, 7932, 7933, 7934, 7935, 7936, 7937, 7938, 7939, 7940, 7941, 7942, 7943, 7944, 7945, 7946, 7947, 7948, 7949, 7950, 7951, 7952, 7953, 7954, 7955, 7956, 7957, 7958, 7959, 7960, 7961, 7962, 7963, 7964, 7965, 7966, 7967, 7968, 7969, 7970, 7971, 7972, 7973, 7974, 7975, 7976, 7977, 7978, 7979, 7980, 7981, 7982, 7983, 7984, 7985, 7986, 7987, 7988, 7989, 7990, 7991, 7992, 7993, 7994, 7995, 7996, 7997, 7998, 7999, 8000, 8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008, 8009, 8010, 8011, 8012, 8013, 8014, 8015, 8016, 8017, 8018, 8019, 8020, 8021, 8022, 8023, 8024, 8025, 8026, 8027, 8028, 8029, 8030, 8031, 8032, 8033, 8034, 8035, 8036, 8037, 8038, 8039, 8040, 8041, 8042, 8043, 8044, 8045, 8046, 8047, 8048, 8049, 8050, 8051, 8052, 8053, 8054, 8055, 8056, 8057, 8058, 8059, 8060, 8061, 8062, 8063, 8064, 8065, 8066, 8067, 8068, 8069, 8070, 8071, 8072, 8073, 8074, 8075, 8076, 8077, 8078, 8079, 8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089, 8090, 8091, 8092, 8093, 8094, 8095, 8096, 8097, 8098, 8099, 8100, 8101, 8102, 8103, 8104, 8105, 8106, 8107, 8108, 8109, 8110, 8111, 8112, 8113, 8114, 8115, 8116, 8117, 8118, 8119, 8120, 8121, 8122, 8123, 8124, 8125, 8126, 8127, 8128, 8129, 8130, 8131, 8132, 8133, 8134, 8135, 8136, 8137, 8138, 8139, 8140, 8141, 8142, 8143, 8144, 8145, 8146, 8147, 8148, 8149, 8150, 8151, 8152, 8153, 8154, 8155, 8156, 8157, 8158, 8159, 8160, 8161, 8162, 8163, 8164, 8165, 8166, 8167, 8168, 8169, 8170, 8171, 8172, 8173, 8174, 8175, 8176, 8177, 8178, 8179, 8180, 8181, 8182, 8183, 8184, 8185, 8186, 8187, 8188, 8189, 8190, 8191, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8203, 8204, 8205, 8206, 8207, 8208, 8209, 8210, 8211, 8212, 8213, 8214, 8215, 8216, 8217, 8218, 8219, 8220, 8221, 8222, 8223, 8224, 8225, 8226, 8227, 8228, 8229, 8230, 8231, 8232, 8233, 8234, 8235, 8236, 8237, 8238, 8239, 8240, 8241, 8242, 8243, 8244, 8245, 8246, 8247, 8248, 8249, 8250, 8251, 8252, 8253, 8254, 8255, 8256, 8257, 8258, 8259, 8260, 8261, 8262, 8263, 8264, 8265, 8266, 8267, 8268, 8269, 8270, 8271, 8272, 8273, 8274, 8275, 8276, 8277, 8278, 8279, 8280, 8281, 8282, 8283, 8284, 8285, 8286, 8287, 8288, 8289, 8290, 8291, 8292, 8293, 8294, 8295, 8296, 8297, 8298, 8299, 8300, 8301, 8302, 8303, 8304, 8305, 8306, 8307, 8308, 8309, 8310, 8311, 8312, 8313, 8314, 8315, 8316, 8317, 8318, 8319, 8320, 8321, 8322, 8323, 8324, 8325, 8326, 8327, 8328, 8329, 8330, 8331, 8332, 8333, 8334, 8335, 8336, 8337, 8338, 8339, 8340, 8341, 8342, 8343, 8344, 8345, 8346, 8347, 8348, 8349, 8350, 8351, 8352, 8353, 8354, 8355, 8356, 8357, 8358, 8359, 8360, 8361, 8362, 8363, 8364, 8365, 8366, 8367, 8368, 8369, 8370, 8371, 8372, 8373, 8374, 8375, 8376, 8377, 8378, 8379, 8380, 8381, 8382, 8383, 8384, 8385, 8386, 8387, 8388, 8389, 8390, 8391, 8392, 8393, 8394, 8395, 8396, 8397, 8398, 8399, 8400, 8401, 8402, 8403, 8404, 8405, 8406, 8407, 8408, 8409, 8410, 8411, 8412, 8413, 8414, 8415, 8416, 8417, 8418, 8419, 8420, 8421, 8422, 8423, 8424, 8425, 8426, 8427, 8428, 8429, 8430, 8431, 8432, 8433, 8434, 8435, 8436, 8437, 8438, 8439, 8440, 8441, 8442, 8443, 8444, 8445, 8446, 8447, 8448, 8449, 8450, 8451, 8452, 8453, 8454, 8455, 8456, 8457, 8458, 8459, 8460, 8461, 8462, 8463, 8464, 8465, 8466, 8467, 8468, 8469, 8470, 8471, 8472, 8473, 8474, 8475, 8476, 8477, 8478, 8479, 8480, 8481, 8482, 8483, 8484, 8485, 8486, 8487, 8488, 8489, 8490, 8491, 8492, 8493, 8494, 8495, 8496, 8497, 8498, 8499, 8500, 8501, 8502, 8503, 8504, 8505, 8506, 8507, 8508, 8509, 8510, 8511, 8512, 8513, 8514, 8515, 8516, 8517, 8518, 8519, 8520, 8521, 8522, 8523, 8524, 8525, 8526, 8527, 8528, 8529, 8530, 8531, 8532, 8533, 8534, 8535, 8536, 8537, 8538, 8539, 8540, 8541, 8542, 8543, 8544, 8545, 8546, 8547, 8548, 8549, 8550, 8551, 8552, 8553, 8554, 8555, 8556, 8557, 8558, 8559, 8560, 8561, 8562, 8563, 8564, 8565, 8566, 8567, 8568, 8569, 8570, 8571, 8572, 8573, 8574, 8575, 8576, 8577, 8578, 8579, 8580, 8581, 8582, 8583, 8584, 8585, 8586, 8587, 8588, 8589, 8590, 8591, 8592, 8593, 8594, 8595, 8596, 8597, 8598, 8599, 8600, 8601, 8602, 8603, 8604, 8605, 8606, 8607, 8608, 8609, 8610, 8611, 8612, 8613, 8614, 8615, 8616, 8617, 8618, 8619, 8620, 8621, 8622, 8623, 8624, 8625, 8626, 8627, 8628, 8629, 8630, 8631, 8632, 8633, 8634, 8635, 8636, 8637, 8638, 8639, 8640, 8641, 8642, 8643, 8644, 8645, 8646, 8647, 8648, 8649, 8650, 8651, 8652, 8653, 8654, 8655, 8656, 8657, 8658, 8659, 8660, 8661, 8662, 8663, 8664, 8665, 8666, 8667, 8668, 8669, 8670, 8671, 8672, 8673, 8674, 8675, 8676, 8677, 8678, 8679, 8680, 8681, 8682, 8683, 8684, 8685, 8686, 8687, 8688, 8689, 8690, 8691, 8692, 8693, 8694, 8695, 8696, 8697, 8698, 8699, 8700, 8701, 8702, 8703, 8704, 8705, 8706, 8707, 8708, 8709, 8710, 8711, 8712, 8713, 8714, 8715, 8716, 8717, 8718, 8719, 8720, 8721, 8722, 8723, 8724, 8725, 8726, 8727, 8728, 8729, 8730, 8731, 8732, 8733, 8734, 8735, 8736, 8737, 8738, 8739, 8740, 8741, 8742, 8743, 8744, 8745, 8746, 8747, 8748, 8749, 8750, 8751, 8752, 8753, 8754, 8755, 8756, 8757, 8758, 8759, 8760, 8761, 8762, 8763, 8764, 8765, 8766, 8767, 8768, 8769, 8770, 8771, 8772, 8773, 8774, 8775, 8776, 8777, 8778, 8779, 8780, 8781, 8782, 8783, 8784, 8785, 8786, 8787, 8788, 8789, 8790, 8791, 8792, 8793, 8794, 8795, 8796, 8797, 8798, 8799, 8800, 8801, 8802, 8803, 8804, 8805, 8806, 8807, 8808, 8809, 8810, 8811, 8812, 8813, 8814, 8815, 8816, 8817, 8818, 8819, 8820, 8821, 8822, 8823, 8824, 8825, 8826, 8827, 8828, 8829, 8830, 8831, 8832, 8833, 8834, 8835, 8836, 8837, 8838, 8839, 8840, 8841, 8842, 8843, 8844, 8845, 8846, 8847, 8848, 8849, 8850, 8851, 8852, 8853, 8854, 8855, 8856, 8857, 8858, 8859, 8860, 8861, 8862, 8863, 8864, 8865, 8866, 8867, 8868, 8869, 8870, 8871, 8872, 8873, 8874, 8875, 8876, 8877, 8878, 8879, 8880, 8881, 8882, 8883, 8884, 8885, 8886, 8887, 8888, 8889, 8890, 8891, 8892, 8893, 8894, 8895, 8896, 8897, 8898, 8899, 8900, 8901, 8902, 8903, 8904, 8905, 8906, 8907, 8908, 8909, 8910, 8911, 8912, 8913, 8914, 8915, 8916, 8917, 8918, 8919, 8920, 8921, 8922, 8923, 8924, 8925, 8926, 8927, 8928, 8929, 8930, 8931, 8932, 8933, 8934, 8935, 8936, 8937, 8938, 8939, 8940, 8941, 8942, 8943, 8944, 8945, 8946, 8947, 8948, 8949, 8950, 8951, 8952, 8953, 8954, 8955, 8956, 8957, 8958, 8959, 8960, 8961, 8962, 8963, 8964, 8965, 8966, 8967, 8968, 8969, 8970, 8971, 8972, 8973, 8974, 8975, 8976, 8977, 8978, 8979, 8980, 8981, 8982, 8983, 8984, 8985, 8986, 8987, 8988, 8989, 8990, 8991, 8992, 8993, 8994, 8995, 8996, 8997, 8998, 8999, 9000, 9001, 9002, 9003, 9004, 9005, 9006, 9007, 9008, 9009, 9010, 9011, 9012, 9013, 9014, 9015, 9016, 9017, 9018, 9019, 9020, 9021, 9022, 9023, 9024, 9025, 9026, 9027, 9028, 9029, 9030, 9031, 9032, 9033, 9034, 9035, 9036, 9037, 9038, 9039, 9040, 9041, 9042, 9043, 9044, 9045, 9046, 9047, 9048, 9049, 9050, 9051, 9052, 9053, 9054, 9055, 9056, 9057, 9058, 9059, 9060, 9061, 9062, 9063, 9064, 9065, 9066, 9067, 9068, 9069, 9070, 9071, 9072, 9073, 9074, 9075, 9076, 9077, 9078, 9079, 9080, 9081, 9082, 9083, 9084, 9085, 9086, 9087, 9088, 9089, 9090, 9091, 9092, 9093, 9094, 9095, 9096, 9097, 9098, 9099, 9100, 9101, 9102, 9103, 9104, 9105, 9106, 9107, 9108, 9109, 9110, 9111, 9112, 9113, 9114, 9115, 9116, 9117, 9118, 9119, 9120, 9121, 9122, 9123, 9124, 9125, 9126, 9127, 9128, 9129, 9130, 9131, 9132, 9133, 9134, 9135, 9136, 9137, 9138, 9139, 9140, 9141, 9142, 9143, 9144, 9145, 9146, 9147, 9148, 9149, 9150, 9151, 9152, 9153, 9154, 9155, 9156, 9157, 9158, 9159, 9160, 9161, 9162, 9163, 9164, 9165, 9166, 9167, 9168, 9169, 9170, 9171, 9172, 9173, 9174, 9175, 9176, 9177, 9178, 9179, 9180, 9181, 9182, 9183, 9184, 9185, 9186, 9187, 9188, 9189, 9190, 9191, 9192, 9193, 9194, 9195, 9196, 9197, 9198, 9199, 9200, 9201, 9202, 9203, 9204, 9205, 9206, 9207, 9208, 9209, 9210, 9211, 9212, 9213, 9214, 9215, 9216, 9217, 9218, 9219, 9220, 9221, 9222, 9223, 9224, 9225, 9226, 9227, 9228, 9229, 9230, 9231, 9232, 9233, 9234, 9235, 9236, 9237, 9238, 9239, 9240, 9241, 9242, 9243, 9244, 9245, 9246, 9247, 9248, 9249, 9250, 9251, 9252, 9253, 9254, 9255, 9256, 9257, 9258, 9259, 9260, 9261, 9262, 9263, 9264, 9265, 9266, 9267, 9268, 9269, 9270, 9271, 9272, 9273, 9274, 9275, 9276, 9277, 9278, 9279, 9280, 9281, 9282, 9283, 9284, 9285, 9286, 9287, 9288, 9289, 9290, 9291, 9292, 9293, 9294, 9295, 9296, 9297, 9298, 9299, 9300, 9301, 9302, 9303, 9304, 9305, 9306, 9307, 9308, 9309, 9310, 9311, 9312, 9313, 9314, 9315, 9316, 9317, 9318, 9319, 9320, 9321, 9322, 9323, 9324, 9325, 9326, 9327, 9328, 9329, 9330, 9331, 9332, 9333, 9334, 9335, 9336, 9337, 9338, 9339, 9340, 9341, 9342, 9343, 9344, 9345, 9346, 9347, 9348, 9349, 9350, 9351, 9352, 9353, 9354, 9355, 9356, 9357, 9358, 9359, 9360, 9361, 9362, 9363, 9364, 9365, 9366, 9367, 9368, 9369, 9370, 9371, 9372, 9373, 9374, 9375, 9376, 9377, 9378, 9379, 9380, 9381, 9382, 9383, 9384, 9385, 9386, 9387, 9388, 9389, 9390, 9391, 9392, 9393, 9394, 9395, 9396, 9397, 9398, 9399, 9400, 9401, 9402, 9403, 9404, 9405, 9406, 9407, 9408, 9409, 9410, 9411, 9412, 9413, 9414, 9415, 9416, 9417, 9418, 9419, 9420, 9421, 9422, 9423, 9424, 9425, 9426, 9427, 9428, 9429, 9430, 9431, 9432, 9433, 9434, 9435, 9436, 9437, 9438, 9439, 9440, 9441, 9442, 9443, 9444, 9445, 9446, 9447, 9448, 9449, 9450, 9451, 9452, 9453, 9454, 9455, 9456, 9457, 9458, 9459, 9460, 9461, 9462, 9463, 9464, 9465, 9466, 9467, 9468, 9469, 9470, 9471, 9472, 9473, 9474, 9475, 9476, 9477, 9478, 9479, 9480, 9481, 9482, 9483, 9484, 9485, 9486, 9487, 9488, 9489, 9490, 9491, 9492, 9493, 9494, 9495, 9496, 9497, 9498, 9499, 9500, 9501, 9502, 9503, 9504, 9505, 9506, 9507, 9508, 9509, 9510, 9511, 9512, 9513, 9514, 9515, 9516, 9517, 9518, 9519, 9520, 9521, 9522, 9523, 9524, 9525, 9526, 9527, 9528, 9529, 9530, 9531, 9532, 9533, 9534, 9535, 9536, 9537, 9538, 9539, 9540, 9541, 9542, 9543, 9544, 9545, 9546, 9547, 9548, 9549, 9550, 9551, 9552, 9553, 9554, 9555, 9556, 9557, 9558, 9559, 9560, 9561, 9562, 9563, 9564, 9565, 9566, 9567, 9568, 9569, 9570, 9571, 9572, 9573, 9574, 9575, 9576, 9577, 9578, 9579, 9580, 9581, 9582, 9583, 9584, 9585, 9586, 9587, 9588, 9589, 9590, 9591, 9592, 9593, 9594, 9595, 9596, 9597, 9598, 9599, 9600, 9601, 9602, 9603, 9604, 9605, 9606, 9607, 9608, 9609, 9610, 9611, 9612, 9613, 9614, 9615, 9616, 9617, 9618, 9619, 9620, 9621, 9622, 9623, 9624, 9625, 9626, 9627, 9628, 9629, 9630, 9631, 9632, 9633, 9634, 9635, 9636, 9637, 9638, 9639, 9640, 9641, 9642, 9643, 9644, 9645, 9646, 9647, 9648, 9649, 9650, 9651, 9652, 9653, 9654, 9655, 9656, 9657, 9658, 9659, 9660, 9661, 9662, 9663, 9664, 9665, 9666, 9667, 9668, 9669, 9670, 9671, 9672, 9673, 9674, 9675, 9676, 9677, 9678, 9679, 9680, 9681, 9682, 9683, 9684, 9685, 9686, 9687, 9688, 9689, 9690, 9691, 9692, 9693, 9694, 9695, 9696, 9697, 9698, 9699, 9700, 9701, 9702, 9703, 9704, 9705, 9706, 9707, 9708, 9709, 9710, 9711, 9712, 9713, 9714, 9715, 9716, 9717, 9718, 9719, 9720, 9721, 9722, 9723, 9724, 9725, 9726, 9727, 9728, 9729, 9730, 9731, 9732, 9733, 9734, 9735, 9736, 9737, 9738, 9739, 9740, 9741, 9742, 9743, 9744, 9745, 9746, 9747, 9748, 9749, 9750, 9751, 9752, 9753, 9754, 9755, 9756, 9757, 9758, 9759, 9760, 9761, 9762, 9763, 9764, 9765, 9766, 9767, 9768, 9769, 9770, 9771, 9772, 9773, 9774, 9775, 9776, 9777, 9778, 9779, 9780, 9781, 9782, 9783, 9784, 9785, 9786, 9787, 9788, 9789, 9790, 9791, 9792, 9793, 9794, 9795, 9796, 9797, 9798, 9799, 9800, 9801, 9802, 9803, 9804, 9805, 9806, 9807, 9808, 9809, 9810, 9811, 9812, 9813, 9814, 9815, 9816, 9817, 9818, 9819, 9820, 9821, 9822, 9823, 9824, 9825, 9826, 9827, 9828, 9829, 9830, 9831, 9832, 9833, 9834, 9835, 9836, 9837, 9838, 9839, 9840, 9841, 9842, 9843, 9844, 9845, 9846, 9847, 9848, 9849, 9850, 9851, 9852, 9853, 9854, 9855, 9856, 9857, 9858, 9859, 9860, 9861, 9862, 9863, 9864, 9865, 9866, 9867, 9868, 9869, 9870, 9871, 9872, 9873, 9874, 9875, 9876, 9877, 9878, 9879, 9880, 9881, 9882, 9883, 9884, 9885, 9886, 9887, 9888, 9889, 9890, 9891, 9892, 9893, 9894, 9895, 9896, 9897, 9898, 9899, 9900, 9901, 9902, 9903, 9904, 9905, 9906, 9907, 9908, 9909, 9910, 9911, 9912, 9913, 9914, 9915, 9916, 9917, 9918, 9919, 9920, 9921, 9922, 9923, 9924, 9925, 9926, 9927, 9928, 9929, 9930, 9931, 9932, 9933, 9934, 9935, 9936, 9937, 9938, 9939, 9940, 9941, 9942, 9943, 9944, 9945, 9946, 9947, 9948, 9949, 9950, 9951, 9952, 9953, 9954, 9955, 9956, 9957, 9958, 9959, 9960, 9961, 9962, 9963, 9964, 9965, 9966, 9967, 9968, 9969, 9970, 9971, 9972, 9973, 9974, 9975, 9976, 9977, 9978, 9979, 9980, 9981, 9982, 9983, 9984, 9985, 9986, 9987, 9988, 9989, 9990, 9991, 9992, 9993, 9994, 9995, 9996, 9997, 9998, 9999, 10000, 10001, 10002, 10003, 10004, 10005, 10006, 10007, 10008, 10009, 10010, 10011, 10012, 10013, 10014, 10015, 10016, 10017, 10018, 10019, 10020, 10021, 10022, 10023, 10024, 10025, 10026, 10027, 10028, 10029, 10030, 10031, 10032, 10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10041, 10042, 10043, 10044, 10045, 10046, 10047, 10048, 10049, 10050, 10051, 10052, 10053, 10054, 10055, 10056, 10057, 10058, 10059, 10060, 10061, 10062, 10063, 10064, 10065, 10066, 10067, 10068, 10069, 10070, 10071, 10072, 10073, 10074, 10075, 10076, 10077, 10078, 10079, 10080, 10081, 10082, 10083, 10084, 10085, 10086, 10087, 10088, 10089, 10090, 10091, 10092, 10093, 10094, 10095, 10096, 10097, 10098, 10099, 10100, 10101, 10102, 10103, 10104, 10105, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113, 10114, 10115, 10116, 10117, 10118, 10119, 10120, 10121, 10122, 10123, 10124, 10125, 10126, 10127, 10128, 10129, 10130, 10131, 10132, 10133, 10134, 10135, 10136, 10137, 10138, 10139, 10140, 10141, 10142, 10143, 10144, 10145, 10146, 10147, 10148, 10149, 10150, 10151, 10152, 10153, 10154, 10155, 10156, 10157, 10158, 10159, 10160, 10161, 10162, 10163, 10164, 10165, 10166, 10167, 10168, 10169, 10170, 10171, 10172, 10173, 10174, 10175, 10176, 10177, 10178, 10179, 10180, 10181, 10182, 10183, 10184, 10185, 10186, 10187, 10188, 10189, 10190, 10191, 10192, 10193, 10194, 10195, 10196, 10197, 10198, 10199, 10200, 10201, 10202, 10203, 10204, 10205, 10206, 10207, 10208, 10209, 10210, 10211, 10212, 10213, 10214, 10215, 10216, 10217, 10218, 10219, 10220, 10221, 10222, 10223, 10224, 10225, 10226, 10227, 10228, 10229, 10230, 10231, 10232, 10233, 10234, 10235, 10236, 10237, 10238, 10239, 10240, 10241, 10242, 10243, 10244, 10245, 10246, 10247, 10248, 10249, 10250, 10251, 10252, 10253, 10254, 10255, 10256, 10257, 10258, 10259, 10260, 10261, 10262, 10263, 10264, 10265, 10266, 10267, 10268, 10269, 10270, 10271, 10272, 10273, 10274, 10275, 10276, 10277, 10278, 10279, 10280, 10281, 10282, 10283, 10284, 10285, 10286, 10287, 10288, 10289, 10290, 10291, 10292, 10293, 10294, 10295, 10296, 10297, 10298, 10299, 10300, 10301, 10302, 10303, 10304, 10305, 10306, 10307, 10308, 10309, 10310, 10311, 10312, 10313, 10314, 10315, 10316, 10317, 10318, 10319, 10320, 10321, 10322, 10323, 10324, 10325, 10326, 10327, 10328, 10329, 10330, 10331, 10332, 10333, 10334, 10335, 10336, 10337, 10338, 10339, 10340, 10341, 10342, 10343, 10344, 10345, 10346, 10347, 10348, 10349, 10350, 10351, 10352, 10353, 10354, 10355, 10356, 10357, 10358, 10359, 10360, 10361, 10362, 10363, 10364, 10365, 10366, 10367, 10368, 10369, 10370, 10371, 10372, 10373, 10374, 10375, 10376, 10377, 10378, 10379, 10380, 10381, 10382, 10383, 10384, 10385, 10386, 10387, 10388, 10389, 10390, 10391, 10392, 10393, 10394, 10395, 10396, 10397, 10398, 10399, 10400, 10401, 10402, 10403, 10404, 10405, 10406, 10407, 10408, 10409, 10410, 10411, 10412, 10413, 10414, 10415, 10416, 10417, 10418, 10419, 10420, 10421, 10422, 10423, 10424, 10425, 10426, 10427, 10428, 10429, 10430, 10431, 10432, 10433, 10434, 10435, 10436, 10437, 10438, 10439, 10440, 10441, 10442, 10443, 10444, 10445, 10446, 10447, 10448, 10449, 10450, 10451, 10452, 10453, 10454, 10455, 10456, 10457, 10458, 10459, 10460, 10461, 10462, 10463, 10464, 10465, 10466, 10467, 10468, 10469, 10470, 10471, 10472, 10473, 10474, 10475, 10476, 10477, 10478, 10479, 10480, 10481, 10482, 10483, 10484, 10485, 10486, 10487, 10488, 10489, 10490, 10491, 10492, 10493, 10494, 10495, 10496, 10497, 10498, 10499, 10500, 10501, 10502, 10503, 10504, 10505, 10506, 10507, 10508, 10509, 10510, 10511, 10512, 10513, 10514, 10515, 10516, 10517, 10518, 10519, 10520, 10521, 10522, 10523, 10524, 10525, 10526, 10527, 10528, 10529, 10530, 10531, 10532, 10533, 10534, 10535, 10536, 10537, 10538, 10539, 10540, 10541, 10542, 10543, 10544, 10545, 10546, 10547, 10548, 10549, 10550, 10551, 10552, 10553, 10554, 10555, 10556, 10557, 10558, 10559, 10560, 10561, 10562, 10563, 10564, 10565, 10566, 10567, 10568, 10569, 10570, 10571, 10572, 10573, 10574, 10575, 10576, 10577, 10578, 10579, 10580, 10581, 10582, 10583, 10584, 10585, 10586, 10587, 10588, 10589, 10590, 10591, 10592, 10593, 10594, 10595, 10596, 10597, 10598, 10599, 10600, 10601, 10602, 10603, 10604, 10605, 10606, 10607, 10608, 10609, 10610, 10611, 10612, 10613, 10614, 10615, 10616, 10617, 10618, 10619, 10620, 10621, 10622, 10623, 10624, 10625, 10626, 10627, 10628, 10629, 10630, 10631, 10632, 10633, 10634, 10635, 10636, 10637, 10638, 10639, 10640, 10641, 10642, 10643, 10644, 10645, 10646, 10647, 10648, 10649, 10650, 10651, 10652, 10653, 10654, 10655, 10656, 10657, 10658, 10659, 10660, 10661, 10662, 10663, 10664, 10665, 10666, 10667, 10668, 10669, 10670, 10671, 10672, 10673, 10674, 10675, 10676, 10677, 10678, 10679, 10680, 10681, 10682, 10683, 10684, 10685, 10686, 10687, 10688, 10689, 10690, 10691, 10692, 10693, 10694, 10695, 10696, 10697, 10698, 10699, 10700, 10701, 10702, 10703, 10704, 10705, 10706, 10707, 10708, 10709, 10710, 10711, 10712, 10713, 10714, 10715, 10716, 10717, 10718, 10719, 10720, 10721, 10722, 10723, 10724, 10725, 10726, 10727, 10728, 10729, 10730, 10731, 10732, 10733, 10734, 10735, 10736, 10737, 10738, 10739, 10740, 10741, 10742, 10743, 10744, 10745, 10746, 10747, 10748, 10749, 10750, 10751, 10752, 10753, 10754, 10755, 10756, 10757, 10758, 10759, 10760, 10761, 10762, 10763, 10764, 10765, 10766, 10767, 10768, 10769, 10770, 10771, 10772, 10773, 10774, 10775, 10776, 10777, 10778, 10779, 10780, 10781, 10782, 10783, 10784, 10785, 10786, 10787, 10788, 10789, 10790, 10791, 10792, 10793, 10794, 10795, 10796, 10797, 10798, 10799, 10800, 10801, 10802, 10803, 10804, 10805, 10806, 10807, 10808, 10809, 10810, 10811, 10812, 10813, 10814, 10815, 10816, 10817, 10818, 10819, 10820, 10821, 10822, 10823, 10824, 10825, 10826, 10827, 10828, 10829, 10830, 10831, 10832, 10833, 10834, 10835, 10836, 10837, 10838, 10839, 10840, 10841, 10842, 10843, 10844, 10845, 10846, 10847, 10848, 10849, 10850, 10851, 10852, 10853, 10854, 10855, 10856, 10857, 10858, 10859, 10860, 10861, 10862, 10863, 10864, 10865, 10866, 10867, 10868, 10869, 10870, 10871, 10872, 10873, 10874, 10875, 10876, 10877, 10878, 10879, 10880, 10881, 10882, 10883, 10884, 10885, 10886, 10887, 10888, 10889, 10890, 10891, 10892, 10893, 10894, 10895, 10896, 10897, 10898, 10899, 10900, 10901, 10902, 10903, 10904, 10905, 10906, 10907, 10908, 10909, 10910, 10911, 10912, 10913, 10914, 10915, 10916, 10917, 10918, 10919, 10920, 10921, 10922, 10923, 10924, 10925, 10926, 10927, 10928, 10929, 10930, 10931, 10932, 10933, 10934, 10935, 10936, 10937, 10938, 10939, 10940, 10941, 10942, 10943, 10944, 10945, 10946, 10947, 10948, 10949, 10950, 10951, 10952, 10953, 10954, 10955, 10956, 10957, 10958, 10959, 10960, 10961, 10962, 10963, 10964, 10965, 10966, 10967, 10968, 10969, 10970, 10971, 10972, 10973, 10974, 10975, 10976, 10977, 10978, 10979, 10980, 10981, 10982, 10983, 10984, 10985, 10986, 10987, 10988, 10989, 10990, 10991, 10992, 10993, 10994, 10995, 10996, 10997, 10998, 10999, 11000, 11001, 11002, 11003, 11004, 11005, 11006, 11007, 11008, 11009, 11010, 11011, 11012, 11013, 11014, 11015, 11016, 11017, 11018, 11019, 11020, 11021, 11022, 11023, 11024, 11025, 11026, 11027, 11028, 11029, 11030, 11031, 11032, 11033, 11034, 11035, 11036, 11037, 11038, 11039, 11040, 11041, 11042, 11043, 11044, 11045, 11046, 11047, 11048, 11049, 11050, 11051, 11052, 11053, 11054, 11055, 11056, 11057, 11058, 11059, 11060, 11061, 11062, 11063, 11064, 11065, 11066, 11067, 11068, 11069, 11070, 11071, 11072, 11073, 11074, 11075, 11076, 11077, 11078, 11079, 11080, 11081, 11082, 11083, 11084, 11085, 11086, 11087, 11088, 11089, 11090, 11091, 11092, 11093, 11094, 11095, 11096, 11097, 11098, 11099, 11100, 11101, 11102, 11103, 11104, 11105, 11106, 11107, 11108, 11109, 11110, 11111, 11112, 11113, 11114, 11115, 11116, 11117, 11118, 11119, 11120, 11121, 11122, 11123, 11124, 11125, 11126, 11127, 11128, 11129, 11130, 11131, 11132, 11133, 11134, 11135, 11136, 11137, 11138, 11139, 11140, 11141, 11142, 11143, 11144, 11145, 11146, 11147, 11148, 11149, 11150, 11151, 11152, 11153, 11154, 11155, 11156, 11157, 11158, 11159, 11160, 11161, 11162, 11163, 11164, 11165, 11166, 11167, 11168, 11169, 11170, 11171, 11172, 11173, 11174, 11175, 11176, 11177, 11178, 11179, 11180, 11181, 11182, 11183, 11184, 11185, 11186, 11187, 11188, 11189, 11190, 11191, 11192, 11193, 11194, 11195, 11196, 11197, 11198, 11199, 11200, 11201, 11202, 11203, 11204, 11205, 11206, 11207, 11208, 11209, 11210, 11211, 11212, 11213, 11214, 11215, 11216, 11217, 11218, 11219, 11220, 11221, 11222, 11223, 11224, 11225, 11226, 11227, 11228, 11229, 11230, 11231, 11232, 11233, 11234, 11235, 11236, 11237, 11238, 11239, 11240, 11241, 11242, 11243, 11244, 11245, 11246, 11247, 11248, 11249, 11250, 11251, 11252, 11253, 11254, 11255, 11256, 11257, 11258, 11259, 11260, 11261, 11262, 11263, 11264, 11265, 11266, 11267, 11268, 11269, 11270, 11271, 11272, 11273, 11274, 11275, 11276, 11277, 11278, 11279, 11280, 11281, 11282, 11283, 11284, 11285, 11286, 11287, 11288, 11289, 11290, 11291, 11292, 11293, 11294, 11295, 11296, 11297, 11298, 11299, 11300, 11301, 11302, 11303, 11304, 11305, 11306, 11307, 11308, 11309, 11310, 11311, 11312, 11313, 11314, 11315, 11316, 11317, 11318, 11319, 11320, 11321, 11322, 11323, 11324, 11325, 11326, 11327, 11328, 11329, 11330, 11331, 11332, 11333, 11334, 11335, 11336, 11337, 11338, 11339, 11340, 11341, 11342, 11343, 11344, 11345, 11346, 11347, 11348, 11349, 11350, 11351, 11352, 11353, 11354, 11355, 11356, 11357, 11358, 11359, 11360, 11361, 11362, 11363, 11364, 11365, 11366, 11367, 11368, 11369, 11370, 11371, 11372, 11373, 11374, 11375, 11376, 11377, 11378, 11379, 11380, 11381, 11382, 11383, 11384, 11385, 11386, 11387, 11388, 11389, 11390, 11391, 11392, 11393, 11394, 11395, 11396, 11397, 11398, 11399, 11400, 11401, 11402, 11403, 11404, 11405, 11406, 11407, 11408, 11409, 11410, 11411, 11412, 11413, 11414, 11415, 11416, 11417, 11418, 11419, 11420, 11421, 11422, 11423, 11424, 11425, 11426, 11427, 11428, 11429, 11430, 11431, 11432, 11433, 11434, 11435, 11436, 11437, 11438, 11439, 11440, 11441, 11442, 11443, 11444, 11445, 11446, 11447, 11448, 11449, 11450, 11451, 11452, 11453, 11454, 11455, 11456, 11457, 11458, 11459, 11460, 11461, 11462, 11463, 11464, 11465, 11466, 11467, 11468, 11469, 11470, 11471, 11472, 11473, 11474, 11475, 11476, 11477, 11478, 11479, 11480, 11481, 11482, 11483, 11484, 11485, 11486, 11487, 11488, 11489, 11490, 11491, 11492, 11493, 11494, 11495, 11496, 11497, 11498, 11499, 11500, 11501, 11502, 11503, 11504, 11505, 11506, 11507, 11508, 11509, 11510, 11511, 11512, 11513, 11514, 11515, 11516, 11517, 11518, 11519, 11520, 11521, 11522, 11523, 11524, 11525, 11526, 11527, 11528, 11529, 11530, 11531, 11532, 11533, 11534, 11535, 11536, 11537, 11538, 11539, 11540, 11541, 11542, 11543, 11544, 11545, 11546, 11547, 11548, 11549, 11550, 11551, 11552, 11553, 11554, 11555, 11556, 11557, 11558, 11559, 11560, 11561, 11562, 11563, 11564, 11565, 11566, 11567, 11568, 11569, 11570, 11571, 11572, 11573, 11574, 11575, 11576, 11577, 11578, 11579, 11580, 11581, 11582, 11583, 11584, 11585, 11586, 11587, 11588, 11589, 11590, 11591, 11592, 11593, 11594, 11595, 11596, 11597, 11598, 11599, 11600, 11601, 11602, 11603, 11604, 11605, 11606, 11607, 11608, 11609, 11610, 11611, 11612, 11613, 11614, 11615, 11616, 11617, 11618, 11619, 11620, 11621, 11622, 11623, 11624, 11625, 11626, 11627, 11628, 11629, 11630, 11631, 11632, 11633, 11634, 11635, 11636, 11637, 11638, 11639, 11640, 11641, 11642, 11643, 11644, 11645, 11646, 11647, 11648, 11649, 11650, 11651, 11652, 11653, 11654, 11655, 11656, 11657, 11658, 11659, 11660, 11661, 11662, 11663, 11664, 11665, 11666, 11667, 11668, 11669, 11670, 11671, 11672, 11673, 11674, 11675, 11676, 11677, 11678, 11679, 11680, 11681, 11682, 11683, 11684, 11685, 11686, 11687, 11688, 11689, 11690, 11691, 11692, 11693, 11694, 11695, 11696, 11697, 11698, 11699, 11700, 11701, 11702, 11703, 11704, 11705, 11706, 11707, 11708, 11709, 11710, 11711, 11712, 11713, 11714, 11715, 11716, 11717, 11718, 11719, 11720, 11721, 11722, 11723, 11724, 11725, 11726, 11727, 11728, 11729, 11730, 11731, 11732, 11733, 11734, 11735, 11736, 11737, 11738, 11739, 11740, 11741, 11742, 11743, 11744, 11745, 11746, 11747, 11748, 11749, 11750, 11751, 11752, 11753, 11754, 11755, 11756, 11757, 11758, 11759, 11760, 11761, 11762, 11763, 11764, 11765, 11766, 11767, 11768, 11769, 11770, 11771, 11772, 11773, 11774, 11775, 11776, 11777, 11778, 11779, 11780, 11781, 11782, 11783, 11784, 11785, 11786, 11787, 11788, 11789, 11790, 11791, 11792, 11793, 11794, 11795, 11796, 11797, 11798, 11799, 11800, 11801, 11802, 11803, 11804, 11805, 11806, 11807, 11808, 11809, 11810, 11811, 11812, 11813, 11814, 11815, 11816, 11817, 11818, 11819, 11820, 11821, 11822, 11823, 11824, 11825, 11826, 11827, 11828, 11829, 11830, 11831, 11832, 11833, 11834, 11835, 11836, 11837, 11838, 11839, 11840, 11841, 11842, 11843, 11844, 11845, 11846, 11847, 11848, 11849, 11850, 11851, 11852, 11853, 11854, 11855, 11856, 11857, 11858, 11859, 11860, 11861, 11862, 11863, 11864, 11865, 11866, 11867, 11868, 11869, 11870, 11871, 11872, 11873, 11874, 11875, 11876, 11877, 11878, 11879, 11880, 11881, 11882, 11883, 11884, 11885, 11886, 11887, 11888, 11889, 11890, 11891, 11892, 11893, 11894, 11895, 11896, 11897, 11898, 11899, 11900, 11901, 11902, 11903, 11904, 11905, 11906, 11907, 11908, 11909, 11910, 11911, 11912, 11913, 11914, 11915, 11916, 11917, 11918, 11919, 11920, 11921, 11922, 11923, 11924, 11925, 11926, 11927, 11928, 11929, 11930, 11931, 11932, 11933, 11934, 11935, 11936, 11937, 11938, 11939, 11940, 11941, 11942, 11943, 11944, 11945, 11946, 11947, 11948, 11949, 11950, 11951, 11952, 11953, 11954, 11955, 11956, 11957, 11958, 11959, 11960, 11961, 11962, 11963, 11964, 11965, 11966, 11967, 11968, 11969, 11970, 11971, 11972, 11973, 11974, 11975, 11976, 11977, 11978, 11979, 11980, 11981, 11982, 11983, 11984, 11985, 11986, 11987, 11988, 11989, 11990, 11991, 11992, 11993, 11994, 11995, 11996, 11997, 11998, 11999, 12000, 12001, 12002, 12003, 12004, 12005, 12006, 12007, 12008, 12009, 12010, 12011, 12012, 12013, 12014, 12015, 12016, 12017, 12018, 12019, 12020, 12021, 12022, 12023, 12024, 12025, 12026, 12027, 12028, 12029, 12030, 12031, 12032, 12033, 12034, 12035, 12036, 12037, 12038, 12039, 12040, 12041, 12042, 12043, 12044, 12045, 12046, 12047, 12048, 12049, 12050, 12051, 12052, 12053, 12054, 12055, 12056, 12057, 12058, 12059, 12060, 12061, 12062, 12063, 12064, 12065, 12066, 12067, 12068, 12069, 12070, 12071, 12072, 12073, 12074, 12075, 12076, 12077, 12078, 12079, 12080, 12081, 12082, 12083, 12084, 12085, 12086, 12087, 12088, 12089, 12090, 12091, 12092, 12093, 12094, 12095, 12096, 12097, 12098, 12099, 12100, 12101, 12102, 12103, 12104, 12105, 12106, 12107, 12108, 12109, 12110, 12111, 12112, 12113, 12114, 12115, 12116, 12117, 12118, 12119, 12120, 12121, 12122, 12123, 12124, 12125, 12126, 12127, 12128, 12129, 12130, 12131, 12132, 12133, 12134, 12135, 12136, 12137, 12138, 12139, 12140, 12141, 12142, 12143, 12144, 12145, 12146, 12147, 12148, 12149, 12150, 12151, 12152, 12153, 12154, 12155, 12156, 12157, 12158, 12159, 12160, 12161, 12162, 12163, 12164, 12165, 12166, 12167, 12168, 12169, 12170, 12171, 12172, 12173, 12174, 12175, 12176, 12177, 12178, 12179, 12180, 12181, 12182, 12183, 12184, 12185, 12186, 12187, 12188, 12189, 12190, 12191, 12192, 12193, 12194, 12195, 12196, 12197, 12198, 12199, 12200, 12201, 12202, 12203, 12204, 12205, 12206, 12207, 12208, 12209, 12210, 12211, 12212, 12213, 12214, 12215, 12216, 12217, 12218, 12219, 12220, 12221, 12222, 12223, 12224, 12225, 12226, 12227, 12228, 12229, 12230, 12231, 12232, 12233, 12234, 12235, 12236, 12237, 12238, 12239, 12240, 12241, 12242, 12243, 12244, 12245, 12246, 12247, 12248, 12249, 12250, 12251, 12252, 12253, 12254, 12255, 12256, 12257, 12258, 12259, 12260, 12261, 12262, 12263, 12264, 12265, 12266, 12267, 12268, 12269, 12270, 12271, 12272, 12273, 12274, 12275, 12276, 12277, 12278, 12279, 12280, 12281, 12282, 12283, 12284, 12285, 12286, 12287, 12288, 12289, 12290, 12291, 12292, 12293, 12294, 12295, 12296, 12297, 12298, 12299, 12300, 12301, 12302, 12303, 12304, 12305, 12306, 12307, 12308, 12309, 12310, 12311, 12312, 12313, 12314, 12315, 12316, 12317, 12318, 12319, 12320, 12321, 12322, 12323, 12324, 12325, 12326, 12327, 12328, 12329, 12330, 12331, 12332, 12333, 12334, 12335, 12336, 12337, 12338, 12339, 12340, 12341, 12342, 12343, 12344, 12345, 12346, 12347, 12348, 12349, 12350, 12351, 12352, 12353, 12354, 12355, 12356, 12357, 12358, 12359, 12360, 12361, 12362, 12363, 12364, 12365, 12366, 12367, 12368, 12369, 12370, 12371, 12372, 12373, 12374, 12375, 12376, 12377, 12378, 12379, 12380, 12381, 12382, 12383, 12384, 12385, 12386, 12387, 12388, 12389, 12390, 12391, 12392, 12393, 12394, 12395, 12396, 12397, 12398, 12399, 12400, 12401, 12402, 12403, 12404, 12405, 12406, 12407, 12408, 12409, 12410, 12411, 12412, 12413, 12414, 12415, 12416, 12417, 12418, 12419, 12420, 12421, 12422, 12423, 12424, 12425, 12426, 12427, 12428, 12429, 12430, 12431, 12432, 12433, 12434, 12435, 12436, 12437, 12438, 12439, 12440, 12441, 12442, 12443, 12444, 12445, 12446, 12447, 12448, 12449, 12450, 12451, 12452, 12453, 12454, 12455, 12456, 12457, 12458, 12459, 12460, 12461, 12462, 12463, 12464, 12465, 12466, 12467, 12468, 12469, 12470, 12471, 12472, 12473, 12474, 12475, 12476, 12477, 12478, 12479, 12480, 12481, 12482, 12483, 12484, 12485, 12486, 12487, 12488, 12489, 12490, 12491, 12492, 12493, 12494, 12495, 12496, 12497, 12498, 12499, 12500, 12501, 12502, 12503, 12504, 12505, 12506, 12507, 12508, 12509, 12510, 12511, 12512, 12513, 12514, 12515, 12516, 12517, 12518, 12519, 12520, 12521, 12522, 12523, 12524, 12525, 12526, 12527, 12528, 12529, 12530, 12531, 12532, 12533, 12534, 12535, 12536, 12537, 12538, 12539, 12540, 12541, 12542, 12543, 12544, 12545, 12546, 12547, 12548, 12549, 12550, 12551, 12552, 12553, 12554, 12555, 12556, 12557, 12558, 12559, 12560, 12561, 12562, 12563, 12564, 12565, 12566, 12567, 12568, 12569, 12570, 12571, 12572, 12573, 12574, 12575, 12576, 12577, 12578, 12579, 12580, 12581, 12582, 12583, 12584, 12585, 12586, 12587, 12588, 12589, 12590, 12591, 12592, 12593, 12594, 12595, 12596, 12597, 12598, 12599, 12600, 12601, 12602, 12603, 12604, 12605, 12606, 12607, 12608, 12609, 12610, 12611, 12612, 12613, 12614, 12615, 12616, 12617, 12618, 12619, 12620, 12621, 12622, 12623, 12624, 12625, 12626, 12627, 12628, 12629, 12630, 12631, 12632, 12633, 12634, 12635, 12636, 12637, 12638, 12639, 12640, 12641, 12642, 12643, 12644, 12645, 12646, 12647, 12648, 12649, 12650, 12651, 12652, 12653, 12654, 12655, 12656, 12657, 12658, 12659, 12660, 12661, 12662, 12663, 12664, 12665, 12666, 12667, 12668, 12669, 12670, 12671, 12672, 12673, 12674, 12675, 12676, 12677, 12678, 12679, 12680, 12681, 12682, 12683, 12684, 12685, 12686, 12687, 12688, 12689, 12690, 12691, 12692, 12693, 12694, 12695, 12696, 12697, 12698, 12699, 12700, 12701, 12702, 12703, 12704, 12705, 12706, 12707, 12708, 12709, 12710, 12711, 12712, 12713, 12714, 12715, 12716, 12717, 12718, 12719, 12720, 12721, 12722, 12723, 12724, 12725, 12726, 12727, 12728, 12729, 12730, 12731, 12732, 12733, 12734, 12735, 12736, 12737, 12738, 12739, 12740, 12741, 12742, 12743, 12744, 12745, 12746, 12747, 12748, 12749, 12750, 12751, 12752, 12753, 12754, 12755, 12756, 12757, 12758, 12759, 12760, 12761, 12762, 12763, 12764, 12765, 12766, 12767, 12768, 12769, 12770, 12771, 12772, 12773, 12774, 12775, 12776, 12777, 12778, 12779, 12780, 12781, 12782, 12783, 12784, 12785, 12786, 12787, 12788, 12789, 12790, 12791, 12792, 12793, 12794, 12795, 12796, 12797, 12798, 12799, 12800, 12801, 12802, 12803, 12804, 12805, 12806, 12807, 12808, 12809, 12810, 12811, 12812, 12813, 12814, 12815, 12816, 12817, 12818, 12819, 12820, 12821, 12822, 12823, 12824, 12825, 12826, 12827, 12828, 12829, 12830, 12831, 12832, 12833, 12834, 12835, 12836, 12837, 12838, 12839, 12840, 12841, 12842, 12843, 12844, 12845, 12846, 12847, 12848, 12849, 12850, 12851, 12852, 12853, 12854, 12855, 12856, 12857, 12858, 12859, 12860, 12861, 12862, 12863, 12864, 12865, 12866, 12867, 12868, 12869, 12870, 12871, 12872, 12873, 12874, 12875, 12876, 12877, 12878, 12879, 12880, 12881, 12882, 12883, 12884, 12885, 12886, 12887, 12888, 12889, 12890, 12891, 12892, 12893, 12894, 12895, 12896, 12897, 12898, 12899, 12900, 12901, 12902, 12903, 12904, 12905, 12906, 12907, 12908, 12909, 12910, 12911, 12912, 12913, 12914, 12915, 12916, 12917, 12918, 12919, 12920, 12921, 12922, 12923, 12924, 12925, 12926, 12927, 12928, 12929, 12930, 12931, 12932, 12933, 12934, 12935, 12936, 12937, 12938, 12939, 12940, 12941, 12942, 12943, 12944, 12945, 12946, 12947, 12948, 12949, 12950, 12951, 12952, 12953, 12954, 12955, 12956, 12957, 12958, 12959, 12960, 12961, 12962, 12963, 12964, 12965, 12966, 12967, 12968, 12969, 12970, 12971, 12972, 12973, 12974, 12975, 12976, 12977, 12978, 12979, 12980, 12981, 12982, 12983, 12984, 12985, 12986, 12987, 12988, 12989, 12990, 12991, 12992, 12993, 12994, 12995, 12996, 12997, 12998, 12999, 13000, 13001, 13002, 13003, 13004, 13005, 13006, 13007, 13008, 13009, 13010, 13011, 13012, 13013, 13014, 13015, 13016, 13017, 13018, 13019, 13020, 13021, 13022, 13023, 13024, 13025, 13026, 13027, 13028, 13029, 13030, 13031, 13032, 13033, 13034, 13035, 13036, 13037, 13038, 13039, 13040, 13041, 13042, 13043, 13044, 13045, 13046, 13047, 13048, 13049, 13050, 13051, 13052, 13053, 13054, 13055, 13056, 13057, 13058, 13059, 13060, 13061, 13062, 13063, 13064, 13065, 13066, 13067, 13068, 13069, 13070, 13071, 13072, 13073, 13074, 13075, 13076, 13077, 13078, 13079, 13080, 13081, 13082, 13083, 13084, 13085, 13086, 13087, 13088, 13089, 13090, 13091, 13092, 13093, 13094, 13095, 13096, 13097, 13098, 13099, 13100, 13101, 13102, 13103, 13104, 13105, 13106, 13107, 13108, 13109, 13110, 13111, 13112, 13113, 13114, 13115, 13116, 13117, 13118, 13119, 13120, 13121, 13122, 13123, 13124, 13125, 13126, 13127, 13128, 13129, 13130, 13131, 13132, 13133, 13134, 13135, 13136, 13137, 13138, 13139, 13140, 13141, 13142, 13143, 13144, 13145, 13146, 13147, 13148, 13149, 13150, 13151, 13152, 13153, 13154, 13155, 13156, 13157, 13158, 13159, 13160, 13161, 13162, 13163, 13164, 13165, 13166, 13167, 13168, 13169, 13170, 13171, 13172, 13173, 13174, 13175, 13176, 13177, 13178, 13179, 13180, 13181, 13182, 13183, 13184, 13185, 13186, 13187, 13188, 13189, 13190, 13191, 13192, 13193, 13194, 13195, 13196, 13197, 13198, 13199, 13200, 13201, 13202, 13203, 13204, 13205, 13206, 13207, 13208, 13209, 13210, 13211, 13212, 13213, 13214, 13215, 13216, 13217, 13218, 13219, 13220, 13221, 13222, 13223, 13224, 13225, 13226, 13227, 13228, 13229, 13230, 13231, 13232, 13233, 13234, 13235, 13236, 13237, 13238, 13239, 13240, 13241, 13242, 13243, 13244, 13245, 13246, 13247, 13248, 13249, 13250, 13251, 13252, 13253, 13254, 13255, 13256, 13257, 13258, 13259, 13260, 13261, 13262, 13263, 13264, 13265, 13266, 13267, 13268, 13269, 13270, 13271, 13272, 13273, 13274, 13275, 13276, 13277, 13278, 13279, 13280, 13281, 13282, 13283, 13284, 13285, 13286, 13287, 13288, 13289, 13290, 13291, 13292, 13293, 13294, 13295, 13296, 13297, 13298, 13299, 13300, 13301, 13302, 13303, 13304, 13305, 13306, 13307, 13308, 13309, 13310, 13311, 13312, 13313, 13314, 13315, 13316, 13317, 13318, 13319, 13320, 13321, 13322, 13323, 13324, 13325, 13326, 13327, 13328, 13329, 13330, 13331, 13332, 13333, 13334, 13335, 13336, 13337, 13338, 13339, 13340, 13341, 13342, 13343, 13344, 13345, 13346, 13347, 13348, 13349, 13350, 13351, 13352, 13353, 13354, 13355, 13356, 13357, 13358, 13359, 13360, 13361, 13362, 13363, 13364, 13365, 13366, 13367, 13368, 13369, 13370, 13371, 13372, 13373, 13374, 13375, 13376, 13377, 13378, 13379, 13380, 13381, 13382, 13383, 13384, 13385, 13386, 13387, 13388, 13389, 13390, 13391, 13392, 13393, 13394, 13395, 13396, 13397, 13398, 13399, 13400, 13401, 13402, 13403, 13404, 13405, 13406, 13407, 13408, 13409, 13410, 13411, 13412, 13413, 13414, 13415, 13416, 13417, 13418, 13419, 13420, 13421, 13422, 13423, 13424, 13425, 13426, 13427, 13428, 13429, 13430, 13431, 13432, 13433, 13434, 13435, 13436, 13437, 13438, 13439, 13440, 13441, 13442, 13443, 13444, 13445, 13446, 13447, 13448, 13449, 13450, 13451, 13452, 13453, 13454, 13455, 13456, 13457, 13458, 13459, 13460, 13461, 13462, 13463, 13464, 13465, 13466, 13467, 13468, 13469, 13470, 13471, 13472, 13473, 13474, 13475, 13476, 13477, 13478, 13479, 13480, 13481, 13482, 13483, 13484, 13485, 13486, 13487, 13488, 13489, 13490, 13491, 13492, 13493, 13494, 13495, 13496, 13497, 13498, 13499, 13500, 13501, 13502, 13503, 13504, 13505, 13506, 13507, 13508, 13509, 13510, 13511, 13512, 13513, 13514, 13515, 13516, 13517, 13518, 13519, 13520, 13521, 13522, 13523, 13524, 13525, 13526, 13527, 13528, 13529, 13530, 13531, 13532, 13533, 13534, 13535, 13536, 13537, 13538, 13539, 13540, 13541, 13542, 13543, 13544, 13545, 13546, 13547, 13548, 13549, 13550, 13551, 13552, 13553, 13554, 13555, 13556, 13557, 13558, 13559, 13560, 13561, 13562, 13563, 13564, 13565, 13566, 13567, 13568, 13569, 13570, 13571, 13572, 13573, 13574, 13575, 13576, 13577, 13578, 13579, 13580, 13581, 13582, 13583, 13584, 13585, 13586, 13587, 13588, 13589, 13590, 13591, 13592, 13593, 13594, 13595, 13596, 13597, 13598, 13599, 13600, 13601, 13602, 13603, 13604, 13605, 13606, 13607, 13608, 13609, 13610, 13611, 13612, 13613, 13614, 13615, 13616, 13617, 13618, 13619, 13620, 13621, 13622, 13623, 13624, 13625, 13626, 13627, 13628, 13629, 13630, 13631, 13632, 13633, 13634, 13635, 13636, 13637, 13638, 13639, 13640, 13641, 13642, 13643, 13644, 13645, 13646, 13647, 13648, 13649, 13650, 13651, 13652, 13653, 13654, 13655, 13656, 13657, 13658, 13659, 13660, 13661, 13662, 13663, 13664, 13665, 13666, 13667, 13668, 13669, 13670, 13671, 13672, 13673, 13674, 13675, 13676, 13677, 13678, 13679, 13680, 13681, 13682, 13683, 13684, 13685, 13686, 13687, 13688, 13689, 13690, 13691, 13692, 13693, 13694, 13695, 13696, 13697, 13698, 13699, 13700, 13701, 13702, 13703, 13704, 13705, 13706, 13707, 13708, 13709, 13710, 13711, 13712, 13713, 13714, 13715, 13716, 13717, 13718, 13719, 13720, 13721, 13722, 13723, 13724, 13725, 13726, 13727, 13728, 13729, 13730, 13731, 13732, 13733, 13734, 13735, 13736, 13737, 13738, 13739, 13740, 13741, 13742, 13743, 13744, 13745, 13746, 13747, 13748, 13749, 13750, 13751, 13752, 13753, 13754, 13755, 13756, 13757, 13758, 13759, 13760, 13761, 13762, 13763, 13764, 13765, 13766, 13767, 13768, 13769, 13770, 13771, 13772, 13773, 13774, 13775, 13776, 13777, 13778, 13779, 13780, 13781, 13782, 13783, 13784, 13785, 13786, 13787, 13788, 13789, 13790, 13791, 13792, 13793, 13794, 13795, 13796, 13797, 13798, 13799, 13800, 13801, 13802, 13803, 13804, 13805, 13806, 13807, 13808, 13809, 13810, 13811, 13812, 13813, 13814, 13815, 13816, 13817, 13818, 13819, 13820, 13821, 13822, 13823, 13824, 13825, 13826, 13827, 13828, 13829, 13830, 13831, 13832, 13833, 13834, 13835, 13836, 13837, 13838, 13839, 13840, 13841, 13842, 13843, 13844, 13845, 13846, 13847, 13848, 13849, 13850, 13851, 13852, 13853, 13854, 13855, 13856, 13857, 13858, 13859, 13860, 13861, 13862, 13863, 13864, 13865, 13866, 13867, 13868, 13869, 13870, 13871, 13872, 13873, 13874, 13875, 13876, 13877, 13878, 13879, 13880, 13881, 13882, 13883, 13884, 13885, 13886, 13887, 13888, 13889, 13890, 13891, 13892, 13893, 13894, 13895, 13896, 13897, 13898, 13899, 13900, 13901, 13902, 13903, 13904, 13905, 13906, 13907, 13908, 13909, 13910, 13911, 13912, 13913, 13914, 13915, 13916, 13917, 13918, 13919, 13920, 13921, 13922, 13923, 13924, 13925, 13926, 13927, 13928, 13929, 13930, 13931, 13932, 13933, 13934, 13935, 13936, 13937, 13938, 13939, 13940, 13941, 13942, 13943, 13944, 13945, 13946, 13947, 13948, 13949, 13950, 13951, 13952, 13953, 13954, 13955, 13956, 13957, 13958, 13959, 13960, 13961, 13962, 13963, 13964, 13965, 13966, 13967, 13968, 13969, 13970, 13971, 13972, 13973, 13974, 13975, 13976, 13977, 13978, 13979, 13980, 13981, 13982, 13983, 13984, 13985, 13986, 13987, 13988, 13989, 13990, 13991, 13992, 13993, 13994, 13995, 13996, 13997, 13998, 13999, 14000, 14001, 14002, 14003, 14004, 14005, 14006, 14007, 14008, 14009, 14010, 14011, 14012, 14013, 14014, 14015, 14016, 14017, 14018, 14019, 14020, 14021, 14022, 14023, 14024, 14025, 14026, 14027, 14028, 14029, 14030, 14031, 14032, 14033, 14034, 14035, 14036, 14037, 14038, 14039, 14040, 14041, 14042, 14043, 14044, 14045, 14046, 14047, 14048, 14049, 14050, 14051, 14052, 14053, 14054, 14055, 14056, 14057, 14058, 14059, 14060, 14061, 14062, 14063, 14064, 14065, 14066, 14067, 14068, 14069, 14070, 14071, 14072, 14073, 14074, 14075, 14076, 14077, 14078, 14079, 14080, 14081, 14082, 14083, 14084, 14085, 14086, 14087, 14088, 14089, 14090, 14091, 14092, 14093, 14094, 14095, 14096, 14097, 14098, 14099, 14100, 14101, 14102, 14103, 14104, 14105, 14106, 14107, 14108, 14109, 14110, 14111, 14112, 14113, 14114, 14115, 14116, 14117, 14118, 14119, 14120, 14121, 14122, 14123, 14124, 14125, 14126, 14127, 14128, 14129, 14130, 14131, 14132, 14133, 14134, 14135, 14136, 14137, 14138, 14139, 14140, 14141, 14142, 14143, 14144, 14145, 14146, 14147, 14148, 14149, 14150, 14151, 14152, 14153, 14154, 14155, 14156, 14157, 14158, 14159, 14160, 14161, 14162, 14163, 14164, 14165, 14166, 14167, 14168, 14169, 14170, 14171, 14172, 14173, 14174, 14175, 14176, 14177, 14178, 14179, 14180, 14181, 14182, 14183, 14184, 14185, 14186, 14187, 14188, 14189, 14190, 14191, 14192, 14193, 14194, 14195, 14196, 14197, 14198, 14199, 14200, 14201, 14202, 14203, 14204, 14205, 14206, 14207, 14208, 14209, 14210, 14211, 14212, 14213, 14214, 14215, 14216, 14217, 14218, 14219, 14220, 14221, 14222, 14223, 14224, 14225, 14226, 14227, 14228, 14229, 14230, 14231, 14232, 14233, 14234, 14235, 14236, 14237, 14238, 14239, 14240, 14241, 14242, 14243, 14244, 14245, 14246, 14247, 14248, 14249, 14250, 14251, 14252, 14253, 14254, 14255, 14256, 14257, 14258, 14259, 14260, 14261, 14262, 14263, 14264, 14265, 14266, 14267, 14268, 14269, 14270, 14271, 14272, 14273, 14274, 14275, 14276, 14277, 14278, 14279, 14280, 14281, 14282, 14283, 14284, 14285, 14286, 14287, 14288, 14289, 14290, 14291, 14292, 14293, 14294, 14295, 14296, 14297, 14298, 14299, 14300, 14301, 14302, 14303, 14304, 14305, 14306, 14307, 14308, 14309, 14310, 14311, 14312, 14313, 14314, 14315, 14316, 14317, 14318, 14319, 14320, 14321, 14322, 14323, 14324, 14325, 14326, 14327, 14328, 14329, 14330, 14331, 14332, 14333, 14334, 14335, 14336, 14337, 14338, 14339, 14340, 14341, 14342, 14343, 14344, 14345, 14346, 14347, 14348, 14349, 14350, 14351, 14352, 14353, 14354, 14355, 14356, 14357, 14358, 14359, 14360, 14361, 14362, 14363, 14364, 14365, 14366, 14367, 14368, 14369, 14370, 14371, 14372, 14373, 14374, 14375, 14376, 14377, 14378, 14379, 14380, 14381, 14382, 14383, 14384, 14385, 14386, 14387, 14388, 14389, 14390, 14391, 14392, 14393, 14394, 14395, 14396, 14397, 14398, 14399, 14400, 14401, 14402, 14403, 14404, 14405, 14406, 14407, 14408, 14409, 14410, 14411, 14412, 14413, 14414, 14415, 14416, 14417, 14418, 14419, 14420, 14421, 14422, 14423, 14424, 14425, 14426, 14427, 14428, 14429, 14430, 14431, 14432, 14433, 14434, 14435, 14436, 14437, 14438, 14439, 14440, 14441, 14442, 14443, 14444, 14445, 14446, 14447, 14448, 14449, 14450, 14451, 14452, 14453, 14454, 14455, 14456, 14457, 14458, 14459, 14460, 14461, 14462, 14463, 14464, 14465, 14466, 14467, 14468, 14469, 14470, 14471, 14472, 14473, 14474, 14475, 14476, 14477, 14478, 14479, 14480, 14481, 14482, 14483, 14484, 14485, 14486, 14487, 14488, 14489, 14490, 14491, 14492, 14493, 14494, 14495, 14496, 14497, 14498, 14499, 14500, 14501, 14502, 14503, 14504, 14505, 14506, 14507, 14508, 14509, 14510, 14511, 14512, 14513, 14514, 14515, 14516, 14517, 14518, 14519, 14520, 14521, 14522, 14523, 14524, 14525, 14526, 14527, 14528, 14529, 14530, 14531, 14532, 14533, 14534, 14535, 14536, 14537, 14538, 14539, 14540, 14541, 14542, 14543, 14544, 14545, 14546, 14547, 14548, 14549, 14550, 14551, 14552, 14553, 14554, 14555, 14556, 14557, 14558, 14559, 14560, 14561, 14562, 14563, 14564, 14565, 14566, 14567, 14568, 14569, 14570, 14571, 14572, 14573, 14574, 14575, 14576, 14577, 14578, 14579, 14580, 14581, 14582, 14583, 14584, 14585, 14586, 14587, 14588, 14589, 14590, 14591, 14592, 14593, 14594, 14595, 14596, 14597, 14598, 14599, 14600, 14601, 14602, 14603, 14604, 14605, 14606, 14607, 14608, 14609, 14610, 14611, 14612, 14613, 14614, 14615, 14616, 14617, 14618, 14619, 14620, 14621, 14622, 14623, 14624, 14625, 14626, 14627, 14628, 14629, 14630, 14631, 14632, 14633, 14634, 14635, 14636, 14637, 14638, 14639, 14640, 14641, 14642, 14643, 14644, 14645, 14646, 14647, 14648, 14649, 14650, 14651, 14652, 14653, 14654, 14655, 14656, 14657, 14658, 14659, 14660, 14661, 14662, 14663, 14664, 14665, 14666, 14667, 14668, 14669, 14670, 14671, 14672, 14673, 14674, 14675, 14676, 14677, 14678, 14679, 14680, 14681, 14682, 14683, 14684, 14685, 14686, 14687, 14688, 14689, 14690, 14691, 14692, 14693, 14694, 14695, 14696, 14697, 14698, 14699, 14700, 14701, 14702, 14703, 14704, 14705, 14706, 14707, 14708, 14709, 14710, 14711, 14712, 14713, 14714, 14715, 14716, 14717, 14718, 14719, 14720, 14721, 14722, 14723, 14724, 14725, 14726, 14727, 14728, 14729, 14730, 14731, 14732, 14733, 14734, 14735, 14736, 14737, 14738, 14739, 14740, 14741, 14742, 14743, 14744, 14745, 14746, 14747, 14748, 14749, 14750, 14751, 14752, 14753, 14754, 14755, 14756, 14757, 14758, 14759, 14760, 14761, 14762, 14763, 14764, 14765, 14766, 14767, 14768, 14769, 14770, 14771, 14772, 14773, 14774, 14775, 14776, 14777, 14778, 14779, 14780, 14781, 14782, 14783, 14784, 14785, 14786, 14787, 14788, 14789, 14790, 14791, 14792, 14793, 14794, 14795, 14796, 14797, 14798, 14799, 14800, 14801, 14802, 14803, 14804, 14805, 14806, 14807, 14808, 14809, 14810, 14811, 14812, 14813, 14814, 14815, 14816, 14817, 14818, 14819, 14820, 14821, 14822, 14823, 14824, 14825, 14826, 14827, 14828, 14829, 14830, 14831, 14832, 14833, 14834, 14835, 14836, 14837, 14838, 14839, 14840, 14841, 14842, 14843, 14844, 14845, 14846, 14847, 14848, 14849, 14850, 14851, 14852, 14853, 14854, 14855, 14856, 14857, 14858, 14859, 14860, 14861, 14862, 14863, 14864, 14865, 14866, 14867, 14868, 14869, 14870, 14871, 14872, 14873, 14874, 14875, 14876, 14877, 14878, 14879, 14880, 14881, 14882, 14883, 14884, 14885, 14886, 14887, 14888, 14889, 14890, 14891, 14892, 14893, 14894, 14895, 14896, 14897, 14898, 14899, 14900, 14901, 14902, 14903, 14904, 14905, 14906, 14907, 14908, 14909, 14910, 14911, 14912, 14913, 14914, 14915, 14916, 14917, 14918, 14919, 14920, 14921, 14922, 14923, 14924, 14925, 14926, 14927, 14928, 14929, 14930, 14931, 14932, 14933, 14934, 14935, 14936, 14937, 14938, 14939, 14940, 14941, 14942, 14943, 14944, 14945, 14946, 14947, 14948, 14949, 14950, 14951, 14952, 14953, 14954, 14955, 14956, 14957, 14958, 14959, 14960, 14961, 14962, 14963, 14964, 14965, 14966, 14967, 14968, 14969, 14970, 14971, 14972, 14973, 14974, 14975, 14976, 14977, 14978, 14979, 14980, 14981, 14982, 14983, 14984, 14985, 14986, 14987, 14988, 14989, 14990, 14991, 14992, 14993, 14994, 14995, 14996, 14997, 14998, 14999, 15000, 15001, 15002, 15003, 15004, 15005, 15006, 15007, 15008, 15009, 15010, 15011, 15012, 15013, 15014, 15015, 15016, 15017, 15018, 15019, 15020, 15021, 15022, 15023, 15024, 15025, 15026, 15027, 15028, 15029, 15030, 15031, 15032, 15033, 15034, 15035, 15036, 15037, 15038, 15039, 15040, 15041, 15042, 15043, 15044, 15045, 15046, 15047, 15048, 15049, 15050, 15051, 15052, 15053, 15054, 15055, 15056, 15057, 15058, 15059, 15060, 15061, 15062, 15063, 15064, 15065, 15066, 15067, 15068, 15069, 15070, 15071, 15072, 15073, 15074, 15075, 15076, 15077, 15078, 15079, 15080, 15081, 15082, 15083, 15084, 15085, 15086, 15087, 15088, 15089, 15090, 15091, 15092, 15093, 15094, 15095, 15096, 15097, 15098, 15099, 15100, 15101, 15102, 15103, 15104, 15105, 15106, 15107, 15108, 15109, 15110, 15111, 15112, 15113, 15114, 15115, 15116, 15117, 15118, 15119, 15120, 15121, 15122, 15123, 15124, 15125, 15126, 15127, 15128, 15129, 15130, 15131, 15132, 15133, 15134, 15135, 15136, 15137, 15138, 15139, 15140, 15141, 15142, 15143, 15144, 15145, 15146, 15147, 15148, 15149, 15150, 15151, 15152, 15153, 15154, 15155, 15156, 15157, 15158, 15159, 15160, 15161, 15162, 15163, 15164, 15165, 15166, 15167, 15168, 15169, 15170, 15171, 15172, 15173, 15174, 15175, 15176, 15177, 15178, 15179, 15180, 15181, 15182, 15183, 15184, 15185, 15186, 15187, 15188, 15189, 15190, 15191, 15192, 15193, 15194, 15195, 15196, 15197, 15198, 15199, 15200, 15201, 15202, 15203, 15204, 15205, 15206, 15207, 15208, 15209, 15210, 15211, 15212, 15213, 15214, 15215, 15216, 15217, 15218, 15219, 15220, 15221, 15222, 15223, 15224, 15225, 15226, 15227, 15228, 15229, 15230, 15231, 15232, 15233, 15234, 15235, 15236, 15237, 15238, 15239, 15240, 15241, 15242, 15243, 15244, 15245, 15246, 15247, 15248, 15249, 15250, 15251, 15252, 15253, 15254, 15255, 15256, 15257, 15258, 15259, 15260, 15261, 15262, 15263, 15264, 15265, 15266, 15267, 15268, 15269, 15270, 15271, 15272, 15273, 15274, 15275, 15276, 15277, 15278, 15279, 15280, 15281, 15282, 15283, 15284, 15285, 15286, 15287, 15288, 15289, 15290, 15291, 15292, 15293, 15294, 15295, 15296, 15297, 15298, 15299, 15300, 15301, 15302, 15303, 15304, 15305, 15306, 15307, 15308, 15309, 15310, 15311, 15312, 15313, 15314, 15315, 15316, 15317, 15318, 15319, 15320, 15321, 15322, 15323, 15324, 15325, 15326, 15327, 15328, 15329, 15330, 15331, 15332, 15333, 15334, 15335, 15336, 15337, 15338, 15339, 15340, 15341, 15342, 15343, 15344, 15345, 15346, 15347, 15348, 15349, 15350, 15351, 15352, 15353, 15354, 15355, 15356, 15357, 15358, 15359, 15360, 15361, 15362, 15363, 15364, 15365, 15366, 15367, 15368, 15369, 15370, 15371, 15372, 15373, 15374, 15375, 15376, 15377, 15378, 15379, 15380, 15381, 15382, 15383, 15384, 15385, 15386, 15387, 15388, 15389, 15390, 15391, 15392, 15393, 15394, 15395, 15396, 15397, 15398, 15399, 15400, 15401, 15402, 15403, 15404, 15405, 15406, 15407, 15408, 15409, 15410, 15411, 15412, 15413, 15414, 15415, 15416, 15417, 15418, 15419, 15420, 15421, 15422, 15423, 15424, 15425, 15426, 15427, 15428, 15429, 15430, 15431, 15432, 15433, 15434, 15435, 15436, 15437, 15438, 15439, 15440, 15441, 15442, 15443, 15444, 15445, 15446, 15447, 15448, 15449, 15450, 15451, 15452, 15453, 15454, 15455, 15456, 15457, 15458, 15459, 15460, 15461, 15462, 15463, 15464, 15465, 15466, 15467, 15468, 15469, 15470, 15471, 15472, 15473, 15474, 15475, 15476, 15477, 15478, 15479, 15480, 15481, 15482, 15483, 15484, 15485, 15486, 15487, 15488, 15489, 15490, 15491, 15492, 15493, 15494, 15495, 15496, 15497, 15498, 15499, 15500, 15501, 15502, 15503, 15504, 15505, 15506, 15507, 15508, 15509, 15510, 15511, 15512, 15513, 15514, 15515, 15516, 15517, 15518, 15519, 15520, 15521, 15522, 15523, 15524, 15525, 15526, 15527, 15528, 15529, 15530, 15531, 15532, 15533, 15534, 15535, 15536, 15537, 15538, 15539, 15540, 15541, 15542, 15543, 15544, 15545, 15546, 15547, 15548, 15549, 15550, 15551, 15552, 15553, 15554, 15555, 15556, 15557, 15558, 15559, 15560, 15561, 15562, 15563, 15564, 15565, 15566, 15567, 15568, 15569, 15570, 15571, 15572, 15573, 15574, 15575, 15576, 15577, 15578, 15579, 15580, 15581, 15582, 15583, 15584, 15585, 15586, 15587, 15588, 15589, 15590, 15591, 15592, 15593, 15594, 15595, 15596, 15597, 15598, 15599, 15600, 15601, 15602, 15603, 15604, 15605, 15606, 15607, 15608, 15609, 15610, 15611, 15612, 15613, 15614, 15615, 15616, 15617, 15618, 15619, 15620, 15621, 15622, 15623, 15624, 15625, 15626, 15627, 15628, 15629, 15630, 15631, 15632, 15633, 15634, 15635, 15636, 15637, 15638, 15639, 15640, 15641, 15642, 15643, 15644, 15645, 15646, 15647, 15648, 15649, 15650, 15651, 15652, 15653, 15654, 15655, 15656, 15657, 15658, 15659, 15660, 15661, 15662, 15663, 15664, 15665, 15666, 15667, 15668, 15669, 15670, 15671, 15672, 15673, 15674, 15675, 15676, 15677, 15678, 15679, 15680, 15681, 15682, 15683, 15684, 15685, 15686, 15687, 15688, 15689, 15690, 15691, 15692, 15693, 15694, 15695, 15696, 15697, 15698, 15699, 15700, 15701, 15702, 15703, 15704, 15705, 15706, 15707, 15708, 15709, 15710, 15711, 15712, 15713, 15714, 15715, 15716, 15717, 15718, 15719, 15720, 15721, 15722, 15723, 15724, 15725, 15726, 15727, 15728, 15729, 15730, 15731, 15732, 15733, 15734, 15735, 15736, 15737, 15738, 15739, 15740, 15741, 15742, 15743, 15744, 15745, 15746, 15747, 15748, 15749, 15750, 15751, 15752, 15753, 15754, 15755, 15756, 15757, 15758, 15759, 15760, 15761, 15762, 15763, 15764, 15765, 15766, 15767, 15768, 15769, 15770, 15771, 15772, 15773, 15774, 15775, 15776, 15777, 15778, 15779, 15780, 15781, 15782, 15783, 15784, 15785, 15786, 15787, 15788, 15789, 15790, 15791, 15792, 15793, 15794, 15795, 15796, 15797, 15798, 15799, 15800, 15801, 15802, 15803, 15804, 15805, 15806, 15807, 15808, 15809, 15810, 15811, 15812, 15813, 15814, 15815, 15816, 15817, 15818, 15819, 15820, 15821, 15822, 15823, 15824, 15825, 15826, 15827, 15828, 15829, 15830, 15831, 15832, 15833, 15834, 15835, 15836, 15837, 15838, 15839, 15840, 15841, 15842, 15843, 15844, 15845, 15846, 15847, 15848, 15849, 15850, 15851, 15852, 15853, 15854, 15855, 15856, 15857, 15858, 15859, 15860, 15861, 15862, 15863, 15864, 15865, 15866, 15867, 15868, 15869, 15870, 15871, 15872, 15873, 15874, 15875, 15876, 15877, 15878, 15879, 15880, 15881, 15882, 15883, 15884, 15885, 15886, 15887, 15888, 15889, 15890, 15891, 15892, 15893, 15894, 15895, 15896, 15897, 15898, 15899, 15900, 15901, 15902, 15903, 15904, 15905, 15906, 15907, 15908, 15909, 15910, 15911, 15912, 15913, 15914, 15915, 15916, 15917, 15918, 15919, 15920, 15921, 15922, 15923, 15924, 15925, 15926, 15927, 15928, 15929, 15930, 15931, 15932, 15933, 15934, 15935, 15936, 15937, 15938, 15939, 15940, 15941, 15942, 15943, 15944, 15945, 15946, 15947, 15948, 15949, 15950, 15951, 15952, 15953, 15954, 15955, 15956, 15957, 15958, 15959, 15960, 15961, 15962, 15963, 15964, 15965, 15966, 15967, 15968, 15969, 15970, 15971, 15972, 15973, 15974, 15975, 15976, 15977, 15978, 15979, 15980, 15981, 15982, 15983, 15984, 15985, 15986, 15987, 15988, 15989, 15990, 15991, 15992, 15993, 15994, 15995, 15996, 15997, 15998, 15999, 16000, 16001, 16002, 16003, 16004, 16005, 16006, 16007, 16008, 16009, 16010, 16011, 16012, 16013, 16014, 16015, 16016, 16017, 16018, 16019, 16020, 16021, 16022, 16023, 16024, 16025, 16026, 16027, 16028, 16029, 16030, 16031, 16032, 16033, 16034, 16035, 16036, 16037, 16038, 16039, 16040, 16041, 16042, 16043, 16044, 16045, 16046, 16047, 16048, 16049, 16050, 16051, 16052, 16053, 16054, 16055, 16056, 16057, 16058, 16059, 16060, 16061, 16062, 16063, 16064, 16065, 16066, 16067, 16068, 16069, 16070, 16071, 16072, 16073, 16074, 16075, 16076, 16077, 16078, 16079, 16080, 16081, 16082, 16083, 16084, 16085, 16086, 16087, 16088, 16089, 16090, 16091, 16092, 16093, 16094, 16095, 16096, 16097, 16098, 16099, 16100, 16101, 16102, 16103, 16104, 16105, 16106, 16107, 16108, 16109, 16110, 16111, 16112, 16113, 16114, 16115, 16116, 16117, 16118, 16119, 16120, 16121, 16122, 16123, 16124, 16125, 16126, 16127, 16128, 16129, 16130, 16131, 16132, 16133, 16134, 16135, 16136, 16137, 16138, 16139, 16140, 16141, 16142, 16143, 16144, 16145, 16146, 16147, 16148, 16149, 16150, 16151, 16152, 16153, 16154, 16155, 16156, 16157, 16158, 16159, 16160, 16161, 16162, 16163, 16164, 16165, 16166, 16167, 16168, 16169, 16170, 16171, 16172, 16173, 16174, 16175, 16176, 16177, 16178, 16179, 16180, 16181, 16182, 16183, 16184, 16185, 16186, 16187, 16188, 16189, 16190, 16191, 16192, 16193, 16194, 16195, 16196, 16197, 16198, 16199, 16200, 16201, 16202, 16203, 16204, 16205, 16206, 16207, 16208, 16209, 16210, 16211, 16212, 16213, 16214, 16215, 16216, 16217, 16218, 16219, 16220, 16221, 16222, 16223, 16224, 16225, 16226, 16227, 16228, 16229, 16230, 16231, 16232, 16233, 16234, 16235, 16236, 16237, 16238, 16239, 16240, 16241, 16242, 16243, 16244, 16245, 16246, 16247, 16248, 16249, 16250, 16251, 16252, 16253, 16254, 16255, 16256, 16257, 16258, 16259, 16260, 16261, 16262, 16263, 16264, 16265, 16266, 16267, 16268, 16269, 16270, 16271, 16272, 16273, 16274, 16275, 16276, 16277, 16278, 16279, 16280, 16281, 16282, 16283, 16284, 16285, 16286, 16287, 16288, 16289, 16290, 16291, 16292, 16293, 16294, 16295, 16296, 16297, 16298, 16299, 16300, 16301, 16302, 16303, 16304, 16305, 16306, 16307, 16308, 16309, 16310, 16311, 16312, 16313, 16314, 16315, 16316, 16317, 16318, 16319, 16320, 16321, 16322, 16323, 16324, 16325, 16326, 16327, 16328, 16329, 16330, 16331, 16332, 16333, 16334, 16335, 16336, 16337, 16338, 16339, 16340, 16341, 16342, 16343, 16344, 16345, 16346, 16347, 16348, 16349, 16350, 16351, 16352, 16353, 16354, 16355, 16356, 16357, 16358, 16359, 16360, 16361, 16362, 16363, 16364, 16365, 16366, 16367, 16368, 16369, 16370, 16371, 16372, 16373, 16374, 16375, 16376, 16377, 16378, 16379, 16380, 16381, 16382, 16383, 16384, 16385, 16386, 16387, 16388, 16389, 16390, 16391, 16392, 16393, 16394, 16395, 16396, 16397, 16398, 16399, 16400, 16401, 16402, 16403, 16404, 16405, 16406, 16407, 16408, 16409, 16410, 16411, 16412, 16413, 16414, 16415, 16416, 16417, 16418, 16419, 16420, 16421, 16422, 16423, 16424, 16425, 16426, 16427, 16428, 16429, 16430, 16431, 16432, 16433, 16434, 16435, 16436, 16437, 16438, 16439, 16440, 16441, 16442, 16443, 16444, 16445, 16446, 16447, 16448, 16449, 16450, 16451, 16452, 16453, 16454, 16455, 16456, 16457, 16458, 16459, 16460, 16461, 16462, 16463, 16464, 16465, 16466, 16467, 16468, 16469, 16470, 16471, 16472, 16473, 16474, 16475, 16476, 16477, 16478, 16479, 16480, 16481, 16482, 16483, 16484, 16485, 16486, 16487, 16488, 16489, 16490, 16491, 16492, 16493, 16494, 16495, 16496, 16497, 16498, 16499, 16500, 16501, 16502, 16503, 16504, 16505, 16506, 16507, 16508, 16509, 16510, 16511, 16512, 16513, 16514, 16515, 16516, 16517, 16518, 16519, 16520, 16521, 16522, 16523, 16524, 16525, 16526, 16527, 16528, 16529, 16530, 16531, 16532, 16533, 16534, 16535, 16536, 16537, 16538, 16539, 16540, 16541, 16542, 16543, 16544, 16545, 16546, 16547, 16548, 16549, 16550, 16551, 16552, 16553, 16554, 16555, 16556, 16557, 16558, 16559, 16560, 16561, 16562, 16563, 16564, 16565, 16566, 16567, 16568, 16569, 16570, 16571, 16572, 16573, 16574, 16575, 16576, 16577, 16578, 16579, 16580, 16581, 16582, 16583, 16584, 16585, 16586, 16587, 16588, 16589, 16590, 16591, 16592, 16593, 16594, 16595, 16596, 16597, 16598, 16599, 16600, 16601, 16602, 16603, 16604, 16605, 16606, 16607, 16608, 16609, 16610, 16611, 16612, 16613, 16614, 16615, 16616, 16617, 16618, 16619, 16620, 16621, 16622, 16623, 16624, 16625, 16626, 16627, 16628, 16629, 16630, 16631, 16632, 16633, 16634, 16635, 16636, 16637, 16638, 16639, 16640, 16641, 16642, 16643, 16644, 16645, 16646, 16647, 16648, 16649, 16650, 16651, 16652, 16653, 16654, 16655, 16656, 16657, 16658, 16659, 16660, 16661, 16662, 16663, 16664, 16665, 16666, 16667, 16668, 16669, 16670, 16671, 16672, 16673, 16674, 16675, 16676, 16677, 16678, 16679, 16680, 16681, 16682, 16683, 16684, 16685, 16686, 16687, 16688, 16689, 16690, 16691, 16692, 16693, 16694, 16695, 16696, 16697, 16698, 16699, 16700, 16701, 16702, 16703, 16704, 16705, 16706, 16707, 16708, 16709, 16710, 16711, 16712, 16713, 16714, 16715, 16716, 16717, 16718, 16719, 16720, 16721, 16722, 16723, 16724, 16725, 16726, 16727, 16728, 16729, 16730, 16731, 16732, 16733, 16734, 16735, 16736, 16737, 16738, 16739, 16740, 16741, 16742, 16743, 16744, 16745, 16746, 16747, 16748, 16749, 16750, 16751, 16752, 16753, 16754, 16755, 16756, 16757, 16758, 16759, 16760, 16761, 16762, 16763, 16764, 16765, 16766, 16767, 16768, 16769, 16770, 16771, 16772, 16773, 16774, 16775, 16776, 16777, 16778, 16779, 16780, 16781, 16782, 16783, 16784, 16785, 16786, 16787, 16788, 16789, 16790, 16791, 16792, 16793, 16794, 16795, 16796, 16797, 16798, 16799, 16800, 16801, 16802, 16803, 16804, 16805, 16806, 16807, 16808, 16809, 16810, 16811, 16812, 16813, 16814, 16815, 16816, 16817, 16818, 16819, 16820, 16821, 16822, 16823, 16824, 16825, 16826, 16827, 16828, 16829, 16830, 16831, 16832, 16833, 16834, 16835, 16836, 16837, 16838, 16839, 16840, 16841, 16842, 16843, 16844, 16845, 16846, 16847, 16848, 16849, 16850, 16851, 16852, 16853, 16854, 16855, 16856, 16857, 16858, 16859, 16860, 16861, 16862, 16863, 16864, 16865, 16866, 16867, 16868, 16869, 16870, 16871, 16872, 16873, 16874, 16875, 16876, 16877, 16878, 16879, 16880, 16881, 16882, 16883, 16884, 16885, 16886, 16887, 16888, 16889, 16890, 16891, 16892, 16893, 16894, 16895, 16896, 16897, 16898, 16899, 16900, 16901, 16902, 16903, 16904, 16905, 16906, 16907, 16908, 16909, 16910, 16911, 16912, 16913, 16914, 16915, 16916, 16917, 16918, 16919, 16920, 16921, 16922, 16923, 16924, 16925, 16926, 16927, 16928, 16929, 16930, 16931, 16932, 16933, 16934, 16935, 16936, 16937, 16938, 16939, 16940, 16941, 16942, 16943, 16944, 16945, 16946, 16947, 16948, 16949, 16950, 16951, 16952, 16953, 16954, 16955, 16956, 16957, 16958, 16959, 16960, 16961, 16962, 16963, 16964, 16965, 16966, 16967, 16968, 16969, 16970, 16971, 16972, 16973, 16974, 16975, 16976, 16977, 16978, 16979, 16980, 16981, 16982, 16983, 16984, 16985, 16986, 16987, 16988, 16989, 16990, 16991, 16992, 16993, 16994, 16995, 16996, 16997, 16998, 16999, 17000, 17001, 17002, 17003, 17004, 17005, 17006, 17007, 17008, 17009, 17010, 17011, 17012, 17013, 17014, 17015, 17016, 17017, 17018, 17019, 17020, 17021, 17022, 17023, 17024, 17025, 17026, 17027, 17028, 17029, 17030, 17031, 17032, 17033, 17034, 17035, 17036, 17037, 17038, 17039, 17040, 17041, 17042, 17043, 17044, 17045, 17046, 17047, 17048, 17049, 17050, 17051, 17052, 17053, 17054, 17055, 17056, 17057, 17058, 17059, 17060, 17061, 17062, 17063, 17064, 17065, 17066, 17067, 17068, 17069, 17070, 17071, 17072, 17073, 17074, 17075, 17076, 17077, 17078, 17079, 17080, 17081, 17082, 17083, 17084, 17085, 17086, 17087, 17088, 17089, 17090, 17091, 17092, 17093, 17094, 17095, 17096, 17097, 17098, 17099, 17100, 17101, 17102, 17103, 17104, 17105, 17106, 17107, 17108, 17109, 17110, 17111, 17112, 17113, 17114, 17115, 17116, 17117, 17118, 17119, 17120, 17121, 17122, 17123, 17124, 17125, 17126, 17127, 17128, 17129, 17130, 17131, 17132, 17133, 17134, 17135, 17136, 17137, 17138, 17139, 17140, 17141, 17142, 17143, 17144, 17145, 17146, 17147, 17148, 17149, 17150, 17151, 17152, 17153, 17154, 17155, 17156, 17157, 17158, 17159, 17160, 17161, 17162, 17163, 17164, 17165, 17166, 17167, 17168, 17169, 17170, 17171, 17172, 17173, 17174, 17175, 17176, 17177, 17178, 17179, 17180, 17181, 17182, 17183, 17184, 17185, 17186, 17187, 17188, 17189, 17190, 17191, 17192, 17193, 17194, 17195, 17196, 17197, 17198, 17199, 17200, 17201, 17202, 17203, 17204, 17205, 17206, 17207, 17208, 17209, 17210, 17211, 17212, 17213, 17214, 17215, 17216, 17217, 17218, 17219, 17220, 17221, 17222, 17223, 17224, 17225, 17226, 17227, 17228, 17229, 17230, 17231, 17232, 17233, 17234, 17235, 17236, 17237, 17238, 17239, 17240, 17241, 17242, 17243, 17244, 17245, 17246, 17247, 17248, 17249, 17250, 17251, 17252, 17253, 17254, 17255, 17256, 17257, 17258, 17259, 17260, 17261, 17262, 17263, 17264, 17265, 17266, 17267, 17268, 17269, 17270, 17271, 17272, 17273, 17274, 17275, 17276, 17277, 17278, 17279, 17280, 17281, 17282, 17283, 17284, 17285, 17286, 17287, 17288, 17289, 17290, 17291, 17292, 17293, 17294, 17295, 17296, 17297, 17298, 17299, 17300, 17301, 17302, 17303, 17304, 17305, 17306, 17307, 17308, 17309, 17310, 17311, 17312, 17313, 17314, 17315, 17316, 17317, 17318, 17319, 17320, 17321, 17322, 17323, 17324, 17325, 17326, 17327, 17328, 17329, 17330, 17331, 17332, 17333, 17334, 17335, 17336, 17337, 17338, 17339, 17340, 17341, 17342, 17343, 17344, 17345, 17346, 17347, 17348, 17349, 17350, 17351, 17352, 17353, 17354, 17355, 17356, 17357, 17358, 17359, 17360, 17361, 17362, 17363, 17364, 17365, 17366, 17367, 17368, 17369, 17370, 17371, 17372, 17373, 17374, 17375, 17376, 17377, 17378, 17379, 17380, 17381, 17382, 17383, 17384, 17385, 17386, 17387, 17388, 17389, 17390, 17391, 17392, 17393, 17394, 17395, 17396, 17397, 17398, 17399, 17400, 17401, 17402, 17403, 17404, 17405, 17406, 17407, 17408, 17409, 17410, 17411, 17412, 17413, 17414, 17415, 17416, 17417, 17418, 17419, 17420, 17421, 17422, 17423, 17424, 17425, 17426, 17427, 17428, 17429, 17430, 17431, 17432, 17433, 17434, 17435, 17436, 17437, 17438, 17439, 17440, 17441, 17442, 17443, 17444, 17445, 17446, 17447, 17448, 17449, 17450, 17451, 17452, 17453, 17454, 17455, 17456, 17457, 17458, 17459, 17460, 17461, 17462, 17463, 17464, 17465, 17466, 17467, 17468, 17469, 17470, 17471, 17472, 17473, 17474, 17475, 17476, 17477, 17478, 17479, 17480, 17481, 17482, 17483, 17484, 17485, 17486, 17487, 17488, 17489, 17490, 17491, 17492, 17493, 17494, 17495, 17496, 17497, 17498, 17499, 17500, 17501, 17502, 17503, 17504, 17505, 17506, 17507, 17508, 17509, 17510, 17511, 17512, 17513, 17514, 17515, 17516, 17517, 17518, 17519, 17520, 17521, 17522, 17523, 17524, 17525, 17526, 17527, 17528, 17529, 17530, 17531, 17532, 17533, 17534, 17535, 17536, 17537, 17538, 17539, 17540, 17541, 17542, 17543, 17544, 17545, 17546, 17547, 17548, 17549, 17550, 17551, 17552, 17553, 17554, 17555, 17556, 17557, 17558, 17559, 17560, 17561, 17562, 17563, 17564, 17565, 17566, 17567, 17568, 17569, 17570, 17571, 17572, 17573, 17574, 17575, 17576, 17577, 17578, 17579, 17580, 17581, 17582, 17583, 17584, 17585, 17586, 17587, 17588, 17589, 17590, 17591, 17592, 17593, 17594, 17595, 17596, 17597, 17598, 17599, 17600, 17601, 17602, 17603, 17604, 17605, 17606, 17607, 17608, 17609, 17610, 17611, 17612, 17613, 17614, 17615, 17616, 17617, 17618, 17619, 17620, 17621, 17622, 17623, 17624, 17625, 17626, 17627, 17628, 17629, 17630, 17631, 17632, 17633, 17634, 17635, 17636, 17637, 17638, 17639, 17640, 17641, 17642, 17643, 17644, 17645, 17646, 17647, 17648, 17649, 17650, 17651, 17652, 17653, 17654, 17655, 17656, 17657, 17658, 17659, 17660, 17661, 17662, 17663, 17664, 17665, 17666, 17667, 17668, 17669, 17670, 17671, 17672, 17673, 17674, 17675, 17676, 17677, 17678, 17679, 17680, 17681, 17682, 17683, 17684, 17685, 17686, 17687, 17688, 17689, 17690, 17691, 17692, 17693, 17694, 17695, 17696, 17697, 17698, 17699, 17700, 17701, 17702, 17703, 17704, 17705, 17706, 17707, 17708, 17709, 17710, 17711, 17712, 17713, 17714, 17715, 17716, 17717, 17718, 17719, 17720, 17721, 17722, 17723, 17724, 17725, 17726, 17727, 17728, 17729, 17730, 17731, 17732, 17733, 17734, 17735, 17736, 17737, 17738, 17739, 17740, 17741, 17742, 17743, 17744, 17745, 17746, 17747, 17748, 17749, 17750, 17751, 17752, 17753, 17754, 17755, 17756, 17757, 17758, 17759, 17760, 17761, 17762, 17763, 17764, 17765, 17766, 17767, 17768, 17769, 17770, 17771, 17772, 17773, 17774, 17775, 17776, 17777, 17778, 17779, 17780, 17781, 17782, 17783, 17784, 17785, 17786, 17787, 17788, 17789, 17790, 17791, 17792, 17793, 17794, 17795, 17796, 17797, 17798, 17799, 17800, 17801, 17802, 17803, 17804, 17805, 17806, 17807, 17808, 17809, 17810, 17811, 17812, 17813, 17814, 17815, 17816, 17817, 17818, 17819, 17820, 17821, 17822, 17823, 17824, 17825, 17826, 17827, 17828, 17829, 17830, 17831, 17832, 17833, 17834, 17835, 17836, 17837, 17838, 17839, 17840, 17841, 17842, 17843, 17844, 17845, 17846, 17847, 17848, 17849, 17850, 17851, 17852, 17853, 17854, 17855, 17856, 17857, 17858, 17859, 17860, 17861, 17862, 17863, 17864, 17865, 17866, 17867, 17868, 17869, 17870, 17871, 17872, 17873, 17874, 17875, 17876, 17877, 17878, 17879, 17880, 17881, 17882, 17883, 17884, 17885, 17886, 17887, 17888, 17889, 17890, 17891, 17892, 17893, 17894, 17895, 17896, 17897, 17898, 17899, 17900, 17901, 17902, 17903, 17904, 17905, 17906, 17907, 17908, 17909, 17910, 17911, 17912, 17913, 17914, 17915, 17916, 17917, 17918, 17919, 17920, 17921, 17922, 17923, 17924, 17925, 17926, 17927, 17928, 17929, 17930, 17931, 17932, 17933, 17934, 17935, 17936, 17937, 17938, 17939, 17940, 17941, 17942, 17943, 17944, 17945, 17946, 17947, 17948, 17949, 17950, 17951, 17952, 17953, 17954, 17955, 17956, 17957, 17958, 17959, 17960, 17961, 17962, 17963, 17964, 17965, 17966, 17967, 17968, 17969, 17970, 17971, 17972, 17973, 17974, 17975, 17976, 17977, 17978, 17979, 17980, 17981, 17982, 17983, 17984, 17985, 17986, 17987, 17988, 17989, 17990, 17991, 17992, 17993, 17994, 17995, 17996, 17997, 17998, 17999, 18000, 18001, 18002, 18003, 18004, 18005, 18006, 18007, 18008, 18009, 18010, 18011, 18012, 18013, 18014, 18015, 18016, 18017, 18018, 18019, 18020, 18021, 18022, 18023, 18024, 18025, 18026, 18027, 18028, 18029, 18030, 18031, 18032, 18033, 18034, 18035, 18036, 18037, 18038, 18039, 18040, 18041, 18042, 18043, 18044, 18045, 18046, 18047, 18048, 18049, 18050, 18051, 18052, 18053, 18054, 18055, 18056, 18057, 18058, 18059, 18060, 18061, 18062, 18063, 18064, 18065, 18066, 18067, 18068, 18069, 18070, 18071, 18072, 18073, 18074, 18075, 18076, 18077, 18078, 18079, 18080, 18081, 18082, 18083, 18084, 18085, 18086, 18087, 18088, 18089, 18090, 18091, 18092, 18093, 18094, 18095, 18096, 18097, 18098, 18099, 18100, 18101, 18102, 18103, 18104, 18105, 18106, 18107, 18108, 18109, 18110, 18111, 18112, 18113, 18114, 18115, 18116, 18117, 18118, 18119, 18120, 18121, 18122, 18123, 18124, 18125, 18126, 18127, 18128, 18129, 18130, 18131, 18132, 18133, 18134, 18135, 18136, 18137, 18138, 18139, 18140, 18141, 18142, 18143, 18144, 18145, 18146, 18147, 18148, 18149, 18150, 18151, 18152, 18153, 18154, 18155, 18156, 18157, 18158, 18159, 18160, 18161, 18162, 18163, 18164, 18165, 18166, 18167, 18168, 18169, 18170, 18171, 18172, 18173, 18174, 18175, 18176, 18177, 18178, 18179, 18180, 18181, 18182, 18183, 18184, 18185, 18186, 18187, 18188, 18189, 18190, 18191, 18192, 18193, 18194, 18195, 18196, 18197, 18198, 18199, 18200, 18201, 18202, 18203, 18204, 18205, 18206, 18207, 18208, 18209, 18210, 18211, 18212, 18213, 18214, 18215, 18216, 18217, 18218, 18219, 18220, 18221, 18222, 18223, 18224, 18225, 18226, 18227, 18228, 18229, 18230, 18231, 18232, 18233, 18234, 18235, 18236, 18237, 18238, 18239, 18240, 18241, 18242, 18243, 18244, 18245, 18246, 18247, 18248, 18249, 18250, 18251, 18252, 18253, 18254, 18255, 18256, 18257, 18258, 18259, 18260, 18261, 18262, 18263, 18264, 18265, 18266, 18267, 18268, 18269, 18270, 18271, 18272, 18273, 18274, 18275, 18276, 18277, 18278, 18279, 18280, 18281, 18282, 18283, 18284, 18285, 18286, 18287, 18288, 18289, 18290, 18291, 18292, 18293, 18294, 18295, 18296, 18297, 18298, 18299, 18300, 18301, 18302, 18303, 18304, 18305, 18306, 18307, 18308, 18309, 18310, 18311, 18312, 18313, 18314, 18315, 18316, 18317, 18318, 18319, 18320, 18321, 18322, 18323, 18324, 18325, 18326, 18327, 18328, 18329, 18330, 18331, 18332, 18333, 18334, 18335, 18336, 18337, 18338, 18339, 18340, 18341, 18342, 18343, 18344, 18345, 18346, 18347, 18348, 18349, 18350, 18351, 18352, 18353, 18354, 18355, 18356, 18357, 18358, 18359, 18360, 18361, 18362, 18363, 18364, 18365, 18366, 18367, 18368, 18369, 18370, 18371, 18372, 18373, 18374, 18375, 18376, 18377, 18378, 18379, 18380, 18381, 18382, 18383, 18384, 18385, 18386, 18387, 18388, 18389, 18390, 18391, 18392, 18393, 18394, 18395, 18396, 18397, 18398, 18399, 18400, 18401, 18402, 18403, 18404, 18405, 18406, 18407, 18408, 18409, 18410, 18411, 18412, 18413, 18414, 18415, 18416, 18417, 18418, 18419, 18420, 18421, 18422, 18423, 18424, 18425, 18426, 18427, 18428, 18429, 18430, 18431, 18432, 18433, 18434, 18435, 18436, 18437, 18438, 18439, 18440, 18441, 18442, 18443, 18444, 18445, 18446, 18447, 18448, 18449, 18450, 18451, 18452, 18453, 18454, 18455, 18456, 18457, 18458, 18459, 18460, 18461, 18462, 18463, 18464, 18465, 18466, 18467, 18468, 18469, 18470, 18471, 18472, 18473, 18474, 18475, 18476, 18477, 18478, 18479, 18480, 18481, 18482, 18483, 18484, 18485, 18486, 18487, 18488, 18489, 18490, 18491, 18492, 18493, 18494, 18495, 18496, 18497, 18498, 18499, 18500, 18501, 18502, 18503, 18504, 18505, 18506, 18507, 18508, 18509, 18510, 18511, 18512, 18513, 18514, 18515, 18516, 18517, 18518, 18519, 18520, 18521, 18522, 18523, 18524, 18525, 18526, 18527, 18528, 18529, 18530, 18531, 18532, 18533, 18534, 18535, 18536, 18537, 18538, 18539, 18540, 18541, 18542, 18543, 18544, 18545, 18546, 18547, 18548, 18549, 18550, 18551, 18552, 18553, 18554, 18555, 18556, 18557, 18558, 18559, 18560, 18561, 18562, 18563, 18564, 18565, 18566, 18567, 18568, 18569, 18570, 18571, 18572, 18573, 18574, 18575, 18576, 18577, 18578, 18579, 18580, 18581, 18582, 18583, 18584, 18585, 18586, 18587, 18588, 18589, 18590, 18591, 18592, 18593, 18594, 18595, 18596, 18597, 18598, 18599, 18600, 18601, 18602, 18603, 18604, 18605, 18606, 18607, 18608, 18609, 18610, 18611, 18612, 18613, 18614, 18615, 18616, 18617, 18618, 18619, 18620, 18621, 18622, 18623, 18624, 18625, 18626, 18627, 18628, 18629, 18630, 18631, 18632, 18633, 18634, 18635, 18636, 18637, 18638, 18639, 18640, 18641, 18642, 18643, 18644, 18645, 18646, 18647, 18648, 18649, 18650, 18651, 18652, 18653, 18654, 18655, 18656, 18657, 18658, 18659, 18660, 18661, 18662, 18663, 18664, 18665, 18666, 18667, 18668, 18669, 18670, 18671, 18672, 18673, 18674, 18675, 18676, 18677, 18678, 18679, 18680, 18681, 18682, 18683, 18684, 18685, 18686, 18687, 18688, 18689, 18690, 18691, 18692, 18693, 18694, 18695, 18696, 18697, 18698, 18699, 18700, 18701, 18702, 18703, 18704, 18705, 18706, 18707, 18708, 18709, 18710, 18711, 18712, 18713, 18714, 18715, 18716, 18717, 18718, 18719, 18720, 18721, 18722, 18723, 18724, 18725, 18726, 18727, 18728, 18729, 18730, 18731, 18732, 18733, 18734, 18735, 18736, 18737, 18738, 18739, 18740, 18741, 18742, 18743, 18744, 18745, 18746, 18747, 18748, 18749, 18750, 18751, 18752, 18753, 18754, 18755, 18756, 18757, 18758, 18759, 18760, 18761, 18762, 18763, 18764, 18765, 18766, 18767, 18768, 18769, 18770, 18771, 18772, 18773, 18774, 18775, 18776, 18777, 18778, 18779, 18780, 18781, 18782, 18783, 18784, 18785, 18786, 18787, 18788, 18789, 18790, 18791, 18792, 18793, 18794, 18795, 18796, 18797, 18798, 18799, 18800, 18801, 18802, 18803, 18804, 18805, 18806, 18807, 18808, 18809, 18810, 18811, 18812, 18813, 18814, 18815, 18816, 18817, 18818, 18819, 18820, 18821, 18822, 18823, 18824, 18825, 18826, 18827, 18828, 18829, 18830, 18831, 18832, 18833, 18834, 18835, 18836, 18837, 18838, 18839, 18840, 18841, 18842, 18843, 18844, 18845, 18846, 18847, 18848, 18849, 18850, 18851, 18852, 18853, 18854, 18855, 18856, 18857, 18858, 18859, 18860, 18861, 18862, 18863, 18864, 18865, 18866, 18867, 18868, 18869, 18870, 18871, 18872, 18873, 18874, 18875, 18876, 18877, 18878, 18879, 18880, 18881, 18882, 18883, 18884, 18885, 18886, 18887, 18888, 18889, 18890, 18891, 18892, 18893, 18894, 18895, 18896, 18897, 18898, 18899, 18900, 18901, 18902, 18903, 18904, 18905, 18906, 18907, 18908, 18909, 18910, 18911, 18912, 18913, 18914, 18915, 18916, 18917, 18918, 18919, 18920, 18921, 18922, 18923, 18924, 18925, 18926, 18927, 18928, 18929, 18930, 18931, 18932, 18933, 18934, 18935, 18936, 18937, 18938, 18939, 18940, 18941, 18942, 18943, 18944, 18945, 18946, 18947, 18948, 18949, 18950, 18951, 18952, 18953, 18954, 18955, 18956, 18957, 18958, 18959, 18960, 18961, 18962, 18963, 18964, 18965, 18966, 18967, 18968, 18969, 18970, 18971, 18972, 18973, 18974, 18975, 18976, 18977, 18978, 18979, 18980, 18981, 18982, 18983, 18984, 18985, 18986, 18987, 18988, 18989, 18990, 18991, 18992, 18993, 18994, 18995, 18996, 18997, 18998, 18999, 19000, 19001, 19002, 19003, 19004, 19005, 19006, 19007, 19008, 19009, 19010, 19011, 19012, 19013, 19014, 19015, 19016, 19017, 19018, 19019, 19020, 19021, 19022, 19023, 19024, 19025, 19026, 19027, 19028, 19029, 19030, 19031, 19032, 19033, 19034, 19035, 19036, 19037, 19038, 19039, 19040, 19041, 19042, 19043, 19044, 19045, 19046, 19047, 19048, 19049, 19050, 19051, 19052, 19053, 19054, 19055, 19056, 19057, 19058, 19059, 19060, 19061, 19062, 19063, 19064, 19065, 19066, 19067, 19068, 19069, 19070, 19071, 19072, 19073, 19074, 19075, 19076, 19077, 19078, 19079, 19080, 19081, 19082, 19083, 19084, 19085, 19086, 19087, 19088, 19089, 19090, 19091, 19092, 19093, 19094, 19095, 19096, 19097, 19098, 19099, 19100, 19101, 19102, 19103, 19104, 19105, 19106, 19107, 19108, 19109, 19110, 19111, 19112, 19113, 19114, 19115, 19116, 19117, 19118, 19119, 19120, 19121, 19122, 19123, 19124, 19125, 19126, 19127, 19128, 19129, 19130, 19131, 19132, 19133, 19134, 19135, 19136, 19137, 19138, 19139, 19140, 19141, 19142, 19143, 19144, 19145, 19146, 19147, 19148, 19149, 19150, 19151, 19152, 19153, 19154, 19155, 19156, 19157, 19158, 19159, 19160, 19161, 19162, 19163, 19164, 19165, 19166, 19167, 19168, 19169, 19170, 19171, 19172, 19173, 19174, 19175, 19176, 19177, 19178, 19179, 19180, 19181, 19182, 19183, 19184, 19185, 19186, 19187, 19188, 19189, 19190, 19191, 19192, 19193, 19194, 19195, 19196, 19197, 19198, 19199, 19200, 19201, 19202, 19203, 19204, 19205, 19206, 19207, 19208, 19209, 19210, 19211, 19212, 19213, 19214, 19215, 19216, 19217, 19218, 19219, 19220, 19221, 19222, 19223, 19224, 19225, 19226, 19227, 19228, 19229, 19230, 19231, 19232, 19233, 19234, 19235, 19236, 19237, 19238, 19239, 19240, 19241, 19242, 19243, 19244, 19245, 19246, 19247, 19248, 19249, 19250, 19251, 19252, 19253, 19254, 19255, 19256, 19257, 19258, 19259, 19260, 19261, 19262, 19263, 19264, 19265, 19266, 19267, 19268, 19269, 19270, 19271, 19272, 19273, 19274, 19275, 19276, 19277, 19278, 19279, 19280, 19281, 19282, 19283, 19284, 19285, 19286, 19287, 19288, 19289, 19290, 19291, 19292, 19293, 19294, 19295, 19296, 19297, 19298, 19299, 19300, 19301, 19302, 19303, 19304, 19305, 19306, 19307, 19308, 19309, 19310, 19311, 19312, 19313, 19314, 19315, 19316, 19317, 19318, 19319, 19320, 19321, 19322, 19323, 19324, 19325, 19326, 19327, 19328, 19329, 19330, 19331, 19332, 19333, 19334, 19335, 19336, 19337, 19338, 19339, 19340, 19341, 19342, 19343, 19344, 19345, 19346, 19347, 19348, 19349, 19350, 19351, 19352, 19353, 19354, 19355, 19356, 19357, 19358, 19359, 19360, 19361, 19362, 19363, 19364, 19365, 19366, 19367, 19368, 19369, 19370, 19371, 19372, 19373, 19374, 19375, 19376, 19377, 19378, 19379, 19380, 19381, 19382, 19383, 19384, 19385, 19386, 19387, 19388, 19389, 19390, 19391, 19392, 19393, 19394, 19395, 19396, 19397, 19398, 19399, 19400, 19401, 19402, 19403, 19404, 19405, 19406, 19407, 19408, 19409, 19410, 19411, 19412, 19413, 19414, 19415, 19416, 19417, 19418, 19419, 19420, 19421, 19422, 19423, 19424, 19425, 19426, 19427, 19428, 19429, 19430, 19431, 19432, 19433, 19434, 19435, 19436, 19437, 19438, 19439, 19440, 19441, 19442, 19443, 19444, 19445, 19446, 19447, 19448, 19449, 19450, 19451, 19452, 19453, 19454, 19455, 19456, 19457, 19458, 19459, 19460, 19461, 19462, 19463, 19464, 19465, 19466, 19467, 19468, 19469, 19470, 19471, 19472, 19473, 19474, 19475, 19476, 19477, 19478, 19479, 19480, 19481, 19482, 19483, 19484, 19485, 19486, 19487, 19488, 19489, 19490, 19491, 19492, 19493, 19494, 19495, 19496, 19497, 19498, 19499, 19500, 19501, 19502, 19503, 19504, 19505, 19506, 19507, 19508, 19509, 19510, 19511, 19512, 19513, 19514, 19515, 19516, 19517, 19518, 19519, 19520, 19521, 19522, 19523, 19524, 19525, 19526, 19527, 19528, 19529, 19530, 19531, 19532, 19533, 19534, 19535, 19536, 19537, 19538, 19539, 19540, 19541, 19542, 19543, 19544, 19545, 19546, 19547, 19548, 19549, 19550, 19551, 19552, 19553, 19554, 19555, 19556, 19557, 19558, 19559, 19560, 19561, 19562, 19563, 19564, 19565, 19566, 19567, 19568, 19569, 19570, 19571, 19572, 19573, 19574, 19575, 19576, 19577, 19578, 19579, 19580, 19581, 19582, 19583, 19584, 19585, 19586, 19587, 19588, 19589, 19590, 19591, 19592, 19593, 19594, 19595, 19596, 19597, 19598, 19599, 19600, 19601, 19602, 19603, 19604, 19605, 19606, 19607, 19608, 19609, 19610, 19611, 19612, 19613, 19614, 19615, 19616, 19617, 19618, 19619, 19620, 19621, 19622, 19623, 19624, 19625, 19626, 19627, 19628, 19629, 19630, 19631, 19632, 19633, 19634, 19635, 19636, 19637, 19638, 19639, 19640, 19641, 19642, 19643, 19644, 19645, 19646, 19647, 19648, 19649, 19650, 19651, 19652, 19653, 19654, 19655, 19656, 19657, 19658, 19659, 19660, 19661, 19662, 19663, 19664, 19665, 19666, 19667, 19668, 19669, 19670, 19671, 19672, 19673, 19674, 19675, 19676, 19677, 19678, 19679, 19680, 19681, 19682, 19683, 19684, 19685, 19686, 19687, 19688, 19689, 19690, 19691, 19692, 19693, 19694, 19695, 19696, 19697, 19698, 19699, 19700, 19701, 19702, 19703, 19704, 19705, 19706, 19707, 19708, 19709, 19710, 19711, 19712, 19713, 19714, 19715, 19716, 19717, 19718, 19719, 19720, 19721, 19722, 19723, 19724, 19725, 19726, 19727, 19728, 19729, 19730, 19731, 19732, 19733, 19734, 19735, 19736, 19737, 19738, 19739, 19740, 19741, 19742, 19743, 19744, 19745, 19746, 19747, 19748, 19749, 19750, 19751, 19752, 19753, 19754, 19755, 19756, 19757, 19758, 19759, 19760, 19761, 19762, 19763, 19764, 19765, 19766, 19767, 19768, 19769, 19770, 19771, 19772, 19773, 19774, 19775, 19776, 19777, 19778, 19779, 19780, 19781, 19782, 19783, 19784, 19785, 19786, 19787, 19788, 19789, 19790, 19791, 19792, 19793, 19794, 19795, 19796, 19797, 19798, 19799, 19800, 19801, 19802, 19803, 19804, 19805, 19806, 19807, 19808, 19809, 19810, 19811, 19812, 19813, 19814, 19815, 19816, 19817, 19818, 19819, 19820, 19821, 19822, 19823, 19824, 19825, 19826, 19827, 19828, 19829, 19830, 19831, 19832, 19833, 19834, 19835, 19836, 19837, 19838, 19839, 19840, 19841, 19842, 19843, 19844, 19845, 19846, 19847, 19848, 19849, 19850, 19851, 19852, 19853, 19854, 19855, 19856, 19857, 19858, 19859, 19860, 19861, 19862, 19863, 19864, 19865, 19866, 19867, 19868, 19869, 19870, 19871, 19872, 19873, 19874, 19875, 19876, 19877, 19878, 19879, 19880, 19881, 19882, 19883, 19884, 19885, 19886, 19887, 19888, 19889, 19890, 19891, 19892, 19893, 19894, 19895, 19896, 19897, 19898, 19899, 19900, 19901, 19902, 19903, 19904, 19905, 19906, 19907, 19908, 19909, 19910, 19911, 19912, 19913, 19914, 19915, 19916, 19917, 19918, 19919, 19920, 19921, 19922, 19923, 19924, 19925, 19926, 19927, 19928, 19929, 19930, 19931, 19932, 19933, 19934, 19935, 19936, 19937, 19938, 19939, 19940, 19941, 19942, 19943, 19944, 19945, 19946, 19947, 19948, 19949, 19950, 19951, 19952, 19953, 19954, 19955, 19956, 19957, 19958, 19959, 19960, 19961, 19962, 19963, 19964, 19965, 19966, 19967, 19968, 19969, 19970, 19971, 19972, 19973, 19974, 19975, 19976, 19977, 19978, 19979, 19980, 19981, 19982, 19983, 19984, 19985, 19986, 19987, 19988, 19989, 19990, 19991, 19992, 19993, 19994, 19995, 19996, 19997, 19998, 19999, 20000, 20001, 20002, 20003, 20004, 20005, 20006, 20007, 20008, 20009, 20010, 20011, 20012, 20013, 20014, 20015, 20016, 20017, 20018, 20019, 20020, 20021, 20022, 20023, 20024, 20025, 20026, 20027, 20028, 20029, 20030, 20031, 20032, 20033, 20034, 20035, 20036, 20037, 20038, 20039, 20040, 20041, 20042, 20043, 20044, 20045, 20046, 20047, 20048, 20049, 20050, 20051, 20052, 20053, 20054, 20055, 20056, 20057, 20058, 20059, 20060, 20061, 20062, 20063, 20064, 20065, 20066, 20067, 20068, 20069, 20070, 20071, 20072, 20073, 20074, 20075, 20076, 20077, 20078, 20079, 20080, 20081, 20082, 20083, 20084, 20085, 20086, 20087, 20088, 20089, 20090, 20091, 20092, 20093, 20094, 20095, 20096, 20097, 20098, 20099, 20100, 20101, 20102, 20103, 20104, 20105, 20106, 20107, 20108, 20109, 20110, 20111, 20112, 20113, 20114, 20115, 20116, 20117, 20118, 20119, 20120, 20121, 20122, 20123, 20124, 20125, 20126, 20127, 20128, 20129, 20130, 20131, 20132, 20133, 20134, 20135, 20136, 20137, 20138, 20139, 20140, 20141, 20142, 20143, 20144, 20145, 20146, 20147, 20148, 20149, 20150, 20151, 20152, 20153, 20154, 20155, 20156, 20157, 20158, 20159, 20160, 20161, 20162, 20163, 20164, 20165, 20166, 20167, 20168, 20169, 20170, 20171, 20172, 20173, 20174, 20175, 20176, 20177, 20178, 20179, 20180, 20181, 20182, 20183, 20184, 20185, 20186, 20187, 20188, 20189, 20190, 20191, 20192, 20193, 20194, 20195, 20196, 20197, 20198, 20199, 20200, 20201, 20202, 20203, 20204, 20205, 20206, 20207, 20208, 20209, 20210, 20211, 20212, 20213, 20214, 20215, 20216, 20217, 20218, 20219, 20220, 20221, 20222, 20223, 20224, 20225, 20226, 20227, 20228, 20229, 20230, 20231, 20232, 20233, 20234, 20235, 20236, 20237, 20238, 20239, 20240, 20241, 20242, 20243, 20244, 20245, 20246, 20247, 20248, 20249, 20250, 20251, 20252, 20253, 20254, 20255, 20256, 20257, 20258, 20259, 20260, 20261, 20262, 20263, 20264, 20265, 20266, 20267, 20268, 20269, 20270, 20271, 20272, 20273, 20274, 20275, 20276, 20277, 20278, 20279, 20280, 20281, 20282, 20283, 20284, 20285, 20286, 20287, 20288, 20289, 20290, 20291, 20292, 20293, 20294, 20295, 20296, 20297, 20298, 20299, 20300, 20301, 20302, 20303, 20304, 20305, 20306, 20307, 20308, 20309, 20310, 20311, 20312, 20313, 20314, 20315, 20316, 20317, 20318, 20319, 20320, 20321, 20322, 20323, 20324, 20325, 20326, 20327, 20328, 20329, 20330, 20331, 20332, 20333, 20334, 20335, 20336, 20337, 20338, 20339, 20340, 20341, 20342, 20343, 20344, 20345, 20346, 20347, 20348, 20349, 20350, 20351, 20352, 20353, 20354, 20355, 20356, 20357, 20358, 20359, 20360, 20361, 20362, 20363, 20364, 20365, 20366, 20367, 20368, 20369, 20370, 20371, 20372, 20373, 20374, 20375, 20376, 20377, 20378, 20379, 20380, 20381, 20382, 20383, 20384, 20385, 20386, 20387, 20388, 20389, 20390, 20391, 20392, 20393, 20394, 20395, 20396, 20397, 20398, 20399, 20400, 20401, 20402, 20403, 20404, 20405, 20406, 20407, 20408, 20409, 20410, 20411, 20412, 20413, 20414, 20415, 20416, 20417, 20418, 20419, 20420, 20421, 20422, 20423, 20424, 20425, 20426, 20427, 20428, 20429, 20430, 20431, 20432, 20433, 20434, 20435, 20436, 20437, 20438, 20439, 20440, 20441, 20442, 20443, 20444, 20445, 20446, 20447, 20448, 20449, 20450, 20451, 20452, 20453, 20454, 20455, 20456, 20457, 20458, 20459, 20460, 20461, 20462, 20463, 20464, 20465, 20466, 20467, 20468, 20469, 20470, 20471, 20472, 20473, 20474, 20475, 20476, 20477, 20478, 20479, 20480, 20481, 20482, 20483, 20484, 20485, 20486, 20487, 20488, 20489, 20490, 20491, 20492, 20493, 20494, 20495, 20496, 20497, 20498, 20499, 20500, 20501, 20502, 20503, 20504, 20505, 20506, 20507, 20508, 20509, 20510, 20511, 20512, 20513, 20514, 20515, 20516, 20517, 20518, 20519, 20520, 20521, 20522, 20523, 20524, 20525, 20526, 20527, 20528, 20529, 20530, 20531, 20532, 20533, 20534, 20535, 20536, 20537, 20538, 20539, 20540, 20541, 20542, 20543, 20544, 20545, 20546, 20547, 20548, 20549, 20550, 20551, 20552, 20553, 20554, 20555, 20556, 20557, 20558, 20559, 20560, 20561, 20562, 20563, 20564, 20565, 20566, 20567, 20568, 20569, 20570, 20571, 20572, 20573, 20574, 20575, 20576, 20577, 20578, 20579, 20580, 20581, 20582, 20583, 20584, 20585, 20586, 20587, 20588, 20589, 20590, 20591, 20592, 20593, 20594, 20595, 20596, 20597, 20598, 20599, 20600, 20601, 20602, 20603, 20604, 20605, 20606, 20607, 20608, 20609, 20610, 20611, 20612, 20613, 20614, 20615, 20616, 20617, 20618, 20619, 20620, 20621, 20622, 20623, 20624, 20625, 20626, 20627, 20628, 20629, 20630, 20631, 20632, 20633, 20634, 20635, 20636, 20637, 20638, 20639, 20640, 20641, 20642, 20643, 20644, 20645, 20646, 20647, 20648, 20649, 20650, 20651, 20652, 20653, 20654, 20655, 20656, 20657, 20658, 20659, 20660, 20661, 20662, 20663, 20664, 20665, 20666, 20667, 20668, 20669, 20670, 20671, 20672, 20673, 20674, 20675, 20676, 20677, 20678, 20679, 20680, 20681, 20682, 20683, 20684, 20685, 20686, 20687, 20688, 20689, 20690, 20691, 20692, 20693, 20694, 20695, 20696, 20697, 20698, 20699, 20700, 20701, 20702, 20703, 20704, 20705, 20706, 20707, 20708, 20709, 20710, 20711, 20712, 20713, 20714, 20715, 20716, 20717, 20718, 20719, 20720, 20721, 20722, 20723, 20724, 20725, 20726, 20727, 20728, 20729, 20730, 20731, 20732, 20733, 20734, 20735, 20736, 20737, 20738, 20739, 20740, 20741, 20742, 20743, 20744, 20745, 20746, 20747, 20748, 20749, 20750, 20751, 20752, 20753, 20754, 20755, 20756, 20757, 20758, 20759, 20760, 20761, 20762, 20763, 20764, 20765, 20766, 20767, 20768, 20769, 20770, 20771, 20772, 20773, 20774, 20775, 20776, 20777, 20778, 20779, 20780, 20781, 20782, 20783, 20784, 20785, 20786, 20787, 20788, 20789, 20790, 20791, 20792, 20793, 20794, 20795, 20796, 20797, 20798, 20799, 20800, 20801, 20802, 20803, 20804, 20805, 20806, 20807, 20808, 20809, 20810, 20811, 20812, 20813, 20814, 20815, 20816, 20817, 20818, 20819, 20820, 20821, 20822, 20823, 20824, 20825, 20826, 20827, 20828, 20829, 20830, 20831, 20832, 20833, 20834, 20835, 20836, 20837, 20838, 20839, 20840, 20841, 20842, 20843, 20844, 20845, 20846, 20847, 20848, 20849, 20850, 20851, 20852, 20853, 20854, 20855, 20856, 20857, 20858, 20859, 20860, 20861, 20862, 20863, 20864, 20865, 20866, 20867, 20868, 20869, 20870, 20871, 20872, 20873, 20874, 20875, 20876, 20877, 20878, 20879, 20880, 20881, 20882, 20883, 20884, 20885, 20886, 20887, 20888, 20889, 20890, 20891, 20892, 20893, 20894, 20895, 20896, 20897, 20898, 20899, 20900, 20901, 20902, 20903, 20904, 20905, 20906, 20907, 20908, 20909, 20910, 20911, 20912, 20913, 20914, 20915, 20916, 20917, 20918, 20919, 20920, 20921, 20922, 20923, 20924, 20925, 20926, 20927, 20928, 20929, 20930, 20931, 20932, 20933, 20934, 20935, 20936, 20937, 20938, 20939, 20940, 20941, 20942, 20943, 20944, 20945, 20946, 20947, 20948, 20949, 20950, 20951, 20952, 20953, 20954, 20955, 20956, 20957, 20958, 20959, 20960, 20961, 20962, 20963, 20964, 20965, 20966, 20967, 20968, 20969, 20970, 20971, 20972, 20973, 20974, 20975, 20976, 20977, 20978, 20979, 20980, 20981, 20982, 20983, 20984, 20985, 20986, 20987, 20988, 20989, 20990, 20991, 20992, 20993, 20994, 20995, 20996, 20997, 20998, 20999, 21000, 21001, 21002, 21003, 21004, 21005, 21006, 21007, 21008, 21009, 21010, 21011, 21012, 21013, 21014, 21015, 21016, 21017, 21018, 21019, 21020, 21021, 21022, 21023, 21024, 21025, 21026, 21027, 21028, 21029, 21030, 21031, 21032, 21033, 21034, 21035, 21036, 21037, 21038, 21039, 21040, 21041, 21042, 21043, 21044, 21045, 21046, 21047, 21048, 21049, 21050, 21051, 21052, 21053, 21054, 21055, 21056, 21057, 21058, 21059, 21060, 21061, 21062, 21063, 21064, 21065, 21066, 21067, 21068, 21069, 21070, 21071, 21072, 21073, 21074, 21075, 21076, 21077, 21078, 21079, 21080, 21081, 21082, 21083, 21084, 21085, 21086, 21087, 21088, 21089, 21090, 21091, 21092, 21093, 21094, 21095, 21096, 21097, 21098, 21099, 21100, 21101, 21102, 21103, 21104, 21105, 21106, 21107, 21108, 21109, 21110, 21111, 21112, 21113, 21114, 21115, 21116, 21117, 21118, 21119, 21120, 21121, 21122, 21123, 21124, 21125, 21126, 21127, 21128, 21129, 21130, 21131, 21132, 21133, 21134, 21135, 21136, 21137, 21138, 21139, 21140, 21141, 21142, 21143, 21144, 21145, 21146, 21147, 21148, 21149, 21150, 21151, 21152, 21153, 21154, 21155, 21156, 21157, 21158, 21159, 21160, 21161, 21162, 21163, 21164, 21165, 21166, 21167, 21168, 21169, 21170, 21171, 21172, 21173, 21174, 21175, 21176, 21177, 21178, 21179, 21180, 21181, 21182, 21183, 21184, 21185, 21186, 21187, 21188, 21189, 21190, 21191, 21192, 21193, 21194, 21195, 21196, 21197, 21198, 21199, 21200, 21201, 21202, 21203, 21204, 21205, 21206, 21207, 21208, 21209, 21210, 21211, 21212, 21213, 21214, 21215, 21216, 21217, 21218, 21219, 21220, 21221, 21222, 21223, 21224, 21225, 21226, 21227, 21228, 21229, 21230, 21231, 21232, 21233, 21234, 21235, 21236, 21237, 21238, 21239, 21240, 21241, 21242, 21243, 21244, 21245, 21246, 21247, 21248, 21249, 21250, 21251, 21252, 21253, 21254, 21255, 21256, 21257, 21258, 21259, 21260, 21261, 21262, 21263, 21264, 21265, 21266, 21267, 21268, 21269, 21270, 21271, 21272, 21273, 21274, 21275, 21276, 21277, 21278, 21279, 21280, 21281, 21282, 21283, 21284, 21285, 21286, 21287, 21288, 21289, 21290, 21291, 21292, 21293, 21294, 21295, 21296, 21297, 21298, 21299, 21300, 21301, 21302, 21303, 21304, 21305, 21306, 21307, 21308, 21309, 21310, 21311, 21312, 21313, 21314, 21315, 21316, 21317, 21318, 21319, 21320, 21321, 21322, 21323, 21324, 21325, 21326, 21327, 21328, 21329, 21330, 21331, 21332, 21333, 21334, 21335, 21336, 21337, 21338, 21339, 21340, 21341, 21342, 21343, 21344, 21345, 21346, 21347, 21348, 21349, 21350, 21351, 21352, 21353, 21354, 21355, 21356, 21357, 21358, 21359, 21360, 21361, 21362, 21363, 21364, 21365, 21366, 21367, 21368, 21369, 21370, 21371, 21372, 21373, 21374, 21375, 21376, 21377, 21378, 21379, 21380, 21381, 21382, 21383, 21384, 21385, 21386, 21387, 21388, 21389, 21390, 21391, 21392, 21393, 21394, 21395, 21396, 21397, 21398, 21399, 21400, 21401, 21402, 21403, 21404, 21405, 21406, 21407, 21408, 21409, 21410, 21411, 21412, 21413, 21414, 21415, 21416, 21417, 21418, 21419, 21420, 21421, 21422, 21423, 21424, 21425, 21426, 21427, 21428, 21429, 21430, 21431, 21432, 21433, 21434, 21435, 21436, 21437, 21438, 21439, 21440, 21441, 21442, 21443, 21444, 21445, 21446, 21447, 21448, 21449, 21450, 21451, 21452, 21453, 21454, 21455, 21456, 21457, 21458, 21459, 21460, 21461, 21462, 21463, 21464, 21465, 21466, 21467, 21468, 21469, 21470, 21471, 21472, 21473, 21474, 21475, 21476, 21477, 21478, 21479, 21480, 21481, 21482, 21483, 21484, 21485, 21486, 21487, 21488, 21489, 21490, 21491, 21492, 21493, 21494, 21495, 21496, 21497, 21498, 21499, 21500, 21501, 21502, 21503, 21504, 21505, 21506, 21507, 21508, 21509, 21510, 21511, 21512, 21513, 21514, 21515, 21516, 21517, 21518, 21519, 21520, 21521, 21522, 21523, 21524, 21525, 21526, 21527, 21528, 21529, 21530, 21531, 21532, 21533, 21534, 21535, 21536, 21537, 21538, 21539, 21540, 21541, 21542, 21543, 21544, 21545, 21546, 21547, 21548, 21549, 21550, 21551, 21552, 21553, 21554, 21555, 21556, 21557, 21558, 21559, 21560, 21561, 21562, 21563, 21564, 21565, 21566, 21567, 21568, 21569, 21570, 21571, 21572, 21573, 21574, 21575, 21576, 21577, 21578, 21579, 21580, 21581, 21582, 21583, 21584, 21585, 21586, 21587, 21588, 21589, 21590, 21591, 21592, 21593, 21594, 21595, 21596, 21597, 21598, 21599, 21600, 21601, 21602, 21603, 21604, 21605, 21606, 21607, 21608, 21609, 21610, 21611, 21612, 21613, 21614, 21615, 21616, 21617, 21618, 21619, 21620, 21621, 21622, 21623, 21624, 21625, 21626, 21627, 21628, 21629, 21630, 21631, 21632, 21633, 21634, 21635, 21636, 21637, 21638, 21639, 21640, 21641, 21642, 21643, 21644, 21645, 21646, 21647, 21648, 21649, 21650, 21651, 21652, 21653, 21654, 21655, 21656, 21657, 21658, 21659, 21660, 21661, 21662, 21663, 21664, 21665, 21666, 21667, 21668, 21669, 21670, 21671, 21672, 21673, 21674, 21675, 21676, 21677, 21678, 21679, 21680, 21681, 21682, 21683, 21684, 21685, 21686, 21687, 21688, 21689, 21690, 21691, 21692, 21693, 21694, 21695, 21696, 21697, 21698, 21699, 21700, 21701, 21702, 21703, 21704, 21705, 21706, 21707, 21708, 21709, 21710, 21711, 21712, 21713, 21714, 21715, 21716, 21717, 21718, 21719, 21720, 21721, 21722, 21723, 21724, 21725, 21726, 21727, 21728, 21729, 21730, 21731, 21732, 21733, 21734, 21735, 21736, 21737, 21738, 21739, 21740, 21741, 21742, 21743, 21744, 21745, 21746, 21747, 21748, 21749, 21750, 21751, 21752, 21753, 21754, 21755, 21756, 21757, 21758, 21759, 21760, 21761, 21762, 21763, 21764, 21765, 21766, 21767, 21768, 21769, 21770, 21771, 21772, 21773, 21774, 21775, 21776, 21777, 21778, 21779, 21780, 21781, 21782, 21783, 21784, 21785, 21786, 21787, 21788, 21789, 21790, 21791, 21792, 21793, 21794, 21795, 21796, 21797, 21798, 21799, 21800, 21801, 21802, 21803, 21804, 21805, 21806, 21807, 21808, 21809, 21810, 21811, 21812, 21813, 21814, 21815, 21816, 21817, 21818, 21819, 21820, 21821, 21822, 21823, 21824, 21825, 21826, 21827, 21828, 21829, 21830, 21831, 21832, 21833, 21834, 21835, 21836, 21837, 21838, 21839, 21840, 21841, 21842, 21843, 21844, 21845, 21846, 21847, 21848, 21849, 21850, 21851, 21852, 21853, 21854, 21855, 21856, 21857, 21858, 21859, 21860, 21861, 21862, 21863, 21864, 21865, 21866, 21867, 21868, 21869, 21870, 21871, 21872, 21873, 21874, 21875, 21876, 21877, 21878, 21879, 21880, 21881, 21882, 21883, 21884, 21885, 21886, 21887, 21888, 21889, 21890, 21891, 21892, 21893, 21894, 21895, 21896, 21897, 21898, 21899, 21900, 21901, 21902, 21903, 21904, 21905, 21906, 21907, 21908, 21909, 21910, 21911, 21912, 21913, 21914, 21915, 21916, 21917, 21918, 21919, 21920, 21921, 21922, 21923, 21924, 21925, 21926, 21927, 21928, 21929, 21930, 21931, 21932, 21933, 21934, 21935, 21936, 21937, 21938, 21939, 21940, 21941, 21942, 21943, 21944, 21945, 21946, 21947, 21948, 21949, 21950, 21951, 21952, 21953, 21954, 21955, 21956, 21957, 21958, 21959, 21960, 21961, 21962, 21963, 21964, 21965, 21966, 21967, 21968, 21969, 21970, 21971, 21972, 21973, 21974, 21975, 21976, 21977, 21978, 21979, 21980, 21981, 21982, 21983, 21984, 21985, 21986, 21987, 21988, 21989, 21990, 21991, 21992, 21993, 21994, 21995, 21996, 21997, 21998, 21999, 22000, 22001, 22002, 22003, 22004, 22005, 22006, 22007, 22008, 22009, 22010, 22011, 22012, 22013, 22014, 22015, 22016, 22017, 22018, 22019, 22020, 22021, 22022, 22023, 22024, 22025, 22026, 22027, 22028, 22029, 22030, 22031, 22032, 22033, 22034, 22035, 22036, 22037, 22038, 22039, 22040, 22041, 22042, 22043, 22044, 22045, 22046, 22047, 22048, 22049, 22050, 22051, 22052, 22053, 22054, 22055, 22056, 22057, 22058, 22059, 22060, 22061, 22062, 22063, 22064, 22065, 22066, 22067, 22068, 22069, 22070, 22071, 22072, 22073, 22074, 22075, 22076, 22077, 22078, 22079, 22080, 22081, 22082, 22083, 22084, 22085, 22086, 22087, 22088, 22089, 22090, 22091, 22092, 22093, 22094, 22095, 22096, 22097, 22098, 22099, 22100, 22101, 22102, 22103, 22104, 22105, 22106, 22107, 22108, 22109, 22110, 22111, 22112, 22113, 22114, 22115, 22116, 22117, 22118, 22119, 22120, 22121, 22122, 22123, 22124, 22125, 22126, 22127, 22128, 22129, 22130, 22131, 22132, 22133, 22134, 22135, 22136, 22137, 22138, 22139, 22140, 22141, 22142, 22143, 22144, 22145, 22146, 22147, 22148, 22149, 22150, 22151, 22152, 22153, 22154, 22155, 22156, 22157, 22158, 22159, 22160, 22161, 22162, 22163, 22164, 22165, 22166, 22167, 22168, 22169, 22170, 22171, 22172, 22173, 22174, 22175, 22176, 22177, 22178, 22179, 22180, 22181, 22182, 22183, 22184, 22185, 22186, 22187, 22188, 22189, 22190, 22191, 22192, 22193, 22194, 22195, 22196, 22197, 22198, 22199, 22200, 22201, 22202, 22203, 22204, 22205, 22206, 22207, 22208, 22209, 22210, 22211, 22212, 22213, 22214, 22215, 22216, 22217, 22218, 22219, 22220, 22221, 22222, 22223, 22224, 22225, 22226, 22227, 22228, 22229, 22230, 22231, 22232, 22233, 22234, 22235, 22236, 22237, 22238, 22239, 22240, 22241, 22242, 22243, 22244, 22245, 22246, 22247, 22248, 22249, 22250, 22251, 22252, 22253, 22254, 22255, 22256, 22257, 22258, 22259, 22260, 22261, 22262, 22263, 22264, 22265, 22266, 22267, 22268, 22269, 22270, 22271, 22272, 22273, 22274, 22275, 22276, 22277, 22278, 22279, 22280, 22281, 22282, 22283, 22284, 22285, 22286, 22287, 22288, 22289, 22290, 22291, 22292, 22293, 22294, 22295, 22296, 22297, 22298, 22299, 22300, 22301, 22302, 22303, 22304, 22305, 22306, 22307, 22308, 22309, 22310, 22311, 22312, 22313, 22314, 22315, 22316, 22317, 22318, 22319, 22320, 22321, 22322, 22323, 22324, 22325, 22326, 22327, 22328, 22329, 22330, 22331, 22332, 22333, 22334, 22335, 22336, 22337, 22338, 22339, 22340, 22341, 22342, 22343, 22344, 22345, 22346, 22347, 22348, 22349, 22350, 22351, 22352, 22353, 22354, 22355, 22356, 22357, 22358, 22359, 22360, 22361, 22362, 22363, 22364, 22365, 22366, 22367, 22368, 22369, 22370, 22371, 22372, 22373, 22374, 22375, 22376, 22377, 22378, 22379, 22380, 22381, 22382, 22383, 22384, 22385, 22386, 22387, 22388, 22389, 22390, 22391, 22392, 22393, 22394, 22395, 22396, 22397, 22398, 22399, 22400, 22401, 22402, 22403, 22404, 22405, 22406, 22407, 22408, 22409, 22410, 22411, 22412, 22413, 22414, 22415, 22416, 22417, 22418, 22419, 22420, 22421, 22422, 22423, 22424, 22425, 22426, 22427, 22428, 22429, 22430, 22431, 22432, 22433, 22434, 22435, 22436, 22437, 22438, 22439, 22440, 22441, 22442, 22443, 22444, 22445, 22446, 22447, 22448, 22449, 22450, 22451, 22452, 22453, 22454, 22455, 22456, 22457, 22458, 22459, 22460, 22461, 22462, 22463, 22464, 22465, 22466, 22467, 22468, 22469, 22470, 22471, 22472, 22473, 22474, 22475, 22476, 22477, 22478, 22479, 22480, 22481, 22482, 22483, 22484, 22485, 22486, 22487, 22488, 22489, 22490, 22491, 22492, 22493, 22494, 22495, 22496, 22497, 22498, 22499, 22500, 22501, 22502, 22503, 22504, 22505, 22506, 22507, 22508, 22509, 22510, 22511, 22512, 22513, 22514, 22515, 22516, 22517, 22518, 22519, 22520, 22521, 22522, 22523, 22524, 22525, 22526, 22527, 22528, 22529, 22530, 22531, 22532, 22533, 22534, 22535, 22536, 22537, 22538, 22539, 22540, 22541, 22542, 22543, 22544, 22545, 22546, 22547, 22548, 22549, 22550, 22551, 22552, 22553, 22554, 22555, 22556, 22557, 22558, 22559, 22560, 22561, 22562, 22563, 22564, 22565, 22566, 22567, 22568, 22569, 22570, 22571, 22572, 22573, 22574, 22575, 22576, 22577, 22578, 22579, 22580, 22581, 22582, 22583, 22584, 22585, 22586, 22587, 22588, 22589, 22590, 22591, 22592, 22593, 22594, 22595, 22596, 22597, 22598, 22599, 22600, 22601, 22602, 22603, 22604, 22605, 22606, 22607, 22608, 22609, 22610, 22611, 22612, 22613, 22614, 22615, 22616, 22617, 22618, 22619, 22620, 22621, 22622, 22623, 22624, 22625, 22626, 22627, 22628, 22629, 22630, 22631, 22632, 22633, 22634, 22635, 22636, 22637, 22638, 22639, 22640, 22641, 22642, 22643, 22644, 22645, 22646, 22647, 22648, 22649, 22650, 22651, 22652, 22653, 22654, 22655, 22656, 22657, 22658, 22659, 22660, 22661, 22662, 22663, 22664, 22665, 22666, 22667, 22668, 22669, 22670, 22671, 22672, 22673, 22674, 22675, 22676, 22677, 22678, 22679, 22680, 22681, 22682, 22683, 22684, 22685, 22686, 22687, 22688, 22689, 22690, 22691, 22692, 22693, 22694, 22695, 22696, 22697, 22698, 22699, 22700, 22701, 22702, 22703, 22704, 22705, 22706, 22707, 22708, 22709, 22710, 22711, 22712, 22713, 22714, 22715, 22716, 22717, 22718, 22719, 22720, 22721, 22722, 22723, 22724, 22725, 22726, 22727, 22728, 22729, 22730, 22731, 22732, 22733, 22734, 22735, 22736, 22737, 22738, 22739, 22740, 22741, 22742, 22743, 22744, 22745, 22746, 22747, 22748, 22749, 22750, 22751, 22752, 22753, 22754, 22755, 22756, 22757, 22758, 22759, 22760, 22761, 22762, 22763, 22764, 22765, 22766, 22767, 22768, 22769, 22770, 22771, 22772, 22773, 22774, 22775, 22776, 22777, 22778, 22779, 22780, 22781, 22782, 22783, 22784, 22785, 22786, 22787, 22788, 22789, 22790, 22791, 22792, 22793, 22794, 22795, 22796, 22797, 22798, 22799, 22800, 22801, 22802, 22803, 22804, 22805, 22806, 22807, 22808, 22809, 22810, 22811, 22812, 22813, 22814, 22815, 22816, 22817, 22818, 22819, 22820, 22821, 22822, 22823, 22824, 22825, 22826, 22827, 22828, 22829, 22830, 22831, 22832, 22833, 22834, 22835, 22836, 22837, 22838, 22839, 22840, 22841, 22842, 22843, 22844, 22845, 22846, 22847, 22848, 22849, 22850, 22851, 22852, 22853, 22854, 22855, 22856, 22857, 22858, 22859, 22860, 22861, 22862, 22863, 22864, 22865, 22866, 22867, 22868, 22869, 22870, 22871, 22872, 22873, 22874, 22875, 22876, 22877, 22878, 22879, 22880, 22881, 22882, 22883, 22884, 22885, 22886, 22887, 22888, 22889, 22890, 22891, 22892, 22893, 22894, 22895, 22896, 22897, 22898, 22899, 22900, 22901, 22902, 22903, 22904, 22905, 22906, 22907, 22908, 22909, 22910, 22911, 22912, 22913, 22914, 22915, 22916, 22917, 22918, 22919, 22920, 22921, 22922, 22923, 22924, 22925, 22926, 22927, 22928, 22929, 22930, 22931, 22932, 22933, 22934, 22935, 22936, 22937, 22938, 22939, 22940, 22941, 22942, 22943, 22944, 22945, 22946, 22947, 22948, 22949, 22950, 22951, 22952, 22953, 22954, 22955, 22956, 22957, 22958, 22959, 22960, 22961, 22962, 22963, 22964, 22965, 22966, 22967, 22968, 22969, 22970, 22971, 22972, 22973, 22974, 22975, 22976, 22977, 22978, 22979, 22980, 22981, 22982, 22983, 22984, 22985, 22986, 22987, 22988, 22989, 22990, 22991, 22992, 22993, 22994, 22995, 22996, 22997, 22998, 22999, 23000, 23001, 23002, 23003, 23004, 23005, 23006, 23007, 23008, 23009, 23010, 23011, 23012, 23013, 23014, 23015, 23016, 23017, 23018, 23019, 23020, 23021, 23022, 23023, 23024, 23025, 23026, 23027, 23028, 23029, 23030, 23031, 23032, 23033, 23034, 23035, 23036, 23037, 23038, 23039, 23040, 23041, 23042, 23043, 23044, 23045, 23046, 23047, 23048, 23049, 23050, 23051, 23052, 23053, 23054, 23055, 23056, 23057, 23058, 23059, 23060, 23061, 23062, 23063, 23064, 23065, 23066, 23067, 23068, 23069, 23070, 23071, 23072, 23073, 23074, 23075, 23076, 23077, 23078, 23079, 23080, 23081, 23082, 23083, 23084, 23085, 23086, 23087, 23088, 23089, 23090, 23091, 23092, 23093, 23094, 23095, 23096, 23097, 23098, 23099, 23100, 23101, 23102, 23103, 23104, 23105, 23106, 23107, 23108, 23109, 23110, 23111, 23112, 23113, 23114, 23115, 23116, 23117, 23118, 23119, 23120, 23121, 23122, 23123, 23124, 23125, 23126, 23127, 23128, 23129, 23130, 23131, 23132, 23133, 23134, 23135, 23136, 23137, 23138, 23139, 23140, 23141, 23142, 23143, 23144, 23145, 23146, 23147, 23148, 23149, 23150, 23151, 23152, 23153, 23154, 23155, 23156, 23157, 23158, 23159, 23160, 23161, 23162, 23163, 23164, 23165, 23166, 23167, 23168, 23169, 23170, 23171, 23172, 23173, 23174, 23175, 23176, 23177, 23178, 23179, 23180, 23181, 23182, 23183, 23184, 23185, 23186, 23187, 23188, 23189, 23190, 23191, 23192, 23193, 23194, 23195, 23196, 23197, 23198, 23199, 23200, 23201, 23202, 23203, 23204, 23205, 23206, 23207, 23208, 23209, 23210, 23211, 23212, 23213, 23214, 23215, 23216, 23217, 23218, 23219, 23220, 23221, 23222, 23223, 23224, 23225, 23226, 23227, 23228, 23229, 23230, 23231, 23232, 23233, 23234, 23235, 23236, 23237, 23238, 23239, 23240, 23241, 23242, 23243, 23244, 23245, 23246, 23247, 23248, 23249, 23250, 23251, 23252, 23253, 23254, 23255, 23256, 23257, 23258, 23259, 23260, 23261, 23262, 23263, 23264, 23265, 23266, 23267, 23268, 23269, 23270, 23271, 23272, 23273, 23274, 23275, 23276, 23277, 23278, 23279, 23280, 23281, 23282, 23283, 23284, 23285, 23286, 23287, 23288, 23289, 23290, 23291, 23292, 23293, 23294, 23295, 23296, 23297, 23298, 23299, 23300, 23301, 23302, 23303, 23304, 23305, 23306, 23307, 23308, 23309, 23310, 23311, 23312, 23313, 23314, 23315, 23316, 23317, 23318, 23319, 23320, 23321, 23322, 23323, 23324, 23325, 23326, 23327, 23328, 23329, 23330, 23331, 23332, 23333, 23334, 23335, 23336, 23337, 23338, 23339, 23340, 23341, 23342, 23343, 23344, 23345, 23346, 23347, 23348, 23349, 23350, 23351, 23352, 23353, 23354, 23355, 23356, 23357, 23358, 23359, 23360, 23361, 23362, 23363, 23364, 23365, 23366, 23367, 23368, 23369, 23370, 23371, 23372, 23373, 23374, 23375, 23376, 23377, 23378, 23379, 23380, 23381, 23382, 23383, 23384, 23385, 23386, 23387, 23388, 23389, 23390, 23391, 23392, default */
/***/ (function(module) {

module.exports = JSON.parse("[80,75,3,4,20,0,6,0,8,0,0,0,33,0,79,245,229,228,132,1,0,0,183,5,0,0,19,0,8,2,91,67,111,110,116,101,110,116,95,84,121,112,101,115,93,46,120,109,108,32,162,4,2,40,160,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,172,148,203,110,195,32,16,69,247,149,250,15,22,219,202,38,233,162,170,170,56,89,244,177,108,35,53,253,0,106,198,54,138,121,136,33,175,191,47,16,39,74,43,55,86,228,108,140,13,51,247,30,198,12,147,217,86,54,201,26,44,10,173,114,50,206,70,36,1,85,104,46,84,149,147,175,197,91,250,72,18,116,76,113,214,104,5,57,217,1,146,217,244,246,102,178,216,25,192,196,103,43,204,73,237,156,121,162,20,139,26,36,195,76,27,80,126,165,212,86,50,231,63,109,69,13,43,150,172,2,122,63,26,61,208,66,43,7,202,165,46,104,144,233,228,5,74,182,106,92,242,186,245,211,123,18,163,42,146,60,239,227,130,85,78,132,12,249,97,158,118,102,88,104,240,79,10,51,166,17,5,115,126,111,116,173,248,31,174,180,101,202,124,102,140,193,90,24,188,243,224,255,56,132,149,223,76,167,6,109,222,135,47,166,21,28,146,57,179,238,157,73,79,78,183,13,221,104,187,252,214,122,153,157,23,233,160,212,101,41,10,224,186,88,73,95,179,12,141,5,198,177,6,112,178,201,226,152,73,38,212,129,251,140,127,12,70,26,135,241,149,65,194,254,162,112,15,135,243,39,4,104,124,14,71,136,50,61,134,232,118,13,224,181,203,30,69,251,156,107,102,129,127,58,235,123,233,234,0,167,218,61,28,220,178,77,64,160,237,203,240,186,183,66,231,124,253,121,157,91,109,208,247,186,133,203,171,127,104,205,144,157,26,47,4,214,9,56,54,103,215,33,63,58,250,166,28,252,187,33,220,68,28,248,165,222,197,10,157,150,131,237,247,50,29,230,52,94,187,211,31,0,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,19,94,190,101,2,1,0,0,223,2,0,0,11,0,8,2,95,114,101,108,115,47,46,114,101,108,115,32,162,4,2,40,160,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,172,146,77,75,3,49,16,134,239,130,255,33,204,189,59,219,42,34,210,108,47,69,232,77,100,253,1,49,153,253,96,55,153,144,164,186,253,247,70,65,116,161,182,30,122,156,175,119,158,121,153,245,102,178,163,120,163,16,123,118,18,150,69,9,130,156,102,211,187,86,194,75,253,184,184,7,17,147,114,70,141,236,72,194,129,34,108,170,235,171,245,51,141,42,229,161,216,245,62,138,172,226,162,132,46,37,255,128,24,117,71,86,197,130,61,185,92,105,56,88,149,114,24,90,244,74,15,170,37,92,149,229,29,134,223,26,80,205,52,197,206,72,8,59,115,3,162,62,248,188,249,188,54,55,77,175,105,203,122,111,201,165,35,43,144,166,68,206,144,89,248,144,217,66,234,243,53,162,86,161,165,36,193,176,126,202,233,136,202,251,34,99,3,30,39,90,253,159,232,239,107,209,82,82,70,37,133,154,3,157,230,249,236,56,5,180,188,164,69,115,19,127,220,153,70,124,231,48,188,50,15,167,88,110,47,201,162,247,49,177,61,99,206,87,207,55,18,206,222,178,250,0,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,160,240,230,178,89,3,0,0,232,6,0,0,15,0,0,0,120,108,47,119,111,114,107,98,111,111,107,46,120,109,108,164,85,203,110,219,70,20,221,23,232,63,176,3,111,41,114,40,81,150,8,83,129,44,89,136,208,54,80,226,60,138,66,128,49,38,71,226,192,228,12,51,28,90,50,130,0,217,4,77,186,201,198,200,166,155,20,69,129,118,81,247,177,137,219,4,249,154,72,118,255,162,119,40,209,182,162,141,155,16,210,188,238,240,204,185,247,158,59,220,186,49,77,98,227,144,202,140,9,238,35,92,177,145,65,121,32,66,198,199,62,186,119,183,103,54,144,145,41,194,67,18,11,78,125,116,68,51,116,163,245,249,103,91,19,33,15,246,133,56,48,0,128,103,62,138,148,74,61,203,202,130,136,38,36,171,136,148,114,176,140,132,76,136,130,169,28,91,89,42,41,9,179,136,82,149,196,150,99,219,117,43,33,140,163,5,130,39,175,131,33,70,35,22,208,174,8,242,132,114,181,0,145,52,38,10,232,103,17,75,179,18,45,9,174,3,151,16,121,144,167,102,32,146,20,32,246,89,204,212,81,1,138,140,36,240,250,99,46,36,217,143,193,237,41,118,141,169,132,95,29,254,216,134,198,41,79,2,211,218,81,9,11,164,200,196,72,85,0,218,90,144,94,243,31,219,22,198,43,33,152,174,199,224,122,72,53,75,210,67,166,115,120,193,74,214,63,146,85,253,2,171,126,9,134,237,79,70,195,32,173,66,43,30,4,239,35,209,220,11,110,14,106,109,141,88,76,239,47,164,107,144,52,189,69,18,157,169,24,25,49,201,212,78,200,20,13,125,180,9,83,49,161,151,11,46,50,100,158,110,231,44,6,171,211,196,206,38,178,90,23,114,30,72,35,164,35,146,199,234,46,8,185,132,135,202,112,106,142,83,215,59,65,24,237,88,81,201,137,162,29,193,21,232,112,233,215,167,106,174,192,238,68,2,20,110,220,161,15,115,38,41,20,22,232,11,124,133,150,4,30,217,207,6,68,69,70,46,99,31,13,135,184,233,84,112,189,81,193,21,220,108,14,255,61,126,50,59,62,57,63,121,119,126,242,227,236,233,159,103,199,191,44,151,96,52,127,242,230,252,167,167,179,31,222,13,231,223,255,252,254,205,107,24,157,253,115,58,60,123,251,235,236,143,23,103,207,159,153,239,79,127,155,191,252,110,120,187,211,158,189,254,107,254,234,116,246,251,223,176,109,254,234,173,94,250,214,173,85,191,49,177,61,48,58,55,251,187,247,110,13,175,104,159,172,23,218,255,80,63,9,116,72,45,136,233,194,239,197,248,195,248,130,251,210,43,21,62,80,210,128,113,191,251,21,100,121,151,28,66,206,65,89,225,242,74,232,67,82,113,117,143,7,210,195,123,143,122,216,237,238,236,216,29,179,231,54,171,102,109,211,237,153,219,213,38,54,27,221,206,118,167,138,93,123,167,87,125,12,206,200,186,23,8,146,171,104,41,39,13,237,163,26,104,103,205,244,53,153,150,22,108,123,57,11,47,105,60,178,151,143,169,251,15,154,210,246,88,59,172,47,206,251,140,78,178,75,225,233,169,49,125,192,120,40,38,62,50,177,3,78,29,173,78,39,133,241,1,11,85,164,149,107,215,96,203,98,237,38,101,227,8,24,99,183,161,23,161,192,52,51,31,173,48,234,46,24,245,224,49,117,179,194,200,186,66,169,184,162,129,90,209,27,188,40,171,1,25,83,12,159,2,125,123,23,49,134,42,242,244,17,178,31,226,34,135,229,91,80,62,140,211,80,87,35,96,92,153,45,145,246,166,49,79,42,3,201,184,218,107,195,23,65,215,103,64,226,221,18,217,70,173,226,176,47,54,218,27,142,183,209,254,114,195,117,182,172,43,56,160,145,213,51,224,237,0,234,86,119,5,181,6,182,157,102,193,169,252,72,181,254,3,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,129,62,148,151,243,0,0,0,186,2,0,0,26,0,8,1,120,108,47,95,114,101,108,115,47,119,111,114,107,98,111,111,107,46,120,109,108,46,114,101,108,115,32,162,4,1,40,160,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,172,82,77,75,196,48,16,189,11,254,135,48,119,155,118,21,17,217,116,47,34,236,85,235,15,8,201,180,41,219,38,33,51,126,244,223,27,42,186,93,88,214,75,47,3,111,134,121,239,205,199,118,247,53,14,226,3,19,245,193,43,168,138,18,4,122,19,108,239,59,5,111,205,243,205,3,8,98,237,173,30,130,71,5,19,18,236,234,235,171,237,11,14,154,115,19,185,62,146,200,44,158,20,56,230,248,40,37,25,135,163,166,34,68,244,185,210,134,52,106,206,48,117,50,106,115,208,29,202,77,89,222,203,180,228,128,250,132,83,236,173,130,180,183,183,32,154,41,102,229,255,185,67,219,246,6,159,130,121,31,209,243,25,9,73,60,13,121,0,209,232,212,33,43,248,193,69,246,8,242,188,252,102,77,121,206,107,193,163,250,12,229,28,171,75,30,170,53,61,124,134,116,32,135,200,71,31,127,41,146,115,229,162,153,187,85,239,225,116,66,251,202,41,191,219,242,44,203,244,239,102,228,201,199,213,223,0,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,141,125,3,53,44,29,0,0,108,179,0,0,24,0,0,0,120,108,47,119,111,114,107,115,104,101,101,116,115,47,115,104,101,101,116,49,46,120,109,108,156,85,109,107,219,48,16,254,62,216,127,48,250,94,219,178,242,210,134,36,101,107,40,27,140,49,214,189,125,85,100,57,17,181,45,79,82,154,116,99,255,125,39,217,178,3,5,71,52,36,190,139,227,123,238,185,123,238,148,229,237,169,42,163,39,174,180,144,245,10,225,56,69,17,175,153,204,69,189,91,161,239,223,238,175,174,81,164,13,173,115,90,202,154,175,208,51,215,232,118,253,246,205,242,40,213,163,222,115,110,34,64,168,245,10,237,141,105,22,73,162,217,158,87,84,199,178,225,53,252,82,72,85,81,3,95,213,46,209,141,226,52,119,65,85,153,100,105,58,75,42,42,106,212,34,44,84,8,134,44,10,193,248,70,178,67,197,107,211,130,40,94,82,3,252,245,94,52,218,163,85,44,4,174,162,234,241,208,92,49,89,53,0,177,21,165,48,207,14,20,69,21,91,124,220,213,82,209,109,9,117,159,240,132,178,232,164,224,157,193,135,248,52,238,254,139,76,149,96,74,106,89,152,24,144,147,150,243,203,242,111,146,155,132,178,30,233,101,253,65,48,120,146,40,254,36,172,128,3,84,246,58,74,120,218,99,101,3,24,121,37,216,172,7,179,237,82,139,131,200,87,232,111,218,189,174,192,98,123,73,135,139,255,237,31,90,47,115,1,10,219,170,34,197,139,21,122,135,23,239,55,211,9,74,214,75,55,65,63,4,63,234,51,63,50,116,251,192,75,206,12,135,44,24,69,70,54,159,120,97,238,120,89,218,104,24,236,63,82,86,15,140,90,57,241,124,122,246,253,179,29,82,120,202,221,181,131,189,149,242,209,38,248,8,80,41,112,209,14,216,114,161,204,136,39,238,65,161,46,253,187,163,71,22,191,238,55,216,17,76,122,134,235,229,224,123,182,247,110,37,190,168,40,231,5,61,148,230,78,150,63,69,110,246,43,116,131,252,189,175,242,248,129,139,221,222,0,41,28,103,64,214,13,218,34,127,222,112,205,96,242,129,87,140,167,182,27,76,150,128,12,215,168,18,118,133,97,114,233,201,217,99,139,10,36,217,65,27,89,117,89,112,23,213,62,15,58,187,231,193,118,207,227,24,210,141,68,0,158,139,0,219,69,204,226,107,146,165,4,91,158,35,129,147,46,16,108,96,42,192,115,169,192,118,17,80,245,108,146,206,46,100,154,117,113,96,251,56,18,66,113,222,5,130,237,2,65,147,145,146,224,116,116,4,193,6,150,4,120,46,2,108,79,109,188,109,118,116,91,73,193,9,204,130,251,49,0,39,104,14,176,31,4,24,225,224,44,94,31,152,196,97,22,130,26,141,189,68,214,233,8,78,226,89,128,182,216,107,100,29,95,90,216,0,98,47,87,54,116,229,210,180,103,253,130,12,27,66,130,136,102,126,81,172,211,107,29,180,41,153,95,21,235,244,53,134,116,199,46,70,187,207,103,146,140,31,0,94,137,108,80,226,194,145,225,21,200,6,5,46,182,177,111,253,176,42,97,122,103,126,99,172,227,151,242,210,17,229,87,134,12,43,51,190,200,196,47,12,25,100,158,135,77,21,233,15,196,243,19,49,68,44,226,101,182,78,87,218,117,208,108,17,47,179,117,252,153,0,37,140,29,219,94,103,50,232,60,15,58,77,137,215,219,58,93,178,121,28,180,230,196,203,110,29,207,19,52,25,227,233,245,38,131,222,240,31,56,210,207,196,253,5,254,7,0,0,255,255,0,0,0,255,255,172,221,217,146,219,72,122,134,225,91,233,208,5,84,139,75,85,73,19,106,69,36,137,133,36,136,133,11,0,18,103,138,182,194,237,3,207,56,70,237,177,125,247,78,16,185,191,89,84,87,73,125,50,19,15,127,36,151,252,63,36,8,160,168,79,223,254,248,250,245,207,228,203,159,95,62,127,250,231,63,254,231,151,127,254,246,110,246,238,151,111,255,245,229,239,223,228,255,251,219,226,249,221,47,127,252,249,219,187,229,195,227,187,95,126,255,239,111,127,254,227,63,55,95,255,227,223,71,146,101,255,59,91,126,249,253,111,255,246,127,201,215,111,191,127,253,187,180,247,15,179,199,119,191,154,145,230,145,145,230,207,15,203,191,60,212,231,79,191,143,175,104,53,14,244,219,187,249,211,56,246,77,214,144,253,36,143,242,127,228,11,249,246,238,243,167,127,125,126,255,233,215,127,125,254,244,235,239,106,163,210,148,232,97,42,72,13,105,32,7,200,17,114,130,156,33,45,164,131,244,144,11,228,10,25,32,66,144,212,199,42,63,50,253,121,8,245,185,186,148,112,195,148,148,145,114,210,198,165,95,101,191,153,86,89,68,90,101,182,120,144,237,247,23,187,78,183,202,56,144,223,42,144,86,137,28,220,180,202,204,111,149,206,148,232,143,166,135,92,32,87,200,224,138,247,134,101,8,34,41,91,44,63,186,255,61,189,246,237,183,227,176,242,237,63,155,41,237,32,61,228,2,185,66,6,87,188,119,34,247,12,120,39,243,135,167,191,190,195,80,83,39,198,129,228,107,255,224,76,203,220,159,150,149,41,49,59,2,72,2,73,33,25,36,135,108,32,91,200,14,82,64,246,144,18,82,65,106,72,3,105,35,31,216,34,232,99,108,212,67,46,144,43,100,128,8,59,93,102,239,193,233,17,252,236,5,63,124,225,125,250,94,115,201,4,160,185,102,179,7,185,248,188,110,191,32,198,129,110,205,165,95,237,10,178,134,36,144,20,146,65,114,200,6,178,133,236,32,5,100,15,41,33,21,164,134,52,144,22,210,65,122,200,5,114,133,12,16,193,201,16,156,13,193,143,90,240,179,22,222,135,237,181,142,220,189,255,216,126,201,30,200,200,93,18,187,240,13,171,147,24,7,10,118,113,203,96,23,103,74,204,46,14,146,64,82,72,6,201,33,27,200,22,178,131,20,144,61,164,132,84,144,26,210,64,14,144,35,228,4,105,141,216,5,254,49,216,49,98,163,30,114,129,92,33,3,68,216,73,182,59,70,86,113,198,4,167,76,120,115,230,117,247,199,72,75,62,61,124,148,251,233,87,31,166,207,222,255,172,246,190,141,20,244,247,83,208,223,182,198,52,56,41,33,165,164,140,148,147,54,164,45,105,71,42,72,123,82,73,170,72,53,169,33,29,72,71,210,137,116,38,181,164,142,212,147,46,164,43,105,32,9,17,177,85,196,214,17,139,204,184,136,76,185,136,204,185,240,39,221,139,201,44,246,109,246,45,95,44,196,109,164,160,183,159,195,222,30,159,205,59,202,88,219,205,116,187,39,164,148,148,145,114,210,134,180,37,237,72,5,105,79,42,73,21,169,38,53,164,131,71,254,36,141,95,11,113,202,97,241,138,115,14,250,43,196,108,250,130,185,148,187,65,243,213,238,67,56,73,166,198,238,128,64,137,29,73,87,165,164,140,148,147,54,177,87,245,209,127,85,91,110,182,35,21,164,61,169,36,85,164,154,212,196,94,232,44,56,139,114,224,118,71,210,41,58,84,240,45,251,204,237,90,82,71,234,163,163,7,95,22,47,220,238,74,26,162,67,5,95,163,228,158,13,29,34,86,202,228,35,246,52,66,112,52,39,214,170,72,158,7,176,69,193,177,136,48,205,230,22,5,235,166,220,25,78,47,193,123,186,96,7,36,247,142,145,162,32,0,114,119,25,41,10,250,81,232,166,117,159,110,30,180,130,208,93,235,198,109,30,76,178,208,125,252,40,119,142,230,51,152,7,147,37,116,107,203,42,25,56,127,247,240,179,78,14,137,217,116,58,102,233,189,146,96,174,87,186,200,158,22,91,147,18,82,74,202,72,185,166,133,57,69,179,209,36,79,177,216,15,40,232,164,173,45,210,59,164,29,169,32,237,73,37,169,34,213,164,38,250,74,131,38,60,112,187,35,233,20,29,42,72,198,153,219,181,164,142,212,107,186,157,142,190,157,50,190,144,174,164,193,146,51,23,97,22,77,35,217,225,229,238,96,106,46,123,146,90,134,127,34,153,55,243,85,64,55,142,124,200,152,238,156,231,219,89,235,89,248,108,186,139,62,216,45,116,23,125,180,164,187,72,30,91,153,129,117,211,200,165,215,152,233,26,231,133,154,182,185,153,31,190,216,137,202,183,29,64,77,103,16,191,19,62,85,228,134,15,148,204,64,41,41,35,229,154,220,240,169,177,238,135,207,20,217,240,129,10,61,250,210,124,218,123,82,73,170,72,53,169,177,228,180,102,176,115,63,112,187,35,233,20,29,10,225,195,59,108,57,84,71,234,53,185,225,83,99,89,186,178,106,176,116,55,124,24,75,134,111,178,199,197,20,161,112,161,90,171,199,253,36,78,219,200,135,198,139,69,243,121,120,164,35,151,220,169,226,197,92,78,15,123,185,156,200,203,165,122,26,47,151,202,188,92,170,183,229,229,210,53,63,151,227,25,217,240,152,89,94,125,123,237,121,209,113,19,249,149,229,59,169,84,69,110,42,65,137,30,202,86,165,164,140,148,107,114,83,169,134,191,159,74,83,100,83,9,42,244,232,110,42,81,85,178,170,34,213,164,198,146,211,179,193,209,212,129,219,29,73,167,232,80,72,37,94,123,203,161,58,82,175,201,77,165,26,203,77,37,104,176,27,222,77,37,54,148,169,156,236,229,84,78,143,251,169,84,166,82,185,248,24,102,89,55,149,74,101,248,176,110,48,47,149,211,152,94,42,213,211,120,169,84,230,165,82,189,45,47,149,174,249,169,28,79,118,35,149,111,57,83,60,155,78,155,127,39,151,170,200,205,37,40,209,67,185,185,68,85,198,170,92,147,155,75,181,225,253,92,154,34,155,75,80,161,71,119,115,137,170,146,85,21,169,38,53,150,108,215,46,240,93,22,79,120,228,80,167,216,80,115,228,18,67,181,28,170,35,245,154,220,92,170,177,220,92,130,6,187,225,221,92,98,67,153,203,201,94,206,229,244,184,159,75,101,83,46,23,179,240,179,148,171,229,84,241,98,46,167,135,189,92,78,228,229,82,61,141,151,75,101,94,46,213,219,242,114,233,154,159,75,239,98,144,60,119,126,187,131,229,77,185,28,71,250,238,122,169,138,220,92,130,146,25,40,37,101,164,92,147,155,75,53,214,253,92,154,34,155,75,80,161,71,119,115,137,170,146,85,21,169,38,53,150,156,92,6,231,12,14,220,238,72,58,197,134,98,46,241,218,91,14,213,145,122,77,110,46,213,88,110,46,65,131,221,240,110,46,177,161,204,229,100,47,231,114,122,92,46,171,227,17,235,242,17,71,172,186,167,212,49,237,242,249,145,171,231,52,198,139,41,157,30,246,82,58,145,151,82,245,66,188,148,42,115,18,185,211,31,133,151,82,245,198,35,223,53,199,203,100,102,245,252,161,148,78,23,220,190,179,122,170,34,55,165,160,100,6,74,73,25,41,215,228,166,84,141,117,63,165,166,200,166,20,84,232,209,221,148,162,170,100,85,69,170,73,141,37,39,165,193,57,187,3,183,59,146,78,177,161,152,82,188,246,150,67,117,164,94,147,155,82,53,150,155,82,208,96,55,188,155,82,108,40,83,58,217,203,41,157,30,87,41,125,122,198,17,172,238,41,149,210,231,89,36,165,211,24,83,74,121,150,119,122,212,11,233,68,94,72,213,235,240,66,170,204,91,74,213,123,244,66,234,154,191,148,122,87,158,127,40,164,227,72,223,93,74,85,145,27,82,80,50,3,165,164,140,148,107,114,67,170,198,186,31,82,83,100,67,10,42,244,232,110,72,81,85,178,170,34,213,164,198,146,19,210,224,116,246,129,219,29,73,167,216,80,12,41,94,123,203,161,58,82,175,201,13,169,26,203,13,41,104,176,27,222,13,41,54,148,33,157,76,133,52,188,226,178,86,15,171,140,126,248,240,33,92,39,117,75,169,140,126,92,68,50,58,61,197,75,25,157,30,245,50,58,145,151,209,137,252,147,182,202,188,140,170,183,232,101,212,53,47,163,115,239,142,14,89,246,230,195,221,219,72,223,203,168,46,114,50,74,74,72,41,41,35,229,154,156,140,106,186,155,81,91,100,50,74,42,72,123,82,73,170,72,53,169,137,189,210,69,112,109,231,192,237,142,164,83,244,77,135,95,67,185,93,75,234,72,189,38,39,163,164,43,105,176,116,47,163,220,80,172,148,61,78,95,41,145,81,245,176,202,232,108,182,224,225,174,46,153,70,152,205,62,190,199,241,174,42,121,33,165,234,81,55,165,138,220,148,234,167,113,87,82,109,110,74,245,155,116,83,234,153,159,82,239,222,148,31,74,233,116,223,201,253,195,221,185,42,114,83,10,74,88,149,146,50,82,174,201,77,169,26,254,126,74,77,145,77,41,168,208,163,59,43,41,169,36,85,164,154,212,88,114,86,210,160,33,15,220,238,72,58,197,134,194,74,202,237,90,82,71,234,53,185,41,85,159,150,179,146,178,106,176,116,55,165,24,75,166,116,178,167,219,119,78,134,116,122,84,135,84,126,37,197,74,170,6,80,43,233,236,49,22,210,105,148,151,66,58,61,234,133,116,34,47,164,234,149,120,33,85,230,133,84,189,71,47,164,174,249,33,245,238,77,250,161,144,170,91,72,228,83,217,171,252,225,205,7,115,85,228,134,20,148,176,42,37,101,164,92,147,27,82,53,252,253,144,154,34,27,82,80,161,71,119,67,138,170,146,85,21,169,38,53,150,156,144,6,23,203,15,220,238,72,58,197,134,98,72,241,218,91,14,213,145,122,77,110,72,113,255,208,149,85,131,165,187,33,197,88,50,164,147,189,20,210,233,81,121,54,102,60,111,52,251,240,196,195,93,53,128,188,45,225,86,242,241,233,137,43,233,52,202,52,72,184,35,208,221,38,191,28,155,91,13,116,187,201,131,109,99,27,245,68,114,89,180,183,41,232,39,119,79,29,233,207,194,139,169,122,231,60,117,52,247,238,17,250,161,152,254,149,123,132,110,79,39,15,139,221,152,170,237,44,37,172,74,73,25,41,215,228,198,84,13,127,63,166,166,200,198,20,84,232,209,221,152,162,170,100,85,69,170,73,141,37,39,166,225,61,66,220,238,72,58,197,134,98,76,241,218,91,14,213,145,122,77,110,76,213,88,238,90,10,26,236,134,119,99,138,13,101,76,245,61,66,183,59,14,252,91,64,229,31,95,170,219,133,166,211,187,243,199,15,75,174,165,170,100,138,233,252,121,30,57,224,157,74,94,138,169,26,192,139,169,50,47,166,147,249,49,85,117,222,106,170,222,165,23,83,154,110,39,121,44,32,91,211,95,97,199,123,28,126,202,89,223,185,186,91,226,254,10,171,138,220,232,130,18,61,148,115,205,148,148,145,114,77,110,116,213,240,247,163,107,138,108,116,65,133,30,221,141,46,170,74,86,85,164,154,212,88,114,162,27,222,97,196,237,142,164,83,108,40,70,23,175,189,229,80,29,169,215,228,70,87,141,229,70,23,52,216,13,239,70,23,27,202,232,78,54,173,176,225,221,171,107,245,168,190,50,51,95,226,94,89,221,82,106,133,93,46,159,120,70,73,141,242,82,116,167,87,224,175,176,202,188,232,78,230,71,87,213,121,43,172,122,151,94,116,105,186,157,98,209,29,111,132,248,57,209,85,183,84,220,143,174,42,114,163,11,74,230,160,148,148,145,114,77,110,116,213,88,247,163,107,138,108,116,65,133,30,221,141,46,170,74,86,85,164,154,212,88,114,162,27,222,134,196,237,142,164,83,108,40,70,23,175,189,229,80,29,169,215,228,70,87,141,229,70,23,52,216,13,239,70,23,27,202,232,78,246,82,116,167,71,245,229,154,197,18,71,190,186,165,84,116,159,228,225,51,15,142,167,81,94,138,174,122,14,111,213,85,230,69,119,50,63,186,170,206,139,174,122,151,94,116,105,186,157,98,209,29,239,149,8,163,59,127,255,150,191,219,151,191,203,113,187,142,35,175,235,154,47,182,225,145,203,202,22,233,144,172,73,9,41,37,101,164,156,180,33,109,73,59,82,65,218,147,74,82,165,73,94,59,179,31,68,112,107,67,109,139,244,7,209,144,14,164,35,233,68,58,147,90,82,167,201,246,94,79,186,144,174,164,33,250,174,195,5,82,240,69,200,92,170,198,113,82,97,154,194,49,211,21,142,153,182,112,204,244,133,151,50,62,135,233,12,167,78,183,198,163,243,181,84,247,134,107,186,57,92,211,173,16,75,217,120,175,195,79,74,217,116,219,196,66,166,220,54,23,78,31,153,34,155,50,80,34,127,30,100,12,172,28,74,87,165,164,140,148,147,54,164,45,105,71,42,72,123,82,73,170,72,53,169,33,29,72,71,210,137,116,38,181,164,142,212,147,46,164,43,105,208,36,155,215,78,118,248,183,101,194,86,153,83,41,171,136,173,35,102,122,192,89,65,76,19,56,102,186,192,49,211,6,142,153,62,112,204,52,130,183,114,169,222,243,86,46,215,252,239,134,227,109,8,63,41,63,211,29,13,227,47,90,217,143,52,56,139,181,26,127,124,102,76,134,221,51,172,73,9,41,37,101,164,156,180,33,109,73,59,82,65,218,147,74,82,69,170,73,13,233,64,58,146,78,164,51,169,37,117,164,158,116,33,93,73,3,73,254,0,22,230,86,174,64,180,200,132,139,200,140,139,200,148,139,200,156,139,200,164,139,200,172,139,200,180,139,200,188,11,51,241,183,181,219,79,203,120,67,0,210,242,176,124,124,239,254,39,207,161,190,250,39,34,22,177,27,10,22,239,31,158,229,106,244,202,31,226,185,13,21,254,6,74,248,35,17,182,200,172,99,164,132,148,146,50,82,78,218,144,182,164,157,38,249,65,219,157,72,112,110,179,176,69,250,197,239,73,37,169,34,213,164,134,116,32,29,73,39,210,153,212,146,58,82,79,186,144,174,164,129,36,68,196,86,17,91,71,204,244,128,243,45,202,52,129,99,166,11,28,51,109,224,126,3,139,60,135,105,4,231,79,54,77,39,56,102,38,254,102,94,50,23,227,245,197,48,153,111,204,207,116,169,114,220,115,217,22,12,127,227,224,246,124,254,15,81,144,18,82,74,202,72,57,105,67,218,146,118,138,150,114,119,98,95,124,112,150,162,176,69,54,63,234,250,172,61,58,47,89,85,145,106,82,67,58,144,142,164,19,233,76,106,73,29,169,39,93,72,87,210,64,146,249,193,167,35,86,17,91,71,76,247,128,156,17,115,12,169,155,192,53,221,5,174,233,54,112,77,247,129,107,186,17,92,115,58,33,188,30,176,136,94,113,127,126,24,207,226,188,118,173,153,174,23,122,89,9,207,186,174,110,207,23,100,197,108,167,63,148,132,85,41,41,35,229,164,13,105,75,218,105,178,103,59,11,77,238,242,243,24,156,96,216,219,34,253,226,75,82,69,170,73,13,233,64,58,146,78,164,51,169,37,117,164,158,116,33,93,73,3,73,102,69,77,173,179,207,55,29,224,216,58,82,103,122,192,91,107,56,158,233,2,111,173,97,157,233,3,167,206,52,130,99,166,19,28,115,90,1,249,25,175,190,233,181,230,81,126,131,28,111,254,148,127,234,244,134,248,168,107,128,238,82,243,24,254,36,231,194,20,217,67,53,80,194,170,148,148,145,114,210,134,180,37,237,72,5,105,175,201,134,172,36,85,164,154,212,144,14,164,35,233,68,58,147,90,82,71,234,73,23,210,149,52,144,100,88,212,68,218,79,71,46,44,180,117,196,204,140,59,219,154,41,119,204,204,185,99,102,210,29,51,179,238,152,153,118,199,204,188,223,204,63,8,27,175,109,133,193,152,63,189,105,97,81,151,216,236,121,130,213,2,180,38,37,164,148,148,145,114,210,134,180,37,237,72,5,105,175,201,91,89,130,179,139,165,45,210,81,175,72,53,169,33,29,72,71,210,137,116,38,181,164,142,212,147,46,164,43,105,32,201,100,168,217,246,150,17,154,105,1,167,206,244,128,183,140,112,91,211,5,222,50,194,58,211,7,222,50,194,58,211,9,222,50,194,58,167,23,204,33,97,100,234,69,100,238,69,100,242,69,100,246,69,100,250,69,100,254,69,164,1,68,164,3,68,164,5,68,164,7,68,164,9,68,164,11,68,164,13,68,164,15,86,145,62,88,153,61,129,253,156,87,145,62,88,249,125,224,239,169,198,75,121,225,158,106,118,251,117,253,87,31,2,171,43,138,222,26,30,254,230,236,120,81,33,248,221,66,82,66,74,53,121,187,141,224,164,106,102,139,116,63,229,164,13,105,75,218,145,10,210,158,84,146,42,82,77,106,72,7,210,145,116,34,157,73,45,169,35,245,164,11,233,74,26,72,114,223,165,102,219,219,119,209,214,145,58,211,3,222,190,139,219,70,230,92,68,38,93,68,102,93,152,105,247,86,117,245,28,145,85,221,189,144,173,15,119,231,31,223,180,170,79,215,10,229,215,69,221,168,171,5,104,77,74,72,169,38,251,65,101,164,156,180,33,109,73,59,82,65,218,147,74,82,69,170,73,13,233,64,58,146,78,164,51,169,37,117,164,158,116,33,93,73,3,73,230,64,205,173,151,3,154,153,112,111,13,103,93,100,202,69,100,206,101,14,184,109,100,214,101,14,84,157,151,3,215,252,53,195,189,212,172,115,32,215,140,49,197,175,61,109,50,93,143,243,114,0,90,143,87,210,252,69,35,33,165,154,220,28,168,13,45,229,172,218,144,182,164,29,169,32,237,73,37,169,34,213,164,134,116,32,29,73,39,210,153,212,146,58,82,79,186,144,174,164,129,36,115,128,249,144,223,242,104,102,194,189,28,176,46,50,229,50,7,172,139,76,186,92,15,88,103,166,221,203,129,170,139,172,7,238,37,99,147,131,135,153,255,47,171,200,3,150,215,95,4,115,47,175,153,145,63,190,225,103,138,23,211,95,238,250,231,37,113,13,204,20,217,19,43,160,196,14,101,238,229,32,101,164,156,180,33,109,73,59,82,65,218,43,26,79,163,153,51,253,143,193,149,178,210,22,217,47,148,211,91,148,219,105,170,89,213,144,14,164,35,233,68,58,147,90,82,71,234,73,23,210,149,52,144,100,8,241,190,101,8,105,235,136,233,30,112,62,51,145,70,234,116,23,184,117,186,13,92,211,125,224,154,110,4,215,116,39,184,166,91,97,50,111,129,26,47,250,240,75,141,76,235,43,87,167,219,56,242,140,166,60,15,101,59,43,188,0,102,139,76,120,72,137,34,251,247,12,41,36,211,155,185,183,0,127,8,206,140,228,182,72,63,221,134,180,37,237,72,5,105,79,42,73,21,169,38,53,164,3,233,72,58,145,206,164,150,212,145,122,210,133,116,37,13,36,33,34,182,138,216,58,98,186,3,228,233,28,123,249,43,82,231,116,129,169,139,76,186,136,204,186,136,76,187,136,204,187,240,39,222,143,142,123,249,216,172,60,111,136,206,116,161,112,188,198,109,163,19,92,126,93,141,127,69,62,222,3,101,175,8,174,73,9,41,37,101,164,156,180,33,109,73,59,82,65,218,147,74,82,69,170,73,13,233,64,58,146,78,164,51,169,37,117,164,158,116,33,93,73,131,37,59,217,184,181,93,112,67,17,233,0,17,105,1,17,233,1,17,105,2,17,233,2,17,105,3,25,30,116,158,12,15,45,210,9,50,60,110,157,31,30,247,122,242,143,132,103,186,130,55,94,68,55,225,121,10,46,190,174,228,95,132,222,194,99,151,148,53,41,33,165,164,140,148,147,54,164,45,105,71,42,72,123,82,73,170,72,53,169,33,29,72,71,210,137,116,38,181,164,142,212,147,46,164,43,105,176,228,76,54,110,106,231,134,50,60,232,0,25,30,90,164,7,100,120,88,23,233,2,25,30,214,69,250,64,134,135,117,145,78,144,225,113,235,252,240,196,46,38,143,63,128,246,218,131,182,233,170,161,31,158,240,238,245,165,41,178,7,109,160,132,85,41,41,35,229,164,13,105,75,218,145,10,210,158,84,146,42,82,77,106,72,7,210,145,116,34,157,73,45,169,35,245,164,11,233,74,26,44,57,225,193,221,235,220,80,134,7,211,45,195,67,139,244,128,12,15,235,34,93,32,195,195,186,72,31,200,240,176,46,210,9,50,60,110,157,31,158,216,5,231,183,132,103,186,72,231,29,182,61,133,183,174,47,77,145,13,15,40,97,85,74,202,72,57,105,67,218,146,118,164,130,180,39,149,164,138,84,147,26,210,129,116,36,157,72,103,82,75,234,72,61,233,66,186,146,6,75,78,120,240,15,144,112,67,25,30,76,183,12,15,45,210,3,50,60,172,139,116,129,12,15,235,34,125,32,195,195,186,72,39,200,240,184,117,126,120,98,215,64,199,159,18,122,237,202,51,93,57,242,195,19,254,195,109,227,63,24,22,126,231,1,37,172,74,73,25,41,39,109,72,91,210,142,84,144,246,164,146,84,145,106,82,67,58,144,142,164,147,37,167,111,131,211,50,103,110,215,146,58,82,79,186,144,174,164,33,250,178,194,127,236,74,112,67,25,39,52,128,140,19,45,210,21,50,78,172,139,244,133,140,19,235,34,157,33,227,196,186,72,111,200,56,185,117,126,156,98,151,73,223,178,22,77,23,160,188,56,61,7,127,13,189,90,154,34,187,22,129,18,86,165,164,140,148,147,54,164,45,105,71,42,72,123,82,73,170,72,53,169,33,29,72,71,210,137,116,38,181,164,142,212,147,46,164,43,105,176,100,51,253,28,254,251,110,130,27,202,240,96,186,101,120,104,145,30,144,225,97,93,164,11,100,120,88,23,233,3,25,30,214,69,58,65,134,199,173,243,195,19,189,182,250,134,111,65,234,15,29,221,243,111,207,225,13,181,75,83,100,195,3,74,88,149,146,50,82,78,218,144,182,164,29,169,32,237,73,37,169,34,213,164,134,116,32,29,73,39,210,153,212,146,58,82,79,186,144,174,164,193,146,19,30,252,195,146,220,80,134,7,211,45,195,67,139,244,128,12,15,235,34,93,32,195,195,186,72,31,200,240,176,46,210,9,50,60,110,157,31,158,232,5,217,55,132,71,253,173,166,23,158,240,78,182,165,41,178,225,1,37,172,74,73,25,41,39,109,72,91,210,142,84,144,246,164,146,84,145,106,82,67,58,144,142,164,19,233,76,106,73,29,169,39,93,72,87,210,96,201,9,79,248,155,131,130,27,202,240,96,186,101,120,104,145,30,144,225,97,93,164,11,100,120,88,23,233,3,25,30,214,69,58,65,134,199,173,243,195,227,253,73,175,204,216,237,151,188,223,16,30,117,41,217,11,79,120,199,193,210,20,217,240,128,18,86,165,164,140,148,147,54,164,45,105,71,42,72,123,82,73,170,72,53,169,33,29,72,71,210,137,116,38,181,164,142,212,147,46,164,43,105,176,228,132,39,252,71,36,4,55,148,225,193,116,203,240,208,34,61,32,195,195,186,72,23,200,240,176,46,210,7,50,60,172,139,116,130,12,143,91,231,133,71,254,72,75,228,95,99,123,125,120,110,227,220,174,136,58,159,103,120,199,129,45,50,225,33,37,164,148,148,145,114,210,134,180,37,237,72,5,105,79,42,73,21,169,38,53,164,3,233,72,58,145,206,164,150,212,145,122,210,133,116,37,13,150,156,201,198,9,3,110,40,86,17,91,71,44,210,3,34,210,4,34,210,5,34,210,6,34,210,7,34,210,8,34,210,9,194,111,5,63,60,222,159,172,191,125,229,25,255,217,239,233,212,154,253,60,195,159,31,94,217,34,27,30,92,248,77,88,149,146,50,82,78,218,144,182,164,29,169,32,237,73,37,169,34,213,164,134,116,32,29,73,39,210,153,212,146,58,82,79,186,144,174,164,193,146,51,217,56,97,192,13,101,120,120,157,127,29,177,72,15,200,240,112,219,72,23,200,240,176,46,210,7,50,60,145,123,14,34,230,183,130,31,30,239,111,216,127,32,60,234,175,134,189,155,207,194,19,6,143,166,200,134,7,148,176,42,37,101,164,156,180,33,109,73,59,82,65,218,147,74,82,69,170,73,13,233,64,58,146,78,164,51,169,37,117,164,158,116,33,93,73,3,73,136,136,173,34,182,142,88,100,198,101,84,208,24,114,157,113,205,111,99,247,234,255,120,107,246,248,237,227,121,241,32,255,5,7,231,63,121,218,236,213,247,82,203,127,243,229,39,253,67,185,233,109,40,249,251,13,246,215,236,228,91,82,127,214,232,88,238,217,244,54,127,253,246,199,215,175,127,38,95,254,252,242,249,255,1,0,0,255,255,0,0,0,255,255,108,216,239,78,163,88,28,198,241,91,33,92,192,90,14,135,182,18,53,193,234,88,139,179,101,33,66,56,239,24,197,182,177,150,6,113,221,157,171,223,47,238,56,179,201,62,111,76,203,167,167,231,233,249,247,67,206,94,218,126,211,46,218,253,254,213,123,232,222,14,195,185,31,68,83,255,226,236,231,117,175,111,159,206,253,59,19,39,75,227,159,252,15,146,121,92,204,197,245,251,121,156,92,42,72,174,145,27,41,193,4,9,38,170,151,32,136,255,8,2,41,38,190,9,84,178,101,96,226,181,148,12,201,165,20,72,41,165,66,106,41,14,73,18,73,201,106,180,84,91,16,18,60,20,63,105,137,172,165,100,72,46,165,64,74,41,21,82,75,113,8,193,85,4,130,99,169,182,192,18,220,202,224,150,224,74,50,218,228,82,10,164,148,82,33,181,20,135,16,92,117,68,112,44,213,22,68,4,143,100,240,136,224,74,50,218,228,82,10,164,148,82,33,181,20,135,16,92,117,68,112,44,213,22,76,9,62,149,193,167,4,87,146,209,38,151,82,32,165,148,10,169,165,56,132,224,170,35,130,99,169,182,96,70,240,153,12,62,35,184,146,140,54,185,148,2,41,165,84,72,45,197,33,4,87,29,17,28,75,181,5,115,130,171,67,106,137,172,165,100,72,46,165,64,74,41,21,82,75,113,8,193,229,57,185,26,45,213,22,156,18,252,84,142,248,41,193,149,100,180,201,165,20,72,41,165,66,106,41,14,33,184,234,136,17,199,82,109,102,18,223,24,117,246,47,145,181,148,12,201,165,20,72,41,165,66,106,41,14,73,18,73,201,106,180,84,155,9,8,174,74,211,18,89,75,201,144,92,74,129,148,82,42,164,150,226,16,130,203,234,184,26,45,213,102,168,156,70,86,78,100,45,37,67,114,41,5,82,74,169,144,90,138,67,8,46,111,43,86,163,165,218,12,149,211,200,202,137,172,165,100,72,46,165,64,74,41,21,82,75,113,8,193,117,229,28,45,213,102,168,156,70,86,78,100,45,37,67,114,41,5,82,74,169,144,90,138,67,8,174,43,231,104,169,54,67,229,52,178,114,34,107,41,25,146,75,41,144,82,74,133,212,82,28,66,112,93,57,71,75,181,153,105,252,213,168,178,245,59,114,47,165,68,106,41,14,161,35,89,5,13,21,200,168,50,227,16,26,201,10,100,198,115,220,200,51,62,156,196,183,161,58,14,87,72,178,148,148,132,1,141,212,57,176,66,18,254,168,27,232,208,208,72,237,193,20,73,248,163,26,89,38,215,170,217,40,144,90,138,67,146,84,82,98,25,114,171,198,213,33,52,82,116,23,178,94,151,161,92,203,183,216,229,149,182,240,52,78,67,85,158,238,16,126,175,172,92,118,18,47,172,154,142,47,8,1,229,63,45,150,19,219,170,49,119,8,141,228,116,88,78,75,171,198,220,33,52,146,211,17,65,95,34,73,215,17,195,116,19,169,97,186,52,241,66,157,97,247,97,236,228,176,70,113,166,102,226,158,137,189,148,187,226,26,185,145,18,134,204,130,236,36,140,226,171,80,109,151,107,132,9,151,59,201,178,253,172,220,126,8,163,166,27,113,243,101,213,238,115,118,220,152,146,18,203,141,143,85,107,196,33,52,146,203,39,226,166,35,82,107,196,33,73,42,41,137,88,62,145,92,62,8,141,244,242,161,102,89,53,169,206,142,117,73,82,98,169,23,86,77,134,67,104,244,65,39,191,30,21,92,156,29,183,221,161,29,118,15,89,239,61,117,135,225,246,145,231,6,83,223,27,254,62,182,231,254,161,91,116,135,63,219,254,117,215,29,198,195,227,216,108,218,175,77,191,217,29,94,189,125,251,196,51,134,201,111,51,223,235,119,155,237,231,235,161,59,126,92,141,124,239,91,55,12,221,203,231,187,109,219,60,182,253,248,46,244,233,170,27,62,223,252,248,222,162,29,222,142,222,177,57,182,125,177,251,78,231,167,190,247,250,208,236,121,53,155,251,94,215,239,218,195,208,12,36,57,247,143,93,63,244,205,110,240,189,45,215,191,147,187,217,95,29,119,231,126,56,153,248,30,129,249,65,255,185,66,15,125,247,126,217,183,205,243,175,135,35,190,247,210,28,222,154,253,199,229,197,143,39,38,60,47,249,214,63,123,59,70,129,141,198,39,254,26,135,35,156,19,153,79,243,122,28,133,147,159,95,118,113,246,216,55,239,187,195,198,235,227,177,77,127,251,248,239,39,222,187,254,249,117,219,182,195,197,63,0,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,194,135,219,242,125,6,0,0,215,27,0,0,19,0,0,0,120,108,47,116,104,101,109,101,47,116,104,101,109,101,49,46,120,109,108,236,89,75,111,27,55,16,190,23,232,127,32,246,158,232,97,73,182,140,200,129,37,75,113,155,56,49,108,37,69,142,212,138,218,101,196,93,46,72,202,142,110,69,114,44,80,160,104,90,244,82,160,183,30,138,182,1,18,160,151,244,215,184,77,209,166,64,254,66,135,228,74,90,90,116,108,39,6,250,178,14,182,196,253,56,239,25,206,112,175,93,127,152,48,116,64,132,164,60,109,5,149,171,229,0,145,52,228,67,154,70,173,224,110,191,119,101,45,64,82,225,116,136,25,79,73,43,152,18,25,92,223,120,255,189,107,120,93,197,36,33,8,246,167,114,29,183,130,88,169,108,189,84,146,33,44,99,121,149,103,36,133,103,35,46,18,172,224,167,136,74,67,129,15,129,110,194,74,213,114,185,81,74,48,77,3,148,226,4,200,222,25,141,104,72,80,223,144,132,167,171,232,10,170,150,43,229,96,99,198,168,203,128,91,170,164,94,8,153,216,215,108,136,187,251,248,190,225,184,162,209,114,42,59,76,160,3,204,90,1,240,31,242,195,62,121,168,2,196,176,84,240,160,21,148,205,39,40,109,92,43,225,245,124,19,83,39,236,45,236,235,153,79,190,47,223,48,28,87,13,79,17,13,230,76,43,189,90,115,117,107,78,223,0,152,90,198,117,187,221,78,183,50,167,103,0,56,12,65,107,43,75,145,102,173,183,86,105,207,104,22,64,246,235,50,237,78,185,94,174,185,248,2,253,149,37,153,155,237,118,187,222,204,101,177,68,13,200,126,173,45,225,215,202,141,218,102,213,193,27,144,197,215,151,240,181,246,102,167,211,112,240,6,100,241,141,37,124,111,181,217,168,185,120,3,138,25,77,199,75,104,237,208,94,47,167,62,135,140,56,219,246,194,215,0,190,86,206,225,11,20,68,195,60,210,52,139,17,79,213,89,226,46,193,15,184,232,1,88,111,98,88,209,20,169,105,70,70,56,132,72,239,224,100,32,40,214,204,240,58,193,133,39,118,41,148,75,75,154,47,146,161,160,153,106,5,31,102,24,178,102,65,239,245,139,239,95,191,120,134,94,191,120,122,244,232,249,209,163,159,142,30,63,62,122,244,163,165,229,108,220,198,105,84,220,248,234,219,207,254,252,250,99,244,199,179,111,94,61,249,194,143,151,69,252,175,63,124,242,203,207,159,251,129,144,77,11,137,94,126,249,244,183,231,79,95,126,245,233,239,223,61,241,192,55,5,30,20,225,125,154,16,137,110,147,67,180,199,19,208,205,24,198,149,156,12,196,249,118,244,99,76,157,29,56,6,218,30,210,93,21,59,192,219,83,204,124,184,54,113,141,119,79,64,33,241,1,111,76,30,56,178,238,199,98,162,168,135,243,205,56,113,128,59,156,179,54,23,94,3,220,212,188,10,22,238,79,210,200,207,92,76,138,184,61,140,15,124,188,59,56,117,92,219,157,100,80,77,103,65,233,216,190,19,19,71,204,93,134,83,133,35,146,18,133,244,51,62,38,196,163,221,125,74,29,187,238,208,80,112,201,71,10,221,167,168,141,169,215,36,125,58,112,2,105,177,105,155,38,224,151,169,79,103,112,181,99,155,157,123,168,205,153,79,235,45,114,224,34,33,33,48,243,8,223,39,204,49,227,13,60,81,56,241,145,236,227,132,21,13,126,11,171,216,39,228,254,84,132,69,92,87,42,240,116,68,24,71,221,33,145,210,183,231,142,0,125,11,78,191,137,161,118,121,221,190,195,166,137,139,20,138,142,125,52,111,97,206,139,200,45,62,238,196,56,201,188,50,211,52,46,98,63,144,99,8,81,140,118,185,242,193,119,184,155,33,250,55,248,1,167,39,186,251,30,37,142,187,79,47,4,119,105,228,136,180,8,16,253,100,34,60,190,188,65,184,155,143,83,54,194,196,84,25,40,239,78,165,78,104,250,166,178,205,40,212,237,203,178,61,59,199,54,225,16,243,37,207,246,177,98,125,18,238,95,88,162,183,240,36,221,37,144,21,203,71,212,101,133,190,172,208,193,127,190,66,159,148,203,23,95,151,23,165,24,170,244,162,239,54,93,120,114,166,38,124,68,25,219,87,83,70,110,73,211,135,75,56,140,134,61,88,52,195,130,153,30,231,3,90,22,195,215,188,253,119,112,145,192,102,15,18,92,125,68,85,188,31,227,12,122,248,138,25,75,35,153,147,142,36,202,184,132,57,210,44,155,1,152,28,163,109,198,88,10,109,188,153,66,235,122,62,177,85,68,98,181,195,135,118,121,165,56,135,206,201,152,169,52,50,115,239,140,209,138,38,112,86,102,43,171,239,198,172,98,165,58,209,108,174,106,21,35,154,41,144,142,106,115,149,193,159,203,170,193,226,220,154,208,229,32,232,141,192,202,13,24,232,181,236,48,251,96,70,134,218,238,118,70,159,185,69,179,190,80,23,201,24,15,73,238,35,173,247,178,143,42,198,73,179,88,153,133,145,199,71,122,166,60,197,71,5,110,77,77,246,29,184,157,197,73,69,118,181,19,216,205,188,247,46,94,154,13,210,11,47,233,28,62,150,142,44,45,38,39,75,209,97,43,104,214,171,245,0,133,56,107,5,35,24,155,225,107,146,129,215,165,110,44,49,139,224,126,42,84,194,134,253,169,201,108,194,117,225,205,166,63,44,43,112,43,98,237,190,164,176,83,7,50,33,213,22,150,177,13,13,243,40,15,1,150,154,33,223,200,95,173,131,89,47,74,1,27,233,111,33,197,202,26,4,195,223,38,5,216,209,117,45,25,141,72,168,138,206,46,172,152,59,16,3,200,75,41,159,40,34,246,227,225,33,26,176,137,216,195,224,126,29,170,160,207,144,74,184,253,48,21,65,255,128,107,59,109,109,243,200,45,206,121,210,21,47,203,12,206,174,99,150,197,56,47,183,58,69,103,153,108,225,38,143,231,50,152,95,86,90,35,30,232,230,149,221,40,119,126,85,76,202,95,144,42,197,48,254,159,169,162,207,19,184,142,88,25,106,15,132,112,155,44,48,210,249,218,10,184,80,49,135,42,148,197,52,236,9,184,68,51,181,3,162,5,174,126,225,49,4,21,220,105,155,255,130,28,232,255,54,231,44,13,147,214,48,85,170,61,26,33,65,225,60,82,177,32,100,23,202,146,137,190,83,136,85,242,179,203,146,100,57,33,19,81,5,113,101,102,197,30,144,3,194,250,186,6,54,244,217,30,160,24,66,221,84,147,188,12,24,220,241,248,115,127,231,25,52,136,116,147,243,79,237,124,108,50,159,183,61,208,221,129,109,177,236,254,51,246,34,181,66,209,47,28,5,77,239,217,103,122,170,121,57,120,195,193,126,206,163,214,86,172,37,141,171,245,51,31,181,25,92,42,33,253,7,206,63,42,66,70,76,24,235,3,181,207,247,160,182,34,120,175,97,219,43,4,81,125,197,54,30,72,23,72,91,30,7,208,56,217,69,27,76,154,148,109,88,242,238,246,194,219,40,184,241,206,59,221,57,95,200,210,183,233,116,207,105,236,121,115,230,178,115,114,241,205,221,231,249,140,157,91,216,177,117,177,211,245,152,26,146,246,120,138,234,246,104,54,212,24,199,152,55,107,197,23,94,124,240,0,28,189,5,175,16,38,76,73,251,234,224,33,92,33,194,148,97,95,72,64,242,91,231,154,173,27,127,1,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,179,166,49,43,99,6,0,0,113,59,0,0,13,0,0,0,120,108,47,115,116,121,108,101,115,46,120,109,108,220,91,75,143,219,54,16,190,23,232,127,16,116,106,14,94,73,182,229,181,93,219,65,188,187,2,2,36,69,209,221,2,5,154,162,144,37,202,38,162,135,33,209,27,59,69,110,189,245,216,31,209,91,207,185,244,223,52,64,127,70,135,212,195,210,218,180,228,151,44,237,30,188,122,113,248,205,112,56,51,28,14,7,47,151,142,45,60,34,63,192,158,59,20,149,43,89,20,144,107,120,38,118,167,67,241,199,7,173,209,21,133,128,232,174,169,219,158,139,134,226,10,5,226,203,209,215,95,13,2,178,178,209,253,12,33,34,0,9,55,24,138,51,66,230,125,73,10,140,25,114,244,224,202,155,35,23,222,88,158,239,232,4,110,253,169,20,204,125,164,155,1,109,228,216,82,83,150,59,146,163,99,87,12,41,244,29,163,8,17,71,247,223,47,230,13,195,115,230,58,193,19,108,99,178,98,180,68,193,49,250,175,167,174,231,235,19,27,160,46,149,182,110,8,75,165,227,55,133,165,31,119,194,158,110,244,227,96,195,247,2,207,34,87,64,87,242,44,11,27,104,19,110,79,234,73,186,177,166,4,148,15,163,164,168,146,220,204,240,190,244,15,164,212,150,124,244,136,233,240,137,163,129,187,112,52,135,4,130,225,45,92,2,195,153,60,18,194,55,175,77,120,120,221,17,133,112,84,110,60,19,228,36,255,250,226,219,159,127,64,230,47,239,190,145,223,189,16,165,209,64,138,232,140,6,150,231,166,200,93,3,235,84,168,253,247,174,247,193,213,232,187,176,19,250,217,104,16,124,20,30,117,123,40,246,40,13,195,179,61,95,240,167,147,161,168,105,50,251,163,143,93,221,65,225,87,95,254,254,227,223,127,254,100,159,206,116,63,0,61,98,141,149,86,155,65,8,73,102,9,43,236,213,30,148,45,221,193,246,42,36,220,218,171,171,238,158,60,236,223,211,4,164,17,75,172,220,222,246,29,159,227,120,99,189,109,27,246,19,136,236,244,100,149,230,122,224,9,24,50,152,31,10,79,111,79,54,230,37,116,116,176,164,152,57,143,166,172,131,193,184,110,204,78,142,34,159,132,169,252,222,23,165,78,163,221,189,133,134,238,116,234,18,155,7,69,62,187,53,226,91,162,115,49,117,126,43,148,241,71,199,154,10,137,185,66,240,136,216,182,19,7,219,6,7,75,31,140,6,16,139,16,228,187,26,220,8,209,245,195,106,14,214,195,133,176,41,156,50,236,187,156,175,167,190,190,82,154,106,241,6,129,103,99,147,162,152,222,164,29,174,198,254,40,153,73,244,2,187,38,90,34,240,255,157,208,191,166,0,131,195,15,97,229,128,123,218,87,52,195,153,114,238,211,13,235,45,0,104,158,111,66,228,25,71,43,61,96,35,124,52,26,216,200,34,0,222,199,211,25,253,79,188,57,101,197,35,4,162,179,209,192,196,250,212,115,117,155,134,42,113,139,116,75,136,88,33,56,29,138,100,6,193,37,55,20,145,104,39,81,31,5,91,48,60,12,78,193,6,0,60,198,93,176,69,200,228,129,60,234,11,226,69,14,43,151,187,244,183,57,124,165,63,205,227,40,253,109,81,94,178,35,189,85,80,231,134,176,191,202,132,106,121,113,61,40,32,187,141,32,92,58,159,90,198,112,158,201,132,218,20,221,49,70,35,177,97,23,180,5,59,212,246,28,115,44,178,207,96,237,13,100,219,247,212,46,255,100,37,38,191,9,214,121,105,165,22,167,144,126,160,126,150,174,83,233,37,184,204,232,50,52,239,225,13,176,192,107,164,168,187,90,73,105,12,33,162,20,24,85,45,134,166,41,10,105,52,194,210,138,48,234,243,185,189,162,17,0,53,193,2,187,123,101,227,169,235,160,120,49,174,199,183,194,204,243,241,71,224,148,174,151,169,74,137,52,9,67,176,65,239,97,118,138,194,7,95,159,63,160,37,91,197,83,63,183,180,248,92,3,162,88,84,57,224,160,199,53,184,19,64,53,128,53,4,185,149,125,208,182,56,104,65,102,79,68,185,3,237,152,197,14,123,10,58,70,187,22,245,33,248,219,28,21,3,209,239,194,95,13,196,25,253,200,65,156,213,143,11,226,231,105,12,60,175,155,198,100,228,95,23,141,167,9,195,200,20,131,200,215,198,175,46,248,115,45,78,108,174,105,74,147,103,31,203,214,255,40,79,27,58,67,200,188,110,29,129,141,25,252,221,194,153,32,95,99,73,247,20,39,165,241,181,213,85,101,88,129,13,133,26,179,146,10,80,122,28,70,192,63,92,202,42,229,5,10,169,232,40,51,145,97,76,106,97,72,121,248,235,98,136,120,248,235,226,136,121,209,117,142,254,92,48,116,128,212,233,118,115,83,143,89,10,232,215,238,182,84,41,231,153,18,158,79,77,228,90,69,159,154,178,222,133,61,106,121,49,65,158,200,11,123,206,234,67,134,129,40,238,112,10,45,162,185,107,187,60,169,42,160,168,53,90,61,159,25,238,113,75,227,203,37,34,246,206,153,164,252,194,217,19,58,135,100,25,202,196,87,225,132,211,105,82,54,245,74,144,213,204,34,241,132,123,254,160,246,105,226,244,144,121,86,46,250,227,204,107,165,109,191,194,139,8,75,244,245,123,229,161,161,154,172,242,142,191,69,195,212,104,67,132,167,169,27,139,223,146,114,64,7,207,190,42,51,117,94,127,115,193,69,231,73,54,148,96,253,95,139,60,17,111,170,64,34,187,22,248,161,10,177,78,107,18,158,33,173,139,186,243,240,215,69,221,121,248,235,162,238,60,252,207,102,127,9,66,160,176,56,160,154,59,218,188,181,230,102,4,159,41,110,56,81,90,183,216,234,179,69,183,91,158,91,36,148,202,71,22,142,238,170,180,71,89,229,65,57,111,36,71,143,194,100,235,126,170,57,181,121,139,178,186,236,56,149,151,156,61,121,113,208,246,82,143,138,111,139,240,138,155,18,87,188,29,127,9,59,124,172,120,15,202,245,82,149,132,153,58,194,164,182,79,160,165,254,67,241,203,231,207,255,253,245,123,106,154,78,22,216,38,216,77,106,8,183,55,16,146,153,65,89,246,251,11,12,181,136,191,133,7,216,100,185,1,23,42,253,97,87,225,79,75,9,223,126,98,85,251,9,85,0,106,46,215,165,142,172,74,158,208,147,137,172,8,50,129,14,46,192,68,150,190,176,201,67,242,114,40,174,175,223,34,19,47,28,112,126,209,87,223,227,71,143,48,18,67,113,125,253,134,22,202,43,29,138,0,106,6,223,4,80,215,14,255,133,133,143,1,252,221,248,186,119,123,167,53,27,93,121,220,109,180,91,72,109,244,212,241,109,67,109,223,140,111,111,181,158,220,148,111,62,165,206,71,30,113,58,146,29,231,132,66,69,165,221,15,108,56,67,233,71,204,70,224,239,215,207,134,98,234,38,132,207,228,7,176,211,216,123,205,142,252,74,85,228,134,214,146,149,70,187,163,119,27,221,78,75,109,104,170,210,188,237,180,199,119,170,166,166,176,171,7,158,162,148,37,69,9,207,99,82,240,106,159,96,7,217,216,141,199,42,30,161,244,83,24,36,184,221,193,132,20,143,132,180,62,43,59,250,31,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,222,186,212,163,135,10,0,0,156,29,0,0,20,0,0,0,120,108,47,115,104,97,114,101,100,83,116,114,105,110,103,115,46,120,109,108,236,89,91,79,91,217,21,126,175,212,255,112,100,105,170,86,42,193,23,12,116,10,140,50,153,38,29,181,73,51,109,71,26,245,205,5,39,65,3,54,181,157,104,210,39,99,98,108,131,111,12,87,131,185,56,1,108,146,96,204,196,129,227,43,255,165,57,107,159,115,158,242,23,250,237,179,141,3,246,137,162,74,163,144,135,250,1,236,125,214,222,107,237,117,249,214,229,12,125,241,195,228,132,244,200,237,243,143,123,61,195,22,219,53,171,69,114,123,70,189,99,227,158,251,195,150,111,255,126,179,103,208,34,249,3,46,207,152,107,194,235,113,15,91,30,187,253,150,47,70,126,249,139,33,191,63,32,97,175,199,63,108,121,16,8,76,125,222,219,235,31,125,224,158,116,249,175,121,167,220,30,60,185,231,245,77,186,2,248,233,187,223,235,159,242,185,93,99,254,7,110,119,96,114,162,215,110,181,246,247,78,186,198,61,22,105,212,251,208,19,0,95,135,221,34,61,244,140,255,235,161,251,134,88,25,236,179,140,12,249,199,71,134,2,35,180,23,145,180,153,172,164,175,5,37,125,181,32,177,108,76,210,51,105,137,194,47,37,74,201,111,235,209,27,127,252,250,111,223,222,161,229,89,182,19,121,91,143,13,245,6,70,134,122,249,102,113,128,86,62,212,151,130,148,142,82,58,222,249,76,93,250,137,173,84,112,134,210,220,48,190,196,222,214,215,193,17,12,193,15,236,192,13,204,192,11,172,46,111,246,141,12,249,238,226,143,255,223,210,35,215,196,176,101,208,210,59,50,52,234,157,240,250,36,223,253,127,14,91,110,222,180,26,31,190,236,187,233,245,4,4,25,21,231,149,198,34,95,188,231,154,28,159,120,44,86,29,198,230,7,46,159,223,221,162,179,57,250,248,90,175,193,3,90,48,196,87,235,43,148,58,133,136,66,20,46,194,7,165,16,114,252,60,82,124,215,250,180,217,183,213,252,113,181,161,84,50,194,108,122,54,216,54,219,39,167,147,182,213,14,155,90,241,41,101,75,48,28,147,15,232,116,139,228,144,222,204,176,74,147,226,213,78,151,84,154,155,44,81,124,19,156,83,228,67,74,36,149,106,149,149,22,40,124,76,63,198,105,163,129,239,236,213,50,133,229,55,193,121,165,50,175,229,159,80,113,253,109,61,14,71,126,19,156,134,94,40,21,135,70,212,90,138,194,97,138,206,82,34,133,192,0,1,203,190,84,55,131,84,121,165,30,198,148,234,143,20,61,160,228,54,69,51,120,68,165,99,17,35,74,117,158,138,89,173,217,100,209,52,237,135,20,121,30,219,181,98,177,237,112,239,130,202,6,110,180,56,77,233,4,190,64,10,182,83,199,23,182,92,210,35,41,46,72,237,180,181,18,172,233,79,55,187,238,88,205,139,205,106,190,36,73,83,62,239,216,195,209,128,228,113,77,186,59,41,105,107,30,30,47,225,51,233,29,115,79,116,197,182,193,217,63,229,30,29,191,55,62,234,10,0,198,58,73,216,102,90,43,23,164,128,251,135,192,67,95,215,249,250,170,204,54,207,40,185,78,213,253,91,174,128,91,154,154,224,127,3,15,198,71,191,247,184,253,254,46,121,18,203,74,35,1,172,10,116,137,242,250,20,86,198,245,111,255,229,155,95,95,255,141,217,198,26,66,55,250,159,216,222,117,19,148,34,28,108,60,255,213,68,224,247,102,4,44,27,212,95,172,177,24,132,157,199,49,95,94,255,171,249,41,122,36,129,199,127,186,101,246,52,27,133,133,254,236,154,234,186,22,139,29,170,219,7,119,174,221,238,210,94,182,160,22,143,169,84,165,35,3,106,111,155,28,171,212,183,244,198,153,214,40,106,103,91,44,185,39,76,246,165,251,145,123,66,186,229,118,249,36,96,250,212,4,50,138,116,219,204,132,112,88,74,47,180,207,160,40,96,87,6,248,118,74,242,205,141,235,255,112,246,57,190,235,177,89,239,118,62,187,113,115,176,75,223,169,82,231,210,87,119,6,173,221,107,54,171,217,162,221,105,66,233,52,161,68,54,235,166,180,155,81,58,204,40,29,102,148,125,102,148,125,102,148,78,51,202,126,179,197,129,238,69,69,78,80,250,133,90,72,234,145,5,4,41,188,134,194,51,176,175,73,184,115,162,15,82,168,73,164,223,117,155,227,179,174,112,175,157,226,0,164,48,173,152,227,92,118,243,52,11,224,49,99,132,24,184,68,90,74,181,73,33,92,151,145,119,35,236,85,129,195,106,246,101,43,67,86,247,1,136,234,250,147,174,203,197,249,202,198,14,48,148,138,39,224,1,105,65,70,169,53,138,175,104,193,184,248,194,209,48,91,16,71,209,241,158,150,3,110,110,235,171,101,190,190,31,234,216,174,149,102,216,178,241,40,154,17,138,20,65,76,211,235,234,134,76,213,165,119,4,245,32,133,79,41,181,160,238,21,216,234,9,248,10,1,20,185,74,17,160,243,116,231,197,236,28,67,13,144,4,118,1,83,148,179,77,124,129,44,148,154,211,159,199,217,210,137,137,145,180,200,115,138,84,41,25,66,98,96,171,123,218,235,83,74,224,20,92,252,57,203,70,223,4,67,90,57,175,198,14,116,0,118,179,73,233,36,46,37,18,41,68,197,173,113,40,69,75,130,107,251,4,69,142,225,40,154,13,179,157,10,210,18,207,99,137,101,22,11,82,116,21,139,84,172,208,81,165,37,232,217,6,212,165,38,75,148,173,178,103,65,72,137,59,168,57,108,217,5,35,109,126,143,173,238,80,61,100,164,147,75,124,69,13,198,82,105,212,96,220,34,184,66,117,17,92,176,157,215,109,75,69,206,49,10,27,133,133,86,113,5,246,122,154,34,135,218,209,180,34,207,209,220,142,186,177,34,42,52,74,148,212,23,59,32,86,15,155,116,184,250,182,190,1,190,173,59,126,240,130,217,231,29,119,57,87,116,92,203,207,194,82,226,39,124,195,200,108,161,78,147,57,12,147,225,174,81,92,5,206,13,101,35,17,83,61,5,147,193,230,134,19,181,234,182,119,105,244,188,160,50,254,115,53,157,165,181,230,98,123,31,236,193,179,177,124,132,228,175,149,43,234,82,65,43,111,179,249,176,145,240,143,69,205,138,21,173,252,76,169,61,163,185,45,172,115,235,150,243,216,40,74,35,58,221,131,67,64,35,44,30,225,129,17,66,177,219,226,34,14,20,100,72,43,56,182,243,74,125,109,47,164,120,88,123,22,86,228,164,90,91,84,139,171,66,64,19,23,228,209,5,95,49,146,6,143,153,244,11,122,186,69,193,58,143,105,195,251,141,69,94,137,195,66,112,38,71,203,185,150,142,148,218,154,195,250,25,68,4,24,113,199,108,100,216,203,38,22,153,28,134,171,98,51,110,5,123,10,99,138,245,22,77,101,158,98,72,121,188,4,130,92,136,20,117,57,3,75,138,32,22,190,9,183,130,207,162,150,103,155,51,136,131,206,123,58,121,233,146,74,115,207,51,28,148,199,124,38,141,219,42,213,24,252,85,203,63,163,217,87,102,1,103,40,26,33,66,187,7,252,218,23,142,16,128,193,182,178,44,150,71,88,80,166,0,15,226,40,101,116,18,122,56,161,54,80,86,113,176,121,23,218,179,97,165,190,174,25,97,196,189,62,157,100,217,4,205,229,32,112,27,222,4,38,105,103,17,181,128,186,104,65,93,218,22,34,226,130,194,39,68,249,71,169,121,218,107,156,203,29,23,69,32,240,15,117,29,92,145,82,71,200,184,221,149,168,40,53,81,94,234,153,167,184,11,240,3,213,38,106,66,237,8,90,168,119,42,173,159,23,126,80,118,117,223,112,191,218,123,138,196,142,194,20,80,163,200,123,136,160,115,116,109,225,54,133,11,250,76,1,135,137,114,86,169,213,148,198,178,34,243,234,158,227,182,128,98,3,4,248,207,98,28,244,98,81,220,28,199,10,23,110,65,196,250,147,139,162,65,131,28,80,219,88,160,7,155,48,49,119,162,151,205,214,126,120,172,225,62,122,112,93,221,62,135,140,98,28,10,19,144,119,9,46,207,194,122,174,6,211,217,156,23,221,87,184,163,90,203,136,147,184,217,142,82,45,86,184,200,234,222,37,188,77,195,120,220,95,153,225,250,194,89,25,138,101,35,21,67,40,219,103,28,194,13,253,26,17,209,242,252,139,162,107,39,97,120,130,195,42,142,102,241,216,197,188,5,53,105,51,13,218,125,162,166,91,229,191,168,229,213,90,148,29,62,109,135,11,251,41,199,113,255,60,236,168,114,210,17,58,45,127,68,154,76,172,136,211,76,2,104,128,67,253,210,54,91,142,178,205,28,143,91,57,73,225,19,165,182,34,12,10,31,210,115,0,158,46,248,107,251,53,44,13,164,84,228,93,165,214,16,178,181,91,25,74,35,118,243,32,16,143,120,146,19,45,142,1,241,128,126,32,126,59,93,9,33,56,12,102,158,136,208,135,78,129,92,180,1,153,248,9,74,45,12,216,164,84,72,11,162,212,137,139,230,0,45,145,26,171,80,244,133,182,63,205,142,67,237,10,0,217,5,229,5,91,75,154,92,153,206,75,143,174,98,199,152,36,116,174,10,152,237,170,95,140,110,2,77,20,250,32,36,14,220,68,84,69,159,228,4,226,61,178,138,59,93,217,40,2,153,179,45,193,133,161,15,175,196,26,9,244,220,180,25,52,109,187,213,131,42,242,42,91,41,161,5,167,112,153,138,17,237,244,104,16,189,230,101,27,125,228,41,207,101,169,175,88,181,102,122,229,195,135,226,58,170,13,45,199,235,110,244,229,148,207,2,128,244,205,12,111,210,141,15,21,115,108,71,70,54,49,139,248,203,251,187,2,162,30,100,209,83,125,241,4,57,147,155,237,117,134,29,111,139,76,213,26,152,204,102,217,230,2,70,26,138,188,46,200,180,80,14,113,125,113,78,199,74,50,44,10,96,229,137,55,92,230,115,148,232,44,96,16,240,213,21,150,161,34,102,106,224,228,64,203,102,115,124,64,156,206,199,90,121,95,140,227,236,86,116,145,86,187,221,49,56,96,117,218,7,222,75,215,249,64,93,122,173,29,161,241,90,183,58,7,6,122,6,251,251,109,253,93,253,228,199,245,192,182,68,87,235,123,166,33,189,187,162,149,229,78,149,13,58,237,253,54,155,36,65,121,80,127,127,127,151,9,47,239,234,124,172,212,119,212,236,118,219,2,191,27,112,56,157,78,71,219,149,255,128,57,245,132,137,27,183,183,157,83,190,143,144,242,40,76,214,16,47,240,63,17,17,136,23,180,53,87,138,50,93,50,93,165,177,187,77,253,145,61,222,104,68,0,97,40,9,97,105,187,213,222,79,149,242,255,160,145,159,113,204,207,95,169,124,238,159,114,141,226,85,11,222,153,248,221,190,71,110,203,8,124,236,106,196,25,193,216,224,255,138,224,47,161,224,30,159,152,159,94,81,200,182,194,3,46,9,223,224,127,205,20,115,254,226,131,101,159,139,54,95,100,103,222,115,201,188,40,224,53,124,244,132,143,117,140,168,59,31,84,45,137,110,138,183,197,187,9,140,114,148,218,9,111,36,146,232,212,78,48,62,195,33,198,220,32,198,107,144,230,60,154,13,154,219,48,169,204,241,122,13,243,96,222,126,109,158,57,172,125,188,202,63,200,105,51,104,108,102,169,52,45,198,205,226,59,127,196,95,166,148,208,59,221,189,99,179,114,206,197,45,61,19,198,212,68,105,100,49,104,7,7,167,181,7,57,153,119,100,214,239,239,255,22,101,66,15,198,179,248,57,128,95,216,128,177,108,15,6,174,88,112,98,1,83,86,204,167,141,159,118,252,52,140,52,245,0,175,78,3,227,163,119,125,210,61,188,6,252,122,12,47,60,251,45,82,224,241,20,162,220,227,189,225,245,180,94,192,26,239,251,248,108,168,23,111,87,71,254,11,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,21,254,186,93,106,2,0,0,191,4,0,0,24,0,0,0,120,108,47,100,114,97,119,105,110,103,115,47,100,114,97,119,105,110,103,49,46,120,109,108,156,84,75,110,219,48,16,221,23,232,29,8,238,109,125,34,91,137,96,57,72,108,171,8,16,180,70,209,30,128,161,40,139,168,72,10,36,99,59,8,178,46,122,134,222,165,183,41,122,141,14,41,201,170,209,46,130,106,33,13,103,134,243,222,252,180,184,62,138,6,237,153,54,92,201,28,71,211,16,35,38,169,42,185,220,229,248,243,167,98,114,137,145,177,68,150,164,81,146,229,248,137,25,124,189,124,251,102,113,44,117,118,48,107,141,32,128,52,25,28,115,92,91,219,102,65,96,104,205,4,49,83,213,50,9,214,74,105,65,44,28,245,46,40,53,57,64,104,209,4,113,24,206,3,211,106,70,74,83,51,102,215,157,5,247,241,200,127,68,19,132,75,188,244,204,236,65,173,88,211,220,72,90,43,141,88,201,237,141,201,49,100,224,180,189,79,165,149,232,188,169,106,150,209,34,112,41,57,209,71,0,225,67,85,45,195,147,218,157,188,69,171,195,224,237,196,65,247,135,55,168,189,183,143,56,194,88,53,194,205,255,13,23,165,73,148,142,84,206,48,47,186,43,175,193,28,144,90,78,59,72,185,223,114,186,213,61,254,251,253,86,35,94,230,56,198,72,18,1,109,253,249,253,199,175,111,95,81,132,81,201,12,133,86,114,65,118,44,154,182,114,7,213,34,25,59,218,123,99,123,9,61,106,158,227,231,162,136,111,103,155,34,153,20,32,77,146,240,54,153,220,110,146,171,73,17,95,92,110,226,180,88,197,23,243,23,119,59,154,103,20,250,108,97,196,238,202,161,191,209,252,175,14,11,78,181,50,170,178,83,170,68,160,170,138,83,54,76,12,204,75,148,4,190,195,158,249,115,216,63,19,248,94,186,87,56,190,66,24,46,247,188,224,96,185,8,60,251,225,235,179,232,58,237,170,48,22,164,43,15,201,160,100,247,138,126,49,72,170,85,77,228,142,221,152,150,81,11,187,225,131,249,25,129,155,157,187,15,116,86,219,135,134,183,5,111,96,136,72,230,228,62,221,87,45,71,151,241,90,209,71,193,164,237,54,68,179,198,23,206,212,188,53,24,233,140,137,7,6,157,211,119,165,39,68,50,99,53,179,180,118,128,21,0,127,4,178,93,214,39,131,103,57,18,115,41,152,214,229,78,178,99,165,97,7,72,6,208,232,8,57,166,81,50,131,95,192,83,142,103,105,4,18,68,242,229,67,20,172,233,60,153,37,96,165,206,28,71,87,169,183,67,125,135,40,173,54,246,29,83,2,57,1,56,2,21,63,61,100,15,101,239,72,13,46,208,143,145,135,23,79,179,74,27,14,233,175,137,37,238,138,243,58,219,230,94,231,254,61,203,223,0,0,0,255,255,3,0,80,75,3,4,10,0,0,0,0,0,0,0,33,0,11,202,248,217,74,8,0,0,74,8,0,0,19,0,0,0,120,108,47,109,101,100,105,97,47,105,109,97,103,101,49,46,112,110,103,137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,85,0,0,0,57,8,6,0,0,0,71,195,103,123,0,0,0,1,115,82,71,66,0,174,206,28,233,0,0,0,4,103,65,77,65,0,0,177,143,11,252,97,5,0,0,0,9,112,72,89,115,0,0,14,195,0,0,14,195,1,199,111,168,100,0,0,7,223,73,68,65,84,120,94,237,155,11,108,28,213,21,134,47,175,132,242,232,27,10,41,1,12,33,196,59,155,240,172,170,130,128,38,45,10,105,160,69,165,16,138,40,21,20,81,72,27,17,112,226,157,59,179,155,225,85,42,33,69,20,85,162,10,66,168,80,32,96,10,42,65,66,168,80,236,157,59,179,118,75,90,80,227,196,38,5,33,65,146,2,17,10,36,36,1,146,120,249,207,185,199,187,235,221,245,35,146,91,121,189,243,73,199,51,115,238,157,187,51,255,156,185,207,177,74,72,72,72,72,104,66,130,226,129,178,151,48,46,120,102,129,242,227,101,114,52,190,120,249,99,149,27,254,76,101,242,151,169,91,59,191,46,222,73,206,125,27,167,42,109,54,194,118,40,63,63,93,188,227,135,14,231,40,221,117,5,132,189,152,247,155,2,47,242,33,232,0,110,120,151,242,205,159,197,59,126,208,131,106,239,90,160,116,124,169,90,214,121,140,120,39,49,126,124,2,4,221,9,97,31,83,94,97,41,246,139,92,21,140,55,197,226,1,248,3,107,6,188,232,105,8,249,145,10,162,105,42,232,60,88,233,232,53,248,254,163,130,183,14,149,28,9,251,69,46,158,207,145,169,227,54,241,80,228,158,163,92,179,15,219,219,196,147,48,102,150,60,63,21,17,249,58,34,179,87,173,90,123,136,120,45,94,244,32,196,222,173,178,221,167,136,39,97,76,100,11,26,194,13,168,92,52,87,60,101,2,116,123,116,180,21,246,130,120,18,70,37,48,199,67,208,143,17,145,143,139,167,22,47,186,158,171,6,191,112,185,120,18,70,196,139,158,66,247,105,59,90,251,111,138,167,150,32,56,16,189,128,2,242,190,163,150,71,71,138,55,161,46,185,238,11,109,4,154,209,71,79,217,158,211,144,119,15,196,93,41,158,132,26,130,222,41,16,169,31,209,183,190,166,113,26,14,63,186,23,189,129,61,168,131,103,139,39,97,8,190,113,33,234,0,186,75,243,196,51,58,65,207,23,113,206,102,60,8,99,59,240,9,101,252,127,76,71,107,142,177,125,180,90,60,37,250,78,61,99,218,235,142,115,205,6,199,89,186,190,53,125,105,111,42,117,132,36,89,86,116,47,178,85,70,124,173,120,18,24,63,234,64,221,184,93,221,85,110,156,32,222,148,254,84,250,119,125,41,103,79,191,147,46,14,90,159,147,254,128,68,150,108,22,63,254,43,162,245,125,21,20,190,42,158,38,103,176,113,202,70,203,197,195,64,208,213,149,98,86,91,95,107,250,58,201,138,106,224,239,51,81,198,39,120,56,171,196,211,196,148,26,39,211,167,130,142,41,226,85,27,210,233,133,245,132,172,178,237,136,230,114,100,122,209,157,60,132,205,117,127,91,60,77,138,31,181,219,250,176,240,125,241,48,253,142,243,104,29,17,107,108,72,53,176,178,240,5,8,251,38,234,230,127,170,142,226,65,226,109,50,130,158,227,32,232,14,8,241,164,120,74,244,57,78,79,61,17,107,44,149,190,83,78,177,228,226,133,246,33,69,75,196,211,100,120,241,19,44,42,137,91,5,68,125,177,174,136,85,134,72,173,29,36,248,209,51,40,247,67,94,38,105,42,252,158,121,18,81,237,226,25,194,134,84,218,173,39,98,181,245,205,158,125,150,156,82,38,88,59,56,119,240,152,120,154,0,26,45,209,168,137,27,39,52,84,117,160,6,8,93,167,255,214,19,242,37,199,217,251,156,227,236,195,254,179,51,102,204,152,42,167,12,197,139,51,16,118,255,6,18,13,13,173,138,214,105,156,170,233,75,167,207,70,31,245,253,106,81,13,4,189,218,73,237,154,151,78,61,125,86,42,245,211,51,103,207,170,141,86,126,112,102,196,7,55,121,160,153,39,141,78,62,117,246,7,105,239,106,149,189,26,54,158,126,250,81,168,95,239,238,79,57,107,33,240,155,104,152,94,134,216,55,182,205,153,115,56,4,61,30,89,134,31,154,230,10,23,112,180,210,220,236,164,198,51,171,237,112,20,195,210,65,188,252,124,244,47,127,46,71,163,67,145,55,214,232,243,162,71,32,236,78,21,116,159,40,158,73,70,174,103,174,141,28,212,119,213,184,225,195,176,39,97,51,197,51,20,215,156,164,116,120,47,172,31,121,246,161,156,189,240,173,103,223,8,145,174,116,247,55,144,119,27,234,216,103,197,51,137,184,129,27,167,222,97,235,56,242,185,249,167,32,216,0,236,21,136,181,10,98,220,3,223,253,216,198,34,100,177,108,225,103,216,238,149,99,218,174,228,223,168,71,46,94,204,249,178,209,15,197,51,73,200,198,109,124,99,52,206,31,14,154,186,211,230,151,136,192,45,156,183,210,72,84,215,188,132,7,115,61,26,186,19,120,141,254,242,142,131,224,167,49,255,175,176,93,7,91,195,203,216,213,80,62,109,94,193,3,125,11,221,173,195,196,219,224,208,154,61,173,221,211,50,201,88,224,168,141,126,128,115,92,68,170,102,33,233,245,31,9,250,120,77,99,20,229,134,190,120,134,146,139,191,133,242,246,162,129,188,91,60,13,14,117,194,169,51,78,11,122,255,107,50,249,243,135,253,116,199,139,239,199,195,249,84,5,241,44,241,52,40,190,249,46,4,29,192,171,247,255,235,214,12,55,153,226,154,175,160,46,126,15,215,242,55,28,53,232,42,65,80,60,24,55,176,14,162,246,243,199,17,19,129,108,225,26,92,15,26,173,194,85,226,105,48,178,133,91,248,6,60,243,47,216,159,38,136,61,138,107,66,207,33,218,162,50,107,191,36,87,218,32,4,189,71,160,46,141,113,19,235,38,172,249,133,38,157,30,76,104,96,168,47,75,95,189,36,140,19,25,116,245,220,240,90,244,12,174,108,140,137,109,29,158,139,134,225,15,184,232,103,208,165,65,63,49,188,72,82,104,114,229,18,164,223,161,116,103,169,223,184,169,101,214,204,205,45,173,119,108,58,49,85,30,82,210,57,218,60,4,123,14,249,127,15,17,78,147,20,18,4,173,57,202,168,252,158,74,135,23,216,114,227,180,61,142,86,224,183,111,87,139,59,203,223,11,184,24,178,114,158,240,40,152,253,230,223,94,207,4,255,230,223,13,111,133,13,112,15,192,13,63,229,45,239,155,28,167,147,216,124,220,85,18,240,157,150,89,11,183,180,180,22,33,172,93,106,214,198,14,111,233,211,30,55,252,64,246,119,67,132,243,56,221,53,47,176,175,50,194,180,201,218,124,209,34,57,254,68,206,251,13,31,19,174,121,128,125,58,76,241,96,65,135,223,131,168,11,148,251,226,215,36,199,4,132,134,149,44,132,121,23,102,39,145,105,235,134,91,97,159,217,27,169,21,117,211,201,206,244,77,45,173,215,109,62,201,57,151,29,116,190,54,91,17,137,211,248,88,231,127,33,98,172,225,227,253,19,117,55,134,169,39,179,175,82,212,134,65,203,210,179,14,111,17,143,133,230,78,181,185,153,39,69,74,162,134,191,197,246,199,67,44,19,159,193,249,93,179,3,101,236,226,241,127,16,31,205,99,124,18,184,13,251,54,125,140,162,98,36,229,226,225,104,99,167,0,27,83,84,174,3,139,16,103,248,53,162,65,81,235,90,104,95,127,55,188,167,228,163,15,37,92,243,42,63,132,160,243,203,54,125,204,145,250,6,30,244,77,214,143,58,186,33,69,29,188,104,215,12,191,14,85,142,212,135,149,23,102,216,104,223,222,108,249,243,29,29,205,197,107,191,18,101,173,183,105,124,206,203,156,182,63,162,242,127,183,152,127,227,220,126,148,255,71,206,211,88,145,26,218,215,191,122,42,206,53,75,97,29,120,133,79,69,122,77,157,170,50,249,31,201,205,174,226,215,156,166,254,92,83,254,4,157,230,79,93,179,13,233,3,16,233,208,146,168,153,138,229,18,109,238,178,101,152,43,228,216,138,74,208,67,230,223,164,106,133,127,167,129,68,165,58,147,91,233,112,59,132,89,196,125,65,29,95,137,227,93,184,153,247,212,13,107,14,195,118,100,81,233,31,38,108,171,191,13,254,121,252,45,42,137,66,229,186,225,187,60,169,157,225,21,2,18,240,17,213,150,111,65,116,126,7,233,111,179,175,221,56,92,102,165,168,132,54,127,225,116,251,59,13,36,42,65,255,68,75,243,151,165,27,128,185,225,78,152,237,171,142,38,42,193,145,42,221,178,146,209,82,74,248,19,78,95,134,214,156,26,161,33,233,108,247,113,58,81,45,234,242,174,83,80,166,92,87,163,137,74,248,20,61,230,215,184,248,21,168,27,151,168,246,138,79,124,232,134,188,120,126,169,37,39,104,159,124,131,81,70,120,249,51,113,46,205,120,185,16,99,49,151,89,9,157,195,203,48,168,106,168,218,161,104,173,68,155,11,121,242,186,146,246,252,57,220,217,79,254,9,35,33,33,33,33,161,249,80,234,115,23,159,176,94,159,72,68,214,0,0,0,0,73,69,78,68,174,66,96,130,80,75,3,4,20,0,6,0,8,0,0,0,33,0,21,175,170,60,189,0,0,0,43,1,0,0,35,0,0,0,120,108,47,119,111,114,107,115,104,101,101,116,115,47,95,114,101,108,115,47,115,104,101,101,116,49,46,120,109,108,46,114,101,108,115,132,143,205,10,194,48,16,132,239,130,239,16,246,110,210,122,16,145,166,94,68,240,42,245,1,150,100,251,131,109,18,178,241,167,111,111,46,130,130,224,109,103,151,253,102,166,218,63,167,81,220,41,242,224,157,134,82,22,32,200,25,111,7,215,105,184,52,199,213,22,4,39,116,22,71,239,72,195,76,12,251,122,185,168,206,52,98,202,79,220,15,129,69,166,56,214,208,167,20,118,74,177,233,105,66,150,62,144,203,151,214,199,9,83,150,177,83,1,205,21,59,82,235,162,216,168,248,201,128,250,139,41,78,86,67,60,217,18,68,51,135,236,252,159,237,219,118,48,116,240,230,54,145,75,63,44,148,141,248,200,205,50,18,99,71,73,131,148,239,29,191,135,82,230,200,160,234,74,125,85,172,95,0,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,47,44,243,200,190,0,0,0,36,1,0,0,35,0,0,0,120,108,47,100,114,97,119,105,110,103,115,47,95,114,101,108,115,47,100,114,97,119,105,110,103,49,46,120,109,108,46,114,101,108,115,132,143,65,106,3,49,12,69,247,133,222,193,104,95,107,166,139,80,202,120,178,41,129,108,75,114,0,97,107,60,166,99,217,216,78,72,110,95,67,55,13,20,186,212,255,252,247,208,180,191,197,77,93,185,212,144,196,192,168,7,80,44,54,185,32,222,192,249,116,120,121,3,85,27,137,163,45,9,27,184,115,133,253,252,252,52,125,242,70,173,143,234,26,114,85,157,34,213,192,218,90,126,71,172,118,229,72,85,167,204,210,155,37,149,72,173,159,197,99,38,251,69,158,241,117,24,118,88,126,51,96,126,96,170,163,51,80,142,110,4,117,186,231,110,254,159,157,150,37,88,254,72,246,18,89,218,31,10,12,177,187,59,144,138,231,102,64,107,140,236,2,253,228,163,206,226,1,231,9,31,126,155,191,1,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,138,58,235,67,161,1,0,0,205,2,0,0,17,0,8,1,100,111,99,80,114,111,112,115,47,99,111,114,101,46,120,109,108,32,162,4,1,40,160,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,132,146,205,110,212,48,20,133,247,72,188,67,228,125,98,39,41,3,178,50,169,248,155,21,69,21,4,21,177,179,236,219,169,69,98,91,246,133,233,236,216,128,202,2,169,11,120,1,182,72,60,65,37,158,102,164,178,234,43,224,36,51,161,20,36,150,209,57,231,211,185,199,169,246,79,187,54,121,11,62,104,107,230,36,207,24,73,192,72,171,180,89,206,201,139,102,145,222,35,73,64,97,148,104,173,129,57,89,67,32,251,245,237,91,149,116,92,90,15,135,222,58,240,168,33,36,145,100,2,151,110,78,78,16,29,167,52,200,19,232,68,200,162,195,68,241,216,250,78,96,252,244,75,234,132,124,45,150,64,11,198,102,180,3,20,74,160,160,61,48,117,19,145,108,145,74,78,72,247,198,183,3,64,73,10,45,116,96,48,208,60,203,233,111,47,130,239,194,63,3,131,114,205,217,105,92,187,120,211,182,238,117,182,146,163,56,185,79,131,158,140,171,213,42,91,149,67,141,216,63,167,47,15,158,60,31,78,77,181,233,183,146,64,234,74,73,142,26,91,168,55,31,222,255,252,252,238,242,251,215,205,167,47,87,23,103,155,243,111,151,63,206,175,46,62,86,116,178,244,102,233,65,160,245,245,66,4,124,6,206,122,204,158,62,110,6,211,78,234,55,111,163,124,16,159,231,88,131,122,176,174,239,27,180,70,219,228,72,152,101,69,255,214,119,145,67,175,13,130,170,11,86,204,82,118,55,101,69,195,10,126,167,224,140,189,154,114,59,83,172,51,76,53,118,2,149,196,227,249,56,213,78,57,42,31,62,106,22,100,203,219,75,243,178,97,37,47,243,145,119,35,223,143,49,2,187,109,243,255,18,99,195,89,195,102,188,100,188,220,139,13,111,2,234,161,244,159,63,96,253,11,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,235,196,231,174,187,1,0,0,132,3,0,0,16,0,8,1,100,111,99,80,114,111,112,115,47,97,112,112,46,120,109,108,32,162,4,1,40,160,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,164,83,177,78,28,49,16,237,145,242,15,27,247,156,247,0,33,116,242,26,33,8,162,72,196,74,119,208,70,19,239,236,157,21,159,189,178,135,213,93,218,180,137,4,53,105,82,68,202,7,68,74,197,223,228,36,62,35,222,93,56,150,128,82,36,221,204,188,209,155,55,111,108,177,191,152,155,164,70,31,180,179,25,27,14,82,150,160,85,174,208,118,154,177,179,201,241,230,30,75,2,129,45,192,56,139,25,91,98,96,251,242,197,134,200,189,171,208,147,198,144,68,10,27,50,54,35,170,70,156,7,53,195,57,132,65,132,109,68,74,231,231,64,49,245,83,238,202,82,43,60,114,234,98,142,150,248,86,154,238,114,92,16,218,2,139,205,106,77,200,58,198,81,77,255,74,90,56,213,232,11,231,147,101,21,5,75,113,80,85,70,43,160,184,165,124,163,149,119,193,149,148,188,90,40,52,130,247,65,17,213,141,81,93,120,77,75,153,10,222,79,197,88,129,193,195,72,44,75,48,1,5,127,40,136,19,132,198,180,28,180,15,82,212,52,170,81,145,243,73,208,31,162,109,59,44,121,7,1,27,57,25,171,193,107,176,20,101,53,109,93,210,198,166,10,228,229,234,231,183,95,55,95,110,191,126,23,60,226,93,173,13,251,173,253,88,239,200,97,219,16,131,191,54,222,241,95,221,172,46,63,223,126,250,184,186,254,241,255,35,26,141,221,170,113,246,99,19,38,154,12,134,211,50,7,79,207,120,178,213,247,164,149,214,57,210,169,204,97,138,221,86,119,14,172,189,104,145,151,185,215,150,222,30,120,132,39,59,180,198,71,53,127,204,127,173,237,251,112,86,77,220,17,16,222,95,240,113,81,140,103,224,177,136,71,95,95,120,93,16,39,241,120,222,52,36,135,51,176,83,44,238,123,158,2,205,123,59,239,62,149,28,238,14,210,237,52,62,165,94,77,240,135,239,35,127,3,0,0,255,255,3,0,80,75,3,4,20,0,6,0,8,0,0,0,33,0,10,63,120,134,71,1,0,0,132,2,0,0,19,0,8,1,100,111,99,80,114,111,112,115,47,99,117,115,116,111,109,46,120,109,108,32,162,4,1,40,160,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,180,146,91,75,195,48,20,128,223,5,255,67,200,123,155,75,155,217,142,182,99,189,129,248,160,232,220,171,148,52,221,10,109,82,154,116,58,196,255,110,230,156,211,87,197,183,28,206,225,203,119,46,209,226,165,239,192,78,140,186,85,50,134,196,197,16,8,201,85,221,202,77,12,31,87,165,19,64,160,77,37,235,170,83,82,196,112,47,52,92,36,151,23,209,221,168,6,49,154,86,104,96,17,82,199,112,107,204,48,71,72,243,173,232,43,237,218,180,180,153,70,141,125,101,108,56,110,144,106,154,150,139,92,241,169,23,210,32,138,241,12,241,73,27,213,59,195,23,14,30,121,243,157,249,45,178,86,252,96,167,215,171,253,96,117,147,232,19,190,7,77,111,218,58,134,175,57,203,242,156,97,230,208,34,204,28,130,73,234,132,94,120,229,224,0,99,154,210,172,12,151,197,27,4,195,161,152,66,32,171,222,182,126,157,173,45,107,103,230,221,240,172,205,152,144,180,8,75,234,45,61,204,152,127,69,130,212,243,151,105,90,224,220,47,51,236,19,255,137,208,8,157,203,35,116,210,248,163,144,119,18,186,121,184,181,125,214,19,55,233,212,118,245,90,140,63,252,40,102,212,33,212,181,75,117,233,44,8,217,191,216,248,39,155,172,234,248,212,85,198,30,210,253,212,137,163,74,235,39,248,227,91,251,248,62,0,116,62,159,228,29,0,0,255,255,3,0,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,79,245,229,228,132,1,0,0,183,5,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,91,67,111,110,116,101,110,116,95,84,121,112,101,115,93,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,19,94,190,101,2,1,0,0,223,2,0,0,11,0,0,0,0,0,0,0,0,0,0,0,0,0,189,3,0,0,95,114,101,108,115,47,46,114,101,108,115,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,160,240,230,178,89,3,0,0,232,6,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,240,6,0,0,120,108,47,119,111,114,107,98,111,111,107,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,129,62,148,151,243,0,0,0,186,2,0,0,26,0,0,0,0,0,0,0,0,0,0,0,0,0,118,10,0,0,120,108,47,95,114,101,108,115,47,119,111,114,107,98,111,111,107,46,120,109,108,46,114,101,108,115,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,141,125,3,53,44,29,0,0,108,179,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,169,12,0,0,120,108,47,119,111,114,107,115,104,101,101,116,115,47,115,104,101,101,116,49,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,194,135,219,242,125,6,0,0,215,27,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,11,42,0,0,120,108,47,116,104,101,109,101,47,116,104,101,109,101,49,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,179,166,49,43,99,6,0,0,113,59,0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,0,185,48,0,0,120,108,47,115,116,121,108,101,115,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,222,186,212,163,135,10,0,0,156,29,0,0,20,0,0,0,0,0,0,0,0,0,0,0,0,0,71,55,0,0,120,108,47,115,104,97,114,101,100,83,116,114,105,110,103,115,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,21,254,186,93,106,2,0,0,191,4,0,0,24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,66,0,0,120,108,47,100,114,97,119,105,110,103,115,47,100,114,97,119,105,110,103,49,46,120,109,108,80,75,1,2,45,0,10,0,0,0,0,0,0,0,33,0,11,202,248,217,74,8,0,0,74,8,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,160,68,0,0,120,108,47,109,101,100,105,97,47,105,109,97,103,101,49,46,112,110,103,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,21,175,170,60,189,0,0,0,43,1,0,0,35,0,0,0,0,0,0,0,0,0,0,0,0,0,27,77,0,0,120,108,47,119,111,114,107,115,104,101,101,116,115,47,95,114,101,108,115,47,115,104,101,101,116,49,46,120,109,108,46,114,101,108,115,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,47,44,243,200,190,0,0,0,36,1,0,0,35,0,0,0,0,0,0,0,0,0,0,0,0,0,25,78,0,0,120,108,47,100,114,97,119,105,110,103,115,47,95,114,101,108,115,47,100,114,97,119,105,110,103,49,46,120,109,108,46,114,101,108,115,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,138,58,235,67,161,1,0,0,205,2,0,0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,24,79,0,0,100,111,99,80,114,111,112,115,47,99,111,114,101,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,235,196,231,174,187,1,0,0,132,3,0,0,16,0,0,0,0,0,0,0,0,0,0,0,0,0,240,81,0,0,100,111,99,80,114,111,112,115,47,97,112,112,46,120,109,108,80,75,1,2,45,0,20,0,6,0,8,0,0,0,33,0,10,63,120,134,71,1,0,0,132,2,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,225,84,0,0,100,111,99,80,114,111,112,115,47,99,117,115,116,111,109,46,120,109,108,80,75,5,6,0,0,0,0,15,0,15,0,234,3,0,0,97,87,0,0,0,0]");

/***/ }),
/* 82 */
/*!****************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/utils/contract-xlsx-builder.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var _regeneratorRuntime = __webpack_require__(/*! @babel/runtime/regenerator */ 58);
var _asyncToGenerator = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 60);
/**
 * 购销合同 xlsx 生成器
 *  —— 设计目标：100% 保留原始模板的 XF 索引（边框/字体/填充/数字格式/对齐/合并/公章图片）
 *  —— 实现方式：JSZip 级打开模板 xlsx → 只改 xl/worksheets/sheet1.xml 的文本和数字 → 重新压缩
 *  —— 对小程序/Node 均通用（JSZip 都可工作）
 *
 * 核心坐标（全部使用 Excel 1-based A1 引用 / 行号，和 XML 中的 r="13" 完全一致，避免 0/1-based 混乱）：
 */
var CFG = {
  // 原模板产品行 1-based 行号范围
  PRODUCT_ROW_FIRST: 13,
  PRODUCT_ROW_LAST_TPL: 25,
  // 模板里最多 13 条
  HEADER_ROW: 12,
  TAX_ROW: 26,
  // 税金汇总行（Excel 行 26）
  TOTAL_ROW: 27,
  // 价税合计行（Excel 行 27）
  NOTE_CELL: 'F40',
  // 备注单元格（模板 R40 F 列，原模板 R40 即为备注内容）
  // 单元格 A1 引用（模板原值位置）：
  //   R26 = A:M 合并块文本 "不含税金额（元）："；N:Y 合并 "税额（元）："；Z:AK 合并 "税率：13%"
  //   R27 = A:Y 合并 "价税合计（大写）："；Z:AK 合并 "价税合计（小写）：元"
  CELL_PRETAX: 'A26',
  // 不含税金额（追加到 R26 大合并文本）
  CELL_TAX: 'N26',
  // 税额（追加到 R26 N 大合并文本）
  CELL_RATE_LABEL: 'Z26',
  // 税率文本 - 保留原模板不动
  CELL_TOTAL_NUM: 'Z27',
  // 价税合计小写（追加到 R27 Z 大合并文本）
  CELL_TOTAL_CN: 'A27',
  // 价税合计大写（追加到 R27 A 大合并文本）
  // 列映射：quoteData 字段 → A1 列（1-based 行之后会拼 A1）
  COL_MAP: [{
    col: 'A',
    get: function get(it) {
      return (it.productType ? it.productType + ' ' : '') + (it.productName || '');
    }
  }, {
    col: 'H',
    get: function get(it) {
      return it.productName || '';
    }
  }, {
    col: 'P',
    get: function get(it) {
      return it.model ? 'DN' + it.model : '';
    }
  }, {
    col: 'S',
    get: function get(it) {
      return it.bodyMaterial || '';
    }
  }, {
    col: 'W',
    get: function get(it) {
      return it.gatePlateThickness || '';
    }
  }, {
    col: 'Z',
    get: function get() {
      return '台';
    }
  }, {
    col: 'AB',
    get: function get(it) {
      return it.moq || '';
    }
  }, {
    col: 'AC',
    get: function get(it) {
      var v = Number(it.unitPrice);
      return isNaN(v) || v === 0 ? '' : v;
    },
    isNum: true
  }, {
    col: 'AD',
    get: function get() {
      return '';
    }
  }, {
    col: 'AE',
    get: function get(it) {
      return it.maxPressure || '';
    }
  }, {
    col: 'AF',
    get: function get(it) {
      return it.unitWeight || '';
    }
  }, {
    col: 'AG',
    get: function get(it) {
      return it.laps || '';
    }
  }, {
    col: 'AH',
    get: function get(it) {
      return it.torque || '';
    }
  }, {
    col: 'AI',
    get: function get(it) {
      return it.woodenBoxSize || '';
    }
  }, {
    col: 'AJ',
    get: function get(it) {
      return it.bevelGearCouplingModel || '';
    }
  }]
};

/**
 * 数字 → 人民币大写
 */
function toChineseMoney(n) {
  if (n === null || n === undefined || n === '' || isNaN(Number(n))) return '';
  var num = Number(n);
  if (!isFinite(num)) return '';
  var negative = num < 0;
  if (negative) num = -num;
  if (num === 0) return '零元整';
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  var head = negative ? '负' : '';
  num = Math.round(num * 100) / 100;
  var s = num.toFixed(2);
  var parts = s.split('.');
  var intPart = parts[0];
  var decPart = parts[1] || '00';
  var out = '';
  if (parseInt(intPart, 10) > 0) {
    for (var i = 0; i < intPart.length; i++) {
      var idxN = intPart.length - 1 - i;
      var d = parseInt(intPart.charAt(i), 10);
      var p = Math.floor(idxN / 4);
      var q = idxN % 4;
      if (d === 0) {
        if (q === 0) {
          var has = false;
          for (var j = i - q; j <= i; j++) {
            if (parseInt(intPart.charAt(j) || '0', 10) !== 0) {
              has = true;
              break;
            }
          }
          if (has) out += unit[0][p];
        }
      } else {
        if (out.charAt(out.length - 1) !== '零' && i > 0 && q !== 3 && parseInt(intPart.charAt(i - 1) || '0', 10) === 0) {
          out += '零';
        }
        out += digit[d] + unit[1][q];
        if (q === 0) out += unit[0][p];
      }
    }
    out = out.replace(/零+元/g, '元').replace(/零+万/g, '万').replace(/零+亿/g, '亿').replace(/亿万/g, '亿');
    if (!out.endsWith('元')) out += '元';
  }
  var jiao = parseInt(decPart.charAt(0), 10);
  var fen = parseInt(decPart.charAt(1), 10);
  if (jiao === 0 && fen === 0) out += '整';else {
    if (jiao === 0) {
      if (parseInt(intPart, 10) > 0) out += '零';
      out += digit[fen] + fraction[1];
    } else {
      out += digit[jiao] + fraction[0];
      if (fen !== 0) out += digit[fen] + fraction[1];
    }
  }
  return head + out;
}

// ============== XML 文本操作工具（不使用 DOMParser，小程序无 DOM） ===============

/** 把 <c> A1 引用拆成 {col,row}（数字） */
function parseA1(a1) {
  var m = /^([A-Z]+)(\d+)$/.exec(a1);
  if (!m) throw new Error('bad A1: ' + a1);
  var colStr = m[1];
  var col = 0;
  for (var i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  return {
    colStr: colStr,
    col: col,
    row: parseInt(m[2], 10)
  };
}
function buildA1(colStr, row) {
  return colStr + row;
}
function columnIndexToLetters(n) {
  var s = '';
  while (n > 0) {
    var m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/**
 * 从 sheet1.xml 文本中提取/替换 <row r="NN">...</row> 的 XML 片段
 * 返回 Map: 行号(1-based) → {outer, inner, attrs}
 * 同时返回 sheetData 前后的文本，以便后续拼接
 */
function splitSheetData(xml) {
  var sdOpen = xml.indexOf('<sheetData');
  var sdCloseIdx = xml.indexOf('</sheetData>');
  if (sdOpen < 0 || sdCloseIdx < 0) throw new Error('sheetData not found');
  var endOfOpenTag = xml.indexOf('>', sdOpen) + 1;
  var before = xml.slice(0, endOfOpenTag);
  var inner = xml.slice(endOfOpenTag, sdCloseIdx);
  var after = xml.slice(sdCloseIdx);
  // 匹配所有 <row ...>...</row>
  var rows = new Map();
  var rowRe = /<row\s([^>]*)>([\s\S]*?)<\/row>/g;
  var m;
  while ((m = rowRe.exec(inner)) !== null) {
    var attrs = parseAttrs(m[1]);
    var r = parseInt(attrs.r, 10);
    rows.set(r, {
      outer: m[0],
      inner: m[2],
      attrs: attrs,
      rawAttrs: m[1],
      start: m.index,
      end: m.index + m[0].length
    });
  }
  return {
    before: before,
    after: after,
    rows: rows,
    innerRaw: inner
  };
}
function parseAttrs(s) {
  var out = {};
  var re = /([A-Za-z_:][\w\-:.]*)\s*=\s*"([^"]*)"/g;
  var m;
  while ((m = re.exec(s)) !== null) {
    out[m[1]] = m[2];
  }
  return out;
}

/**
 * 在一段 <row>inner（一串 <c>..</c>）中找到某个 A1 的 <c> 片段，并替换其内容
 * 兼容两种写法：
 *   自闭合：  <c r="AC13" s="12"/>
 *   普通闭合：<c r="AC13" s="12"><v>x</v></c>
 * 【关键：先检测自闭合再检测闭合】，否则 <c r="X" s="Y"/> 中的 /> 会被误拆解为 `/ + >`，
 *  导致闭包正则 `[^>]*>` 误把 Y/> 当作「属性字符串 + 开标签结束 >」，从而非贪婪吞掉后续的 c 到最近 </c>。
 */
function writeCellInRow(rowInner, cellA1, value) {
  var _parseA = parseA1(cellA1),
    colStr = _parseA.colStr,
    row = _parseA.row;
  var ref = colStr + row;
  // 先匹配自闭合：<c ...r="REF"... />
  var reSelf = new RegExp("<c\\s([^>]*r=\"".concat(ref, "\"[^>]*?)\\s*\\/>"));
  var m = reSelf.exec(rowInner);
  var rawAttrs = '';
  var start, end;
  if (m) {
    rawAttrs = m[1];
    start = m.index;
    end = m.index + m[0].length;
  } else {
    // 再匹配普通闭合：<c ...r="REF"...> ... </c> —— 开标签结束 `>` 前必须不是 `/`
    var reClosed = new RegExp("<c\\s([^>]*r=\"".concat(ref, "\"[^>]*[^\\/])>([\\s\\S]*?)<\\/c>"));
    m = reClosed.exec(rowInner);
    if (!m) return rowInner;
    rawAttrs = m[1];
    start = m.index;
    end = m.index + m[0].length;
  }
  // 构造新 attrs：除 t 之外都保留（r / s / cm / vm / spans 等）
  var keepAttrs = [];
  var attrRe = /([A-Za-z_:][\w\-:.]*)\s*=\s*"([^"]*)"/g;
  var am;
  while ((am = attrRe.exec(rawAttrs)) !== null) {
    var k = am[1];
    if (k !== 't') keepAttrs.push("".concat(k, "=\"").concat(am[2], "\""));
  }
  var newAttrs = keepAttrs.join(' ');
  if (value === '' || value === null || value === undefined) {
    // 清空：保持 s，输出自闭合形式
    return rowInner.slice(0, start) + "<c ".concat(newAttrs, "/>") + rowInner.slice(end);
  }
  var newInner = '';
  if (typeof value === 'number') {
    newInner = "<v>".concat(value, "</v>");
  } else {
    newAttrs += ' t="inlineStr"';
    var escaped = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    newInner = "<is><t xml:space=\"preserve\">".concat(escaped, "</t></is>");
  }
  var newCell = "<c ".concat(newAttrs, ">").concat(newInner, "</c>");
  return rowInner.slice(0, start) + newCell + rowInner.slice(end);
}

/**
 * 解析 Excel 列字母 → 数字（A=1, Z=26, AA=27）
 */
function colLettersToNum(colStr) {
  var n = 0;
  for (var i = 0; i < colStr.length; i++) {
    n = n * 26 + (colStr.charCodeAt(i) - 64);
  }
  return n;
}

/**
 * 在 rowInner（<c>...</c><c>...</c>）的正确字母序位置插入一个自闭合 <c r="COLrowNum" s="sval"/>，返回修改后的 inner
 * 【重要】扫描现有 c 时，必须先匹配自闭合形式（防止 /> 误被拆解为 `/ + >`），再匹配普通闭合。
 */
function insertSelfCloseCell(rowInner, col, rowNum, sval) {
  var cur = []; // [{ref, colNum, start, end}]
  var reSelf = /<c\s[^>]*r="([A-Z]+)(\d+)"[^>]*?\/>\s*/g;
  var reClosed = /<c\s[^>]*r="([A-Z]+)(\d+)"[^>]*[^\/]>([\s\S]*?)<\/c>\s*/g;
  // 方案：先扫自闭合收集位置，再扫闭合收集位置，最后合并排序（按 start ASC）
  var m;
  while ((m = reSelf.exec(rowInner)) !== null) {
    cur.push({
      ref: m[1] + m[2],
      colNum: colLettersToNum(m[1]),
      start: m.index,
      end: m.index + m[0].length
    });
  }
  while ((m = reClosed.exec(rowInner)) !== null) {
    cur.push({
      ref: m[1] + m[2],
      colNum: colLettersToNum(m[1]),
      start: m.index,
      end: m.index + m[0].length
    });
  }
  cur.sort(function (a, b) {
    return a.start - b.start;
  });
  var newColNum = colLettersToNum(col);
  var insertPos = rowInner.length;
  for (var i = 0; i < cur.length; i++) {
    if (cur[i].colNum > newColNum) {
      insertPos = cur[i].start;
      break;
    }
  }
  if (cur.length > 0 && insertPos === rowInner.length) {
    insertPos = cur[cur.length - 1].end;
  }
  var newNode = "<c r=\"".concat(col).concat(rowNum, "\" s=\"").concat(sval, "\"/>");
  return rowInner.slice(0, insertPos) + newNode + rowInner.slice(insertPos);
}

/**
 * 清空某行的所有列映射格（其它列保留原样）
 * colStyles: { colLetter: sNum }，若某列 <c> 不存在则先按此样式插入一个（空值自闭合即可保持样式）
 */
function clearRowForCols(rowInner, rowNum, colStyles) {
  var r = rowInner;
  CFG.COL_MAP.forEach(function (cfg) {
    var a1 = cfg.col + rowNum;
    var ref = cfg.col + rowNum;
    var exists = new RegExp("<c\\s[^>]*r=\"".concat(ref, "\"")).test(r);
    if (!exists && colStyles && colStyles[cfg.col] != null) {
      r = insertSelfCloseCell(r, cfg.col, rowNum, colStyles[cfg.col]);
    }
    r = writeCellInRow(r, a1, '');
  });
  return r;
}

/**
 * 在某行的各列映射格写入产品数据
 */
function writeRowProduct(rowInner, rowNum, item, colStyles) {
  var r = rowInner;
  CFG.COL_MAP.forEach(function (cfg) {
    var a1 = cfg.col + rowNum;
    var ref = cfg.col + rowNum;
    var exists = new RegExp("<c\\s[^>]*r=\"".concat(ref, "\"")).test(r);
    if (!exists && colStyles && colStyles[cfg.col] != null) {
      r = insertSelfCloseCell(r, cfg.col, rowNum, colStyles[cfg.col]);
    }
    var v = cfg.get(item);
    r = writeCellInRow(r, a1, v);
  });
  return r;
}

/**
 * 克隆 R13 为新行（r=newRowNum），返回 <row ...>...</row> 整个 XML
 * 思路：把原 R13 行整段字符串中的 r="13" 替换成 r="newNum"，并把内部所有 <c r="A13"> 等 A1 引用中的数字从 13 替换为 newNum。
 * 最后**清空该行的各列映射格的内容**（保持 s 样式索引），保证克隆出的新行是同样式的空白行。
 */
function cloneRow13To(row13Outer, newRowNum, colStyles) {
  var s = row13Outer;
  // 行属性 r="13"
  s = s.replace(/(<row\s[^>]*\br=")13("[^>]*>)/, "$1".concat(newRowNum, "$2"));
  // 每个 c 的 r="XX13"：用正则精准替换 r="(colLetters)13" → r="$1newNum"
  s = s.replace(/(<c\s[^>]*\br=")([A-Z]+)13("[^>]*>)/g, function (_, pre, col, post) {
    return "".concat(pre).concat(col).concat(newRowNum).concat(post);
  });
  // 提取 inner 清空写值格（保持样式 s）
  var openEnd = s.indexOf('>') + 1;
  var closeStart = s.lastIndexOf('</row>');
  var inner = s.slice(openEnd, closeStart);
  var cleared = clearRowForCols(inner, newRowNum, colStyles || null);
  return s.slice(0, openEnd) + cleared + s.slice(closeStart);
}

/**
 * 行号批量偏移：
 * 把整个 sheet1.xml 中 1-based 行号 >= threshold 的行号都 + offset
 * 影响：
 *   - <row r="NN">       行
 *   - <c r="..NN">       单元格引用
 *   - <mergeCell ref="A1:B2" 中每个 A1 的 r 部分
 *   - <dimension ref="A1:BD54"> 结束行
 * threshold 默认 = CFG.TAX_ROW (26)，即「税金行及以下」整体偏移
 */
function offsetAllRowNumbers(xml, threshold, offset) {
  if (!offset) return xml;
  var patterns = [
  // <row r="26">
  {
    re: /(<row\s[^>]*\br=")(\d+)("[^>]*>)/g,
    groups: [2],
    sep: [[1, 3]]
  },
  // <c r="A26">, <c r="Z27" s="..">
  {
    re: /(<c\s[^>]*\br=")([A-Z]+)(\d+)("[^>]*>)/g,
    groups: [3],
    sep: [[1, 4]]
  },
  // <mergeCell ref="A26:M26">：groups [1..6] = 前缀,col1,row1,:,col2,row2,后缀 （实际无冒号组，re 是：(<prefix>)(C1)(R1):(C2)(R2)(<suffix>)，groups 顺序：1=prefix,2=col1,3=row1,4=col2,5=row2,6=suffix）
  {
    re: /(<mergeCell\s+ref=")([A-Z]+)(\d+):([A-Z]+)(\d+)("[^>]*>)/g,
    groups: [3, 5],
    sep: [[1, 3], ':', [4, 6]]
  },
  // <dimension ref="A1:BD54"> groups: 1,2,row1,3,4,row2,suffix
  {
    re: /(<dimension\s+ref=")([A-Z]+)(\d+):([A-Z]+)(\d+)("[^>]*>)/g,
    groups: [3, 5],
    sep: [[1, 3], ':', [4, 6]]
  }];
  var out = xml;
  patterns.forEach(function (p) {
    var numOffsets = p.groups;
    out = out.replace(p.re, function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var replaced = args.slice(1, -2); // 去掉 match / offset / string
      numOffsets.forEach(function (gIdx1Based) {
        var gi = gIdx1Based - 1;
        var n = parseInt(replaced[gi], 10);
        if (!isNaN(n) && n >= threshold) {
          replaced[gi] = String(n + offset);
        }
      });
      if (p.sep === '') return replaced.join('');
      // sep 格式：数组，每一项是 replaced 的下标数组 [idx1,idx2]（取 replaced[idx1]..replaced[idx2] 连续拼接），或是字符串分隔符
      var s = '';
      p.sep.forEach(function (part) {
        if (typeof part === 'string') s += part;else for (var k = part[0] - 1; k <= part[1] - 1; k++) {
          s += replaced[k];
        }
      });
      return s;
    });
  });
  return out;
}

/**
 * 顶层入口：构建合同
 * @param {object} JSZip           JSZip 构造器（小程序端 import 后传进来）
 * @param {Uint8Array} templateU8  原始 xlsx 模板字节（不经过任何解析/改写）
 * @param {Array} items            产品数组，字段与 quoteData 对齐
 * @param {object} opts            { finalPrice: 不含税总价(number), note: 备注(string) }
 * @returns {Promise<Uint8Array>}  生成的 xlsx 字节
 */
function buildContract(_x, _x2, _x3, _x4) {
  return _buildContract.apply(this, arguments);
}
function _buildContract() {
  _buildContract = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(JSZip, templateU8, items, opts) {
    var N, zip, sheetFile, xml, SST, f, s, siRe, m, si, txt, tRe, tm, capacity, offset, sd, PRODUCT_COL_STYLES, row13, newRowsStart, newRowsCount, row25, row26Start, clones, i, newRowNum, inserted, newInner, sd2, R_END, newRowOuters, r, row, _newInner, idx, newOuter, finalInner, rowNumsDesc, finalXml, pretax, tax, totalIncl, offA1, C_PRETAX, C_TAX, C_TOTAL_N, C_TOTAL_CN, C_NOTE, writeGlobalCell, fmtMoney, readCellText, out;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fmtMoney = function _fmtMoney(n) {
              // 千分位 + 两位小数，前面加 ¥
              var neg = n < 0;
              var s = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
              return (neg ? '-¥' : '¥') + s;
            };
            writeGlobalCell = function _writeGlobalCell(a1, value) {
              var _parseA2 = parseA1(a1),
                row = _parseA2.row;
              var sd3 = splitSheetData(finalXml);
              var rowData = sd3.rows.get(row);
              if (!rowData) return;
              var newInner = writeCellInRow(rowData.inner, a1, value);
              var newOuter = "<row ".concat(rowData.rawAttrs, ">").concat(newInner, "</row>");
              // 替换
              var inner2 = sd3.innerRaw.slice(0, rowData.start) + newOuter + sd3.innerRaw.slice(rowData.end);
              finalXml = sd3.before + inner2 + sd3.after;
            };
            offA1 = function _offA(a1) {
              var p = parseA1(a1);
              if (p.row >= CFG.TAX_ROW) return "".concat(p.colStr).concat(p.row + offset);
              return a1;
            };
            if (!(!items || !items.length)) {
              _context.next = 5;
              break;
            }
            throw new Error('items empty');
          case 5:
            N = items.length;
            _context.next = 8;
            return JSZip.loadAsync(templateU8);
          case 8:
            zip = _context.sent;
            sheetFile = zip.file('xl/worksheets/sheet1.xml');
            if (sheetFile) {
              _context.next = 12;
              break;
            }
            throw new Error('sheet1.xml not found in template');
          case 12:
            _context.next = 14;
            return sheetFile.async('string');
          case 14:
            xml = _context.sent;
            // 预先读取共享字符串表（模板中文本多为 t=s，数字是 idx）
            SST = [];
            f = zip.file('xl/sharedStrings.xml');
            if (!f) {
              _context.next = 23;
              break;
            }
            _context.next = 20;
            return f.async('string');
          case 20:
            s = _context.sent;
            siRe = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
            while ((m = siRe.exec(s)) !== null) {
              si = m[1];
              txt = '';
              tRe = /<t\b([^>]*)>([\s\S]*?)<\/t>/g;
              tm = void 0;
              while ((tm = tRe.exec(si)) !== null) {
                txt += tm[2];
              }
              SST.push(txt);
            }
          case 23:
            // ---------- 1) 如果需要扩容，先把 TAX_ROW 及以后整体偏移 ----------
            capacity = CFG.PRODUCT_ROW_LAST_TPL - CFG.PRODUCT_ROW_FIRST + 1; // 13
            offset = Math.max(0, N - capacity);
            if (offset > 0) {
              xml = offsetAllRowNumbers(xml, CFG.TAX_ROW, offset);
            }

            // ---------- 2) 切分 sheetData ----------
            sd = splitSheetData(xml); // 从原模板 R13..R25（产品区间）扫描 COL_MAP 列的样式 s 索引：构建 PRODUCT_COL_STYLES
            // （因为 Excel 允许省略「空内容+默认样式」单元格，某列在整个产品区间可能都不存在，但合并块邻近列一定存在 —— 如 Z 合并于 W~AA，s 同 W=45）
            PRODUCT_COL_STYLES = {};
            (function buildColStyles() {
              var neededCols = CFG.COL_MAP.map(function (c) {
                return c.col;
              });
              var neededSet = new Set(neededCols);
              var reSelfC = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*?)\/>/g;
              var reClosedC = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*[^\/])>([\s\S]*?)<\/c>/g;
              // 1) 直接存在的列：扫描 R13..R25
              for (var rn = CFG.PRODUCT_ROW_FIRST; rn <= CFG.PRODUCT_ROW_LAST_TPL; rn++) {
                var rd = sd.rows.get(rn);
                if (!rd) continue;
                var inner = rd.inner;
                var _m = void 0;
                while ((_m = reSelfC.exec(inner)) !== null) {
                  var col = _m[1];
                  if (!neededSet.has(col)) continue;
                  if (PRODUCT_COL_STYLES[col] != null) continue;
                  var attrs = "".concat(_m[1], " ").concat(_m[3]);
                  var sm = /\bs="(\d+)"/.exec(attrs);
                  if (sm) PRODUCT_COL_STYLES[col] = Number(sm[1]);else PRODUCT_COL_STYLES[col] = 0;
                }
                while ((_m = reClosedC.exec(inner)) !== null) {
                  var _col = _m[1];
                  if (!neededSet.has(_col)) continue;
                  if (PRODUCT_COL_STYLES[_col] != null) continue;
                  var _attrs = "".concat(_m[1], " ").concat(_m[3]);
                  var _sm = /\bs="(\d+)"/.exec(_attrs);
                  if (_sm) PRODUCT_COL_STYLES[_col] = Number(_sm[1]);else PRODUCT_COL_STYLES[_col] = 0;
                }
              }
              // 2) 仍然缺失的列：fallback 到「整个模板产品区中最近邻已知列的 s」（字母序距离最近）
              var pool = new Map(); // colLetter -> s
              for (var _rn = CFG.PRODUCT_ROW_FIRST; _rn <= CFG.PRODUCT_ROW_LAST_TPL; _rn++) {
                var _rd = sd.rows.get(_rn);
                if (!_rd) continue;
                var _inner = _rd.inner;
                var _m2 = void 0;
                while ((_m2 = reSelfC.exec(_inner)) !== null) {
                  var _col2 = _m2[1];
                  if (pool.has(_col2)) continue;
                  var _attrs2 = "".concat(_m2[1], " ").concat(_m2[3]);
                  var _sm2 = /\bs="(\d+)"/.exec(_attrs2);
                  if (_sm2) pool.set(_col2, Number(_sm2[1]));
                }
                while ((_m2 = reClosedC.exec(_inner)) !== null) {
                  var _col3 = _m2[1];
                  if (pool.has(_col3)) continue;
                  var _attrs3 = "".concat(_m2[1], " ").concat(_m2[3]);
                  var _sm3 = /\bs="(\d+)"/.exec(_attrs3);
                  if (_sm3) pool.set(_col3, Number(_sm3[1]));
                }
              }
              var poolCols = Array.from(pool.keys()).sort(function (a, b) {
                return colLettersToNum(a) - colLettersToNum(b);
              });
              neededCols.forEach(function (col) {
                if (PRODUCT_COL_STYLES[col] != null) return;
                // 找左右最近的
                var target = colLettersToNum(col);
                var best = null,
                  bestDist = Infinity;
                poolCols.forEach(function (pc) {
                  var d = Math.abs(colLettersToNum(pc) - target);
                  if (d < bestDist) {
                    bestDist = d;
                    best = pc;
                  }
                });
                if (best != null) PRODUCT_COL_STYLES[col] = pool.get(best);else PRODUCT_COL_STYLES[col] = 0;
              });
            })();

            // ---------- 3) 确定扩容后的「新增行」：R26..R(13+N-1) 需要克隆 R13 的结构 ----------
            if (!(offset > 0)) {
              _context.next = 44;
              break;
            }
            // 先拿到原 R13 的 XML（偏移后它还在 rows.get(13)，因为 threshold=26 未改 R13）
            row13 = sd.rows.get(CFG.PRODUCT_ROW_FIRST);
            if (row13) {
              _context.next = 33;
              break;
            }
            throw new Error('R13 not found');
          case 33:
            newRowsStart = CFG.PRODUCT_ROW_LAST_TPL + 1;
            newRowsCount = offset;
            row25 = sd.rows.get(CFG.PRODUCT_ROW_LAST_TPL);
            if (row25) {
              _context.next = 38;
              break;
            }
            throw new Error('R25 not found');
          case 38:
            row26Start = row25.end;
            clones = [];
            for (i = 0; i < newRowsCount; i++) {
              newRowNum = newRowsStart + i;
              clones.push(cloneRow13To(row13.outer, newRowNum, PRODUCT_COL_STYLES));
            }
            inserted = clones.join('\n');
            newInner = sd.innerRaw.slice(0, row26Start) + '\n' + inserted + '\n' + sd.innerRaw.slice(row26Start);
            xml = sd.before + newInner + sd.after;
          case 44:
            // 重新 split（上面两种路径后 rows 都完整）
            sd2 = splitSheetData(xml); // ---------- 4) 清空产品区：R_FIRST .. max(R_FIRST+N-1, 25) ----------
            R_END = Math.max(CFG.PRODUCT_ROW_FIRST + N - 1, CFG.PRODUCT_ROW_LAST_TPL);
            newRowOuters = new Map();
            r = CFG.PRODUCT_ROW_FIRST;
          case 48:
            if (!(r <= R_END)) {
              _context.next = 60;
              break;
            }
            row = sd2.rows.get(r);
            if (row) {
              _context.next = 52;
              break;
            }
            return _context.abrupt("continue", 57);
          case 52:
            _newInner = clearRowForCols(row.inner, r, PRODUCT_COL_STYLES);
            idx = r - CFG.PRODUCT_ROW_FIRST;
            if (idx < N) {
              _newInner = writeRowProduct(_newInner, r, items[idx], PRODUCT_COL_STYLES);
            }
            newOuter = "<row ".concat(row.rawAttrs, ">").concat(_newInner, "</row>");
            newRowOuters.set(r, newOuter);
          case 57:
            r++;
            _context.next = 48;
            break;
          case 60:
            // 替换 sheet1.xml 中的每个 row
            finalInner = sd2.innerRaw; // 按行号从大到小替换，避免替换后字符串长度变化影响其它 outer 的 start/end
            rowNumsDesc = Array.from(sd2.rows.keys()).sort(function (a, b) {
              return b - a;
            });
            rowNumsDesc.forEach(function (rn) {
              if (!newRowOuters.has(rn)) return;
              var row = sd2.rows.get(rn);
              finalInner = finalInner.slice(0, row.start) + newRowOuters.get(rn) + finalInner.slice(row.end);
            });
            finalXml = sd2.before + finalInner + sd2.after; // ---------- 5) 写税金/合计/备注（这些行如果偏移过，已在步骤1移动） ----------
            pretax = Number(opts.finalPrice) || 0;
            tax = Math.round(pretax * 0.13 * 100) / 100;
            totalIncl = Math.round((pretax + tax) * 100) / 100; // 关键：步骤 1 对 sheet1.xml 执行了 offsetAllRowNumbers(TAX_ROW, offset)，将 >= TAX_ROW 的行号整体 +offset。
            // 因此写入税金/合计/备注时，需要用「偏移后的 A1」。
            C_PRETAX = offA1(CFG.CELL_PRETAX);
            C_TAX = offA1(CFG.CELL_TAX);
            C_TOTAL_N = offA1(CFG.CELL_TOTAL_NUM);
            C_TOTAL_CN = offA1(CFG.CELL_TOTAL_CN);
            C_NOTE = offA1(CFG.NOTE_CELL); // 写单元格：helper 直接改写 finalXml 中某 A1 单元格（与行写入实现相同逻辑）
            // 先读原标签，保证兼容中文/英文或以后改模板
            readCellText = function readCellText(a1) {
              var _parseA3 = parseA1(a1),
                row = _parseA3.row;
              var sdx = splitSheetData(finalXml);
              var rd = sdx.rows.get(row);
              if (!rd) return null;
              var colStr = parseA1(a1).colStr;
              var ref = colStr + row;
              // 闭合形式
              var re = new RegExp("<c\\s([^>]*r=\"".concat(ref, "\"[^>]*)>([\\s\\S]*?)<\\/c>"));
              var m = re.exec(rd.inner);
              var attrs = '';
              var cInner = '';
              if (m) {
                attrs = m[1];
                cInner = m[2];
              } else {
                // 自闭合：无内容，返回 ''
                var re2 = new RegExp("<c\\s[^>]*r=\"".concat(ref, "\"[^>]*?\\/>"));
                if (re2.exec(rd.inner)) return '';
                return null;
              }
              // inlineStr 形式：<is><t>xxx</t></is>
              var ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(cInner);
              if (ism) return ism[1];
              // t="s"（共享字符串）：<v>idx</v>
              if (/\bt="s"/.test(attrs)) {
                var vm = /<v>([^<]+)<\/v>/.exec(cInner);
                if (vm) {
                  var _idx = parseInt(vm[1], 10);
                  if (!isNaN(_idx) && SST[_idx] !== undefined) return SST[_idx];
                }
                return null;
              }
              // 其他：数字 <v>xxx</v>
              var vm2 = /<v>([^<]+)<\/v>/.exec(cInner);
              if (vm2) return vm2[1];
              return '';
            }; // 不含税金额：写 A(TAX_ROW+offset)
            (function writePreTax() {
              var a1 = C_PRETAX;
              var txt = readCellText(a1);
              var prefix = txt ? txt.trim().includes('：') ? txt : '不含税金额（元）：' : '不含税金额（元）：';
              writeGlobalCell(a1, prefix + fmtMoney(pretax));
            })();
            // 税额：写 N(TAX_ROW+offset)
            (function writeTax() {
              var a1 = C_TAX;
              var txt = readCellText(a1);
              var prefix = txt ? txt.trim().includes('：') ? txt : '税额（元）：' : '税额（元）：';
              writeGlobalCell(a1, prefix + fmtMoney(tax));
            })();
            // 税率 - 保留模板原文，不覆盖
            // 价税合计小写：写 Z(TOTAL_ROW+offset)（模板 R27 Z 列 = "价税合计（小写）：元"）
            (function writeTotalNum() {
              var a1 = C_TOTAL_N;
              var txt = readCellText(a1);
              var prefix = '价税合计（小写）：';
              var suffix = ' 元';
              if (txt) {
                var t = txt.trim();
                if (t.endsWith('元')) {
                  var cut = t.slice(0, t.length - 1).replace(/：$/, '').trim();
                  prefix = cut + '：';
                  suffix = ' 元';
                } else if (t.includes('：')) {
                  prefix = t.split('：')[0] + '：';
                } else prefix = t + '：';
              }
              writeGlobalCell(a1, prefix + fmtMoney(totalIncl) + suffix);
            })();
            // 大写：保留前缀「价税合计（大写）：」后加数字中文
            (function readOriginalTotal() {
              var sdCap = splitSheetData(finalXml);
              var cellA1 = C_TOTAL_CN;
              var _parseA4 = parseA1(cellA1),
                row = _parseA4.row;
              var rd = sdCap.rows.get(row);
              if (!rd) {
                writeGlobalCell(cellA1, '价税合计（大写）：' + toChineseMoney(totalIncl));
                return;
              }
              var colStr = parseA1(cellA1).colStr;
              var ref = colStr + row;
              var re = new RegExp("<c\\s[^>]*r=\"".concat(ref, "\"[^>]*>([\\s\\S]*?)<\\/c>"));
              var m = re.exec(rd.inner);
              var txt = '';
              if (m) {
                var cInner = m[1];
                var ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(cInner);
                if (ism) txt = ism[1];
              }
              var prefix = '价税合计（大写）：';
              if (txt && /大写/.test(txt)) {
                var mm = txt.match(/^([^\uff1a:]+[\uff1a:])\s*/);
                if (mm) prefix = mm[1];else {
                  var stripped = txt.replace(/[_壹贰叁肆伍陆柒捌玖拾佰仟万亿元角分整零负]+$/g, '').trim();
                  if (stripped) prefix = stripped;
                }
              }
              writeGlobalCell(cellA1, prefix + toChineseMoney(totalIncl));
            })();

            // 备注
            if (opts.note && String(opts.note).trim()) {
              writeGlobalCell(C_NOTE, String(opts.note).trim());
            }

            // ---------- 6) 替换 zip 中的 sheet1.xml，重新打包 ----------
            zip.file('xl/worksheets/sheet1.xml', finalXml);
            _context.next = 81;
            return zip.generateAsync({
              type: 'uint8array',
              mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              compression: 'DEFLATE',
              compressionOptions: {
                level: 6
              }
            });
          case 81:
            out = _context.sent;
            return _context.abrupt("return", out);
          case 83:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _buildContract.apply(this, arguments);
}
module.exports = {
  CFG: CFG,
  toChineseMoney: toChineseMoney,
  parseA1: parseA1,
  buildContract: buildContract,
  // 单测用
  _splitSheetData: splitSheetData,
  _writeCellInRow: writeCellInRow,
  _cloneRow13To: cloneRow13To,
  _offsetAllRowNumbers: offsetAllRowNumbers,
  _clearRowForCols: clearRowForCols,
  _writeRowProduct: writeRowProduct
};

/***/ }),
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */
/*!**************************************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/node_modules/@dcloudio/uni-ui/lib/uni-icons/uniicons_file_vue.js ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fontData = void 0;
var fontData = [{
  "font_class": "arrow-down",
  "unicode": "\uE6BE"
}, {
  "font_class": "arrow-left",
  "unicode": "\uE6BC"
}, {
  "font_class": "arrow-right",
  "unicode": "\uE6BB"
}, {
  "font_class": "arrow-up",
  "unicode": "\uE6BD"
}, {
  "font_class": "auth",
  "unicode": "\uE6AB"
}, {
  "font_class": "auth-filled",
  "unicode": "\uE6CC"
}, {
  "font_class": "back",
  "unicode": "\uE6B9"
}, {
  "font_class": "bars",
  "unicode": "\uE627"
}, {
  "font_class": "calendar",
  "unicode": "\uE6A0"
}, {
  "font_class": "calendar-filled",
  "unicode": "\uE6C0"
}, {
  "font_class": "camera",
  "unicode": "\uE65A"
}, {
  "font_class": "camera-filled",
  "unicode": "\uE658"
}, {
  "font_class": "cart",
  "unicode": "\uE631"
}, {
  "font_class": "cart-filled",
  "unicode": "\uE6D0"
}, {
  "font_class": "chat",
  "unicode": "\uE65D"
}, {
  "font_class": "chat-filled",
  "unicode": "\uE659"
}, {
  "font_class": "chatboxes",
  "unicode": "\uE696"
}, {
  "font_class": "chatboxes-filled",
  "unicode": "\uE692"
}, {
  "font_class": "chatbubble",
  "unicode": "\uE697"
}, {
  "font_class": "chatbubble-filled",
  "unicode": "\uE694"
}, {
  "font_class": "checkbox",
  "unicode": "\uE62B"
}, {
  "font_class": "checkbox-filled",
  "unicode": "\uE62C"
}, {
  "font_class": "checkmarkempty",
  "unicode": "\uE65C"
}, {
  "font_class": "circle",
  "unicode": "\uE65B"
}, {
  "font_class": "circle-filled",
  "unicode": "\uE65E"
}, {
  "font_class": "clear",
  "unicode": "\uE66D"
}, {
  "font_class": "close",
  "unicode": "\uE673"
}, {
  "font_class": "closeempty",
  "unicode": "\uE66C"
}, {
  "font_class": "cloud-download",
  "unicode": "\uE647"
}, {
  "font_class": "cloud-download-filled",
  "unicode": "\uE646"
}, {
  "font_class": "cloud-upload",
  "unicode": "\uE645"
}, {
  "font_class": "cloud-upload-filled",
  "unicode": "\uE648"
}, {
  "font_class": "color",
  "unicode": "\uE6CF"
}, {
  "font_class": "color-filled",
  "unicode": "\uE6C9"
}, {
  "font_class": "compose",
  "unicode": "\uE67F"
}, {
  "font_class": "contact",
  "unicode": "\uE693"
}, {
  "font_class": "contact-filled",
  "unicode": "\uE695"
}, {
  "font_class": "down",
  "unicode": "\uE6B8"
}, {
  "font_class": "bottom",
  "unicode": "\uE6B8"
}, {
  "font_class": "download",
  "unicode": "\uE68D"
}, {
  "font_class": "download-filled",
  "unicode": "\uE681"
}, {
  "font_class": "email",
  "unicode": "\uE69E"
}, {
  "font_class": "email-filled",
  "unicode": "\uE69A"
}, {
  "font_class": "eye",
  "unicode": "\uE651"
}, {
  "font_class": "eye-filled",
  "unicode": "\uE66A"
}, {
  "font_class": "eye-slash",
  "unicode": "\uE6B3"
}, {
  "font_class": "eye-slash-filled",
  "unicode": "\uE6B4"
}, {
  "font_class": "fire",
  "unicode": "\uE6A1"
}, {
  "font_class": "fire-filled",
  "unicode": "\uE6C5"
}, {
  "font_class": "flag",
  "unicode": "\uE65F"
}, {
  "font_class": "flag-filled",
  "unicode": "\uE660"
}, {
  "font_class": "folder-add",
  "unicode": "\uE6A9"
}, {
  "font_class": "folder-add-filled",
  "unicode": "\uE6C8"
}, {
  "font_class": "font",
  "unicode": "\uE6A3"
}, {
  "font_class": "forward",
  "unicode": "\uE6BA"
}, {
  "font_class": "gear",
  "unicode": "\uE664"
}, {
  "font_class": "gear-filled",
  "unicode": "\uE661"
}, {
  "font_class": "gift",
  "unicode": "\uE6A4"
}, {
  "font_class": "gift-filled",
  "unicode": "\uE6C4"
}, {
  "font_class": "hand-down",
  "unicode": "\uE63D"
}, {
  "font_class": "hand-down-filled",
  "unicode": "\uE63C"
}, {
  "font_class": "hand-up",
  "unicode": "\uE63F"
}, {
  "font_class": "hand-up-filled",
  "unicode": "\uE63E"
}, {
  "font_class": "headphones",
  "unicode": "\uE630"
}, {
  "font_class": "heart",
  "unicode": "\uE639"
}, {
  "font_class": "heart-filled",
  "unicode": "\uE641"
}, {
  "font_class": "help",
  "unicode": "\uE679"
}, {
  "font_class": "help-filled",
  "unicode": "\uE674"
}, {
  "font_class": "home",
  "unicode": "\uE662"
}, {
  "font_class": "home-filled",
  "unicode": "\uE663"
}, {
  "font_class": "image",
  "unicode": "\uE670"
}, {
  "font_class": "image-filled",
  "unicode": "\uE678"
}, {
  "font_class": "images",
  "unicode": "\uE650"
}, {
  "font_class": "images-filled",
  "unicode": "\uE64B"
}, {
  "font_class": "info",
  "unicode": "\uE669"
}, {
  "font_class": "info-filled",
  "unicode": "\uE649"
}, {
  "font_class": "left",
  "unicode": "\uE6B7"
}, {
  "font_class": "link",
  "unicode": "\uE6A5"
}, {
  "font_class": "list",
  "unicode": "\uE644"
}, {
  "font_class": "location",
  "unicode": "\uE6AE"
}, {
  "font_class": "location-filled",
  "unicode": "\uE6AF"
}, {
  "font_class": "locked",
  "unicode": "\uE66B"
}, {
  "font_class": "locked-filled",
  "unicode": "\uE668"
}, {
  "font_class": "loop",
  "unicode": "\uE633"
}, {
  "font_class": "mail-open",
  "unicode": "\uE643"
}, {
  "font_class": "mail-open-filled",
  "unicode": "\uE63A"
}, {
  "font_class": "map",
  "unicode": "\uE667"
}, {
  "font_class": "map-filled",
  "unicode": "\uE666"
}, {
  "font_class": "map-pin",
  "unicode": "\uE6AD"
}, {
  "font_class": "map-pin-ellipse",
  "unicode": "\uE6AC"
}, {
  "font_class": "medal",
  "unicode": "\uE6A2"
}, {
  "font_class": "medal-filled",
  "unicode": "\uE6C3"
}, {
  "font_class": "mic",
  "unicode": "\uE671"
}, {
  "font_class": "mic-filled",
  "unicode": "\uE677"
}, {
  "font_class": "micoff",
  "unicode": "\uE67E"
}, {
  "font_class": "micoff-filled",
  "unicode": "\uE6B0"
}, {
  "font_class": "minus",
  "unicode": "\uE66F"
}, {
  "font_class": "minus-filled",
  "unicode": "\uE67D"
}, {
  "font_class": "more",
  "unicode": "\uE64D"
}, {
  "font_class": "more-filled",
  "unicode": "\uE64E"
}, {
  "font_class": "navigate",
  "unicode": "\uE66E"
}, {
  "font_class": "navigate-filled",
  "unicode": "\uE67A"
}, {
  "font_class": "notification",
  "unicode": "\uE6A6"
}, {
  "font_class": "notification-filled",
  "unicode": "\uE6C1"
}, {
  "font_class": "paperclip",
  "unicode": "\uE652"
}, {
  "font_class": "paperplane",
  "unicode": "\uE672"
}, {
  "font_class": "paperplane-filled",
  "unicode": "\uE675"
}, {
  "font_class": "person",
  "unicode": "\uE699"
}, {
  "font_class": "person-filled",
  "unicode": "\uE69D"
}, {
  "font_class": "personadd",
  "unicode": "\uE69F"
}, {
  "font_class": "personadd-filled",
  "unicode": "\uE698"
}, {
  "font_class": "personadd-filled-copy",
  "unicode": "\uE6D1"
}, {
  "font_class": "phone",
  "unicode": "\uE69C"
}, {
  "font_class": "phone-filled",
  "unicode": "\uE69B"
}, {
  "font_class": "plus",
  "unicode": "\uE676"
}, {
  "font_class": "plus-filled",
  "unicode": "\uE6C7"
}, {
  "font_class": "plusempty",
  "unicode": "\uE67B"
}, {
  "font_class": "pulldown",
  "unicode": "\uE632"
}, {
  "font_class": "pyq",
  "unicode": "\uE682"
}, {
  "font_class": "qq",
  "unicode": "\uE680"
}, {
  "font_class": "redo",
  "unicode": "\uE64A"
}, {
  "font_class": "redo-filled",
  "unicode": "\uE655"
}, {
  "font_class": "refresh",
  "unicode": "\uE657"
}, {
  "font_class": "refresh-filled",
  "unicode": "\uE656"
}, {
  "font_class": "refreshempty",
  "unicode": "\uE6BF"
}, {
  "font_class": "reload",
  "unicode": "\uE6B2"
}, {
  "font_class": "right",
  "unicode": "\uE6B5"
}, {
  "font_class": "scan",
  "unicode": "\uE62A"
}, {
  "font_class": "search",
  "unicode": "\uE654"
}, {
  "font_class": "settings",
  "unicode": "\uE653"
}, {
  "font_class": "settings-filled",
  "unicode": "\uE6CE"
}, {
  "font_class": "shop",
  "unicode": "\uE62F"
}, {
  "font_class": "shop-filled",
  "unicode": "\uE6CD"
}, {
  "font_class": "smallcircle",
  "unicode": "\uE67C"
}, {
  "font_class": "smallcircle-filled",
  "unicode": "\uE665"
}, {
  "font_class": "sound",
  "unicode": "\uE684"
}, {
  "font_class": "sound-filled",
  "unicode": "\uE686"
}, {
  "font_class": "spinner-cycle",
  "unicode": "\uE68A"
}, {
  "font_class": "staff",
  "unicode": "\uE6A7"
}, {
  "font_class": "staff-filled",
  "unicode": "\uE6CB"
}, {
  "font_class": "star",
  "unicode": "\uE688"
}, {
  "font_class": "star-filled",
  "unicode": "\uE68F"
}, {
  "font_class": "starhalf",
  "unicode": "\uE683"
}, {
  "font_class": "trash",
  "unicode": "\uE687"
}, {
  "font_class": "trash-filled",
  "unicode": "\uE685"
}, {
  "font_class": "tune",
  "unicode": "\uE6AA"
}, {
  "font_class": "tune-filled",
  "unicode": "\uE6CA"
}, {
  "font_class": "undo",
  "unicode": "\uE64F"
}, {
  "font_class": "undo-filled",
  "unicode": "\uE64C"
}, {
  "font_class": "up",
  "unicode": "\uE6B6"
}, {
  "font_class": "top",
  "unicode": "\uE6B6"
}, {
  "font_class": "upload",
  "unicode": "\uE690"
}, {
  "font_class": "upload-filled",
  "unicode": "\uE68E"
}, {
  "font_class": "videocam",
  "unicode": "\uE68C"
}, {
  "font_class": "videocam-filled",
  "unicode": "\uE689"
}, {
  "font_class": "vip",
  "unicode": "\uE6A8"
}, {
  "font_class": "vip-filled",
  "unicode": "\uE6C6"
}, {
  "font_class": "wallet",
  "unicode": "\uE6B1"
}, {
  "font_class": "wallet-filled",
  "unicode": "\uE6C2"
}, {
  "font_class": "weibo",
  "unicode": "\uE68B"
}, {
  "font_class": "weixin",
  "unicode": "\uE691"
}];

// export const fontData = JSON.parse<IconsDataItem>(fontDataJson)
exports.fontData = fontData;

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map