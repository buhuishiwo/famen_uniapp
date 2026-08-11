/**
 * 购销合同 xlsx 生成器
 *  —— 设计目标：100% 保留原始模板的 XF 索引（边框/字体/填充/数字格式/对齐/合并/公章图片）
 *  —— 实现方式：JSZip 级打开模板 xlsx → 只改 xl/worksheets/sheet1.xml 的文本和数字 → 重新压缩
 *  —— 对小程序/Node 均通用（JSZip 都可工作）
 *
 * 核心坐标（全部使用 Excel 1-based A1 引用 / 行号，和 XML 中的 r="13" 完全一致，避免 0/1-based 混乱）：
 */
const CFG = {
    // 原模板产品行 1-based 行号范围
    PRODUCT_ROW_FIRST: 13,
    PRODUCT_ROW_LAST_TPL: 25,      // 模板里最多 13 条
    HEADER_ROW: 12,
    TAX_ROW: 26,                   // 税金汇总行（Excel 行 26）
    TOTAL_ROW: 27,                 // 价税合计行（Excel 行 27）
    NOTE_CELL: 'F40',              // 备注单元格（模板 R40 F 列，原模板 R40 即为备注内容）
    // 单元格 A1 引用（模板原值位置）：
    //   R26 = A:M 合并块文本 "不含税金额（元）："；N:Y 合并 "税额（元）："；Z:AK 合并 "税率：13%"
    //   R27 = A:Y 合并 "价税合计（大写）："；Z:AK 合并 "价税合计（小写）：元"
    CELL_PRETAX: 'A26',            // 不含税金额（追加到 R26 大合并文本）
    CELL_TAX: 'N26',               // 税额（追加到 R26 N 大合并文本）
    CELL_RATE_LABEL: 'Z26',        // 税率文本 - 保留原模板不动
    CELL_TOTAL_NUM: 'Z27',         // 价税合计小写（追加到 R27 Z 大合并文本）
    CELL_TOTAL_CN: 'A27',          // 价税合计大写（追加到 R27 A 大合并文本）
    // 列映射：quoteData 字段 → A1 列（1-based 行之后会拼 A1）
    COL_MAP: [
        { col: 'A',  get: (it) => (it.productType ? it.productType + ' ' : '') + (it.productName || '') },
        { col: 'H',  get: (it) => it.productName || '' },
        { col: 'P',  get: (it) => it.model ? 'DN' + it.model : '' },
        { col: 'S',  get: (it) => it.bodyMaterial || '' },
        { col: 'W',  get: (it) => it.gatePlateThickness || '' },
        { col: 'Z',  get: () => '台' },
        { col: 'AB', get: (it) => it.moq || '' },
        { col: 'AC', get: (it) => {
            const v = Number(it.unitPrice);
            return (isNaN(v) || v === 0) ? '' : v;
        }, isNum: true },
        { col: 'AD', get: () => '' },
        { col: 'AE', get: (it) => it.maxPressure || '' },
        { col: 'AF', get: (it) => it.unitWeight || '' },
        { col: 'AG', get: (it) => it.laps || '' },
        { col: 'AH', get: (it) => it.torque || '' },
        { col: 'AI', get: (it) => it.woodenBoxSize || '' },
        { col: 'AJ', get: (it) => it.bevelGearCouplingModel || '' }
    ]
};

/**
 * 数字 → 人民币大写
 */
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

// ============== XML 文本操作工具（不使用 DOMParser，小程序无 DOM） ===============

/** 把 <c> A1 引用拆成 {col,row}（数字） */
function parseA1(a1) {
    const m = /^([A-Z]+)(\d+)$/.exec(a1);
    if (!m) throw new Error('bad A1: ' + a1);
    const colStr = m[1]; let col = 0;
    for (let i = 0; i < colStr.length; i++) col = col * 26 + (colStr.charCodeAt(i) - 64);
    return { colStr, col, row: parseInt(m[2], 10) };
}
function buildA1(colStr, row) { return colStr + row; }
function columnIndexToLetters(n) {
    let s = '';
    while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
}

/**
 * 从 sheet1.xml 文本中提取/替换 <row r="NN">...</row> 的 XML 片段
 * 返回 Map: 行号(1-based) → {outer, inner, attrs}
 * 同时返回 sheetData 前后的文本，以便后续拼接
 */
function splitSheetData(xml) {
    const sdOpen = xml.indexOf('<sheetData');
    const sdCloseIdx = xml.indexOf('</sheetData>');
    if (sdOpen < 0 || sdCloseIdx < 0) throw new Error('sheetData not found');
    const endOfOpenTag = xml.indexOf('>', sdOpen) + 1;
    const before = xml.slice(0, endOfOpenTag);
    const inner = xml.slice(endOfOpenTag, sdCloseIdx);
    const after = xml.slice(sdCloseIdx);
    // 匹配所有 <row ...>...</row>
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

function parseAttrs(s) {
    const out = {};
    const re = /([A-Za-z_:][\w\-:.]*)\s*=\s*"([^"]*)"/g;
    let m;
    while ((m = re.exec(s)) !== null) out[m[1]] = m[2];
    return out;
}

/**
 * 在一段 <row>inner（一串 <c>..</c>）中找到某个 A1 的 <c> 片段，并替换其内容
 * 兼容两种写法：
 *   自闭合：  <c r="AC13" s="12"/>
 *   普通闭合：<c r="AC13" s="12"><v>x</v></c>
 * 【关键：先检测自闭合再检测闭合】，否则 <c r="X" s="Y"/> 中的 /> 会被误拆解为 `/ + >`，
 *  导致闭包正则 `[^>]*>` 误把 Y/> 当作「属性字符串 + 开标签结束 >」，从而非贪婪吞掉后续的 c 到最近 </c>。
 */
function writeCellInRow(rowInner, cellA1, value) {
    const { colStr, row } = parseA1(cellA1);
    const ref = colStr + row;
    // 先匹配自闭合：<c ...r="REF"... />
    const reSelf = new RegExp(`<c\\s([^>]*r="${ref}"[^>]*?)\\s*\\/>`);
    let m = reSelf.exec(rowInner);
    let rawAttrs = '';
    let start, end;
    if (m) {
        rawAttrs = m[1];
        start = m.index;
        end = m.index + m[0].length;
    } else {
        // 再匹配普通闭合：<c ...r="REF"...> ... </c> —— 开标签结束 `>` 前必须不是 `/`
        const reClosed = new RegExp(`<c\\s([^>]*r="${ref}"[^>]*[^\\/])>([\\s\\S]*?)<\\/c>`);
        m = reClosed.exec(rowInner);
        if (!m) return rowInner;
        rawAttrs = m[1];
        start = m.index;
        end = m.index + m[0].length;
    }
    // 构造新 attrs：除 t 之外都保留（r / s / cm / vm / spans 等）
    const keepAttrs = [];
    const attrRe = /([A-Za-z_:][\w\-:.]*)\s*=\s*"([^"]*)"/g;
    let am;
    while ((am = attrRe.exec(rawAttrs)) !== null) {
        const k = am[1];
        if (k !== 't') keepAttrs.push(`${k}="${am[2]}"`);
    }
    let newAttrs = keepAttrs.join(' ');
    if (value === '' || value === null || value === undefined) {
        // 清空：保持 s，输出自闭合形式
        return rowInner.slice(0, start) + `<c ${newAttrs}/>` + rowInner.slice(end);
    }
    let newInner = '';
    if (typeof value === 'number') {
        newInner = `<v>${value}</v>`;
    } else {
        newAttrs += ' t="inlineStr"';
        const escaped = String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
        newInner = `<is><t xml:space="preserve">${escaped}</t></is>`;
    }
    const newCell = `<c ${newAttrs}>${newInner}</c>`;
    return rowInner.slice(0, start) + newCell + rowInner.slice(end);
}

/**
 * 解析 Excel 列字母 → 数字（A=1, Z=26, AA=27）
 */
function colLettersToNum(colStr) {
    let n = 0;
    for (let i = 0; i < colStr.length; i++) {
        n = n * 26 + (colStr.charCodeAt(i) - 64);
    }
    return n;
}

/**
 * 在 rowInner（<c>...</c><c>...</c>）的正确字母序位置插入一个自闭合 <c r="COLrowNum" s="sval"/>，返回修改后的 inner
 * 【重要】扫描现有 c 时，必须先匹配自闭合形式（防止 /> 误被拆解为 `/ + >`），再匹配普通闭合。
 */
function insertSelfCloseCell(rowInner, col, rowNum, sval) {
    const cur = []; // [{ref, colNum, start, end}]
    const reSelf = /<c\s[^>]*r="([A-Z]+)(\d+)"[^>]*?\/>\s*/g;
    const reClosed = /<c\s[^>]*r="([A-Z]+)(\d+)"[^>]*[^\/]>([\s\S]*?)<\/c>\s*/g;
    // 方案：先扫自闭合收集位置，再扫闭合收集位置，最后合并排序（按 start ASC）
    let m;
    while ((m = reSelf.exec(rowInner)) !== null) {
        cur.push({ ref: m[1]+m[2], colNum: colLettersToNum(m[1]), start: m.index, end: m.index+m[0].length });
    }
    while ((m = reClosed.exec(rowInner)) !== null) {
        cur.push({ ref: m[1]+m[2], colNum: colLettersToNum(m[1]), start: m.index, end: m.index+m[0].length });
    }
    cur.sort((a,b) => a.start - b.start);
    const newColNum = colLettersToNum(col);
    let insertPos = rowInner.length;
    for (let i = 0; i < cur.length; i++) {
        if (cur[i].colNum > newColNum) { insertPos = cur[i].start; break; }
    }
    if (cur.length > 0 && insertPos === rowInner.length) {
        insertPos = cur[cur.length - 1].end;
    }
    const newNode = `<c r="${col}${rowNum}" s="${sval}"/>`;
    return rowInner.slice(0, insertPos) + newNode + rowInner.slice(insertPos);
}

/**
 * 清空某行的所有列映射格（其它列保留原样）
 * colStyles: { colLetter: sNum }，若某列 <c> 不存在则先按此样式插入一个（空值自闭合即可保持样式）
 */
function clearRowForCols(rowInner, rowNum, colStyles) {
    let r = rowInner;
    CFG.COL_MAP.forEach(cfg => {
        const a1 = cfg.col + rowNum;
        const ref = cfg.col + rowNum;
        const exists = new RegExp(`<c\\s[^>]*r="${ref}"`).test(r);
        if (!exists && colStyles && colStyles[cfg.col] != null) {
            r = insertSelfCloseCell(r, cfg.col, rowNum, colStyles[cfg.col]);
        }
        r = writeCellInRow(r, a1, '');
    });
    return r;
}

/**
 * 在某行的各列映射格写入产品数据
 */
function writeRowProduct(rowInner, rowNum, item, colStyles) {
    let r = rowInner;
    CFG.COL_MAP.forEach(cfg => {
        const a1 = cfg.col + rowNum;
        const ref = cfg.col + rowNum;
        const exists = new RegExp(`<c\\s[^>]*r="${ref}"`).test(r);
        if (!exists && colStyles && colStyles[cfg.col] != null) {
            r = insertSelfCloseCell(r, cfg.col, rowNum, colStyles[cfg.col]);
        }
        const v = cfg.get(item);
        r = writeCellInRow(r, a1, v);
    });
    return r;
}

/**
 * 克隆 R13 为新行（r=newRowNum），返回 <row ...>...</row> 整个 XML
 * 思路：把原 R13 行整段字符串中的 r="13" 替换成 r="newNum"，并把内部所有 <c r="A13"> 等 A1 引用中的数字从 13 替换为 newNum。
 * 最后**清空该行的各列映射格的内容**（保持 s 样式索引），保证克隆出的新行是同样式的空白行。
 */
function cloneRow13To(row13Outer, newRowNum, colStyles) {
    let s = row13Outer;
    // 行属性 r="13"
    s = s.replace(/(<row\s[^>]*\br=")13("[^>]*>)/, `$1${newRowNum}$2`);
    // 每个 c 的 r="XX13"：用正则精准替换 r="(colLetters)13" → r="$1newNum"
    s = s.replace(/(<c\s[^>]*\br=")([A-Z]+)13("[^>]*>)/g, (_, pre, col, post) => `${pre}${col}${newRowNum}${post}`);
    // 提取 inner 清空写值格（保持样式 s）
    const openEnd = s.indexOf('>') + 1;
    const closeStart = s.lastIndexOf('</row>');
    const inner = s.slice(openEnd, closeStart);
    const cleared = clearRowForCols(inner, newRowNum, colStyles || null);
    return s.slice(0, openEnd) + cleared + s.slice(closeStart);
}

/**
 * 行号批量偏移：
 * 把整个 sheet1.xml 中 1-based 行号 >= threshold 的行号都 + offset
 * 影响：
 *   - <row r="NN">       行
 *   - <c r="..NN">       单元格引用
 *   - <mergeCell ref="A1:B2" 中每个 A1 的 r 部分
 *   - <dimension ref="A1:BD54"> 结束行
 * threshold 默认 = CFG.TAX_ROW (26)，即「税金行及以下」整体偏移
 */
function offsetAllRowNumbers(xml, threshold, offset) {
    if (!offset) return xml;
    const patterns = [
        // <row r="26">
        { re: /(<row\s[^>]*\br=")(\d+)("[^>]*>)/g, groups: [2], sep: [[1,3]] },
        // <c r="A26">, <c r="Z27" s="..">
        { re: /(<c\s[^>]*\br=")([A-Z]+)(\d+)("[^>]*>)/g, groups: [3], sep: [[1,4]] },
        // <mergeCell ref="A26:M26">：groups [1..6] = 前缀,col1,row1,:,col2,row2,后缀 （实际无冒号组，re 是：(<prefix>)(C1)(R1):(C2)(R2)(<suffix>)，groups 顺序：1=prefix,2=col1,3=row1,4=col2,5=row2,6=suffix）
        { re: /(<mergeCell\s+ref=")([A-Z]+)(\d+):([A-Z]+)(\d+)("[^>]*>)/g, groups: [3,5], sep: [[1,3], ':', [4,6]] },
        // <dimension ref="A1:BD54"> groups: 1,2,row1,3,4,row2,suffix
        { re: /(<dimension\s+ref=")([A-Z]+)(\d+):([A-Z]+)(\d+)("[^>]*>)/g, groups: [3,5], sep: [[1,3], ':', [4,6]] }
    ];
    let out = xml;
    patterns.forEach(p => {
        const numOffsets = p.groups;
        out = out.replace(p.re, (...args) => {
            const replaced = args.slice(1, -2); // 去掉 match / offset / string
            numOffsets.forEach(gIdx1Based => {
                const gi = gIdx1Based - 1;
                let n = parseInt(replaced[gi], 10);
                if (!isNaN(n) && n >= threshold) {
                    replaced[gi] = String(n + offset);
                }
            });
            if (p.sep === '') return replaced.join('');
            // sep 格式：数组，每一项是 replaced 的下标数组 [idx1,idx2]（取 replaced[idx1]..replaced[idx2] 连续拼接），或是字符串分隔符
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
 * 顶层入口：构建合同
 * @param {object} JSZip           JSZip 构造器（小程序端 import 后传进来）
 * @param {Uint8Array} templateU8  原始 xlsx 模板字节（不经过任何解析/改写）
 * @param {Array} items            产品数组，字段与 quoteData 对齐
 * @param {object} opts            { finalPrice: 不含税总价(number), note: 备注(string) }
 * @returns {Promise<Uint8Array>}  生成的 xlsx 字节
 */
async function buildContract(JSZip, templateU8, items, opts) {
    if (!items || !items.length) throw new Error('items empty');
    const N = items.length;
    const zip = await JSZip.loadAsync(templateU8);
    const sheetFile = zip.file('xl/worksheets/sheet1.xml');
    if (!sheetFile) throw new Error('sheet1.xml not found in template');
    let xml = await sheetFile.async('string');

    // 预先读取共享字符串表（模板中文本多为 t=s，数字是 idx）
    const SST = [];
    {
        const f = zip.file('xl/sharedStrings.xml');
        if (f) {
            const s = await f.async('string');
            const siRe = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
            let m;
            while ((m = siRe.exec(s)) !== null) {
                const si = m[1];
                let txt = '';
                const tRe = /<t\b([^>]*)>([\s\S]*?)<\/t>/g;
                let tm;
                while ((tm = tRe.exec(si)) !== null) {
                    txt += tm[2];
                }
                SST.push(txt);
            }
        }
    }

    // ---------- 1) 如果需要扩容，先把 TAX_ROW 及以后整体偏移 ----------
    const capacity = CFG.PRODUCT_ROW_LAST_TPL - CFG.PRODUCT_ROW_FIRST + 1; // 13
    const offset = Math.max(0, N - capacity);
    if (offset > 0) {
        xml = offsetAllRowNumbers(xml, CFG.TAX_ROW, offset);
    }

    // ---------- 2) 切分 sheetData ----------
    const sd = splitSheetData(xml);

    // 从原模板 R13..R25（产品区间）扫描 COL_MAP 列的样式 s 索引：构建 PRODUCT_COL_STYLES
    // （因为 Excel 允许省略「空内容+默认样式」单元格，某列在整个产品区间可能都不存在，但合并块邻近列一定存在 —— 如 Z 合并于 W~AA，s 同 W=45）
    const PRODUCT_COL_STYLES = {};
    (function buildColStyles() {
        const neededCols = CFG.COL_MAP.map(c => c.col);
        const neededSet = new Set(neededCols);
        const reSelfC = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*?)\/>/g;
        const reClosedC = /<c\s[^>]*r="([A-Z]+)(\d+)"([^>]*[^\/])>([\s\S]*?)<\/c>/g;
        // 1) 直接存在的列：扫描 R13..R25
        for (let rn = CFG.PRODUCT_ROW_FIRST; rn <= CFG.PRODUCT_ROW_LAST_TPL; rn++) {
            const rd = sd.rows.get(rn);
            if (!rd) continue;
            const inner = rd.inner;
            let m;
            while ((m = reSelfC.exec(inner)) !== null) {
                const col = m[1];
                if (!neededSet.has(col)) continue;
                if (PRODUCT_COL_STYLES[col] != null) continue;
                const attrs = `${m[1]} ${m[3]}`;
                const sm = /\bs="(\d+)"/.exec(attrs);
                if (sm) PRODUCT_COL_STYLES[col] = Number(sm[1]);
                else PRODUCT_COL_STYLES[col] = 0;
            }
            while ((m = reClosedC.exec(inner)) !== null) {
                const col = m[1];
                if (!neededSet.has(col)) continue;
                if (PRODUCT_COL_STYLES[col] != null) continue;
                const attrs = `${m[1]} ${m[3]}`;
                const sm = /\bs="(\d+)"/.exec(attrs);
                if (sm) PRODUCT_COL_STYLES[col] = Number(sm[1]);
                else PRODUCT_COL_STYLES[col] = 0;
            }
        }
        // 2) 仍然缺失的列：fallback 到「整个模板产品区中最近邻已知列的 s」（字母序距离最近）
        const pool = new Map(); // colLetter -> s
        for (let rn = CFG.PRODUCT_ROW_FIRST; rn <= CFG.PRODUCT_ROW_LAST_TPL; rn++) {
            const rd = sd.rows.get(rn);
            if (!rd) continue;
            const inner = rd.inner;
            let m;
            while ((m = reSelfC.exec(inner)) !== null) {
                const col = m[1];
                if (pool.has(col)) continue;
                const attrs = `${m[1]} ${m[3]}`;
                const sm = /\bs="(\d+)"/.exec(attrs);
                if (sm) pool.set(col, Number(sm[1]));
            }
            while ((m = reClosedC.exec(inner)) !== null) {
                const col = m[1];
                if (pool.has(col)) continue;
                const attrs = `${m[1]} ${m[3]}`;
                const sm = /\bs="(\d+)"/.exec(attrs);
                if (sm) pool.set(col, Number(sm[1]));
            }
        }
        const poolCols = Array.from(pool.keys()).sort((a,b) => colLettersToNum(a)-colLettersToNum(b));
        neededCols.forEach(col => {
            if (PRODUCT_COL_STYLES[col] != null) return;
            // 找左右最近的
            const target = colLettersToNum(col);
            let best = null, bestDist = Infinity;
            poolCols.forEach(pc => {
                const d = Math.abs(colLettersToNum(pc) - target);
                if (d < bestDist) { bestDist = d; best = pc; }
            });
            if (best != null) PRODUCT_COL_STYLES[col] = pool.get(best);
            else PRODUCT_COL_STYLES[col] = 0;
        });
    })();

    // ---------- 3) 确定扩容后的「新增行」：R26..R(13+N-1) 需要克隆 R13 的结构 ----------
    if (offset > 0) {
        // 先拿到原 R13 的 XML（偏移后它还在 rows.get(13)，因为 threshold=26 未改 R13）
        const row13 = sd.rows.get(CFG.PRODUCT_ROW_FIRST);
        if (!row13) throw new Error('R13 not found');
        const newRowsStart = CFG.PRODUCT_ROW_LAST_TPL + 1;
        const newRowsCount = offset;
        const row25 = sd.rows.get(CFG.PRODUCT_ROW_LAST_TPL);
        if (!row25) throw new Error('R25 not found');
        const row26Start = row25.end;
        const clones = [];
        for (let i = 0; i < newRowsCount; i++) {
            const newRowNum = newRowsStart + i;
            clones.push(cloneRow13To(row13.outer, newRowNum, PRODUCT_COL_STYLES));
        }
        const inserted = clones.join('\n');
        const newInner = sd.innerRaw.slice(0, row26Start) + '\n' + inserted + '\n' + sd.innerRaw.slice(row26Start);
        xml = sd.before + newInner + sd.after;
    }

    // 重新 split（上面两种路径后 rows 都完整）
    const sd2 = splitSheetData(xml);

    // ---------- 4) 清空产品区：R_FIRST .. max(R_FIRST+N-1, 25) ----------
    const R_END = Math.max(CFG.PRODUCT_ROW_FIRST + N - 1, CFG.PRODUCT_ROW_LAST_TPL);
    const newRowOuters = new Map();
    for (let r = CFG.PRODUCT_ROW_FIRST; r <= R_END; r++) {
        const row = sd2.rows.get(r);
        if (!row) continue;
        let newInner = clearRowForCols(row.inner, r, PRODUCT_COL_STYLES);
        const idx = r - CFG.PRODUCT_ROW_FIRST;
        if (idx < N) {
            newInner = writeRowProduct(newInner, r, items[idx], PRODUCT_COL_STYLES);
        }
        const newOuter = `<row ${row.rawAttrs}>${newInner}</row>`;
        newRowOuters.set(r, newOuter);
    }
    // 替换 sheet1.xml 中的每个 row
    let finalInner = sd2.innerRaw;
    // 按行号从大到小替换，避免替换后字符串长度变化影响其它 outer 的 start/end
    const rowNumsDesc = Array.from(sd2.rows.keys()).sort((a, b) => b - a);
    rowNumsDesc.forEach(rn => {
        if (!newRowOuters.has(rn)) return;
        const row = sd2.rows.get(rn);
        finalInner = finalInner.slice(0, row.start) + newRowOuters.get(rn) + finalInner.slice(row.end);
    });
    let finalXml = sd2.before + finalInner + sd2.after;

    // ---------- 5) 写税金/合计/备注（这些行如果偏移过，已在步骤1移动） ----------
    const pretax = Number(opts.finalPrice) || 0;
    const tax = Math.round(pretax * 0.13 * 100) / 100;
    const totalIncl = Math.round((pretax + tax) * 100) / 100;
    // 关键：步骤 1 对 sheet1.xml 执行了 offsetAllRowNumbers(TAX_ROW, offset)，将 >= TAX_ROW 的行号整体 +offset。
    // 因此写入税金/合计/备注时，需要用「偏移后的 A1」。
    function offA1(a1) {
        const p = parseA1(a1);
        if (p.row >= CFG.TAX_ROW) return `${p.colStr}${p.row + offset}`;
        return a1;
    }
    const C_PRETAX   = offA1(CFG.CELL_PRETAX);
    const C_TAX      = offA1(CFG.CELL_TAX);
    const C_TOTAL_N  = offA1(CFG.CELL_TOTAL_NUM);
    const C_TOTAL_CN = offA1(CFG.CELL_TOTAL_CN);
    const C_NOTE     = offA1(CFG.NOTE_CELL);
    // 写单元格：helper 直接改写 finalXml 中某 A1 单元格（与行写入实现相同逻辑）
    function writeGlobalCell(a1, value) {
        const { row } = parseA1(a1);
        const sd3 = splitSheetData(finalXml);
        const rowData = sd3.rows.get(row);
        if (!rowData) return;
        const newInner = writeCellInRow(rowData.inner, a1, value);
        const newOuter = `<row ${rowData.rawAttrs}>${newInner}</row>`;
        // 替换
        let inner2 = sd3.innerRaw.slice(0, rowData.start) + newOuter + sd3.innerRaw.slice(rowData.end);
        finalXml = sd3.before + inner2 + sd3.after;
    }

    // 税金/合计 三格：原模板 R26 有 3 个大合并（A26:M26 / N26:Y26 / Z26:AK26），
    // 里面是纯文本标签："不含税金额（元）：" / "税额（元）：" / "税率：13%"。
    // 本模板没有单独的数字格，因此将实际数字直接追加到对应标签字符串之后。
    function fmtMoney(n) {
        // 千分位 + 两位小数，前面加 ¥
        const neg = n < 0;
        const s = Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return (neg ? '-¥' : '¥') + s;
    }
    // 先读原标签，保证兼容中文/英文或以后改模板
    const readCellText = (a1) => {
        const { row } = parseA1(a1);
        const sdx = splitSheetData(finalXml);
        const rd = sdx.rows.get(row);
        if (!rd) return null;
        const colStr = parseA1(a1).colStr;
        const ref = colStr + row;
        // 闭合形式
        let re = new RegExp(`<c\\s([^>]*r="${ref}"[^>]*)>([\\s\\S]*?)<\\/c>`);
        let m = re.exec(rd.inner);
        let attrs = '';
        let cInner = '';
        if (m) { attrs = m[1]; cInner = m[2]; }
        else {
            // 自闭合：无内容，返回 ''
            const re2 = new RegExp(`<c\\s[^>]*r="${ref}"[^>]*?\\/>`);
            if (re2.exec(rd.inner)) return '';
            return null;
        }
        // inlineStr 形式：<is><t>xxx</t></is>
        const ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(cInner);
        if (ism) return ism[1];
        // t="s"（共享字符串）：<v>idx</v>
        if (/\bt="s"/.test(attrs)) {
            const vm = /<v>([^<]+)<\/v>/.exec(cInner);
            if (vm) {
                const idx = parseInt(vm[1], 10);
                if (!isNaN(idx) && SST[idx] !== undefined) return SST[idx];
            }
            return null;
        }
        // 其他：数字 <v>xxx</v>
        const vm2 = /<v>([^<]+)<\/v>/.exec(cInner);
        if (vm2) return vm2[1];
        return '';
    };
    // 不含税金额：写 A(TAX_ROW+offset)
    (function writePreTax() {
        const a1 = C_PRETAX;
        const txt = readCellText(a1);
        const prefix = txt ? (txt.trim().includes('：') ? txt : '不含税金额（元）：') : '不含税金额（元）：';
        writeGlobalCell(a1, prefix + fmtMoney(pretax));
    })();
    // 税额：写 N(TAX_ROW+offset)
    (function writeTax() {
        const a1 = C_TAX;
        const txt = readCellText(a1);
        const prefix = txt ? (txt.trim().includes('：') ? txt : '税额（元）：') : '税额（元）：';
        writeGlobalCell(a1, prefix + fmtMoney(tax));
    })();
    // 税率 - 保留模板原文，不覆盖
    // 价税合计小写：写 Z(TOTAL_ROW+offset)（模板 R27 Z 列 = "价税合计（小写）：元"）
    (function writeTotalNum() {
        const a1 = C_TOTAL_N;
        const txt = readCellText(a1);
        let prefix = '价税合计（小写）：';
        let suffix = ' 元';
        if (txt) {
            const t = txt.trim();
            if (t.endsWith('元')) {
                const cut = t.slice(0, t.length - 1).replace(/：$/, '').trim();
                prefix = cut + '：';
                suffix = ' 元';
            } else if (t.includes('：')) {
                prefix = t.split('：')[0] + '：';
            } else prefix = t + '：';
        }
        writeGlobalCell(a1, prefix + fmtMoney(totalIncl) + suffix);
    })();
    // 大写：保留前缀「价税合计（大写）：」后加数字中文
    (function readOriginalTotal() {
        const sdCap = splitSheetData(finalXml);
        const cellA1 = C_TOTAL_CN;
        const { row } = parseA1(cellA1);
        const rd = sdCap.rows.get(row);
        if (!rd) {
            writeGlobalCell(cellA1, '价税合计（大写）：' + toChineseMoney(totalIncl));
            return;
        }
        const colStr = parseA1(cellA1).colStr;
        const ref = colStr + row;
        const re = new RegExp(`<c\\s[^>]*r="${ref}"[^>]*>([\\s\\S]*?)<\\/c>`);
        const m = re.exec(rd.inner);
        let txt = '';
        if (m) {
            const cInner = m[1];
            const ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(cInner);
            if (ism) txt = ism[1];
        }
        let prefix = '价税合计（大写）：';
        if (txt && /大写/.test(txt)) {
            const mm = txt.match(/^([^\uff1a:]+[\uff1a:])\s*/);
            if (mm) prefix = mm[1];
            else {
                const stripped = txt.replace(/[_壹贰叁肆伍陆柒捌玖拾佰仟万亿元角分整零负]+$/g, '').trim();
                if (stripped) prefix = stripped;
            }
        }
        writeGlobalCell(cellA1, prefix + toChineseMoney(totalIncl));
    })();

    // 备注
    if (opts.note && String(opts.note).trim()) {
        writeGlobalCell(C_NOTE, String(opts.note).trim());
    }

    // ---------- 6) 替换 zip 中的 sheet1.xml，重新打包 ----------
    zip.file('xl/worksheets/sheet1.xml', finalXml);
    const out = await zip.generateAsync({
        type: 'uint8array',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
    });
    return out;
}

module.exports = {
    CFG,
    toChineseMoney,
    parseA1,
    buildContract,
    // 单测用
    _splitSheetData: splitSheetData,
    _writeCellInRow: writeCellInRow,
    _cloneRow13To: cloneRow13To,
    _offsetAllRowNumbers: offsetAllRowNumbers,
    _clearRowForCols: clearRowForCols,
    _writeRowProduct: writeRowProduct
};
