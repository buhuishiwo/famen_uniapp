(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/upload-price/upload-price"],{

/***/ 73:
/*!*****************************************************************************************!*\
  !*** D:/Code/famen_minip_uni(1)/main.js?{"page":"pages%2Fupload-price%2Fupload-price"} ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 26);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _uploadPrice = _interopRequireDefault(__webpack_require__(/*! ./pages/upload-price/upload-price.vue */ 74));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_uploadPrice.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 74:
/*!**********************************************************************!*\
  !*** D:/Code/famen_minip_uni(1)/pages/upload-price/upload-price.vue ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./upload-price.vue?vue&type=template&id=652f49b4& */ 75);
/* harmony import */ var _upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./upload-price.vue?vue&type=script&lang=js& */ 77);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _upload_price_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./upload-price.vue?vue&type=style&index=0&lang=css& */ 79);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 32);

var renderjs





/* normalize component */

var component = Object(_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/upload-price/upload-price.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 75:
/*!*****************************************************************************************************!*\
  !*** D:/Code/famen_minip_uni(1)/pages/upload-price/upload-price.vue?vue&type=template&id=652f49b4& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./upload-price.vue?vue&type=template&id=652f49b4& */ 76);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_template_id_652f49b4___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 76:
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/Code/famen_minip_uni(1)/pages/upload-price/upload-price.vue?vue&type=template&id=652f49b4& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var g0 = _vm.previewData.length
  var g1 = g0 > 0 ? _vm.previewData.length : null
  var g2 = _vm.failedRows.length
  var g3 = g2 > 0 ? _vm.failedRows.length : null
  var g4 = !_vm.fileName || _vm.previewData.length === 0
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        g0: g0,
        g1: g1,
        g2: g2,
        g3: g3,
        g4: g4,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 77:
/*!***********************************************************************************************!*\
  !*** D:/Code/famen_minip_uni(1)/pages/upload-price/upload-price.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./upload-price.vue?vue&type=script&lang=js& */ 78);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 78:
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/Code/famen_minip_uni(1)/pages/upload-price/upload-price.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var navigationBar = function navigationBar() {
  __webpack_require__.e(/*! require.ensure | components/navigation-bar/navigation-bar */ "components/navigation-bar/navigation-bar").then((function () {
    return resolve(__webpack_require__(/*! @/components/navigation-bar/navigation-bar */ 81));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    navigationBar: navigationBar
  },
  data: function data() {
    return {
      fileName: '',
      fileSize: '',
      fileData: null,
      previewData: [],
      failedRows: [],
      stats: {
        total: 0,
        success: 0,
        failed: 0
      },
      isUploading: false
    };
  },
  methods: {
    chooseFile: function chooseFile() {
      var _this = this;
      uni.chooseMessageFile({
        count: 1,
        type: 'file',
        extension: ['.xlsx', '.xls', '.csv'],
        success: function success(res) {
          var file = res.tempFiles[0];
          _this.fileName = file.name;
          _this.fileSize = _this.formatFileSize(file.size);
          _this.fileData = file;
          if (file.size > 10 * 1024 * 1024) {
            uni.showToast({
              title: '文件大小不能超过10MB',
              icon: 'none'
            });
            return;
          }
          _this.parseFile(file);
        },
        fail: function fail(err) {
          console.error('选择文件失败:', err);
          uni.showToast({
            title: '选择文件失败',
            icon: 'none'
          });
        }
      });
    },
    formatFileSize: function formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    },
    parseFile: function parseFile(file) {
      var _this2 = this;
      uni.showLoading({
        title: '正在解析文件...',
        mask: true
      });
      var url = 'http://localhost:3000/api/quotations/import';

      // 读取文件为 base64
      uni.request({
        url: file.path,
        method: 'GET',
        responseType: 'arraybuffer',
        success: function success(res) {
          if (res.statusCode === 200 && res.data) {
            var base64 = uni.arrayBufferToBase64(res.data);
            _this2.uploadWithBase64(base64, file.name);
          } else {
            // 备选方案：直接发送文件
            _this2.uploadDirect(file);
          }
        },
        fail: function fail() {
          // 备选方案：直接发送文件
          _this2.uploadDirect(file);
        }
      });
    },
    uploadWithBase64: function uploadWithBase64(base64Data, fileName) {
      var _this3 = this;
      uni.request({
        url: 'http://localhost:3000/api/quotations/import/base64',
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          fileData: base64Data,
          fileName: fileName
        },
        success: function success(res) {
          _this3.handleParseResponse(res);
        },
        fail: function fail(err) {
          console.error('上传失败:', err);
          uni.showToast({
            title: '上传失败，请检查服务器',
            icon: 'none'
          });
        },
        complete: function complete() {
          uni.hideLoading();
        }
      });
    },
    uploadDirect: function uploadDirect(file) {
      var _this4 = this;
      uni.uploadFile({
        url: 'http://localhost:3000/api/quotations/import',
        filePath: file.path,
        name: 'file',
        success: function success(res) {
          _this4.handleParseResponse({
            statusCode: res.statusCode,
            data: res.data
          });
        },
        fail: function fail(err) {
          console.error('上传失败:', err);
          uni.showToast({
            title: '上传失败，请检查服务器',
            icon: 'none'
          });
        },
        complete: function complete() {
          uni.hideLoading();
        }
      });
    },
    handleParseResponse: function handleParseResponse(res) {
      try {
        console.log('响应状态码:', res.statusCode);
        console.log('响应数据:', res.data);
        var result;
        if (typeof res.data === 'string') {
          result = JSON.parse(res.data);
        } else {
          result = res.data;
        }
        console.log('解析后的结果:', result);
        if ((res.statusCode === 200 || res.statusCode === 201) && result.success) {
          console.log('开始更新数据...');
          console.log('previewData原始:', result.data.previewData);
          console.log('rowsCount:', result.data.rowsCount);
          this.previewData = result.data.previewData || [];
          this.failedRows = result.data.failedRows || [];
          this.stats.total = result.data.rowsCount || 0;
          this.stats.success = result.data.successCount || 0;
          this.stats.failed = this.failedRows.length;
          console.log('更新后 previewData:', this.previewData);
          console.log('更新后 stats:', this.stats);
          console.log('数据更新完成');
          if (this.failedRows.length > 0) {
            uni.showToast({
              title: "\u89E3\u6790\u5B8C\u6210\uFF0C".concat(this.failedRows.length, "\u6761\u6570\u636E\u6709\u8BEF"),
              icon: 'none',
              duration: 3000
            });
          } else {
            uni.showToast({
              title: '解析成功',
              icon: 'success'
            });
          }
        } else {
          uni.showToast({
            title: result.message || result.error || '解析失败',
            icon: 'none'
          });
        }
      } catch (e) {
        console.error('解析响应失败:', e, res.data);
        uni.showToast({
          title: '解析响应失败',
          icon: 'none'
        });
      }
    },
    downloadTemplate: function downloadTemplate() {
      uni.showLoading({
        title: '正在下载模板...',
        mask: true
      });
      console.log('开始下载模板...');
      console.log('请求URL:', 'http://localhost:3000/api/quotations/template');
      uni.downloadFile({
        url: 'http://localhost:3000/api/quotations/template',
        success: function success(res) {
          console.log('下载响应:', res);
          console.log('状态码:', res.statusCode);
          console.log('临时文件路径:', res.tempFilePath);
          if (res.statusCode === 200) {
            uni.openDocument({
              filePath: res.tempFilePath,
              fileType: 'xlsx',
              showMenu: true,
              success: function success() {
                uni.hideLoading();
                uni.showToast({
                  title: '模板下载成功',
                  icon: 'success'
                });
              },
              fail: function fail(err) {
                uni.hideLoading();
                console.error('打开文件失败:', err);
                uni.showToast({
                  title: '打开文件失败',
                  icon: 'none'
                });
              }
            });
          } else {
            uni.hideLoading();
            console.error('下载失败，状态码:', res.statusCode);
            uni.showToast({
              title: '下载失败，状态码:' + res.statusCode,
              icon: 'none'
            });
          }
        },
        fail: function fail(err) {
          uni.hideLoading();
          console.error('下载模板失败:', err);
          uni.showToast({
            title: '下载失败，请检查服务器',
            icon: 'none'
          });
        }
      });
    },
    confirmImport: function confirmImport() {
      var _this5 = this;
      if (!this.previewData || this.previewData.length === 0) {
        uni.showToast({
          title: '没有可导入的数据',
          icon: 'none'
        });
        return;
      }
      uni.showModal({
        title: '确认导入',
        content: "\u5373\u5C06\u5BFC\u5165 ".concat(this.previewData.length, " \u6761\u4EF7\u683C\u6570\u636E\uFF0C\u786E\u8BA4\u7EE7\u7EED\uFF1F"),
        confirmText: '确认导入',
        cancelText: '取消',
        success: function success(res) {
          if (res.confirm) {
            _this5.doImport();
          }
        }
      });
    },
    doImport: function doImport() {
      var _this6 = this;
      uni.showLoading({
        title: '正在导入数据...',
        mask: true
      });
      var url = 'http://localhost:3000/api/quotations/import/confirm';
      uni.request({
        url: url,
        method: 'POST',
        data: {
          data: this.previewData
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function success(res) {
          try {
            var result = res.data;
            if (result.successCount !== undefined) {
              uni.showModal({
                title: '导入完成',
                content: "\u6210\u529F\u5BFC\u5165 ".concat(result.successCount, " \u6761\u6570\u636E\uFF0C\u5931\u8D25 ").concat(result.failedCount, " \u6761"),
                showCancel: false,
                confirmText: '确定',
                success: function success() {
                  _this6.clearFile();
                }
              });
            } else {
              uni.showToast({
                title: '导入失败',
                icon: 'none'
              });
            }
          } catch (e) {
            console.error('导入响应解析失败:', e);
            uni.showToast({
              title: '导入响应解析失败',
              icon: 'none'
            });
          }
        },
        fail: function fail(err) {
          console.error('导入失败:', err);
          uni.showToast({
            title: '导入失败，请检查服务器',
            icon: 'none'
          });
        },
        complete: function complete() {
          uni.hideLoading();
        }
      });
    },
    reparseFile: function reparseFile() {
      if (this.fileData) {
        this.parseFile(this.fileData);
      }
    },
    clearFile: function clearFile() {
      this.fileName = '';
      this.fileSize = '';
      this.fileData = null;
      this.previewData = [];
      this.failedRows = [];
      this.stats = {
        total: 0,
        success: 0,
        failed: 0
      };
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 79:
/*!*******************************************************************************************************!*\
  !*** D:/Code/famen_minip_uni(1)/pages/upload-price/upload-price.vue?vue&type=style&index=0&lang=css& ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../IDEs/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./upload-price.vue?vue&type=style&index=0&lang=css& */ 80);
/* harmony import */ var _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_IDEs_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_upload_price_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 80:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!D:/Code/famen_minip_uni(1)/pages/upload-price/upload-price.vue?vue&type=style&index=0&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[73,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/upload-price/upload-price.js.map