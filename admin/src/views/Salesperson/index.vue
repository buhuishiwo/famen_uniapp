<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">营销员管理</span>
      </template>
      <template #extra>
        <a-space>
          <a-input-search v-model:value="searchText" placeholder="搜索营销员姓名/电话" style="width: 220px" allowClear />
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增营销员
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
      <a-table v-else :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showSizeChanger: true }" rowKey="id" size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-tag color="blue">{{ record.name }}</a-tag>
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

    <a-modal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="姓名" required>
          <a-input v-model:value="form.name" placeholder="请输入营销员姓名" />
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
        <a-form-item label="部门">
          <a-input v-model:value="form.department" placeholder="请输入部门" />
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
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { salespersonApi } from '../../api';
import { message, Modal } from 'ant-design-vue';

const { confirm } = Modal;

const data = ref([]);
const searchText = ref('');
const showModal = ref(false);
const form = ref({
  name: '',
  phone: '',
  email: '',
  department: '',
  status: 1,
  remark: ''
});
const editId = ref(null);
const loading = ref(true);

const filteredData = computed(() => {
  if (!searchText.value) return data.value;
  return data.value.filter(item =>
    (item.name && item.name.includes(searchText.value)) ||
    (item.phone && item.phone.includes(searchText.value))
  );
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
  { title: '电话', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 180 },
  { title: '部门', dataIndex: 'department', key: 'department', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
  { title: '操作', key: 'action', width: 120 }
];

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const modalTitle = ref('新增营销员');

onMounted(() => {
  loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const result = await salespersonApi.getAll();
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
    phone: record.phone || '',
    email: record.email || '',
    department: record.department || '',
    status: record.status,
    remark: record.remark || ''
  };
  modalTitle.value = '编辑营销员';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除营销员 "${record.name}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        await salespersonApi.delete(record.id);
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
      await salespersonApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await salespersonApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = {
        name: '',
        phone: '',
        email: '',
        department: '',
        status: 1,
        remark: ''
      };
      editId.value = null;
    } else {
      form.value = {
        name: '',
        phone: '',
        email: '',
        department: '',
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
