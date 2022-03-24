<template>
  <div class="app-container">

    <!--工具栏-->
    <div class="head-container">
      <eHeader :permission="permission"/>
      <crudOperation :permission="permission" />
    </div>

    <el-dialog
      title="编辑措施"
      :visible.sync="editActionVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        ref="actionForm"
        :model="actionForm"
        :rules="conActionRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          label="措施标题"
          prop="name"
        >
          <span>{{ actionForm.name }}</span>
        </el-form-item>
        <el-form-item
          label="预期完成时间"
          prop="qtyOk"
        >
          <span>{{ actionForm.plannedCompleteTime }}</span>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
        >
          <span>{{ actionForm.description }}</span>
        </el-form-item>
        <el-form-item
          label="有效性(%)"
          prop="efficiency"
        >
          <el-input-number v-model="actionForm.efficiency" style="width: 370px;" :precision="2" :step="0.1"
                           :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-select
            v-model="actionForm.status"
            placeholder="请选择状态"
            style="width: 370px;"
          >
            <el-option v-for="item in statusTypeOptions" :key="item.value" :label="item.label"
                       :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="其他"
          prop="comment"
        >
          <el-input
            v-model="actionForm.comment"
            type="textarea"
            autosize
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item
          label="结论"
          prop="conclusion"
        >
          <el-input
            v-model="actionForm.conclusion"
            type="textarea"
            autosize
            style="width: 370px;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="doCancelAct">取 消</el-button>
         <el-button :loading="submitLoading" type="primary" @click="submitConAct">确 定</el-button>
      </span>
    </el-dialog>

    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @row-dblclick="dbSelected"
    >
      <el-table-column prop="name" label="措施标题" min-width="120"/>
      <el-table-column prop="issueTitle" label="问题标题"/>
      <el-table-column label="状态" :formatter="statusFormat"/>
      <el-table-column prop="hasReport" label="执行选择"/>
      <el-table-column prop="plannedTime" label="预期执行时间"/>
      <el-table-column prop="type" label="所属进程"/>
      <el-table-column v-if="this.user.isAdmin" prop="responsibleName" label="负责人"/>
      <el-table-column prop="createTime" label="创建时间"/>
      <!--   编辑与删除   -->
      <el-table-column
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <div>
            <!--编辑-->
            <el-button slot="reference"
                       size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="editAction(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination/>
  </div>
</template>

<script>
import { editIssueAction, getUserAction } from '@/api/tools/issueAction'
import crudAction from '@/api/tools/issueAction'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '../module/CRUD.dOperation'
import pagination from '@crud/Pagination'
import udOperation from '../module/UD.dOperation'
import eHeader from '@/views/tools/8D/task/module/header'
import { mapGetters } from 'vuex'

export default {
  name: '8DTask',
  components: { eHeader, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '措施',
      url: 'api/issueAction',
      crudMethod: { ...crudAction }
    })
  },
  mixins: [presenter()],
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      actionLoading: false,
      userActions: [],
      editActionVisible: false,
      actionForm: {
        name: null,
        efficiency: null,
        status: null,
        comment: null,
        conclusion: null
      },
      conActionRules: {
        efficiency: [
          { required: true, message: '请填写有效性', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '请填写其他补充信息', trigger: 'blur' }
        ],
        conclusion: [
          { required: true, message: '请如实填写结论', trigger: 'blur' }
        ]
      },
      statusTypeOptions: [
        { label: '已创建', value: '开始' },
        { label: '进行中', value: '进行中' },
        { label: '关闭', value: '完成' },
        { label: '已移除', value: '已移除' }
      ],
      submitLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.crud.optShow = { add: false, edit: false, del: false, download: true }
  },
  mounted: function() {
    this.getUserActionTask()
  },
  methods: {
    getUserActionTask() {
      this.actionLoading = true
      getUserAction().then(res => {
        this.userActions = res
        this.actionLoading = false
      })
    },
    // 关闭弹窗前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // 状态格式化
    statusFormat(row, col) {
      if (row.status === '开始') {
        return '已创建'
      } else if (row.status === '进行中') {
        return '进行中'
      } else if (row.status === '完成') {
        return '关闭'
      } else if (row.status === '已移除') {
        return '已移除'
      }
    },
    // 取消编辑
    doCancelAct() {
      this.editActionVisible = false
    },
    // 准备编辑
    editAction(row) {
      this.actionForm = row
      this.editActionVisible = true
    },
    // 提交任务编辑
    submitConAct() {
      this.$refs.actionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.submitLoading = true
          editIssueAction(this.actionForm).then(res => {
            this.$message({
              message: 'Edit Record Success! 编辑措施记录成功!',
              type: 'success'
            })
            this.submitLoading = false
            this.editActionVisible = false
          })
        }
      })
    },
    // 双击选中的行列
    dbSelected(row) {
      // 跳转到单独报告中
      if (row.hasReport === '单独报告') {
        // 跳转到单独报告
        this.$router.push(
          {
            path: '/issue/report',
            query: {
              issueId: row.issueId
            }
          })
      } else if (row.hasReport === '系统8D') {
        // 跳转到8D明细中
        this.$router.push(
          {
            path: '/issue/detail',
            query: {
              issueId: row.issueId
            }
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
