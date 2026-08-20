import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
const ROOT = 'd:/Code/famen_uniapp/famen_uniapp';
const xlsx = fs.readFileSync(path.join(ROOT, 'static-hosting/zs_changsheng_N2_real.xlsx'));
const z = await JSZip.loadAsync(xlsx);
const sheet = await z.file('xl/worksheets/sheet1.xml').async('string');
for (const r of [14, 15]) {
  const row = sheet.match(new RegExp(`<row[^>]*r="${r}"[^>]*>([\\s\\S]*?)<\\/row>`));
  console.log(`\nOUT R${r} inner:  ${row[1].slice(0, 600)}`);
}
