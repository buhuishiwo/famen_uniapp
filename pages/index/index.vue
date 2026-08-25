<template>
    <view>
        <navigation-bar :title="currentProductSeries || $t('index.valveSelection')" :back="true" color="white"
            background="linear-gradient(135deg, #1a2236 0%, #0d1526 100%);" @back="onBackToCategory"></navigation-bar>

        <language-switch></language-switch>

        <scroll-view class="scroll-content" scroll-y>

            <!-- 顶部标题栏 -->
            <view class="page-header">
                <view class="header-badge">
                    <text class="badge-dot"></text>
                    <text class="badge-text">{{ $t('index.configQuote') }}</text>
                </view>
                <text class="page-title">{{ currentProductSeries || $t('index.valveSelection') }}</text>
                <text class="page-subtitle">{{ $t('index.configTitle') }}</text>
            </view>

            <!-- 表单部分 -->
            <view class="form-section">
                <view class="form-section-label">
                    <text class="section-icon">⚙</text>
                    <text class="section-name">{{ $t('index.productConfig') }}</text>
                </view>

                <view class="form-item">
                    <text class="label">{{ $t('index.valveModel') }}</text>
                    <picker class="picker" mode="selector" :range="valveTypes" range-key="name" @change="onSelectValve">
                        <view class="picker-box" :class="{ filled: selectedValve }">
                            <text class="picker-text">{{ selectedValve ? selectedValve.name : $t('index.selectValveModel') }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">{{ $t('index.specSize') }}</text>
                    <picker class="picker" mode="selector" :range="specifications" range-key="name" @change="onSelectSpec">
                        <view class="picker-box" :class="{ filled: selectedSpec }">
                            <text class="picker-text">{{ selectedSpec ? selectedSpec.name : $t('index.selectSpecSize') }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">{{ $t('index.bodyMaterial') }}</text>
                    <picker class="picker" mode="selector" :range="valveBodyTypes" range-key="name" @change="onSelectValveBody">
                        <view class="picker-box" :class="{ filled: SelectValveBody }">
                            <text class="picker-text">{{ SelectValveBody ? SelectValveBody.name : $t('index.selectBodyMaterial') }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">{{ $t('index.gateMaterial') }}</text>
                    <picker class="picker" mode="selector" :range="gatePlateTypes" range-key="name" @change="onSelectGatePlate">
                        <view class="picker-box" :class="{ filled: selectedGatePlate }">
                            <text class="picker-text">{{ selectedGatePlate ? selectedGatePlate.name : $t('index.selectGateMaterial') }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">{{ $t('index.stemMaterial') }}</text>
                    <picker class="picker" mode="selector" :range="rodMaterials" range-key="name" @change="onSelectRodMaterial">
                        <view class="picker-box" :class="{ filled: selectedRodMaterial }">
                            <text class="picker-text">{{ selectedRodMaterial ? selectedRodMaterial.name : $t('index.selectStemMaterial') }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">{{ $t('index.yokeMaterial') }}</text>
                    <picker class="picker" mode="selector" :range="yokeMaterials" range-key="name" @change="onSelectYokeMaterial">
                        <view class="picker-box" :class="{ filled: selectedYokeMaterial }">
                            <text class="picker-text">{{ selectedYokeMaterial ? selectedYokeMaterial.name : $t('index.selectYokeMaterial') }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">{{ $t('index.productType') }}</text>
                    <picker class="picker" mode="selector" :range="productTypeOptions" @change="onSelectProductType">
                        <view class="picker-box filled">
                            <text class="picker-text">{{ selectedProductType }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <view class="label-row">
                        <text class="label">{{ $t('index.quantity') }}</text>
                        <text v-if="currentMoq > 0" class="moq-hint">{{ $t('index.moqHint', { moq: currentMoq }) }}</text>
                    </view>
                    <view class="qty-wrapper">
                        <input class="qty-input" type="number" :value="quantity" @input="onQuantityChange"
                            :placeholder="$t('index.inputQuantity')" placeholder-class="qty-placeholder" />
                    </view>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">{{ $t('index.branding') }}</text>
                    <view class="toggle-group">
                        <view class="toggle-item" :class="{ active: selectedBranding === true }" @tap="onSelectBranding(true)">
                            <text class="toggle-dot" v-if="selectedBranding === true">●</text>
                            <text class="toggle-dot-off" v-else>○</text>
                            <text>{{ $t('index.yes') }}</text>
                        </view>
                        <view class="toggle-item" :class="{ active: selectedBranding === false }" @tap="onSelectBranding(false)">
                            <text class="toggle-dot" v-if="selectedBranding === false">●</text>
                            <text class="toggle-dot-off" v-else>○</text>
                            <text>{{ $t('index.no') }}</text>
                        </view>
                    </view>
                </view>

                <!-- 价格预览 -->
                <view class="price-card" v-if="selectedValve && selectedSpec && selectedGatePlate && selectedRodMaterial">
                    <view class="price-row">
                        <view class="price-col">
                            <text class="price-tag">{{ $t('index.originalUnitPrice') }}</text>
                            <view class="price-input-wrap readonly">
                                <text class="price-prefix">¥</text>
                                <text class="price-text">{{ currentPrice }}</text>
                            </view>
                        </view>
                        <template v-if="allowPriceModification">
                            <view class="price-divider-v"></view>
                            <view class="price-col">
                                <text class="price-tag">{{ $t('index.modifiedUnitPrice') }}</text>
                                <view class="price-input-wrap">
                                    <text class="price-prefix">¥</text>
                                    <input class="price-input" type="digit" :value="confirmedPrice" @input="onPriceInput" />
                                </view>
                            </view>
                        </template>
                        <view class="price-divider-v"></view>
                        <view class="price-col">
                            <text class="price-tag">{{ $t('index.estimatedTotal') }}</text>
                            <text class="price-amount total-highlight">¥<text class="price-num">{{ totalPreviewPrice }}</text></text>
                        </view>
                    </view>
                    <view class="price-tip" v-if="allowPriceModification">
                        <uni-icons type="info-filled" size="14" color="#ef4444" class="tip-icon"></uni-icons>
                        <text class="tip-text">{{ $t('index.priceTip') }}</text>
                    </view>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-area">
                <button class="btn btn-add" @tap="onAddToQuote">
                    <text class="btn-icon">＋</text>
                    <text>{{ $t('index.addToQuote') }}</text>
                </button>
                <button class="btn btn-generate" v-if="quoteItems.length > 0" @tap="onGenerateQuotation">
                    <text class="btn-icon">📋</text>
                    <text>{{ $t('index.generateQuote') }}</text>
                </button>
                <button class="btn btn-contract" v-if="quoteItems.length > 0" @tap="generateContract">
                    <text class="btn-icon">📄</text>
                    <text>{{ $t('quotation.generateContractExcel') }}</text>
                </button>
            </view>

            <!-- 报价列表 -->
            <view class="quote-list" v-if="quoteItems.length > 0">
                <view class="list-header">
                    <text class="list-title">📦 {{ $t('index.quoteDetails') }}</text>
                    <view class="list-count-badge">
                        <text class="list-count">{{ $t('index.totalItems', { count: quoteItems.length }) }}</text>
                    </view>
                </view>

                <view class="quote-item" v-for="(item, index) in quoteItems" :key="index">
                    <view class="quote-item-header">
                        <view class="item-index-badge">
                            <text>{{ index + 1 }}</text>
                        </view>
                        <text class="item-valve-name">{{ item.valveName }}</text>
                        <view class="delete-btn" @tap="onDeleteItem" :data-index="index">
                            <text>✕</text>
                        </view>
                    </view>

                    <view class="item-tags">
                        <view class="tag">DN{{ item.spec }}</view>
                        <view class="tag">{{ item.bodyMaterial }}</view>
                        <view class="tag">{{ item.gatePlate }}</view>
                        <view class="tag">{{ item.rodMaterial }}</view>
                        <view class="tag">{{ item.yokeMaterial }}</view>
                        <view class="tag tag-type">{{ item.productType }}</view>
                    </view>

                    <view class="item-price-row">
                        <view class="item-meta">
                            <text class="meta-item">× {{ item.quantity }} {{ $t('quotation.pieces') }}</text>
                            <text class="meta-item" v-if="item.brandingFee">磨标 ¥{{ item.brandingFee }}/件</text>
                        </view>
                        <view class="item-price-right">
                            <text class="unit-price">¥{{ item.unitPrice }}/件</text>
                            <text class="total-item-price">¥{{ item.totalPrice }}</text>
                        </view>
                    </view>
                </view>

                <view class="quote-total-bar">
                    <text class="total-bar-label">{{ $t('index.totalAmount') }}</text>
                    <text class="total-bar-value">¥{{ totalPrice }}</text>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-else-if="!quoteItems || quoteItems.length === 0">
                <text class="empty-icon">📝</text>
                <text class="empty-text">{{ $t('index.noQuoteItems') }}</text>
                <text class="empty-sub">{{ $t('index.noQuoteItemsSub') }}</text>
            </view>

            <view class="bottom-safe"></view>
        </scroll-view>

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

        <!-- ===== 购销合同模板选择弹窗（迁移自报价详情页） ===== -->
        <view class="tpl-picker-mask" v-if="showTemplatePicker" @tap="onTemplatePickerCancel">
            <view class="tpl-picker-sheet" @tap.stop>
                <view class="tpl-picker-header">
                    <text class="tpl-picker-title">{{ $t('quotation.templatePickerTitle') }}</text>
                    <text class="tpl-picker-desc">{{ $t('quotation.templatePickerDesc') }}</text>
                </view>

                <!-- 微信小程序中：普通 view + overflow:auto 比 <scroll-view> 在 flex 布局下更稳定 -->
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
import { priceApi } from '@/utils/cloud-api';
// 购销合同导出：JSZip + 模板注册表（轻量显示元数据 / 构建字节懒加载分离，避免 setData 过大）
import JSZip from '@/utils/jszip.min.js';
import { TEMPLATE_META_DISPLAY, getTemplateRegistryForBuild } from '@/utils/contract-templates.js';
import { buildContract } from '@/utils/contract-xlsx-builder.js';

export default {
    components: {
        navigationBar
    },
    data() {
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
            confirmedPrice: '0.00',
            // ===== 购销合同模板选择 =====
            // 模板选择弹窗显示状态
            showTemplatePicker: false,
            // 用户当前选中的模板 key（默认：中文购销合同家族第一个）
            selectedTemplateKey: (TEMPLATE_META_DISPLAY && TEMPLATE_META_DISPLAY[0]) ? TEMPLATE_META_DISPLAY[0].key : ''
            // ❌ 注意：TEMPLATE_META_DISPLAY 仅含轻量元数据；含 bytes 的注册表
            //   只能在生成时调用 getTemplateRegistryForBuild()，绝不可放入 data 响应式链路
        };
    },
    computed: {
        // ===== 购销合同模板选择辅助 computed =====
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
    created() {
        this.initI18nData();
        this._i18nUnsubscribe = this.$localeOn(() => {
            this.initI18nData();
        });
    },
    beforeDestroy() {
        if (this._i18nUnsubscribe) {
            this._i18nUnsubscribe();
        }
    },
    onLoad() {
        this.currentProductSeries = uni.getStorageSync('currentProductSeries') || '';
        this.loadDataFromBackend();
        this.loadSystemConfig();
        const cachedQuoteItems = uni.getStorageSync('quoteItems');
        if (cachedQuoteItems) {
            this.quoteItems = cachedQuoteItems;
            this.calculateTotalPrice();
        }
    },
    methods: {
        initI18nData() {
            const regular = this.$t('index.regular');
            const newProduct = this.$t('index.newProduct');
            this.productTypeOptions = [regular, newProduct];
            this.selectedProductType = regular;
            this.priceTable.productTypeMultiplier = {
                [regular]: 1.0,
                [newProduct]: 1.3
            };
        },
        showToast(text, type = 'success') {
            this.showToastDialog = true;
            this.toastText = text;
            this.toastType = type;
            setTimeout(() => {
                this.showToastDialog = false;
            }, 2000);
        },
        async loadSystemConfig() {
            try {
                const res = await priceApi.getSystemConfig(['allow_price_modification']);
                if (res && res.success && res.data) {
                    this.allowPriceModification = res.data.allow_price_modification !== 'false';
                }
            } catch (e) {
                console.warn('[loadSystemConfig] 加载系统配置失败:', e);
            }
        },
        async loadDataFromBackend() {
            this.showLoading = true;
            this.loadingText = this.$t('index.loadingData');
            try {
                const [series, models, rulesRes, materialsRes, diffsRes] = await Promise.all([
                    priceApi.getSeries(),
                    priceApi.getModels(),
                    priceApi.getPricingRules(),
                    priceApi.getMaterials(),
                    priceApi.getMaterialDiffs()
                ]);
                if (rulesRes && rulesRes.success) {
                    this.pricingRules = rulesRes.data || [];
                    console.log('[index] 加载报价系数规则: ' + this.pricingRules.length + ' 条');
                }
                if (materialsRes && materialsRes.success) {
                    this.materialData = materialsRes.data || [];
                    console.log('[index] 加载材质数据: ' + this.materialData.length + ' 条');
                    this.updateMaterialOptions();
                }
                if (diffsRes && diffsRes.success) {
                    this.materialDiffs = diffsRes.data || [];
                    console.log('[index] 加载材质价差数据: ' + this.materialDiffs.length + ' 条');
                }
                const groupedModels = {};
                Object.keys(models).forEach(seriesName => {
                    groupedModels[seriesName] = models[seriesName].map(model => ({
                        id: model.id,
                        name: model.name,
                        type: model.type
                    }));
                });
                this.seriesValveTypes = groupedModels;
                const seriesName = this.currentProductSeries || null;
                this.priceData = await priceApi.getPrices(seriesName);
                this.setValveTypesBySeries();
                this.updateSpecifications();
            } catch (error) {
                console.error('加载数据失败:', error);
                this.showToast(this.$t('index.dataLoadFail'), 'error');
            } finally {
                this.showLoading = false;
            }
        },
        setValveTypesBySeries() {
            if (this.currentProductSeries && this.seriesValveTypes[this.currentProductSeries]) {
                this.valveTypes = this.seriesValveTypes[this.currentProductSeries];
                this.loadPriceDataBySeries(this.currentProductSeries);
            } else if (this.currentProductSeries) {
                // 当前系列无型号数据，弹窗提示并返回
                this.valveTypes = [];
                this.priceData = [];
                uni.showModal({
                    title: this.$t('product.noSeriesData'),
                    content: this.$t('product.noSeriesDataMsg', { series: this.currentProductSeries }),
                    showCancel: false,
                    confirmText: '返回',
                    success: () => {
                        uni.navigateBack();
                    }
                });
            } else {
                // 没有指定系列（首次进入）
                const firstSeries = Object.keys(this.seriesValveTypes)[0];
                this.valveTypes = firstSeries ? this.seriesValveTypes[firstSeries] : [];
                if (firstSeries) {
                    this.loadPriceDataBySeries(firstSeries);
                }
            }
        },
        async loadPriceDataBySeries(seriesName) {
            try {
                this.priceData = await priceApi.getPrices(seriesName);
                console.log('[index] loadPriceDataBySeries: series=' + seriesName +
                    ', 条数=' + (this.priceData ? this.priceData.length : 0));
                if (this.priceData && this.priceData.length > 0) {
                    for (var i = 0; i < Math.min(this.priceData.length, 3); i++) {
                        console.log('[index] priceData[' + i + ']: valve=' +
                            this.priceData[i].valveName + ' size=' + this.priceData[i].size +
                            ' minOrderQty=' + this.priceData[i].minOrderQty +
                            ' price=' + this.priceData[i].price);
                    }
                }
                const materialsRes = await priceApi.getMaterials(seriesName);
                if (materialsRes && materialsRes.success) {
                    this.materialData = materialsRes.data || [];
                    this.updateMaterialOptions();
                }
            } catch (error) {
                console.error('加载价格数据失败:', error);
            }
        },
        updateMaterialOptions() {
            const allBodyMaterials = [...new Set(this.materialData.map(m => m.bodyMaterial).filter(Boolean))];
            const allGatePlateMaterials = [...new Set(this.materialData.map(m => m.gatePlateMaterial).filter(Boolean))];
            const allStemMaterials = [...new Set(this.materialData.map(m => m.stemMaterial).filter(Boolean))];
            const allYokeMaterials = [...new Set(this.materialData.map(m => m.yokeMaterial).filter(Boolean))];

            const allDiffMaterials = new Set();
            for (const d of this.materialDiffs) {
                if (d.baseMaterial) allDiffMaterials.add(d.baseMaterial);
                if (d.targetMaterial) allDiffMaterials.add(d.targetMaterial);
            }

            const bodyMatSet = new Set([...allBodyMaterials, ...allDiffMaterials]);
            const gateMatSet = new Set([...allGatePlateMaterials, ...allDiffMaterials]);
            const stemMatSet = new Set([...allStemMaterials, ...allDiffMaterials]);
            const yokeMatSet = new Set([...allYokeMaterials, ...allDiffMaterials]);

            this.valveBodyTypes = Array.from(bodyMatSet).map(name => ({ name, price: 0 }));
            this.gatePlateTypes = Array.from(gateMatSet).map(name => ({ name, price: 0 }));
            this.rodMaterials = Array.from(stemMatSet).map(name => ({ name, price: 0 }));
            this.yokeMaterials = Array.from(yokeMatSet).map(name => ({ name, price: 0 }));

            if (this.valveBodyTypes.length === 0) {
                this.valveBodyTypes = [{ name: 'GGG40', price: 0 }];
            }
            if (this.gatePlateTypes.length === 0) {
                this.gatePlateTypes = [{ name: 'SS304', price: 0 }, { name: 'SS316', price: 0 }];
            }
            if (this.rodMaterials.length === 0) {
                this.rodMaterials = [{ name: '2Cr13', price: 0 }, { name: 'SS304', price: 0 }, { name: 'SS316', price: 0 }];
            }
            if (this.yokeMaterials.length === 0) {
                this.yokeMaterials = [{ name: 'Q235', price: 0 }, { name: 'SS304', price: 0 }];
            }

            console.log('[index] 材质选项更新: 阀体=' + this.valveBodyTypes.length +
                ', 闸板=' + this.gatePlateTypes.length + ', 阀杆=' + this.rodMaterials.length +
                ', 支架=' + this.yokeMaterials.length);
        },
        getMaterialByValveName(valveName) {
            const selectedValve = this.selectedValve;
            if (selectedValve && selectedValve.id) {
                const material = this.materialData.find(m => m.modelId === selectedValve.id);
                if (material) return material;
            }
            return this.materialData.find(m => m.valveName === valveName);
        },
        setMaterialStandard(valveName) {
            const material = this.getMaterialByValveName(valveName);
            let bodyMat = null;
            let gatePlateMat = null;
            let stemMat = null;
            let yokeMat = null;

            if (material) {
                bodyMat = this.valveBodyTypes.find(v => v.name === material.bodyMaterial);
                gatePlateMat = this.gatePlateTypes.find(v => v.name === material.gatePlateMaterial);
                stemMat = this.rodMaterials.find(v => v.name === material.stemMaterial);
                yokeMat = this.yokeMaterials.find(v => v.name === material.yokeMaterial);
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
        getMinOrderQuantity(specSize) {
            const dnSize = parseInt(String(specSize).replace(/[^\d]/g, '')) || 0;
            
            // 1. 优先从价格表中获取该产品具体配置的起订量
            if (this.selectedValve && this.priceData && this.priceData.length > 0) {
                var priceItem = this.priceData.find(function(p) {
                    const pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
                    return p.valveName === this.selectedValve.name && pSize === dnSize;
                }, this);
                if (priceItem && priceItem.minOrderQty && priceItem.minOrderQty > 0) {
                    return parseInt(priceItem.minOrderQty) || 50;
                }
            }
            
            // 2. 其次查报价系数规则表
            if (this.pricingRules && this.pricingRules.length > 0) {
                var seriesName = this.currentProductSeries;
                var rule = this.pricingRules.find(function(r) {
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
        getPricingCoefficient(seriesName, valveName, specSize, quantity, hasBranding) {
            if (!this.pricingRules || this.pricingRules.length === 0) {
                console.log('[index] 无报价系数规则');
                return 1.0;
            }

            var findRule = function(productName) {
                return this.pricingRules.find(function(r) {
                    const match = r.seriesName === seriesName
                        && (r.productName || '') === (productName || '')
                        && specSize >= r.dnMin
                        && specSize <= r.dnMax;
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
                var priceItem = this.priceData.find(function(p) {
                    const pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
                    return p.valveName === valveName && pSize === specSize;
                }, this);
                if (priceItem && priceItem.minOrderQty && priceItem.minOrderQty > 0) {
                    minOrderQty = parseInt(priceItem.minOrderQty) || rule.minOrderQty;
                }
            }

            var moqMet = quantity >= minOrderQty;
            console.log('[index] 报价系数计算: quantity=' + quantity + ', minOrderQty=' + minOrderQty + ', moqMet=' + moqMet);
            
            if (moqMet && hasBranding)  return rule.moqMetOemCoeff;
            if (moqMet && !hasBranding) return rule.moqMetOriginalCoeff;
            if (!moqMet && hasBranding)  return rule.moqUnmetOemCoeff;
            if (!moqMet && !hasBranding) return rule.moqUnmetOriginalCoeff;
            return 1.0;
        },
        onSelectValveBody(e) {
            this.setData({ SelectValveBody: this.valveBodyTypes[e.detail.value] });
            this.updateCurrentPrice();
        },
        onSelectValve(e) {
            this.setData({ selectedValve: this.valveTypes[e.detail.value] });
            this.updateSpecifications();
            this.updateCurrentPrice();
        },
        onSelectSpec(e) {
            this.setData({ selectedSpec: this.specifications[e.detail.value] });
            const minQty = this.getMinOrderQuantity(this.selectedSpec.name);
            this.setData({ quantity: minQty, currentMoq: minQty });
            if (this.selectedValve) {
                this.setMaterialStandard(this.selectedValve.name);
            }
            this.updateCurrentPrice();
        },
        onSelectGatePlate(e) {
            this.setData({ selectedGatePlate: this.gatePlateTypes[e.detail.value] });
            this.updateCurrentPrice();
        },
        onSelectRodMaterial(e) {
            this.setData({ selectedRodMaterial: this.rodMaterials[e.detail.value] });
            this.updateCurrentPrice();
        },
        onSelectYokeMaterial(e) {
            this.setData({ selectedYokeMaterial: this.yokeMaterials[e.detail.value] });
            this.updateCurrentPrice();
        },
        onSelectProductType(e) {
            this.setData({ selectedProductType: this.productTypeOptions[e.detail.value] });
            this.updateCurrentPrice();
        },
        onSelectBranding(value) {
            this.setData({ selectedBranding: value });
            this.updateCurrentPrice();
        },
        onQuantityChange(e) {
            const newQuantity = parseInt(e.detail.value) || 1;
            this.setData({ quantity: newQuantity });
            this.updateCurrentPrice();
        },
        onPriceInput(e) {
            const newPrice = e.detail.value;
            this.setData({ confirmedPrice: newPrice });
            const price = parseFloat(newPrice) || 0;
            this.setData({ totalPreviewPrice: (price * this.quantity).toFixed(2) });
        },
        getMaterialPriceDiff(seriesName, partName, baseMaterial, targetMaterial, dn) {
            if (!baseMaterial || !targetMaterial || baseMaterial === targetMaterial) return 0;

            const candidates = this.materialDiffs.filter(d =>
                d.partName === partName &&
                d.baseMaterial === baseMaterial &&
                d.targetMaterial === targetMaterial
            );

            if (candidates.length === 0) return 0;

            // 优先级匹配：精确(型号+尺寸) > 型号 > 系列 > 全局
            // 1. 精确匹配：series + model + size
            let matched = candidates.find(d =>
                d.seriesName === seriesName &&
                d.modelName === this.selectedValve?.name &&
                Number(d.size) === dn
            );
            if (matched) return matched.priceDiff;

            // 2. 型号匹配：series + model
            matched = candidates.find(d =>
                d.seriesName === seriesName &&
                d.modelName === this.selectedValve?.name &&
                (!d.size || d.size === null)
            );
            if (matched) return matched.priceDiff;

            // 3. 系列匹配：series
            matched = candidates.find(d =>
                d.seriesName === seriesName &&
                (!d.modelName || d.modelName === '')
            );
            if (matched) return matched.priceDiff;

            // 4. 全局匹配
            matched = candidates.find(d =>
                (!d.seriesName || d.seriesName === '') &&
                (!d.modelName || d.modelName === '')
            );
            if (matched) return matched.priceDiff;

            return 0;
        },
        updateCurrentPrice() {
            const { selectedValve, selectedSpec, selectedGatePlate, selectedRodMaterial, selectedYokeMaterial, selectedProductType } = this;
            if (!selectedValve || !selectedSpec || !selectedGatePlate || !selectedRodMaterial) {
                this.setData({ currentPrice: '0.00' });
                return;
            }
            const specSizeStr = String(selectedSpec.name);
            const specSize = parseInt(specSizeStr.replace(/[^\d]/g, '')) || 0;
            const priceItem = this.priceData.find(p => {
                const pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
                return p.valveName === selectedValve.name && pSize === specSize;
            });
            if (!priceItem) { 
                this.setData({ currentPrice: '0.00' }); 
                return; 
            }

            const material = this.getMaterialByValveName(selectedValve.name);
            const type = selectedValve.type;
            let basePrice = this.getPriceByType(priceItem, type);
            
            const seriesName = this.currentProductSeries;

            const bodyDiff = this.getMaterialPriceDiff(seriesName, 'body', 
                (material?.bodyMaterial || ''), (this.SelectValveBody?.name || ''), specSize);
            
            const gatePlateDiff = this.getMaterialPriceDiff(seriesName, 'gate_plate', 
                (material?.gatePlateMaterial || ''), (selectedGatePlate?.name || ''), specSize);
            
            const rodDiff = this.getMaterialPriceDiff(seriesName, 'stem', 
                (material?.stemMaterial || ''), (selectedRodMaterial?.name || ''), specSize);
            
            const yokeDiff = this.getMaterialPriceDiff(seriesName, 'yoke', 
                (material?.yokeMaterial || ''), (selectedYokeMaterial?.name || ''), specSize);

            const multiplier = this.priceTable.productTypeMultiplier[selectedProductType];
            const hasBranding = this.selectedBranding;
            const brandingFee = hasBranding ? (priceItem.brandingFee || 0) : 0;
            
            const pricingCoeff = this.getPricingCoefficient(
                seriesName, selectedValve.name, specSize,
                this.quantity, hasBranding
            );
            
            const baseTotal = basePrice + bodyDiff + gatePlateDiff + rodDiff + yokeDiff + brandingFee;
            const total = baseTotal * pricingCoeff * multiplier;
            
            this.setData({
                currentPrice: total.toFixed(2),
                confirmedPrice: total.toFixed(2),
                totalPreviewPrice: (total * this.quantity).toFixed(2)
            });
        },
        getBrandingFee(size) {
            // 磨商标价格映射表
            const brandingFeeMap = {
                50: 25, 65: 25, 80: 25, 100: 25, 125: 25, 150: 25,
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
        updateSpecifications() {
            // 根据选中的阀门型号，从已加载的价格数据中提取可用规格
            // 清除之前选的规格（不同型号的可用规格不同）
            this.selectedSpec = null;
            this.setData({ currentMoq: 0 });
            if (!this.selectedValve) {
                // 无选中型号时，显示当前系列下所有规格
                const allSizes = [...new Set(this.priceData.map(p => p.size))].sort((a, b) => a - b);
                this.specifications = allSizes.map(s => ({ name: s }));
                return;
            }
            const sizes = this.priceData
                .filter(p => p.valveName === this.selectedValve.name)
                .map(p => p.size)
                .sort((a, b) => a - b);
            const uniqueSizes = [...new Set(sizes)];
            this.specifications = uniqueSizes.map(s => ({ name: s }));
            if (uniqueSizes.length === 0) {
                console.warn('该型号无可用规格: ' + this.selectedValve.name);
            }
        },
        getPriceByType(priceItem, type) {
            return priceItem.price || 0;
        },
        async calculatePrice() {
            const { selectedValve, selectedSpec, selectedGatePlate, selectedRodMaterial, selectedYokeMaterial, quantity, selectedProductType } = this;
            if (!selectedValve || !selectedSpec || !selectedGatePlate || !selectedRodMaterial) {
                this.showToast(this.$t('index.fillCompleteInfo'), 'error'); return null;
            }
            const specSizeStr = String(selectedSpec.name);
            const specSize = parseInt(specSizeStr.replace(/[^\d]/g, '')) || 0;
            const priceItem = this.priceData.find(p => {
                const pSize = parseInt(String(p.size).replace(/[^\d]/g, '')) || 0;
                return p.valveName === selectedValve.name && pSize === specSize;
            });
            if (!priceItem) { 
                this.showToast(this.$t('index.comboNotAvailable'), 'error'); 
                return null; 
            }

            const material = this.getMaterialByValveName(selectedValve.name);
            const type = selectedValve.type;
            let basePrice = this.getPriceByType(priceItem, type);
            
            const seriesName = this.currentProductSeries;

            const bodyDiff = this.getMaterialPriceDiff(seriesName, 'body', 
                (material?.bodyMaterial || ''), (this.SelectValveBody?.name || ''), specSize);
            
            const gatePlateDiff = this.getMaterialPriceDiff(seriesName, 'gate_plate', 
                (material?.gatePlateMaterial || ''), (selectedGatePlate?.name || ''), specSize);
            
            const rodDiff = this.getMaterialPriceDiff(seriesName, 'stem', 
                (material?.stemMaterial || ''), (selectedRodMaterial?.name || ''), specSize);
            
            const yokeDiff = this.getMaterialPriceDiff(seriesName, 'yoke', 
                (material?.yokeMaterial || ''), (selectedYokeMaterial?.name || ''), specSize);
            
            const multiplier = this.priceTable.productTypeMultiplier[selectedProductType];
            const minQty = this.getMinOrderQuantity(specSize);
            const isMeetMinOrder = quantity >= minQty;
            const hasBranding = this.selectedBranding;
            
            const brandingFee = hasBranding ? (priceItem.brandingFee || 0) : 0;
            
            const pricingCoeff = this.getPricingCoefficient(
                seriesName, selectedValve.name, specSize,
                quantity, hasBranding
            );
            const baseTotal = basePrice + bodyDiff + gatePlateDiff + rodDiff + yokeDiff + brandingFee;
            const calculatedUnitPrice = baseTotal * pricingCoeff * multiplier;
            const finalUnitPrice = this.allowPriceModification
                ? (parseFloat(this.confirmedPrice) || calculatedUnitPrice)
                : calculatedUnitPrice;
            const totalPrice = finalUnitPrice * quantity;

            let maxPressure = '', unitWeight = '', laps = '', torque = '';
            try {
                const specResult = await priceApi.getModelSpecs(selectedValve.name, specSize);
                if (specResult && specResult.data) {
                    const spec = specResult.data;
                    maxPressure = spec.maxPressure || '';
                    unitWeight = spec.unitWeight || '';
                    laps = spec.laps || '';
                    torque = spec.torque || '';
                }
            } catch (e) {
                console.log('获取规格参数失败:', e);
            }

            return {
                valveName: selectedValve.name,
                spec: selectedSpec.name,
                brandingFee: brandingFee,
                hasBranding: hasBranding,
                bodyMaterial: this.SelectValveBody?.name || '',
                gatePlate: selectedGatePlate.name,
                rodMaterial: selectedRodMaterial.name,
                yokeMaterial: selectedYokeMaterial?.name || '',
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
            };
        },
        onBackToCategory() {
            uni.navigateBack({ delta: 1 });
        },
        async onAddToQuote() {
            this.showLoading = true;
            this.loadingText = this.$t('index.calculating');
            const item = await this.calculatePrice();
            this.showLoading = false;
            if (!item) return;
            const newQuoteItems = [...this.quoteItems, item];
            const newTotalPrice = this.calculateTotal(newQuoteItems);
            this.setData({ quoteItems: newQuoteItems, totalPrice: newTotalPrice });
            uni.setStorageSync('quoteItems', newQuoteItems);
            this.showToast(this.$t('index.addSuccess'), 'success');
            this.resetSelection();
        },
        calculateTotal(items) {
            const total = items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
            return total.toFixed(2);
        },
        calculateTotalPrice() {
            this.totalPrice = this.calculateTotal(this.quoteItems);
        },
        resetSelection() {
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
        onDeleteItem(e) {
            const index = e.currentTarget.dataset.index;
            const newQuoteItems = this.quoteItems.filter((_, i) => i !== index);
            const newTotalPrice = this.calculateTotal(newQuoteItems);
            this.setData({ quoteItems: newQuoteItems, totalPrice: newTotalPrice });
            uni.setStorageSync('quoteItems', newQuoteItems);
        },
        onGenerateQuotation() {
            if (this.quoteItems.length === 0) {
                this.showToast(this.$t('index.addFirst'), 'error'); return;
            }
            uni.navigateTo({
                url: '/pages/quotation/quotation?data=' + encodeURIComponent(JSON.stringify(this.quoteItems))
            });
        },
        // ===== 购销合同导出（迁移自报价详情页，与「生成报价表」同级） =====
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

        /**
         * 生成购销合同 xlsx 文档（多模板版入口）
         *  - 第一步：校验产品非空 → 弹出「选择合同模板」弹窗
         *  - 第二步：用户选择并确认后，调用 _doGenerateContract(templateKey) 按选定模板生成
         */
        generateContract() {
            const that = this;
            const items = Array.isArray(this.quoteItems) ? this.quoteItems : [];
            if (items.length === 0) {
                uni.showModal({
                    title: that.$t('quotation.contractGenerateFail'),
                    content: '请先添加产品再生成合同',
                    showCancel: false
                });
                return;
            }
            // ===== 打开模板选择弹窗 =====
            // 注意：这里只能用 TEMPLATE_META_DISPLAY（不含 bytes），
            //   绝不能调用 getTemplateRegistryForBuild()，否则提前触发大 Uint8Array 构造
            console.log('[TemplatePicker] TEMPLATE_META_DISPLAY 总数 =', (TEMPLATE_META_DISPLAY || []).length);
            const cn = (TEMPLATE_META_DISPLAY || []).filter(function(t){return t.family === 'cn_contract'});
            const en = (TEMPLATE_META_DISPLAY || []).filter(function(t){return t.family === 'en_pi'});
            console.log('[TemplatePicker] cn_contract 家族 =', cn.length, '个 | en_pi 家族 =', en.length, '个');
            this.showTemplatePicker = true;
        },

        /**
         * 实际生成合同（调用多模板 buildContract）—— 由模板选择弹窗确认按钮触发
         * @param {string} templateKey 选中的模板 key
         */
        async _doGenerateContract(templateKey) {
            this.showLoading = true;
            this.loadingText = this.$t('quotation.contractGenerating');
            const that = this;
            const DEBUG = true;
            const log = (msg, val) => { if (DEBUG) console.log('[generateContract][' + templateKey + '] ' + msg, val === undefined ? '' : val); };
            try {
                // ===== 数据适配：index 页 quoteItems → buildContract 期望的 quoteData 格式 =====
                const items = (Array.isArray(this.quoteItems) ? this.quoteItems : []).map((it) => ({
                    productType: it.productType || '',
                    productName: it.valveName || '',
                    valveName: it.valveName || '',         // ← 保留下游 modelSpecOf 识别
                    spec: it.spec || '',                   // ← 口径：可能是 100/80/DN80
                    model: it.valveName || '',             // ← 型号前缀（如 QBZ73X-10C），便于 modelSpecOf 兜底
                    bodyMaterial: it.bodyMaterial || 'WCB',
                    gateMaterial: it.gatePlate || '',
                    stemMaterial: it.rodMaterial || '',
                    yokeMaterial: it.yokeMaterial || '',
                    gatePlateThickness: it.gatePlateThickness || '',
                    quantity: it.quantity || 1,
                    unitPrice: String(it.unitPrice || '0'),
                    totalPrice: String(it.totalPrice || '0'),
                    brandingFee: it.brandingFee || 0,
                    hasBranding: it.hasBranding || false,
                    productSeries: it.productSeries || '',
                    maxPressure: it.maxPressure || '',
                    unitWeight: it.unitWeight || '',
                    laps: it.laps || '',
                    torque: it.torque || '',
                    sealMaterial: it.sealMaterial || '',
                    bodyMaterialRaw: it.bodyMaterial || '',
                    trademark: it.trademark || '',
                    unit: it.unit || '台',
                    productNote: it.remark || it.productNote || '',
                    woodenBoxSize: it.woodenBoxSize || it.boxSize || ''
                }));
                log('步骤1 - 产品数量 N =', items.length);

                log('步骤2 - 调用多模板 buildContract (JSZip + XML 文本替换)  templateKey =', templateKey);
                // ===== 关键：仅此处调用 getTemplateRegistryForBuild()，获取含 bytes+meta 的完整注册表 =====
                //   返回的 BUILD_REGISTRY 是 method 内局部变量，完全不进入 Vue data/computed/template，
                //   因此不会触发任何 setData 序列化（性能隔离点）
                const BUILD_REGISTRY = getTemplateRegistryForBuild();
                log('步骤2.1 - getTemplateRegistryForBuild() 懒加载完成，模板数 =',
                    Array.isArray(BUILD_REGISTRY) ? BUILD_REGISTRY.length : 'FAIL');
                const outU8Raw = await buildContract(JSZip, BUILD_REGISTRY, templateKey, items, {
                    finalPrice: Number(that.totalPrice) || 0,
                    note: '',
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

                // 文件名：按模板类型独立前缀 + 日期（YYYYMMDD），格式：<前缀>-YYYYMMDD.xlsx
                //   奇胜合同（农商行付款）     → 奇胜-YYYYMMDD.xlsx
                //   长胜合同（农行付款）       → 长胜-YYYYMMDD.xlsx
                //   Changqi 英文购销合同       → Changqi-YYYYMMDD.xlsx
                //   Chisun 英文多币种农行      → ChisunMulti-YYYYMMDD.xlsx
                //   Chisun 英文VTB俄罗斯专用   → ChisunVTB-YYYYMMDD.xlsx
                const FILE_NAME_PREFIX = {
                    chisun_nsh:       '奇胜',
                    zs_changsheng:    '长胜',
                    pi_changqi:       'Changqi',
                    pi_chisun_multi:  'ChisunMulti',
                    pi_chisun_vtb:    'ChisunVTB'
                };
                const prefix = FILE_NAME_PREFIX[templateKey] || '合同';
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const fname = `${prefix}-${yyyy}${mm}${dd}.xlsx`;

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
            } catch (err) {
                console.error('[generateContract] 生成失败:', err);
                that.showLoading = false;
                that.showToast(that.$t('quotation.contractGenerateFail'), 'error');
            }
        }
    }
};
</script>

<style>
/* ============================
   设计语言：工业精工 · 深蓝钢铁
   主色：深海蓝 #0d1526
   强调：冷金 #c8aa6e
   卡片：#f4f6fa
   文字：#1a2236 / #5a6478
============================ */

page {
    height: 100vh;
    background-color: #eef1f6;
    font-family: -apple-system, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

/* ---- 滚动区 ---- */
.scroll-content {
    height: 89vh;
    padding: 0 24rpx 40rpx;
    box-sizing: border-box;
}

/* ---- 顶部页眉 ---- */
.page-header {
    padding: 36rpx 8rpx 28rpx;
}
.header-badge {
    display: flex;
    align-items: center;
    gap: 10rpx;
    margin-bottom: 12rpx;
}
.badge-dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background-color: #c8aa6e;
    display: block;
}
.badge-text {
    font-size: 22rpx;
    font-weight: 600;
    color: #c8aa6e;
    letter-spacing: 4rpx;
    text-transform: uppercase;
}
.page-title {
    display: block;
    font-size: 46rpx;
    font-weight: 700;
    color: #1a2236;
    letter-spacing: -0.5rpx;
    margin-bottom: 8rpx;
}
.page-subtitle {
    display: block;
    font-size: 24rpx;
    color: #8a97aa;
    letter-spacing: 1rpx;
}

/* ---- 表单卡片 ---- */
.form-section {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 32rpx 28rpx 12rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 16rpx rgba(13, 21, 38, 0.06);
}
.form-section-label {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 24rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #edf0f5;
}
.section-icon {
    font-size: 28rpx;
    color: #0d5ea8;
}
.section-name {
    font-size: 26rpx;
    font-weight: 700;
    color: #1a2236;
    letter-spacing: 2rpx;
}

/* ---- 表单行 ---- */
.form-item {
    padding: 8rpx 0 18rpx;
}
.form-divider {
    height: 1rpx;
    background: #f0f3f8;
    margin: 0 -4rpx 18rpx;
}
.label {
    display: block;
    font-size: 22rpx;
    font-weight: 600;
    color: #8a97aa;
    letter-spacing: 2rpx;
    margin-bottom: 12rpx;
    text-transform: uppercase;
}

/* ---- Picker ---- */
.picker-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22rpx 24rpx;
    background: #f4f7fb;
    border-radius: 12rpx;
    border: 1.5rpx solid #e8ecf4;
    transition: border-color 0.2s;
}
.picker-box.filled {
    border-color: #1a6ec7;
    background: #f0f6ff;
}
.picker-text {
    font-size: 28rpx;
    color: #1a2236;
    flex: 1;
}
.picker-box:not(.filled) .picker-text {
    color: #b0bac8;
}
.picker-arrow {
    font-size: 36rpx;
    color: #b0bac8;
    font-weight: 300;
    margin-left: 12rpx;
}
.picker-box.filled .picker-arrow {
    color: #1a6ec7;
}

/* ---- 数量输入 ---- */
.label-row {
    display: flex;
    align-items: baseline;
    gap: 16rpx;
    margin-bottom: 12rpx;
}
.label-row .label {
    margin-bottom: 0;
}
.moq-hint {
    font-size: 22rpx;
    color: #ff6b3d;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
}
.qty-wrapper {
    width: 100%;
    background: #f4f7fb;
    border-radius: 12rpx;
    border: 1.5rpx solid #e8ecf4;
    padding: 22rpx 24rpx;
    box-sizing: border-box;
}
.qty-input {
    width: 100%;
    font-size: 28rpx;
    color: #1a2236;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    line-height: 1.4;
}
.qty-placeholder {
    color: #b0bac8;
}

/* ---- 磨商标 Toggle ---- */
.toggle-group {
    display: flex;
    gap: 20rpx;
}
.toggle-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 20rpx 0;
    background: #f4f7fb;
    border-radius: 12rpx;
    border: 1.5rpx solid #e8ecf4;
    font-size: 28rpx;
    color: #5a6478;
    font-weight: 500;
}
.toggle-item.active {
    background: #0d1526;
    border-color: #0d1526;
    color: #ffffff;
}
.toggle-dot { font-size: 20rpx; color: #c8aa6e; }
.toggle-dot-off { font-size: 20rpx; color: #b0bac8; }
.toggle-item.active .toggle-dot-off { color: rgba(255,255,255,0.4); }

/* ---- 价格预览卡 ---- */
.price-card {
    margin: 24rpx -4rpx 12rpx;
    background: #0d1526;
    border-radius: 16rpx;
    padding: 28rpx 32rpx;
    overflow: hidden;
    position: relative;
}
.price-card::before {
    content: '';
    position: absolute;
    top: -30rpx;
    right: -30rpx;
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background: rgba(200, 170, 110, 0.08);
    pointer-events: none;
}
.price-row {
    display: flex;
    align-items: center;
}
.price-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}
.price-divider-v {
    width: 1rpx;
    height: 60rpx;
    background: rgba(255,255,255,0.12);
    margin: 0 16rpx;
}
.price-tag {
    font-size: 20rpx;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    letter-spacing: 3rpx;
}
.price-amount {
    font-size: 22rpx;
    color: rgba(255,255,255,0.7);
}
.price-num {
    font-size: 34rpx;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -1rpx;
}
.total-highlight .price-num {
    color: #c8aa6e;
}

.price-input-wrap {
    display: flex;
    align-items: baseline;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8rpx;
    padding: 8rpx 16rpx;
    width: fit-content;
}

.price-prefix {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.7);
}

.price-input {
    font-size: 34rpx;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -1rpx;
    width: 140rpx;
    text-align: right;
    background: transparent;
    border: none;
}

.price-input-wrap.readonly {
    background: rgba(255, 255, 255, 0.05);
}

.price-text {
    font-size: 34rpx;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: -1rpx;
    line-height: 1.4;
}

.price-tip {
    display: flex;
    align-items: center;
    margin-top: 16rpx;
    padding: 16rpx;
    background: rgba(239, 68, 68, 0.15);
    border-radius: 8rpx;
    border: 1rpx solid rgba(239, 68, 68, 0.3);
}

.tip-icon {
    margin-right: 8rpx;
    flex-shrink: 0;
}

.tip-text {
    font-size: 22rpx;
    color: #ffffff;
    line-height: 1.5;
    font-weight: 500;
}

/* ---- 操作按钮 ---- */
.action-area {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    margin-bottom: 20rpx;
}
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    height: 96rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-weight: 600;
    letter-spacing: 2rpx;
    border: none;
    width: 100%;
}
.btn-icon { font-size: 28rpx; }
.btn-add {
    background: #0d1526;
    color: #ffffff;
    box-shadow: 0 6rpx 24rpx rgba(13, 21, 38, 0.22);
}
.btn-generate {
    background: #ffffff;
    color: #0d1526;
    border: 1.5rpx solid #d8dde8;
    box-shadow: 0 2rpx 8rpx rgba(13, 21, 38, 0.06);
}
.btn-contract {
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    color: #c8aa6e;
    border: 1.5rpx solid #c8aa6e;
    box-shadow: 0 6rpx 24rpx rgba(13, 21, 38, 0.2);
}

/* ---- 报价列表 ---- */
.quote-list {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx 28rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 16rpx rgba(13, 21, 38, 0.06);
}
.list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #edf0f5;
}
.list-title {
    font-size: 28rpx;
    font-weight: 700;
    color: #1a2236;
    letter-spacing: 1rpx;
}
.list-count-badge {
    padding: 6rpx 20rpx;
    background: #f0f6ff;
    border-radius: 20rpx;
    border: 1rpx solid #c5d8f5;
}
.list-count {
    font-size: 22rpx;
    font-weight: 600;
    color: #1a6ec7;
}

/* ---- 报价项目 ---- */
.quote-item {
    padding: 24rpx;
    margin-bottom: 16rpx;
    background: #f8fafc;
    border-radius: 14rpx;
    border: 1rpx solid #edf1f8;
}
.quote-item-header {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 18rpx;
}
.item-index-badge {
    width: 44rpx;
    height: 44rpx;
    border-radius: 10rpx;
    background: #0d1526;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.item-index-badge text {
    font-size: 22rpx;
    font-weight: 700;
    color: #c8aa6e;
}
.item-valve-name {
    flex: 1;
    font-size: 26rpx;
    font-weight: 600;
    color: #1a2236;
    line-height: 1.4;
}
.delete-btn {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    background: #fff0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.delete-btn text {
    font-size: 22rpx;
    color: #e05252;
    font-weight: 600;
}

/* 材质标签 */
.item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-bottom: 20rpx;
}
.tag {
    padding: 6rpx 18rpx;
    background: #edf1f8;
    border-radius: 6rpx;
    font-size: 22rpx;
    color: #5a6478;
    font-weight: 500;
    letter-spacing: 1rpx;
}
.tag-type {
    background: #fff8ec;
    color: #a07830;
    border: 1rpx solid #e8d09a;
}

/* 底部价格行 */
.item-price-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-top: 16rpx;
    border-top: 1rpx solid #edf1f8;
}
.item-meta {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
}
.meta-item {
    font-size: 22rpx;
    color: #8a97aa;
}
.item-price-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4rpx;
}
.unit-price {
    font-size: 22rpx;
    color: #8a97aa;
}
.total-item-price {
    font-size: 34rpx;
    font-weight: 700;
    color: #1a2236;
    letter-spacing: -0.5rpx;
}

/* ---- 合计栏 ---- */
.quote-total-bar {
    margin-top: 24rpx;
    padding: 28rpx 32rpx;
    background: #0d1526;
    border-radius: 14rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.total-bar-label {
    font-size: 24rpx;
    font-weight: 600;
    color: rgba(255,255,255,0.55);
    letter-spacing: 3rpx;
}
.total-bar-value {
    font-size: 44rpx;
    font-weight: 700;
    color: #c8aa6e;
    letter-spacing: -1rpx;
}

/* ---- 空状态 ---- */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0 40rpx;
    gap: 16rpx;
}
.empty-icon { font-size: 72rpx; }
.empty-text {
    font-size: 30rpx;
    font-weight: 600;
    color: #8a97aa;
}
.empty-sub {
    font-size: 24rpx;
    color: #b0bac8;
    text-align: center;
    line-height: 1.6;
}

/* ---- 底部安全区 ---- */
.bottom-safe { height: 60rpx; }

/* ---- 自定义Loading弹窗 ---- */
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

/* ===== 购销合同模板选择弹窗 ===== */
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
}

.tpl-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 14rpx;
    font-size: 28rpx;
    font-weight: 600;
    letter-spacing: 2rpx;
}

.tpl-btn-cancel {
    background: #f1f5f9;
    color: #475569;
}

.tpl-btn-confirm {
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    color: #ffffff;
}
</style>