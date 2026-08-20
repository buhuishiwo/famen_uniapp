#!/usr/bin/env node
/* 探查 pi_chisun_vtb 模板表头(行4)与产品行(行5)的列结构 */
const fs = require('fs'), path = require('path'), JSZip = require('jszip');
(async () => {
  const b64 = JSON.parse(fs.readFileSync('utils/tpl_pi_chisun_vtb.json', 'utf8'));
  const u8 = new Uint8Array(Buffer.from(b64, 'base64'));
  const zip = await JSZip.loadAsync(u8);
  const s = await zip.file('xl/worksheets/sheet1.xml').async('string');
  const sharedXml = await zip.file('xl/sharedStrings.xml').async('string');
  const items = sharedXml.match(/<si>[\s\S]*?<\/si>/g) || [];
  const strAt = (si) => {
    const m = items[si] || '';
    return (m.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []).map(x => x.replace(/<[^>]+>/g, '')).join('');
  };
  const rows = s.match(/<row [^>]*>[\s\S]*?<\/row>/g) || [];
  for (const row of rows) {
    const rn = (/r="(\d+)"/.exec(row) || [])[1];
    if (['1','2','3','4','5','6'].includes(rn)) {
      console.log('=== R' + rn + ' ===');
      const cells = row.match(/<c r="[A-Z]+\d+"[^>]*\/>|<c r="[A-Z]+\d+"[^>]*>[\s\S]*?<\/c>/g) || [];
      for (const c of cells) {
        const ref = (/<c r="([A-Z]+\d+)"/.exec(c) || [])[1];
        const style = (/s="(\d+)"/.exec(c) || [])[1];
        const t = (/t="(\w+)"/.exec(c) || [])[1];
        const val = (/<v>([\s\S]*?)<\/v>/.exec(c) || [])[1];
        let text;
        if (t === 's') text = 'STR[' + val + '] ' + JSON.stringify(strAt(parseInt(val, 10)).slice(0, 50));
        else if (val !== undefined) text = JSON.stringify(val);
        else text = '(空)';
        console.log('  ' + ref.padEnd(7) + ' s=' + String(style || '-').padEnd(4) + ' t=' + String(t || '-').padEnd(3) + ' = ' + text);
      }
    }
  }
  // mergeCells 中涉及产品行 R5/R6 的
  const mc = /<mergeCells[^>]*>([\s\S]*?)<\/mergeCells>/.exec(s);
  if (mc) {
    console.log('=== 产品行相关 mergeCells ===');
    (mc[1].match(/<mergeCell\s+ref="[^"]+"/g) || [])
      .map(x => x.replace('<mergeCell ref="', '').replace('"', ''))
      .filter(ref => /^([A-Z]+)(5|6):/.test(ref))
      .forEach(r => console.log('  ' + r));
  }
})();
