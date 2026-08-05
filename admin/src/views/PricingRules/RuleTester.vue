<template>
  <a-modal
    :open="visible"
    :title="null"
    @cancel="handleCancel"
    :width="860"
    :footer="null"
    destroyOnClose
    :centered="false"
    class="rule-tester-modal"
  >
    <div class="tester-header">
      <div class="header-left">
        <span class="header-icon">🧪</span>
        <div>
          <h3 class="header-title">规则测试工具</h3>
          <p class="header-desc">输入产品参数，实时验证报价规则引擎的计算结果</p>
        </div>
      </div>
      <a-button type="text" size="large" @click="handleCancel" class="close-btn">
        <CloseOutlined />
      </a-button>
    </div>

    <a-tabs v-model:active-key="activeTab" class="tester-tabs">
      <a-tab-pane key="input" tab="测试输入">
        <div class="form-section">
          <div class="section-label">
            <span class="label-bar"></span>
            <span>产品信息</span>
          </div>
          <a-form :model="testForm" layout="vertical" class="test-form">
            <div class="form-grid">
              <a-form-item label="产品系列">
                <a-select v-model:value="testForm.seriesName" placeholder="请选择产品系列" allowClear>
                  <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">{{ s.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="产品型号">
                <a-select
                  v-model:value="testForm.valveName"
                  placeholder="请先选择产品系列"
                  allowClear
                  :disabled="!testForm.seriesName"
                  @change="onModelChange"
                >
                  <a-select-option v-for="m in filteredModelList" :key="m.id" :value="m.name">
                    {{ m.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <div class="form-grid three-col">
              <a-form-item label="规格 DN">
                <a-input-number v-model:value="testForm.spec" :min="0" style="width: 100%" placeholder="如 80" />
              </a-form-item>
              <a-form-item label="数量">
                <a-input-number v-model:value="testForm.quantity" :min="1" style="width: 100%" placeholder="如 50" />
              </a-form-item>
              <a-form-item label="产品类型">
                <a-select v-model:value="testForm.branding">
                  <a-select-option :value="false">常规品</a-select-option>
                  <a-select-option :value="true">OEM / 磨标</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </a-form>
        </div>

        <div class="form-section" v-loading="materialLoading">
          <div class="section-label">
            <span class="label-bar"></span>
            <span>材质信息</span>
            <span class="section-hint" v-if="testForm.valveName">（自动加载当前型号配置，可修改）</span>
          </div>
          <a-form layout="vertical" class="test-form">
            <div class="form-grid">
              <a-form-item label="闸板材质">
                <a-select
                  v-model:value="testForm.gatePlate"
                  placeholder="选择型号后自动填充"
                  allowClear
                  show-search
                  :filter-option="filterOption"
                  :disabled="!testForm.valveName"
                >
                  <a-select-option v-for="m in partMaterialOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="阀杆材质">
                <a-select
                  v-model:value="testForm.rodMaterial"
                  placeholder="选择型号后自动填充"
                  allowClear
                  show-search
                  :filter-option="filterOption"
                  :disabled="!testForm.valveName"
                >
                  <a-select-option v-for="m in partMaterialOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="阀体材质">
                <a-select
                  v-model:value="testForm.bodyMaterial"
                  placeholder="选择型号后自动填充"
                  allowClear
                  show-search
                  :filter-option="filterOption"
                  :disabled="!testForm.valveName"
                >
                  <a-select-option v-for="m in partMaterialOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="支架材质">
                <a-select
                  v-model:value="testForm.yokeMaterial"
                  placeholder="选择型号后自动填充"
                  allowClear
                  show-search
                  :filter-option="filterOption"
                  :disabled="!testForm.valveName"
                >
                  <a-select-option v-for="m in partMaterialOptions" :key="m.value" :value="m.value">
                    {{ m.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </a-form>
        </div>

        <div class="test-action">
          <a-button type="primary" size="large" class="test-btn" @click="runTest" :loading="testing">
            <template #icon><PlayCircleOutlined /></template>
            开始测试
          </a-button>
          <span class="action-hint">填写完成后点击按钮运行规则引擎计算</span>
        </div>
      </a-tab-pane>

      <a-tab-pane key="result" tab="测试结果" :disabled="!testResult" v-if="testResult">
        <a-alert
          :type="testResult._success ? 'success' : 'error'"
          :message="testResult._success ? '规则引擎计算成功' : '规则引擎计算失败'"
          :description="testResult._message"
          show-icon
          class="result-alert"
        />

        <div class="result-section">
          <div class="section-label">
            <span class="label-bar blue"></span>
            <span>计算结果</span>
          </div>
          <div class="price-cards">
            <div class="price-card">
              <div class="price-label">基础价格</div>
              <div class="price-value">¥{{ testResult.basePrice }}</div>
            </div>
            <div class="price-card highlight">
              <div class="price-label">最终单价</div>
              <div class="price-value">¥{{ testResult.finalUnitPrice?.toFixed(2) }}</div>
            </div>
            <div class="price-card">
              <div class="price-label">磨标费</div>
              <div class="price-value">¥{{ testResult.brandingFee }}</div>
            </div>
            <div class="price-card">
              <div class="price-label">应用系数</div>
              <div class="price-value">×{{ testResult.coefficient?.toFixed(2) }}</div>
            </div>
          </div>
          <div class="total-row">
            <span class="total-label">总价</span>
            <span class="total-value">¥{{ testResult.totalPrice?.toFixed(2) }}</span>
          </div>
        </div>

        <div class="result-section" v-if="testResult.appliedRules?.length">
          <div class="section-label">
            <span class="label-bar green"></span>
            <span>匹配的规则</span>
          </div>
          <div class="rules-list">
            <a-tag v-for="rule in testResult.appliedRules" :key="rule" color="blue" class="rule-tag">
              <CheckCircleFilled /> {{ rule }}
            </a-tag>
          </div>
        </div>

        <div class="result-section" v-if="testResult.trace?.length">
          <div class="section-label">
            <span class="label-bar orange"></span>
            <span>计算过程</span>
          </div>
          <div class="trace-list">
            <div
              v-for="(step, idx) in testResult.trace"
              :key="idx"
              class="trace-item"
              :class="{ 'trace-item-unmatched': step.step === 'evaluate' && step.matched === false }"
            >
              <!-- 起始/结束节点 -->
              <div v-if="step.step === 'start'" class="trace-node start-node">
                <div class="node-icon">📊</div>
                <div class="node-content">
                  <div class="node-title">{{ step.desc }}</div>
                  <div class="node-price">¥{{ step.price?.toFixed(2) }}</div>
                </div>
              </div>

              <div v-else-if="step.step === 'end'" class="trace-node end-node">
                <div class="node-icon">✅</div>
                <div class="node-content">
                  <div class="node-title">计算完成</div>
                  <div class="node-formula">
                    最终单价 =
                    <span class="formula-base">({{ step.basePrice?.toFixed(2) || '0.00' }}</span>
                    <template v-if="step.adjustments?.length">
                      <span v-for="(adj, i) in step.adjustments" :key="i" class="formula-adjust">
                        {{ adj.delta >= 0 ? ' + ' : ' - ' }}{{ Math.abs(adj.delta).toFixed(2) }}
                        <span class="formula-label">[{{ adj.label || '调整' }}]</span>
                      </span>
                    </template>
                    <span v-if="step.brandingFee > 0"> + {{ step.brandingFee }}<span class="formula-label">[磨标费]</span></span>
                    <span class="formula-close">)</span>
                    <span class="formula-coeff"> × {{ testResult.coefficient?.toFixed(2) }}</span>
                  </div>
                  <div class="node-price final">¥{{ step.price?.toFixed(2) }}</div>
                </div>
              </div>

              <!-- 规则评估节点 -->
              <div v-else-if="step.step === 'evaluate'" class="trace-node evaluate-node" :class="{ 'unmatched': !step.matched }">
                <div class="node-icon" :class="{ 'failed': !step.matched }">
                  {{ step.matched ? '🎯' : '❌' }}
                </div>
                <div class="node-content">
                  <div class="node-title">
                    {{ step.rule }}
                    <a-tag v-if="step.matched" color="green" class="status-tag">已匹配</a-tag>
                    <a-tag v-else color="default" class="status-tag">未匹配</a-tag>
                  </div>
                  <div class="node-desc" :class="{ 'failed': !step.matched }">{{ step.desc }}</div>

                  <!-- 条件详情展开 -->
                  <div v-if="step.conditionDetails?.length" class="condition-details">
                    <a-collapse :bordered="false" ghost>
                      <a-collapse-panel key="1" :header="`查看 ${step.conditionDetails.length} 个条件详情`">
                        <div v-for="(cond, ci) in step.conditionDetails" :key="ci" class="condition-row" :class="{ 'failed': !cond.passed }">
                          <span class="cond-passed">{{ cond.passed ? '✓' : '✗' }}</span>
                          <span class="cond-logic" v-if="cond.logicOperator">{{ cond.logicOperator === 'AND' ? '且' : '或' }}</span>
                          <span class="cond-type">{{ getConditionTypeLabel(cond.type) }}</span>
                          <span class="cond-value">{{ formatConditionValue(cond.value) }}</span>
                        </div>
                      </a-collapse-panel>
                    </a-collapse>
                  </div>
                </div>
              </div>

              <!-- 动作执行节点 -->
              <div
                v-else-if="step.step === 'action'"
                class="trace-node action-node"
                :class="{ 'action-skipped': step.skipped }"
              >
                <div class="node-icon" :class="{ 'failed': step.skipped }">
                  {{ step.skipped ? '⏭️' : '⚡' }}
                </div>
                <div class="node-content">
                  <div class="node-title">
                    {{ step.rule }}
                    <span class="action-type" :class="{ 'skipped': step.skipped }">
                      {{ getActionTypeLabel(step.action) }}
                    </span>
                    <a-tag v-if="step.skipped" color="default" class="status-tag">条件不满足，已跳过</a-tag>
                    <a-tag v-else color="orange" class="status-tag">已执行</a-tag>
                  </div>
                  <div class="node-desc" :class="{ 'skipped': step.skipped }">{{ step.desc }}</div>
                  <div v-if="step.skipped && step.skipReason" class="skip-reason">
                    <span class="skip-icon">⚠️</span>
                    <span>跳过原因：{{ step.skipReason }}</span>
                  </div>
                  <div class="node-meta" v-if="step.price !== undefined || step.coefficient !== undefined">
                    <span v-if="step.price !== undefined" class="meta-item" :class="{ 'skipped': step.skipped }">
                      <span class="meta-label">价格:</span> ¥{{ step.price?.toFixed(2) }}
                      <span v-if="step.skipped" class="no-change-hint">（未变化）</span>
                    </span>
                    <span v-if="step.coefficient !== undefined" class="meta-item" :class="{ 'skipped': step.skipped }">
                      <span class="meta-label">系数:</span> ×{{ step.coefficient?.toFixed(2) }}
                      <span v-if="step.skipped" class="no-change-hint">（未变化）</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <a-button @click="activeTab = 'input'">返回修改</a-button>
          <a-button type="primary" @click="runTest" :loading="testing">
            <template #icon><ReloadOutlined /></template>
            重新测试
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { PlayCircleOutlined, CloseOutlined, CheckCircleFilled, ReloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { pricingEngineApi, seriesApi, modelApi, materialApi, materialLibApi } from '../../api';

const props = defineProps({
  visible: Boolean
});

const emit = defineEmits(['update:visible']);

const activeTab = ref('input');
const testing = ref(false);
const testResult = ref(null);
const seriesList = ref([]);
const rawModelsData = ref({});
const currentModelId = ref(null);
const materialLoading = ref(false);

const testForm = ref({
  seriesName: '',
  valveName: '',
  spec: 80,
  quantity: 50,
  branding: false,
  gatePlate: '',
  rodMaterial: '',
  bodyMaterial: '',
  yokeMaterial: ''
});

const materialLibList = ref([]);

const partMaterialOptions = computed(() => {
  return materialLibList.value.map(m => ({
    value: m.materialCode,
    label: m.materialCode
  }));
});

const filteredModelList = computed(() => {
  if (!testForm.value.seriesName) return [];
  const models = rawModelsData.value[testForm.value.seriesName];
  return models || [];
});

watch(() => props.visible, (val) => {
  if (val) {
    activeTab.value = 'input';
    testResult.value = null;
    loadOptions();
    resetForm();
  }
});

watch(() => testForm.value.seriesName, (val, oldVal) => {
  if (val !== oldVal) {
    testForm.value.valveName = '';
    testForm.value.gatePlate = '';
    testForm.value.rodMaterial = '';
    currentModelId.value = null;
  }
});

function resetForm() {
  testForm.value = {
    seriesName: '',
    valveName: '',
    spec: 80,
    quantity: 50,
    branding: false,
    gatePlate: '',
    rodMaterial: '',
    bodyMaterial: '',
    yokeMaterial: ''
  };
  currentModelId.value = null;
}

onMounted(() => {
  loadOptions();
});

async function loadOptions() {
  try {
    const [series, models, materials] = await Promise.all([
      seriesApi.getAll(),
      modelApi.getAll(),
      materialLibApi.getAll()
    ]);
    seriesList.value = series || [];
    rawModelsData.value = models || {};
    materialLibList.value = materials || [];
  } catch (e) {
    console.error('加载选项失败', e);
  }
}

async function onModelChange(modelName) {
  if (!modelName) {
    testForm.value.gatePlate = '';
    testForm.value.rodMaterial = '';
    testForm.value.bodyMaterial = '';
    testForm.value.yokeMaterial = '';
    currentModelId.value = null;
    return;
  }

  const models = rawModelsData.value[testForm.value.seriesName] || [];
  const model = models.find(m => m.name === modelName);
  if (!model) return;

  currentModelId.value = model.id;
  materialLoading.value = true;

  try {
    const material = await materialApi.getByModel(model.id);
    if (material) {
      testForm.value.gatePlate = material.gatePlateMaterial || '';
      testForm.value.rodMaterial = material.stemMaterial || '';
      testForm.value.bodyMaterial = material.bodyMaterial || '';
      testForm.value.yokeMaterial = material.yokeMaterial || '';
    } else {
      testForm.value.gatePlate = '';
      testForm.value.rodMaterial = '';
      testForm.value.bodyMaterial = '';
      testForm.value.yokeMaterial = '';
    }
  } catch (e) {
    console.error('加载材质配置失败', e);
    testForm.value.gatePlate = '';
    testForm.value.rodMaterial = '';
    testForm.value.bodyMaterial = '';
    testForm.value.yokeMaterial = '';
  } finally {
    materialLoading.value = false;
  }
}

async function runTest() {
  if (!testForm.value.valveName || !testForm.value.spec) {
    message.warning('请先选择产品型号和规格');
    return;
  }

  testing.value = true;
  try {
    const item = {
      seriesName: testForm.value.seriesName,
      valveName: testForm.value.valveName,
      spec: testForm.value.spec,
      quantity: testForm.value.quantity,
      branding: testForm.value.branding,
      gatePlate: testForm.value.gatePlate,
      rodMaterial: testForm.value.rodMaterial,
      bodyMaterial: testForm.value.bodyMaterial,
      yokeMaterial: testForm.value.yokeMaterial
    };

    const result = await pricingEngineApi.testRules(item);
    testResult.value = {
      ...result,
      _success: true,
      _message: '规则引擎计算完成'
    };
    activeTab.value = 'result';
  } catch (e) {
    testResult.value = {
      _success: false,
      _message: e.message || '测试请求失败'
    };
    activeTab.value = 'result';
  } finally {
    testing.value = false;
  }
}

function handleCancel() {
  emit('update:visible', false);
}

function filterOption(input, option) {
  return (option?.label || '').toLowerCase().includes(input.toLowerCase());
}

function getConditionTypeLabel(type) {
  const map = {
    'series': '产品系列',
    'product_name': '产品型号',
    'dn_range': '规格范围',
    'quantity_range': '数量范围',
    'product_type': '产品类型',
    'material': '材质',
    'custom': '自定义表达式'
  };
  return map[type] || type;
}

function formatConditionValue(value) {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch (e) { return value; }
  }
  if (typeof value === 'object') {
    // 材质条件：带 part 和 value
    if (value.part !== undefined && value.value !== undefined) {
      const partMap = { 'gate_plate': '闸板', 'rod': '阀杆' };
      const matMap = { 'WCB': 'WCB', '304': '304不锈钢', '316': '316不锈钢' };
      return `${partMap[value.part] || value.part} = ${matMap[value.value] || value.value}`;
    }
    // 范围条件：dn_range, quantity_range
    if ((value.min !== undefined || value.max !== undefined) && value.value === undefined) {
      return `${value.min || 0} ~ ${value.max || '∞'}`;
    }
    // 普通值条件：series, product_name, product_type
    if (value.value !== undefined) {
      const val = String(value.value);
      const typeMap = { 'oem': 'OEM/磨标', 'regular': '常规品', '磨标': '磨标', '原装': '原装', '常规品': '常规品' };
      return typeMap[val] || val;
    }
    // 自定义表达式
    if (value.expr !== undefined) {
      return value.expr;
    }
    return JSON.stringify(value);
  }
  return String(value);
}

function getActionTypeLabel(actionType) {
  const map = {
    'multiply_coefficient': '乘以系数',
    'apply_coefficient': '报价系数查询',
    'add_markup': '加价',
    'apply_discount': '折扣',
    'material_diff': '材质差价',
    'branding_fee': '磨标费',
    'set_base_price': '设定基础价',
    'custom_formula': '自定义公式'
  };
  return map[actionType] || actionType;
}
</script>

<style scoped>
.rule-tester-modal :deep(.ant-modal-body) {
  padding: 0;
}

.rule-tester-modal :deep(.ant-modal-content) {
  border-radius: 12px;
  overflow: hidden;
}

.tester-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f7ff 100%);
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 28px;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
}

.header-desc {
  margin: 2px 0 0;
  font-size: 12px;
  color: #8c8c8c;
}

.close-btn {
  color: #8c8c8c;
}

.close-btn:hover {
  color: #1f1f1f;
  background: rgba(0, 0, 0, 0.04);
}

.tester-tabs {
  padding: 0 24px 24px;
}

.tester-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 20px;
}

.tester-tabs :deep(.ant-tabs-tab) {
  font-weight: 500;
}

.form-section {
  margin-bottom: 20px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #1f1f1f;
}

.section-hint {
  font-size: 12px;
  font-weight: 400;
  color: #8c8c8c;
}

.label-bar {
  display: inline-block;
  width: 3px;
  height: 14px;
  background: #1890ff;
  border-radius: 2px;
}

.label-bar.blue {
  background: #1890ff;
}

.label-bar.green {
  background: #52c41a;
}

.label-bar.orange {
  background: #fa8c16;
}

.test-form {
  width: 100%;
}

.test-form :deep(.ant-form-item) {
  margin-bottom: 0;
}

.test-form :deep(.ant-form-item-label) {
  padding-bottom: 4px;
}

.test-form :deep(.ant-form-item-label > label) {
  font-size: 13px;
  color: #595959;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.form-grid.three-col {
  grid-template-columns: 1fr 1fr 1fr;
}

.test-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 10px;
}

.test-btn {
  min-width: 160px;
  height: 44px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.test-btn:hover {
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.action-hint {
  font-size: 12px;
  color: #8c8c8c;
}

.result-alert {
  margin-bottom: 20px;
  border-radius: 8px;
}

.result-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}

.price-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 14px;
}

.price-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s;
}

.price-card:hover {
  border-color: #d6e4ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.08);
}

.price-card.highlight {
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border-color: #91d5ff;
}

.price-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 6px;
}

.price-card.highlight .price-label {
  color: #1890ff;
}

.price-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
}

.price-card.highlight .price-value {
  color: #096dd9;
}

.total-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
  border-radius: 8px;
  border: 1px solid #ffa39e;
}

.total-label {
  font-size: 14px;
  font-weight: 500;
  color: #cf1322;
}

.total-value {
  font-size: 22px;
  font-weight: 700;
  color: #cf1322;
}

.rules-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.rule-tag {
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 6px;
}

.trace-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trace-item {
  position: relative;
}

.trace-item-unmatched {
  opacity: 0.7;
}

.trace-node {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s;
}

.trace-node:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.trace-node.evaluate-node.unmatched {
  background: #fafafa;
  border-color: #e0e0e0;
  border-style: dashed;
}

.node-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: #f0f6ff;
  border-radius: 8px;
}

.node-icon.failed {
  background: #fff1f0;
}

.start-node .node-icon {
  background: #f0f5ff;
}

.end-node .node-icon {
  background: #f6ffed;
}

.action-node .node-icon {
  background: #fffbe6;
}

.action-skipped {
  opacity: 0.75;
  background: #fafafa !important;
  border-color: #e0e0e0 !important;
  border-style: dashed !important;
}

.action-skipped .node-icon {
  background: #f5f5f5 !important;
}

.action-skipped .action-type.skipped {
  background: #f5f5f5;
  color: #8c8c8c;
  text-decoration: line-through;
  text-decoration-color: #bfbfbf;
}

.action-skipped .node-desc.skipped {
  color: #8c8c8c;
  text-decoration: line-through;
  text-decoration-color: #d9d9d9;
}

.action-skipped .meta-item.skipped {
  color: #8c8c8c;
}

.skip-reason {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 6px;
  font-size: 12px;
  color: #614700;
}

.skip-icon {
  flex-shrink: 0;
}

.no-change-hint {
  font-size: 11px;
  color: #bfbfbf;
  font-weight: 400;
  margin-left: 4px;
}

.evaluate-node.unmatched .node-icon {
  background: #f5f5f5;
}

.node-content {
  flex: 1;
  min-width: 0;
}

.node-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.start-node .node-title {
  color: #1890ff;
}

.end-node .node-title {
  color: #52c41a;
}

.node-desc {
  font-size: 13px;
  color: #595959;
  margin-bottom: 6px;
}

.node-desc.failed {
  color: #8c8c8c;
}

.node-price {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.node-price.final {
  color: #52c41a;
  font-size: 20px;
}

.node-formula {
  font-size: 13px;
  color: #595959;
  margin-bottom: 4px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  background: #f6ffed;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #52c41a;
}

.formula-base {
  color: #1890ff;
  font-weight: 600;
}

.formula-adjust {
  color: #fa541c;
  font-weight: 600;
}

.formula-label {
  color: #8c8c8c;
  font-weight: normal;
  font-size: 11px;
  margin: 0 2px;
}

.formula-coeff {
  color: #722ed1;
  font-weight: 600;
}

.formula-close {
  color: #595959;
  font-weight: 600;
}

.status-tag {
  font-size: 12px;
}

.action-type {
  font-size: 12px;
  color: #fa8c16;
  background: #fff7e6;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.node-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #f0f0f0;
}

.meta-item {
  font-size: 13px;
  font-weight: 600;
  color: #1f1f1f;
}

.meta-label {
  color: #8c8c8c;
  font-weight: 400;
  margin-right: 4px;
}

.condition-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e8e8e8;
}

.condition-details :deep(.ant-collapse) {
  background: transparent;
}

.condition-details :deep(.ant-collapse-header) {
  font-size: 12px;
  color: #1890ff;
  font-weight: 500;
  padding: 4px 0;
}

.condition-details :deep(.ant-collapse-content-box) {
  padding: 8px 0 4px;
}

.condition-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  margin-bottom: 4px;
  background: #f8f9fb;
  border-radius: 6px;
  font-size: 12px;
}

.condition-row.failed {
  background: #fff1f0;
  color: #8c8c8c;
}

.cond-passed {
  font-weight: 700;
  width: 16px;
  text-align: center;
}

.condition-row:not(.failed) .cond-passed {
  color: #52c41a;
}

.condition-row.failed .cond-passed {
  color: #ff4d4f;
}

.cond-logic {
  color: #fa8c16;
  font-weight: 600;
  font-size: 11px;
}

.cond-type {
  font-weight: 500;
  color: #1f1f1f;
}

.condition-row.failed .cond-type {
  color: #8c8c8c;
}

.cond-value {
  color: #595959;
  background: #fff;
  padding: 1px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.result-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 720px) {
  .form-grid,
  .form-grid.three-col {
    grid-template-columns: 1fr;
  }

  .price-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
