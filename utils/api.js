// API配置
const BASE_URL = 'http://localhost:3000/api';

// 请求封装
function request(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            url: BASE_URL + url,
            method: method,
            header: {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data);
                } else {
                    reject(new Error(res.data.message || '请求失败'));
                }
            },
            fail: (err) => {
                reject(err);
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.data = data;
        }

        uni.request(options);
    });
}

// 报价相关API
export const quotationApi = {
    // 创建报价单
    create(data) {
        return request('/quotations', 'POST', data);
    },

    // 获取报价单列表
    getList(page = 1, limit = 10, status = null) {
        let url = `/quotations?page=${page}&limit=${limit}`;
        if (status) {
            url += `&status=${status}`;
        }
        return request(url);
    },

    // 获取报价单详情
    getDetail(id) {
        return request(`/quotations/${id}`);
    },

    // 更新报价单
    update(id, data) {
        return request(`/quotations/${id}`, 'PUT', data);
    },

    // 删除报价单
    delete(id) {
        return request(`/quotations/${id}`, 'DELETE');
    }
};

// 价格库相关API
export const priceApi = {
    // 获取价格数据
    getPrices(series = null) {
        let url = '/quotations/prices';
        if (series) {
            url += `?series=${encodeURIComponent(series)}`;
        }
        return request(url);
    },

    // 获取所有产品系列
    getSeries() {
        return request('/quotations/series');
    },

    // 获取所有阀门型号
    getModels() {
        return request('/quotations/models');
    },

    // 根据系列名称获取阀门型号
    getModelsBySeries(seriesName) {
        return request(`/quotations/series/${encodeURIComponent(seriesName)}/models`);
    },

    // 导入价格数据（base64）
    importBase64(fileData, fileName) {
        return request('/quotations/import/base64', 'POST', { fileData, fileName });
    },

    // 确认导入
    confirmImport(data) {
        return request('/quotations/import/confirm', 'POST', { data });
    }
};

export default {
    quotation: quotationApi,
    price: priceApi
};
