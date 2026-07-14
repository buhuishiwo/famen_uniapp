<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">价格管理</span>
      </template>
      <template #extra>
        <a-space>
          <a-select v-model:value="selectedSeries" placeholder="筛选系列" style="width: 180px" allowClear @change="loadData">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增价格
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
      <a-table v-else :columns="columns" :data-source="data" :pagination="{ pageSize: 10, showSizeChanger: true }" rowKey="id" size="middle" :scroll="{ x: 1200 }">
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
const showModal = ref(false);
const form = ref({
  seriesName: '',
  valveName: '',
  size: 50,
  price: 0,
  brandingFee: 0,
  status: 'enabled',
  remark: ''
});
const editId = ref(null);
const loading = ref(true);

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

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

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
    okType: 'danger',
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
</script>
