<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="editTitle"
    width="700px"
  >

    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="160px"
    >
      <div v-if="crud.status.add">
        <el-form-item
          label="问题标题"
          prop="issueTitle"
        >
          <el-input
            v-model="form.issueTitle"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item
          label="客户名"
          prop="customerName"
        >
          <el-input
            v-model="form.customerName"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item
          label="客户追踪码"
          prop="caNum"
        >
          <el-input
            v-model="form.caNum"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item
          label="产品料号"
          prop="partNum"
        >
          <el-input
            v-model="form.partNum"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item
          label="问题来源"
          prop="source"
        >
          <el-radio
            v-for="item in dSource"
            :key="item.value"
            v-model="form.source"
            :label="item.value"
          >
            {{ item.value }}
          </el-radio>
        </el-form-item>
        <el-form-item
          label="紧急计划"
          prop="urgencyPlan"
        >
          <el-input
            v-model="form.urgencyPlan"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="initTime"
        >
          <el-date-picker
            v-model="form.initTime"
            style="width: 370px;"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="具体描述"
          prop="description"
        >
          <el-input
            type="textarea"
            v-model="form.description"
            :rows="3"
            style="width: 370px;"
          />
        </el-form-item>
      </div>
      <div v-else-if="crud.status.edit">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="问题明细" name="1" class="collapse-item">
            <el-form-item
              label="问题标题"
              prop="issueTitle"
            >
              <el-input
                v-model="form.issueTitle"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="客户名"
              prop="customerName"
            >
              <el-input
                v-model="form.customerName"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="客户追踪码"
              prop="caNum"
            >
              <el-input
                v-model="form.caNum"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="产品料号"
              prop="partNum"
            >
              <el-input
                v-model="form.partNum"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="问题来源"
              prop="source"
            >
              <el-radio
                v-for="item in dSource"
                :key="item.value"
                v-model="form.source"
                :label="item.value"
              >
                {{ item.value }}
              </el-radio>
            </el-form-item>
            <el-form-item
              label="紧急计划"
              prop="urgencyPlan"
            >
              <el-input
                v-model="form.urgencyPlan"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="创建时间"
              prop="initTime"
            >
              <el-date-picker
                v-model="form.initTime"
                style="width: 370px;"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="具体描述"
              prop="description"
            >
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.description"
                style="width: 370px;"
              />
            </el-form-item>
          </el-collapse-item>
          <!--审核问题-->
          <el-collapse-item title="审核问题" name="2" class="collapse-item">
            <el-form-item
              label="客户/供应商联系电话"
              prop="phone"
            >
              <el-input
                v-model="form.phone"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="客户/供应商邮箱"
              prop="email"
            >
              <el-input
                v-model="form.email"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="问题类型"
              prop="type"
            >
              <el-input
                v-model="form.type"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="是否为重复发生问题"
              prop="isRepeat"
            >
              <el-radio-group v-model="form.isRepeat">
                <el-radio
                  v-for="item in dEnabled"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否有类似问题"
              prop="hasSimilar"
            >
              <el-radio-group v-model="form.hasSimilar">
                <el-radio
                  v-for="item in dEnabled"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="初步风险评估"
              prop="initRisk"
            >
              <el-input
                v-model="form.initRisk"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="关联部门"
              prop="department"
            >
              <el-input
                v-model="form.department"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="客户要求时间"
              prop="customerTime"
            >
              <el-date-picker
                v-model="form.customerTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="其他"
              prop="other"
            >
              <el-input
                type="textarea"
                :rows="3"
                v-model="form.other"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="执行选择"
              prop="hasReport"
            >
              <el-radio-group v-model="form.hasReport">
                <el-radio
                  v-for="item in dExecute"
                  :key="item.id"
                  :label="item.value"
                >{{ item.value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <!--todo 任命组长-->
            <el-form-item
              v-if="form.hasReport==='系统8D'"
              label="指派组长"
              prop="leaderId"
            >
              <el-select
                v-model="form.leaderId"
                placeholder="请指派组长"
                style="width: 370px;"
                filterable
              >
                <el-option
                  v-for="item in members"
                  :key="item.id"
                  :label="item.dept.name + '-'+item.jobs[0].name + '-'+ item.username "
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.hasReport==='系统8D'"
              label="是否评分"
              prop="hasScore"
            >
              <el-radio-group v-model="form.hasScore">
                <el-radio
                  v-for="item in dEnabled"
                  :key="item.id"
                  :label="item.value"
                >{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-collapse-item>

          <!--添加附件及其列表-->
          <el-collapse-item title="附件管理" name="3" class="collapse-item">
            <UploadFile
              :issue-id="form.id"
              :permission="permission"
              :is-need="isNeed"
              :step-name="curStep"
              :shadow="never"
            />
          </el-collapse-item>
        </el-collapse>
      </div>

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
        :disabled="!user.isAdmin && crud.status.edit"
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
import UploadFile from '../module/uploadFile.vue'
import { mapGetters } from 'vuex'

const defaultForm = {
  id: null,
  issueTitle: null,
  customerName: null,
  caNum: null,
  partNum: null,
  source: 'external',
  urgencyPlan: null,
  initTime: null,
  description: null,
  phone: null,
  email: null,
  leaderId: null,
  type: null,
  isRepeat: null,
  hasSimilar: null,
  initRisk: null,
  department: null,
  customerTime: null,
  other: null,
  hasReport: null,
  hasScore: null
}
export default {
  mixins: [form(defaultForm)],
  props: {
    dStatus: {
      type: Array,
      required: true
    },
    dSource: {
      type: Array,
      required: true
    },
    dEnabled: {
      type: Array,
      required: true
    },
    dExecute: {
      type: Array,
      required: true
    }
  },
  components: { UploadFile },
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      editTitle: '审核问题',
      rules: {
        issueTitle: [
          { required: true, message: '请输入问题标题', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '请输入客户名', trigger: 'blur' }
        ],
        caNum: [
          { required: true, message: '请输入客户追踪码', trigger: 'blur' }
        ],
        partNum: [
          { required: true, message: '请输入产品料号', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择问题来源', trigger: 'blur' }
        ],
        urgencyPlan: [
          { required: true, message: '请输入紧急计划', trigger: 'blur' }
        ],
        initTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请描述下问题具体信息', trigger: 'blur' }
        ],
        /*phone: [
          { required: true, message: '请留下电话便于联系', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],*/
        type: [
          { required: true, message: '请输入问题类型', trigger: 'blur' }
        ],
        isRepeat: [
          { required: true, message: '请判断是否为重复问题', trigger: 'blur' }
        ],
        hasSimilar: [
          { required: true, message: '请判断是否有类似问题', trigger: 'blur' }
        ],
        initRisk: [
          { required: true, message: '请评估风险程度', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入关联部门', trigger: 'blur' }
        ],
        customerTime: [
          { required: true, message: '请输入客户要求的时间截点', trigger: 'blur' }
        ],
        other: [
          { required: true, message: '请补充完整信息', trigger: 'blur' }
        ],
        hasReport: [
          { required: true, message: '请务必选择是否执行8D', trigger: 'blur' }
        ],
        leaderId: [
          { required: true, message: '请务必指派小组组长', trigger: 'blur' }
        ],
        hasScore: [
          { required: true, message: '请务必选择是否评分', trigger: 'blur' }
        ]
      },
      members: [],
      activeNames: '1',
      isNeed: true,
      never: 'never',
      curStep: 'D0'
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    this.user.isAdmin ? this.isNeed = true : this.isNeed = false
    this.user.isAdmin ? this.editTitle = '审核问题' : this.editTitle = '查看问题'
    this.getAvailableUser()
  },
  methods: {
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.members = res.content
      })
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.el-form-item--small.el-form-item {
  margin-bottom: 12px;
}
</style>
