// 价格数据查询云函数
const cloudbase = require('@cloudbase/node-sdk');

const ENV_ID = 'cloud1-d2g6k45v21dd52696';
const app = cloudbase.init({ env: ENV_ID });
const rdb = app.rdb();

/**
 * RDB 默认 limit=1000，超出的数据会被截断。
 * 此函数通过 range 分页循环获取全量数据。
 */
async function selectAll(table, columns, pageSize) {
  pageSize = pageSize || 1000;
  var all = [];
  var start = 0;
  while (true) {
    var end = start + pageSize - 1;
    var res = await rdb.from(table).select(columns).range(start, end);
    if (res.error) {
      console.error('[selectAll] 查询失败 table=' + table + ' range=' + start + '-' + end + ' error=' + JSON.stringify(res.error));
      break;
    }
    if (!res.data || res.data.length === 0) break;
    all = all.concat(res.data);
    if (res.data.length < pageSize) break;
    start += pageSize;
  }
  return all;
}

exports.main = async (event, context) => {
  const { action } = event;
  try {
    switch (action) {
      case 'getPrices':        return await getPrices(event);
      case 'getAllPrices':     return await getAllPrices();
      case 'getPricesBySeries': return await getPrices(event);
      case 'getAllSeries':     return await getAllSeries();
      case 'getAllModels':     return await getAllModels();
      case 'getModelsBySeries': return await getModelsBySeries(event);
      case 'getSizesByModel': return await getSizesByModel(event);
      case 'getPricingRules':  return await getPricingRules();
      case 'getMaterials':     return await getMaterials(event);
      case 'getMaterialByModel': return await getMaterialByModel(event);
      case 'getMaterialDiffs': return await getMaterialDiffs(event);
      case 'getMaterialDiff': return await getMaterialDiff(event);
      case 'getMaterialDiffByPart': return await getMaterialDiffByPart(event);
      case 'getAllMaterials': return await getAllMaterials();
      case 'getDashboardStats': return await getDashboardStats();

      // ===== 管理后台 CRUD =====
      case 'createSeries': return await createSeries(event);
      case 'updateSeries': return await updateSeries(event);
      case 'deleteSeries': return await deleteSeries(event);
      case 'deleteSeriesCascade': return await deleteSeriesCascade(event);
      case 'createModel': return await createModel(event);
      case 'updateModel': return await updateModel(event);
      case 'deleteModel': return await deleteModel(event);
      case 'createPrice': return await createPrice(event);
      case 'updatePrice': return await updatePrice(event);
      case 'deletePrice': return await deletePrice(event);
      case 'createMaterial': return await createMaterial(event);
      case 'updateMaterial': return await updateMaterial(event);
      case 'deleteMaterial': return await deleteMaterial(event);
      case 'createModelSpec': return await createModelSpec(event);
      case 'batchCreateModelSpec': return await batchCreateModelSpec(event);
      case 'updateModelSpec': return await updateModelSpec(event);
      case 'deleteModelSpec': return await deleteModelSpec(event);
      case 'getModelSpecs': return await getModelSpecs(event);
      case 'getModelSpec': return await getModelSpec(event);
      case 'createCoefficient': return await createCoefficient(event);
      case 'updateCoefficient': return await updateCoefficient(event);
      case 'deleteCoefficient': return await deleteCoefficient(event);
      case 'applyCoefficientToAllSeries': return await applyCoefficientToAllSeries(event);
      case 'batchSetBrandingFee': return await batchSetBrandingFee(event);
      case 'batchSetMinOrderQty': return await batchSetMinOrderQty(event);
      case 'createMaterialDiff': return await createMaterialDiff(event);
      case 'updateMaterialDiff': return await updateMaterialDiff(event);
      case 'deleteMaterialDiff': return await deleteMaterialDiff(event);
      case 'getMaterialLib': return await getMaterialLib();
      case 'createMaterialLib': return await createMaterialLib(event);
      case 'updateMaterialLib': return await updateMaterialLib(event);
      case 'deleteMaterialLib': return await deleteMaterialLib(event);
      case 'getMaterialCombos': return await getMaterialCombos();
      case 'createMaterialCombo': return await createMaterialCombo(event);
      case 'updateMaterialCombo': return await updateMaterialCombo(event);
      case 'deleteMaterialCombo': return await deleteMaterialCombo(event);

      // ===== 营销员和客户 =====
      case 'getSalespersons': return await getSalespersons();
      case 'createSalesperson': return await createSalesperson(event);
      case 'updateSalesperson': return await updateSalesperson(event);
      case 'deleteSalesperson': return await deleteSalesperson(event);
      case 'getCustomers': return await getCustomers(event);
      case 'createCustomer': return await createCustomer(event);
      case 'updateCustomer': return await updateCustomer(event);
      case 'deleteCustomer': return await deleteCustomer(event);
      case 'uploadImage': return await uploadImage(event);

      // ===== 系统设置 =====
      case 'getSystemConfig': return await getSystemConfig(event);
      case 'setSystemConfig': return await setSystemConfig(event);

      default: return { success: false, message: '未知操作: ' + action };
    }
  } catch (error) {
    console.error('Price函数错误:', error);
    return { success: false, message: error.message || '服务器错误' };
  }
};

function getMinOrderQty(priceItem) {
  return Number(priceItem.min_order_qty) || 50;
}

// 格式化价格行
function mapPriceRow(p, rules) {
  const seriesName = p.series_name || '';
  const size = p.size;
  const minOrderQty = getMinOrderQty(p);
  
  return {
    id: p.id,
    modelId: p.model_id,
    seriesName: seriesName,
    valveName: p.valve_name || '',
    size: size,
    price: Number(p.price) || 0,
    gatePlate304Diff: Number(p.gate_304_diff) || 0,
    gatePlate316Diff: Number(p.gate_316_diff) || 0,
    rod304Diff: Number(p.rod_304_diff) || 0,
    rod316Diff: Number(p.rod_316_diff) || 0,
    brandingFee: Number(p.branding_fee) || 0,
    minOrderQty: minOrderQty,
    status: p.status,
    remark: p.remark || '',
    createdAt: p.created_at
  };
}

// 获取价格数据
async function getAllPrices() {
  return await getPrices({});
}

async function getPrices(event) {
  const { series } = event;
  try {
    var pricingRules = await selectAll('pricing_rules', 'series_name,dn_min,dn_max,min_order_qty');
    
    if (series) {
      // 先查系列ID
      const { data: seriesData, error: sErr } = await rdb.from('product_series').select('id').eq('name', series);
      if (sErr) return { success: false, message: '查询系列失败: ' + sErr.message };
      if (!seriesData || seriesData.length === 0) return { success: true, data: [] };

      const seriesId = seriesData[0].id;

      // 查该系列下所有型号ID
      const { data: models, error: mErr } = await rdb.from('valve_models').select('id, name, type_code').eq('series_id', seriesId);
      if (mErr) return { success: false, message: '查询型号失败: ' + mErr.message };
      if (!models || models.length === 0) return { success: true, data: [] };

      // 一次全量查询所有启用价格，内存过滤（避免 RDB 1000 行限制）
      console.log('[getPrices] 全量查询价格表...');
      var allPrices = await selectAll('price_table', '*');
      console.log('[getPrices] 价格总数: ' + allPrices.length);

      var modelIdSet = {};
      for (const m of models) modelIdSet[m.id] = m;

      var result = [];
      for (const p of allPrices) {
        var model = modelIdSet[p.model_id];
        if (model && p.status === 'enabled') {
          result.push(mapPriceRow({
            ...p,
            series_name: series,
            valve_name: model.name
          }, pricingRules));
        }
      }
      // 按型号名 + 规格排序
      result.sort(function(a, b) {
        if (a.valveName !== b.valveName) return a.valveName.localeCompare(b.valveName);
        return (a.size || 0) - (b.size || 0);
      });
      console.log('[getPrices] 过滤后结果数: ' + result.length);
      return { success: true, data: result };
    } else {
      // 查所有价格（全量分页查询，去掉旧的 limit 500 限制）
      console.log('[getPrices] 全量查询所有价格...');
      var allPrices = await selectAll('price_table', '*');
      console.log('[getPrices] 价格总数: ' + allPrices.length);
      // 只保留启用状态
      allPrices = allPrices.filter(function(p) { return p.status === 'enabled'; });
      if (allPrices.length === 0) return { success: true, data: [] };

      // 一次性查所有型号和系列
      const [mRes, sRes] = await Promise.all([
        rdb.from('valve_models').select('id, name, series_id'),
        rdb.from('product_series').select('id, name')
      ]);

      const modelMap = {};
      for (const m of (mRes.data || [])) modelMap[m.id] = m;
      const seriesMap = {};
      for (const s of (sRes.data || [])) seriesMap[s.id] = s.name;

      return {
        success: true,
        data: allPrices.map(function(p) {
          var m = modelMap[p.model_id];
          return mapPriceRow({
            ...p,
            series_name: m ? (seriesMap[m.series_id] || '') : '',
            valve_name: m ? m.name : ''
          }, pricingRules);
        })
      };
    }
  } catch (e) {
    console.error('getPrices错误:', e);
    return { success: false, message: e.message };
  }
}

// 获取所有产品系列
async function getAllSeries() {
  const { data, error } = await rdb.from('product_series').select('id, name, image').order('id');
  if (error) return { success: false, message: '查询失败: ' + error.message };
  return { success: true, data: (data || []).map(s => ({ id: s.id, name: s.name, image: s.image || '' })) };
}

// 获取所有阀门型号（按系列分组）—— 优化版：一次查全部，内存分组
async function getAllModels() {
  // 一次性查出所有系列和型号
  const [sRes, mRes] = await Promise.all([
    rdb.from('product_series').select('id, name').order('id'),
    rdb.from('valve_models').select('id, name, type_code, series_id').order('id')
  ]);

  if (sRes.error) return { success: false, message: '查询系列失败: ' + sRes.error.message };
  if (mRes.error) return { success: false, message: '查询型号失败: ' + mRes.error.message };

  // 构建 series_id → name 映射
  const seriesMap = {};
  for (const s of (sRes.data || [])) seriesMap[s.id] = s.name;

  // 按系列分组
  const result = {};
  for (const m of (mRes.data || [])) {
    const sn = seriesMap[m.series_id] || '未知系列';
    if (!result[sn]) result[sn] = [];
    result[sn].push({ id: m.id, name: m.name, type: m.type_code || '' });
  }
  return { success: true, data: result };
}

// 根据系列名称获取阀门型号
async function getModelsBySeries(event) {
  const { seriesName } = event;
  if (!seriesName) return { success: false, message: '系列名称不能为空' };

  const { data: s, error: sErr } = await rdb.from('product_series').select('id').eq('name', seriesName);
  if (sErr) return { success: false, message: '查询失败: ' + sErr.message };
  if (!s || s.length === 0) return { success: true, data: [] };

  const { data: models, error: mErr } = await rdb.from('valve_models').select('id, name, type_code, series_id').eq('series_id', s[0].id).order('id');
  if (mErr) return { success: false, message: '查询型号失败: ' + mErr.message };

  return {
    success: true,
    data: (models || []).map(m => ({ id: m.id, name: m.name, type: m.type_code || '', seriesId: m.series_id }))
  };
}

async function getSizesByModel(event) {
  const { valveName } = event;
  if (!valveName) return { success: false, message: '型号名称不能为空' };

  const { data, error } = await rdb.from('price_table').select('size').eq('valveName', valveName).order('size');
  if (error) return { success: false, message: '查询失败: ' + error.message };

  const sizes = [...new Set((data || []).map(item => item.size))].sort((a, b) => a - b);
  
  return {
    success: true,
    data: sizes
  };
}

// 获取报价系数规则
async function getPricingRules() {
  try {
    var rows = await selectAll('pricing_rules', '*');
    console.log('[getPricingRules] 查询到 ' + rows.length + ' 条规则');
    return {
      success: true,
      data: rows.map(function(r) {
        return {
          id: r.id,
          seriesName: r.series_name || '',
          productName: r.product_name || '',
          dnMin: r.dn_min,
          dnMax: r.dn_max,
          minOrderQty: Number(r.min_order_qty) || 50,
          moqMetOemCoeff: Number(r.moq_met_oem_coeff),
          moqMetOriginalCoeff: Number(r.moq_met_original_coeff),
          moqUnmetOemCoeff: Number(r.moq_unmet_oem_coeff),
          moqUnmetOriginalCoeff: Number(r.moq_unmet_original_coeff)
        };
      })
    };
  } catch (e) {
    console.error('[getPricingRules] 错误:', e);
    return { success: false, message: e.message };
  }
}

// 获取所有材质数据
async function getMaterials(event) {
  try {
    var allMaterials = await selectAll('valve_model_materials', '*');
    console.log('[getMaterials] 查询到 ' + allMaterials.length + ' 条材质数据');

    if (allMaterials.length === 0) {
      return { success: true, data: [] };
    }

    const [mRes, sRes] = await Promise.all([
      rdb.from('valve_models').select('id, name, series_id'),
      rdb.from('product_series').select('id, name')
    ]);

    const modelMap = {};
    for (const m of (mRes.data || [])) modelMap[m.id] = m;
    const seriesMap = {};
    for (const s of (sRes.data || [])) seriesMap[s.id] = s.name;

    const result = allMaterials.map(function(m) {
      var model = modelMap[m.model_id];
      return {
        id: m.id,
        modelId: m.model_id,
        seriesName: model ? (seriesMap[model.series_id] || '') : '',
        valveName: model ? model.name : '',
        bodyMaterial: m.body_material || '',
        gatePlateMaterial: m.gate_plate_material || '',
        stemMaterial: m.stem_material || '',
        yokeMaterial: m.yoke_material || '',
        remark: m.remark || ''
      };
    });

    if (event.seriesName) {
      return {
        success: true,
        data: result.filter(function(m) { return m.seriesName === event.seriesName; })
      };
    }

    return { success: true, data: result };
  } catch (e) {
    console.error('[getMaterials] 错误:', e);
    return { success: false, message: e.message };
  }
}

// 根据型号ID获取材质
async function getMaterialByModel(event) {
  const { modelId } = event;
  if (!modelId) return { success: false, message: '型号ID不能为空' };

  try {
    const { data: materials, error: mErr } = await rdb.from('valve_model_materials')
      .select('*')
      .eq('model_id', modelId);

    if (mErr) return { success: false, message: '查询材质失败: ' + mErr.message };
    if (!materials || materials.length === 0) return { success: true, data: null };

    const material = materials[0];

    const [mRes, sRes] = await Promise.all([
      rdb.from('valve_models').select('id, name, series_id').eq('id', modelId),
      rdb.from('product_series').select('id, name')
    ]);

    const model = mRes.data && mRes.data.length > 0 ? mRes.data[0] : null;
    const seriesMap = {};
    for (const s of (sRes.data || [])) seriesMap[s.id] = s.name;

    return {
      success: true,
      data: {
        id: material.id,
        modelId: material.model_id,
        seriesName: model ? (seriesMap[model.series_id] || '') : '',
        valveName: model ? model.name : '',
        bodyMaterial: material.body_material || '',
        gatePlateMaterial: material.gate_plate_material || '',
        stemMaterial: material.stem_material || '',
        yokeMaterial: material.yoke_material || '',
        remark: material.remark || ''
      }
    };
  } catch (e) {
    console.error('[getMaterialByModel] 错误:', e);
    return { success: false, message: e.message };
  }
}

async function getMaterialDiffs(event) {
  try {
    var allDiffs = await selectAll('material_price_diffs', '*');
    console.log('[getMaterialDiffs] 查询到 ' + allDiffs.length + ' 条价差数据');

    const result = allDiffs.map(function(d) {
      return {
        id: d.id,
        seriesName: d.series_name || '',
        modelName: d.model_name || '',
        size: d.size || null,
        partName: d.part_name || '',
        baseMaterial: d.base_material || '',
        targetMaterial: d.target_material || '',
        priceDiff: Number(d.price_diff) || 0,
        remark: d.remark || ''
      };
    });

    if (event.seriesName) {
      return {
        success: true,
        data: result.filter(function(d) { return d.seriesName === event.seriesName; })
      };
    }

    return { success: true, data: result };
  } catch (e) {
    console.error('[getMaterialDiffs] 错误:', e);
    return { success: false, message: e.message };
  }
}

async function getMaterialDiff(event) {
  const { seriesName, partName, baseMaterial, targetMaterial, dn, modelName } = event;
  if (!seriesName || !partName || !baseMaterial || !targetMaterial || dn === undefined) {
    return { success: false, message: '参数不完整' };
  }

  try {
    var allDiffs = await selectAll('material_price_diffs', '*');
    
    const candidates = allDiffs.filter(function(d) {
      return d.series_name === seriesName
        && d.part_name === partName
        && d.base_material === baseMaterial
        && d.target_material === targetMaterial;
    });

    let matched = null;
    if (candidates.length > 0) {
      if (modelName) {
        matched = candidates.find(d => d.model_name === modelName && d.size === dn);
      }
      if (!matched && modelName) {
        matched = candidates.find(d => d.model_name === modelName && d.size === null);
      }
      if (!matched) {
        matched = candidates.find(d => d.size === dn && d.model_name === '');
      }
      if (!matched) {
        matched = candidates.find(d => d.size === null && d.model_name === '');
      }
    }

    if (matched) {
      return {
        success: true,
        data: {
          id: matched.id,
          seriesName: matched.series_name,
          modelName: matched.model_name || '',
          size: matched.size || null,
          partName: matched.part_name,
          baseMaterial: matched.base_material,
          targetMaterial: matched.target_material,
          priceDiff: Number(matched.price_diff) || 0
        }
      };
    }

    return { success: true, data: null };
  } catch (e) {
    console.error('[getMaterialDiff] 错误:', e);
    return { success: false, message: e.message };
  }
}

/**
 * 按部位查询材质差价（带优先级匹配）
 * 优先级：精确(型号+尺寸) > 型号 > 系列 > 全局
 */
async function getMaterialDiffByPart(event) {
  const { seriesName, modelName, size, partName, baseMaterial, targetMaterial } = event;
  if (!partName || !baseMaterial || !targetMaterial) {
    return { success: true, data: null };
  }

  // baseMaterial 和 targetMaterial 相同说明没有材质变化
  if (baseMaterial === targetMaterial) {
    return { success: true, data: null };
  }

  try {
    var allDiffs = await selectAll('material_price_diffs', '*');

    const candidates = allDiffs.filter(function(d) {
      return d.part_name === partName
        && d.base_material === baseMaterial
        && d.target_material === targetMaterial;
    });

    if (candidates.length === 0) {
      return { success: true, data: null };
    }

    // 优先级匹配
    let matched = null;

    // 1. 精确匹配：型号 + 尺寸
    if (modelName && size !== undefined && size !== null) {
      matched = candidates.find(d =>
        d.model_name === modelName && Number(d.size) === Number(size)
      );
    }

    // 2. 型号级匹配（不限尺寸）
    if (!matched && modelName) {
      matched = candidates.find(d => d.model_name === modelName && (d.size === null || d.size === undefined));
    }

    // 3. 系列级匹配
    if (!matched && seriesName) {
      matched = candidates.find(d =>
        d.series_name === seriesName
        && (d.model_name === null || d.model_name === undefined || d.model_name === '')
      );
    }

    // 4. 全局匹配
    if (!matched) {
      matched = candidates.find(d =>
        (d.series_name === null || d.series_name === undefined || d.series_name === '')
        && (d.model_name === null || d.model_name === undefined || d.model_name === '')
      );
    }

    if (matched) {
      return {
        success: true,
        data: {
          priceDiff: Number(matched.price_diff) || 0,
          level: matched.model_name ? (matched.size ? 'exact' : 'model') : (matched.series_name ? 'series' : 'global')
        }
      };
    }

    return { success: true, data: null };
  } catch (e) {
    console.error('[getMaterialDiffByPart] 错误:', e);
    return { success: false, message: e.message };
  }
}

async function getAllMaterials() {
  try {
    var allDiffs = await selectAll('material_price_diffs', '*');
    
    const materials = new Set();
    for (const d of allDiffs) {
      if (d.base_material) materials.add(d.base_material);
      if (d.target_material) materials.add(d.target_material);
    }

    const parts = new Set();
    for (const d of allDiffs) {
      if (d.part_name) parts.add(d.part_name);
    }

    return {
      success: true,
      data: {
        materials: Array.from(materials),
        parts: Array.from(parts)
      }
    };
  } catch (e) {
    console.error('[getAllMaterials] 错误:', e);
    return { success: false, message: e.message };
  }
}

// ============================================
// ===== 管理后台 CRUD 操作 =====
// ============================================

function now() {
  var d = new Date();
  var yyyy = d.getFullYear();
  var MM = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  var HH = String(d.getHours()).padStart(2, '0');
  var mm = String(d.getMinutes()).padStart(2, '0');
  var ss = String(d.getSeconds()).padStart(2, '0');
  return yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
}

// ----- 产品系列 -----
async function createSeries(event) {
  const { data } = event;
  if (!data || !data.name) return { success: false, message: '系列名称不能为空' };
  const { error } = await rdb.from('product_series').insert({
    _openid: 'admin', name: data.name, image: data.image || '', created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateSeries(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.image !== undefined) updateData.image = data.image;
  const { error } = await rdb.from('product_series').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteSeries(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var { data: models } = await rdb.from('valve_models').select('id').eq('series_id', id);
  if (models && models.length > 0) return { success: false, message: '该系列下存在型号，无法删除' };
  const { error } = await rdb.from('product_series').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

async function deleteSeriesCascade(event) {
  const { id, name } = event;
  if (!id && !name) return { success: false, message: '系列ID或名称不能为空' };

  try {
    // 如果只传了name，先查id
    var seriesId = id;
    if (!seriesId) {
      var { data: s } = await rdb.from('product_series').select('id').eq('name', name);
      if (!s || s.length === 0) return { success: false, message: '系列不存在' };
      seriesId = s[0].id;
    }

    // 查该系列下所有型号
    var { data: models, error: mErr } = await rdb.from('valve_models').select('id, name').eq('series_id', seriesId);
    if (mErr) return { success: false, message: '查询型号失败: ' + mErr.message };

    var modelIds = (models || []).map(function(m) { return m.id; });
    var deletedCount = { models: 0, prices: 0, materials: 0 };

    // 删除每个型号关联的价格和材质
    for (var i = 0; i < modelIds.length; i++) {
      var mid = modelIds[i];
      var { error: pErr } = await rdb.from('price_table').delete().eq('model_id', mid);
      if (!pErr) deletedCount.prices++;
      var { error: matErr } = await rdb.from('valve_model_materials').delete().eq('model_id', mid);
      if (!matErr) deletedCount.materials++;
    }

    // 删除所有型号
    if (modelIds.length > 0) {
      for (var j = 0; j < modelIds.length; j++) {
        await rdb.from('valve_models').delete().eq('id', modelIds[j]);
      }
      deletedCount.models = modelIds.length;
    }

    // 删除该系列的报价系数
    var seriesName = name;
    if (!seriesName) {
      var { data: sd } = await rdb.from('product_series').select('name').eq('id', seriesId);
      seriesName = sd && sd[0] ? sd[0].name : '';
    }
    if (seriesName) {
      await rdb.from('pricing_rules').delete().eq('series_name', seriesName);
      await rdb.from('material_price_diffs').delete().eq('series_name', seriesName);
    }

    // 最后删除系列本身
    var { error: sErr } = await rdb.from('product_series').delete().eq('id', seriesId);
    if (sErr) return { success: false, message: '删除系列失败: ' + sErr.message };

    return {
      success: true,
      message: '级联删除成功，共删除 ' + deletedCount.models + ' 个型号、' + deletedCount.prices + ' 条价格、' + deletedCount.materials + ' 条材质标配'
    };
  } catch (e) {
    console.error('[deleteSeriesCascade] 错误:', e);
    return { success: false, message: e.message };
  }
}

// ----- 阀门型号 -----
async function createModel(event) {
  const { data } = event;
  if (!data || !data.seriesName || !data.name) return { success: false, message: '系列名称和型号名称不能为空' };
  var { data: series } = await rdb.from('product_series').select('id').eq('name', data.seriesName);
  if (!series || series.length === 0) return { success: false, message: '系列不存在' };
  const { error } = await rdb.from('valve_models').insert({
    _openid: 'admin', series_id: series[0].id, name: data.name, type_code: data.typeCode || '',
    created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateModel(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.seriesName !== undefined) {
    var { data: series } = await rdb.from('product_series').select('id').eq('name', data.seriesName);
    if (!series || series.length === 0) return { success: false, message: '系列不存在' };
    updateData.series_id = series[0].id;
  }
  if (data.name !== undefined) updateData.name = data.name;
  if (data.typeCode !== undefined) updateData.type_code = data.typeCode;
  const { error } = await rdb.from('valve_models').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteModel(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var { data: prices } = await rdb.from('price_table').select('id').eq('model_id', id);
  if (prices && prices.length > 0) return { success: false, message: '该型号下存在价格数据，无法删除' };
  var { data: mats } = await rdb.from('valve_model_materials').select('id').eq('model_id', id);
  if (mats && mats.length > 0) return { success: false, message: '该型号下存在材质标配，无法删除' };
  const { error } = await rdb.from('valve_models').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ----- 价格数据 -----
async function createPrice(event) {
  const { data } = event;
  if (!data || !data.valveName || data.size === undefined) return { success: false, message: '型号名称和规格DN不能为空' };
  var { data: model } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
  if (!model || model.length === 0) return { success: false, message: '型号不存在' };
  const { error } = await rdb.from('price_table').insert({
    _openid: 'admin', model_id: model[0].id, size: data.size,
    price: data.price || 0,
    min_order_qty: data.minOrderQty || 50,
    branding_fee: data.brandingFee || 0,
    status: data.status || 'enabled', remark: data.remark || '',
    created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updatePrice(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.valveName !== undefined) {
    var { data: model } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
    if (!model || model.length === 0) return { success: false, message: '型号不存在' };
    updateData.model_id = model[0].id;
  }
  if (data.size !== undefined) updateData.size = data.size;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.minOrderQty !== undefined) updateData.min_order_qty = data.minOrderQty;
  if (data.brandingFee !== undefined) updateData.branding_fee = data.brandingFee;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.remark !== undefined) updateData.remark = data.remark;
  const { error } = await rdb.from('price_table').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deletePrice(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('price_table').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ----- 材质标配 -----
async function createMaterial(event) {
  const { data } = event;
  if (!data || !data.valveName) return { success: false, message: '型号名称不能为空' };
  var { data: model } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
  if (!model || model.length === 0) return { success: false, message: '型号不存在' };
  const { error } = await rdb.from('valve_model_materials').insert({
    _openid: 'admin', model_id: model[0].id,
    body_material: data.bodyMaterial || '', gate_plate_material: data.gatePlateMaterial || '',
    stem_material: data.stemMaterial || '', yoke_material: data.yokeMaterial || '',
    remark: data.remark || '', created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateMaterial(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.valveName !== undefined) {
    var { data: model } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
    if (!model || model.length === 0) return { success: false, message: '型号不存在' };
    updateData.model_id = model[0].id;
  }
  if (data.bodyMaterial !== undefined) updateData.body_material = data.bodyMaterial;
  if (data.gatePlateMaterial !== undefined) updateData.gate_plate_material = data.gatePlateMaterial;
  if (data.stemMaterial !== undefined) updateData.stem_material = data.stemMaterial;
  if (data.yokeMaterial !== undefined) updateData.yoke_material = data.yokeMaterial;
  if (data.remark !== undefined) updateData.remark = data.remark;
  const { error } = await rdb.from('valve_model_materials').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteMaterial(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('valve_model_materials').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ----- 规格参数 -----
async function createModelSpec(event) {
  const { data } = event;
  if (!data || !data.valveName) return { success: false, message: '型号名称不能为空' };
  var { data: model } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
  if (!model || model.length === 0) return { success: false, message: '型号不存在' };
  const { error } = await rdb.from('model_specs').insert({
    _openid: 'admin', model_id: model[0].id, size: data.size || 0,
    max_pressure: data.maxPressure || 0,
    unit_weight: data.unitWeight || 0,
    laps: data.laps || 0,
    torque: data.torque || 0,
    created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function batchCreateModelSpec(event) {
  const { data } = event;
  if (!data || !Array.isArray(data) || data.length === 0) return { success: false, message: '数据不能为空' };
  
  const seriesName = data[0].seriesName;
  const valveName = data[0].valveName;
  
  if (!valveName) return { success: false, message: '型号名称不能为空' };
  
  var { data: model } = await rdb.from('valve_models').select('id').eq('name', valveName);
  if (!model || model.length === 0) return { success: false, message: '型号不存在' };
  
  const modelId = model[0].id;
  let successCount = 0;
  let failCount = 0;
  
  const batchSize = 20;
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const records = batch.map(item => ({
      _openid: 'admin',
      model_id: modelId,
      size: item.size || 0,
      max_pressure: item.maxPressure || 0,
      unit_weight: item.unitWeight || 0,
      laps: item.laps || 0,
      torque: item.torque || 0,
      created_at: now(),
      updated_at: now()
    }));
    
    const { error } = await rdb.from('model_specs').insert(records);
    if (error) {
      failCount += batch.length;
    } else {
      successCount += batch.length;
    }
  }
  
  return { 
    success: successCount > 0, 
    message: `批量导入完成：成功 ${successCount} 条，失败 ${failCount} 条`,
    data: { successCount, failCount }
  };
}

async function updateModelSpec(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.valveName !== undefined) {
    var { data: model } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
    if (!model || model.length === 0) return { success: false, message: '型号不存在' };
    updateData.model_id = model[0].id;
  }
  if (data.size !== undefined) updateData.size = data.size;
  if (data.maxPressure !== undefined) updateData.max_pressure = data.maxPressure;
  if (data.unitWeight !== undefined) updateData.unit_weight = data.unitWeight;
  if (data.laps !== undefined) updateData.laps = data.laps;
  if (data.torque !== undefined) updateData.torque = data.torque;
  const { error } = await rdb.from('model_specs').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteModelSpec(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('model_specs').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

async function getModelSpecs(event) {
  var { seriesName, valveName } = event;
  
  var modelIds = [];
  if (valveName) {
    var { data: model } = await rdb.from('valve_models').select('id').eq('name', valveName);
    if (model && model.length > 0) modelIds = [model[0].id];
  } else if (seriesName) {
    var { data: series } = await rdb.from('product_series').select('id').eq('name', seriesName);
    if (series && series.length > 0) {
      var { data: models } = await rdb.from('valve_models').select('id').eq('series_id', series[0].id);
      if (models && models.length > 0) modelIds = models.map(m => m.id);
    }
  }
  
  if (modelIds.length === 0) {
    var { data: allModels } = await rdb.from('valve_models').select('id');
    modelIds = (allModels || []).map(m => m.id);
  }
  
  var specs = [];
  for (var i = 0; i < modelIds.length; i += 100) {
    var batch = modelIds.slice(i, i + 100);
    var { data: batchSpecs } = await rdb.from('model_specs').select('*').in('model_id', batch);
    if (batchSpecs) specs = specs.concat(batchSpecs);
  }
  
  var modelMap = {};
  var { data: models } = await rdb.from('valve_models').select('id, name, series_id');
  for (const m of (models || [])) modelMap[m.id] = m;
  
  var seriesMap = {};
  var { data: series } = await rdb.from('product_series').select('id, name');
  for (const s of (series || [])) seriesMap[s.id] = s.name;
  
  var result = [];
  for (const s of specs) {
    var model = modelMap[s.model_id];
    if (model) {
      result.push({
        id: s.id,
        seriesName: seriesMap[model.series_id] || '',
        valveName: model.name,
        size: s.size,
        maxPressure: s.max_pressure,
        unitWeight: s.unit_weight,
        laps: s.laps,
        torque: s.torque
      });
    }
  }
  
  return { success: true, data: result };
}

async function getModelSpec(event) {
  const { valveName, size } = event;
  if (!valveName) return { success: false, message: '型号名称不能为空' };
  var { data: model } = await rdb.from('valve_models').select('id').eq('name', valveName);
  if (!model || model.length === 0) return { success: false, message: '型号不存在' };
  var { data: specs } = await rdb.from('model_specs').select('*').eq('model_id', model[0].id);
  if (!specs || specs.length === 0) return { success: true, data: null };
  
  if (size !== undefined) {
    var spec = specs.find(s => s.size === size);
    return { success: true, data: spec ? {
      id: spec.id,
      maxPressure: spec.max_pressure,
      unitWeight: spec.unit_weight,
      laps: spec.laps,
      torque: spec.torque
    } : null };
  }
  
  return { success: true, data: specs.map(s => ({
    id: s.id,
    size: s.size,
    maxPressure: s.max_pressure,
    unitWeight: s.unit_weight,
    laps: s.laps,
    torque: s.torque
  })) };
}

// ----- 报价系数 -----
async function createCoefficient(event) {
  const { data } = event;
  if (!data || !data.seriesName) return { success: false, message: '产品系列不能为空' };
  const { error } = await rdb.from('pricing_rules').insert({
    _openid: 'admin', series_name: data.seriesName, product_name: data.productName || '',
    dn_min: data.dnMin || 50, dn_max: data.dnMax || 150,
    moq_met_oem_coeff: data.moqMetOemCoeff || 1.5, moq_met_original_coeff: data.moqMetOriginalCoeff || 1.2,
    moq_unmet_oem_coeff: data.moqUnmetOemCoeff || 2.0, moq_unmet_original_coeff: data.moqUnmetOriginalCoeff || 1.5,
    created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateCoefficient(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.seriesName !== undefined) updateData.series_name = data.seriesName;
  if (data.productName !== undefined) updateData.product_name = data.productName;
  if (data.dnMin !== undefined) updateData.dn_min = data.dnMin;
  if (data.dnMax !== undefined) updateData.dn_max = data.dnMax;
  if (data.moqMetOemCoeff !== undefined) updateData.moq_met_oem_coeff = data.moqMetOemCoeff;
  if (data.moqMetOriginalCoeff !== undefined) updateData.moq_met_original_coeff = data.moqMetOriginalCoeff;
  if (data.moqUnmetOemCoeff !== undefined) updateData.moq_unmet_oem_coeff = data.moqUnmetOemCoeff;
  if (data.moqUnmetOriginalCoeff !== undefined) updateData.moq_unmet_original_coeff = data.moqUnmetOriginalCoeff;
  const { error } = await rdb.from('pricing_rules').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteCoefficient(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('pricing_rules').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

async function applyCoefficientToAllSeries(event) {
  const { data } = event;
  if (!data) return { success: false, message: '数据不能为空' };
  try {
    const seriesList = await selectAll('product_series', 'id,name');
    const { dnMin, dnMax, moqMetOemCoeff, moqMetOriginalCoeff, moqUnmetOemCoeff, moqUnmetOriginalCoeff } = data;
    let created = 0;
    let updated = 0;
    for (const series of seriesList) {
      const { data: existRows } = await rdb.from('pricing_rules')
        .select('id')
        .eq('series_name', series.name)
        .eq('dn_min', dnMin)
        .eq('dn_max', dnMax);
      if (existRows && existRows.length > 0) {
        await rdb.from('pricing_rules').update({
          moq_met_oem_coeff: moqMetOemCoeff,
          moq_met_original_coeff: moqMetOriginalCoeff,
          moq_unmet_oem_coeff: moqUnmetOemCoeff,
          moq_unmet_original_coeff: moqUnmetOriginalCoeff,
          updated_at: now()
        }).eq('id', existRows[0].id);
        updated++;
      } else {
        await rdb.from('pricing_rules').insert({
          _openid: 'admin',
          series_name: series.name,
          product_name: '',
          dn_min: dnMin,
          dn_max: dnMax,
          moq_met_oem_coeff: moqMetOemCoeff,
          moq_met_original_coeff: moqMetOriginalCoeff,
          moq_unmet_oem_coeff: moqUnmetOemCoeff,
          moq_unmet_original_coeff: moqUnmetOriginalCoeff,
          created_at: now(),
          updated_at: now()
        });
        created++;
      }
    }
    return { success: true, data: { created, updated, message: `已应用到所有系列，新增${created}条，更新${updated}条` }, message: `已应用到所有系列，新增${created}条，更新${updated}条` };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function batchSetBrandingFee(event) {
  const { data } = event;
  if (!data || data.brandingFee === undefined) return { success: false, message: '磨标费不能为空' };
  try {
    const { seriesName, brandingFee, dnMin, dnMax } = data;
    
    let modelIds = [];
    if (seriesName) {
      const { data: series, error: sErr } = await rdb.from('product_series').select('id').eq('name', seriesName);
      if (sErr || !series || series.length === 0) return { success: false, message: '系列不存在' };
      
      const { data: models, error: mErr } = await rdb.from('valve_models').select('id').eq('series_id', series[0].id);
      if (mErr) return { success: false, message: '查询型号失败' };
      
      modelIds = (models || []).map(m => m.id);
      if (modelIds.length === 0) {
        return { success: true, data: { updatedCount: 0 }, message: '该系列下没有型号，未更新任何记录' };
      }
    }
    
    const allPrices = await selectAll('price_table', 'id,model_id,size');
    
    const matchedIds = allPrices.filter(p => {
      const size = Number(p.size) || 0;
      const inDnRange = (dnMin === undefined || dnMin === null || size >= dnMin) &&
                        (dnMax === undefined || dnMax === null || size <= dnMax);
      const inModelIds = modelIds.length === 0 || modelIds.includes(p.model_id);
      return inDnRange && inModelIds;
    }).map(p => p.id);
    
    if (matchedIds.length === 0) {
      return { success: true, data: { updatedCount: 0 }, message: '没有匹配的价格记录，未更新任何记录' };
    }
    
    const batchSize = 20;
    let updatedCount = 0;
    
    for (let i = 0; i < matchedIds.length; i += batchSize) {
      const batch = matchedIds.slice(i, i + batchSize);
      const promises = batch.map(pid => {
        return rdb.from('price_table').update({
          branding_fee: brandingFee,
          updated_at: now()
        }).eq('id', pid);
      });
      
      const results = await Promise.all(promises);
      results.forEach(res => {
        if (!res.error) updatedCount++;
      });
    }
    
    return { success: true, data: { updatedCount }, message: `成功更新${updatedCount}条价格记录的磨标费` };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function batchSetMinOrderQty(event) {
  const { data } = event;
  if (!data || data.minOrderQty === undefined) return { success: false, message: '起订量不能为空' };
  try {
    const { seriesName, minOrderQty, dnMin, dnMax } = data;
    
    let modelIds = [];
    if (seriesName) {
      const { data: series, error: sErr } = await rdb.from('product_series').select('id').eq('name', seriesName);
      if (sErr || !series || series.length === 0) return { success: false, message: '系列不存在' };
      
      const { data: models, error: mErr } = await rdb.from('valve_models').select('id').eq('series_id', series[0].id);
      if (mErr) return { success: false, message: '查询型号失败' };
      
      modelIds = (models || []).map(m => m.id);
      if (modelIds.length === 0) {
        return { success: true, data: { updatedCount: 0 }, message: '该系列下没有型号，未更新任何记录' };
      }
    }
    
    const allPrices = await selectAll('price_table', 'id,model_id,size');
    
    const matchedIds = allPrices.filter(p => {
      const size = Number(p.size) || 0;
      const inDnRange = (dnMin === undefined || dnMin === null || size >= dnMin) &&
                        (dnMax === undefined || dnMax === null || size <= dnMax);
      const inModelIds = modelIds.length === 0 || modelIds.includes(p.model_id);
      return inDnRange && inModelIds;
    }).map(p => p.id);
    
    if (matchedIds.length === 0) {
      return { success: true, data: { updatedCount: 0 }, message: '没有匹配的价格记录，未更新任何记录' };
    }
    
    const batchSize = 20;
    let updatedCount = 0;
    
    for (let i = 0; i < matchedIds.length; i += batchSize) {
      const batch = matchedIds.slice(i, i + batchSize);
      const promises = batch.map(pid => {
        return rdb.from('price_table').update({
          min_order_qty: minOrderQty,
          updated_at: now()
        }).eq('id', pid);
      });
      
      const results = await Promise.all(promises);
      results.forEach(res => {
        if (!res.error) updatedCount++;
      });
    }
    
    return { success: true, data: { updatedCount }, message: `成功更新${updatedCount}条价格记录的起订量` };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

// ----- 材质价差 -----
async function createMaterialDiff(event) {
  const { data } = event;
  if (!data || !data.seriesName || !data.partName || !data.baseMaterial || !data.targetMaterial) {
    return { success: false, message: '产品系列、部位名称、基础材质和目标材质不能为空' };
  }
  const { error } = await rdb.from('material_price_diffs').insert({
    _openid: 'admin', series_name: data.seriesName,
    model_name: data.modelName || '',
    size: data.size || null,
    part_name: data.partName,
    base_material: data.baseMaterial, target_material: data.targetMaterial,
    price_diff: data.priceDiff || 0,
    remark: data.remark || '', created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateMaterialDiff(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.seriesName !== undefined) updateData.series_name = data.seriesName;
  if (data.modelName !== undefined) updateData.model_name = data.modelName || '';
  if (data.size !== undefined) updateData.size = data.size || null;
  if (data.partName !== undefined) updateData.part_name = data.partName;
  if (data.baseMaterial !== undefined) updateData.base_material = data.baseMaterial;
  if (data.targetMaterial !== undefined) updateData.target_material = data.targetMaterial;
  if (data.priceDiff !== undefined) updateData.price_diff = data.priceDiff;
  if (data.remark !== undefined) updateData.remark = data.remark;
  const { error } = await rdb.from('material_price_diffs').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteMaterialDiff(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('material_price_diffs').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ----- 材质库 -----
async function getMaterialLib() {
  try {
    var { data, error } = await rdb.from('materials').select('*');
    if (error) return { success: false, message: error.message };
    return {
      success: true,
      data: (data || []).map(function(m) {
        return {
          id: m.id, materialCode: m.material_code, materialName: m.material_name,
          category: m.category, applicableParts: m.applicable_parts, remark: m.remark || ''
        };
      })
    };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function createMaterialLib(event) {
  const { data } = event;
  if (!data || !data.materialCode || !data.materialName) return { success: false, message: '材质代码和名称不能为空' };
  const { error } = await rdb.from('materials').insert({
    _openid: 'admin', material_code: data.materialCode, material_name: data.materialName,
    category: data.category || '', applicable_parts: data.applicableParts || '',
    remark: data.remark || '', created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateMaterialLib(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.materialCode !== undefined) updateData.material_code = data.materialCode;
  if (data.materialName !== undefined) updateData.material_name = data.materialName;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.applicableParts !== undefined) updateData.applicable_parts = data.applicableParts;
  if (data.remark !== undefined) updateData.remark = data.remark;
  const { error } = await rdb.from('materials').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteMaterialLib(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('materials').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ===== 材质组合 =====

async function getMaterialCombos() {
  try {
    var { data } = await rdb.from('material_combos').select('id, combo_name, body_material, gate_plate_material, stem_material, yoke_material, remark').order('id');
    return {
      success: true,
      data: (data || []).map(function(c) {
        return {
          id: c.id,
          comboName: c.combo_name || '',
          bodyMaterial: c.body_material || '',
          gatePlateMaterial: c.gate_plate_material || '',
          stemMaterial: c.stem_material || '',
          yokeMaterial: c.yoke_material || '',
          remark: c.remark || ''
        };
      })
    };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function createMaterialCombo(event) {
  const { data } = event;
  if (!data || !data.comboName) return { success: false, message: '组合名称不能为空' };
  const { error } = await rdb.from('material_combos').insert({
    _openid: 'admin', combo_name: data.comboName,
    body_material: data.bodyMaterial || '', gate_plate_material: data.gatePlateMaterial || '',
    stem_material: data.stemMaterial || '', yoke_material: data.yokeMaterial || '',
    remark: data.remark || '', created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateMaterialCombo(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.comboName !== undefined) updateData.combo_name = data.comboName;
  if (data.bodyMaterial !== undefined) updateData.body_material = data.bodyMaterial;
  if (data.gatePlateMaterial !== undefined) updateData.gate_plate_material = data.gatePlateMaterial;
  if (data.stemMaterial !== undefined) updateData.stem_material = data.stemMaterial;
  if (data.yokeMaterial !== undefined) updateData.yoke_material = data.yokeMaterial;
  if (data.remark !== undefined) updateData.remark = data.remark;
  const { error } = await rdb.from('material_combos').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteMaterialCombo(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('material_combos').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ===== 营销员 =====

async function getSalespersons() {
  try {
    var { data } = await rdb.from('salespersons').select('id, name, phone, email, department, status, remark').order('id');
    return {
      success: true,
      data: (data || []).map(function(s) {
        return {
          id: s.id, name: s.name, phone: s.phone || '', email: s.email || '',
          department: s.department || '', status: s.status || 1, remark: s.remark || ''
        };
      })
    };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function createSalesperson(event) {
  const { data } = event;
  if (!data || !data.name) return { success: false, message: '营销员姓名不能为空' };
  const { error } = await rdb.from('salespersons').insert({
    _openid: 'admin', name: data.name, phone: data.phone || '', email: data.email || '',
    department: data.department || '', status: data.status !== undefined ? data.status : 1,
    remark: data.remark || '', created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateSalesperson(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.department !== undefined) updateData.department = data.department;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.remark !== undefined) updateData.remark = data.remark;
  const { error } = await rdb.from('salespersons').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteSalesperson(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('salespersons').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ===== 客户 =====

async function getCustomers(event) {
  try {
    const { salespersonId } = event;
    var query = rdb.from('customers').select('id, name, salesperson_id, salesperson_name, phone, email, company, address, status, remark').order('id');
    if (salespersonId) {
      query = query.eq('salesperson_id', salespersonId);
    }
    var { data } = await query;
    return {
      success: true,
      data: (data || []).map(function(c) {
        return {
          id: c.id, name: c.name, salespersonId: c.salesperson_id || null,
          salespersonName: c.salesperson_name || '', phone: c.phone || '',
          email: c.email || '', company: c.company || '', address: c.address || '',
          status: c.status || 1, remark: c.remark || ''
        };
      })
    };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function createCustomer(event) {
  const { data } = event;
  if (!data || !data.name) return { success: false, message: '客户姓名不能为空' };
  const { error } = await rdb.from('customers').insert({
    _openid: 'admin', name: data.name, salesperson_id: data.salespersonId || null,
    salesperson_name: data.salespersonName || '', phone: data.phone || '',
    email: data.email || '', company: data.company || '', address: data.address || '',
    status: data.status !== undefined ? data.status : 1, remark: data.remark || '',
    created_at: now(), updated_at: now()
  });
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateCustomer(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  var updateData = { updated_at: now() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.salespersonId !== undefined) updateData.salesperson_id = data.salespersonId;
  if (data.salespersonName !== undefined) updateData.salesperson_name = data.salespersonName;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.company !== undefined) updateData.company = data.company;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.remark !== undefined) updateData.remark = data.remark;
  const { error } = await rdb.from('customers').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteCustomer(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  const { error } = await rdb.from('customers').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

async function uploadImage(event) {
  const { base64Data, fileName } = event;
  if (!base64Data || !fileName) return { success: false, message: '图片数据和文件名不能为空' };
  
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const cloudPath = `series_images/${Date.now()}_${fileName}`;
    
    const result = await app.uploadFile({
      cloudPath: cloudPath,
      fileContent: buffer
    });
    
    const tempRes = await app.getTempFileURL({
      fileList: [result.fileID]
    });
    
    const tempURL = tempRes.fileList?.[0]?.tempFileURL || '';
    
    return { success: true, data: { fileID: result.fileID, tempURL: tempURL } };
  } catch (error) {
    console.error('[uploadImage] 错误:', error);
    return { success: false, message: '图片上传失败: ' + error.message };
  }
}

async function getDashboardStats() {
  try {
    const [seriesList, modelList, priceList, materialList, materialDiffList, coefficientList, salespersonList, customerList] = await Promise.all([
      selectAll('product_series', 'id,name'),
      selectAll('valve_models', 'id,series_id,name'),
      selectAll('price_table', 'id,model_id,valve_name,size,price,status,created_at'),
      selectAll('valve_model_materials', 'id,model_id,body_material'),
      selectAll('material_price_diffs', 'id,series_name,part_name'),
      selectAll('pricing_rules', 'id,series_name'),
      selectAll('salespersons', 'id'),
      selectAll('customers', 'id')
    ]);

    const seriesCount = seriesList.length;
    const modelCount = modelList.length;
    const priceCount = priceList.filter(p => p.status === 'enabled').length;
    const materialCount = materialList.length;
    const salespersonCount = salespersonList.length;
    const customerCount = customerList.length;
    const materialDiffCount = materialDiffList.length;
    const coefficientCount = coefficientList.length;

    const seriesIdMap = {};
    seriesList.forEach(s => { seriesIdMap[s.id] = s.name; });

    const modelsBySeries = {};
    modelList.forEach(m => {
      const sName = seriesIdMap[m.series_id] || '未知';
      if (!modelsBySeries[sName]) modelsBySeries[sName] = 0;
      modelsBySeries[sName]++;
    });
    const seriesModelStats = Object.keys(modelsBySeries).map(name => ({
      seriesName: name,
      modelCount: modelsBySeries[name]
    })).sort((a, b) => b.modelCount - a.modelCount);

    const bodyMaterialStats = {};
    materialList.forEach(m => {
      const mat = m.body_material || '未配置';
      if (!bodyMaterialStats[mat]) bodyMaterialStats[mat] = 0;
      bodyMaterialStats[mat]++;
    });
    const materialDistribution = Object.keys(bodyMaterialStats).map(name => ({
      material: name,
      count: bodyMaterialStats[name]
    })).sort((a, b) => b.count - a.count);

    const recentPrices = priceList
      .sort((a, b) => {
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
        return tb - ta;
      })
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        valveName: p.valve_name,
        size: p.size,
        price: p.price,
        status: p.status
      }));

    return {
      success: true,
      data: {
        summary: {
          seriesCount,
          modelCount,
          priceCount,
          materialCount,
          materialDiffCount,
          coefficientCount,
          salespersonCount,
          customerCount
        },
        seriesModelStats,
        materialDistribution,
        recentPrices
      }
    };
  } catch (error) {
    console.error('[getDashboardStats] 错误:', error);
    return { success: false, message: '获取统计数据失败: ' + error.message };
  }
}

// ===== 系统设置 =====

async function getSystemConfig(event) {
  const { keys } = event;
  try {
    const allSettings = await selectAll('system_settings', '*');
    const config = {};
    for (const s of allSettings) {
      config[s.setting_key] = s.setting_value;
    }

    // 默认值
    const defaults = {
      allow_price_modification: 'true'
    };
    for (const k in defaults) {
      if (config[k] === undefined) config[k] = defaults[k];
    }

    // 如果只请求特定 key
    if (keys && Array.isArray(keys)) {
      const filtered = {};
      for (const k of keys) {
        filtered[k] = config[k] !== undefined ? config[k] : (defaults[k] || null);
      }
      return { success: true, data: filtered };
    }

    return { success: true, data: config };
  } catch (e) {
    // 表可能不存在，返回默认值
    console.warn('[getSystemConfig] 查询失败，返回默认值:', e.message);
    const defaults = {
      allow_price_modification: 'true'
    };
    if (keys && Array.isArray(keys)) {
      const filtered = {};
      for (const k of keys) {
        filtered[k] = defaults[k] !== undefined ? defaults[k] : null;
      }
      return { success: true, data: filtered };
    }
    return { success: true, data: defaults };
  }
}

async function setSystemConfig(event) {
  const { key, value } = event;
  if (!key) return { success: false, message: '设置键不能为空' };

  try {
    // 先查是否存在
    const { data: existing } = await rdb.from('system_settings')
      .select('id')
      .eq('setting_key', key);

    if (existing && existing.length > 0) {
      // 更新
      const { error } = await rdb.from('system_settings')
        .update({ setting_value: String(value) })
        .eq('setting_key', key);
      if (error) return { success: false, message: '更新设置失败: ' + error.message };
    } else {
      // 插入
      const { error } = await rdb.from('system_settings').insert({
        setting_key: key,
        setting_value: String(value)
      });
      if (error) return { success: false, message: '保存设置失败: ' + error.message };
    }

    return { success: true, data: { key, value: String(value) } };
  } catch (e) {
    console.error('[setSystemConfig] 错误:', e);
    return { success: false, message: '保存设置失败: ' + e.message };
  }
}
