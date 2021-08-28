<template>
  <div>
    <!--缺陷定位-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">缺陷定位</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="saveDefects(stepDefects)">保存
        </el-button>
      </div>
      <div>
        <el-table
          ref="table"
          v-loading="defectLoading"
          :data="stepDefects"
          style="width: 100%;"
        >
          <el-table-column prop="processStep" label="缺陷在哪个过程步骤中被创建/被检测到/应该被检测到" width="320"/>
          <el-table-column label="被创建" show-overflow-tooltip>
            <template scope="scope">
              <el-checkbox
                v-model="scope.row.created"
                :disabled="!isNeed"
                @change="createdChange(scope.$index,scope.row.created)"
              />
            </template>
          </el-table-column>
          <el-table-column label="被检测到" show-overflow-tooltip>
            <template scope="scope">
              <el-checkbox
                v-model="scope.row.detected"
                :disabled="!isNeed"
                @change="detectedChange(scope.$index,scope.row.detected)"
              />
            </template>
          </el-table-column>
          <el-table-column label="可能已被检测到" show-overflow-tooltip>
            <template scope="scope">
              <el-checkbox
                v-model="scope.row.shouldDetected"
                :disabled="!isNeed"
                @change="shouldDetectedChange(scope.$index,scope.row.shouldDetected)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--根本原因分析-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">根本原因分析</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="checkFishBone">查看鱼骨图
        </el-button>
      </div>
      <div>
        <!--新增/编辑5Hys数据弹窗-->
        <el-dialog
          title="新增/编辑5Whys"
          :visible.sync="addWhyVisible"
          width="60%"
          :before-close="handleWhyClose"
        >
          <el-dialog
            width="50%"
            title="5Whys验证"
            :visible.sync="innerVisible"
            append-to-body
            :before-close="handleClose"
          >
            <div class="block">
              <el-row>
                <el-col :span="12">
                  <div class="radio">
                    因为：
                  </div>
                  <el-timeline>
                    <el-timeline-item
                      v-for="(why, index) in whys"
                      :key="index"
                      :timestamp="why.sort"
                    >
                      {{ why.orderSort }}.{{ why.content }}
                    </el-timeline-item>
                  </el-timeline>
                </el-col>
                <el-col :span="12">
                  <div class="radio">
                    所以：
                  </div>
                  <el-timeline reverse>
                    <el-timeline-item
                      v-for="(why, index) in whys"
                      :key="index"
                    >
                      {{ why.orderSort }}.{{ why.content }}
                    </el-timeline-item>
                  </el-timeline>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false">再修改下</el-button>
                <el-button type="primary" @click="updateSubmit(whys)">确认保存</el-button>
              </span>
            </div>
          </el-dialog>
          <el-card class="box-card" shadow="never">
            <div slot="header" class="clearfix" style="text-align:center;font-size:16px;font-weight: bolder;">
              <span><el-link
                style="text-decoration:underline;font-size:16px;font-weight: bolder;"
                type="success"
              >{{ causeName }}</el-link>-5Whys原因分析</span>
            </div>
            <div>
              <el-table
                ref="table"
                v-loading="whyLoading"
                :data="whys"
                style="width: 100%;margin-bottom: 20px;"
              >
                <el-table-column
                  label="序号"
                  width="50"
                  type="index"
                  :index="(index)=>{return index+1}"
                />
                <el-table-column label="内容" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.content" type="textarea" autosize style="width: 93%;"/>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="70">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      @click="handleDelete(scope.$index, scope.row)"
                    />
                  </template>
                </el-table-column>
              </el-table>
              <p style="margin-top: -20px;">
                <el-button
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addClick"
                >添加Why
                </el-button>
              </p>
            </div>
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addWhyVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateWhys(whys)">提 交</el-button>
          </span>
        </el-dialog>
        <!--5Why验证-->
        <!--原因-表单组件-->
        <el-dialog
          :title="causeOperationTitle"
          :visible.sync="addCauseVisible"
          width="600px"
          :before-close="handleClose"
        >
          <el-form
            ref="causeForm"
            :rules="causeRules"
            inline
            :model="form"
            size="small"
            label-width="120px"
          >
            <el-form-item label="原因名称" prop="name" required>
              <el-input
                v-model="form.name"
                style="width: 370px;"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="发生/检测" prop="judgeResult" required>
              <el-select
                v-model="form.judgeResult"
                size="small"
                placeholder="发生/检测"
                class="filter-item"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in judgeTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="确认方法" prop="method" required>
              <el-input v-model="form.method" style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="确认结果" prop="result" required>
              <el-input v-model="form.result" style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="原因占比" prop="contribution" required>
              <el-input-number
                v-model="form.contribution"
                style="width: 370px;"
                :precision="2"
                :step="0.1"
                :min="0"
                :max="100"
              />
            </el-form-item>
            <el-form-item label="是否是根本原因" prop="isExact" required>
              <el-select
                v-model="form.isExact"
                size="small"
                placeholder="是/否"
                class="filter-item"
                style="width: 370px;"
              >
                <el-option
                  v-for="item in resultTypeOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="评论" prop="comment" required>
              <el-input
                v-model="form.comment"
                type="textarea"
                autosize
                style="width: 370px;"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="addCauseVisible = false">取消</el-button>
            <el-button :loading="submitLoading" type="primary" @click="submitCause">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="causeLoading"
          lazy
          :load="getCauseDatas"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :data="causeData"
          row-key="id"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column label="原因名称" prop="name" min-width="150"/>
          <el-table-column label="发生/检测 " prop="judgeResult" width="120"/>
          <el-table-column label="确认方法" prop="method" min-width="150"/>
          <el-table-column label="确认结果" prop="result" min-width="150"/>
          <el-table-column label="原因占比" prop="contribution"/>
          <el-table-column
            v-if="isNeed"
            label="操作"
            width="250px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <el-button
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  class="btn"
                  @click="toAddCause(scope.row)"
                />
                <el-button
                  v-if="scope.row.pid > 0 "
                  v-permission="permission.edit"
                  style="margin-left: 0;"
                  class="btn"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="toEditCause(scope.row)"
                />
                <!--删除-->
                <el-popover
                  :ref="`delMem-popover-${scope.$index}`"
                  v-permission="permission.edit"
                  placement="top"
                  width="180"
                >
                  <p>确定删除吗?如果存在下级节点则一并删除，此操作不能撤销！</p>
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
                      :loading="delLoading"
                      @click="toDeleteCause(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button
                    v-if="scope.row.pid > 0 "
                    slot="reference"
                    v-permission="permission.del"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    class="btn"
                  />
                </el-popover>
                <el-button
                  v-if="scope.row.isExact"
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  class="btn"
                  @click="toEditWhys(scope.row)"
                >5Whys
                </el-button>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </el-card>

    <!--风险评估-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">风险评估</span>
        <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="addRbi(issueForm)">保存
        </el-button>
      </div>
      <div>
        <el-form :inline="true" :model="issueForm" class="demo-form-inline">
          <el-form-item
            prop="riskAssessment"
          >
            <el-input
              v-if="isNeed"
              v-model="issueForm.rbi"
              type="textarea"
              :rows="3"
              style="min-width: 800px;"
              :disabled="!isNeed"
              @input="rbiChange"
            />
            <span v-if="!isNeed">{{transNullFormat(issueForm.rbi)}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--特殊处理-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">
          <el-form :inline="true" :model="issueForm" style="float: left;">
            <el-form-item
              prop="specialEvent"
            >
              <span slot="label">
                <span class="span-box">
                  <span>特殊事件</span>
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      应用场景：【NTF不能重复】和【公司外部原因】，执行模式：D1->D2->D3->D4->D8<br>
                      <b style="color: red">*</b>正常8D流程可忽略，并支持正常8D和特殊场景切换但需注意数据备份
                    </div>
                    <i class="el-icon-question"/>
                  </el-tooltip>
                </span>
              </span>
              <el-select
                v-if="isNeed"
                v-model="issueForm.specialEvent"
                placeholder="请选择特殊事件应用场景"
                style="width: 200px;"
                clearable
                :disabled="!isNeed"
                @change="changeSpecialEvent"
              >
                <el-option
                  v-for="item in specialEventOptions"
                  :key="item.key"
                  :label="item.display_name"
                  :value="item.key"
                />
              </el-select>
              <span v-if="!isNeed">{{transNullFormat(issueForm.specialEvent)}}</span>
            </el-form-item>
          </el-form>
          <el-button v-if="isNeed" style="float: right; padding: 3px 0" type="text" @click="saveSpecial">保存</el-button>
        </span>
      </div>
      <div>
        <div v-if="issueForm.specialEvent === 'NTF不能复制'|| issueForm.specialEvent === '公司外部原因'">
          <el-form
            ref="specialForm"
            :inline="true"
            label-width="120px"
            :model="specialForm"
            class="demo-form-inline"
            :rules="specialRules"
          >
            <el-form-item
              label="原因说明"
              prop="reason"
            >
              <el-input
                v-if="isNeed"
                v-model="specialForm.reason"
                type="textarea"
                autosize
                style="width: 600px;"
                @input="reasonChange"
              />
              <span v-if="!isNeed">{{transNullFormat(specialForm.reason)}}</span>
            </el-form-item>
            <el-form-item
              v-if="issueForm.specialEvent === 'NTF不能复制'"
              label="NTF验证"
              prop="validation"
            >
              <el-input
                v-if="isNeed"
                v-model="specialForm.validation"
                style="width: 600px;"
                @input="validationChange"
              />
              <span v-if="!isNeed">{{transNullFormat(specialForm.validation)}}</span>
            </el-form-item>
            <el-form-item
              prop="evidence"
            >
              <span slot="label">
                <span class="span-box">
                  <span>证据</span>
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      需要上传图片、文档等附件可统一在下方【添加附件】和【附件列表】功能区域上传、管理
                    </div>
                    <i class="el-icon-question"/>
                  </el-tooltip>
                </span>
              </span>
              <el-input
                v-if="isNeed"
                v-model="specialForm.evidence"
                type="textarea"
                autosize
                style="width: 600px;"
                @input="evidenceChange"
              />
              <span v-if="!isNeed">{{transNullFormat(specialForm.evidence)}}</span>
            </el-form-item>
            <el-form-item
              label="其他"
              prop="other"
            >
              <el-input
                v-if="isNeed"
                v-model="specialForm.other"
                type="textarea"
                autosize
                style="width: 600px;"
                @input="otherChange"
              />
              <span v-if="!isNeed">{{transNullFormat(specialForm.other)}}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>

    <!--显示鱼骨图-->
    <el-card v-if="!isNeed" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">原因分析-鱼骨图</span>
        <!--        <span class="header-title">原因分析图</span>-->
      </div>
      <div>
        <Jtopo :issue-id="issueId" :fish-data="initFish"/>
        <!--        <TreeChart :issue-id="issueId" :fish-data="fishData"/>-->
      </div>
    </el-card>

    <!--显示5WHYS-->
    <el-card v-if="!isNeed" class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">原因分析-5Whys</span>
      </div>
      <div>
        <div v-for="(item,index) in causeWhys" :key="item.id" class="text item">
          <div class="cause-container">
            <el-col :span="12">
              <el-row>
                <span style="text-decoration: underline;">根本原因{{ index + 1 }}：<b>{{ item.name }}</b>&nbsp;&nbsp;
                  原因分析-5Whys:</span>
              </el-row>
              <el-row>
                <div v-for="(item,index) in item.whyList" :key="item.id" class="why-content">
                  <span :class="'label-margin-p' + item.orderSort"> {{ item.orderSort }}
                    <div class="li-div" :style="{width:liDivWidth-20*item.orderSort+'px'}">{{ item.content }}</div>
                  </span>
                </div>
              </el-row>
            </el-col>
          </div>
        </div>
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

import { editTimeManage, getByIssueId } from '@/api/tools/timeManagement'
import { editStepDefect, getStepDefectByIssueId } from '@/api/tools/stepDefect'
import {
  addCause,
  delCause,
  editCause,
  getCauseByIssueId,
  getCauseTreeByIssueId,
  getIssueCause
} from '@/api/tools/issueCause'
import { editWhys, getWhysByCauseId, getWhysByIssueId } from '@/api/tools/causeWhy'
import Jtopo from '@/views/components/Jtopo'
import { judgeIsEqual, validIsNotNull } from '@/utils/validationUtil'
import { edit, getIssueById } from '@/api/tools/issue'
import { addSpecial, delSpecialByIssueId, editSpecial, getSpecialByIssueId } from '@/api/tools/issueSpecail'
import UploadFile from '@/components/UploadFile'
import TreeChart from '@/components/Echarts/TreeChart'

export default {
  name: 'ForthForm',
  components: { Jtopo, UploadFile, TreeChart },
  props: ['issueId', 'needConfirm', 'initFish'],
  dicts: ['common_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      pop: false,
      selfLoading: false,
      causeLoading: false,
      addCauseVisible: false,
      submitLoading: false,
      delLoading: false,
      causeOperationTitle: null,
      issueForm: {},
      form: {
        id: null,
        pid: null,
        name: null,
        judgeResult: null,
        subCount: 0,
        method: null,
        result: null,
        contribution: null,
        comment: '无',
        isExact: false
      },
      causeRules: {
        name: [
          { required: true, message: '原因标题不可为空', trigger: 'blur' }
        ],
        judgeResult: [
          { required: true, message: '开始/检测必选其一', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请务必填写确认方法', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '请务必填写确认结果', trigger: 'blur' }
        ],
        contribution: [
          { required: true, message: '请填写原因占比，可为”0“', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '若无其他补充，可填入”暂无“', trigger: 'blur' }
        ],
        isExact: [
          { required: true, message: '请确认是否是根本原因', trigger: 'blur' }
        ]
      },
      defectLoading: false,
      stepDefects: [],
      confirmVisible: false,
      curStep: 'D4',
      curTime: 'd4Time',
      causeData: [],
      isFinished: false,
      isSpecial: false,
      resultTypeOptions: [
        { key: true, display_name: '是' },
        { key: false, display_name: '否' }
      ],
      judgeTypeOptions: [
        { key: '发生技术原因', display_name: '发生技术原因' },
        { key: '发生管理原因', display_name: '发生管理原因' },
        { key: '检测技术原因', display_name: '检测技术原因' },
        { key: '检测管理原因', display_name: '检测管理原因' }
      ],
      addWhyVisible: false,
      causeName: '',
      causeId: null,
      whyLoading: false,
      whys: [
        {
          orderSort: 1,
          content: '表头自定义了一个“添加”按钮，点击+动态添加一行。'
        }
      ],
      causeWhysLoading: false,
      causeWhys: [],
      timeManagement: {},
      oldRbi: null,
      rbiChanged: false,
      noChanged: true,
      isNeed: true,
      innerVisible: false,
      fishData: null,
      specialEventOptions: [
        { key: 'NTF不能复制', display_name: 'NTF不能复制' },
        { key: '公司外部原因', display_name: '公司外部原因' }
      ],
      specialForm: {
        issueId: null,
        type: null,
        reason: null,
        validation: null,
        evidence: null,
        other: null
      },
      specialRules: {
        reason: [
          { required: true, message: '原因说明不可为空', trigger: 'blur' }
        ],
        validation: [
          { required: true, message: 'NTF验证不可缺少', trigger: 'blur' }
        ],
        evidence: [
          { required: true, message: '请提供相关证据', trigger: 'blur' }
        ],
        other: [
          { required: true, message: '若无其他补充，可填入”暂无“', trigger: 'blur' }
        ]
      },
      oldReason: null,
      oldEvidence: null,
      oldValidation: null,
      oldOther: null,
      oldSpecialJudge: null,
      liDivWidth: 400, // 初始化whys-cause宽度：400
      oldCreated1: null,
      oldCreated2: null,
      oldCreated3: null,
      oldCreated4: null,
      created1Changed: false,
      created2Changed: false,
      created3Changed: false,
      created4Changed: false,
      createdChanged: false,
      oldDetected1: null,
      oldDetected2: null,
      oldDetected3: null,
      oldDetected4: null,
      detected1Changed: false,
      detected2Changed: false,
      detected3Changed: false,
      detected4Changed: false,
      detectedChanged: false,
      oldShould1: null,
      oldShould2: null,
      oldShould3: null,
      oldShould4: null,
      should1Changed: false,
      should2Changed: false,
      should3Changed: false,
      should4Changed: false,
      shouldChanged: false,
      defectChanged: false,
      specialChanged: false,
      reasonChanged: false,
      evidenceChanged: false,
      validationChanged: false,
      otherChanged: false,
      eventChanged: false,
      execFinished: false
    }
  },
  created() {

  },
  mounted: function() {
    this.isNeed = this.$props.needConfirm === undefined ? true : this.$props.needConfirm
    this.getIssueInfoById(this.$props.issueId)
    this.getStepDefectByIssueId(this.$props.issueId)
    this.getTimeManagementByIssueId(this.$props.issueId)
    this.getIssueCauseByIssueId(this.$props.issueId)
    this.getIssueCauseWhysByIssueId(this.$props.issueId)
    this.getCauseTreeByIssueId(this.$props.issueId)
  },
  methods: {
    // 监控附件相关改动
    getMsgFormSon(msg) {
      this.isFinished = msg
      this.$emit('func', this.isFinished)
    },
    // 保存缺陷定位信息
    getStepDefectByIssueId(id) {
      this.defectLoading = true
      this.stepDefects = []
      getStepDefectByIssueId(id).then(res => {
        this.stepDefects = res
        if (res.length > 0) {
          this.oldCreated1 = res[0].created
          this.oldCreated2 = res[1].created
          this.oldCreated3 = res[2].created
          this.oldCreated4 = res[3].created
          this.oldDetected1 = res[0].detected
          this.oldDetected2 = res[1].detected
          this.oldDetected3 = res[2].detected
          this.oldDetected4 = res[3].detected
          this.oldShould1 = res[0].shouldDetected
          this.oldShould2 = res[1].shouldDetected
          this.oldShould3 = res[2].shouldDetected
          this.oldShould4 = res[3].shouldDetected
        }
        this.defectLoading = false
      })
    },
    // 获取问题信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.issueForm = res
        this.oldSpecialJudge = res.specialEvent
        this.oldRbi = res.rbi
        if (validIsNotNull(res.specialEvent)) {
          this.getSpecialByIssueId(this.$props.issueId, res.specialEvent)
        }
      })
    },
    // 获取时间进程
    getTimeManagementByIssueId(id) {
      this.selfLoading = true
      getByIssueId(id).then(res => {
        this.timeManagement = res
        if (res.d4Status) {
          this.isFinished = true
        }
        this.selfLoading = false
      })
    },
    // 下拉框变更事件
    changeSpecialEvent(val) {
      this.specialChanged = !judgeIsEqual(val, this.oldSpecialJudge)
      this.judgeChange()
      this.getSpecialByIssueId(this.$props.issueId, val)
    },
    // 获取特殊事件信息
    getSpecialByIssueId(id, type) {
      this.specialForm = {}
      getSpecialByIssueId(id, type).then(res => {
        if (validIsNotNull(res.reason)) {
          this.specialForm = res
          this.oldReason = res.reason
          this.oldEvidence = res.evidence
          this.oldValidation = res.validation
          this.oldOther = res.other
        }
      })
    },
    // 获取原因信息
    getIssueCauseByIssueId(id) {
      this.causeLoading = true
      this.causeData = []
      getCauseByIssueId(id).then(res => {
        this.causeData = res
        this.causeLoading = false
      })
    },
    // 获取原因-5Whys信息
    getIssueCauseWhysByIssueId(id) {
      this.causeWhysLoading = true
      getWhysByIssueId(id).then(res => {
        console.log(res)
        this.causeWhys = res
        this.causeWhysLoading = false
      })
    },
    // 获取原因树数据
    getCauseTreeByIssueId(id) {
      getCauseTreeByIssueId(id).then(res => {
        this.fishData = {}
        this.fishData.name = res.issueTitle
        this.fishData.children = res.content
      })
    },
    // 批量保存缺陷定位数据
    saveDefects(data) {
      editStepDefect(data).then(res => {
        this.$message({
          message: 'Save Step-Defect Record Success! 保存缺陷检测定位成功!',
          type: 'success'
        })
        this.resetDefectChange()
        this.isFinished = false
        this.judgeChange()
        this.$emit('func', this.isFinished)
        this.getStepDefectByIssueId(this.$props.issueId)
      }).catch(() => {
        this.$message({
          message: 'Save Step-Defect Failed! 保存缺陷定位信息失败!',
          type: 'error'
        })
        this.getStepDefectByIssueId(this.$props.issueId)
      })
    },
    // 获取原因分析列表子集合
    getCauseDatas(tree, treeNode, resolve) {
      const params = { issueId: this.$props.issueId, pid: tree.id }
      // setTimeout(() => {
      getIssueCause(params).then(res => {
        resolve(res.content)
      })
      // }, 100)
    },
    // 新增原因
    toAddCause(data) {
      this.form = {}
      this.form.pid = data.id
      this.form.issueId = this.$props.issueId
      this.causeOperationTitle = '新增原因'
      this.addCauseVisible = true
    },
    toEditCause(row) {
      this.form = row
      this.causeOperationTitle = '编辑原因'
      this.addCauseVisible = true
    },
    // 提交编辑或新增原因
    submitCause() {
      this.$refs.causeForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          if (this.form.id === undefined) {
            this.submitLoading = true
            addCause(this.form).then(res => {
              this.$message({
                message: 'Add Record Success! 新增原因分析记录成功!',
                type: 'success'
              })
              this.getIssueCauseByIssueId(this.$props.issueId)
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.submitLoading = false
              this.addCauseVisible = false
            }).catch(res => {
              this.submitLoading = false
            })
          } else {
            this.submitLoading = true
            editCause(this.form).then(res => {
              this.$message({
                message: 'Edit Record Success! 编辑原因分析记录成功!',
                type: 'success'
              })
              this.getIssueCauseByIssueId(this.$props.issueId)
              this.submitLoading = false
              this.addCauseVisible = false
              this.isFinished = false
              this.$emit('func', this.isFinished)
            }).catch(res => {
              this.submitLoading = false
            })
          }
        }
      })
    },
    // 删除原因
    toDeleteCause(id) {
      const ids = []
      ids.push(id)
      this.delLoading = true
      delCause(ids).then(res => {
        this.$message({
          message: 'Del Cause Success! 删除原因成功!',
          type: 'success'
        })
        this.getIssueCauseByIssueId(this.$props.issueId)
        this.isFinished = false
        this.delLoading = false
        this.$emit('func', this.isFinished)
      }).catch(res => {
        this.delLoading = false
      })
    },
    transNullFormat(val){
      if (val === '' || val === undefined || val === null) {
        return '--'
      } else {
        return val
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // 关闭弹窗前操作
    handleWhyClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    // 新增/编辑5whys---有新有旧，不便区分，直接先删后增
    toEditWhys(cause) {
      this.causeName = cause.name
      this.causeId = cause.id
      this.getWhys(cause.id)
      this.addWhyVisible = true
    },
    getWhys(causeId) {
      getWhysByCauseId(causeId).then(res => {
        this.whys = res
      })
    },
    // 新增5Whys
    updateWhys(whys) {
      let val = true
      whys.forEach((why, index) => {
        if (!validIsNotNull(why.content)) {
          this.$message({
            message: 'Content of Why should not be null! Why内容均不可为空，请填写有效内容后提交!',
            type: 'warning'
          })
          val = false
        }
      })
      if (val) {
        this.innerVisible = true
      }
    },
    // 提交5Whys更新
    updateSubmit(whys) {
      const newArr = []
      for (let i = 0; i < whys.length; i++) {
        const why = {}
        why.causeId = this.causeId
        why.orderSort = whys[i].orderSort
        why.content = whys[i].content
        newArr.push(why)
      }
      editWhys(newArr).then(res => {
        this.$message({
          message: 'Save 5whys Success! 保存5Why信息成功!',
          type: 'success'
        })
        this.isFinished = false
        this.innerVisible = false
        this.addWhyVisible = false
        this.$emit('func', this.isFinished)
      }).catch(() => {
        this.$message({
          message: 'Save 5whys Failed! 保存5Why信息失败!',
          type: 'error'
        })
      })
    },
    saveSpecial() {
      if (!validIsNotNull(this.issueForm.specialEvent) && !validIsNotNull(this.oldSpecialJudge)) {
        this.$message({
          message: 'No change! 没发生变动，无需提交!',
          type: 'warning'
        })
      } else if (!validIsNotNull(this.issueForm.specialEvent) && validIsNotNull(this.oldSpecialJudge)) {
        // 清空特殊事件
        this.$confirm('此操作会清空已有的特殊事件信息，切换为传统8D模式？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 确定切换',
          cancelButtonText: 'NO 放弃切换'
        })
          .then(() => {
            delSpecialByIssueId(this.$props.issueId).then(res => {
              // 通知主页面
              this.isFinished = false
              this.$emit('func', this.isFinished)
              this.$message({
                type: 'success',
                message: '切换成功'
              })
              this.specialChanged = false
              this.reasonChanged = false
              this.validationChanged = false
              this.evidenceChanged = false
              this.otherChanged = false
              this.judgeChange()
              this.isSpecial = false
              const obj = {}
              obj.isSpecial = false
              obj.specialEvent = null
              this.$emit('funx', obj)
              if(this.execFinished){
                setTimeout(() => {
                  this.finishStep()
                }, 300)
              }
            })
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: action === 'cancel'
                ? 'Quit Change 放弃切换'
                : 'Reconsider 暂停留本页面，考虑一下'
            })
            if(this.execFinished){
              setTimeout(() => {
                this.finishStep()
              }, 300)
            }
          })
      } else {
        this.$refs.specialForm.validate().then((valid) => {
          if (!valid) {
            return false
          } else {
            // 判断是否有变动
            let val = true
            if (this.issueForm.specialEvent !== 'NTF不能复制') {
              if (this.specialForm.reason === this.oldReason &&
                this.specialForm.evidence === this.oldEvidence &&
                this.specialForm.other === this.oldOther) {
                val = false
                this.$message({
                  message: 'No change! 没发生变动，无需提交!',
                  type: 'warning'
                })
              }
            } else {
              if (this.specialForm.reason === this.oldReason &&
                this.specialForm.evidence === this.oldEvidence &&
                this.specialForm.other === this.oldOther &&
                this.specialForm.validation === this.oldValidation
              ) {
                val = false
                this.$message({
                  message: 'No change! 没发生变动，无需提交!',
                  type: 'warning'
                })
              }
            }

            if (val) {
              this.specialForm.issueId = this.$props.issueId
              this.specialForm.type = this.issueForm.specialEvent
              // 保存特殊事件
              if (validIsNotNull(this.specialForm.id)) {
                editSpecial(this.specialForm).then(res => {
                  // 编辑问题，添加D4特殊事件
                  this.$message({
                    message: 'Submit Success! 编辑特殊事件信息成功!',
                    type: 'success'
                  })
                  if(this.execFinished){
                    setTimeout(() => {
                      this.finishStep()
                    }, 300)
                  }
                  this.isSpecial = true
                  const obj = {}
                  obj.isSpecial = true
                  obj.specialEvent = this.specialForm.type
                  this.$emit('funx', obj)
                  this.eventChanged = false
                  this.specialChanged = false
                  this.reasonChanged = false
                  this.validationChanged = false
                  this.evidenceChanged = false
                  this.otherChanged = false
                  this.judgeChange()
                  this.isFinished = false
                  this.$emit('func', this.isFinished)
                }).catch(res => {
                  this.getIssueInfoById(this.$props.issueId)
                  this.getSpecialByIssueId(this.$props.issueId, this.issueForm.specialEvent)
                })
              } else {
                addSpecial(this.specialForm).then(res => {
                  // 编辑问题，添加D4特殊事件
                  this.$message({
                    message: 'Submit Success! 新增特殊事件信息成功!',
                    type: 'success'
                  })
                  this.specialChanged = false
                  this.reasonChanged = false
                  this.validationChanged = false
                  this.evidenceChanged = false
                  this.otherChanged = false
                  this.judgeChange()
                  this.isFinished = false
                  this.$emit('func', this.isFinished)
                  this.isSpecial = true
                  const obj = {}
                  obj.isSpecial = true
                  obj.specialEvent = this.specialForm.type
                  this.$emit('funx', obj)
                  if(this.execFinished){
                    setTimeout(() => {
                      this.finishStep()
                    }, 300)
                  }
                }).catch(res => {
                  this.getIssueInfoById(this.$props.issueId)
                  this.getSpecialByIssueId(this.$props.issueId, this.issueForm.specialEvent)
                })
              }
            }
          }
        })
      }
    },
    // 添加行数
    addClick() {
      const obj = {
        orderSort: this.whys.length + 1,
        content: ''
      }
      this.whys.push(obj)
    },
    // 删除行数
    handleDelete(index) {
      this.whys.splice(index, 1)
    },
    // 查看鱼骨图
    checkFishBone(data) {
      // 跳转到8D明细中
      this.$router.push(
        {
          path: '/issue/fishbone',
          query: {
            issueId: this.$props.issueId,
            fishData: this.fishData
          }
        })
    },
    // 保存D4-风险评估
    addRbi(form) {
      let val = true
      if (this.oldRbi === form.rbi) {
        this.$message({
          message: 'Cannot submit! 内容未发生变更，无需重复提交!',
          type: 'warning'
        })
        val = false
      }
      if (val) {
        edit(form).then(res => {
          // 编辑问题，添加D4风险评估
          this.$message({
            message: 'Submit Success! 保存风险评估成功!',
            type: 'success'
          })
          this.oldRbi = form.rbi
          this.rbiChanged = false
          this.judgeChange()
          this.isFinished = false
          this.$emit('func', this.isFinished)
        })
      }
    },
    // 监控缺陷定位有无变化：createdChange、detectedChange 和 shouldDetectedChange
    createdChange(index, val) {
      if (index === 0) {
        this.created1Changed = val !== this.oldCreated1
      }
      if (index === 1) {
        this.created2Changed = val !== this.oldCreated2
      }
      if (index === 2) {
        this.created3Changed = val !== this.oldCreated3
      }
      if (index === 3) {
        this.created4Changed = val !== this.oldCreated4
      }
      this.judgeChange()
    },
    detectedChange(index, val) {
      if (index === 0) {
        this.detected1Changed = val !== this.oldDetected1
      }
      if (index === 1) {
        this.detected2Changed = val !== this.oldDetected2
      }
      if (index === 2) {
        this.detected3Changed = val !== this.oldDetected3
      }
      if (index === 3) {
        this.detected4Changed = val !== this.oldDetected4
      }
      this.judgeChange()
    },
    shouldDetectedChange(index, val) {
      if (index === 0) {
        this.should1Changed = val !== this.oldShould1
      }
      if (index === 1) {
        this.should2Changed = val !== this.oldShould2
      }
      if (index === 2) {
        this.should3Changed = val !== this.oldShould3
      }
      if (index === 3) {
        this.should4Changed = val !== this.oldShould4
      }
      this.judgeChange()
    },
    // 监控rbi有无变化
    rbiChange(val) {
      this.rbiChanged = !judgeIsEqual(val, this.oldRbi)
      this.judgeChange()
    },
    // 监控特殊事件有无变化: reasonChange、validationChange、evidenceChange和otherChange
    reasonChange(val) {
      this.reasonChanged = !judgeIsEqual(val, this.oldReason)
      this.judgeChange()
    },
    validationChange(val) {
      this.validationChanged = !judgeIsEqual(val, this.oldValidation)
      this.judgeChange()
    },
    evidenceChange(val) {
      this.evidenceChanged = !judgeIsEqual(val, this.oldEvidence)
      this.judgeChange()
    },
    otherChange(val) {
      this.otherChanged = !judgeIsEqual(val, this.oldOther)
      this.judgeChange()
    },
    // 判断界面输入有无变化
    judgeChange() {
      // 缺陷定位的变化监控结果
      this.createdChanged = this.created1Changed || this.created2Changed || this.created3Changed || this.created4Changed
      this.detectedChanged = this.detected1Changed || this.detected2Changed || this.detected3Changed || this.detected4Changed
      this.shouldChanged = this.should1Changed || this.should2Changed || this.should3Changed || this.should4Changed
      this.defectChanged = this.createdChanged || this.detectedChanged || this.shouldChanged
      // 特殊事件的变化监控结果
      if (this.specialChanged) {
        this.eventChanged = true
      } else {
        // 如果没切换特殊事件，但内容更改了
        this.eventChanged = this.reasonChanged || this.validationChanged || this.evidenceChanged || this.otherChanged
      }
      this.noChanged = !(this.rbiChanged || this.defectChanged || this.eventChanged)
    },
    // 确认完成
    confirmFinished() {
      // 判断是否切换临时文件选项
      if (!this.noChanged) {
        let msg = '检测到'
        if (this.defectChanged) {
          msg += '【缺陷定位】'
        }
        if (this.rbiChanged) {
          msg += '【D7风险评估】'
        }
        if (this.specialChanged) {
          msg += '【特殊事件模式变更】'
        }
        if (this.reasonChanged || this.validationChanged || this.evidenceChanged || this.otherChanged) {
          msg += '【特殊事件内容】'
        }
        msg += '发生了变化，是否一并保存?'
        this.$confirm(msg, '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        }).then(() => {
          if (this.rbiChanged) {
            edit(this.issueForm).then(res => {
              this.oldRbi = this.issueForm.rbi
              // 保存特殊事件
            }).catch(res => {
              this.issueForm.rbi = this.oldRbi
              // 刷新缺陷定位列表
              this.getStepDefectByIssueId(this.$props.issueId)
              // 刷新特殊事件
              this.getIssueInfoById(this.$props.issueId)
            })
          }
          if (this.defectChanged) {
            this.saveDefects(this.stepDefects)
          }
          if (this.eventChanged) {
            this.execFinished = true
            this.saveSpecial()
          }else{
            setTimeout(() => {
              this.finishStep()
            }, 600)
          }
        }).catch(() => {
            this.issueForm.rbi = this.oldRbi
            // 刷新缺陷定位列表
            this.getStepDefectByIssueId(this.$props.issueId)
            // 刷新特殊事件
            this.getIssueInfoById(this.$props.issueId)
            this.finishStep()
          })
      } else {
        this.finishStep()
      }
    },
    finishStep() {
      // 确认D4完成
      this.timeManagement.curStep = 'D4'
      this.timeManagement.d4Status = true
      this.timeManagement.d4Time = new Date()
      if (!this.timeManagement.d3Status) {
        this.$message({
          message: 'Cannot submit! 上一步尚未完成，无法执行此操作!',
          type: 'warning'
        })
      } else {
        // 上一步已完成方可执行
        editTimeManage(this.timeManagement).then(res => {

          this.confirmVisible = false
          this.isFinished = true

          // 风险评估
          this.rbiChanged = false

          // 特殊事件
          this.specialChanged = false
          this.reasonChanged = false
          this.validationChanged = false
          this.evidenceChanged = false
          this.otherChanged = false

          // 缺陷定位
          this.resetDefectChange()

          this.judgeChange()
          this.$emit('func', this.isFinished)
          this.getStepDefectByIssueId(this.$props.issueId)
          this.getIssueInfoById(this.$props.issueId)
          this.$message({
            message: 'Submit Success! D4提交完成!',
            type: 'success'
          })
        })
      }
    },
    resetDefectChange() {
      this.created1Changed = false
      this.created2Changed = false
      this.created3Changed = false
      this.created4Changed = false
      this.detected1Changed = false
      this.detected2Changed = false
      this.detected3Changed = false
      this.detected4Changed = false
      this.should1Changed = false
      this.should2Changed = false
      this.should3Changed = false
      this.should4Changed = false
      this.createdChanged = false
      this.detectedChanged = false
      this.shouldChanged = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}

.dialog-footer {
  margin-left: 250px;
}

.cause-container {
  padding: 10px 20px 5px 20px;
}

.why-content {
  padding: 10px 0 10px 0;
}

.li-div {
  display: inline-block;
  padding: 5px;
  height: 30px;
  border: 1px solid #1d9cd6;
  position: relative;
  border-radius: 4px;
}

.label-margin-p0 {
  margin: 10px 0 5px 0 !important;
}

.label-margin-p1 {
  margin: 10px 0 5px 20px !important;
}

.label-margin-p2 {
  margin: 10px 0 5px 40px !important;
}

.label-margin-p3 {
  margin: 10px 0 5px 60px !important;
}

.label-margin-p4 {
  margin: 10px 0 5px 80px !important;
}

.label-margin-p5 {
  margin: 10px 0 5px 100px !important;
}

.label-margin-p6 {
  margin: 10px 0 5px 120px !important;
}

.label-margin-p7 {
  margin: 10px 0 5px 140px !important;
}

.label-margin-p8 {
  margin: 10px 0 5px 160px !important;
}

.label-margin-p9 {
  margin: 10px 0 5px 180px !important;
}

.label-margin-p10 {
  margin: 10px 0 5px 200px !important;
}

.btn {
  margin-right: 1px;
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
