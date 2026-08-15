#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

async function getMergeCells(u8) {
  const zip = await JSZip.loadAsync(u8);
  const f = zip.file('xl/worksheets/sheet1.xml');
  if (!f) return [];
  const s = await f.async('string');
  const mc = /<mergeCells[^>]*>([\s\S]*?)<\/mergeCells>/.exec(s);
  if (!mc) return [];
  const re = /<mergeCell\s+ref="([^"]+)"/g;
  const out = [];
  let m;
  while ((m = re.exec(mc[1])) !== null) out.push(m[1]);
  return out;
}

const KEYS = [
  { key: 'chisun_nsh',    src: '/tmp/contract_e2e_chisun_nsh.xlsx' },
  { key: 'zs_changsheng', src: '/tmp/contract_e2e_zs_changsheng.xlsx' },
  { key: 'pi_changqi',    src: '/tmp/contract_e2e_pi_changqi.xlsx' },
  { key: 'pi_chisun_multi', src: '/tmp/contract_e2e_pi_chisun_multi.xlsx' },
  { key: 'pi_chisun_vtb', src: '/tmp/contract_e2e_pi_chisun_vtb.xlsx' }
];

(async () => {
  for (const k of KEYS) {
    console.log('\n===== ' + k.key + ' =====');
    // 原始模板
    const tplJson = path.join(__dirname, '..', 'utils', 'tpl_' + k.key + '.json');
    let orig = null;
    try {
      const arr = JSON.parse(fs.readFileSync(tplJson, 'utf8'));
      orig = await getMergeCells(new Uint8Array(arr));
    } catch (e) { console.log('  原始模板加载失败: ' + e.message); }
    // 生成文件
    const gen = fs.existsSync(k.src) ? await getMergeCells(fs.readFileSync(k.src)) : null;
    console.log('  原始模板 mergeCells (' + (orig ? orig.length : 0) + '):');
    if (orig) orig.forEach(r => { if (/^(A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|AA|AB|AC|AD|AE|AF|AG|AH|AI|AJ|AK|AL|AM|AN|AO|AP|AQ|AR|AS|AT|AU|AV|AW)/.test(r)) console.log('    ' + r); });
    console.log('  生成文件 mergeCells (' + (gen ? gen.length : 0) + '):');
    if (gen) gen.forEach(r => { if (/^(A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|AA|AB|AC|AD|AE|AF|AG|AH|AI|AJ|AK|AL|AM|AN|AO|AP|AQ|AR|AS|AT|AU|AV|AW)/.test(r)) console.log('    ' + r); });
  }
})();
