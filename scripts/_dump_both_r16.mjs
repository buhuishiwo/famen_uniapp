import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
const ROOT = 'd:/Code/famen_uniapp/famen_uniapp';

async function dump(xlsxPath, label) {
  const xlsx = fs.readFileSync(path.join(ROOT, xlsxPath));
  const z = await JSZip.loadAsync(xlsx);
  const sheetXml = await z.file('xl/worksheets/sheet1.xml').async('string');
  const ssXml = z.file('xl/sharedStrings.xml') ? await z.file('xl/sharedStrings.xml').async('string') : null;
  const sst = [];
  if (ssXml) {
    const re = /<si>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = re.exec(ssXml)) !== null) sst.push(m[1].replace(/<[^>]+>/g, ''));
  }
  console.log(`\n========== ${label} R16 raw ==========\n`);
  const row16 = sheetXml.match(/<row[^>]*r="16"[^>]*>([\s\S]*?)<\/row>/);
  if (!row16) { console.log('R16 未找到'); return; }
  const inner = row16[1];
  const cellRe = /<c ([^>]*?r="([A-Z]+\d+)"[^>]*?)>([\s\S]*?)<\/c>|<c ([^>]*?r="([A-Z]+\d+)"[^>]*?)\/>/g;
  let m;
  while ((m = cellRe.exec(inner)) !== null) {
    const attrs = m[1] || m[4];
    const ref = m[2] || m[5];
    const ci = m[3] || '';
    const col = ref.replace(/\d+$/, '');
    if (col > 'T') continue;
    const tm = /\bt="([^"]+)"/.exec(attrs);
    const t = tm ? tm[1] : '-';
    const sm = /\bs="(\d+)"/.exec(attrs);
    const s = sm ? sm[1] : '-';
    const fm = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/);
    const vm = ci.match(/<v[^>]*>([\s\S]*?)<\/v>/);
    const im = ci.match(/<is>.*?<t[^>]*>([\s\S]*?)<\/t>.*?<\/is>/);
    let v = ci ? '' : '(空)';
    if (fm) v = `FORMULA(${fm[1].trim()})` + (vm ? `  cached=${vm[1]}` : '');
    else if (im) v = `INLINE="${im[1].slice(0,80)}"`;
    else if (vm && t === 's') v = `SST[${vm[1]}] = "${sst[Number(vm[1])]?.slice(0,80) || '?'}"`;
    else if (vm) v = `n=${vm[1]}`;
    console.log(`  ${ref.padEnd(4)} s=${s.padEnd(2)} t=${t.padEnd(9)} ${v}`);
  }
  const mm = sheetXml.match(/<mergeCells[^>]*>([\s\S]*?)<\/mergeCells>/);
  if (mm) {
    const arr = [...mm[1].matchAll(/ref="([^"]+)"/g)].map(x => x[1]).filter(x => x.includes('16'));
    console.log('\n  含 R16 合并: ' + arr.join('  '));
  }
}

await dump('document/浙江长胜阀门模板-农行.xlsx', '【TPL_zsc 长胜模板】');
await dump('static-hosting/zs_changsheng_split11_onerow.xlsx', '【OUT_zsc 长胜生成】');
console.log('\n\n');
await dump('document/奇胜阀门模板-农商行.xlsx', '【TPL_cns 奇胜模板】');
await dump('static-hosting/chisun_nsh_split11_onerow.xlsx', '【OUT_cns 奇胜生成】');
