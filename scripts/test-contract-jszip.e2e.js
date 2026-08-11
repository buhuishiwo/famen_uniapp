// E2E 测试：使用新的 contract-xlsx-builder 生成 N=16 条产品合同，验证：
//   1) 数据正确性（26 原断言）
//   2) 样式索引一致性（新增：关键单元格 s 属性应与原模板完全一致，边框/字体才不会变）
const fs = require('fs');
const JSZip = require('jszip');
const { buildContract, toChineseMoney } = require('/Users/meonsaber/Desktop/famen_uniapp/utils/contract-xlsx-builder.js');
const XLSX = require('/Users/meonsaber/Desktop/famen_uniapp/node_modules/xlsx/xlsx.js');

const TEMPLATE_U8 = new Uint8Array(
    JSON.parse(fs.readFileSync('/Users/meonsaber/Desktop/famen_uniapp/utils/contract_template.json', 'utf-8'))
);

// === 原模板期望的 s 索引（XML 级 xf id，从原始 xlsx sheet1.xml 读出）===
// A13 s=41, H13 s=44, P13 s=44, S13 s=44, AC13 s=12, AE13 s=7
// 模板里 R27（价税合计行）的 A 列样式实际是 s=35（合计专属样式），税金汇总行 A26 s=47
const EXPECTED_S = {
    'A13': '41', 'H13': '44', 'P13': '44', 'S13': '44', 'Z13': '45',
    'AB13': '6', 'AC13': '12', 'AD13': '13', 'AE13': '7', 'AF13': '8',
    'AG13': '9', 'AH13': '10', 'AI13': '11', 'A26': '47',
    'N26': '48', 'A27': '35', 'F40': '34'
};

// === 模拟 16 条产品数据 ===
const MODELS = ['80','100','150','200','250','300','350','400','450','500','600','700','800','900','1000','1200'];
const items = MODELS.map((m, idx) => ({
    productType: '双向伞齿轮刀闸阀',
    productName: 'QCAZ543X-10P',
    model: m,
    bodyMaterial: idx % 3 === 0 ? 'CF8' : 'WCB',
    unitPrice: 1000 + idx * 50,
    maxPressure: '10',
    unitWeight: String(50 + idx * 5),
    laps: String(20 + idx),
    torque: String(300 + idx * 20)
}));
const finalPrice = items.reduce((s, it) => s + Number(it.unitPrice), 0);
const note = '本报价有效期 30 天，发货地点：温州，含木箱包装不含运费。';

(async () => {
    console.log('JSZip 加载模板 & 构建合同 xlsx (N=16)...');
    const outU8 = await buildContract(JSZip, TEMPLATE_U8, items, { finalPrice, note });
    const outPath = '/tmp/contract_e2e_jszip.xlsx';
    fs.writeFileSync(outPath, outU8);
    console.log('写出:', outPath, '大小=', (fs.statSync(outPath).size/1024).toFixed(1), 'KB');

    // === 用 SheetJS 读值（数据正确性 26 断言）===
    const wb = XLSX.readFile(outPath, { cellStyles: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const v = (a1) => (ws[a1] && ws[a1].v !== undefined) ? ws[a1].v : undefined;

    let pass = 0, fail = 0;
    const eq = (desc, a, b) => {
        if (a === b) { pass++; console.log('  ✅', desc, '=>', JSON.stringify(a)); }
        else { fail++; console.log('  ❌', desc, ' expected=', JSON.stringify(b), 'actual=', JSON.stringify(a)); }
    };

    console.log('\n=== 基本结构（行号偏移 3 行）===');
    // 说明：N16 产品行：R26 原税金行被下移 3 → 新增产品第14条
    eq('A26:M26 应是产品行（原税金行被下移）- DN900', v('P26'), 'DN900');
    // 模板 R26 A26/N26/Z26 是「不含税：」「税额：」「税率：」三个大合并，数字追加到标签后
    eq('A29 含 ¥22,000.00', /22[,\s]?000\.00/.test(String(v('A29') || '')), true);
    eq('N29 含 ¥2,860.00',  /2[,\s]?860\.00/.test(String(v('N29') || '')), true);
    eq('Z30 含 ¥24,860.00', /24[,\s]?860\.00/.test(String(v('Z30') || '')), true);
    // 大写
    eq('A30 大写金额', v('A30'), '价税合计（大写）：贰万肆仟捌佰陆拾元整');

    console.log('\n=== 产品数据（16 条）===');
    // 规则：MODELS[idx] 对应型号；unitPrice = 1000 + idx*50；body: idx%3===0 ? 'CF8' : 'WCB'
    // 验证：
    // idx 0  R13  DN80    1000  0%3=0→CF8
    // idx 1  R14  DN100   1050  1%3=1→WCB
    // idx 7  R20  DN400   1350  7%3=1→WCB   （注意 7%3=1，不是 0）
    // idx 8  R21  DN450   1400  8%3=2→WCB
    // idx 12 R25  DN800   1600  12%3=0→CF8
    // idx 13 R26  DN900   1650  13%3=1→WCB
    // idx 14 R27  DN1000  1700  14%3=2→WCB
    // idx 15 R28  DN1200  1750  15%3=0→CF8
    const rows = [
        { r: 13, dn: 'DN80',   price: 1000, body: 'CF8'  },
        { r: 14, dn: 'DN100',  price: 1050, body: 'WCB'  },
        { r: 20, dn: 'DN400',  price: 1350, body: 'WCB'  }, // idx 7
        { r: 25, dn: 'DN800',  price: 1600, body: 'CF8'  }, // idx 12
        { r: 26, dn: 'DN900',  price: 1650, body: 'WCB'  }, // 新增 第14条 idx 13
        { r: 27, dn: 'DN1000', price: 1700, body: 'WCB'  }, // 新增 第15条 idx 14
        { r: 28, dn: 'DN1200', price: 1750, body: 'CF8'  }  // 新增 第16条 idx 15
    ];
    rows.forEach(r => {
        eq(`R${r.r} 规格 P${r.r}`, v('P'+r.r), r.dn);
        eq(`R${r.r} 单价 AC${r.r}`, v('AC'+r.r), r.price);
        eq(`R${r.r} 材质 S${r.r}`, v('S'+r.r), r.body);
        eq(`R${r.r} 单位 Z${r.r}=台`, v('Z'+r.r), '台');
    });

    console.log('\n=== 人民币大写 ===');
    const cap = String(v('A30') || '');
    const expectedCap = '价税合计（大写）：' + toChineseMoney(24860);
    eq('A30 大写', cap, expectedCap);

    console.log('\n=== 备注 ===');
    eq('F43 备注（偏移后 39+3=42 R 即 A1 F43）', v('F43'), note);

    // === 样式一致性：解压缩对比 XML s 索引 ===
    console.log('\n=== 样式索引（关键单元格 s 属性）— 与原模板完全一致才算边框保留 ===');
    const tmpDir = '/tmp/e2e_unzip_styles';
    const { execSync } = require('child_process');
    execSync(`/bin/rm -rf "${tmpDir}" && mkdir -p "${tmpDir}" && unzip -q "${outPath}" -d "${tmpDir}"`);
    function getCellAttrs(xmlPath) {
        const ET = require('elementtree');
        const xml = fs.readFileSync(xmlPath, 'utf-8');
        const root = ET.parse(xml).getroot();
        const out = new Map();
        const rows = root.findall('./sheetData/row');
        rows.forEach(rrow => {
            const rNum = rrow.get('r');
            const cells = rrow.getfind ? rrow.getfind('c') : rrow.findall('./c');
            cells.forEach(c => {
                const ref = c.get('r');
                const s = c.get('s');
                if (ref) out.set(ref, s || '0');
            });
        });
        return out;
    }
    // 因为 elementtree 可能没装，直接正则扫字符串（兼容闭合 <c>...</c> 与自闭合 <c .../>）
    function extractByRegex(xmlText, refs) {
        const out = new Map();
        refs.forEach(ref => {
            // 先匹配闭合
            const reClosed = new RegExp(`<c\\s+([^>]*?)r="${ref}"([^>]*)>([\\s\\S]*?)<\\/c>`);
            let m = reClosed.exec(xmlText);
            if (m) {
                const attrs = m[1] + ' ' + m[2];
                const sm = /\bs="(\d+)"/.exec(attrs);
                out.set(ref, sm ? sm[1] : '?');
                return;
            }
            // 再匹配自闭合
            const reSelf = new RegExp(`<c\\s+([^>]*?)r="${ref}"([^>]*?)\\s*\\/>`);
            m = reSelf.exec(xmlText);
            if (m) {
                const attrs = m[1] + ' ' + m[2];
                const sm = /\bs="(\d+)"/.exec(attrs);
                out.set(ref, sm ? sm[1] : '?');
                return;
            }
            out.set(ref, null);
        });
        return out;
    }
    // 原模板 sheet1.xml
    const originalXml = fs.readFileSync('/tmp/xlsx_unzip/xl/worksheets/sheet1.xml', 'utf-8');
    const outXml = fs.readFileSync(`${tmpDir}/xl/worksheets/sheet1.xml`, 'utf-8');
    // 对比 R13 样本 s
    const refOriginals = Object.keys(EXPECTED_S);
    const origS = extractByRegex(originalXml, refOriginals);
    const outS = extractByRegex(outXml, [
        'A13','H13','P13','S13','Z13','AB13','AC13','AD13','AE13','AF13','AG13','AH13','AI13',
        // 克隆的 R26（新增产品第 14 条）- s 应与 R13 相同
        'A26','H26','P26','S26','Z26','AB26','AC26','AD26','AE26','AF26','AG26','AH26','AI26',
        // 克隆的 R28（新增产品第 16 条）
        'A28','H28','P28','S28','Z28','AC28',
        // 税金行偏移后
        'A29','N29','A30','F43'
    ]);
    console.log('--- 原模板 R13 基样 s：');
    refOriginals.forEach(r => {
        console.log(`   原模板 ${r}: s=${origS.get(r)}  断言=${EXPECTED_S[r]}`);
        eq(`原模板 ${r} s`, origS.get(r), EXPECTED_S[r]);
    });
    console.log('--- 生成合同 A13：应与原模板一致 ---');
    ['A13','H13','P13','S13','Z13','AB13','AC13','AD13','AE13','AF13','AG13','AH13','AI13'].forEach(r => {
        eq(`生成 ${r} s=原模板 s`, outS.get(r), origS.get(r));
    });
    console.log('--- 生成合同 A26 (第 14 条，克隆 R13)：应与 R13 原模板 s 完全一致 ---');
    [
        ['A26','A13'],['H26','H13'],['P26','P13'],['S26','S13'],['Z26','Z13'],
        ['AC26','AC13'],['AD26','AD13'],['AE26','AE13'],['AF26','AF13'],
        ['AG26','AG13'],['AH26','AH13'],['AI26','AI13']
    ].forEach(([a, b]) => {
        eq(`克隆 ${a} s=原模板 ${b} s`, outS.get(a), origS.get(b));
    });
    console.log('--- 生成合同 A28 (第 16 条，克隆 R13)：应与 R13 原模板 s 完全一致 ---');
    [
        ['A28','A13'],['H28','H13'],['P28','P13'],['S28','S13'],['Z28','Z13'],['AC28','AC13']
    ].forEach(([a, b]) => {
        eq(`克隆 ${a} s=原模板 ${b} s`, outS.get(a), origS.get(b));
    });
    console.log('--- 税金/合计/备注行偏移：A29 s=原模板 A26 s=47 ---');
    eq('A29 s  = 原 A26 s=47', outS.get('A29'), origS.get('A26'));
    eq('N29 s  = 原 N26 s=48', outS.get('N29'), origS.get('N26'));
    eq('A30 s  = 原 A27 s=35', outS.get('A30'), origS.get('A27'));
    eq('F43 s  = 原 F40 s=34', outS.get('F43'), origS.get('F40'));

    console.log('\n==> 共', pass, '通过，', fail, '失败');
    process.exit(fail > 0 ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
