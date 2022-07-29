import { Router } from 'vue-router';
const isLogin = true;

export default {
  use(router: Router) {
    router.beforeEach((to, from, next) => {
      if (to.name !== 'login' && to.meta.requiresAuth && !isLogin) next({ name: 'login' });
      else next();
    })
  }
}