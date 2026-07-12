const cloudbase = require('@cloudbase/node-sdk');
const XLSX = require('xlsx');

const ENV_ID = 'cloud1-d2g6k45v21dd52696';
const app = cloudbase.init({ env: ENV_ID });
const rdb = app.rdb();

exports.main = async (event, context) => {
  const { action } = event;
  try {
    switch (action) {
      case 'parseFile':     return await parseFile(event);
      case 'confirmImport': return await confirmImport(event);
      default: return { success: false, message: '未知操作: ' + action };
    }
  } catch (error) {
    console.error('Import函数错误:', error);
    return { success: false, message: error.message || '服务器错误' };
  }
};

const SERIES_HEADERS = ['系列名称', '系列图片'];
const MODEL_HEADERS = ['所属系列', '型号名称', '类型编码'];

const PRICE_HEADERS = [
  '阀门型号', '规格DN', '手动价格', '气动价格',
  '电装价格', '伞齿轮价格', '磨标费', '起订量', '状态', '备注'
];

const MATERIAL_HEADERS = [
  '阀门型号', '阀体材质', '闸板材质', '阀杆材质', '支架材质', '备注'
];

const COEFF_HEADERS = [
  '产品系列', '产品名',
  '规格DN起', '规格DN止', '起订量(MOQ)',
  '达到MOQ且磨标系数', '达到MOQ且原装系数', '未达MOQ且磨标系数', '未达MOQ且原装系数'
];

const MATERIAL_DIFF_HEADERS = [
  '产品系列', '部位名称', '基础材质', '目标材质', '规格DN起', '规格DN止', '价差', '备注'
];

const MATERIAL_LIB_HEADERS = [
  '材质代码', '材质名称', '材质分类', '适用部位', '备注'
];

function validateSeriesHeaders(headers) {
  const required = ['系列名称'];
  const missing = required.filter(function(h) { return !headers.includes(h); });
  return { valid: missing.length === 0, missing: missing };
}

function validateModelHeaders(headers) {
  const required = ['所属系列', '型号名称'];
  const missing = required.filter(function(h) { return !headers.includes(h); });
  return { valid: missing.length === 0, missing: missing };
}

function validateCoeffHeaders(headers) {
  const required = ['产品系列', '规格DN起', '规格DN止', '起订量(MOQ)'];
  const missing = required.filter(function(h) { return !headers.includes(h); });
  return { valid: missing.length === 0, missing: missing };
}

function validateMaterialDiffHeaders(headers) {
  const required = ['产品系列', '部位名称', '基础材质', '目标材质', '规格DN起', '规格DN止', '价差'];
  const missing = required.filter(function(h) { return !headers.includes(h); });
  return { valid: missing.length === 0, missing: missing };
}

function parseSeriesRow(row) {
  const getRaw = function(idx) {
    return (row[idx] !== undefined && row[idx] !== null) ? row[idx] : '';
  };
  const seriesName = String(getRaw(0)).trim();
  if (!seriesName) throw new Error('系列名称不能为空');
  return {
    name: seriesName,
    image: String(getRaw(1)).trim() || ''
  };
}

function parseModelRow(row) {
  const getRaw = function(idx) {
    return (row[idx] !== undefined && row[idx] !== null) ? row[idx] : '';
  };
  const seriesName = String(getRaw(0)).trim();
  if (!seriesName) throw new Error('所属系列不能为空');
  const modelName = String(getRaw(1)).trim();
  if (!modelName) throw new Error('型号名称不能为空');
  return {
    seriesName: seriesName,
    name: modelName,
    typeCode: String(getRaw(2)).trim() || ''
  };
}

function parseCoeffRow(row, rowIdx) {
  var getRaw = function(idx) {
    return (row[idx] !== undefined && row[idx] !== null) ? row[idx] : '';
  };
  function numOrNull(idx) {
    var raw = getRaw(idx);
    return isEmpty(raw) ? null : (parseFloat(raw) || 0);
  }
  const seriesName = String(getRaw(0)).trim();
  if (!seriesName) throw new Error('产品系列不能为空');
  const productName = String(getRaw(1)).trim();
  const dnMinRaw = getRaw(2);
  if (isEmpty(dnMinRaw)) throw new Error('规格DN起不能为空');
  const dnMin = parseInt(dnMinRaw);
  if (isNaN(dnMin) || dnMin < 0) throw new Error('规格DN起必须为非负整数');
  const dnMaxRaw = getRaw(3);
  if (isEmpty(dnMaxRaw)) throw new Error('规格DN止不能为空');
  const dnMax = parseInt(dnMaxRaw);
  if (isNaN(dnMax) || dnMax < dnMin) throw new Error('规格DN止必须≥规格DN起');
  const moqRaw = getRaw(4);
  const moq = isEmpty(moqRaw) ? null : parseInt(moqRaw);
  if (moq !== null && (isNaN(moq) || moq < 1)) throw new Error('起订量必须>0');
  return {
    seriesName: seriesName,
    productName: productName,
    dnMin: dnMin,
    dnMax: dnMax,
    minOrderQty: moq,
    moqMetOemCoeff: numOrNull(5),
    moqMetOriginalCoeff: numOrNull(6),
    moqUnmetOemCoeff: numOrNull(7),
    moqUnmetOriginalCoeff: numOrNull(8),
  };
}

function parseMaterialLibRow(row) {
  const getRaw = function(idx) {
    return (row[idx] !== undefined && row[idx] !== null) ? row[idx] : '';
  };

  const materialCode = String(getRaw(0)).trim();
  if (!materialCode) throw new Error('材质代码不能为空');

  const materialName = String(getRaw(1)).trim();
  if (!materialName) throw new Error('材质名称不能为空');

  const category = String(getRaw(2)).trim();
  if (!category) throw new Error('材质分类不能为空');

  const applicableParts = String(getRaw(3)).trim();
  if (!applicableParts) throw new Error('适用部位不能为空');

  return {
    materialCode: materialCode,
    materialName: materialName,
    category: category,
    applicableParts: applicableParts,
    remark: String(getRaw(4)).trim() || ''
  };
}

function parseMaterialDiffRow(row) {
  const getRaw = function(idx) {
    return (row[idx] !== undefined && row[idx] !== null) ? row[idx] : '';
  };

  const seriesName = String(getRaw(0)).trim();
  if (!seriesName) throw new Error('产品系列不能为空');

  const partName = String(getRaw(1)).trim();
  if (!partName) throw new Error('部位名称不能为空');

  const baseMaterial = String(getRaw(2)).trim();
  if (!baseMaterial) throw new Error('基础材质不能为空');

  const targetMaterial = String(getRaw(3)).trim();
  if (!targetMaterial) throw new Error('目标材质不能为空');

  const dnMinRaw = getRaw(4);
  if (isEmpty(dnMinRaw)) throw new Error('规格DN起不能为空');
  const dnMin = parseInt(dnMinRaw);
  if (isNaN(dnMin) || dnMin < 0) throw new Error('规格DN起必须为非负整数');

  const dnMaxRaw = getRaw(5);
  if (isEmpty(dnMaxRaw)) throw new Error('规格DN止不能为空');
  const dnMax = parseInt(dnMaxRaw);
  if (isNaN(dnMax) || dnMax < dnMin) throw new Error('规格DN止必须≥规格DN起');

  const priceDiff = parseFloat(getRaw(6));
  if (isNaN(priceDiff)) throw new Error('价差必须为数字');

  const PART_MAP = {
    '阀体': 'body',
    '阀杆': 'stem',
    '闸板': 'gate_plate',
    '支架': 'yoke'
  };

  return {
    seriesName: seriesName,
    partName: PART_MAP[partName] || partName,
    rawPartName: partName,
    baseMaterial: baseMaterial,
    targetMaterial: targetMaterial,
    dnMin: dnMin,
    dnMax: dnMax,
    priceDiff: priceDiff,
    remark: String(getRaw(7)).trim() || ''
  };
}

function validatePriceHeaders(headers) {
  const missing = PRICE_HEADERS.filter(h => !headers.includes(h));
  return { valid: missing.length === 0, missing };
}

function validateMaterialHeaders(headers) {
  const missing = MATERIAL_HEADERS.filter(h => !headers.includes(h));
  return { valid: missing.length === 0, missing };
}

function isEmpty(val) {
  return val === undefined || val === null || val === '';
}

function parsePriceRow(row) {
  const getRaw = function(idx) {
    return (row[idx] !== undefined && row[idx] !== null) ? row[idx] : '';
  };
  const valveName = String(getRaw(0)).trim();
  if (!valveName) throw new Error('阀门型号不能为空');
  const size = parseInt(getRaw(1));
  if (isNaN(size) || size < 40 || size > 2000) throw new Error('DN=' + getRaw(1) + ' 规格DN必须为40-2000之间的整数');
  const minQtyRaw = getRaw(7);
  const minQty = isEmpty(minQtyRaw) ? null : parseInt(minQtyRaw);
  if (minQty !== null && (isNaN(minQty) || minQty < 1)) throw new Error('DN=' + getRaw(1) + ' 起订量必须为大于0的整数');

  function numOrNull(idx) {
    var raw = getRaw(idx);
    return isEmpty(raw) ? null : (parseFloat(raw) || 0);
  }
  function strOrNull(idx) {
    var raw = getRaw(idx);
    return isEmpty(raw) ? null : String(raw).trim();
  }

  var statusRaw = getRaw(8);
  var statusVal = isEmpty(statusRaw) ? null : (String(statusRaw) === '启用' ? 'enabled' : 'disabled');

  return {
    valveName: valveName,
    size: size,
    manualPrice: numOrNull(2),
    pneumaticPrice: numOrNull(3),
    electricPrice: numOrNull(4),
    gearPrice: numOrNull(5),
    brandingFee: numOrNull(6),
    minOrderQty: minQty,
    status: statusVal,
    remark: strOrNull(9)
  };
}

function parseMaterialRow(row) {
  const getRaw = function(idx) {
    return (row[idx] !== undefined && row[idx] !== null) ? row[idx] : '';
  };

  const valveName = String(getRaw(0)).trim();
  if (!valveName) throw new Error('阀门型号不能为空');

  const bodyMaterial = String(getRaw(1)).trim();
  if (!bodyMaterial) throw new Error('阀体材质不能为空');

  const gatePlateMaterial = String(getRaw(2)).trim();
  if (!gatePlateMaterial) throw new Error('闸板材质不能为空');

  const stemMaterial = String(getRaw(3)).trim();
  if (!stemMaterial) throw new Error('阀杆材质不能为空');

  const yokeMaterial = String(getRaw(4)).trim();
  if (!yokeMaterial) throw new Error('支架材质不能为空');

  return {
    valveName: valveName,
    bodyMaterial: bodyMaterial,
    gatePlateMaterial: gatePlateMaterial,
    stemMaterial: stemMaterial,
    yokeMaterial: yokeMaterial,
    remark: strOrNull(5)
  };

  function strOrNull(idx) {
    var raw = getRaw(idx);
    return isEmpty(raw) ? null : String(raw).trim();
  }
}

function detectSheetType(headers) {
  const seriesValidation = validateSeriesHeaders(headers);
  if (seriesValidation.valid) return { type: 'series', validation: seriesValidation };

  const modelValidation = validateModelHeaders(headers);
  if (modelValidation.valid) return { type: 'model', validation: modelValidation };

  const priceValidation = validatePriceHeaders(headers);
  if (priceValidation.valid) return { type: 'price', validation: priceValidation };

  const materialLibValidation = validateMaterialLibHeaders(headers);
  if (materialLibValidation.valid) return { type: 'material_lib', validation: materialLibValidation };

  const materialValidation = validateMaterialHeaders(headers);
  if (materialValidation.valid) return { type: 'material', validation: materialValidation };

  const coeffValidation = validateCoeffHeaders(headers);
  if (coeffValidation.valid) return { type: 'coefficient', validation: coeffValidation };

  const materialDiffValidation = validateMaterialDiffHeaders(headers);
  if (materialDiffValidation.valid) return { type: 'material_diff', validation: materialDiffValidation };

  return { type: null, validation: null };
}

function validateMaterialLibHeaders(headers) {
  const required = ['材质代码', '材质名称', '材质分类', '适用部位'];
  const missing = required.filter(function(h) { return !headers.includes(h); });
  return { valid: missing.length === 0, missing: missing };
}

function findMatchingSheet(wb, sheetNames) {
  for (const name of sheetNames) {
    const sheet = wb.Sheets[name];
    if (!sheet) continue;
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (!data || data.length < 2 || !Array.isArray(data[0])) continue;
    const result = detectSheetType(data[0]);
    if (result.type) return { name: name, type: result.type };
  }
  return null;
}

async function parseFile(event) {
  const { fileID, sheetName, importType } = event;
  if (!fileID) return { success: false, message: '请提供文件ID' };

  try {
    console.log('[parseFile] 开始下载文件: ' + fileID);
    const res = await app.downloadFile({ fileID });
    const buffer = res.fileContent;
    console.log('[parseFile] 文件下载成功, 大小: ' + (buffer ? buffer.length : 0) + ' bytes');

    const wb = XLSX.read(buffer, { type: 'buffer' });
    const allSheetNames = wb.SheetNames;
    console.log('[parseFile] Excel工作表: ' + JSON.stringify(allSheetNames));

    if (!allSheetNames || allSheetNames.length === 0) {
      return { success: false, message: 'Excel文件中没有工作表' };
    }

    let selectedSheetName = sheetName;
    let detectedType = importType || null;

    if (!selectedSheetName) {
      if (allSheetNames.length === 1) {
        selectedSheetName = allSheetNames[0];
      } else {
        const matched = findMatchingSheet(wb, allSheetNames);
        if (matched) {
          selectedSheetName = matched.name;
          if (!detectedType) detectedType = matched.type;
        } else {
          return {
            success: false,
            message: '未指定工作表且无法自动识别，请选择工作表。可用工作表: ' + allSheetNames.join(', ')
          };
        }
      }
    } else {
      if (!wb.Sheets[selectedSheetName]) {
        return {
          success: false,
          message: '工作表 "' + selectedSheetName + '" 不存在。可用工作表: ' + allSheetNames.join(', ')
        };
      }
    }

    const parsedData = {
      series: { rows: [], failed: [], count: 0 },
      models: { rows: [], failed: [], count: 0 },
      prices: { rows: [], failed: [], count: 0 },
      materials: { rows: [], failed: [], count: 0 },
      materialLib: { rows: [], failed: [], count: 0 },
      materialDiffs: { rows: [], failed: [], count: 0 },
      coefficientRules: []
    };

    for (const sheetName of allSheetNames) {
      if (sheetName === '导入说明') continue;
      
      const sheet = wb.Sheets[sheetName];
      if (!sheet) continue;
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      if (!data || data.length < 2 || !Array.isArray(data[0])) continue;

      const detectedType = detectSheetType(data[0]);
      if (!detectedType.type) continue;

      console.log('[parseFile] 解析工作表: ' + sheetName + ', 类型: ' + detectedType.type + ', 行数: ' + data.length);
      console.log('[parseFile] 表头: ' + JSON.stringify(data[0]));

      for (let i = 1; i < data.length; i++) {
        if (!data[i] || data[i].length === 0 || !data[i][0]) continue;
        try {
          let row;
          switch (detectedType.type) {
            case 'series':
              row = parseSeriesRow(data[i]);
              parsedData.series.rows.push(row);
              parsedData.series.count++;
              break;
            case 'model':
              row = parseModelRow(data[i]);
              parsedData.models.rows.push(row);
              parsedData.models.count++;
              break;
            case 'price':
              row = parsePriceRow(data[i]);
              parsedData.prices.rows.push(row);
              parsedData.prices.count++;
              break;
            case 'material_lib':
              row = parseMaterialLibRow(data[i]);
              parsedData.materialLib.rows.push(row);
              parsedData.materialLib.count++;
              break;
            case 'material':
              row = parseMaterialRow(data[i]);
              parsedData.materials.rows.push(row);
              parsedData.materials.count++;
              break;
            case 'coefficient':
              row = parseCoeffRow(data[i], i + 1);
              parsedData.coefficientRules.push(row);
              break;
            case 'material_diff':
              row = parseMaterialDiffRow(data[i]);
              parsedData.materialDiffs.rows.push(row);
              parsedData.materialDiffs.count++;
              break;
          }
        } catch (e) {
          const typeKey = detectedType.type === 'coefficient' ? 'coefficient' : detectedType.type + 's';
          if (parsedData[typeKey] && parsedData[typeKey].failed) {
            parsedData[typeKey].failed.push({ sheetName, rowIndex: i + 1, error: e.message || String(e) });
          }
        }
      }
    }

    console.log('[parseFile] 解析完成: 系列=' + parsedData.series.count + ', 型号=' + parsedData.models.count + 
      ', 价格=' + parsedData.prices.count + ', 材质=' + parsedData.materials.count + 
      ', 材质价差=' + parsedData.materialDiffs.count + ', 系数=' + parsedData.coefficientRules.length);

    const totalCount = parsedData.series.count + parsedData.models.count + parsedData.prices.count + parsedData.materials.count + parsedData.materialDiffs.count + parsedData.coefficientRules.length;
    const totalFailed = parsedData.series.failed.length + parsedData.models.failed.length + parsedData.prices.failed.length + parsedData.materials.failed.length + parsedData.materialDiffs.failed.length;

    return {
      success: true,
      message: '文件解析成功',
      data: {
        rowsCount: totalCount,
        successCount: totalCount,
        failedRows: [
          ...parsedData.series.failed,
          ...parsedData.models.failed,
          ...parsedData.prices.failed,
          ...parsedData.materials.failed,
          ...parsedData.materialDiffs.failed
        ],
        previewData: {
          series: parsedData.series.rows.slice(0, 10),
          models: parsedData.models.rows.slice(0, 10),
          prices: parsedData.prices.rows.slice(0, 10),
          materials: parsedData.materials.rows.slice(0, 10),
          materialDiffs: parsedData.materialDiffs.rows.slice(0, 10)
        },
        coefficientRules: parsedData.coefficientRules,
        sheetNames: allSheetNames,
        importType: 'integrated'
      }
    };
  } catch (e) {
    console.error('[parseFile] 异常:', e);
    return { success: false, message: '文件解析失败: ' + (e.message || String(e)) };
  }
}

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

async function preloadAllData() {
  console.log('[preload] 开始预加载现有数据...');
  const [seriesRes, modelsRes, pricesAll] = await Promise.all([
    rdb.from('product_series').select('id, name'),
    rdb.from('valve_models').select('id, name, series_id, type_code'),
    selectAll('price_table', 'id, model_id, size')
  ]);

  console.log('[preload] seriesRes error: ' + JSON.stringify(seriesRes.error || 'none'));
  console.log('[preload] modelsRes error: ' + JSON.stringify(modelsRes.error || 'none'));

  const seriesMap = new Map();
  for (const s of (seriesRes.data || [])) seriesMap.set(s.name, s.id);
  console.log('[preload] 系列数量: ' + seriesMap.size);

  const modelMap = new Map();
  for (const m of (modelsRes.data || [])) modelMap.set(m.name, { id: m.id, series_id: m.series_id, type_code: m.type_code || '' });
  console.log('[preload] 型号数量: ' + modelMap.size);

  const priceMap = new Map();
  for (const p of (pricesAll || [])) priceMap.set(p.model_id + '||' + p.size, p.id);
  console.log('[preload] 价格数量(全量): ' + priceMap.size);

  return { seriesMap, modelMap, priceMap };
}

async function preloadMaterialData() {
  console.log('[preload] 开始预加载材质数据...');
  const [seriesRes, modelsRes] = await Promise.all([
    rdb.from('product_series').select('id, name'),
    rdb.from('valve_models').select('id, name, series_id, type_code')
  ]);

  console.log('[preload] seriesRes error: ' + JSON.stringify(seriesRes.error || 'none'));
  console.log('[preload] modelsRes error: ' + JSON.stringify(modelsRes.error || 'none'));

  const seriesMap = new Map();
  for (const s of (seriesRes.data || [])) seriesMap.set(s.name, s.id);
  console.log('[preload] 系列数量: ' + seriesMap.size);

  const modelMap = new Map();
  for (const m of (modelsRes.data || [])) modelMap.set(m.name, { id: m.id, series_id: m.series_id, type_code: m.type_code || '' });
  console.log('[preload] 型号数量: ' + modelMap.size);

  return { seriesMap, modelMap };
}

async function confirmImport(event) {
  const { data, importType } = event;
  
  if (importType === 'integrated') {
    return await confirmIntegratedImport(event);
  }
  
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { success: false, message: '没有可导入的数据' };
  }

  if (importType === 'material') {
    return await confirmMaterialImport(event);
  }

  if (importType === 'material_lib') {
    return await confirmMaterialLibImport(event);
  }

  return await confirmPriceImport(event);
}

async function confirmPriceImport(event) {
  const { data } = event;
  console.log('[import] ====== 开始导入价格数据, 共 ' + data.length + ' 条 ======');

  const uniqueModels = [...new Set(data.map(d => d.valveName))];
  console.log('[import] 不重复型号: ' + uniqueModels.length);
  console.log('[import] 型号列表(前10): ' + JSON.stringify(uniqueModels.slice(0, 10)));

  const { seriesMap, modelMap, priceMap } = await preloadAllData();

  console.log('[阶段1] 创建新型号...');
  let modelsCreated = 0;
  let modelsFound = 0;
  const failReasons = [];

  for (const item of data) {
    const model = modelMap.get(item.valveName);
    if (model) {
      modelsFound++;
      continue;
    }

    failReasons.push({ reason: '型号未找到', valve: item.valveName });
  }
  console.log('[阶段1] 已有型号: ' + modelsFound + ', 未找到: ' + failReasons.length);
  if (failReasons.length > 0) {
    console.error('[阶段1] 失败详情(前20): ' + JSON.stringify(failReasons.slice(0, 20)));
  }

  console.log('[阶段2] 开始导入价格...');
  let ok = 0, fail = 0;
  let failMid = 0, failInsert = 0, failUpdate = 0;
  const failDetail = [];

  for (const item of data) {
    const model = modelMap.get(item.valveName);
    if (!model) { fail++; failMid++; continue; }

    const priceKey = model.id + '||' + item.size;
    const existId = priceMap.get(priceKey);
    var priceData = { model_id: model.id, size: item.size };
    function setIfNotNull(target, key, val) {
      if (val !== null && val !== undefined) target[key] = val;
    }
    setIfNotNull(priceData, 'manual_price', item.manualPrice);
    setIfNotNull(priceData, 'pneumatic_price', item.pneumaticPrice);
    setIfNotNull(priceData, 'electric_price', item.electricPrice);
    setIfNotNull(priceData, 'gear_price', item.gearPrice);
    setIfNotNull(priceData, 'branding_fee', item.brandingFee);
    setIfNotNull(priceData, 'min_order_qty', item.minOrderQty);
    setIfNotNull(priceData, 'status', item.status);
    setIfNotNull(priceData, 'remark', item.remark);

    if (existId) {
      console.log('[阶段2] UPDATE: valve=' + item.valveName + ' size=' + item.size +
        ' modelId=' + model.id + ' existId=' + existId);
      const { data: updated, error: e } = await rdb.from('price_table')
        .update(priceData)
        .eq('model_id', model.id)
        .eq('size', item.size)
        .select('id, manual_price, electric_price');
      if (e) {
        fail++; failUpdate++;
        failDetail.push({ type: 'update', valve: item.valveName, size: item.size, error: String(e.message || JSON.stringify(e)).substring(0, 200) });
        console.error('[阶段2] UPDATE失败: ' + JSON.stringify(e));
      } else {
        ok++;
        console.log('[阶段2] UPDATE结果: ' + JSON.stringify(updated));
      }
    } else {
      console.log('[阶段2] INSERT: valve=' + item.valveName + ' size=' + item.size +
        ' modelId=' + model.id + ' priceKey=' + priceKey);
      const { data: inserted, error: e } = await rdb.from('price_table')
        .insert({ _openid: 'import', ...priceData })
        .select('id');
      if (e) {
        fail++; failInsert++;
        failDetail.push({ type: 'insert', valve: item.valveName, size: item.size, error: String(e.message || JSON.stringify(e)).substring(0, 200) });
        console.error('[阶段2] INSERT失败: ' + JSON.stringify(e));
      } else {
        ok++;
        console.log('[阶段2] INSERT结果: ' + JSON.stringify(inserted));
      }
    }
  }

  console.log('[阶段2] ====== 导入完成 ======');
  console.log('[阶段2] 成功: ' + ok + ', 失败: ' + fail);
  console.log('[阶段2] 失败原因统计: 型号未找到=' + failMid + ', insert失败=' + failInsert + ', update失败=' + failUpdate);
  if (failDetail.length > 0) {
    console.log('[阶段2] 失败详情(前10): ' + JSON.stringify(failDetail.slice(0, 10)));
  }

  const coeffRules = event.coefficientRules;
  if (coeffRules && Array.isArray(coeffRules) && coeffRules.length > 0) {
    console.log('[阶段3] 导入报价系数规则, 共 ' + coeffRules.length + ' 条');
    let coeffOk = 0, coeffFail = 0;

    for (const rule of coeffRules) {
      const { data: existRows, error: findErr } = await rdb.from('pricing_rules')
        .select('id')
        .eq('series_name', rule.seriesName)
        .eq('dn_min', rule.dnMin)
        .eq('dn_max', rule.dnMax);
      if (findErr) {
        console.error('[阶段3] 查询已有规则失败: ' + JSON.stringify(findErr));
      }

      if (existRows && existRows.length > 0) {
        var updData = {};
        updData.product_name = rule.productName;
        function setIfNotNullU(key, val) {
          if (val !== null && val !== undefined) updData[key] = val;
        }
        setIfNotNullU('min_order_qty', rule.minOrderQty);
        setIfNotNullU('moq_met_oem_coeff', rule.moqMetOemCoeff);
        setIfNotNullU('moq_met_original_coeff', rule.moqMetOriginalCoeff);
        setIfNotNullU('moq_unmet_oem_coeff', rule.moqUnmetOemCoeff);
        setIfNotNullU('moq_unmet_original_coeff', rule.moqUnmetOriginalCoeff);

        var existId = existRows[0].id;
        const { error: updErr } = await rdb.from('pricing_rules')
          .update(updData)
          .eq('id', existId);
        if (updErr) {
          coeffFail++;
          console.error('[阶段3] UPDATE规则失败: ' + JSON.stringify(updErr));
        } else {
          coeffOk++;
          console.log('[阶段3] UPDATE规则 id=' + existId + ' series=' + rule.seriesName + ' dn=' + rule.dnMin + '-' + rule.dnMax);
        }
      } else {
        const { error: insErr } = await rdb.from('pricing_rules').insert({
          _openid: 'import',
          series_name: rule.seriesName,
          product_name: rule.productName,
          dn_min: rule.dnMin,
          dn_max: rule.dnMax,
          min_order_qty: rule.minOrderQty || 1,
          moq_met_oem_coeff: rule.moqMetOemCoeff !== null ? rule.moqMetOemCoeff : 1.0,
          moq_met_original_coeff: rule.moqMetOriginalCoeff !== null ? rule.moqMetOriginalCoeff : 1.0,
          moq_unmet_oem_coeff: rule.moqUnmetOemCoeff !== null ? rule.moqUnmetOemCoeff : 1.0,
          moq_unmet_original_coeff: rule.moqUnmetOriginalCoeff !== null ? rule.moqUnmetOriginalCoeff : 1.0
        });
        if (insErr) {
          coeffFail++;
          console.error('[阶段3] INSERT规则失败: ' + JSON.stringify(insErr));
        } else {
          coeffOk++;
          console.log('[阶段3] INSERT规则 series=' + rule.seriesName + ' dn=' + rule.dnMin + '-' + rule.dnMax);
        }
      }
    }
    console.log('[阶段3] 系数规则导入完成: 成功=' + coeffOk + ' 失败=' + coeffFail);
  } else {
    console.log('[阶段3] 无系数规则数据，跳过');
  }

  return { success: true, successCount: ok, failedCount: fail };
}

async function confirmIntegratedImport(event) {
  const { data } = event;
  console.log('[import] ====== 开始整合导入 ======');

  let results = {
    series: { created: 0, updated: 0, failed: 0 },
    models: { created: 0, updated: 0, failed: 0 },
    prices: { created: 0, updated: 0, failed: 0 },
    materials: { created: 0, updated: 0, failed: 0 },
    materialDiffs: { created: 0, updated: 0, failed: 0 },
    coefficients: { created: 0, updated: 0, failed: 0 }
  };

  console.log('[阶段1] 导入产品系列...');
  const { seriesMap } = await preloadSeriesData();
  if (data.series && Array.isArray(data.series)) {
    for (const item of data.series) {
      const exist = seriesMap.get(item.name);
      if (exist) {
        if (item.image !== undefined && item.image !== exist.image) {
          await rdb.from('product_series').update({ image: item.image }).eq('id', exist);
        }
        results.series.updated++;
      } else {
        const { data: inserted, error: e } = await rdb.from('product_series')
          .insert({ _openid: 'import', name: item.name, image: item.image || '' })
          .select('id');
        if (e) {
          results.series.failed++;
        } else if (inserted?.[0]?.id) {
          seriesMap.set(item.name, inserted[0].id);
          results.series.created++;
        }
      }
    }
  }
  console.log('[阶段1] 系列导入完成: 创建=' + results.series.created + ', 更新=' + results.series.updated + ', 失败=' + results.series.failed);

  console.log('[阶段2] 导入阀门型号...');
  const { modelMap } = await preloadModelData(seriesMap);
  if (data.models && Array.isArray(data.models)) {
    for (const item of data.models) {
      const sid = seriesMap.get(item.seriesName);
      if (!sid) { results.models.failed++; continue; }
      const exist = modelMap.get(item.name);
      if (exist) {
        if (item.typeCode !== undefined && item.typeCode !== exist.type_code) {
          await rdb.from('valve_models').update({ type_code: item.typeCode }).eq('id', exist.id);
        }
        if (exist.series_id !== sid) {
          await rdb.from('valve_models').update({ series_id: sid }).eq('id', exist.id);
        }
        results.models.updated++;
      } else {
        const { data: inserted, error: e } = await rdb.from('valve_models')
          .insert({ _openid: 'import', series_id: sid, name: item.name, type_code: item.typeCode || '' })
          .select('id');
        if (e) {
          results.models.failed++;
        } else if (inserted?.[0]?.id) {
          modelMap.set(item.name, { id: inserted[0].id, series_id: sid, type_code: item.typeCode || '' });
          results.models.created++;
        }
      }
    }
  }
  console.log('[阶段2] 型号导入完成: 创建=' + results.models.created + ', 更新=' + results.models.updated + ', 失败=' + results.models.failed);

  console.log('[阶段3] 导入价格数据...');
  if (data.prices && Array.isArray(data.prices)) {
    const allPrices = await selectAll('price_table', 'id, model_id, size');
    const priceMap = new Map();
    for (const p of (allPrices || [])) priceMap.set(p.model_id + '||' + p.size, p.id);

    for (const item of data.prices) {
      const model = modelMap.get(item.valveName);
      if (!model) { results.prices.failed++; continue; }

      const priceKey = model.id + '||' + item.size;
      const existId = priceMap.get(priceKey);
      var priceData = { model_id: model.id, size: item.size };
      function setIfNotNull(target, key, val) {
        if (val !== null && val !== undefined) target[key] = val;
      }
      setIfNotNull(priceData, 'manual_price', item.manualPrice);
      setIfNotNull(priceData, 'pneumatic_price', item.pneumaticPrice);
      setIfNotNull(priceData, 'electric_price', item.electricPrice);
      setIfNotNull(priceData, 'gear_price', item.gearPrice);
      setIfNotNull(priceData, 'branding_fee', item.brandingFee);
      setIfNotNull(priceData, 'min_order_qty', item.minOrderQty);
      setIfNotNull(priceData, 'status', item.status);
      setIfNotNull(priceData, 'remark', item.remark);

      if (existId) {
        const { error: e } = await rdb.from('price_table').update(priceData).eq('id', existId);
        if (e) {
          results.prices.failed++;
        } else {
          results.prices.updated++;
        }
      } else {
        const { error: e } = await rdb.from('price_table').insert({ _openid: 'import', ...priceData });
        if (e) {
          results.prices.failed++;
        } else {
          results.prices.created++;
        }
      }
    }
  }
  console.log('[阶段3] 价格导入完成: 创建=' + results.prices.created + ', 更新=' + results.prices.updated + ', 失败=' + results.prices.failed);

  console.log('[阶段4] 导入材质数据...');
  if (data.materials && Array.isArray(data.materials)) {
    const allMaterials = await selectAll('valve_model_materials', 'id, model_id');
    const materialMap = new Map();
    for (const m of (allMaterials || [])) materialMap.set(m.model_id, m.id);

    for (const item of data.materials) {
      const model = modelMap.get(item.valveName);
      if (!model) { results.materials.failed++; continue; }

      const existId = materialMap.get(model.id);
      var matData = {
        model_id: model.id,
        body_material: item.bodyMaterial,
        gate_plate_material: item.gatePlateMaterial,
        stem_material: item.stemMaterial,
        yoke_material: item.yokeMaterial
      };
      if (item.remark) matData.remark = item.remark;

      if (existId) {
        const { error: e } = await rdb.from('valve_model_materials').update(matData).eq('id', existId);
        if (e) {
          results.materials.failed++;
        } else {
          results.materials.updated++;
        }
      } else {
        const { error: e } = await rdb.from('valve_model_materials').insert({ _openid: 'import', ...matData });
        if (e) {
          results.materials.failed++;
        } else {
          results.materials.created++;
        }
      }
    }
  }
  console.log('[阶段4] 材质导入完成: 创建=' + results.materials.created + ', 更新=' + results.materials.updated + ', 失败=' + results.materials.failed);

  console.log('[阶段5] 导入报价系数规则...');
  const coeffRules = event.coefficientRules;
  if (coeffRules && Array.isArray(coeffRules) && coeffRules.length > 0) {
    for (const rule of coeffRules) {
      const { data: existRows } = await rdb.from('pricing_rules')
        .select('id')
        .eq('series_name', rule.seriesName)
        .eq('dn_min', rule.dnMin)
        .eq('dn_max', rule.dnMax);

      if (existRows && existRows.length > 0) {
        var updData = { product_name: rule.productName };
        function setIfNotNullU(key, val) {
          if (val !== null && val !== undefined) updData[key] = val;
        }
        setIfNotNullU('min_order_qty', rule.minOrderQty);
        setIfNotNullU('moq_met_oem_coeff', rule.moqMetOemCoeff);
        setIfNotNullU('moq_met_original_coeff', rule.moqMetOriginalCoeff);
        setIfNotNullU('moq_unmet_oem_coeff', rule.moqUnmetOemCoeff);
        setIfNotNullU('moq_unmet_original_coeff', rule.moqUnmetOriginalCoeff);

        const { error: updErr } = await rdb.from('pricing_rules').update(updData).eq('id', existRows[0].id);
        if (updErr) {
          results.coefficients.failed++;
        } else {
          results.coefficients.updated++;
        }
      } else {
        const { error: insErr } = await rdb.from('pricing_rules').insert({
          _openid: 'import',
          series_name: rule.seriesName,
          product_name: rule.productName,
          dn_min: rule.dnMin,
          dn_max: rule.dnMax,
          min_order_qty: rule.minOrderQty || 1,
          moq_met_oem_coeff: rule.moqMetOemCoeff !== null ? rule.moqMetOemCoeff : 1.0,
          moq_met_original_coeff: rule.moqMetOriginalCoeff !== null ? rule.moqMetOriginalCoeff : 1.0,
          moq_unmet_oem_coeff: rule.moqUnmetOemCoeff !== null ? rule.moqUnmetOemCoeff : 1.0,
          moq_unmet_original_coeff: rule.moqUnmetOriginalCoeff !== null ? rule.moqUnmetOriginalCoeff : 1.0
        });
        if (insErr) {
          results.coefficients.failed++;
        } else {
          results.coefficients.created++;
        }
      }
    }
  }
  console.log('[阶段5] 系数规则导入完成: 创建=' + results.coefficients.created + ', 更新=' + results.coefficients.updated + ', 失败=' + results.coefficients.failed);

  console.log('[阶段6] 导入材质价差数据...');
  const materialDiffs = data.materialDiffs && data.materialDiffs.rows ? data.materialDiffs.rows : [];
  if (materialDiffs.length > 0) {
    const allDiffs = await selectAll('material_price_diffs', 'id, series_name, part_name, base_material, target_material, dn_min, dn_max');
    const diffMap = new Map();
    for (const d of (allDiffs || [])) {
      const key = d.series_name + '||' + d.part_name + '||' + d.base_material + '||' + d.target_material + '||' + d.dn_min + '||' + d.dn_max;
      diffMap.set(key, d.id);
    }

    for (const item of materialDiffs) {
      const key = item.seriesName + '||' + item.partName + '||' + item.baseMaterial + '||' + item.targetMaterial + '||' + item.dnMin + '||' + item.dnMax;
      const existId = diffMap.get(key);

      var diffData = {
        series_name: item.seriesName,
        part_name: item.partName,
        base_material: item.baseMaterial,
        target_material: item.targetMaterial,
        dn_min: item.dnMin,
        dn_max: item.dnMax,
        price_diff: item.priceDiff
      };
      if (item.remark) diffData.remark = item.remark;

      if (existId) {
        const { error: e } = await rdb.from('material_price_diffs').update(diffData).eq('id', existId);
        if (e) {
          results.materialDiffs.failed++;
        } else {
          results.materialDiffs.updated++;
        }
      } else {
        const { error: e } = await rdb.from('material_price_diffs').insert({ _openid: 'import', ...diffData });
        if (e) {
          results.materialDiffs.failed++;
        } else {
          results.materialDiffs.created++;
        }
      }
    }
  }
  console.log('[阶段6] 材质价差导入完成: 创建=' + results.materialDiffs.created + ', 更新=' + results.materialDiffs.updated + ', 失败=' + results.materialDiffs.failed);

  console.log('[import] ====== 整合导入完成 ======');
  return {
    success: true,
    message: '整合导入完成',
    data: results
  };
}

async function preloadSeriesData() {
  const { data: seriesRes } = await rdb.from('product_series').select('id, name, image');
  const seriesMap = new Map();
  for (const s of (seriesRes || [])) seriesMap.set(s.name, s.id);
  return { seriesMap };
}

async function preloadModelData(seriesMap) {
  const { data: modelsRes } = await rdb.from('valve_models').select('id, name, series_id, type_code');
  const modelMap = new Map();
  for (const m of (modelsRes || [])) modelMap.set(m.name, { id: m.id, series_id: m.series_id, type_code: m.type_code || '' });
  return { modelMap };
}

async function confirmMaterialImport(event) {
  const { data } = event;
  console.log('[import] ====== 开始导入材质数据, 共 ' + data.length + ' 条 ======');

  const uniqueModels = [...new Set(data.map(d => d.valveName))];
  console.log('[import] 不重复型号: ' + uniqueModels.length);

  const { modelMap } = await preloadMaterialData();

  console.log('[阶段1] 开始导入材质...');
  let ok = 0, fail = 0;

  for (const item of data) {
    const model = modelMap.get(item.valveName);
    if (!model) { fail++; continue; }

    const { data: existRows, error: findErr } = await rdb.from('valve_model_materials')
      .select('id')
      .eq('model_id', model.id);

    if (existRows && existRows.length > 0) {
      const { error: updErr } = await rdb.from('valve_model_materials')
        .update({
          body_material: item.bodyMaterial,
          gate_plate_material: item.gatePlateMaterial,
          stem_material: item.stemMaterial,
          yoke_material: item.yokeMaterial,
          remark: item.remark
        })
        .eq('id', existRows[0].id);
      if (updErr) {
        fail++;
        console.error('[阶段1] UPDATE材质失败: ' + JSON.stringify(updErr));
      } else {
        ok++;
        console.log('[阶段1] UPDATE材质: ' + item.valveName);
      }
    } else {
      const { error: insErr } = await rdb.from('valve_model_materials').insert({
        _openid: 'import',
        model_id: model.id,
        body_material: item.bodyMaterial,
        gate_plate_material: item.gatePlateMaterial,
        stem_material: item.stemMaterial,
        yoke_material: item.yokeMaterial,
        remark: item.remark
      });
      if (insErr) {
        fail++;
        console.error('[阶段1] INSERT材质失败: ' + JSON.stringify(insErr));
      } else {
        ok++;
        console.log('[阶段1] INSERT材质: ' + item.valveName);
      }
    }
  }

  console.log('[阶段1] ====== 导入完成 ======');
  console.log('[阶段1] 成功: ' + ok + ', 失败: ' + fail);

  return { success: true, successCount: ok, failedCount: fail };
}

async function confirmMaterialLibImport(event) {
  const { data } = event;
  console.log('[import] ====== 开始导入材质库数据, 共 ' + data.length + ' 条 ======');

  const { data: existingMaterials, error: queryErr } = await rdb.from('materials').select('id, material_code');
  const materialCodeMap = new Map();
  if (existingMaterials) {
    for (const m of existingMaterials) {
      materialCodeMap.set(m.material_code, m.id);
    }
  }
  console.log('[阶段1] 已存在材质数: ' + materialCodeMap.size);

  let ok = 0, fail = 0;

  for (const item of data) {
    const existId = materialCodeMap.get(item.materialCode);
    
    const materialData = {
      material_code: item.materialCode,
      material_name: item.materialName,
      category: item.category,
      applicable_parts: item.applicableParts
    };
    if (item.remark) materialData.remark = item.remark;

    if (existId) {
      const { error: updErr } = await rdb.from('materials')
        .update(materialData)
        .eq('id', existId);
      if (updErr) {
        fail++;
        console.error('[阶段1] UPDATE材质库失败: ' + item.materialCode + ', ' + JSON.stringify(updErr));
      } else {
        ok++;
        console.log('[阶段1] UPDATE材质库: ' + item.materialCode);
      }
    } else {
      const { error: insErr } = await rdb.from('materials').insert({
        _openid: 'import',
        ...materialData
      });
      if (insErr) {
        fail++;
        console.error('[阶段1] INSERT材质库失败: ' + item.materialCode + ', ' + JSON.stringify(insErr));
      } else {
        ok++;
        console.log('[阶段1] INSERT材质库: ' + item.materialCode);
      }
    }
  }

  console.log('[阶段1] ====== 材质库导入完成 ======');
  console.log('[阶段1] 成功: ' + ok + ', 失败: ' + fail);

  return { success: true, successCount: ok, failedCount: fail };
}