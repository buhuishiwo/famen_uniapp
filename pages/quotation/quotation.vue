<template>
    <view class="page-root">
        <navigation-bar :title="$t('quotation.title')" :back="true" color="white"
            background="linear-gradient(135deg, #0d1526 0%, #1e293b 100%)"></navigation-bar>

        <language-switch></language-switch>

        <scroll-view class="scrollarea" scroll-y>
            <view class="container">
                
                <view class="company-header">
                    <view class="company-logo">
                        <text class="logo-text">{{ $t('quotation.companyName') }}</text>
                        <text class="logo-en">{{ $t('quotation.companyNameEn') }}</text>
                    </view>
                    <view class="company-info">
                        <text class="info-item">{{ $t('quotation.companyWebsite') }}</text>
                        <text class="info-item">{{ $t('quotation.companyEmail') }}</text>
                        <text class="info-item">{{ $t('quotation.companyAddress') }}</text>
                        <text class="info-item">{{ $t('quotation.companyPhone') }}</text>
                    </view>
                </view>

                <view class="quotation-title-wrap">
                    <view class="title-line"></view>
                    <text class="quotation-title">{{ $t('quotation.title') }}</text>
                    <view class="title-line"></view>
                </view>

                <view class="card">
                    <view class="info-row">
                        <text class="info-label">{{ $t('quotation.customerName') }}</text>
                        <input class="info-input" :placeholder="$t('quotation.customerPlaceholder')" placeholder-class="placeholder-style" @input="onCustomerNameInput"
                            :value="customerName" />
                    </view>
                </view>

                <view class="table-card">
                    <scroll-view scroll-x class="table-scroll">
                        <view class="table-wrap">
                            <view class="table-header">
                                <view class="header-cell cell-product">{{ $t('quotation.productName') }}</view>
                                <view class="header-cell cell-model">{{ $t('quotation.modelSpec') }}</view>
                                <view class="header-cell cell-material">{{ $t('quotation.gateMaterialCol') }}</view>
                                <view class="header-cell cell-seal">{{ $t('quotation.stemMaterialCol') }}</view>
                                <view class="header-cell cell-quantity">{{ $t('quotation.quantityCol') }}</view>
                                <view class="header-cell cell-price">{{ $t('quotation.unitPriceCol') }}</view>
                                <view class="header-cell cell-branding">{{ $t('quotation.brandingFeeCol') }}</view>
                                <view class="header-cell cell-total">{{ $t('quotation.totalPriceCol') }}</view>
                            </view>

                            <view class="table-body">
                                <view class="table-row" v-for="(item, index) in quoteData" :key="index" :class="{ 'row-odd': index % 2 === 1 }">
                                    <view class="table-cell cell-product">{{ translateProductType(item.productType) }}</view>
                                    <view class="table-cell cell-model">{{ item.productName + '-DN' + item.model }}</view>
                                    <view class="table-cell cell-material">{{ item.gateMaterial }}</view>
                                    <view class="table-cell cell-seal">{{ item.stemMaterial }}</view>
                                    <view class="table-cell cell-quantity">{{ item.quantity }}</view>
                                    <view class="table-cell cell-price">¥{{ item.unitPrice }}</view>
                                    <view class="table-cell cell-branding">¥{{ item.brandingFee }}</view>
                                    <view class="table-cell cell-total text-total-price">¥{{ item.totalPrice }}</view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>

                <!-- 选购产品信息预览 -->
                <view class="card preview-card">
                    <text class="card-inner-title">{{ $t('quotation.selectedProducts') }}</text>
                    <view class="preview-list">
                        <view class="preview-product" v-for="(item, index) in quoteData" :key="index">
                            <view class="preview-product-header">
                                <view class="product-index-badge">
                                    <text class="product-index-num">{{ index + 1 }}</text>
                                </view>
                                <text class="product-name">{{ item.productName }}</text>
                                <view class="product-series-tag" v-if="item.productSeries">
                                    <text>{{ item.productSeries }}</text>
                                </view>
                            </view>

                            <view class="preview-detail-grid">
                                <view class="detail-cell">
                                    <text class="detail-label">{{ $t('quotation.spec') }}</text>
                                    <text class="detail-value">DN{{ item.model }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">{{ $t('quotation.productTypeCol') }}</text>
                                    <text class="detail-value">{{ translateProductType(item.productType) }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">{{ $t('quotation.bodyMaterialCol') }}</text>
                                    <text class="detail-value">{{ item.bodyMaterial }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">{{ $t('quotation.gateMaterialCol') }}</text>
                                    <text class="detail-value">{{ item.gateMaterial }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">{{ $t('quotation.stemMaterialCol') }}</text>
                                    <text class="detail-value">{{ item.stemMaterial }}</text>
                                </view>
                                <view class="detail-cell" v-if="item.yokeMaterial">
                                    <text class="detail-label">{{ $t('quotation.yokeMaterialCol') }}</text>
                                    <text class="detail-value">{{ item.yokeMaterial }}</text>
                                </view>
                            </view>

                            <view class="preview-product-footer">
                                <view class="footer-left">
                                    <text class="footer-qty">× {{ item.quantity }}{{ $t('quotation.pieces') }}</text>
                                    <text class="footer-branding" v-if="item.hasBranding">磨标 ¥{{ item.brandingFee }}/{{ $t('quotation.pieces') }}</text>
                                </view>
                                <view class="footer-right">
                                    <text class="footer-unit">¥{{ item.unitPrice }}/{{ $t('quotation.pieces') }}</text>
                                    <text class="footer-total">¥{{ item.totalPrice }}</text>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="preview-summary-bar">
                        <text class="summary-label">{{ $t('quotation.totalAmount') }}</text>
                        <text class="summary-value">¥{{ totalAmount }}</text>
                    </view>
                    <view class="final-price-row">
                        <text class="final-price-label">{{ $t('quotation.finalPrice') }}</text>
                        <view class="final-price-input-wrap">
                            <text class="final-price-prefix">¥</text>
                            <input class="final-price-input" type="digit" :placeholder="$t('quotation.finalPricePlaceholder')" placeholder-class="placeholder-style"
                                :value="finalPrice" @input="onFinalPriceInput" />
                        </view>
                    </view>
                </view>

                <view class="card">
                    <text class="card-inner-title">{{ $t('quotation.remark') }}</text>
                    <view class="textarea-box">
                        <textarea class="note-input" :placeholder="$t('quotation.remarkPlaceholder')" placeholder-class="placeholder-style" :auto-height="true" @input="onNoteInput" :value="note" maxlength="-1" />
                    </view>
                </view>

                <view class="card">
                    <view class="info-row">
                        <text class="info-label">{{ $t('quotation.paymentMethod') }}</text>
                        <input class="info-input" :placeholder="$t('quotation.paymentMethodPlaceholder')" placeholder-class="placeholder-style" @input="onPaymentMethodInput"
                            :value="paymentMethod" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">{{ $t('quotation.packaging') }}</text>
                        <input class="info-input" :placeholder="$t('quotation.packagingPlaceholder')" placeholder-class="placeholder-style" @input="onPackagingInput" :value="packaging" />
                    </view>
                </view>

                <view class="card">
                    <view class="info-row">
                        <text class="info-label">{{ $t('quotation.quoter') }}</text>
                        <input class="info-input" :placeholder="$t('quotation.quoterPlaceholder')" placeholder-class="placeholder-style" @input="onQuoterInput"
                            :value="quoter" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">{{ $t('quotation.contactPhone') }}</text>
                        <input class="info-input" :placeholder="$t('quotation.contactPhonePlaceholder')" placeholder-class="placeholder-style" @input="onQuoterPhoneInput"
                            :value="quoterPhone" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">{{ $t('quotation.validity') }}</text>
                        <input class="info-input" :placeholder="$t('quotation.validityPlaceholder')" placeholder-class="placeholder-style" @input="onValidityInput"
                            :value="validity" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">{{ $t('quotation.quoteDate') }}</text>
                        <text class="info-value date-highlight">{{ currentDate }}</text>
                    </view>
                </view>

                <view class="button-group">
                    <button class="btn btn-primary" @tap="generateQuotation">{{ $t('quotation.generateAndSave') }}</button>
                    <button class="btn btn-contract" @tap="generateContract">{{ $t('quotation.generateContractExcel') }}</button>
                    <button class="btn btn-secondary" open-type="share">{{ $t('quotation.shareQuotation') }}</button>
                    <button class="btn btn-back" @tap="onBack">{{ $t('quotation.backToAdd') }}</button>
                </view>
            </view>
        </scroll-view>

        <canvas canvas-id="quotationCanvas"
            style="width: 5000rpx; height: 5000rpx; position: fixed; left: -9999rpx"></canvas>

        <view class="custom-loading-mask" v-if="showLoading">
            <view class="custom-loading-container">
                <view class="loading-spinner">
                    <view class="spinner-ring"></view>
                    <view class="spinner-ring spinner-ring-delay"></view>
                </view>
                <text class="loading-text">{{ loadingText }}</text>
            </view>
        </view>

        <view class="custom-toast-mask" v-if="showToastDialog">
            <view class="custom-toast-container" :class="toastType">
                <view class="toast-icon" v-if="toastType === 'success'">
                    <text class="icon-check">✓</text>
                </view>
                <view class="toast-icon toast-icon-error" v-else-if="toastType === 'error'">
                    <text class="icon-x">✕</text>
                </view>
                <text class="toast-text">{{ toastText }}</text>
            </view>
        </view>

        <!-- ===== 多模板合同选择弹窗 ===== -->
        <view class="tpl-picker-mask" v-if="showTemplatePicker" @tap="onTemplatePickerCancel">
            <view class="tpl-picker-sheet" @tap.stop>
                <view class="tpl-picker-header">
                    <text class="tpl-picker-title">{{ $t('quotation.templatePickerTitle') }}</text>
                    <text class="tpl-picker-desc">{{ $t('quotation.templatePickerDesc') }}</text>
                </view>

                <!-- 微信小程序中：普通 view + overflow:auto 比 <scroll-view> 在 flex 布局下更稳定，
                     不需要 scroll-top/下拉刷新时优先用 view，避免 0 高度的坑 -->
                <view class="tpl-picker-body">
                    <!-- 家族 1：中文购销合同 -->
                    <view class="tpl-family-group" v-if="_cnTemplates.length > 0">
                        <view class="tpl-family-tag">
                            <text class="tpl-family-tag-text">{{ $t('quotation.templateFamilyCn') }}</text>
                        </view>
                        <view class="tpl-list">
                            <view class="tpl-item"
                                  v-for="tpl in _cnTemplates"
                                  :key="tpl.key"
                                  :class="{ 'tpl-item-selected': selectedTemplateKey === tpl.key }"
                                  @tap="onSelectTemplate(tpl.key)">
                                <view class="tpl-item-radio">
                                    <view class="tpl-radio-outer">
                                        <view class="tpl-radio-inner" v-if="selectedTemplateKey === tpl.key"></view>
                                    </view>
                                </view>
                                <view class="tpl-item-body">
                                    <text class="tpl-item-name">{{ _tplDisplayNameMap[tpl.key] }}</text>
                                </view>
                                <view class="tpl-item-check" v-if="selectedTemplateKey === tpl.key">
                                    <text class="tpl-check-icon">✓</text>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 家族 2：英文 PI / 外贸发票 -->
                    <view class="tpl-family-group" v-if="_enTemplates.length > 0">
                        <view class="tpl-family-tag tpl-family-tag-en">
                            <text class="tpl-family-tag-text">{{ $t('quotation.templateFamilyEn') }}</text>
                        </view>
                        <view class="tpl-list">
                            <view class="tpl-item"
                                  v-for="tpl in _enTemplates"
                                  :key="tpl.key"
                                  :class="{ 'tpl-item-selected': selectedTemplateKey === tpl.key }"
                                  @tap="onSelectTemplate(tpl.key)">
                                <view class="tpl-item-radio">
                                    <view class="tpl-radio-outer">
                                        <view class="tpl-radio-inner" v-if="selectedTemplateKey === tpl.key"></view>
                                    </view>
                                </view>
                                <view class="tpl-item-body">
                                    <text class="tpl-item-name">{{ _tplDisplayNameMap[tpl.key] }}</text>
                                </view>
                                <view class="tpl-item-check" v-if="selectedTemplateKey === tpl.key">
                                    <text class="tpl-check-icon">✓</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="tpl-picker-footer">
                    <button class="tpl-btn tpl-btn-cancel" @tap="onTemplatePickerCancel">
                        {{ $t('quotation.templatePickerCancel') }}
                    </button>
                    <button class="tpl-btn tpl-btn-confirm" @tap="onTemplatePickerConfirm">
                        {{ $t('quotation.templatePickerConfirm') }}
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';
import { quotationApi, priceApi } from '@/utils/cloud-api.js';
import i18n from '@/locale';
// JSZip：操作 xlsx（ZIP）级，保证模板 styles/图片/边框/合并格 100% 原样保留，只改 sheet1.xml 数据
import JSZip from '@/utils/jszip.min.js';
// 多模板合同：严格分两条链路（性能隔离，避免 14MB setData 告警）
//   (A) TEMPLATE_META_DISPLAY —— 轻量元数据（0.8KB），安全进入 computed/template 渲染
//   (B) getTemplateRegistryForBuild() —— 仅在真正生成 Excel 时调用，返回含 bytes+meta 的完整数组
import { TEMPLATE_META_DISPLAY, getTemplateRegistryForBuild } from '@/utils/contract-templates.js';
// 合同构建器（JSZip + XML 文本替换，不改样式/边框）—— 多模板版：buildContract(JSZip, TEMPLATES_ARR, templateKey, items, opts)
import { buildContract, toChineseMoney as _toChineseMoney } from '@/utils/contract-xlsx-builder.js';

/**
 * 报价单显示配置 + 字段定义（模块级常量，不放到 methods 里）
 * Vue/uni-app 只会把 methods 里的 Function 绑定到 vm，Object 类型会被忽略，
 * 因此这里作为模块级 const，methods 里的函数直接闭包引用即可。
 */
const _DEFAULT_DISPLAY_CONFIG = {
    tableFields: [
        { key: 'productType',  visible: true },
        { key: 'modelSpec',    visible: true },
        { key: 'gateMaterial', visible: true },
        { key: 'stemMaterial', visible: true },
        { key: 'quantity',     visible: true },
        { key: 'brandingFee',  visible: true },
        { key: 'unitPrice',    visible: true },
        { key: 'totalPrice',   visible: true }
    ],
    specFields: [
        { key: 'maxPressure', visible: true },
        { key: 'unitWeight',  visible: true },
        { key: 'laps',        visible: true },
        { key: 'torque',      visible: true }
    ]
};

const _TABLE_FIELD_META = {
    productType:  { i18nKey: 'quotation.productName',    width: 110, required: true,  forceVisible: false,
        valueFn: (item, vm) => vm.translateProductType(item.productType) },
    modelSpec:    { i18nKey: 'quotation.modelSpec',      width: 120, required: true,  forceVisible: true,
        valueFn: (item) => {
            // 兼容两种 productName 格式："QB" 或 "QB-DN80"，避免重复 DN
            const name = item.productName || '';
            const model = String(item.model || '');
            if (!model) return name;
            const dnSuffix = '-DN' + model;
            const dnInline = 'DN' + model;
            return (name.includes(dnSuffix) || name.includes(dnInline)) ? name : name + dnSuffix;
        } },
    gateMaterial: { i18nKey: 'quotation.gateMaterialCol',width: 100, required: false, forceVisible: false,
        valueFn: (item) => item.gateMaterial || '' },
    stemMaterial: { i18nKey: 'quotation.stemMaterialCol',width: 100, required: false, forceVisible: false,
        valueFn: (item) => item.stemMaterial || '' },
    quantity:     { i18nKey: 'quotation.quantityCol',   width: 65,  required: true,  forceVisible: true,
        valueFn: (item) => String(item.quantity) },
    brandingFee:  { i18nKey: 'quotation.brandingFeeCol',width: 80,  required: false, forceVisible: false,
        valueFn: (item) => '¥' + (Number(item.brandingFee) || 0).toFixed(2) },
    unitPrice:    { i18nKey: 'quotation.unitPriceCol',  width: 85,  required: true,  forceVisible: true,
        valueFn: (item) => '¥' + (Number(item.unitPrice) || 0).toFixed(2) },
    totalPrice:   { i18nKey: 'quotation.totalPriceCol', width: 95,  required: true,  forceVisible: true,
        valueFn: (item) => '¥' + (Number(item.totalPrice) || 0).toFixed(2) }
};

const _SPEC_FIELD_META = {
    maxPressure: { i18nLabelKey: 'quotation.maxPressure', en: 'Max Pressure', unit: 'BAR',
        valueFn: (item) => item.maxPressure },
    unitWeight:  { i18nLabelKey: 'quotation.unitWeight',  en: 'Unit Weight',
        unitI18nKey: 'quotation.weightUnit', valueFn: (item) => item.unitWeight },
    laps:        { i18nLabelKey: 'quotation.laps',        en: 'Laps', unit: '',
        valueFn: (item) => item.laps },
    torque:      { i18nLabelKey: 'quotation.torque',      en: 'Torque',
        unitI18nKey: 'quotation.torqueUnit', valueFn: (item) => item.torque }
};

export default {
    components: {
        navigationBar
    },
    data() {
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
            _displayConfigLoaded: false,
            // ===== 多模板合同选择 =====
            // 模板选择弹窗显示状态
            showTemplatePicker: false,
            // 用户当前选中的模板 key（默认：奇胜标准合同）
            selectedTemplateKey: 'chisun_v1'
            // ❌ 注意：TEMPLATE_REGISTRY 含 6 份大 Uint8Array 模板字节（合计约 800KB）
            //   绝不能放在 data() 里！Vue2 会递归劫持整个 TypedArray，轻则性能爆炸、
            //   重则初始化失败，导致 _TPL_LIST 变空 / v-if 条件全不命中（表现为模板列表空白）。
            //   下面改放到 computed 里直接 return 常量（不做响应式）。
        };
    },
    computed: {
        totalAmount() {
            const total = this.quoteData.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
            return total.toFixed(2);
        },
        // ===== 多模板合同选择辅助 computed =====
        /**
         * 模板显示元数据：返回 TEMPLATE_META_DISPLAY（仅 key/family/displayName，约 0.8KB）
         *   【绝对不能包含 bytes/meta 字段】—— 否则会被序列化进 setData，触发 14MB+ 性能告警
         */
        _TPL_LIST() {
            return TEMPLATE_META_DISPLAY || [];
        },
        _cnTemplates() {
            return this._TPL_LIST.filter(t => t.family === 'cn_contract');
        },
        _enTemplates() {
            return this._TPL_LIST.filter(t => t.family === 'en_pi');
        },
        /** 按模板 registry displayName + locale 兜底组合后的显示名（取当前 locale） */
        _tplDisplayNameMap() {
            const isEn = (this.$locale && this.$locale() && this.$locale().locale === 'en-US') ||
                (this.$i18n && this.$i18n.locale === 'en-US');
            const localeKey = isEn ? 'en-US' : 'zh-CN';
            const map = {};
            (this._TPL_LIST || []).forEach(t => {
                let name = '';
                if (t.displayName && typeof t.displayName === 'object') {
                    name = t.displayName[localeKey] || t.displayName['zh-CN'] || t.key;
                } else {
                    name = String(t.displayName || t.key);
                }
                // 优先用 locale 文件里的文案（可由运营后续统一调整）
                try {
                    const i18nName = this.$t('quotation.template_' + t.key);
                    if (i18nName && !/^template_/.test(i18nName)) name = i18nName;
                } catch (_) {}
                map[t.key] = name;
            });
            return map;
        }
    },
    watch: {
        totalAmount: {
            immediate: true,
            handler(newVal) {
                if (!this.finalPrice) {
                    this.finalPrice = newVal;
                }
            }
        }
    },
    created() {
        this.initI18nDefaults();
        this._i18nUnsubscribe = this.$localeOn(() => {
            this.initI18nDefaults();
        });
    },
    beforeDestroy() {
        if (this._i18nUnsubscribe) {
            this._i18nUnsubscribe();
        }
    },
    onLoad(options) {
        if (options.data) {
            const quoteData = JSON.parse(decodeURIComponent(options.data));
            const formattedData = quoteData.map((item) => ({
                    productType: this.translateProductType(item.productType || '常规品'),
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
                }));
            this.quoteData = formattedData;
            this.finalPrice = this.totalAmount;
        }
        this.currentDate = this.formatDate(new Date());
    },
    onShareAppMessage() {
        return {
            title: this.$t('quotation.shareTitle'),
            path: '/pages/quotation/quotation'
        };
    },
    methods: {
        initI18nDefaults() {
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
        saveImageWithPermission(filePath) {
            const that = this;
            return new Promise((resolve, reject) => {
                const doSave = () => {
                    uni.saveImageToPhotosAlbum({
                        filePath: filePath,
                        success: () => {
                            that.showToast(that.$t('quotation.savedToAlbum'), 'success');
                            resolve();
                        },
                        fail: (err) => {
                            console.error('saveImageToPhotosAlbum fail:', err);
                            // 仍然可能是权限问题，走引导流程
                            that._handleSaveDenied(filePath, resolve, reject);
                        }
                    });
                };

                uni.getSetting({
                    success: (res) => {
                        const authStatus = res.authSetting['scope.writePhotosAlbum'];
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
                                success: () => doSave(),
                                fail: () => that._handleSaveDenied(filePath, resolve, reject)
                            });
                        }
                    },
                    fail: () => {
                        // getSetting 失败，兜底直接尝试保存
                        doSave();
                    }
                });
            });
        },
        /**
         * 权限被拒后，弹窗提示并引导用户去设置页打开相册权限
         */
        _handleSaveDenied(filePath, resolve, reject) {
            const that = this;
            uni.showModal({
                title: that.$t('quotation.needPermissionTitle'),
                content: that.$t('quotation.needAlbumPermissionDesc'),
                confirmText: that.$t('quotation.toOpenSettings'),
                cancelText: that.$t('quotation.cancel'),
                success: (modalRes) => {
                    if (modalRes.confirm) {
                        uni.openSetting({
                            success: (settingRes) => {
                                if (settingRes.authSetting['scope.writePhotosAlbum']) {
                                    that.showToast(that.$t('quotation.permissionGranted'), 'success');
                                    // 再次执行保存
                                    setTimeout(() => {
                                        uni.saveImageToPhotosAlbum({
                                            filePath: filePath,
                                            success: () => {
                                                that.showToast(that.$t('quotation.savedToAlbum'), 'success');
                                                resolve && resolve();
                                            },
                                            fail: (err) => {
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
                            fail: () => {
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
        translateProductType(type) {
            if (!type) return this.$t('index.regular');
            const regular = this.$t('index.regular');
            const newProduct = this.$t('index.newProduct');
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

        formatDate(date) {
            const format = this.$t('quotation.dateFormat');
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day);
        },

        showToast(text, type = 'success') {
            this.showToastDialog = true;
            this.toastText = text;
            this.toastType = type;
            setTimeout(() => {
                this.showToastDialog = false;
            }, 2000);
        },

        async ensureDisplayConfigLoaded(forceRefresh) {
            const CACHE_KEY = 'quotation_display_config_cache';
            const CACHE_MAX_MS = 10 * 60 * 1000; // 10 分钟

            if (!forceRefresh && this._displayConfigLoaded && this._displayConfig) return;

            // 尝试读缓存（减少每次生成都调云函数）
            if (!forceRefresh) {
                try {
                    const cached = uni.getStorageSync(CACHE_KEY);
                    if (cached && cached.value && Date.now() - cached.ts < CACHE_MAX_MS) {
                        this._displayConfig = cached.value;
                        this._displayConfigLoaded = true;
                        return;
                    }
                } catch (_) { /* ignore */ }
            }

            try {
                const res = await priceApi.getSystemConfig(['quotation_display_config']);
                if (res && res.success && res.data) {
                    const raw = res.data.quotation_display_config;
                    let parsed = null;
                    if (raw) {
                        try { parsed = (typeof raw === 'string') ? JSON.parse(raw) : raw; } catch (_) {}
                    }
                    if (parsed && parsed.tableFields && parsed.specFields) {
                        this._displayConfig = parsed;
                    } else {
                        this._displayConfig = JSON.parse(JSON.stringify(_DEFAULT_DISPLAY_CONFIG));
                    }
                } else {
                    this._displayConfig = JSON.parse(JSON.stringify(_DEFAULT_DISPLAY_CONFIG));
                }
            } catch (e) {
                console.warn('[ensureDisplayConfigLoaded] 读取失败，使用全显示默认:', e.message);
                this._displayConfig = JSON.parse(JSON.stringify(_DEFAULT_DISPLAY_CONFIG));
            }

            // 强制必选字段可见
            const tableConfig = this._displayConfig.tableFields || [];
            tableConfig.forEach(f => {
                const meta = _TABLE_FIELD_META[f.key];
                if (meta && meta.forceVisible) f.visible = true;
            });

            this._displayConfigLoaded = true;
            try {
                uni.setStorageSync(CACHE_KEY, { ts: Date.now(), value: this._displayConfig });
            } catch (_) { /* ignore */ }
        },

        /**
         * 计算当前可见的列表列（按配置返回 {key,label,width,value} 数组）
         * 注意：无论配置如何，若最终返回空数组则强制返回最小必选集（modelSpec/quantity/unitPrice/totalPrice），
         *       防止表格被绘制成一条黑横线。
         */
        getVisibleTableCols() {
            const cfg = this._displayConfig || _DEFAULT_DISPLAY_CONFIG;
            const visibleKeys = new Set(
                (cfg.tableFields || [])
                    .filter(f => f.visible)
                    .map(f => f.key)
            );
            // 按 META 固定顺序生成（保证导出稳定）
            const cols = [];
            Object.keys(_TABLE_FIELD_META).forEach(key => {
                const meta = _TABLE_FIELD_META[key];
                if (meta.forceVisible || visibleKeys.has(key)) {
                    cols.push({
                        key,
                        label: this.$t(meta.i18nKey),
                        width: meta.width,
                        isTotalPrice: key === 'totalPrice',
                        meta
                    });
                }
            });
            // 兜底：至少必须有四列必选，否则强制按 meta.forceVisible 默认加入，避免画空表格
            if (cols.length === 0) {
                Object.keys(_TABLE_FIELD_META).forEach(key => {
                    const meta = _TABLE_FIELD_META[key];
                    if (meta.forceVisible) {
                        cols.push({
                            key,
                            label: this.$t(meta.i18nKey),
                            width: meta.width,
                            isTotalPrice: key === 'totalPrice',
                            meta
                        });
                    }
                });
            }
            return cols;
        },

        /**
         * 获取某条数据的可见规格参数数组（value 非空才返回）
         */
        getVisibleSpecs(item) {
            const cfg = this._displayConfig || _DEFAULT_DISPLAY_CONFIG;
            const visibleKeys = new Set(
                (cfg.specFields || [])
                    .filter(f => f.visible)
                    .map(f => f.key)
            );
            const isEn = (this.$locale && this.$locale() && this.$locale().locale === 'en-US') ||
                (this.$i18n && this.$i18n.locale === 'en-US');
            const specs = [];
            Object.keys(_SPEC_FIELD_META).forEach(key => {
                if (!visibleKeys.has(key)) return;
                const meta = _SPEC_FIELD_META[key];
                const v = meta.valueFn(item);
                if (v === undefined || v === null || v === '') return;
                const label = this.$t(meta.i18nLabelKey);
                let unit;
                if (meta.unitI18nKey) unit = this.$t(meta.unitI18nKey);
                else unit = meta.unit || '';
                const labelText = isEn
                    ? `${label}: ${v}${unit}`
                    : `${label}(${meta.en}): ${v}${unit}`;
                specs.push({ key, labelText });
            });
            return specs;
        },

        onCustomerNameInput(e) { this.customerName = e.detail.value; },

        onNoteInput(e) { this.note = e.detail.value; },
        onPaymentMethodInput(e) { this.paymentMethod = e.detail.value; },
        onPackagingInput(e) { this.packaging = e.detail.value; },
        onQuoterInput(e) { this.quoter = e.detail.value; },
        onQuoterPhoneInput(e) { this.quoterPhone = e.detail.value; },
        onValidityInput(e) { this.validity = e.detail.value; },
        onFinalPriceInput(e) { this.finalPrice = e.detail.value; },

        onBack() {
            uni.navigateBack();
        },

        // ===== 多模板合同选择方法 =====
        onSelectTemplate(key) {
            this.selectedTemplateKey = key;
        },
        onTemplatePickerCancel() {
            this.showTemplatePicker = false;
        },
        onTemplatePickerConfirm() {
            // 用户确认模板后，关闭弹窗并开始生成
            const key = this.selectedTemplateKey || (this._TPL_LIST && this._TPL_LIST[0] && this._TPL_LIST[0].key);
            this.showTemplatePicker = false;
            this._doGenerateContract(key);
        },

        async saveQuotationToDatabase() {
            const quotationData = {
                customerName: this.customerName,
                note: this.note,
                paymentMethod: this.paymentMethod,
                packaging: this.packaging,
                quoter: this.quoter,
                quoterPhone: this.quoterPhone,
                validity: this.validity,
                finalPrice: parseFloat(this.finalPrice) || parseFloat(this.totalAmount) || 0,
                items: this.quoteData.map(item => ({
                    valveName: item.productName,
                    spec: parseInt(item.model),
                    gatePlate: item.gateMaterial,
                    rodMaterial: item.stemMaterial,
                    quantity: item.quantity,
                    branding: item.brandingFee > 0,
                    productType: item.productType || 'regular',
                    finalUnitPrice: parseFloat(item.unitPrice) || 0
                }))
            };

            try {
                const result = await quotationApi.create(quotationData);
                console.log('报价数据保存成功:', result);
                this.showToast(this.$t('quotation.saveSuccess'), 'success');
                return result;
            } catch (error) {
                console.error('保存报价数据失败:', error);
                this.showToast(this.$t('quotation.saveFail'), 'error');
                throw error;
            }
        },

        drawText(ctx, text, x, y, maxWidth, lineHeight, fontSize) {
            if (!text) return y;
            ctx.setFontSize(fontSize);
            const lines = [];
            let currentLine = '';
            for (const char of text) {
                const testLine = currentLine + char;
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && currentLine !== '') {
                    lines.push(currentLine);
                    currentLine = char;
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);
            lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
            return y + lines.length * lineHeight;
        },

        /**
         * 生成购销合同 xlsx 文档（多模板版入口）
         *  - 第一步：校验产品非空 → 弹出「选择合同模板」弹窗
         *  - 第二步：用户选择并确认后，调用 _doGenerateContract(templateKey) 按选定模板生成
         */
        generateContract() {
            const that = this;
            const items = Array.isArray(this.quoteData) ? this.quoteData : [];
            if (items.length === 0) {
                uni.showModal({
                    title: that.$t('quotation.contractGenerateFail'),
                    content: '请先添加产品再生成合同',
                    showCancel: false
                });
                return;
            }
            // ===== 打开模板选择弹窗 =====
            // 调试输出（可在微信开发者工具 Console 确认数据正常）
            // 注意：这里只能用 TEMPLATE_META_DISPLAY（不含 bytes），
            //   绝不能调用 getTemplateRegistryForBuild()，否则提前触发 6 个 Uint8Array 构造
            const DEBUG = true;
            if (DEBUG) {
                console.log('[TemplatePicker] TEMPLATE_META_DISPLAY 总数 =', (TEMPLATE_META_DISPLAY || []).length);
                console.log('[TemplatePicker] 模板 keys =', (TEMPLATE_META_DISPLAY || []).map(function(t){return t.key+'('+t.family+')'}).join(', '));
                const cn = (TEMPLATE_META_DISPLAY || []).filter(function(t){return t.family === 'cn_contract'});
                const en = (TEMPLATE_META_DISPLAY || []).filter(function(t){return t.family === 'en_pi'});
                console.log('[TemplatePicker] cn_contract 家族 =', cn.length, '个 | en_pi 家族 =', en.length, '个');
            }
            this.showTemplatePicker = true;
        },

        /**
         * 实际生成合同（调用多模板 buildContract）—— 由模板选择弹窗确认按钮触发
         * @param {string} templateKey 选中的模板 key，如 chisun_v1 / pi_chisun_multi 等
         */
        async _doGenerateContract(templateKey) {
            this.showLoading = true;
            this.loadingText = this.$t('quotation.contractGenerating');
            const that = this;
            const DEBUG = true;
            const log = (msg, val) => { if (DEBUG) console.log('[generateContract][' + templateKey + '] ' + msg, val === undefined ? '' : val); };
            try {
                const items = Array.isArray(this.quoteData) ? this.quoteData : [];
                log('步骤1 - 产品数量 N =', items.length);

                log('步骤2 - 调用多模板 buildContract (JSZip + XML 文本替换)  templateKey =', templateKey);
                // ===== 关键：仅此处调用 getTemplateRegistryForBuild()，获取含 bytes+meta 的完整注册表 =====
                //   返回的 BUILD_REGISTRY 是 method 内局部变量，完全不进入 Vue data/computed/template，
                //   因此不会触发任何 setData 序列化（性能隔离点）
                const BUILD_REGISTRY = getTemplateRegistryForBuild();
                log('步骤2.1 - getTemplateRegistryForBuild() 懒加载完成，模板数 =',
                    Array.isArray(BUILD_REGISTRY) ? BUILD_REGISTRY.length : 'FAIL');
                const outU8Raw = await buildContract(JSZip, BUILD_REGISTRY, templateKey, items, {
                    finalPrice: Number(that.finalPrice) || 0,
                    note: that.note || '',
                    items: items  // en_pi 家族 items 求和兜底
                });
                // 【类型安全】剥离包装 + 转干净 Uint8Array，后续转 ArrayBuffer 写文件
                const outU8 = new Uint8Array(
                    ArrayBuffer.isView(outU8Raw)
                        ? new Uint8Array(outU8Raw.buffer, outU8Raw.byteOffset, outU8Raw.byteLength)
                        : (Array.isArray(outU8Raw) ? outU8Raw : [])
                );
                log('步骤3 - buildContract 成功，输出字节数 =', outU8.length);
                // ZIP 魔数自检（50 4b 03 04 必须存在，否则 Excel 打开会是空白/损坏）
                const zip4Hex = outU8.length >= 4
                    ? [outU8[0],outU8[1],outU8[2],outU8[3]].map(function(b){return b.toString(16).padStart(2,'0')}).join(' ')
                    : 'EMPTY';
                log('步骤3.1 - ZIP 魔数前4字节 hex =', zip4Hex,
                    zip4Hex === '50 4b 03 04' ? '（✅ 合法 xlsx）' : '（❌ 损坏，Excel 会空白！）');

                // 文件名：区分家族（中文合同 vs PI），并带上模板短名
                //   从 BUILD_REGISTRY 里取 entry（也可以用 TEMPLATE_META_DISPLAY 取 family，两者一致）
                const displayEntry = (TEMPLATE_META_DISPLAY || []).find(function(t){return t.key === templateKey})
                                    || TEMPLATE_META_DISPLAY[0]
                                    || {};
                const isEnPI = (displayEntry.family === 'en_pi');
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const tplShort = (templateKey || 'tpl').replace(/[^a-zA-Z0-9_]/g, '_');
                const fname = isEnPI
                    ? `PI_${tplShort}_${yyyy}${mm}${dd}_${Date.now()}.xlsx`
                    : `购销合同_${tplShort}_${yyyy}${mm}${dd}_${Date.now()}.xlsx`;

                if (typeof wx !== 'undefined' && wx.getFileSystemManager) {
                    const fsm = wx.getFileSystemManager();
                    const targetPath = `${wx.env.USER_DATA_PATH}/${fname}`;
                    log('步骤4 - fsm.writeFile 写入 USER_DATA_PATH →', targetPath);
                    // 【关键修复】传纯 ArrayBuffer（不会被 Vue 代理），encoding 不传（仅字符串需要）
                    const rawBin = outU8.buffer.slice(outU8.byteOffset, outU8.byteOffset + outU8.byteLength);
                    log('  writeFile data instanceof ArrayBuffer?', rawBin instanceof ArrayBuffer, '  byteLength =', rawBin.byteLength);
                    const writeOnce = (binArg) => new Promise((resolve, reject) => {
                        fsm.writeFile({
                            filePath: targetPath,
                            data: binArg,
                            success: () => resolve(true),
                            fail: (err) => reject(err)
                        });
                    });
                    let writeOk = false;
                    try {
                        writeOk = await writeOnce(rawBin);
                    } catch (e1) {
                        console.warn('[fsm.writeFile] 方案1(ArrayBuffer)失败，降级方案2(Buffer.from):', e1 && e1.errMsg);
                        try {
                            const hasGlobalBuffer = (typeof Buffer !== 'undefined') && Buffer.from;
                            if (!hasGlobalBuffer) throw new Error('Buffer.from not available');
                            const bytesCopy = new Uint8Array(
                                rawBin instanceof ArrayBuffer ? rawBin : outU8.buffer.slice(outU8.byteOffset, outU8.byteOffset + outU8.byteLength)
                            );
                            const buf = Buffer.from(bytesCopy);
                            log('  Buffer.from 成功  buf.length =', buf.length, '  is Buffer?', (typeof Buffer !== 'undefined' && Buffer.isBuffer && Buffer.isBuffer(buf)));
                            writeOk = await writeOnce(buf);
                        } catch (e2) {
                            console.error('[fsm.writeFile] 方案2也失败:', e2);
                            throw e2;
                        }
                    }
                    log('步骤4 - writeFile 成功?', writeOk);

                    // === 诊断：xlsx(ZIP) 魔数前 4 字节 50 4B 03 04 ===
                    try {
                        const headerAB = await new Promise((resolve, reject) => {
                            fsm.readFile({
                                filePath: targetPath,
                                position: 0,
                                length: 4,
                                success: (res) => resolve(res.data),
                                fail: (err) => reject(err)
                            });
                        });
                        let hex = '';
                        const hv = new Uint8Array(headerAB instanceof ArrayBuffer ? headerAB : (headerAB && headerAB.buffer ? headerAB.buffer : headerAB));
                        for (let i = 0; i < Math.min(4, hv.length); i++) hex += ('0' + hv[i].toString(16)).slice(-2) + ' ';
                        log('✅ 自检：写入文件前 4 字节 hex = [' + hex.trim() + ']   (期望 50 4b 03 04 即 PK ZIP 魔数)');
                        if (hv.length < 4 || hv[0] !== 0x50 || hv[1] !== 0x4B || hv[2] !== 0x03 || hv[3] !== 0x04) {
                            console.error('[文件损坏] 写入文件不是合法 ZIP/xlsx！header = [' + hex.trim() + ']');
                        } else {
                            log('✅ 文件完整性检查通过：写入的 xlsx 是合法 ZIP 格式');
                            try {
                                const statRes = await new Promise((resolve) => {
                                    fsm.stat({
                                        path: targetPath,
                                        success: (r) => resolve(r),
                                        fail: () => resolve(null)
                                    });
                                });
                                if (statRes && statRes.stats) {
                                    log('  文件大小 stat.size =', statRes.stats.size, ' 期望 ~', outU8.length);
                                }
                            } catch (_) {}
                        }
                    } catch (h) {
                        console.warn('[header 自检] 读取失败（非致命）:', h && h.errMsg);
                    }

                    // --- 尝试 fsm.saveFile 持久化（尽力而为，permission denied 属于正常）---
                    let savedPath = targetPath;
                    let saveFileOk = false;
                    try {
                        if (fsm && typeof fsm.saveFile === 'function') {
                            log('步骤5 - 尝试 fsm.saveFile 持久化(尽力而为)...');
                            const sf = await new Promise((resolve) => {
                                fsm.saveFile({
                                    tempFilePath: targetPath,
                                    success: (res) => resolve({ ok: true, savedFilePath: res.savedFilePath }),
                                    fail: (err) => resolve({ ok: false, err })
                                });
                            });
                            if (sf.ok) {
                                savedPath = sf.savedFilePath;
                                saveFileOk = true;
                                log('  saveFile 持久化成功 savedFilePath =', savedPath);
                            } else {
                                log('  saveFile 未成功(预期内，继续用临时路径):', sf.err && sf.err.errMsg);
                            }
                        }
                    } catch (e) {
                        log('[fsm.saveFile] 持久化异常(预期内)，继续使用临时路径:', e && e.message);
                    }

                    that.showLoading = false;

                    // --- 弹出成功指引：打开预览 / 直接分享 ---
                    // 【重要！】confirmText / cancelText 不能超过 4 个汉字！
                    const tipDesc = that.$t('quotation.contractFileNameLabel')
                        + ': ' + fname + '\n\n'
                        + that.$t('quotation.contractExportedDesc');

                    log('步骤6 - uni.showModal 弹出生成成功框（用户选 打开预览 / 直接分享）');
                    uni.showModal({
                        title: that.$t('quotation.contractExported') + (saveFileOk ? ' ✓' : ''),
                        content: tipDesc,
                        confirmText: that.$t('quotation.contractOpenPreview'),
                        cancelText: that.$t('quotation.contractShareDirectly'),
                        confirmColor: '#0d1526',
                        cancelColor: '#475569',
                        success: (mres) => {
                            let finalized = false;
                            const finalize = () => { finalized = true; };

                            if (mres.confirm) {
                                log('用户点击确认 → uni.openDocument(filePath =', savedPath, ', fileType=xlsx, showMenu=true)');
                                uni.openDocument({
                                    filePath: savedPath,
                                    fileType: 'xlsx',
                                    showMenu: true,
                                    success: () => {
                                        log('✅ uni.openDocument success 回调 —— 已拉起微信内置文档预览/WPS');
                                        finalize();
                                    },
                                    fail: (err) => {
                                        if (finalized) return;
                                        finalize();
                                        console.error('❌ uni.openDocument fail:', err);
                                        try {
                                            wx.shareFileMessage({
                                                filePath: savedPath,
                                                fileName: fname,
                                                fail: (sfe) => {
                                                    console.error('❌ wx.shareFileMessage fail:', sfe);
                                                    that.showToast(that.$t('quotation.contractSaved'), 'success');
                                                },
                                                success: () => {
                                                    log('✅ wx.shareFileMessage success 回调（降级成功）');
                                                }
                                            });
                                        } catch (e) {
                                            console.error('wx.shareFileMessage exception:', e);
                                            that.showToast(that.$t('quotation.contractSaved'), 'success');
                                        }
                                    }
                                });
                            } else {
                                if (finalized) return;
                                finalize();
                                log('用户点击取消 → wx.shareFileMessage(filePath =', savedPath, ', fileName =', fname, ')');
                                try {
                                    wx.shareFileMessage({
                                        filePath: savedPath,
                                        fileName: fname,
                                        success: () => {
                                            log('✅ wx.shareFileMessage success 回调 —— 已弹出分享面板');
                                        },
                                        fail: (e2) => {
                                            console.error('❌ wx.shareFileMessage fail:', e2);
                                            console.warn('→ 降级到 uni.openDocument...');
                                            try {
                                                uni.openDocument({
                                                    filePath: savedPath,
                                                    fileType: 'xlsx',
                                                    showMenu: true,
                                                    success: () => {
                                                        log('✅ uni.openDocument success（降级成功）');
                                                    },
                                                    fail: (e3) => {
                                                        console.error('❌ uni.openDocument fail (降级也失败):', e3);
                                                        that.showToast(that.$t('quotation.contractSaved'), 'success');
                                                    }
                                                });
                                            } catch (e3) {
                                                console.error('uni.openDocument exception:', e3);
                                                that.showToast(that.$t('quotation.contractSaved'), 'success');
                                            }
                                        }
                                    });
                                } catch (e) {
                                    console.error('wx.shareFileMessage exception:', e);
                                    that.showToast(that.$t('quotation.contractSaved'), 'success');
                                }
                            }
                        },
                        fail: (merr) => {
                            console.error('uni.showModal fail:', merr);
                            that.showToast(that.$t('quotation.contractGenerated'), 'success');
                        }
                    });
                } else {
                    that.showLoading = false;
                    that.showToast(that.$t('quotation.contractGenerated'), 'success');
                }
            } catch (e) {
                console.error('[_doGenerateContract] 全链路异常:', e);
                that.showLoading = false;
                const errMsg = (e && (e.errMsg || e.message)) || String(e || '');
                uni.showModal({
                    title: that.$t('quotation.contractGenerateFail'),
                    content: '错误信息：' + errMsg + '\n\n请截图反馈给开发人员',
                    showCancel: false
                });
            }
        },

        async generateQuotation() {
            this.showLoading = true;
            this.loadingText = this.$t('quotation.priceGenerating');

            const that = this;

            try {
                await this.saveQuotationToDatabase();
            } catch (error) {
                console.error('保存报价数据失败:', error);
            }

            // 确保 display_config 已加载（云端失败则使用全显示默认）
            try {
                await this.ensureDisplayConfigLoaded();
            } catch (e) {
                console.warn('加载报价单显示配置失败，使用默认:', e);
            }

            const ctx = uni.createCanvasContext('quotationCanvas', this);
            const scale = 1;
            const width = 750;
            let y = 30 * scale;

            ctx.setFillStyle('#FFFFFF');
            ctx.fillRect(0, 0, width, 5000);
            ctx.setFillStyle('#0d1526');

            ctx.scale(scale, scale);
            const logoPath = 'https://img.cdn1.vip/i/6968b913a8e9c_1768470803.png';

            uni.getImageInfo({
                src: logoPath,
                success: (logoRes) => {
                    const logoWidth = 100;
                    const logoHeight = 100;
                    const logoX = 30;
                    const logoY = 30;

                    ctx.drawImage(logoRes.path, logoX, logoY, logoWidth, logoHeight);

                    const infoX = logoX + logoWidth + 24;
                    let infoY = logoY;

                    const companyName = this.$t('quotation.companyName');
                    const companyNameEn = this.$t('quotation.companyNameEn');
                    const companyInfo = [
                        this.$t('quotation.companyWebsite'),
                        this.$t('quotation.companyEmail'),
                        this.$t('quotation.companyAddress'),
                        this.$t('quotation.companyPhone')
                    ];

                    ctx.setFontSize(26);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(companyName, infoX, infoY + 26);
                    
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#c8aa6e');
                    ctx.fillText(companyNameEn, infoX, infoY + 48);

                    infoY += 70;
                    ctx.setFontSize(13);
                    ctx.setFillStyle('#64748b');

                    companyInfo.forEach(line => {
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
                    ctx.fillText(this.$t('quotation.title'), 375, y + 24);
                    ctx.setTextAlign('left');
                    y += 60 * scale;

                    ctx.setFontSize(15);
                    ctx.setFillStyle('#475569');
                    const quoterLabel = this.$t('quotation.quoter') + '：';
                    ctx.fillText(quoterLabel, 30, y);
                    const quoterLabelWidth = ctx.measureText(quoterLabel).width;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.quoter || this.$t('quotation.noSalePerson'), 30 + quoterLabelWidth + 8, y);
                    y += 35 * scale;

                    ctx.setFontSize(15);
                    ctx.setFillStyle('#475569');
                    const customerLabel = this.$t('quotation.customerName') + '：';
                    ctx.fillText(customerLabel, 30, y);
                    const customerLabelWidth = ctx.measureText(customerLabel).width;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.customerName || this.$t('quotation.noCustomer'), 30 + customerLabelWidth + 8, y);
                    y += 35 * scale;

                    const totalWidth = 690;
                    const startX = 30;

                    // === 使用系统设置中的可见列，替代硬编码 headers ===
                    const visibleCols = this.getVisibleTableCols();
                    const cellWidths = visibleCols.map(c => c.width);
                    const headers  = visibleCols.map(c => c.label);
                    // 如果只有很少几列，让表格总宽度仍填满 totalWidth（居中+扩展）
                    const usedWidth = cellWidths.reduce((a, b) => a + b, 0);
                    if (usedWidth < totalWidth && visibleCols.length > 0) {
                        const extraEach = Math.floor((totalWidth - usedWidth) / visibleCols.length);
                        for (let i = 0; i < visibleCols.length; i++) {
                            cellWidths[i] += extraEach;
                        }
                    }

                    ctx.setFillStyle('#0d1526');
                    ctx.fillRect(startX, y, totalWidth, 36);
                    ctx.setFillStyle('#FFFFFF');
                    ctx.setFontSize(13);

                    let x = startX + 8;
                    headers.forEach((h, i) => {
                        const maxWidth = cellWidths[i] - 8;
                        let displayText = h;
                        const textWidth = ctx.measureText(h).width;
                        if (textWidth > maxWidth) {
                            let truncated = h;
                            while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 1) {
                                truncated = truncated.slice(0, -1);
                            }
                            displayText = truncated + '...';
                        }
                        ctx.fillText(displayText, x, y + 23);
                        x += cellWidths[i];
                    });
                    y += 36 * scale;

                    const rowHeight = 38;
                    const specRowHeight = 28;
                    const pricingInfoLabel = this.$t('quotation.pricingInfo');
                    // 提前测量 pricingInfoLabel 的宽度
                    const pricingInfoLabelWidth = ctx.measureText(pricingInfoLabel).width;

                    this.quoteData.forEach((item, idx) => {
                        x = startX + 8;
                        const values = visibleCols.map(col => col.meta.valueFn(item, this));

                        if (idx % 2 === 1) {
                            ctx.setFillStyle('#f8fafc');
                            ctx.fillRect(startX, y, totalWidth, rowHeight + specRowHeight);
                        }

                        values.forEach((val, i) => {
                            if (visibleCols[i].isTotalPrice) ctx.setFillStyle('#dc2626');
                            else ctx.setFillStyle('#1e293b');
                            const maxWidth = cellWidths[i] - 8;
                            let displayVal = (val === undefined || val === null) ? '' : String(val);
                            if (displayVal) {
                                const textWidth = ctx.measureText(displayVal).width;
                                if (textWidth > maxWidth) {
                                    let truncated = displayVal;
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
                        const specs = this.getVisibleSpecs(item);
                        const firstSpecX = x;
                        let anySpecPrinted = false;
                        specs.forEach((spec) => {
                            const labelWidth = ctx.measureText(spec.labelText).width;
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
                    ctx.fillText(this.$t('quotation.remarkAndTech'), 30, y);
                    y += 24 * scale;
                    y = this.drawText(ctx, this.note, 30, y, 690, 22, 13) + 15;

                    ctx.setFontSize(14);
                    ctx.setFillStyle('#475569');
                    const paymentLabel = this.$t('quotation.paymentMethod') + '：';
                    ctx.fillText(paymentLabel, 30, y);
                    const paymentLabelWidth = ctx.measureText(paymentLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.paymentMethod, 30 + paymentLabelWidth + 6, y);
                    y += 26 * scale;

                    ctx.setFillStyle('#475569');
                    const packagingLabel = this.$t('quotation.packaging') + '：';
                    ctx.fillText(packagingLabel, 30, y);
                    const packagingLabelWidth = ctx.measureText(packagingLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.packaging, 30 + packagingLabelWidth + 6, y);
                    y += 26 * scale;

                    ctx.setFillStyle('#475569');
                    const confirmLabel = this.$t('quotation.confirmAmount');
                    ctx.fillText(confirmLabel, 30, y);
                    const confirmLabelWidth = ctx.measureText(confirmLabel).width;
                    ctx.setFillStyle('#dc2626');
                    ctx.setFontSize(16);
                    ctx.fillText('¥' + (this.finalPrice || this.totalAmount), 30 + confirmLabelWidth + 8, y);
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
                    const signLabel = this.$t('quotation.quoterSign');
                    ctx.fillText(signLabel, 30, y);
                    const signLabelWidth = ctx.measureText(signLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.quoter, 30 + signLabelWidth + 6, y);

                    ctx.setFillStyle('#475569');
                    const phoneLabel = this.$t('quotation.quoterPhoneLabel');
                    ctx.fillText(phoneLabel, 400, y);
                    const phoneLabelWidth = ctx.measureText(phoneLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.quoterPhone, 400 + phoneLabelWidth + 6, y);
                    y += 26 * scale;

                    ctx.setFillStyle('#475569');
                    const validityLabel = this.$t('quotation.validityLabel');
                    ctx.fillText(validityLabel, 30, y);
                    const validityLabelWidth = ctx.measureText(validityLabel).width;
                    ctx.setFillStyle('#c8aa6e');
                    ctx.fillText(this.validity, 30 + validityLabelWidth + 6, y);

                    ctx.setFillStyle('#475569');
                    const dateLabel = this.$t('quotation.issueDate');
                    ctx.fillText(dateLabel, 400, y);
                    const dateLabelWidth = ctx.measureText(dateLabel).width;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.currentDate, 400 + dateLabelWidth + 6, y);
                    y += 60 * scale;

                    ctx.draw(false, () => {
                        const finalHeight = Math.ceil(y);
                        uni.canvasToTempFilePath({
                            canvasId: 'quotationCanvas',
                            width: 750,
                            height: finalHeight,
                            destWidth: 1500,
                            destHeight: finalHeight * 2,
                            success: async (res) => {
                                await that.saveImageWithPermission(res.tempFilePath);
                            },
                            fail: (err) => {
                                console.error(err);
                                that.showToast(this.$t('quotation.renderFail'), 'error');
                            },
                            complete: () => {
                                this.showLoading = false;
                            }
                        });
                    });
                },
                fail: (err) => {
                    console.error(err);
                    that.showToast(this.$t('quotation.logoLoadFail'), 'error');
                    that.showLoading = false;
                }
            });
        }
    }
};
</script>

<style>
/* 根页面样式 */
page {
    background-color: #f1f5f9;
    height: 100vh;
}

.page-root {
    background-color: #f1f5f9;
    min-height: 100vh;
}

.scrollarea {
    height: calc(100vh - 88rpx);
}

.container {
    padding: 24rpx;
    box-sizing: border-box;
}

/* 高端企业头部卡片 */
.company-header {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 36rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(13, 21, 38, 0.04);
    border: 1rpx solid #e2e8f0;
}

.company-logo {
    margin-bottom: 24rpx;
}

.logo-text {
    font-size: 40rpx;
    font-weight: 800;
    color: #0d1526;
    letter-spacing: 2rpx;
    display: block;
}

.logo-en {
    font-size: 18rpx;
    color: #94a3b8;
    font-weight: 600;
    letter-spacing: 4rpx;
    margin-top: 4rpx;
    display: block;
}

.company-info {
    border-top: 1rpx solid #f1f5f9;
    padding-top: 20rpx;
}

.info-item {
    font-size: 24rpx;
    color: #475569;
    display: block;
    margin-bottom: 12rpx;
    line-height: 1.4;
}

.info-item:last-child {
    margin-bottom: 0;
}

/* 工业级横幅标题 */
.quotation-title-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20rpx 0 30rpx;
}

.title-line {
    width: 120rpx;
    height: 2rpx;
    background: linear-gradient(to right, transparent, #c8aa6e);
}

.title-line:last-child {
    background: linear-gradient(to left, transparent, #c8aa6e);
}

.quotation-title {
    font-size: 38rpx;
    font-weight: 800;
    color: #0d1526;
    letter-spacing: 12rpx;
    padding: 0 30rpx;
}

/* 模块标准块级卡片布局 */
.card {
    display: block;
    width: 100%;
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 28rpx 30rpx;
    margin-bottom: 24rpx;
    border: 1rpx solid #e2e8f0;
    box-shadow: 0 4rpx 16rpx rgba(13, 21, 38, 0.03);
    box-sizing: border-box;
}

.card-inner-title {
    font-size: 28rpx;
    font-weight: 700;
    color: #0d1526;
    margin-bottom: 20rpx;
    display: block;
    position: relative;
    padding-left: 16rpx;
}

.card-inner-title::before {
    content: "";
    position: absolute;
    left: 0;
    top: 6rpx;
    width: 6rpx;
    height: 26rpx;
    background-color: #c8aa6e;
    border-radius: 4rpx;
}

/* 通用名值对对齐排版 */
.info-row {
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}

.info-label {
    font-size: 26rpx;
    color: #475569;
    font-weight: 700;
    width: 130rpx;
    flex-shrink: 0;
}

.info-value {
    font-size: 28rpx;
    color: #0d1526;
    font-weight: 600;
}

.date-highlight {
    color: #0d1526;
}

/* 深度优化：输入控件底层框架 */
.info-input {
    flex: 1;
    width: 100%;
    
    height: 84rpx;
    line-height: 84rpx;

    font-size: 28rpx;
    color: #0d1526;

    padding: 0 24rpx;

    border: 1rpx solid #cbd5e1;
    border-radius: 12rpx;

    background-color: #f8fafc;

    box-sizing: border-box;
}

.placeholder-style {
    color: #94a3b8;
    font-size: 26rpx;
    line-height: 84rpx;
}

.picker-input {
    flex: 1;
    width: 100%;
    height: 84rpx;
    line-height: 84rpx;
    font-size: 28rpx;
    color: #0d1526;
    padding: 0 24rpx;
    border: 1rpx solid #cbd5e1;
    border-radius: 12rpx;
    background-color: #f8fafc;
    box-sizing: border-box;
}

/* 核心修复：多行备注流体容器隔离区 */
.textarea-box {
    display: block;
    width: 100%;
    border: 1rpx solid #cbd5e1;
    border-radius: 12rpx;
    background-color: #f8fafc;
    padding: 20rpx 24rpx;
    box-sizing: border-box;
}

.note-input {
    display: block;
    font-size: 26rpx;
    color: #0d1526;
    width: 100% !important;
    min-height: 160rpx;
    line-height: 1.6;
    box-sizing: border-box;
}

/* 组内元素横置细分线 */
.divider-line {
    height: 1rpx;
    background-color: #f1f5f9;
    margin: 24rpx 0;
    width: 100%;
}

/* 工业数据网格卡片 */
.table-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
    border: 1rpx solid #e2e8f0;
    box-shadow: 0 4rpx 16rpx rgba(13, 21, 38, 0.03);
}

.table-scroll {
    width: 100%;
}

.table-wrap {
    min-width: 890rpx;
}

.table-header {
    display: flex;
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    padding: 24rpx 0;
}

.header-cell {
    font-size: 24rpx;
    color: #ffffff;
    text-align: center;
    font-weight: 700;
    flex-shrink: 0;
    border-right: 1rpx solid rgba(255, 255, 255, 0.1);
    box-sizing: border-box;
}

.header-cell:last-child {
    border-right: none;
}

/* 数据矩阵网格核心尺寸 */
.cell-product { width: 140rpx; }
.cell-model { width: 180rpx; }
.cell-material { width: 90rpx; }
.cell-seal { width: 90rpx; }
.cell-quantity { width: 70rpx; }
.cell-price { width: 100rpx; }
.cell-branding { width: 100rpx; color: #c8aa6e; }
.cell-total { width: 120rpx; }

.table-body {
    width: 100%;
}

.table-row {
    display: flex;
    padding: 22rpx 0;
    border-bottom: 1rpx solid #e2e8f0;
    background-color: #ffffff;
    align-items: center;
}

.table-row:last-child {
    border-bottom: none;
}

.row-odd {
    background-color: #f8fafc;
}

.table-cell {
    font-size: 24rpx;
    color: #334155;
    text-align: center;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-right: 1rpx solid #f1f5f9;
}

.table-cell:last-child {
    border-right: none;
}

.text-total-price {
    color: #dc2626;
    font-weight: 700;
}

/* ---- 选购产品信息预览 ---- */
.preview-card {
    padding-bottom: 0;
}

.preview-list {
    margin: 0 -30rpx;
}

.preview-product {
    padding: 24rpx 30rpx;
    border-bottom: 1rpx solid #f1f5f9;
    background-color: #ffffff;
}

.preview-product:last-child {
    border-bottom: none;
}

.preview-product-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 20rpx;
}

.product-index-badge {
    width: 40rpx;
    height: 40rpx;
    border-radius: 8rpx;
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.product-index-num {
    font-size: 22rpx;
    font-weight: 700;
    color: #c8aa6e;
}

.product-name {
    flex: 1;
    font-size: 28rpx;
    font-weight: 700;
    color: #0d1526;
    line-height: 1.3;
}

.product-series-tag {
    padding: 4rpx 16rpx;
    background-color: #f0f6ff;
    border-radius: 6rpx;
    border: 1rpx solid #c5d8f5;
    flex-shrink: 0;
}

.product-series-tag text {
    font-size: 20rpx;
    color: #1a6ec7;
    font-weight: 600;
}

.preview-detail-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    margin-bottom: 20rpx;
    background-color: #f8fafc;
    border-radius: 12rpx;
    border: 1rpx solid #edf1f8;
    overflow: hidden;
}

.detail-cell {
    width: 33.33%;
    padding: 16rpx 20rpx;
    box-sizing: border-box;
    border-right: 1rpx solid #edf1f8;
    border-bottom: 1rpx solid #edf1f8;
}

.detail-cell:nth-child(3n) {
    border-right: none;
}

.detail-label {
    display: block;
    font-size: 20rpx;
    color: #94a3b8;
    font-weight: 500;
    margin-bottom: 6rpx;
    letter-spacing: 1rpx;
}

.detail-value {
    display: block;
    font-size: 24rpx;
    color: #1e293b;
    font-weight: 600;
}

.preview-product-footer {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.footer-left {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
}

.footer-qty {
    font-size: 24rpx;
    color: #475569;
    font-weight: 600;
}

.footer-branding {
    font-size: 20rpx;
    color: #c8aa6e;
    font-weight: 500;
}

.footer-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4rpx;
}

.footer-unit {
    font-size: 22rpx;
    color: #94a3b8;
}

.footer-total {
    font-size: 32rpx;
    font-weight: 700;
    color: #dc2626;
    letter-spacing: -0.5rpx;
}

.preview-summary-bar {
    margin: 0 -30rpx;
    padding: 28rpx 30rpx;
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 0 20rpx 20rpx;
}

.summary-label {
    font-size: 24rpx;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.55);
    letter-spacing: 3rpx;
}

.summary-value {
    font-size: 40rpx;
    font-weight: 700;
    color: #c8aa6e;
    letter-spacing: -1rpx;
}

.final-price-row {
    margin: 0 -30rpx -30rpx;
    padding: 24rpx 30rpx;
    background: #fff7ed;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 2rpx dashed #fed7aa;
    border-radius: 0 0 20rpx 20rpx;
}

.final-price-label {
    font-size: 26rpx;
    font-weight: 600;
    color: #9a3412;
}

.final-price-input-wrap {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 2rpx solid #fb923c;
    border-radius: 10rpx;
    padding: 8rpx 16rpx;
}

.final-price-prefix {
    font-size: 28rpx;
    font-weight: 700;
    color: #dc2626;
    margin-right: 4rpx;
}

.final-price-input {
    font-size: 32rpx;
    font-weight: 700;
    color: #dc2626;
    width: 200rpx;
    text-align: right;
}

/* 按钮操作系统组 */
.button-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin: 16rpx 0 50rpx;
    width: 100%;
}

.btn {
    width: 100% !important;
    height: 92rpx;
    line-height: 92rpx;
    border-radius: 46rpx;
    font-size: 30rpx;
    font-weight: 700;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.btn-primary {
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(13, 21, 38, 0.2);
}

.btn-contract {
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(30, 64, 175, 0.22);
}

.btn-secondary {
    background-color: #ffffff;
    color: #0d1526;
    border: 2rpx solid #cbd5e1;
}

.btn-back {
    background-color: #e2e8f0;
    color: #475569;
}

.custom-loading-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(13, 21, 38, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.custom-loading-container {
    background-color: #ffffff;
    border-radius: 24rpx;
    padding: 60rpx 80rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
    min-width: 320rpx;
}

.loading-spinner {
    width: 80rpx;
    height: 80rpx;
    position: relative;
    margin-bottom: 32rpx;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4rpx solid rgba(13, 21, 38, 0.1);
    border-radius: 50%;
    border-top-color: #0d1526;
    animation: spinner-rotate 1s linear infinite;
}

.spinner-ring-delay {
    animation-delay: 0.5s;
    border-top-color: #c8aa6e;
}

@keyframes spinner-rotate {
    to {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 28rpx;
    color: #475569;
    font-weight: 600;
    letter-spacing: 2rpx;
}

.custom-toast-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(13, 21, 38, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(2px);
}

.custom-toast-container {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 40rpx 60rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.12);
    min-width: 280rpx;
}

.custom-toast-container.success .toast-icon {
    background-color: #10b981;
}

.custom-toast-container.error .toast-icon {
    background-color: #ef4444;
}

.toast-icon {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
}

.toast-icon-error {
    background-color: #ef4444;
}

.icon-check,
.icon-x {
    font-size: 36rpx;
    color: #ffffff;
    font-weight: 700;
}

.toast-text {
    font-size: 28rpx;
    color: #475569;
    font-weight: 600;
    letter-spacing: 2rpx;
    text-align: center;
}

/* ===== 多模板合同选择弹窗 ===== */
.tpl-picker-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(13, 21, 38, 0.55);
    z-index: 10001;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    backdrop-filter: blur(2px);
}

.tpl-picker-sheet {
    width: 100%;
    max-width: 750rpx;
    background-color: #f8fafc;
    border-radius: 32rpx 32rpx 0 0;
    display: flex;
    flex-direction: column;
    /* 关键：微信小程序 flex 子元素 scroll-view 分配剩余空间，需要父有明确高度；这里用 88vh 代替纯 max-height */
    height: 88vh;
    max-height: 88vh;
    overflow: hidden;
    box-shadow: 0 -12rpx 48rpx rgba(13, 21, 38, 0.22);
}

.tpl-picker-header {
    padding: 36rpx 36rpx 24rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #e2e8f0;
    flex-shrink: 0;
}

.tpl-picker-title {
    display: block;
    font-size: 34rpx;
    font-weight: 800;
    color: #0d1526;
    letter-spacing: 2rpx;
    margin-bottom: 10rpx;
}

.tpl-picker-desc {
    display: block;
    font-size: 24rpx;
    color: #64748b;
    line-height: 1.5;
}

.tpl-picker-body {
    /* ===== 微信小程序 scroll-view 在 flex 容器内的核心高度三件套 =====
       没有 height:0 + min-height:0，scroll-view 会被压缩为 0 高度，
       内部所有 <view> 模板项都不会显示（截图问题就是这个原因）。 */
    flex: 1;
    height: 0;
    min-height: 0;
    padding: 24rpx 24rpx 8rpx;
    overflow-y: auto;
    box-sizing: border-box;
}

.tpl-family-group {
    margin-bottom: 24rpx;
}

.tpl-family-tag {
    display: inline-block;
    padding: 8rpx 20rpx;
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    border-radius: 8rpx 8rpx 0 0;
    margin-left: 4rpx;
}

.tpl-family-tag-en {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
}

.tpl-family-tag-text {
    font-size: 22rpx;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 2rpx;
}

.tpl-list {
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 12rpx 8rpx;
    border: 1rpx solid #e2e8f0;
    overflow: hidden;
}

.tpl-item {
    display: flex;
    align-items: center;
    padding: 24rpx 20rpx;
    border-radius: 12rpx;
    margin-bottom: 4rpx;
    transition: all 0.15s ease;
    position: relative;
}

.tpl-item:last-child {
    margin-bottom: 0;
}

.tpl-item:active {
    background-color: #f1f5f9;
}

.tpl-item-selected {
    background: linear-gradient(135deg, rgba(13, 21, 38, 0.05) 0%, rgba(200, 170, 110, 0.10) 100%);
    border: 1rpx solid #c8aa6e;
}

.tpl-item-radio {
    flex-shrink: 0;
    margin-right: 20rpx;
}

.tpl-radio-outer {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    border: 3rpx solid #cbd5e1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition: all 0.15s ease;
}

.tpl-item-selected .tpl-radio-outer {
    border-color: #c8aa6e;
}

.tpl-radio-inner {
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #0d1526 0%, #c8aa6e 100%);
}

.tpl-item-body {
    flex: 1;
    min-width: 0;
}

.tpl-item-name {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #0d1526;
    line-height: 1.4;
    word-break: break-all;
}

.tpl-item-check {
    flex-shrink: 0;
    margin-left: 12rpx;
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #0d1526 0%, #c8aa6e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(13, 21, 38, 0.2);
}

.tpl-check-icon {
    font-size: 26rpx;
    color: #ffffff;
    font-weight: 800;
}

.tpl-picker-footer {
    padding: 20rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
    background-color: #ffffff;
    border-top: 1rpx solid #e2e8f0;
    display: flex;
    gap: 20rpx;
    flex-shrink: 0;
}

.tpl-btn {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 30rpx;
    font-weight: 700;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tpl-btn-cancel {
    background-color: #f1f5f9;
    color: #475569;
}

.tpl-btn-confirm {
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(13, 21, 38, 0.2);
}
</style>
