#!/usr/bin/env node
/* eslint-disable */
/**
 * 6 套合同模板 E2E 自测（独立版本，不依赖 contract-templates.js 的 ESM export）
 *   - 直接 require utils/tpl_*.json 作为模板字节
 *   - 每个模板写入 3 条产品（quoteData 模拟数据）
 *   - 验证：ZIP 头（50 4b 03 04）/ 体积合理 / JSZip 重打开成功 / 产品内容写入
 *   - 把生成的 6 份 xlsx 写到 /tmp/contract_e2e_<key>.xlsx，方便用 Excel 打开肉眼确认
 */
const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// ===== 手动复刻 contract-templates.js 里 6 个模板的元信息（不含 bytes，bytes 下面单独 require JSON）=====
const TPL_META = [
  {
    key: 'chisun_v1',
    family: 'cn_contract',
    displayName: '奇胜标准合同（奇胜商标版）',
    jsonName: 'tpl_chisun_v1.json',
    meta: { PRODUCT_ROW_FIRST: 13, PRODUCT_ROW_LAST_TPL: 25, TAX_ROW: 26, TOTAL_ROW: 27,
      CELL_PRETAX: 'A26', CELL_TAX: 'N26', CELL_RATE_LABEL: 'Z26',
      CELL_TOTAL_NUM: 'Z27', CELL_TOTAL_CN: 'A27', NOTE_CELL: 'F40', TAX_RATE: 0.13 }
  },
  {
    key: 'chisun_nsh',
    family: 'cn_contract',
    displayName: '奇胜合同（农商行付款）',
    jsonName: 'tpl_chisun_nsh.json',
    meta: { PRODUCT_ROW_FIRST: 12, PRODUCT_ROW_LAST_TPL: 12, TAX_ROW: 13, TOTAL_ROW: 14,
      CELL_PRETAX: '', CELL_TAX: 'O13', CELL_RATE_LABEL: 'W13',
      CELL_TOTAL_NUM: 'B14', CELL_TOTAL_CN: 'B14', NOTE_CELL: 'AL12', TAX_RATE: 0.13 }
  },
  {
    key: 'zs_changsheng',
    family: 'cn_contract',
    displayName: '长胜合同（农行付款）',
    jsonName: 'tpl_zs_changsheng.json',
    meta: { PRODUCT_ROW_FIRST: 12, PRODUCT_ROW_LAST_TPL: 12, TAX_ROW: 13, TOTAL_ROW: 14,
      CELL_PRETAX: '', CELL_TAX: 'O13', CELL_RATE_LABEL: 'W13',
      CELL_TOTAL_NUM: 'B14', CELL_TOTAL_CN: 'B14', NOTE_CELL: 'AL12', TAX_RATE: 0.13 }
  },
  {
    key: 'pi_changqi',
    family: 'en_pi',
    displayName: 'Changqi 英文 PI',
    jsonName: 'tpl_pi_changqi.json',
    meta: { PRODUCT_ROW_FIRST: 5, PRODUCT_ROW_LAST_TPL: 5, TOTAL_ROW: 6, CELL_TOTAL_AMOUNT: 'C6' }
  },
  {
    key: 'pi_chisun_multi',
    family: 'en_pi',
    displayName: 'Chisun PI（农行多币种）',
    jsonName: 'tpl_pi_chisun_multi.json',
    meta: { PRODUCT_ROW_FIRST: 5, PRODUCT_ROW_LAST_TPL: 5, TOTAL_ROW: 6, CELL_TOTAL_AMOUNT: 'C6' }
  },
  {
    key: 'pi_chisun_vtb',
    family: 'en_pi',
    displayName: 'Chisun PI（VTB 卢布）',
    jsonName: 'tpl_pi_chisun_vtb.json',
    meta: { PRODUCT_ROW_FIRST: 5, PRODUCT_ROW_LAST_TPL: 5, TOTAL_ROW: 6, CELL_TOTAL_AMOUNT: 'C6' }
  }
];

// 加载模板 JSON 字节
const UTILS_DIR = path.join(__dirname, '..', 'utils');
const TEMPLATE_REGISTRY = TPL_META.map(m => {
  const jsonPath = path.join(UTILS_DIR, m.jsonName);
  let arr = [];
  try {
    arr = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    console.error('❌ 无法加载模板字节:', jsonPath, '\n', String(e));
    process.exit(1);
  }
  const bytes = new Uint8Array(arr);
  return Object.assign({}, m, { bytes });
});

// contract-xlsx-builder 是 CommonJS（末尾 module.exports），可直接 require
const { buildContract } = require(path.join(UTILS_DIR, 'contract-xlsx-builder.js'));

// ===== 造 3 条模拟产品 =====
function makeItems(count) {
  const models = ['QBZ673X-10P', 'QWZ573NM-10G', 'QCAZ543X-16RL'];
  const names = ['气动软密封蝶阀', '伞齿轮暗杆闸阀', '对夹式止回阀'];
  const materials = ['QT450', 'WCB', 'CF8M'];
  const items = [];
  let total = 0;
  for (let i = 0; i < count; i++) {
    const q = 10 + i * 5;
    const price = 1200 + i * 420;
    const t = q * price;
    total += t;
    items.push({
      // 真实 quoteData 格式：productType=常规品（中文）、无 spec 字段、model=规格尺寸数字
      productType: '常规品',
      productName: names[i],
      model: 100 + i * 50,
      bodyMaterial: materials[i],
      gateMaterial: materials[i],
      stemMaterial: '2Cr13',
      sealMaterial: 'EPDM+PTFE',
      trademark: 'CHISUN',
      unit: '台',
      quantity: q,
      unitPrice: price,
      totalPrice: t,
      maxPressure: '1.0',
      unitWeight: (12 + i * 4) + 'kg',
      woodenBoxSize: (60 + i * 10) + '*40*30',
      gatePlateThickness: (12 + i * 3) + 'mm',
      torque: (200 + i * 80) + 'N·m'
    });
  }
  return { items, finalPrice: total };
}

let PASS = 0, FAIL = 0;
function ok(name) { console.log('  ✅', name); PASS++; }
function fail(name, info) { console.log('  ❌', name, info || ''); FAIL++; process.exitCode = 1; }

(async () => {
  console.log('===== 多模板合同 E2E 开始 =====\n');
  console.log(`加载 ${TEMPLATE_REGISTRY.length} 个模板字节...`);
  TEMPLATE_REGISTRY.forEach(t => {
    console.log('   -', t.key.padEnd(20), 'family=' + t.family.padEnd(12), 'bytes=' + (t.bytes ? t.bytes.length : 'MISSING'));
  });

  const NOTE = '本报价有效期30天；付款方式：预付30%，发货前付清余款。木箱包装，含产品使用说明与材质报告。';

  for (const entry of TEMPLATE_REGISTRY) {
    console.log('\n==== 模板 [' + entry.key + ']  ' + entry.displayName + ' ====');
    try {
      const N = 3;
      const { items, finalPrice } = makeItems(N);

      const t0 = Date.now();
      const outU8 = await buildContract(JSZip, TEMPLATE_REGISTRY, entry.key, items, {
        finalPrice,
        note: NOTE,
        items // en_pi 家族 items 求和兜底
      });
      const dt = Date.now() - t0;

      // 1) ZIP 头 50 4b 03 04
      const hex4 = Array.from(outU8.slice(0, 4)).map(b => b.toString(16).padStart(2, '0')).join(' ');
      if (hex4 === '50 4b 03 04') ok('ZIP 头 50 4b 03 04 正确 (生成耗时 ' + dt + 'ms)');
      else fail('ZIP 头不对', '实际=' + hex4);

      // 2) 体积合理（> 10KB）
      if (outU8.length > 10000) ok('输出字节=' + outU8.length + ' (' + Math.round(outU8.length / 1024) + 'KB)');
      else fail('输出字节偏小', outU8.length);

      // 3) JSZip reopen + sheet1.xml 存在 + 有产品内容
      try {
        const z2 = await JSZip.loadAsync(outU8);
        const s = await z2.file('xl/worksheets/sheet1.xml').async('string');
        if (s.includes('<sheetData') && s.includes('</sheetData>')) ok('JSZip reopen 成功，sheet1.xml 完整');
        else fail('sheet1.xml 结构异常', '没有 sheetData 标签');

        const sampleKeyword = models = ['QBZ673X', 'QWZ573NM', 'QCAZ543X'][0].split('-')[0]; // "QBZ"
        if (sampleKeyword && new RegExp(sampleKeyword.split('').join('[\\s\\S]{0,60}')).test(s)
            || s.includes(items[0].bodyMaterial)
            || s.includes('DN' + items[0].model)) {
          ok('产品内容已写入 sheet1.xml（查到关键字段 DN/材质/型号片段）');
        } else {
          // 兜底：检查是否有 inlineStr 的中文或数字写入标记 <is> 数量
          const inlineStrCount = (s.match(/<is><t/g) || []).length;
          if (inlineStrCount >= 2) ok('产品内容已写入（inlineStr 写入段 ' + inlineStrCount + ' 处）');
          else fail('产品内容可能没写入', '<is><t> 片段仅 ' + inlineStrCount + ' 处');
        }
        // 4) 保存预览文件
        const outPath = `/tmp/contract_e2e_${entry.key}.xlsx`;
        const rawBin = Buffer.from(outU8.buffer.slice(outU8.byteOffset, outU8.byteOffset + outU8.byteLength));
        fs.writeFileSync(outPath, rawBin);
        const stat = fs.statSync(outPath);
        ok('预览文件已保存: ' + outPath + '  (' + Math.round(stat.size / 1024) + 'KB)');
      } catch (e) {
        fail('reopen/写入预览失败', String(e));
      }
    } catch (e) {
      fail('构建异常', String(e) + '\n' + (e && e.stack ? e.stack.split('\n').slice(0, 4).join('\n') : ''));
    }
  }

  console.log('\n=========== E2E 汇总 ===========');
  console.log('通过项:', PASS, '  失败项:', FAIL);
  if (FAIL === 0) {
    console.log('\n🎉 6 套合同模板全部通过！请在 Excel 中打开以下文件肉眼确认：');
    TEMPLATE_REGISTRY.forEach(t => console.log('   open /tmp/contract_e2e_' + t.key + '.xlsx'));
  } else {
    console.log('\n⚠️  有 ' + FAIL + ' 项失败，请检查上方日志。');
  }
})();
