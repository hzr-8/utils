<script setup lang="ts">

</script>

<template>
  <section class="not-found">
    <el-empty description="404 Not Found">
      <el-button type="primary" @click="$router.push('/')">{{ $t('fan-hui-shou-ye') }}</el-button>
    </el-empty>
  </section>
</template>

<style lang="scss" scoped>
.not-found {
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}
.el-empty {
  margin-top: 100px;
}
</style>
