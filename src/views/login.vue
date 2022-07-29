<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { key } from '@STORE';
import { useRouter } from 'vue-router';
const store = useStore(key);
const router = useRouter();

const isLogin = ref(store.state.user.isLogin);
console.log(isLogin.value);

const disabledLogin = ref(false);
const form = reactive({
  userName: '',
  passWord: '',
});
// 登录
const forLogin = () => {
  disabledLogin.value = true;
  setTimeout(() => {
    disabledLogin.value = false;
    store.commit('SET_LOGIN', true);
    router.push('/');
  }, 500);
}
</script>

<template>
  <section class="login-page">
    <!-- <select v-model="$i18n.locale">
      <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">{{ locale }}</option>
    </select> -->
    <el-form
      class="login-form"
      :label-position="'left'"
      label-width="80px"
      :model="form"
    >
      <div class="title">{{ $t('sys-name') }}</div>
      <el-form-item :label="$t('yong-hu-ming')">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('mi-ma')">
        <el-input type="password" v-model="form.passWord"></el-input>
      </el-form-item>
      <el-button type="primary" :disabled="disabledLogin" @click="forLogin">{{ $t('deng-lu') }}</el-button>
    </el-form>
  </section>
</template>

<style lang="scss" scoped>
.login-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('@/assets/bg.jpeg');
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 400px;
    // height: 320px;
    padding: 20px;
    background-color: rgba($color: #fff, $alpha: 0.7);
    border-radius: 8px;
    box-shadow: 0 0 4px 0 #eee;
    .title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 50px;
    }
    .el-button {
      width: 75%;
      margin: 20px 0;
    }
  }
}
</style>
