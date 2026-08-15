#!/usr/bin/env node
/* eslint-disable */
/**
 * 探查 6 个合同模板：列出 sheet1.xml 所有 <c> 单元格，输出：
 *  - 每行的 "A1=共享字符串文字 / 数字 / 内联字符串"
 *  - 并输出 <mergeCells ref="Axx:Byy"> 所有合并范围
 * 用来确定：产品区是哪些行、税金/合计/备注/大写金额在哪个单元格。
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const TPL_LIST = [
  'QCAZ543X-10P+CHISUN商标价格1.xlsx',
  'document/奇胜阀门模板-农商行.xlsx',
  'document/浙江长胜阀门模板-农行支付.xlsx',
  'document/Changqi模板.xlsx',
  'document/ChisunIMPORT+模板-农行人民币美元欧元付款.xlsx',
  'document/ChisunIMPORT模板-VTB人民币付款（俄罗斯专用.xlsx'
].map(name => path.join(__dirname, '..', name));

function colLettersToIndex(str) {
  let n = 0;
  for (let i = 0; i < str.length; i++) {
    n = n * 26 + (str.charCodeAt(i) - 64);
  }
  return n;
}
function cellA1ToRowCol(ref) {
  const m = /^([A-Z]+)(\d+)$/.exec(ref);
  if (!m) return { row: 0, col: 0, colStr: '' };
  return { colStr: m[1], col: colLettersToIndex(m[1]), row: Number(m[2]) };
}

function parseSST(xml) {
  const arr = [];
  const re = /<si>([\s\S]*?)<\/si>/g;
  let m;
  while ((m = re.exec(xml))) {
    const siInner = m[1];
    let txt = '';
    const tre = /<t[^>]*>([\s\S]*?)<\/t>/g;
    let tm;
    while ((tm = tre.exec(siInner))) txt += tm[1];
    arr.push(txt);
  }
  return arr;
}

function readCellText(cInner, SST) {
  let txt = '';
  const ism = /<is><t[^>]*>([\s\S]*?)<\/t><\/is>/.exec(cInner);
  if (ism) { txt = ism[1]; return { type: 'inline', txt }; }
  const ism2 = /<t[^>]*>([\s\S]*?)<\/t>/.exec(cInner);
  if (ism2) { return { type: 'inlineT', txt: ism2[1] }; }
  const vm = /<v>([\s\S]*?)<\/v>/.exec(cInner);
  if (!vm) return { type: 'empty', txt: '' };
  const v = vm[1].trim();
  const tmMatch = /\st="([^"]+)"/.exec(cInner);
  const t = tmMatch ? tmMatch[1] : '';
  if (t === 's') {
    const idx = Number(v);
    return { type: 'sst', txt: Number.isFinite(idx) ? (SST[idx] || '') : '', sstIdx: idx };
  }
  if (t === 'inlineStr') {
    return { type: 'inline', txt: v };
  }
  if (t === 'b') {
    return { type: 'bool', txt: v === '1' ? 'TRUE' : 'FALSE' };
  }
  return { type: 'num', txt: v, num: Number(v) };
}

function splitSheetData(xml) {
  const openRe = /<sheetData[^>]*>/;
  const closeRe = /<\/sheetData>/;
  const open = openRe.exec(xml);
  const close = closeRe.exec(xml);
  if (!open || !close) throw new Error('sheetData not found');
  return {
    before: xml.slice(0, open.index + open[0].length),
    innerRaw: xml.slice(open.index + open[0].length, close.index),
    after: xml.slice(close.index)
  };
}

async function inspectOne(tplPath) {
  const buf = fs.readFileSync(tplPath);
  const zip = await JSZip.loadAsync(buf);
  const sheetXml = await zip.file('xl/worksheets/sheet1.xml').async('string');
  const sstFile = zip.file('xl/sharedStrings.xml');
  const SST = sstFile ? parseSST(await sstFile.async('string')) : [];

  console.log('\n================================================================');
  console.log('模板文件:', path.basename(tplPath));
  console.log('模板大小(K):', (buf.length/1024).toFixed(1));

  // mergeCells
  const merges = [];
  const mergeRe = /<mergeCell\s+ref="([A-Z]+\d+):([A-Z]+\d+)"\s*\/?>/g;
  let mm;
  while ((mm = mergeRe.exec(sheetXml))) merges.push([mm[1], mm[2]]);
  console.log('合并单元格数:', merges.length);
  merges.forEach(m => {
    const a = cellA1ToRowCol(m[0]);
    const b = cellA1ToRowCol(m[1]);
    console.log(`  MERGE ${m[0]}:${m[1]}   R${a.row}-R${b.row}  C${a.col}-C${b.col}`);
  });

  const sd = splitSheetData(sheetXml);
  const rows = new Map();
  const rowRe = /<row\s+([^>]*)>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(sd.innerRaw))) {
    const attrs = rm[1];
    const inner = rm[2];
    const rrm = /\br="(\d+)"/.exec(attrs);
    if (!rrm) continue;
    const rn = Number(rrm[1]);
    const cells = [];
    const cRe = /<c\s+([^>]*)>([\s\S]*?)<\/c>|<c\s+([^/]*?)\/>/g;
    let cm;
    while ((cm = cRe.exec(inner))) {
      if (cm[3] !== undefined) {
        // self-close (empty)
        const a = cm[3];
        const refm = /\br="([A-Z]+\d+)"/.exec(a);
        const sm = /\bs="(\d+)"/.exec(a);
        if (refm) cells.push({ ref: refm[1], s: sm?sm[1]:'', text: '', raw: a });
      } else {
        const a = cm[1];
        const cInner = cm[2];
        const refm = /\br="([A-Z]+\d+)"/.exec(a);
        const sm = /\bs="(\d+)"/.exec(a);
        if (!refm) continue;
        const info = readCellText(cInner, SST);
        cells.push({ ref: refm[1], s: sm?sm[1]:'', ...info, raw: a });
      }
    }
    rows.set(rn, cells);
  }
  console.log('总数据行数:', rows.size);

  const rowNums = Array.from(rows.keys()).sort((a,b)=>a-b);
  for (const rn of rowNums) {
    const cells = rows.get(rn).filter(c => c.txt && String(c.txt).trim());
    if (cells.length === 0) continue;
    // 每行最多取前 20 个有内容的单元格
    const short = cells.slice(0, 20).map(c => {
      let t = String(c.txt).replace(/\s+/g, ' ').trim();
      if (t.length > 24) t = t.slice(0, 22) + '…';
      const s = c.s ? `s=${c.s}` : '';
      return `${c.ref}${s?'('+s+')':''}=${t}`;
    }).join('  |  ');
    console.log(`  R${rn.toString().padStart(2,' ')}: ${short}`);
  }
}

(async () => {
  for (const p of TPL_LIST) {
    if (!fs.existsSync(p)) { console.log('\n### 找不到文件:', p); continue; }
    await inspectOne(p);
  }
})();
