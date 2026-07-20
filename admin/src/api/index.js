import cloudbase from '@cloudbase/js-sdk';

const app = cloudbase.init({
  env: 'cloud1-d2g6k45v21dd52696',
});

let authReady = null;

function ensureAuth() {
  if (!authReady) {
    authReady = (async () => {
      const auth = app.auth({ persistence: 'local' });
      // 检查是否已登录
      const loginState = await auth.getLoginState();
      if (!loginState) {
        await auth.signInAnonymously();
      }
      return true;
    })();
  }
  return authReady;
}

export async function uploadFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result.split(',')[1];
      try {
        await ensureAuth();
        const result = await app.callFunction({
          name: 'price',
          data: {
            action: 'uploadImage',
            base64Data: base64Data,
            fileName: file.name
          }
        });
        if (result.result.success) {
          resolve(result.result.data);
        } else {
          reject(new Error(result.result.message));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function getFileUrl(fileID) {
  await ensureAuth();
  const result = await app.getTempFileURL({
    fileList: [fileID]
  });
  return result.fileList?.[0]?.tempFileURL || '';
}

async function callCloudFunction(data = {}) {
  try {
    await ensureAuth();
    const result = await app.callFunction({
      name: 'price',
      data: data
    });
    const res = result.result;
    if (res.success) {
      return res.data;
    }
    throw new Error(res.message || '请求失败');
  } catch (error) {
    console.error('Cloud Function Error:', error);
    throw error;
  }
}

export const seriesApi = {
  getAll() {
    return callCloudFunction({ action: 'getAllSeries' });
  },
  create(data) {
    return callCloudFunction({ action: 'createSeries', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateSeries', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteSeries', id });
  },
  deleteCascade(id, name) {
    return callCloudFunction({ action: 'deleteSeriesCascade', id, name });
  }
};

export const modelApi = {
  getAll() {
    return callCloudFunction({ action: 'getAllModels' });
  },
  getBySeries(seriesName) {
    return callCloudFunction({ action: 'getModelsBySeries', seriesName });
  },
  create(data) {
    return callCloudFunction({ action: 'createModel', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateModel', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteModel', id });
  }
};

export const priceApi = {
  getAll() {
    return callCloudFunction({ action: 'getAllPrices' });
  },
  getBySeries(seriesName) {
    return callCloudFunction({ action: 'getPricesBySeries', series: seriesName });
  },
  create(data) {
    return callCloudFunction({ action: 'createPrice', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updatePrice', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deletePrice', id });
  },
  batchSetMinOrderQty(data) {
    return callCloudFunction({ action: 'batchSetMinOrderQty', data });
  }
};

export const materialApi = {
  getAll() {
    return callCloudFunction({ action: 'getMaterials' });
  },
  getBySeries(seriesName) {
    return callCloudFunction({ action: 'getMaterials', seriesName });
  },
  create(data) {
    return callCloudFunction({ action: 'createMaterial', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateMaterial', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteMaterial', id });
  }
};

export const coefficientApi = {
  getAll() {
    return callCloudFunction({ action: 'getPricingRules' });
  },
  create(data) {
    return callCloudFunction({ action: 'createCoefficient', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateCoefficient', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteCoefficient', id });
  },
  applyToAllSeries(data) {
    return callCloudFunction({ action: 'applyCoefficientToAllSeries', data });
  },
  batchSetBrandingFee(data) {
    return callCloudFunction({ action: 'batchSetBrandingFee', data });
  }
};

export const materialDiffApi = {
  getAll() {
    return callCloudFunction({ action: 'getMaterialDiffs' });
  },
  create(data) {
    return callCloudFunction({ action: 'createMaterialDiff', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateMaterialDiff', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteMaterialDiff', id });
  }
};

export const materialLibApi = {
  getAll() {
    return callCloudFunction({ action: 'getMaterialLib' });
  },
  create(data) {
    return callCloudFunction({ action: 'createMaterialLib', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateMaterialLib', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteMaterialLib', id });
  }
};

export const materialComboApi = {
  getAll() {
    return callCloudFunction({ action: 'getMaterialCombos' });
  },
  create(data) {
    return callCloudFunction({ action: 'createMaterialCombo', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateMaterialCombo', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteMaterialCombo', id });
  }
};

export const modelSpecApi = {
  getAll(params) {
    return callCloudFunction({ action: 'getModelSpecs', ...params });
  },
  getByModel(valveName, size) {
    return callCloudFunction({ action: 'getModelSpec', valveName, size });
  },
  create(data) {
    return callCloudFunction({ action: 'createModelSpec', data });
  },
  batchCreate(data) {
    return callCloudFunction({ action: 'batchCreateModelSpec', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateModelSpec', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteModelSpec', id });
  }
};

export const salespersonApi = {
  getAll() {
    return callCloudFunction({ action: 'getSalespersons' });
  },
  create(data) {
    return callCloudFunction({ action: 'createSalesperson', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateSalesperson', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteSalesperson', id });
  }
};

export const customerApi = {
  getAll(params) {
    return callCloudFunction({ action: 'getCustomers', ...params });
  },
  create(data) {
    return callCloudFunction({ action: 'createCustomer', data });
  },
  update(id, data) {
    return callCloudFunction({ action: 'updateCustomer', id, data });
  },
  delete(id) {
    return callCloudFunction({ action: 'deleteCustomer', id });
  }
};

export const statsApi = {
  getDashboardStats() {
    return callCloudFunction({ action: 'getDashboardStats' });
  }
};

export const userApi = {
  login(username, password) {
    return new Promise((resolve, reject) => {
      ensureAuth().then(async () => {
        try {
          const result = await app.callFunction({
            name: 'user',
            data: { action: 'login', username, password }
          });
          if (result.result.success) {
            resolve(result.result.data);
          } else {
            reject(new Error(result.result.message));
          }
        } catch (error) {
          reject(error);
        }
      }).catch(reject);
    });
  }
};
