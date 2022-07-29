import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store, key } from './store'
import ElementPlus from 'element-plus'
import i18n from './i18n'
import 'element-plus/dist/index.css'
import './style/mixin.scss'
import './style/common.scss'
import './style/variable.scss'

createApp(App)
  .use(router)
  .use(store, key)
  .use(ElementPlus)
  .use(i18n)
  .mount('#app')
