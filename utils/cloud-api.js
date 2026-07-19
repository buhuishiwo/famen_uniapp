// 微信云开发 API 封装
// 替换原来的 HTTP 请求为云函数调用

// 调用云函数的通用封装
async function callCloudFunction(name, data) {
  try {
    const result = await wx.cloud.callFunction({
      name: name,
      data: data
    });
    if (result.result.success) {
      return result.result.data;
    } else {
      throw new Error(result.result.message || '请求失败');
    }
  } catch (error) {
    console.error('云函数调用失败 [' + name + ']:', error);
    throw error;
  }
}

// 调用云函数并返回完整结果（用于需要message等额外字段的场景）
async function callCloudFunctionRaw(name, data) {
  try {
    const result = await wx.cloud.callFunction({
      name: name,
      data: data
    });
    return result.result;
  } catch (error) {
    console.error('云函数调用失败 [' + name + ']:', error);
    throw error;
  }
}

// 报价相关API
export const quotationApi = {
  // 创建报价单
  create(data) {
    return callCloudFunction('quotation', {
      action: 'createQuotation',
      customerName: data.customerName,
      note: data.note,
      paymentMethod: data.paymentMethod,
      packaging: data.packaging,
      quoter: data.quoter,
      quoterPhone: data.quoterPhone,
      validity: data.validity,
      items: data.items
    });
  },

  // 获取报价单列表
  getList(page = 1, limit = 10, status = null) {
    const params = {
      action: 'getQuotationList',
      page,
      limit
    };
    if (status) params.status = status;
    return callCloudFunction('quotation', params);
  },

  // 获取报价单详情
  getDetail(id) {
    return callCloudFunction('quotation', {
      action: 'getQuotationDetail',
      id
    });
  },

  // 更新报价单
  update(id, data) {
    return callCloudFunction('quotation', {
      action: 'updateQuotation',
      id,
      ...data
    });
  },

  // 删除报价单
  delete(id) {
    return callCloudFunction('quotation', {
      action: 'deleteQuotation',
      id
    });
  }
};

// 价格库相关API
export const priceApi = {
  // 获取价格数据
  getPrices(series = null) {
    const params = { action: 'getPrices' };
    if (series) params.series = series;
    return callCloudFunction('price', params);
  },

  // 获取产品图片（云存储临时链接）
  getImages() {
    return callCloudFunction('images');
  },

  // 获取所有产品系列
  getSeries() {
    return callCloudFunction('price', { action: 'getAllSeries' });
  },

  // 获取所有阀门型号
  getModels() {
    return callCloudFunction('price', { action: 'getAllModels' });
  },

  // 根据系列名称获取阀门型号
  getModelsBySeries(seriesName) {
    return callCloudFunction('price', {
      action: 'getModelsBySeries',
      seriesName
    });
  },

  // 获取报价系数规则
  getPricingRules() {
    return callCloudFunctionRaw('price', { action: 'getPricingRules' });
  },

  // 获取所有材质数据
  getMaterials(seriesName) {
    return callCloudFunctionRaw('price', { action: 'getMaterials', seriesName });
  },

  // 根据型号ID获取材质
  getMaterialByModel(modelId) {
    return callCloudFunctionRaw('price', { action: 'getMaterialByModel', modelId });
  },

  // 获取材质价差数据
  getMaterialDiffs(seriesName) {
    return callCloudFunctionRaw('price', { action: 'getMaterialDiffs', seriesName });
  },

  // 获取单个材质价差
  getMaterialDiff(seriesName, partName, baseMaterial, targetMaterial, dn) {
    return callCloudFunctionRaw('price', { 
      action: 'getMaterialDiff', 
      seriesName, 
      partName, 
      baseMaterial, 
      targetMaterial, 
      dn 
    });
  },

  // 获取所有可用材质列表
  getAllMaterials() {
    return callCloudFunctionRaw('price', { action: 'getAllMaterials' });
  },

  // 获取模板下载链接
  async getTemplateUrl() {
    return callCloudFunction('template');
  },

  // 获取材质库模板下载链接
  async getMaterialLibraryTemplateUrl() {
    return callCloudFunction('template', { action: 'materialLibrary' });
  },

  // 获取营销员列表
  getSalespersons() {
    return callCloudFunctionRaw('price', { action: 'getSalespersons' });
  },

  // 获取客户列表
  getCustomers(salespersonId = null) {
    const params = { action: 'getCustomers' };
    if (salespersonId) params.salespersonId = salespersonId;
    return callCloudFunctionRaw('price', params);
  },

  // 获取规格参数
  getModelSpecs(valveName, size) {
    return callCloudFunctionRaw('price', { action: 'getModelSpec', valveName, size });
  }
};

// 用户相关API
export const userApi = {
  // 用户登录
  login(username, password) {
    return callCloudFunction('user', {
      action: 'login',
      username,
      password
    });
  },

  // 用户注册
  register(username, password, nickname, email, phone) {
    return callCloudFunction('user', {
      action: 'register',
      username,
      password,
      nickname,
      email,
      phone
    });
  },

  // 获取用户信息
  getProfile(id) {
    return callCloudFunction('user', {
      action: 'getProfile',
      id
    });
  },

  // 获取所有用户
  getAllUsers() {
    return callCloudFunction('user', { action: 'getAllUsers' });
  },

  // 更新用户信息
  update(id, data) {
    return callCloudFunction('user', {
      action: 'updateUser',
      id,
      ...data
    });
  },

  // 修改密码
  changePassword(id, oldPassword, newPassword) {
    return callCloudFunction('user', {
      action: 'changePassword',
      id,
      oldPassword,
      newPassword
    });
  },

  // 删除用户
  delete(id) {
    return callCloudFunction('user', {
      action: 'deleteUser',
      id
    });
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
