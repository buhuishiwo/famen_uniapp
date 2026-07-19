<template>
    <view>
        <navigation-bar :title="currentProductSeries || '阀门选择'" :back="true" color="white"
            background="linear-gradient(135deg, #1a2236 0%, #0d1526 100%);" @back="onBackToCategory"></navigation-bar>

        <scroll-view class="scroll-content" scroll-y>

            <!-- 顶部标题栏 -->
            <view class="page-header">
                <view class="header-badge">
                    <text class="badge-dot"></text>
                    <text class="badge-text">配置报价</text>
                </view>
                <text class="page-title">{{ currentProductSeries || '阀门选择' }}</text>
                <text class="page-subtitle">请依次选择以下参数生成报价</text>
            </view>

            <!-- 表单部分 -->
            <view class="form-section">
                <view class="form-section-label">
                    <text class="section-icon">⚙</text>
                    <text class="section-name">产品配置</text>
                </view>

                <view class="form-item">
                    <text class="label">阀门型号</text>
                    <picker class="picker" mode="selector" :range="valveTypes" range-key="name" @change="onSelectValve">
                        <view class="picker-box" :class="{ filled: selectedValve }">
                            <text class="picker-text">{{ selectedValve ? selectedValve.name : '请选择阀门型号' }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">规格尺寸 (DN)</text>
                    <picker class="picker" mode="selector" :range="specifications" range-key="name" @change="onSelectSpec">
                        <view class="picker-box" :class="{ filled: selectedSpec }">
                            <text class="picker-text">{{ selectedSpec ? selectedSpec.name : '请选择规格尺寸' }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">阀体材质</text>
                    <picker class="picker" mode="selector" :range="valveBodyTypes" range-key="name" @change="onSelectValveBody">
                        <view class="picker-box" :class="{ filled: SelectValveBody }">
                            <text class="picker-text">{{ SelectValveBody ? SelectValveBody.name : '请选择阀体材质' }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">闸板材质</text>
                    <picker class="picker" mode="selector" :range="gatePlateTypes" range-key="name" @change="onSelectGatePlate">
                        <view class="picker-box" :class="{ filled: selectedGatePlate }">
                            <text class="picker-text">{{ selectedGatePlate ? selectedGatePlate.name : '请选择闸板材质' }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">阀杆材质</text>
                    <picker class="picker" mode="selector" :range="rodMaterials" range-key="name" @change="onSelectRodMaterial">
                        <view class="picker-box" :class="{ filled: selectedRodMaterial }">
                            <text class="picker-text">{{ selectedRodMaterial ? selectedRodMaterial.name : '请选择阀杆材质' }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">支架材质</text>
                    <picker class="picker" mode="selector" :range="yokeMaterials" range-key="name" @change="onSelectYokeMaterial">
                        <view class="picker-box" :class="{ filled: selectedYokeMaterial }">
                            <text class="picker-text">{{ selectedYokeMaterial ? selectedYokeMaterial.name : '请选择支架材质' }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">产品类型</text>
                    <picker class="picker" mode="selector" :range="productTypeOptions" @change="onSelectProductType">
                        <view class="picker-box filled">
                            <text class="picker-text">{{ selectedProductType }}</text>
                            <text class="picker-arrow">›</text>
                        </view>
                    </picker>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">数量</text>
                    <view class="qty-wrapper">
                        <input class="qty-input" type="number" :value="quantity" @input="onQuantityChange"
                            placeholder="请输入数量" placeholder-class="qty-placeholder" />
                    </view>
                </view>

                <view class="form-divider"></view>

                <view class="form-item">
                    <text class="label">磨商标</text>
                    <view class="toggle-group">
                        <view class="toggle-item" :class="{ active: selectedBranding === true }" @tap="onSelectBranding(true)">
                            <text class="toggle-dot" v-if="selectedBranding === true">●</text>
                            <text class="toggle-dot-off" v-else>○</text>
                            <text>是</text>
                        </view>
                        <view class="toggle-item" :class="{ active: selectedBranding === false }" @tap="onSelectBranding(false)">
                            <text class="toggle-dot" v-if="selectedBranding === false">●</text>
                            <text class="toggle-dot-off" v-else>○</text>
                            <text>否</text>
                        </view>
                    </view>
                </view>

                <!-- 价格预览 -->
                <view class="price-card" v-if="selectedValve && selectedSpec && selectedGatePlate && selectedRodMaterial">
                    <view class="price-row">
                        <view class="price-col">
                            <text class="price-tag">单　价</text>
                            <text class="price-amount">¥<text class="price-num">{{ currentPrice }}</text></text>
                        </view>
                        <view class="price-divider-v"></view>
                        <view class="price-col">
                            <text class="price-tag">预估总价</text>
                            <text class="price-amount total-highlight">¥<text class="price-num">{{ totalPreviewPrice }}</text></text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-area">
                <button class="btn btn-add" @tap="onAddToQuote">
                    <text class="btn-icon">＋</text>
                    <text>添加到报价表</text>
                </button>
                <button class="btn btn-generate" v-if="quoteItems.length > 0" @tap="onGenerateQuotation">
                    <text class="btn-icon">📋</text>
                    <text>生成报价表</text>
                </button>
            </view>

            <!-- 报价列表 -->
            <view class="quote-list" v-if="quoteItems.length > 0">
                <view class="list-header">
                    <text class="list-title">📦 报价明细</text>
                    <view class="list-count-badge">
                        <text class="list-count">{{ quoteItems.length }} 项</text>
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
                            <text class="meta-item">× {{ item.quantity }} 件</text>
                            <text class="meta-item" v-if="item.brandingFee">磨标 ¥{{ item.brandingFee }}/件</text>
                        </view>
                        <view class="item-price-right">
                            <text class="unit-price">¥{{ item.unitPrice }}/件</text>
                            <text class="total-item-price">¥{{ item.totalPrice }}</text>
                        </view>
                    </view>
                </view>

                <view class="quote-total-bar">
                    <text class="total-bar-label">合计金额</text>
                    <text class="total-bar-value">¥{{ totalPrice }}</text>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-else-if="!quoteItems || quoteItems.length === 0">
                <text class="empty-icon">📝</text>
                <text class="empty-text">暂无报价项目</text>
                <text class="empty-sub">配置好参数后点击「添加到报价表」</text>
            </view>

            <view class="bottom-safe"></view>
        </scroll-view>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';
import { priceApi } from '@/utils/cloud-api';

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
                    '常规品': 1.0,
                    '新品': 1.3
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
            productTypeOptions: ['常规品', '新品'],

            // 报价系数规则（从数据库加载，替代硬编码起订量）
            pricingRules: [],

            // 用户选择
            SelectValveBody: null,
            selectedValve: null,
            selectedSpec: null,
            selectedGatePlate: null,
            selectedRodMaterial: null,
            selectedYokeMaterial: null,
            selectedProductType: '常规品',
            selectedBranding: false,
            quantity: 1,
            // 报价数据
            quoteItems: [],
            totalPrice: '0.00',
            currentPrice: '0.00',
            totalPreviewPrice: '0.00',
        };
    },
    onLoad() {
        this.currentProductSeries = uni.getStorageSync('currentProductSeries') || '';
        this.loadDataFromBackend();
        const cachedQuoteItems = uni.getStorageSync('quoteItems');
        if (cachedQuoteItems) {
            this.quoteItems = cachedQuoteItems;
            this.calculateTotalPrice();
        }
    },
    methods: {
        async loadDataFromBackend() {
            uni.showLoading({ title: '加载数据中...', mask: true });
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
                uni.showToast({ title: '加载数据失败', icon: 'none' });
            } finally {
                uni.hideLoading();
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
                    title: '暂无数据',
                    content: this.currentProductSeries + ' 暂未录入产品数据，请先导入价格后再试。',
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
        setQWStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQUStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQVStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQZStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQBStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQCStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQHStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQCAStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQCBStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQCGStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQMBStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQMDYStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQMGStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQUPStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQWFStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQWLYStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQYAStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQYStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQJStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        setQMGStandard() { this.setMaterialStandard(this.selectedValve?.name); },
        /**
         * 获取指定系列+DN规格的起订量
         * 优先查报价系数规则表，其次查价格表
         */
        getMinOrderQuantity(specSize) {
            // 1. 优先从报价系数规则获取
            if (this.pricingRules && this.pricingRules.length > 0) {
                var seriesName = this.currentProductSeries;
                var rule = this.pricingRules.find(function(r) {
                    return r.seriesName === seriesName && specSize >= r.dnMin && specSize <= r.dnMax;
                });
                if (rule && rule.minOrderQty) return rule.minOrderQty;
            }
            // 2. 其次从 priceData 获取
            if (this.selectedValve && this.priceData) {
                var priceItem = this.priceData.find(function(p) {
                    return p.valveName === this.selectedValve.name && p.size === specSize;
                }, this);
                if (priceItem && priceItem.minOrderQty) return priceItem.minOrderQty;
            }
            // 3. 兜底：50
            return 50;
        },

        /**
         * 获取报价系数：根据系列、DN、数量、是否磨标
         * 返回最终单价应乘的系数
         */
        getPricingCoefficient(seriesName, valveName, specSize, quantity, hasBranding) {
            if (!this.pricingRules || this.pricingRules.length === 0) return 1.0;

            // 查找匹配规则：先精确匹配产品名，再匹配空产品名（全系列通用）
            var findRule = function(productName) {
                return this.pricingRules.find(function(r) {
                    return r.seriesName === seriesName
                        && (r.productName || '') === (productName || '')
                        && specSize >= r.dnMin
                        && specSize <= r.dnMax;
                });
            }.bind(this);

            var rule = findRule(valveName) || findRule('');

            if (!rule) return 1.0; // 无规则匹配 → 原价

            var moqMet = quantity >= rule.minOrderQty;
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
            if (this.currentProductSeries === 'QW系列' && this.selectedSpec) {
                this.setQWStandard();
            }
            this.updateCurrentPrice();
        },
        onSelectSpec(e) {
            this.setData({ selectedSpec: this.specifications[e.detail.value] });
            const minQty = this.getMinOrderQuantity(this.selectedSpec.name);
            this.setData({ quantity: minQty });
            if (this.currentProductSeries === 'QW系列' && this.selectedValve) {
                this.setQWStandard();
            } else if (this.currentProductSeries === 'QU系列' && this.selectedValve) {
                this.setQUStandard();
            } else if (this.currentProductSeries === 'QV系列' && this.selectedValve) {
                this.setQVStandard();
            } else if (this.currentProductSeries === 'QZ系列' && this.selectedValve) {
                this.setQZStandard();
            } else if (this.currentProductSeries === 'QB系列' && this.selectedValve) {
                this.setQBStandard();
            } else if (this.currentProductSeries === 'QC系列' && this.selectedValve) {
                this.setQCStandard();
            } else if (this.currentProductSeries === 'QH系列' && this.selectedValve) {
                this.setQHStandard();
            } else if (this.currentProductSeries === 'QCA系列' && this.selectedValve) {
                this.setQCAStandard();
            } else if (this.currentProductSeries === 'QCB系列' && this.selectedValve) {
                this.setQCBStandard();
            } else if (this.currentProductSeries === 'QCG系列' && this.selectedValve) {
                this.setQCGStandard();
            } else if (this.currentProductSeries === 'QMB系列' && this.selectedValve) {
                this.setQMBStandard();
            } else if (this.currentProductSeries === 'QMG系列' && this.selectedValve) {
                this.setQMGStandard();
            } else if (this.currentProductSeries === 'QMDY系列' && this.selectedValve) {
                this.setQMDYStandard();
            } else if (this.currentProductSeries === 'QUP系列' && this.selectedValve) {
                this.setQUPStandard();
            } else if (this.currentProductSeries === 'QWF系列' && this.selectedValve) {
                this.setQWFStandard();
            } else if (this.currentProductSeries === 'QWLY系列' && this.selectedValve) {
                this.setQWLYStandard();
            } else if (this.currentProductSeries === 'QY系列' && this.selectedValve) {
                this.setQYStandard();
            } else if (this.currentProductSeries === 'QYA系列' && this.selectedValve) {
                this.setQYAStandard();
            } else if (this.currentProductSeries === 'QJ系列' && this.selectedValve) {
                this.setQJStandard();
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
        getMaterialPriceDiff(seriesName, partName, baseMaterial, targetMaterial, dn) {
            if (!baseMaterial || !targetMaterial || baseMaterial === targetMaterial) return 0;
            const matched = this.materialDiffs.find(d => 
                d.seriesName === seriesName &&
                d.partName === partName &&
                d.baseMaterial === baseMaterial &&
                d.targetMaterial === targetMaterial &&
                dn >= d.dnMin &&
                dn <= d.dnMax
            );
            return matched ? matched.priceDiff : 0;
        },
        updateCurrentPrice() {
            const { selectedValve, selectedSpec, selectedGatePlate, selectedRodMaterial, selectedYokeMaterial, selectedProductType } = this;
            if (!selectedValve || !selectedSpec || !selectedGatePlate || !selectedRodMaterial) {
                this.setData({ currentPrice: '0.00' });
                return;
            }
            const priceItem = this.priceData.find(p => 
                p.valveName === selectedValve.name && p.size === selectedSpec.name
            );
            if (!priceItem) { 
                this.setData({ currentPrice: '0.00' }); 
                return; 
            }

            const material = this.getMaterialByValveName(selectedValve.name);
            const type = selectedValve.type;
            let basePrice = this.getPriceByType(priceItem, type);
            
            const specSize = selectedSpec.name;
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
                uni.showToast({ title: '请填写完整信息', icon: 'none' }); return null;
            }
            const priceItem = this.priceData.find(p => 
                p.valveName === selectedValve.name && p.size === selectedSpec.name
            );
            if (!priceItem) { 
                uni.showToast({ title: '该组合不可用', icon: 'none' }); 
                return null; 
            }

            const material = this.getMaterialByValveName(selectedValve.name);
            const type = selectedValve.type;
            let basePrice = this.getPriceByType(priceItem, type);
            
            const specSize = selectedSpec.name;
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
            const unitPrice = baseTotal * pricingCoeff * multiplier;
            const totalPrice = unitPrice * quantity;

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
                unitPrice: unitPrice.toFixed(2),
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
            uni.showLoading({ title: '计算中...', mask: true });
            const item = await this.calculatePrice();
            uni.hideLoading();
            if (!item) return;
            const newQuoteItems = [...this.quoteItems, item];
            const newTotalPrice = this.calculateTotal(newQuoteItems);
            this.setData({ quoteItems: newQuoteItems, totalPrice: newTotalPrice });
            uni.setStorageSync('quoteItems', newQuoteItems);
            uni.showToast({ title: '已添加到报价表', icon: 'success' });
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
                selectedProductType: '常规品',
                selectedBranding: false,
                quantity: 50,
                currentPrice: '0.00',
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
                uni.showToast({ title: '请先添加阀门到报价表', icon: 'none' }); return;
            }
            uni.navigateTo({
                url: '/pages/quotation/quotation?data=' + encodeURIComponent(JSON.stringify(this.quoteItems))
            });
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
    margin: 0 24rpx;
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
    font-size: 38rpx;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -1rpx;
}
.total-highlight .price-num {
    color: #c8aa6e;
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
</style>