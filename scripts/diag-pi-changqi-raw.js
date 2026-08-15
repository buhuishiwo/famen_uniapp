#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
(async () => {
  const snap = JSON.parse(fs.readFileSync(path.join(__dirname,'..','utils','tpl_pi_changqi.json'), 'utf8'));
  const u8 = new Uint8Array(snap);
  const z = await JSZip.loadAsync(u8);
  const sheet = await z.file('xl/worksheets/sheet1.xml').async('string');
  const sdStart = sheet.indexOf('<sheetData');
  const sdEnd = sheet.indexOf('</sheetData>') + 13;
  const sd = sheet.slice(sdStart, sdEnd);
  console.log('原模板 sheet1.xml 的 sheetData 前 1500 字符:');
  console.log(sd.slice(0, 1500));
  console.log('\n\nrow 标签格式检查（抓取前 10 个 <row ...> 开头片段）:');
  const re = /<row\s+[^>]*>/g;
  let m, i = 0;
  while ((m = re.exec(sd)) !== null && i < 10) {
    console.log('  ', JSON.stringify(m[0]));
    i++;
  }
})();
