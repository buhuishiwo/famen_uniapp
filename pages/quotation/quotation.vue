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
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';
import { quotationApi, priceApi } from '@/utils/cloud-api.js';
import i18n from '@/locale';

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
            toastType: 'success'

        };
    },
    computed: {
        totalAmount() {
            const total = this.quoteData.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
            return total.toFixed(2);
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

        async generateQuotation() {
            this.showLoading = true;
            this.loadingText = this.$t('quotation.priceGenerating');

            const that = this;

            try {
                await this.saveQuotationToDatabase();
            } catch (error) {
                console.error('保存报价数据失败:', error);
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
                    const headers = [
                        this.$t('quotation.productName'),
                        this.$t('quotation.modelSpec'),
                        this.$t('quotation.gateMaterialCol'),
                        this.$t('quotation.stemMaterialCol'),
                        this.$t('quotation.quantityCol'),
                        this.$t('quotation.unitPriceCol'),
                        this.$t('quotation.totalPriceCol')
                    ];
                    const cellWidths = [110, 120, 100, 100, 65, 85, 90];
                    const totalCellWidth = cellWidths.reduce((a, b) => a + b, 0);

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
                    this.quoteData.forEach((item, idx) => {
                        x = startX + 8;
                        const values = [
                            this.translateProductType(item.productType),
                            item.productName + '-DN' + item.model,
                            item.gateMaterial || '',
                            item.stemMaterial || '',
                            String(item.quantity),
                            '¥' + item.unitPrice,
                            '¥' + item.totalPrice
                        ];

                        if (idx % 2 === 1) {
                            ctx.setFillStyle('#f8fafc');
                            ctx.fillRect(startX, y, totalWidth, rowHeight + specRowHeight);
                        }

                        values.forEach((val, i) => {
                            if (i === 6) ctx.setFillStyle('#dc2626');
                            else ctx.setFillStyle('#1e293b');
                            const maxWidth = cellWidths[i] - 8;
                            let displayVal = val || '';
                            if (val) {
                                const textWidth = ctx.measureText(val).width;
                                if (textWidth > maxWidth) {
                                    let truncated = val;
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

                        ctx.setFontSize(11);
                        ctx.setFillStyle('#64748b');
                        ctx.fillText(this.$t('quotation.pricingInfo'), startX + 8, y + 18);
                        
                        x = startX + 60;
                        const isEn = i18n.getCurrentLanguage() === 'en-US';
                        const specs = [
                            { label: this.$t('quotation.maxPressure'), en: 'Max Pressure', value: item.maxPressure, unit: 'BAR' },
                            { label: this.$t('quotation.unitWeight'), en: 'Unit Weight', value: item.unitWeight, unit: this.$t('quotation.weightUnit') },
                            { label: this.$t('quotation.laps'), en: 'Laps', value: item.laps, unit: '' },
                            { label: this.$t('quotation.torque'), en: 'Torque', value: item.torque, unit: this.$t('quotation.torqueUnit') }
                        ];

                        specs.forEach((spec, i) => {
                            if (spec.value) {
                                const labelText = isEn
                                    ? `${spec.label}: ${spec.value}${spec.unit}`
                                    : `${spec.label}(${spec.en}): ${spec.value}${spec.unit}`;
                                const labelWidth = ctx.measureText(labelText).width;
                                if (x + labelWidth <= startX + totalWidth - 10) {
                                    ctx.setFillStyle('#475569');
                                    ctx.fillText(labelText, x, y + 18);
                                    x += labelWidth + 15;
                                }
                            }
                        });

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
                            success: (res) => {
                                uni.saveImageToPhotosAlbum({
                                    filePath: res.tempFilePath,
                                    success: () => {
                                        that.showToast(this.$t('quotation.savedToAlbum'), 'success');
                                    },
                                    fail: () => {
                                        that.showToast(this.$t('quotation.needAlbumPermission'), 'error');
                                    }
                                });
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
</style>
