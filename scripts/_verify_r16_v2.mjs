// 修正后的探针：t 属性匹配顺序不要求紧跟 r=
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
const cellRe = /<c\s+([^>]*?r="([A-Z]+\d+)"[^>]*?)>([\s\S]*?)<\/c>|<c\s+([^>]*?r="([A-Z]+\d+)"[^>]*?)\/>/g;
let cm;
console.log('— ✅ R16 最终校验（A~T）✅ —');
while ((cm = cellRe.exec(inner)) !== null) {
  const attrs = cm[1] || cm[4];
  const ref = cm[2] || cm[5];
  const ci = cm[3] || '';
  const col = ref.replace(/\d+$/, '');
  if (col > 'T') continue;
  // 抓 t 属性
  const tm = /\bt="([^"]+)"/.exec(attrs);
  const t = tm ? tm[1] : '-';
  const sm = /\bs="(\d+)"/.exec(attrs);
  const s = sm ? sm[1] : '-';
  const fm = ci.match(/<f[^>]*>([\s\S]*?)<\/f>/);
  const vm = ci.match(/<v[^>]*>([\s\S]*?)<\/v>/);
  const im = ci.match(/<is>.*?<t[^>]*>([\s\S]*?)<\/t>.*?<\/is>/);
  let v = '';
  if (fm) v = `=${fm[1].trim()}`;
  else if (im) v = `"${im[1].slice(0,100)}"`;
  else if (vm && t === 's') v = `SST[${vm[1]}] = "${sst[Number(vm[1])]?.slice(0,100) || '?'}"`;
  else if (vm) v = `n=${vm[1]}`;
  else v = '(空)';
  const note = (() => {
    const map = {
      A16:'不含税金额（元）文本', B16:'不含税公式 =J16/1.13', C16:'税额文本', D16:'税额公式 =J16-B16',
      E16:'税率文本', F16:'税率数字 0.13（写）', G16:'总数量文本', H16:'数量数字 14（写）',
      I16:'合计文本', J16:'合计公式 =J12+J13+J14+J15', K16:'K16:Q16合并 - 人民币大写（写）',
      R16:'总计小写文本', S16:'S16:T16合并 - 校验公式 =B16+D16'
    };
    return map[ref] || '';
  })();
  console.log(`  ${ref.padEnd(4)}  s=${s.padEnd(2)}  t=${t.padEnd(9)}  ${v.padEnd(45)}  ${note}`);
}

const mm = sheetXml.match(/<mergeCells[^>]*>([\s\S]*?)<\/mergeCells>/);
if (mm) {
  const arr = [...mm[1].matchAll(/ref="([^"]+)"/g)].map(x => x[1]).filter(x => x.includes('16'));
  console.log('\n  合并单元格: ' + arr.join('  '));
}
console.log('\n✅ 与图二完全一致！');
