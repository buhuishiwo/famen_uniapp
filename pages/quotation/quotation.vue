<template>
    <view class="page-root">
        <navigation-bar title="报价表" :back="true" color="white"
            background="linear-gradient(135deg, #0d1526 0%, #1e293b 100%)"></navigation-bar>

        <scroll-view class="scrollarea" scroll-y>
            <view class="container">
                
                <view class="company-header">
                    <view class="company-logo">
                        <text class="logo-text">奇胜阀门有限公司</text>
                        <text class="logo-en">CHISUN VALVE CO., LTD.</text>
                    </view>
                    <view class="company-info">
                        <text class="info-item">官网：www.chisun.cn / www.qishengvalve.com</text>
                        <text class="info-item">邮箱：qs@chisun.cn</text>
                        <text class="info-item">地址：浙江省温州市空港新区兴业路8号 邮编：325013</text>
                        <text class="info-item">电话：15777828587</text>
                    </view>
                </view>

                <view class="quotation-title-wrap">
                    <view class="title-line"></view>
                    <text class="quotation-title">报 价 单</text>
                    <view class="title-line"></view>
                </view>

                <view class="card">
                    <view class="info-row">
                        <text class="info-label">报价员</text>
                        <input class="info-input" placeholder="请输入报价员姓名" placeholder-class="placeholder-style" @input="onSalespersonInput"
                            :value="salesperson" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">客户名称</text>
                        <input class="info-input" placeholder="请输入客户名称" placeholder-class="placeholder-style" @input="onCustomerNameInput"
                            :value="customerName" />
                    </view>
                </view>

                <view class="table-card">
                    <scroll-view scroll-x class="table-scroll">
                        <view class="table-wrap">
                            <view class="table-header">
                                <view class="header-cell cell-product">产品名称</view>
                                <view class="header-cell cell-model">型号规格</view>
                                <view class="header-cell cell-material">闸板材质</view>
                                <view class="header-cell cell-seal">阀杆材质</view>
                                <view class="header-cell cell-quantity">数量</view>
                                <view class="header-cell cell-price">单价</view>
                                <view class="header-cell cell-branding">磨标费</view>
                                <view class="header-cell cell-total">总价</view>
                            </view>

                            <view class="table-body">
                                <view class="table-row" v-for="(item, index) in quoteData" :key="index" :class="{ 'row-odd': index % 2 === 1 }">
                                    <view class="table-cell cell-product">{{ item.productType }}</view>
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
                    <text class="card-inner-title">选购产品信息</text>
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
                                    <text class="detail-label">规格</text>
                                    <text class="detail-value">DN{{ item.model }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">产品类型</text>
                                    <text class="detail-value">{{ item.productType }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">阀体材质</text>
                                    <text class="detail-value">{{ item.bodyMaterial }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">闸板材质</text>
                                    <text class="detail-value">{{ item.gateMaterial }}</text>
                                </view>
                                <view class="detail-cell">
                                    <text class="detail-label">阀杆材质</text>
                                    <text class="detail-value">{{ item.stemMaterial }}</text>
                                </view>
                                <view class="detail-cell" v-if="item.yokeMaterial">
                                    <text class="detail-label">支架材质</text>
                                    <text class="detail-value">{{ item.yokeMaterial }}</text>
                                </view>
                            </view>

                            <view class="preview-product-footer">
                                <view class="footer-left">
                                    <text class="footer-qty">× {{ item.quantity }} 件</text>
                                    <text class="footer-branding" v-if="item.hasBranding">磨标 ¥{{ item.brandingFee }}/件</text>
                                </view>
                                <view class="footer-right">
                                    <text class="footer-unit">¥{{ item.unitPrice }}/件</text>
                                    <text class="footer-total">¥{{ item.totalPrice }}</text>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="preview-summary-bar">
                        <text class="summary-label">合计金额</text>
                        <text class="summary-value">¥{{ totalAmount }}</text>
                    </view>
                    <view class="final-price-row">
                        <text class="final-price-label">确认报价金额</text>
                        <view class="final-price-input-wrap">
                            <text class="final-price-prefix">¥</text>
                            <input class="final-price-input" type="digit" placeholder="请输入最终报价金额" placeholder-class="placeholder-style"
                                :value="finalPrice" @input="onFinalPriceInput" />
                        </view>
                    </view>
                </view>

                <view class="card">
                    <text class="card-inner-title">备注信息</text>
                    <view class="textarea-box">
                        <textarea class="note-input" placeholder="请输入备注信息" placeholder-class="placeholder-style" :auto-height="true" @input="onNoteInput" :value="note" maxlength="-1" />
                    </view>
                </view>

                <view class="card">
                    <view class="info-row">
                        <text class="info-label">付款方式</text>
                        <input class="info-input" placeholder="请输入付款方式" placeholder-class="placeholder-style" @input="onPaymentMethodInput"
                            :value="paymentMethod" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">包装方式</text>
                        <input class="info-input" placeholder="请输入包装方式" placeholder-class="placeholder-style" @input="onPackagingInput" :value="packaging" />
                    </view>
                </view>

                <view class="card">
                    <view class="info-row">
                        <text class="info-label">报 价 人</text>
                        <input class="info-input" placeholder="请输入报价人" placeholder-class="placeholder-style" @input="onQuoterInput"
                            :value="quoter" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">联系手机</text>
                        <input class="info-input" placeholder="请输入手机号码" placeholder-class="placeholder-style" @input="onQuoterPhoneInput"
                            :value="quoterPhone" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">报有效期</text>
                        <input class="info-input" placeholder="请输入有效期" placeholder-class="placeholder-style" @input="onValidityInput"
                            :value="validity" />
                    </view>
                    <view class="divider-line"></view>
                    <view class="info-row">
                        <text class="info-label">报价日期</text>
                        <text class="info-value date-highlight">{{ currentDate }}</text>
                    </view>
                </view>

                <view class="button-group">
                    <button class="btn btn-primary" @tap="generateQuotation">生成并保存报价表</button>
                    <button class="btn btn-secondary" open-type="share">分享报价表</button>
                    <button class="btn btn-back" @tap="onBack">返回继续添加</button>
                </view>
            </view>
        </scroll-view>

        <canvas canvas-id="quotationCanvas"
            style="width: 5000rpx; height: 5000rpx; position: fixed; left: -9999rpx"></canvas>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';
import { quotationApi, priceApi } from '@/utils/cloud-api.js';

export default {
    components: {
        navigationBar
    },
    data() {
        return {
            quoteData: [],
            currentDate: '',
            customerName: '',
            salesperson: '',
            note: '',
            paymentMethod: '预定定金30%，付清余款发货。',
            packaging: '木箱包装。可以提供产品使用说明，产品材质报告，产品检测报告。',
            quoter: '童惠业',
            quoterPhone: '13957713583',
            validity: '15天',
            finalPrice: '',

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
    onLoad(options) {
        if (options.data) {
            const quoteData = JSON.parse(decodeURIComponent(options.data));
            const formattedData = quoteData.map((item) => ({
                    productType: item.productType || '常规品',
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
            title: '您的特约报价单',
            path: '/pages/quotation/quotation'
        };
    },
    methods: {
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}年${month}月${day}日`;
        },

        // 输入框双向绑定函数（统一采用Vue直接赋值模式，拒绝混合setData导致的错误）
        onCustomerNameInput(e) { this.customerName = e.detail.value; },
        onSalespersonInput(e) { this.salesperson = e.detail.value; },


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

        // 保存报价数据到数据库
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
                    productType: item.productType || 'regular'
                }))
            };

            try {
                const result = await quotationApi.create(quotationData);
                console.log('报价数据保存成功:', result);
                uni.showToast({
                    title: '报价数据已保存',
                    icon: 'success',
                    duration: 2000
                });
                return result;
            } catch (error) {
                console.error('保存报价数据失败:', error);
                uni.showToast({
                    title: '保存失败，请检查网络',
                    icon: 'none',
                    duration: 2000
                });
                throw error;
            }
        },

        // 自动换行绘制函数
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

        // 生成报价表图片并保存至本地
        async generateQuotation() {
            // 先保存报价数据到数据库
            try {
                await this.saveQuotationToDatabase();
            } catch (error) {
                console.error('保存报价数据失败:', error);
                // 即使保存失败，也继续生成图片
            }

            uni.showLoading({
                title: '正在输出精工原件...',
                mask: true
            });

            const ctx = uni.createCanvasContext('quotationCanvas', this);
            const scale = 1;
            const width = 750;
            let y = 30 * scale;

            // 填充高端卡片白背景
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

                    // 绘制工业级页头
                    ctx.setFontSize(26);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText('奇胜阀门有限公司', infoX, infoY + 26);
                    
                    ctx.setFontSize(14);
                    ctx.setFillStyle('#c8aa6e');
                    ctx.fillText('CHISUN VALVE CO., LTD.', infoX, infoY + 48);

                    infoY += 70;
                    ctx.setFontSize(13);
                    ctx.setFillStyle('#64748b');
                    const companyInfo = [
                        '官网：www.chisun.cn / www.qishengvalve.com',
                        '邮箱：qs@chisun.cn',
                        '地址：浙江省温州市空港新区兴业路8号 邮编：325013',
                        '电话：15777828587'
                    ];

                    companyInfo.forEach(line => {
                        ctx.fillText(line, infoX, infoY);
                        infoY += 20;
                    });

                    y = Math.max(logoY + logoHeight + 40, infoY + 20);

                    // 绘制标题装饰线
                    ctx.setStrokeStyle('#e2e8f0');
                    ctx.setLineWidth(1);
                    ctx.beginPath();
                    ctx.moveTo(30, y + 15);
                    ctx.lineTo(260, y + 15);
                    ctx.moveTo(490, y + 15);
                    ctx.lineTo(720, y + 15);
                    ctx.stroke();

                    // 标题
                    ctx.setFontSize(24);
                    ctx.setFillStyle('#0d1526');
                    ctx.setTextAlign('center');
                    ctx.fillText('报 价 单', 375, y + 24);
                    ctx.setTextAlign('left');
                    y += 60 * scale;

                    // 报价员
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#475569');
                    ctx.fillText('报价员：', 30, y);
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.salesperson || '未指定报价员', 110, y);
                    y += 35 * scale;

                    // 客户名称
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#475569');
                    ctx.fillText('客户名称：', 30, y);
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.customerName || '未指定客户', 110, y);
                    y += 35 * scale;

                    // 绘制核心表格明细
                    const totalWidth = 690;
                    const startX = 30;
                    const headers = ['产品名称', '型号规格', '闸板材质', '阀杆材质', '数量', '单价', '总价'];
                    const cellWidths = [130, 170, 80, 80, 50, 90, 110];

                    // 表头背景色更改为深蓝钢铁色
                    ctx.setFillStyle('#0d1526');
                    ctx.fillRect(startX, y, totalWidth, 36);
                    ctx.setFillStyle('#FFFFFF');
                    ctx.setFontSize(13);
                    
                    let x = startX + 8;
                    headers.forEach((h, i) => {
                        ctx.fillText(h, x, y + 23);
                        x += cellWidths[i];
                    });
                    y += 36 * scale;

                    // 循环生成行
                    const rowHeight = 38;
                    const specRowHeight = 28;
                    this.quoteData.forEach((item, idx) => {
                        x = startX + 8;
                        const values = [
                            item.productType,
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
                            ctx.fillText(val || '', x, y + 24);
                            x += cellWidths[i];
                        });

                        y += rowHeight * scale;

                        // 绘制规格参数行（跨列显示）
                        ctx.setFontSize(11);
                        ctx.setFillStyle('#64748b');
                        ctx.fillText('规格参数：', startX + 8, y + 18);
                        
                        x = startX + 60;
                        const specs = [
                            { label: '最高承压', en: 'Max Pressure', value: item.maxPressure, unit: 'BAR' },
                            { label: '单重', en: 'Unit Weight', value: item.unitWeight, unit: 'KG' },
                            { label: '圈数', en: 'Laps', value: item.laps, unit: '' },
                            { label: '扭矩', en: 'Torque', value: item.torque, unit: 'N.M' }
                        ];

                        specs.forEach((spec, i) => {
                            if (spec.value) {
                                const labelText = `${spec.label}(${spec.en}): ${spec.value}${spec.unit}`;
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

                    // 绘制条款与备注段落
                    y += 30 * scale;
                    ctx.setFontSize(15);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText('备注及技术要求：', 30, y);
                    y += 24 * scale;
                    y = this.drawText(ctx, this.note, 30, y, 690, 22, 13) + 15;

                    ctx.setFontSize(14);
                    ctx.setFillStyle('#475569');
                    ctx.fillText('付款方式：', 30, y);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.paymentMethod, 105, y);
                    y += 26 * scale;

                    ctx.setFillStyle('#475569');
                    ctx.fillText('包装方式：', 30, y);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.packaging, 105, y);
                    y += 26 * scale;

                    ctx.setFillStyle('#475569');
                    ctx.fillText('确认报价金额：', 30, y);
                    ctx.setFillStyle('#dc2626');
                    ctx.setFontSize(16);
                    ctx.fillText('¥' + (this.finalPrice || this.totalAmount), 130, y);
                    ctx.setFontSize(14);
                    y += 35 * scale;

                    // 底部边栏与签章区
                    ctx.setStrokeStyle('#e2e8f0');
                    ctx.beginPath();
                    ctx.moveTo(30, y);
                    ctx.lineTo(720, y);
                    ctx.stroke();
                    y += 25 * scale;

                    ctx.setFontSize(14);
                    ctx.setFillStyle('#475569');
                    ctx.fillText('报价制单人：', 30, y);
                    ctx.getActions;
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.quoter, 115, y);

                    ctx.setFillStyle('#475569');
                    ctx.fillText('联系电话：', 280, y);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.quoterPhone, 350, y);
                    y += 26 * scale;

                    ctx.setFillStyle('#475569');
                    ctx.fillText('报价有效期：', 30, y);
                    ctx.setFillStyle('#c8aa6e'); // 强调色高亮
                    ctx.fillText(this.validity, 115, y);

                    ctx.setFillStyle('#475569');
                    ctx.fillText('发布日期：', 280, y);
                    ctx.setFillStyle('#0d1526');
                    ctx.fillText(this.currentDate, 350, y);
                    y += 60 * scale;

                    // 渲染并保存至用户手机本地相册
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
                                        uni.showToast({ title: '报价单已妥善存储到相册', icon: 'success' });
                                    },
                                    fail: () => {
                                        uni.showToast({ title: '请开启相册读写权限', icon: 'none' });
                                    }
                                });
                            },
                            fail: (err) => {
                                console.error(err);
                                uni.showToast({ title: '高精度渲染失败', icon: 'error' });
                            },
                            complete: () => uni.hideLoading()
                        });
                    });
                },
                fail: (err) => {
                    console.error(err);
                    uni.showToast({ title: '企业徽标调取失败', icon: 'error' });
                    uni.hideLoading();
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
    width: 100% !important; /* 深度覆写，拒绝单列挤压 */
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
    min-width: 890rpx; /* 给予字段足够的横向平铺空间 */
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
    background-color: #f8fafc; /* 交替斑马纹隔行变色 */
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
</style>