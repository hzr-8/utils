<script lang="ts">
import { Menu as IconMenu } from '@element-plus/icons-vue';
import { defineComponent, reactive, ref } from 'vue';
import { menu } from './nav';

export default defineComponent({
  components: {
    IconMenu,
  },

  setup() {
    const isCollapse = ref(false);
    const menuList = reactive(menu);

    return {
      isCollapse,
      menuList,
    };
  },
});
</script>

<template>
  <section class="layout-side-nav">
    <!-- system info -->
    <section class="system">
      <div class="logo"></div>
      <div class="system-name">{{ $t('sys-name') }}</div>
    </section>

    <!-- menu -->
    <el-menu class="menu" :default-active="$route.path" :collapse="isCollapse" :router="true">
      <template v-for="(item, index) in menuList" :key="index">
        <el-sub-menu v-if="item.children" index="1">
          <template #title>
            <el-icon><IconMenu /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group v-for="child in item.children" :key="child.path">
            <!-- <template #title><span>{{ child.title }}</span></template> -->
            <el-menu-item :index="child.path">{{ child.title }}</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item v-else :index="item.path">
          <el-icon><IconMenu /></el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </section>
</template>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.layout-side-nav {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  width: 200px;
  height: 100vh;
  background-color: #fff;
  .system {
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo {
      width: 64px;
      height: 64px;
      margin-top: 50px;
      @include backgroundImage(url('@/assets/logo.png'));
    }
    .system-name {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
    }
  }

  .menu {
    margin-top: 50px;
  }
}
</style>
