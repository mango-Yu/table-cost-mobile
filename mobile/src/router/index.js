import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Register from '@/components/register'
import Main from  '@/components/main'
import List from  '@/components/use/list'

Vue.use(Router)

export default new Router({
  base: '/mobile',
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/main',
      name: 'main',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      components: {
        default: Main
      }
    },
    {
      path: '/list',
      name: 'list',
      component: List,
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      components: {
        default: List
      }
    }
  ]
})
