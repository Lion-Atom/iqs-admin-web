<template>
  <div class="app-container" @dblclick="back">
    <el-button
      id="save_pdf"
      type="primary"
      icon="el-icon-view"
      size="mini"
      style="position:fixed;top:20%;right:3%;z-index: 50;"
      @click="toCheckReport"
    >报告预览
    </el-button>
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
    <el-row class="box-card">
      <!--审核计划基本信息-->
      <el-descriptions border :column="4" title="审核计划基本信息">
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
      <!--审核计划附件信息-->
      <el-descriptions :column="1" border style="margin-top: 15px;" title="审核计划附件信息">
        <el-descriptions-item label="计划附件列表">
          <div>
            <el-table
              ref="table"
              v-loading="planFileLoading"
              :data="planFiles"
              style="width: 100%;"
            >
              <el-table-column prop="name" label="附件名称" min-width="300">
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
              <el-table-column prop="size" label="大小"/>
              <el-table-column prop="type" label="附件类型"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!--审核模板-->
    <el-row class="box-card">
      <!--自定义模板，直接上传相关附件-->
      <div v-if="templateSelfFlag">
        <!--自定义的模板-->
        <el-descriptions :column="1" border style="margin-top: 15px;" title="自定义模板附件信息">
          <el-descriptions-item label="自定义附件列表">
            <!--点击触发修改状态-->
            <div>
              <el-table
                ref="table"
                v-loading="fileLoading"
                :data="files"
                style="width: 100%;"
              >
                <el-table-column prop="name" label="附件名称" min-width="300">
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
                <el-table-column prop="size" label="大小"/>
                <el-table-column prop="type" label="附件类型"/>
                <el-table-column prop="createBy" label="创建者"/>
                <!--   编辑与删除   -->
                <!--                <el-table-column
                                  label="操作"
                                  min-width="130px"
                                  align="center"
                                  fixed="right"
                                >
                                  <template slot-scope="scope">
                                    <div>
                                      &lt;!&ndash;删除&ndash;&gt;
                                      <el-popover :ref="`delTemplateFile-popover-${scope.$index}`" v-permission="permission.edit"
                                                  placement="top"
                                                  width="180"
                                      >
                                        <p>确定删除这个附件吗？</p>
                                        <div style="text-align: right; margin: 0">
                                          <el-button size="mini" type="text"
                                                     @click="scope._self.$refs[`delTemplateFile-popover-${scope.$index}`].doClose()"
                                          >取消
                                          </el-button>
                                          <el-button
                                            type="primary"
                                            size="mini"
                                            @click="deleteFile(scope.row.id), scope._self.$refs[`delTemplateFile-popover-${scope.$index}`].doClose()"
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
                                </el-table-column>-->
              </el-table>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <!--自定义模板模块内容-->
        <el-descriptions :column="1" border style="margin-top: 15px;" title="自定义模板模块信息">
          <template slot="extra">
            <el-button
              v-if="selfTempData.length > 1"
              type="success"
              @click="editSelfTemplateScore"
            >
              提交得分
            </el-button>
          </template>
          <el-descriptions-item label="自定义模板数据">
            <!--点击触发修改状态-->
            <div>
              <el-table
                ref="table"
                v-loading="selfTempLoading"
                :data="selfTempData"
                style="width: 100%;"
                row-key="id"
                border
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <el-table-column prop="itemName" label="项目名称" min-width="100"/>
                <el-table-column prop="itemContent" label="项目内容" min-width="200"/>
                <el-table-column prop="itemScore" label="项目打分" align="center">
                  <template slot-scope="scope">
                    <!--<el-input
                      v-if="scope.row.pid"
                      v-model="scope.row.itemScore"
                      placeholder="请输入项目得分"
                      style="width: 93%;"
                      @input="itemScoreChange(scope.row)"
                    />
                    <span v-else>/</span>-->
                    <el-input
                      v-model="scope.row.itemScore"
                      placeholder="请输入项目得分"
                      style="width: 93%;"
                      @input="itemScoreChange(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="createBy" label="创建者"/>
              </el-table>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!--固定模板，根据配套模板类型取不同的模板-->
      <div v-else-if="plan.templateType === 'VDA6.3'">
        <v-d-a-template
          v-if="destroyTemplateData === true"
          :plan-id="planId"
          :template-id="templateId"
          :disabled="execabled"
          @func="flushReport"
        />
      </div>
    </el-row>
    <!--审核执行-->
    <el-row class="box-card" style="margin-top: 20px;">
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
        <el-descriptions-item
          v-if="plan.status ==='计划'"
          label="操作执行"
        >
          <a style="color: #00a0e9" @click="createExecute">开始执行</a>
        </el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!--审批报告-->
    <el-row class="box-card">
      <el-descriptions v-if="plan.status !=='计划'" style="margin-top: 15px;" border>
        <template slot="title">
          <div>
            <span>审核报告信息
              <el-button
                v-if="reportChanged === true"
                type="text"
                icon="el-icon-refresh-left"
                @click="refreshReport"
              />
            </span>
          </div>
        </template>
        <template slot="extra">
          <el-button
            :disabled="reportChanged === false"
            type="primary"
            size="small"
            @click="savePlanReport"
          >保存
          </el-button>
          <el-button
            v-if="plan.templateType === 'VDA6.3'"
            :loading="downloadReportLoading"
            :disabled="!reportIsFinished"
            class="filter-item"
            size="small"
            type="warning"
            icon="el-icon-download"
            @click="toExportReport"
          >导出
          </el-button>
        </template>
        <el-descriptions-item label="审核结果">
          <el-input
            v-if="resultInputVisible"
            ref="reportResultInput"
            v-model="inputResultValue"
            size="mini"
            placeholder="请输入内容"
            suffix-icon="el-icon-edit"
            @keyup.enter.native="handleInputResultConfirm"
            @blur="handleInputResultConfirm"
          />
          <el-button
            v-else
            type="text"
            style="padding: 0 !important;font-size: 12px !important;"
            icon="el-icon-edit"
            @click.native="resultChange"
          >
            {{ report.result }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="分数">
          <div v-if="plan.templateType === 'VDA6.3'">
            <el-input
              v-if="scoreInputVisible"
              ref="reportScoreInput"
              v-model="inputScoreValue"
              size="mini"
              :min="0"
              :max="10"
              :precision="2"
              placeholder="请输入内容"
              suffix-icon="el-icon-edit"
              @change="handleInputScoreConfirm"
              @blur="handleInputScoreConfirm"
            />
            <!--<el-button
              v-else
              type="text"
              style="padding: 0 !important;font-size: 12px !important;"
              icon="el-icon-edit"
              @click.native="scoreChange"
            >-->
            <el-button
              v-else
              type="text"
              style="padding: 0 !important;font-size: 12px !important;"
              icon="el-icon-edit"
              disabled
            >
              {{ report.score }}
            </el-button>
          </div>
          <div v-else>
            <el-input
              v-if="scoreInputVisible"
              ref="reportScoreInput"
              v-model="inputScoreValue"
              size="mini"
              type="number"
              :min="0"
              :max="100"
              placeholder="请输入内容"
              suffix-icon="el-icon-edit"
              @change="handleInputScoreConfirm"
              @blur="handleInputScoreConfirm"
            />
            <el-button
              v-else
              type="text"
              style="padding: 0 !important;font-size: 12px !important;"
              icon="el-icon-edit"
              @click.native="scoreChange"
            >
              {{ report.score }}
            </el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="改善报告提交期限">
          <el-date-picker
            v-if="rDeadlineInputVisible"
            ref="rDeadlineInput"
            v-model="inputRDeadlineValue"
            type="datetime"
            size="mini"
            default-time="12:00:00"
            placeholder="选择改善报告提交日期时间"
            suffix-icon="el-icon-date"
            @keyup.enter.native="handleInputRDeadlineConfirm"
            @blur="handleInputRDeadlineConfirm"
          />
          <el-button
            v-else
            type="text"
            style="padding: 0 !important;font-size: 12px !important;"
            icon="el-icon-edit"
            @click.native="rDeadlineChange"
          >
            {{ report.reportDeadline }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="最终结案期限">
          <el-date-picker
            v-if="fDeadlineInputVisible"
            ref="fDeadlineInput"
            v-model="inputFDeadlineValue"
            type="datetime"
            size="mini"
            default-time="12:00:00"
            placeholder="请选择最终结案期限日期时间"
            suffix-icon="el-icon-date"
            @keyup.enter.native="handleInputFDeadlineConfirm"
            @blur="handleInputFDeadlineConfirm"
          />
          <el-button
            v-else
            type="text"
            style="padding: 0 !important;font-size: 12px !important;"
            icon="el-icon-edit"
            @click.native="fDeadlineChange"
          >
            {{ report.finalDeadline }}
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="追踪要求">
          <el-input
            v-if="requireInputVisible"
            ref="reportRequireInput"
            v-model="inputRequireValue"
            size="mini"
            type="textarea"
            maxlength="500"
            show-word-limit
            autosize
            placeholder="请输入内容"
            suffix-icon="el-icon-edit"
            @blur="handleInputRequireConfirm"
          />
          <el-button
            v-else
            class="myBtn"
            type="text"
            style="padding: 0 !important;font-size: 12px !important;display: inline-block;"
            icon="el-icon-edit"
            @click.native="requireChange"
          >
            {{ report.trailRequirement }}
          </el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-if="" :column="1" :colon="false">
        <el-descriptions-item><i style="color: red;">* </i>只有提交审核报告才能开启【审核追踪】流程</el-descriptions-item>
      </el-descriptions>
      <el-descriptions v-if="plan.status !=='计划'" style="margin-top: 15px;" title="审核问题信息" border>
        <template slot="extra">
          <el-button
            type="primary"
            size="small"
            @click="toAddQuestion"
          >添加问题点
          </el-button>
          <el-button
            :loading="downloadQuesLoading"
            :disabled="!questions.length"
            class="filter-item"
            size="small"
            type="warning"
            icon="el-icon-download"
            @click="toExportQuestion"
          >导出
          </el-button>
        </template>
        <!--新增/编辑数据弹窗-->
        <el-descriptions-item label="问题清单">
          <el-table
            ref="quesTable"
            v-loading="questionLoading"
            :data="questions"
            style="width: 100%;"
            @expand-change="expendSelected"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <!--也可启用下面注释部分的el-descriptions代替el-form-->
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
                              <i class="el-icon-document"/>
                            </div>
                          </el-image>
                        </template>
                      </el-table-column>
                      <el-table-column prop="size" label="大小" min-width="120"/>
                      <el-table-column prop="type" label="附件类型" min-width="120"/>
                      <el-table-column prop="createBy" label="创建者"/>
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
                                  @click="deleteQuestionFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                    >上传问题附件
                    </el-button>
                  </el-form-item>
                </el-form>
                <!--              <el-descriptions style="margin:10px 60px;" title="问题明细" :column="1" border>
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
                                    >
                                    </el-table-column>
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
                                                @click="deleteQuestionFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                                  >上传问题附件
                                  </el-button>
                                </el-descriptions-item>
                              </el-descriptions>-->
              </template>
            </el-table-column>
            <el-table-column prop="name" label="问题标题"/>
            <!--            <el-table-column prop="isRepeat" label="是否重复发生" :formatter="isRepeatFormat" />-->
            <el-table-column prop="createBy" label="创建人"/>
            <el-table-column prop="createTime" label="创建时间"/>
            <!--   编辑与删除   -->
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
                    @click="editQuestion(scope.row)"
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
                        @click="delQuestion(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
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
      </el-descriptions>
    </el-row>
    <!--上传问题对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="quesFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadQuestionFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleQuestionFileSuccess"
          :on-error="handleError"
          :action="apQuestionUploadApi + '?quesId=' + quesId + '&actId=' + 0 "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ uploadDiaTitle }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitQuesFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--问题新增/编辑弹窗-->
    <el-dialog
      :title="questionOperationTitle"
      :visible.sync="addQuestionVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="questionForm"
        :model="questionForm"
        :rules="questionRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          label="问题标题"
          prop="name"
        >
          <el-input
            v-model="questionForm.name"
            maxlength="30"
            show-word-limit
            style="width: 320px;"
          />
        </el-form-item>
        <!--        <el-form-item label="是否重复发生" prop="isRepeat" required>
                  <el-select
                    v-model="questionForm.isRepeat"
                    size="small"
                    placeholder="是/否"
                    class="filter-item"
                    style="width: 320px;"
                  >
                    <el-option
                      v-for="item in resultTypeOptions"
                      :key="item.key"
                      :label="item.display_name"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOperation">取 消</el-button>
        <el-button type="primary" @click="submitQuestion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getAuditPlanByExampleV2, getAuditPlanById} from '@/api/tools/auditPlan'
import {delAuditPlanFile, getAuditPlanFileByCond} from '@/api/tools/auditPlanFile'
import {GMTToDate, GMTToStr, judgeIsEqual, validIsNotNull} from '@/utils/validationUtil'
import {getToken} from '@/utils/auth'
import {mapGetters} from 'vuex'
import {getPlanTemplateByPlanId} from '@/api/tools/auditPlanTemplate'
import {addExecute, getPlanExecuteByPlanId} from '@/api/tools/auditPlanExecute'
import {editPlanReport, getPlanReportByPlanId} from '@/api/tools/auditPlanReport'
import {add, del, edit, getReportQuestionByReportId} from '@/api/tools/apReportQuestion'
import {delApQuestionFile, getApQuestionFileByCond} from '@/api/tools/apQuestionFile'
import VDATemplate from '@/views/tools/audit/plan/module/VDA.template'
import {editSelfTemplate, getTreeByTemplateId} from '@/api/tools/selfTemplate'
import {downloadFile} from "@/utils";
import {download} from "@/api/data";

export default {
  name: 'PlanExecute',
  components: {VDATemplate},
  // 设置数据字典
  // dicts: ['audit_template'],
  data() {
    return {
      cond: {
        approvalStatus: '已批准',
        statusList: ['计划','进行']
      },
      destroyVDAData: false,
      plans: [],
      planId: null,
      templateId: null,
      loading: false,
      fileLoading: false,
      files: [],
      planFiles: [],
      planFileLoading: false,
      templateSelfFlag: false,
      plan: {},
      headers: {
        'Authorization': getToken()
      },
      permission: {
        edit: ['admin', 'plan:edit']
      },
      auditors: [],
      auditorDatas: [],
      filesVisible: false,
      fileUploadVisible: false,
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
      resultInputVisible: false,
      inputResultValue: '',
      oldResult: null,
      resultChanged: false,
      scoreInputVisible: false,
      inputScoreValue: '',
      oldScore: null,
      scoreChanged: false,
      requireInputVisible: false,
      inputRequireValue: '暂无',
      oldRequire: null,
      requireChanged: false,
      rDeadlineInputVisible: false,
      inputRDeadlineValue: '',
      oldRDeadline: null,
      rDeadlineChanged: false,
      fDeadlineInputVisible: false,
      inputFDeadlineValue: '',
      oldFDeadline: null,
      fDeadlineChanged: false,
      reportChanged: false,
      questionLoading: false,
      questions: [],
      questionForm: {
        name: null,
        isRepeat: false
      },
      questionRules: {
        name: [
          {required: true, message: '请输入存在的问题标题', trigger: 'blur'}
        ],
        isRepeat: [
          {required: true, message: '请确认是否是重复性问题', trigger: 'blur'}
        ]
      },
      resultTypeOptions: [
        {key: true, display_name: '是'},
        {key: false, display_name: '否'}
      ],
      addQuestionVisible: false,
      questionOperationTitle: '',
      questionFileLoading: false,
      questionFiles: [],
      quesFileUploadVisible: false,
      quesId: null,
      uploadDiaTitle: '上传问题相关附件',
      oldTitle: '',
      oldIsRepeat: false,
      execStatusDict: [
        '进行',
        '追踪'
        // "结案"
      ],
      execabled: true,
      destroyTemplateData: true,
      selfTempLoading: false,
      selfTempData: [],
      downloadQuesLoading: false,
      downloadReportLoading: false,
      reportIsFinished: false,
      scores: [],
      scoreDatas: []
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
      this.scoreDatas = []
      this.plans = []
      getAuditPlanByExampleV2(cond).then(res => {
        this.plans = res
        if (res.length > 0) {
          const i = res.length - 1
          this.planId = res[i].id
          this.templateId = res[i].templateId
          // 查询审核计划自定义模板信息
          this.getSelfTempsByTemplateId(this.templateId)
          // 查询审核计划基本信息
          this.getPlanInfoByPlanId(this.planId)
          // 查询自定义模板附件信息
          this.getFilesByCond(this.planId, this.templateId)
          // 查询审核计划自身附件信息
          this.getFilesByPlanId(this.planId)
          // 查询审核计划模板信息
          this.getTemplateByPlanId(this.planId)
          // 查询审核计划执行情况
          if (validIsNotNull(res[i].status) && res[i].status !== '计划') {
            this.getExecuteInfoByPlanId(this.planId)
            this.getReportInfoByPlanId(this.planId)
          }
        }
      })
    },
    // 审核计划标识变更
    changePlanId(plan) {
      this.planId = plan.id
      this.templateId = plan.templateId
      // 销毁子组件，而后重新渲染
      this.destroyTemplateData = false
      this.$nextTick(() => {
        this.destroyTemplateData = true
      })
      this.getPlanInfoByPlanId(this.planId)
      this.getFilesByCond(this.planId, this.templateId)
      this.getFilesByPlanId(this.planId)
      this.getTemplateByPlanId(this.planId)
      if (validIsNotNull(plan.status) && plan.status !== '计划') {
        this.getExecuteInfoByPlanId(this.planId)
        this.getReportInfoByPlanId(this.planId)
      }
      // 查询审核计划自定义模板信息
      this.getSelfTempsByTemplateId(this.templateId)
    },
    getSelfTempsByTemplateId(id) {
      this.selfTempLoading = true
      getTreeByTemplateId(id).then(res => {
        this.selfTempData = res
        this.selfTempLoading = false
      })
    },
    getPlanInfoByPlanId(id) {
      this.auditorDatas = []
      this.templateSelfFlag = false
      getAuditPlanById(id).then(res => {
        // todo 后续还得添加对其他模板的判断，当前仅有'VDA6.3'
        if (validIsNotNull(res.templateType) &&
          res.templateType !== 'VDA6.3') {
          this.templateSelfFlag = true
        }
        // alert(this.templateSelfFlag)
        // alert(res.status)
        this.plan = res
        this.plan.planTime = validIsNotNull(res.planTime) ? GMTToDate(res.planTime) : ''
        // alert(this.plan.status)
        if (res.status) {
          if (this.execStatusDict.indexOf(this.plan.status) >= 0) {
            this.execabled = false
          }
        }
        if (res.auditors.length > 0) {
          this.auditorDatas = res.auditors
        }
      })
    },
    // 查询审核计划模板信息
    getTemplateByPlanId(id) {
      getPlanTemplateByPlanId(id).then(res => {
        // alert(JSON.stringify(res))
      })
    },
    // 查询审核计划执行信息
    getExecuteInfoByPlanId(id) {
      getPlanExecuteByPlanId(id).then(res => {
        // alert(JSON.stringify(res))
        console.log(res)
        this.execute = res
      })
    },
    // 查询审核计划报告信息
    getReportInfoByPlanId(planId) {
      getPlanReportByPlanId(planId).then(res => {
        // alert(JSON.stringify(res))
        this.report = res
        this.reportId = res.id
        this.judgeReportIsFinished()
        this.oldResult = res.result
        this.oldScore = res.score
        this.oldRequire = res.trailRequirement
        this.oldRDeadline = res.reportDeadline
        this.oldFDeadline = res.finalDeadline
        // todo 获取报告中的问题列表
        this.getReportQuestionsByReportId(res.id)
      })
    },
    // 保存得分后刷新报告信息
    flushReport(msg) {
      if (msg) {
        // alert(msg)
        this.getReportInfoByPlanId(this.planId)
      }
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
    // 监控报告结果信息
    resultChange() {
      // todo 如果是系统自带模板（当前是VDA6.3），需要验证是否提交了【问题清单】
      // alert("即将输入审核结果")
      this.resultInputVisible = true
      this.inputResultValue = validIsNotNull(this.report.result) ? this.report.result : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.reportResultInput.$refs.input.focus()
      })
    },
    // 结果变更监控
    handleInputResultConfirm() {
      // alert(this.inputResultValue)
      this.resultChanged = !judgeIsEqual(this.inputResultValue, this.oldResult)
      this.report.result = this.inputResultValue.trim()
      this.resultInputVisible = false
      this.judgeReportChanged()
    },
    // 监控报告结果信息
    scoreChange() {
      this.scoreInputVisible = true
      this.inputScoreValue = this.report.score
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.reportScoreInput.$refs.input.focus()
      })
    },
    // 结果变更监控
    handleInputScoreConfirm() {
      // alert(this.inputScoreValue)
      this.scoreChanged = !judgeIsEqual(this.inputScoreValue, this.oldScore)
      this.report.score = this.inputScoreValue
      this.scoreInputVisible = false
      /* const inputValue = this.inputScoreValue
       this.report.score = inputValue
       if (validIsNotNull(inputValue)) {
         this.scoreInputVisible = false
       } else {
         this.$message({
           message: 'Submit Failed! 审核分数不可为空!',
           type: 'warning'
         })
       }*/
      this.judgeReportChanged()
    },
    // 追踪要求信息
    requireChange() {
      this.requireInputVisible = true
      this.inputRequireValue = validIsNotNull(this.report.trailRequirement) ? this.report.trailRequirement : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.reportRequireInput.focus()
      })
    },
    // 追踪要求变更监控
    handleInputRequireConfirm() {
      // alert(validIsNotNull(this.inputRequireValue))
      this.requireChanged = !judgeIsEqual(this.inputRequireValue, this.oldRequire)
      this.report.trailRequirement = this.inputRequireValue.trim()
      this.requireInputVisible = false
      this.judgeReportChanged()
    },
    // 改善报告提交期限信息
    rDeadlineChange() {
      this.rDeadlineInputVisible = true
      this.inputRDeadlineValue = validIsNotNull(this.report.reportDeadline) ? this.report.reportDeadline : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.rDeadlineInput.focus()
      })
    },
    // 改善报告提交期限监控
    handleInputRDeadlineConfirm() {
      // alert(GMTToStr(this.inputRDeadlineValue))
      this.rDeadlineChanged = !judgeIsEqual(GMTToStr(this.inputRDeadlineValue), this.oldRDeadline)
      this.report.reportDeadline = GMTToStr(this.inputRDeadlineValue)
      this.rDeadlineInputVisible = false
      this.judgeReportChanged()
    },
    // 改善报告提交期限信息
    fDeadlineChange() {
      this.fDeadlineInputVisible = true
      this.inputFDeadlineValue = validIsNotNull(this.report.finalDeadline) ? this.report.finalDeadline : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.fDeadlineInput.focus()
      })
    },
    // 改善报告提交期限监控
    handleInputFDeadlineConfirm() {
      // alert(this.inputResultValue)
      this.fDeadlineChanged = !judgeIsEqual(GMTToStr(this.inputFDeadlineValue), this.oldFDeadline)
      this.report.finalDeadline = GMTToStr(this.inputFDeadlineValue)
      this.fDeadlineInputVisible = false
      this.judgeReportChanged()
    },
    // 监控审核报告变化
    judgeReportChanged() {
      this.reportChanged = this.resultChanged === true || this.scoreChanged === true ||
        this.requireChanged === true || this.rDeadlineChanged === true || this.fDeadlineChanged === true
    },
    // 回滚操作
    refreshReport() {
      this.getReportInfoByPlanId(this.planId)
      this.resultChanged = false
      this.scoreChanged = false
      this.requireChanged = false
      this.rDeadlineChanged = false
      this.fDeadlineChanged = false
      this.reportChanged = false
    },
    // 判断报告是否完整
    judgeReportIsFinished() {
      this.reportIsFinished = validIsNotNull(this.report.result) && validIsNotNull(this.report.score) &&
        validIsNotNull(this.report.trailRequirement) && validIsNotNull(this.report.reportDeadline) &&
        validIsNotNull(this.report.finalDeadline);
    },
    // 保存审核报告信息
    savePlanReport() {
      // alert(JSON.stringify(this.report))
      // 确保各项不为空
      // this.reportRules()
      if (!this.reportChanged) {
        this.$message({
          message: 'Submit No Needed! 没检测到报告信息有任何变化，无需重复提交!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      }
      if (!validIsNotNull(this.report.result)) {
        this.$message({
          message: 'Submit Failed! 审核报告结果内容不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.report.score)) {
        this.$message({
          message: 'Submit Failed! 审核报告分数不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.report.trailRequirement)) {
        this.$message({
          message: 'Submit Failed! 审核报告追踪要求不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.report.reportDeadline)) {
        this.$message({
          message: 'Submit Failed! 审核报告改善报告提交时间不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.report.finalDeadline)) {
        this.$message({
          message: 'Submit Failed! 审核报告最终结案期限不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      }
      editPlanReport(this.report).then(res => {
        this.$message({
          message: 'Submit Success! 提交审核报告称!',
          type: 'success'
        })
        this.refreshReport()
      }).catch(() => {
        this.refreshReport()
      })
    },
    toAddQuestion() {
      this.questionForm = {}
      this.questionOperationTitle = '新增问题'
      this.addQuestionVisible = true
    },
    // 导出审核对应的问题点
    toExportQuestion() {
      this.downloadQuesLoading = true
      download('api/planReportQuestion/exportByReportId', {reportId: this.reportId}).then(result => {
        downloadFile(result, this.plan.realName + '问题点', 'xlsx')
        this.downloadQuesLoading = false
      }).catch(() => {
        this.downloadQuesLoading = false
      })
    },
    // 导出VDA报告
    toExportReport() {
      this.downloadReportLoading = true
      download('api/auditPlanReport/exportByPlanId', {planId: this.planId}).then(result => {
        downloadFile(result, this.plan.realName + '报告信息', 'xlsx')
        this.downloadReportLoading = false
      }).catch(() => {
        this.downloadReportLoading = false
      })
    },
    // 编辑问题
    editQuestion(row) {
      this.questionForm = row
      this.questionOperationTitle = '编辑问题'
      this.addQuestionVisible = true
      this.oldTitle = row.name
      this.oldIsRepeat = row.isRepeat
    },
    // 删除问题
    delQuestion(id) {
      const data = []
      data.push(id)
      del(data).then(res => {
        this.$message({
          message: 'Del Question Success! 删除问题成功!',
          type: 'success'
        })
        this.getReportQuestionsByReportId(this.reportId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除问题失败!',
          type: 'error'
        })
      })
    },
    // 关闭弹窗前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.getReportQuestionsByReportId(this.reportId)
        })
        .catch(_ => {
        })
    },
    cancelOperation() {
      this.addQuestionVisible = false
      this.getReportQuestionsByReportId(this.reportId)
    },
    // 提交保存问题
    submitQuestion() {
      // alert(judgeIsEqual(this.oldTitle, this.questionForm.name))
      if (judgeIsEqual(this.oldTitle, this.questionForm.name.trim()) && judgeIsEqual(this.oldIsRepeat, this.questionForm.isRepeat)) {
        this.$message({
          message: 'No Changes Found! 未检测到改动，无需重复提交!',
          type: 'warning'
        })
        return false
      }
      this.$refs.questionForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.questionForm.planReportId = this.reportId
          // 根据标识判断新增/编辑
          if (!validIsNotNull(this.questionForm.id)) {
            // alert("这是新增")
            add(this.questionForm).then(res => {
              this.$message({
                message: 'Add Question Success! 新增问题成功!',
                type: 'success'
              })
              this.getReportQuestionsByReportId(this.reportId)
            })
          } else {
            // 编辑问题
            edit(this.questionForm).then(res => {
              this.$message({
                message: 'Edit Question Success! 更改问题记录成功!',
                type: 'success'
              })
              this.getReportQuestionsByReportId(this.reportId)
            })
          }
          this.addQuestionVisible = false
        }
      })
    },
    // 创建报告保存规则校验
    reportRules() {
      if (!validIsNotNull(this.report.result)) {
        this.$message({
          message: 'Submit Failed! 审核报告结果内容不可为空!',
          type: 'warning'
        })
        return false
      }
      if (!validIsNotNull(this.report.score)) {
        this.$message({
          message: 'Submit Failed! 审核报告分数不可为空!',
          type: 'warning'
        })
        return false
      }
      if (!validIsNotNull(this.report.trailRequirement)) {
        this.$message({
          message: 'Submit Failed! 审核报告追踪要求不可为空!',
          type: 'warning'
        })
        return false
      }
      if (!validIsNotNull(this.report.reportDeadline)) {
        this.$message({
          message: 'Submit Failed! 审核报告改善报告提交时间不可为空!',
          type: 'warning'
        })
        return false
      }
      if (!validIsNotNull(this.report.finalDeadline)) {
        this.$message({
          message: 'Submit Failed! 审核报告最终结案期限不可为空!',
          type: 'warning'
        })
        return false
      }
    },
    // 创建审核计划执行
    createExecute() {
      this.$confirm('激活执行后计划不可再更改？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes 确认激活',
        cancelButtonText: 'Wait 再等等'
      })
        .then(() => {
          const obj = {}
          obj.userId = this.user.id
          obj.planId = this.planId
          // todo 系统V6.3模板可能需要传入审核结果和分数
          /* obj.result = this.result
          obj.score = this.score*/
          addExecute(obj).then(res => {
            this.$message({
              message: 'Execute Success! 激活执行成功!',
              type: 'success'
            })
            // 刷新全局
            this.execabled = false
            this.getPlanInfoByPlanId(this.planId)
            this.getExecuteInfoByPlanId(this.planId)
            // 销毁子组件，而后重新渲染
            this.destroyTemplateData = false
            this.$nextTick(() => {
              this.destroyTemplateData = true
            })
          })
        })
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
      const _this = this
      if (expandedRows.length > 1) {
        _this.expands = []
        if (row) {
          _this.expands.push(row)
        }
        _this.$refs.quesTable.toggleRowExpansion(expandedRows[0])
      } else {
        _this.expands = []
      }
      _this.quesId = row.id
      // 查询问题点对应的附件列表信息
      _this.getQuestionFileByQuestionId(row.id)
    },
    // 准备上传问题对应的文件
    toUploadFile(row) {
      this.quesFileUploadVisible = true
      // this.uploadDiaTitle = '上传['+row.name+']相关附件'
      this.uploadDiaTitle = row.name
    },
    // 上传附件之前判断
    beforeUpload: function (file) {
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
      this.$refs.uploadQuestionFile.submit()
    },
    // 监听问题对应的附件上传成功
    handleQuestionFileSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.uploadQuestionFile.clearFiles()
      this.getQuestionFileByQuestionId(this.quesId)
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
    // 删除问题点对应的附件
    deleteQuestionFile(row) {
      const data = []
      data.push(row.id)
      delApQuestionFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getQuestionFileByQuestionId(row.reportQuestionId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件失败!',
          type: 'error'
        })
      })
    },
    // 获取审核模板对应的附件
    getFilesByCond(planId, templateId) {
      this.files = []
      this.fileLoading = true
      getAuditPlanFileByCond(planId, templateId).then(res => {
        this.fileLoading = false
        this.files = res
      }).catch(() => {
        this.fileLoading = false
        this.$message({
          message: 'Get Files Failed! 获取自定义模板下附件失败!',
          type: 'error'
        })
      })
    },
    // 删除模板附件
    deleteFile(id) {
      const data = []
      data.push(id)
      delAuditPlanFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除自定义模板附件成功!',
          type: 'success'
        })
        this.getFilesByCond(this.planId, this.templateId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除自定义模板附件失败!',
          type: 'error'
        })
      })
    },
    // 根据有效期设置提醒样式
    tableRowClassName({row, rowIndex}) {
      if (!validIsNotNull(row.pid)) {
        return 'hr-row'
      }
    },
    // todo 监控分数变化同步模块总分变化
    itemScoreChange(row) {
      // alert(JSON.stringify(row.itemScore))
      /*if (this.scores.indexOf(row.id) > -1) {
        this.scoreDatas.forEach((data,index)=>{
          if(data.id === row.id) {
            if(validIsNotNull(data.itemScore)){

            } else {

            }
          }
        })
      } else {
        this.scores.push(row.id)
        this.scoreDatas.push(row)
      }*/
      this.scoreDatas.push(row)
      // alert(this.scoreDatas.length)
    },
    // 保存更新自定义模板信息
    editSelfTemplateScore() {
      // alert(JSON.stringify(this.selfTempData))
      // 树结构转化为常规arr,此处曲线救国；通过监控变化保存有分数的项目，其他不动
      if (this.scoreDatas.length === 0) {
        this.$message({
          message: 'No Score Changed! 分数没有发生变动，无需提交!',
          type: 'warning'
        })
        return false
      }
      editSelfTemplate(this.scoreDatas).then(res => {
        this.$message({
          message: 'Update SelfTemplate Success! 自定义模板信息更新成功!',
          type: 'success'
        })
      })
    },
    // 跳转选择
    back() {
      // todo 暂时注释，方便调试
      /* this.$confirm('回到审核计划列表？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes 回到列表',
        cancelButtonText: 'Wait 再看看'
      })
        .then(() => {
          this.$router.push(
            {
              path: '/audit/plan',
              query: {}
            }
          )
        })*/
    },
    // 审核报告预览
    toCheckReport() {
      this.$confirm('预览审核报告？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Yes 预览报告',
        cancelButtonText: 'Wait 留在本页'
      })
        .then(() => {
          this.$router.push(
            {
              path: '/plan/report',
              query: {}
            }
          )
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

.el-button--text {
  color: #606266 !important;
}

.button-new-tag {
  margin-left: 5px;
  //height: 24px;
  line-height: 22px;
  padding: 0 8px;
}

.tag-group > > .el-input--small .el-input__inner {
  width: 90px;
  height: 24px !important;
  line-height: 22px;
  padding: 0 8px;
  vertical-align: bottom;
}

.tag-list {
  margin-right: 5px !important;
  text-align: left !important;
  //line-height: 1.5 !important;
  display: inline-block !important;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

.myBtn {
  word-wrap: break-word !important;
  word-break: break-all !important;
  white-space: normal !important;
}
</style>
