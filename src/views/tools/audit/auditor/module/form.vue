<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="700px"
  >
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
              :disabled="crud.status.edit"
              filterable
              v-model="form.userId"
              placeholder="请添加审核人员"
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
            label="体系"
            prop="system"
          >
            <el-select
              v-model="form.system"
              placeholder="请选择体系"
              style="width: 200px;"
            >
              <el-option
                v-for="item in auditSystem"
                :key="item.id"
                :label="item.value"
                :value="item.value"
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
              disabled
              v-model="form.status"
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
              type="date"
              style="width: 200px;"
              placeholder="选择日期"
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
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="下此认证时间"
            prop="nextCertificationTime"
          >
            <el-date-picker
              v-model="form.nextCertificationTime"
              type="date"
              style="width: 200px;"
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
              disabled
              v-model="form.approvedBy"
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
            v-if="!crud.status.add && form.status !== '待批准'"
            label="批准时间"
            prop="approvedTime"
          >
            <el-date-picker
              disabled
              v-model="form.approvedTime"
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
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
import { getAllUser } from '@/api/system/user'

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
      users: [],
      rules: {
        userId: [
          { required: true, message: '请务必选择有效人员', trigger: 'blur' }
        ],
        system: [
          { required: true, message: '请输入体系', trigger: 'blur' }
        ],
        certificationTime: [
          { required: true, message: '请输入认证时间', trigger: 'blur' }
        ],
        validity: [
          { required: true, message: '请输入有效期', trigger: 'blur' }
        ],
        nextCertificationTime: [
          { required: true, message: '请输入下一次认证时间', trigger: 'blur' }
        ],
        certificationUnit: [
          { required: true, message: '请输入认证单位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  mounted: function() {
    this.queryAllUser()
  },
  methods: {
    queryAllUser() {
      // 查询所有有效员工
      getAllUser().then(res => {
        this.users = res.content
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
