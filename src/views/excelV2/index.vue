<template>
  <div class="translate">
    <el-alert title="注意！Excel表格第一行应为语言种类，且其中一列key值为en" type="warning" :closable="false" />

    <el-upload ref="elUploadInstance" class="upload" action="#" drag multiple :auto-upload="false" :limit="1" :show-file-list="false" :on-change="getImportFile">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
    </el-upload>

    <template v-for="(sheet, i) in fanyi">
      <h2>Sheet：{{ sheetNames[i] }}</h2>
      <el-row :gutter="20">
        <el-col :xs="12" :span="8" :md="8" :lg="6" :xl="4" v-for="(json, language) in sheet">
          <el-card @click="copy(JSON.stringify(json))">
            <h4>语言：{{ language }}</h4>
            <div class="content">{{ json }}</div>
            <!-- readFile方法改了判断之后，应该不会再出现key数量不一致的情况 -->
            <div class="tips" :class="{ red: Object.keys(json).length !== Object.keys(sheet.en)?.length }">
              翻译key数量为：{{ Object.keys(json).length }}, 英语为：{{ Object.keys(sheet.en)?.length }}
            </div>
            <template #footer>
              点击卡片复制
              <!-- <el-button type="primary" @click="copy(JSON.stringify(json))">复制</el-button> -->
            </template>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 翻译警告信息 -->
    <div v-show="emptyWarning.length">
      <el-alert type="error" :closable="false">
        <template v-for="(message, index) in emptyWarning">
          <p>{{ message }}</p>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { ref } from 'vue';
import * as XLSX from 'xlsx';

const fanyi = ref([]);
const sheetNames = ref([]);

const elUploadInstance = ref();
// 获取文件
const getImportFile = (file) => {
  ElMessage.closeAll();
  emptyWarning.value = [];
  fanyi.value = [];
  // elUploadInstance.value?.clearFiles();
  if (file.raw) {
    readFile(file.raw);
    elUploadInstance.value?.handleRemove(file);
  }
};

const emptyWarning = ref([]);

// excel转json
const readFile = (file) => {
  let reader = new FileReader();
  reader.onload = function (e) {
    let wb = XLSX.read(e.target.result, { type: 'binary' }); // 读取文件
    sheetNames.value = wb.SheetNames;
    wb.SheetNames.forEach((value, index) => {
      const wbSheetName = wb.SheetNames[index];
      const wbSheet = wb.Sheets[wbSheetName];
      // 解析文件 {defval: ''}=>防止单元格为空的时解析出来的结果缺少相应的key，设置blankrows为true，不跳过空行
      const selectFileData = XLSX.utils.sheet_to_json(wbSheet, { defval: '', blankrows: true });
      if (!selectFileData.length) {
        console.log(`上传的文件数据为空！`);
        return false;
      } else {
        fanyi.value[index] = {};
        const langKeys = Object.keys(selectFileData[0]).filter((key) => key !== 'key' && !key.includes('__EMPTY')); // 语言key列表
        langKeys.forEach((language) => {
          const fanyiMap = {};
          let num = 1;
          selectFileData.forEach((row, rowIndex) => {
            if (!row.en) {
              return;
            }
            // 属性名包含key，代表是我们原有的翻译导出来的，就用原来的key
            if (row.hasOwnProperty('key')) {
              fanyiMap[row.key] = row[language];
            } else {
              // 属性名不包含key，代表是新的翻译，截取英文字母自己生成一个key

              // 去除首尾空格
              row.en.trim();
              const allEn = row.en.replace(/[^a-zA-Z]/g, '');
              if (!row[language] || !String(row[language]).trim()) {
                const warningMessage = `语言：${language} ${rowIndex + 2}行 - 翻译为空，对应英语翻译为：${row.en}`;
                console.error(warningMessage);
                emptyWarning.value.push(warningMessage);
              }
              if (allEn.length < 6) {
                if (!fanyiMap.hasOwnProperty(allEn)) {
                  fanyiMap[allEn] = row[language];
                } else {
                  fanyiMap[allEn + `${num}`] = row[language];
                  num++;
                }
              } else {
                if (!fanyiMap.hasOwnProperty(allEn.substring(0, 3))) {
                  fanyiMap[allEn.substring(0, 3)] = row[language];
                } else {
                  fanyiMap[allEn.substring(0, 3) + `${num}`] = row[language];
                  num++;
                }
              }
            }
          });
          fanyi.value[index][language] = fanyiMap;
        });
        if (emptyWarning.value.length) {
          ElMessage.error({
            duration: 0,
            message: '翻译值为空，请检查一下error信息！',
            showClose: true,
          });
        }
      }
    });
    console.log(fanyi.value);
  };
  reader.readAsBinaryString(file);
};

const copy = (message) => {
  message &&
    navigator &&
    navigator.clipboard &&
    navigator.clipboard
      .writeText(message)
      .then((res) => {
        ElMessage.success('copy success');
      })
      .catch((err) => {
        console.log(err);
      });
};
</script>

<style lang="scss">
.el-upload {
  width: 100%;

  .el-upload-dragger {
    width: 100%;
  }
}

.el-card {
  font-size: 12px;
  cursor: pointer;

  h4 {
    font-size: 16px;
    margin: 0 0 10px;
  }

  .content {
    max-height: 90px;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    margin-bottom: 10px;

    &.red {
      color: red;
    }
  }
}
</style>
