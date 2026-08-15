#!/usr/bin/env node
/* eslint-disable */
/**
 * 6 个合同模板：逐列详细探查产品样例行的每一列字母、样式索引、共享字符串内容
 *   用于重新确定「产品名称 / 型号规格 / 产品描述 / 数量 / 单价 / 金额（+备注）」对应 A~? 列
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const DOC_DIR = path.join(__dirname, '..', 'document');
const TEMPLATE_FILES = [
  { key: 'chisun_v1',         file: 'QCAZ543X-10P+CHISUN商标价格1.xlsx', family: 'cn_contract' },
  { key: 'chisun_nsh',        file: '奇胜阀门模板-农商行.xlsx',            family: 'cn_contract' },
  { key: 'zs_changsheng',     file: '浙江长胜阀门模板-农行支付.xlsx',        family: 'cn_contract' },
  { key: 'pi_changqi',        file: 'Changqi模板.xlsx',                     family: 'en_pi' },
  { key: 'pi_chisun_multi',   file: 'ChisunIMPORT+模板-农行人民币美元欧元付款.xlsx', family: 'en_pi' },
  { key: 'pi_chisun_vtb',     file: 'ChisunIMPORT模板-VTB人民币付款（俄罗斯专用.xlsx', family: 'en_pi' }
];

function readSST(zip) {
  return (async () => {
    const f = zip.file('xl/sharedStrings.xml');
    if (!f) return [];
    const s = await f.async('string');
    const arr = [];
    const siRe = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = siRe.exec(s)) !== null) {
      let txt = '';
      const tRe = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
      let tm;
      while ((tm = tRe.exec(m[1])) !== null) txt += tm[1];
      arr.push(txt);
    }
    return arr;
  })();
}

function parseA1(a1) {
  const m = /^([A-Z]+)(\d+)$/.exec(a1);
  return m ? { colStr: m[1], row: Number(m[2]) } : null;
}
function colToNum(cs) {
  let n = 0;
  for (let i = 0; i < cs.length; i++) n = n * 26 + (cs.charCodeAt(i) - 64);
  return n;
}

(async () => {
  for (const tpl of TEMPLATE_FILES) {
    const filePath = path.join(DOC_DIR, tpl.file);
    if (!fs.existsSync(filePath)) {
      console.log('\n========== ❌ 文件不存在: ' + filePath + ' ==========');
      continue;
    }
    console.log('\n====================================================================================');
    console.log('  模板 [' + tpl.key + ']  family=' + tpl.family + '   文件=' + tpl.file);
    console.log('====================================================================================');
    try {
      const buf = fs.readFileSync(filePath);
      const zip = await JSZip.loadAsync(buf);
      const SST = await readSST(zip);
      const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');

      // 1) 找所有 merge 单元格（帮助定位表头）
      const merges = [];
      const mergeRe = /<mergeCell\s+ref="([A-Z]+\d+):([A-Z]+\d+)"[^>]*\/>/g;
      let mM;
      while ((mM = mergeRe.exec(sheet)) !== null) {
        merges.push({ a1: mM[1], a2: mM[2], p1: parseA1(mM[1]), p2: parseA1(mM[2]) });
      }
      // 打印 产品样例行附近（R10..R18）的 merge 覆盖情况
      const NEAR_ROWS = tpl.family === 'cn_contract' ? [10,11,12,13,14,15,16] : [3,4,5,6,7,8];
      const nearbyMerges = merges.filter(m => NEAR_ROWS.some(r => m.p1.row <= r && r <= m.p2.row));
      if (nearbyMerges.length) {
        console.log('\n  附近 mergeCells（产品行±3行范围）:');
        nearbyMerges.slice(0, 20).forEach(m => {
          console.log('    ' + m.a1 + ':' + m.a2 + '  (行' + m.p1.row + '~' + m.p2.row + '  列' + m.p1.colStr + '~' + m.p2.colStr + ')');
        });
        if (nearbyMerges.length > 20) console.log('    ... 另 ' + (nearbyMerges.length-20) + ' 条省略');
      }

      // 2) 逐行扫描 sheetData，找到产品样例行（根据 FAMILY_CFG 的 PRODUCT_ROW_FIRST/LIST 猜测：13/12/5）
      //    为了不过度依赖配置，打印 R4..R30 的每一行：行号+行数+首列字母+最后列字母
      console.log('\n  逐行明细（R4..R30）：');
      const rowRe = /<row\s+r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
      let rowM;
      while ((rowM = rowRe.exec(sheet)) !== null) {
        const rn = Number(rowM[1]);
        if (rn < 4 || rn > 30) continue;
        const inner = rowM[2];
        // 提取每一列
        const cols = [];
        const cSelf = /<c\s+r="([A-Z]+)(\d+)"([^>]*?)\/>/g;
        const cClose = /<c\s+r="([A-Z]+)(\d+)"([^>]*[^\/])>([\s\S]*?)<\/c>/g;
        let mc, md;
        while ((mc = cSelf.exec(inner)) !== null) {
          if (Number(mc[2]) !== rn) continue;
          let val = '';
          const sAttr = /\bs="(\d+)"/.exec(mc[3]);
          const tAttr = /\bt="([a-z]+)"/.exec(mc[3]);
          if (tAttr && tAttr[1] === 's') {
            const vm = /<v>([\s\S]*?)<\/v>/.exec(mc[0]);
            if (vm) val = 'SST[' + vm[1] + ']=' + JSON.stringify(SST[Number(vm[1])] || '');
          }
          cols.push({ colStr: mc[1], s: sAttr ? Number(sAttr[1]) : 0, t: tAttr ? tAttr[1] : '', val, selfClose: true });
        }
        while ((md = cClose.exec(inner)) !== null) {
          if (Number(md[2]) !== rn) continue;
          let val = '';
          const sAttr = /\bs="(\d+)"/.exec(md[3]);
          const tAttr = /\bt="([a-z]+)"/.exec(md[3]);
          if (tAttr && tAttr[1] === 's') {
            const vm = /<v>([\s\S]*?)<\/v>/.exec(md[4]);
            if (vm) val = 'SST[' + vm[1] + ']=' + JSON.stringify(SST[Number(vm[1])] || '');
          } else if (tAttr && tAttr[1] === 'inlineStr') {
            const tm = /<t[^>]*>([\s\S]*?)<\/t>/.exec(md[4]);
            if (tm) val = 'inlineStr=' + JSON.stringify(tm[1]);
          } else {
            const vm = /<v>([\s\S]*?)<\/v>/.exec(md[4]);
            if (vm) val = 'n=' + vm[1];
          }
          cols.push({ colStr: md[1], s: sAttr ? Number(sAttr[1]) : 0, t: tAttr ? tAttr[1] : '', val, selfClose: false });
        }
        cols.sort((a,b) => colToNum(a.colStr) - colToNum(b.colStr));
        const firstCol = cols[0] ? cols[0].colStr : '-';
        const lastCol = cols.length ? cols[cols.length-1].colStr : '-';
        const line = ['  R' + String(rn).padStart(2,' '), `cols=${String(cols.length).padStart(2,' ')}`, `range=${firstCol}..${lastCol}`].join(' ');
        console.log(line);
        // 逐列打印（每列：字母[s#]=值预览）
        cols.forEach(c => {
          const valShort = (c.val || '').length > 70 ? c.val.slice(0, 70) + '…' : c.val;
          console.log('      ' + String(c.colStr).padEnd(3,' ') + `[s=${c.s},t=${c.t||'-'}] ` + valShort);
        });
      }
    } catch (e) {
      console.log('  ❌ 解析失败:', String(e).slice(0, 300));
      console.log(e && e.stack ? e.stack.split('\n').slice(0,3).join('\n') : '');
    }
  }
})();
