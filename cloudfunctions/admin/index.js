const cloudbase = require('@cloudbase/node-sdk');

const ENV_ID = 'cloud1-d2g6k45v21dd52696';
const app = cloudbase.init({ env: ENV_ID });
const rdb = app.rdb();

exports.main = async (event, context) => {
  const { action } = event;
  try {
    switch (action) {
      case 'createSeries': return await createSeries(event);
      case 'updateSeries': return await updateSeries(event);
      case 'deleteSeries': return await deleteSeries(event);
      
      case 'createModel': return await createModel(event);
      case 'updateModel': return await updateModel(event);
      case 'deleteModel': return await deleteModel(event);
      
      case 'createPrice': return await createPrice(event);
      case 'updatePrice': return await updatePrice(event);
      case 'deletePrice': return await deletePrice(event);
      
      case 'createMaterial': return await createMaterial(event);
      case 'updateMaterial': return await updateMaterial(event);
      case 'deleteMaterial': return await deleteMaterial(event);
      
      case 'createCoefficient': return await createCoefficient(event);
      case 'updateCoefficient': return await updateCoefficient(event);
      case 'deleteCoefficient': return await deleteCoefficient(event);
      
      case 'createMaterialDiff': return await createMaterialDiff(event);
      case 'updateMaterialDiff': return await updateMaterialDiff(event);
      case 'deleteMaterialDiff': return await deleteMaterialDiff(event);
      
      case 'getMaterials': return await getMaterials();
      case 'createMaterialLib': return await createMaterialLib(event);
      case 'updateMaterialLib': return await updateMaterialLib(event);
      case 'deleteMaterialLib': return await deleteMaterialLib(event);
      
      default: return { success: false, message: '未知操作: ' + action };
    }
  } catch (error) {
    console.error('Admin函数错误:', error);
    return { success: false, message: error.message || '服务器错误' };
  }
};

// ============================================
// 产品系列 CRUD
// ============================================

async function createSeries(event) {
  const { data } = event;
  if (!data || !data.name) return { success: false, message: '系列名称不能为空' };
  
  const { error } = await rdb.from('product_series').insert({
    _openid: 'admin',
    name: data.name,
    image: data.image || '',
    created_at: new Date(),
    updated_at: new Date()
  });
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateSeries(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var updateData = { updated_at: new Date() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.image !== undefined) updateData.image = data.image;
  
  const { error } = await rdb.from('product_series').update(updateData).eq('id', id);
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteSeries(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var { data: models, error: mErr } = await rdb.from('valve_models').select('id').eq('series_id', id);
  if (models && models.length > 0) {
    return { success: false, message: '该系列下存在型号，无法删除' };
  }
  
  const { error } = await rdb.from('product_series').delete().eq('id', id);
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ============================================
// 阀门型号 CRUD
// ============================================

async function createModel(event) {
  const { data } = event;
  if (!data || !data.seriesName || !data.name) {
    return { success: false, message: '系列名称和型号名称不能为空' };
  }
  
  var { data: series, error: sErr } = await rdb.from('product_series').select('id').eq('name', data.seriesName);
  if (sErr) return { success: false, message: '查询系列失败: ' + sErr.message };
  if (!series || series.length === 0) return { success: false, message: '系列不存在' };
  
  const { error } = await rdb.from('valve_models').insert({
    _openid: 'admin',
    series_id: series[0].id,
    name: data.name,
    type_code: data.typeCode || '',
    created_at: new Date(),
    updated_at: new Date()
  });
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateModel(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var updateData = { updated_at: new Date() };
  
  if (data.seriesName !== undefined) {
    var { data: series, error: sErr } = await rdb.from('product_series').select('id').eq('name', data.seriesName);
    if (sErr) return { success: false, message: '查询系列失败: ' + sErr.message };
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
  
  var { data: prices, error: pErr } = await rdb.from('price_table').select('id').eq('model_id', id);
  if (prices && prices.length > 0) {
    return { success: false, message: '该型号下存在价格数据，无法删除' };
  }
  
  var { data: mats, error: matErr } = await rdb.from('valve_model_materials').select('id').eq('model_id', id);
  if (mats && mats.length > 0) {
    return { success: false, message: '该型号下存在材质配置，无法删除' };
  }
  
  const { error } = await rdb.from('valve_models').delete().eq('id', id);
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

// ============================================
// 价格数据 CRUD
// ============================================

async function createPrice(event) {
  const { data } = event;
  if (!data || !data.seriesName || !data.valveName || data.size === undefined) {
    return { success: false, message: '系列名称、型号名称和规格DN不能为空' };
  }
  
  var { data: model, error: mErr } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
  if (mErr) return { success: false, message: '查询型号失败: ' + mErr.message };
  if (!model || model.length === 0) return { success: false, message: '型号不存在' };
  
  const { error } = await rdb.from('price_table').insert({
    _openid: 'admin',
    model_id: model[0].id,
    size: data.size,
    manual_price: data.manualPrice || 0,
    pneumatic_price: data.pneumaticPrice || 0,
    electric_price: data.electricPrice || 0,
    gear_price: data.gearPrice || 0,
    branding_fee: data.brandingFee || 0,
    min_order_qty: data.minOrderQty || 50,
    status: data.status || 'enabled',
    remark: data.remark || '',
    created_at: new Date(),
    updated_at: new Date()
  });
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updatePrice(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var updateData = { updated_at: new Date() };
  
  if (data.valveName !== undefined) {
    var { data: model, error: mErr } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
    if (mErr) return { success: false, message: '查询型号失败: ' + mErr.message };
    if (!model || model.length === 0) return { success: false, message: '型号不存在' };
    updateData.model_id = model[0].id;
  }
  
  if (data.size !== undefined) updateData.size = data.size;
  if (data.manualPrice !== undefined) updateData.manual_price = data.manualPrice;
  if (data.pneumaticPrice !== undefined) updateData.pneumatic_price = data.pneumaticPrice;
  if (data.electricPrice !== undefined) updateData.electric_price = data.electricPrice;
  if (data.gearPrice !== undefined) updateData.gear_price = data.gearPrice;
  if (data.brandingFee !== undefined) updateData.branding_fee = data.brandingFee;
  if (data.minOrderQty !== undefined) updateData.min_order_qty = data.minOrderQty;
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

// ============================================
// 材质配置 CRUD
// ============================================

async function createMaterial(event) {
  const { data } = event;
  if (!data || !data.seriesName || !data.valveName) {
    return { success: false, message: '系列名称和型号名称不能为空' };
  }
  
  var { data: model, error: mErr } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
  if (mErr) return { success: false, message: '查询型号失败: ' + mErr.message };
  if (!model || model.length === 0) return { success: false, message: '型号不存在' };
  
  const { error } = await rdb.from('valve_model_materials').insert({
    _openid: 'admin',
    model_id: model[0].id,
    body_material: data.bodyMaterial || '',
    gate_plate_material: data.gatePlateMaterial || '',
    stem_material: data.stemMaterial || '',
    yoke_material: data.yokeMaterial || '',
    remark: data.remark || '',
    created_at: new Date(),
    updated_at: new Date()
  });
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateMaterial(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var updateData = { updated_at: new Date() };
  
  if (data.valveName !== undefined) {
    var { data: model, error: mErr } = await rdb.from('valve_models').select('id').eq('name', data.valveName);
    if (mErr) return { success: false, message: '查询型号失败: ' + mErr.message };
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

// ============================================
// 报价系数 CRUD
// ============================================

async function createCoefficient(event) {
  const { data } = event;
  if (!data || !data.seriesName) {
    return { success: false, message: '产品系列不能为空' };
  }
  
  const { error } = await rdb.from('pricing_rules').insert({
    _openid: 'admin',
    series_name: data.seriesName,
    product_name: data.productName || '',
    dn_min: data.dnMin || 50,
    dn_max: data.dnMax || 150,
    min_order_qty: data.minOrderQty || 50,
    moq_met_oem_coeff: data.moqMetOemCoeff || 1.5,
    moq_met_original_coeff: data.moqMetOriginalCoeff || 1.2,
    moq_unmet_oem_coeff: data.moqUnmetOemCoeff || 2.0,
    moq_unmet_original_coeff: data.moqUnmetOriginalCoeff || 1.5,
    created_at: new Date(),
    updated_at: new Date()
  });
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateCoefficient(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var updateData = { updated_at: new Date() };
  
  if (data.seriesName !== undefined) updateData.series_name = data.seriesName;
  if (data.productName !== undefined) updateData.product_name = data.productName;
  if (data.dnMin !== undefined) updateData.dn_min = data.dnMin;
  if (data.dnMax !== undefined) updateData.dn_max = data.dnMax;
  if (data.minOrderQty !== undefined) updateData.min_order_qty = data.minOrderQty;
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

// ============================================
// 材质价差 CRUD
// ============================================

async function createMaterialDiff(event) {
  const { data } = event;
  if (!data || !data.seriesName || !data.partName || !data.baseMaterial || !data.targetMaterial) {
    return { success: false, message: '产品系列、部位名称、基础材质和目标材质不能为空' };
  }
  
  const { error } = await rdb.from('material_price_diffs').insert({
    _openid: 'admin',
    series_name: data.seriesName,
    part_name: data.partName,
    base_material: data.baseMaterial,
    target_material: data.targetMaterial,
    dn_min: data.dnMin || 50,
    dn_max: data.dnMax || 2000,
    price_diff: data.priceDiff || 0,
    remark: data.remark || '',
    created_at: new Date(),
    updated_at: new Date()
  });
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateMaterialDiff(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var updateData = { updated_at: new Date() };
  
  if (data.seriesName !== undefined) updateData.series_name = data.seriesName;
  if (data.partName !== undefined) updateData.part_name = data.partName;
  if (data.baseMaterial !== undefined) updateData.base_material = data.baseMaterial;
  if (data.targetMaterial !== undefined) updateData.target_material = data.targetMaterial;
  if (data.dnMin !== undefined) updateData.dn_min = data.dnMin;
  if (data.dnMax !== undefined) updateData.dn_max = data.dnMax;
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

// ============================================
// 材质库 CRUD
// ============================================

async function getMaterials() {
  try {
    var { data, error } = await rdb.from('materials').select('*');
    if (error) return { success: false, message: error.message };
    
    return {
      success: true,
      data: (data || []).map(function(m) {
        return {
          id: m.id,
          materialCode: m.material_code,
          materialName: m.material_name,
          category: m.category,
          applicableParts: m.applicable_parts,
          remark: m.remark || ''
        };
      })
    };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function createMaterialLib(event) {
  const { data } = event;
  if (!data || !data.materialCode || !data.materialName || !data.category || !data.applicableParts) {
    return { success: false, message: '材质代码、材质名称、材质分类和适用部位不能为空' };
  }
  
  const { error } = await rdb.from('materials').insert({
    _openid: 'admin',
    material_code: data.materialCode,
    material_name: data.materialName,
    category: data.category,
    applicable_parts: data.applicableParts,
    remark: data.remark || '',
    created_at: new Date(),
    updated_at: new Date()
  });
  
  if (error) return { success: false, message: error.message };
  return { success: true, message: '创建成功' };
}

async function updateMaterialLib(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };
  
  var updateData = { updated_at: new Date() };
  
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
