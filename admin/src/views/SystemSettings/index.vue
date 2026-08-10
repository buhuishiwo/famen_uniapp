<template>
  <div class="system-settings-page">
    <a-card :bordered="false" class="page-card">
      <template #title>
        <div class="card-title">
          <SettingOutlined class="title-icon" />
          <span>系统设置</span>
        </div>
      </template>

      <a-tabs v-model:activeKey="activeTab" size="large" class="settings-tabs">
        <!-- Tab 1: 基础设置 -->
        <a-tab-pane key="basic">
          <template #tab>
            <span class="tab-label">
              <SlidersOutlined />
              基础设置
            </span>
          </template>

          <div class="tab-content">
            <div class="setting-card">
              <div class="setting-card-head">
                <div class="setting-head-main">
                  <div class="setting-icon-wrap icon-orange">
                    <EditOutlined />
                  </div>
                  <div class="setting-head-text">
                    <div class="setting-head-title">报价功能设置</div>
                    <div class="setting-head-desc">控制小程序端报价功能的全局开关</div>
                  </div>
                </div>
              </div>

              <div class="setting-row">
                <div class="setting-info">
                  <span class="setting-label">允许修订单价</span>
                  <span class="setting-desc">关闭后，小程序端将不显示修订单价入口及提示，所有产品按系统计算单价报价</span>
                </div>
                <a-switch
                  v-model:checked="allowPriceModification"
                  :loading="basicLoading"
                  checked-children="开"
                  un-checked-children="关"
                  @change="onAllowPriceChange"
                />
              </div>
            </div>
          </div>
        </a-tab-pane>

        <!-- Tab 2: 报价单显示配置 -->
        <a-tab-pane key="quotation-display">
          <template #tab>
            <span class="tab-label">
              <TableOutlined />
              报价单显示
            </span>
          </template>

          <div class="tab-content">
            <div class="setting-card">
              <div class="setting-card-head">
                <div class="setting-head-main">
                  <div class="setting-icon-wrap icon-blue">
                    <UnorderedListOutlined />
                  </div>
                  <div class="setting-head-text">
                    <div class="setting-head-title">报价单列表字段</div>
                    <div class="setting-head-desc">选择在小程序生成的报价单图片中显示的列</div>
                  </div>
                </div>
              </div>

              <a-checkbox-group v-model:value="tableFieldKeys" class="field-group">
                <div class="field-grid">
                  <div
                    v-for="f in tableFieldDefs"
                    :key="f.key"
                    class="field-item"
                    :class="{ 'field-item--disabled': f.required }"
                  >
                    <a-checkbox :value="f.key" :disabled="f.required">
                      <span class="field-label">{{ f.label }}</span>
                      <a-tag v-if="f.required" color="gold" class="required-tag">必选</a-tag>
                    </a-checkbox>
                    <div class="field-desc">{{ f.desc }}</div>
                  </div>
                </div>
              </a-checkbox-group>
            </div>

            <div class="setting-card">
              <div class="setting-card-head">
                <div class="setting-head-main">
                  <div class="setting-icon-wrap icon-green">
                    <InfoCircleOutlined />
                  </div>
                  <div class="setting-head-text">
                    <div class="setting-head-title">规格参数显示</div>
                    <div class="setting-head-desc">选择在每行产品下方显示的规格参数（值为空时自动跳过）</div>
                  </div>
                </div>
              </div>

              <a-checkbox-group v-model:value="specFieldKeys" class="field-group">
                <div class="field-grid">
                  <div v-for="f in specFieldDefs" :key="f.key" class="field-item">
                    <a-checkbox :value="f.key">
                      <span class="field-label">{{ f.label }}</span>
                      <span class="field-unit">（{{ f.unit }}）</span>
                    </a-checkbox>
                    <div class="field-desc">{{ f.desc }}</div>
                  </div>
                </div>
              </a-checkbox-group>
            </div>

            <div class="summary-bar">
              <div class="summary-info">
                <span class="summary-item">已选 <b>{{ tableFieldKeys.length }}</b> / {{ tableFieldDefs.length }} 个列表字段</span>
                <span class="summary-divider">·</span>
                <span class="summary-item">已选 <b>{{ specFieldKeys.length }}</b> / {{ specFieldDefs.length }} 个规格参数</span>
              </div>
              <div class="summary-actions">
                <a-button type="dashed" @click="resetToDefault" :disabled="displayLoading">
                  <ReloadOutlined />
                  恢复默认
                </a-button>
                <a-button type="primary" @click="saveDisplayConfig" :loading="displayLoading">
                  <SaveOutlined />
                  保存设置
                </a-button>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  SettingOutlined, SlidersOutlined, EditOutlined,
  TableOutlined, UnorderedListOutlined, InfoCircleOutlined,
  ReloadOutlined, SaveOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { statsApi } from '../../api';

const SETTING_KEY_DISPLAY = 'quotation_display_config';
const SETTING_KEY_ALLOW_PRICE = 'allow_price_modification';

const activeTab = ref('basic');
const basicLoading = ref(false);
const displayLoading = ref(false);

// ============== 基础设置 ==============
const allowPriceModification = ref(true);

async function loadBasicSettings() {
  basicLoading.value = true;
  try {
    const config = await statsApi.getSystemConfig([SETTING_KEY_ALLOW_PRICE]);
    allowPriceModification.value = config[SETTING_KEY_ALLOW_PRICE] !== 'false';
  } catch (e) {
    console.warn('加载基础设置失败:', e);
  } finally {
    basicLoading.value = false;
  }
}

async function onAllowPriceChange(checked) {
  basicLoading.value = true;
  try {
    await statsApi.setSystemConfig(SETTING_KEY_ALLOW_PRICE, checked ? 'true' : 'false');
    message.success(checked ? '已开启修订单价功能' : '已关闭修订单价功能');
  } catch (e) {
    allowPriceModification.value = !checked;
    message.error('设置失败: ' + (e.message || '未知错误'));
  } finally {
    basicLoading.value = false;
  }
}

// ============== 报价单显示配置 ==============
const DEFAULT_CONFIG = {
  tableFields: [
    { key: 'productType',  visible: true },
    { key: 'modelSpec',    visible: true },
    { key: 'gateMaterial', visible: true },
    { key: 'stemMaterial', visible: true },
    { key: 'quantity',     visible: true },
    { key: 'brandingFee',  visible: true },
    { key: 'unitPrice',    visible: true },
    { key: 'totalPrice',   visible: true }
  ],
  specFields: [
    { key: 'maxPressure', visible: true },
    { key: 'unitWeight',  visible: true },
    { key: 'laps',        visible: true },
    { key: 'torque',      visible: true }
  ]
};

// 字段定义：列表列
const tableFieldDefs = [
  { key: 'productType',  label: '产品类型', desc: '显示产品分类（常规品/新品等）', required: false },
  { key: 'modelSpec',    label: '型号规格', desc: '阀门型号 + DN 尺寸，如 QB-DN80', required: true },
  { key: 'gateMaterial', label: '闸板材质', desc: '显示闸板具体材质（SS304/SS316等）', required: false },
  { key: 'stemMaterial', label: '阀杆材质', desc: '显示阀杆具体材质', required: false },
  { key: 'quantity',     label: '数量',     desc: '订货数量', required: true },
  { key: 'brandingFee',  label: '磨标费',   desc: 'OEM/磨标产生的额外费用', required: false },
  { key: 'unitPrice',    label: '单价',     desc: '单台单价（已含系数）', required: true },
  { key: 'totalPrice',   label: '总价',     desc: '单价 × 数量 合计金额', required: true }
];

// 字段定义：规格参数
const specFieldDefs = [
  { key: 'maxPressure', label: '最高承压', unit: 'BAR',  desc: '产品最大工作压力（从规格参数读取）' },
  { key: 'unitWeight',  label: '单重',     unit: 'KG',   desc: '产品单台重量' },
  { key: 'laps',        label: '圈数',     unit: '圈',    desc: '启闭操作圈数' },
  { key: 'torque',      label: '扭矩',     unit: 'N.M',  desc: '操作扭矩值' }
];

// 用户选中的 key 列表
const tableFieldKeys = ref([]);
const specFieldKeys  = ref([]);

function applyDisplayConfig(rawValue) {
  let config;
  try {
    config = (typeof rawValue === 'string') ? JSON.parse(rawValue) : rawValue;
  } catch {
    config = null;
  }
  if (!config || !config.tableFields || !config.specFields) {
    config = DEFAULT_CONFIG;
  }
  // 强制必选字段可见（后台再套一层保险）
  const requiredKeys = tableFieldDefs.filter(f => f.required).map(f => f.key);
  config.tableFields = config.tableFields.map(f => {
    if (requiredKeys.includes(f.key)) return { ...f, visible: true };
    return f;
  });
  // 同步到 v-model 的 key 数组
  tableFieldKeys.value = config.tableFields.filter(f => f.visible).map(f => f.key);
  specFieldKeys.value  = config.specFields.filter(f => f.visible).map(f => f.key);
}

function resetToDefault() {
  applyDisplayConfig(DEFAULT_CONFIG);
  message.info('已恢复默认显示配置（未保存）');
}

async function loadDisplayConfig() {
  displayLoading.value = true;
  try {
    const config = await statsApi.getSystemConfig([SETTING_KEY_DISPLAY]);
    applyDisplayConfig(config[SETTING_KEY_DISPLAY]);
  } catch (e) {
    console.warn('加载报价单显示配置失败，使用默认:', e);
    applyDisplayConfig(null);
  } finally {
    displayLoading.value = false;
  }
}

async function saveDisplayConfig() {
  const requiredKeys = tableFieldDefs.filter(f => f.required).map(f => f.key);
  // 强制回写必选
  const finalTableKeys = Array.from(new Set([...requiredKeys, ...tableFieldKeys.value]));
  tableFieldKeys.value = finalTableKeys;

  const config = {
    tableFields: tableFieldDefs.map(f => ({ key: f.key, visible: finalTableKeys.includes(f.key) })),
    specFields:  specFieldDefs.map(f  => ({ key: f.key, visible: specFieldKeys.value.includes(f.key) }))
  };

  displayLoading.value = true;
  try {
    await statsApi.setSystemConfig(SETTING_KEY_DISPLAY, JSON.stringify(config));
    message.success('报价单显示配置已保存');
  } catch (e) {
    message.error('保存失败: ' + (e.message || '未知错误'));
  } finally {
    displayLoading.value = false;
  }
}

onMounted(() => {
  loadBasicSettings();
  loadDisplayConfig();
});
</script>

<style scoped>
.system-settings-page {
  padding: 20px 24px;
}
.page-card {
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 600;
  color: #1a2236;
}
.title-icon {
  color: #c8aa6e;
  font-size: 18px;
}
.settings-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 20px;
}
.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}
.tab-content {
  padding: 4px 0 16px;
}

/* 设置卡片 */
.setting-card {
  background: #ffffff;
  border: 1px solid #edf1f8;
  border-radius: 10px;
  padding: 22px 24px;
  margin-bottom: 18px;
  box-shadow: 0 1px 3px rgba(13,21,38,0.04);
}
.setting-card-head {
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #eef1f6;
}
.setting-head-main {
  display: flex;
  align-items: center;
  gap: 14px;
}
.setting-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #ffffff;
  flex-shrink: 0;
}
.icon-orange { background: linear-gradient(135deg, #ff9a5a, #ff6b3d); }
.icon-blue   { background: linear-gradient(135deg, #5aa0ff, #3d75ff); }
.icon-green  { background: linear-gradient(135deg, #5ac8a0, #3dba7f); }
.setting-head-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2236;
  margin-bottom: 3px;
}
.setting-head-desc {
  font-size: 12px;
  color: #8a97aa;
}

/* 单条设置行 */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
}
.setting-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  padding-right: 20px;
}
.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: #1a2236;
}
.setting-desc {
  font-size: 12px;
  color: #8a97aa;
  line-height: 1.5;
}

/* 字段 grid */
.field-group {
  width: 100%;
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 20px;
}
@media (max-width: 820px) {
  .field-grid { grid-template-columns: 1fr; }
}
.field-item {
  background: #f8fafc;
  border: 1px solid #eef1f6;
  border-radius: 8px;
  padding: 10px 14px;
  transition: border-color 0.15s, background 0.15s;
}
.field-item:hover {
  border-color: #d7dee9;
  background: #ffffff;
}
.field-item--disabled {
  background: #fff8ec;
  border-color: #f3dfb0;
}
.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #1a2236;
  margin-right: 6px;
}
.field-unit {
  font-size: 12px;
  color: #8a97aa;
}
.required-tag {
  font-size: 11px;
  padding: 0 6px;
  line-height: 18px;
}
.field-desc {
  font-size: 12px;
  color: #8a97aa;
  line-height: 1.45;
  margin-top: 4px;
  padding-left: 22px;
}

/* 底部保存汇总 */
.summary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 16px 20px;
  background: linear-gradient(90deg, #f5f8fc, #eef3fa);
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  gap: 16px;
  flex-wrap: wrap;
}
.summary-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #4a5970;
  flex-wrap: wrap;
}
.summary-item b {
  color: #1a2236;
  font-weight: 600;
  margin: 0 2px;
}
.summary-divider {
  color: #b0bac8;
}
.summary-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}
</style>
