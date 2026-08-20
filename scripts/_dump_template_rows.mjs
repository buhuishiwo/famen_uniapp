#!/usr/bin/env node
// Dump zs_changsheng 模板原始产品行 R11（表头）、R12~R15（产品行）、R16（汇总行）
import fs from 'node:fs';
import JSZip from 'jszip';
import zsSnap from '../utils/tpl_zs_changsheng.json' with { type: 'json' };
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
const zip = await JSZip.loadAsync(b64u(zsSnap));
const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
const sst = await (zip.file('xl/sharedStrings.xml')?.async('string') || Promise.resolve(null));
const SST = sst ? [...sst.matchAll(/<si>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/si>/g)].map(m=>m[1]) : [];

// 打印合并单元格范围
const mm = sheet.match(/<mergeCells([\s\S]*?)<\/mergeCells>/);
if (mm) {
  console.log('\n=== mergeCells 定义 ===');
  [...mm[1].matchAll(/<mergeCell\s+ref="([^"]+)"/g)].forEach(m => console.log('  ' + m[1]));
}

for (const r of [10,11,12,13,14,15,16,17]) {
  const rowRe = new RegExp(`<row[^>]*r="${r}"[^>]*>([\\s\\S]*?)<\\/row>`);
  const m = rowRe.exec(sheet);
  if (!m) { console.log(`\n—— R${r} —— MISSING`); continue; }
  console.log(`\n—— R${r} ——`);
  const cellRe = /<c [^>]*?r="([A-Z]+)(\d+)"([^>]*)>([\s\S]*?)<\/c>|<c [^>]*?r="([A-Z]+)(\d+)"([^>]*)\/>/g;
  let cm;
  while ((cm = cellRe.exec(m[1])) !== null) {
    const col = cm[1] || cm[5], rest = cm[3] || cm[7], ci = cm[4] || '';
    let val = '';
    if (/t="s"/.test(rest)) { const idx = Number(ci.match(/<v>(\d+)<\/v>/)?.[1]); val = 'SST['+idx+'] "'+SST[idx]+'"'; }
    else if (/<is>/.test(ci)) val = 'inline "' + (ci.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] || '') + '"';
    else if (/<v>/.test(ci)) val = 'v=' + ci.match(/<v>([\s\S]*?)<\/v>/)?.[1];
    else if (/<f>/.test(ci)) { const f = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/)?.[1] || ''; const v = ci.match(/<v>([\s\S]*?)<\/v>/)?.[1] || ''; val = '=' + f + (v?(' v_cache='+v):''); }
    console.log(`  ${col}${r}  ${val}`);
  }
}
