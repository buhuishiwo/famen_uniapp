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
  const re = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = re.exec(ssXml)) !== null) {
    sst.push(m[1].replace(/<[^>]+>/g, ''));
  }
}

const row16 = sheetXml.match(/<row[^>]*r="16"[^>]*>([\s\S]*?)<\/row>/);
if (!row16) { console.log('R16 未找到'); process.exit(0); }
console.log('— 模板原始 R16 XML 片段（简化）—\n');
const inner = row16[1];
const cellRe = /<c [^>]*r="([A-Z]+\d+)"[^>]*>([\s\S]*?)<\/c>/g;
let cm;
while ((cm = cellRe.exec(inner)) !== null) {
  const ref = cm[1], ci = cm[2];
  const col = ref.replace(/\d+$/, '');
  if (col > 'T') continue;
  const fm = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/);
  const vm = ci.match(/<v[^>]*>([\s\S]*?)<\/v>/);
  const tm = cm[0].match(/\st="(\w+)"/);
  const t = tm ? tm[1] : 'none';
  let v = '';
  if (fm) v = `FORMULA(${fm[1].trim()})`;
  else if (vm && t === 's') v = `SST[${vm[1]}]="${sst[Number(vm[1])]?.slice(0,100) || '?'}"`;
  else if (vm) v = `n=${vm[1]} (t=${t})`;
  else v = 'EMPTY';
  console.log(`  ${ref}  t=${t}  ${v}`);
}
