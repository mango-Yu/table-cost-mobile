// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store/store'

Vue.config.productionTip = false
import { Group } from 'vux'
Vue.component('group', Group)
import { XInput } from 'vux'
Vue.component('x-input', XInput)
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)
/* eslint-disable no-new */
import { XSwitch } from 'vux'
Vue.component('x-switch', XSwitch)

import { XTextarea } from 'vux'
Vue.component('x-textarea', XTextarea)

import { XButton } from 'vux'
Vue.component('x-button', XButton)

import { Tab, TabItem } from 'vux'
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)

import  { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
// 默认参数
Vue.use(ToastPlugin, {position: 'top'})

import Vuex from 'vuex'
Vue.use(Vuex)

import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

import { Cell } from 'vux'
Vue.component('cell', Cell)

import { Flexbox, FlexboxItem } from 'vux'

Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)

import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)

import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);

Vue.prototype.$ajax = axios
Vue.use(ElementUI);

Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    console.log(store.state.name)
    if (sessionStorage.getItem('name')) {  // 通过vuex state获取当前的token是否存在
      next();
    }
    else {
      next({
        path: '/',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
})
Vue.filter('formatDateTime', function (value) {
  if (!value) return ''
  let date = new Date(value);
  let y = date.getFullYear() + '/';
  let mon = (date.getMonth() + 1) + '/';
  let d = date.getDate();
  return y + mon + d;
});
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
