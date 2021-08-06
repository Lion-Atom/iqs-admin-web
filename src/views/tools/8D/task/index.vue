<template>
  <div class="app-container">
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
          label="%有效性"
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
            <el-option v-for="item in statusTypeOptions" :key="item.key" :label="item.display_name"
                       :value="item.key"
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
      v-loading="actionLoading"
      :data="userActions"
      style="width: 100%;"
      @row-dblclick="dbSelected"
    >
      <el-table-column prop="name" label="措施标题" min-width="150"/>
      <el-table-column prop="issueTitle" label="问题标题"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="plannedTime" label="预期执行时间"/>
      <el-table-column prop="type" label="所属进程"/>
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
  </div>
</template>

<script>
import { getUserAction, editIssueAction } from '@/api/tools/issueAction'
import { validIsNull } from '@/utils/validationUtil'

export default {
  name: '8DTask',
  data() {
    return {
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
        { key: '已创建', display_name: '已创建' },
        { key: '进行中', display_name: '进行中' },
        { key: '关闭', display_name: '关闭' },
        { key: '已移除', display_name: '已移除' }
      ],
      submitLoading: false
    }
  },
  created() {

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
    // 取消编辑
    doCancelAct() {
      this.getUserActionTask()
      this.editActionVisible = false
    },
    // 准备编辑
    editAction(row) {
      this.actionForm = row
      this.editActionVisible = true
    },
    // 提交任务编辑
    submitConAct() {
      this.submitLoading = true
      this.$refs.actionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
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
      // 跳转到8D明细中
      this.$router.push(
        {
          path: '/8D/detail',
          query: {
            issueId: row.issueId
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
