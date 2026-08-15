#!/usr/bin/env node
/* eslint-disable */
/**
 * 6 套模板 E2E：
 *  - 每个模板写入 3 条产品（模拟 3 条 quoteData）
 *  - 验证：ZIP 头 / 字节数 / JSZip 能重新 reopen / 基本断言
 *  - 同时把每个模板的输出写到 /tmp/contract_<key>.xlsx 可以直接打开验证
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const { TEMPLATE_REGISTRY, getTemplateByKey } = require(path.join(__dirname, '..', 'utils', 'contract-templates.js'));
const { buildContract } = require(path.join(__dirname, '..', 'utils', 'contract-xlsx-builder.js'));

function makeItems(count) {
  const models = ['QBZ673X-10P', 'QBZ573X-10G', 'QWZ673NM-10C'];
  const names = ['气动软密封蝶阀', '蜗轮对夹蝶阀', '暗杆球铁闸阀'];
  const materials = ['QT450', 'WCB', '304'];
  const items = [];
  let total = 0;
  for (let i = 0; i < count; i++) {
    const q = 10 + i * 5;
    const price = 1000 + i * 350;
    const t = q * price;
    total += t;
    items.push({
      productType: models[i].split('-')[0].replace(/[0-9]+/g, ''),
      productName: names[i],
      model: 100 + i * 50,
      spec: models[i] + '-DN' + (100 + i * 50),
      bodyMaterial: materials[i],
      gateMaterial: materials[i],
      sealMaterial: 'EPDM+PTFE',
      trademark: 'CHISUN',
      unit: '台',
      quantity: q,
      unitPrice: price,
      totalPrice: t,
      maxPressure: '1.0',
      unitWeight: (12 + i * 4) + 'kg',
      woodenBoxSize: (60 + i * 10) + '*40*30',
      moq: i === 0 ? '10' : '',
      gatePlateThickness: (12 + i * 3) + 'mm',
      torque: (200 + i * 80) + 'N·m'
    });
  }
  return { items, finalPrice: total };
}

const LOG = [];
function ok(name) { LOG.push('  ✅ ' + name); }
function fail(name, info) { LOG.push('  ❌ ' + name + '  ' + (info || '')); process.exitCode = 1; }

(async () => {
  let passes = 0, errors = 0;
  console.log('共注册模板数:', TEMPLATE_REGISTRY.length);
  TEMPLATE_REGISTRY.forEach(t => console.log('  -', t.key, t.family, JSON.stringify(t.displayName)));

  for (const entry of TEMPLATE_REGISTRY) {
    console.log('\n====== 测试模板:', entry.key, '(family=' + entry.family + ') ======');
    try {
      const N = 3;
      const { items, finalPrice } = makeItems(N);
      const out = await buildContract(JSZip, TEMPLATE_REGISTRY, entry.key, items, {
        finalPrice,
        note: '本报价有效期30天；付款方式：预付30%，发货前付清尾款。'
      });
      const hex4 = Array.from(out.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join(' ');
      if (hex4 === '50 4b 03 04') { ok('ZIP 头 50 4b 03 04 正确'); passes++; }
      else { fail('ZIP 头', 'got ' + hex4); errors++; }
      if (out.length > 10000) { ok(`输出字节数=${out.length} (>10KB, 合理)`); passes++; }
      else { fail('输出字节偏小', out.length); errors++; }

      // reopen zip
      try {
        const z2 = await JSZip.loadAsync(out);
        const s = await z2.file('xl/worksheets/sheet1.xml').async('string');
        if (s.includes('<sheetData') && s.includes('</sheetData>')) { ok('ZIP 重新打开成功，sheet1.xml 完整'); passes++; }
        else { fail('sheet1.xml 结构异常'); errors++; }
        // 检查产品内容是否写入
        const sample = items[0].spec || items[0].productName;
        if (sample && s.includes(sample.split('-')[0])) { ok(`产品内容写入成功（包含片段 ${sample.split('-')[0]}）`); passes++; }
        else { fail('产品内容可能没写入', '要找的片段=' + sample); errors++; }
        // 写文件
        const outPath = `/tmp/contract_${entry.key}.xlsx`;
        fs.writeFileSync(outPath, Buffer.from(out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength)));
        ok(`已保存预览文件: ${outPath}  (${Math.round(out.length / 1024)}KB)`); passes++;
      } catch (e) {
        fail('reopen fail', String(e)); errors++;
      }
    } catch (e) {
      fail('构建失败', String(e) + '\n' + (e && e.stack)); errors++;
    }
  }

  console.log('\n======== 汇总 ========');
  console.log(`通过: ${passes}  失败: ${errors}`);
  LOG.forEach(l => console.log(l));
  if (errors > 0) {
    process.exitCode = 1;
  } else {
    console.log('\n🎉 全部 6 模板通过！请用 Excel 打开 /tmp/contract_*.xlsx 肉眼确认样式/边框/产品写入位置。');
  }
})();
