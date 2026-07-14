<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">材质库管理</span>
      </template>
      <template #extra>
        <a-space>
          <a-input-search v-model:value="searchText" placeholder="搜索材质代码/名称" style="width: 220px" allowClear />
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增材质
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
          <template v-if="column.key === 'materialCode'">
            <a-tag color="blue">{{ record.materialCode }}</a-tag>
          </template>
          <template v-if="column.key === 'materialName'">
            <span style="font-weight: 500;">{{ record.materialName }}</span>
          </template>
          <template v-if="column.key === 'category'">
            <a-tag :color="record.category === '阀体' ? 'cyan' : 'geekblue'">{{ record.category }}</a-tag>
          </template>
          <template v-if="column.key === 'applicableParts'">
            <span class="text-muted">{{ record.applicableParts || '-' }}</span>
          </template>
          <template v-if="column.key === 'remark'">
            <span class="text-muted">{{ record.remark || '-' }}</span>
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
        <a-form-item label="材质代码" required>
          <a-input v-model:value="form.materialCode" placeholder="如 SS304" />
        </a-form-item>
        <a-form-item label="材质名称" required>
          <a-input v-model:value="form.materialName" placeholder="如 不锈钢304" />
        </a-form-item>
        <a-form-item label="材质分类">
          <a-select v-model:value="form.category">
            <a-select-option value="阀体">阀体</a-select-option>
            <a-select-option value="闸板/阀杆/支架">闸板/阀杆/支架</a-select-option>
            <a-select-option value="闸板/阀杆">闸板/阀杆</a-select-option>
            <a-select-option value="阀杆">阀杆</a-select-option>
            <a-select-option value="支架">支架</a-select-option>
            <a-select-option value="闸板">闸板</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="适用部位">
          <a-input v-model:value="form.applicableParts" placeholder="用逗号分隔" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="form.remark" placeholder="如标准号" :rows="2" />
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
import { materialLibApi } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const searchText = ref('');
const showModal = ref(false);
const form = ref({
  materialCode: '',
  materialName: '',
  category: '阀体',
  applicableParts: '',
  remark: ''
});
const editId = ref(null);
const loading = ref(true);

const filteredData = computed(() => {
  if (!searchText.value) return data.value;
  return data.value.filter(item =>
    (item.materialCode && item.materialCode.includes(searchText.value)) ||
    (item.materialName && item.materialName.includes(searchText.value))
  );
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '材质代码', dataIndex: 'materialCode', key: 'materialCode', width: 110 },
  { title: '材质名称', dataIndex: 'materialName', key: 'materialName', width: 140 },
  { title: '材质分类', dataIndex: 'category', key: 'category', width: 130 },
  { title: '适用部位', dataIndex: 'applicableParts', key: 'applicableParts', width: 150 },
  { title: '备注', dataIndex: 'remark', key: 'remark', ellipsis: true },
  { title: '操作', key: 'action', width: 120 }
];

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const modalTitle = ref('新增材质');

onMounted(() => {
  loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const result = await materialLibApi.getAll();
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
    materialCode: record.materialCode,
    materialName: record.materialName,
    category: record.category,
    applicableParts: record.applicableParts,
    remark: record.remark || ''
  };
  modalTitle.value = '编辑材质';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除材质 "${record.materialCode}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        await materialLibApi.delete(record.id);
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
      await materialLibApi.update(editId.value, form.value);
      message.success('更新成功');
    } else {
      await materialLibApi.create(form.value);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = {
        materialCode: '',
        materialName: '',
        category: '阀体',
        applicableParts: '',
        remark: ''
      };
      editId.value = null;
    } else {
      form.value = {
        materialCode: '',
        materialName: '',
        category: '阀体',
        applicableParts: '',
        remark: ''
      };
    }
    loadData();
  } catch (e) {
    message.error('操作失败');
  }
}
</script>
