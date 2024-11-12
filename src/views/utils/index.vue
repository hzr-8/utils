<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive } from 'vue';

interface plotTypes {
  [key: string | number]: any;
}

// 表单
const form = reactive({
  regText: '',
  type: 1,
  content: '',
  result: '',
});

// 正则
const regMap: plotTypes = {
  1: { reg: /t\(('|")[^('|")]+\.[^('|")]+('|")\)/gm, example: 't("union.confirm") => { "union": { "confirm": "xxxxx" } }' },
  2: { reg: /i18n=('|")[^('|")]+('|")[^>]*>[^<]+</gm, example: '<span i18n="i18n.confirm">xxxxx</span> => { "i18n.confirm": "xxxxx" }' },
};

// 提交
const onSubmit = () => {
  const str = form.content;
  console.log(regMap[form.type]);

  const list = str.match(regMap[form.type].reg);

  console.log('正则匹配结果:', list);
  ElMessage.info({
    message: '正则匹配结果: ' + list,
  });
  if (!list) return;

  switch (form.type) {
    case 1:
      dealWithVueString(list);
      break;
    case 2:
      dealWithHtmlString(list);
      break;
    default:
      break;
  }
};

// 处理Vuei18n语法字符串
const dealWithVueString = (list: Array<string>) => {
  const obj: plotTypes = {};
  list.forEach((item) => {
    const [str1, str2] = item.split('.');
    const name = str1.slice(3);
    const key = str2.slice(0, -2);
    if (!obj[name]) {
      obj[name] = {};
    }
    obj[name][key] = 'xxxxx';
  });
  console.log('result', obj);
  form.result = JSON.stringify(obj);
};

// 处理Htmli18n语法字符串
const dealWithHtmlString = (list: Array<string>) => {
  const obj: plotTypes = {};
  list.forEach((item) => {
    const [str1, str2] = item.split('>');
    const i18nArr = str1.match(/i18n=('|")[^('|")]+('|")/);
    const key = i18nArr ? i18nArr[0].slice(6, -1) : '';
    const value = str2.slice(0, -1).trim();

    if (!obj[key]) {
      obj[key] = value;
    } else {
      if (obj[key] !== value) {
        console.error(`Html文件中 i18n="${key}" 出现重复，且值不同, 原值为：${obj[key]}，现在的值为：${value} `);
      }
    }
  });
  console.log('result', obj);
  form.result = JSON.stringify(obj);
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
// const onBlurReg = () => {
//   if (form.regText) {
//     reg.value = new RegExp(form.regText, 'gm');
//   }
// };
</script>

<template>
  <section class="utils">
    <div class="title">
      <h4>提取文件中用到的翻译 例: {{ regMap[form.type].example }}</h4>
      <div class="desc">匹配规则： {{ regMap[form.type].reg }}</div>
    </div>

    <el-form :model="form" label-width="120px">
      <el-form-item label="Type">
        <el-radio-group v-model="form.type">
          <el-radio :label="1" border>Vue3 t("union.confirm")</el-radio>
          <el-radio :label="2" border>Html i18n="i18n.confirm"</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="File content">
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
