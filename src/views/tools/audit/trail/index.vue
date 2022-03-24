<template>
  <div class="app-container">
    <el-select
      v-model="plan.realName"
      filterable
      style="width: 400px;padding-bottom: 10px;"
      placeholder="请选择"
      value-key="id"
      @change="changePlanId"
    >
      <el-option
        v-for="item in plans"
        :key="item.id"
        :label="item.realName"
        :value="item"
      />
    </el-select>
    <!--审核计划内容-->
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Profile 基础信息" name="1" class="collapse-item">
        <el-row class="box-card">
          <!--审核计划基本信息-->
          <el-descriptions :column="4">
            <el-descriptions-item label="审核编号">{{ plan.auditNo }}</el-descriptions-item>
            <el-descriptions-item label="审核种类">{{ plan.type }}</el-descriptions-item>
            <el-descriptions-item label="审核内容">{{ plan.content }}</el-descriptions-item>
            <el-descriptions-item label="计划时间">{{ plan.planTime }}</el-descriptions-item>
            <el-descriptions-item label="审核负责人">{{ plan.chargeman }}</el-descriptions-item>
            <el-descriptions-item label="模板类型">{{ plan.templateType }}</el-descriptions-item>
            <el-descriptions-item label="审核范围">{{ plan.scope }}</el-descriptions-item>
            <el-descriptions-item label="审核周期">{{ plan.period }}</el-descriptions-item>
            <el-descriptions-item label="审核原因">{{ plan.reason }}</el-descriptions-item>
            <el-descriptions-item label="审核产品">{{ plan.product }}</el-descriptions-item>
            <el-descriptions-item label="产品技术">{{ plan.technology }}</el-descriptions-item>
            <el-descriptions-item label="审核地点">{{ plan.address }}</el-descriptions-item>
            <el-descriptions-item label="审核产线">{{ plan.line }}</el-descriptions-item>
            <el-descriptions-item label="计划状态">{{ plan.status }}</el-descriptions-item>
            <el-descriptions-item label="审核人员">
              <div class="tag-group">
                <el-tag
                  v-for="item in auditorDatas"
                  :key="item.id"
                  class="tag-list"
                  size="small"
                  :disable-transitions="false"
                >
                  {{ item.username }}
                </el-tag>
              </div>
            </el-descriptions-item>
            <!--审批状态-->
            <el-descriptions-item label="审批状态">{{
              plan.approvalStatus
            }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="plan.approvalStatus !=='待激活'"
              label="审批人"
            >
              {{ plan.approver }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="plan.approvalStatus ==='被驳回' || plan.approvalStatus ==='已批准'"
              label="审批时间"
            >
              {{ plan.approvedTime }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
      </el-collapse-item>
      <!--审核执行-->
      <el-collapse-item title="Execute 执行信息" name="2" class="collapse-item">
        <el-descriptions border>
          <el-descriptions-item v-if="plan.status ==='计划'" label="计划状态">
            {{ plan.status }}
          </el-descriptions-item>
          <el-descriptions-item
            v-if="plan.status !=='计划'"
            label="执行发起人"
          >
            {{ execute.username }}
          </el-descriptions-item>

          <el-descriptions-item
            v-if="plan.status !=='计划'"
            label="开始执行时间"
          >
            {{ execute.createTime }}
          </el-descriptions-item>
          <!--审批报告-->
          <el-descriptions-item v-if="plan.status !=='计划'" label="审核结果">{{ report.result }}</el-descriptions-item>
          <el-descriptions-item v-if="plan.status !=='计划'" label="分数">{{ report.score }}</el-descriptions-item>
          <el-descriptions-item v-if="plan.status !=='计划'" label="改善报告提交期限">{{
            report.reportDeadline
          }}
          </el-descriptions-item>
          <el-descriptions-item v-if="plan.status !=='计划'" label="最终结案期限">{{
            report.finalDeadline
          }}
          </el-descriptions-item>
          <el-descriptions-item v-if="plan.status !=='计划'" label="追踪要求">{{
            report.trailRequirement
          }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
      <!--审核追踪-->
      <el-collapse-item title="Trail 追踪信息" name="3" class="collapse-item">
        <el-descriptions :column="1" border>
          <el-descriptions-item v-if="plan.status !=='计划'" label="问题与改善计划">
            <el-table
              ref="table"
              v-loading="questionLoading"
              border
              :data="questions"
              style="width: 100%;"
              @expand-change="expendSelected"
            >
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="问题标题">
                      <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="是否重复出现">
                      <span>{{ props.row.isRepeat === true ? '是' : '否' }}</span>
                    </el-form-item>
                    <el-form-item label="问题附件列表">
                      <el-table
                        ref="table"
                        v-loading="questionFileLoading"
                        :data="questionFiles"
                        style="width: 100%;"
                        highlight-current-row
                      >
                        <el-table-column
                          type="index"
                          width="50"
                          label="序号"
                        />
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
                                {{ scope.row.realName }}
                              </a>
                            </el-popover>
                          </template>
                        </el-table-column>
                        <el-table-column prop="path" label="预览图">
                          <template slot-scope="{row}">
                            <el-image
                              :src=" baseApi + '/file/' + row.type + '/' + row.name"
                              :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.name]"
                              fit="contain"
                              lazy
                              class="el-avatar"
                            >
                              <div slot="error">
                                <i class="el-icon-document" />
                              </div>
                            </el-image>
                          </template>
                        </el-table-column>
                        <el-table-column prop="size" label="大小" min-width="120" />
                        <el-table-column prop="type" label="附件类型" min-width="120" />
                        <el-table-column prop="createBy" label="创建者" />
                      </el-table>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="问题标题" />
              <el-table-column prop="isRepeat" label="是否重复发生" :formatter="isRepeatFormat" />
              <el-table-column prop="isCompleted" label="是否改善完成" :formatter="isCompleteFormat" />
              <!--添加改善行动-->
              <el-table-column label="改善对策">
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
                label="操作"
                width="160px"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div>
                    <!--添加长久措施-->
                    <el-button
                      slot="reference"
                      v-permission="permission.edit"
                      size="mini"
                      type="primary"
                      icon="el-icon-plus"
                      @click="openAddAct(scope.row)"
                    >添加改善对策
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item v-if="plan.status !=='计划'" label="改善对策信息">
            <div>
              <!--新增/编辑改善对策-->
              <el-dialog
                :title="actOperationTitle"
                :visible.sync="addActionVisible"
                width="600px"
                :before-close="handleClose"
              >
                <el-form
                  ref="actionForm"
                  :model="actionForm"
                  :rules="actionRules"
                  size="small"
                  label-width="120px"
                >
                  <el-form-item
                    v-if="isAddAct"
                    label="问题标题"
                    prop="name"
                  >
                    <span>{{ question.name }}</span>
                  </el-form-item>
                  <el-form-item
                    label="改善对策标题"
                    prop="title"
                  >
                    <el-input
                      v-model="actionForm.title"
                      style="width: 370px;"
                    />
                  </el-form-item>
                  <el-form-item
                    label="描述"
                    prop="description"
                  >
                    <el-input
                      v-model="actionForm.description"
                      type="textarea"
                      autosize
                      style="width: 370px;"
                    />
                  </el-form-item>
                  <!--- 负责人 -->
                  <el-form-item
                    label="负责人"
                    prop="responsibleBy"
                  >
                    <el-input
                      v-model="actionForm.responsibleBy"
                      type="text"
                      style="width: 370px;"
                    />
                  </el-form-item>
                  <el-form-item
                    label="有效性(%)"
                    prop="efficiency"
                  >
                    <el-input-number
                      v-model="actionForm.efficiency"
                      style="width: 370px;"
                      :step="1"
                      :min="0"
                      :max="100"
                    />
                  </el-form-item>
                  <el-form-item
                    label="计划执行时间"
                    prop="planTime"
                  >
                    <el-date-picker
                      v-model="actionForm.planTime"
                      type="datetime"
                      style="width: 370px;"
                      placeholder="选择日期时间"
                      default-time="12:00:00"
                    />
                  </el-form-item>
                  <el-form-item
                    label="实际落实时间"
                    prop="completeTime"
                  >
                    <el-date-picker
                      v-model="actionForm.completeTime"
                      type="datetime"
                      style="width: 370px;"
                      placeholder="选择日期时间"
                      default-time="12:00:00"
                    />
                  </el-form-item>
                  <!--- 确认人 -->
                  <el-form-item
                    label="确认人"
                    prop="validateBy"
                  >
                    <el-input
                      v-model="actionForm.validateBy"
                      type="text"
                      style="width: 370px;"
                    />
                  </el-form-item>
                  <el-form-item
                    label="确认时间"
                    prop="completeTime"
                  >
                    <el-date-picker
                      v-model="actionForm.validateTime"
                      type="datetime"
                      style="width: 370px;"
                      placeholder="选择日期时间"
                      default-time="12:00:00"
                    />
                  </el-form-item>
                  <!--状态选择-->
                  <el-form-item
                    label="状态"
                    prop="status"
                  >
                    <el-select
                      v-model="actionForm.status"
                      placeholder="请选择状态"
                      style="width: 370px;"
                    >
                      <el-option
                        v-for="item in actStatusTypeOptions"
                        :key="item.key"
                        :label="item.display_name"
                        :value="item.key"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="备注"
                    prop="other"
                  >
                    <el-input
                      v-model="actionForm.other"
                      type="textarea"
                      autosize
                      style="width: 370px;"
                    />
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="doCancelAct">取 消</el-button>
                  <el-button type="primary" :loading="submitLoading" @click="submitAct">确 定</el-button>
                </span>
              </el-dialog>
              <el-table
                ref="table"
                v-loading="quesActLoading"
                border
                :data="quesActions"
                style="width: 100%;"
                @expand-change="expendActSelected"
              >
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="改善对策标题">
                        <span>{{ props.row.title }}</span>
                      </el-form-item>
                      <el-form-item label="对策描述">
                        <span>{{ props.row.description }}</span>
                      </el-form-item>
                      <el-form-item label="负责人">
                        <span>{{ props.row.responsibleBy }}</span>
                      </el-form-item>
                      <el-form-item label="有效性">
                        <span>{{ props.row.efficiency + '%' }}</span>
                      </el-form-item>
                      <el-form-item label="计划执行时间">
                        <span>{{ props.row.planTime }}</span>
                      </el-form-item>
                      <el-form-item label="实际落实时间">
                        <span>{{ props.row.completeTime }}</span>
                      </el-form-item>
                      <el-form-item label="确认人">
                        <span>{{ props.row.validateBy }}</span>
                      </el-form-item>
                      <el-form-item label="确认时间">
                        <span>{{ props.row.validateTime }}</span>
                      </el-form-item>
                      <el-form-item label="状态">
                        <span>{{ props.row.status }}</span>
                      </el-form-item>
                      <el-form-item label="备注">
                        <span>{{ props.row.other }}</span>
                      </el-form-item>
                      <el-form-item label="对策附件列表">
                        <!-- 改善对策附件 -->
                        <el-table
                          ref="table"
                          v-loading="actionFileLoading"
                          :data="actionFiles"
                          highlight-current-row
                        >
                          <el-table-column
                            type="index"
                            width="50"
                            label="序号"
                          />
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
                                  {{ scope.row.realName }}
                                </a>
                              </el-popover>
                            </template>
                          </el-table-column>
                          <el-table-column prop="path" label="预览图">
                            <template slot-scope="{row}">
                              <el-image
                                :src=" baseApi + '/file/' + row.type + '/' + row.name"
                                :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.name]"
                                fit="contain"
                                lazy
                                class="el-avatar"
                              >
                                <div slot="error">
                                  <i class="el-icon-document" />
                                </div>
                              </el-image>
                            </template>
                          </el-table-column>
                          <el-table-column prop="size" label="大小" min-width="120" />
                          <el-table-column prop="type" label="附件类型" min-width="120" />
                          <el-table-column prop="createBy" label="创建者" />
                          <!--   编辑与删除   -->
                          <el-table-column
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delPlanFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteActFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-button
                          type="primary"
                          style="margin-top: 8px;"
                          class="button-new-tag"
                          icon="el-icon-plus"
                          size="small"
                          @click="toUploadActFile(props.row)"
                        >上传对策附件
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="改善对策标题" min-width="120" />
                <el-table-column prop="responsibleBy" label="负责人" />
                <el-table-column label="有效性" :formatter="efficiencyFormat" />
                <el-table-column prop="planTime" label="计划执行时间" width="135" />
                <el-table-column prop="completeTime" label="实际落实时间" width="135" />
                <el-table-column prop="validateBy" label="确认人" />
                <el-table-column prop="validateTime" label="确认时间" width="135" />
                <el-table-column prop="status" label="状态" />
                <el-table-column prop="other" label="备注" />
                <!-- 编辑与删除   -->
                <el-table-column
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
                        @click="editQuesAction(scope.row)"
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
                            @click="delQuesAction(scope.row), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                          >确定
                          </el-button>
                        </div>
                        <el-button
                          slot="reference"
                          v-permission="permission.edit"
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
          </el-descriptions-item>
          <el-descriptions-item v-if="canSubmit === true" label="结案提交">
            <el-button
              v-permission="permission.edit"
              size="mini"
              type="primary"
              icon="el-icon-check"
              :disabled="hasClosed"
              @click="submitFinished"
            >确认结案
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item v-if="plan.status === '结案'" label="结案时间">
            {{ plan.closeTime }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
    <!--上传对策对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="actFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadActFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleActFileSuccess"
          :on-error="handleError"
          :action="apQuestionUploadApi + '?quesId=' + quesId + '&actId=' + actId "
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将<b style="color: red;">{{ uploadDiaTitle }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitQuesFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAuditPlanByExampleV2, getAuditPlanById, submitAuditPlan } from '@/api/tools/auditPlan'
import {GMTToDate, validIsNotNull} from '@/utils/validationUtil'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { getPlanExecuteByPlanId } from '@/api/tools/auditPlanExecute'
import { getPlanReportByPlanId } from '@/api/tools/auditPlanReport'
import { completedById, getReportQuestionByReportId } from '@/api/tools/apReportQuestion'
import { delApQuestionFile, getApQuestionFileByCond } from '@/api/tools/apQuestionFile'
import { addQuesAction, delQuesAction, editQuesAction, getQuesActionByCond } from '@/api/tools/apQuestionAct'

export default {
  name: 'AuditTrail',
  components: {},
  // 设置数据字典
  // dicts: ['audit_template'],
  data() {
    return {
      cond: {
        approvalStatus: '已批准',
        statusList: ['追踪','结案']
      },
      plans: [],
      planId: null,
      plan: {},
      headers: {
        'Authorization': getToken()
      },
      permission: {
        edit: ['admin', 'plan:edit']
      },
      auditors: [],
      auditorDatas: [],
      execute: {
        username: '',
        createTime: ''
      },
      report: {
        result: '',
        score: null,
        trailRequirement: '',
        reportDeadline: null,
        finalDeadline: null
      },
      reportId: null,
      questionLoading: false,
      questions: [],
      questionFileLoading: false,
      questionFiles: [],
      question: null,
      activeNames: ['1', '2', '3'],
      quesActLoading: false,
      quesActions: [],
      actOperationTitle: '',
      addActionVisible: false,
      actionForm: {
        id: null,
        planId: null,
        reportQuestionId: null,
        title: '',
        description: '',
        responsibleBy: '',
        efficiency: null,
        planTime: null,
        completeTime: null,
        validateBy: null,
        validateTime: null,
        status: null,
        other: null
      },
      actionRules: {
        title: [
          { required: true, message: '改善对策标题不可为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '若无具体对策描述，可填入”暂无“', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '默认可选“开始”', trigger: 'blur' }
        ],
        responsibleBy: [
          { required: true, message: '负责人不可为空', trigger: 'blur' }
        ],
        efficiency: [
          { required: true, message: '有效性不可为空', trigger: 'blur' }
        ],
        planTime: [
          { required: true, message: '请填写计划时间', trigger: 'blur' }
        ]
      },
      actStatusTypeOptions: [
        { key: '开始', display_name: '开始' },
        { key: '进行中', display_name: '进行中' },
        { key: '完成', display_name: '完成' },
        { key: '停用', display_name: '停用' }
      ],
      isAddAct: false,
      submitLoading: false,
      quesId: null,
      actId: null,
      actionFileLoading: false,
      actionFiles: [],
      actFileUploadVisible: false,
      uploadDiaTitle: '',
      canSubmit: false,
      hasClosed: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'apQuestionUploadApi'
    ])
  },
  created: function() {
    this.getPlanInfoByExample(this.cond)
  },
  mounted() {

  },
  methods: {
    // 获取计划列表
    getPlanInfoByExample(cond) {
      this.plans = []
      getAuditPlanByExampleV2(cond).then(res => {
        this.plans = res
        if (res.length > 0) {
          this.planId = res[0].id
          // 查询审核计划基本信息
          this.getPlanInfoByPlanId(this.planId)
          // 查询审核计划执行情况
          if (validIsNotNull(res[0].status) && res[0].status !== '计划') {
            this.getExecuteInfoByPlanId(this.planId)
            this.getReportInfoByPlanId(this.planId)
            this.getActionInfoByPlanId(this.planId)
          }
        }
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
    // 审核计划标识变更
    changePlanId(plan) {
      // alert(plan.status)
      this.planId = plan.id
      this.getPlanInfoByPlanId(this.planId)
      if (validIsNotNull(plan.status) && plan.status !== '计划') {
        // alert(123)
        this.getExecuteInfoByPlanId(this.planId)
        this.getReportInfoByPlanId(this.planId)
        this.getActionInfoByPlanId(this.planId)
      }
    },
    // 查询审核计划信息
    getPlanInfoByPlanId(id) {
      this.hasClosed = false
      this.auditorDatas = []
      getAuditPlanById(id).then(res => {
        // alert(res.status)
        this.plan = res
        this.plan.planTime = validIsNotNull(res.planTime)?GMTToDate(res.planTime):''
        if (this.plan.status === '结案') {
          this.hasClosed = true
        }
        // alert(JSON.stringify(this.plan.closeTime))
        if (res.auditors.length > 0) {
          this.auditorDatas = res.auditors
        }
      })
    },
    // 查询审核计划执行信息
    getExecuteInfoByPlanId(id) {
      getPlanExecuteByPlanId(id).then(res => {
        // alert(JSON.stringify(res))
        this.execute = res
      })
    },
    // 查询审核计划改善对策信息
    getActionInfoByPlanId(id) {
      this.quesActLoading = true
      this.quesActions = []
      getQuesActionByCond(id, 0).then(res => {
        // alert(JSON.stringify(res))
        this.quesActions = res
        this.quesActLoading = false
      })
    },
    // 准备新增改善对策
    openAddAct(row) {
      // alert(JSON.stringify(row))
      this.actionForm = {}
      // 永久措施的新增弹窗
      this.question = row
      this.actionForm.planId = this.planId
      this.actionForm.reportQuestionId = row.id
      // alert(JSON.stringify(this.actionForm))
      // 添加 分析+ 措施字段
      this.actOperationTitle = '新增改善对策'
      this.isAddAct = true
      this.addActionVisible = true
    },
    // 编辑改善对策信息
    editQuesAction(row) {
      this.actionForm = row
      this.actOperationTitle = '编辑改善对策'
      this.isAddAct = false
      this.addActionVisible = true
    },
    // 取消操作
    doCancelAct() {
      this.addActionVisible = false
      // 刷新改善对策列表
      this.getActionInfoByPlanId(this.planId)
    },
    // todo 判断是否提交
    judgeCanSubmit(data) {
      // alert(JSON.stringify(data))
      this.canSubmit = false
      const list = []
      data.forEach((ques, index) => {
        if (ques.isCompleted === true) {
          list.push(ques.isCompleted)
        }
      })
      // alert(data.length)
      // alert(JSON.stringify(list))
      if (data.length === list.length) {
        this.canSubmit = true
      }
    },
    // 提交结案
    submitFinished() {
      // 结案提交
      submitAuditPlan(this.planId).then(res => {
        this.$message({
          message: 'Submit AuditPlan Success! 计划审核结案提交成功!',
          type: 'success'
        })
        this.getPlanInfoByPlanId(this.planId)
      })
    },
    submitAct() {
      this.$refs.actionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          // alert(JSON.stringify(this.actionForm))
          this.submitLoading = true
          // 判断新增/编辑
          if (!validIsNotNull(this.actionForm.id)) {
            // 新增
            // alert(JSON.stringify(this.actionForm))
            addQuesAction(this.actionForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增改善对策记录成功!',
                type: 'success'
              })
              this.submitLoading = false
              this.addActionVisible = false
              // 刷新分析列表
              this.getReportQuestionsByReportId(this.reportId)
              // 刷新改善对策列表
              this.getActionInfoByPlanId(this.planId)
              // 刷新审核计划状态
              this.getPlanInfoByPlanId(this.planId)
            }).catch(()=>{
              this.submitLoading = false
            })
          } else {
            // 编辑
            editQuesAction(this.actionForm).then(res => {
              this.$message({
                message: 'Update Record Success! 改善对策记录更新成功!',
                type: 'success'
              })
              this.submitLoading = false
              this.addActionVisible = false
              if (validIsNotNull(res.content)) {
                this.$confirm(res.content, '确认信息', {
                  distinguishCancelAndClose: true,
                  confirmButtonText: 'Yes 改善完成',
                  cancelButtonText: 'Wait 尚需验证'
                })
                  .then(() => {
                    // 更新问题，设置为已改善完成
                    // alert(JSON.stringify(this.actionForm.reportQuestionId))
                    completedById(this.actionForm.reportQuestionId).then(res => {
                      this.$message({
                        message: 'Submit Question Success! 问题改善提交成功!',
                        type: 'success'
                      })
                      this.getReportQuestionsByReportId(this.reportId)
                    })
                  })
              }
              // 刷新分析列表
              this.getReportQuestionsByReportId(this.reportId)
              // 刷新改善对策列表
              this.getActionInfoByPlanId(this.planId)
              // 刷新审核计划状态
              this.getPlanInfoByPlanId(this.planId)
            }).catch(()=>{
              this.submitLoading = false
            })
          }
        }
      })
    },
    // 删除改善对策信息
    delQuesAction(data) {
      delQuesAction(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除改善对策成功!',
          type: 'success'
        })
        // 刷新问题列表
        this.getReportQuestionsByReportId(this.reportId)
        // 刷新改善对策列表
        this.getActionInfoByPlanId(this.planId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除改善对策失败!',
          type: 'error'
        })
      })
    },
    efficiencyFormat(row, column, cellValue, index) {
      if (row.efficiency !== 0) {
        return row.efficiency + '%'
      } else {
        return row.efficiency
      }
    },
    // 触发行展开事件
    expendActSelected(row, expandedRows) {
      // alert(JSON.stringify(row))
      this.actId = row.id
      this.quesId = row.reportQuestionId
      // 查询问题点对应的附件列表信息
      this.getActFileByActId(row.reportQuestionId, row.id)
    },
    // 查询改善对策对应的附件信息
    getActFileByActId(quesId, actId) {
      this.actionFileLoading = true
      this.actionFiles = []
      getApQuestionFileByCond(quesId, actId).then(res => {
        // alert(JSON.stringify(res))
        this.actionFiles = res
        this.actionFileLoading = false
      })
    },
    // 准备上传问题对应的文件
    toUploadActFile(row) {
      // alert(JSON.stringify(row))
      this.actFileUploadVisible = true
      // this.uploadDiaTitle = '上传['+row.name+']相关附件'
      this.uploadDiaTitle = row.title
    },
    // 上传附件之前判断
    beforeUpload: function(file) {
      // alert(JSON.stringify(file))
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    // 上传问题对应的附件
    submitQuesFileUpload() {
      this.$refs.uploadActFile.submit()
    },
    // 监听问题对应的附件上传成功
    handleActFileSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.uploadActFile.clearFiles()
      this.getActFileByActId(this.quesId, this.actId)
    },
    // 删除问题点对应的附件
    deleteActFile(row) {
      const data = []
      data.push(row.id)
      delApQuestionFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getActFileByActId(row.reportQuestionId, row.questionActionId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件失败!',
          type: 'error'
        })
      })
    },
    // 查询审核计划报告信息
    getReportInfoByPlanId(planId) {
      getPlanReportByPlanId(planId).then(res => {
        this.report = res
        this.reportId = res.id
        // alert(JSON.stringify(this.report))
        this.oldResult = res.result
        this.oldScore = res.score
        this.oldRequire = res.trailRequirement
        this.oldRDeadline = res.reportDeadline
        this.oldFDeadline = res.finalDeadline
        // 获取报告中的问题列表
        this.getReportQuestionsByReportId(res.id)
      })
    },
    // 获取报告下问题列表
    getReportQuestionsByReportId(reportId) {
      this.questionLoading = true
      this.questions = []
      getReportQuestionByReportId(reportId).then(res => {
        this.questionLoading = false
        this.questions = res
        this.judgeCanSubmit(res)
      })
    },
    // 附件数目
    isRepeatFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      if (row.isRepeat) {
        return '是'
      } else {
        return '否'
      }
    },
    isCompleteFormat(row, column, cellValue) {
      // console.log(row , column , cellValue)
      if (row.isCompleted) {
        return '是'
      } else {
        return '否'
      }
    },
    // 触发行展开事件
    expendSelected(row, expandedRows) {
      this.question = row
      // 查询问题点对应的附件列表信息
      this.getQuestionFileByQuestionId(row.id)
    },
    // 根据问题点查询对应的附件
    getQuestionFileByQuestionId(quesId) {
      // alert(JSON.stringify(this.quesId))
      // 查询问题点对应的附件列表信息
      this.questionFileLoading = true
      this.questionFiles = []
      getApQuestionFileByCond(quesId, 0).then(res => {
        // alert(JSON.stringify(res))
        this.questionFiles = res
        this.questionFileLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin: 5px 0;
}

::v-deep .el-table__fixed-right {
  height: 100% !important;
}

.tag-list {
  margin-right: 5px !important;
  text-align: left !important;
  //line-height: 1.5 !important;
  display: inline-block !important;
}

.el-form-item--small.el-form-item {
  margin-bottom: 14px !important;
}
</style>
<style>
.demo-table-expand {
  font-size: 0;
  margin: 10px 60px;
}

.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
