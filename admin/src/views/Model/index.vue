<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">阀门型号管理</span>
      </template>
      <template #extra>
        <a-space>
          <a-select v-model:value="selectedSeries" placeholder="筛选系列" style="width: 180px" allowClear @change="loadData">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增型号
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
          <template v-if="column.key === 'name'">
            <span style="font-weight: 500;">{{ record.name }}</span>
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

    <a-modal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="所属系列" required>
          <a-select v-model:value="form.seriesName" placeholder="请选择系列">
            <a-select-option v-for="s in seriesList" :key="s.name" :value="s.name">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="型号名称" required>
          <a-input v-model:value="form.name" placeholder="请输入型号名称" />
        </a-form-item>
        <a-form-item label="类型编码">
          <a-input v-model:value="form.typeCode" placeholder="请输入类型编码" />
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
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { modelApi, seriesApi } from '../../api';
import { message, Modal } from 'ant-design-vue';

const { confirm } = Modal;

const data = ref([]);
const seriesList = ref([]);
const selectedSeries = ref('');
const showModal = ref(false);
const form = ref({ seriesName: '', name: '', typeCode: '' });
const editId = ref(null);
const loading = ref(true);

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '系列名称', dataIndex: 'seriesName', key: 'seriesName', width: 140 },
  { title: '型号名称', dataIndex: 'name', key: 'name' },
  { title: '类型编码', dataIndex: 'type', key: 'type', width: 120 },
  { title: '操作', key: 'action', width: 140 }
];

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const modalTitle = ref('新增型号');

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
    if (selectedSeries.value) {
      const result = await modelApi.getBySeries(selectedSeries.value);
      data.value = result;
    } else {
      const result = await modelApi.getAll();
      const flatData = [];
      for (const series in result) {
        result[series].forEach(item => {
          flatData.push({ ...item, seriesName: series });
        });
      }
      data.value = flatData;
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
    name: record.name, 
    typeCode: record.type 
  };
  modalTitle.value = '编辑型号';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除型号 "${record.name}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        await modelApi.delete(record.id);
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
      await modelApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await modelApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = { seriesName: '', name: '', typeCode: '' };
      editId.value = null;
    } else {
      form.value = { seriesName: form.value.seriesName, name: '', typeCode: '' };
    }
    loadData();
  } catch (e) {
    message.error('操作失败');
  }
}
</script>
