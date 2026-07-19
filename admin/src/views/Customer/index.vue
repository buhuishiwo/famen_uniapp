<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">客户管理</span>
      </template>
      <template #extra>
        <a-space>
          <span class="filter-label">搜索：</span>
          <a-input-search v-model:value="searchText" placeholder="姓名/电话" style="width: 160px" allowClear />
          <span class="filter-label">营销员：</span>
          <a-select v-model:value="selectedSalesperson" placeholder="请选择" style="width: 100px" allowClear @change="loadData">
            <a-select-option v-for="s in salespersonList" :key="s.id" :value="s.id">
              {{ s.name }}
            </a-select-option>
          </a-select>
          <a-button v-if="selectedRowKeys.length > 0" type="primary" danger @click="batchDelete">
            删除选中 ({{ selectedRowKeys.length }})
          </a-button>
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增客户
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
          <template v-if="column.key === 'name'">
            <a-tag color="blue">{{ record.name }}</a-tag>
          </template>
          <template v-if="column.key === 'salespersonName'">
            <a-tag color="geekblue">{{ record.salespersonName || '-' }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 1 ? 'green' : 'red'">
              {{ record.status === 1 ? '启用' : '禁用' }}
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

    <DraggableModal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="姓名/公司" required>
          <a-input v-model:value="form.name" placeholder="请输入客户姓名或公司名称" />
        </a-form-item>
        <a-form-item label="所属营销员">
          <a-select v-model:value="form.salespersonId" placeholder="请选择营销员">
            <a-select-option v-for="s in salespersonList" :key="s.id" :value="s.id">
              {{ s.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="联系电话" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
              <a-input v-model:value="form.phone" placeholder="请输入电话" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="邮箱" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
              <a-input v-model:value="form.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="公司名称">
          <a-input v-model:value="form.company" placeholder="请输入公司名称" />
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="form.address" placeholder="请输入地址" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="form.status">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
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
import { ref, computed, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { customerApi, salespersonApi } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const searchText = ref('');
const selectedSalesperson = ref('');
const salespersonList = ref([]);
const showModal = ref(false);
const form = ref({
  name: '',
  salespersonId: null,
  salespersonName: '',
  phone: '',
  email: '',
  company: '',
  address: '',
  status: 1,
  remark: ''
});
const editId = ref(null);
const loading = ref(true);
const selectedRowKeys = ref([]);

const filteredData = computed(() => {
  let result = data.value;
  if (searchText.value) {
    result = result.filter(item =>
      (item.name && item.name.includes(searchText.value)) ||
      (item.phone && item.phone.includes(searchText.value))
    );
  }
  return result;
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '姓名/公司', dataIndex: 'name', key: 'name', width: 150 },
  { title: '所属营销员', dataIndex: 'salespersonName', key: 'salespersonName', width: 120 },
  { title: '电话', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 180 },
  { title: '公司', dataIndex: 'company', key: 'company', width: 150 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
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

const modalTitle = ref('新增客户');

onMounted(() => {
  loadSalespersons();
  loadData();
});

async function loadSalespersons() {
  try {
    const result = await salespersonApi.getAll();
    salespersonList.value = result;
  } catch (e) {
    message.error('加载营销员失败');
  }
}

async function loadData() {
  loading.value = true;
  try {
    const params = selectedSalesperson.value ? { salespersonId: selectedSalesperson.value } : {};
    const result = await customerApi.getAll(params);
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
    name: record.name,
    salespersonId: record.salespersonId || null,
    salespersonName: record.salespersonName || '',
    phone: record.phone || '',
    email: record.email || '',
    company: record.company || '',
    address: record.address || '',
    status: record.status,
    remark: record.remark || ''
  };
  modalTitle.value = '编辑客户';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除客户 "${record.name}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await customerApi.delete(record.id);
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
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 个客户吗？`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        for (const id of selectedRowKeys.value) {
          await customerApi.delete(id);
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
    const sp = salespersonList.value.find(s => s.id === form.value.salespersonId);
    if (sp) {
      form.value.salespersonName = sp.name;
    }

    if (editId.value) {
      await customerApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await customerApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = {
        name: '',
        salespersonId: null,
        salespersonName: '',
        phone: '',
        email: '',
        company: '',
        address: '',
        status: 1,
        remark: ''
      };
      editId.value = null;
    } else {
      form.value = {
        name: '',
        salespersonId: form.value.salespersonId,
        salespersonName: form.value.salespersonName,
        phone: '',
        email: '',
        company: '',
        address: '',
        status: 1,
        remark: ''
      };
    }
    loadData();
  } catch (e) {
    message.error('操作失败');
  }
}
</script>
