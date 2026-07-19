<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">材质组合管理</span>
      </template>
      <template #extra>
        <a-space>
          <span class="filter-label">搜索：</span>
          <a-input-search v-model:value="searchText" placeholder="组合名称" style="width: 180px" allowClear />
          <a-button v-if="selectedRowKeys.length > 0" type="primary" danger @click="batchDelete">
            删除选中 ({{ selectedRowKeys.length }})
          </a-button>
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增组合
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
      <a-table v-else :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true }" rowKey="id" size="middle" :row-selection="rowSelection">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'comboName'">
            <a-tag color="blue">{{ record.comboName }}</a-tag>
          </template>
          <template v-if="column.key === 'bodyMaterial'">
            <a-tag color="cyan">{{ record.bodyMaterial || '-' }}</a-tag>
          </template>
          <template v-if="column.key === 'gatePlateMaterial'">
            <a-tag color="geekblue">{{ record.gatePlateMaterial || '-' }}</a-tag>
          </template>
          <template v-if="column.key === 'stemMaterial'">
            <a-tag color="purple">{{ record.stemMaterial || '-' }}</a-tag>
          </template>
          <template v-if="column.key === 'yokeMaterial'">
            <a-tag color="orange">{{ record.yokeMaterial || '-' }}</a-tag>
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

    <DraggableModal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="组合名称" required>
          <a-input v-model:value="form.comboName" placeholder="如 标准组合A" />
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="阀体材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
              <a-input v-model:value="form.bodyMaterial" placeholder="如 WCB" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="闸板材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
              <a-input v-model:value="form.gatePlateMaterial" placeholder="如 SS304" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="阀杆材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
              <a-input v-model:value="form.stemMaterial" placeholder="如 2Cr13" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="支架材质" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
              <a-input v-model:value="form.yokeMaterial" placeholder="如 Q235" />
            </a-form-item>
          </a-col>
        </a-row>
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
import { PlusOutlined } from '@ant-design/icons-vue';
import { materialComboApi } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const searchText = ref('');
const showModal = ref(false);
const form = ref({
  comboName: '',
  bodyMaterial: '',
  gatePlateMaterial: '',
  stemMaterial: '',
  yokeMaterial: '',
  remark: ''
});
const editId = ref(null);
const loading = ref(true);
const selectedRowKeys = ref([]);

const filteredData = computed(() => {
  if (!searchText.value) return data.value;
  return data.value.filter(item =>
    (item.comboName && item.comboName.includes(searchText.value))
  );
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '组合名称', dataIndex: 'comboName', key: 'comboName', width: 140 },
  { title: '阀体材质', dataIndex: 'bodyMaterial', key: 'bodyMaterial', width: 100 },
  { title: '闸板材质', dataIndex: 'gatePlateMaterial', key: 'gatePlateMaterial', width: 100 },
  { title: '阀杆材质', dataIndex: 'stemMaterial', key: 'stemMaterial', width: 100 },
  { title: '支架材质', dataIndex: 'yokeMaterial', key: 'yokeMaterial', width: 100 },
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

const modalTitle = ref('新增材质组合');

onMounted(() => {
  loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const result = await materialComboApi.getAll();
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
    comboName: record.comboName,
    bodyMaterial: record.bodyMaterial,
    gatePlateMaterial: record.gatePlateMaterial,
    stemMaterial: record.stemMaterial,
    yokeMaterial: record.yokeMaterial,
    remark: record.remark || ''
  };
  modalTitle.value = '编辑材质组合';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除材质组合 "${record.comboName}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await materialComboApi.delete(record.id);
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
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条材质组合吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        for (const id of selectedRowKeys.value) {
          await materialComboApi.delete(id);
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
      await materialComboApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await materialComboApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = {
        comboName: '',
        bodyMaterial: '',
        gatePlateMaterial: '',
        stemMaterial: '',
        yokeMaterial: '',
        remark: ''
      };
      editId.value = null;
    } else {
      form.value = {
        comboName: '',
        bodyMaterial: '',
        gatePlateMaterial: '',
        stemMaterial: '',
        yokeMaterial: '',
        remark: ''
      };
    }
    loadData();
  } catch (e) {
    message.error('操作失败');
  }
}
</script>
