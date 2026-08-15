#!/usr/bin/env node
/* eslint-disable */
/**
 * 列出 document/ 目录下所有 6 个 xlsx，打印：
 *   1) 表头标题所在行（第 N 行）
 *   2) 那一行所有共享字符串的内容（显示表头列名，用来判断是「14列复杂格式」还是「6列简单格式」）
 *   3) 产品样例行（表头下一行）的所有有内容的单元格
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const DOC_DIR = path.join(__dirname, '..', 'document');
const ALL_FILES = [
  'QCAZ543X-10P+CHISUN商标价格1.xlsx',
  '奇胜阀门模板-农商行.xlsx',
  '浙江长胜阀门模板-农行支付.xlsx',
  'Changqi模板.xlsx',
  'ChisunIMPORT+模板-农行人民币美元欧元付款.xlsx',
  'ChisunIMPORT模板-VTB人民币付款（俄罗斯专用.xlsx'
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

(async () => {
  for (const file of ALL_FILES) {
    const fp = path.join(DOC_DIR, file);
    if (!fs.existsSync(fp)) {
      console.log('\n❌ 文件不存在: ' + file);
      continue;
    }
    const st = fs.statSync(fp);
    console.log('\n============================================================================');
    console.log('  文件: ' + file + '  大小: ' + (st.size/1024).toFixed(1) + 'KB');
    console.log('============================================================================');
    try {
      const zip = await JSZip.loadAsync(fs.readFileSync(fp));
      const SST = await readSST(zip);
      const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
      // 找所有 row 打印 R3..R25 的每个单元格内容（共享字符串直接解析成文本）
      const rowRe = /<row\s+r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
      let rm;
      while ((rm = rowRe.exec(sheet)) !== null) {
        const rn = Number(rm[1]);
        if (rn < 3 || rn > 25) continue;
        const cells = [];
        const cRe = /<c\s+r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
        let cm;
        while ((cm = cRe.exec(rm[2])) !== null) {
          const r = cm[1];
          const attrs = cm[2];
          const inner = cm[3] || '';
          const tAttr = /\bt="([a-z]+)"/.exec(attrs);
          let txt = '';
          if (tAttr && tAttr[1] === 's') {
            const vm = /<v>([\s\S]*?)<\/v>/.exec(inner);
            if (vm) txt = SST[Number(vm[1])] || '';
          } else if (tAttr && tAttr[1] === 'inlineStr') {
            const tm = /<t[^>]*>([\s\S]*?)<\/t>/.exec(inner);
            if (tm) txt = tm[1];
          } else {
            const vm = /<v>([\s\S]*?)<\/v>/.exec(inner);
            if (vm) txt = '[n]' + vm[1];
          }
          if (txt) cells.push({ r, txt });
        }
        if (cells.length) {
          console.log('\n  R' + String(rn).padStart(2,' ') + ':');
          cells.forEach(c => {
            const s = c.txt.length > 50 ? c.txt.slice(0, 50) + '…' : c.txt;
            console.log('    ' + String(c.r).padEnd(5,' ') + ' → ' + s.replace(/\n/g,'\\n'));
          });
        }
      }
    } catch (e) {
      console.log('  ❌ 解析失败: ' + String(e).slice(0, 200));
    }
  }
})();
