<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">报价规则管理</span>
      </template>
      <template #extra>
        <a-space>
          <a-button @click="initDefaultRules">
            初始化默认规则
          </a-button>
          <a-button type="primary" @click="showEditor()">
            <PlusOutlined /> 新增规则组
          </a-button>
          <a-button type="default" @click="showTester()">
            <ExperimentOutlined /> 规则测试
          </a-button>
        </a-space>
      </template>

      <!-- 操作教程（可折叠，点击任意位置展开/收起） -->
      <div class="tutorial-panel" @click="toggleTutorial">
        <div class="tutorial-header">
          <span class="tutorial-icon">📖</span>
          <span class="tutorial-title">报价规则使用教程</span>
          <span class="tutorial-subtitle">了解规则引擎如何运作</span>
          <RightOutlined class="tutorial-arrow" :class="{ 'expanded': isTutorialOpen }" />
        </div>
        <div class="tutorial-content" v-show="isTutorialOpen" @click.stop>
          <!-- 1. 基本概念 -->
          <div class="tutorial-section">
            <h4 class="tutorial-h4"><span class="step-num">1</span> 基本概念</h4>
            <p class="tutorial-p">报价规则引擎采用 <strong>「规则组 = 条件 + 动作」</strong> 的模型运作：</p>
            <ul class="tutorial-ul">
              <li><strong>规则组</strong>：一组报价计算规则的集合，按<strong>优先级</strong>（数字越小越先执行）依次匹配</li>
              <li><strong>条件</strong>：判断当前产品是否匹配该规则组的依据（如产品系列、型号、规格范围、数量、材质等），多个条件间支持「且/或」逻辑组合</li>
              <li><strong>动作</strong>：规则组匹配后执行的计算操作（如乘系数、加价、查询材质差价等），按顺序依次执行</li>
            </ul>
          </div>

          <!-- 2. 执行流程 -->
          <div class="tutorial-section">
            <h4 class="tutorial-h4"><span class="step-num">2</span> 执行流程</h4>
            <div class="flow-diagram">
              <div class="flow-step">
                <div class="flow-icon">📦</div>
                <div class="flow-text">获取产品基础价</div>
              </div>
              <div class="flow-arrow">→</div>
              <div class="flow-step">
                <div class="flow-icon">🔍</div>
                <div class="flow-text">按优先级匹配规则组</div>
              </div>
              <div class="flow-arrow">→</div>
              <div class="flow-step">
                <div class="flow-icon">⚡</div>
                <div class="flow-text">依次执行动作</div>
              </div>
              <div class="flow-arrow">→</div>
              <div class="flow-step">
                <div class="flow-icon">💰</div>
                <div class="flow-text">输出最终报价</div>
              </div>
            </div>
            <p class="tutorial-p tutorial-note">
              <InfoCircleOutlined /> 每个规则组匹配后会执行其所有动作；多个规则组可同时匹配，按优先级顺序累加计算结果。
            </p>
          </div>

          <!-- 3. 动作类型说明 -->
          <div class="tutorial-section">
            <h4 class="tutorial-h4"><span class="step-num">3</span> 动作类型说明</h4>
            <a-table
              :columns="actionColumns"
              :data-source="actionDocs"
              :pagination="false"
              size="small"
              class="action-docs-table"
              :scroll="{ x: 600 }"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'actionType'">
                  <a-tag :color="record.color">{{ record.label }}</a-tag>
                </template>
                <template v-if="column.key === 'desc'">
                  <span class="action-desc">{{ record.desc }}</span>
                </template>
              </template>
            </a-table>
          </div>

          <!-- 4. 与报价系数页面的关系 -->
          <div class="tutorial-section">
            <h4 class="tutorial-h4"><span class="step-num">4</span> 与「报价系数」页面的关系</h4>
            <div class="relation-box">
              <div class="relation-item">
                <div class="relation-icon">📊</div>
                <div class="relation-content">
                  <strong>报价系数管理页面</strong>
                  <p>配置不同产品系列/型号在各规格范围下的MOQ系数（达到/未达MOQ × 原装/磨标 共4种系数）</p>
                </div>
              </div>
              <div class="relation-link">⬆ 自动引用</div>
              <div class="relation-item">
                <div class="relation-icon">⚙️</div>
                <div class="relation-content">
                  <strong>报价规则 → 「报价系数查询」动作</strong>
                  <p>规则引擎执行时，自动从报价系数表查询匹配的系数并应用，<strong>无需在规则中重复填写系数值</strong></p>
                </div>
              </div>
            </div>
            <p class="tutorial-p tutorial-note">
              <InfoCircleOutlined /> 两个页面分工协作：报价系数页面负责<strong>维护系数数据</strong>，报价规则页面负责<strong>配置计算流程</strong>。
            </p>
          </div>

          <!-- 5. 配置建议 -->
          <div class="tutorial-section">
            <h4 class="tutorial-h4"><span class="step-num">5</span> 配置建议</h4>
            <ul class="tutorial-ul">
              <li>📌 优先级数字越小越先执行，建议按 <code>MOQ规则 → 材质差价 → 磨标费 → 其他</code> 的顺序设置</li>
              <li>📌 无条件的规则组会匹配所有产品，适合作为全局规则</li>
              <li>📌 动作支持<strong>条件执行</strong>（点击「添加条件」），满足条件时才执行该动作</li>
              <li>📌 配置完成后，点击<strong>「规则测试」</strong>验证计算结果是否符合预期</li>
              <li>📌 系统内置规则不可删除，但可以编辑或禁用</li>
            </ul>
          </div>
        </div>
      </div>

      <a-table :columns="columns" :data-source="ruleGroups" :pagination="false" rowKey="id" size="middle" :scroll="{ x: 1200 }" v-loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isEnabled'">
            <a-switch :checked="record.isEnabled" :loading="record._toggling" @change="(checked) => toggleEnabled(record, checked)" />
          </template>
          <template v-if="column.key === 'conditions'">
            <span class="count-tag">{{ (record.conditions || []).length }} 条条件</span>
          </template>
          <template v-if="column.key === 'actions'">
            <span class="count-tag">{{ (record.actions || []).length }} 个动作</span>
          </template>
          <template v-if="column.key === 'isSystem'">
            <a-tag v-if="record.isSystem" color="blue">系统</a-tag>
            <span v-else class="text-muted">自定义</span>
          </template>
          <template v-if="column.key === 'updatedAt'">
            <span class="text-muted">{{ formatTime(record.updatedAt) }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" type="link" @click="showEditor(record)">编辑</a-button>
              <a-button size="small" type="link" danger :disabled="record.isSystem" @click="del(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <RuleGroupEditor
      v-model:visible="showEditorModal"
      :record="editingRecord"
      @success="loadData"
    />

    <RuleTester
      v-model:visible="showTesterModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PlusOutlined, ExperimentOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { pricingEngineApi } from '../../api';
import RuleGroupEditor from './RuleGroupEditor.vue';
import RuleTester from './RuleTester.vue';

const { confirm } = Modal;

const ruleGroups = ref([]);
const loading = ref(true);
const showEditorModal = ref(false);
const editingRecord = ref(null);
const showTesterModal = ref(false);

// 教程折叠面板状态（默认收起）
const tutorialActive = ref([]);
const isTutorialOpen = computed(() => tutorialActive.value.length > 0);

function toggleTutorial() {
  if (isTutorialOpen.value) {
    tutorialActive.value = [];
  } else {
    tutorialActive.value = ['tutorial'];
  }
}

// 动作类型说明文档
const actionColumns = [
  { title: '动作类型', key: 'actionType', width: 140 },
  { title: '说明', key: 'desc' }
];

const actionDocs = [
  {
    label: '报价系数查询',
    color: 'blue',
    desc: '自动从「报价系数管理」页面查询匹配的MOQ系数（根据系列/型号/规格/数量/磨标状态），无需手动配置系数值。'
  },
  {
    label: '乘以系数',
    color: 'geekblue',
    desc: '将当前价格乘以指定系数。支持添加执行条件（如数量≥MOQ 且 磨标状态）。适合需要手动指定系数的场景。'
  },
  {
    label: '加价',
    color: 'green',
    desc: '在当前价格基础上加价，支持固定金额或百分比。如加价50元或加价10%。'
  },
  {
    label: '折扣',
    color: 'orange',
    desc: '将当前价格乘以折扣系数（如0.9 = 9折）。'
  },
  {
    label: '材质差价',
    color: 'purple',
    desc: '自动对比产品当前材质与默认材质，从「材质差价表」查询差价并加价。支持闸板/阀杆/阀体/支架4个部位。'
  },
  {
    label: '磨标费',
    color: 'magenta',
    desc: '应用产品价格表中的磨标费用（branding_fee字段）。通常配合产品类型为「OEM」的条件使用。'
  },
  {
    label: '设定基础价',
    color: 'red',
    desc: '直接将当前价格重置为指定值。慎用，会覆盖之前所有计算结果。'
  }
];

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '规则组名称', dataIndex: 'groupName', key: 'groupName', width: 200 },
  { title: '描述', dataIndex: 'description', key: 'description', width: 200 },
  { title: '优先级', dataIndex: 'priority', key: 'priority', width: 100 },
  { title: '条件数', key: 'conditions', width: 100 },
  { title: '动作数', key: 'actions', width: 100 },
  { title: '启用状态', key: 'isEnabled', width: 100 },
  { title: '系统内置', dataIndex: 'isSystem', key: 'isSystem', width: 100 },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 160 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' }
];

onMounted(() => {
  loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const result = await pricingEngineApi.getRuleGroups();
    ruleGroups.value = result;
  } catch (e) {
    message.error('加载规则失败');
  } finally {
    loading.value = false;
  }
}

function showEditor(record = null) {
  editingRecord.value = record;
  showEditorModal.value = true;
}

function showTester() {
  showTesterModal.value = true;
}

async function toggleEnabled(record, checked) {
  const oldValue = record.isEnabled;
  record.isEnabled = checked;
  record._toggling = true;
  try {
    await pricingEngineApi.toggleRuleGroup(record.id, checked);
    message.success('更新成功');
  } catch (e) {
    record.isEnabled = oldValue;
    message.error(e.message || '更新失败');
  } finally {
    record._toggling = false;
  }
}

function formatTime(t) {
  if (!t) return '-';
  try {
    const d = new Date(t);
    if (isNaN(d.getTime())) return t;
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch (e) {
    return t;
  }
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除规则组 "${record.groupName}" 吗？此操作会同时删除其下的所有条件和动作。`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await pricingEngineApi.deleteRuleGroup(record.id);
        message.success('删除成功');
        loadData();
      } catch (e) {
        message.error(e.message || '删除失败');
      }
    }
  });
}

async function initDefaultRules() {
  confirm({
    title: '初始化默认规则',
    content: '此操作会初始化系统默认规则（与现有固定报价规则一致）。如果默认规则已存在则不会重复创建。',
    okText: '确定',
    cancelText: '取消',
    async onOk() {
      try {
        const result = await pricingEngineApi.initDefaultRules();
        message.success(result.message || '初始化成功');
        loadData();
      } catch (e) {
        message.error('初始化失败');
      }
    }
  });
}
</script>

<style scoped>
.count-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: #f0f6ff;
  border: 1px solid #c5d8f5;
  border-radius: 4px;
  color: #1a6ec7;
  font-size: 12px;
}

.text-muted {
  color: #8c8c8c;
  font-size: 12px;
}

/* ===== 教程面板（自定义实现） ===== */
.tutorial-panel {
  margin-bottom: 16px;
  background: #f8fafc;
  border: 1px solid #e8ecf3;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.tutorial-panel:hover {
  border-color: #c5d8f5;
  box-shadow: 0 1px 4px rgba(26, 110, 199, 0.08);
}

.tutorial-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  user-select: none;
}

.tutorial-icon {
  font-size: 16px;
}

.tutorial-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.tutorial-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 4px;
}

.tutorial-arrow {
  margin-left: auto;
  font-size: 11px;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.tutorial-arrow.expanded {
  transform: rotate(90deg);
}

/* ===== 教程内容 ===== */
.tutorial-content {
  font-size: 13px;
  line-height: 1.7;
  color: #4b5563;
  padding: 8px 16px 16px;
  background: #fff;
  border-top: 1px solid #e8ecf3;
  cursor: default;
}

.tutorial-section {
  margin-bottom: 20px;
}

.tutorial-section:last-child {
  margin-bottom: 0;
}

.tutorial-h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #e6f0ff;
  color: #1a6ec7;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
}

.tutorial-p {
  margin: 0 0 8px 0;
  color: #4b5563;
}

.tutorial-ul {
  margin: 0;
  padding-left: 20px;
}

.tutorial-ul li {
  margin-bottom: 4px;
  color: #4b5563;
}

.tutorial-ul code {
  padding: 1px 6px;
  background: #eef2f7;
  border-radius: 3px;
  font-size: 12px;
  color: #6b21a8;
}

.tutorial-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 8px 12px;
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 6px;
  font-size: 12px;
  color: #92400e;
  margin-top: 8px;
}

.tutorial-note :deep(.anticon) {
  margin-top: 2px;
  flex-shrink: 0;
}

/* ===== 流程图 ===== */
.flow-diagram {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e8ecf3;
  border-radius: 8px;
  margin-bottom: 8px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 90px;
}

.flow-icon {
  font-size: 22px;
}

.flow-text {
  font-size: 11px;
  color: #4b5563;
  text-align: center;
  white-space: nowrap;
}

.flow-arrow {
  font-size: 16px;
  color: #c0c4cc;
  font-weight: 600;
}

/* ===== 动作说明表格 ===== */
.action-docs-table {
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
}

.action-docs-table :deep(.ant-table) {
  font-size: 12px;
}

.action-docs-table :deep(.ant-table-thead > tr > th) {
  background: #f8fafc;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  padding: 8px 12px;
}

.action-docs-table :deep(.ant-table-tbody > tr > td) {
  padding: 8px 12px;
}

.action-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
}

/* ===== 关系图 ===== */
.relation-box {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e8ecf3;
  border-radius: 8px;
}

.relation-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
}

.relation-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.relation-content strong {
  font-size: 13px;
  color: #1f2937;
  display: block;
  margin-bottom: 2px;
}

.relation-content p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.relation-link {
  text-align: center;
  font-size: 11px;
  color: #9ca3af;
  padding: 2px 0;
  letter-spacing: 1px;
}
</style>