<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">价格管理</span>
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
          <a-select v-model:value="selectedModel" placeholder="请选择" style="width: 150px" allowClear @change="filterData">
            <a-select-option v-for="m in modelList" :key="m.name" :value="m.name">
              {{ m.name }}
            </a-select-option>
          </a-select>
          <span class="filter-label">搜索：</span>
          <a-input-search v-model:value="searchText" placeholder="型号/规格" style="width: 150px" allowClear @search="filterData" />
          <a-button v-if="selectedRowKeys.length > 0" type="primary" danger @click="batchDelete">
            删除选中 ({{ selectedRowKeys.length }})
          </a-button>
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增价格
          </a-button>
          <a-button type="default" @click="showMinOrderQtyModal = true">
            批量设置起订量
          </a-button>
        </a-space>
      </template>
      <template v-if="loading">
        <a-table :columns="columns" :data-source="skeletonData" :pagination="false" rowKey="key" size="middle" :scroll="{ x: 1200 }">
          <template #bodyCell="{ column }">
            <a-skeleton :paragraph="{ rows: 1, width: column.width || 100 }" :active="true" />
          </template>
        </a-table>
      </template>
      <a-table v-else :columns="columns" :data-source="filteredData" :pagination="pagination" @change="handleTableChange" rowKey="id" size="middle" :scroll="{ x: 1200 }" :row-selection="rowSelection">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'seriesName'">
            <a-tag color="blue">{{ record.seriesName }}</a-tag>
          </template>
          <template v-if="column.key === 'valveName'">
            <span style="font-weight: 500;">{{ record.valveName }}</span>
          </template>
          <template v-if="column.key === 'size'">
            <span>DN{{ record.size }}</span>
          </template>
          <template v-if="column.key === 'price' || column.key === 'brandingFee'">
            <span>¥{{ record[column.dataIndex] }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'enabled' ? 'green' : 'red'">
              {{ record.status === 'enabled' ? '启用' : '禁用' }}
            </a-tag>
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
        <a-form-item label="系列名称" required>
          <a-select v-model:value="form.seriesName" placeholder="请选择系列">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="阀门型号" required>
          <a-select v-model:value="form.valveName" placeholder="请选择型号">
            <a-select-option v-for="m in modelList" :key="m.name" :value="m.name">
              {{ m.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="规格DN" required>
          <a-input-number v-model:value="form.size" :min="1" style="width: 100%" />
        </a-form-item>
        <a-form-item label="价格" required>
          <a-input-number v-model:value="form.price" :min="0" style="width: 100%" prefix="¥" />
        </a-form-item>
        <a-form-item label="起订量(MOQ)" required>
          <a-input-number v-model:value="form.minOrderQty" :min="1" :placeholder="'最小起订数量'" style="width: 100%" />
        </a-form-item>
        <a-form-item label="磨标费">
          <a-input-number v-model:value="form.brandingFee" :min="0" style="width: 100%" prefix="¥" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="form.status">
            <a-select-option value="enabled">启用</a-select-option>
            <a-select-option value="disabled">禁用</a-select-option>
          </a-select>
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

    <DraggableModal title="批量设置起订量" :open="showMinOrderQtyModal" @cancel="showMinOrderQtyModal = false" :maskClosable="false" width="520px">
      <a-form :model="minOrderQtyForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="产品系列">
          <a-select v-model:value="minOrderQtyForm.seriesName" placeholder="不填则应用到所有系列" style="width: 100%">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="DN起" required>
              <a-input-number v-model:value="minOrderQtyForm.dnMin" :min="0" :placeholder="'如 50'" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="DN止" required>
              <a-input-number v-model:value="minOrderQtyForm.dnMax" :min="0" :placeholder="'如 150'" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="起订量(MOQ)" required>
          <a-input-number v-model:value="minOrderQtyForm.minOrderQty" :min="1" :placeholder="'最小起订数量'" style="width: 100%" />
        </a-form-item>
        <a-alert type="warning" :showIcon="true" message="此操作将批量更新指定DN范围的产品起订量，请谨慎操作！" :closable="false" style="margin-top: 16px;" />
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="showMinOrderQtyModal = false">取消</a-button>
          <a-button type="primary" @click="handleBatchSetMinOrderQty">确认设置</a-button>
        </a-space>
      </template>
    </DraggableModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { priceApi, seriesApi, modelApi } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const seriesList = ref([]);
const modelList = ref([]);
const selectedSeries = ref('');
const selectedModel = ref('');
const searchText = ref('');
const showModal = ref(false);
const showMinOrderQtyModal = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  showSizeChanger: true
});
const form = ref({
  seriesName: '',
  valveName: '',
  size: 50,
  price: 0,
  minOrderQty: 50,
  brandingFee: 0,
  status: 'enabled',
  remark: ''
});
const minOrderQtyForm = ref({
  seriesName: '',
  dnMin: 50,
  dnMax: 150,
  minOrderQty: 50
});
const editId = ref(null);
const loading = ref(true);
const selectedRowKeys = ref([]);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '系列', dataIndex: 'seriesName', key: 'seriesName', width: 100 },
  { title: '型号', dataIndex: 'valveName', key: 'valveName', width: 140 },
  { title: '规格', dataIndex: 'size', key: 'size', width: 80 },
  { title: '价格', dataIndex: 'price', key: 'price', width: 90 },
  { title: '磨标费', dataIndex: 'brandingFee', key: 'brandingFee', width: 80 },
  { title: '起订量', dataIndex: 'minOrderQty', key: 'minOrderQty', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' }
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
  if (selectedModel.value) {
    result = result.filter(item => item.valveName === selectedModel.value);
  }
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(item => 
      (item.valveName || '').toLowerCase().includes(keyword) ||
      String(item.size || '').includes(keyword)
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

const modalTitle = ref('新增价格');

onMounted(() => {
  loadSeries();
  loadData();
});

watch(selectedSeries, () => {
  loadModelList();
});

watch(() => form.value.seriesName, (newVal) => {
  if (newVal) {
    loadModelListByFormSeries();
  } else {
    modelList.value = [];
  }
});

async function loadSeries() {
  try {
    const result = await seriesApi.getAll();
    seriesList.value = result;
  } catch (e) {
    message.error('加载系列失败');
  }
}

async function loadModelList() {
  try {
    if (selectedSeries.value) {
      const result = await modelApi.getBySeries(selectedSeries.value);
      modelList.value = result;
    }
  } catch (e) {
    message.error('加载型号失败');
  }
}

async function loadModelListByFormSeries() {
  try {
    if (form.value.seriesName) {
      const result = await modelApi.getBySeries(form.value.seriesName);
      modelList.value = result;
    }
  } catch (e) {
    message.error('加载型号失败');
  }
}

async function loadData() {
  loading.value = true;
  try {
    if (selectedSeries.value) {
      const result = await priceApi.getBySeries(selectedSeries.value);
      data.value = result;
    } else {
      const result = await priceApi.getAll();
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
    valveName: record.valveName,
    size: record.size,
    price: record.price,
    minOrderQty: record.minOrderQty || 50,
    brandingFee: record.brandingFee,
    status: record.status,
    remark: record.remark || ''
  };
  modalTitle.value = '编辑价格';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除价格数据 "${record.valveName} DN${record.size}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await priceApi.delete(record.id);
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
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条价格数据吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        for (const id of selectedRowKeys.value) {
          await priceApi.delete(id);
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
      await priceApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await priceApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = {
        seriesName: '',
        valveName: '',
        size: 50,
        price: 0,
        brandingFee: 0,
        status: 'enabled',
        remark: ''
      };
      editId.value = null;
    } else {
      form.value = {
        seriesName: form.value.seriesName,
        valveName: form.value.valveName,
        size: 50,
        price: 0,
        brandingFee: 0,
        status: 'enabled',
        remark: ''
      };
    }
    loadData();
  } catch (e) {
    message.error('操作失败');
  }
}

async function handleBatchSetMinOrderQty() {
  if (minOrderQtyForm.value.dnMin === undefined || minOrderQtyForm.value.dnMin === null) {
    message.warning('请输入DN起始值');
    return;
  }
  if (minOrderQtyForm.value.dnMax === undefined || minOrderQtyForm.value.dnMax === null) {
    message.warning('请输入DN终止值');
    return;
  }
  if (minOrderQtyForm.value.minOrderQty === undefined || minOrderQtyForm.value.minOrderQty === null) {
    message.warning('请输入起订量');
    return;
  }
  if (minOrderQtyForm.value.dnMin > minOrderQtyForm.value.dnMax) {
    message.warning('DN起始值不能大于终止值');
    return;
  }
  
  const targetSeries = minOrderQtyForm.value.seriesName || '所有系列';
  const dnRange = `DN${minOrderQtyForm.value.dnMin} - DN${minOrderQtyForm.value.dnMax}`;
  
  confirm({
    title: '确认批量设置起订量',
    content: `此操作将把"${targetSeries}"下${dnRange}范围内的产品起订量设置为 ${minOrderQtyForm.value.minOrderQty}。是否继续？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        const result = await priceApi.batchSetMinOrderQty({
          seriesName: minOrderQtyForm.value.seriesName,
          dnMin: minOrderQtyForm.value.dnMin,
          dnMax: minOrderQtyForm.value.dnMax,
          minOrderQty: minOrderQtyForm.value.minOrderQty
        });
        message.success(result.message || '设置成功');
        showMinOrderQtyModal.value = false;
        minOrderQtyForm.value = {
          seriesName: '',
          dnMin: 50,
          dnMax: 150,
          minOrderQty: 50
        };
        loadData();
      } catch (e) {
        message.error('操作失败');
      }
    }
  });
}
</script>
