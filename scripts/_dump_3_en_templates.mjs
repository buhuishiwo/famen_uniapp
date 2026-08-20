#!/usr/bin/env node
// Dump 3 份英文模板的行列结构、合并单元格，确定 FAMILY_CFG 参数
import fs from 'node:fs';
import JSZip from 'jszip';
const SNAPS = [
  { key: 'pi_changqi',       path: '../utils/tpl_pi_changqi.json',       label: 'Changqi 英文 PI' },
  { key: 'pi_chisun_multi',  path: '../utils/tpl_pi_chisun_multi.json',  label: 'Chisun 多币种 PI' },
  { key: 'pi_chisun_vtb',    path: '../utils/tpl_pi_chisun_vtb.json',    label: 'Chisun VTB PI' }
];
const _B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const _B64_LOOKUP = Object.fromEntries([..._B64_CHARS].map((c, i) => [c, i]));
function b64u(b64) {
  const pad = b64.endsWith('==') ? 2 : (b64.endsWith('=') ? 1 : 0);
  const out = new Uint8Array(Math.floor((b64.length * 3) / 4) - pad);
  let p = 0, buffer = 0, bits = 0;
  for (let i = 0; i < b64.length; i++) {
    const c = b64.charAt(i); if (c === '=') break;
    const v = _B64_LOOKUP[c]; if (v === undefined) continue;
    buffer = (buffer << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out[p++] = (buffer >> bits) & 0xff; }
  }
  return out;
}
for (const entry of SNAPS) {
  const raw = JSON.parse(fs.readFileSync(new URL(entry.path, import.meta.url), 'utf8'));
  const zip = await JSZip.loadAsync(b64u(raw));
  const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
  const sst = await (zip.file('xl/sharedStrings.xml')?.async('string') || Promise.resolve(null));
  const SST = sst ? [...sst.matchAll(/<si>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/si>/g)].map(m=>m[1]) : [];
  console.log('\n' + '='.repeat(70));
  console.log(`【${entry.label}】 key=${entry.key}`);
  console.log('='.repeat(70));
  const mm = sheet.match(/<mergeCells([\s\S]*?)<\/mergeCells>/);
  if (mm) {
    console.log('\n  === mergeCells ===');
    [...mm[1].matchAll(/<mergeCell\s+ref="([^"]+)"/g)].forEach(m => process.stdout.write('  ' + m[1]));
    console.log();
  }
  // 寻找非空行
  const rowRe = /<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(sheet)) !== null) {
    const r = Number(rm[1]);
    const inner = rm[2];
    // 判定是否空行（没有内容的 self-close <c /> 就算空）
    let hasVal = false;
    const cells = [];
    const cellRe = /<c [^>]*?r="([A-Z]+)(\d+)"([^>]*)>([\s\S]*?)<\/c>|<c [^>]*?r="([A-Z]+)(\d+)"([^>]*)\/>/g;
    let cm;
    while ((cm = cellRe.exec(inner)) !== null) {
      const col = cm[1] || cm[5], rest = cm[3] || cm[7] || '', ci = cm[4] || '';
      let val = null;
      if (/t="s"/.test(rest)) { const idx = Number(ci.match(/<v>(\d+)<\/v>/)?.[1]); if (SST[idx]) val = 'SST['+idx+'] "'+SST[idx].slice(0,30)+'"'; }
      else if (/<is>/.test(ci)) val = 'inline "' + (ci.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] || '').slice(0,30) + '"';
      else if (/<v>/.test(ci)) val = 'v=' + ci.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      else if (/<f>/.test(ci)) { const f = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/)?.[1] || ''; const v = ci.match(/<v>([\s\S]*?)<\/v>/)?.[1] || ''; val = '=' + f + (v?(' |v='+v):''); }
      if (val) { hasVal = true; cells.push(`${col}${r} ${val}`); }
    }
    if (hasVal) {
      console.log(`\n  R${r}:`);
      for (const c of cells) console.log(`    - ${c}`);
    }
    if (r > 40) break;
  }
}
