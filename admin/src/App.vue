<template>
  <template v-if="isLoginPage">
    <router-view />
  </template>
  <template v-else>
    <a-config-provider :locale="zhCN">
    <a-layout style="min-height: 100vh">
      <a-layout-sider width="220" v-model:collapsed="collapsed" :trigger="null" collapsible class="admin-sider">
        <div class="logo">
          <img src="/微信图片_20260116163444_60_164.png" alt="logo" class="logo-img" v-if="!collapsed" />
          <span class="logo-text" v-if="!collapsed">报价管理后台</span>
        </div>
        <a-menu theme="light" mode="inline" :selectedKeys="[selectedKey]" @click="handleMenuClick" class="admin-menu">
          <a-menu-item key="dashboard">
            <DashboardOutlined />
            <span>首页概览</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="series">
            <AppstoreOutlined />
            <span>产品系列</span>
          </a-menu-item>
          <a-menu-item key="model">
            <TagsOutlined />
            <span>阀门型号</span>
          </a-menu-item>
          <a-menu-item key="model-spec">
            <BarChartOutlined />
            <span>规格参数</span>
          </a-menu-item>
          <a-menu-item key="price">
            <DollarOutlined />
            <span>价格管理</span>
          </a-menu-item>
          <a-menu-item key="coefficient">
            <PercentageOutlined />
            <span>报价系数</span>
          </a-menu-item>
          <a-menu-item key="pricing-rules">
            <ControlOutlined />
            <span>报价规则</span>
          </a-menu-item>
          <a-menu-item key="material">
            <BgColorsOutlined />
            <span>材质标配</span>
          </a-menu-item>
          <a-menu-item key="material-diff">
            <SwapOutlined />
            <span>材质价差</span>
          </a-menu-item>
          <a-menu-item key="material-lib">
            <DatabaseOutlined />
            <span>材质库</span>
          </a-menu-item>
          <a-menu-item key="material-combo">
            <GroupOutlined />
            <span>材质组合</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="salesperson">
            <UserOutlined />
            <span>营销员管理</span>
          </a-menu-item>
          <a-menu-item key="customer">
            <TeamOutlined />
            <span>客户管理</span>
          </a-menu-item>
          <a-menu-item key="order">
            <FileTextOutlined />
            <span>订单管理</span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="system-settings">
            <SettingOutlined />
            <span>系统设置</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <a-layout>
        <a-layout-header class="admin-header">
          <div class="header-left">
            <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" @click="collapsed = !collapsed" class="trigger" />
            <a-breadcrumb class="header-breadcrumb">
              <a-breadcrumb-item v-if="selectedKey !== 'dashboard'">首页</a-breadcrumb-item>
              <a-breadcrumb-item>{{ currentPageTitle || '首页概览' }}</a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="header-right">
            <a-tag color="blue" class="env-tag">环境: cloud1-d2g6k45v21dd52696</a-tag>
            <a-tooltip title="导出所有产品数据为 Excel">
              <a-button type="text" :loading="exporting" @click="exportAllData" class="export-btn">
                <template #icon><DownloadOutlined /></template>
                导出数据
              </a-button>
            </a-tooltip>
            <a-button type="text" @click="handleLogout">退出登录</a-button>
            <a-avatar style="background-color: #1677ff" size="small">A</a-avatar>
          </div>
        </a-layout-header>

        <a-layout-content class="admin-content">
          <router-view />
        </a-layout-content>

        <a-layout-footer class="admin-footer">
          阀门报价管理系统 ©2026 Powered by CloudBase
        </a-layout-footer>
      </a-layout>
    </a-layout>
    </a-config-provider>
  </template>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { message } from 'ant-design-vue';
import * as XLSX from 'xlsx';
import {
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  BarChartOutlined,
  DollarOutlined,
  BgColorsOutlined,
  PercentageOutlined,
  SwapOutlined,
  DatabaseOutlined,
  GroupOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ControlOutlined,
  DownloadOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';
import { seriesApi, modelApi, priceApi, materialApi, coefficientApi, modelSpecApi } from './api';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const selectedKey = ref('dashboard');

const isLoginPage = computed(() => route.path === '/login');

const pageTitles = {
  dashboard: '首页概览',
  series: '产品系列',
  model: '阀门型号',
  'model-spec': '规格参数',
  price: '价格管理',
  material: '材质标配',
  coefficient: '报价系数',
  'pricing-rules': '报价规则',
  'material-diff': '材质价差',
  'material-lib': '材质库',
  'material-combo': '材质组合',
  salesperson: '营销员管理',
  customer: '客户管理',
  order: '订单管理',
  'system-settings': '系统设置'
};

const currentPageTitle = computed(() => pageTitles[selectedKey.value] || '');

watch(() => route.path, (path) => {
  selectedKey.value = path.replace('/', '');
});

function handleMenuClick({ key }) {
  router.push(`/${key}`);
}

function handleLogout() {
  localStorage.removeItem('admin_token');
  router.push('/login');
}

const exporting = ref(false);

async function exportAllData() {
  exporting.value = true;
  try {
    const [seriesData, modelsData, pricesData, materialsData, specsData, coeffData] = await Promise.all([
      seriesApi.getAll(),
      modelApi.getAll(),
      priceApi.getAll(),
      materialApi.getAll(),
      modelSpecApi.getAll({}),
      coefficientApi.getAll()
    ]);

    const wb = XLSX.utils.book_new();

    // Sheet 1: 产品系列
    const seriesRows = (seriesData || []).map(s => ({
      'ID': s.id, '系列名称': s.name, '图片': s.image || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(seriesRows.length ? seriesRows : [{}]), '产品系列');

    // Sheet 2: 阀门型号
    const modelRows = [];
    if (modelsData && typeof modelsData === 'object') {
      for (const [seriesName, models] of Object.entries(modelsData)) {
        for (const m of models) {
          modelRows.push({ 'ID': m.id, '所属系列': seriesName, '型号名称': m.name, '类型代码': m.type || '' });
        }
      }
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(modelRows.length ? modelRows : [{}]), '阀门型号');

    // Sheet 3: 价格数据
    const priceRows = (pricesData || []).map(p => ({
      'ID': p.id, '所属系列': p.seriesName || '', '阀门型号': p.valveName || '', '规格(DN)': p.size,
      '基础价格': p.price, '闸板304差价': p.gatePlate304Diff, '闸板316差价': p.gatePlate316Diff,
      '阀杆304差价': p.rod304Diff, '阀杆316差价': p.rod316Diff, '磨标费': p.brandingFee,
      '最小起订量': p.minOrderQty, '状态': p.status === 'enabled' ? '启用' : '禁用', '备注': p.remark || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(priceRows.length ? priceRows : [{}]), '价格数据');

    // Sheet 4: 材质配置
    const materialRows = (materialsData || []).map(m => ({
      'ID': m.id, '所属系列': m.seriesName || '', '阀门型号': m.valveName || '',
      '阀体材质': m.bodyMaterial || '', '闸板材质': m.gatePlateMaterial || '',
      '阀杆材质': m.stemMaterial || '', '支架材质': m.yokeMaterial || '', '备注': m.remark || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(materialRows.length ? materialRows : [{}]), '材质配置');

    // Sheet 5: 规格参数
    const specRows = (specsData || []).map(s => ({
      'ID': s.id, '所属系列': s.seriesName || '', '阀门型号': s.valveName || '', '规格(DN)': s.size,
      '最大压力': s.maxPressure || '', '单重': s.unitWeight || '', '圈数': s.laps || '', '扭矩': s.torque || ''
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(specRows.length ? specRows : [{}]), '规格参数');

    // Sheet 6: 报价系数
    const coeffRows = (coeffData || []).map(c => ({
      'ID': c.id, '系列名称': c.seriesName || '', '产品名称': c.productName || '',
      'DN最小值': c.dnMin, 'DN最大值': c.dnMax, '最小起订量': c.minOrderQty,
      '满足起订量-原厂系数': c.moqMetOriginalCoeff, '满足起订量-OEM系数': c.moqMetOemCoeff,
      '未满足起订量-原厂系数': c.moqUnmetOriginalCoeff, '未满足起订量-OEM系数': c.moqUnmetOemCoeff
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(coeffRows.length ? coeffRows : [{}]), '报价系数');

    XLSX.writeFile(wb, `产品数据导出_${new Date().toISOString().slice(0, 10)}.xlsx`);
    message.success('导出成功');
  } catch (e) {
    console.error('导出失败:', e);
    message.error('导出失败: ' + (e.message || '未知错误'));
  } finally {
    exporting.value = false;
  }
}
</script>

<style>
.admin-sider {
  background: #ffffff !important;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  overflow: hidden;
  border-bottom: 1px solid #f0f0f0;
}

.logo-img {
  width: 40px;
  height: 29px;
  border-radius: 8px;
  flex-shrink: 0;
}

.logo-text {
  color: #1f1f1f;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.admin-menu {
  padding: 8px 0;
  border-right: none;
}

.admin-menu .ant-menu-item {
  margin: 4px 4px;
  border-radius: 8px;
  height: 44px;
  line-height: 44px;
  color: #666;
  transition: all 0.2s;
}

.admin-menu .ant-menu-item:hover {
  background: #f0f5ff;
  color: #1677ff;
}

.admin-menu .ant-menu-item-selected {
  background: #e8f0fe !important;
  color: #1677ff !important;
}

.admin-menu .ant-menu-item-selected::after {
  border-right: none;
}

.admin-menu .ant-menu-divider {
  margin: 8px 16px;
  border-color: #f0f0f0;
}

.admin-header {
  background: #fff !important;
  padding: 0 24px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 9;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 4px;
}

.trigger:hover {
  color: #1677ff;
}

.header-breadcrumb {
  font-size: 15px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.export-btn {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}

.export-btn:hover {
  color: #1677ff;
}

.env-tag {
  margin: 0;
  font-size: 12px;
}

.admin-content {
  margin: 16px;
  padding: 0;
  background: transparent;
  min-height: calc(100vh - 64px - 64px - 32px);
}

.admin-footer {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
  background: transparent;
}
</style>
