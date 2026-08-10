(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["pages/quotation/quotation"],{

/***/ 72:
/*!**********************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/main.js?{"page":"pages%2Fquotation%2Fquotation"} ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(wx, createPage) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
__webpack_require__(/*! uni-pages */ 30);
var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 25));
var _quotation = _interopRequireDefault(__webpack_require__(/*! ./pages/quotation/quotation.vue */ 73));
// @ts-ignore
wx.__webpack_require_UNI_MP_PLUGIN__ = __webpack_require__;
createPage(_quotation.default);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/wx.js */ 1)["default"], __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["createPage"]))

/***/ }),

/***/ 73:
/*!***************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/quotation/quotation.vue ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./quotation.vue?vue&type=template&id=0f421540& */ 74);
/* harmony import */ var _quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./quotation.vue?vue&type=script&lang=js& */ 76);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./quotation.vue?vue&type=style&index=0&lang=css& */ 78);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ 36);

var renderjs





/* normalize component */

var component = Object(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
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

/***/ 74:
/*!**********************************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/quotation/quotation.vue?vue&type=template&id=0f421540& ***!
  \**********************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./quotation.vue?vue&type=template&id=0f421540& */ 75);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_17_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_template_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_template_id_0f421540___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ 75:
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--17-0!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/meonsaber/Desktop/famen_uniapp/pages/quotation/quotation.vue?vue&type=template&id=0f421540& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  var m0 = _vm.$t("quotation.title")
  var m1 = _vm.$t("quotation.companyName")
  var m2 = _vm.$t("quotation.companyNameEn")
  var m3 = _vm.$t("quotation.companyWebsite")
  var m4 = _vm.$t("quotation.companyEmail")
  var m5 = _vm.$t("quotation.companyAddress")
  var m6 = _vm.$t("quotation.companyPhone")
  var m7 = _vm.$t("quotation.title")
  var m8 = _vm.$t("quotation.customerName")
  var m9 = _vm.$t("quotation.customerPlaceholder")
  var m10 = _vm.$t("quotation.productName")
  var m11 = _vm.$t("quotation.modelSpec")
  var m12 = _vm.$t("quotation.gateMaterialCol")
  var m13 = _vm.$t("quotation.stemMaterialCol")
  var m14 = _vm.$t("quotation.quantityCol")
  var m15 = _vm.$t("quotation.unitPriceCol")
  var m16 = _vm.$t("quotation.brandingFeeCol")
  var m17 = _vm.$t("quotation.totalPriceCol")
  var l0 = _vm.__map(_vm.quoteData, function (item, index) {
    var $orig = _vm.__get_orig(item)
    var m18 = _vm.translateProductType(item.productType)
    return {
      $orig: $orig,
      m18: m18,
    }
  })
  var m19 = _vm.$t("quotation.selectedProducts")
  var m20 = _vm.$t("quotation.spec")
  var m21 = _vm.$t("quotation.productTypeCol")
  var m23 = _vm.$t("quotation.bodyMaterialCol")
  var m24 = _vm.$t("quotation.gateMaterialCol")
  var m25 = _vm.$t("quotation.stemMaterialCol")
  var m27 = _vm.$t("quotation.pieces")
  var m29 = _vm.$t("quotation.pieces")
  var l1 = _vm.__map(_vm.quoteData, function (item, index) {
    var $orig = _vm.__get_orig(item)
    var m22 = _vm.translateProductType(item.productType)
    var m26 = item.yokeMaterial ? _vm.$t("quotation.yokeMaterialCol") : null
    var m28 = item.hasBranding ? _vm.$t("quotation.pieces") : null
    return {
      $orig: $orig,
      m22: m22,
      m26: m26,
      m28: m28,
    }
  })
  var m30 = _vm.$t("quotation.totalAmount")
  var m31 = _vm.$t("quotation.finalPrice")
  var m32 = _vm.$t("quotation.finalPricePlaceholder")
  var m33 = _vm.$t("quotation.remark")
  var m34 = _vm.$t("quotation.remarkPlaceholder")
  var m35 = _vm.$t("quotation.paymentMethod")
  var m36 = _vm.$t("quotation.paymentMethodPlaceholder")
  var m37 = _vm.$t("quotation.packaging")
  var m38 = _vm.$t("quotation.packagingPlaceholder")
  var m39 = _vm.$t("quotation.quoter")
  var m40 = _vm.$t("quotation.quoterPlaceholder")
  var m41 = _vm.$t("quotation.contactPhone")
  var m42 = _vm.$t("quotation.contactPhonePlaceholder")
  var m43 = _vm.$t("quotation.validity")
  var m44 = _vm.$t("quotation.validityPlaceholder")
  var m45 = _vm.$t("quotation.quoteDate")
  var m46 = _vm.$t("quotation.generateAndSave")
  var m47 = _vm.$t("quotation.shareQuotation")
  var m48 = _vm.$t("quotation.backToAdd")
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
        l0: l0,
        m19: m19,
        m20: m20,
        m21: m21,
        m23: m23,
        m24: m24,
        m25: m25,
        m27: m27,
        m29: m29,
        l1: l1,
        m30: m30,
        m31: m31,
        m32: m32,
        m33: m33,
        m34: m34,
        m35: m35,
        m36: m36,
        m37: m37,
        m38: m38,
        m39: m39,
        m40: m40,
        m41: m41,
        m42: m42,
        m43: m43,
        m44: m44,
        m45: m45,
        m46: m46,
        m47: m47,
        m48: m48,
      },
    }
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ 76:
/*!****************************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/quotation/quotation.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/babel-loader/lib!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./quotation.vue?vue&type=script&lang=js& */ 77);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_babel_loader_lib_index_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_script_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 77:
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/script.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/meonsaber/Desktop/famen_uniapp/pages/quotation/quotation.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ 60));
var _cloudApi = __webpack_require__(/*! @/utils/cloud-api.js */ 61);
var _locale = _interopRequireDefault(__webpack_require__(/*! @/locale */ 49));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
var navigationBar = function navigationBar() {
  __webpack_require__.e(/*! require.ensure | components/navigation-bar/navigation-bar */ "components/navigation-bar/navigation-bar").then((function () {
    return resolve(__webpack_require__(/*! @/components/navigation-bar/navigation-bar */ 95));
  }).bind(null, __webpack_require__)).catch(__webpack_require__.oe);
};
/**
 * 报价单显示配置 + 字段定义（模块级常量，不放到 methods 里）
 * Vue/uni-app 只会把 methods 里的 Function 绑定到 vm，Object 类型会被忽略，
 * 因此这里作为模块级 const，methods 里的函数直接闭包引用即可。
 */
var _DEFAULT_DISPLAY_CONFIG = {
  tableFields: [{
    key: 'productType',
    visible: true
  }, {
    key: 'modelSpec',
    visible: true
  }, {
    key: 'gateMaterial',
    visible: true
  }, {
    key: 'stemMaterial',
    visible: true
  }, {
    key: 'quantity',
    visible: true
  }, {
    key: 'brandingFee',
    visible: true
  }, {
    key: 'unitPrice',
    visible: true
  }, {
    key: 'totalPrice',
    visible: true
  }],
  specFields: [{
    key: 'maxPressure',
    visible: true
  }, {
    key: 'unitWeight',
    visible: true
  }, {
    key: 'laps',
    visible: true
  }, {
    key: 'torque',
    visible: true
  }]
};
var _TABLE_FIELD_META = {
  productType: {
    i18nKey: 'quotation.productName',
    width: 110,
    required: true,
    forceVisible: false,
    valueFn: function valueFn(item, vm) {
      return vm.translateProductType(item.productType);
    }
  },
  modelSpec: {
    i18nKey: 'quotation.modelSpec',
    width: 120,
    required: true,
    forceVisible: true,
    valueFn: function valueFn(item) {
      // 兼容两种 productName 格式："QB" 或 "QB-DN80"，避免重复 DN
      var name = item.productName || '';
      var model = String(item.model || '');
      if (!model) return name;
      var dnSuffix = '-DN' + model;
      var dnInline = 'DN' + model;
      return name.includes(dnSuffix) || name.includes(dnInline) ? name : name + dnSuffix;
    }
  },
  gateMaterial: {
    i18nKey: 'quotation.gateMaterialCol',
    width: 100,
    required: false,
    forceVisible: false,
    valueFn: function valueFn(item) {
      return item.gateMaterial || '';
    }
  },
  stemMaterial: {
    i18nKey: 'quotation.stemMaterialCol',
    width: 100,
    required: false,
    forceVisible: false,
    valueFn: function valueFn(item) {
      return item.stemMaterial || '';
    }
  },
  quantity: {
    i18nKey: 'quotation.quantityCol',
    width: 65,
    required: true,
    forceVisible: true,
    valueFn: function valueFn(item) {
      return String(item.quantity);
    }
  },
  brandingFee: {
    i18nKey: 'quotation.brandingFeeCol',
    width: 80,
    required: false,
    forceVisible: false,
    valueFn: function valueFn(item) {
      return '¥' + (Number(item.brandingFee) || 0).toFixed(2);
    }
  },
  unitPrice: {
    i18nKey: 'quotation.unitPriceCol',
    width: 85,
    required: true,
    forceVisible: true,
    valueFn: function valueFn(item) {
      return '¥' + (Number(item.unitPrice) || 0).toFixed(2);
    }
  },
  totalPrice: {
    i18nKey: 'quotation.totalPriceCol',
    width: 95,
    required: true,
    forceVisible: true,
    valueFn: function valueFn(item) {
      return '¥' + (Number(item.totalPrice) || 0).toFixed(2);
    }
  }
};
var _SPEC_FIELD_META = {
  maxPressure: {
    i18nLabelKey: 'quotation.maxPressure',
    en: 'Max Pressure',
    unit: 'BAR',
    valueFn: function valueFn(item) {
      return item.maxPressure;
    }
  },
  unitWeight: {
    i18nLabelKey: 'quotation.unitWeight',
    en: 'Unit Weight',
    unitI18nKey: 'quotation.weightUnit',
    valueFn: function valueFn(item) {
      return item.unitWeight;
    }
  },
  laps: {
    i18nLabelKey: 'quotation.laps',
    en: 'Laps',
    unit: '',
    valueFn: function valueFn(item) {
      return item.laps;
    }
  },
  torque: {
    i18nLabelKey: 'quotation.torque',
    en: 'Torque',
    unitI18nKey: 'quotation.torqueUnit',
    valueFn: function valueFn(item) {
      return item.torque;
    }
  }
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
      note: '',
      paymentMethod: '',
      packaging: '',
      quoter: '',
      quoterPhone: '',
      validity: '',
      finalPrice: '',
      showLoading: false,
      loadingText: '',
      showToastDialog: false,
      toastText: '',
      toastType: 'success',
      // 报价单显示配置（从 system_settings 读取）
      _displayConfig: null,
      _displayConfigLoaded: false
    };
  },
  computed: {
    totalAmount: function totalAmount() {
      var total = this.quoteData.reduce(function (sum, item) {
        return sum + parseFloat(item.totalPrice || 0);
      }, 0);
      return total.toFixed(2);
    }
  },
  watch: {
    totalAmount: {
      immediate: true,
      handler: function handler(newVal) {
        if (!this.finalPrice) {
          this.finalPrice = newVal;
        }
      }
    }
  },
  created: function created() {
    var _this = this;
    this.initI18nDefaults();
    this._i18nUnsubscribe = this.$localeOn(function () {
      _this.initI18nDefaults();
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this._i18nUnsubscribe) {
      this._i18nUnsubscribe();
    }
  },
  onLoad: function onLoad(options) {
    var _this2 = this;
    if (options.data) {
      var quoteData = JSON.parse(decodeURIComponent(options.data));
      var formattedData = quoteData.map(function (item) {
        return {
          productType: _this2.translateProductType(item.productType || '常规品'),
          productName: item.productName || item.valveName,
          model: item.model || item.spec || '',
          bodyMaterial: item.bodyMaterial || 'WCB',
          gateMaterial: item.gatePlate,
          stemMaterial: item.rodMaterial,
          yokeMaterial: item.yokeMaterial || '',
          quantity: item.quantity || 1,
          unitPrice: String(item.unitPrice || '0'),
          totalPrice: String(item.totalPrice || '0'),
          brandingFee: item.brandingFee || 0,
          hasBranding: item.hasBranding || false,
          productSeries: item.productSeries || '',
          maxPressure: item.maxPressure || '',
          unitWeight: item.unitWeight || '',
          laps: item.laps || '',
          torque: item.torque || ''
        };
      });
      this.quoteData = formattedData;
      this.finalPrice = this.totalAmount;
    }
    this.currentDate = this.formatDate(new Date());
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: this.$t('quotation.shareTitle'),
      path: '/pages/quotation/quotation'
    };
  },
  methods: {
    initI18nDefaults: function initI18nDefaults() {
      this.paymentMethod = this.$t('quotation.defaultPayment');
      this.packaging = this.$t('quotation.defaultPackaging');
      this.quoter = this.$t('quotation.defaultQuoter');
      this.quoterPhone = this.$t('quotation.defaultQuoterPhone');
      this.validity = this.$t('quotation.defaultValidity');
      this.currentDate = this.formatDate(new Date());
    },
    /**
     * 带完整权限检查的保存图片到相册
     * 处理路径：getSetting -> 已授权直接保存 / 未授权 -> authorize -> 失败则 openSetting
     */
    saveImageWithPermission: function saveImageWithPermission(filePath) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var doSave = function doSave() {
          uni.saveImageToPhotosAlbum({
            filePath: filePath,
            success: function success() {
              that.showToast(that.$t('quotation.savedToAlbum'), 'success');
              resolve();
            },
            fail: function fail(err) {
              console.error('saveImageToPhotosAlbum fail:', err);
              // 仍然可能是权限问题，走引导流程
              that._handleSaveDenied(filePath, resolve, reject);
            }
          });
        };
        uni.getSetting({
          success: function success(res) {
            var authStatus = res.authSetting['scope.writePhotosAlbum'];
            if (authStatus === true) {
              // 已授权，直接保存
              doSave();
            } else if (authStatus === false) {
              // 用户曾拒绝授权，不会再弹窗 -> 引导去设置
              that._handleSaveDenied(filePath, resolve, reject);
            } else {
              // 首次询问：尝试请求授权
              uni.authorize({
                scope: 'scope.writePhotosAlbum',
                success: function success() {
                  return doSave();
                },
                fail: function fail() {
                  return that._handleSaveDenied(filePath, resolve, reject);
                }
              });
            }
          },
          fail: function fail() {
            // getSetting 失败，兜底直接尝试保存
            doSave();
          }
        });
      });
    },
    /**
     * 权限被拒后，弹窗提示并引导用户去设置页打开相册权限
     */
    _handleSaveDenied: function _handleSaveDenied(filePath, resolve, reject) {
      var that = this;
      uni.showModal({
        title: that.$t('quotation.needPermissionTitle'),
        content: that.$t('quotation.needAlbumPermissionDesc'),
        confirmText: that.$t('quotation.toOpenSettings'),
        cancelText: that.$t('quotation.cancel'),
        success: function success(modalRes) {
          if (modalRes.confirm) {
            uni.openSetting({
              success: function success(settingRes) {
                if (settingRes.authSetting['scope.writePhotosAlbum']) {
                  that.showToast(that.$t('quotation.permissionGranted'), 'success');
                  // 再次执行保存
                  setTimeout(function () {
                    uni.saveImageToPhotosAlbum({
                      filePath: filePath,
                      success: function success() {
                        that.showToast(that.$t('quotation.savedToAlbum'), 'success');
                        resolve && resolve();
                      },
                      fail: function fail(err) {
                        console.error('openSetting后保存仍失败:', err);
                        that.showToast(that.$t('quotation.needAlbumPermission'), 'error');
                        reject && reject(err);
                      }
                    });
                  }, 300);
                } else {
                  that.showToast(that.$t('quotation.needAlbumPermission'), 'error');
                  reject && reject(new Error('permission denied'));
                }
              },
              fail: function fail() {
                that.showToast(that.$t('quotation.needAlbumPermission'), 'error');
                reject && reject(new Error('openSetting fail'));
              }
            });
          } else {
            reject && reject(new Error('user cancelled'));
          }
        }
      });
    },
    translateProductType: function translateProductType(type) {
      if (!type) return this.$t('index.regular');
      var regular = this.$t('index.regular');
      var newProduct = this.$t('index.newProduct');
      if (type === regular || type === newProduct) {
        return type;
      }
      if (type === '常规品' || type === 'regular' || type === 'Regular') {
        return regular;
      }
      if (type === '新品' || type === 'new' || type === 'New') {
        return newProduct;
      }
      return type;
    },
    formatDate: function formatDate(date) {
      var format = this.$t('quotation.dateFormat');
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');
      return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
    },
    showToast: function showToast(text) {
      var _this3 = this;
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'success';
      this.showToastDialog = true;
      this.toastText = text;
      this.toastType = type;
      setTimeout(function () {
        _this3.showToastDialog = false;
      }, 2000);
    },
    ensureDisplayConfigLoaded: function ensureDisplayConfigLoaded(forceRefresh) {
      var _this4 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var CACHE_KEY, CACHE_MAX_MS, cached, res, raw, parsed, tableConfig;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                CACHE_KEY = 'quotation_display_config_cache';
                CACHE_MAX_MS = 10 * 60 * 1000; // 10 分钟
                if (!(!forceRefresh && _this4._displayConfigLoaded && _this4._displayConfig)) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return");
              case 4:
                if (forceRefresh) {
                  _context.next = 15;
                  break;
                }
                _context.prev = 5;
                cached = uni.getStorageSync(CACHE_KEY);
                if (!(cached && cached.value && Date.now() - cached.ts < CACHE_MAX_MS)) {
                  _context.next = 11;
                  break;
                }
                _this4._displayConfig = cached.value;
                _this4._displayConfigLoaded = true;
                return _context.abrupt("return");
              case 11:
                _context.next = 15;
                break;
              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](5);
              case 15:
                _context.prev = 15;
                _context.next = 18;
                return _cloudApi.priceApi.getSystemConfig(['quotation_display_config']);
              case 18:
                res = _context.sent;
                if (res && res.success && res.data) {
                  raw = res.data.quotation_display_config;
                  parsed = null;
                  if (raw) {
                    try {
                      parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    } catch (_) {}
                  }
                  if (parsed && parsed.tableFields && parsed.specFields) {
                    _this4._displayConfig = parsed;
                  } else {
                    _this4._displayConfig = JSON.parse(JSON.stringify(_DEFAULT_DISPLAY_CONFIG));
                  }
                } else {
                  _this4._displayConfig = JSON.parse(JSON.stringify(_DEFAULT_DISPLAY_CONFIG));
                }
                _context.next = 26;
                break;
              case 22:
                _context.prev = 22;
                _context.t1 = _context["catch"](15);
                console.warn('[ensureDisplayConfigLoaded] 读取失败，使用全显示默认:', _context.t1.message);
                _this4._displayConfig = JSON.parse(JSON.stringify(_DEFAULT_DISPLAY_CONFIG));
              case 26:
                // 强制必选字段可见
                tableConfig = _this4._displayConfig.tableFields || [];
                tableConfig.forEach(function (f) {
                  var meta = _TABLE_FIELD_META[f.key];
                  if (meta && meta.forceVisible) f.visible = true;
                });
                _this4._displayConfigLoaded = true;
                try {
                  uni.setStorageSync(CACHE_KEY, {
                    ts: Date.now(),
                    value: _this4._displayConfig
                  });
                } catch (_) {/* ignore */}
              case 30:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[5, 13], [15, 22]]);
      }))();
    },
    /**
     * 计算当前可见的列表列（按配置返回 {key,label,width,value} 数组）
     * 注意：无论配置如何，若最终返回空数组则强制返回最小必选集（modelSpec/quantity/unitPrice/totalPrice），
     *       防止表格被绘制成一条黑横线。
     */
    getVisibleTableCols: function getVisibleTableCols() {
      var _this5 = this;
      var cfg = this._displayConfig || _DEFAULT_DISPLAY_CONFIG;
      var visibleKeys = new Set((cfg.tableFields || []).filter(function (f) {
        return f.visible;
      }).map(function (f) {
        return f.key;
      }));
      // 按 META 固定顺序生成（保证导出稳定）
      var cols = [];
      Object.keys(_TABLE_FIELD_META).forEach(function (key) {
        var meta = _TABLE_FIELD_META[key];
        if (meta.forceVisible || visibleKeys.has(key)) {
          cols.push({
            key: key,
            label: _this5.$t(meta.i18nKey),
            width: meta.width,
            isTotalPrice: key === 'totalPrice',
            meta: meta
          });
        }
      });
      // 兜底：至少必须有四列必选，否则强制按 meta.forceVisible 默认加入，避免画空表格
      if (cols.length === 0) {
        Object.keys(_TABLE_FIELD_META).forEach(function (key) {
          var meta = _TABLE_FIELD_META[key];
          if (meta.forceVisible) {
            cols.push({
              key: key,
              label: _this5.$t(meta.i18nKey),
              width: meta.width,
              isTotalPrice: key === 'totalPrice',
              meta: meta
            });
          }
        });
      }
      return cols;
    },
    /**
     * 获取某条数据的可见规格参数数组（value 非空才返回）
     */
    getVisibleSpecs: function getVisibleSpecs(item) {
      var _this6 = this;
      var cfg = this._displayConfig || _DEFAULT_DISPLAY_CONFIG;
      var visibleKeys = new Set((cfg.specFields || []).filter(function (f) {
        return f.visible;
      }).map(function (f) {
        return f.key;
      }));
      var isEn = this.$locale && this.$locale() && this.$locale().locale === 'en-US' || this.$i18n && this.$i18n.locale === 'en-US';
      var specs = [];
      Object.keys(_SPEC_FIELD_META).forEach(function (key) {
        if (!visibleKeys.has(key)) return;
        var meta = _SPEC_FIELD_META[key];
        var v = meta.valueFn(item);
        if (v === undefined || v === null || v === '') return;
        var label = _this6.$t(meta.i18nLabelKey);
        var unit;
        if (meta.unitI18nKey) unit = _this6.$t(meta.unitI18nKey);else unit = meta.unit || '';
        var labelText = isEn ? "".concat(label, ": ").concat(v).concat(unit) : "".concat(label, "(").concat(meta.en, "): ").concat(v).concat(unit);
        specs.push({
          key: key,
          labelText: labelText
        });
      });
      return specs;
    },
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
    },
    onFinalPriceInput: function onFinalPriceInput(e) {
      this.finalPrice = e.detail.value;
    },
    onBack: function onBack() {
      uni.navigateBack();
    },
    saveQuotationToDatabase: function saveQuotationToDatabase() {
      var _this7 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var quotationData, result;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                quotationData = {
                  customerName: _this7.customerName,
                  note: _this7.note,
                  paymentMethod: _this7.paymentMethod,
                  packaging: _this7.packaging,
                  quoter: _this7.quoter,
                  quoterPhone: _this7.quoterPhone,
                  validity: _this7.validity,
                  finalPrice: parseFloat(_this7.finalPrice) || parseFloat(_this7.totalAmount) || 0,
                  items: _this7.quoteData.map(function (item) {
                    return {
                      valveName: item.productName,
                      spec: parseInt(item.model),
                      gatePlate: item.gateMaterial,
                      rodMaterial: item.stemMaterial,
                      quantity: item.quantity,
                      branding: item.brandingFee > 0,
                      productType: item.productType || 'regular',
                      finalUnitPrice: parseFloat(item.unitPrice) || 0
                    };
                  })
                };
                _context2.prev = 1;
                _context2.next = 4;
                return _cloudApi.quotationApi.create(quotationData);
              case 4:
                result = _context2.sent;
                console.log('报价数据保存成功:', result);
                _this7.showToast(_this7.$t('quotation.saveSuccess'), 'success');
                return _context2.abrupt("return", result);
              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](1);
                console.error('保存报价数据失败:', _context2.t0);
                _this7.showToast(_this7.$t('quotation.saveFail'), 'error');
                throw _context2.t0;
              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 10]]);
      }))();
    },
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
    generateQuotation: function generateQuotation() {
      var _this8 = this;
      return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
        var that, ctx, scale, width, y, logoPath;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _this8.showLoading = true;
                _this8.loadingText = _this8.$t('quotation.priceGenerating');
                that = _this8;
                _context4.prev = 3;
                _context4.next = 6;
                return _this8.saveQuotationToDatabase();
              case 6:
                _context4.next = 11;
                break;
              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](3);
                console.error('保存报价数据失败:', _context4.t0);
              case 11:
                _context4.prev = 11;
                _context4.next = 14;
                return _this8.ensureDisplayConfigLoaded();
              case 14:
                _context4.next = 19;
                break;
              case 16:
                _context4.prev = 16;
                _context4.t1 = _context4["catch"](11);
                console.warn('加载报价单显示配置失败，使用默认:', _context4.t1);
              case 19:
                ctx = uni.createCanvasContext('quotationCanvas', _this8);
                scale = 1;
                width = 750;
                y = 30 * scale;
                ctx.setFillStyle('#FFFFFF');
                ctx.fillRect(0, 0, width, 5000);
                ctx.setFillStyle('#0d1526');
                ctx.scale(scale, scale);
                logoPath = 'https://img.cdn1.vip/i/6968b913a8e9c_1768470803.png';
                uni.getImageInfo({
                  src: logoPath,
                  success: function success(logoRes) {
                    var logoWidth = 100;
                    var logoHeight = 100;
                    var logoX = 30;
                    var logoY = 30;
                    ctx.drawImage(logoRes.path, logoX, logoY, logoWidth, logoHeight);
                    var infoX = logoX + logoWidth + 24;
                    var infoY = logoY;
                    var companyName = _this8.$t('quotation.companyName');
                    var companyNameEn = _this8.$t('quotation.companyNameEn');
                    var companyInfo = [_this8.$t('quotation.companyWebsite'), _this8.$t('quotation.companyEmail'), _this8.$t('quotation.companyAddress'), _this8.$t('quotation.companyPhone')];
                    ctx.setFontSize(26);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(companyName, infoX, infoY + 26);
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#c8aa6e');
                    ctx.fillText(companyNameEn, infoX, infoY + 48);
                    infoY += 70;
                    ctx.setFontSize(13);
                    ctx.setFillStyle('#64748b');
                    companyInfo.forEach(function (line) {
                      ctx.fillText(line, infoX, infoY);
                      infoY += 20;
                    });
                    y = Math.max(logoY + logoHeight + 40, infoY + 20);
                    ctx.setStrokeStyle('#e2e8f0');
                    ctx.setLineWidth(1);
                    ctx.beginPath();
                    ctx.moveTo(30, y + 15);
                    ctx.lineTo(260, y + 15);
                    ctx.moveTo(490, y + 15);
                    ctx.lineTo(720, y + 15);
                    ctx.stroke();
                    ctx.setFontSize(24);
                    ctx.setFillStyle('#0d1526');
                    ctx.setTextAlign('center');
                    ctx.fillText(_this8.$t('quotation.title'), 375, y + 24);
                    ctx.setTextAlign('left');
                    y += 60 * scale;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#475569');
                    var quoterLabel = _this8.$t('quotation.quoter') + '：';
                    ctx.fillText(quoterLabel, 30, y);
                    var quoterLabelWidth = ctx.measureText(quoterLabel).width;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.quoter || _this8.$t('quotation.noSalePerson'), 30 + quoterLabelWidth + 8, y);
                    y += 35 * scale;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#475569');
                    var customerLabel = _this8.$t('quotation.customerName') + '：';
                    ctx.fillText(customerLabel, 30, y);
                    var customerLabelWidth = ctx.measureText(customerLabel).width;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.customerName || _this8.$t('quotation.noCustomer'), 30 + customerLabelWidth + 8, y);
                    y += 35 * scale;
                    var totalWidth = 690;
                    var startX = 30;

                    // === 使用系统设置中的可见列，替代硬编码 headers ===
                    var visibleCols = _this8.getVisibleTableCols();
                    var cellWidths = visibleCols.map(function (c) {
                      return c.width;
                    });
                    var headers = visibleCols.map(function (c) {
                      return c.label;
                    });
                    // 如果只有很少几列，让表格总宽度仍填满 totalWidth（居中+扩展）
                    var usedWidth = cellWidths.reduce(function (a, b) {
                      return a + b;
                    }, 0);
                    if (usedWidth < totalWidth && visibleCols.length > 0) {
                      var extraEach = Math.floor((totalWidth - usedWidth) / visibleCols.length);
                      for (var i = 0; i < visibleCols.length; i++) {
                        cellWidths[i] += extraEach;
                      }
                    }
                    ctx.setFillStyle('#0d1526');
                    ctx.fillRect(startX, y, totalWidth, 36);
                    ctx.setFillStyle('#FFFFFF');
                    ctx.setFontSize(13);
                    var x = startX + 8;
                    headers.forEach(function (h, i) {
                      var maxWidth = cellWidths[i] - 8;
                      var displayText = h;
                      var textWidth = ctx.measureText(h).width;
                      if (textWidth > maxWidth) {
                        var truncated = h;
                        while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 1) {
                          truncated = truncated.slice(0, -1);
                        }
                        displayText = truncated + '...';
                      }
                      ctx.fillText(displayText, x, y + 23);
                      x += cellWidths[i];
                    });
                    y += 36 * scale;
                    var rowHeight = 38;
                    var specRowHeight = 28;
                    var pricingInfoLabel = _this8.$t('quotation.pricingInfo');
                    // 提前测量 pricingInfoLabel 的宽度
                    var pricingInfoLabelWidth = ctx.measureText(pricingInfoLabel).width;
                    _this8.quoteData.forEach(function (item, idx) {
                      x = startX + 8;
                      var values = visibleCols.map(function (col) {
                        return col.meta.valueFn(item, _this8);
                      });
                      if (idx % 2 === 1) {
                        ctx.setFillStyle('#f8fafc');
                        ctx.fillRect(startX, y, totalWidth, rowHeight + specRowHeight);
                      }
                      values.forEach(function (val, i) {
                        if (visibleCols[i].isTotalPrice) ctx.setFillStyle('#dc2626');else ctx.setFillStyle('#1e293b');
                        var maxWidth = cellWidths[i] - 8;
                        var displayVal = val === undefined || val === null ? '' : String(val);
                        if (displayVal) {
                          var textWidth = ctx.measureText(displayVal).width;
                          if (textWidth > maxWidth) {
                            var truncated = displayVal;
                            while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 1) {
                              truncated = truncated.slice(0, -1);
                            }
                            displayVal = truncated + '...';
                          }
                        }
                        ctx.fillText(displayVal, x, y + 24);
                        x += cellWidths[i];
                      });
                      y += rowHeight * scale;

                      // 规格参数行
                      ctx.setFontSize(11);
                      ctx.setFillStyle('#64748b');
                      ctx.fillText(pricingInfoLabel, startX + 8, y + 18);
                      x = startX + 8 + pricingInfoLabelWidth + 12;
                      var specs = _this8.getVisibleSpecs(item);
                      var firstSpecX = x;
                      var anySpecPrinted = false;
                      specs.forEach(function (spec) {
                        var labelWidth = ctx.measureText(spec.labelText).width;
                        if (x + labelWidth <= startX + totalWidth - 10) {
                          ctx.setFillStyle('#475569');
                          ctx.fillText(spec.labelText, x, y + 18);
                          x += labelWidth + 15;
                          anySpecPrinted = true;
                        }
                      });
                      // 如果当前行没有规格显示，打印一个"—"占位提示
                      if (!anySpecPrinted) {
                        ctx.setFillStyle('#b0bac8');
                        ctx.fillText('—', firstSpecX, y + 18);
                      }
                      ctx.setStrokeStyle('#e2e8f0');
                      ctx.beginPath();
                      ctx.moveTo(startX, y + specRowHeight);
                      ctx.lineTo(startX + totalWidth, y + specRowHeight);
                      ctx.stroke();
                      y += specRowHeight * scale;
                      ctx.setFontSize(13);
                    });
                    y += 30 * scale;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.$t('quotation.remarkAndTech'), 30, y);
                    y += 24 * scale;
                    y = _this8.drawText(ctx, _this8.note, 30, y, 690, 22, 13) + 15;
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#475569');
                    var paymentLabel = _this8.$t('quotation.paymentMethod') + '：';
                    ctx.fillText(paymentLabel, 30, y);
                    var paymentLabelWidth = ctx.measureText(paymentLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.paymentMethod, 30 + paymentLabelWidth + 6, y);
                    y += 26 * scale;
                    ctx.setFillStyle('#475569');
                    var packagingLabel = _this8.$t('quotation.packaging') + '：';
                    ctx.fillText(packagingLabel, 30, y);
                    var packagingLabelWidth = ctx.measureText(packagingLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.packaging, 30 + packagingLabelWidth + 6, y);
                    y += 26 * scale;
                    ctx.setFillStyle('#475569');
                    var confirmLabel = _this8.$t('quotation.confirmAmount');
                    ctx.fillText(confirmLabel, 30, y);
                    var confirmLabelWidth = ctx.measureText(confirmLabel).width;
                    ctx.setFillStyle('#dc2626');
                    ctx.setFontSize(16);
                    ctx.fillText('¥' + (_this8.finalPrice || _this8.totalAmount), 30 + confirmLabelWidth + 8, y);
                    ctx.setFontSize(14);
                    y += 35 * scale;
                    ctx.setStrokeStyle('#e2e8f0');
                    ctx.beginPath();
                    ctx.moveTo(30, y);
                    ctx.lineTo(720, y);
                    ctx.stroke();
                    y += 25 * scale;
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#475569');
                    var signLabel = _this8.$t('quotation.quoterSign');
                    ctx.fillText(signLabel, 30, y);
                    var signLabelWidth = ctx.measureText(signLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.quoter, 30 + signLabelWidth + 6, y);
                    ctx.setFillStyle('#475569');
                    var phoneLabel = _this8.$t('quotation.quoterPhoneLabel');
                    ctx.fillText(phoneLabel, 400, y);
                    var phoneLabelWidth = ctx.measureText(phoneLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.quoterPhone, 400 + phoneLabelWidth + 6, y);
                    y += 26 * scale;
                    ctx.setFillStyle('#475569');
                    var validityLabel = _this8.$t('quotation.validityLabel');
                    ctx.fillText(validityLabel, 30, y);
                    var validityLabelWidth = ctx.measureText(validityLabel).width;
                    ctx.setFillStyle('#c8aa6e');
                    ctx.fillText(_this8.validity, 30 + validityLabelWidth + 6, y);
                    ctx.setFillStyle('#475569');
                    var dateLabel = _this8.$t('quotation.issueDate');
                    ctx.fillText(dateLabel, 400, y);
                    var dateLabelWidth = ctx.measureText(dateLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(_this8.currentDate, 400 + dateLabelWidth + 6, y);
                    y += 60 * scale;
                    ctx.draw(false, function () {
                      var finalHeight = Math.ceil(y);
                      uni.canvasToTempFilePath({
                        canvasId: 'quotationCanvas',
                        width: 750,
                        height: finalHeight,
                        destWidth: 1500,
                        destHeight: finalHeight * 2,
                        success: function () {
                          var _success = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(res) {
                            return _regenerator.default.wrap(function _callee3$(_context3) {
                              while (1) {
                                switch (_context3.prev = _context3.next) {
                                  case 0:
                                    _context3.next = 2;
                                    return that.saveImageWithPermission(res.tempFilePath);
                                  case 2:
                                  case "end":
                                    return _context3.stop();
                                }
                              }
                            }, _callee3);
                          }));
                          function success(_x) {
                            return _success.apply(this, arguments);
                          }
                          return success;
                        }(),
                        fail: function fail(err) {
                          console.error(err);
                          that.showToast(_this8.$t('quotation.renderFail'), 'error');
                        },
                        complete: function complete() {
                          _this8.showLoading = false;
                        }
                      });
                    });
                  },
                  fail: function fail(err) {
                    console.error(err);
                    that.showToast(_this8.$t('quotation.logoLoadFail'), 'error');
                    that.showLoading = false;
                  }
                });
              case 29:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[3, 8], [11, 16]]);
      }))();
    }
  }
};
exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"]))

/***/ }),

/***/ 78:
/*!************************************************************************************************************!*\
  !*** /Users/meonsaber/Desktop/famen_uniapp/pages/quotation/quotation.vue?vue&type=style&index=0&lang=css& ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/postcss-loader/src??ref--6-oneOf-1-3!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../../../../Applications/HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli/node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!./quotation.vue?vue&type=style&index=0&lang=css& */ 79);
/* harmony import */ var _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_6_oneOf_1_2_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_3_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_Applications_HBuilderX_app_Contents_HBuilderX_plugins_uniapp_cli_node_modules_dcloudio_webpack_uni_mp_loader_lib_style_js_quotation_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ 79:
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--6-oneOf-1-2!./node_modules/postcss-loader/src??ref--6-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/webpack-uni-mp-loader/lib/style.js!/Users/meonsaber/Desktop/famen_uniapp/pages/quotation/quotation.vue?vue&type=style&index=0&lang=css& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin
    if(false) { var cssReload; }
  

/***/ })

},[[72,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/quotation/quotation.js.map