<template>
  <div class="box">
    <div class="title">导出excel</div>
    <textarea v-model="jsonString" cols="50" rows="30" placeholder="输入json string转Excel"></textarea>
    <button @click="exportExcel">导出</button>
    <div>excel转json数据</div>
    <input v-model="lang" type="text" placeholder="需要翻译的语言key值" />
    <input type="file" ref="fileTemp" accept=".xlsx,.xls" @change="getImportFile" />
    <br>
    <br>
    <textarea name="" id="" cols="100" rows="10" v-model="textarea"></textarea>
    <br>
    <el-button @click="onCopy">Copy</el-button>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import ExportJsonExcel from 'js-export-excel';
// import d from './en.js';
export default {
  data() {
    return {
      getList: [],
      fanyi: [],
      jsonString: '',
      lang: '',
      textarea: ''
    };
  },
  methods: {
    // excel导出
    exportExcel() {
      var data = JSON.parse(this.jsonString);
      console.log(data);
      // return;

      this.getList = [];
      for (let key in data) {
        let arr = [];
        for (let k in data[key]) {
          arr.push({ key: k, en: data[key][k] });
        }
        this.getList.push({ name: key, val: arr });
      }
      console.log(this.getList);

      const dataList = this.getList;

      let option = {}; //   option代表的就是excel文件

      option.fileName = '翻译_' + Date.now(); //excel文件名

      option.datas = [];
      dataList.forEach((value) => {
        option.datas.push({
          //   excel文件的数据源
          sheetData: value.val,
          //   excel文件sheet的表名
          sheetName: value.name,
          //   excel文件表头名
          sheetHeader: ['key', 'en'],
          //   excel文件列名
          sheetFilter: ['key', 'en'],
        });
      });
      console.log(option.datas);
      //   创建ExportJsonExcel实例对象
      let toExcel = new ExportJsonExcel(option);
      //   调用保存方法
      toExcel.saveExcel();
    },
    
    // 获取文件
    getImportFile() {
      if (this.$refs.fileTemp && !this.$refs.fileTemp.files[0]) return false;
      const selectedFile = this.$refs.fileTemp.files[0];
      this.readFile(selectedFile);
      // 选同个文件会无反应,清空value值
      this.$refs.fileTemp.value = '';
    },
    
    // excel转json
    readFile(file) {
      let _this = this
      let language = this.lang; //要翻译的语言
      let reader = new FileReader();
      reader.onload = function (e) {
        let wb = XLSX.read(e.target.result, { type: 'binary' }); // 读取文件
        wb.SheetNames.forEach((value, index) => {
          let wbSheetName = wb.SheetNames[index];
          const wbSheet = wb.Sheets[wbSheetName];
          // 解析文件 {defval: ''}=>防止单元格为空的时解析出来的结果缺少相应的key
          let selectFileData = XLSX.utils.sheet_to_json(wbSheet, { defval: '' });
          if (!selectFileData.length) {
            console.log(`上传的文件数据为空！`);
            return false;
          } else {
            // console.log(selectFileData);
            _this.fanyi[index] = {};
            let num = 1;
            selectFileData.forEach((v) => {
              // 属性名包含key，代表是我们原有的翻译导出来的，就用原来的key
              if (v.hasOwnProperty('key')) {
                _this.fanyi[index][v.key] = v[language];
              } else {
                // 属性名不包含key，代表是新的翻译，截取英文字母自己生成一个key

                // 去除首尾空格
                v.en.trim();
                let allEn = v.en.replace(/[^a-zA-Z]/g, '');
                if (allEn.length < 6) {
                  if (!_this.fanyi[index][allEn]) {
                    _this.fanyi[index][allEn] = v[language];
                  } else {
                    _this.fanyi[index][allEn + `${num}`] = v[language];
                    num++;
                  }
                } else {
                  if (!_this.fanyi[index][allEn.substring(0, 3)]) {
                    _this.fanyi[index][allEn.substring(0, 3)] = v[language];
                  } else {
                    _this.fanyi[index][allEn.substring(0, 3) + `${num}`] = v[language];
                    num++;
                  }
                }
              }
            });
          }
        });
        console.log(_this.fanyi);
        _this.textarea = JSON.stringify(_this.fanyi)
      };
      reader.readAsBinaryString(file);
    },

    onCopy(){
      this.textarea &&
        navigator &&
        navigator.clipboard &&
        navigator.clipboard
        .writeText(this.textarea)
        .then((res) => {
          ElMessage.success('copy success');
        })
        .catch((err) => {
          console.log(err);
        });
      }
  },
};
</script>

<style></style>
