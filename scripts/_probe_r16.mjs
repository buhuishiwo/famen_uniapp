import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
const ROOT = 'd:/Code/famen_uniapp/famen_uniapp';
const xlsx = fs.readFileSync(path.join(ROOT, 'document/奇胜阀门模板-农商行.xlsx'));
const z = await JSZip.loadAsync(xlsx);
const sheetXml = await z.file('xl/worksheets/sheet1.xml').async('string');
const ssXml = z.file('xl/sharedStrings.xml') ? await z.file('xl/sharedStrings.xml').async('string') : null;

const sst = [];
if (ssXml) {
  const m = ssXml.matchAll(/<si>([\s\S]*?)<\/si>/g);
  for (const mm of m) {
    let s = mm[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    sst.push(s);
  }
}
console.log('=== SST 全部 索引:值 ===');
for (let i = 0; i < sst.length; i++) {
  console.log('  [' + i + '] = ' + JSON.stringify(sst[i]));
}
console.log('\n=== R16 原始 XML（单元格粒度） ===');
// 提取 R16
const row16 = sheetXml.match(/<row r="16"[^>]*>([\s\S]*?)<\/row>/);
if (row16) {
  const cellRe = /<c [^>]*r="([A-Z]+16)"[^>]*>[\s\S]*?<\/c>|<c [^>]*r="([A-Z]+16)"[^>]*\/>/g;
  let cm;
  while ((cm = cellRe.exec(row16[1])) !== null) {
    const ref = cm[1] || cm[2];
    const full = cm[0];
    const tm = /t="([^"]+)"/.exec(full);
    const vm = /<v>([^<]+)<\/v>/.exec(full);
    const ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(full);
    let desc = '';
    if (ism) desc = ' inline=' + JSON.stringify(ism[1]);
    else if (vm) {
      if (tm && tm[1] === 's') { const i = +vm[1]; desc = ' sst[' + i + ']=' + JSON.stringify(sst[i] || ''); }
      else desc = ' v=' + vm[1];
    } else desc = ' (empty-placeholder)';
    console.log('   ' + ref + ' ' + desc + '  // ' + full.replace(/\s+/g, ' ').slice(0, 160));
  }
} else {
  console.log('   ❌ 未找到 R16');
}

console.log('\n=== 合并单元格（全部） ===');
const mcRe = /<mergeCell ref="([^"]+)"\/>/g;
let mc;
while ((mc = mcRe.exec(sheetXml)) !== null) {
  const ref = mc[1];
  const m2 = ref.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
  if (m2) {
    const r1 = +m2[2], r2 = +m2[4];
    if (r1 >= 10 && r1 <= 18 || r2 >= 10 && r2 <= 18) {
      console.log('   merge ' + ref + '  行范围: R' + r1 + '~R' + r2 + '  视觉跨度: ' + (colLetterToNum(m2[3]) - colLetterToNum(m2[1]) + 1) + ' 列');
    }
  }
}

console.log('\n=== R15/R16 检查（合并列 K~T 是否有左上角值写入？）===');
for (const targetRow of [15,16]) {
  const row = sheetXml.match(new RegExp(`<row r="${targetRow}"[^>]*>([\\s\\S]*?)<\\/row>`));
  if (row) {
    console.log(`R${targetRow} 存在的单元格:`);
    const cellRe = /r="([A-Z]+${targetRow})"/g;
    let cm2;
    while ((cm2 = cellRe.exec(row[1])) !== null) console.log('   ' + cm2[1]);
  }
}

function colLetterToNum(s) { let n = 0; for (let i = 0; i < s.length; i++) n = n * 26 + (s.charCodeAt(i) - 64); return n; }
