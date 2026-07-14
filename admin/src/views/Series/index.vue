<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">产品系列管理</span>
      </template>
      <template #extra>
        <a-space>
          <a-input-search v-model:value="searchText" placeholder="搜索系列名称" style="width: 200px" @search="filterData" allowClear />
          <a-button type="primary" @click="showModal = true">
            <PlusOutlined /> 新增系列
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
          <template v-if="column.key === 'image'">
            <span v-if="record.image" class="text-muted">{{ record.image.substring(0, 30) }}...</span>
            <span v-else class="text-muted">-</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" type="link" @click="edit(record)">编辑</a-button>
              <a-button size="small" type="link" danger @click="del(record)">删除</a-button>
              <a-popconfirm
                title="此操作将删除该系列及其下所有型号、价格、材质配置、报价系数和材质价差数据，且不可恢复！"
                ok-text="确认删除"
                cancel-text="取消"
                @confirm="delCascade(record)"
              >
                <a-button size="small" type="link" danger>级联删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <DraggableModal :title="modalTitle" :open="showModal" @cancel="showModal = false" :maskClosable="false">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="系列名称" required>
          <a-input v-model:value="form.name" placeholder="请输入系列名称" />
        </a-form-item>
        <a-form-item label="系列图片">
          <div v-if="form.image" class="image-preview">
            <img :src="form.image" alt="预览" class="preview-img" />
            <a-button type="text" danger @click="removeImage">删除图片</a-button>
          </div>
          <div v-else class="upload-area">
            <input type="file" accept="image/*" class="image-upload-input" @change="handleImageUpload" />
            <a-button type="dashed" block @click="triggerUpload">
              <UploadOutlined /> 上传图片
            </a-button>
          </div>
          <a-alert v-if="!form.image" type="warning" message="图片上传要求" description="支持格式：JPEG、PNG、GIF、WebP；大小限制：不超过2MB；建议尺寸：200×200像素" :show-icon="false" style="margin-top: 12px; font-size: 12px;" />
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
import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { seriesApi, uploadFile, getFileUrl } from '../../api';
import { message, Modal } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const searchText = ref('');
const showModal = ref(false);
const form = ref({ name: '', image: '', imageFileID: '' });
const editId = ref(null);
const loading = ref(true);

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const filteredData = computed(() => {
  if (!searchText.value) return data.value;
  return data.value.filter(item => item.name && item.name.includes(searchText.value));
});

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '系列名称', dataIndex: 'name', key: 'name' },
  { title: '系列图片', dataIndex: 'image', key: 'image' },
  { title: '操作', key: 'action', width: 240 }
];

const modalTitle = ref('新增系列');

onMounted(() => {
  loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const result = await seriesApi.getAll();
    data.value = result;
  } catch (e) {
    message.error('加载失败');
  } finally {
    loading.value = false;
  }
}

function filterData() {}

function triggerUpload() {
  document.querySelector('.image-upload-input')?.click();
}

async function handleImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    message.error('图片大小不能超过2MB');
    return;
  }
  const types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!types.includes(file.type)) {
    message.error('仅支持 jpeg/png/gif/webp 格式');
    return;
  }
  try {
    const result = await uploadFile(file);
    form.value.image = result.tempURL || result;
    form.value.imageFileID = result.fileID || '';
    message.success('图片上传成功');
  } catch (error) {
    console.error('上传失败:', error);
    message.error('图片上传失败，请重试');
  }
}

function removeImage() {
  form.value.image = '';
  form.value.imageFileID = '';
}

async function edit(record) {
  editId.value = record.id;
  let imageUrl = record.image || '';
  let imageFileID = '';
  if (imageUrl && imageUrl.startsWith('cloud://')) {
    imageFileID = imageUrl;
    try {
      imageUrl = await getFileUrl(imageUrl);
    } catch (e) {
      console.error('获取图片链接失败:', e);
    }
  }
  form.value = { name: record.name, image: imageUrl, imageFileID: imageFileID };
  modalTitle.value = '编辑系列';
  showModal.value = true;
}

function del(record) {
  confirm({
    title: '确认删除',
    content: `确定要删除系列 "${record.name}" 吗？（仅在该系列下无型号时可删除）`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    async onOk() {
      try {
        await seriesApi.delete(record.id);
        message.success('删除成功');
        loadData();
      } catch (e) {
        message.error(e.message || '删除失败');
      }
    }
  });
}

async function delCascade(record) {
  try {
    const result = await seriesApi.deleteCascade(record.id, record.name);
    message.success(result || '级联删除成功');
    loadData();
  } catch (e) {
    message.error(e.message || '级联删除失败');
  }
}

async function handleOk(continueAdd = false) {
  try {
    const submitData = {
      name: form.value.name,
      image: form.value.imageFileID || form.value.image
    };
    if (editId.value) {
      await seriesApi.update(editId.value, submitData);
      message.success('更新成功');
    } else {
      await seriesApi.create(submitData);
      message.success('创建成功');
    }
    if (!continueAdd) {
      showModal.value = false;
      form.value = { name: '', image: '', imageFileID: '' };
      editId.value = null;
    } else {
      form.value = { name: '', image: '', imageFileID: '' };
    }
    loadData();
  } catch (e) {
    message.error(e.message || '操作失败');
  }
}
</script>

<style>
.page-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.page-title {
  font-size: 16px;
  font-weight: 600;
}
.text-muted {
  color: rgba(0, 0, 0, 0.35);
  font-size: 13px;
}
.image-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.preview-img {
  max-width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  background-color: #fafafa;
}
.image-upload-input {
  display: none !important;
}
.upload-area {
  display: flex;
  flex-direction: column;
}
.upload-area :deep(input[type="file"]) {
  display: none !important;
}
</style>
