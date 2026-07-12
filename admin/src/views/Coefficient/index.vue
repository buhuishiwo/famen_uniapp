<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">报价系数管理</span>
      </template>
      <template #extra>
        <a-button type="primary" @click="showModal = true">
          <PlusOutlined /> 新增系数规则
        </a-button>
      </template>
      <template v-if="loading">
        <a-table :columns="columns" :data-source="skeletonData" :pagination="false" rowKey="key" size="middle" :scroll="{ x: 1100 }">
          <template #bodyCell="{ column }">
            <a-skeleton :paragraph="{ rows: 1, width: column.width || 100 }" :active="true" />
          </template>
        </a-table>
      </template>
      <a-table v-else :columns="columns" :data-source="data" :pagination="{ pageSize: 10, showSizeChanger: true }" rowKey="id" size="middle" :scroll="{ x: 1100 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'seriesName'">
            <a-tag color="blue">{{ record.seriesName }}</a-tag>
          </template>
          <template v-if="column.key === 'dnRange'">
            <span>DN{{ record.dnMin }} - DN{{ record.dnMax }}</span>
          </template>
          <template v-if="column.key === 'moqMetOemCoeff' || column.key === 'moqMetOriginalCoeff' || column.key === 'moqUnmetOemCoeff' || column.key === 'moqUnmetOriginalCoeff'">
            <a-tag :color="record[column.dataIndex] > 1.5 ? 'red' : record[column.dataIndex] > 1.2 ? 'orange' : 'green'">
              ×{{ (record[column.dataIndex] || 0).toFixed(2) }}
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

    <a-modal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false" width="620px">
      <a-form :model="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="产品系列" required>
          <a-select v-model:value="form.seriesName" placeholder="请选择系列" style="width: 100%">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="产品名">
          <a-input v-model:value="form.productName" placeholder="可选" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="规格DN起">
              <a-input-number v-model:value="form.dnMin" :min="0" :placeholder="'如 50'" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="规格DN止">
              <a-input-number v-model:value="form.dnMax" :min="0" :placeholder="'如 150'" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="起订量(MOQ)">
          <a-input-number v-model:value="form.minOrderQty" :min="1" :placeholder="'最小起订数量'" style="width: 100%" />
        </a-form-item>
        <a-divider style="margin: 16px 0 12px 0;" />
        <a-card :bordered="false" class="coeff-card">
          <template #title>
            <span style="font-size: 14px; font-weight: 500;">达到 MOQ</span>
          </template>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="磨标系数" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                <a-input-number v-model:value="form.moqMetOemCoeff" :min="0" :step="0.01" :precision="2" :placeholder="'1.5'" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="原装系数" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                <a-input-number v-model:value="form.moqMetOriginalCoeff" :min="0" :step="0.01" :precision="2" :placeholder="'1.2'" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card :bordered="false" class="coeff-card" style="margin-top: 12px;">
          <template #title>
            <span style="font-size: 14px; font-weight: 500;">未达 MOQ</span>
          </template>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="磨标系数" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                <a-input-number v-model:value="form.moqUnmetOemCoeff" :min="0" :step="0.01" :precision="2" :placeholder="'2.0'" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="原装系数" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                <a-input-number v-model:value="form.moqUnmetOriginalCoeff" :min="0" :step="0.01" :precision="2" :placeholder="'1.5'" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="showModal = false">取消</a-button>
          <a-button type="primary" @click="handleOk(false)" v-if="editId">确定</a-button>
          <a-button type="primary" @click="handleOk(false)" v-else>添加</a-button>
          <a-button type="primary" @click="handleOk(true)" v-if="!editId">添加并继续</a-button>
          <a-button type="dashed" @click="handleApplyToAll" v-if="!editId">应用到所有系列</a-button>
        </a-space>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { coefficientApi, seriesApi } from '../../api';
import { message, Modal } from 'ant-design-vue';

const { confirm } = Modal;

const data = ref([]);
const seriesList = ref([]);
const showModal = ref(false);
const form = ref({
  seriesName: '',
  productName: '',
  dnMin: 50,
  dnMax: 150,
  minOrderQty: 50,
  moqMetOemCoeff: 1.5,
  moqMetOriginalCoeff: 1.2,
  moqUnmetOemCoeff: 2.0,
  moqUnmetOriginalCoeff: 1.5
});
const editId = ref(null);
const loading = ref(true);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '产品系列', dataIndex: 'seriesName', key: 'seriesName', width: 110 },
  { title: '产品名', dataIndex: 'productName', key: 'productName', width: 120 },
  { title: '规格范围', key: 'dnRange', width: 120 },
  { title: '起订量', dataIndex: 'minOrderQty', key: 'minOrderQty', width: 80 },
  { title: 'MOQ磨标', dataIndex: 'moqMetOemCoeff', key: 'moqMetOemCoeff', width: 90 },
  { title: 'MOQ原装', dataIndex: 'moqMetOriginalCoeff', key: 'moqMetOriginalCoeff', width: 90 },
  { title: '未达MOQ磨标', dataIndex: 'moqUnmetOemCoeff', key: 'moqUnmetOemCoeff', width: 110 },
  { title: '未达MOQ原装', dataIndex: 'moqUnmetOriginalCoeff', key: 'moqUnmetOriginalCoeff', width: 110 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' }
];

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const modalTitle = ref('新增系数规则');

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
    const result = await coefficientApi.getAll();
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
    productName: record.productName || '',
    dnMin: record.dnMin,
    dnMax: record.dnMax,
    minOrderQty: record.minOrderQty,
    moqMetOemCoeff: record.moqMetOemCoeff,
    moqMetOriginalCoeff: record.moqMetOriginalCoeff,
    moqUnmetOemCoeff: record.moqUnmetOemCoeff,
    moqUnmetOriginalCoeff: record.moqUnmetOriginalCoeff
  };
  modalTitle.value = '编辑系数规则';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除系数规则 "${record.seriesName}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        await coefficientApi.delete(record.id);
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
      await coefficientApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await coefficientApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = {
        seriesName: '',
        productName: '',
        dnMin: 50,
        dnMax: 150,
        minOrderQty: 50,
        moqMetOemCoeff: 1.5,
        moqMetOriginalCoeff: 1.2,
        moqUnmetOemCoeff: 2.0,
        moqUnmetOriginalCoeff: 1.5
      };
      editId.value = null;
    } else {
      form.value = {
        seriesName: form.value.seriesName,
        productName: '',
        dnMin: 50,
        dnMax: 150,
        minOrderQty: 50,
        moqMetOemCoeff: 1.5,
        moqMetOriginalCoeff: 1.2,
        moqUnmetOemCoeff: 2.0,
        moqUnmetOriginalCoeff: 1.5
      };
    }
    loadData();
  } catch (e) {
    message.error('操作失败');
  }
}

async function handleApplyToAll() {
  confirm({
    title: '确认应用到所有系列',
    content: '此操作将把当前配置的系数规则（规格范围、起订量、各系数）应用到所有产品系列。如果某个系列已有相同规格范围的规则，将被更新；如果没有，将新建规则。是否继续？',
    okText: '确定',
    cancelText: '取消',
    okType: 'primary',
    async onOk() {
      try {
        const result = await coefficientApi.applyToAllSeries({
          dnMin: form.value.dnMin,
          dnMax: form.value.dnMax,
          minOrderQty: form.value.minOrderQty,
          moqMetOemCoeff: form.value.moqMetOemCoeff,
          moqMetOriginalCoeff: form.value.moqMetOriginalCoeff,
          moqUnmetOemCoeff: form.value.moqUnmetOemCoeff,
          moqUnmetOriginalCoeff: form.value.moqUnmetOriginalCoeff
        });
        message.success(result.message || '应用成功');
        showModal.value = false;
        form.value = {
          seriesName: '',
          productName: '',
          dnMin: 50,
          dnMax: 150,
          minOrderQty: 50,
          moqMetOemCoeff: 1.5,
          moqMetOriginalCoeff: 1.2,
          moqUnmetOemCoeff: 2.0,
          moqUnmetOriginalCoeff: 1.5
        };
        editId.value = null;
        loadData();
      } catch (e) {
        message.error('操作失败');
      }
    }
  });
}
</script>

<style scoped>
.coeff-card {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px 16px;
}
</style>
