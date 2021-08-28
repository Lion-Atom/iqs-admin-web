<template>
  <div>
    <!--问题基本信息-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">相关数据</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="toAddNum">增加新数据</el-button>
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
              />
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
          <el-table-column prop="caPartNum" label="产品料号" min-width="120"/>
          <el-table-column prop="componentDateCode" label="产品生产日期" min-width="120"/>
          <el-table-column prop="componentLotNum" label="产品批号" min-width="120"/>
          <el-table-column prop="defectQuantity" label="不良数量" width="120"/>
          <el-table-column label="客户影响">
            <template slot-scope="scope">
              <el-popover
                placement="top-start"
                title="客户影响"
                min-width="180"
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
            v-if="isNeed"
            label="操作"
            width="130px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑-->
                <el-button
                  slot="reference"
                  v-permission="permission.edit"
                  :disabled="scope.row.isLeader === true"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editNum(scope.row)"
                />
                <!--删除-->
                <el-popover
                  :ref="`delMem-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="top"
                  width="180"
                >
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="deleteNum(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.del"
                    type="danger"
                    icon="el-icon-delete"
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
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="addSupDesc(form)">保存
        </el-button>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline" label-width="120">
          <el-form-item
            prop="supplierDescription"
          >
            <el-input
              v-if="isNeed"
              v-model="form.supplierDescription"
              type="textarea"
              :rows="3"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="descChange"
            />
            <span v-if="!isNeed">{{ transNullFormat(form.supplierDescription) }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--5W2H描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">5W2H描述</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="saveQuestions(questions)">保存
        </el-button>
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
                v-if="isNeed"
                v-model="scope.row.description"
                type="textarea"
                autosize
                style="min-width: 800px;"
                :disabled="!isNeed"
                @input="descriptionChange(scope.$index,scope.row.description)"
              />
              <span v-if="!isNeed">{{ transNullFormat(scope.row.description) }}</span>
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
            <el-table-column width="120" property="name" label="问题描述"/>
            <el-table-column width="80" property="description" label="Item 细目"/>
            <el-table-column width="300" property="isContent" label="IS"/>
            <el-table-column width="300" property="notContent" label="IS-NOT"/>
          </el-table>
          <el-button v-if="isNeed" slot="reference" type="text" size="small">参考</el-button>
        </el-popover>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="saveIsNots(isNots)">保存
        </el-button>
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
          <el-table-column width="120" property="description" label="Item 细目"/>
          <el-table-column label="IS 是">
            <template scope="scope">
              <el-input
                v-if="isNeed"
                v-model="scope.row.isContent"
                type="textarea"
                autosize
                style="min-width: 300px;"
                :disabled="!isNeed"
                @input="isContentChange(scope.$index,scope.row.isContent)"
              />
              <span v-if="!isNeed">{{ transNullFormat(scope.row.isContent) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="IS-NOT 否">
            <template scope="scope">
              <el-input
                v-if="isNeed"
                v-model="scope.row.notContent"
                type="textarea"
                autosize
                style="min-width: 300px;"
                :disabled="!isNeed"
                @input="notContentChange(scope.$index,scope.row.notContent)"
              />
              <span v-if="!isNeed">{{ transNullFormat(scope.row.notContent) }}</span>
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
              v-model="confirmVisible"
              placement="top"
              width="300"
            >
              <p>您确定所有信息都已填写完毕，此步骤已完成吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmFinished">确定</el-button>
              </div>
              <el-button
                slot="reference"
                v-permission="permission.edit"
                :loading="selfLoading"
                type="success"
                :disabled="isFinished && noChanged"
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
import UploadFile from '@/components/UploadFile'
import { judgeIsEqual } from '@/utils/validationUtil'

export default {
  name: 'SecondForm',
  components: { UploadFile },
  props: ['issueId', 'needConfirm'],
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
      ],
      noChanged: true,
      descChanged: false,
      oldWh1: null,
      oldWh2: null,
      oldWh3: null,
      oldWh4: null,
      oldWh5: null,
      oldWh6: null,
      oldWh7: null,
      wh1Changed: false,
      wh2Changed: false,
      wh3Changed: false,
      wh4Changed: false,
      wh5Changed: false,
      wh6Changed: false,
      wh7Changed: false,
      whChanged: false,

      oldIs1: null,
      oldIs2: null,
      oldIs3: null,
      oldIs4: null,
      oldIs5: null,
      oldIs6: null,
      oldIs7: null,
      is1Changed: false,
      is2Changed: false,
      is3Changed: false,
      is4Changed: false,
      is5Changed: false,
      is6Changed: false,
      is7Changed: false,
      isChanged: false,

      oldNot1: null,
      oldNot2: null,
      oldNot3: null,
      oldNot4: null,
      oldNot5: null,
      oldNot6: null,
      oldNot7: null,
      not1Changed: false,
      not2Changed: false,
      not3Changed: false,
      not4Changed: false,
      not5Changed: false,
      not6Changed: false,
      not7Changed: false,
      notChanged: false
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
    this.getWhByIssueId(this.$props.issueId, this.types[0])
    this.getIsByIssueId(this.$props.issueId, this.types[1])
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
    getWhByIssueId(id, type) {
      this.questionLoading = true
      this.questions = []
      getQuestionByIssueId(id, type).then(res => {
        this.questions = res
        // 赋值监控
        if (res.length > 0) {
          this.oldWh1 = res[0].description
          this.oldWh2 = res[1].description
          this.oldWh3 = res[2].description
          this.oldWh4 = res[3].description
          this.oldWh5 = res[4].description
          this.oldWh6 = res[5].description
          this.oldWh7 = res[6].description
        }
        this.questionLoading = false
      })
    },
    getIsByIssueId(id, type) {
      this.isNotLoading = true
      this.isNots = []
      getQuestionByIssueId(id, type).then(res => {
        this.isNots = res
        if (res.length > 0) {

          this.oldIs1 = res[0].isContent
          this.oldIs2 = res[1].isContent
          this.oldIs3 = res[2].isContent
          this.oldIs4 = res[3].isContent
          this.oldIs5 = res[4].isContent
          this.oldIs6 = res[5].isContent
          this.oldIs7 = res[6].isContent

          this.oldNot1 = res[0].notContent
          this.oldNot2 = res[1].notContent
          this.oldNot3 = res[2].notContent
          this.oldNot4 = res[3].notContent
          this.oldNot5 = res[4].notContent
          this.oldNot6 = res[5].notContent
          this.oldNot7 = res[6].notContent

        }
        this.isNotLoading = false
      })
    },
    // 批量保存5W2H数据
    saveQuestions(data) {
      if (data.length > 0) {
        let val = true
        if (judgeIsEqual(data[0].description, this.oldWh1) &&
          judgeIsEqual(data[1].description, this.oldWh2) &&
          judgeIsEqual(data[2].description, this.oldWh3) &&
          judgeIsEqual(data[3].description, this.oldWh4) &&
          judgeIsEqual(data[4].description, this.oldWh5) &&
          judgeIsEqual(data[5].description, this.oldWh6) &&
          judgeIsEqual(data[6].description, this.oldWh7)
        ) {
          this.$message({
            message: 'No changes found, no need to save!未发生改动，无需提交',
            type: 'warning'
          })
          val = false
        }
        if (val) {
          editQuestion(data).then(res => {
            this.$message({
              message: 'Save 5W2H Success! 保存5W2H内容成功!',
              type: 'success'
            })
            this.whRest()
            this.judgeChange()

            this.isFinished = false
            this.$emit('func', this.isFinished)
            this.getWhByIssueId(this.$props.issueId, this.types[0])
          }).catch(() => {
            this.$message({
              message: 'Save 5W2H Failed! 保存5W2H内容失败!',
              type: 'error'
            })
            this.getWhByIssueId(this.$props.issueId, this.types[0])
          })
        }
      } else {
        this.$message({
          message: '查无数据!',
          type: 'error'
        })
      }
    },
    // 批量保存IS/IS Not数据
    saveIsNots(data) {
      let val = true
      if (judgeIsEqual(data[0].isContent, this.oldIs1) &&
        judgeIsEqual(data[1].isContent, this.oldIs2) &&
        judgeIsEqual(data[2].isContent, this.oldIs3) &&
        judgeIsEqual(data[3].isContent, this.oldIs4) &&
        judgeIsEqual(data[4].isContent, this.oldIs5) &&
        judgeIsEqual(data[5].isContent, this.oldIs6) &&
        judgeIsEqual(data[6].isContent, this.oldIs7) &&

        judgeIsEqual(data[0].notContent, this.oldNot1) &&
        judgeIsEqual(data[1].notContent, this.oldNot2) &&
        judgeIsEqual(data[2].notContent, this.oldNot3) &&
        judgeIsEqual(data[3].notContent, this.oldNot4) &&
        judgeIsEqual(data[4].notContent, this.oldNot5) &&
        judgeIsEqual(data[5].notContent, this.oldNot6) &&
        judgeIsEqual(data[6].notContent, this.oldNot7)
      ) {
        this.$message({
          message: 'No changes found, no need to save!未发生改动，无需重复提交',
          type: 'warning'
        })
        val = false
      }
      if(val){
        editQuestion(data).then(res => {
          this.$message({
            message: 'Save 5W2H Success! 保存IS/IS Not内容成功!',
            type: 'success'
          })
          this.isNotReset()
          this.judgeChange()

          this.isFinished = false
          this.$emit('func', this.isFinished)
          this.getIsByIssueId(this.$props.issueId, this.types[1])
        }).catch(() => {
          this.$message({
            message: 'Save 5W2H Failed! 保存IS/IS Not内容失败!',
            type: 'error'
          })
          this.getIsByIssueId(this.$props.issueId, this.types[1])
        })
      }
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
    // IS/IS Not的回正操作
    isNotReset() {
      this.is1Changed = false
      this.is2Changed = false
      this.is3Changed = false
      this.is4Changed = false
      this.is5Changed = false
      this.is6Changed = false
      this.is7Changed = false

      this.not1Changed = false
      this.not2Changed = false
      this.not3Changed = false
      this.not4Changed = false
      this.not5Changed = false
      this.not6Changed = false
      this.not7Changed = false
    },
    // 5W2H的回正操作
    whRest() {
      this.wh1Changed = false
      this.wh2Changed = false
      this.wh3Changed = false
      this.wh4Changed = false
      this.wh5Changed = false
      this.wh6Changed = false
      this.wh7Changed = false
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
          this.oldDesc = form.supplierDescription
          this.descChanged = false
          this.judgeChange()
          this.isFinished = false
          this.$emit('func', this.isFinished)
        }).catch(res => {
          this.form.supplierDescription = this.oldDesc
        })
      }
    },
    transNullFormat(val) {
      if (val === '' || val === undefined || val === null) {
        return '--'
      } else {
        return val
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
    // 监控D2-描述有无变化
    descChange(val) {
      this.descChanged = !judgeIsEqual(val, this.oldDesc)
      this.judgeChange()
    },
    // 监控5W2H和IS/NOT有无变化
    descriptionChange(index, val) {
      if (index === 0) {
        // alert('命中第' + index + '行')
        // alert('新值：' + val)
        this.wh1Changed = !judgeIsEqual(val.trim(), this.oldWh1)
        // alert(this.wh1Changed)
      }
      if (index === 1) {
        this.wh2Changed = !judgeIsEqual(val.trim(), this.oldWh2)
      }
      if (index === 2) {
        this.wh3Changed = !judgeIsEqual(val.trim(), this.oldWh3)
      }
      if (index === 3) {
        this.wh4Changed = !judgeIsEqual(val.trim(), this.oldWh4)
      }
      if (index === 4) {
        this.wh5Changed = !judgeIsEqual(val.trim(), this.oldWh5)
      }
      if (index === 5) {
        this.wh6Changed = !judgeIsEqual(val.trim(), this.oldWh6)
      }
      if (index === 6) {
        this.wh7Changed = !judgeIsEqual(val.trim(), this.oldWh7)
      }
      this.judgeChange()
    },
    isContentChange(index, val) {
      if (index === 0) {
        this.is1Changed = !judgeIsEqual(val.trim(), this.oldIs1)
      }
      if (index === 1) {
        this.is2Changed = !judgeIsEqual(val.trim(), this.oldIs2)
      }
      if (index === 2) {
        this.is3Changed = !judgeIsEqual(val.trim(), this.oldIs3)
      }
      if (index === 3) {
        this.is4Changed = !judgeIsEqual(val.trim(), this.oldIs4)
      }
      if (index === 4) {
        this.is5Changed = !judgeIsEqual(val.trim(), this.oldIs5)
      }
      if (index === 5) {
        this.is6Changed = !judgeIsEqual(val.trim(), this.oldIs6)
      }
      if (index === 6) {
        this.is7Changed = !judgeIsEqual(val.trim(), this.oldIs7)
      }
      this.judgeChange()
    },
    notContentChange(index, val) {
      if (index === 0) {
        this.not1Changed = !judgeIsEqual(val.trim(), this.oldNot1)
      }
      if (index === 1) {
        this.not2Changed = !judgeIsEqual(val.trim(), this.oldNot2)
      }
      if (index === 2) {
        this.not3Changed = !judgeIsEqual(val.trim(), this.oldNot3)
      }
      if (index === 3) {
        this.not4Changed = !judgeIsEqual(val.trim(), this.oldNot4)
      }
      if (index === 4) {
        this.not5Changed = !judgeIsEqual(val.trim(), this.oldNot5)
      }
      if (index === 5) {
        this.not6Changed = !judgeIsEqual(val.trim(), this.oldNot6)
      }
      if (index === 6) {
        this.not7Changed = !judgeIsEqual(val.trim(), this.oldNot7)
      }
      this.judgeChange()
    },
    // 判断界面输入有无变化
    judgeChange() {
      this.whChanged = (this.wh1Changed || this.wh2Changed || this.wh3Changed || this.wh4Changed || this.wh5Changed
        || this.wh6Changed || this.wh7Changed)

      this.isChanged = (this.is1Changed || this.is2Changed || this.is3Changed || this.is4Changed || this.is5Changed
        || this.is6Changed || this.is7Changed)

      this.notChanged = (this.not1Changed || this.not2Changed || this.not3Changed || this.not4Changed || this.not5Changed
        || this.not6Changed || this.not7Changed)

      this.noChanged = !(this.descChanged || this.whChanged || this.isChanged || this.notChanged)
    },
    // 确认完成
    confirmFinished() {
      if (!this.noChanged) {
        let msg = '检测到'
        if (this.descChanged) {
          msg += '【详细问题描述】'
        }
        if (this.whChanged) {
          msg += '【5W2H描述】'
        }
        if (this.isChanged || this.notChanged) {
          msg += '【IS/IS Not描述】'
        }
        msg += '发生了变化，是否一并保存?'
        this.$confirm(msg, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            if (this.descChanged) {
              edit(this.form).then(res => {
                // 编辑问题，添加供应商详细描述
                this.$message({
                  message: 'Submit Success! 添加描述完成!',
                  type: 'success'
                })
                this.oldDesc = this.form.supplierDescription
              }).catch(res => {
                this.form.supplierDescription = this.oldDesc
              })
            }
            if (this.whChanged) {
              this.saveQuestions(this.questions)
            }
            if (this.isChanged || this.notChanged) {
              this.saveIsNots(this.isNots)
            }
            setTimeout(() => {
              this.finishStep()
            }, 600)

          }).catch(() => {
          // 查询详细描述数据
          this.getIssueInfoById(this.$props.issueId)
          // 查询5W2H数据
          this.getWhByIssueId(this.$props.issueId, this.types[0])
          this.getIsByIssueId(this.$props.issueId, this.types[1])
          // 查询IS/IS Not描述
          this.finishStep()
        })

      } else {
        this.finishStep()
      }
    },
    finishStep() {
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
          this.descChanged = false
          this.whRest()
          this.isNotReset()
          this.judgeChange()
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
