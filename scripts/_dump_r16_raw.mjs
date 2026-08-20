import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
const ROOT = 'd:/Code/famen_uniapp/famen_uniapp';

async function dump(xlsxPath, label) {
  const xlsx = fs.readFileSync(path.join(ROOT, xlsxPath));
  const z = await JSZip.loadAsync(xlsx);
  const sheetXml = await z.file('xl/worksheets/sheet1.xml').async('string');
  const row16 = sheetXml.match(/<row[^>]*r="16"[^>]*>([\s\S]*?)<\/row>/);
  if (!row16) { console.log(label, 'R16 未找到'); return; }
  console.log(`\n========== ${label} R16 raw ==========\n`);
  // 把 <c> 标签每行一个打印
  const inner = row16[1];
  const cellRe = /<c [^>]*?r="([A-Z]+\d+)"[^>]*>([\s\S]*?)<\/c>|<c [^>]*?r="([A-Z]+\d+)"[^>]*?\/>/g;
  let m;
  while ((m = cellRe.exec(inner)) !== null) {
    if (m[1]) console.log(`  <c ...> tag: ${m[0].slice(0, 180)}`);
    else console.log(`  <c .../> self: ${m[0].slice(0, 180)}`);
  }
}

await dump('document/奇胜阀门模板-农商行.xlsx', '【TPL 模板】');
await dump('static-hosting/chisun_nsh_split11_onerow.xlsx', '【OUT 生成】');
