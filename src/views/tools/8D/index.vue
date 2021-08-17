<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="dbSelected"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="encodeNum" label="唯一编码" width="120"/>
      <el-table-column prop="issueTitle" label="问题标题" width="160"/>
      <el-table-column prop="partNum" label="物料编码" width="150"/>
      <el-table-column prop="customerName" label="客户名称" width="120"/>
      <el-table-column prop="hasReport" label="执行选择" width="120"/>
      <el-table-column prop="specialEvent" label="特殊事件" width="120"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="process" label="8D进程" min-width="350">
        <template slot-scope="scope">
          <!--格式化8D进程-->
          <el-steps class="steps">
            <el-step
              v-for="item in scope.row.commonDTOList"
              :key="item.name"
              :status="item.value"
              :title="item.name"
            >
            </el-step>
          </el-steps>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建者"/>
      <el-table-column prop="createTime" label="创建日期" width="140"/>
      <el-table-column prop="closeTime" label="关闭日期" width="140"/>
      <el-table-column prop="duration" label="结案时长"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','d:edit','d:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-edit="scope.row.hasReport === undefined"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--表单渲染-->
    <eForm :d-status="dict.d_status" :d-source="dict.d_source" :d-enabled="dict.common_status"
           :d-execute="dict.d_execute"
    />
  </div>
</template>

<script>
import crudIssue from '@/api/tools/issue'
import eHeader from './module/issueHeader'
import eForm from './module/issueForm'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from './module/CRUD.dOperation'
import pagination from '@crud/Pagination'
import udOperation from './module/UD.dOperation'
import { mapGetters } from 'vuex'

export default {
  name: 'Issue',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '问题',
      url: 'api/issue',
      crudMethod: { ...crudIssue }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['d_status', 'd_process', 'd_source', 'common_status', 'd_execute'],
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      steps: [
        {
          name: 'D1',
          value: 'success'
        },
        {
          name: 'D2',
          value: 'process'
        },
        {
          name: 'D3',
          value: 'wait'
        }
      ]
    }
  },
  created() {
  },
  methods: {
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.$message({
        message: '新增后记得审核后才能进行下一步哦!',
        type: 'warning'
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.isRepeat = form.isRepeat.toString()
      form.hasSimilar = form.hasSimilar.toString()
      form.hasReport = form.hasReport.toString()
      form.hasScore = form.hasScore.toString()
    },
    // 双击选中的行列
    dbSelected(row) {
      if (row.hasReport === '系统8D') {
        // 跳转到8D明细中
        this.$router.push(
          {
            path: '/issue/detail',
            query: {
              issueId: row.id
            }
          })
      } else if (row.hasReport === '直接结案') {
        this.$message({
          message: '该问题直接结案!',
          type: 'warning'
        })
      } else if (row.hasReport === '单独报告') {
        // 跳转到单独报告
        this.$router.push(
          {
            path: '/issue/report',
            query: {
              issueId: row.id
            }
          })
      } else if (row.hasReport === undefined) {
        this.$message({
          message: '尚未审核!',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.steps > > .el-step__icon {
  height: 16px;
  width: 16px;
  font-size: 12px !important;
}

::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
