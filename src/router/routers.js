import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    meta: {title: '登录', noCache: true},
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
        meta: {title: '首页', icon: 'index', affix: true, noCache: true}
      }
    ]
  },
  {
    path: '/more',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'feedback',
        component: (resolve) => require(['@/views/more/feedback'], resolve),
        name: 'Feedback',
        meta: {title: '客户反馈'}
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
        meta: {title: '个人中心'}
      }
    ]
  },
  {
    path: '/issue',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/tools/8D/detail/index'], resolve),
        name: '8D流程',
        meta: {title: '8D流程'}
      },
      {
        path: 'fishBone',
        component: (resolve) => require(['@/views/tools/8D/detail/fishbone/index'], resolve),
        name: '鱼骨图',
        meta: {title: '鱼骨图'}
      },
      {
        path: 'report',
        component: (resolve) => require(['@/views/tools/8D/report/index'], resolve),
        name: '单独报告',
        meta: {title: '单独报告'}
      },
      {
        path: 'overview',
        component: (resolve) => require(['@/views/tools/8D/overview/index'], resolve),
        name: '打印预览',
        meta: {title: '打印预览'}
      }
    ]
  },
  {
    path: '/auditor',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/tools/audit/auditor/detail/index'], resolve),
        name: '人员明细',
        meta: {title: '人员明细'}
      }
    ]
  },
  {
    path: '/plan',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/tools/audit/plan/plandetail/index'], resolve),
        name: '计划明细',
        meta: {title: '计划明细'}
      },
      {
        path: 'report',
        component: (resolve) => require(['@/views/tools/audit/plan/report/index'], resolve),
        name: '执行报告预览',
        meta: {title: '执行报告预览'}
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'update',
        component: (resolve) => require(['@/views/tools/supplier/update/index'], resolve),
        name: '供应商更新',
        meta: {title: '更新供应商信息'}
      },
      {
        path: 'contact-update',
        component: (resolve) => require(['@/views/tools/supplier/contact/update/index'], resolve),
        name: '供应商联系人更新',
        meta: {title: '更新供应商联系人信息'}
      }
    ]
  },
  {
    path: '/change',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'add',
        component: (resolve) => require(['@/views/tools/change/add/index'], resolve),
        name: '变更信息新增',
        meta: {title: '新增变更信息'}
      },
      {
        path: 'update',
        component: (resolve) => require(['@/views/tools/change/update/index'], resolve),
        name: '变更信息更新',
        meta: {title: '更新变更信息'}
      },
      {
        path: 'overview',
        component: (resolve) => require(['@/views/tools/change/overview/index'], resolve),
        name: '变更报告预览',
        meta: {title: '变更报告预览'}
      }
    ]
  },
  {
    path: '/maintenance',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/tools/equipment/maintenance/detail/index'], resolve),
        name: '保养明细',
        meta: {title: '保养明细'}
      }
    ]
  },
  {
    path: '/instrument',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'calibration',
        component: (resolve) => require(['@/views/tools/instrument/manage/calibration/index'], resolve),
        name: '仪器校准',
        meta: {title: '仪器校准'}
      }
    ]
  },
  {
    path: '/training/train-exam',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/tools/training/management/trainexam/detail/index'], resolve),
        name: '培训考试明细',
        meta: {title: '培训考试明细'}
      }
    ]
  },
  {
    path: '/training/train-material',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/tools/training/management/trainmaterial/detail/index'], resolve),
        name: '培训材料明细',
        meta: {title: '培训材料明细'}
      }
    ]
  }
]

export default new Router({
  // mode: 'hash',
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
