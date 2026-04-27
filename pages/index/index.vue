<template>
    <view>
        <navigation-bar :title="currentProductSeries || '阀门选择'" :back="true" color="white"
            background="linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);" @back="onBackToCategory"></navigation-bar>

        <scroll-view class="scroll-content" scroll-y>
            <!-- 表单部分 -->
            <view class="form-section">
                <view class="form-item">
                    <text class="label">阀门型号</text>
                    <picker class="picker" mode="selector" :range="valveTypes" range-key="name" @change="onSelectValve">
                        <view class="picker-text">{{ selectedValve ? selectedValve.name : '请选择阀门型号' }}</view>
                    </picker>
                </view>

                <view class="form-item">
                    <text class="label">规格尺寸 (DN)</text>
                    <picker class="picker" mode="selector" :range="specifications" range-key="name" @change="onSelectSpec">
                        <view class="picker-text">{{ selectedSpec ? selectedSpec.name : '请选择规格尺寸' }}</view>
                    </picker>
                </view>
				
				<view>
					<text class="label">阀体材质</text>
					<picker class="picker" mode="selector" :range="valveBodyTypes" range-key="name"  @change="onSelectValveBody">
					    <view class="picker-text">{{ SelectValveBody ? SelectValveBody.name : '请选择阀体材质' }}
					    </view>
					</picker>
				</view>
				
                <view class="form-item">
                    <text class="label">闸板类型</text>
                    <picker class="picker" mode="selector" :range="gatePlateTypes" range-key="name"
                        @change="onSelectGatePlate">
                        <view class="picker-text">{{ selectedGatePlate ? selectedGatePlate.name : '请选择闸板类型' }}
                        </view>
                    </picker>
                </view>
                


                <view class="form-item">
                    <text class="label">阀杆材质</text>
                    <picker class="picker" mode="selector" :range="rodMaterials" range-key="name"
                        @change="onSelectRodMaterial">
                        <view class="picker-text">{{ selectedRodMaterial ? selectedRodMaterial.name : '请选择阀杆材质' }}
                        </view>
                    </picker>
                </view>

                <view class="form-item">
                    <text class="label">产品类型</text>
                    <picker class="picker" mode="selector" :range="productTypeOptions" @change="onSelectProductType">
                        <view class="picker-text">{{ selectedProductType }}</view>
                    </picker>
                </view>

                <view class="form-item">
                    <text class="label">数量</text>
                    <input class="input" type="number" :value="quantity" @input="onQuantityChange"
                        placeholder="请输入数量" />
                </view>

                <view class="price-preview"
                    v-if="selectedValve && selectedSpec && selectedGatePlate && selectedRodMaterial">
                    <text class="price-label">单价：</text>
                    <text class="price-value">¥{{ currentPrice }}</text>
                </view>
            </view>

            <!-- 按钮组 -->
            <view class="button-group">
                <button class="btn btn-primary" @tap="onAddToQuote">添加到报价表</button>
                <button class="btn btn-success" v-if="quoteItems.length > 0" @tap="onGenerateQuotation">生成报价表</button>
            </view>

            <!-- 报价列表 -->
            <view class="quote-list" v-if="quoteItems.length > 0">
                <view class="section-title">报价表列表</view>
                <view class="quote-item" v-for="(item, index) in quoteItems" :key="index">
                    <view class="item-header">
                        <text class="item-name">{{ item.valveName }}</text>
                        <text class="item-price">¥{{ item.totalPrice }}</text>
                    </view>
                    <view class="item-detail">规格：DN{{ item.spec }}</view>
                    <view class="item-detail">闸板：{{ item.gatePlate }}</view>
                    <view class="item-detail">阀杆：{{ item.rodMaterial }}</view>
                    <view class="item-detail">类型：{{ item.productType }}</view>
                    <view class="item-detail">数量：{{ item.quantity }}</view>
                    <view class="item-detail">单价：¥{{ item.unitPrice }}</view>
                    <view class="item-detail" v-if="item.brandingFee">磨标费：¥{{ item.brandingFee }}</view>
                    <view class="delete-btn" @tap="onDeleteItem" :data-index="index">删除</view>
                </view>
                <view class="total-price">
                    <text class="total-label">总计：</text>
                    <text class="total-value">¥{{ totalPrice }}</text>
                </view>
            </view>

            <!-- 空状态提示 -->
            <view class="empty-tip" v-else-if="!quoteItems || quoteItems.length === 0">
                添加阀门后，报价列表将显示在此处
            </view>
        </scroll-view>
    </view>
</template>

<script>
import navigationBar from '@/components/navigation-bar/navigation-bar';

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
            // 不同系列的阀门型号
            seriesValveTypes: {
                'QB系列': [
                    { id: 1, name: 'QBZ73X-10C (手动)', type: 'manual' },
                    { id: 2, name: 'QBZ73X-10C (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QBZ73X-10RL (电装)', type: 'electric' },
                    { id: 4, name: 'QBZ73X-10P (无电装)', type: 'pneumatic' },
                    { id: 5, name: 'QBZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QC系列': [
                    { id: 1, name: 'QCZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QCZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QCZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QCZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QCZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QD系列': [
                    { id: 1, name: 'QDZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QDZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QDZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QDZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QDZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QH系列': [
                    { id: 1, name: 'QHZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QHZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QHZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QHZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QHZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QJ系列': [
                    { id: 1, name: 'QJZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QJZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QJZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QJZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QJZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QM系列': [
                    { id: 1, name: 'QMZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QMZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QMZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QMZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QMZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QP系列': [
                    { id: 1, name: 'QPZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QPZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QPZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QPZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QPZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QS系列': [
                    { id: 1, name: 'QSZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QSZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QSZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QSZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QSZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QU系列': [
                    { id: 1, name: 'QUZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QUZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QUZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QUZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QUZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QV系列': [
                    { id: 1, name: 'QVZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QVZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QVZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QVZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QVZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QVY系列': [
                    { id: 1, name: 'QVYZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QVYZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QVYZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QVYZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QVYZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QW系列': [
                    { id: 1, name: 'QWZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QWZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QWZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QWZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QWZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QWL系列': [
                    { id: 1, name: 'QWLZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QWLZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QWLZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QWLZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QWLZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QWY系列': [
                    { id: 1, name: 'QWYZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QWYZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QWYZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QWYZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QWYZ573NM-10Q (伞齿轮)', type: 'gear' }
                ],
                'QY系列': [
                    { id: 1, name: 'QYZ73NM-10Q (手动)', type: 'manual' },
                    { id: 2, name: 'QYZ973NM-10Q (无电装)', type: 'noElectric' },
                    { id: 3, name: 'QYZ973NM-10Q (电装)', type: 'electric' },
                    { id: 4, name: 'QYZ673NM-10Q (含双作用气缸)', type: 'pneumatic' },
                    { id: 5, name: 'QYZ573NM-10Q (伞齿轮)', type: 'gear' }
                ]
            },

            // 规格尺寸（仅支持 DN50～DN900）
            specifications: [
                { name: 50 }, { name: 65 }, { name: 80 }, { name: 100 }, { name: 125 },
                { name: 150 }, { name: 200 }, { name: 250 }, { name: 300 }, { name: 350 },
                { name: 400 }, { name: 450 }, { name: 500 }, { name: 600 }, { name: 650 },
				{ name: 700 }, { name: 750 }, { name: 800 }, { name: 900 }, { name: 1000 }, 
				{ name: 1100 }, { name: 1200 },{ name: 1300 },{ name: 1400 },{ name: 1500 },
				{ name: 1800 },{ name: 2000 }
            ],

            // 闸板类型（仅镀铬收费）
            gatePlateTypes: [
                { name: '喷涂史泰利', price: 0 },
                { name: '喷涂碳化物', price: 0 },
                { name: '镀铬', price: 400 },
                { name: '304（CF8）', price: 0 }
            ],
			valveBodyTypes:[{
				name: '304',
				price:'0'
			},{
				name: '316',
				price:'1'
			},{
				name: '2520',
				price:'2'
			},{
				name: '2205',
				price:'3'
			},{
				name: '2507',
				price:'4'
			},{
				name: 'GGG40',
				price:'0'
			}],
			
			
            // 阀杆材质（304/316 加 100 元）
            rodMaterials: [
                { name: '2Cr13', price: 0 },
                { name: '304', price: 100 },
                { name: '316', price: 100 }
            ],

            // 产品类型
            productTypeOptions: ['常规品', '新品'],

            // 最低起订量配置 (QB系列)
            minOrderQuantity: [
                { min: 50, max: 50, quantity: 44 },
                { min: 65, max: 65, quantity: 40 },
                { min: 80, max: 80, quantity: 48 },
                { min: 100, max: 100, quantity: 36 },
                { min: 125, max: 125, quantity: 30 },
                { min: 150, max: 250, quantity: 20 },
                { min: 300, max: 350, quantity: 15 },
                { min: 400, max: 400, quantity: 10 },
                { min: 450, max: 1000, quantity: 10 }
            ],

            // 用户选择
			SelectValveBody:null,
            selectedValve: null,
            selectedSpec: null,
            selectedGatePlate: null,
            selectedRodMaterial: null,
            selectedProductType: '常规品',
            quantity: 1,
            // 报价数据
            quoteItems: [],
            totalPrice: '0.00',
            currentPrice: '0.00',

            // 价格表（QB系列）
            priceTable: {
                sizes: [
                    { size: 50, manual: 220, noElectric: 190, electric: 400, pneumatic: 310, gear: null, brandingFee: 25 },
                    { size: 65, manual: 240, noElectric: 210, electric: 460, pneumatic: 360, gear: null, brandingFee: 25 },
                    { size: 80, manual: 280, noElectric: 240, electric: 540, pneumatic: 430, gear: null, brandingFee: 25 },
                    { size: 100, manual: 320, noElectric: 280, electric: 640, pneumatic: 510, gear: null, brandingFee: 25 },
                    { size: 125, manual: 320, noElectric: 330, electric: 770, pneumatic: 620, gear: null, brandingFee: 25 },
                    { size: 150, manual: 500, noElectric: 450, electric: 940, pneumatic: 800, gear: null, brandingFee: 25 },
                    { size: 200, manual: 690, noElectric: 610, electric: 1480, pneumatic: 1140, gear: null, brandingFee: 30 },
                    { size: 250, manual: 950, noElectric: 850, electric: 1850, pneumatic: 1600, gear: null, brandingFee: 50 },
                    { size: 300, manual: 1350, noElectric: 1200, electric: 2500, pneumatic: 2200, gear: null, brandingFee: 60 },
                    { size: 350, manual: 1800, noElectric: 1550, electric: 3300, pneumatic: 2900, gear: null, brandingFee: 70 },
                    { size: 400, manual: 2400, noElectric: 2100, electric: 4300, pneumatic: 3800, gear: null, brandingFee: 80 },
                    { size: 450, manual: null, noElectric: null, electric: null, pneumatic: null, gear: null, brandingFee: 100 },
                    { size: 500, manual: null, noElectric: null, electric: null, pneumatic: null, gear: null, brandingFee: 150 },
                    { size: 600, manual: null, noElectric: null, electric: null, pneumatic: null, gear: null, brandingFee: 250 },
                    { size: 700, manual: null, noElectric: null, electric: null, pneumatic: null, gear: null, brandingFee: 450 },
                    { size: 800, manual: null, noElectric: null, electric: null, pneumatic: null, gear: null, brandingFee: 650 },
                    { size: 900, manual: null, noElectric: null, electric: null, pneumatic: null, gear: null, brandingFee: 900 },
                    { size: 1000, manual: null, noElectric: null, electric: null, pneumatic: null, gear: null, brandingFee: 1000 }
                ],
                productTypeMultiplier: {
                    '常规品': 1.0,
                    '新品': 1.3
                }
            }
        };
    },
    onLoad() {
        // 获取当前产品系列
        this.currentProductSeries = uni.getStorageSync('currentProductSeries') || '';
        // 根据产品系列设置阀门型号
        this.setValveTypesBySeries();
        // 从缓存中加载报价列表
        const cachedQuoteItems = uni.getStorageSync('quoteItems');
        if (cachedQuoteItems) {
            this.quoteItems = cachedQuoteItems;
            this.calculateTotalPrice();
        }
    },
    methods: {
        setValveTypesBySeries() {
            if (this.currentProductSeries && this.seriesValveTypes[this.currentProductSeries]) {
                this.valveTypes = this.seriesValveTypes[this.currentProductSeries];
            } else {
                // 默认使用QW系列
                this.valveTypes = this.seriesValveTypes['QW系列'] || [];
            }
        },
        // QW系列标配配置
        setQWStandard() {
            const ggg40 = this.valveBodyTypes.find(v => v.name === 'GGG40');
            const cf8 = this.gatePlateTypes.find(v => v.name === '304（CF8）');
            const cr13 = this.rodMaterials.find(v => v.name === '2Cr13');
            this.setData({
                SelectValveBody: ggg40 || null,
                selectedGatePlate: cf8 || null,
                selectedRodMaterial: cr13 || null
            });
        },
        // 获取最低起订量
        getMinOrderQuantity(specSize) {
            const rule = this.minOrderQuantity.find(r => specSize >= r.min && specSize <= r.max);
            return rule ? rule.quantity : 1;
        },
		onSelectValveBody(e) {
		    this.setData({ SelectValveBody: this.valveBodyTypes[e.detail.value] });
		    this.updateCurrentPrice();
		},
        onSelectValve(e) {
            this.setData({ selectedValve: this.valveTypes[e.detail.value] });
            if (this.currentProductSeries === 'QW系列' && this.selectedSpec) {
                this.setQWStandard();
            }
            this.updateCurrentPrice();
        },
        onSelectSpec(e) {
            this.setData({ selectedSpec: this.specifications[e.detail.value] });
            if (this.currentProductSeries === 'QW系列' && this.selectedValve) {
                this.setQWStandard();
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
        onSelectProductType(e) {
            this.setData({ selectedProductType: this.productTypeOptions[e.detail.value] });
            this.updateCurrentPrice();
        },
        onQuantityChange(e) {
            this.setData({ quantity: parseInt(e.detail.value) || 1 });
        },

        updateCurrentPrice() {
            const { selectedValve, selectedSpec, selectedGatePlate, selectedRodMaterial, selectedProductType } = this;
            if (!selectedValve || !selectedSpec || !selectedGatePlate || !selectedRodMaterial) {
                this.setData({ currentPrice: '0.00' });
                return;
            }

            const sizeData = this.priceTable.sizes.find(s => s.size === selectedSpec.name);
            if (!sizeData) {
                this.setData({ currentPrice: '0.00' });
                return;
            }

            const type = selectedValve.type;
            let basePrice = sizeData[type];
            if (basePrice == null) {
                uni.showToast({ title: '该规格不支持此型号', icon: 'none' });
                this.setData({ currentPrice: '0.00' });
                return;
            }

            const gatePlatePrice = selectedGatePlate.price;
            const rodPrice = selectedRodMaterial.price;
            const brandingFee = sizeData.brandingFee || 0;
            const multiplier = this.priceTable.productTypeMultiplier[selectedProductType];

            const total = (basePrice + gatePlatePrice + rodPrice + brandingFee) * multiplier;
            this.setData({ currentPrice: total.toFixed(2) });
        },

        calculatePrice() {
            const { selectedValve, selectedSpec, selectedGatePlate, selectedRodMaterial, quantity, selectedProductType } = this;
            if (!selectedValve || !selectedSpec || !selectedGatePlate || !selectedRodMaterial) {
                uni.showToast({ title: '请填写完整信息', icon: 'none' });
                return null;
            }

            const sizeData = this.priceTable.sizes.find(s => s.size === selectedSpec.name);
            if (!sizeData) return null;

            const type = selectedValve.type;
            let basePrice = sizeData[type];
            if (basePrice == null) {
                uni.showToast({ title: '该组合不可用', icon: 'none' });
                return null;
            }

            const gatePlatePrice = selectedGatePlate.price;
            const rodPrice = selectedRodMaterial.price;
            const brandingFee = sizeData.brandingFee || 0;
            const multiplier = this.priceTable.productTypeMultiplier[selectedProductType];

            const unitPrice = (basePrice + gatePlatePrice + rodPrice + brandingFee) * multiplier;
            const totalPrice = unitPrice * quantity;

            return {
                valveName: selectedValve.name,
                spec: selectedSpec.name,
                brandingFee: brandingFee,
                gatePlate: selectedGatePlate.name,
                rodMaterial: selectedRodMaterial.name,
                productType: selectedProductType,
                quantity: quantity,
                unitPrice: unitPrice.toFixed(2),
                totalPrice: totalPrice.toFixed(2),
                productSeries: this.currentProductSeries
            };
        },
        onBackToCategory() {
            uni.navigateBack({
                delta: 1
            });
        },

        onAddToQuote() {
            // 验证最低起订量
            if (this.selectedSpec) {
                const minQty = this.getMinOrderQuantity(this.selectedSpec.name);
                if (this.quantity < minQty) {
                    uni.showToast({ title: `DN${this.selectedSpec.name}最低起订量${minQty}台`, icon: 'none' });
                    return;
                }
            }

            const item = this.calculatePrice();
            if (!item) return;

            const newQuoteItems = [...this.quoteItems, item];
            const newTotalPrice = this.calculateTotal(newQuoteItems);
            this.setData({
                quoteItems: newQuoteItems,
                totalPrice: newTotalPrice
            });

            // 保存到缓存
            uni.setStorageSync('quoteItems', newQuoteItems);

            uni.showToast({ title: '已添加到报价表', icon: 'success' });
            this.resetSelection();
        },

        calculateTotal(items) {
            const total = items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
            return total.toFixed(2);
        },

        resetSelection() {
            this.setData({
                selectedValve: null,
                selectedSpec: null,
                selectedGatePlate: null,
                selectedRodMaterial: null,
                selectedProductType: '常规品',
                quantity: 1
            });
        },

        onDeleteItem(e) {
            const index = e.currentTarget.dataset.index;
            const newQuoteItems = this.quoteItems.filter((_, i) => i !== index);
            const newTotalPrice = this.calculateTotal(newQuoteItems);
            this.setData({
                quoteItems: newQuoteItems,
                totalPrice: newTotalPrice
            });
            // 保存到缓存
            uni.setStorageSync('quoteItems', newQuoteItems);
        },

        onGenerateQuotation() {
            if (this.quoteItems.length === 0) {
                uni.showToast({ title: '请先添加阀门到报价表', icon: 'none' });
                return;
            }
            // 验证所有报价项目的最低起订量
            for (const item of this.quoteItems) {
                const minQty = this.getMinOrderQuantity(item.spec);
                if (item.quantity < minQty) {
                    uni.showToast({ title: `DN${item.spec}最低起订量${minQty}台`, icon: 'none' });
                    return;
                }
            }
            uni.navigateTo({
                url: '/pages/quotation/quotation?data=' + encodeURIComponent(JSON.stringify(this.quoteItems))
            });
        }
    }
};
</script>
<style>
/** index.wxss **/
page {
    height: 100vh;
    background-color: #f5f5f5;
}

/* —————— 滚动内容区 —————— */
.scroll-content {
    height: 89vh;
    padding: 20rpx;
    padding-top: 30rpx;
    /* padding-bottom: 200rpx; */
    box-sizing: border-box;
}

.form-section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
}

.form-item {
    margin-bottom: 30rpx;
}

.label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 16rpx;
}

.picker-text,
.input {
    width: 100%;
    padding: 24rpx;
    background-color: #f9f9f9;
    border-radius: 8rpx;
    font-size: 28rpx;
    color: #333;
    /* box-sizing: border-box; */
}

.price-preview {
    margin-top: 40rpx;
    padding: 30rpx;
    background: linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.price-label {
    font-size: 28rpx;
    color: #fff;
}

.price-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
}

/* —————— 按钮组 —————— */
.button-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-bottom: 20rpx;
}

.btn {
    height: 88rpx;
    line-height: 88rpx;
    border-radius: 44rpx;
    font-size: 32rpx;
	width: 680rpx;
}

.btn-primary {
    background: linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);
    color: #fff;

}

.btn-success {
    background: linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);
    color: #fff;
}

.quote-list {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-sizing: border-box;
}

.quote-item {
    padding: 24rpx;
    margin-bottom: 20rpx;
    background-color: #f9f9f9;
    border-radius: 12rpx;
    position: relative;
    box-sizing: border-box;
}

.quote-item:last-child {
    margin-bottom: 0;
}

.item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    padding-right: 90rpx;
}

.item-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
}

.item-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #764ba2;
}

.item-detail {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 8rpx;
}

.delete-btn {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    padding: 8rpx 20rpx;
    background-color: #ff4d4f;
    color: #fff;
    font-size: 24rpx;
    border-radius: 20rpx;
}

.total-price {
    margin-top: 30rpx;
    padding-top: 30rpx;
    padding-bottom: 20rpx;
    border-top: 2rpx solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.total-label {
    font-size: 30rpx;
    color: #666;
}

.total-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #764ba2;
}

.empty-tip {
    text-align: center;
    color: #999;
    font-size: 28rpx;
    padding-top: 100rpx;
}
</style>
