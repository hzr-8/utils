<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';

type plotTypes = {
  [key: string]: any;
};

const form = reactive({
  regText: '',
  content: '',
  result: '',
});
const reg = ref(new RegExp(/\(('|").+\..+('|")\)/, 'gm'));

const onSubmit = () => {
  const str = form.content;
  const arr = str.match(reg.value);

  console.log('正则匹配结果:', arr);

  if (arr) {
    const obj: plotTypes = {};
    arr.forEach((item) => {
      const [str1, str2] = item.split('.');
      const name = str1.slice(2);
      const key = str2.slice(0, -2);
      if (!obj[name]) {
        obj[name] = {};
      } else {
        obj[name][key] = 'xxxxx';
      }
    });
    console.log('result', obj);
    form.result = JSON.stringify(obj);
  }
};

const onReset = () => {
  form.content = '';
  form.result = '';
};

const onCopy = () => {
  form.result &&
    navigator &&
    navigator.clipboard &&
    navigator.clipboard
      .writeText(form.result)
      .then((res) => {
        ElMessage.success('copy success');
      })
      .catch((err) => {
        console.log(err);
      });
};

// 修改匹配规则
const onBlurReg = () => {
  if (form.regText) {
    reg.value = new RegExp(form.regText, 'gm');
  }
};
</script>

<template>
  <section class="utils">
    <div class="title">
      <h4>提取文件中用到的翻译 例: ("union.confirm") => { "union": { "confirm": "xxxxx" } }</h4>
      <div class="desc">匹配规则： {{ reg }}</div>
      <!-- <el-input v-model="form.result" type="text" /> -->
    </div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="RegExp">
        <el-input v-model="form.regText" type="text" @blur="onBlurReg" />
      </el-form-item>
      <el-form-item label="Text">
        <el-input v-model="form.content" type="textarea" />
      </el-form-item>
      <el-form-item label="Result">
        <el-input readonly v-model="form.result" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button @click="onReset">Reset</el-button>
        <el-button v-show="form.result" @click="onCopy">Copy</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<style lang="scss" scoped>
.title {
  padding-left: 120px;
  margin-bottom: 20px;

  .desc {
    font-size: 14px;
    color: #666;
  }
}
</style>
