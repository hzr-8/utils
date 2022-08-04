import { createI18n } from 'vue-i18n';
import customLangZh from './lang/zh-CN.json';
import customLangEn from './lang/en-US.json';

export const LOCAL_KEY: string = 'local_key';

export const LANG_ZH_FLAG: string = 'zh-CN';
export const LANG_EN_FLAG: string = 'en-US';

const i18n = createI18n({
  locale: localStorage.getItem(LOCAL_KEY) || LANG_ZH_FLAG,
  fallbackLocale: LANG_EN_FLAG,
  messages: {
    [LANG_ZH_FLAG]: customLangZh,
    [LANG_EN_FLAG]: customLangEn,
  },
});

export default i18n;
