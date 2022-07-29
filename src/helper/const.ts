// import { useI18n } from "vue-i18n"
import i18n from '@/i18n';

const { t } = i18n.global;

export const ROUTER_NAME = {
  RN_LOGIN: 'login',
  RN_LOGIN_LABEL: t('deng-lu'),
  RN_DATA_LIST: 'data_list',
  RN_DATA_LIST_LABEL: t('lie-biao'),
  RN_UTILS: 'utils',
  RN_UTILS_LABEL: t('utils'),
};
