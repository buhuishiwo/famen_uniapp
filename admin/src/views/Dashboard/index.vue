<template>
  <div class="dashboard-container">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="(item, index) in statCards" :key="index">
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
      <a-col :span="14">
        <a-card :bordered="false" class="chart-card">
          <template #title>
            <span class="card-title">各系列型号数量分布</span>
          </template>
          <div ref="barChartRef" class="chart-container"></div>
          <a-empty v-if="!loading && seriesModelStats.length === 0" description="暂无数据" />
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card :bordered="false" class="chart-card">
          <template #title>
            <span class="card-title">阀体材质分布</span>
          </template>
          <div ref="pieChartRef" class="chart-container pie-chart"></div>
          <a-empty v-if="!loading && materialDistribution.length === 0" description="暂无数据" />
        </a-card>
      </a-col>
    </a-row>

    <a-row style="margin-top: 16px;">
      <a-col :span="24">
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
              <template v-if="column.key === 'manualPrice'">
                ¥{{ record.manualPrice }}
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
  SwapOutlined,
  PercentageOutlined,
  UserOutlined,
  TeamOutlined
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

const barChartRef = ref(null);
const pieChartRef = ref(null);
let barChart = null;
let pieChart = null;

const statCards = computed(() => [
  { label: '产品系列', value: summary.value.seriesCount || 0, icon: AppstoreOutlined },
  { label: '阀门型号', value: summary.value.modelCount || 0, icon: TagsOutlined },
  { label: '价格记录', value: summary.value.priceCount || 0, icon: DollarOutlined },
  { label: '材质配置', value: summary.value.materialCount || 0, icon: BgColorsOutlined }
]);

const skeletonData = computed(() => {
  return Array.from({ length: 5 }, (_, i) => ({ key: i }));
});

const priceColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
  { title: '阀门型号', dataIndex: 'valveName', key: 'valveName' },
  { title: '规格', dataIndex: 'size', key: 'size', width: 100 },
  { title: '手动价格', dataIndex: 'manualPrice', key: 'manualPrice', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 }
];

onMounted(async () => {
  await loadData();
});

onBeforeUnmount(() => {
  if (barChart) {
    barChart.destroy();
    barChart = null;
  }
  if (pieChart) {
    pieChart.destroy();
    pieChart = null;
  }
});

async function loadData() {
  loading.value = true;
  try {
    const result = await statsApi.getDashboardStats();
    summary.value = result.summary || {};
    seriesModelStats.value = result.seriesModelStats || [];
    materialDistribution.value = result.materialDistribution || [];
    recentPrices.value = result.recentPrices || [];
    await nextTick();
    renderBarChart();
    renderPieChart();
  } catch (e) {
    message.error(e.message || '加载统计数据失败');
  } finally {
    loading.value = false;
  }
}

function renderBarChart() {
  if (!barChartRef.value || seriesModelStats.value.length === 0) return;
  if (barChart) {
    barChart.destroy();
  }
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
    .label({
      text: 'modelCount',
      position: 'top',
      style: { fontSize: 12, fill: '#666' }
    })
    .axis('x', {
      labelAutoRotate: true,
      labelSpacing: 8
    })
    .axis('y', {
      title: null,
      grid: { lineDash: [4, 4] }
    })
    .legend(false)
    .tooltip({
      items: [{ channel: 'y', valueFormatter: (d) => d + ' 个型号' }]
    });

  barChart.render();
}

function renderPieChart() {
  if (!pieChartRef.value || materialDistribution.value.length === 0) return;
  if (pieChart) {
    pieChart.destroy();
  }
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
    .legend({
      position: 'right',
      title: false,
      itemLayout: 'vertical'
    })
    .tooltip({
      items: [{ channel: 'y', valueFormatter: (d) => d + ' 个型号' }]
    })
    .label({
      text: 'material',
      radius: 0.85,
      style: { fontSize: 11 }
    })
    .style('stroke', '#fff')
    .style('lineWidth', 1);

  pieChart.render();
}

function goToPrice() {
  router.push('/price');
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
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

.stat-card-0 .stat-icon {
  color: #1677ff;
  background: #e8f0fe;
}

.stat-card-1 .stat-icon {
  color: #52c41a;
  background: #e8f7e8;
}

.stat-card-2 .stat-icon {
  color: #faad14;
  background: #fff7e6;
}

.stat-card-3 .stat-icon {
  color: #722ed1;
  background: #f6edff;
}

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
