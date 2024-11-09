import { ROUTER_NAME } from '@CONST';
// import i18n from '@/i18n';

type Menu = {
  title: string;
  path: string;
  children?: Array<Menu>;
};

export const menu: Array<Menu> = [
  // {
  //   title: 'nav',
  //   path: '/',
  //   children: [
  //     {
  //       title: ROUTER_NAME.RN_DATA_LIST_LABEL,
  //       path: `/${ROUTER_NAME.RN_DATA_LIST}`,
  //     },
  //   ],
  // },
  // {
  //   title: ROUTER_NAME.RN_LOGIN_LABEL,
  //   path: `/${ROUTER_NAME.RN_LOGIN}`,
  // },
  {
    title: 'Excel 翻译V2',
    path: `/excelV2`,
  },
  {
    title: 'Excel 翻译',
    path: `/excel`,
  },
  {
    title: ROUTER_NAME.RN_UTILS_LABEL,
    path: `/${ROUTER_NAME.RN_UTILS}`,
  },
];
