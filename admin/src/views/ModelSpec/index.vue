<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">规格参数管理</span>
      </template>
      <template #extra>
        <a-space>
          <span class="filter-label">系列：</span>
          <a-select v-model:value="selectedSeries" placeholder="请选择" style="width: 120px" allowClear @change="loadData">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
          <span class="filter-label">型号：</span>
          <a-select v-model:value="selectedModel" placeholder="请选择" style="width: 150px" allowClear @change="loadData">
            <a-select-option v-for="m in modelList" :key="m.name" :value="m.name">
              {{ m.name }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="addSpec">
            <PlusOutlined /> 新增规格参数
          </a-button>
          <a-button v-if="selectedRowKeys.length > 0" type="primary" danger @click="batchDelete">
            删除选中 ({{ selectedRowKeys.length }})
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
      <a-table v-else :columns="columns" :data-source="data" :pagination="{ pageSize: 20, showSizeChanger: true }" rowKey="id" size="middle" :row-selection="rowSelection">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'seriesName'">
            <a-tag color="blue">{{ record.seriesName }}</a-tag>
          </template>
          <template v-if="column.key === 'size'">
            <span style="font-weight: 500;">DN{{ record.size }}</span>
          </template>
          <template v-if="column.key === 'maxPressure'">
            {{ record.maxPressure }} <span style="color: #999; font-size: 12px;">BAR</span>
          </template>
          <template v-if="column.key === 'unitWeight'">
            {{ record.unitWeight }} <span style="color: #999; font-size: 12px;">KG</span>
          </template>
          <template v-if="column.key === 'laps'">
            {{ record.laps }} <span style="color: #999; font-size: 12px;">圈</span>
          </template>
          <template v-if="column.key === 'torque'">
            {{ record.torque }} <span style="color: #999; font-size: 12px;">N.M</span>
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

    <DraggableModal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false" width="600">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="产品系列" required>
          <a-select v-model:value="form.seriesName" placeholder="请选择系列" @change="onSeriesChange">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="产品型号" required>
          <a-select v-model:value="form.valveName" placeholder="请选择型号">
            <a-select-option v-for="m in modelList" :key="m.name" :value="m.name">
              {{ m.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="规格DN" required>
          <a-input-number v-model:value="form.size" :min="1" :max="2000" placeholder="DN" style="width: 100%" />
        </a-form-item>
        <a-form-item label="最高承压 (BAR)">
          <a-input-number v-model:value="form.maxPressure" :min="0" :step="0.1" placeholder="BAR" style="width: 100%" />
        </a-form-item>
        <a-form-item label="单重 (KG)">
          <a-input-number v-model:value="form.unitWeight" :min="0" :step="0.1" placeholder="KG" style="width: 100%" />
        </a-form-item>
        <a-form-item label="圈数">
          <a-input-number v-model:value="form.laps" :min="0" placeholder="圈数" style="width: 100%" />
        </a-form-item>
        <a-form-item label="扭矩 (N.M)">
          <a-input-number v-model:value="form.torque" :min="0" :step="0.1" placeholder="N.M" style="width: 100%" />
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="showModal = false">取消</a-button>
          <a-button type="primary" @click="handleOk">确定</a-button>
        </a-space>
      </template>
    </DraggableModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { modelSpecApi, seriesApi, modelApi } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const seriesList = ref([]);
const modelList = ref([]);
const selectedSeries = ref('');
const selectedModel = ref('');
const showModal = ref(false);
const form = ref({ seriesName: '', valveName: '', size: null, maxPressure: null, unitWeight: null, laps: null, torque: null });
const editId = ref(null);
const loading = ref(true);
const selectedRowKeys = ref([]);

const columns = [
  { title: '系列名称', dataIndex: 'seriesName', key: 'seriesName', width: 140 },
  { title: '型号名称', dataIndex: 'valveName', key: 'valveName', width: 150 },
  { title: '规格DN', dataIndex: 'size', key: 'size', width: 100 },
  { title: '最高承压', dataIndex: 'maxPressure', key: 'maxPressure', width: 120 },
  { title: '单重', dataIndex: 'unitWeight', key: 'unitWeight', width: 100 },
  { title: '圈数', dataIndex: 'laps', key: 'laps', width: 80 },
  { title: '扭矩', dataIndex: 'torque', key: 'torque', width: 100 },
  { title: '操作', key: 'action', width: 120 }
];

const rowSelection = {
  selectedRowKeys,
  onChange: (keys) => {
    selectedRowKeys.value = keys;
  },
};

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const modalTitle = ref('新增规格参数');

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

async function onSeriesChange(seriesName) {
  modelList.value = [];
  form.value.valveName = '';
  if (seriesName) {
    try {
      const models = await modelApi.getBySeries(seriesName);
      modelList.value = models;
    } catch (e) {
      message.error('加载型号失败');
    }
  }
}

async function loadData() {
  loading.value = true;
  try {
    const params = {};
    if (selectedSeries.value) params.seriesName = selectedSeries.value;
    if (selectedModel.value) params.valveName = selectedModel.value;
    const result = await modelSpecApi.getAll(params);
    data.value = result;
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
    valveName: record.valveName,
    size: record.size,
    maxPressure: record.maxPressure,
    unitWeight: record.unitWeight,
    laps: record.laps,
    torque: record.torque
  };
  onSeriesChange(record.seriesName);
  setTimeout(() => {
    form.value.valveName = record.valveName;
  }, 50);
  modalTitle.value = '编辑规格参数';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除型号 "${record.valveName}" DN${record.size} 的规格参数吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await modelSpecApi.delete(record.id);
        message.success('删除成功');
        loadData();
      } catch (e) {
        message.error('删除失败');
      }
    }
  });
}

async function batchDelete() {
  confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条规格参数吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        for (const id of selectedRowKeys.value) {
          await modelSpecApi.delete(id);
        }
        message.success('批量删除成功');
        selectedRowKeys.value = [];
        loadData();
      } catch (e) {
        message.error(e.message || '批量删除失败');
      }
    }
  });
}

function addSpec() {
  editId.value = null;
  form.value = { seriesName: '', valveName: '', size: null, maxPressure: null, unitWeight: null, laps: null, torque: null };
  modelList.value = [];
  modalTitle.value = '新增规格参数';
  showModal.value = true;
}

async function handleOk() {
  if (!form.value.seriesName) {
    message.error('请选择产品系列');
    return;
  }
  if (!form.value.valveName) {
    message.error('请选择产品型号');
    return;
  }
  if (form.value.size === null || form.value.size === undefined) {
    message.error('请输入规格DN');
    return;
  }
  
  try {
    const data = {
      seriesName: form.value.seriesName,
      valveName: form.value.valveName,
      size: form.value.size,
      maxPressure: form.value.maxPressure || 0,
      unitWeight: form.value.unitWeight || 0,
      laps: form.value.laps || 0,
      torque: form.value.torque || 0
    };
    
    if (editId.value) {
      await modelSpecApi.update(editId.value, data);
      message.success('更新成功');
    } else {
      await modelSpecApi.create(data);
      message.success('创建成功');
    }
    
    showModal.value = false;
    form.value = { seriesName: '', valveName: '', size: null, maxPressure: null, unitWeight: null, laps: null, torque: null };
    modelList.value = [];
    editId.value = null;
    loadData();
  } catch (e) {
    message.error(e.message || '操作失败');
  }
}
</script>
