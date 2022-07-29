<template>
  <el-form :inline="true" :model="filtersData" class="demo-form-inline">
    <el-form-item label="Approved by">
      <el-input v-model="filtersData.user" placeholder="Approved by" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="filtersData.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Query</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { reactive, defineComponent } from 'vue';
export default defineComponent({
  setup() {
    const filtersData = reactive({
      user: '',
      region: '',
    });

    const onSubmit = () => {
      console.log(filtersData);
    };
    return {
      filtersData,
      onSubmit,
    };
  },
});
</script>

<style scoped lang="scss"></style>
