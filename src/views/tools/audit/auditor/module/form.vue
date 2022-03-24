<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    width="700px"
  >
    <template slot="title">
        <span v-if="disEdit === true">
          查看审核人员
          <i style="color: #ffb700;font-size: 10px;">[当前已审批的审核人员生效中，无需更正]</i>
        </span>
      <span v-else>
          {{ crud.status.title }}
          <i style="color: #ffb700;font-size: 10px;">{{ remark }}</i>
        </span>
    </template>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="人员"
            prop="userId"
          >
            <el-select
              v-model="form.userId"
              :disabled="crud.status.edit"
              filterable
              placeholder="请添加审核人员"
              style="width: 200px;"
              @input="userChangeHandler"
            >
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.dept.name + ' - '+ item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="体系"
            prop="system"
          >
            <el-select
              v-model="form.system"
              filterable
              allow-create
              placeholder="支持自定义"
              style="width: 200px;"
              :disabled="disEdit"
            >
              <el-option
                v-for="item in auditSystem"
                :key="item.id"
                :label="item.value"
                :value="item.value"
                :disabled="disSystemOptions.indexOf(item.value) > -1 "
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="!crud.status.add"
            label="状态"
            prop="status"
          >
            <el-select
              v-model="form.status"
              disabled
              placeholder="展示状态"
              style="width: 200px;"
            >
              <el-option
                v-for="item in auditorStatus"
                :key="item.id"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="认证时间"
            prop="certificationTime"
          >
            <el-date-picker
              v-model="form.certificationTime"
              :picker-options="certificationTimeOption"
              type="date"
              style="width: 200px;"
              placeholder="选择日期"
              :disabled="disEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="有效期限（年）"
            prop="validity"
          >
            <el-input-number
              v-model="form.validity"
              style="width: 200px;"
              :precision="0"
              :step="1"
              :min="1"
              :max="200"
              :disabled="disEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="下次认证时间"
            prop="nextCertificationTime"
          >
            <el-date-picker
              v-model="form.nextCertificationTime"
              :picker-options="nextCertificationTimeOption"
              type="date"
              style="width: 200px;"
              :disabled="disEdit"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="认证单位"
            prop="certificationUnit"
          >
            <el-input
              v-model="form.certificationUnit"
              :disabled="disEdit"
              style="width: 200px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="!crud.status.add"
            label="批准人"
            prop="approvedBy"
          >
            <el-select
              v-model="form.approvedBy"
              disabled
              style="width: 200px;"
            >
              <el-option
                v-for="item in users"
                :key="item.id"
                :label="item.dept.name + ' - '+ item.username"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-if="form.approvedTime !== null"
            label="批准时间"
            prop="approvedTime"
          >
            <el-date-picker
              v-model="form.approvedTime"
              disabled
              type="datetime"
              style="width: 200px;"
              placeholder="填写日期时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        {{ cancelName }}
      </el-button>
      <el-button
        v-if="disEdit===false"
        :loading="crud.status.cu === 2"
        type="primary"
        @click="submitConfirm"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, {form} from '@crud/crud'
import {getAllUser} from '@/api/system/user'
import {judgeIsEqual} from '@/utils/validationUtil'
import {getAuditorByUserId} from "@/api/tools/auditor";

const defaultForm = {
  id: null,
  userId: null,
  system: null,
  status: null,
  certificationTime: null,
  validity: null,
  nextCertificationTime: null,
  certificationUnit: null,
  approvedBy: null,
  approvedTime: null
}

export default {
  mixins: [form(defaultForm)],
  props: {
    auditorStatus: {
      type: Array,
      required: true
    },
    auditSystem: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 认证时间不可大于现在时间
      certificationTimeOption: {
        disabledDate(date) {
          return Date.now() < date.getTime()
        }
      },
      // 限制下次时间不可小于当前时间
      nextCertificationTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now()
        }
      },
      editFormChanged: 0,
      users: [],
      rules: {
        userId: [
          {required: true, message: '请务必选择有效人员', trigger: 'blur'}
        ],
        system: [
          {required: true, message: '请输入体系', trigger: 'blur'}
        ],
        certificationTime: [
          {required: true, message: '请输入认证时间', trigger: 'blur'}
        ],
        validity: [
          {required: true, message: '请输入有效期', trigger: 'blur'}
        ],
        nextCertificationTime: [
          {required: true, message: '请输入下一次认证时间', trigger: 'blur'}
        ],
        certificationUnit: [
          {required: true, message: '请输入认证单位', trigger: 'blur'}
        ]
      },
      system: null,
      certificationTime: null,
      nextCertificationTime: null,
      validity: null,
      certificationUnit: null,
      disEdit: false,
      cancelName: '取消',
      remark: '',
      disSystemOptions: []
    }
  },
  created() {

  },
  mounted: function () {
    this.queryAllUser()
  },
  methods: {
    queryAllUser() {
      // 查询所有有效员工
      getAllUser().then(res => {
        this.users = res.content
      })
    },
    [CRUD.HOOK.beforeToAdd](crud, form) {
      // alert(this.disEdit)
      this.disEdit = false
      this.remark = ''
    },
    // 编辑前
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // alert(form.approvalStatus)
      // alert(form.status)
      this.remark = ''
      if (form.approvalStatus === '被驳回') {
        /*this.$message({
          message: 'Soon to Active!当前审核信息被驳回，需更正后重新激活审批',
          type: 'warning'
        })*/
        this.remark = '[当前审核信息被驳回，需更正后重新激活审批]'
      }
      this.disEdit = form.approvalStatus === '已批准' && form.status === '有效'
      this.cancelName = '取消'
      if (form.approvalStatus === '已批准' && form.status === '有效') {
        /*this.$message({
          message: 'Approved validity!当前审核人员已生效，无需更正',
          type: 'success'
        })*/
        // this.remark = '[当前已审批的审核人员生效中，无需更正]'
        this.cancelName = '关闭'
      }
      this.userChangeWatch(form.userId, form.system)
      this.system = form.system
      this.certificationTime = form.certificationTime
      this.nextCertificationTime = form.nextCertificationTime
      this.validity = form.validity
      this.certificationUnit = form.certificationUnit
    },
    // 提交
    submitConfirm() {
      // 监控有无发生变化
      if (judgeIsEqual(this.system, this.form.system) &&
        judgeIsEqual(this.system, this.form.system) &&
        judgeIsEqual(this.certificationTime, this.form.certificationTime) &&
        judgeIsEqual(this.nextCertificationTime, this.form.nextCertificationTime) &&
        judgeIsEqual(this.validity, this.form.validity) &&
        judgeIsEqual(this.certificationUnit, this.form.certificationUnit)) {
        this.$message({
          message: 'No changes found, no need to save!未发生改动，无需提交保存',
          type: 'warning'
        })
        return false
      }
      this.crud.submitCU()
    },
    // 监控员工ID变化
    userChangeHandler(userId) {
      // alert(userId)
      this.disSystemOptions = []
      getAuditorByUserId(userId).then(res => {
        // alert(JSON.stringify(res))
        if (res.length > 0) {
          res.forEach((data, index) => {
            this.disSystemOptions.push(data.system)
          })
        }
        // alert(JSON.stringify(this.disSystemOptions))
      })
    },
    userChangeWatch(userId, system) {
      this.disSystemOptions = []
      getAuditorByUserId(userId).then(res => {
        // alert(JSON.stringify(res))
        if (res.length > 0) {
          res.forEach((data, index) => {
            if (data.system !== system) {
              this.disSystemOptions.push(data.system)
            }
          })
        }
        // alert(JSON.stringify(this.disSystemOptions))
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
