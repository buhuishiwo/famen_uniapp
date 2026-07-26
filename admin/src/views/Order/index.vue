<template>
  <div>
    <a-card :bordered="false" class="page-card">
      <template #title>
        <span class="page-title">订单管理</span>
      </template>
      <template #extra>
        <a-space>
          <span class="filter-label">搜索：</span>
          <a-input-search v-model:value="searchText" placeholder="客户名称" style="width: 160px" allowClear @search="loadData" />
          <span class="filter-label">状态：</span>
          <a-select v-model:value="selectedStatus" placeholder="全部状态" style="width: 120px" allowClear @change="loadData">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="draft">未审核</a-select-option>
            <a-select-option value="confirmed">已确认</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
          </a-select>
          <a-button @click="loadData">刷新</a-button>
        </a-space>
      </template>
      <template v-if="loading">
        <a-table :columns="columns" :data-source="skeletonData" :pagination="false" rowKey="key" size="middle">
          <template #bodyCell="{ column }">
            <a-skeleton :paragraph="{ rows: 1, width: column.width || 100 }" :active="true" />
          </template>
        </a-table>
      </template>
      <a-table v-else :columns="columns" :data-source="pagedData" :pagination="pagination" @change="handleTableChange" rowKey="id" size="middle">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'customerName'">
            {{ record.customerName || '未命名客户' }}
          </template>
          <template v-if="column.key === 'quoter'">
            {{ record.quoter || '-' }}
          </template>
          <template v-if="column.key === 'totalAmount'">
            <span>¥{{ formatMoney(record.totalAmount) }}</span>
          </template>
          <template v-if="column.key === 'finalPrice'">
            <span class="final-price">¥{{ formatMoney(record.finalPrice) }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button size="small" type="link" @click="viewDetail(record)">查看详情</a-button>
              <a-button size="small" type="link" @click="editStatus(record)">更改状态</a-button>
              <a-button size="small" type="link" danger @click="del(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <DraggableModal title="订单详情" :open="showDetailModal" @cancel="showDetailModal = false" :maskClosable="false" width="800px">
      <div v-if="currentDetail">
        <a-descriptions :column="2" bordered size="small" style="margin-bottom: 16px;">
          <a-descriptions-item label="订单编号">{{ currentDetail.id }}</a-descriptions-item>
          <a-descriptions-item label="客户名称">{{ currentDetail.customerName || '未命名客户' }}</a-descriptions-item>
          <a-descriptions-item label="报价人">{{ currentDetail.quoter || '-' }}</a-descriptions-item>
          <a-descriptions-item label="联系电话">{{ currentDetail.quoterPhone || '-' }}</a-descriptions-item>
          <a-descriptions-item label="计算金额">¥{{ formatMoney(currentDetail.totalAmount) }}</a-descriptions-item>
          <a-descriptions-item label="确认金额"><span class="final-price">¥{{ formatMoney(currentDetail.finalPrice) }}</span></a-descriptions-item>
          <a-descriptions-item label="付款方式">{{ currentDetail.paymentMethod || '-' }}</a-descriptions-item>
          <a-descriptions-item label="包装方式">{{ currentDetail.packaging || '-' }}</a-descriptions-item>
          <a-descriptions-item label="有效期">{{ currentDetail.validity || '-' }}</a-descriptions-item>
          <a-descriptions-item label="状态">
            <a-tag :color="getStatusColor(currentDetail.status)">{{ getStatusText(currentDetail.status) }}</a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间" :span="2">{{ formatDate(currentDetail.createdAt) }}</a-descriptions-item>
          <a-descriptions-item label="备注" :span="2">{{ currentDetail.note || '-' }}</a-descriptions-item>
        </a-descriptions>

        <a-divider orientation="left">产品明细</a-divider>
        <a-table :columns="detailColumns" :data-source="currentDetail.items || []" :pagination="false" rowKey="id" size="small">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'unitPrice'">
              ¥{{ formatMoney(record.unitPrice) }}
            </template>
            <template v-if="column.key === 'finalUnitPrice'">
              <span class="final-price">¥{{ formatMoney(record.finalUnitPrice || record.unitPrice) }}</span>
            </template>
            <template v-if="column.key === 'totalPrice'">
              ¥{{ formatMoney(record.totalPrice) }}
            </template>
            <template v-if="column.key === 'productType'">
              <a-tag color="blue">{{ record.productType || '常规品' }}</a-tag>
            </template>
            <template v-if="column.key === 'branding'">
              {{ record.branding ? '是' : '否' }}
            </template>
          </template>
        </a-table>
      </div>
    </DraggableModal>

    <DraggableModal title="更改订单状态" :open="showStatusModal" @cancel="showStatusModal = false" :maskClosable="false" width="400px">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="订单编号">
          <span>{{ currentRecord?.id }}</span>
        </a-form-item>
        <a-form-item label="当前状态">
          <a-tag :color="getStatusColor(currentRecord?.status)">{{ getStatusText(currentRecord?.status) }}</a-tag>
        </a-form-item>
        <a-form-item label="新状态" required>
          <a-select v-model:value="newStatus" placeholder="请选择状态">
            <a-select-option value="draft">未审核</a-select-option>
            <a-select-option value="confirmed">已确认</a-select-option>
            <a-select-option value="completed">已完成</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <template #footer>
        <a-space>
          <a-button @click="showStatusModal = false">取消</a-button>
          <a-button type="primary" @click="confirmUpdateStatus">确定</a-button>
        </a-space>
      </template>
    </DraggableModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Modal } from 'ant-design-vue';
import { orderApi } from '../../api';
import { message } from 'ant-design-vue';
import DraggableModal from '../../components/DraggableModal.vue';

const { confirm } = Modal;

const data = ref([]);
const searchText = ref('');
const selectedStatus = ref('');
const loading = ref(true);
const showDetailModal = ref(false);
const showStatusModal = ref(false);
const currentDetail = ref(null);
const currentRecord = ref(null);
const newStatus = ref('');
const totalCount = ref(0);

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true
});

const filteredData = computed(() => {
  let result = data.value;
  if (searchText.value) {
    result = result.filter(item =>
      item.customerName && item.customerName.includes(searchText.value)
    );
  }
  if (selectedStatus.value) {
    result = result.filter(item => item.status === selectedStatus.value);
  }
  return result;
});

const pagedData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return filteredData.value.slice(start, end);
});

const columns = [
  { title: '订单编号', dataIndex: 'id', key: 'id', width: 180, ellipsis: true },
  { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 150 },
  { title: '报价人', dataIndex: 'quoter', key: 'quoter', width: 100 },
  { title: '计算金额', dataIndex: 'totalAmount', key: 'totalAmount', width: 120 },
  { title: '确认金额', dataIndex: 'finalPrice', key: 'finalPrice', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
  { title: '操作', key: 'action', width: 200, fixed: 'right' }
];

const detailColumns = [
  { title: '产品名称', dataIndex: 'valveName', key: 'valveName', width: 150 },
  { title: '规格', dataIndex: 'spec', key: 'spec', width: 80, customRender: ({ text }) => `DN${text}` },
  { title: '产品类型', dataIndex: 'productType', key: 'productType', width: 100 },
  { title: '闸板材质', dataIndex: 'gatePlate', key: 'gatePlate', width: 90 },
  { title: '阀杆材质', dataIndex: 'rodMaterial', key: 'rodMaterial', width: 90 },
  { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 70 },
  { title: '磨标', dataIndex: 'branding', key: 'branding', width: 70 },
  { title: '计算单价', dataIndex: 'unitPrice', key: 'unitPrice', width: 100 },
  { title: '确认单价', dataIndex: 'finalUnitPrice', key: 'finalUnitPrice', width: 100 },
  { title: '总价', dataIndex: 'totalPrice', key: 'totalPrice', width: 100 }
];

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

function handleTableChange(paginationInfo) {
  pagination.value.current = paginationInfo.current;
  pagination.value.pageSize = paginationInfo.pageSize;
  pagination.value.total = filteredData.value.length;
}

function getStatusColor(status) {
  const colors = {
    draft: 'default',
    confirmed: 'processing',
    completed: 'success'
  };
  return colors[status] || 'default';
}

function getStatusText(status) {
  const texts = {
    draft: '未审核',
    confirmed: '已确认',
    completed: '已完成'
  };
  return texts[status] || status || '未知';
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '0.00';
  const num = Number(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

watch([searchText, selectedStatus], () => {
  pagination.value.current = 1;
  pagination.value.total = filteredData.value.length;
});

onMounted(() => {
  loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const result = await orderApi.getList();
    data.value = result.list || [];
    totalCount.value = result.total || data.value.length;
    pagination.value.total = data.value.length;
  } catch (e) {
    message.error('加载订单列表失败: ' + (e.message || '未知错误'));
  } finally {
    loading.value = false;
  }
}

async function viewDetail(record) {
  try {
    const detail = await orderApi.getDetail(record.id);
    currentDetail.value = detail;
    showDetailModal.value = true;
  } catch (e) {
    message.error('加载订单详情失败: ' + (e.message || '未知错误'));
  }
}

function editStatus(record) {
  currentRecord.value = record;
  newStatus.value = record.status;
  showStatusModal.value = true;
}

async function confirmUpdateStatus() {
  if (!newStatus.value) {
    message.warning('请选择新状态');
    return;
  }
  try {
    await orderApi.update(currentRecord.value.id, { status: newStatus.value });
    message.success('状态更新成功');
    showStatusModal.value = false;
    loadData();
  } catch (e) {
    message.error('状态更新失败: ' + (e.message || '未知错误'));
  }
}

function del(record) {
  const displayName = record.customerName || record.id || '未知订单';
  confirm({
    title: '确认删除',
    content: `确定要删除订单 "${displayName}" 吗？此操作不可恢复。`,
    okText: '确定',
    cancelText: '取消',
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await orderApi.delete(record.id);
        message.success('删除成功');
        loadData();
      } catch (e) {
        message.error('删除失败: ' + (e.message || '未知错误'));
      }
    }
  });
}
</script>

<style scoped>
.page-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 16px;
  font-weight: 600;
}

.filter-label {
  font-size: 14px;
  color: #666;
}

.final-price {
  color: #dc2626;
  font-weight: 600;
}
</style>
