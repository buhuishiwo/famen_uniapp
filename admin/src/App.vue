<template>
  <template v-if="isLoginPage">
    <router-view />
  </template>
  <template v-else>
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
          <a-menu-item key="price">
            <DollarOutlined />
            <span>价格管理</span>
          </a-menu-item>
          <a-menu-item key="material">
            <BgColorsOutlined />
            <span>材质配置</span>
          </a-menu-item>
          <a-menu-item key="coefficient">
            <PercentageOutlined />
            <span>报价系数</span>
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
  </template>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  DashboardOutlined,
  AppstoreOutlined,
  TagsOutlined,
  DollarOutlined,
  BgColorsOutlined,
  PercentageOutlined,
  SwapOutlined,
  DatabaseOutlined,
  GroupOutlined,
  UserOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const collapsed = ref(false);
const selectedKey = ref('dashboard');

const isLoginPage = computed(() => route.path === '/login');

const pageTitles = {
  dashboard: '首页概览',
  series: '产品系列',
  model: '阀门型号',
  price: '价格管理',
  material: '材质配置',
  coefficient: '报价系数',
  'material-diff': '材质价差',
  'material-lib': '材质库',
  'material-combo': '材质组合',
  salesperson: '营销员管理',
  customer: '客户管理'
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
