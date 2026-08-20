import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
const ROOT = 'd:/Code/famen_uniapp/famen_uniapp';
const xlsx = fs.readFileSync(path.join(ROOT, 'static-hosting/chisun_nsh_split11_onerow.xlsx'));
const z = await JSZip.loadAsync(xlsx);
const sheetXml = await z.file('xl/worksheets/sheet1.xml').async('string');
const ssXml = z.file('xl/sharedStrings.xml') ? await z.file('xl/sharedStrings.xml').async('string') : null;

const sst = [];
if (ssXml) {
  const re = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = re.exec(ssXml)) !== null) {
    sst.push(m[1].replace(/<[^>]+>/g, ''));
  }
}

const row16 = sheetXml.match(/<row[^>]*r="16"[^>]*>([\s\S]*?)<\/row>/);
if (!row16) { console.log('R16 未找到'); process.exit(0); }
const inner = row16[1];
const cellRe = /<c[^>]*?r="([A-Z]+\d+)"[^>]*?(?:t="(\w+)")?[^>]*>([\s\S]*?)<\/c>/g;
let cm;
console.log('— R16 各单元格（A~T）—');
while ((cm = cellRe.exec(inner)) !== null) {
  const ref = cm[1], t = cm[2] || '', ci = cm[3];
  const col = ref.replace(/\d+$/, '');
  if (col > 'T') continue;
  const fm = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/);
  const vm = ci.match(/<v[^>]*>([\s\S]*?)<\/v>/);
  const im = ci.match(/<is>.*?<t[^>]*>([\s\S]*?)<\/t>.*?<\/is>/);
  let v = '';
  if (fm) v = `FORMULA(${fm[1].trim()})`;
  else if (im) v = `INLINE="${im[1].slice(0,100)}"`;
  else if (vm && t === 's') v = `SST[${vm[1]}]="${sst[Number(vm[1])]?.slice(0,100) || '?'}"`;
  else if (vm) v = `n=${vm[1]}`;
  else v = 'EMPTY';
  console.log(`  ${ref}  ${v}`);
}

const mm = sheetXml.match(/<mergeCells[^>]*>([\s\S]*?)<\/mergeCells>/);
if (mm) {
  const arr = [...mm[1].matchAll(/ref="([^"]+)"/g)].map(x => x[1]).filter(x => x.includes('16'));
  console.log('\n— 含 R16 的合并单元格 —\n  ' + (arr.join('\n  ') || '(无)'));
}
