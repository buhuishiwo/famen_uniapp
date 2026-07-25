<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">材质价差管理</span>
      </template>
      <template #extra>
        <a-space>
          <span class="filter-label">系列：</span>
          <a-select v-model:value="selectedSeries" placeholder="请选择" style="width: 120px" allowClear @change="loadData">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
          <span class="filter-label">部位：</span>
          <a-select v-model:value="selectedPart" placeholder="请选择" style="width: 100px" allowClear @change="loadData">
            <a-select-option v-for="(label, value) in partMap" :key="value" :value="value">
              {{ label }}
            </a-select-option>
          </a-select>
          <span class="filter-label">搜索：</span>
          <a-input-search v-model:value="searchText" placeholder="型号/材质" style="width: 150px" allowClear @search="filterData" />
          <a-button v-if="selectedRowKeys.length > 0" type="primary" danger @click="batchDelete">
            删除选中 ({{ selectedRowKeys.length }})
          </a-button>
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
      <a-table v-else :columns="columns" :data-source="filteredData" :pagination="pagination" @change="handleTableChange" rowKey="id" size="middle" :row-selection="rowSelection">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'seriesName'">
            <a-tag color="blue">{{ record.seriesName }}</a-tag>
          </template>
          <template v-if="column.key === 'modelName'">
            <span>{{ record.modelName || '-' }}</span>
          </template>
          <template v-if="column.key === 'size'">
            <span v-if="record.size">DN{{ record.size }}</span>
            <span v-else class="text-muted">-</span>
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
          <a-select v-model:value="form.seriesName" placeholder="请选择系列" @change="onSeriesChange">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="产品型号">
          <a-select v-model:value="form.modelName" placeholder="请选择型号（可选）" @change="onModelChange">
            <a-select-option v-for="m in modelList" :key="m.name" :value="m.name">
              {{ m.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="具体尺寸">
          <a-select v-model:value="form.size" placeholder="请选择尺寸（可选）" allowClear>
            <a-select-option v-for="size in sizeList" :key="size" :value="size">
              DN{{ size }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="部位名称" required>
          <a-select v-model:value="form.partName" @change="onPartChange">
            <a-select-option value="body">阀体</a-select-option>
            <a-select-option value="gate_plate">闸板</a-select-option>
            <a-select-option value="stem">阀杆</a-select-option>
            <a-select-option value="yoke">支架</a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="基础材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" required>
              <a-tag v-if="form.baseMaterial" color="blue">{{ form.baseMaterial }}</a-tag>
              <span v-else class="text-muted">请选择系列/型号/部位</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="目标材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }" required>
              <a-select v-model:value="form.targetMaterial" placeholder="请选择目标材质">
                <a-select-option v-for="m in materialLibList" :key="m.materialCode" :value="m.materialCode">
                  {{ m.materialCode }}
                </a-select-option>
              </a-select>
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
import { materialDiffApi, seriesApi, modelApi, priceApi, materialLibApi, materialApi } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const seriesList = ref([]);
const modelList = ref([]);
const sizeList = ref([]);
const materialLibList = ref([]);
const selectedSeries = ref('');
const selectedPart = ref('');
const searchText = ref('');
const showModal = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  showSizeChanger: true
});
const form = ref({
  seriesName: '',
  modelName: '',
  size: null,
  partName: 'body',
  baseMaterial: '',
  targetMaterial: '',
  priceDiff: 0,
  remark: ''
});
const editId = ref(null);
const loading = ref(true);
const selectedRowKeys = ref([]);

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

const partMaterialFieldMap = {
  'body': 'bodyMaterial',
  'gate_plate': 'gatePlateMaterial',
  'stem': 'stemMaterial',
  'yoke': 'yokeMaterial'
};

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '系列', dataIndex: 'seriesName', key: 'seriesName', width: 110 },
  { title: '型号', dataIndex: 'modelName', key: 'modelName', width: 180 },
  { title: '尺寸', key: 'size', width: 100 },
  { title: '部位', dataIndex: 'partName', key: 'partName', width: 80, sorter: (a, b) => (partMap[a.partName] || a.partName).localeCompare(partMap[b.partName] || b.partName) },
  { title: '材质变更', key: 'targetMaterial', width: 160 },
  { title: '价差', dataIndex: 'priceDiff', key: 'priceDiff', width: 100 },
  { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
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

const filteredData = computed(() => {
  let result = data.value;
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(item => 
      (item.modelName || '').toLowerCase().includes(keyword) ||
      (item.baseMaterial || '').toLowerCase().includes(keyword) ||
      (item.targetMaterial || '').toLowerCase().includes(keyword)
    );
  }
  pagination.value.total = result.length;
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return result.slice(start, end);
});

const filterData = () => {
  // 筛选逻辑由 computed 自动处理
};

function handleTableChange(paginationInfo) {
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
}

const modalTitle = ref('新增材质价差');

onMounted(() => {
  loadSeries();
  loadMaterialLib();
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

async function loadMaterialLib() {
  try {
    const result = await materialLibApi.getAll();
    materialLibList.value = result;
  } catch (e) {
    message.error('加载材质库失败');
  }
}

async function loadData() {
  loading.value = true;
  try {
    const result = await materialDiffApi.getAll();
    let filtered = result;
    if (selectedSeries.value) {
      filtered = filtered.filter(d => d.seriesName === selectedSeries.value);
    }
    if (selectedPart.value) {
      filtered = filtered.filter(d => d.partName === selectedPart.value);
    }
    data.value = filtered;
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
    modelName: record.modelName || '',
    size: record.size || null,
    partName: record.partName,
    baseMaterial: record.baseMaterial,
    targetMaterial: record.targetMaterial,
    priceDiff: record.priceDiff,
    remark: record.remark || ''
  };
  modalTitle.value = '编辑材质价差';
  showModal.value = true;
  loadModelAndSize(record.seriesName, record.modelName);
}

async function loadModelAndSize(seriesName, modelName) {
  if (seriesName) {
    try {
      const models = await modelApi.getBySeries(seriesName);
      modelList.value = models;
      if (modelName) {
        const prices = await priceApi.getAll();
        const modelPrices = prices.filter(p => p.valveName === modelName);
        const sizes = [...new Set(modelPrices.map(p => p.size))].sort((a, b) => a - b);
        sizeList.value = sizes;
      }
    } catch (e) {
      message.error('加载失败');
    }
  }
}

async function onSeriesChange(seriesName) {
  modelList.value = [];
  sizeList.value = [];
  if (!editId.value) {
    form.value.modelName = '';
    form.value.size = null;
  }
  if (seriesName) {
    try {
      const models = await modelApi.getBySeries(seriesName);
      modelList.value = models;
    } catch (e) {
      message.error('加载型号失败');
    }
  }
  await getBaseMaterial();
}

async function onModelChange(modelName) {
  sizeList.value = [];
  if (!editId.value) {
    form.value.size = null;
  }
  if (modelName && form.value.seriesName) {
    try {
      const prices = await priceApi.getAll();
      const modelPrices = prices.filter(p => p.valveName === modelName);
      const sizes = [...new Set(modelPrices.map(p => p.size))].sort((a, b) => a - b);
      sizeList.value = sizes;
    } catch (e) {
      message.error('加载尺寸失败');
    }
  }
  await getBaseMaterial();
}

async function onPartChange() {
  await getBaseMaterial();
}

async function getBaseMaterial() {
  if (!form.value.seriesName) return;
  if (editId.value && form.value.baseMaterial) return;
  
  try {
    const materials = await materialApi.getBySeries(form.value.seriesName);
    let baseMaterial = '';
    
    if (form.value.modelName) {
      const modelMat = materials.find(m => m.valveName === form.value.modelName);
      if (modelMat) {
        const field = partMaterialFieldMap[form.value.partName];
        baseMaterial = modelMat[field] || '';
      }
    }
    
    if (!baseMaterial) {
      const firstMat = materials[0];
      if (firstMat) {
        const field = partMaterialFieldMap[form.value.partName];
        baseMaterial = firstMat[field] || '';
      }
    }
    
    form.value.baseMaterial = baseMaterial;
  } catch (e) {
    console.error('查询基础材质失败:', e);
  }
}

function del(record) {
  const modelInfo = record.modelName ? `/${record.modelName}` : '';
  const sizeInfo = record.size ? `/DN${record.size}` : '';
  confirm({
    title: '确认删除',
    content: `确定要删除材质价差 "${record.seriesName}${modelInfo}${sizeInfo}-${partMap[record.partName]}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
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

async function batchDelete() {
  confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条材质价差吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        for (const id of selectedRowKeys.value) {
          await materialDiffApi.delete(id);
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
        modelName: '',
        size: null,
        partName: 'body',
        baseMaterial: '',
        targetMaterial: '',
        priceDiff: 0,
        remark: ''
      };
      editId.value = null;
    } else {
      form.value = {
        seriesName: form.value.seriesName,
        modelName: form.value.modelName,
        size: form.value.size,
        partName: form.value.partName,
        baseMaterial: '',
        targetMaterial: '',
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
