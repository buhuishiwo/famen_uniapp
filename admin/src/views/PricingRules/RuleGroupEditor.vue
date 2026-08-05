<template>
  <a-modal
    :open="visible"
    :title="isEdit ? '编辑规则组' : '新增规则组'"
    @cancel="handleCancel"
    @ok="handleOk"
    :width="900"
    :bodyStyle="{ maxHeight: '650px', overflow: 'auto' }"
    destroyOnClose
    class="rule-group-modal"
  >
    <!-- 基础信息区 -->
    <div class="form-section">
      <a-form :model="form" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="规则组名称" required>
              <a-input v-model:value="form.groupName" placeholder="请输入规则组名称" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="描述">
              <a-textarea v-model:value="form.description" placeholder="可选，描述此规则组的用途" :rows="2" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="优先级">
              <a-input-number v-model:value="form.priority" :min="0" :max="999" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="启用状态">
              <a-switch v-model:checked="form.isEnabled" checked-children="启用" un-checked-children="禁用" style="margin-top: 4px;" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-divider style="margin: 8px 0 16px" />

    <!-- 条件配置区 -->
    <div class="section-block">
      <div class="section-header">
        <div class="section-title">
          <SafetyOutlined class="section-icon" />
          <span>条件配置</span>
        </div>
        <span class="section-desc">当满足以下条件时，将执行对应的计算动作</span>
      </div>

      <div v-if="form.conditions.length === 0" class="empty-state">
        <div class="empty-content">
          <InboxOutlined class="empty-icon" />
          <p class="empty-text">暂无条件，将匹配所有产品</p>
          <a-button type="primary" ghost @click="addCondition">
            <PlusOutlined /> 添加条件
          </a-button>
        </div>
      </div>

      <div v-else class="items-list">
        <div v-for="(condition, idx) in form.conditions" :key="'cond-' + idx" class="item-card">
          <div class="item-header">
            <span class="item-index">{{ idx + 1 }}</span>
            <div class="item-delete" @click="removeCondition(idx)">
              <DeleteOutlined />
            </div>
          </div>
          <div class="item-body">
            <div class="item-row">
              <template v-if="idx > 0">
                <a-select v-model:value="condition.logicOperator" size="small" class="logic-select">
                  <a-select-option value="AND">且</a-select-option>
                  <a-select-option value="OR">或</a-select-option>
                </a-select>
              </template>
              <a-select v-model:value="condition.conditionType" size="small" class="type-select">
                <a-select-option value="series">产品系列</a-select-option>
                <a-select-option value="product_name">产品型号</a-select-option>
                <a-select-option value="dn_range">规格DN范围</a-select-option>
                <a-select-option value="quantity_range">数量范围</a-select-option>
                <a-select-option value="product_type">产品类型</a-select-option>
                <a-select-option value="material">材质条件</a-select-option>
              </a-select>
            </div>
            <div class="item-value">
              <template v-if="condition.conditionType === 'series' || condition.conditionType === 'product_name' || condition.conditionType === 'product_type'">
                <a-input v-model:value="condition.conditionValue.value" size="small" :placeholder="getConditionPlaceholder(condition.conditionType)" class="value-input" />
              </template>
              <template v-else-if="condition.conditionType === 'dn_range' || condition.conditionType === 'quantity_range'">
                <div class="range-group">
                  <span class="range-label">从</span>
                  <a-input-number v-model:value="condition.conditionValue.min" :min="0" size="small" class="range-input" />
                  <span class="range-label">到</span>
                  <a-input-number v-model:value="condition.conditionValue.max" :min="0" size="small" class="range-input" />
                </div>
              </template>
              <template v-else-if="condition.conditionType === 'material'">
                <div class="material-group">
                  <span class="value-label">部位:</span>
                  <a-select v-model:value="condition.conditionValue.part" size="small" class="material-select">
                    <a-select-option value="gate_plate">闸板</a-select-option>
                    <a-select-option value="stem">阀杆</a-select-option>
                    <a-select-option value="body">阀体</a-select-option>
                    <a-select-option value="yoke">支架</a-select-option>
                  </a-select>
                  <span class="value-label">=</span>
                  <a-select
                    v-model:value="condition.conditionValue.value"
                    size="small"
                    class="material-value"
                    placeholder="选择材质"
                    allowClear
                    show-search
                    :filter-option="filterMaterial"
                  >
                    <a-select-option v-for="m in materialOptions" :key="m.value" :value="m.value">
                      {{ m.label }}
                    </a-select-option>
                  </a-select>
                </div>
              </template>
              <template v-else>
                <a-input v-model:value="condition.conditionValue.expr" size="small" placeholder="表达式" class="value-input" />
              </template>
            </div>
          </div>
        </div>

        <a-button type="dashed" block class="add-btn" @click="addCondition">
          <PlusOutlined /> 添加条件
        </a-button>
      </div>
    </div>

    <a-divider style="margin: 16px 0" />

    <!-- 动作配置区 -->
    <div class="section-block">
      <div class="section-header">
        <div class="section-title">
          <ThunderboltOutlined class="section-icon" />
          <span>动作配置</span>
        </div>
        <span class="section-desc">按顺序执行以下计算动作</span>
      </div>

      <div v-if="form.actions.length === 0" class="empty-state">
        <div class="empty-content">
          <BulbOutlined class="empty-icon" />
          <p class="empty-text">暂无计算动作</p>
          <a-button type="primary" ghost @click="addAction">
            <PlusOutlined /> 添加动作
          </a-button>
        </div>
      </div>

      <div v-else class="items-list">
        <div v-for="(action, idx) in form.actions" :key="'action-' + idx" class="item-card action-card">
          <div class="item-header action-header">
            <div class="action-order">{{ idx + 1 }}</div>
            <div class="action-actions">
              <a-button type="text" size="small" @click="moveAction(idx, -1)" :disabled="idx === 0">
                <UpOutlined />
              </a-button>
              <a-button type="text" size="small" @click="moveAction(idx, 1)" :disabled="idx === form.actions.length - 1">
                <DownOutlined />
              </a-button>
              <a-button type="text" size="small" danger @click="removeAction(idx)">
                <DeleteOutlined />
              </a-button>
            </div>
          </div>
          <div class="item-body">
            <a-select v-model:value="action.actionType" size="small" class="type-select" @change="onActionTypeChange(action)">
              <a-select-option value="multiply_coefficient">乘以系数</a-select-option>
              <a-select-option value="apply_coefficient">报价系数查询</a-select-option>
              <a-select-option value="add_markup">加价</a-select-option>
              <a-select-option value="apply_discount">折扣</a-select-option>
              <a-select-option value="material_diff">材质差价</a-select-option>
              <a-select-option value="branding_fee">磨标费</a-select-option>
              <a-select-option value="set_base_price">设定基础价</a-select-option>
            </a-select>

            <!-- 不同动作类型的参数配置 -->
            <div class="action-params">
              <!-- 乘以系数 -->
              <template v-if="action.actionType === 'multiply_coefficient'">
                <div class="param-row">
                  <span class="param-label">系数值:</span>
                  <a-input-number v-model:value="action.actionParams.value" :step="0.1" :precision="2" size="small" class="param-input" />
                  <span class="param-hint">手动指定系数，如1.3表示乘以1.3</span>
                  <a-button type="link" size="small" class="toggle-btn" @click="toggleWhenCondition(action)">
                    {{ action.actionParams.when ? '移除条件' : '添加条件' }}
                  </a-button>
                </div>
                <div v-if="action.actionParams.when" class="param-sub-row">
                  <span class="param-label">当数量</span>
                  <a-select v-model:value="action.actionParams.when.quantity_op" size="small" class="op-select">
                    <a-select-option value=">=">≥</a-select-option>
                    <a-select-option value=">">></a-select-option>
                    <a-select-option value="<=">≤</a-select-option>
                    <a-select-option value="<"><</a-select-option>
                  </a-select>
                  <a-input-number
                    v-if="!action.actionParams.when.quantity_use_moq"
                    v-model:value="action.actionParams.when.quantity_value"
                    :min="0"
                    size="small"
                    class="qty-input"
                  />
                  <a-tag v-else color="blue" class="moq-tag">
                    <span class="moq-icon">📦</span>
                    MOQ ({{ action.actionParams.when.quantity_value || '默认' }})
                  </a-tag>
                  <a-checkbox
                    v-model:checked="action.actionParams.when.quantity_use_moq"
                    class="moq-checkbox"
                  >
                    使用 MOQ
                  </a-checkbox>
                  <span class="param-label">且</span>
                  <a-select v-model:value="action.actionParams.when.branding" size="small" class="status-select">
                    <a-select-option :value="false">原装</a-select-option>
                    <a-select-option :value="true">磨标</a-select-option>
                  </a-select>
                </div>
              </template>

              <!-- 报价系数查询（从报价系数表自动查询，无需配置参数） -->
              <template v-else-if="action.actionType === 'apply_coefficient'">
                <div class="param-row">
                  <a-alert
                    message="自动从报价系数表查询匹配的MOQ系数"
                    description="根据当前产品的系列、型号、规格DN、数量和磨标状态，自动从「报价系数管理」页面配置的规则中查询对应系数（达到/未达MOQ × 原装/磨标）。无需在此配置参数。"
                    type="info"
                    show-icon
                    :closable="false"
                    class="coeff-hint"
                  />
                </div>
              </template>

              <!-- 加价 -->
              <template v-else-if="action.actionType === 'add_markup'">
                <div class="param-row">
                  <span class="param-label">加价:</span>
                  <a-input-number v-model:value="action.actionParams.value" :min="0" :step="1" size="small" class="param-input" />
                  <a-select v-model:value="action.actionParams.unit" size="small" class="unit-select">
                    <a-select-option value="fixed">固定金额</a-select-option>
                    <a-select-option value="percent">百分比</a-select-option>
                  </a-select>
                  <span class="param-hint">在当前价格基础上加价</span>
                </div>
              </template>

              <!-- 折扣 -->
              <template v-else-if="action.actionType === 'apply_discount'">
                <div class="param-row">
                  <span class="param-label">折扣系数:</span>
                  <a-input-number v-model:value="action.actionParams.value" :min="0" :max="1" :step="0.05" :precision="2" size="small" class="param-input" />
                  <span class="param-hint">(0.9 = 9折)</span>
                </div>
              </template>

              <!-- 材质差价 -->
              <template v-else-if="action.actionType === 'material_diff'">
                <div class="param-row wrap">
                  <span class="param-label">部位:</span>
                  <a-select v-model:value="action.actionParams.part" size="small" class="enum-select">
                    <a-select-option value="gate_plate">闸板</a-select-option>
                    <a-select-option value="stem">阀杆</a-select-option>
                    <a-select-option value="body">阀体</a-select-option>
                    <a-select-option value="yoke">支架</a-select-option>
                  </a-select>
                  <span class="param-hint">自动对比默认材质，从材质差价表查询加价</span>
                </div>
              </template>

              <!-- 磨标费 -->
              <template v-else-if="action.actionType === 'branding_fee'">
                <div class="param-row">
                  <span class="param-label">字段:</span>
                  <a-select v-model:value="action.actionParams.price_field" size="small" class="field-select">
                    <a-select-option value="branding_fee">branding_fee</a-select-option>
                  </a-select>
                  <span class="param-hint">从价格表读取磨标费，需配合产品类型为OEM的条件</span>
                </div>
              </template>

              <!-- 设定基础价 -->
              <template v-else-if="action.actionType === 'set_base_price'">
                <div class="param-row">
                  <span class="param-label">基础价:</span>
                  <a-input-number v-model:value="action.actionParams.value" :min="0" :step="1" :precision="2" size="small" class="param-input" />
                  <span class="param-hint param-warn">⚠ 会覆盖之前所有计算结果，慎用</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <a-button type="dashed" block class="add-btn" @click="addAction">
          <PlusOutlined /> 添加动作
        </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { SafetyOutlined, ThunderboltOutlined, PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined, InboxOutlined, BulbOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { pricingEngineApi, materialLibApi } from '../../api';

const props = defineProps({
  visible: Boolean,
  record: Object
});

const emit = defineEmits(['update:visible', 'success']);

const isEdit = computed(() => !!props.record?.id);

const materialLibList = ref([]);

const materialOptions = computed(() => {
  return materialLibList.value.map(m => ({
    value: m.materialCode,
    label: m.materialCode
  }));
});

async function loadMaterialLib() {
  try {
    const data = await materialLibApi.getAll();
    materialLibList.value = data || [];
  } catch (e) {
    console.error('加载材质库失败', e);
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    initForm();
    loadMaterialLib();
  }
});

const form = ref({
  groupName: '',
  description: '',
  priority: 100,
  isEnabled: true,
  conditions: [],
  actions: []
});

watch(() => props.visible, (val) => {
  if (val) {
    initForm();
  }
});

function initForm() {
  if (props.record) {
    const conditions = (props.record.conditions || []).map(c => ({
      ...c,
      conditionValue: typeof c.conditionValue === 'string' ? safeParse(c.conditionValue, {}) : c.conditionValue,
      logicOperator: c.logicOperator || 'AND'
    }));
    const actions = (props.record.actions || []).map(a => ({
      ...a,
      actionParams: typeof a.actionParams === 'string' ? safeParse(a.actionParams, {}) : a.actionParams
    }));
    form.value = {
      groupName: props.record.groupName || '',
      description: props.record.description || '',
      priority: props.record.priority || 100,
      isEnabled: props.record.isEnabled !== undefined ? props.record.isEnabled : true,
      conditions,
      actions
    };
  } else {
    form.value = {
      groupName: '',
      description: '',
      priority: 100,
      isEnabled: true,
      conditions: [],
      actions: []
    };
  }
}

function safeParse(str, fallback) {
  try { return JSON.parse(str); } catch (e) { return fallback; }
}

function filterMaterial(input, option) {
  return (option?.label || '').toLowerCase().includes(input.toLowerCase());
}

function handleCancel() {
  emit('update:visible', false);
}

async function handleOk() {
  if (!form.value.groupName) {
    message.warning('请输入规则组名称');
    return;
  }

  try {
    const data = {
      groupName: form.value.groupName,
      description: form.value.description,
      priority: form.value.priority,
      isEnabled: form.value.isEnabled
    };

    if (isEdit.value) {
      await pricingEngineApi.updateRuleGroup(props.record.id, data);
      message.success('更新成功');

      await updateConditions(props.record.id);
      await updateActions(props.record.id);
    } else {
      const result = await pricingEngineApi.createRuleGroup(data);
      const newId = result?.id;
      if (newId) {
        await addConditions(newId);
        await addActions(newId);
      } else {
        message.warning('规则组已创建，但获取ID失败，请手动刷新');
      }
      message.success('创建成功');
    }

    emit('success');
    emit('update:visible', false);
  } catch (e) {
    message.error(e.message || '操作失败');
  }
}

async function addConditions(groupId) {
  for (let i = 0; i < form.value.conditions.length; i++) {
    const cond = form.value.conditions[i];
    await pricingEngineApi.addCondition({
      groupId,
      conditionType: cond.conditionType,
      conditionValue: cond.conditionValue,
      logicOperator: cond.logicOperator || 'AND',
      sortOrder: i
    });
  }
}

async function updateConditions(groupId) {
  await pricingEngineApi.deleteConditionsByGroup(groupId);
  await addConditions(groupId);
}

async function addActions(groupId) {
  for (let i = 0; i < form.value.actions.length; i++) {
    const action = form.value.actions[i];
    await pricingEngineApi.addAction({
      groupId,
      actionType: action.actionType,
      actionParams: action.actionParams,
      calcOrder: i
    });
  }
}

async function updateActions(groupId) {
  await pricingEngineApi.deleteActionsByGroup(groupId);
  await addActions(groupId);
}

function addCondition() {
  form.value.conditions.push({
    conditionType: 'series',
    conditionValue: { value: '' },
    logicOperator: 'AND'
  });
}

function removeCondition(idx) {
  form.value.conditions.splice(idx, 1);
}

function getConditionPlaceholder(type) {
  const map = {
    series: '如: 铸钢系列',
    product_name: '如: 球阀',
    product_type: '常规品/OEM'
  };
  return map[type] || '请输入';
}

function addAction() {
  form.value.actions.push({
    actionType: 'multiply_coefficient',
    actionParams: {
      value: 1.2
    }
  });
}

function removeAction(idx) {
  form.value.actions.splice(idx, 1);
}

function onActionTypeChange(action) {
  action.actionParams = getDefaultActionParams(action.actionType);
}

function getDefaultActionParams(type) {
  switch (type) {
    case 'multiply_coefficient':
      return { value: 1.2 };
    case 'add_markup':
      return { value: 50, unit: 'fixed' };
    case 'apply_discount':
      return { value: 0.95 };
    case 'material_diff':
      return { part: 'gate_plate' };
    case 'branding_fee':
      return { price_field: 'branding_fee' };
    case 'set_base_price':
      return { value: 100 };
    default:
      return {};
  }
}

function toggleWhenCondition(action) {
  if (action.actionParams.when) {
    delete action.actionParams.when;
  } else {
    action.actionParams.when = {
      quantity_op: '>=',
      quantity_value: 50,
      quantity_use_moq: false,
      branding: false
    };
  }
}

function moveAction(idx, direction) {
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= form.value.actions.length) return;
  const temp = form.value.actions[idx];
  form.value.actions[idx] = form.value.actions[newIdx];
  form.value.actions[newIdx] = temp;
}
</script>

<style scoped>
.rule-group-modal :deep(.ant-modal-body) {
  padding: 20px 24px 16px;
}

.form-section {
  background: #f8fafc;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #eef2f7;
}

.section-block {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #eef2f7;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
  border-bottom: 1px solid #eef2f7;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.section-icon {
  color: #1890ff;
  font-size: 16px;
}

.section-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-left: auto;
}

.empty-state {
  padding: 32px 20px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 40px;
  color: #d1d5db;
}

.empty-text {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.items-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  position: relative;
  transition: all 0.2s;
}

.item-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.item-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: #fff;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.action-order {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
  color: #fff;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 0 6px;
}

.item-delete {
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s;
}

.item-delete:hover {
  color: #ef4444;
  background: #fef2f2;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.logic-select {
  min-width: 60px;
}

.type-select {
  min-width: 140px;
}

.value-input {
  flex: 1;
  min-width: 150px;
}

.range-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.range-label {
  font-size: 12px;
  color: #6b7280;
}

.range-input {
  width: 90px;
}

.material-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.material-select {
  min-width: 80px;
}

.material-value {
  width: 100px;
}

.value-label {
  font-size: 12px;
  color: #6b7280;
}

.add-btn {
  height: 36px;
  border-radius: 8px;
  border-style: dashed;
}

/* Action card specific */
.action-card {
  background: linear-gradient(180deg, #fafbff 0%, #fff 100%);
  border-color: #e0e7ff;
}

.action-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.action-actions {
  display: flex;
  gap: 4px;
}

.action-params {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 2px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.param-row.wrap {
  gap: 10px;
}

.param-label {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.param-hint {
  font-size: 11px;
  color: #9ca3af;
}

.param-warn {
  color: #d97706;
}

.coeff-hint {
  width: 100%;
  margin-top: 4px;
}

.coeff-hint :deep(.ant-alert-message) {
  font-size: 12px;
}

.coeff-hint :deep(.ant-alert-description) {
  font-size: 11px;
  line-height: 1.5;
}

.param-input {
  width: 100px;
}

.param-sub-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  margin-top: 2px;
}

.op-select {
  width: 60px;
}

.qty-input {
  width: 80px;
}

.status-select {
  width: 80px;
}

.toggle-btn {
  margin-left: auto;
}

.moq-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  font-weight: 500;
  background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
  border: 1px solid #91d5ff;
}

.moq-icon {
  font-size: 14px;
}

.moq-checkbox {
  margin-left: 4px;
  font-size: 12px;
}

.moq-checkbox :deep(.ant-checkbox-inner) {
  border-radius: 3px;
}

.moq-checkbox:hover :deep(.ant-checkbox-inner) {
  border-color: #1890ff;
}

.unit-select {
  width: 100px;
}

.enum-select {
  min-width: 80px;
}

.text-input {
  width: 90px;
}

.field-select {
  min-width: 140px;
}
</style>