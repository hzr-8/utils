<template>
  <div class="jsonToExcel">
    <h2>Json 转 Excel</h2>
    <ElAlert title="上传多个！多语言.ts/.json，注意：必须要有en.ts/en.json文件" :type="'warning'" :closable="false" />

    <ElUpload ref="elUploadInstance" v-model="fileList" class="upload" action="#" drag multiple :auto-upload="false" :show-file-list="false" :on-change="getImportFile">
      <ElIcon class="el-icon--upload"><upload-filled /></ElIcon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
    </ElUpload>

    <template v-if="fileList.length">
      <ElDivider />

      <ElButton :type="'primary'" @click="handleExport">导出</ElButton>
      <ElButton :type="'default'" @click="handleClearFiles">清空文件</ElButton>

      <h3>翻译顺序(对应导出Excel列的语言顺序，可拖动调整顺序)</h3>
      <Draggable v-model="fileList" item-key="name" handle=".drag-item">
        <template #item="{ element }: { element: UploadFile }">
          <div class="drag-item">
            <span>{{ element.name }}</span>
            <ElButton :type="'text'" :disabled="/^en/.test(element.name)" @click="elUploadInstance?.handleRemove(element, element.raw)">
              <ElIcon class="delete"><Delete /></ElIcon>
              删除
            </ElButton>
          </div>
        </template>
      </Draggable>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElButton, ElAlert, ElUpload, ElIcon, ElDivider, ElMessage } from 'element-plus';
import { UploadFilled, Delete } from '@element-plus/icons-vue';
import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type';
import ExportJsonExcel from 'js-export-excel';
import Draggable from 'vuedraggable';
import { parseTsFileToJson } from './ts/parseTsFile';
import { parseJsonFileToJson } from './ts/parseJsonFile';

// 单个翻译的活动翻译json 例: {xxx: {Ride:"Ride"}}
interface ActivityTranslate {
  // 活动key
  [key: string]: {
    // 活动内key
    [key: string]: string;
  };
}

// 多个语言的活动翻译json 例: {zh: {xxx: {Ride:"座驾"}}, en: {xxx: {Ride:"Ride"}}}
interface ActivityTranslateAll {
  [lang: string]: ActivityTranslate;
}

// 源语言(作为翻译源，默认以 en 为标准翻译)
const SOURCE_LANG = 'en';
// 多语言缓存顺序 localStorage 缓存key
const ACTIVITY_TRANSLATE_ORDER = 'activityTranslateOrder';

// 当前要导出的翻译文件列表
const fileList = ref<UploadFile[]>([]);

const elUploadInstance = ref<InstanceType<typeof ElUpload>>();
// 获取文件
const getImportFile = (file: UploadFile, uploadFiles: UploadFile[]) => {
  fileList.value = uploadFiles;
  updateActivityTranslateOrder();
};

// 点击导出
const handleExport = () => {
  // 读取文件，处理各文件翻译数据
  readFile(fileList.value).then((res) => {
    // 导出
    exportExcel(res);

    // 缓存当前多语言顺序
    cacheActivityTranslateOrder();
  });
};

// 清空所有文件
const handleClearFiles = () => {
  elUploadInstance.value?.clearFiles(['ready']);
  fileList.value = [];
};

/**
 * 处理各语言翻译数据
 * @param files 翻译文件列表
 * @returns {Promise<ActivityTranslateAll>}
 */
const readFile = (files: UploadFile[]): Promise<ActivityTranslateAll> => {
  return new Promise(async (resolve, reject) => {
    const data: ActivityTranslateAll = {};
    if (files.length === 0) {
      resolve(data);
      return;
    }

    try {
      const res = await Promise.all(
        // TODO: 暂时只取第一个文件的格式
        files[0].name.endsWith('.json')
          ? // json
            files.map((file) => parseJsonFileToJson(file.raw))
          : // ts
            files.map((file) => parseTsFileToJson(file.raw))
      );
      console.log(res);

      files.forEach((file, index) => {
        const lang = file.name.split('.')[0];
        const languageInfo: ActivityTranslate = res[index];
        if (typeof languageInfo !== 'object') {
          throw new Error('解析失败' + file.name);
        }
        data[lang] = languageInfo;
      });
      resolve(data);
    } catch (error) {
      ElMessage.error(String(error));
      reject(error);
    }
  });
};

// 导出Excel功能
const exportExcel = (data: ActivityTranslateAll) => {
  const getList: { name: string; val: any[] }[] = [];
  const sheetHeader = ['key'];
  const sheetFilter = ['key'];
  for (const language in data) {
    sheetHeader.push(language);
    sheetFilter.push(language);
  }
  if (!data[SOURCE_LANG]) {
    ElMessage.error('源语言不存在' + SOURCE_LANG);
    return;
  }
  for (const key in data[SOURCE_LANG]) {
    const arr: { key: string; [key: string]: any }[] = [];
    for (const k in data[SOURCE_LANG][key]) {
      const languageObj = {};
      for (const language in data) {
        languageObj[language] = data[language][key]?.[k] || '';
      }
      arr.push({ key: k, ...languageObj });
    }
    getList.push({ name: key, val: arr });
  }

  const dataList = getList;

  const option: { fileName: string; datas: Array<any> } = {
    fileName: '',
    datas: [],
  }; //   option代表的就是excel文件

  option.fileName = '翻译_' + new Date().toLocaleDateString().replace(/\//g, '_'); //excel文件名

  option.datas = [];
  dataList.forEach((value) => {
    option.datas.push({
      //   excel文件的数据源
      sheetData: value.val,
      //   excel文件sheet的表名
      sheetName: value.name,
      //   excel文件表头名
      sheetHeader: sheetHeader,
      //   excel文件列名
      sheetFilter: sheetFilter,
    });
  });
  //   创建ExportJsonExcel实例对象
  let toExcel = new ExportJsonExcel(option);
  //   调用保存方法
  toExcel.saveExcel();
};

//#region 多语言顺序缓存
interface ActivityTranslateOrder extends Array<string> {}
// 缓存文件列表顺序
const cacheActivityTranslateOrder = () => {
  let activityTranslateOrder: ActivityTranslateOrder = [];
  const newOrder = fileList.value.map((file) => file.name);
  const temp = localStorage.getItem(ACTIVITY_TRANSLATE_ORDER);
  // 如果有旧的，不直接覆盖，而是合并，如有相同的项，新的数据优先
  if (temp) {
    activityTranslateOrder = JSON.parse(temp);
    activityTranslateOrder = activityTranslateOrder.filter((name) => !newOrder.includes(name));
  }
  activityTranslateOrder.push(...newOrder);
  localStorage.setItem(ACTIVITY_TRANSLATE_ORDER, JSON.stringify(activityTranslateOrder));
};

// 修改文件列表顺序
const updateActivityTranslateOrder = () => {
  const temp = localStorage.getItem(ACTIVITY_TRANSLATE_ORDER);
  if (temp) {
    const activityTranslateOrder: ActivityTranslateOrder = temp ? JSON.parse(temp) : [];
    fileList.value.sort((a, b) => {
      const sortA = activityTranslateOrder.findIndex((name) => name === a.name);
      const sortB = activityTranslateOrder.findIndex((name) => name === b.name);
      return (sortA === -1 ? fileList.value.length : sortA) - (sortB === -1 ? fileList.value.length : sortB);
    });
  }
};
//#endregion
</script>

<style scoped lang="scss">
:deep() {
  .el-upload {
    width: 100%;

    .el-upload-dragger {
      width: 100%;
    }
  }
}

.drag-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  height: 60px;
  padding: 0 12px;
  border-top: 1px solid #eee;
  box-sizing: border-box;
  cursor: move;

  &:last-child {
    border-bottom: 1px solid #eee;
  }

  .delete {
    cursor: pointer;
  }
}

// 拖拽组件样式
/* 幽灵元素（拖动时的预览） */
.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

/* 被拖动的原始元素 */
.sortable-chosen {
  background: #f0f7ff;
}

/* 放置目标区域 */
.sortable-drag {
  cursor: grabbing;
}
</style>
