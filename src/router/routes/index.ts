import { RouteRecordRaw } from 'vue-router';
// import { ROUTER_NAME } from '@CONST';

declare module 'vue-router' {
  interface RouteMeta {
    // 可选的
    isAdmin?: boolean;
    // 每个路由都必须声明
    requiresAuth: boolean;
  }
}

// import Login from '../views/login.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: { requiresAuth: true },
    component: () => import('@/views/login-after.vue'),
    redirect: () => 'excelV2',
    children: [
      {
        path: 'excel',
        name: 'excel',
        component: () => import('@/views/excel/index.vue'),
      },
      {
        path: 'excelV2',
        name: 'excelV2',
        component: () => import('@/views/excelV2/index.vue'),
      },
      {
        path: 'utils',
        name: 'utils',
        component: () => import('@/views/utils/index.vue'),
      },
      {
        path: 'jsonToExcel',
        name: 'jsonToExcel',
        component: () => import('@/views/jsonToExcel/index.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not_found',
    meta: { requiresAuth: true },
    component: () => import('@/views/not-found.vue'),
  },
];

export default routes;
