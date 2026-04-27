(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/quotation/quotation"],{

/***/ 61:
/*!********************************************************************************!*\
  !*** D:/Code/famen_minip_uni/main.js?{"page":"pages%2Fquotation%2Fquotation"} ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _quotation = _interopRequireDefault(__webpack_require__(/*! ./pages/quotation/quotation.vue */ 62));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_quotation.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 62:
/*!*************************************************************!*\
  !*** D:/Code/famen_minip_uni/pages/quotation/quotation.vue ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./quotation.vue?vue&type=template&id=0f421540& */ 63);
/* harmony import */ var _quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quotation.vue?vue&type=script&lang=js& */ 65);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./quotation.vue?vue&type=style&index=0&lang=css& */ 67);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["render"],
  _quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/quotation/quotation.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 63:
/*!********************************************************************************************!*\
  !*** D:/Code/famen_minip_uni/pages/quotation/quotation.vue?vue&type=template&id=0f421540& ***!
  \********************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./quotation.vue?vue&type=template&id=0f421540& */ 64);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 64:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/Code/famen_minip_uni/pages/quotation/quotation.vue?vue&type=template&id=0f421540& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 65:
/*!**************************************************************************************!*\
  !*** D:/Code/famen_minip_uni/pages/quotation/quotation.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./quotation.vue?vue&type=script&lang=js& */ 66);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 66:
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/Code/famen_minip_uni/pages/quotation/quotation.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _methods;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var navigationBar = function navigationBar() {
  __webpack_require__.e(/*! require.ensure | components/navigation-bar/navigation-bar */ "components/navigation-bar/navigation-bar").then((function () {
    return resolve(__webpack_require__(/*! @/components/navigation-bar/navigation-bar */ 69));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    navigationBar: navigationBar
  },
  data: function data() {
    return {
      quoteData: [],
      currentDate: '',
      customerName: '',
      note: '阀体WCB，闸板304，单向硬密封。硬密封不做试压会有一定的漏水；连接方式：对夹PN10，执行方式气动含双左右气缸+限位开关+两位五通电磁阀+过滤器。此价格含税不含运费',
      paymentMethod: '预定定金30%，付清余款发货。',
      packaging: '木箱包装。可以提供产品使用说明，产品材质报告，产品检测报告。',
      quoter: '童惠业',
      quoterPhone: '13957713583',
      validity: '15天'
    };
  },
  onLoad: function onLoad(options) {
    if (options.data) {
      var quoteData = JSON.parse(decodeURIComponent(options.data));
      var formattedData = quoteData.map(function (item) {
        return {
          productType: '气动刀闸阀',
          productName: item.productName || item.valveName,
          model: item.model || item.spec || '',
          material: 'WCB',
          seal: 'W',
          gateMaterial: item.gatePlate,
          stemMaterial: item.rodMaterial,
          quantity: item.quantity || 1,
          unitPrice: String(item.unitPrice || '0'),
          totalPrice: String(item.totalPrice || '0'),
          brandingFee: item.brandingFee || 0
        };
      });
      this.setData({
        quoteData: formattedData,
        currentDate: this.formatDate(new Date())
      });
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: '我的报价单',
      path: '/pages/quotation/quotation'
    };
  },
  methods: (_methods = {
    formatDate: function formatDate(date) {
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return "".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5");
    },
    // 自动换行绘制函数
    drawText: function drawText(ctx, text, x, y, maxWidth, lineHeight, fontSize) {
      if (!text) return y;
      ctx.setFontSize(fontSize);
      var lines = [];
      var currentLine = '';
      var _iterator = _createForOfIteratorHelper(text),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var char = _step.value;
          var testLine = currentLine + char;
          var metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            currentLine = char;
          } else {
            currentLine = testLine;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      lines.push(currentLine);
      lines.forEach(function (line, i) {
        return ctx.fillText(line, x, y + i * lineHeight);
      });
      return y + lines.length * lineHeight;
    },
    // 生成报价表图片
    generateQuotation: function generateQuotation() {
      var _this = this;
      uni.showLoading({
        title: '生成中...',
        mask: true
      });
      var ctx = uni.createCanvasContext('quotationCanvas', this);
      var scale = 1;
      var width = 750;
      var y = 30 * scale;

      // ✅【关键新增】先填充白色背景（覆盖足够大的区域）
      ctx.setFillStyle('#FFFFFF'); // 白色
      ctx.fillRect(0, 0, width, 5000); // 宽 750px，高 5000px（确保覆盖所有内容）
      ctx.setFillStyle('#000000'); // 恢复默认文字颜色

      // 设置缩放（虽然 scale=1，保留结构）
      ctx.scale(scale, scale);
      var logoPath = 'https://img.cdn1.vip/i/6968b913a8e9c_1768470803.png';
      uni.getImageInfo({
        src: logoPath,
        success: function success(logoRes) {
          // === 绘制 Logo 和企业信息（同一行开始）===
          var logoWidth = 100; // 建议缩小 Logo 宽度，避免挤压文字
          var logoHeight = 100;
          var logoX = 20;
          var logoY = 20;
          ctx.drawImage(logoRes.path, logoX, logoY, logoWidth, logoHeight);

          // 企业信息起始位置：Logo 右侧 + 20px 间距
          var infoX = logoX + logoWidth + 20;
          var infoY = logoY; // 与 Logo 顶部对齐

          // 公司名称（加大字号）
          ctx.setFontSize(24);
          ctx.setFillStyle('#000');
          ctx.fillText('奇胜阀门有限公司', infoX, infoY + 24); // +24 使文字垂直居中（字号24）
          infoY += 35; // 下移一行

          // 联系信息（小字号）
          ctx.setFontSize(12);
          var companyInfo = ['http://www.chisun.cn/www.qishengvalve.com', 'E-mail: qs@chisun.cn', '公司地址：浙江省温州市空港新区兴业路8号 邮编：325013', '电话: 15777828587'];
          companyInfo.forEach(function (line) {
            ctx.fillText(line, infoX, infoY);
            infoY += 18;
          });

          // 更新全局 y 坐标（用于后续内容）
          y = Math.max(logoY + logoHeight, infoY); // 取 Logo 底部和文字底部的最大值，再加间距

          // === 标题 ===
          y += 25 * scale;
          ctx.setFontSize(22);
          ctx.setTextAlign('center');
          ctx.fillText('报价单', 375, y / scale);
          ctx.setTextAlign('left');
          y += 35 * scale;

          // === 客户名称 ===
          ctx.setFontSize(14);
          ctx.fillText("\u5BA2\u6237\u540D\u79F0\uFF1A".concat(_this.customerName), 20, y / scale);
          y += 30 * scale;

          // === 表格 ===
          var totalWidth = 710;
          var startX = 20;
          var headers = ['产品名称', '型号规格', '材质', '密封面', '数量', '单价', '总价'];
          var cellWidths = [130, 180, 70, 70, 60, 90, 110];

          // 表头
          ctx.setFillStyle('#f5f5f5');
          ctx.fillRect(startX, y / scale, totalWidth, 30);
          ctx.setFillStyle('#000');
          ctx.setFontSize(12);
          var x = startX + 5;
          headers.forEach(function (h, i) {
            ctx.fillText(h, x, y / scale + 20);
            x += cellWidths[i];
          });
          y += 30 * scale;

          // 数据行
          var rowHeight = 35;
          _this.quoteData.forEach(function (item, idx) {
            x = startX + 5;
            var values = [item.productType, item.productName, item.material, item.seal, String(item.quantity), item.unitPrice, item.totalPrice];
            if (idx % 2 === 1) {
              ctx.setFillStyle('#fafafa');
              ctx.fillRect(startX, y / scale, totalWidth, rowHeight);
              ctx.setFillStyle('#000');
            }
            values.forEach(function (val, i) {
              if (i === 6) ctx.setFillStyle('#d32f2f');
              ctx.fillText(val || '', x, y / scale + 23);
              if (i === 6) ctx.setFillStyle('#000');
              x += cellWidths[i];
            });
            ctx.setStrokeStyle('#e0e0e0');
            ctx.setLineWidth(1);
            ctx.beginPath();
            ctx.moveTo(startX, y / scale + rowHeight);
            ctx.lineTo(startX + totalWidth, y / scale + rowHeight);
            ctx.stroke();
            y += rowHeight * scale;
          });

          // === 备注 ===
          y += 25 * scale;
          ctx.setFontSize(14);
          ctx.fillText('备注：', 20, y / scale);
          y += 20 * scale;
          y = _this.drawText(ctx, _this.note, 20, y / scale, 710, 18, 12) * scale + 10 * scale;

          // === 付款 & 包装 ===
          ctx.setFontSize(14);
          ctx.fillText("\u4ED8\u6B3E\u65B9\u5F0F\uFF1A".concat(_this.paymentMethod), 20, y / scale);
          y += 20 * scale;
          ctx.fillText("\u5305\u88C5\u65B9\u5F0F\uFF1A".concat(_this.packaging), 20, y / scale);
          y += 25 * scale;

          // === 报价人 ===
          ctx.fillText("\u62A5\u4EF7\u4EBA\uFF1A".concat(_this.quoter, "    \u624B\u673A\uFF1A").concat(_this.quoterPhone), 20, y / scale);
          y += 20 * scale;
          ctx.fillText("\u62A5\u4EF7\u6709\u6548\u671F\uFF1A".concat(_this.validity, "    \u62A5\u4EF7\u65E5\u671F\uFF1A").concat(_this.currentDate), 20, y / scale);
          y += 40 * scale;

          // 绘制完成
          ctx.draw(false, function () {
            var finalHeight = Math.ceil(y / scale);
            uni.canvasToTempFilePath({
              canvasId: 'quotationCanvas',
              width: 750,
              height: finalHeight,
              // 只截取有内容的部分
              destWidth: 750 * 2,
              destHeight: finalHeight * 2,
              success: function success(res) {
                uni.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function success() {
                    uni.showToast({
                      title: '已保存到相册',
                      icon: 'success'
                    });
                  },
                  fail: function fail() {
                    uni.showToast({
                      title: '请允许访问相册',
                      icon: 'none'
                    });
                  }
                });
              },
              fail: function fail(err) {
                console.error('生成失败:', err);
                uni.showToast({
                  title: '生成失败',
                  icon: 'error'
                });
              },
              complete: function complete() {
                return uni.hideLoading();
              }
            });
          });
        },
        fail: function fail(err) {
          console.error('Logo加载失败', err);
          uni.showToast({
            title: 'Logo加载失败',
            icon: 'error'
          });
          uni.hideLoading();
        }
      });
    },
    // ✅ 修正：Vue 中直接赋值，不要用 setData
    onCustomerNameInput: function onCustomerNameInput(e) {
      this.customerName = e.detail.value;
    },
    onNoteInput: function onNoteInput(e) {
      this.note = e.detail.value;
    },
    onPaymentMethodInput: function onPaymentMethodInput(e) {
      this.paymentMethod = e.detail.value;
    },
    onPackagingInput: function onPackagingInput(e) {
      this.packaging = e.detail.value;
    },
    onQuoterInput: function onQuoterInput(e) {
      this.quoter = e.detail.value;
    },
    onQuoterPhoneInput: function onQuoterPhoneInput(e) {
      this.quoterPhone = e.detail.value;
    },
    onValidityInput: function onValidityInput(e) {
      this.validity = e.detail.value;
    }
  }, (0, _defineProperty2.default)(_methods, "onCustomerNameInput", function onCustomerNameInput(e) {
    this.setData({
      customerName: e.detail.value
    });
  }), (0, _defineProperty2.default)(_methods, "onNoteInput", function onNoteInput(e) {
    this.setData({
      note: e.detail.value
    });
  }), (0, _defineProperty2.default)(_methods, "onPaymentMethodInput", function onPaymentMethodInput(e) {
    this.setData({
      paymentMethod: e.detail.value
    });
  }), (0, _defineProperty2.default)(_methods, "onPackagingInput", function onPackagingInput(e) {
    this.setData({
      packaging: e.detail.value
    });
  }), (0, _defineProperty2.default)(_methods, "onQuoterInput", function onQuoterInput(e) {
    this.setData({
      quoter: e.detail.value
    });
  }), (0, _defineProperty2.default)(_methods, "onQuoterPhoneInput", function onQuoterPhoneInput(e) {
    this.setData({
      quoterPhone: e.detail.value
    });
  }), (0, _defineProperty2.default)(_methods, "onValidityInput", function onValidityInput(e) {
    this.setData({
      validity: e.detail.value
    });
  }), (0, _defineProperty2.default)(_methods, "onBack", function onBack() {
    uni.navigateBack();
  }), _methods)
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 67:
/*!**********************************************************************************************!*\
  !*** D:/Code/famen_minip_uni/pages/quotation/quotation.vue?vue&type=style&index=0&lang=css& ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./quotation.vue?vue&type=style&index=0&lang=css& */ 68);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 68:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/Code/famen_minip_uni/pages/quotation/quotation.vue?vue&type=style&index=0&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[61,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quotation/quotation.js.map