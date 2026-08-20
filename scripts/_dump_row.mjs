#!/usr/bin/env node
// 快速检查：产品行 A 列（产品名称）是否为空
import fs from 'node:fs';
import JSZip from 'jszip';
const path = process.argv[2] || 'static-hosting/zs_changsheng_N=2_缩容-2行.xlsx';
const zip = await JSZip.loadAsync(fs.readFileSync(path));
const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
const sst = await (zip.file('xl/sharedStrings.xml')?.async('string') || Promise.resolve(null));
const SST = sst ? [...sst.matchAll(/<si>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/si>/g)].map(m=>m[1]) : [];
const rows = [12,13,14,15,16,17,18];
for (const r of rows) {
  const rowRe = new RegExp(`<row[^>]*r="${r}"[^>]*>([\\s\\S]*?)<\\/row>`);
  const m = rowRe.exec(sheet);
  if (!m) { console.log(`R${r}: MISSING`); continue; }
  console.log(`\n—— R${r} ——`);
  const cellRe = /<c [^>]*?r="([A-Z]+)(\d+)"([^>]*)>([\s\S]*?)<\/c>|<c [^>]*?r="([A-Z]+)(\d+)"([^>]*)\/>/g;
  let cm;
  while ((cm = cellRe.exec(m[1])) !== null) {
    const col = cm[1] || cm[5], row = cm[2] || cm[6], rest = cm[3] || cm[7];
    const ci = cm[4] || '';
    let val = '';
    if (/t="s"/.test(rest)) { const idx = Number(ci.match(/<v>(\d+)<\/v>/)?.[1]); val = 'SST['+idx+'] "'+SST[idx]+'"'; }
    else if (/<is>/.test(ci)) val = 'inline "' + (ci.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] || '') + '"';
    else if (/<v>/.test(ci)) val = 'v=' + ci.match(/<v>([\s\S]*?)<\/v>/)?.[1];
    else if (/<f>/.test(ci)) val = '=' + ci.match(/<f>([\s\S]*?)<\/f>/)?.[1];
    console.log(`  ${col}${row}  ${val}`);
  }
}
