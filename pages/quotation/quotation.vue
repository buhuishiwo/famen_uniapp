<template>
	<view>
		<navigation-bar title="报价表" :back="true" color="white"
			background="linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%)"></navigation-bar>

		<scroll-view class="scrollarea" scroll-y>
			<view class="container">
				<!-- 公司信息头部 -->
				<view class="company-header">
					<view class="company-logo">
						<text class="logo-text">奇胜阀门有限公司</text>
					</view>
					<view class="company-info">
						<text class="info-item">http://www.chisun.cn/www.qishengvalve.com</text>
						<text class="info-item">E-mail: qs@chisun.cn</text>
						<text class="info-item">公司地址：浙江省温州市空港新区兴业路8号 邮编：325013</text>
						<text class="info-item">电话: 15777828587</text>
					</view>
				</view>

				<!-- 报价单标题 -->
				<view class="quotation-title">报价单</view>

				<!-- 客户信息 -->
				<view class="customer-info">
					<view class="info-row">
						<text class="info-label">客户名称：</text>
						<input class="info-input" placeholder="请输入客户名称" @input="onCustomerNameInput"
							:value="customerName" />
					</view>
				</view>

				<!-- 报价表内容 -->
				<view class="quotation-table">
					<view class="table-header">
						<view class="header-cell cell-product">产品名称</view>
						<view class="header-cell cell-model">型号规格</view>
						<view class="header-cell cell-material">闸板材质</view>
						<view class="header-cell cell-seal">阀杆材质</view>
						<view class="header-cell cell-quantity">数量</view>
						<view class="header-cell cell-price">单价</view>
						<view class="header-cell cell-branding">膜标费</view>
						<view class="header-cell cell-total">总价</view>
					</view>

					<view class="table-body">
						<view class="table-row" v-for="(item, index) in quoteData" :key="index">
							<view class="table-cell cell-product">{{ item.productType }}</view>

							<view class="table-cell cell-model">{{ item.productName+'-DN'+item.model}}</view>

							<view class="table-cell cell-material">{{ item.gateMaterial }}</view>

							<view class="table-cell cell-seal">{{ item.stemMaterial }}</view>

							<view class="table-cell cell-quantity">{{ item.quantity }}</view>

							<view class="table-cell cell-price">{{ item.unitPrice }}</view>

							<view class="table-cell cell-branding">{{ item.brandingFee }}</view>

							<view class="table-cell cell-total">{{ item.totalPrice }}</view>
						</view>
					</view>
				</view>

				<!-- 备注信息 -->
				<view class="quotation-note">
					<text class="note-title">备注：</text>
					<textarea class="note-input" placeholder="请输入备注信息" @input="onNoteInput" :value="note" />
				</view>

				<!-- 付款方式和包装方式 -->
				<view class="payment-packaging">
					<view class="info-row">
						<text class="info-label">付款方式：</text>
						<input class="info-input" placeholder="请输入付款方式" @input="onPaymentMethodInput"
							:value="paymentMethod" />
					</view>
					<view class="info-row">
						<text class="info-label">包装方式：</text>
						<input class="info-input" placeholder="请输入包装方式" @input="onPackagingInput" :value="packaging" />
					</view>
				</view>

				<!-- 报价人信息 -->
				<view class="quoter-info">
					<view class="info-row">
						<text class="info-label">报价人：</text>
						<input class="info-input short-input" placeholder="请输入报价人" @input="onQuoterInput"
							:value="quoter" />
					</view>
					<view class="info-row">
						<text class="info-label">手机：</text>
						<input class="info-input short-input" placeholder="请输入手机号码" @input="onQuoterPhoneInput"
							:value="quoterPhone" />
					</view>
					<view class="info-row">
						<text class="info-label">报价有效期：</text>
						<input class="info-input max-short-input" placeholder="请输入有效期" @input="onValidityInput"
							:value="validity" />
					</view>
					<view class="info-row">
						<text class="info-label">报价日期：</text>
						<text class="info-value">{{ currentDate }}</text>
					</view>
				</view>

				<!-- 操作按钮 -->
				<view class="button-group">
					<button class="btn btn-primary" @tap="generateQuotation">生成报价表</button>
					<button class="btn btn-secondary" open-type="share">分享报价表</button>
					<button class="btn btn-back" @tap="onBack">返回继续添加</button>
				</view>
			</view>
		</scroll-view>

		<!-- Canvas 用于生成图片（隐藏） -->
		<canvas canvas-id="quotationCanvas"
			style="width: 5000rpx; height: 5000rpx; position: fixed; left: -9999rpx"></canvas>
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
		onLoad(options) {
			if (options.data) {
				const quoteData = JSON.parse(decodeURIComponent(options.data));
				const formattedData = quoteData.map((item) => ({
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
				}));
				this.setData({
					quoteData: formattedData,
					currentDate: this.formatDate(new Date())
				});
			}
		},
		onShareAppMessage() {
			return {
				title: '我的报价单',
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

			// 生成报价表图片
			generateQuotation() {
				uni.showLoading({
					title: '生成中...',
					mask: true
				});

				const ctx = uni.createCanvasContext('quotationCanvas', this);

				const scale = 1;
				const width = 750;
				let y = 30 * scale;

				// ✅【关键新增】先填充白色背景（覆盖足够大的区域）
				ctx.setFillStyle('#FFFFFF'); // 白色
				ctx.fillRect(0, 0, width, 5000); // 宽 750px，高 5000px（确保覆盖所有内容）
				ctx.setFillStyle('#000000'); // 恢复默认文字颜色

				// 设置缩放（虽然 scale=1，保留结构）
				ctx.scale(scale, scale);
				const logoPath = 'https://img.cdn1.vip/i/6968b913a8e9c_1768470803.png';

				uni.getImageInfo({
						src: logoPath,
						success: (logoRes) => {
							// === 绘制 Logo 和企业信息（同一行开始）===
							const logoWidth = 100; // 建议缩小 Logo 宽度，避免挤压文字
							const logoHeight = 100;
							const logoX = 20;
							const logoY = 20;

							ctx.drawImage(logoRes.path, logoX, logoY, logoWidth, logoHeight);

							// 企业信息起始位置：Logo 右侧 + 20px 间距
							const infoX = logoX + logoWidth + 20;
							let infoY = logoY; // 与 Logo 顶部对齐

							// 公司名称（加大字号）
							ctx.setFontSize(24);
							ctx.setFillStyle('#000');
							ctx.fillText('奇胜阀门有限公司', infoX, infoY + 24); // +24 使文字垂直居中（字号24）
							infoY += 35; // 下移一行

							// 联系信息（小字号）
							ctx.setFontSize(12);
							const companyInfo = [
								'http://www.chisun.cn/www.qishengvalve.com',
								'E-mail: qs@chisun.cn',
								'公司地址：浙江省温州市空港新区兴业路8号 邮编：325013',
								'电话: 15777828587'
							];

							companyInfo.forEach(line => {
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
							ctx.fillText(`客户名称：${this.customerName}`, 20, y / scale);
							y += 30 * scale;

							// === 表格 ===
							const totalWidth = 710;
							const startX = 20;
							const headers = ['产品名称', '型号规格', '材质', '密封面', '数量', '单价', '总价'];
							const cellWidths = [130, 180, 70, 70, 60, 90, 110];

							// 表头
							ctx.setFillStyle('#f5f5f5');
							ctx.fillRect(startX, y / scale, totalWidth, 30);
							ctx.setFillStyle('#000');
							ctx.setFontSize(12);
							let x = startX + 5;
							headers.forEach((h, i) => {
								ctx.fillText(h, x, y / scale + 20);
								x += cellWidths[i];
							});
							y += 30 * scale;

							// 数据行
							const rowHeight = 35;
							this.quoteData.forEach((item, idx) => {
									x = startX + 5;
									const values = [
										item.productType,
										item.productName,
										item.material,
										item.seal,
										String(item.quantity),
										item.unitPrice,
										item.totalPrice
									];

									if (idx % 2 === 1) {
										ctx.setFillStyle('#fafafa');
										ctx.fillRect(startX, y / scale, totalWidth, rowHeight);
										ctx.setFillStyle('#000');
									}

									values.forEach((val, i) => {
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
									y = this.drawText(ctx, this.note, 20, y / scale, 710, 18, 12) * scale +
										10 * scale;

									// === 付款 & 包装 ===
									ctx.setFontSize(14);
									ctx.fillText(`付款方式：${this.paymentMethod}`, 20, y / scale);
									y += 20 * scale;
									ctx.fillText(`包装方式：${this.packaging}`, 20, y / scale);
									y += 25 * scale;

									// === 报价人 ===
									ctx.fillText(`报价人：${this.quoter}    手机：${this.quoterPhone}`, 20, y /
									scale);
									y += 20 * scale;
									ctx.fillText(`报价有效期：${this.validity}    报价日期：${this.currentDate}`, 20, y /
										scale);
									y += 40 * scale;

									// 绘制完成
									ctx.draw(false, () => {
										const finalHeight = Math.ceil(y / scale);
										uni.canvasToTempFilePath({
											canvasId: 'quotationCanvas',
											width: 750,
											height: finalHeight, // 只截取有内容的部分
											destWidth: 750 * 2,
											destHeight: finalHeight * 2,
											success: (res) => {
												uni.saveImageToPhotosAlbum({
													filePath: res.tempFilePath,
													success: () => {
														uni.showToast({
															title: '已保存到相册',
															icon: 'success'
														});
													},
													fail: () => {
														uni.showToast({
															title: '请允许访问相册',
															icon: 'none'
														});
													}
												});
											},
											fail: (err) => {
												console.error('生成失败:', err);
												uni.showToast({
													title: '生成失败',
													icon: 'error'
												});
											},
											complete: () => uni.hideLoading()
										});
									});
								},
								fail: (err) => {
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
					onCustomerNameInput(e) {
						this.customerName = e.detail.value;
					},
					onNoteInput(e) {
						this.note = e.detail.value;
					},
					onPaymentMethodInput(e) {
						this.paymentMethod = e.detail.value;
					},
					onPackagingInput(e) {
						this.packaging = e.detail.value;
					},
					onQuoterInput(e) {
						this.quoter = e.detail.value;
					},
					onQuoterPhoneInput(e) {
						this.quoterPhone = e.detail.value;
					},
					onValidityInput(e) {
						this.validity = e.detail.value;
					},

					// 输入事件
					onCustomerNameInput(e) {
						this.setData({
							customerName: e.detail.value
						});
					},

					onNoteInput(e) {
						this.setData({
							note: e.detail.value
						});
					},

					onPaymentMethodInput(e) {
						this.setData({
							paymentMethod: e.detail.value
						});
					},

					onPackagingInput(e) {
						this.setData({
							packaging: e.detail.value
						});
					},

					onQuoterInput(e) {
						this.setData({
							quoter: e.detail.value
						});
					},

					onQuoterPhoneInput(e) {
						this.setData({
							quoterPhone: e.detail.value
						});
					},

					onValidityInput(e) {
						this.setData({
							validity: e.detail.value
						});
					},

					onBack() {
						uni.navigateBack();
					}
				}
			};
</script>
<style>
	/**quotation.wxss**/
	page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		font-family: Arial, sans-serif;
	}

	.scrollarea {
		flex: 1;
		height: 100%;
		box-sizing: border-box;
	}

	.container {
		padding: 20rpx;
		box-sizing: border-box;
	}

	/* 公司信息头部 */
	.company-header {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		/* margin-bottom: 20rpx; */
		border: 1rpx solid #e0e0e0;
	}

	.company-logo {
		text-align: center;
		margin-bottom: 20rpx;
	}

	.logo-text {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		display: block;
	}

	.company-info {
		text-align: left;
		line-height: 1.6;
	}

	.info-item {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-bottom: 8rpx;
	}

	.info-item:last-child {
		margin-bottom: 0;
	}

	/* 报价单标题 */
	.quotation-title {
		text-align: center;
		font-size: 44rpx;
		font-weight: bold;
		color: #333;
		margin: 10rpx 0;
	}

	/* 客户信息 */
	.customer-info {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #e0e0e0;
		width: 680rpx;
	}

	/* 通用信息行样式 */
	.info-row {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		flex-wrap: wrap;
	}

	.info-row:last-child {
		margin-bottom: 0;
	}

	.info-label {
		font-size: 28rpx;
		color: #333;
		font-weight: bold;
		margin-right: 10rpx;
		min-width: 120rpx;
	}

	.info-value {
		font-size: 28rpx;
		color: #666;
		flex: 1;
	}

	/* 输入框样式 */
	.info-input {
		font-size: 28rpx;
		color: #666;
		flex: 1;
		padding: 10rpx 15rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 8rpx;
		background-color: #f9f9f9;
		/* box-sizing: border-box; */
	}

	/* 短输入框样式 */
	.info-input.short-input {
		flex: none;
		width: 458rpx;
		/* margin-right: 10rpx; */

	}

	.info-input.max-short-input {
		flex: none;
		width: 416rpx;
		/* margin-right: 20rpx; */
	}

	/* 多行文本框样式 */
	.note-input {
		font-size: 26rpx;
		color: #666;
		width: 100%;
		padding: 15rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 8rpx;
		background-color: #f9f9f9;
		box-sizing: border-box;
		min-height: 120rpx;
		line-height: 1.6;
		resize: vertical;
	}

	/* 报价表内容 */
	.quotation-table {
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
		border: 1rpx solid #e0e0e0;
	}

	.table-header {
		display: flex;
		background: linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);
		padding: 20rpx 10rpx;
	}

	.header-cell {
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		font-weight: bold;
		padding: 10rpx 8rpx;
		border-right: 1rpx solid #fff;
	}

	.header-cell:last-child {
		border-right: none;
	}

	/* 表格列样式 */
	.cell-product {
		width: 140rpx;
	}

	.cell-model {
		width: 80rpx;
	}

	.cell-material {
		width: 80rpx;
	}

	.cell-seal {
		width: 80rpx;
	}

	.cell-quantity {
		width: 80rpx;
	}

	.cell-price {
		width: 100rpx;
	}

	.cell-branding {
		width: 80rpx;
		color: #ff6600;
	}

	.cell-total {
		width: 100rpx;
		color: #ff0000;
	}

	.table-body {
		max-height: 800rpx;
		overflow-y: auto;
		box-sizing: border-box;
	}

	.table-row {
		display: flex;
		padding: 20rpx 10rpx;
		border-bottom: 1rpx solid #e0e0e0;
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-cell {
		font-size: 24rpx;
		color: #333;
		text-align: center;
		padding: 10rpx 8rpx;
		border-right: 1rpx solid #e0e0e0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.table-cell:last-child {
		border-right: none;
	}

	/* 备注信息 */
	.quotation-note {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #e0e0e0;
		width: 680rpx;
	}

	.note-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: block;
	}

	.note-content {
		font-size: 26rpx;
		color: #666;
		line-height: 1.6;
		display: block;
		text-align: justify;
	}

	/* 付款方式和包装方式 */
	.payment-packaging {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #e0e0e0;
		width: 680rpx;
	}

	/* 报价人信息 */
	.quoter-info {
		width: 680rpx;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		border: 1rpx solid #e0e0e0;
	}

	/* 操作按钮 */
	.button-group {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		margin-bottom: 40rpx;
	}

	.btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		font-size: 32rpx;
		border: none;
	}

	.btn-primary {
		background: linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);
		color: #fff;
		width: 680rpx;
	}

	.btn-secondary {
		background: linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);
		color: #fff;
	}

	.btn-back {
		background: linear-gradient(135deg, #a8a8ea 0%, #0070c0 100%);
		color: #fff;
	}
</style>