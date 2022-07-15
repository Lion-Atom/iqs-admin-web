<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :feedback-status="feedbackStatus" :type-options="typeOptions"/>
      <crudOperation/>
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
              @selection-change="crud.selectionChangeHandler" @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="companyName" label="客户名称"/>
      <el-table-column prop="type" label="问题分类">
        <template slot-scope="scope">
          <el-tag :type="typeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="问题描述" :show-overflow-tooltip="true"/>
      <el-table-column prop="qq" label="QQ号码"/>
      <el-table-column prop="phone" label="手机号码"/>
      <el-table-column prop="email" label="电子邮箱"/>
      <el-table-column prop="status" label="反馈状态"/>
      <el-table-column prop="createTime" label="创建日期"/>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--表单渲染-->
    <eForm :feedback-status="feedbackStatus" :type-options="typeOptions"/>
  </div>
</template>

<script>
import crudFeedback from '@/api/more/csFeedback'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, {presenter} from '@crud/crud'
import crudOperation from './module/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

export default {
  name: 'Feedback',
  components: {eHeader, eForm, crudOperation, pagination, udOperation},
  cruds() {
    return CRUD({
      title: '用户反馈',
      url: 'api/csFeedback',
      sort: ['companyName,asc', 'id,desc'],
      crudMethod: {...crudFeedback}
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: [],
  data() {
    return {
      feedbackStatus: [
        {
          value: '新建',
          label: '新建'
        },
        {
          value: '即处理',
          label: '即处理'
        },
        {
          value: '处理中',
          label: '处理中'
        },
        {
          value: '冷处理',
          label: '冷处理'
        },
        {
          value: '已处理',
          label: '已处理'
        },
        {
          value: '未处理完结',
          label: '未处理完结'
        },
        {
          value: '已处理完结',
          label: '已处理完结'
        }
      ],
      typeOptions: [
        {
          value: '用户表扬类',
          label: '用户表扬'
        },
        {
          value: '功能需求类',
          label: '功能需求'
        },
        {
          value: 'BUG类',
          label: 'BUG'
        },
        {
          value: '运营相关类',
          label: '运营相关'
        },
        {
          value: '其他类',
          label: '其他'
        }
      ]
    }
  },
  methods: {
    typeTag(type) {
      if (type === 'BUG类') {
        return 'danger'
      } else if (type === '功能需求类') {
        return 'warning'
      } else if (type === '用户表扬类') {
        return 'success'
      } else if (type === '运营相关类') {
        return ''
      } else {
        return 'info'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
