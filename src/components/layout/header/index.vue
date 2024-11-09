<script lang="ts">
import { SwitchButton, ArrowDown } from '@element-plus/icons-vue';
import { defineComponent } from 'vue';
import i18n, { LANG_ZH_FLAG, LANG_EN_FLAG, LOCAL_KEY } from '@/i18n';

export default defineComponent({
  components: { ArrowDown },

  setup() {
    const switchLanguage = (command: string) => {
      localStorage.setItem(LOCAL_KEY, command);
      i18n.global.locale = command;
    };
    return {
      switchLanguage,
      SwitchButton,
      LANG_ZH_FLAG,
      LANG_EN_FLAG,
    };
  },
});
</script>

<template>
  <section class="layout-header">
    <section class="header-left"></section>
    <section class="header-right">
      <el-dropdown @command="switchLanguage">
        <span class="el-dropdown-link">
          {{ $t('language') }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="LANG_EN_FLAG">English</el-dropdown-item>
            <el-dropdown-item :command="LANG_ZH_FLAG">中文</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 登出 -->
      <el-button type="warning" :icon="SwitchButton" circle></el-button>
    </section>
  </section>
</template>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding-right: 50px;
}
.header-right {
  display: flex;
  align-items: center;
  // .el-dropdown-link {
  //   color: var(--el-color-primary);
  // }
  .el-icon--right {
    vertical-align: middle;
  }
  .el-button {
    margin-left: 40px;
  }
}
</style>
