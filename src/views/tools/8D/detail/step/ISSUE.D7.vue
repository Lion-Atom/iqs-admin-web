<template>
  <div>
    <!--文档描述-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">文档描述</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="saveChangeDescs(changeDescs)">
          保存
        </el-button>
      </div>
      <div>
        <el-table
          ref="table"
          :data="changeDescs"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="文档" width="200"/>
          <el-table-column label="更改内容">
            <template scope="scope">
              <el-input
                v-if="isNeed"
                v-model="scope.row.description"
                type="textarea"
                :rows="3"
                style="max-width: 800px;"
                :disabled="!isNeed"
                @input="inputChange(scope.$index,scope.row.description)"
              />
              <span v-if="!isNeed">{{ transNullFormat(scope.row.description) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--临时措施状态变更-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">临时措施状态变更</span>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="tempActLoading"
          :data="tempActions"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="临时措施"/>
          <el-table-column prop="responsibleName" label="责任人"/>
          <el-table-column prop="efficiency" label="有效性(%)"/>
          <el-table-column prop="status" label="状态"/>
          <!--   编辑与删除   -->
          <el-table-column
            v-if="isNeed"
            label="操作"
            width="160px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <el-popover
                  :ref="`editRole-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="left"
                  width="300"
                  title="临时措施状态"
                >
                  <el-form
                    ref="form"
                    :model="tempAction"
                    size="small"
                    label-width="80px"
                  >
                    <el-form-item
                      label="选择状态"
                      prop="status"
                    >
                      <el-select
                        v-model="tempAction.status"
                        placeholder="请选择角色"
                      >
                        <el-option
                          v-for="item in statusTypeOptions"
                          :key="item.key"
                          :label="item.display_name"
                          :value="item.key"
                        />
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope._self.$refs[`editRole-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editStatus(scope.$index,scope.row), scope._self.$refs[`editRole-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.edit"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="openEditStatus(scope.row)"
                  >编辑状态
                  </el-button>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--问题分析和添加永久措施-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">问题分析和添加永久措施</span>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="analysisLoading"
          :data="analysisData"
          style="width: 100%;"
        >
          <el-table-column prop="systemWide" label="过程分析" width="320"/>
          <el-table-column prop="result" label="分析结果"/>
          <el-table-column label="长久措施">
            <template slot-scope="scope">
              <div class="tag-group">
                <el-tag
                  v-for="item in scope.row.actionNames"
                  :key="item"
                  :type="item"
                  size="small"
                  style="margin-right: 1px;"
                  effect="plain"
                >
                  {{ item }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <!--   编辑与删除   -->
          <el-table-column
            v-if="isNeed"
            label="操作"
            width="160px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑分析结果-->
                <el-popover
                  :ref="`editResult-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="left"
                  width="600"
                  title="编辑分析结果"
                >
                  <el-form
                    ref="form"
                    :model="analysis"
                    size="small"
                    label-width="80px"
                  >
                    <el-form-item
                      label="分析结果"
                      prop="result"
                    >
                      <el-input
                        v-model="analysis.result"
                        type="textarea"
                        autosize
                        style="min-width: 400px;"
                      />
                    </el-form-item>
                  </el-form>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="scope._self.$refs[`editResult-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editResult(scope.$index,scope.row), scope._self.$refs[`editResult-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-permission="permission.edit"
                    size="mini"
                    type="primary"
                    style="margin-bottom: 2px;"
                    icon="el-icon-edit"
                    @click="openEditResult(scope.row)"
                  >编辑分析结果
                  </el-button>
                </el-popover>
                <!--添加长久措施-->
                <el-button
                  slot="reference"
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="openAddPreAct(scope.row)"
                >添加永久措施
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--维护永久措施-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">永久措施的维护</span>
      </div>
      <div>
        <el-dialog
          :title="actOperationTitle"
          :visible.sync="addPreActionVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="preActionForm"
            :model="preActionForm"
            :rules="preActionRules"
            size="small"
            label-width="120px"
          >
            <el-form-item
              v-if="isAddPreAct"
              label="系统标题"
              prop="systemWide"
            >
              <span>{{ analysis.systemWide }}</span>
            </el-form-item>
            <el-form-item
              label="措施标题"
              prop="name"
            >
              <el-input
                v-model="preActionForm.name"
                style="width: 370px;"
              />
            </el-form-item>
            <!--状态选择-->
            <el-form-item
              label="状态"
              prop="status"
            >
              <el-select
                v-model="preActionForm.status"
                placeholder="请选择状态"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in preStatusTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <!--- 负责人列表查询 -->
            <el-form-item
              label="负责人"
              prop="responsibleId"
            >
              <el-select
                v-model="preActionForm.responsibleId"
                placeholder="请选择人员"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in members"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="预期时间"
              prop="plannedTime"
            >
              <el-date-picker
                v-model="preActionForm.plannedTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
            <el-form-item
              label="完成时间"
              prop="completeTime"
            >
              <el-date-picker
                v-model="preActionForm.completeTime"
                type="datetime"
                style="width: 370px;"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
            <el-form-item
              label="其他"
              prop="comment"
            >
              <el-input
                v-model="preActionForm.comment"
                type="textarea"
                autosize
                style="width: 370px;"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="doCancelPreAct">取 消</el-button>
            <el-button type="primary" :loading="submitLoading" @click="submitPreAct">确 定</el-button>
          </span>
        </el-dialog>
        <el-table
          ref="table"
          v-loading="preActLoading"
          :data="preActions"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="永久措施"/>
          <el-table-column prop="responsibleName" label="负责人"/>
          <el-table-column prop="plannedTime" label="预期时间"/>
          <el-table-column prop="completeTime" label="完成时间"/>
          <el-table-column prop="status" label="状态"/>
          <!--   编辑与删除   -->
          <el-table-column
            v-if="isNeed"
            label="操作"
            width="160px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <!--编辑-->
                <el-button
                  slot="reference"
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editPreAction(scope.row)"
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
                      @click="delPreAction(scope.row), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
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
        <span class="header-title">详细描述</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="addSeventhDesc(form)">保存
        </el-button>
      </div>
      <div>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item
            prop="supplierDescription"
          >
            <el-input
              v-if="isNeed"
              v-model="form.commentD7"
              type="textarea"
              :rows="3"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="commentChange"
            />
            <span v-if="!isNeed">{{ transNullFormat(form.commentD7) }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--添加附件及其列表 已注释，改用文控文件-->
<!--    <UploadFile
      :is-need="isNeed"
      :issue-id="this.$props.issueId"
      :permission="permission"
      :step-name="curStep"
      @func="getMsgFormSon"
    />-->

    <!--添加附件V2-->
    <el-card v-if="isNeed" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">添加附件</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="savePerFiles">保存
        </el-button>
      </div>
      <div class="edit_dev">
        <el-transfer
          width="450px"
          filterable
          v-model="chooseFiles"
          :data="perFiles"
          :titles="['文件源库', '当前附件']"
          @change="perFilesChange"
        >
        </el-transfer>
      </div>
    </el-card>

    <!--附件列表V2-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">附件列表</span>
      </div>
      <div class="edit_dev">
        <el-table
          ref="table"
          v-loading="perFileLoading"
          :data="perFileList"
          style="width: 100%;"
        >
          <el-table-column prop="name" label="附件名称" min-width="200">
            <template slot-scope="scope">
              <el-popover
                :content="'file/' + scope.row.type + '/' + scope.row.name"
                placement="top-start"
                title="路径"
                width="200"
                trigger="hover"
              >
                <!--可下载文件-->
                <a
                  slot="reference"
                  :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.name"
                  class="el-link--primary"
                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                  target="_blank"
                  :download="scope.row.realName"
                >
                  {{ scope.row.name }}
                </a>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" min-width="120" />
          <el-table-column prop="type" label="附件类型" min-width="120" />
          <el-table-column prop="createBy" label="创建者" />
          <el-table-column
            fixed="right"
            label="操作"
            width="100"
            v-if="isNeed"
          >
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--确认完成-->
    <el-card v-if="isNeed" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">确认完成</span>
      </div>
      <div>
        <el-row v-if="form.hasTempFile" style="margin-bottom: 10px;">
          <el-col :span="6">
            <span>临时文件是否全部回收?</span>
          </el-col>
          <el-col :span="6">
            <el-radio-group v-model="form.recoverTempFile" @change="recoverTempFileChange">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row v-if="form.recoverTempFile === false" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-input
              v-model="form.tempFileComment"
              placeholder="请输入拒绝回收的理由"
              clearable
              @input="inputCommentEv"
            />
          </el-col>
        </el-row>
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

import { editTimeManage, getByIssueId } from '@/api/tools/timeManagement'
import { edit, getIssueById } from '@/api/tools/issue'
import { editChangeDesc, getChangeDescByIssueId } from '@/api/tools/changeDesc'
import { addIssueAction, delIssueAction, editIssueAction, getIssueActionByExample } from '@/api/tools/issueAction'
import { editAnalysis, getAnalysisByIssueId } from '@/api/tools/issueAnalysis'
import { getMembersByIssueId } from '@/api/tools/teamMember'
import { judgeIsEqual, validIsNotNull } from '@/utils/validationUtil'
import UploadFile from '@/components/UploadFile'
import { getFileByExample } from '@/api/tools/localStorage'
import { getBindFileByExample, syncTempFile } from '@/api/tools/issueFile'
import { mapGetters } from 'vuex'

export default {
  name: 'SeventhForm',
  components: { UploadFile },
  props: ['issueId', 'needConfirm'],
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      changeDescs: [],
      isNeed: false,
      confirmVisible: false,
      curStep: 'D7',
      form: {},
      oldRecoverTempFile: null,
      hasTempChanged: false,
      oldTempFileComment: null,
      timeManagement: {},
      selfLoading: false,
      isFinished: false,
      queryCond: {
        issueId: null,
        type: 'D3'
      },
      queryPreCond: {
        issueId: null,
        type: 'D7'
      },
      tempActLoading: false,
      tempActions: [],
      tempAction: {
        status: null
      },
      statusTypeOptions: [
        { key: '开始', display_name: '开始' },
        { key: '进行中', display_name: '进行中' },
        { key: '完成', display_name: '完成' },
        { key: '停用', display_name: '停用' }
      ],
      preStatusTypeOptions: [
        { key: '开始', display_name: '已创建' },
        { key: '进行中', display_name: '进行中' },
        { key: '关闭', display_name: '关闭' }
      ],
      analysisLoading: false,
      analysisData: [],
      analysis: {
        id: null,
        systemNum: null,
        systemWide: null,
        result: null
      },
      preActLoading: false,
      preActions: [],
      actOperationTitle: null,
      addPreActionVisible: false,
      members: [],
      preActionForm: {
        id: null,
        systemNum: null,
        analysisId: null,
        name: null,
        status: null,
        isCon: false,
        responsibleId: null,
        plannedTime: null,
        completeTime: null,
        comment: null
      },
      isAddPreAct: false,
      submitLoading: false,
      oldFirstDesc: null,
      oldSecDesc: null,
      preActionRules: {
        name: [
          { required: true, message: '围堵措施标题不可为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '默认可选“开始”', trigger: 'blur' }
        ],
        responsibleId: [
          { required: true, message: '请务必选择此项负责人', trigger: 'blur' }
        ],
        plannedTime: [
          { required: true, message: '请选择计划执行时间', trigger: 'blur' }
        ],
        completeTime: [
          { required: true, message: '请填写完成时间', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '若无其他补充，可填入”暂无“', trigger: 'blur' }
        ]
      },
      saveSuccess: true,
      oldComment: null,
      commentChanged: false,
      tempCommentChanged: false,
      docDesc1Changed: false,
      docDesc2Changed: false,
      docDescChanged: false,
      noChanged: true,
      queryFileCond: {
        fileStatus: 'release',
        approvalStatus: 'approved'
      },
      queryFileByStep: {
        issueId: this.$props.issueId,
        stepName: 'D7'
      },
      perFiles: [],
      oldPerFiles: [],
      chooseFiles: [], // 绑定的文件集
      perFileChanged: false,
      perFileList: [],
      perFileLoading: false
    }
  },
  watch: {},
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'appendixUploadApi'
    ])
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getChangeDescByIssueId(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getTeamMembersByIssueId(this.$props.issueId)
    this.getTempActionByExample(this.$props.issueId)
    this.getAnalysisByIssueId(this.$props.issueId)
    this.getPreActionByExample(this.$props.issueId)
    this.getPerFileByExample()
    this.getBindFileByExample(this.queryFileByStep)
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
        this.oldComment = res.commentD7
        this.oldRecoverTempFile = res.recoverTempFile
        this.oldTempFileComment = res.tempFileComment
      })
    },
    // 获取人员信息
    getTeamMembersByIssueId(id) {
      getMembersByIssueId(id).then(res => {
        this.members = res.content
      })
    },
    // 保存D7文档信息
    getChangeDescByIssueId(id) {
      this.changeDescs = []
      getChangeDescByIssueId(id).then(res => {
        this.changeDescs = res
        // 防止内存地址指向同一处，因此不用oldArr赋值
        this.oldFirstDesc = res[0].description
        this.oldSecDesc = res[1].description
      })
    },
    // 获取临时措施信息
    getTempActionByExample(id) {
      this.tempActLoading = true
      this.queryCond.issueId = id
      this.tempActions = []
      getIssueActionByExample(this.queryCond).then(res => {
        this.tempActLoading = false
        this.tempActions = res
      })
    },
    // 获取永久措施信息
    getPreActionByExample(id) {
      this.preActLoading = true
      this.queryPreCond.issueId = id
      this.preActions = []
      getIssueActionByExample(this.queryPreCond).then(res => {
        this.preActLoading = false
        this.preActions = res
      })
    },
    // 获取已发布、已审批的文件
    getPerFileByExample() {
      getFileByExample(this.queryFileCond).then(res => {
        let data = []
        res.forEach((file, index) => {
          data.push({
            label: file.name,
            //这里的key值一定要是index，否则目标列表无法显示
            key: file.id
          })
        })
        this.perFiles = data
      })
    },
    // 查询当前D7步骤下的附件
    getBindFileByExample(cond) {
      this.perFileLoading = true
      this.perFileList = []
      getBindFileByExample(cond).then(res => {
        this.perFileLoading = false
        this.perFileList = res
        let oldTemps = []
        let chooseFiles = []
        if (this.perFileList.length > 0) {
          this.perFileList.forEach((file, index)=> {
            oldTemps.push(file.storageId)
            chooseFiles.push(file.storageId)
          })
        }
        this.oldPerFiles = oldTemps
        this.chooseFiles = chooseFiles
      }).catch(res=>{
        this.perFileLoading = false
      })
    },
    inputChange(index, val) {
      if (index === 0) {
        this.docDesc1Changed = !judgeIsEqual(val, this.oldFirstDesc)
      }
      if (index === 1) {
        this.docDesc2Changed = !judgeIsEqual(val, this.oldSecDesc)
      }
      this.judgeChange()
    },
    // 批量保存文档数据
    saveChangeDescs(data) {
      let val = true
      //  保存文档描述的监控：有无变化
      if (
        (data[0].description === this.oldFirstDesc || (!validIsNotNull(data[0].description) && !validIsNotNull(this.oldFirstDesc))) &&
        (data[1].description === this.oldSecDesc || (!validIsNotNull(data[1].description) && !validIsNotNull(this.oldSecDesc)))
      ) {
        this.$message({
          message: 'Cannot submit! 内容未发生变更，无需重复提交!',
          type: 'warning'
        })
        val = false
      }
      if (val) {
        editChangeDesc(data).then(res => {
          this.$message({
            message: 'Save Documentation Success! 保存文档更改内容成功!',
            type: 'success'
          })
          /*this.oldFirstDesc = data[0].description
          this.oldSecDesc = data[1].description*/
          this.docDesc1Changed = false
          this.docDesc2Changed = false
          this.saveSuccess = true
          this.judgeChange()
          this.isFinished = false
          this.$emit('func', this.isFinished)
          this.getChangeDescByIssueId(this.$props.issueId)
        }).catch(() => {
          this.$message({
            message: 'Save Documentation Failed! 保存文档更改内容失败!',
            type: 'error'
          })
          this.saveSuccess = false
          this.getChangeDescByIssueId(this.$props.issueId)
        })
      }
    },
    // 获取时间进程
    getTimeManagementByIssueId(id) {
      this.selfLoading = true
      getByIssueId(id).then(res => {
        this.timeManagement = res
        if (res.d7Status) {
          this.isFinished = true
        }
        this.selfLoading = false
      })
    },
    getAnalysisByIssueId(id) {
      this.analysisLoading = true
      getAnalysisByIssueId(id).then(res => {
        this.analysisData = res
        this.analysisLoading = false
      })
    },
    // 穿梭框，d7附件变化
    perFilesChange(value, direction, movedKeys) {
      this.perFileChanged = false
      if (this.oldPerFiles.length !== this.chooseFiles.length) {
        this.perFileChanged = true
      } else if (this.oldPerFiles.length === 0 && this.chooseFiles.length === 0) {
        this.perFileChanged = false
      } else if (this.oldPerFiles.sort().toString() !== this.chooseFiles.sort().toString()) {
        this.perFileChanged = true
      }
      this.judgeChange()
    },
    // 保存附件
    savePerFiles() {
      if (this.perFileChanged) {
        let data = []
        const _this = this
        this.chooseFiles.forEach((id, index) => {
          const fl = { issueId: _this.$props.issueId, storageId: id, stepName: _this.curStep }
          data.push(fl)
        })
        // 保存新的临时文件
        syncTempFile(data).then(res => {
          this.$message({
            message: 'Temp Files Save Success.临时文件保存成功!',
            type: 'success'
          })
          this.perFileChanged = false
          this.isFinished = false
          this.judgeChange()
          this.$emit('func', this.isFinished)
          this.getBindFileByExample(this.queryFileByStep)
        })
      } else {
        this.$message({
          message: 'Temp Files No Changed.没有改动，无需重复保存!',
          type: 'warning'
        })
        return false
      }
    },
    addSeventhDesc(form) {
      let val = true
      if (this.oldComment === form.commentD7) {
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
            message: 'Submit D7-Desc Success! 添加D7详细描述完成!',
            type: 'success'
          })
          this.oldComment = form.commentD7
          this.isFinished = false
          this.commentChanged = false
          this.judgeChange()
          this.$emit('func', this.isFinished)
        }).catch(res => {
          this.form.commentD7 = this.oldComment
        })
      }
    },
    // 编辑临时措施状态之前
    openEditStatus(row) {
      this.tempAction.status = row.status
    },
    // 提交编辑临时措施状态
    editStatus(index, row) {
      if (this.tempAction.status === row.status) {
        this.$message({
          message: 'No changes found, no need to save!未发生改动，无需提交',
          type: 'warning'
        })
        return false
      } else {
        row.status = this.tempAction.status
        row.stepName = 'D7'
        editIssueAction(row).then(res => {
          this.$message({
            message: 'Edit Action Status Success! 变更状态成功!',
            type: 'success'
          })
          this.getTempActionByExample(this.$props.issueId)
          this.isFinished = false
          this.$emit('func', this.isFinished)
        })
      }
    },
    // 编辑分析结果之前
    openEditResult(row) {
      this.analysis.result = row.result
    },
    // 提交编辑分析结果
    editResult(index, row) {
      if (!validIsNotNull(this.analysis.result) && !validIsNotNull(row.result)) {
        this.$message({
          message: 'No data to save!请填写分析结果',
          type: 'warning'
        })
      } else if (this.analysis.result === row.result) {
        this.$message({
          message: 'No changes found, no need to save!未发生改动，无需提交',
          type: 'warning'
        })
      } else {
        row.result = this.analysis.result
        editAnalysis(row).then(res => {
          this.$message({
            message: !validIsNotNull(this.analysis.result) ? 'Clear Analysis Result Success! 清空分析结果成功!' : 'Edit Analysis Result Success! 变更分析结果成功!',
            type: 'success'
          })
          this.getAnalysisByIssueId(this.$props.issueId)
          this.isFinished = false
          this.$emit('func', this.isFinished)
        })
      }
    },
    // 新增永久措施
    openAddPreAct(row) {
      // 永久措施的新增弹窗
      this.analysis.systemWide = row.systemWide
      this.preActionForm = {}
      this.preActionForm.analysisId = row.id
      this.preActionForm.systemNum = row.systemNum
      // 添加 分析+ 措施字段
      this.actOperationTitle = '新增永久措施'
      this.isAddPreAct = true
      this.addPreActionVisible = true
    },
    editPreAction(row) {
      this.preActionForm = row
      this.actOperationTitle = '编辑永久措施'
      this.isAddPreAct = false
      this.addPreActionVisible = true
    },
    // 取消操作
    doCancelPreAct() {
      this.addPreActionVisible = false
      // 刷新永久措施列表
      this.getPreActionByExample(this.$props.issueId)
    },
    // 提交永久措施
    submitPreAct() {
      this.$refs.preActionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.preActionForm.issueId = this.$props.issueId
          this.preActionForm.type = this.curStep
          this.preActionForm.isCon = false
          if (this.preActionForm.id === undefined) {
            this.submitLoading = true
            addIssueAction(this.preActionForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增其他围堵措施记录成功!',
                type: 'success'
              })
              this.isFinished = false
              this.$emit('func', this.isFinished)
              // 刷新分析列表
              this.getAnalysisByIssueId(this.$props.issueId)
              // 刷新永久措施列表
              this.getPreActionByExample(this.$props.issueId)
            })
          } else {
            this.submitLoading = true
            editIssueAction(this.preActionForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 编辑其他围堵措施记录成功!',
                type: 'success'
              })
              /* this.submitLoading = false
              this.addPreActionVisible = false*/
              this.isFinished = false
              this.$emit('func', this.isFinished)
              // 刷新分析列表
              this.getAnalysisByIssueId(this.$props.issueId)
              // 刷新永久措施列表
              this.getPreActionByExample(this.$props.issueId)
            })
          }
          this.submitLoading = false
          this.addPreActionVisible = false
        }
      })
    },
    // 删除永久措施
    delPreAction(data) {
      delIssueAction(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除永久措施成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
        // 刷新分析列表
        this.getAnalysisByIssueId(this.$props.issueId)
        // 刷新永久措施列表
        this.getPreActionByExample(this.$props.issueId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除永久措施失败!',
          type: 'error'
        })
      })
    },
    // 跳转绑定的文件明细
    handleClick(row) {
      this.$router.push(
        {
          path: '/fileManagement/filedetail',
          query: {
            fileId: row.storageId,
            name: row.name,
            realName: row.realName
          }
        })
    },
    // 统一格式化“空”
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
    // 切换变动
    recoverTempFileChange(val) {
      this.hasTempChanged = this.oldRecoverTempFile !== val
      this.judgeChange()
    },
    // 是否收回输入框变化
    inputCommentEv(val) {
      this.tempCommentChanged = !judgeIsEqual(val.trim(), this.oldTempFileComment)
      this.judgeChange()
    },
    // D7-详细描述
    commentChange(val) {
      this.commentChanged = !judgeIsEqual(val.trim(), this.oldComment)
      // alert(this.commentChanged)
      this.judgeChange()
    },
    judgeChange() {
      this.docDescChanged = this.docDesc1Changed || this.docDesc2Changed
      this.noChanged = !(this.commentChanged || this.tempCommentChanged ||
        this.hasTempChanged || this.docDescChanged || this.perFileChanged)
    },
    confirmFinished() {
      if (!this.noChanged) {
        let msg = '检测到'
        if (this.commentChanged) {
          msg += '【D7-详细描述】'
        }
        if (this.hasTempChanged) {
          msg += '【是否回收临时文件选择项】'
        }
        if (this.tempCommentChanged) {
          msg += '【不回收临时文件原因】'
        }
        if (this.docDescChanged) {
          msg += '【文档描述】'
        }
        if (this.perFileChanged) {
          msg += '【添加附件】'
        }
        msg += '发生了变化，是否一并保存?'
        this.$confirm(msg, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        }).then(() => {
          let editSuccess = true
          // D7描述和是否回收临时文件
          edit(this.form).then(res => {
            this.oldComment = this.form.commentD7
            this.oldRecoverTempFile = this.form.recoverTempFile
            this.oldTempFileComment = this.form.tempFileComment
            this.commentChanged = false
            this.tempCommentChanged = false
            this.hasTempChanged = false
            this.judgeChange()
            // 同步D7附件
            if (this.perFileChanged) {
              let data = []
              const _this = this
              this.chooseFiles.forEach((id, index) => {
                const fl = { issueId: _this.$props.issueId, storageId: id, stepName: _this.curStep }
                data.push(fl)
              })
              // 保存D7附件
              syncTempFile(data).then(res => {
                this.getBindFileByExample(this.queryFileByStep)
                this.tempFileChanged = false
              })
            }
            editSuccess = true
          }).catch(res => {
            // 详细描述
            this.form.commentD7 = this.oldComment
            this.form.recoverTempFile = this.oldRecoverTempFile
            this.form.tempFileComment = this.oldTempFileComment
            editSuccess = false
          })
          // 文档描述
          if (this.docDescChanged) {
            this.saveChangeDescs(this.changeDescs)
          }
          setTimeout(() => {
            if (editSuccess && this.saveSuccess) {
              this.finishStep()
            }
          }, 600)
        })
          .catch(() => {
            // 文档描述
            this.getChangeDescByIssueId(this.$props.issueId)
            // 详细描述
            this.form.commentD7 = this.oldComment
            this.form.recoverTempFile = this.oldRecoverTempFile
            this.form.tempFileComment = this.oldTempFileComment
            this.finishStep()
          })
      } else {
        this.finishStep()
      }
    },
    finishStep() {
      // 确认D7完成
      this.timeManagement.curStep = 'D7'
      this.timeManagement.d7Status = true
      this.timeManagement.d7Time = new Date()
      if (!this.timeManagement.d6Status) {
        this.$message({
          message: 'Cannot submit! 上一步尚未完成，无法执行此操作!',
          type: 'warning'
        })
      } else {
        // 上一步已完成方可执行
        editTimeManage(this.timeManagement).then(res => {
          this.confirmVisible = false
          this.isFinished = true
          this.docDesc1Changed = false
          this.docDesc2Changed = false
          this.commentChanged = false
          this.tempCommentChanged = false
          this.hasTempChanged = false
          this.docDescChanged = false
          this.noChanged = true
          this.$emit('func', this.isFinished)
          this.$message({
            message: 'Submit Success! D7提交完成!',
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

.edit_dev > > > .el-transfer-panel {
  width: 400px;
}

.el-form-item--small.el-form-item {
  margin-bottom: 14px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
