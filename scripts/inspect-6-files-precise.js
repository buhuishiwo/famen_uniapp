#!/usr/bin/env node
/* eslint-disable */
/**
 * 精确打印：每个文件的 R10..R20（中文合同表头+产品） / R3..R12（英文 PI）
 *   避免长文本撑爆日志，每个单元格内容只截取前 120 字符
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const DOC_DIR = path.join(__dirname, '..', 'document');
const FILES = [
  { f: 'QCAZ543X-10P+CHISUN商标价格1.xlsx', rMin: 10, rMax: 22, label: '【chisun_v1 中文】' },
  { f: '奇胜阀门模板-农商行.xlsx',             rMin: 10, rMax: 22, label: '【chisun_nsh 中文】' },
  { f: '浙江长胜阀门模板-农行支付.xlsx',       rMin: 10, rMax: 22, label: '【zs_changsheng 中文】' },
  { f: 'Changqi模板.xlsx',                     rMin: 2,  rMax: 14, label: '【pi_changqi 英文 PI】' },
  { f: 'ChisunIMPORT+模板-农行人民币美元欧元付款.xlsx', rMin: 2, rMax: 14, label: '【pi_chisun_multi 英文多币种】' },
  { f: 'ChisunIMPORT模板-VTB人民币付款（俄罗斯专用.xlsx', rMin: 2, rMax: 14, label: '【pi_chisun_vtb 英文卢布】' }
];

function readSST(zip) {
  return (async () => {
    const f = zip.file('xl/sharedStrings.xml');
    if (!f) return [];
    const s = await f.async('string');
    const arr = [];
    const siRe = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
    let m;
    while ((m = siRe.exec(s)) !== null) {
      let txt = '';
      const tRe = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
      let tm;
      while ((tm = tRe.exec(m[1])) !== null) txt += tm[1];
      arr.push(txt);
    }
    return arr;
  })();
}

(async () => {
  for (const cfg of FILES) {
    const fp = path.join(DOC_DIR, cfg.f);
    if (!fs.existsSync(fp)) {
      console.log('\n❌ ' + cfg.label + ' 不存在: ' + cfg.f);
      continue;
    }
    console.log('\n' + '='.repeat(90));
    console.log(cfg.label + ' ' + cfg.f);
    console.log('='.repeat(90));
    try {
      const zip = await JSZip.loadAsync(fs.readFileSync(fp));
      const SST = await readSST(zip);
      const sheet = await zip.file('xl/worksheets/sheet1.xml').async('string');
      // 扫描 rows
      const rowRe = /<row\s+r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
      let rm;
      while ((rm = rowRe.exec(sheet)) !== null) {
        const rn = Number(rm[1]);
        if (rn < cfg.rMin || rn > cfg.rMax) continue;
        const cells = [];
        const cRe = /<c\s+r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
        let cm;
        while ((cm = cRe.exec(rm[2])) !== null) {
          const r = cm[1];
          const inner = cm[3] || '';
          const tAttr = /\bt="([a-z]+)"/.exec(cm[2]);
          const sAttr = /\bs="(\d+)"/.exec(cm[2]);
          let txt = '';
          if (tAttr && tAttr[1] === 's') {
            const vm = /<v>([\s\S]*?)<\/v>/.exec(inner);
            if (vm) txt = SST[Number(vm[1])] || '';
          } else if (tAttr && tAttr[1] === 'inlineStr') {
            const tm = /<t[^>]*>([\s\S]*?)<\/t>/.exec(inner);
            if (tm) txt = tm[1];
          } else {
            const vm = /<v>([\s\S]*?)<\/v>/.exec(inner);
            if (vm) txt = '[N]' + vm[1];
          }
          if (txt || sAttr) cells.push({ r, txt, s: sAttr ? Number(sAttr[1]) : null });
        }
        if (cells.length === 0) { console.log('  R' + rn + ': (空行)'); continue; }
        console.log('  R' + String(rn).padStart(2,' ') + ':');
        cells.forEach(c => {
          let s = c.txt;
          if (s.length > 120) s = s.slice(0, 120) + '…';
          s = s.replace(/\n/g, '↵');
          const sTag = c.s !== null ? `[s=${c.s}]` : '';
          console.log('      ' + String(c.r).padEnd(5,' ') + ' ' + sTag.padEnd(8,' ') + (s ? ' → ' + s : ''));
        });
      }
    } catch (e) {
      console.log('  ❌ 解析失败: ' + String(e).slice(0, 200));
      console.log(e.stack ? e.stack.split('\n').slice(0,2).join('\n') : '');
    }
  }
})();
