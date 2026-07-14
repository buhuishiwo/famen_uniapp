<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">材质价差管理</span>
      </template>
      <template #extra>
        <a-space>
          <a-select v-model:value="selectedSeries" placeholder="筛选系列" style="width: 180px" allowClear @change="loadData">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增价差
          </a-button>
        </a-space>
      </template>
      <template v-if="loading">
        <a-table :columns="columns" :data-source="skeletonData" :pagination="false" rowKey="key" size="middle">
          <template #bodyCell="{ column }">
            <a-skeleton :paragraph="{ rows: 1, width: column.width || 100 }" :active="true" />
          </template>
        </a-table>
      </template>
      <a-table v-else :columns="columns" :data-source="data" :pagination="{ pageSize: 10, showSizeChanger: true }" rowKey="id" size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'seriesName'">
            <a-tag color="blue">{{ record.seriesName }}</a-tag>
          </template>
          <template v-if="column.key === 'partName'">
            <a-tag :color="partColors[record.partName] || 'default'">{{ partMap[record.partName] || record.partName }}</a-tag>
          </template>
          <template v-if="column.key === 'baseMaterial'">
            <span>{{ record.baseMaterial }}</span>
          </template>
          <template v-if="column.key === 'targetMaterial'">
            <ArrowRightOutlined style="font-size: 12px; color: rgba(0,0,0,0.25); margin: 0 4px;" />
            <span style="font-weight: 500;">{{ record.targetMaterial }}</span>
          </template>
          <template v-if="column.key === 'dnRange'">
            <span>DN{{ record.dnMin }} - DN{{ record.dnMax }}</span>
          </template>
          <template v-if="column.key === 'priceDiff'">
            <span :class="record.priceDiff > 0 ? 'text-danger' : 'text-success'" style="font-weight: 600;">
              {{ record.priceDiff > 0 ? '+' : '' }}¥{{ record.priceDiff }}
            </span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" type="link" @click="edit(record)">编辑</a-button>
              <a-button size="small" type="link" danger @click="del(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <DraggableModal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false" width="600px">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="产品系列" required>
          <a-select v-model:value="form.seriesName" placeholder="请选择系列">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="部位名称" required>
          <a-select v-model:value="form.partName">
            <a-select-option value="body">阀体</a-select-option>
            <a-select-option value="gate_plate">闸板</a-select-option>
            <a-select-option value="stem">阀杆</a-select-option>
            <a-select-option value="yoke">支架</a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="基础材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" required>
              <a-input v-model:value="form.baseMaterial" placeholder="如 SS304" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="目标材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" required>
              <a-input v-model:value="form.targetMaterial" placeholder="如 SS316" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="规格DN起" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" required>
              <a-input-number v-model:value="form.dnMin" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="规格DN止" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" required>
              <a-input-number v-model:value="form.dnMax" :min="0" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="价差" required>
          <a-input-number v-model:value="form.priceDiff" :step="1" style="width: 100%" prefix="¥" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="form.remark" placeholder="请输入备注" :rows="2" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="showModal = false">取消</a-button>
          <a-button type="primary" @click="handleOk(false)" v-if="editId">确定</a-button>
          <a-button type="primary" @click="handleOk(false)" v-else>添加</a-button>
          <a-button type="primary" @click="handleOk(true)" v-if="!editId">添加并继续</a-button>
        </a-space>
      </template>
    </DraggableModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons-vue';
import { materialDiffApi, seriesApi } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const seriesList = ref([]);
const selectedSeries = ref('');
const showModal = ref(false);
const form = ref({
  seriesName: '',
  partName: 'body',
  baseMaterial: '',
  targetMaterial: '',
  dnMin: 50,
  dnMax: 150,
  priceDiff: 0,
  remark: ''
});
const editId = ref(null);
const loading = ref(true);

const partMap = {
  'body': '阀体',
  'gate_plate': '闸板',
  'stem': '阀杆',
  'yoke': '支架'
};

const partColors = {
  'body': 'cyan',
  'gate_plate': 'geekblue',
  'stem': 'purple',
  'yoke': 'orange'
};

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '系列', dataIndex: 'seriesName', key: 'seriesName', width: 110 },
  { title: '部位', dataIndex: 'partName', key: 'partName', width: 80 },
  { title: '材质变更', key: 'targetMaterial', width: 160 },
  { title: '规格范围', key: 'dnRange', width: 130 },
  { title: '价差', dataIndex: 'priceDiff', key: 'priceDiff', width: 100 },
  { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
  { title: '操作', key: 'action', width: 120 }
];

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const modalTitle = ref('新增材质价差');

onMounted(() => {
  loadSeries();
  loadData();
});

async function loadSeries() {
  try {
    const result = await seriesApi.getAll();
    seriesList.value = result;
  } catch (e) {
    message.error('加载系列失败');
  }
}

async function loadData() {
  loading.value = true;
  try {
    const result = await materialDiffApi.getAll();
    if (selectedSeries.value) {
      data.value = result.filter(d => d.seriesName === selectedSeries.value);
    } else {
      data.value = result;
    }
  } catch (e) {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
}

function edit(record) {
  editId.value = record.id;
  form.value = {
    seriesName: record.seriesName,
    partName: record.partName,
    baseMaterial: record.baseMaterial,
    targetMaterial: record.targetMaterial,
    dnMin: record.dnMin,
    dnMax: record.dnMax,
    priceDiff: record.priceDiff,
    remark: record.remark || ''
  };
  modalTitle.value = '编辑材质价差';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除材质价差 "${record.seriesName}-${partMap[record.partName]}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        await materialDiffApi.delete(record.id);
        message.success('删除成功');
        loadData();
      } catch (e) {
        message.error('删除失败');
      }
    }
  });
}

async function handleOk(continueAdd = false) {
  try {
    if (editId.value) {
      await materialDiffApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await materialDiffApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = {
        seriesName: '',
        partName: 'body',
        baseMaterial: '',
        targetMaterial: '',
        dnMin: 50,
        dnMax: 150,
        priceDiff: 0,
        remark: ''
      };
      editId.value = null;
    } else {
      form.value = {
        seriesName: form.value.seriesName,
        partName: form.value.partName,
        baseMaterial: '',
        targetMaterial: '',
        dnMin: 50,
        dnMax: 150,
        priceDiff: 0,
        remark: ''
      };
    }
    loadData();
  } catch (e) {
    message.error('操作失败');
  }
}
</script>
