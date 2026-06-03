const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000/api';

class QuotationAPIClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(method, endpoint, data = null, isFormData = false) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {},
    };

    if (isFormData) {
      options.body = data;
    } else if (data) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      return { status: response.status, data: result };
    } catch (error) {
      console.error('请求失败:', error.message);
      throw error;
    }
  }

  async importPrice(filePath) {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    return this.request('POST', '/quotations/import', form, true);
  }

  async confirmImport(data) {
    return this.request('POST', '/quotations/import/confirm', { data });
  }

  async createQuotation(quotationData) {
    return this.request('POST', '/quotations', quotationData);
  }

  async getQuotations(page = 1, limit = 10, status) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    return this.request('GET', `/quotations?${params.toString()}`);
  }

  async getQuotation(id) {
    return this.request('GET', `/quotations/${id}`);
  }

  async updateQuotation(id, data) {
    return this.request('PUT', `/quotations/${id}`, data);
  }

  async deleteQuotation(id) {
    return this.request('DELETE', `/quotations/${id}`);
  }
}

async function testAPI() {
  const client = new QuotationAPIClient();
  console.log('🚀 开始测试阀门报价系统API\n');

  try {
    console.log('📤 测试1: 导入价格库Excel文件');
    const excelPath = path.join(__dirname, '..', '报价更新正式生产版模板.xlsx');
    if (!fs.existsSync(excelPath)) {
      console.log('❌ Excel文件不存在:', excelPath);
      return;
    }

    const importResult = await client.importPrice(excelPath);
    console.log('导入结果:', JSON.stringify(importResult.data, null, 2));
    console.log('');

    if (importResult.data.success && importResult.data.data.previewData.length > 0) {
      console.log('💾 测试2: 确认导入价格数据');
      const confirmResult = await client.confirmImport(importResult.data.data.previewData);
      console.log('确认结果:', JSON.stringify(confirmResult.data, null, 2));
      console.log('');
    }

    console.log('📋 测试3: 创建报价单');
    const quotationData = {
      customerName: 'XX阀门有限公司',
      note: '阀体WCB，闸板304，单向硬密封',
      paymentMethod: '预定定金30%，付清余款发货',
      packaging: '木箱包装',
      quoter: '童惠业',
      quoterPhone: '13957713583',
      validity: '15天',
      items: [
        {
          valveName: 'QBZ73X-10C',
          spec: 100,
          gatePlate: '304',
          rodMaterial: '2Cr13',
          quantity: 5,
          branding: true,
          productType: '常规品',
        },
        {
          valveName: 'QBZ73X-10C',
          spec: 150,
          gatePlate: '316',
          rodMaterial: '304',
          quantity: 3,
          branding: false,
          productType: '常规品',
        },
      ],
    };

    const createResult = await client.createQuotation(quotationData);
    console.log('创建结果:', JSON.stringify(createResult.data, null, 2));
    console.log('');

    if (createResult.data.success) {
      const quotationId = createResult.data.data.id;

      console.log('📄 测试4: 查询报价单详情');
      const getResult = await client.getQuotation(quotationId);
      console.log('查询结果:', JSON.stringify(getResult.data, null, 2));
      console.log('');

      console.log('📊 测试5: 查询报价单列表');
      const listResult = await client.getQuotations(1, 10);
      console.log('列表结果:', JSON.stringify(listResult.data, null, 2));
      console.log('');

      console.log('✏️ 测试6: 更新报价单状态');
      const updateResult = await client.updateQuotation(quotationId, {
        status: 'approved',
      });
      console.log('更新结果:', JSON.stringify(updateResult.data, null, 2));
      console.log('');

      console.log('🗑️ 测试7: 删除报价单');
      const deleteResult = await client.deleteQuotation(quotationId);
      console.log('删除结果:', JSON.stringify(deleteResult.data, null, 2));
      console.log('');
    }

    console.log('✅ 所有测试完成！');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

if (require.main === module) {
  testAPI();
}

module.exports = { QuotationAPIClient, testAPI };