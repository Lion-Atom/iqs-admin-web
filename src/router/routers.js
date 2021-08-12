import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/8D',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/tools/8D/detail/index'], resolve),
        name: '8D流程',
        meta: { title: '8D流程' }
      },
      {
        path: 'report',
        component: (resolve) => require(['@/views/tools/8D/report/index'], resolve),
        name: '单独报告',
        meta: { title: '单独报告' }
      },
      {
        path: 'overview',
        component: (resolve) => require(['@/views/tools/8D/overview/index'], resolve),
        name: '8D预览',
        meta: { title: '8D预览' }
      }
    ]
  },
  {
    path: '/8D',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'fishBone',
        component: (resolve) => require(['@/views/tools/8D/detail/fishbone/index'], resolve),
        name: '鱼骨图',
        meta: { title: '鱼骨图' }
      }
    ]
  }
]

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
