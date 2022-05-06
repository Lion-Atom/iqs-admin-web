<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="80%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="100px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="新员工姓名" prop="staffName">
            <el-input v-model="form.staffName" style="width: 220px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="入职日期"
            prop="hireDate"
          >
            <el-date-picker
              v-model="form.hireDate"
              type="date"
              style="width: 220px;"
              placeholder="请填写入职时间"
              :picker-options="pickerOption"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="新员工类型" prop="staffType">
            <el-select
              v-model="form.staffType"
              placeholder="请选择员工类型"
              style="width: 220px;"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label + ' - ' +item.value "
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.staffType">
        <el-col :span="8">
          <el-form-item label="所属部门" prop="departId">
            <TreeSelect
              v-model="form.departId"
              :options="departs"
              :load-options="loadDeparts"
              class="newTree-item"
              placeholder="选择新员工所在部门"
              style="width:220px !important;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上级主管" prop="superior">
            <el-select
              v-model="form.superior"
              placeholder="请先选择所在部门"
              style="width:220px"
            >
              <el-option
                v-for="item in superiors"
                :key="item.id"
                :label="item.jobs[0].name + '-'+ item.username "
                :value="item.username"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.staffType">
          <el-form-item label="岗位名称" prop="jobName">
            <el-input v-model="form.jobName" style="width:220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.staffType === typeOptions[1].value">
        <el-col :span="8">
          <el-form-item label="工号" prop="jobNum">
            <el-input v-model="form.jobNum" style="width:220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="form.staffType === typeOptions[0].value">
        <el-col :span="8">
          <el-form-item label="车间" prop="workshop">
            <el-input v-model="form.workshop" style="width:220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班组" prop="team">
            <el-input v-model="form.team" style="width:220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" v-if="form.staffType">
          <el-form-item label="培训内容" prop="trainContent">
            <el-input type="textarea" :row="3" v-model="form.trainContent" placeholder="请填写培训内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.staffType">
          <el-form-item label="是否完成" prop="isFinished">
            <el-radio
              v-for="item in finishStatus"
              :key="item.id"
              v-model="form.isFinished"
              :label="item.value === 'true'"
              @change="trainResultChanged"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.staffType && form.isFinished.toString() === 'false'">
          <el-form-item label="未完成原因" prop="reason">
            <el-input type="textarea" :row="3" v-model="form.reason" placeholder="请填写未完成培训原因"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {form} from '@crud/crud'
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getDepts, getDeptTree} from "@/api/system/dept";
import {getUserByDeptId} from "@/api/system/user";
import {validIsNotNull} from "@/utils/validationUtil";
import {mapGetters} from "vuex";

const defaultForm = {
  id: null,
  staffName: null,
  staffType: null,
  hireDate: null,
  departId: null,
  workshop: null,
  team: null,
  superior: null,
  jobName: null,
  jobNum: null,
  trainContent: null,
  isFinished: true,
  reason: null
}
export default {
  mixins: [form(defaultForm)],
  components: {TreeSelect},
  props: {
    finishStatus: {
      type: Array,
      required: true
    },
    typeOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: {
        staffName: [
          {required: true, message: '请输入新员工姓名', trigger: 'blur'}
        ],
        hireDate: [
          {required: true, message: '请输入入职时间', trigger: 'blur'}
        ],
        staffType: [
          {required: true, message: '请选择新员工类型', trigger: 'blur'}
        ],
        departId: [
          {required: true, message: '请选择新员工所属部门', trigger: 'blur'}
        ],
        superior: [
          {required: true, message: '请选择上级主管', trigger: 'blur'}
        ],
        jobNum: [
          {required: false, message: '请填写新员工工号', trigger: 'blur'}
        ],
        jobName: [
          {required: true, message: '请填写新员工岗位', trigger: 'blur'}
        ],
        workshop: [
          {required: true, message: '请填写培训车间', trigger: 'blur'}
        ],
        team: [
          {required: true, message: '请填写所在班组', trigger: 'blur'}
        ],
        trainContent: [
          {required: true, message: '培训内容不可为空', trigger: 'blur'}
        ],
        isFinished: [
          {required: true, message: '请选择是否完成培训', trigger: 'blur'}
        ],
        reason: [
          {required: true, message: '请填写未完成培训的原因', trigger: 'blur'}
        ]
      },
      departs: [],
      superiors: [],
      reasonRules: [
        {required: false}
      ],
      pickerOption: {
        disabledDate: time => {
          return (
            Date.now() <= time.getTime()
          )
        }
      }
    }
  },
  watch: {
    // 监听deptId
    'form.departId': 'currDeptChange'
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi'
    ])
  },
  created: function () {
    this.getTopDept()
  },
  methods: {
    getTopDept() {
      // alert(JSON.stringify(this.user))
      getDeptTree().then(res => {
        this.departs = res.content
      })
    },
    // 获取弹窗内使用部门数据
    loadDeparts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 监控数据变化
    currDeptChange(deptId) {
      this.superiors = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        // alert(JSON.stringify(res))
        this.superiors = res
        if (this.superiors.length > 0) {
          // 若不是同部门成员则需要默认切换到首选默认值
          let usernames = []
          this.superiors.forEach((data, index) => {
            usernames.push(data.username)
          })
          if (validIsNotNull(this.form.superior)) {
            if (usernames.indexOf(this.form.superior) === -1) {
              this.form.superior = this.superiors[0].username
            }
          } else {
            // 若原无值则设置首选默认值
            this.form.superior = this.superiors[0].username
          }
          // alert(usernames.indexOf(this.form.acceptBy))
        } else {
          this.form.superior = null
        }
        // alert(JSON.stringify(this.users))
      })
    },
    trainResultChanged(val) {
      if (val.toString() === 'false') {
        this.reasonRules = this.rules.reason
      } else {
        this.reasonRules = [
          {required: false}
        ]
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
