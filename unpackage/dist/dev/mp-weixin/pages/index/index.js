(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/index/index"],{

/***/ 64:
/*!**************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/main.js?{"page":"pages%2Findex%2Findex"} ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 30);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _index = _interopRequireDefault(__webpack_require__(/*! ./pages/index/index.vue */ 65));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_index.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 65:
/*!*******************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/index/index.vue ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=template&id=57280228& */ 66);
/* harmony import */ var _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js& */ 68);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./index.vue?vue&type=style&index=0&lang=css& */ 70);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 36);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["render"],
  _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

component.options.__file = "pages/index/index.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 66:
/*!**************************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/index/index.vue?vue&type=template&id=57280228& ***!
  \**************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=template&id=57280228& */ 67);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_template_id_57280228___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 67:
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/meonsaber/Desktop/famen_uniapp/pages/index/index.vue?vue&type=template&id=57280228& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    languageSwitch: function () {
      return Promise.all(/*! import() | components/language-switch/language-switch */[__webpack_require__.e("common/vendor"), __webpack_require__.e("components/language-switch/language-switch")]).then(__webpack_require__.bind(null, /*! @/components/language-switch/language-switch.vue */ 88))
    },
    uniIcons: function () {
      return Promise.all(/*! import() | node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons */[__webpack_require__.e("common/vendor"), __webpack_require__.e("node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons")]).then(__webpack_require__.bind(null, /*! @dcloudio/uni-ui/lib/uni-icons/uni-icons.vue */ 102))
    },
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  var m0 = _vm.currentProductSeries || _vm.$t("index.valveSelection")
  var m1 = _vm.$t("index.configQuote")
  var m2 = _vm.currentProductSeries || _vm.$t("index.valveSelection")
  var m3 = _vm.$t("index.configTitle")
  var m4 = _vm.$t("index.productConfig")
  var m5 = _vm.$t("index.valveModel")
  var m6 = !_vm.selectedValve ? _vm.$t("index.selectValveModel") : null
  var m7 = _vm.$t("index.specSize")
  var m8 = !_vm.selectedSpec ? _vm.$t("index.selectSpecSize") : null
  var m9 = _vm.$t("index.bodyMaterial")
  var m10 = !_vm.SelectValveBody ? _vm.$t("index.selectBodyMaterial") : null
  var m11 = _vm.$t("index.gateMaterial")
  var m12 = !_vm.selectedGatePlate ? _vm.$t("index.selectGateMaterial") : null
  var m13 = _vm.$t("index.stemMaterial")
  var m14 = !_vm.selectedRodMaterial ? _vm.$t("index.selectStemMaterial") : null
  var m15 = _vm.$t("index.yokeMaterial")
  var m16 = !_vm.selectedYokeMaterial
    ? _vm.$t("index.selectYokeMaterial")
    : null
  var m17 = _vm.$t("index.productType")
  var m18 = _vm.$t("index.quantity")
  var m19 =
    _vm.currentMoq > 0
      ? _vm.$t("index.moqHint", {
          moq: _vm.currentMoq,
        })
      : null
  var m20 = _vm.$t("index.inputQuantity")
  var m21 = _vm.$t("index.branding")
  var m22 = _vm.$t("index.yes")
  var m23 = _vm.$t("index.no")
  var m24 =
    _vm.selectedValve &&
    _vm.selectedSpec &&
    _vm.selectedGatePlate &&
    _vm.selectedRodMaterial
      ? _vm.$t("index.originalUnitPrice")
      : null
  var m25 =
    _vm.selectedValve &&
    _vm.selectedSpec &&
    _vm.selectedGatePlate &&
    _vm.selectedRodMaterial &&
    _vm.allowPriceModification
      ? _vm.$t("index.modifiedUnitPrice")
      : null
  var m26 =
    _vm.selectedValve &&
    _vm.selectedSpec &&
    _vm.selectedGatePlate &&
    _vm.selectedRodMaterial
      ? _vm.$t("index.estimatedTotal")
      : null
  var m27 =
    _vm.selectedValve &&
    _vm.selectedSpec &&
    _vm.selectedGatePlate &&
    _vm.selectedRodMaterial &&
    _vm.allowPriceModification
      ? _vm.$t("index.priceTip")
      : null
  var m28 = _vm.$t("index.addToQuote")
  var g0 = _vm.quoteItems.length
  var m29 = g0 > 0 ? _vm.$t("index.generateQuote") : null
  var g1 = _vm.quoteItems.length
  var m30 = g1 > 0 ? _vm.$t("index.quoteDetails") : null
  var m31 =
    g1 > 0
      ? _vm.$t("index.totalItems", {
          count: _vm.quoteItems.length,
        })
      : null
  var l0 =
    g1 > 0
      ? _vm.__map(_vm.quoteItems, function (item, index) {
          var $orig = _vm.__get_orig(item)
          var m32 = _vm.$t("quotation.pieces")
          return {
            $orig: $orig,
            m32: m32,
          }
        })
      : null
  var m33 = g1 > 0 ? _vm.$t("index.totalAmount") : null
  var g2 = !(g1 > 0) ? !_vm.quoteItems || _vm.quoteItems.length === 0 : null
  var m34 = !(g1 > 0) && g2 ? _vm.$t("index.noQuoteItems") : null
  var m35 = !(g1 > 0) && g2 ? _vm.$t("index.noQuoteItemsSub") : null
  _vm.$mp.data = Object.assign(
    {},
    {
      $root: {
        m0: m0,
        m1: m1,
        m2: m2,
        m3: m3,
        m4: m4,
        m5: m5,
        m6: m6,
        m7: m7,
        m8: m8,
        m9: m9,
        m10: m10,
        m11: m11,
        m12: m12,
        m13: m13,
        m14: m14,
        m15: m15,
        m16: m16,
        m17: m17,
        m18: m18,
        m19: m19,
        m20: m20,
        m21: m21,
        m22: m22,
        m23: m23,
        m24: m24,
        m25: m25,
        m26: m26,
        m27: m27,
        m28: m28,
        g0: g0,
        m29: m29,
        g1: g1,
        m30: m30,
        m31: m31,
        l0: l0,
        m33: m33,
        g2: g2,
        m34: m34,
        m35: m35,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 68:
/*!********************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/index/index.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=script&lang=js& */ 69);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 69:
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/meonsaber/Desktop/famen_uniapp/pages/index/index.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/regenerator */ 58));
var _toConsumableArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/toConsumableArray */ 18));
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 60));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _cloudApi = __webpack_require__(/*! @/utils/cloud-api */ 61);
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var navigationBar = function navigationBar() {
  __webpack_require__.e(/*! require.ensure | components/navigation-bar/navigation-bar */ "components/navigation-bar/navigation-bar").then((function () {
    return resolve(__webpack_require__(/*! @/components/navigation-bar/navigation-bar */ 95));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
var _default = {
  components: {
    navigationBar: navigationBar
  },
  data: function data() {
    return {
      // 当前产品系列
      currentProductSeries: '',
      // 阀门型号（对应价格表列）
      valveTypes: [],
      // 不同系列的阀门型号（从后端获取）
      seriesValveTypes: {},
      // 价格数据（从后端获取）
      priceData: [],
      // 价格表（保留部分本地数据作为备用）
      priceTable: {
        productTypeMultiplier: {
          'regular': 1.0,
          'newProduct': 1.3
        }
      },
      // 规格尺寸：从接口数据动态获取
      specifications: [],
      gatePlateTypes: [],
      valveBodyTypes: [],
      rodMaterials: [],
      yokeMaterials: [],
      materialData: [],
      materialDiffs: [],
      // 产品类型
      productTypeOptions: [],
      // 报价系数规则（从数据库加载，替代硬编码起订量）
      pricingRules: [],
      // 用户选择
      SelectValveBody: null,
      selectedValve: null,
      selectedSpec: null,
      selectedGatePlate: null,
      selectedRodMaterial: null,
      selectedYokeMaterial: null,
      selectedProductType: '',
      selectedBranding: false,
      quantity: 1,
      currentMoq: 0,
      allowPriceModification: true,
      // 报价数据
      quoteItems: [],
      totalPrice: '0.00',
      currentPrice: '0.00',
      // loading状态
      showLoading: false,
      loadingText: '',
      showToastDialog: false,
      toastText: '',
      toastType: 'success',
      totalPreviewPrice: '0.00',
      confirmedPrice: '0.00'
    };
  },
  created: function created() {
    var _this = this;
    this.initI18nData();
    this._i18nUnsubscribe = this.$localeOn(function () {
      _this.initI18nData();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  },
  onLoad: function onLoad() {
    this.currentProductSeries = uni.getStorageSync('currentProductSeries') || '';
    this.loadDataFromBackend();
    this.loadSystemConfig();
    var cachedQuoteItems = uni.getStorageSync('quoteItems');
    if (cachedQuoteItems) {
      this.quoteItems = cachedQuoteItems;
      this.calculateTotalPrice();
    }
  },
  methods: {
    initI18nData: function initI18nData() {
      var _this$priceTable$prod;
      var regular = this.$t('index.regular');
      var newProduct = this.$t('index.newProduct');
      this.productTypeOptions = [regular, newProduct];
      this.selectedProductType = regular;
      this.priceTable.productTypeMultiplier = (_this$priceTable$prod = {}, (0, _defineProperty2.default)(_this$priceTable$prod, regular, 1.0), (0, _defineProperty2.default)(_this$priceTable$prod, newProduct, 1.3), _this$priceTable$prod);
    },
    showToast: function showToast(text) {
      var _this2 = this;
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
      this.showToastDialog = true;
      this.toastText = text;
      this.toastType = type;
      setTimeout(function () {
        _this2.showToastDialog = false;
      }, 2000);
    },
    loadSystemConfig: function loadSystemConfig() {
      var _this3 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var res;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return _cloudApi.priceApi.getSystemConfig(['allow_price_modification']);
              case 3:
                res = _context.sent;
                if (res && res.success && res.data) {
                  _this3.allowPriceModification = res.data.allow_price_modification !== 'false';
                }
                _context.next = 10;
                break;
              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.warn('[loadSystemConfig] 加载系统配置失败:', _context.t0);
              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }))();
    },
    loadDataFromBackend: function loadDataFromBackend() {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var _yield$Promise$all, _yield$Promise$all2, series, models, rulesRes, materialsRes, diffsRes, groupedModels, seriesName;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this4.showLoading = true;
                _this4.loadingText = _this4.$t('index.loadingData');
                _context2.prev = 2;
                _context2.next = 5;
                return Promise.all([_cloudApi.priceApi.getSeries(), _cloudApi.priceApi.getModels(), _cloudApi.priceApi.getPricingRules(), _cloudApi.priceApi.getMaterials(), _cloudApi.priceApi.getMaterialDiffs()]);
              case 5:
                _yield$Promise$all = _context2.sent;
                _yield$Promise$all2 = (0, _slicedToArray2.default)(_yield$Promise$all, 5);
                series = _yield$Promise$all2[0];
                models = _yield$Promise$all2[1];
                rulesRes = _yield$Promise$all2[2];
                materialsRes = _yield$Promise$all2[3];
                diffsRes = _yield$Promise$all2[4];
                if (rulesRes && rulesRes.success) {
                  _this4.pricingRules = rulesRes.data || [];
                  console.log('[index] 加载报价系数规则: ' + _this4.pricingRules.length + ' 条');
                }
                if (materialsRes && materialsRes.success) {
                  _this4.materialData = materialsRes.data || [];
                  console.log('[index] 加载材质数据: ' + _this4.materialData.length + ' 条');
                  _this4.updateMaterialOptions();
                }
                if (diffsRes && diffsRes.success) {
                  _this4.materialDiffs = diffsRes.data || [];
                  console.log('[index] 加载材质价差数据: ' + _this4.materialDiffs.length + ' 条');
                }
                groupedModels = {};
                Object.keys(models).forEach(function (seriesName) {
                  groupedModels[seriesName] = models[seriesName].map(function (model) {
                    return {
                      id: model.id,
                      name: model.name,
                      type: model.type
                    };
                  });
                });
                _this4.seriesValveTypes = groupedModels;
                seriesName = _this4.currentProductSeries || null;
                _context2.next = 21;
                return _cloudApi.priceApi.getPrices(seriesName);
              case 21:
                _this4.priceData = _context2.sent;
                _this4.setValveTypesBySeries();
                _this4.updateSpecifications();
                _context2.next = 30;
                break;
              case 26:
                _context2.prev = 26;
                _context2.t0 = _context2["catch"](2);
                console.error('加载数据失败:', _context2.t0);
                _this4.showToast(_this4.$t('index.dataLoadFail'), 'error');
              case 30:
                _context2.prev = 30;
                _this4.showLoading = false;
                return _context2.finish(30);
              case 33:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[2, 26, 30, 33]]);
      }))();
    },
    setValveTypesBySeries: function setValveTypesBySeries() {
      if (this.currentProductSeries && this.seriesValveTypes[this.currentProductSeries]) {
        this.valveTypes = this.seriesValveTypes[this.currentProductSeries];
        this.loadPriceDataBySeries(this.currentProductSeries);
      } else if (this.currentProductSeries) {
        // 当前系列无型号数据，弹窗提示并返回
        this.valveTypes = [];
        this.priceData = [];
        uni.showModal({
          title: this.$t('product.noSeriesData'),
          content: this.$t('product.noSeriesDataMsg', {
            series: this.currentProductSeries
          }),
          showCancel: false,
          confirmText: '返回',
          success: function success() {
            uni.navigateBack();
          }
        });
      } else {
        // 没有指定系列（首次进入）
        var firstSeries = Object.keys(this.seriesValveTypes)[0];
        this.valveTypes = firstSeries ? this.seriesValveTypes[firstSeries] : [];
        if (firstSeries) {
          this.loadPriceDataBySeries(firstSeries);
        }
      }
    },
    loadPriceDataBySeries: function loadPriceDataBySeries(seriesName) {
      var _this5 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var i, materialsRes;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _cloudApi.priceApi.getPrices(seriesName);
              case 3:
                _this5.priceData = _context3.sent;
                console.log('[index] loadPriceDataBySeries: series=' + seriesName + ', 条数=' + (_this5.priceData ? _this5.priceData.length : 0));
                if (_this5.priceData && _this5.priceData.length > 0) {
                  for (i = 0; i < Math.min(_this5.priceData.length, 3); i++) {
                    console.log('[index] priceData[' + i + ']: valve=' + _this5.priceData[i].valveName + ' size=' + _this5.priceData[i].size + ' minOrderQty=' + _this5.priceData[i].minOrderQty + ' price=' + _this5.priceData[i].price);
                  }
                }
                _context3.next = 8;
                return _cloudApi.priceApi.getMaterials(seriesName);
              case 8:
                materialsRes = _context3.sent;
                if (materialsRes && materialsRes.success) {
                  _this5.materialData = materialsRes.data || [];
                  _this5.updateMaterialOptions();
                }
                _context3.next = 15;
                break;
              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);
                console.error('加载价格数据失败:', _context3.t0);
              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 12]]);
      }))();
    },
    updateMaterialOptions: function updateMaterialOptions() {
      var allBodyMaterials = (0, _toConsumableArray2.default)(new Set(this.materialData.map(function (m) {
        return m.bodyMaterial;
      }).filter(Boolean)));
      var allGatePlateMaterials = (0, _toConsumableArray2.default)(new Set(this.materialData.map(function (m) {
        return m.gatePlateMaterial;
      }).filter(Boolean)));
      var allStemMaterials = (0, _toConsumableArray2.default)(new Set(this.materialData.map(function (m) {
        return m.stemMaterial;
      }).filter(Boolean)));
      var allYokeMaterials = (0, _toConsumableArray2.default)(new Set(this.materialData.map(function (m) {
        return m.yokeMaterial;
      }).filter(Boolean)));
      var allDiffMaterials = new Set();
      var _iterator = _createForOfIteratorHelper(this.materialDiffs),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var d = _step.value;
          if (d.baseMaterial) allDiffMaterials.add(d.baseMaterial);
          if (d.targetMaterial) allDiffMaterials.add(d.targetMaterial);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var bodyMatSet = new Set([].concat((0, _toConsumableArray2.default)(allBodyMaterials), (0, _toConsumableArray2.default)(allDiffMaterials)));
      var gateMatSet = new Set([].concat((0, _toConsumableArray2.default)(allGatePlateMaterials), (0, _toConsumableArray2.default)(allDiffMaterials)));
      var stemMatSet = new Set([].concat((0, _toConsumableArray2.default)(allStemMaterials), (0, _toConsumableArray2.default)(allDiffMaterials)));
      var yokeMatSet = new Set([].concat((0, _toConsumableArray2.default)(allYokeMaterials), (0, _toConsumableArray2.default)(allDiffMaterials)));
      this.valveBodyTypes = Array.from(bodyMatSet).map(function (name) {
        return {
          name: name,
          price: 0
        };
      });
      this.gatePlateTypes = Array.from(gateMatSet).map(function (name) {
        return {
          name: name,
          price: 0
        };
      });
      this.rodMaterials = Array.from(stemMatSet).map(function (name) {
        return {
          name: name,
          price: 0
        };
      });
      this.yokeMaterials = Array.from(yokeMatSet).map(function (name) {
        return {
          name: name,
          price: 0
        };
      });
      if (this.valveBodyTypes.length === 0) {
        this.valveBodyTypes = [{
          name: 'GGG40',
          price: 0
        }];
      }
      if (this.gatePlateTypes.length === 0) {
        this.gatePlateTypes = [{
          name: 'SS304',
          price: 0
        }, {
          name: 'SS316',
          price: 0
        }];
      }
      if (this.rodMaterials.length === 0) {
        this.rodMaterials = [{
          name: '2Cr13',
          price: 0
        }, {
          name: 'SS304',
          price: 0
        }, {
          name: 'SS316',
          price: 0
        }];
      }
      if (this.yokeMaterials.length === 0) {
        this.yokeMaterials = [{
          name: 'Q235',
          price: 0
        }, {
          name: 'SS304',
          price: 0
        }];
      }
      console.log('[index] 材质选项更新: 阀体=' + this.valveBodyTypes.length + ', 闸板=' + this.gatePlateTypes.length + ', 阀杆=' + this.rodMaterials.length + ', 支架=' + this.yokeMaterials.length);
    },
    getMaterialByValveName: function getMaterialByValveName(valveName) {
      var selectedValve = this.selectedValve;
      if (selectedValve && selectedValve.id) {
        var material = this.materialData.find(function (m) {
          return m.modelId === selectedValve.id;
        });
        if (material) return material;
      }
      return this.materialData.find(function (m) {
        return m.valveName === valveName;
      });
    },
    setMaterialStandard: function setMaterialStandard(valveName) {
      var material = this.getMaterialByValveName(valveName);
      var bodyMat = null;
      var gatePlateMat = null;
      var stemMat = null;
      var yokeMat = null;
      if (material) {
        bodyMat = this.valveBodyTypes.find(function (v) {
          return v.name === material.bodyMaterial;
        });
        gatePlateMat = this.gatePlateTypes.find(function (v) {
          return v.name === material.gatePlateMaterial;
        });
        stemMat = this.rodMaterials.find(function (v) {
          return v.name === material.stemMaterial;
        });
        yokeMat = this.yokeMaterials.find(function (v) {
          return v.name === material.yokeMaterial;
        });
      }
      if (!bodyMat && this.valveBodyTypes.length > 0) {
        bodyMat = this.valveBodyTypes[0];
      }
      if (!gatePlateMat && this.gatePlateTypes.length > 0) {
        gatePlateMat = this.gatePlateTypes[0];
      }
      if (!stemMat && this.rodMaterials.length > 0) {
        stemMat = this.rodMaterials[0];
      }
      if (!yokeMat && this.yokeMaterials.length > 0) {
        yokeMat = this.yokeMaterials[0];
      }
      this.setData({
        SelectValveBody: bodyMat || null,
        selectedGatePlate: gatePlateMat || null,
        selectedRodMaterial: stemMat || null,
        selectedYokeMaterial: yokeMat || null
      });
    },
    /**
     * 获取指定系列+DN规格的起订量
     * 优先查价格表中配置的起订量，其次查报价系数规则表
     */
    getMinOrderQuantity: function getMinOrderQuantity(specSize) {
      var dnSize = parseInt(String(specSize).replace(/[^\d]/g, '')) || 0;

      // 1. 优先从价格表中获取该产品具体配置的起订量
      if (this.selectedValve && this.priceData && this.priceData.length > 0) {
        var priceItem = this.priceData.find(function (p) {
          var pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
          return p.valveName === this.selectedValve.name && pSize === dnSize;
        }, this);
        if (priceItem && priceItem.minOrderQty && priceItem.minOrderQty > 0) {
          return parseInt(priceItem.minOrderQty) || 50;
        }
      }

      // 2. 其次查报价系数规则表
      if (this.pricingRules && this.pricingRules.length > 0) {
        var seriesName = this.currentProductSeries;
        var rule = this.pricingRules.find(function (r) {
          return r.seriesName === seriesName && dnSize >= r.dnMin && dnSize <= r.dnMax;
        });
        if (rule && rule.minOrderQty) return rule.minOrderQty;
      }

      // 3. 兜底：50
      return 50;
    },
    /**
     * 获取报价系数：根据系列、DN、数量、是否磨标
     * 返回最终单价应乘的系数
     * 起订量阈值优先从价格表获取，系数从报价系数规则表获取
     */
    getPricingCoefficient: function getPricingCoefficient(seriesName, valveName, specSize, quantity, hasBranding) {
      if (!this.pricingRules || this.pricingRules.length === 0) {
        console.log('[index] 无报价系数规则');
        return 1.0;
      }
      var findRule = function (productName) {
        return this.pricingRules.find(function (r) {
          var match = r.seriesName === seriesName && (r.productName || '') === (productName || '') && specSize >= r.dnMin && specSize <= r.dnMax;
          if (match) {
            console.log('[index] 匹配规则:', r);
          }
          return match;
        });
      }.bind(this);
      var rule = findRule(valveName) || findRule('');
      if (!rule) {
        console.log('[index] 无匹配规则: seriesName=' + seriesName + ', valveName=' + valveName + ', specSize=' + specSize);
        return 1.0;
      }

      // 起订量阈值：优先从价格表获取该产品的具体配置，其次用规则表中的
      var minOrderQty = rule.minOrderQty;
      if (this.priceData && this.priceData.length > 0 && valveName) {
        var priceItem = this.priceData.find(function (p) {
          var pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
          return p.valveName === valveName && pSize === specSize;
        }, this);
        if (priceItem && priceItem.minOrderQty && priceItem.minOrderQty > 0) {
          minOrderQty = parseInt(priceItem.minOrderQty) || rule.minOrderQty;
        }
      }
      var moqMet = quantity >= minOrderQty;
      console.log('[index] 报价系数计算: quantity=' + quantity + ', minOrderQty=' + minOrderQty + ', moqMet=' + moqMet);
      if (moqMet && hasBranding) return rule.moqMetOemCoeff;
      if (moqMet && !hasBranding) return rule.moqMetOriginalCoeff;
      if (!moqMet && hasBranding) return rule.moqUnmetOemCoeff;
      if (!moqMet && !hasBranding) return rule.moqUnmetOriginalCoeff;
      return 1.0;
    },
    onSelectValveBody: function onSelectValveBody(e) {
      this.setData({
        SelectValveBody: this.valveBodyTypes[e.detail.value]
      });
      this.updateCurrentPrice();
    },
    onSelectValve: function onSelectValve(e) {
      this.setData({
        selectedValve: this.valveTypes[e.detail.value]
      });
      this.updateSpecifications();
      this.updateCurrentPrice();
    },
    onSelectSpec: function onSelectSpec(e) {
      this.setData({
        selectedSpec: this.specifications[e.detail.value]
      });
      var minQty = this.getMinOrderQuantity(this.selectedSpec.name);
      this.setData({
        quantity: minQty,
        currentMoq: minQty
      });
      if (this.selectedValve) {
        this.setMaterialStandard(this.selectedValve.name);
      }
      this.updateCurrentPrice();
    },
    onSelectGatePlate: function onSelectGatePlate(e) {
      this.setData({
        selectedGatePlate: this.gatePlateTypes[e.detail.value]
      });
      this.updateCurrentPrice();
    },
    onSelectRodMaterial: function onSelectRodMaterial(e) {
      this.setData({
        selectedRodMaterial: this.rodMaterials[e.detail.value]
      });
      this.updateCurrentPrice();
    },
    onSelectYokeMaterial: function onSelectYokeMaterial(e) {
      this.setData({
        selectedYokeMaterial: this.yokeMaterials[e.detail.value]
      });
      this.updateCurrentPrice();
    },
    onSelectProductType: function onSelectProductType(e) {
      this.setData({
        selectedProductType: this.productTypeOptions[e.detail.value]
      });
      this.updateCurrentPrice();
    },
    onSelectBranding: function onSelectBranding(value) {
      this.setData({
        selectedBranding: value
      });
      this.updateCurrentPrice();
    },
    onQuantityChange: function onQuantityChange(e) {
      var newQuantity = parseInt(e.detail.value) || 1;
      this.setData({
        quantity: newQuantity
      });
      this.updateCurrentPrice();
    },
    onPriceInput: function onPriceInput(e) {
      var newPrice = e.detail.value;
      this.setData({
        confirmedPrice: newPrice
      });
      var price = parseFloat(newPrice) || 0;
      this.setData({
        totalPreviewPrice: (price * this.quantity).toFixed(2)
      });
    },
    getMaterialPriceDiff: function getMaterialPriceDiff(seriesName, partName, baseMaterial, targetMaterial, dn) {
      var _this6 = this;
      if (!baseMaterial || !targetMaterial || baseMaterial === targetMaterial) return 0;
      var candidates = this.materialDiffs.filter(function (d) {
        return d.partName === partName && d.baseMaterial === baseMaterial && d.targetMaterial === targetMaterial;
      });
      if (candidates.length === 0) return 0;

      // 优先级匹配：精确(型号+尺寸) > 型号 > 系列 > 全局
      // 1. 精确匹配：series + model + size
      var matched = candidates.find(function (d) {
        var _this6$selectedValve;
        return d.seriesName === seriesName && d.modelName === ((_this6$selectedValve = _this6.selectedValve) === null || _this6$selectedValve === void 0 ? void 0 : _this6$selectedValve.name) && Number(d.size) === dn;
      });
      if (matched) return matched.priceDiff;

      // 2. 型号匹配：series + model
      matched = candidates.find(function (d) {
        var _this6$selectedValve2;
        return d.seriesName === seriesName && d.modelName === ((_this6$selectedValve2 = _this6.selectedValve) === null || _this6$selectedValve2 === void 0 ? void 0 : _this6$selectedValve2.name) && (!d.size || d.size === null);
      });
      if (matched) return matched.priceDiff;

      // 3. 系列匹配：series
      matched = candidates.find(function (d) {
        return d.seriesName === seriesName && (!d.modelName || d.modelName === '');
      });
      if (matched) return matched.priceDiff;

      // 4. 全局匹配
      matched = candidates.find(function (d) {
        return (!d.seriesName || d.seriesName === '') && (!d.modelName || d.modelName === '');
      });
      if (matched) return matched.priceDiff;
      return 0;
    },
    updateCurrentPrice: function updateCurrentPrice() {
      var _this$SelectValveBody;
      var selectedValve = this.selectedValve,
        selectedSpec = this.selectedSpec,
        selectedGatePlate = this.selectedGatePlate,
        selectedRodMaterial = this.selectedRodMaterial,
        selectedYokeMaterial = this.selectedYokeMaterial,
        selectedProductType = this.selectedProductType;
      if (!selectedValve || !selectedSpec || !selectedGatePlate || !selectedRodMaterial) {
        this.setData({
          currentPrice: '0.00'
        });
        return;
      }
      var specSizeStr = String(selectedSpec.name);
      var specSize = parseInt(specSizeStr.replace(/[^\d]/g, '')) || 0;
      var priceItem = this.priceData.find(function (p) {
        var pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
        return p.valveName === selectedValve.name && pSize === specSize;
      });
      if (!priceItem) {
        this.setData({
          currentPrice: '0.00'
        });
        return;
      }
      var material = this.getMaterialByValveName(selectedValve.name);
      var type = selectedValve.type;
      var basePrice = this.getPriceByType(priceItem, type);
      var seriesName = this.currentProductSeries;
      var bodyDiff = this.getMaterialPriceDiff(seriesName, 'body', (material === null || material === void 0 ? void 0 : material.bodyMaterial) || '', ((_this$SelectValveBody = this.SelectValveBody) === null || _this$SelectValveBody === void 0 ? void 0 : _this$SelectValveBody.name) || '', specSize);
      var gatePlateDiff = this.getMaterialPriceDiff(seriesName, 'gate_plate', (material === null || material === void 0 ? void 0 : material.gatePlateMaterial) || '', (selectedGatePlate === null || selectedGatePlate === void 0 ? void 0 : selectedGatePlate.name) || '', specSize);
      var rodDiff = this.getMaterialPriceDiff(seriesName, 'stem', (material === null || material === void 0 ? void 0 : material.stemMaterial) || '', (selectedRodMaterial === null || selectedRodMaterial === void 0 ? void 0 : selectedRodMaterial.name) || '', specSize);
      var yokeDiff = this.getMaterialPriceDiff(seriesName, 'yoke', (material === null || material === void 0 ? void 0 : material.yokeMaterial) || '', (selectedYokeMaterial === null || selectedYokeMaterial === void 0 ? void 0 : selectedYokeMaterial.name) || '', specSize);
      var multiplier = this.priceTable.productTypeMultiplier[selectedProductType];
      var hasBranding = this.selectedBranding;
      var brandingFee = hasBranding ? priceItem.brandingFee || 0 : 0;
      var pricingCoeff = this.getPricingCoefficient(seriesName, selectedValve.name, specSize, this.quantity, hasBranding);
      var baseTotal = basePrice + bodyDiff + gatePlateDiff + rodDiff + yokeDiff + brandingFee;
      var total = baseTotal * pricingCoeff * multiplier;
      this.setData({
        currentPrice: total.toFixed(2),
        confirmedPrice: total.toFixed(2),
        totalPreviewPrice: (total * this.quantity).toFixed(2)
      });
    },
    getBrandingFee: function getBrandingFee(size) {
      // 磨商标价格映射表
      var brandingFeeMap = {
        50: 25,
        65: 25,
        80: 25,
        100: 25,
        125: 25,
        150: 25,
        200: 30,
        250: 50,
        300: 60,
        350: 70,
        400: 80,
        450: 100,
        500: 150,
        600: 250,
        700: 450,
        800: 650,
        900: 900,
        1000: 1000
      };
      return brandingFeeMap[size] || 0;
    },
    updateSpecifications: function updateSpecifications() {
      var _this7 = this;
      // 根据选中的阀门型号，从已加载的价格数据中提取可用规格
      // 清除之前选的规格（不同型号的可用规格不同）
      this.selectedSpec = null;
      this.setData({
        currentMoq: 0
      });
      if (!this.selectedValve) {
        // 无选中型号时，显示当前系列下所有规格
        var allSizes = (0, _toConsumableArray2.default)(new Set(this.priceData.map(function (p) {
          return p.size;
        }))).sort(function (a, b) {
          return a - b;
        });
        this.specifications = allSizes.map(function (s) {
          return {
            name: s
          };
        });
        return;
      }
      var sizes = this.priceData.filter(function (p) {
        return p.valveName === _this7.selectedValve.name;
      }).map(function (p) {
        return p.size;
      }).sort(function (a, b) {
        return a - b;
      });
      var uniqueSizes = (0, _toConsumableArray2.default)(new Set(sizes));
      this.specifications = uniqueSizes.map(function (s) {
        return {
          name: s
        };
      });
      if (uniqueSizes.length === 0) {
        console.warn('该型号无可用规格: ' + this.selectedValve.name);
      }
    },
    getPriceByType: function getPriceByType(priceItem, type) {
      return priceItem.price || 0;
    },
    calculatePrice: function calculatePrice() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var _this8$SelectValveBod, _this8$SelectValveBod2;
        var selectedValve, selectedSpec, selectedGatePlate, selectedRodMaterial, selectedYokeMaterial, quantity, selectedProductType, specSizeStr, specSize, priceItem, material, type, basePrice, seriesName, bodyDiff, gatePlateDiff, rodDiff, yokeDiff, multiplier, minQty, isMeetMinOrder, hasBranding, brandingFee, pricingCoeff, baseTotal, calculatedUnitPrice, finalUnitPrice, totalPrice, maxPressure, unitWeight, laps, torque, specResult, spec;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                selectedValve = _this8.selectedValve, selectedSpec = _this8.selectedSpec, selectedGatePlate = _this8.selectedGatePlate, selectedRodMaterial = _this8.selectedRodMaterial, selectedYokeMaterial = _this8.selectedYokeMaterial, quantity = _this8.quantity, selectedProductType = _this8.selectedProductType;
                if (!(!selectedValve || !selectedSpec || !selectedGatePlate || !selectedRodMaterial)) {
                  _context4.next = 4;
                  break;
                }
                _this8.showToast(_this8.$t('index.fillCompleteInfo'), 'error');
                return _context4.abrupt("return", null);
              case 4:
                specSizeStr = String(selectedSpec.name);
                specSize = parseInt(specSizeStr.replace(/[^\d]/g, '')) || 0;
                priceItem = _this8.priceData.find(function (p) {
                  var pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
                  return p.valveName === selectedValve.name && pSize === specSize;
                });
                if (priceItem) {
                  _context4.next = 10;
                  break;
                }
                _this8.showToast(_this8.$t('index.comboNotAvailable'), 'error');
                return _context4.abrupt("return", null);
              case 10:
                material = _this8.getMaterialByValveName(selectedValve.name);
                type = selectedValve.type;
                basePrice = _this8.getPriceByType(priceItem, type);
                seriesName = _this8.currentProductSeries;
                bodyDiff = _this8.getMaterialPriceDiff(seriesName, 'body', (material === null || material === void 0 ? void 0 : material.bodyMaterial) || '', ((_this8$SelectValveBod = _this8.SelectValveBody) === null || _this8$SelectValveBod === void 0 ? void 0 : _this8$SelectValveBod.name) || '', specSize);
                gatePlateDiff = _this8.getMaterialPriceDiff(seriesName, 'gate_plate', (material === null || material === void 0 ? void 0 : material.gatePlateMaterial) || '', (selectedGatePlate === null || selectedGatePlate === void 0 ? void 0 : selectedGatePlate.name) || '', specSize);
                rodDiff = _this8.getMaterialPriceDiff(seriesName, 'stem', (material === null || material === void 0 ? void 0 : material.stemMaterial) || '', (selectedRodMaterial === null || selectedRodMaterial === void 0 ? void 0 : selectedRodMaterial.name) || '', specSize);
                yokeDiff = _this8.getMaterialPriceDiff(seriesName, 'yoke', (material === null || material === void 0 ? void 0 : material.yokeMaterial) || '', (selectedYokeMaterial === null || selectedYokeMaterial === void 0 ? void 0 : selectedYokeMaterial.name) || '', specSize);
                multiplier = _this8.priceTable.productTypeMultiplier[selectedProductType];
                minQty = _this8.getMinOrderQuantity(specSize);
                isMeetMinOrder = quantity >= minQty;
                hasBranding = _this8.selectedBranding;
                brandingFee = hasBranding ? priceItem.brandingFee || 0 : 0;
                pricingCoeff = _this8.getPricingCoefficient(seriesName, selectedValve.name, specSize, quantity, hasBranding);
                baseTotal = basePrice + bodyDiff + gatePlateDiff + rodDiff + yokeDiff + brandingFee;
                calculatedUnitPrice = baseTotal * pricingCoeff * multiplier;
                finalUnitPrice = _this8.allowPriceModification ? parseFloat(_this8.confirmedPrice) || calculatedUnitPrice : calculatedUnitPrice;
                totalPrice = finalUnitPrice * quantity;
                maxPressure = '', unitWeight = '', laps = '', torque = '';
                _context4.prev = 29;
                _context4.next = 32;
                return _cloudApi.priceApi.getModelSpecs(selectedValve.name, specSize);
              case 32:
                specResult = _context4.sent;
                if (specResult && specResult.data) {
                  spec = specResult.data;
                  maxPressure = spec.maxPressure || '';
                  unitWeight = spec.unitWeight || '';
                  laps = spec.laps || '';
                  torque = spec.torque || '';
                }
                _context4.next = 39;
                break;
              case 36:
                _context4.prev = 36;
                _context4.t0 = _context4["catch"](29);
                console.log('获取规格参数失败:', _context4.t0);
              case 39:
                return _context4.abrupt("return", {
                  valveName: selectedValve.name,
                  spec: selectedSpec.name,
                  brandingFee: brandingFee,
                  hasBranding: hasBranding,
                  bodyMaterial: ((_this8$SelectValveBod2 = _this8.SelectValveBody) === null || _this8$SelectValveBod2 === void 0 ? void 0 : _this8$SelectValveBod2.name) || '',
                  gatePlate: selectedGatePlate.name,
                  rodMaterial: selectedRodMaterial.name,
                  yokeMaterial: (selectedYokeMaterial === null || selectedYokeMaterial === void 0 ? void 0 : selectedYokeMaterial.name) || '',
                  productType: selectedProductType,
                  quantity: quantity,
                  unitPrice: finalUnitPrice.toFixed(2),
                  totalPrice: totalPrice.toFixed(2),
                  productSeries: seriesName,
                  isMeetMinOrder: isMeetMinOrder,
                  maxPressure: maxPressure,
                  unitWeight: unitWeight,
                  laps: laps,
                  torque: torque
                });
              case 40:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[29, 36]]);
      }))();
    },
    onBackToCategory: function onBackToCategory() {
      uni.navigateBack({
        delta: 1
      });
    },
    onAddToQuote: function onAddToQuote() {
      var _this9 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
        var item, newQuoteItems, newTotalPrice;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _this9.showLoading = true;
                _this9.loadingText = _this9.$t('index.calculating');
                _context5.next = 4;
                return _this9.calculatePrice();
              case 4:
                item = _context5.sent;
                _this9.showLoading = false;
                if (item) {
                  _context5.next = 8;
                  break;
                }
                return _context5.abrupt("return");
              case 8:
                newQuoteItems = [].concat((0, _toConsumableArray2.default)(_this9.quoteItems), [item]);
                newTotalPrice = _this9.calculateTotal(newQuoteItems);
                _this9.setData({
                  quoteItems: newQuoteItems,
                  totalPrice: newTotalPrice
                });
                uni.setStorageSync('quoteItems', newQuoteItems);
                _this9.showToast(_this9.$t('index.addSuccess'), 'success');
                _this9.resetSelection();
              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    calculateTotal: function calculateTotal(items) {
      var total = items.reduce(function (sum, item) {
        return sum + parseFloat(item.totalPrice);
      }, 0);
      return total.toFixed(2);
    },
    calculateTotalPrice: function calculateTotalPrice() {
      this.totalPrice = this.calculateTotal(this.quoteItems);
    },
    resetSelection: function resetSelection() {
      this.setData({
        selectedValve: null,
        selectedSpec: null,
        selectedGatePlate: null,
        selectedRodMaterial: null,
        selectedProductType: this.$t('index.regular'),
        selectedBranding: false,
        quantity: 50,
        currentMoq: 0,
        currentPrice: '0.00',
        confirmedPrice: '0.00',
        totalPreviewPrice: '0.00'
      });
    },
    onDeleteItem: function onDeleteItem(e) {
      var index = e.currentTarget.dataset.index;
      var newQuoteItems = this.quoteItems.filter(function (_, i) {
        return i !== index;
      });
      var newTotalPrice = this.calculateTotal(newQuoteItems);
      this.setData({
        quoteItems: newQuoteItems,
        totalPrice: newTotalPrice
      });
      uni.setStorageSync('quoteItems', newQuoteItems);
    },
    onGenerateQuotation: function onGenerateQuotation() {
      if (this.quoteItems.length === 0) {
        this.showToast(this.$t('index.addFirst'), 'error');
        return;
      }
      uni.navigateTo({
        url: '/pages/quotation/quotation?data=' + encodeURIComponent(JSON.stringify(this.quoteItems))
      });
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 70:
/*!****************************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/index/index.vue?vue&type=style&index=0&lang=css& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./index.vue?vue&type=style&index=0&lang=css& */ 71);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 71:
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/meonsaber/Desktop/famen_uniapp/pages/index/index.vue?vue&type=style&index=0&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[64,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map