// API配置
const BASE_URL = 'https://wzyaoyao.com/api/v2';

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

// 用户相关API
export const userApi = {
    // 用户登录
    login(username, password) {
        return request('/users/login', 'POST', { username, password });
    },

    // 用户注册
    register(username, password, nickname, email, phone) {
        return request('/users/register', 'POST', { username, password, nickname, email, phone });
    },

    // 获取用户信息
    getProfile(id) {
        return request(`/users/profile/${id}`);
    },

    // 更新用户信息
    update(id, data) {
        return request(`/users/${id}`, 'PUT', data);
    },

    // 修改密码
    changePassword(id, oldPassword, newPassword) {
        return request(`/users/${id}/password`, 'PUT', { oldPassword, newPassword });
    }
};

// 本地存储工具
export const storage = {
    // 保存用户信息
    saveUser(user) {
        uni.setStorageSync('user', JSON.stringify(user));
    },

    // 获取用户信息
    getUser() {
        const user = uni.getStorageSync('user');
        return user ? JSON.parse(user) : null;
    },

    // 删除用户信息
    removeUser() {
        uni.removeStorageSync('user');
    },

    // 检查是否登录
    isLoggedIn() {
        return !!this.getUser();
    }
};

export default {
    quotation: quotationApi,
    price: priceApi,
    user: userApi,
    storage
};
