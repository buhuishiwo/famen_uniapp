<template>
  <div class="dashboard-container">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="(item, index) in statCards" :key="'stat-' + index">
        <a-card :bordered="false" class="stat-card" :class="'stat-card-' + index">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-value">{{ loading ? '--' : item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
            <div class="stat-icon">
              <component :is="item.icon" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col :span="6" v-for="(item, index) in orderStatCards" :key="'order-stat-' + index">
        <a-card :bordered="false" class="stat-card order-stat-card" :class="'order-stat-' + index">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-value">{{ loading ? '--' : item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
            <div class="stat-icon">
              <component :is="item.icon" />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col :span="16">
        <a-card :bordered="false" class="chart-card">
          <template #title>
            <span class="card-title">订单趋势（近30天）</span>
          </template>
          <div ref="orderTrendChartRef" class="chart-container"></div>
          <a-empty v-if="!loading && orderTrend.length === 0" description="暂无数据" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :bordered="false" class="chart-card">
          <template #title>
            <span class="card-title">订单状态分布</span>
          </template>
          <div ref="orderStatusChartRef" class="chart-container pie-chart"></div>
          <a-empty v-if="!loading && orderStatusDistribution.length === 0" description="暂无数据" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col :span="12">
        <a-card :bordered="false" class="chart-card">
          <template #title>
            <span class="card-title">各系列型号数量分布</span>
          </template>
          <div ref="barChartRef" class="chart-container"></div>
          <a-empty v-if="!loading && seriesModelStats.length === 0" description="暂无数据" />
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :bordered="false" class="chart-card">
          <template #title>
            <span class="card-title">阀体材质分布</span>
          </template>
          <div ref="pieChartRef" class="chart-container pie-chart"></div>
          <a-empty v-if="!loading && materialDistribution.length === 0" description="暂无数据" />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 16px;">
      <a-col :span="12">
        <a-card :bordered="false" class="table-card">
          <template #title>
            <span class="card-title">最近订单</span>
          </template>
          <template #extra>
            <a-button type="link" @click="goToOrders">查看全部</a-button>
          </template>
          <template v-if="loading">
            <a-table :columns="orderColumns" :data-source="skeletonData" :pagination="false" rowKey="key" size="middle">
              <template #bodyCell="{ column }">
                <a-skeleton :paragraph="{ rows: 1, width: column.width || 100 }" :active="true" />
              </template>
            </a-table>
          </template>
          <a-table v-else :columns="orderColumns" :data-source="recentOrders" :pagination="false" rowKey="id" size="middle">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'finalPrice'">
                ¥{{ formatMoney(record.finalPrice) }}
              </template>
              <template v-if="column.key === 'status'">
                <a-tag :color="getOrderStatusColor(record.status)">
                  {{ getOrderStatusText(record.status) }}
                </a-tag>
              </template>
              <template v-if="column.key === 'createdAt'">
                {{ formatDate(record.createdAt) }}
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :bordered="false" class="table-card">
          <template #title>
            <span class="card-title">最近添加的价格数据</span>
          </template>
          <template #extra>
            <a-button type="link" @click="goToPrice">查看全部</a-button>
          </template>
          <template v-if="loading">
            <a-table :columns="priceColumns" :data-source="skeletonData" :pagination="false" rowKey="key" size="middle">
              <template #bodyCell="{ column }">
                <a-skeleton :paragraph="{ rows: 1, width: column.width || 100 }" :active="true" />
              </template>
            </a-table>
          </template>
          <a-table v-else :columns="priceColumns" :data-source="recentPrices" :pagination="false" rowKey="id" size="middle">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'size'">
                DN{{ record.size }}
              </template>
              <template v-if="column.key === 'price'">
                ¥{{ record.price }}
              </template>
              <template v-if="column.key === 'status'">
                <a-tag :color="record.status === 'enabled' ? 'green' : 'red'">
                  {{ record.status === 'enabled' ? '启用' : '禁用' }}
                </a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import {
  AppstoreOutlined,
  TagsOutlined,
  DollarOutlined,
  BgColorsOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue';
import { statsApi } from '../../api';
import { message } from 'ant-design-vue';
import { Chart } from '@antv/g2';

const router = useRouter();
const loading = ref(true);
const summary = ref({});
const seriesModelStats = ref([]);
const materialDistribution = ref([]);
const recentPrices = ref([]);

const orderSummary = ref({});
const orderStatusDistribution = ref([]);
const orderTrend = ref([]);
const recentOrders = ref([]);

const barChartRef = ref(null);
const pieChartRef = ref(null);
const orderTrendChartRef = ref(null);
const orderStatusChartRef = ref(null);
let barChart = null;
let pieChart = null;
let orderTrendChart = null;
let orderStatusChart = null;

const statCards = computed(() => [
  { label: '产品系列', value: summary.value.seriesCount || 0, icon: AppstoreOutlined },
  { label: '阀门型号', value: summary.value.modelCount || 0, icon: TagsOutlined },
  { label: '价格记录', value: summary.value.priceCount || 0, icon: DollarOutlined },
  { label: '材质标配', value: summary.value.materialCount || 0, icon: BgColorsOutlined }
]);

const orderStatCards = computed(() => [
  { label: '订单总数', value: orderSummary.value.totalOrders || 0, icon: ShoppingCartOutlined },
  { label: '未审核', value: orderSummary.value.pendingCount || 0, icon: ClockCircleOutlined },
  { label: '已确认', value: orderSummary.value.confirmedCount || 0, icon: CheckCircleOutlined },
  { label: '订单总额', value: '¥' + formatMoney(orderSummary.value.totalAmount), icon: TrophyOutlined }
]);

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const priceColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '阀门型号', dataIndex: 'valveName', key: 'valveName' },
  { title: '规格', dataIndex: 'size', key: 'size', width: 100 },
  { title: '价格', dataIndex: 'price', key: 'price', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 }
];

const orderColumns = [
  { title: '客户名称', dataIndex: 'customerName', key: 'customerName', width: 120 },
  { title: '金额', dataIndex: 'finalPrice', key: 'finalPrice', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 }
];

onMounted(async () => {
  await loadData();
});

onBeforeUnmount(() => {
  if (barChart) { barChart.destroy(); barChart = null; }
  if (pieChart) { pieChart.destroy(); pieChart = null; }
  if (orderTrendChart) { orderTrendChart.destroy(); orderTrendChart = null; }
  if (orderStatusChart) { orderStatusChart.destroy(); orderStatusChart = null; }
});

async function loadData() {
  loading.value = true;
  try {
    const [dashboardResult, orderResult] = await Promise.all([
      statsApi.getDashboardStats(),
      statsApi.getOrderStats()
    ]);
    
    summary.value = dashboardResult.summary || {};
    seriesModelStats.value = dashboardResult.seriesModelStats || [];
    materialDistribution.value = dashboardResult.materialDistribution || [];
    recentPrices.value = dashboardResult.recentPrices || [];

    orderSummary.value = orderResult.summary || {};
    orderStatusDistribution.value = orderResult.statusDistribution || [];
    orderTrend.value = orderResult.orderTrend || [];
    recentOrders.value = orderResult.recentOrders || [];

    await nextTick();
    renderBarChart();
    renderPieChart();
    renderOrderTrendChart();
    renderOrderStatusChart();
  } catch (e) {
    message.error(e.message || '加载统计数据失败');
  } finally {
    loading.value = false;
  }
}

function renderBarChart() {
  if (!barChartRef.value || seriesModelStats.value.length === 0) return;
  if (barChart) { barChart.destroy(); }
  barChart = new Chart({
    container: barChartRef.value,
    autoFit: true,
    height: 320,
    padding: [20, 20, 40, 60]
  });
  barChart
    .interval()
    .data(seriesModelStats.value)
    .encode('x', 'seriesName')
    .encode('y', 'modelCount')
    .encode('color', 'seriesName')
    .scale('x', { paddingInner: 0.3 })
    .scale('y', { nice: true })
    .label({ text: 'modelCount', position: 'top', style: { fontSize: 12, fill: '#666' } })
    .axis('x', { labelAutoRotate: true, labelSpacing: 8 })
    .axis('y', { title: null, grid: { lineDash: [4, 4] } })
    .legend(false)
    .tooltip({ items: [{ channel: 'y', valueFormatter: (d) => d + ' 个型号' }] });
  barChart.render();
}

function renderPieChart() {
  if (!pieChartRef.value || materialDistribution.value.length === 0) return;
  if (pieChart) { pieChart.destroy(); }
  pieChart = new Chart({
    container: pieChartRef.value,
    autoFit: true,
    height: 320,
    padding: [20, 20, 20, 20]
  });
  pieChart
    .interval()
    .data(materialDistribution.value)
    .encode('x', 'material')
    .encode('y', 'count')
    .encode('color', 'material')
    .coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.55 })
    .legend({ position: 'right', title: false, itemLayout: 'vertical' })
    .tooltip({ items: [{ channel: 'y', valueFormatter: (d) => d + ' 个型号' }] })
    .label({ text: 'material', radius: 0.85, style: { fontSize: 11 } })
    .style('stroke', '#fff')
    .style('lineWidth', 1);
  pieChart.render();
}

function renderOrderTrendChart() {
  if (!orderTrendChartRef.value || orderTrend.value.length === 0) return;
  if (orderTrendChart) { orderTrendChart.destroy(); }
  orderTrendChart = new Chart({
    container: orderTrendChartRef.value,
    autoFit: true,
    height: 320,
    padding: [20, 40, 40, 60]
  });
  
  const displayData = orderTrend.value.map(item => ({
    ...item,
    date: item.date.substring(5),
    amount: Number(item.amount.toFixed(2))
  }));

  orderTrendChart
    .interval()
    .data(displayData)
    .encode('x', 'date')
    .encode('y', 'count')
    .encode('color', () => '#1677ff')
    .scale('x', { paddingInner: 0.3 })
    .scale('y', { nice: true })
    .label({ text: 'count', position: 'top', style: { fontSize: 11, fill: '#666' } })
    .axis('x', { labelAutoRotate: true, labelSpacing: 8 })
    .axis('y', { title: null, grid: { lineDash: [4, 4] } })
    .legend(false)
    .tooltip({
      items: [
        { channel: 'y', valueFormatter: (d) => d + ' 单' },
        { channel: 'x', valueFormatter: (d) => '日期: ' + d }
      ]
    });
  orderTrendChart.render();
}

function renderOrderStatusChart() {
  if (!orderStatusChartRef.value || orderStatusDistribution.value.length === 0) return;
  if (orderStatusChart) { orderStatusChart.destroy(); }
  orderStatusChart = new Chart({
    container: orderStatusChartRef.value,
    autoFit: true,
    height: 320,
    padding: [20, 20, 20, 20]
  });

  orderStatusChart
    .interval()
    .data(orderStatusDistribution.value)
    .encode('x', 'status')
    .encode('y', 'count')
    .encode('color', 'status')
    .scale('color', { range: ['#faad14', '#1677ff', '#52c41a'] })
    .coordinate({ type: 'theta', outerRadius: 0.8, innerRadius: 0.55 })
    .legend({ position: 'bottom', title: false })
    .tooltip({ items: [{ channel: 'y', valueFormatter: (d) => d + ' 单' }] })
    .label({
      text: (d) => `${d.status}: ${d.count}`,
      radius: 0.85,
      style: { fontSize: 11 }
    })
    .style('stroke', '#fff')
    .style('lineWidth', 1);
  orderStatusChart.render();
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
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getOrderStatusColor(status) {
  const colors = { draft: 'warning', confirmed: 'processing', completed: 'success' };
  return colors[status] || 'default';
}

function getOrderStatusText(status) {
  const texts = { draft: '未审核', confirmed: '已确认', completed: '已完成' };
  return texts[status] || status || '未知';
}

function goToPrice() {
  router.push('/price');
}

function goToOrders() {
  router.push('/order');
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
}

.settings-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0;
}

.settings-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-label {
  font-size: 15px;
  font-weight: 600;
  color: #1f1f1f;
}

.settings-desc {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.45);
}

.stat-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1f1f1f;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #1677ff;
  background: #e8f0fe;
}

.stat-card-0 .stat-icon { color: #1677ff; background: #e8f0fe; }
.stat-card-1 .stat-icon { color: #52c41a; background: #e8f7e8; }
.stat-card-2 .stat-icon { color: #faad14; background: #fff7e6; }
.stat-card-3 .stat-icon { color: #722ed1; background: #f6edff; }

.order-stat-card {
  margin-top: 0;
}

.order-stat-0 .stat-icon { color: #1677ff; background: #e8f0fe; }
.order-stat-1 .stat-icon { color: #faad14; background: #fff7e6; }
.order-stat-2 .stat-icon { color: #52c41a; background: #e8f7e8; }
.order-stat-3 .stat-icon { color: #eb2f96; background: #ffe8f0; }

.chart-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.table-card {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.pie-chart {
  height: 320px;
}
</style>
