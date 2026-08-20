/**
 * 购销合同 xlsx 生成器
 *  —— 设计目标：100% 保留原始模板的 XF 索引（边框/字体/填充/数字格式/对齐/合并/公章图片）
 *  —— 实现方式：JSZip 级打开模板 xlsx → 只改 xl/worksheets/sheet1.xml 的文本和数字 → 重新压缩
 *  —— 对小程序/Node 均通用（JSZip 都可工作）
 *
 * 2026-08-15 重构：多模板支持（6 套模板注册表），分两大「家族」：
 *   - cn_contract（中文购销合同家族）：原 QCAZ / 奇胜农商行 / 长胜农行
 *       · 有型号规格 + 材质/压力/密封面/商标/单位/单价/总价 多列
 *       · 有税金行（13%）、价税合计大写、备注单元格
 *   - en_pi（英文 PI / 外贸发票家族）：Changqi / Chisun IMPORT 农行多币种 / VTB 卢布
 *       · 有序号(A) / 型号(B) / 描述(C,D) / 数量(E) / 单价(H) / 总价(I)
 *       · 仅 Total 汇总；无税金、无中文大写、无备注
 */

// ================ 家族通用列映射：quoteData 字段 → 模板 A1 列 ================
// quoteData item 字段（与 quotation.vue 保持一致，从小程序实际 quoteData 中挑）：
//   productName, productType, model, bodyMaterial, gateMaterial, stemMaterial,
//   sealMaterial, trademark, unit, quantity, unitPrice, maxPressure, unitWeight,
//   woodenBoxSize, torque, laps, bevelGearCouplingModel, moq, brandingFee,
//   gatePlateThickness, productNote, spec (型号规格完整字符串), totalPrice
// ================ 产品系列 → 产品名称对照表（2026-08-15 用户提供） ================
// 型号前缀（最长优先匹配）→ 中文名称 / 英文翻译名称
// 说明：QU 与 QUP、QC 与 QCA、QW/QWL/QWF 名称相同；QWLY 与 QCG、QMC 与 QMG 为不同系列但名称唯一
const SERIES_NAME_MAP = [
  { prefix: 'QMDY', cn: '全封闭双向侧密封耐磨刀闸阀', en: 'Fully Enclosed Bi-Directional Side-Sealing Wear-Resistant Knife Gate Valve' },
  { prefix: 'QMB',  cn: '可更换式 U 型橡胶双向密封刀闸阀', en: 'Bi-Directional Knife Gate Valve with Replaceable U-Shape Rubber Seal' },
  { prefix: 'QMC',  cn: '分体式双向无凹槽中压刀闸阀', en: 'Split-Type Bi-Directional Medium Pressure Knife Gate Valve without Recess' },
  { prefix: 'QMG',  cn: '分体式双向带 U 型调节型密封刀闸阀', en: 'Split-Type Bi-Directional Knife Gate Valve with U-Shape Adjustable Seal' },
  { prefix: 'QYA',  cn: '单向暗杆板式全封闭刀闸阀', en: 'Single-Direction Non-Rising Stem Plate Fully Enclosed Knife Gate Valve' },
  { prefix: 'QVY',  cn: '单向带中填料全封闭中压刀闸阀', en: 'Single-Direction Fully Enclosed Medium Pressure Knife Gate Valve with Middle Gland' },
  { prefix: 'QUP',  cn: '整体式双向无凹槽刀闸阀', en: 'One-Piece Bi-Directional Knife Gate Valve without Recess' },
  { prefix: 'QWLY', cn: '全封闭高压双向耐磨刀闸阀', en: 'Fully Enclosed High Pressure Bi-Directional Wear-Resistant Knife Gate Valve' },
  { prefix: 'QCB',  cn: '重型双向密封穿透式刀闸阀', en: 'Heavy-Duty Bi-Directional Sealing Through-Conduit Knife Gate Valve' },
  { prefix: 'QCA',  cn: '双向密封穿透式刀闸阀', en: 'Bi-Directional Sealing Through-Conduit Knife Gate Valve' },
  { prefix: 'QCG',  cn: '全封闭高压双向耐磨刀闸阀', en: 'Fully Enclosed High Pressure Bi-Directional Wear-Resistant Knife Gate Valve' },
  { prefix: 'QWL',  cn: '双向自密封刀闸阀', en: 'Bi-Directional Self-Sealing Knife Gate Valve' },
  { prefix: 'QWF',  cn: '双向自密封刀闸阀', en: 'Bi-Directional Self-Sealing Knife Gate Valve' },
  { prefix: 'QWY',  cn: '双向密封刀闸阀', en: 'Bi-Directional Sealing Knife Gate Valve' },
  { prefix: 'QP',   cn: '可更换式PU内衬件双向密封耐磨刀闸阀', en: 'Bi-Directional Wear-Resistant Knife Gate Valve with Replaceable PU Liner' },
  { prefix: 'QJ',   cn: '分体式双向密封无凹槽内腔全衬胶刀闸阀', en: 'Split-Type Bi-Directional Fully Rubber-Lined Knife Gate Valve without Recess' },
  { prefix: 'QS',   cn: '整体式双向无凹槽耐磨刀闸阀', en: 'One-Piece Bi-Directional Wear-Resistant Knife Gate Valve without Recess' },
  { prefix: 'QW',   cn: '双向自密封刀闸阀', en: 'Bi-Directional Self-Sealing Knife Gate Valve' },
  { prefix: 'QV',   cn: '单向厚阀座可更换型刀闸阀', en: 'Single-Direction Knife Gate Valve with Replaceable Thick Seat' },
  { prefix: 'QU',   cn: '整体式双向无凹槽刀闸阀', en: 'One-Piece Bi-Directional Knife Gate Valve without Recess' },
  { prefix: 'QD',   cn: '单向排渣专用刀闸阀', en: 'Single-Direction Slag Discharge Knife Gate Valve' },
  { prefix: 'QH',   cn: '单向全封闭方闸门', en: 'Single-Direction Fully Enclosed Square Gate' },
  { prefix: 'QY',   cn: '单向无中填料全封闭中压力刀闸阀', en: 'Single-Direction Fully Enclosed Medium Pressure Knife Gate Valve without Middle Gland' },
  { prefix: 'QC',   cn: '双向密封穿透式刀闸阀', en: 'Bi-Directional Sealing Through-Conduit Knife Gate Valve' },
  { prefix: 'QB',   cn: '单向薄阀座可更换型刀闸阀', en: 'Single-Direction Knife Gate Valve with Replaceable Thin Seat' }
];
// 按前缀长度降序，保证 QWLY/QWL/QWF/QW、QCA/QCB/QC、QMDY/QMB 等长前缀优先匹配
const SERIES_NAME_SORTED = SERIES_NAME_MAP.slice().sort((a, b) => b.prefix.length - a.prefix.length);

/** 根据产品型号（productName，如 QWZ573NM-10G）前缀查找系列定义，无匹配返回 null */
function lookupSeries(it) {
  const name = String((it && (it.productName || it.valveName)) || '');
  for (let i = 0; i < SERIES_NAME_SORTED.length; i++) {
    if (name.indexOf(SERIES_NAME_SORTED[i].prefix) === 0) return SERIES_NAME_SORTED[i];
  }
  return null;
}
/** 中文产品名称（中文购销合同「产品名称」列） */
function cnProductName(it) { const s = lookupSeries(it); return s ? s.cn : ''; }
/** 英文产品名称（英文 PI「Project Name」列） */
function enProductName(it) { const s = lookupSeries(it); return s ? s.en : ''; }

function modelSpecOf(it) {
  // 产品型号 = 产品名称 + DN + 型号数字。
  // 注意：不拼 productType（如"常规品"），否则会混入 Model no. / 型号规格 列（用户要求只显示产品型号）
  const clean = (s) => String(s == null ? '' : s).replace(/常规品/g, '').trim();
  if (it.spec) {
    const spec = clean(it.spec);
    return spec || '';
  }
  const parts = [];
  const name = clean(it.productName);
  const model = clean(it.model);
  if (name) parts.push(name);
  if (model) parts.push(/^DN/i.test(model) ? model : ('DN' + model));
  return parts.join('-');
}

/**
 * 英文 Model no. 列专用：只显示产品型号，剔除一切中文字符。
 * 中文产品名（如"气动软密封蝶阀"）由 productName 参与拼接，必须移除，仅保留型号数字（DN+model）。
 */
function enModelNo(it) {
  const s = modelSpecOf(it).replace(/[\u4e00-\u9fa5]/g, '');
  return s.replace(/^-+/, '').replace(/-+$/, '').trim();
}

// —— 中文规格组合（simple6 合同：P 列「产品描述」）——————
// 对应截图样例 P12 = 「国内木箱材质压力密封面商标单位」
// 顺序：包装（国内木箱）→ 材质 → 闸板/阀杆 → 密封面 → 压力 → 闸板厚度 → 扭矩 → 单重 → 木箱尺寸（具体数字）→ 商标 → 单位
// 注意：如果用户传的字段里本身已经包含单位（如 gatePlateThickness="12mm"），不要再重复追加后缀
function cnSpecDesc(it) {
  const parts = [];
  const boxSize = (it.woodenBoxSize != null) ? String(it.woodenBoxSize).trim() : '';
  parts.push(boxSize ? (`国内木箱${boxSize}`) : '国内木箱');
  if (it.bodyMaterial) parts.push(`材质${it.bodyMaterial}`);
  if (it.gateMaterial) parts.push(`闸板${it.gateMaterial}`);
  if (it.stemMaterial) parts.push(`阀杆${it.stemMaterial}`);
  if (it.sealMaterial) parts.push(`密封面${it.sealMaterial}`);
  if (it.maxPressure != null && String(it.maxPressure).trim()) {
    const p = String(it.maxPressure).trim();
    parts.push(/PN|压力|bar/i.test(p) ? `压力${p}` : `压力PN${p}`);
  }
  if (it.gatePlateThickness != null && String(it.gatePlateThickness).trim()) {
    const v = String(it.gatePlateThickness).trim();
    parts.push(/mm|毫米/i.test(v) ? `闸板厚度${v}` : `闸板厚度${v}mm`);
  }
  if (it.torque != null && String(it.torque).trim()) {
    const v = String(it.torque).trim();
    // 兼容 N·m / N.m / NM / 牛米 / 扭矩 等写法（中点 · 是常见 ASCII 之外字符）
    parts.push(/N[\.·]?[Mm]|牛|扭矩/i.test(v) ? `扭矩${v}` : `扭矩${v}N.M`);
  }
  if (it.unitWeight != null && String(it.unitWeight).trim()) {
    const v = String(it.unitWeight).trim();
    parts.push(/kg|千克|g|克/i.test(v) ? `单重${v}` : `单重${v}KG`);
  }
  if (it.trademark) parts.push(`商标${it.trademark}`);
  if (it.unit) parts.push(`单位${it.unit}`);
  return parts.join('');
}

// —— 英文 Project Name（产品名翻译，simple7 PI 的 B 列）——————
// 优先取系列对照表的英文名称（2026-08-15 用户要求：英文需翻译后再填入产品名称）；
// 无系列匹配时回退到逐词替换翻译逻辑
function enProjectName(it) {
  const s = lookupSeries(it);
  if (s) return s.en;
  const base = it.productName || it.productType || 'Valve';
  return String(base)
    .replace(/双向/g, 'Bi-directional ')
    .replace(/气动/g, 'Pneumatic ')
    .replace(/电动/g, 'Electric Actuated ')
    .replace(/伞齿轮/g, 'Bevel Gear ')
    .replace(/蜗轮/g, 'Worm Gear ')
    .replace(/手动/g, 'Manual ')
    .replace(/自密封/g, 'Self-sealing ')
    .replace(/软密封/g, 'Soft Sealing ')
    .replace(/硬密封/g, 'Hard Sealing ')
    .replace(/暗杆/g, 'Non-rising Stem ')
    .replace(/明杆/g, 'Rising Stem ')
    .replace(/对夹式/g, 'Wafer Type ')
    .replace(/刀闸阀/g, 'Knife Gate Valve')
    .replace(/闸阀/g, 'Gate Valve')
    .replace(/球阀/g, 'Ball Valve')
    .replace(/蝶阀/g, 'Butterfly Valve')
    .replace(/止回阀/g, 'Check Valve')
    .replace(/截止阀/g, 'Globe Valve')
    .replace(/\s+/g, ' ')
    .trim();
}

// —— 英文规格组合（simple7 PI 的 D 列「Item Description」）——————
// 对应截图样例 D5 = 「Seat:NR Working Pressure7bar，Disc Thickness=8mm」
function enSpecDesc(it) {
  const parts = [];
  if (it.sealMaterial) parts.push(`Seat:${it.sealMaterial}`);
  if (it.maxPressure != null && String(it.maxPressure).trim()) {
    const p = String(it.maxPressure).trim();
    parts.push(/bar|PN|压力/i.test(p) ? `Working Pressure ${p.replace(/PN/gi, '')}` : `Working Pressure ${p}bar`);
  }
  if (it.gatePlateThickness != null && String(it.gatePlateThickness).trim()) {
    const v = String(it.gatePlateThickness).trim();
    parts.push(/mm/i.test(v) ? `Disc Thickness=${v}` : `Disc Thickness=${v}mm`);
  }
  if (it.bodyMaterial) parts.push(`Body:${it.bodyMaterial}`);
  if (it.gateMaterial) parts.push(`Disc:${it.gateMaterial}`);
  if (it.stemMaterial) parts.push(`Stem:${it.stemMaterial}`);
  if (it.unitWeight != null && String(it.unitWeight).trim()) {
    const v = String(it.unitWeight).trim();
    parts.push(/kg|g/i.test(v) ? `N.W.:${v}` : `N.W.:${v}kg`);
  }
  if (it.trademark) parts.push(`Brand:${it.trademark}`);
  if (it.unit) parts.push(`Unit:${it.unit}`);
  return parts.join('，');
}

// ——— 家族 1B：cn_contract_simple6（chisun_nsh + zs_changsheng，与用户截图完全一致的 6 列）
//     A=产品名称（系列中文名）；H=型号规格=spec；P=产品描述=中文规格组合；AG=数量；AJ=单价；AK=金额；AQ=备注（空）
const COL_MAP_CN_SIMPLE6 = [
  { col: 'A',  get: (it) => cnProductName(it) }, // 产品名称：按型号前缀匹配系列真实名称（2026-08-15 用户提供对照表）
  { col: 'H',  get: (it) => modelSpecOf(it) },
  { col: 'P',  get: (it) => cnSpecDesc(it) },
  { col: 'AG', get: (it) => {
      const q = Number(it.quantity);
      return (isNaN(q) || q === 0) ? '' : q;
  }, isNum: true },
  { col: 'AJ', get: (it) => {
      const v = Number(it.unitPrice);
      return (isNaN(v) || v === 0) ? '' : v;
  }, isNum: true },
  { col: 'AK', get: (it) => {
      const t = Number(it.totalPrice);
      return (isNaN(t) || t === 0) ? '' : t;
  }, isNum: true },
  { col: 'AQ', get: () => '' }  // 备注列：清空模板原有长文字示例
];

// ——— 家族 2：en_pi_simple7（pi_changqi/pi_chisun_multi/pi_chisun_vtb 英文 PI 简单 7 列）
//     A=No；B=Project Name（英文产品名翻译）；C=Model no（spec）；D=Item Description（英文规格组合）；G=QTY；H=Unit price；I=Total amount；J=Remark（空）
const COL_MAP_EN_SIMPLE7 = [
  { col: 'A', get: (_, idx) => idx + 1, isNum: true },
  { col: 'B', get: (it) => enProjectName(it) },
  { col: 'C', get: (it) => enModelNo(it) },  // Model no.：纯型号，无中文字符
  { col: 'D', get: (it) => enSpecDesc(it) },
  { col: 'G', get: (it) => {
      const q = Number(it.quantity);
      return (isNaN(q) || q === 0) ? '' : q;
  }, isNum: true },
  { col: 'H', get: (it) => {
      const v = Number(it.unitPrice);
      return (isNaN(v) || v === 0) ? '' : v;
  }, isNum: true },
  { col: 'I', get: (it) => {
      const t = Number(it.totalPrice);
      return (isNaN(t) || t === 0) ? '' : t;
  }, isNum: true },
  { col: 'J', get: () => '' }  // Remark：清空
];

// ——— 家族 2b：en_pi 无备注列版（pi_chisun_vtb 俄罗斯卢布 PI 表头只有 7 列，无 J=Remar）
//     A=No；B=Project Name；C=Model no；D=Item Description；G=QTY；H=Unit price；I=Total amount
const COL_MAP_EN_VTB7 = [
  { col: 'A', get: (_, idx) => idx + 1, isNum: true },
  { col: 'B', get: (it) => enProjectName(it) },
  { col: 'C', get: (it) => enModelNo(it) },  // Model no.：纯型号，无中文字符
  { col: 'D', get: (it) => enSpecDesc(it) },
  { col: 'G', get: (it) => {
      const q = Number(it.quantity);
      return (isNaN(q) || q === 0) ? '' : q;
  }, isNum: true },
  { col: 'H', get: (it) => {
      const v = Number(it.unitPrice);
      return (isNaN(v) || v === 0) ? '' : v;
  }, isNum: true },
  { col: 'I', get: (it) => {
      const t = Number(it.totalPrice);
      return (isNaN(t) || t === 0) ? '' : t;
  }, isNum: true }
];

/**
 * 各模板 CFG（覆盖默认值）：
 *   PRODUCT_ROW_FIRST      第一条数据样例行（1-based）
 *   PRODUCT_ROW_LAST_TPL   模板里数据区的最后一条行号（容量 = last - first + 1）
 *   【 cn_contract 只有】
 *     TAX_ROW              税金行（及以下是合计/签名。扩容时从这行开始整体下移）
 *     TOTAL_ROW            价税合计大写/小写所在行
 *     CELL_PRETAX, CELL_TAX, CELL_TOTAL_NUM, CELL_TOTAL_CN, NOTE_CELL —— A1
 *  【 en_pi 只有】
 *     TOTAL_ROW            R6 = Total 那一行
 *     CELL_TOTAL_AMOUNT    C6 这样的数字格：写总金额
 */
const FAMILY_CFG = {
  // ——— 家族 1B：simple6 中文（chisun_nsh + zs_changsheng，R11=表头/R12=产品/R13=税金/R14=合计/R15=备注）———
  chisun_nsh: {
    family: 'cn_contract',
    PRODUCT_ROW_FIRST: 12,
    PRODUCT_ROW_LAST_TPL: 12,
    TAX_ROW: 13,
    TOTAL_ROW: 14,
    // 真实探查：
    //   A13  = 不含税金额（元）：55,221.24  (merge A..M，文本 + 数字)
    //   O13  = 税额（元）：                  (merge O..U，文本)
    //   V13  = [N]7178.76                   (数字格：税额)
    //   AC13 = 税率：13%                    (merge AC..AP，文本)
    //   A14  = 价税合计（大写）：陆万贰仟肆佰元整 (merge A..AB，大写文本)
    //   AC14 = 价税合计（小写）：62,400元         (merge AC..AW，小写文本)
    //   A15  = 备注：本合同约定的不含税金额...      (merge A..AW，固定条款备注，不写用户的备注)
    // NOTE: 用户的报价单备注填到产品的「备注列 AQ12」里，但用户没说要填，所以 AQ12 留空（COL_MAP 已清空）
    CELL_PRETAX_MERGE: 'A13',
    CELL_TAX_TEXT_MERGE: 'O13',
    CELL_TAX_NUM: 'V13',
    CELL_RATE_MERGE: 'AC13',
    CELL_TOTAL_CN_MERGE: 'A14',
    CELL_TOTAL_NUM_MERGE: 'AC14',
    TAX_RATE: 0.13,
    COL_MAP: COL_MAP_CN_SIMPLE6,
    _WRITE_STRATEGY: 'simple6_merge'
  },
  zs_changsheng: {
    family: 'cn_contract',
    PRODUCT_ROW_FIRST: 12,
    PRODUCT_ROW_LAST_TPL: 12,
    TAX_ROW: 13,
    TOTAL_ROW: 14,
    CELL_PRETAX_MERGE: 'A13',
    CELL_TAX_TEXT_MERGE: 'O13',
    CELL_TAX_NUM: 'V13',
    CELL_RATE_MERGE: 'AC13',
    CELL_TOTAL_CN_MERGE: 'A14',
    CELL_TOTAL_NUM_MERGE: 'AC14',
    TAX_RATE: 0.13,
    COL_MAP: COL_MAP_CN_SIMPLE6,
    _WRITE_STRATEGY: 'simple6_merge'
  },

  // ——— 家族 2：simple7 英文 PI（3 套：Changqi / Chisun 多币种 / Chisun VTB 卢布）
  //        R4=表头 / R5=产品 / R6=Total / R7=Note:
  pi_changqi: {
    family: 'en_pi',
    PRODUCT_ROW_FIRST: 5,
    PRODUCT_ROW_LAST_TPL: 5,
    TOTAL_ROW: 6,
    CELL_TOTAL_AMOUNT: 'I6',  // 探查：B6="Total"，I6=[N]295460（真实写总价的数字格）
    COL_MAP: COL_MAP_EN_SIMPLE7
  },
  pi_chisun_multi: {
    family: 'en_pi',
    PRODUCT_ROW_FIRST: 5,
    PRODUCT_ROW_LAST_TPL: 5,
    TOTAL_ROW: 6,
    CELL_TOTAL_AMOUNT: 'I6',  // 探查：I6=[N]295460
    COL_MAP: COL_MAP_EN_SIMPLE7
  },
  pi_chisun_vtb: {
    family: 'en_pi',
    PRODUCT_ROW_FIRST: 5,
    PRODUCT_ROW_LAST_TPL: 5,
    TOTAL_ROW: 6,
    CELL_TOTAL_AMOUNT: 'I6',  // 探查：I6=[N]295460
    COL_MAP: COL_MAP_EN_VTB7   // VTB 模板表头无 J=Remar 列（仅 7 列），不写 J 列
  }
};

// ================ 公共底层（两个家族共用） ================
/** 数字 → 人民币大写 */
function toChineseMoney(n) {
  if (n === null || n === undefined || n === '' || isNaN(Number(n))) return '';
  let num = Number(n);
  if (!isFinite(num)) return '';
  const negative = num < 0;
  if (negative) num = -num;
  if (num === 0) return '零元整';
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let head = negative ? '负' : '';
  num = Math.round(num * 100) / 100;
  const s = num.toFixed(2);
  const parts = s.split('.');
  const intPart = parts[0];
  const decPart = parts[1] || '00';
  let out = '';
  if (parseInt(intPart, 10) > 0) {
    for (let i = 0; i < intPart.length; i++) {
      const idxN = intPart.length - 1 - i;
      const d = parseInt(intPart.charAt(i), 10);
      const p = Math.floor(idxN / 4);
      const q = idxN % 4;
      if (d === 0) {
        if (q === 0) {
          let has = false;
          for (let j = i - q; j <= i; j++) {
            if (parseInt(intPart.charAt(j) || '0', 10) !== 0) { has = true; break; }
          }
          if (has) out += unit[0][p];
        }
      } else {
        if (out.charAt(out.length - 1) !== '零' && i > 0 && q !== 3
            && parseInt(intPart.charAt(i - 1) || '0', 10) === 0) {
          out += '零';
        }
        out += digit[d] + unit[1][q];
        if (q === 0) out += unit[0][p];
      }
    }
    out = out.replace(/零+元/g, '元').replace(/零+万/g, '万')
             .replace(/零+亿/g, '亿').replace(/亿万/g, '亿');
    if (!out.endsWith('元')) out += '元';
  }
  const jiao = parseInt(decPart.charAt(0), 10);
  const fen = parseInt(decPart.charAt(1), 10);
  if (jiao === 0 && fen === 0) out += '整';
  else {
    if (jiao === 0) {
      if (parseInt(intPart, 10) > 0) out += '零';
      out += digit[fen] + fraction[1];
    } else {
      out += digit[jiao] + fraction[0];
      if (fen !== 0) out += digit[fen] + fraction[1];
    }
  }
  return head + out;
}

/** A1 引用 */
function parseA1(a1) {
  const m = /^([A-Z]+)(\d+)$/.exec(a1);
  if (!m) throw new Error('bad A1: ' + a1);
  const colStr = m[1]; let col = 0;
  for (let i = 0; i < colStr.length; i++) col = col * 26 + (colStr.charCodeAt(i) - 64);
  return { colStr, col, row: parseInt(m[2], 10) };
}
function colLettersToNum(colStr) {
  let n = 0;
  for (let i = 0; i < colStr.length; i++) n = n * 26 + (colStr.charCodeAt(i) - 64);
  return n;
}
function parseAttrs(s) {
  const out = {};
  const re = /([A-Za-z_:][\w\-:.]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(s)) !== null) out[m[1]] = m[2];
  return out;
}

/** sheet1.xml → {before, after, innerRaw, rows Map<rowNum, {outer,inner,attrs,rawAttrs,start,end}>} */
function splitSheetData(xml) {
  const sdOpen = xml.indexOf('<sheetData');
  const sdCloseIdx = xml.indexOf('</sheetData>');
  if (sdOpen < 0 || sdCloseIdx < 0) throw new Error('sheetData not found');
  const endOfOpenTag = xml.indexOf('>', sdOpen) + 1;
  const before = xml.slice(0, endOfOpenTag);
  const inner = xml.slice(endOfOpenTag, sdCloseIdx);
  const after = xml.slice(sdCloseIdx);
  const rows = new Map();
  const rowRe = /<row\s([^>]*)>([\s\S]*?)<\/row>/g;
  let m;
  while ((m = rowRe.exec(inner)) !== null) {
    const attrs = parseAttrs(m[1]);
    const r = parseInt(attrs.r, 10);
    rows.set(r, { outer: m[0], inner: m[2], attrs, rawAttrs: m[1], start: m.index, end: m.index + m[0].length });
  }
  return { before, after, rows, innerRaw: inner };
}

/** 在 <row>inner 中写某 A1 单元格的 value（string/number/''） */
function writeCellInRow(rowInner, cellA1, value) {
  const { colStr, row } = parseA1(cellA1);
  const ref = colStr + row;
  const reSelf = new RegExp(`<c\\s([^>]*r="${ref}"[^>]*?)\\s*\\/>`);
  let m = reSelf.exec(rowInner);
  let rawAttrs = '';
  let start, end;
  if (m) {
    rawAttrs = m[1];
    start = m.index;
    end = m.index + m[0].length;
  } else {
    const reClosed = new RegExp(`<c\\s([^>]*r="${ref}"[^>]*[^\\/])>([\\s\\S]*?)<\\/c>`);
    m = reClosed.exec(rowInner);
    if (!m) return rowInner;
    rawAttrs = m[1];
    start = m.index;
    end = m.index + m[0].length;
  }
  const keepAttrs = [];
  const attrRe = /([A-Za-z_:][\w\-:.]*)\s*=\s*"([^"]*)"/g;
  let am;
  while ((am = attrRe.exec(rawAttrs)) !== null) {
    const k = am[1];
    if (k !== 't') keepAttrs.push(`${k}="${am[2]}"`);
  }
  let newAttrs = keepAttrs.join(' ');
  if (value === '' || value === null || value === undefined) {
    return rowInner.slice(0, start) + `<c ${newAttrs}/>` + rowInner.slice(end);
  }
  let newInner = '';
  if (typeof value === 'number') {
    newInner = `<v>${value}</v>`;
  } else {
    newAttrs += ' t="inlineStr"';
    const escaped = String(value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    newInner = `<is><t xml:space="preserve">${escaped}</t></is>`;
  }
  const newCell = `<c ${newAttrs}>${newInner}</c>`;
  return rowInner.slice(0, start) + newCell + rowInner.slice(end);
}

/** 设置模板中某个固定单元格的内容（默认置空，保留样式），用于「生成后由用户自行填写」的字段 */
function clearTemplateCell(xml, a1, value) {
  const { colStr, row } = parseA1(a1);
  const ref = colStr + row;
  const rowRe = new RegExp(`(<row\\s[^>]*r="${row}"[^>]*>)([\\s\\S]*?)(<\\/row>)`);
  const m = rowRe.exec(xml);
  if (!m || !new RegExp(`r="${ref}"`).test(m[2])) return xml;
  const newInner = writeCellInRow(m[2], a1, value === undefined ? '' : value);
  return xml.slice(0, m.index) + m[1] + newInner + m[3] + xml.slice(m.index + m[0].length);
}

/** 在 rowInner 中按字母序插入自闭合空单元格（用于某列整个产品区模板不存在时补 s 样式占位） */
function insertSelfCloseCell(rowInner, col, rowNum, sval) {
  const cur = [];
  const reSelf = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*?)\/>\s*/g;
  const reClosed = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*[^\/])>([\s\S]*?)<\/c>\s*/g;
  let m;
  while ((m = reSelf.exec(rowInner)) !== null) {
    cur.push({ colNum: colLettersToNum(m[1]), start: m.index, end: m.index + m[0].length });
  }
  while ((m = reClosed.exec(rowInner)) !== null) {
    cur.push({ colNum: colLettersToNum(m[1]), start: m.index, end: m.index + m[0].length });
  }
  cur.sort((a, b) => a.start - b.start);
  const newColNum = colLettersToNum(col);
  let insertPos = rowInner.length;
  for (let i = 0; i < cur.length; i++) {
    if (cur[i].colNum > newColNum) { insertPos = cur[i].start; break; }
  }
  if (cur.length > 0 && insertPos === rowInner.length) insertPos = cur[cur.length - 1].end;
  const newNode = `<c r="${col}${rowNum}" s="${sval}"/>`;
  return rowInner.slice(0, insertPos) + newNode + rowInner.slice(insertPos);
}

/** 读单元格文本（支持 inline / t=s 共享字符串 / 数字）；读不到返回 null */
function readCellTextFromRow(rdInner, cellA1, SST) {
  const { row, colStr } = parseA1(cellA1);
  const ref = colStr + row;
  const re2 = new RegExp(`<c\\s([^>]*r="${ref}"[^>]*)>([\\s\\S]*?)<\\/c>`);
  let m = re2.exec(rdInner);
  let attrs = '', cInner = '';
  if (m) { attrs = m[1]; cInner = m[2]; }
  else {
    const reSelf2 = new RegExp(`<c\\s[^>]*r="${ref}"[^>]*?\\/>`);
    if (reSelf2.test(rdInner)) return '';
    return null;
  }
  const ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(cInner);
  if (ism) return ism[1];
  if (/\bt="s"/.test(attrs)) {
    const vm = /<v>([^<]+)<\/v>/.exec(cInner);
    if (vm) {
      const idx = parseInt(vm[1], 10);
      if (!isNaN(idx) && SST && SST[idx] != null) return SST[idx];
    }
    return null;
  }
  const vm2 = /<v>([^<]+)<\/v>/.exec(cInner);
  return vm2 ? vm2[1] : '';
}

/** 把 templateKey 的默认数据行（通常 FIRST）克隆到新行号（空内容，样式 s 继承） */
function cloneRowTo(rowOuter, srcRowNum, dstRowNum, colStyles, colMap) {
  let s = rowOuter;
  // 行 r="SRC"
  s = s.replace(new RegExp(`(<row\\s[^>]*\\br=")${srcRowNum}("[^>]*>)`), `$1${dstRowNum}$2`);
  // 单元格 r="XXSRC"
  s = s.replace(new RegExp(`(<c\\s[^>]*\\br=")([A-Z]+)${srcRowNum}("[^>]*>)`, 'g'), (_, pre, col, post) => `${pre}${col}${dstRowNum}${post}`);
  // 清空各列映射内容（保持样式）
  const openEnd = s.indexOf('>') + 1;
  const closeStart = s.lastIndexOf('</row>');
  const inner = s.slice(openEnd, closeStart);
  const cleared = clearRowByColMap(inner, dstRowNum, colStyles, colMap);
  return s.slice(0, openEnd) + cleared + s.slice(closeStart);
}

/** 按给定 colMap 清空行（或补齐缺列再清空） */
function clearRowByColMap(rowInner, rowNum, colStyles, colMap) {
  let r = rowInner;
  (colMap || []).forEach(cfg => {
    const ref = cfg.col + rowNum;
    const exists = new RegExp(`<c\\s[^>]*r="${ref}"`).test(r);
    if (!exists && colStyles && colStyles[cfg.col] != null) {
      r = insertSelfCloseCell(r, cfg.col, rowNum, colStyles[cfg.col]);
    }
    r = writeCellInRow(r, ref, '');
  });
  return r;
}
/** 按 colMap 写入一条 item */
function writeRowByColMap(rowInner, rowNum, item, idx, colStyles, colMap) {
  let r = rowInner;
  (colMap || []).forEach(cfg => {
    const ref = cfg.col + rowNum;
    const exists = new RegExp(`<c\\s[^>]*r="${ref}"`).test(r);
    if (!exists && colStyles && colStyles[cfg.col] != null) {
      r = insertSelfCloseCell(r, cfg.col, rowNum, colStyles[cfg.col]);
    }
    const v = cfg.get(item, idx);
    r = writeCellInRow(r, ref, v);
  });
  return r;
}

/** 行号 >= threshold 的全部 A1/row/mergeCell/dimension 批量 +offset */
function offsetAllRowNumbers(xml, threshold, offset) {
  if (!offset) return xml;
  // 每个 pattern 的分组数量 vs sep 对应关系必须严格对齐，否则会丢引号/右尖括号导致 XML 彻底损坏！
  //   pattern 1：(<row r=") + (数字) + ("...>) —— 3 groups → sep 必须拼 [1..3] 全三段（之前漏写 [[1,2]] 导致 " > 全丢，Excel 打开空白）
  //   pattern 2：(<c r=" + 字母) + (数字) + ("...>) —— 4 groups → sep [1..4] ✅
  //   pattern 3/4：mergeCell/dimension —— 6 groups → sep [1..3]+":"+[4..6] ✅
  const patterns = [
    { re: /(<row\s[^>]*\br=")(\d+)("[^>]*>)/g, groups: [2], sep: [[1,3]] },
    { re: /(<c\s[^>]*\br=")([A-Z]+)(\d+)("[^>]*>)/g, groups: [3], sep: [[1,4]] },
    { re: /(<mergeCell\s+ref=")([A-Z]+)(\d+):([A-Z]+)(\d+)("[^>]*>)/g, groups: [3,5], sep: [[1,3], ':', [4,6]] },
    { re: /(<dimension\s+ref=")([A-Z]+)(\d+):([A-Z]+)(\d+)("[^>]*>)/g, groups: [3,5], sep: [[1,3], ':', [4,6]] }
  ];
  let out = xml;
  patterns.forEach(p => {
    out = out.replace(p.re, (...args) => {
      const replaced = args.slice(1, -2);
      p.groups.forEach(gIdx1 => {
        const gi = gIdx1 - 1;
        let n = parseInt(replaced[gi], 10);
        if (!isNaN(n) && n >= threshold) replaced[gi] = String(n + offset);
      });
      let s = '';
      p.sep.forEach(part => {
        if (typeof part === 'string') s += part;
        else for (let k = part[0] - 1; k <= part[1] - 1; k++) s += replaced[k];
      });
      return s;
    });
  });
  return out;
}

/**
 * 扩容后给新产品行补充合并单元格：复制产品样例行（srcRowNum）自身的全部 mergeCell 到每个新行。
 * 背景：cloneRowTo 只克隆 <row> 单元格 XML，<mergeCells> 里的合并声明不会自动跟随，
 *       导致扩容出来的产品行合并区域丢失（中文 A-G/H-O/P-AF/AG-AI/AK-AP/AQ-AW；英文 D-F）。
 */
function addMergesForClonedRows(xml, srcRowNum, newRowNums) {
  if (!newRowNums || !newRowNums.length) return xml;
  const mcOpen = xml.indexOf('<mergeCells');
  const mcEnd = xml.indexOf('</mergeCells>');
  if (mcOpen < 0 || mcEnd < 0) return xml;
  const openTagEnd = xml.indexOf('>', mcOpen) + 1;
  const inner = xml.slice(openTagEnd, mcEnd);
  const re = /<mergeCell\s+ref="([A-Z]+)(\d+):([A-Z]+)(\d+)"/g;
  const add = [];
  let m;
  while ((m = re.exec(inner)) !== null) {
    const c1 = m[1], r1 = parseInt(m[2], 10), c2 = m[3], r2 = parseInt(m[4], 10);
    if (r1 === srcRowNum && r2 === srcRowNum) {
      newRowNums.forEach(dst => { add.push(`<mergeCell ref="${c1}${dst}:${c2}${dst}"/>`); });
    }
  }
  if (!add.length) return xml;
  // 更新 count 属性（部分 Excel 校验 count 与条目数一致）
  const openTag = xml.slice(mcOpen, openTagEnd);
  let newOpenTag = openTag;
  const countM = /count="(\d+)"/.exec(openTag);
  if (countM) {
    const total = parseInt(countM[1], 10) + add.length;
    newOpenTag = openTag.replace(/count="\d+"/, `count="${total}"`);
  }
  return xml.slice(0, mcOpen) + newOpenTag + xml.slice(openTagEnd, mcEnd) + add.join('') + xml.slice(mcEnd);
}

/** 扫描 FIRST..LAST 模板行，建立所需列 → s 索引表（缺失则左右近邻 fallback） */
function buildProductColStyles(sd, cfg) {
  const colMap = cfg.COL_MAP || [];
  const neededCols = colMap.map(c => c.col);
  const neededSet = new Set(neededCols);
  const PRODUCT_COL_STYLES = {};
  const pool = new Map();
  const reSelfC = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*?)\/>/g;
  const reClosedC = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*[^\/])>([\s\S]*?)<\/c>/g;
  const rnFirst = cfg.PRODUCT_ROW_FIRST;
  const rnLast = cfg.PRODUCT_ROW_LAST_TPL;
  for (let rn = rnFirst; rn <= rnLast; rn++) {
    const rd = sd.rows.get(rn);
    if (!rd) continue;
    let m;
    while ((m = reSelfC.exec(rd.inner)) !== null) {
      const col = m[1];
      const attrs = `${m[1]} ${m[3]}`;
      const sm = /\bs="(\d+)"/.exec(attrs);
      const s = sm ? Number(sm[1]) : 0;
      if (neededSet.has(col) && PRODUCT_COL_STYLES[col] == null) PRODUCT_COL_STYLES[col] = s;
      if (!pool.has(col)) pool.set(col, s);
    }
    while ((m = reClosedC.exec(rd.inner)) !== null) {
      const col = m[1];
      const attrs = `${m[1]} ${m[3]}`;
      const sm = /\bs="(\d+)"/.exec(attrs);
      const s = sm ? Number(sm[1]) : 0;
      if (neededSet.has(col) && PRODUCT_COL_STYLES[col] == null) PRODUCT_COL_STYLES[col] = s;
      if (!pool.has(col)) pool.set(col, s);
    }
  }
  const poolCols = Array.from(pool.keys()).sort((a, b) => colLettersToNum(a) - colLettersToNum(b));
  neededCols.forEach(col => {
    if (PRODUCT_COL_STYLES[col] != null) return;
    const target = colLettersToNum(col);
    let best = null, bestDist = Infinity;
    poolCols.forEach(pc => {
      const d = Math.abs(colLettersToNum(pc) - target);
      if (d < bestDist) { bestDist = d; best = pc; }
    });
    PRODUCT_COL_STYLES[col] = best != null ? pool.get(best) : 0;
  });
  return PRODUCT_COL_STYLES;
}

/** 通用：扩容、写入产品 N 条 → 返回 { finalXml, offset } */
function fillProducts(xml, cfg, items) {
  const N = items.length;
  const capacity = cfg.PRODUCT_ROW_LAST_TPL - cfg.PRODUCT_ROW_FIRST + 1;
  const offset = Math.max(0, N - capacity);
  if (offset > 0 && cfg.TAX_ROW != null) {
    xml = offsetAllRowNumbers(xml, cfg.TAX_ROW, offset);
  } else if (offset > 0 && cfg.TOTAL_ROW != null) {
    xml = offsetAllRowNumbers(xml, cfg.TOTAL_ROW, offset);
  }
  const sd = splitSheetData(xml);
  const COL_STYLES = buildProductColStyles(sd, cfg);

  // 扩容：新增克隆行
  if (offset > 0) {
    const srcRowNum = cfg.PRODUCT_ROW_FIRST;
    const srcRow = sd.rows.get(srcRowNum);
    if (!srcRow) throw new Error('product src row R' + srcRowNum + ' not found');
    const cloneStart = cfg.PRODUCT_ROW_LAST_TPL + 1;
    const clones = [];
    const newRowNums = [];
    for (let i = 0; i < offset; i++) {
      const dstRowNum = cloneStart + i;
      newRowNums.push(dstRowNum);
      clones.push(cloneRowTo(srcRow.outer, srcRowNum, dstRowNum, COL_STYLES, cfg.COL_MAP));
    }
    const lastRow = sd.rows.get(cfg.PRODUCT_ROW_LAST_TPL);
    if (!lastRow) throw new Error('PRODUCT_ROW_LAST_TPL missing');
    const newInner = sd.innerRaw.slice(0, lastRow.end) + '\n' + clones.join('\n') + '\n' + sd.innerRaw.slice(lastRow.end);
    xml = sd.before + newInner + sd.after;
    // 补充新产品行的合并单元格（复制样例行 srcRowNum 的合并范围到每个新行）
    xml = addMergesForClonedRows(xml, srcRowNum, newRowNums);
  }
  const sd2 = splitSheetData(xml);

  // 写入 N 条 + 清空模板里原有多余行
  const R_END = Math.max(cfg.PRODUCT_ROW_FIRST + N - 1, cfg.PRODUCT_ROW_LAST_TPL);
  const newRowOuters = new Map();
  for (let r = cfg.PRODUCT_ROW_FIRST; r <= R_END; r++) {
    const row = sd2.rows.get(r);
    if (!row) continue;
    let newInner = clearRowByColMap(row.inner, r, COL_STYLES, cfg.COL_MAP);
    const idx = r - cfg.PRODUCT_ROW_FIRST;
    if (idx < N) {
      newInner = writeRowByColMap(newInner, r, items[idx], idx, COL_STYLES, cfg.COL_MAP);
    }
    const newOuter = `<row ${row.rawAttrs}>${newInner}</row>`;
    newRowOuters.set(r, newOuter);
  }
  let finalInner = sd2.innerRaw;
  const rowNumsDesc = Array.from(sd2.rows.keys()).sort((a, b) => b - a);
  rowNumsDesc.forEach(rn => {
    if (!newRowOuters.has(rn)) return;
    const row = sd2.rows.get(rn);
    finalInner = finalInner.slice(0, row.start) + newRowOuters.get(rn) + finalInner.slice(row.end);
  });
  return { finalXml: sd2.before + finalInner + sd2.after, offset };
}

/** 在整份 finalXml 中改一个 A1 单元格（全局工具） */
function writeGlobalCell(finalXml, a1, value) {
  const { row } = parseA1(a1);
  const sd = splitSheetData(finalXml);
  const rd = sd.rows.get(row);
  if (!rd) return finalXml;
  const newInner = writeCellInRow(rd.inner, a1, value);
  const newOuter = `<row ${rd.rawAttrs}>${newInner}</row>`;
  const inner2 = sd.innerRaw.slice(0, rd.start) + newOuter + sd.innerRaw.slice(rd.end);
  return sd.before + inner2 + sd.after;
}
/** 在整份 finalXml 中读 A1 文本 */
function readGlobalCell(finalXml, a1, SST) {
  const { row } = parseA1(a1);
  const sd = splitSheetData(finalXml);
  const rd = sd.rows.get(row);
  if (!rd) return null;
  return readCellTextFromRow(rd.inner, a1, SST);
}

// ================ cn_contract 家族：税金/合计/备注 ================
function writeCnContractBlocks(finalXml, cfg, opts, offset, SST) {
  const taxRate = cfg.TAX_RATE != null ? cfg.TAX_RATE : 0.13;
  const pretax = Number(opts.finalPrice) || 0;
  const tax = Math.round(pretax * taxRate * 100) / 100;
  const totalIncl = Math.round((pretax + tax) * 100) / 100;

  function offA1(a1) {
    if (!a1) return null;
    const p = parseA1(a1);
    const th = cfg.TAX_ROW != null ? cfg.TAX_ROW : (cfg.TOTAL_ROW || 1);
    if (p.row >= th) return `${p.colStr}${p.row + offset}`;
    return a1;
  }
  function fmtMoney(n) {
    const neg = n < 0;
    const s = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-¥' : '¥') + s;
  }
  // 不含税+税金合起来的格式：比如 55221.24 → "55,221.24"（没有 ¥ 符号，跟模板样例一致）
  function fmtNum(n) {
    const s = Math.abs(Number(n) || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return s;
  }
  // 小写元格式：62400 → "62,400元"（跟模板 AC14 样例一致）
  function fmtNumYuan(n) {
    return fmtNum(n).replace(/\.00$/, '') + '元';
  }
  // 简单 replaceInMergeText：读原文本，提取 prefix，加新内容（对于「XX：数字/大写」这种结构，直接 prefix + new）
  function replaceMergeByPrefix(xml, a1, buildNew) {
    const cell = offA1(a1);
    if (!cell) return xml;
    const orig = readGlobalCell(xml, cell, SST) || '';
    const mm = /^([^\uff1a:]+[\uff1a:])\s*/.exec(orig);
    const prefix = mm ? mm[1] : orig;
    const newVal = buildNew(prefix, orig);
    return writeGlobalCell(xml, cell, newVal);
  }

  let xml = finalXml;

  // ——— simple6_merge 策略（chisun_nsh / zs_changsheng）：
  //     A13=不含税 merge 文本 / V13=税额数字 / A14=大写 merge / AC14=小写 merge / O13 和 AC13 和 A15 模板文本不动
  if (cfg._WRITE_STRATEGY === 'simple6_merge') {
    // 1) A13：不含税金额（元）：55,221.24 → prefix + 数字（不含¥，跟样例一致）
    xml = replaceMergeByPrefix(xml, cfg.CELL_PRETAX_MERGE, (prefix) => prefix + fmtNum(pretax));
    // 2) V13：税额数字格 → 直接写数值
    const taxNumCell = offA1(cfg.CELL_TAX_NUM);
    if (taxNumCell) xml = writeGlobalCell(xml, taxNumCell, Math.round(tax * 100) / 100);
    // 3) A14：价税合计（大写）：陆万贰仟肆佰元整 → 写大写
    xml = replaceMergeByPrefix(xml, cfg.CELL_TOTAL_CN_MERGE, (prefix) => prefix + toChineseMoney(totalIncl));
    // 4) AC14：价税合计（小写）：62,400元 → 写「数字元」格式（跟样例一致，小数点后两位如果是 .00 省略）
    xml = replaceMergeByPrefix(xml, cfg.CELL_TOTAL_NUM_MERGE, (prefix) => prefix + fmtNumYuan(totalIncl));
    return xml;
  }

  // —— 默认 / merge_text 旧策略 ——
  if (cfg._WRITE_STRATEGY === 'merge_text' || !cfg.CELL_PRETAX) {
    const taxA1 = offA1(cfg.CELL_TAX);
    if (taxA1) {
      const prefix = '税额（元）：';
      const old = readGlobalCell(xml, taxA1, SST) || '';
      const realPrefix = old && old.trim().includes('：') ? old.trim().split('：')[0] + '：' : prefix;
      xml = writeGlobalCell(xml, taxA1, realPrefix + fmtMoney(tax));
    }
  } else {
    const pA1 = offA1(cfg.CELL_PRETAX);
    const tA1 = offA1(cfg.CELL_TAX);
    if (pA1) {
      const txt = readGlobalCell(xml, pA1, SST) || '';
      const prefix = txt.includes('：') ? txt : '不含税金额（元）：';
      xml = writeGlobalCell(xml, pA1, prefix + fmtMoney(pretax));
    }
    if (tA1) {
      const txt = readGlobalCell(xml, tA1, SST) || '';
      const prefix = txt.includes('：') ? txt : '税额（元）：';
      xml = writeGlobalCell(xml, tA1, prefix + fmtMoney(tax));
    }
  }
  const nA1 = offA1(cfg.CELL_TOTAL_NUM);
  const cnA1 = offA1(cfg.CELL_TOTAL_CN);
  if (nA1 && nA1 === cnA1) {
    const orig = readGlobalCell(xml, nA1, SST) || '';
    const prefix = orig.includes('：') ? (orig.split('：')[0] + '：') : '价税合计（小写）：';
    xml = writeGlobalCell(xml, nA1, prefix + fmtMoney(totalIncl) + ' 元   （大写） ' + toChineseMoney(totalIncl));
  } else {
    if (nA1) {
      const orig = readGlobalCell(xml, nA1, SST) || '';
      let prefix = '价税合计（小写）：', suffix = ' 元';
      if (orig) {
        const t = orig.trim();
        if (t.endsWith('元')) {
          prefix = t.slice(0, t.length - 1).replace(/：$/, '').trim() + '：';
          suffix = ' 元';
        } else if (t.includes('：')) {
          prefix = t.split('：')[0] + '：';
        } else prefix = t + '：';
      }
      xml = writeGlobalCell(xml, nA1, prefix + fmtMoney(totalIncl) + suffix);
    }
    if (cnA1) {
      const orig = readGlobalCell(xml, cnA1, SST) || '';
      let prefix = '价税合计（大写）：';
      if (orig && /大写/.test(orig)) {
        const mm = orig.match(/^([^\uff1a:]+[\uff1a:])\s*/);
        if (mm) prefix = mm[1];
      }
      xml = writeGlobalCell(xml, cnA1, prefix + toChineseMoney(totalIncl));
    }
  }
  if (cfg.NOTE_CELL && opts.note && String(opts.note).trim()) {
    const n = offA1(cfg.NOTE_CELL);
    if (n) xml = writeGlobalCell(xml, n, String(opts.note).trim());
  }
  return xml;
}

// ================ en_pi 家族：写入 Total ================
function writeEnPiBlocks(finalXml, cfg, opts, offset) {
  // 最终总价默认按 opts.finalPrice（如果传了 totalAmount 就用那个），否则 items 求和
  const items = opts.items || [];
  let total = 0;
  if (opts.totalAmount != null && Number(opts.totalAmount) !== 0) total = Number(opts.totalAmount);
  else total = items.reduce((s, it) => s + (Number(it.totalPrice) || 0), 0);
  total = Math.round(total * 100) / 100;

  function offA1(a1) {
    if (!a1) return null;
    const p = parseA1(a1);
    if (cfg.TOTAL_ROW && p.row >= cfg.TOTAL_ROW) return `${p.colStr}${p.row + offset}`;
    return a1;
  }
  let xml = finalXml;
  const t = offA1(cfg.CELL_TOTAL_AMOUNT);
  if (t) xml = writeGlobalCell(xml, t, total);
  return xml;
}

// ================ 顶层入口 buildContract（多模板版） ================
/**
 * @param {Function} JSZip             JSZip 构造函数
 * @param {Array}    TEMPLATES_ARR     TEMPLATE_REGISTRY（来自 contract-templates.js）或 [{key,family,displayName,bytes,meta}]
 * @param {string}   templateKey       chisun_nsh / zs_changsheng / pi_changqi / pi_chisun_multi / pi_chisun_vtb
 * @param {Array}    items             产品数组
 * @param {object}   opts              { finalPrice?:number, note?:string, totalAmount?:number }
 * @returns {Promise<Uint8Array>}
 */
async function buildContract(JSZip, TEMPLATES_ARR, templateKey, items, opts) {
  if (!items || !items.length) throw new Error('items empty');
  if (!Array.isArray(TEMPLATES_ARR)) throw new Error('TEMPLATES_ARR required (contract-templates.js)');
  const entry = TEMPLATES_ARR.find(t => t.key === templateKey) || TEMPLATES_ARR[0];
  if (!entry) throw new Error('template not found: ' + templateKey);

  // 1) 确定模板字节 + 合并 FAMILY_CFG[entry.key] 和 entry.meta
  //   优先级：FAMILY_CFG > entry.meta（entry.meta 仅作兜底，FAMILY_CFG 的 CELL_*/COL_MAP 必须不被旧 meta 覆盖）
  //   例如 entry.meta 里旧的 CELL_TOTAL_AMOUNT:"C6" 要被 FAMILY_CFG 的真实值 "I6" 覆盖
  const tplArr = Array.isArray(entry.bytes) ? entry.bytes : (entry.bytes && entry.bytes.buffer ? Array.from(new Uint8Array(entry.bytes.buffer, entry.bytes.byteOffset, entry.bytes.byteLength)) : []);
  const templateU8 = new Uint8Array(tplArr);
  const baseCfg = FAMILY_CFG[entry.key] || FAMILY_CFG[entry.family] || {};
  const cfg = Object.assign({}, entry.meta || {}, baseCfg);
  cfg.COL_MAP = baseCfg.COL_MAP || COL_MAP_CN_SIMPLE6;

  const N = items.length;
  const zip = await JSZip.loadAsync(templateU8);
  const sf = zip.file('xl/worksheets/sheet1.xml');
  if (!sf) throw new Error('sheet1.xml not found');
  let xml = await sf.async('string');

  // 预加载共享字符串表（读模板原值需要）
  const SST = [];
  {
    const f = zip.file('xl/sharedStrings.xml');
    if (f) {
      const s = await f.async('string');
      const siRe = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
      let m;
      while ((m = siRe.exec(s)) !== null) {
        let txt = '';
        const tRe = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
        let tm;
        while ((tm = tRe.exec(m[1])) !== null) txt += tm[1];
        SST.push(txt);
      }
    }
  }

  // 2) 写入产品 N 条（共用核心扩容+克隆+写入逻辑）
  let { finalXml, offset } = fillProducts(xml, cfg, items);

  // 3) 分家族写汇总/税金/备注
  if (cfg.family === 'cn_contract') {
    finalXml = writeCnContractBlocks(finalXml, cfg, opts, offset, SST);
    // 2026-08-15 用户要求：中文购销合同「乙方（需方）：」字段名保留，
    // 公司名「浙江汇机自控阀门有限公司」置空，生成后由用户自行填写（A7 为两套中文模板中该字段所在单元格）
    finalXml = clearTemplateCell(finalXml, 'A7', '乙方（需方）：');
  } else if (cfg.family === 'en_pi') {
    const extra = Object.assign({}, opts, { items });
    finalXml = writeEnPiBlocks(finalXml, cfg, extra, offset);
  }

  // 4) 替换 sheet1.xml 并重新打包
  zip.file('xl/worksheets/sheet1.xml', finalXml);
  const out = await zip.generateAsync({
    type: 'uint8array',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  return out;
}

// 兼容旧版单模板 buildContract(JSZip, templateU8, items, opts) 接口（保留旧合同页面不需要改）
async function buildContractLegacy(JSZip, templateU8, items, opts) {
  const TEMPLATES = [{
    key: 'legacy',
    family: 'cn_contract',
    bytes: Array.isArray(templateU8) ? new Uint8Array(templateU8) : templateU8,
    meta: {}
  }];
  return buildContract(JSZip, TEMPLATES, 'legacy', items, opts);
}

module.exports = {
  FAMILY_CFG,
  toChineseMoney,
  parseA1,
  buildContract,
  buildContractLegacy,
  // 测试导出
  _splitSheetData: splitSheetData,
  _writeCellInRow: writeCellInRow,
  _offsetAllRowNumbers: offsetAllRowNumbers,
  _cloneRowTo: cloneRowTo,
  _fillProducts: fillProducts
};
