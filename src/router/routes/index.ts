import { RouteRecordRaw } from 'vue-router';
import { ROUTER_NAME } from '@CONST';
console.log(ROUTER_NAME);

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
    redirect: () => 'utils',
    children: [
      // {
      //   path: 'data_list',
      //   name: 'data_list',
      //   redirect: '',
      //   component: () => import('@/views/data-list/index.vue'),
      // },
      {
        path: 'utils',
        name: 'utils',
        redirect: '',
        component: () => import('@/views/utils/index.vue'),
      },
    ],
  },
  // {
  //   path: '/login',
  //   name: 'login',
  //   meta: { requiresAuth: true },
  //   component: () => import('@/views/login.vue'),
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'not_found',
    meta: { requiresAuth: true },
    component: () => import('@/views/not-found.vue'),
  },
];

export default routes;
