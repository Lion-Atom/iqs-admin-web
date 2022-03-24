<template>
  <div id="pdfDom" class="app-container">
    <!--导出审核报告-->
    <el-button
      id="save_pdf"
      type="primary"
      plain
      icon="el-icon-download"
      size="mini"
      style="position:fixed;top:20%;right:3%;z-index: 50;"
      @click="savePdf"
    >导出审核报告
    </el-button>
    <el-select
      id="plan_selected"
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
    <el-row class="box-card">
      <!--审核计划基本信息-->
      <el-descriptions :column="4" title="审核计划基本信息" border>
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
        <el-descriptions-item v-if="plan.approvalStatus !=='被驳回'" label="审批状态">{{
            plan.approvalStatus
          }}
        </el-descriptions-item>
        <el-descriptions-item v-else label="审批状态">
          <el-tooltip class="item" effect="dark" :content="plan.rejectComment" placement="top-start">
            <span style="color: #f00;">{{ plan.approvalStatus }}</span>
          </el-tooltip>
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
    <!--审核执行-->
    <el-row class="box-card">
      <el-descriptions title="审核计划执行信息" border>
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
      </el-descriptions>
    </el-row>
    <el-row class="box-card">
      <el-descriptions v-if="plan.templateType === 'VDA6.3'" border>
        <template slot="title">
          <span>VDA 6.3 审核基础信息</span>
        </template>
        <!--模板内容基础信息-->
        <el-descriptions-item label="审核时间">{{ content.auditTime }}</el-descriptions-item>
        <el-descriptions-item label="DUNS编码">{{ content.dunsNum }}</el-descriptions-item>
        <el-descriptions-item label="详细地址">{{ content.address }}</el-descriptions-item>
        <!--被审核组织负责人姓名-->
        <el-descriptions-item label="被审核组织负责人姓名">{{ content.chargeName }}</el-descriptions-item>
        <el-descriptions-item label="被审核组织负责人手机号码">{{ content.chargePhone }}</el-descriptions-item>
        <el-descriptions-item label="被审核组织负责人邮箱">
          {{ content.chargeEmail }}
        </el-descriptions-item>
        <!--被审核组织质量负责人-->
        <el-descriptions-item label="被审核组织质量负责人姓名">
          {{ content.qualityName }}
        </el-descriptions-item>
        <el-descriptions-item label="被审核组织质量负责人手机号码">
          {{ content.qualityPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="被审核组织质量负责人邮箱">
          {{ content.qualityEmail }}
        </el-descriptions-item>
        <!--被审核组织生产负责人-->
        <el-descriptions-item label="被审核组织生产负责人姓名">
          {{ content.productName }}
        </el-descriptions-item>
        <el-descriptions-item label="被审核组织生产负责人手机号码">
          {{ content.productPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="被审核组织生产负责人邮箱">
          {{ content.productEmail }}
        </el-descriptions-item>
        <!--被审核组织研发负责人-->
        <el-descriptions-item label="被审核组织研发负责人姓名">
          {{ content.techName }}
        </el-descriptions-item>
        <el-descriptions-item label="被审核组织研发负责人手机号码">
          {{ content.techPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="被审核组织研发负责人邮箱">
          {{ content.techEmail }}
        </el-descriptions-item>
        <el-descriptions-item label="产品类别">
          {{ content.productType }}
        </el-descriptions-item>
        <el-descriptions-item label="其他">
          {{ content.other }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- <el-descriptions :column="1" border style="margin-top: 10px;">
         <template slot="title">
           <span>证书有效性</span>
         </template>
         <template slot="extra">
           <el-button
             type="primary"
             size="small"
             :disabled="planDisabled"
             @click="toAddCertificates"
           >添加证书
           </el-button>
         </template>
         &lt;!&ndash;新增/编辑数据弹窗&ndash;&gt;
         <el-descriptions-item label="证书列表">
           <el-table
             ref="table"
             v-loading="certificatesLoading"
             :data="certificates"
             style="width: 100%;"
             :row-class-name="cerRowClassName"
             @expand-change="expendCerSelected"
           >
             <el-table-column type="expand">
               &lt;!&ndash;添加审核体系证书附件&ndash;&gt;
               <template slot-scope="props">
                 &lt;!&ndash;也可启用下面注释部分的el-descriptions代替el-form&ndash;&gt;
                 <el-form label-position="left" class="demo-table-expand">
                   <el-form-item label="认证体系名称">
                     <span>{{ props.row.name }}</span>
                   </el-form-item>
                   <el-form-item label="认证机构">
                     <span>{{ props.row.sgs }}</span>
                   </el-form-item>
                   <el-form-item label="认证号码">
                     <span>{{ props.row.cerNum }}</span>
                   </el-form-item>
                   <el-form-item label="有效期">
                     <span>{{ props.row.validDate }}</span>
                   </el-form-item>
                   <el-form-item label="证书附件列表">
                     <el-table
                       ref="table"
                       v-loading="cerFilesLoading"
                       :data="cerFiles"
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
                             &lt;!&ndash;可下载文件&ndash;&gt;
                             <a
                               slot="reference"
                               :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.name"
                               class="el-link&#45;&#45;primary"
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
                               <i class="el-icon-document"/>
                             </div>
                           </el-image>
                         </template>
                       </el-table-column>
                       <el-table-column prop="size" label="大小" min-width="120"/>
                       <el-table-column prop="type" label="附件类型" min-width="120"/>
                       <el-table-column prop="createBy" label="创建者"/>
                       &lt;!&ndash;   编辑与删除   &ndash;&gt;
                       <el-table-column
                         label="操作"
                         min-width="130px"
                         align="center"
                         fixed="right"
                       >
                         <template slot-scope="scope">
                           <div>
                             &lt;!&ndash;删除&ndash;&gt;
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
                                   @click="deleteCerFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                       @click="toUploadFile(props.row)"
                     >上传证书附件
                     </el-button>
                   </el-form-item>
                 </el-form>
               </template>
             </el-table-column>
             <el-table-column prop="name" label="认证体系名称"/>
             <el-table-column prop="sgs" label="认证机构"/>
             <el-table-column prop="cerNum" label="认证号码"/>
             <el-table-column label="有效期" :formatter="validDateFormatter"/>
             <el-table-column prop="isOverdue" label="是否过期">
               <template slot-scope="scope">
                 {{ scope.row.isOverdue ? '是' : '否' }}
               </template>
             </el-table-column>
             <el-table-column prop="createBy" label="创建人"/>
             <el-table-column prop="createTime" label="创建时间"/>
             &lt;!&ndash;   编辑与删除   &ndash;&gt;
             <el-table-column
               label="操作"
               width="160px"
               align="center"
               fixed="right"
             >
               <template slot-scope="scope">
                 <div>
                   &lt;!&ndash;编辑&ndash;&gt;
                   <el-button
                     slot="reference"
                     v-permission="permission.edit"
                     size="mini"
                     type="primary"
                     icon="el-icon-edit"
                     @click="editCertificate(scope.row)"
                   />
                   &lt;!&ndash;删除&ndash;&gt;
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
                         @click="delCertificate(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
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
         </el-descriptions-item>
       </el-descriptions>-->
    </el-row>
    <!--审批报告-->
    <el-row class="box-card">
      <el-descriptions v-if="plan.status !=='计划'" style="margin-top: 15px;" title="审核报告信息" border>
        <el-descriptions-item label="审核结果">{{ report.result }}</el-descriptions-item>
        <el-descriptions-item label="分数">{{ report.score }}</el-descriptions-item>
        <el-descriptions-item label="改善报告提交期限">{{ report.reportDeadline }}</el-descriptions-item>
        <el-descriptions-item label="最终结案期限">{{ report.finalDeadline }}</el-descriptions-item>
        <el-descriptions-item label="追踪要求">{{ report.trailRequirement }}</el-descriptions-item>
      </el-descriptions>
    </el-row>
    <el-row class="box-card">
      <el-descriptions v-if="plan.status !=='计划'" style="margin-top: 15px;" title="审核问题信息" border>
        <!--新增/编辑数据弹窗-->
        <el-descriptions-item label="问题清单">
          <el-table
            ref="table"
            v-loading="questionLoading"
            :data="questions"
            style="width: 100%;"
            @expand-change="expendSelected"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-descriptions style="margin:10px 60px;" title="问题明细" :column="1" border>
                  <el-descriptions-item label="问题标题">{{ props.row.name }}</el-descriptions-item>
                  <el-descriptions-item label="是否重复出现">{{
                      props.row.isRepeat === true ? '是' : '否'
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item label="问题附件列表">
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
                              <i class="el-icon-document"/>
                            </div>
                          </el-image>
                        </template>
                      </el-table-column>
                      <el-table-column prop="size" label="大小" min-width="120"/>
                      <el-table-column prop="type" label="附件类型" min-width="120"/>
                      <el-table-column prop="createBy" label="创建者"/>
                    </el-table>
                  </el-descriptions-item>
                </el-descriptions>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="问题标题"/>
            <el-table-column prop="isRepeat" label="是否重复发生" :formatter="isRepeatFormat"/>
            <el-table-column prop="createBy" label="创建人"/>
            <el-table-column prop="createTime" label="创建时间"/>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-row>
  </div>
</template>

<script>
import {getAuditPlanByExample, getAuditPlanById} from '@/api/tools/auditPlan'
import {getAuditPlanFileByCond} from '@/api/tools/auditPlanFile'
import {validIsNotNull} from '@/utils/validationUtil'
import {getToken} from '@/utils/auth'
import {mapGetters} from 'vuex'
import {getPlanExecuteByPlanId} from '@/api/tools/auditPlanExecute'
import {getPlanReportByPlanId} from '@/api/tools/auditPlanReport'
import {getReportQuestionByReportId} from '@/api/tools/apReportQuestion'
import {getApQuestionFileByCond} from '@/api/tools/apQuestionFile'
import {getPlanTemplateByPlanId} from "@/api/tools/auditPlanTemplate";

export default {
  name: 'AuditTrail',
  components: {},
  // 设置数据字典
  // dicts: ['audit_template'],
  data() {
    return {
      cond: {
        approvalStatus: '已批准'
        // status: '进行'
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
      content: {},
      reportId: null,
      questionLoading: false,
      questions: [],
      questionFileLoading: false,
      questionFiles: [],
      quesId: null,
      reportTitle: null
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'apQuestionUploadApi'
    ])
  },
  created: function () {
    this.getPlanInfoByExample(this.cond)
  },
  mounted() {

  },
  methods: {
    // 获取计划列表
    getPlanInfoByExample(cond) {
      this.plans = []
      getAuditPlanByExample(cond).then(res => {
        this.plans = res
        if (res.length > 0) {
          this.planId = res[0].id
          this.templateId = res[0].templateId
          // 查询审核计划基本信息
          this.getPlanInfoByPlanId(this.planId)
          // 查询审核计划执行情况
          if (validIsNotNull(res[0].status) && res[0].status !== '计划') {
            this.getExecuteInfoByPlanId(this.planId)
            this.getReportInfoByPlanId(this.planId)
            if(res[0].templateType === 'VDA6.3') {
              this.getContentByPlanId(this.planId)
            }
          }
        }
      })
    },
    // 审核计划标识变更
    changePlanId(plan) {
      this.planId = plan.id
      this.templateId = plan.templateId
      this.getPlanInfoByPlanId(this.planId)
      if (validIsNotNull(plan.status) && plan.status !== '计划') {
        this.getExecuteInfoByPlanId(this.planId)
        this.getReportInfoByPlanId(this.planId)
        if(plan.templateType === 'VDA6.3') {
          this.getContentByPlanId(this.planId)
        }
      }
    },
    getPlanInfoByPlanId(id) {
      this.auditorDatas = []
      this.templateSelfFlag = false
      getAuditPlanById(id).then(res => {
        // alert(res.status)
        this.plan = res
        this.reportTitle = res.realName
        // alert(this.plan.status)
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
    getContentByPlanId(id) {
      getPlanTemplateByPlanId(id).then(res => {
        // alert(JSON.stringify(res))
        this.content = res.content
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
        // todo 获取报告中的问题列表
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
    // 获取该审核计划对应的附件
    getFilesByPlanId(planId) {
      this.planFiles = []
      this.planFileLoading = true
      getAuditPlanFileByCond(planId, 0).then(res => {
        // alert(JSON.stringify(res))
        this.planFileLoading = false
        this.planFiles = res
      }).catch(() => {
        this.planFileLoading = false
        this.$message({
          message: 'Get Files Failed! 获取审核计划附件失败!',
          type: 'error'
        })
      })
    },
    // 触发行展开事件
    expendSelected(row, expandedRows) {
      this.quesId = row.id
      // 查询问题点对应的附件列表信息
      this.getQuestionFileByQuestionId(row.id)
    },
    // 根据问题点查询对应的附件
    getQuestionFileByQuestionId(quesId) {
      // alert(JSON.stringify(this.quesId))
      // todo 查询问题点对应的附件列表信息
      this.questionFileLoading = true
      this.questionFiles = []
      getApQuestionFileByCond(quesId, 0).then(res => {
        // alert(JSON.stringify(res))
        this.questionFiles = res
        this.questionFileLoading = false
      })
    },
    // 导出报告
    savePdf() {
      const btn_save_pdf = document.getElementById('save_pdf')
      btn_save_pdf.style.display = 'none'
      setTimeout(() => {
        this.getPdf() // 分页导出
        // this.printPdf()  // 不分页导出
      }, 200)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin: 5px 0;
}

::v-deep .el-descriptions--small {
  font-size: 14px !important;
}

::v-deep .el-table--small {
  font-size: 14px !important;
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
</style>
