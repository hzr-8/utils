import { createRouter, createWebHashHistory } from 'vue-router';
import interceptor from './interceptor';
import routes from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

interceptor.use(router);

export default router;