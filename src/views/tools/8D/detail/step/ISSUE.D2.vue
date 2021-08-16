<template>
  <div>
    <!--问题基本信息-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">相关数据</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="toAddNum">增加新数据</el-button>
      </div>
      <div>
        <!--新增/编辑数据弹窗-->
        <el-dialog
          :title="numOperationTitle"
          :visible.sync="addNumVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="form"
            :model="issueNumForm"
            :rules="numRules"
            size="small"
            label-width="120px"
          >
            <el-form-item
              label="产品料号"
              prop="caPartNum"
            >
              <el-input
                v-model="issueNumForm.caPartNum"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="产品生产日期"
              prop="componentDateCode"
            >
              <el-date-picker
                v-model="issueNumForm.componentDateCode"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="产品批号"
              prop="componentLotNum"
            >
              <el-input
                v-model="issueNumForm.componentLotNum"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="不良数量"
              prop="defectQuantity"
            >
              <el-input
                v-model="issueNumForm.defectQuantity"
                style="width: 370px;"
              />
            </el-form-item>
            <el-form-item
              label="客户影响"
              prop="customerImpact"
            >
              <el-input
                v-model="issueNumForm.customerImpact"
                style="width: 370px;"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
         <el-button @click="addNumVisible = false">取 消</el-button>
         <el-button type="primary" @click="submitNum">确 定</el-button>
      </span>
        </el-dialog>
        <!--数据列表-->
        <el-table
          ref="table"
          v-loading="numLoading"
          :data="issueNums"
          style="width: 100%;"
        >
          <el-table-column prop="caPartNum" label="产品料号" width="150"/>
          <el-table-column prop="componentDateCode" label="产品生产日期" width="180"/>
          <el-table-column prop="componentLotNum" label="产品批号" width="180"/>
          <el-table-column prop="defectQuantity" label="不良数量" width="120"/>
          <el-table-column label="客户影响">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title="客户影响"
                width="200"
                trigger="hover"
              >
                <div>{{ scope.row.customerImpact }}</div>
                <a
                  slot="reference"
                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;"
                >
                  {{ scope.row.customerImpact }}
                </a>
              </el-popover>
            </template>
          </el-table-column>
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
                <el-button slot="reference" v-permission="permission.edit" :disabled="scope.row.isLeader === true"
                           size="mini"
                           type="primary" icon="el-icon-edit" @click="editNum(scope.row)"
                />
                <!--删除-->
                <el-popover :ref="`delMem-popover-${scope.$index}`" v-permission="permission.edit" placement="top"
                            width="180"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text"
                               @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click="deleteNum(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button slot="reference" v-permission="permission.del" type="danger" icon="el-icon-delete"
                             size="mini"
                  />
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!--详细描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">详细问题描述</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="addSupDesc(form)">保存</el-button>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline" label-width="120">
          <el-form-item
            prop="supplierDescription"
          >
            <el-input
              type="textarea"
              :rows="3"
              v-model="form.supplierDescription"
              style="min-width: 800px;"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--5W2H描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">5W2H描述</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="saveQuestions(questions)">保存</el-button>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="questionLoading"
          :data="questions"
          style="width: 100%;"
        >
          <el-table-column label="序号" width="60" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="标题" width="200"/>
          <el-table-column label="内容">
            <template scope="scope">
              <el-input
                type="textarea"
                autosize
                v-model="scope.row.description"
                style="min-width: 800px;"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--是/否描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">IS/IS Not描述</span>
        <el-popover
          placement="right"
          width="800"
          trigger="click"
        >
          <el-table
            :data="isNotData"
            :span-method="objectSpanMethod"
          >
            <el-table-column width="120" property="name" label="问题描述"></el-table-column>
            <el-table-column width="80" property="description" label="Item 细目"></el-table-column>
            <el-table-column width="300" property="isContent" label="IS"></el-table-column>
            <el-table-column width="300" property="notContent" label="IS-NOT"></el-table-column>
          </el-table>
          <el-button type="text" size="small" slot="reference">参考</el-button>
        </el-popover>
        <el-button style="float: right; padding: 3px 0" type="text" @click="saveIsNots(isNots)">保存</el-button>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="isNotLoading"
          :data="isNots"
          :span-method="objectSpanMethod"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="问题描述" width="120"/>
          <el-table-column width="120" property="description" label="Item 细目"></el-table-column>
          <el-table-column label="IS 是">
            <template scope="scope">
              <el-input
                type="textarea"
                autosize
                v-model="scope.row.isContent"
                style="min-width: 300px;"
              />
            </template>
          </el-table-column>
          <el-table-column label="IS-NOT 否">
            <template scope="scope">
              <el-input
                type="textarea"
                autosize
                v-model="scope.row.notContent"
                style="min-width: 300px;"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--添加附件及其列表-->
    <UploadFile
      :issue-id="this.$props.issueId"
      :is-need="isNeed"
      :permission="permission"
      :step-name="curStep"
      @func="getMsgFormSon"
    />

    <!--确认完成-->
    <el-card v-if="isNeed" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">确认完成</span>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            确认完成当前步骤：
            <el-popover
              placement="top"
              width="300"
              v-model="confirmVisible"
            >
              <p>您确定所有信息都已填写完毕，此步骤已完成吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmFinished">确定</el-button>
              </div>
              <el-button
                slot="reference"
                :loading="selfLoading"
                v-permission="permission.edit"
                type="success"
                :disabled="isFinished"
                icon="el-icon-check"
              >确认完成
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script>

import { editQuestion, getQuestionByIssueId } from '@/api/tools/issueQuestion'
import { editTimeManage, getByIssueId } from '@/api/tools/timeManagement'
import { edit, getIssueById } from '@/api/tools/issue'
import { addIssueNum, delIssueNum, editIssueNum, getIssueNumByIssueId } from '@/api/tools/issueNum'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import UploadFile from '../../module/uploadFile.vue'

export default {
  name: 'SecondForm',
  props: ['issueId', 'needConfirm'],
  components: { UploadFile },
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      loading: false,
      headers: {
        'Authorization': getToken()
      },
      selfLoading: false,
      numLoading: false,
      issueNums: [],
      addNumVisible: false,
      numOperationTitle: '',
      issueNumForm: {
        caPartNum: null,
        componentDateCode: null,
        componentLotNum: null,
        defectQuantity: null,
        customerImpact: null
      },
      numRules: {
        caPartNum: [
          { required: true, message: '请输入产品料号', trigger: 'blur' }
        ],
        componentDateCode: [
          { required: true, message: '请输入产品生产日期', trigger: 'blur' }
        ],
        componentLotNum: [
          { required: true, message: '请输入产品批号', trigger: 'blur' }
        ],
        defectQuantity: [
          { required: true, message: '请输入产品不良数量', trigger: 'blur' }
        ],
        customerImpact: [
          { required: true, message: '请描述对客户造成的影响', trigger: 'blur' }
        ]
      },
      isNeed: true,
      confirmVisible: false,
      timeManagement: {},
      curStep: 'D2',
      curTime: 'd2Time',
      form: {},
      oldDesc: null,
      isFinished: false,
      questionLoading: false,
      questions: [],
      isNotLoading: false,
      isNots: [],
      types: ['5W2H', 'IS/NOT'],
      isNotData: [
        {
          'name': 'What 什么',
          'description': '对象',
          'isContent': '什么零件发生了问题？',
          'notContent': '可能是什么别的零件发生了问题，但是没有发生？'
        },
        {
          'name': 'What 什么',
          'description': '缺陷',
          'isContent': '缺陷是什么？',
          'notContent': '可能是什么别的缺陷，但是没有发生？'
        },
        {
          'name': 'Where 哪里',
          'description': '位置/过程',
          'isContent': '是在零件什么位置发生了缺陷？',
          'notContent': '零件的什么位置没有发生缺陷？'
        },
        {
          'name': 'Where 哪里',
          'description': '何处',
          'isContent': '在过程中的什么位置发现了缺陷？',
          'notContent': '过程中其他什么位置并未发现缺陷？'
        },
        {
          'name': 'When 何时',
          'description': '何时',
          'isContent': '何时第一次发现问题？（如果可以的话可以详细到日期、班次和时间）',
          'notContent': '其他什么时候？'
        },
        {
          'name': 'When 何时',
          'description': '模式',
          'isContent': '当问题出现的时候，问题是否在某个时间段内持续出现？（如果可以的话可以详细到分钟、时、天）',
          'notContent': '其他什么时间？'
        },
        {
          'name': 'Extent 严重程度',
          'description': '数量/程度',
          'isContent': '有多少个零件有这样的缺陷？缺陷的趋势是什么？是在逐渐加重或减轻？每个零件上有多少缺陷？总体缺陷比例如何？',
          'notContent': '多少零件没有缺陷？什么其他趋势？大于或小于某个缺陷比例？'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'appendixUploadApi'
    ])
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getNumByIssueId(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getQuestionByIssueId(this.$props.issueId)
  },
  methods: {
    // 监控附件组件相关改动
    getMsgFormSon(msg) {
      this.isFinished = msg
      this.$emit('func', this.isFinished)
    },
    // 获取问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
        this.oldDesc = res.supplierDescription
      })
    },
    // 获取问题关联记录信息
    getNumByIssueId(id) {
      this.numLoading = true
      getIssueNumByIssueId(id).then(res => {
        this.numLoading = false
        this.issueNums = res.content
      })
    },
    // 获取时间进程
    getTimeManagementByIssueId(id) {
      this.selfLoading = true
      getByIssueId(id).then(res => {
        this.timeManagement = res
        if (res.d2Status) {
          this.isFinished = true
        }
        this.selfLoading = false
      })
    },
    getQuestionByIssueId(id) {
      this.questionLoading = true
      this.questions = []
      this.isNotLoading = true
      this.isNots = []
      getQuestionByIssueId(id, this.types[0]).then(res => {
        this.questions = res
        this.questionLoading = false
      })
      getQuestionByIssueId(id, this.types[1]).then(res => {
        this.isNots = res
        this.isNotLoading = false
      })
    },
    // 批量保存5W2H数据
    saveQuestions(data) {
      editQuestion(data).then(res => {
        this.$message({
          message: 'Save 5W2H Success! 保存5W2H内容成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
      }).catch(() => {
        this.$message({
          message: 'Save 5W2H Failed! 保存5W2H内容失败!',
          type: 'error'
        })
      })
    },
    // 批量保存IS/IS Not数据
    saveIsNots(data) {
      editQuestion(data).then(res => {
        this.$message({
          message: 'Save 5W2H Success! 保存IS/IS Not内容成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
      }).catch(() => {
        this.$message({
          message: 'Save 5W2H Failed! 保存IS/IS Not内容失败!',
          type: 'error'
        })
      })
    },
    // 编辑记录
    editNum(row) {
      this.issueNumForm = row
      this.numOperationTitle = '编辑数据'
      this.addNumVisible = true
    },
    toAddNum() {
      this.issueNumForm = {}
      this.numOperationTitle = '新增数据'
      this.addNumVisible = true
    },
    submitNum() {
      this.$refs.form.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.issueNumForm.issueId = this.$props.issueId
          if (this.issueNumForm.id === undefined) {
            addIssueNum(this.issueNumForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增记录成功!',
                type: 'success'
              })
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.getNumByIssueId(this.$props.issueId)
            })
          } else {
            editIssueNum(this.issueNumForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 变更记录成功!',
                type: 'success'
              })
              this.addNumVisible = false
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.getNumByIssueId(this.$props.issueId)
            })
          }
          this.addNumVisible = false
        }
      })
    },
    // 删除记录
    deleteNum(id) {
      // alert(JSON.stringify(id))
      const data = []
      data.push(id)
      delIssueNum(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除记录成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        this.getNumByIssueId(this.$props.issueId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除记录失败!',
          type: 'error'
        })
      })
    },
    // IS NOT表合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 保存详细描述
    addSupDesc(form) {
      let val = true
      if (this.oldDesc === form.supplierDescription) {
        this.$message({
          message: 'Cannot submit! 内容未发生变更，无需重复提交!',
          type: 'warning'
        })
        val = false
      }
      if (val) {
        edit(form).then(res => {
          // 编辑问题，添加供应商详细描述
          this.$message({
            message: 'Submit Success! 添加描述完成!',
            type: 'success'
          })
          this.isFinished = false
          this.$emit('func', this.isFinished)
        })
      }
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
    // 确认完成
    confirmFinished() {
      // 确认D2完成
      this.timeManagement.curStep = 'D2'
      this.timeManagement.d2Status = true
      this.timeManagement.d2Time = new Date()
      if (!this.timeManagement.d1Status) {
        this.$message({
          message: 'Cannot submit! 上一步尚未完成，无法执行此操作!',
          type: 'warning'
        })
      } else {
        // 上一步已完成方可执行
        editTimeManage(this.timeManagement).then(res => {
          this.confirmVisible = false
          this.isFinished = true
          this.$emit('func', this.isFinished)
          this.$message({
            message: 'Submit Success! D2提交完成!',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}

.elRow {
  border-bottom: 1px solid #808080;
}

.el-form-item--small.el-form-item {
  margin-bottom: 15px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

</style>
