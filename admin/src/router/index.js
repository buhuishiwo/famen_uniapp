import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/index.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard/index.vue')
  },
  {
    path: '/series',
    name: 'Series',
    component: () => import('../views/Series/index.vue')
  },
  {
    path: '/model',
    name: 'Model',
    component: () => import('../views/Model/index.vue')
  },
  {
    path: '/model-spec',
    name: 'ModelSpec',
    component: () => import('../views/ModelSpec/index.vue')
  },
  {
    path: '/price',
    name: 'Price',
    component: () => import('../views/Price/index.vue')
  },
  {
    path: '/material',
    name: 'Material',
    component: () => import('../views/Material/index.vue')
  },
  {
    path: '/coefficient',
    name: 'Coefficient',
    component: () => import('../views/Coefficient/index.vue')
  },
  {
    path: '/material-diff',
    name: 'MaterialDiff',
    component: () => import('../views/MaterialDiff/index.vue')
  },
  {
    path: '/material-lib',
    name: 'MaterialLib',
    component: () => import('../views/MaterialLib/index.vue')
  },
  {
    path: '/material-combo',
    name: 'MaterialCombo',
    component: () => import('../views/MaterialCombo/index.vue')
  },
  {
    path: '/salesperson',
    name: 'Salesperson',
    component: () => import('../views/Salesperson/index.vue')
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('../views/Customer/index.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('../views/Order/index.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin_token');
  if (to.path === '/login') {
    if (token) {
      next('/dashboard');
    } else {
      next();
    }
  } else {
    if (!token) {
      next('/login');
    } else {
      next();
    }
  }
});

export default router;
