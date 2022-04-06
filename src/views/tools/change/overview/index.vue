<template>
  <div @dblclick="operationConfirm">
    <div class="app-container" id="changeCanvas" ref="changeCanvas">
      <div class="xItem">
        <!--      <h2 style="text-align:center;">{{ changeForm.name + '信息' }}</h2>-->
      </div>
      <!--起草信息-->
      <!--识别信息-->
      <div class="xItem">
        <el-descriptions title="识别信息" :column="3">
          <el-descriptions-item label="变更原因">{{ transToNullFormat(changeForm.reason) }}</el-descriptions-item>
          <el-descriptions-item label="变更来源">{{ transToNullFormat(changeForm.source) }}</el-descriptions-item>
          <el-descriptions-item label="变更状态"><span style="color: red;">{{ transToNullFormat(changeForm.status) }}</span></el-descriptions-item>

          <el-descriptions-item label="发起人">{{ transToNullFormat(changeForm.initiator) }}</el-descriptions-item>
          <el-descriptions-item label="发起部门">{{ transToNullFormat(changeForm.department) }}</el-descriptions-item>
          <el-descriptions-item label="发起时间">{{ transToNullFormat(changeForm.initTime) }}</el-descriptions-item>

          <el-descriptions-item label="涉及地域">{{ transToNullFormat(changeForm.area) }}</el-descriptions-item>
          <el-descriptions-item label="涉及部门">{{ transToNullFormat(changeForm.depart) }}</el-descriptions-item>
          <el-descriptions-item label="涉及项目">{{ transToNullFormat(changeForm.project) }}</el-descriptions-item>

          <el-descriptions-item label="涉及产品">{{ transToNullFormat(changeForm.production) }}</el-descriptions-item>
          <el-descriptions-item label="费用评估">{{ transToNullFormat(changeForm.cost) }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <!--分类信息-->
      <div class="xItem">
        <el-descriptions title="分类信息"></el-descriptions>
        <el-descriptions :column="1">
          <!--因素表-->
          <el-descriptions-item label="主要因素" content-class-name="table_content">
            <el-table
              ref="refTable"
              border
              v-loading="changeFactorsLoading"
              :data="changeFactors"
              style="width: 100%;"
            >
              <el-table-column prop="name" label="主要因素标题" min-width="150"/>
              <el-table-column label="变更类型" min-width="80">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.type === '重大变更' ? 'warning' : 'success'"
                    disable-transitions>{{ scope.row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createBy" label="创建人" min-width="80" />
              <el-table-column prop="createTime" label="创建时间" min-width="150" />
            </el-table>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="3">
          <el-descriptions-item label="是否客户要求">{{ boolToNullFormat(changeForm.isCustomer) }}</el-descriptions-item>
          <el-descriptions-item v-if="!changeForm.isCustomer" label="备注">{{ transToNullFormat(changeForm.remark) }}</el-descriptions-item>
          <el-descriptions-item v-if="changeForm.isCustomer" label="客户邮箱">{{ transToNullFormat(changeForm.email) }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions>
          <el-descriptions-item v-if="changeForm.isCustomer" label="客户要求" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="cusFilesLoading"
              border
              :data="cusFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!--分析信息-->
      <div class="xItem">
        <el-descriptions title="分析信息" :column="1">
          <el-descriptions-item label="风险评估" content-class-name="table_content">
            <el-table
              v-loading="riskAssessFilesLoading"
              border
              :data="riskAssessFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="变更范围">{{ transToNullFormat(changeForm.scope) }}</el-descriptions-item>
          <el-descriptions-item label="文档变更" content-class-name="table_content" v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(docChangeType) > -1">
            <el-table
              ref="table"
              v-loading="docChangeFilesLoading"
              border
              :data="docChangeFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="过程变更" content-class-name="table_content" v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(processChangeType) > -1">
            <el-table
              ref="table"
              v-loading="processChangeFilesLoading"
              border
              :data="processChangeFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="工具变更" content-class-name="table_content" v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(toolChangeType) > -1">
            <el-table
              ref="table"
              v-loading="toolChangeFilesLoading"
              border
              :data="toolChangeFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="其它变更" content-class-name="table_content" v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(otherChangeType) > -1">
            <el-table
              ref="table"
              v-loading="otherChangeFilesLoading"
              border
              :data="otherChangeFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="有无客户协议">{{ havToNullFormat(changeForm.havAgreement) }}</el-descriptions-item>
          <el-descriptions-item v-if="changeForm.havAgreement" label="客户协议" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="agreeFilesLoading"
              border
              :data="agreeFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!--确认/创建-->
      <div class="xItem">
        <el-descriptions title="确认/创建" :column="3">
          <el-descriptions-item label="审批部门">{{ transToNullFormat(changeForm.approveDepart) }}</el-descriptions-item>
          <el-descriptions-item label="审批人">{{ transToNullFormat(changeForm.approveBy) }}</el-descriptions-item>

          <el-descriptions-item label="有无评估报告">{{ havToNullFormat(changeForm.havReport) }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1">
          <el-descriptions-item v-if="changeForm.havReport"  label="评估报告" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="evReportFilesLoading"
              border
              :data="evReportFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="是否同意">{{ boolToNullFormat(changeForm.isAccepted) }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <!--变更管理-->
      <!--变更管理-->
      <div class="xItem">
        <el-descriptions title="变更管理" :column="3">
          <el-descriptions-item label="零件图纸">{{ transToNullFormat(manageForm.partDrawing) }}</el-descriptions-item>
          <el-descriptions-item label="文档/作业程序/指导书">{{ transToNullFormat(manageForm.document) }}</el-descriptions-item>
          <el-descriptions-item label="评审报告">{{ transToNullFormat(manageForm.evaluationReport) }}</el-descriptions-item>

          <el-descriptions-item label="生产件批准程序">{{ transToNullFormat(manageForm.ppap) }}</el-descriptions-item>
          <el-descriptions-item label="控制计划">{{ transToNullFormat(manageForm.controlPlan) }}</el-descriptions-item>
          <el-descriptions-item label="产品质量先期策划">{{ transToNullFormat(manageForm.apqp) }}</el-descriptions-item>

          <el-descriptions-item label="样品零件">{{ transToNullFormat(manageForm.samplePart) }}</el-descriptions-item>
          <el-descriptions-item label="工具">{{ transToNullFormat(manageForm.tools) }}</el-descriptions-item>
          <el-descriptions-item label="其它">{{ transToNullFormat(manageForm.other) }}</el-descriptions-item>
        </el-descriptions>
        <!--todo 添加文件-->
        <el-descriptions :column="1">
          <el-descriptions-item label="零件图纸" v-if="manageForm.partDrawing==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="partDrawingFilesLoading"
              border
              :data="partDrawingFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="文档/作业程序/指导书" v-if="manageForm.document==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="docFilesLoading"
              border
              :data="docFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="评审报告" v-if="manageForm.evaluationReport==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="evaluateFilesLoading"
              border
              :data="evaluateFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="生产件批准程序" v-if="manageForm.ppap==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="ppapFilesLoading"
              border
              :data="ppapFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="控制计划" v-if="manageForm.controlPlan==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="controlPlanFilesLoading"
              border
              :data="controlPlanFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="产品质量先期策划" v-if="manageForm.apqp==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="apqpFilesLoading"
              border
              :data="apqpFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="样品零件" v-if="manageForm.samplePart==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="samplePartFilesLoading"
              border
              :data="samplePartFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="工具" v-if="manageForm.tools==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="toolsFilesLoading"
              border
              :data="toolsFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="其它" v-if="manageForm.other==='是'" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="otherMFilesLoading"
              border
              :data="otherMFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!--ECN-->
      <div class="xItem">
        <el-descriptions title="ECN" :column="1">
          <el-descriptions-item label="变更识别码"><span style="color: red;">{{ transToNullFormat(changeForm.changeNum) }}</span></el-descriptions-item>
          <el-descriptions-item label="PCN流程图" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="flowFilesLoading"
              border
              :data="flowFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="变更记录" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="recordFilesLoading"
              border
              :data="recordFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="反馈报告" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="evaluateReportsLoading"
              border
              :data="evaluateReports"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="培训记录" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="trainRecordsLoading"
              border
              :data="trainRecords"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!--批准/关闭-->
      <div class="xItem">
        <el-descriptions title="批准/关闭" :column="4">
          <el-descriptions-item label="变更实现日期">{{ transToNullFormat(approveForm.implementedTime) }}</el-descriptions-item>
          <el-descriptions-item label="送审客户日期">{{ transToNullFormat(approveForm.sendToCusTime) }}</el-descriptions-item>
          <el-descriptions-item label="客户同意日期">{{ transToNullFormat(approveForm.acceptedByCusTime) }}</el-descriptions-item>
          <el-descriptions-item label="内部同意日期">{{ transToNullFormat(approveForm.acceptedByInternalTime) }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1">
          <el-descriptions-item label="变更验收报告" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="buyOffFilesLoading"
              border
              :data="buyOffFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="客户同意证明" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="cusAcceptFilesLoading"
              border
              :data="cusAcceptFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
          <el-descriptions-item label="内部同意证明" content-class-name="table_content">
            <el-table
              ref="table"
              v-loading="internalAcceptFilesLoading"
              border
              :data="internalAcceptFiles"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者"/>
            </el-table>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <el-button
      id="save_pdf"
      type="primary"
      plain
      icon="el-icon-download"
      size="mini"
      @click="outPutContactPdfFn"
      style="position:fixed;top:20%;right:3%;z-index: 50;"
    >另存为pdf
    </el-button>
  </div>
</template>

<script>
import {getTodayFormat, GMTToStr, toDateFormat, validIsNotNull} from "@/utils/validationUtil";
import {getChangeById} from "@/api/tools/change";
import {getFactorsByChangeId} from "@/api/tools/changeFactor";
import {getManageByChangeId} from "@/api/tools/changeManagement";
import {getApproveByChangeId} from "@/api/tools/changeApprove";
import {getChangeFileByCond} from "@/api/tools/changeFile";

export default {
  name: "ChangeOverview",
  data() {
    return {
      permission: {
        add: ['admin', 'change:management'],
        edit: ['admin', 'change:edit'],
        del: ['admin', 'change:del']
      },
      destroyFormData: false,
      changeForm: {},
      // 分类主要因素分布
      changeFactorsLoading: false,
      changeFactors: [],
      manageForm: {},
      approveForm: {},
      cusType: '客户要求',
      riskAssessType: '风险评估',
      // 变更范围
      docChangeType: '文档变更',
      processChangeType: '过程变更',
      toolChangeType: '工具变更',
      otherChangeType: '其他变更',
      agreeType: '客户协议',
      assessReportType: '评估报告',
      // 变更-附件类型
      partDrawingType: '零件图纸',
      docType: '文档/作业程序/指导书',
      evaluateType: '评审报告',
      ppapType: '生产件批准程序',
      controlPlanType: '控制计划',
      apqpType: '产品质量先期策划',
      samplePartType: '样品零件',
      toolsType: '管理-工具',
      otherType: '管理-其它',
      // 变更-ECN-附件类型
      PCNFlowType: 'PCN流程图',
      recordType: '变更记录',
      mEvaluateType: '反馈报告',
      trainRecordType: '培训记录',
      // 批准/关闭
      buyOffType: '验收报告',
      cusAcceptType: '客户同意证明',
      internalAcceptType: '内部同意证明',
      // 起草-附件
      // 客户附件列表
      cusFilesLoading: false,
      cusFiles: [],
      // 风险评估附件列表
      riskAssessFilesLoading: false,
      riskAssessFiles: [],
      // 变更范围
      // 文档变更附件
      docChangeFilesLoading: false,
      docChangeFiles: [],
      // 过程变更附件
      processChangeFilesLoading: false,
      processChangeFiles: [],
      // 工具变更附件
      toolChangeFilesLoading: false,
      toolChangeFiles: [],
      // 其他变更附件
      otherChangeFilesLoading: false,
      otherChangeFiles: [],
      // 客户协议书列表
      agreeFilesLoading: false,
      agreeFiles: [],
      // 审批评估附件列表
      evReportFilesLoading: false,
      evReportFiles: [],
      // 变更管理附件
      // 零件图纸
      partDrawingFilesLoading: false,
      partDrawingFiles: [],
      // 文档/作业程序/指导书
      docFilesLoading: false,
      docFiles: [],
      // 评审报告
      evaluateFilesLoading: false,
      evaluateFiles: [],
      // 生产件批准程序
      ppapFilesLoading: false,
      ppapFiles: [],
      // 控制计划
      controlPlanFilesLoading: false,
      controlPlanFiles: [],
      // 产品质量先期策划
      apqpFilesLoading: false,
      apqpFiles: [],
      // 样品零件
      samplePartFilesLoading: false,
      samplePartFiles: [],
      // 工具
      toolsFilesLoading: false,
      toolsFiles: [],
      // 其它
      otherMFilesLoading: false,
      otherMFiles: [],
      // PCN流程图
      flowFilesLoading: false,
      flowFiles: [],
      // 变更记录
      recordFilesLoading: false,
      recordFiles: [],
      // 反馈报告
      evaluateReportsLoading: false,
      evaluateReports: [],
      // 培训记录
      trainRecordsLoading: false,
      trainRecords: [],
      // 批准/关闭附件
      // 验收报告附件
      buyOffFilesLoading: false,
      buyOffFiles: [],
      // 客户同意证明
      cusAcceptFilesLoading: false,
      cusAcceptFiles: [],
      // 内部同意证明
      internalAcceptFilesLoading: false,
      internalAcceptFiles: [],
    }
  },
  created() {

  },
  mounted() {
    if (validIsNotNull(this.$route.query.changeId)) {
      this.getChangeInfo(this.$route.query.changeId)
      this.getChangeFactors(this.$route.query.changeId)
      // 查询客户要求证明
      this.getCusFiles(this.$route.query.changeId, this.cusType)
      // 风险评估附件
      this.getRiskAssessFiles(this.$route.query.changeId, this.riskAssessType)
      // 客户协议
      this.getAgreeFiles(this.$route.query.changeId, this.agreeType)
      // 变更范围
      this.getDocChangeFiles(this.$route.query.changeId, this.docChangeType)
      this.getProcessChangeFiles(this.$route.query.changeId, this.processChangeType)
      this.getToolChangeFiles(this.$route.query.changeId, this.toolChangeType)
      this.getOtherChangeFiles(this.$route.query.changeId, this.otherChangeType)
      // 评估报告
      this.getAssessReports(this.$route.query.changeId, this.assessReportType)

      // 变更管理
      // 变更附件管理
      this.getPartDrawingFiles(this.$route.query.changeId, this.partDrawingType)
      this.getDocFiles(this.$route.query.changeId, this.docType)
      this.getEvaluateFiles(this.$route.query.changeId, this.evaluateType)
      this.getPpapFiles(this.$route.query.changeId, this.ppapType)
      this.getControlPlanFiles(this.$route.query.changeId, this.controlPlanType)
      this.getApqpFiles(this.$route.query.changeId, this.apqpType)
      this.getSamplePart(this.$route.query.changeId, this.samplePartType)
      this.getToolsFiles(this.$route.query.changeId, this.toolsType)
      this.getOtherFiles(this.$route.query.changeId, this.otherType)
      // ECN附件管理
      this.getPCNFlowFiles(this.$route.query.changeId, this.PCNFlowType)
      this.getRecordFiles(this.$route.query.changeId, this.recordType)
      this.getEvaluateReports(this.$route.query.changeId, this.mEvaluateType)
      this.getTrainRecords(this.$route.query.changeId, this.trainRecordType)

      // 变更批准/通过附件
      this.getBuyOffFiles(this.$route.query.changeId, this.buyOffType)
      this.getCusAcceptFiles(this.$route.query.changeId, this.cusAcceptType)
      this.getInternalAcceptFiles(this.$route.query.changeId, this.internalAcceptType)
    }
  },
  methods: {
    // 获取供应商信息
    getChangeInfo(id) {
      getChangeById(id).then(res => {
        // alert(JSON.stringify(res))
        this.changeForm = res
        // 销毁子组件，而后重新渲染
        /*this.$nextTick(() => {
          this.destroyFormData = true
        }, 500)*/
        this.manageForm = this.changeForm.management
        this.approveForm = this.changeForm.approve
        // alert(JSON.stringify(this.manageForm))
      })
    },
    getChangeFactors(changeId) {
      this.changeFactorsLoading = true
      this.changeFactors = []
      getFactorsByChangeId(changeId).then(res => {
        this.changeFactorsLoading = false
        this.changeFactors = res
      }).catch(() => {
        this.changeFactorsLoading = false
      })
    },
    // 查询客户要求证明
    getCusFiles(changeId, fileType) {
      this.cusFilesLoading = true
      this.cusFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.cusFiles = res
        this.cusFilesLoading = false
      })
    },
    // 获取风险评估附件
    getRiskAssessFiles(changeId, fileType) {
      this.riskAssessFilesLoading = true
      this.riskAssessFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.riskAssessFiles = res
        this.riskAssessFilesLoading = false
      })
    },
    // 文档变更附件
    getDocChangeFiles(changeId, fileType) {
      this.docChangeFilesLoading = true
      this.docChangeFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.docChangeFiles = res
        this.docChangeFilesLoading = false
        if (this.docChangeFiles.length > 0) {
          this.$refs.docChangeFiles.$el.style.border = 'none'
        } else {
          this.$refs.docChangeFiles.$el.style.border = '1px solid #f00'
        }
      })
    },
    // 过程变更附件
    getProcessChangeFiles(changeId, fileType) {
      this.processChangeFilesLoading = true
      this.processChangeFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.processChangeFiles = res
        this.processChangeFilesLoading = false
      })
    },
    // 工具变更附件
    getToolChangeFiles(changeId, fileType) {
      this.toolChangeFilesLoading = true
      this.toolChangeFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.toolChangeFiles = res
        this.toolChangeFilesLoading = false
      })
    },
    // 其他变更附件
    getOtherChangeFiles(changeId, fileType) {
      this.otherChangeFilesLoading = true
      this.otherChangeFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.otherChangeFiles = res
        this.otherChangeFilesLoading = false
      })
    },
    // 获取客户协议附件
    getAgreeFiles(changeId, fileType) {
      this.agreeFilesLoading = true
      this.agreeFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.agreeFiles = res
        this.agreeFilesLoading = false
      })
    },
    // 获取评估报告
    getAssessReports(changeId, fileType) {
      this.evReportFilesLoading = true
      this.evReportFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.evReportFiles = res
        this.evReportFilesLoading = false
      })
    },
    // 管理信息附件
    // 变更管理-零件图纸
    getPartDrawingFiles(changeId, fileType) {
      this.partDrawingFilesLoading = true
      this.partDrawingFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.partDrawingFiles = res
        this.partDrawingFilesLoading = false
      })
    },
    // 变更管理-文档/作业程序/指导书
    getDocFiles(changeId, fileType) {
      this.docFilesLoading = true
      this.docFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.docFiles = res
        this.docFilesLoading = false
      })
    },
    // 评审报告
    getEvaluateFiles(changeId, fileType) {
      this.evaluateFilesLoading = true
      this.evaluateFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.evaluateFiles = res
        this.evaluateFilesLoading = false
      })
    },
    // 评审报告
    getOldEvaluateFiles(changeId, fileType) {
      this.oldEvReportFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.oldEvReportFiles = res
      })
    },
    // 生产件批准程序
    getPpapFiles(changeId, fileType) {
      this.ppapFilesLoading = true
      this.ppapFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.ppapFiles = res
        this.ppapFilesLoading = false
      })
    },
    // 控制计划
    getControlPlanFiles(changeId, fileType) {
      this.controlPlanFilesLoading = true
      this.controlPlanFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.controlPlanFiles = res
        this.controlPlanFilesLoading = false
      })
    },
    // 产品质量先期策划
    getApqpFiles(changeId, fileType) {
      this.apqpFilesLoading = true
      this.apqpFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.apqpFiles = res
        this.apqpFilesLoading = false
      })
    },
    // 样品零件
    getSamplePart(changeId, fileType) {
      this.samplePartFilesLoading = true
      this.samplePartFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.samplePartFiles = res
        this.samplePartFilesLoading = false
      })
    },
    // 工具
    getToolsFiles(changeId, fileType) {
      this.toolsFilesLoading = true
      this.toolsFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.toolsFiles = res
        this.toolsFilesLoading = false
      })
    },
    // 其它
    getOtherFiles(changeId, fileType) {
      this.otherMFilesLoading = true
      this.otherMFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.otherMFiles = res
        this.otherMFilesLoading = false
      })
    },
    // 变更管理-ECN-PCN流程图
    getPCNFlowFiles(changeId, fileType) {
      this.flowFilesLoading = true
      this.flowFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.flowFiles = res
        this.flowFilesLoading = false
      })
    },
    // 变更管理-ECN-变更报告
    getRecordFiles(changeId, fileType) {
      this.recordFilesLoading = true
      this.recordFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.recordFiles = res
        this.recordFilesLoading = false
      })
    },
    // 变更管理-ECN-反馈报告
    getEvaluateReports(changeId, fileType) {
      this.evaluateReportsLoading = true
      this.evaluateReports = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.evaluateReports = res
        this.evaluateReportsLoading = false
      })
    },
    // 变更管理-ECN-培训记录
    getTrainRecords(changeId, fileType) {
      this.trainRecordsLoading = true
      this.trainRecords = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.trainRecords = res
        this.trainRecordsLoading = false
      })
    },

    // 批准/关闭-验收报告
    getBuyOffFiles(changeId, fileType) {
      this.buyOffFilesLoading = true
      this.buyOffFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.buyOffFiles = res
        this.buyOffFilesLoading = false
      })
    },
    // 批准/关闭-客户同意证明
    getCusAcceptFiles(changeId, fileType) {
      this.cusAcceptFilesLoading = true
      this.cusAcceptFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.cusAcceptFiles = res
        this.cusAcceptFilesLoading = false
      })
    },
    // 批准/关闭-内部同意证明
    getInternalAcceptFiles(changeId, fileType) {
      this.internalAcceptFilesLoading = true
      this.internalAcceptFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.internalAcceptFiles = res
        this.internalAcceptFilesLoading = false
      })
    },
    /*// 查询变更管理信息
    getManagementInfo(changeId) {
      // alert(changeId)
      getManageByChangeId(changeId).then(res => {
        this.manageForm = res
      })
    },
    // 查询变更批准/关闭信息
    getApproveInfo(changeId) {
      // alert(changeId)
      getApproveByChangeId(changeId).then(res => {
        this.approveForm = res
      })
    },*/
    // 常规字符判空转换
    transToNullFormat(val) {
      if (!validIsNotNull(val)) {
        return '--'
      } else {
        return val
      }
    },
    // 时间判空转换
    dateToNullFormat(time) {
      if (!validIsNotNull(time)) {
        return '--'
      } else {
        return GMTToStr(time)
      }
    },
    // 是否判空转换
    boolToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '是' : '否'
      }
    },
    // 是否判空转换
    havToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '有' : '无'
      }
    },
    operationConfirm() {
      this.$confirm('返回列表？继续预览？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '返回列表',
        cancelButtonText: '继续预览'
      }).then(() => {
        this.$router.push({
          path: '/change/index'
        })
      }).catch(() => {

      })
    },
    outPutContactPdfFn() {
      let vm = this;
      const A4_WIDTH = 592.28;
      const A4_HEIGHT = 841.89;
      // $myLoading 自定义等待动画组件，实现导出事件的异步等待交互
      // this.$loading('正在导出pdf，请稍候。。。', true);
      const loading = this.myLoading();
      vm.$nextTick(() => {
        // dom的id。
        let target = document.getElementById('changeCanvas');
        let pageHeight = target.scrollWidth / A4_WIDTH * A4_HEIGHT;
        // 获取分割dom，此处为class类名为item的dom
        let lableListID = document.getElementsByClassName('xItem');
        // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
        for (let i = 0; i < lableListID.length; i++) {
          let multiple = Math.ceil((lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight);
          if (this.isSplit(lableListID, i, multiple * pageHeight)) {
            let divParent = lableListID[i].parentNode; // 获取该div的父节点
            let newNode = document.createElement('div');
            newNode.className = 'emptyDiv';
            newNode.style.background = '#ffffff';
            let _H = multiple * pageHeight - (lableListID[i].offsetTop + lableListID[i].offsetHeight);
            newNode.style.height = _H + 100 + 'px';
            newNode.style.width = '100%';
            let next = lableListID[i].nextSibling; // 获取div的下一个兄弟节点
            // 判断兄弟节点是否存在
            console.log(next);
            if (next) {
              // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
              divParent.insertBefore(newNode, next);
            } else {
              // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
              divParent.appendChild(newNode);
            }
          }
        }
        // 传入title和dom标签，此处是 #content
        // 异步函数，导出成功后处理交互
        this.exportPdf("变更信息-" + toDateFormat(new Date()) , '#changeCanvas').then(() => {
          // 自定义等待动画关闭
          // this.$myLoading(false);
          loading.close()
          this.$message({
            type: 'success',
            message: '导出成功'
          });
          this.detailSHow = false;
          let empDivList = document.getElementsByClassName('emptyDiv');
          for (let i = empDivList.length; i >= 0; i--) {
            //删除元素
            if (empDivList[i] != null) {
              empDivList[i].parentNode.removeChild(empDivList[i]);
            }
          }
        })
          .catch(() => {
            // this.$myLoading(false);
            loading.close()
            this.$message({
              type: 'error',
              message: '导出失败，请重试'
            });
          });
      });
    },
    isSplit(nodes, index, pageHeight) {
      // 计算当前这块dom是否跨越了a4大小，以此分割
      return nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight - 20;
    },
  }
}
</script>

<style>
#changeCanvas .xItem {
  padding: 10px 20px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
>>> .table_content {
  width:88%;
}
</style>
