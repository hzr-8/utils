<script setup lang="ts">
import Header from '@/components/layout/header/index.vue';
import SideNav from '@/components/layout/side-nav/index.vue';
</script>

<template>
  <section class="layout">
    <el-container>
      <!-- <el-side> -->
      <SideNav></SideNav>
      <!-- </el-side> -->

      <el-container>
        <el-header class="header">
          <Header></Header>
        </el-header>
        <el-main>
          <section class="body">
            <router-view></router-view>
          </section>
        </el-main>
      </el-container>
    </el-container>
  </section>
</template>

<style lang="scss" scoped>
.layout {
  .header {
    background-color: #fff;
    border-bottom: 1px solid #eee;
  }
  .body {
    padding: 20px;
    border-radius: 4px;
    background-color: #fff;
  }
}
</style>
