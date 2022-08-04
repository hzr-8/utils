import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// declare const require: any
// declare const __dirname: any
const path = require('path');

const resolve = (dir: string) => path.resolve(__dirname, dir);

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('src'),
      '@STORE': resolve('src/store'),
      '@CONST': resolve('src/helper/const'),
    },
    // extensions: ['', '.ts', '.tsx', '.js', '.scss'],
  },
  server: {
    open: true,
    port: 8090,
    // proxy: { // 配置本地代理地址
    //   '/dev': 'http://xxx.xxx.com/api'
    // }
  },
})
