#!/usr/bin/env node
/* eslint-disable */
/**
 * 精确诊断 6 套生成模板的写入内容是否在正确的列
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const FILES = [
  { key: 'chisun_v1',     file: '/tmp/contract_e2e_chisun_v1.xlsx',     family: 'cn_complex14' },
  { key: 'chisun_nsh',    file: '/tmp/contract_e2e_chisun_nsh.xlsx',    family: 'cn_simple6' },
  { key: 'zs_changsheng', file: '/tmp/contract_e2e_zs_changsheng.xlsx', family: 'cn_simple6' },
  { key: 'pi_changqi',    file: '/tmp/contract_e2e_pi_changqi.xlsx',    family: 'en_simple7' },
  { key: 'pi_chisun_multi',file:'/tmp/contract_e2e_pi_chisun_multi.xlsx',family:'en_simple7' },
  { key: 'pi_chisun_vtb', file: '/tmp/contract_e2e_pi_chisun_vtb.xlsx', family: 'en_simple7' }
];

function colNum(n) {
  let s = '';
  n = Math.floor(n);
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
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
function readCell(sheet, SST, a1) {
  const m = /^([A-Z]+)(\d+)$/.exec(a1);
  if (!m) return null;
  const colStr = m[1], row = m[2];
  const ref = colStr + row;
  // 注意：自闭合 <c ... /> 和开闭 <c ...>...</c> 是两个分支，
  //       用 ([^/>]*) 而非 ([^>]*)，避免把 '/><c r=B12...' 这种后续整行吞进 attrs
  const reSelf = new RegExp(`<c\\s([^>]*)r="${ref}"([^/]*?)\\s*\\/>`);
  let ms = reSelf.exec(sheet);
  if (ms) {
    // 自闭合单元格 → 空内容
    const attrs = ms[1] + ' ' + ms[2];
    // 如果 attrs 里有 t="s"，自闭合一般不会有，但保护一下
    if (/\bt="s"/.test(attrs)) return '';
    return '';
  }
  const reClosed = new RegExp(`<c\\s([^>]*)r="${ref}"([^>]*)>([\\s\\S]*?)<\\/c>`);
  const mc = reClosed.exec(sheet);
  if (!mc) return null;
  const attrs = mc[1] + ' ' + mc[2];
  const inner = mc[3] || '';
  const ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(inner);
  if (ism) return ism[1];
  if (/\bt="s"/.test(attrs)) {
    const vm = /<v>([^<]+)<\/v>/.exec(inner);
    if (vm) return SST[parseInt(vm[1], 10)] || '';
  }
  const vn = /<v>([^<]+)<\/v>/.exec(inner);
  return vn ? vn[1] : '';
}

(async () => {
  for (const f of FILES) {
    if (!fs.existsSync(f.file)) { console.log('❌ 不存在:', f.file); continue; }
    const zip = await JSZip.loadAsync(fs.readFileSync(f.file));
    const SST = await readSST(zip);
    const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
    console.log('\n===========================================================================');
    console.log('  模板 [' + f.key + ']  family=' + f.family);
    console.log('===========================================================================');
    if (f.family === 'cn_simple6') {
      console.log('  R12（产品行，3 条产品 → R12,R13,R14）：');
      for (let r = 12; r <= 14; r++) {
        const A = readCell(sheet, SST, 'A' + r);   // 产品名称（应为空）
        const H = readCell(sheet, SST, 'H' + r);   // 型号规格
        const P = readCell(sheet, SST, 'P' + r);   // 产品描述（中文规格组合）
        const AG= readCell(sheet, SST, 'AG'+ r);   // 数量
        const AJ= readCell(sheet, SST, 'AJ'+ r);   // 单价
        const AK= readCell(sheet, SST, 'AK'+ r);   // 金额
        const AQ= readCell(sheet, SST, 'AQ'+ r);   // 备注（应为空）
        console.log('    R' + r + ':');
        console.log('      A(产品名,应空)=' + (A == null || A === '' ? '✅ 空' : '❌ 非空: ' + String(A).slice(0, 60)));
        console.log('      H(型号规格)   = ' + String(H).slice(0, 80));
        console.log('      P(中文规格)   = ' + String(P).slice(0, 100));
        console.log('      AG(数量)      = ' + AG);
        console.log('      AJ(单价)      = ' + AJ);
        console.log('      AK(总价)      = ' + AK);
        console.log('      AQ(备注,应空) = ' + (AQ == null || AQ === '' ? '✅ 空' : '❌ 非空: ' + String(AQ).slice(0, 60)));
      }
      // 税金/合计（R15,R16,R17 = 如果 offset 了 2 行的话）
      console.log('  R15（税金行，如果 offset=2 应是原 R13+2=R15）：');
      const rTax = 12 + 3 - 1 + 1; // PRODUCT_FIRST=12 + N=3 > CAPACITY=1 → offset=2，TAX_ROW(13)+2=15
      console.log('    A' + rTax + ' (不含税金额): ' + String(readCell(sheet, SST, 'A' + rTax)).slice(0, 100));
      console.log('    V' + rTax + ' (税额数字):   ' + readCell(sheet, SST, 'V' + rTax));
      console.log('    AC' + rTax + '(税率标签):   ' + String(readCell(sheet, SST, 'AC' + rTax)).slice(0, 100));
      const rTot = rTax + 1;
      console.log('  R' + rTot + '（合计行）：');
      console.log('    A' + rTot + ' (价税合计大写): ' + String(readCell(sheet, SST, 'A' + rTot)).slice(0, 100));
      console.log('    AC' + rTot + '(价税合计小写): ' + String(readCell(sheet, SST, 'AC' + rTot)).slice(0, 100));
    } else if (f.family === 'en_simple7') {
      console.log('  R5..R7（产品行 3 条）：');
      for (let r = 5; r <= 7; r++) {
        const A = readCell(sheet, SST, 'A' + r);
        const B = readCell(sheet, SST, 'B' + r);
        const C = readCell(sheet, SST, 'C' + r);
        const D = readCell(sheet, SST, 'D' + r);
        const G = readCell(sheet, SST, 'G' + r);
        const H = readCell(sheet, SST, 'H' + r);
        const I = readCell(sheet, SST, 'I' + r);
        const J = readCell(sheet, SST, 'J' + r);
        console.log('    R' + r + ':');
        console.log('      A(序号)       = ' + A);
        console.log('      B(英文产品名) = ' + String(B).slice(0, 100));
        console.log('      C(型号规格)   = ' + String(C).slice(0, 80));
        console.log('      D(英文规格)   = ' + String(D).slice(0, 100));
        console.log('      G(数量)       = ' + G);
        console.log('      H(单价)       = ' + H);
        console.log('      I(总价)       = ' + I);
        console.log('      J(备注应空)   = ' + (J == null || J === '' ? '✅ 空' : '❌ 非空: ' + String(J).slice(0, 60)));
      }
      const rTot = 5 + 3 - 1 + 1; // offset = max(0, 3-1) = 2 → TOTAL_ROW(6)+2 = 8
      console.log('  R' + rTot + '（总价行 I 列）：I' + rTot + ' = ' + readCell(sheet, SST, 'I' + rTot));
    } else {
      console.log('  cn_complex14 暂时跳过（chisun_v1 原 14 列，不是本次重点）');
    }
  }
})();
