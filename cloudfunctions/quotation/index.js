// 报价单CRUD + 价格计算云函数
const cloudbase = require('@cloudbase/node-sdk');

const ENV_ID = 'cloud1-d2g6k45v21dd52696';
const app = cloudbase.init({ env: ENV_ID });
const rdb = app.rdb();

exports.main = async (event, context) => {
  const { action } = event;
  try {
    switch (action) {
      case 'createQuotation':   return await createQuotation(event);
      case 'getQuotationList':  return await getQuotationList(event);
      case 'getQuotationDetail': return await getQuotationDetail(event);
      case 'updateQuotation':   return await updateQuotation(event);
      case 'deleteQuotation':   return await deleteQuotation(event);
      case 'getOrderStats':     return await getOrderStats(event);
      default: return { success: false, message: '未知操作: ' + action };
    }
  } catch (error) {
    console.error('Quotation函数错误:', error);
    return { success: false, message: error.message || '服务器错误' };
  }
};

// ========== 价格计算 ==========

async function calcItemPrice(item) {
  const { data: models, error: mErr } = await rdb.from('valve_models').select('id,series_id').eq('name', item.valveName);
  if (mErr) throw new Error('DB错误');
  if (!models || models.length === 0) throw new Error('阀门型号不存在: ' + item.valveName);

  const { data: prices, error: pErr } = await rdb.from('price_table').select('*').eq('model_id', models[0].id).eq('size', item.spec);
  if (pErr) throw new Error('DB错误');
  if (!prices || prices.length === 0) throw new Error('价格数据不存在: ' + item.valveName + ' DN' + item.spec);

  const p = prices[0];
  if (p.status !== 'enabled') throw new Error('该产品已禁用');

  // 获取系列名称
  let seriesName = '';
  if (models[0].series_id) {
    const { data: series } = await rdb.from('product_series').select('name').eq('id', models[0].series_id);
    if (series && series.length > 0) seriesName = series[0].name;
  }

  // 查询系数规则
  const coeff = await getPricingCoefficient(seriesName, item.valveName, item.spec, item.quantity, item.branding);

  // 从价格表获取起订量
  const minQty = Number(p.min_order_qty) || 50;
  if (item.quantity < minQty) throw new Error('起订量不足，需要≥' + minQty);

  const basePrice = calcBasePrice(item, p);
  const bf = item.branding ? (Number(p.branding_fee) || 0) : 0;
  const unitPrice = (basePrice + bf) * coeff;
  const total = unitPrice * item.quantity;

  return { valveName: item.valveName, spec: item.spec, gatePlate: item.gatePlate, rodMaterial: item.rodMaterial, quantity: item.quantity, minOrderQty: minQty, branding: item.branding, unitPrice, brandingFee: bf, totalPrice: total, pricingCoefficient: coeff };
}

function calcBasePrice(item, p) {
  let bp = getBasePrice(item.valveName, p);
  bp += item.gatePlate === '316' ? (Number(p.gate_316_diff) || 0) : (Number(p.gate_304_diff) || 0);
  const rm = item.rodMaterial;
  bp += rm === '316' ? (Number(p.rod_316_diff) || 0) : rm === '304' ? (Number(p.rod_304_diff) || 0) : 0;
  return bp;
}

async function getPricingCoefficient(seriesName, valveName, specSize, quantity, hasBranding) {
  if (!seriesName) return 1.0;
  try {
    const { data: rules } = await rdb.from('pricing_rules')
      .select('*')
      .eq('series_name', seriesName)
      .gte('dn_max', specSize)
      .lte('dn_min', specSize);
    if (!rules || rules.length === 0) return 1.0;

    // 优先精确匹配产品名，再匹配空产品名
    let rule = rules.find(r => (r.product_name || '') === (valveName || ''));
    if (!rule) rule = rules.find(r => (r.product_name || '') === '');
    if (!rule) rule = rules[0];

    const moqMet = quantity >= (rule.min_order_qty || 1);
    if (moqMet && hasBranding)  return Number(rule.moq_met_oem_coeff) || 1.0;
    if (moqMet && !hasBranding) return Number(rule.moq_met_original_coeff) || 1.0;
    if (!moqMet && hasBranding)  return Number(rule.moq_unmet_oem_coeff) || 1.0;
    if (!moqMet && !hasBranding) return Number(rule.moq_unmet_original_coeff) || 1.0;
    return 1.0;
  } catch (e) {
    return 1.0;
  }
}

function getBasePrice(name, p) {
  return Number(p.price) || 0;
}

async function calcBatch(items) {
  const results = [], errors = [];
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    try {
      const r = await calcItemPrice(items[i]);
      results.push(r);
      total += isNaN(r.totalPrice) ? 0 : r.totalPrice;
    } catch (e) { errors.push({ index: i + 1, error: e.message }); }
  }
  return { results, totalAmount: isNaN(total) ? 0 : total, errors };
}

function genId() { return Date.now().toString(36) + Math.random().toString(36).substring(2, 8); }

// ========== CRUD ==========

async function createQuotation(event) {
  const { customerName, note, paymentMethod, packaging, quoter, quoterPhone, validity, finalPrice, items } = event;
  if (!items || items.length === 0) return { success: false, message: '报价明细不能为空' };

  const input = items.map(i => ({
    valveName: i.valveName, spec: i.spec, gatePlate: i.gatePlate,
    rodMaterial: i.rodMaterial, quantity: i.quantity, branding: i.branding, productType: i.productType
  }));

  const { results, totalAmount, errors } = await calcBatch(input);
  if (errors.length > 0) return { success: false, message: '部分项目计算失败', errors };

  const qid = genId();
  const safeTotal = isNaN(totalAmount) ? 0 : totalAmount;
  const safeFinalPrice = finalPrice !== undefined ? (isNaN(Number(finalPrice)) ? safeTotal : Number(finalPrice)) : safeTotal;
  const openid = 'q-' + qid;

  const { error: qErr } = await rdb.from('quotations').insert({
    _openid: openid,
    id: qid,
    customer_name: customerName || '',
    note: note || '',
    payment_method: paymentMethod || '',
    packaging: packaging || '',
    quoter: quoter || '',
    quoter_phone: quoterPhone || '',
    validity: validity || '',
    total_amount: safeTotal,
    final_price: safeFinalPrice,
    status: 'draft'
  });
  if (qErr) return { success: false, message: '保存报价单失败: ' + qErr.message };

  for (const r of results) {
    const { data: models } = await rdb.from('valve_models').select('id').eq('name', r.valveName);
    const modelId = models?.[0]?.id || null;
    const originalItem = items.find(i => i.valveName === r.valveName);
    const finalUnitPrice = originalItem?.finalUnitPrice !== undefined 
      ? (isNaN(Number(originalItem.finalUnitPrice)) ? r.unitPrice : Number(originalItem.finalUnitPrice))
      : r.unitPrice;
    
    await rdb.from('quotation_items').insert({
      _openid: openid,
      quotation_id: qid,
      model_id: modelId,
      valve_name: r.valveName,
      size: r.spec,
      gate_plate: r.gatePlate,
      rod_material: r.rodMaterial,
      product_type: originalItem?.productType || 'regular',
      quantity: r.quantity,
      min_order_qty: r.minOrderQty,
      branding: r.branding,
      branding_fee: r.brandingFee,
      unit_price: r.unitPrice,
      final_unit_price: finalUnitPrice,
      total_price: r.totalPrice
    });
  }

  return { success: true, data: { id: qid, customerName: customerName || '', totalAmount: safeTotal, finalPrice: safeFinalPrice, itemCount: results.length, status: 'draft' } };
}

async function getQuotationList(event) {
  const page = parseInt(event.page) || 1;
  const limit = parseInt(event.limit) || 10;
  const { status, keyword } = event;

  let query = rdb.from('quotations').select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);
  if (keyword) query = query.contains('customer_name', keyword);
  query = query.order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);

  const { data, count, error } = await query;
  if (error) return { success: false, message: '查询失败: ' + error.message };

  return {
    success: true,
    data: {
      list: (data || []).map(q => ({
        id: q.id, customerName: q.customer_name || '未命名客户', totalAmount: q.total_amount || 0,
        finalPrice: q.final_price || 0, status: q.status || 'draft', 
        createdAt: q.created_at, quoter: q.quoter || '',
        paymentMethod: q.payment_method || '', validity: q.validity || ''
      })),
      pagination: { page, limit, total: count || 0 }
    }
  };
}

async function getQuotationDetail(event) {
  const { id } = event;
  if (!id) return { success: false, message: '报价单ID不能为空' };

  const { data: qs, error: qErr } = await rdb.from('quotations').select('*').eq('id', id);
  if (qErr) return { success: false, message: '查询失败: ' + qErr.message };
  if (!qs || qs.length === 0) return { success: false, message: '报价单不存在' };

  const q = qs[0];
  const { data: items, error: iErr } = await rdb.from('quotation_items').select('*').eq('quotation_id', id).order('created_at', { ascending: true });
  if (iErr) return { success: false, message: '查询明细失败: ' + iErr.message };

  return {
    success: true,
    data: {
      id: q.id, customerName: q.customer_name || '未命名客户', note: q.note || '',
      paymentMethod: q.payment_method || '', packaging: q.packaging || '',
      quoter: q.quoter || '', quoterPhone: q.quoter_phone || '', validity: q.validity || '',
      totalAmount: q.total_amount || 0, finalPrice: q.final_price || 0, status: q.status || 'draft',
      createdAt: q.created_at, updatedAt: q.updated_at,
      items: (items || []).map(i => ({
        id: i.id, valveName: i.valve_name || '', spec: i.size,
        gatePlate: i.gate_plate || '', rodMaterial: i.rod_material || '',
        productType: i.product_type || 'regular', quantity: i.quantity || 0,
        minOrderQty: i.min_order_qty || 1, branding: i.branding || false,
        brandingFee: i.branding_fee || 0, unitPrice: i.unit_price || 0,
        finalUnitPrice: i.final_unit_price || 0, totalPrice: i.total_price || 0
      }))
    }
  };
}

async function updateQuotation(event) {
  const { id, customerName, note, paymentMethod, packaging, quoter, quoterPhone, validity, status, finalPrice } = event;
  if (!id) return { success: false, message: '报价单ID不能为空' };

  const { data: qs, error: qErr } = await rdb.from('quotations').select('id').eq('id', id);
  if (qErr) return { success: false, message: '查询失败: ' + qErr.message };
  if (!qs || qs.length === 0) return { success: false, message: '报价单不存在' };

  const updateData = {};
  if (customerName !== undefined) updateData.customer_name = customerName;
  if (note !== undefined) updateData.note = note;
  if (paymentMethod !== undefined) updateData.payment_method = paymentMethod;
  if (packaging !== undefined) updateData.packaging = packaging;
  if (quoter !== undefined) updateData.quoter = quoter;
  if (quoterPhone !== undefined) updateData.quoter_phone = quoterPhone;
  if (validity !== undefined) updateData.validity = validity;
  if (status !== undefined) updateData.status = status;
  if (finalPrice !== undefined) updateData.final_price = Number(finalPrice);

  if (Object.keys(updateData).length > 0) {
    const { error: upErr } = await rdb.from('quotations').update(updateData).eq('id', id);
    if (upErr) return { success: false, message: '更新失败: ' + upErr.message };
  }

  const { data: updated } = await rdb.from('quotations').select('*').eq('id', id);
  const q = updated[0];
  return { success: true, data: { id: q.id, customerName: q.customer_name, status: q.status, finalPrice: q.final_price, updatedAt: q.updated_at } };
}

async function deleteQuotation(event) {
  const { id } = event;
  if (!id) return { success: false, message: '报价单ID不能为空' };

  await rdb.from('quotation_items').delete().eq('quotation_id', id);
  await rdb.from('quotations').delete().eq('id', id);

  return { success: true, message: '删除成功' };
}

async function getOrderStats(event) {
  const { data: allQuotes, error } = await rdb.from('quotations').select('*');
  if (error) return { success: false, message: '查询失败: ' + error.message };

  const quotes = allQuotes || [];
  
  const totalOrders = quotes.length;
  const pendingCount = quotes.filter(q => q.status === 'draft').length;
  const confirmedCount = quotes.filter(q => q.status === 'confirmed').length;
  const completedCount = quotes.filter(q => q.status === 'completed').length;
  const totalAmount = quotes.reduce((sum, q) => sum + (Number(q.final_price) || Number(q.total_amount) || 0), 0);

  const statusDistribution = [
    { status: '未审核', count: pendingCount, color: '#faad14' },
    { status: '已确认', count: confirmedCount, color: '#1677ff' },
    { status: '已完成', count: completedCount, color: '#52c41a' }
  ];

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const trendMap = {};
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    trendMap[dateStr] = { date: dateStr, count: 0, amount: 0 };
  }

  quotes.forEach(q => {
    if (q.created_at) {
      const createdDate = new Date(q.created_at);
      const dateStr = createdDate.toISOString().split('T')[0];
      if (trendMap[dateStr]) {
        trendMap[dateStr].count++;
        trendMap[dateStr].amount += Number(q.final_price) || Number(q.total_amount) || 0;
      }
    }
  });

  const orderTrend = Object.values(trendMap);

  const recentOrders = quotes
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
    .map(q => ({
      id: q.id,
      customerName: q.customer_name || '未命名客户',
      finalPrice: Number(q.final_price) || Number(q.total_amount) || 0,
      status: q.status || 'draft',
      createdAt: q.created_at
    }));

  return {
    success: true,
    data: {
      summary: {
        totalOrders,
        pendingCount,
        confirmedCount,
        completedCount,
        totalAmount: Number(totalAmount.toFixed(2))
      },
      statusDistribution,
      orderTrend,
      recentOrders
    }
  };
}
