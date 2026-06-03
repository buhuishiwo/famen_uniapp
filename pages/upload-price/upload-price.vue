<template>
    <view class="page-root">
        <navigation-bar title="价格库管理" :back="true" color="white"
            background="linear-gradient(135deg, #0d1526 0%, #1e293b 100%)"></navigation-bar>

        <scroll-view class="scrollarea" scroll-y>
            <view class="container">

                <view class="upload-card">
                    <view class="upload-area" @tap="chooseFile">
                        <view class="upload-icon">
                            <text class="icon-text">📊</text>
                        </view>
                        <text class="upload-title">{{ fileName || '点击选择Excel文件' }}</text>
                        <text class="upload-hint">支持 .xlsx / .xls / .csv 格式，文件大小不超过10MB</text>
                    </view>

                    <view class="template-download" @tap="downloadTemplate">
                        <text class="download-icon">📥</text>
                        <text class="download-text">下载导入模板</text>
                    </view>

                    <view class="file-info" v-if="fileName">
                        <view class="info-row">
                            <text class="info-label">文件名</text>
                            <text class="info-value">{{ fileName }}</text>
                        </view>
                        <view class="info-row">
                            <text class="info-label">文件大小</text>
                            <text class="info-value">{{ fileSize }}</text>
                        </view>
                    </view>
                </view>

                <view class="preview-card" v-if="previewData.length > 0">
                    <view class="card-header">
                        <text class="card-title">数据预览</text>
                        <text class="preview-count">共 {{ previewData.length }} 条数据</text>
                    </view>

                    <scroll-view scroll-x scroll-y class="preview-scroll">
                        <view class="preview-table">
                            <view class="preview-header">
                                <view class="preview-th">产品系列</view>
                                <view class="preview-th">阀门型号</view>
                                <view class="preview-th">规格DN</view>
                                <view class="preview-th">手动价格</view>
                                <view class="preview-th">气动价格</view>
                                <view class="preview-th">起订量</view>
                                <view class="preview-th">状态</view>
                            </view>
                            <view class="preview-body">
                                <view class="preview-row" v-for="(row, index) in previewData" :key="index">
                                    <view class="preview-td">{{ row.seriesName }}</view>
                                    <view class="preview-td">{{ row.valveName }}</view>
                                    <view class="preview-td">{{ row.size }}</view>
                                    <view class="preview-td">¥{{ row.manualPrice }}</view>
                                    <view class="preview-td">¥{{ row.pneumaticPrice }}</view>
                                    <view class="preview-td">{{ row.minOrderQty }}</view>
                                    <view class="preview-td status-tag" :class="row.status === '启用' ? 'status-enabled' : 'status-disabled'">
                                        {{ row.status === '启用' ? '启用' : '禁用' }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>

                <view class="error-card" v-if="failedRows.length > 0">
                    <view class="card-header">
                        <text class="card-title error-title">解析失败行</text>
                        <text class="error-count">{{ failedRows.length }} 条错误</text>
                    </view>
                    <view class="error-list">
                        <view class="error-item" v-for="(error, index) in failedRows" :key="index">
                            <view class="error-row">
                                <text class="error-badge">第{{ error.rowIndex }}行</text>
                                <text class="error-message">{{ error.error }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="stats-card">
                    <view class="stats-grid">
                        <view class="stat-item">
                            <text class="stat-value">{{ stats.total }}</text>
                            <text class="stat-label">总行数</text>
                        </view>
                        <view class="stat-item success">
                            <text class="stat-value">{{ stats.success }}</text>
                            <text class="stat-label">成功解析</text>
                        </view>
                        <view class="stat-item error">
                            <text class="stat-value">{{ stats.failed }}</text>
                            <text class="stat-label">解析失败</text>
                        </view>
                    </view>
                </view>

                <view class="tips-card">
                    <text class="tips-title">📌 导入提示</text>
                    <view class="tips-list">
                        <text class="tip-item">1. Excel文件需包含以下列：产品系列、阀门型号、规格DN、手动价格、气动价格、电装价格、伞齿轮价格、304闸板差价、316闸板差价、304阀杆差价、316阀杆差价、磨标费、起订量、状态、备注</text>
                        <text class="tip-item">2. 规格DN必须在50-2000之间</text>
                        <text class="tip-item">3. 起订量必须为大于0的整数</text>
                        <text class="tip-item">4. 状态列填写"启用"或"禁用"</text>
                    </view>
                </view>

                <view class="button-group">
                    <button class="btn btn-primary" :disabled="!fileName || previewData.length === 0" @tap="confirmImport">
                        <text class="btn-icon">✅</text>
                        确认导入数据
                    </button>
                    <button class="btn btn-secondary" :disabled="!fileName" @tap="reparseFile">
                        <text class="btn-icon">🔄</text>
                        重新解析
                    </button>
                    <button class="btn btn-cancel" @tap="clearFile">
                        <text class="btn-icon">🗑️</text>
                        清除文件
                    </button>
                </view>
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
        chooseFile() {
            uni.chooseMessageFile({
                count: 1,
                type: 'file',
                extension: ['.xlsx', '.xls', '.csv'],
                success: (res) => {
                    const file = res.tempFiles[0];
                    this.fileName = file.name;
                    this.fileSize = this.formatFileSize(file.size);
                    this.fileData = file;
                    
                    if (file.size > 10 * 1024 * 1024) {
                        uni.showToast({
                            title: '文件大小不能超过10MB',
                            icon: 'none'
                        });
                        return;
                    }
                    
                    this.parseFile(file);
                },
                fail: (err) => {
                    console.error('选择文件失败:', err);
                    uni.showToast({
                        title: '选择文件失败',
                        icon: 'none'
                    });
                }
            });
        },

        formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        },

        parseFile(file) {
            uni.showLoading({
                title: '正在解析文件...',
                mask: true
            });

            const url = 'http://localhost:3000/api/quotations/import';
            
            // 读取文件为 base64
            uni.request({
                url: file.path,
                method: 'GET',
                responseType: 'arraybuffer',
                success: (res) => {
                    if (res.statusCode === 200 && res.data) {
                        const base64 = uni.arrayBufferToBase64(res.data);
                        this.uploadWithBase64(base64, file.name);
                    } else {
                        // 备选方案：直接发送文件
                        this.uploadDirect(file);
                    }
                },
                fail: () => {
                    // 备选方案：直接发送文件
                    this.uploadDirect(file);
                }
            });
        },
        
        uploadWithBase64(base64Data, fileName) {
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
                success: (res) => {
                    this.handleParseResponse(res);
                },
                fail: (err) => {
                    console.error('上传失败:', err);
                    uni.showToast({
                        title: '上传失败，请检查服务器',
                        icon: 'none'
                    });
                },
                complete: () => {
                    uni.hideLoading();
                }
            });
        },
        
        uploadDirect(file) {
            uni.uploadFile({
                url: 'http://localhost:3000/api/quotations/import',
                filePath: file.path,
                name: 'file',
                success: (res) => {
                    this.handleParseResponse({ statusCode: res.statusCode, data: res.data });
                },
                fail: (err) => {
                    console.error('上传失败:', err);
                    uni.showToast({
                        title: '上传失败，请检查服务器',
                        icon: 'none'
                    });
                },
                complete: () => {
                    uni.hideLoading();
                }
            });
        },
        
        handleParseResponse(res) {
            try {
                console.log('响应状态码:', res.statusCode);
                console.log('响应数据:', res.data);
                
                let result;
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
                            title: `解析完成，${this.failedRows.length}条数据有误`,
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

        downloadTemplate() {
            uni.showLoading({
                title: '正在下载模板...',
                mask: true
            });

            console.log('开始下载模板...');
            console.log('请求URL:', 'http://localhost:3000/api/quotations/template');

            uni.downloadFile({
                url: 'http://localhost:3000/api/quotations/template',
                success: (res) => {
                    console.log('下载响应:', res);
                    console.log('状态码:', res.statusCode);
                    console.log('临时文件路径:', res.tempFilePath);
                    
                    if (res.statusCode === 200) {
                        uni.openDocument({
                            filePath: res.tempFilePath,
                            fileType: 'xlsx',
                            showMenu: true,
                            success: () => {
                                uni.hideLoading();
                                uni.showToast({
                                    title: '模板下载成功',
                                    icon: 'success'
                                });
                            },
                            fail: (err) => {
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
                fail: (err) => {
                    uni.hideLoading();
                    console.error('下载模板失败:', err);
                    uni.showToast({
                        title: '下载失败，请检查服务器',
                        icon: 'none'
                    });
                }
            });
        },

        confirmImport() {
            if (!this.previewData || this.previewData.length === 0) {
                uni.showToast({
                    title: '没有可导入的数据',
                    icon: 'none'
                });
                return;
            }

            uni.showModal({
                title: '确认导入',
                content: `即将导入 ${this.previewData.length} 条价格数据，确认继续？`,
                confirmText: '确认导入',
                cancelText: '取消',
                success: (res) => {
                    if (res.confirm) {
                        this.doImport();
                    }
                }
            });
        },

        doImport() {
            uni.showLoading({
                title: '正在导入数据...',
                mask: true
            });

            const url = 'http://localhost:3000/api/quotations/import/confirm';
            
            uni.request({
                url: url,
                method: 'POST',
                data: { data: this.previewData },
                header: {
                    'Content-Type': 'application/json'
                },
                success: (res) => {
                    try {
                        const result = res.data;
                        if (result.successCount !== undefined) {
                            uni.showModal({
                                title: '导入完成',
                                content: `成功导入 ${result.successCount} 条数据，失败 ${result.failedCount} 条`,
                                showCancel: false,
                                confirmText: '确定',
                                success: () => {
                                    this.clearFile();
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
                fail: (err) => {
                    console.error('导入失败:', err);
                    uni.showToast({
                        title: '导入失败，请检查服务器',
                        icon: 'none'
                    });
                },
                complete: () => {
                    uni.hideLoading();
                }
            });
        },

        reparseFile() {
            if (this.fileData) {
                this.parseFile(this.fileData);
            }
        },

        clearFile() {
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
</script>

<style>
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

.upload-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 32rpx;
    margin-bottom: 24rpx;
    border: 1rpx solid #e2e8f0;
    box-shadow: 0 4rpx 16rpx rgba(13, 21, 38, 0.03);
}

.upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48rpx;
    border: 2rpx dashed #cbd5e1;
    border-radius: 16rpx;
    background-color: #fafafa;
    transition: all 0.3s ease;
}

.upload-area:active {
    border-color: #c8aa6e;
    background-color: #fef3c7;
}

.upload-icon {
    margin-bottom: 20rpx;
}

.icon-text {
    font-size: 80rpx;
}

.upload-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #0d1526;
    margin-bottom: 12rpx;
}

.upload-hint {
    font-size: 24rpx;
    color: #94a3b8;
    text-align: center;
}

.template-download {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 24rpx 32rpx;
    margin-top: 24rpx;
    background: linear-gradient(135deg, #c8aa6e 0%, #d4b87a 100%);
    border-radius: 12rpx;
    transition: all 0.3s ease;
}

.template-download:active {
    opacity: 0.8;
    transform: scale(0.98);
}

.download-icon {
    font-size: 32rpx;
}

.download-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #0d1526;
}

.file-info {
    margin-top: 24rpx;
    padding-top: 24rpx;
    border-top: 1rpx solid #f1f5f9;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-label {
    font-size: 26rpx;
    color: #64748b;
}

.info-value {
    font-size: 26rpx;
    color: #0d1526;
    font-weight: 600;
    max-width: 400rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.preview-card, .error-card, .stats-card, .tips-card {
    background-color: #ffffff;
    border-radius: 20rpx;
    padding: 28rpx;
    margin-bottom: 24rpx;
    border: 1rpx solid #e2e8f0;
    box-shadow: 0 4rpx 16rpx rgba(13, 21, 38, 0.03);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}

.card-title {
    font-size: 30rpx;
    font-weight: 700;
    color: #0d1526;
}

.error-title {
    color: #dc2626;
}

.preview-count, .error-count {
    font-size: 24rpx;
    color: #64748b;
}

.error-count {
    color: #dc2626;
}

.preview-scroll {
    width: 100%;
    height: auto;
    max-height: 600rpx;
}

.preview-table {
    width: 1200rpx;
    display: flex;
    flex-direction: column;
}

.preview-header {
    display: flex;
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    border-radius: 12rpx 12rpx 0 0;
    position: sticky;
    top: 0;
    z-index: 10;
}

.preview-th {
    flex: 1;
    min-width: 120rpx;
    padding: 20rpx 16rpx;
    font-size: 24rpx;
    color: #ffffff;
    font-weight: 600;
    text-align: center;
    border-right: 1rpx solid rgba(255, 255, 255, 0.1);
}

.preview-th:last-child {
    border-right: none;
}

.preview-body {
    border: 1rpx solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 12rpx 12rpx;
}

.preview-row {
    display: flex;
    border-bottom: 1rpx solid #f1f5f9;
}

.preview-row:last-child {
    border-bottom: none;
}

.preview-row:nth-child(odd) {
    background-color: #fafafa;
}

.preview-td {
    flex: 1;
    min-width: 120rpx;
    padding: 20rpx 16rpx;
    font-size: 24rpx;
    color: #334155;
    text-align: center;
    border-right: 1rpx solid #f1f5f9;
}

.preview-td:last-child {
    border-right: none;
}

.status-tag {
    display: inline-block;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 600;
}

.status-enabled {
    background-color: #dcfce7;
    color: #16a34a;
}

.status-disabled {
    background-color: #fee2e2;
    color: #dc2626;
}

.error-list {
    max-height: 300rpx;
    overflow-y: auto;
}

.error-item {
    padding: 16rpx;
    background-color: #fef2f2;
    border-radius: 12rpx;
    margin-bottom: 12rpx;
}

.error-item:last-child {
    margin-bottom: 0;
}

.error-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.error-badge {
    font-size: 22rpx;
    color: #dc2626;
    font-weight: 700;
    background-color: #fee2e2;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

.error-message {
    font-size: 24rpx;
    color: #991b1b;
    flex: 1;
}

.stats-grid {
    display: flex;
    justify-content: space-around;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
}

.stat-value {
    font-size: 48rpx;
    font-weight: 800;
    color: #0d1526;
}

.stat-item.success .stat-value {
    color: #16a34a;
}

.stat-item.error .stat-value {
    color: #dc2626;
}

.stat-label {
    font-size: 24rpx;
    color: #64748b;
    margin-top: 8rpx;
}

.tips-title {
    font-size: 28rpx;
    font-weight: 700;
    color: #0d1526;
    margin-bottom: 20rpx;
    display: block;
}

.tips-list {
    padding-left: 16rpx;
}

.tip-item {
    font-size: 24rpx;
    color: #475569;
    line-height: 1.8;
    display: block;
    margin-bottom: 12rpx;
}

.tip-item:last-child {
    margin-bottom: 0;
}

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

.btn-icon {
    margin-right: 12rpx;
}

.btn-primary {
    background: linear-gradient(135deg, #0d1526 0%, #1e293b 100%);
    color: #ffffff;
    box-shadow: 0 8rpx 24rpx rgba(13, 21, 38, 0.2);
}

.btn-primary:disabled {
    background: #cbd5e1;
    box-shadow: none;
}

.btn-secondary {
    background-color: #ffffff;
    color: #0d1526;
    border: 2rpx solid #cbd5e1;
}

.btn-secondary:disabled {
    color: #94a3b8;
    border-color: #e2e8f0;
}

.btn-cancel {
    background-color: #f8fafc;
    color: #64748b;
    border: 1rpx solid #e2e8f0;
}
</style>