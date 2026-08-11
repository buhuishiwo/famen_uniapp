// Node 端端到端测试：验证合同 Excel 生成
// 1) 生成 N=16 条产品数据（> 模板 13 条）=> 检查 TAX_ROW 被下移 3 行
// 2) 验证关键单元格（产品名称/规格/单价、不含税金额、税额、价税合计大小写、备注）
// 3) 把生成的 xlsx 写到 /tmp/contract_e2e.xlsx 供肉眼检查
const fs = require('fs');
const path = require('path');
const XLSX = require('/Users/meonsaber/Desktop/famen_uniapp/node_modules/xlsx/xlsx.js');

// 加载合同模板快照
const templateBytes = JSON.parse(
    fs.readFileSync('/Users/meonsaber/Desktop/famen_uniapp/utils/contract_template.json', 'utf-8')
);

// —— 从 quotation.vue 复制的核心逻辑（保持一致） ——————————————————————————
const _CONTRACT = {
    SHEET_NAME: 'Page1',
    HEADER_ROW: 11,
    PRODUCT_ROW_START: 12,
    PRODUCT_ROW_TPL_LAST: 24,
    TAX_ROW: 25,
    TOTAL_ROW: 26,
    NOTE_CELL_ROW: 39,
    NOTE_CELL_COL: 5,
    TAX_PRETAX_COL: 13,
    TAX_TAX_COL: 25,
    TOTAL_AMOUNT_CN_COL: 0,
    TOTAL_AMOUNT_NUM_COL: 25
};
const _CONTRACT_COL_MAP = [
    { col: 0,  get: (item) => (item.productType ? item.productType + ' ' : '') + (item.productName || '') },
    { col: 7,  get: (item) => item.productName || '' },
    { col: 15, get: (item) => item.model ? 'DN' + item.model : '' },
    { col: 18, get: (item) => item.bodyMaterial || '' },
    { col: 22, get: (item) => item.gatePlateThickness || '' },
    { col: 25, get: () => '台' },
    { col: 27, get: (item) => item.moq || '' },
    { col: 28, get: (item) => (item.unitPrice === 0 || item.unitPrice === '0') ? 0 : (Number(item.unitPrice) || '') },
    { col: 29, get: () => '' },
    { col: 30, get: (item) => item.maxPressure || '' },
    { col: 31, get: (item) => item.unitWeight || '' },
    { col: 32, get: (item) => item.laps || '' },
    { col: 33, get: (item) => item.torque || '' },
    { col: 34, get: (item) => item.woodenBoxSize || '' },
    { col: 35, get: (item) => item.bevelGearCouplingModel || '' }
];
function _toChineseMoney(n) {
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
    let s = num.toFixed(2);
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
                    let hasNonZero = false;
                    for (let j = i - q; j <= i; j++) {
                        if (parseInt(intPart.charAt(j) || '0', 10) !== 0) { hasNonZero = true; break; }
                    }
                    if (hasNonZero) out += unit[0][p];
                }
            } else {
                if (out.charAt(out.length - 1) !== '零' && i > 0 && q !== 3 &&
                    parseInt(intPart.charAt(i - 1) || '0', 10) === 0) {
                    out += '零';
                }
                out += digit[d] + unit[1][q];
                if (q === 0) out += unit[0][p];
            }
        }
        out = out.replace(/零+元/g, '元').replace(/零+万/g, '万').replace(/零+亿/g, '亿').replace(/亿万/g, '亿');
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
function _applyContractRowOffset(ws, offset) {
    if (!offset || offset <= 0) return;
    const threshold = _CONTRACT.TAX_ROW;
    const newCells = {};
    Object.keys(ws).forEach(k => {
        if (!/^[A-Z]+[0-9]+$/.test(k)) { newCells[k] = ws[k]; return; }
        const addr = XLSX.utils.decode_cell(k);
        if (addr.r >= threshold) { addr.r += offset; newCells[XLSX.utils.encode_cell(addr)] = ws[k]; }
        else newCells[k] = ws[k];
    });
    Object.keys(ws).forEach(k => delete ws[k]);
    Object.keys(newCells).forEach(k => ws[k] = newCells[k]);
    if (ws['!merges']) {
        ws['!merges'] = ws['!merges'].map(m => {
            const nm = { s: { r: m.s.r, c: m.s.c }, e: { r: m.e.r, c: m.e.c } };
            if (nm.s.r >= threshold) { nm.s.r += offset; nm.e.r += offset; }
            else if (nm.e.r >= threshold) { nm.e.r += offset; }
            return nm;
        });
    }
    if (ws['!rows']) {
        const rows = ws['!rows'];
        const tails = [];
        for (let i = threshold; i < rows.length; i++) tails.push(rows[i]);
        for (let i = 0; i < offset; i++) rows[threshold + i] = undefined;
        for (let i = 0; i < tails.length; i++) rows[threshold + offset + i] = tails[i];
    }
    if (ws['!ref']) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        if (range.e.r >= threshold) range.e.r += offset;
        ws['!ref'] = XLSX.utils.encode_range(range);
    }
}
function _buildContractProductRow(item) {
    return _CONTRACT_COL_MAP.map(cfg => {
        const v = cfg.get(item);
        if (typeof v === 'number') return v;
        if (v === undefined || v === null) return '';
        return String(v);
    });
}
function _clearProductArea(ws, rowStart, rowEndInclusive) {
    for (let r = rowStart; r <= rowEndInclusive; r++) {
        _CONTRACT_COL_MAP.forEach(cfg => {
            const key = XLSX.utils.encode_cell({ r, c: cfg.col });
            if (ws[key]) delete ws[key];
        });
    }
}
function _k(r, c) { return XLSX.utils.encode_cell({ r, c }); }

// 模拟 generateContract() 核心部分，返回 workbook
function buildWorkbook(items, opts = {}) {
    const u8 = new Uint8Array(templateBytes);
    const wb = XLSX.read(u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength), {
        type: 'array', cellStyles: true, cellFormula: true
    });
    const ws = wb.Sheets[wb.SheetNames[0] || _CONTRACT.SHEET_NAME];
    const capacity = _CONTRACT.PRODUCT_ROW_TPL_LAST - _CONTRACT.PRODUCT_ROW_START + 1;
    const N = items.length;
    const offset = Math.max(0, N - capacity);
    if (offset > 0) _applyContractRowOffset(ws, offset);
    const PRODUCT_ROW_START = _CONTRACT.PRODUCT_ROW_START;
    const PRODUCT_ROW_ACTUAL_LAST = PRODUCT_ROW_START + N - 1;
    const TAX_ROW = _CONTRACT.TAX_ROW + offset;
    const TOTAL_ROW = _CONTRACT.TOTAL_ROW + offset;
    const NOTE_ROW = _CONTRACT.NOTE_CELL_ROW + offset;
    const NOTE_COL = _CONTRACT.NOTE_CELL_COL;
    const clearEnd = Math.max(PRODUCT_ROW_ACTUAL_LAST, _CONTRACT.PRODUCT_ROW_TPL_LAST + offset);
    _clearProductArea(ws, PRODUCT_ROW_START, clearEnd);
    for (let i = 0; i < N; i++) {
        const r = PRODUCT_ROW_START + i;
        const row = _buildContractProductRow(items[i]);
        _CONTRACT_COL_MAP.forEach((cfg, idx) => {
            const v = row[idx];
            if (v === '' || v === null || v === undefined) return;
            const key = _k(r, cfg.col);
            const cell = ws[key] || {};
            if (typeof v === 'number') { cell.t = 'n'; cell.v = v; cell.z = cell.z || '0.00'; }
            else { cell.t = 's'; cell.v = String(v); }
            ws[key] = cell;
        });
    }
    const pretax = Number(opts.finalPrice) || 0;
    const tax = Math.round(pretax * 0.13 * 100) / 100;
    const totalIncl = Math.round((pretax + tax) * 100) / 100;
    const cellPre = ws[_k(TAX_ROW, _CONTRACT.TAX_PRETAX_COL)] || {};
    cellPre.t = 'n'; cellPre.v = pretax; cellPre.z = cellPre.z || '#,##0.00';
    ws[_k(TAX_ROW, _CONTRACT.TAX_PRETAX_COL)] = cellPre;
    const cellTax = ws[_k(TAX_ROW, _CONTRACT.TAX_TAX_COL)] || {};
    cellTax.t = 'n'; cellTax.v = tax; cellTax.z = cellTax.z || '#,##0.00';
    ws[_k(TAX_ROW, _CONTRACT.TAX_TAX_COL)] = cellTax;
    const cellTotalNum = ws[_k(TOTAL_ROW, _CONTRACT.TOTAL_AMOUNT_NUM_COL)] || {};
    cellTotalNum.t = 'n'; cellTotalNum.v = totalIncl; cellTotalNum.z = cellTotalNum.z || '#,##0.00';
    ws[_k(TOTAL_ROW, _CONTRACT.TOTAL_AMOUNT_NUM_COL)] = cellTotalNum;
    const cnTotal = _toChineseMoney(totalIncl);
    const cnKey = _k(TOTAL_ROW, _CONTRACT.TOTAL_AMOUNT_CN_COL);
    const cellCn = ws[cnKey] || {};
    cellCn.t = 's';
    const oldVal = (cellCn.v && typeof cellCn.v === 'string') ? cellCn.v : '';
    if (oldVal && /大写/.test(oldVal)) {
        const mm = oldVal.match(/^([^\uff1a:]+[\uff1a:])\s*/);
        const prefix = mm ? mm[1] : oldVal.replace(/[_壹贰叁肆伍陆柒捌玖拾佰仟万亿元角分整零负]+$/g, '').trim();
        cellCn.v = (prefix || '') + cnTotal;
    } else cellCn.v = cnTotal;
    ws[cnKey] = cellCn;
    const note = (opts.note || '').toString().trim();
    if (note) {
        const nk = _k(NOTE_ROW, NOTE_COL);
        const cn = ws[nk] || {};
        cn.t = 's'; cn.v = note; ws[nk] = cn;
    }
    return { wb, ws, offset, TAX_ROW, TOTAL_ROW, NOTE_ROW };
}

// —— 构造测试数据 ———————————————————————————————————————————————————
const MODELS = ['80','100','150','200','250','300','350','400','450','500','600','700','800','900','1000','1200'];
const items = MODELS.map((m, idx) => ({
    productType: '双向伞齿轮刀闸阀',
    productName: 'QCAZ543X-10P',
    model: m,
    bodyMaterial: idx % 3 === 0 ? 'CF8' : 'WCB',
    unitPrice: 1000 + idx * 50,
    maxPressure: '10',
    unitWeight: String(50 + idx * 5),
    laps: String(20 + idx),
    torque: String(300 + idx * 20),
    // 缺字段：gatePlateThickness / woodenBoxSize / moq / bevelGearCouplingModel（留空）
}));
const finalPrice = items.reduce((s, it) => s + Number(it.unitPrice), 0); // 不含税总价
const note = '本报价有效期 30 天，发货地点：温州，含木箱包装不含运费。';

const { wb, ws, offset, TAX_ROW, TOTAL_ROW, NOTE_ROW } = buildWorkbook(items, { finalPrice, note });

// —— 断言测试 ———————————————————————————————————————————————————————
let pass = 0; let fail = 0;
function assertEq(desc, actual, expected) {
    const ok = actual === expected;
    if (ok) { pass++; console.log('  ✅', desc, '=>', JSON.stringify(actual)); }
    else { fail++; console.log('  ❌', desc, ' expected=', JSON.stringify(expected), 'actual=', JSON.stringify(actual)); }
}
console.log('\n=== 基本结构 ===');
assertEq('offset = 3 (N=16, capacity=13)', offset, 3);
assertEq('TAX_ROW = 28 (原 25 + 3)', TAX_ROW, 28);
assertEq('TOTAL_ROW = 29 (原 26 + 3)', TOTAL_ROW, 29);
assertEq('NOTE_ROW = 42 (原 39 + 3)', NOTE_ROW, 42);

// 第 1 条产品（R13，索引 12）
console.log('\n=== 第 1 条产品 (R13/r=12) ===');
assertEq('产品名称', ws[_k(12,0)].v,  '双向伞齿轮刀闸阀 QCAZ543X-10P');
assertEq('型号',     ws[_k(12,7)].v,  'QCAZ543X-10P');
assertEq('规格',     ws[_k(12,15)].v, 'DN80');
assertEq('材质',     ws[_k(12,18)].v, 'CF8');
assertEq('闸板厚度', ws[_k(12,22)],   undefined); // 留空 -> 不存在
assertEq('单位',     ws[_k(12,25)].v, '台');
assertEq('MOQ',      ws[_k(12,27)],   undefined); // 留空
assertEq('单价',     ws[_k(12,28)].v, 1000);
assertEq('承压',     ws[_k(12,30)].v, '10');
assertEq('单重',     ws[_k(12,31)].v, '50');
assertEq('木箱',     ws[_k(12,34)],   undefined);

// 新增的第 14 条产品（R26 / r=25，应该被写入，而不是被税金覆盖）
console.log('\n=== 第 14 条产品（新增，r=25，原 TAX_ROW 位置现在是产品）===');
assertEq('规格 (第14条 DN900)', ws[_k(25,15)].v, 'DN900');
assertEq('材质 (第14条 WCB)',   ws[_k(25,18)].v, 'WCB');
assertEq('单价 (第14条 1650)',  ws[_k(25,28)].v, 1650);

// 第 16 条（最后一条，r=27）
console.log('\n=== 第 16 条产品（r=27）===');
assertEq('规格 DN1200', ws[_k(27,15)].v, 'DN1200');
assertEq('单价 1750',   ws[_k(27,28)].v, 1750);

// 税金汇总（下移后 R29 / r=28）
console.log('\n=== 税金/价税合计（r=28 税金，r=29 合计）===');
assertEq('不含税金额 (N29 = finalPrice)', ws[_k(28,13)].v, finalPrice);
const expectedTax = Math.round(finalPrice * 0.13 * 100) / 100;
assertEq('税额 (Z29 = finalPrice × 13%)', ws[_k(28,25)].v, expectedTax);
const expectedTotal = Math.round((finalPrice + expectedTax) * 100) / 100;
assertEq('价税合计小写 (Z30)', ws[_k(29,25)].v, expectedTotal);
assertEq('价税合计大写', ws[_k(29,0)].v, `价税合计（大写）：${_toChineseMoney(expectedTotal)}`);

// 备注（F43，r=42, c=5）
console.log('\n=== 备注 ===');
assertEq('R43 F 单元格备注', ws[_k(42,5)].v, note);

// Merge 完整性：检查是否还有 r=25 (原税金行 merge) 这种「错位到产品区」的 merge
console.log('\n=== Merges 一致性 ===');
const badMerge = (ws['!merges'] || []).find(m =>
    (m.s.r >= 12 && m.s.r <= 27) && (m.e.r >= _CONTRACT.TAX_ROW && m.e.r < _CONTRACT.TAX_ROW + 3)
);
assertEq('产品区 merge 不与原税金行 merge 交叉', !!badMerge, false);

// —— 导出 —————————————————————————————————————————————————————————
const outPath = '/tmp/contract_e2e.xlsx';
XLSX.writeFile(wb, outPath);
console.log('\n==>', pass, 'passed,', fail, 'failed.  xlsx 输出：', outPath);
process.exit(fail > 0 ? 1 : 0);
