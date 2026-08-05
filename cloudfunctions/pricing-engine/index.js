// 报价规则引擎云函数
// 提供可配置的报价规则计算能力，保留旧逻辑作为兜底方案

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
    const res = await rdb.from(table).select(columns).range(start, end);
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

exports.main = async (event, context) => {
  const { action } = event;
  try {
    switch (action) {
      // ===== 规则引擎核心 =====
      case 'calcPrice':          return await calcPrice(event);
      case 'testRules':          return await testRules(event);
      case 'calcBatch':          return await calcBatch(event);

      // ===== 规则组管理 =====
      case 'getRuleGroups':      return await getRuleGroups(event);
      case 'getRuleGroup':       return await getRuleGroup(event);
      case 'createRuleGroup':    return await createRuleGroup(event);
      case 'updateRuleGroup':    return await updateRuleGroup(event);
      case 'deleteRuleGroup':    return await deleteRuleGroup(event);
      case 'toggleRuleGroup':    return await toggleRuleGroup(event);
      case 'initDefaultRules':   return await initDefaultRules();

      // ===== 规则条件管理 =====
      case 'getConditions':     return await getConditions(event);
      case 'addCondition':       return await addCondition(event);
      case 'updateCondition':    return await updateCondition(event);
      case 'deleteCondition':   return await deleteCondition(event);
      case 'deleteConditionsByGroup': return await deleteConditionsByGroup(event);

      // ===== 规则动作管理 =====
      case 'getActions':        return await getActions(event);
      case 'addAction':          return await addAction(event);
      case 'updateAction':       return await updateAction(event);
      case 'deleteAction':       return await deleteAction(event);
      case 'deleteActionsByGroup': return await deleteActionsByGroup(event);

      default: return { success: false, message: '未知操作: ' + action };
    }
  } catch (error) {
    console.error('Pricing Engine 错误:', error);
    return { success: false, message: error.message || '服务器错误' };
  }
};

// ============================================
// ===== 规则引擎核心 =====
// ============================================

/**
 * 核心价格计算函数
 * @param {object} item - 报价项
 * @param {boolean} useEngine - 是否使用规则引擎（true）或旧逻辑（false）
 */
async function calcPrice(event) {
  const { item, useEngine = true } = event;

  // 如果不用引擎，直接使用旧逻辑
  if (!useEngine) {
    return await calcPriceLegacy(item);
  }

  try {
    // 步骤1: 获取基础价格数据
    const priceData = await getPriceData(item);
    if (!priceData) {
      throw new Error('价格数据不存在: ' + item.valveName + ' DN' + item.spec);
    }

    // 步骤2: 获取产品系列信息和默认材质配置
    const [seriesName, modelMaterials] = await Promise.all([
      getSeriesName(item.valveName),
      getModelMaterials(item.valveName)
    ]);

    // 步骤3: 构建报价上下文
    const context = {
      ...item,
      priceData,
      seriesName,
      modelMaterials,
      gatePlate: item.gatePlate || (modelMaterials && modelMaterials.gate_plate_material) || 'WCB',
      rodMaterial: item.rodMaterial || (modelMaterials && modelMaterials.stem_material) || 'WCB',
      bodyMaterial: item.bodyMaterial || (modelMaterials && modelMaterials.body_material) || 'WCB',
      yokeMaterial: item.yokeMaterial || (modelMaterials && modelMaterials.yoke_material) || 'WCB',
      quantity: item.quantity || 1,
      branding: item.branding || false
    };

    // 步骤4: 加载启用的规则组（按优先级排序）
    const ruleGroups = await getEnabledRuleGroups();

    // 步骤5: 应用规则引擎计算
    const result = await applyRules(ruleGroups, context);

    // 步骤6: 兜底逻辑 - 如果规则引擎计算失败，使用旧逻辑
    if (!result.success) {
      console.warn('[calcPrice] 规则引擎计算失败，使用兜底逻辑:', result.message);
      return await calcPriceLegacy(item);
    }

    // 步骤7: 计算最终价格
    const basePrice = Number(priceData.price) || 0;
    const rawTotal = result.basePrice * context.quantity;

    return {
      success: true,
      data: {
        valveName: item.valveName,
        spec: item.spec,
        gatePlate: context.gatePlate,
        rodMaterial: context.rodMaterial,
        quantity: context.quantity,
        minOrderQty: Number(priceData.min_order_qty) || 50,
        branding: context.branding,
        unitPrice: result.finalUnitPrice,
        brandingFee: result.brandingFee,
        totalPrice: result.finalUnitPrice * context.quantity,
        pricingCoefficient: result.coefficient,
        appliedRules: result.appliedRules,
        calcTrace: result.trace
      }
    };
  } catch (e) {
    console.error('[calcPrice] 规则引擎异常，使用兜底逻辑:', e.message);
    return await calcPriceLegacy(item);
  }
}

/**
 * 旧版价格计算逻辑（兜底方案）
 * 保持与原 quotation/index.js 中的 calcItemPrice 一致
 */
async function calcPriceLegacy(item) {
  const { data: models } = await rdb.from('valve_models').select('id,series_id').eq('name', item.valveName);
  if (!models || models.length === 0) throw new Error('阀门型号不存在: ' + item.valveName);

  const { data: prices } = await rdb.from('price_table').select('*').eq('model_id', models[0].id).eq('size', item.spec);
  if (!prices || prices.length === 0) throw new Error('价格数据不存在: ' + item.valveName + ' DN' + item.spec);

  const p = prices[0];
  if (p.status !== 'enabled') throw new Error('该产品已禁用');

  let seriesName = '';
  if (models[0].series_id) {
    const { data: series } = await rdb.from('product_series').select('name').eq('id', models[0].series_id);
    if (series && series.length > 0) seriesName = series[0].name;
  }

  // 查询系数规则（旧逻辑）
  const coeff = await getPricingCoefficientLegacy(seriesName, item.valveName, item.spec, item.quantity, item.branding);

  const basePrice = calcBasePriceLegacy(item, p);
  const bf = item.branding ? (Number(p.branding_fee) || 0) : 0;
  const unitPrice = (basePrice + bf) * coeff;
  const total = unitPrice * item.quantity;

  return {
    success: true,
    data: {
      valveName: item.valveName,
      spec: item.spec,
      gatePlate: item.gatePlate,
      rodMaterial: item.rodMaterial,
      quantity: item.quantity,
      minOrderQty: Number(p.min_order_qty) || 50,
      branding: item.branding,
      unitPrice,
      brandingFee: bf,
      totalPrice: total,
      pricingCoefficient: coeff,
      appliedRules: ['legacy'],
      calcTrace: [{ step: 'legacy', price: unitPrice }]
    }
  };
}

/**
 * 旧版基础价格计算
 */
function calcBasePriceLegacy(item, p) {
  let bp = Number(p.price) || 0;
  bp += item.gatePlate === '316' ? (Number(p.gate_316_diff) || 0) : (Number(p.gate_304_diff) || 0);
  const rm = item.rodMaterial;
  bp += rm === '316' ? (Number(p.rod_316_diff) || 0) : rm === '304' ? (Number(p.rod_304_diff) || 0) : 0;
  return bp;
}

/**
 * 旧版系数获取
 */
async function getPricingCoefficientLegacy(seriesName, valveName, specSize, quantity, hasBranding) {
  if (!seriesName) return 1.0;
  try {
    const { data: rules } = await rdb.from('pricing_rules')
      .select('*')
      .eq('series_name', seriesName)
      .gte('dn_max', specSize)
      .lte('dn_min', specSize);
    if (!rules || rules.length === 0) return 1.0;

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

/**
 * 从 pricing_rules 表查询报价系数（供 apply_coefficient 动作使用）
 * 查询优先级：精确产品名 > 系列通用 > 全局
 */
async function getPricingCoefficientFromTable(context) {
  const seriesName = context.seriesName || '';
  const valveName = context.valveName || '';
  const specSize = context.spec;
  const quantity = context.quantity || 1;
  const hasBranding = context.branding || false;

  if (!seriesName) return { coefficient: 1.0, source: 'no_series' };

  try {
    const { data: rules } = await rdb.from('pricing_rules')
      .select('*')
      .eq('series_name', seriesName)
      .gte('dn_max', specSize)
      .lte('dn_min', specSize);

    if (!rules || rules.length === 0) {
      // 查全局规则（series_name 为空）
      const { data: globalRules } = await rdb.from('pricing_rules')
        .select('*')
        .gte('dn_max', specSize)
        .lte('dn_min', specSize);
      if (!globalRules || globalRules.length === 0) {
        return { coefficient: 1.0, source: 'no_match' };
      }
      let rule = globalRules.find(r => (r.product_name || '') === (valveName || ''));
      if (!rule) rule = globalRules.find(r => (r.product_name || '') === '');
      if (!rule) rule = globalRules[0];
      return resolveCoeff(rule, quantity, hasBranding, 'global');
    }

    // 精确产品名匹配 > 系列通用
    let rule = rules.find(r => (r.product_name || '') === (valveName || ''));
    if (!rule) rule = rules.find(r => (r.product_name || '') === '');
    if (!rule) rule = rules[0];

    return resolveCoeff(rule, quantity, hasBranding, 'series');
  } catch (e) {
    console.error('[getPricingCoefficientFromTable] 查询失败:', e.message);
    return { coefficient: 1.0, source: 'error' };
  }
}

function resolveCoeff(rule, quantity, hasBranding, source) {
  const moqMet = quantity >= (rule.min_order_qty || 1);
  let coeff = 1.0;
  let scenario = '';
  if (moqMet && hasBranding)  { coeff = Number(rule.moq_met_oem_coeff) || 1.0; scenario = '达到MOQ+磨标'; }
  else if (moqMet && !hasBranding) { coeff = Number(rule.moq_met_original_coeff) || 1.0; scenario = '达到MOQ+原装'; }
  else if (!moqMet && hasBranding) { coeff = Number(rule.moq_unmet_oem_coeff) || 1.0; scenario = '未达MOQ+磨标'; }
  else { coeff = Number(rule.moq_unmet_original_coeff) || 1.0; scenario = '未达MOQ+原装'; }
  return { coefficient: coeff, source: source, scenario: scenario };
}

/**
 * 批量计算
 */
async function calcBatch(event) {
  const { items, useEngine = true } = event;
  const results = [];
  const errors = [];
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    try {
      const res = await calcPrice({ item: items[i], useEngine });
      results.push(res.data);
      total += isNaN(res.data.totalPrice) ? 0 : res.data.totalPrice;
    } catch (e) {
      errors.push({ index: i + 1, error: e.message });
    }
  }

  return {
    success: true,
    data: {
      results,
      totalAmount: isNaN(total) ? 0 : total,
      errors
    }
  };
}

/**
 * 规则测试 - 用于管理端预览计算过程
 */
async function testRules(event) {
  const { item } = event;

  try {
    const priceData = await getPriceData(item);
    if (!priceData) {
      return { success: false, message: '价格数据不存在' };
    }

    const [seriesName, modelMaterials] = await Promise.all([
      getSeriesName(item.valveName),
      getModelMaterials(item.valveName)
    ]);

    const context = {
      ...item,
      priceData,
      seriesName,
      modelMaterials,
      gatePlate: item.gatePlate || (modelMaterials && modelMaterials.gate_plate_material) || 'WCB',
      rodMaterial: item.rodMaterial || (modelMaterials && modelMaterials.stem_material) || 'WCB',
      bodyMaterial: item.bodyMaterial || (modelMaterials && modelMaterials.body_material) || 'WCB',
      yokeMaterial: item.yokeMaterial || (modelMaterials && modelMaterials.yoke_material) || 'WCB',
      quantity: item.quantity || 1,
      branding: item.branding || false
    };

    const ruleGroups = await getEnabledRuleGroups();
    const result = await applyRules(ruleGroups, context);

    const totalPrice = Number((result.finalUnitPrice * context.quantity).toFixed(2));

    return {
      success: true,
      data: {
        ...result,
        basePrice: Number(priceData.price) || 0,
        totalPrice,
        priceData
      }
    };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

// ============================================
// ===== 规则引擎执行逻辑 =====
// ============================================

/**
 * 获取价格基础数据
 */
async function getPriceData(item) {
  const { data: models } = await rdb.from('valve_models').select('id').eq('name', item.valveName);
  if (!models || models.length === 0) return null;

  const { data: prices } = await rdb.from('price_table').select('*')
    .eq('model_id', models[0].id)
    .eq('size', item.spec);

  if (!prices || prices.length === 0 || prices[0].status !== 'enabled') return null;
  return prices[0];
}

/**
 * 获取产品系列名称
 */
async function getSeriesName(valveName) {
  const { data: models } = await rdb.from('valve_models').select('series_id').eq('name', valveName);
  if (!models || models.length === 0) return '';

  if (!models[0].series_id) return '';
  const { data: series } = await rdb.from('product_series').select('name').eq('id', models[0].series_id);
  return series && series.length > 0 ? series[0].name : '';
}

/**
 * 获取型号默认材质配置（从 valve_model_materials 表）
 */
async function getModelMaterials(valveName) {
  try {
    const { data: models } = await rdb.from('valve_models').select('id').eq('name', valveName);
    if (!models || models.length === 0) return null;

    const { data: materials } = await rdb.from('valve_model_materials')
      .select('*')
      .eq('model_id', models[0].id);

    if (!materials || materials.length === 0) return null;
    return materials[0];
  } catch (e) {
    console.error('[getModelMaterials] 错误:', e.message);
    return null;
  }
}

/**
 * 获取所有启用的规则组
 */
async function getEnabledRuleGroups() {
  const { data, error } = await rdb.from('pricing_rule_groups')
    .select('*')
    .eq('is_enabled', 1)
    .order('priority', { ascending: true });

  if (error) {
    console.error('[getEnabledRuleGroups] 错误:', error);
    return [];
  }

  // 加载每个规则组的条件和动作
  const groups = [];
  for (const g of (data || [])) {
    const conditions = await getGroupConditions(g.id);
    const actions = await getGroupActions(g.id);
    groups.push({ ...g, conditions, actions });
  }

  return groups;
}

/**
 * 获取规则组的条件列表
 */
async function getGroupConditions(groupId) {
  const { data } = await rdb.from('pricing_rule_conditions')
    .select('*')
    .eq('group_id', groupId)
    .order('sort_order', { ascending: true });

  return (data || []).map(c => {
    let condValue = c.condition_value;
    if (typeof condValue === 'string') {
      try { condValue = JSON.parse(condValue); } catch (e) { condValue = {}; }
    }
    return {
      id: c.id,
      groupId: c.group_id,
      conditionType: c.condition_type,
      conditionValue: condValue,
      logicOperator: c.logic_operator || 'AND',
      sortOrder: c.sort_order || 0
    };
  });
}

/**
 * 获取规则组的动作列表
 */
async function getGroupActions(groupId) {
  const { data } = await rdb.from('pricing_rule_actions')
    .select('*')
    .eq('group_id', groupId)
    .order('calc_order', { ascending: true });

  return (data || []).map(a => {
    let actParams = a.action_params;
    if (typeof actParams === 'string') {
      try { actParams = JSON.parse(actParams); } catch (e) { actParams = {}; }
    }
    return {
      id: a.id,
      groupId: a.group_id,
      actionType: a.action_type,
      actionParams: actParams,
      calcOrder: a.calc_order || 0
    };
  });
}

/**
 * 应用规则引擎执行计算
 */
async function applyRules(ruleGroups, context) {
  const basePrice = Number(context.priceData.price) || 0;
  let currentPrice = basePrice;
  let coefficient = 1.0;
  let brandingFee = 0;
  const appliedRules = [];
  const trace = [{ step: 'start', price: currentPrice, desc: '基础价格', matched: true }];
  const priceAdjustments = [];

  for (const group of ruleGroups) {
    // 详细评估每个条件
    const conditionDetails = [];
    let isMatch = true;

    for (let i = 0; i < group.conditions.length; i++) {
      const condition = group.conditions[i];
      const condResult = evaluateSingleCondition(condition, context);
      const condDetail = {
        type: condition.conditionType,
        value: condition.conditionValue,
        passed: condResult,
        logicOperator: i === 0 ? null : (condition.logicOperator || 'AND')
      };
      conditionDetails.push(condDetail);

      if (i === 0) {
        isMatch = condResult;
      } else {
        if (condition.logicOperator === 'AND') {
          isMatch = isMatch && condResult;
        } else {
          isMatch = isMatch || condResult;
        }
      }
    }

    // 无条件的规则默认匹配
    if (group.conditions.length === 0) {
      isMatch = true;
    }

    trace.push({
      step: 'evaluate',
      rule: group.group_name,
      matched: isMatch,
      desc: isMatch ? '匹配规则' : '条件不满足，跳过',
      conditionDetails
    });

    if (isMatch) {
      appliedRules.push(group.group_name);

      // 执行动作
      for (const action of group.actions) {
        const prevPrice = currentPrice;
        const result = await executeAction(action, context, currentPrice, coefficient, brandingFee);
        currentPrice = result.price;
        coefficient = result.coefficient;
        brandingFee = result.brandingFee;
        const priceDelta = currentPrice - prevPrice;

        if (result.executed) {
          const adjustment = {
            actionType: action.actionType,
            rule: group.group_name,
            delta: priceDelta,
            desc: formatActionDesc(action, result)
          };

          if (action.actionType === 'material_diff' && priceDelta > 0) {
            adjustment.label = '材质差价';
            priceAdjustments.push(adjustment);
          } else if (action.actionType === 'add_markup') {
            const params = typeof action.actionParams === 'string' ? JSON.parse(action.actionParams) : action.actionParams;
            const unit = params.unit || '元';
            if (unit !== 'percent' && priceDelta > 0) {
              adjustment.label = '加价';
              priceAdjustments.push(adjustment);
            } else if (unit === 'percent') {
              adjustment.label = '加价';
              priceAdjustments.push(adjustment);
            }
          } else if (action.actionType === 'set_base_price') {
            adjustment.label = '基础价调整';
            priceAdjustments.push(adjustment);
          }

          trace.push({
            step: 'action',
            rule: group.group_name,
            action: action.actionType,
            price: currentPrice,
            coefficient: coefficient,
            matched: true,
            desc: formatActionDesc(action, result)
          });
        } else {
          trace.push({
            step: 'action',
            rule: group.group_name,
            action: action.actionType,
            price: currentPrice,
            coefficient: coefficient,
            matched: false,
            skipped: true,
            skipReason: result.skipReason || 'when 条件不满足',
            desc: `跳过执行：${formatActionDesc(action, result)}`
          });
        }
      }
    }
  }

  // 计算最终单价
  const finalUnitPrice = (currentPrice + brandingFee) * coefficient;
  const finalPrice = Number(finalUnitPrice.toFixed(2));

  let formulaStr = `${basePrice.toFixed(2)}`;
  if (priceAdjustments.length > 0) {
    const parts = priceAdjustments.map(a => `${a.delta >= 0 ? '+' : ''}${a.delta.toFixed(2)}`);
    formulaStr = `(${basePrice.toFixed(2)} ${parts.join(' ')})`;
  }
  if (brandingFee > 0) {
    formulaStr = `(${basePrice.toFixed(2)}${priceAdjustments.length > 0 ? ' + ' + priceAdjustments.reduce((s, a) => s + a.delta, 0).toFixed(2) : ''} + ${brandingFee})`;
  }

  trace.push({
    step: 'end',
    price: finalPrice,
    basePrice: basePrice,
    adjustments: priceAdjustments,
    brandingFee: brandingFee,
    coefficient: coefficient,
    desc: `最终单价 = ${formulaStr} × ${coefficient}`,
    matched: true
  });

  return {
    success: true,
    basePrice: currentPrice,
    finalUnitPrice,
    coefficient,
    brandingFee,
    appliedRules,
    trace
  };
}

/**
 * 条件评估
 */
function evaluateConditions(conditions, context) {
  if (!conditions || conditions.length === 0) return true;

  // 按逻辑运算符分组评估
  let result = evaluateSingleCondition(conditions[0], context);

  for (let i = 1; i < conditions.length; i++) {
    const condition = conditions[i];
    const conditionResult = evaluateSingleCondition(condition, context);

    if (condition.logicOperator === 'AND') {
      result = result && conditionResult;
    } else { // OR
      result = result || conditionResult;
    }
  }

  return result;
}

/**
 * 单条件评估
 */
function evaluateSingleCondition(condition, context) {
  const { conditionType, conditionValue } = condition;
  const value = typeof conditionValue === 'string' ? JSON.parse(conditionValue) : conditionValue;

  switch (conditionType) {
    case 'series':
      return context.seriesName === value.value;

    case 'product_name':
      return context.valveName === value.value;

    case 'dn_range':
      const dn = Number(context.spec);
      return dn >= (value.min || 0) && dn <= (value.max || 99999);

    case 'quantity_range':
      return context.quantity >= (value.min || 0) && context.quantity <= (value.max || 99999);

    case 'product_type':
      const ptype = String(value.value || '').toLowerCase();
      if (ptype === 'oem' || ptype === '磨标') {
        return context.branding === true;
      }
      if (ptype === 'regular' || ptype === '常规品' || ptype === '原装') {
        return context.branding !== true;
      }
      return true;

    case 'material':
      const partMatMap = {
        'gate_plate': context.gatePlate || 'WCB',
        'stem': context.rodMaterial || 'WCB',
        'rod': context.rodMaterial || 'WCB',
        'body': context.bodyMaterial || 'WCB',
        'yoke': context.yokeMaterial || 'WCB'
      };
      const matValue = partMatMap[value.part] || 'WCB';
      return matValue === value.value;

    case 'custom':
      // 自定义表达式 - 简化支持
      return evaluateCustomExpr(value.expr, context);

    default:
      return true;
  }
}

/**
 * 自定义表达式评估（简化版）
 */
function evaluateCustomExpr(expr, context) {
  try {
    // 安全的表达式评估（仅支持简单比较）
    const vars = {
      quantity: context.quantity,
      minOrderQty: Number(context.priceData.min_order_qty) || 50,
      branding: context.branding ? 1 : 0,
      spec: Number(context.spec)
    };

    // 替换变量并求值
    let evalExpr = expr;
    for (const [key, val] of Object.entries(vars)) {
      evalExpr = evalExpr.replace(new RegExp('item\\.' + key, 'g'), String(val));
    }

    // 简单安全检查
    if (evalExpr.includes('function') || evalExpr.includes('eval') || evalExpr.includes('require')) {
      return false;
    }

    return eval(evalExpr) === true;
  } catch (e) {
    return false;
  }
}

/**
 * 查询材质差价（从 material_price_diffs 表，带优先级匹配）
 */
async function getMaterialDiffByPart(query) {
  const { seriesName, modelName, size, partName, baseMaterial, targetMaterial } = query;
  if (!partName || !baseMaterial || !targetMaterial) return null;
  if (baseMaterial === targetMaterial) return null;

  try {
    const { data: diffs, error } = await rdb.from('material_price_diffs')
      .select('*')
      .eq('part_name', partName)
      .eq('base_material', baseMaterial)
      .eq('target_material', targetMaterial);

    if (error || !diffs || diffs.length === 0) return null;

    // 优先级匹配
    // 1. 精确：model + size
    if (modelName && size !== undefined) {
      let matched = diffs.find(d => d.model_name === modelName && Number(d.size) === Number(size));
      if (matched) return { priceDiff: Number(matched.price_diff) || 0, level: 'exact' };
    }

    // 2. 型号级
    if (modelName) {
      let matched = diffs.find(d => d.model_name === modelName && (!d.size || d.size === null));
      if (matched) return { priceDiff: Number(matched.price_diff) || 0, level: 'model' };
    }

    // 3. 系列级
    if (seriesName) {
      let matched = diffs.find(d => d.series_name === seriesName && (!d.model_name || d.model_name === ''));
      if (matched) return { priceDiff: Number(matched.price_diff) || 0, level: 'series' };
    }

    // 4. 全局
    let matched = diffs.find(d =>
      (!d.series_name || d.series_name === '') && (!d.model_name || d.model_name === '')
    );
    if (matched) return { priceDiff: Number(matched.price_diff) || 0, level: 'global' };

    return null;
  } catch (e) {
    console.error('[getMaterialDiffByPart] 查询失败:', e.message);
    return null;
  }
}

/**
 * 动作执行（含 when 条件检查）
 */
async function executeAction(action, context, currentPrice, coefficient, brandingFee) {
  const { actionType, actionParams } = action;
  const params = typeof actionParams === 'string' ? JSON.parse(actionParams) : actionParams;

  // 统一 when 条件检查
  if (params.when) {
    const whenMatch = checkWhenCondition(params.when, context);
    if (!whenMatch) {
      const skipReason = buildWhenSkipReason(params.when, context);
      return { price: currentPrice, coefficient, brandingFee, executed: false, skipReason };
    }
  }

  switch (actionType) {
    case 'multiply_coefficient': {
      coefficient *= params.value;
      return { price: currentPrice, coefficient, brandingFee, executed: true };
    }

    case 'apply_coefficient': {
      // 从 pricing_rules 表（报价系数页面管理）查询匹配的系数
      const coeffResult = await getPricingCoefficientFromTable(context);
      if (coeffResult.coefficient && coeffResult.coefficient !== 1.0) {
        coefficient *= coeffResult.coefficient;
        return {
          price: currentPrice,
          coefficient,
          brandingFee,
          executed: true,
          coeffValue: coeffResult.coefficient,
          coeffSource: coeffResult.source,
          scenario: coeffResult.scenario
        };
      }
      return {
        price: currentPrice,
        coefficient,
        brandingFee,
        executed: true,
        coeffValue: 1.0,
        coeffSource: coeffResult.source || 'none',
        scenario: coeffResult.scenario || ''
      };
    }

    case 'add_markup': {
      const amount = params.unit === 'percent' ? currentPrice * params.value : params.value;
      currentPrice += amount;
      return { price: currentPrice, coefficient, brandingFee, executed: true };
    }

    case 'set_base_price': {
      currentPrice = params.value;
      return { price: currentPrice, coefficient, brandingFee, executed: true };
    }

    case 'apply_discount': {
      currentPrice *= params.value;
      return { price: currentPrice, coefficient, brandingFee, executed: true };
    }

    case 'material_diff': {
      const part = params.part;
      const partMap = {
        'gate_plate': { ctx: 'gatePlate', matCol: 'gate_plate_material', diffField: 'gate' },
        'stem': { ctx: 'rodMaterial', matCol: 'stem_material', diffField: 'rod' },
        'rod': { ctx: 'rodMaterial', matCol: 'stem_material', diffField: 'rod' },
        'body': { ctx: 'bodyMaterial', matCol: 'body_material', diffField: 'body' },
        'yoke': { ctx: 'yokeMaterial', matCol: 'yoke_material', diffField: 'yoke' }
      };
      const partInfo = partMap[part];
      if (!partInfo) {
        return { price: currentPrice, coefficient, brandingFee, executed: false, skipReason: '未知部位: ' + part };
      }

      const actualMaterial = context[partInfo.ctx] || 'WCB';
      const baseMaterial = context.modelMaterials
        ? (context.modelMaterials[partInfo.matCol] || 'WCB')
        : 'WCB';

      if (actualMaterial === baseMaterial) {
        return { price: currentPrice, coefficient, brandingFee, executed: true };
      }

      // 查 material_price_diffs 表
      let diffValue = 0;
      let diffLevel = 'none';
      try {
        const diffResult = await getMaterialDiffByPart({
          seriesName: context.seriesName,
          modelName: context.valveName,
          size: context.spec,
          partName: part,
          baseMaterial: baseMaterial,
          targetMaterial: actualMaterial
        });
        if (diffResult && diffResult.priceDiff) {
          diffValue = Number(diffResult.priceDiff) || 0;
          diffLevel = diffResult.level || 'exact';
        }
      } catch (e) {
        console.error('[material_diff] 查询 material_price_diffs 失败:', e.message);
      }

      // 兜底：查 price_table 旧列
      if (diffValue === 0 && context.priceData) {
        const legacyField = partInfo.diffField + '_' + actualMaterial.toLowerCase() + '_diff';
        if (context.priceData[legacyField] !== undefined) {
          diffValue = Number(context.priceData[legacyField]) || 0;
          diffLevel = 'legacy';
        }
      }

      if (diffValue > 0) {
        currentPrice += diffValue;
      }
      return { price: currentPrice, coefficient, brandingFee, executed: true, diffValue, diffLevel, actualMaterial, baseMaterial };
    }

    case 'branding_fee': {
      const priceField = params.price_field || 'branding_fee';
      brandingFee = Number(context.priceData[priceField]) || 0;
      return { price: currentPrice, coefficient, brandingFee, executed: true };
    }

    case 'custom_formula': {
      try {
        let formula = params.formula;
        formula = formula.replace(/basePrice/g, String(currentPrice));
        formula = formula.replace(/quantity/g, String(context.quantity));
        const result = eval(formula);
        currentPrice = result;
      } catch (e) {
        console.error('[custom_formula] 公式计算失败:', e.message);
      }
      return { price: currentPrice, coefficient, brandingFee, executed: true };
    }

    default:
      return { price: currentPrice, coefficient, brandingFee, executed: true };
  }
}

/**
 * 构建 when 条件跳过原因描述
 */
function buildWhenSkipReason(when, context) {
  const parts = [];
  const { quantity_op, quantity_value, quantity_use_moq, branding } = when;

  if (quantity_op !== undefined && quantity_value !== undefined) {
    const qty = context.quantity;
    let compareValue = quantity_value;
    if (quantity_use_moq && context.priceData && context.priceData.min_order_qty) {
      compareValue = Number(context.priceData.min_order_qty);
    }
    const opMap = { '>=': '≥', '>': '>', '<=': '≤', '<': '<' };
    parts.push(`数量 ${qty} ${opMap[quantity_op]} ${compareValue} 不满足`);
  }

  if (branding !== undefined) {
    const current = context.branding;
    const expected = branding;
    parts.push(`磨标状态 ${current ? '磨标' : '原装'} ≠ ${expected ? '磨标' : '原装'}`);
  }

  return parts.join('，');
}

/**
 * 检查 when 条件
 */
function checkWhenCondition(when, context) {
  const { quantity_op, quantity_value, quantity_use_moq, branding } = when;

  // 检查数量条件
  if (quantity_op !== undefined && quantity_value !== undefined) {
    const qty = context.quantity;
    // 如果使用 MOQ，从产品数据获取
    let compareValue = quantity_value;
    if (quantity_use_moq && context.priceData && context.priceData.min_order_qty) {
      compareValue = Number(context.priceData.min_order_qty);
    }
    switch (quantity_op) {
      case '>=':
        if (qty < compareValue) return false;
        break;
      case '>':
        if (qty <= compareValue) return false;
        break;
      case '<=':
        if (qty > compareValue) return false;
        break;
      case '<':
        if (qty >= compareValue) return false;
        break;
    }
  }

  // 检查磨标状态
  if (branding !== undefined) {
    if (context.branding !== branding) return false;
  }

  return true;
}

/**
 * 格式化动作描述（用于日志）
 */
function formatActionDesc(action, result) {
  const params = typeof action.actionParams === 'string' ? JSON.parse(action.actionParams) : action.actionParams;

  switch (action.actionType) {
    case 'multiply_coefficient':
      return `乘以系数 ${params.value}`;
    case 'apply_coefficient':
      if (result && result.coeffValue && result.coeffValue !== 1.0) {
        return `报价系数 ×${result.coeffValue}（${result.coeffSource || ''}${result.scenario ? ', ' + result.scenario : ''}）`;
      }
      return `报价系数查询（未匹配到系数规则，×1.0）`;
    case 'add_markup':
      return `加价 ${params.unit === 'percent' ? (params.value * 100 + '%') : params.value + '元'}`;
    case 'apply_discount':
      return `折扣 ${(params.value * 100).toFixed(0)}折`;
    case 'material_diff':
      const partNames = { gate_plate: '闸板', stem: '阀杆', rod: '阀杆', body: '阀体', yoke: '支架' };
      const pn = partNames[params.part] || params.part;
      if (result && result.diffValue > 0) {
        return `${pn}材质差价 +¥${result.diffValue.toFixed(2)}（${result.baseMaterial}→${result.actualMaterial}, ${result.diffLevel || 'exact'}匹配）`;
      }
      if (result && result.actualMaterial === result.baseMaterial) {
        return `${pn}材质无变化（${result.baseMaterial}），不加价`;
      }
      return `${pn}材质差价（${result && result.diffLevel ? '无匹配' : ''}）`;
    case 'branding_fee':
      return `添加磨标费`;
    default:
      return action.actionType;
  }
}

// ============================================
// ===== 规则组 CRUD =====
// ============================================

async function getRuleGroups(event) {
  try {
    const { data, error } = await rdb.from('pricing_rule_groups')
      .select('*')
      .order('priority', { ascending: true });

    if (error) return { success: false, message: error.message };

    const result = [];
    for (const g of (data || [])) {
      const conditions = await getGroupConditions(g.id);
      const actions = await getGroupActions(g.id);
      result.push({
        id: g.id,
        groupName: g.group_name,
        description: g.description || '',
        priority: g.priority,
        isEnabled: !!g.is_enabled,
        isSystem: !!g.is_system,
        createdAt: g.created_at,
        updatedAt: g.updated_at,
        conditions,
        actions
      });
    }

    return { success: true, data: result };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

async function getRuleGroup(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  const { data, error } = await rdb.from('pricing_rule_groups').select('*').eq('id', id);
  if (error) return { success: false, message: error.message };
  if (!data || data.length === 0) return { success: false, message: '规则组不存在' };

  const conditions = await getGroupConditions(id);
  const actions = await getGroupActions(id);

  return {
    success: true,
    data: {
      id: data[0].id,
      groupName: data[0].group_name,
      description: data[0].description || '',
      priority: data[0].priority,
      isEnabled: !!data[0].is_enabled,
      isSystem: !!data[0].is_system,
      conditions,
      actions
    }
  };
}

async function createRuleGroup(event) {
  const { data } = event;
  if (!data || !data.groupName) return { success: false, message: '规则组名称不能为空' };

  const { error } = await rdb.from('pricing_rule_groups').insert({
    group_name: data.groupName,
    description: data.description || '',
    priority: data.priority || 100,
    is_enabled: data.isEnabled !== undefined ? data.isEnabled : 1,
    is_system: 0,
    created_at: now(),
    updated_at: now()
  });

  if (error) return { success: false, message: error.message };

  // 查询新创建的规则组ID
  const { data: inserted } = await rdb.from('pricing_rule_groups')
    .select('id')
    .eq('group_name', data.groupName)
    .order('id', { ascending: false });

  const newId = inserted && inserted.length > 0 ? inserted[0].id : null;
  return { success: true, message: '创建成功', id: newId };
}

async function updateRuleGroup(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  var updateData = { updated_at: now() };
  if (data.groupName !== undefined) updateData.group_name = data.groupName;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.isEnabled !== undefined) updateData.is_enabled = data.isEnabled ? 1 : 0;

  const { error } = await rdb.from('pricing_rule_groups').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteRuleGroup(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  // 检查是否系统内置
  const { data } = await rdb.from('pricing_rule_groups').select('is_system').eq('id', id);
  if (data && data.length > 0 && data[0].is_system) {
    return { success: false, message: '系统内置规则不可删除' };
  }

  // 级联删除条件和动作
  await rdb.from('pricing_rule_conditions').delete().eq('group_id', id);
  await rdb.from('pricing_rule_actions').delete().eq('group_id', id);

  const { error } = await rdb.from('pricing_rule_groups').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

async function toggleRuleGroup(event) {
  const { id, isEnabled } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  const { error } = await rdb.from('pricing_rule_groups')
    .update({ is_enabled: isEnabled ? 1 : 0, updated_at: now() })
    .eq('id', id);

  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

/**
 * 初始化默认规则（与现有固定规则一致）
 */
async function initDefaultRules() {
  try {
    // 检查是否已初始化
    const { data: existing } = await rdb.from('pricing_rule_groups').select('id').eq('is_system', 1);
    if (existing && existing.length > 0) {
      return { success: true, message: '默认规则已存在' };
    }

    // 创建规则组配置
    const ruleConfigs = [
      {
        name: '常规产品MOQ规则',
        priority: 10,
        conditions: [], // 无条件 = 匹配所有产品
        actions: [
          {
            actionType: 'multiply_coefficient',
            actionParams: { value: 1.2, when: { quantity_op: '>=', quantity_value: 50, branding: false } },
            calcOrder: 1
          },
          {
            actionType: 'multiply_coefficient',
            actionParams: { value: 1.5, when: { quantity_op: '>=', quantity_value: 50, branding: true } },
            calcOrder: 2
          },
          {
            actionType: 'multiply_coefficient',
            actionParams: { value: 1.5, when: { quantity_op: '<', quantity_value: 50, branding: false } },
            calcOrder: 3
          },
          {
            actionType: 'multiply_coefficient',
            actionParams: { value: 2.0, when: { quantity_op: '<', quantity_value: 50, branding: true } },
            calcOrder: 4
          }
        ]
      },
      {
        name: '316闸板加价规则',
        priority: 20,
        conditions: [
          {
            conditionType: 'material',
            conditionValue: { part: 'gate_plate', value: '316' },
            logicOperator: 'AND',
            sortOrder: 1
          }
        ],
        actions: [
          {
            actionType: 'material_diff',
            actionParams: { part: 'gate_plate', material: '316', price_field: 'gate_316_diff' },
            calcOrder: 1
          }
        ]
      },
      {
        name: '316阀杆加价规则',
        priority: 20,
        conditions: [
          {
            conditionType: 'material',
            conditionValue: { part: 'rod', value: '316' },
            logicOperator: 'AND',
            sortOrder: 1
          }
        ],
        actions: [
          {
            actionType: 'material_diff',
            actionParams: { part: 'rod', material: '316', price_field: 'rod_316_diff' },
            calcOrder: 1
          }
        ]
      },
      {
        name: '304闸板加价规则',
        priority: 20,
        conditions: [
          {
            conditionType: 'material',
            conditionValue: { part: 'gate_plate', value: '304' },
            logicOperator: 'AND',
            sortOrder: 1
          }
        ],
        actions: [
          {
            actionType: 'material_diff',
            actionParams: { part: 'gate_plate', material: '304', price_field: 'gate_304_diff' },
            calcOrder: 1
          }
        ]
      },
      {
        name: '304阀杆加价规则',
        priority: 20,
        conditions: [
          {
            conditionType: 'material',
            conditionValue: { part: 'rod', value: '304' },
            logicOperator: 'AND',
            sortOrder: 1
          }
        ],
        actions: [
          {
            actionType: 'material_diff',
            actionParams: { part: 'rod', material: '304', price_field: 'rod_304_diff' },
            calcOrder: 1
          }
        ]
      },
      {
        name: '磨标费用规则',
        priority: 30,
        conditions: [
          {
            conditionType: 'product_type',
            conditionValue: { value: 'oem' },
            logicOperator: 'AND',
            sortOrder: 1
          }
        ],
        actions: [
          {
            actionType: 'branding_fee',
            actionParams: { price_field: 'branding_fee' },
            calcOrder: 1
          }
        ]
      }
    ];

    // 创建所有规则组及其条件和动作
    for (const config of ruleConfigs) {
      // 插入规则组
      const { error: gErr } = await rdb.from('pricing_rule_groups').insert({
        group_name: config.name,
        description: '系统默认规则',
        priority: config.priority,
        is_enabled: 1,
        is_system: 1,
        created_at: now(),
        updated_at: now()
      });

      if (gErr) {
        console.error('[initDefaultRules] 创建规则组失败:', config.name, gErr);
        continue;
      }

      // 查询刚插入的规则组ID
      const { data: inserted } = await rdb.from('pricing_rule_groups')
        .select('id')
        .eq('group_name', config.name)
        .eq('is_system', 1)
        .order('id', { ascending: false });

      if (!inserted || inserted.length === 0) {
        console.error('[initDefaultRules] 查询规则组ID失败:', config.name);
        continue;
      }

      const groupId = inserted[0].id;

      // 插入条件
      for (const cond of config.conditions) {
        await rdb.from('pricing_rule_conditions').insert({
          group_id: groupId,
          condition_type: cond.conditionType,
          condition_value: JSON.stringify(cond.conditionValue),
          logic_operator: cond.logicOperator || 'AND',
          sort_order: cond.sortOrder || 0,
          created_at: now()
        });
      }

      // 插入动作
      for (const act of config.actions) {
        await rdb.from('pricing_rule_actions').insert({
          group_id: groupId,
          action_type: act.actionType,
          action_params: JSON.stringify(act.actionParams),
          calc_order: act.calcOrder || 0,
          created_at: now()
        });
      }
    }

    return { success: true, message: '默认规则初始化成功' };
  } catch (e) {
    return { success: false, message: e.message };
  }
}

// ============================================
// ===== 规则条件 CRUD =====
// ============================================

async function getConditions(event) {
  const { groupId } = event;
  if (!groupId) return { success: false, message: 'groupId不能为空' };

  const conditions = await getGroupConditions(groupId);
  return { success: true, data: conditions };
}

async function addCondition(event) {
  const { data } = event;
  if (!data || !data.groupId) return { success: false, message: '参数不完整' };

  const { error } = await rdb.from('pricing_rule_conditions').insert({
    group_id: data.groupId,
    condition_type: data.conditionType,
    condition_value: JSON.stringify(data.conditionValue),
    logic_operator: data.logicOperator || 'AND',
    sort_order: data.sortOrder || 0,
    created_at: now()
  });

  if (error) return { success: false, message: error.message };
  return { success: true, message: '添加成功' };
}

async function updateCondition(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  var updateData = {};
  if (data.conditionType !== undefined) updateData.condition_type = data.conditionType;
  if (data.conditionValue !== undefined) updateData.condition_value = JSON.stringify(data.conditionValue);
  if (data.logicOperator !== undefined) updateData.logic_operator = data.logicOperator;
  if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;

  const { error } = await rdb.from('pricing_rule_conditions').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteCondition(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  const { error } = await rdb.from('pricing_rule_conditions').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

async function deleteConditionsByGroup(event) {
  const { groupId } = event;
  if (!groupId) return { success: false, message: 'groupId不能为空' };

  const { error } = await rdb.from('pricing_rule_conditions').delete().eq('group_id', groupId);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '批量删除成功' };
}

// ============================================
// ===== 规则动作 CRUD =====
// ============================================

async function getActions(event) {
  const { groupId } = event;
  if (!groupId) return { success: false, message: 'groupId不能为空' };

  const actions = await getGroupActions(groupId);
  return { success: true, data: actions };
}

async function addAction(event) {
  const { data } = event;
  if (!data || !data.groupId) return { success: false, message: '参数不完整' };

  const { error } = await rdb.from('pricing_rule_actions').insert({
    group_id: data.groupId,
    action_type: data.actionType,
    action_params: JSON.stringify(data.actionParams),
    calc_order: data.calcOrder || 0,
    created_at: now()
  });

  if (error) return { success: false, message: error.message };
  return { success: true, message: '添加成功' };
}

async function updateAction(event) {
  const { id, data } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  var updateData = {};
  if (data.actionType !== undefined) updateData.action_type = data.actionType;
  if (data.actionParams !== undefined) updateData.action_params = JSON.stringify(data.actionParams);
  if (data.calcOrder !== undefined) updateData.calc_order = data.calcOrder;

  const { error } = await rdb.from('pricing_rule_actions').update(updateData).eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '更新成功' };
}

async function deleteAction(event) {
  const { id } = event;
  if (!id) return { success: false, message: 'ID不能为空' };

  const { error } = await rdb.from('pricing_rule_actions').delete().eq('id', id);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '删除成功' };
}

async function deleteActionsByGroup(event) {
  const { groupId } = event;
  if (!groupId) return { success: false, message: 'groupId不能为空' };

  const { error } = await rdb.from('pricing_rule_actions').delete().eq('group_id', groupId);
  if (error) return { success: false, message: error.message };
  return { success: true, message: '批量删除成功' };
}