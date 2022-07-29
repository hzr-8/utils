<script setup lang="ts">
import { ref, reactive, Ref } from 'vue';
// import filters from '@/components/table/filter-table/index.vue';
const list: Ref<any[]> = ref([]);
let count = 0;
const add = () => {
  list.value.push(`count: ${count++}`);
  console.log(list.value);
};
</script>

<template>
  <section>
    <el-button @click="add">Add </el-button>
    <p v-for="(item, index) in list" :key="index">{{ item }}</p>
  </section>
</template>
