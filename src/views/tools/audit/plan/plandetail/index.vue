<template>
  <div class="app-container">
    <!--审核计划内容-->
    <el-row class="box-card">
      <el-descriptions>
        <template slot="title">
          <div>
            <span>审核计划基本信息
              <el-button
                v-if="planHasChanged === true"
                type="text"
                icon="el-icon-refresh-left"
                @click="refreshPlan"
              />
            </span>
          </div>
        </template>
        <template slot="extra">
          <el-button
            v-if="!editDisabled"
            :disabled="planHasChanged === false"
            type="primary"
            plain
            size="small"
            @click="savePlanChange"
          >保存
          </el-button>
        </template>
        <el-descriptions-item label="计划名称">{{ plan.realName }}</el-descriptions-item>
        <el-descriptions-item label="审核编号">{{ plan.auditNo }}</el-descriptions-item>
        <el-descriptions-item label="审核种类">{{ plan.type }}</el-descriptions-item>
        <el-descriptions-item label="审核内容">{{ plan.content }}</el-descriptions-item>
        <el-descriptions-item label="计划时间">
          <div v-if="plan.approvalStatus !== '待审批' && !editDisabled">
            <!--<el-input
              v-if="planTimeInputVisible"
              ref="planTimeInput"
              v-model="inputTimeValue"
              size="mini"
              placeholder="请输入内容"
              suffix-icon="el-icon-date"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />-->
            <el-date-picker
              v-if="planTimeInputVisible"
              ref="planTimeInput"
              v-model="inputTimeValue"
              type="date"
              placeholder="选择审核计划日期"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button
              v-else
              type="text"
              style="padding: 0 !important;font-size: 12px !important;"
              icon="el-icon-edit"
              @click.native="timeChange"
            >
              {{ planTimeFormatValue }}
            </el-button>
          </div>
          <div v-else>
            {{ planTimeFormatValue }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="审核负责人">{{ plan.chargeman }}</el-descriptions-item>
        <el-descriptions-item label="模板类型">{{ plan.templateType }}</el-descriptions-item>
        <el-descriptions-item label="审核范围">{{ plan.scope }}</el-descriptions-item>
        <el-descriptions-item label="审核周期">{{ plan.period }}</el-descriptions-item>
        <el-descriptions-item label="审核原因">{{ plan.reason }}</el-descriptions-item>
        <el-descriptions-item label="审核产品">{{ plan.product }}</el-descriptions-item>
        <el-descriptions-item label="产品技术">{{ plan.technology }}</el-descriptions-item>
        <el-descriptions-item label="审核地点">{{ plan.address }}</el-descriptions-item>
        <el-descriptions-item label="审核产线">{{ plan.line }}</el-descriptions-item>
        <el-descriptions-item label="当前进度"><span style="color: #ff1874">{{ plan.status }}</span></el-descriptions-item>
        <el-descriptions-item label="审核人员">
          <div v-if="plan.approvalStatus !== '待审批' && !editDisabled" class="tag-group">
            <el-tag
              v-for="item in auditorDatas"
              :key="item.id"
              class="tag-list"
              size="small"
              closable
              :disable-transitions="false"
              @close="handleClose(item)"
            >
              {{ item.username }}
            </el-tag>
            <el-select
              v-if="selectVisible"
              ref="addAuditorInput"
              v-model="newAuditor"
              style="width: 150px"
              placeholder="请选择"
              filterable
              @change="handleSelectConfirm"
              @click.native="judgeIsNull"
            >
              <el-option
                v-for="item in actualAuditors"
                :key="item.username"
                :label="item.deptName + ' - '+ item.system + ' - '+ item.username"
                :value="{id:item.id,username:item.username}"
              />
            </el-select>
            <el-button v-else class="button-new-tag" icon="el-icon-plus" size="small" @click="showInput">审核员</el-button>
          </div>
          <div v-else class="tag-group">
            <el-tag
              v-for="item in auditorDatas"
              :key="item.id"
              class="tag-list"
              size="small"
              :disable-transitions="false"
              @close="handleClose(item)"
            >
              {{ item.username }}
            </el-tag>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-top: 15px;" border title="审核计划附件信息">
        <el-descriptions-item label="计划附件">
          <!--点击触发修改状态-->
          <div>
            <el-table
              ref="table"
              v-loading="planFileLoading"
              :data="planFiles"
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
                v-if="!editDisabled"
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
                          @click="deletePlanFile(scope.row.id), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="editDisabled"
                      />
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--支持缩放-->
          <!--          <div>
                      <el-table
                        v-if="planFilesVisible"
                        ref="table"
                        v-loading="planFileLoading"
                        :data="planFiles"
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
                                    @click="deletePlanFile(scope.row.id), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                              <el-button
                                v-permission="permission.edit"
                                type="primary"
                                icon="el-icon-zoom-out"
                                size="mini"
                                @click.native="planFilesVisible = false"
                              />
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                      &lt;!&ndash;原生状态&ndash;&gt;
                      <div v-for="(item,index) in planFiles" v-else :key="item.id" class="text item">
                        &lt;!&ndash;名称-下载/预览&ndash;&gt;
                        <a
                          :href="baseApi + '/file/' + item.type + '/' + item.name"
                          class="el-link&#45;&#45;primary"
                          style="margin-left:15px;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                          target="_blank"
                          :download="item.realName"
                        >
                          <i class="el-icon-link"/>
                          {{ index + 1 + '.' + item.realName }}
                        </a>
                        &lt;!&ndash;切换为表格&ndash;&gt;
                        <el-button
                          type="text"
                          style="display: inline-block;"
                          icon="el-icon-zoom-in"
                          @click.native="planFilesVisible = true"
                        />
                        &lt;!&ndash;删除计划附件&ndash;&gt;
                        <el-button
                          type="text"
                          style="margin-left:10px;display: inline-block;color: red;"
                          icon="el-icon-delete"
                          @click.native="deletePlanFile(item.id)"
                        />
                      </div>
                    </div>-->
          <div v-if="!editDisabled">
            <!--上传审批计划自身附件-->
            <el-card v-if="planFileUploadVisible" class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span class="header-title">上传审核计划附件</span>
                <el-button
                  style="float: right; padding: 3px 0"
                  icon="el-icon-close"
                  type="text"
                  @click="planFileUploadVisible = false"
                />
              </div>
              <div style="width:360px;">
                <el-upload
                  ref="uploadPlanFile"
                  class="upload-demo"
                  drag
                  :before-upload="beforeUpload"
                  :auto-upload="false"
                  :headers="headers"
                  :on-success="handlePlanFileSuccess"
                  :on-error="handleError"
                  :action="auditPlanUploadApi + '?planId=' + this.planId + '&templateId=' + 0 "
                >
                  <i class="el-icon-upload"/>
                  <div class="el-upload__text">将文件拖到此处，或<em>选取上传</em></div>
                  <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
                </el-upload>
                <el-button style="margin-top:8px;" size="small" type="success" @click="submitPlanFileUpload">上传到服务器
                </el-button>
              </div>
            </el-card>
            <el-button
              v-else
              type="primary"
              style="margin-top: 8px;"
              class="button-new-tag"
              icon="el-icon-plus"
              size="small"
              @click="planFileUploadVisible = true"
            >上传计划附件
            </el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!--审核模板-->
    <el-row class="box-card">
      <!--自定义模板，直接上传相关附件-->
      <div v-if="templateSelfFlag">
        <el-descriptions style="margin-top: 15px;" border title="自定义模板附件信息">
          <el-descriptions-item label="模板附件">
            <!--点击触发修改状态-->
            <div>
              <el-table
                ref="table"
                v-loading="fileLoading"
                :data="files"
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
                  v-if="!editDisabled"
                  label="操作"
                  min-width="130px"
                  align="center"
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <div>
                      <!--删除-->
                      <el-popover
                        :ref="`delTemplateFile-popover-${scope.$index}`"
                        v-permission="permission.edit"
                        placement="top"
                        width="180"
                      >
                        <p>确定删除这个附件吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            size="mini"
                            type="text"
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
                </el-table-column>
              </el-table>
            </div>
            <!--支持缩放-->
            <!--            <div>
                          <el-table
                            v-if="filesVisible"
                            ref="table"
                            v-loading="fileLoading"
                            :data="files"
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
                                    :ref="`delTemplateFile-popover-${scope.$index}`"
                                    v-permission="permission.edit"
                                    placement="top"
                                    width="180"
                                  >
                                    <p>确定删除这个附件吗？</p>
                                    <div style="text-align: right; margin: 0">
                                      <el-button
                                        size="mini"
                                        type="text"
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
                                  <el-button
                                    v-permission="permission.edit"
                                    type="primary"
                                    icon="el-icon-zoom-out"
                                    size="mini"
                                    @click.native="filesVisible = false"
                                  />
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                          &lt;!&ndash;原生状态&ndash;&gt;
                          <div v-for="(item,index) in files" v-else :key="item.id" class="text item">
                            &lt;!&ndash;名称-下载/预览&ndash;&gt;
                            <a
                              :href="baseApi + '/file/' + item.type + '/' + item.name"
                              class="el-link&#45;&#45;primary"
                              style="margin-left:15px;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                              target="_blank"
                              :download="item.realName"
                            >
                              <i class="el-icon-link"/>
                              {{ index + 1 + '.' + item.realName }}
                            </a>
                            &lt;!&ndash;切换为表格&ndash;&gt;
                            <el-button
                              type="text"
                              style="display: inline-block;"
                              icon="el-icon-zoom-in"
                              @click.native="filesVisible = true"
                            />
                            &lt;!&ndash;删除计划附件&ndash;&gt;
                            <el-button
                              type="text"
                              style="margin-left:10px;display: inline-block;color: red;"
                              icon="el-icon-delete"
                              @click.native="deleteFile(item.id)"
                            />
                          </div>
                        </div>-->
            <div v-if="!editDisabled">
              <!--上传模板附件-->
              <el-card v-if="fileUploadVisible" class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                  <span class="header-title">自选模板上传附件</span>
                  <el-button
                    style="float: right; padding: 3px 0"
                    icon="el-icon-close"
                    type="text"
                    @click="fileUploadVisible = false"
                  />
                </div>
                <div style="width:100%;">
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    drag
                    :before-upload="beforeUpload"
                    :auto-upload="false"
                    :headers="headers"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :action="auditPlanUploadApi + '?planId=' + this.planId + '&templateId=' + this.templateId "
                  >
                    <i class="el-icon-upload"/>
                    <div class="el-upload__text">将文件拖到此处，或<em>选取上传</em></div>
                    <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
                  </el-upload>
                  <el-button style="margin-top:8px;" size="small" type="success" @click="submitUpload">上传到服务器
                  </el-button>
                </div>
              </el-card>
              <el-button
                v-else
                type="primary"
                style="margin-top: 8px;"
                class="button-new-tag"
                icon="el-icon-plus"
                size="small"
                @click="fileUploadVisible = true"
              >上传模板附件
              </el-button>
            </div>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" :colon="false" style="margin-top: 15px;" border title="自定义模板信息">
          <el-descriptions-item label="自定义模板数据">
            <el-table
              ref="table"
              v-loading="selfTempScoresLoading"
              :data="selfTempScores"
              style="width: 100%;"
              row-key="id"
              border
              default-expand-all
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column prop="itemName" label="项目名称" min-width="100"/>
              <el-table-column prop="itemContent" label="项目内容" min-width="200"/>
              <!--              <el-table-column prop="itemScore" label="项目打分" align="center">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.pid" v-model="scope.row.itemScore" disabled
                            placeholder="请输入项目得分" style="width: 93%;"/>
                  <span v-else>/</span>
                </template>
              </el-table-column>-->
              <el-table-column prop="createBy" label="创建者"/>
              <!--   编辑与删除   -->
              <el-table-column
                v-if="!editDisabled"
                label="操作"
                width="130px"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div>
                    <!--编辑-->
                    <el-button
                      v-if="!editDisabled"
                      v-permission="permission.edit"
                      size="mini"
                      type="primary"
                      icon="el-icon-edit"
                      :disabled="editDisabled"
                      @click="editTempItem(scope.row)"
                    />
                    <!--删除-->
                    <el-popover
                      :ref="`popover-${scope.$index+ scope.row.id}`"
                      v-permission="permission.edit"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除本条及子项目数据吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="cancelDelModule"
                        >取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="delModuleScore(scope.row.id), this.$refs[`popover-${scope.$index+ scope.row.id}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        :disabled="editDisabled"
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
        <!-- 表格 -->
        <el-row v-if="addTempScoreVisible === true" style="margin-top: 15px;border: 1px solid #e6ebf5;">
          <el-descriptions style="margin-top: 10px;" border>
            <template slot="title">
              <div>
                <el-switch
                  v-model="useAvailFlag"
                  active-text="现有模块"
                  inactive-text="新建模块">
                </el-switch>
                <span v-if="!useAvailFlag">
                  <i style="color: red;">* </i>模块名称：<el-input v-model="moduleName" placeholder="请输入模板模块名"
                                                              style="width: 200px;"/>
                  模块内容：<el-input v-model="moduleContent" placeholder="请输入模板模块内容" style="width: 200px;"/>
                </span>
                <el-select v-else v-model="existedModule.id" @change="existedModuleChangeHandler" placeholder="请选择">
                  <el-option
                    v-for="item in availSelfTempModules"
                    :key="item.id"
                    :label="item.itemName"
                    :value="item.id">
                    <span style="float: left">{{ item.itemName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.itemContent }}</span>
                  </el-option>
                </el-select>
              </div>
            </template>
            <template slot="extra">
              <el-button
                style="float: right;"
                type="success"
                @click="toAddModule"
              >
                增加新模块
              </el-button>
              <el-button
                style="margin-right: 10px;"
                type="warning"
                @click="addTempScoreVisible = false"
              >
                关闭
              </el-button>
            </template>
            <el-descriptions-item label="模块项目">
              <el-table
                ref="templateTable"
                :data="templateData"
                style="width: 100%;"
                stripe
                fit
              >
                <el-table-column
                  label="序号"
                  width="50"
                  type="index"
                  :index="(index)=>{return index+1}"
                />
                <el-table-column label="项目名称" prop="itemName" align="center">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.itemName" placeholder="请输入项目名" autosize style="width: 93%;"/>
                  </template>
                </el-table-column>
                <el-table-column label="项目内容" align="center" min-width="300">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.itemContent" type="textarea" autosize style="width: 93%;"/>
                  </template>
                </el-table-column>
                <el-table-column prop="itemScore" label="项目得分" width="100"/>
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
              <p style="margin-top: 5px;">
                <el-button
                  v-permission="permission.edit"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="addClick"
                >添加项目
                </el-button>
              </p>
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-button
          v-if="!editDisabled"
          type="primary"
          style="margin-top: 8px;"
          class="button-new-tag"
          icon="el-icon-plus"
          size="small"
          @click="toAddNewModule"
        >自定义模板模块
        </el-button>
      </div>
      <!--固定模板，根据配套模板类型取不同的模板-->
      <div v-else-if="plan.templateType === 'VDA6.3'">
        <v-d-a-template :plan-id="planId" :template-id="templateId" :disabled="planDisabled"/>
      </div>
    </el-row>
    <!--审批状态-->
    <el-row class="box-card">
      <el-descriptions style="margin-top: 15px;" title="审批信息">
        <!--审批状态-->
        <el-descriptions-item v-if="plan.approvalStatus !=='被驳回'" label="审批状态">{{ plan.approvalStatus }}
        </el-descriptions-item>
        <el-descriptions-item v-else label="审批状态">
          <el-tooltip class="item" effect="dark" :content="plan.rejectComment" placement="top-start">
            <span style="color: #f00;">{{ plan.approvalStatus }}</span>
          </el-tooltip>
        </el-descriptions-item>
        <!--审批发起/审批人-->
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
        <el-descriptions-item
          v-if="plan.approvalStatus ==='待激活'"
          label="操作执行"
        >
          <a style="color: #00a0e9" @click="updateApprovalStatus">发起审批</a>
        </el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!--拟添加模块表-->
    <el-dialog
      :title="moduleName+'模块表'"
      :visible.sync="addTableVisible"
      width="70%"
      :before-close="handleClose"
    >
      <el-table
        ref="templateTable"
        :data="realTableData"
        style="width: 100%;"
        stripe
        fit
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="itemName" label="项目名称" min-width="100"/>
        <el-table-column prop="PItemName" label="所属模块" :formatter="pItemNameFormat"/>
        <el-table-column prop="itemContent" label="项目内容" min-width="200"/>
        <el-table-column prop="itemScore" label="项目得分" :formatter="scoreFormat"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOperation">取 消</el-button>
        <el-button type="primary" @click="submitTable">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑已有模块信息-->
    <el-dialog
      :title="moduleOptionTitle"
      :visible.sync="editModuleVisible"
      width="700px"
    >
      <el-form
        ref="moduleForm"
        :model="moduleForm"
        :rules="moduleRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          label="项目名称"
          prop="itemName"
          required
        >
          <el-input
            v-model="moduleForm.itemName"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item
          label="项目内容"
          prop="itemContent"
        >
          <el-input
            v-model="moduleForm.itemContent"
            style="width: 370px;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="doCancelModule">取 消</el-button>
            <el-button type="primary" :loading="submitModuleLoading" @click="submitModule">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
import {activatedByPlanId, edit, getAuditPlanById} from '@/api/tools/auditPlan'
import {delAuditPlanFile, getAuditPlanFileByCond} from '@/api/tools/auditPlanFile'
import {GMTToDate, judgeIsEqual, validIsNotNull} from '@/utils/validationUtil'
import {getToken} from '@/utils/auth'
import {mapGetters} from 'vuex'
import {getAuditorByExample} from '@/api/tools/auditor'
import {getPlanTemplateByPlanId} from '@/api/tools/auditPlanTemplate'
import VDATemplate from '@/views/tools/audit/plan/module/VDA.template'
import {
  addSelfTemplate,
  delSelfTemplate,
  getById,
  getSelfByTemplateId,
  getTreeByTemplateId,
  updateTempModule
} from '@/api/tools/selfTemplate'

export default {
  name: 'PlanDetail',
  components: {VDATemplate},
  // 设置数据字典
  // dicts: ['audit_template'],
  data() {
    return {
      cond: {
        approvalStatus: '已批准'
      },
      planId: null,
      templateId: null,
      loading: false,
      fileLoading: false,
      files: [],
      planFileLoading: false,
      planFiles: [],
      templateSelfFlag: false,
      plan: {},
      headers: {
        'Authorization': getToken()
      },
      permission: {
        edit: ['admin', 'plan:edit']
      },
      selectVisible: false,
      auditors: [],
      actualAuditors: [],
      newAuditor: null,
      oldAuditorDatas: [],
      auditorDatas: [],
      planTimeInputVisible: false,
      inputTimeValue: '',
      planTimeFormatValue: '',
      planFilesVisible: false,
      planFileUploadVisible: false,
      filesVisible: false,
      fileUploadVisible: false,
      planHasChanged: false,
      planTimeChanged: false,
      auditorsChanged: false,
      oldPlanTime: null,
      template: null,
      planDisabled: true,
      execStatusDict: [
        '进行',
        '追踪',
        '结案'
      ],
      editDisabled: false,
      addTempScoreVisible: false,
      selfTempScoresLoading: false,
      selfTempScores: [],
      availSelfTempModules: [],
      // 已有根模块名称
      moduleNames: [],
      // 已有根模块内容
      modelContents: [],
      // 表格数据
      templateData: [], // 表格遍历
      moduleName: null,
      moduleContent: null,
      addTableVisible: false,
      realTableData: [],
      childrenData: [],
      selfTemplate: null,
      tempModuleData: [],
      moduleOptionTitle: '',
      editModuleVisible: false,
      moduleForm: {
        id: null,
        templateId: null,
        itemName: '',
        itemContent: '',
        itemScore: null,
        pid: null
      },
      moduleRules: {
        itemName: [
          {required: true, message: '项目标题不可为空', trigger: 'blur'}
        ]
      },
      oldItemName: '',
      oldItemContent: '',
      submitModuleLoading: false,
      useAvailFlag: true,
      existedModule: {
        id: '',
        itemName: '',
        itemContent: '',
        pid: null,
        oldFlag: true,
        pItemName: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'auditPlanUploadApi'
    ])
  },
  created: function () {
    // 获取跳转传值：planId
    if (this.$route.query.planId !== undefined) {
      this.planId = this.$route.query.planId
      this.templateId = this.$route.query.templateId
      this.getPlanInfoByPlanId(this.$route.query.planId)
      this.getFilesByCond(this.$route.query.planId, this.$route.query.templateId)
      this.getFilesByPlanId(this.$route.query.planId)
      this.getTemplateByPlanId(this.$route.query.planId)
      this.getSelfTemplate(this.templateId)
      this.getAvailSelfTemp(this.templateId)
    }
    // this.getAvailableAuditor(this.cond)
  },
  methods: {
    // 获取审核计划基本信息
    getPlanInfoByPlanId(id) {
      this.oldAuditorDatas = []
      this.auditorDatas = []
      getAuditPlanById(id).then(res => {
        // todo 后续还得添加对其他模板的判断，当前仅有'VDA6.3'
        if (validIsNotNull(res.templateType) &&
          res.templateType !== 'VDA6.3') {
          this.templateSelfFlag = true
        }
        // alert(this.templateSelfFlag)
        this.plan = res
        this.plan.planTime = validIsNotNull(res.planTime) ? res.planTime : ''
        this.planTimeFormatValue = validIsNotNull(res.planTime) ? GMTToDate(res.planTime) : ''
        this.oldPlanTime = res.planTime
        if (this.plan.status) {
          if (this.execStatusDict.indexOf(this.plan.status) >= 0) {
            this.editDisabled = true
          }
        }
        if (res.auditors.length > 0) {
          res.auditors.forEach((r, index) => {
            const obj = {id: r.id, username: r.username}
            this.oldAuditorDatas.push(obj)
            this.auditorDatas.push(obj)
          })
        }
      })
    },
    // 查询审核计划模板信息
    getTemplateByPlanId(id) {
      getPlanTemplateByPlanId(id).then(res => {
        // alert(JSON.stringify(res))
        this.template = res
      })
    },
    // 选择模块变化监控
    existedModuleChangeHandler(id) {
      getById(id).then(res => {
        // alert(JSON.stringify(res))
        this.existedModule = res
      })
    },
    toAddModule() {
      this.childrenData = []
      this.realTableData = []
      if (!this.useAvailFlag) {
        // alert(JSON.stringify(this.moduleNames))
        // alert(this.moduleName.trim())
        if (!validIsNotNull(this.moduleName)) {
          this.$message({
            message: 'No ModuleName Found! 请填写模块名称!',
            type: 'warning'
          })
          return false
        } else if (this.moduleNames.indexOf(this.moduleName.trim()) > -1) {
          this.$message({
            message: 'Root ModuleName Existed! 根节点模块名称已存在，请重新定义!',
            type: 'warning'
          })
          return false
        }
        /*else if (validIsNotNull(this.moduleContent) && this.modelContents.indexOf(this.moduleContent.trim()) > -1) {
        this.$message({
          message: 'Root Module Content Existed! 根节点模块内容已存在，请重新定义!',
          type: 'warning'
        })
        return false
      }*/

        // 当前处理:模块内容可以为空
        /* if (!validIsNotNull(this.moduleContent)) {
        this.$message({
          message: 'No ModuleName Found! 请填写模块内容!',
          type: 'warning'
        })
        return false
      }*/
        // 当前处理:表中可以不传数据的
        /*if (!this.templateData.length > 0) {
        this.$message({
          message: 'No Content Found! 未检测到表中有数据，无法提交空表!',
          type: 'warning'
        })
        return false
      }*/
        const mObj = {
          id: 0,
          itemName: this.moduleName,
          PItemName: null,
          pid: null,
          itemContent: this.moduleContent,
          itemScore: null
        }
        this.realTableData.push(mObj)
        this.templateData.forEach((data, index) => {
          const obj = {
            id: null,
            // templateId: this.templateId,
            itemName: data.itemName,
            PItemName: this.moduleName,
            pid: 0,
            itemContent: data.itemContent,
            itemScore: null
          }
          this.childrenData.push(obj)
          this.realTableData.push(obj)
        })
        this.selfTemplate = {
          id: 0,
          templateId: this.templateId,
          itemName: this.moduleName,
          PItemName: null,
          pid: null,
          itemContent: this.moduleContent,
          itemScore: null,
          oldFlag: false,
          children: this.childrenData
        }
      } else {
        this.moduleName = this.existedModule.itemName
        this.moduleContent = this.existedModule.itemContent
        if (!validIsNotNull(this.moduleName)) {
          this.$message({
            message: 'No Module Found! 扩展模式下请务必选择模块!',
            type: 'warning'
          })
          return false
        }
        // 当前处理:表中可以不传数据的
        if (!this.templateData.length > 0) {
          this.$message({
            message: 'No Content Found! 未检测到表中有数据，无法提交空表!',
            type: 'warning'
          })
          return false
        }
        const mObj = {
          id: this.existedModule.id,
          itemName: this.existedModule.itemName,
          PItemName: this.existedModule.pItemName,
          pid: this.existedModule.pid,
          itemContent: this.moduleContent,
          itemScore: null
        }
        // alert(JSON.stringify(this.existedModule))
        this.realTableData.push(mObj)
        this.templateData.forEach((data, index) => {
          const obj = {
            id: null,
            // templateId: this.templateId,
            itemName: data.itemName,
            PItemName: this.existedModule.itemName,
            pid: this.existedModule.id,
            itemContent: data.itemContent,
            itemScore: null
          }
          this.childrenData.push(obj)
          this.realTableData.push(obj)
        })
        // alert(JSON.stringify(this.realTableData))
        this.selfTemplate = {
          id: this.existedModule.id,
          templateId: this.templateId,
          itemName: this.existedModule.itemName,
          PItemName: this.existedModule.pItemName,
          pid: this.existedModule.pid,
          itemContent: this.existedModule.itemContent,
          itemScore: null,
          oldFlag: true,
          children: this.childrenData
        }
      }
      let allowSubmit = true
      this.realTableData.forEach((data, index) => {
        if (!validIsNotNull(data.itemName)) {
          this.$message({
            message: 'Cannot Create SelfTemplate Module! 项目名称不可为空!',
            type: 'warning'
          })
          allowSubmit = false
        }
      })
      if (allowSubmit) {
        this.addTableVisible = true
      }
    },
    // 保存更新自定义模板信息
    editTempItem(row) {
      this.moduleOptionTitle = '编辑项目'
      this.editModuleVisible = true
      this.moduleForm = row
      this.oldItemName = row.itemName
      this.oldItemContent = row.itemContent
    },
    doCancelModule() {
      this.editModuleVisible = false
      this.getSelfTemplate(this.templateId)
    },
    submitModule() {
      // alert(JSON.stringify(this.moduleForm))
      // 校验是否不合法
      this.$refs.moduleForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          // alert("测试："+judgeIsEqual('wocao','Cao'))
          if (judgeIsEqual(this.moduleForm.itemName.trim(), this.oldItemName) &&
            judgeIsEqual(this.moduleForm.itemContent, this.oldItemContent)) {
            this.$message({
              message: 'No Changes Found! 未检测到变化，无须更新!',
              type: 'warning'
            })
            return false
          }
          this.submitModuleLoading = true
          updateTempModule(this.moduleForm).then(res => {
            this.editModuleVisible = false
            this.$message({
              message: 'Update SelfTemplate Success! 自定义模板项目信息更新成功!',
              type: 'success'
            })
            this.submitModuleLoading = false
            this.getSelfTemplate(this.templateId)
          }).catch(() => {
            this.submitModuleLoading = false
            this.getSelfTemplate(this.templateId)
          })
        }
      })
    },
    // todo 新增模板模块项目
    addTempItem() {
      alert('todo -- 待新建')
    },
    // 取消删除操作
    cancelDelModule(scope) {
      // 模拟点击页面其它部分关掉弹层，防止因为该页面列表使用懒加载导致doClose无效
      document.body.click()
      this.$refs[`popover-${scope.$index + scope.row.id}`].doClose()
    },
    // 删除问题
    delModuleScore(id) {
      const data = []
      data.push(id)
      delSelfTemplate(data).then(res => {
        this.$message({
          message: 'Del Module Success! 删除模块成功!',
          type: 'success'
        })
        // this.tempModuleData.splice(index, 1)
        this.getSelfTemplate(this.templateId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除模块失败!',
          type: 'error'
        })
      })
    },
    // 根据有效期设置提醒样式
    tableRowClassName({row, rowIndex}) {
      if (!validIsNotNull(row.PItemName)) {
        return 'hr-row'
      }
    },
    pItemNameFormat(row, col) {
      if (!validIsNotNull(row.PItemName)) {
        return '/'
      } else {
        return row.PItemName
      }
    },
    scoreFormat(row, col) {
      if (!validIsNotNull(row.PItemName)) {
        return '/'
      } else {
        return row.itemScore
      }
    },
    moduleScoreFormat(row, col) {
      if (!validIsNotNull(row.pid)) {
        return '/'
      } else {
        return row.itemScore
      }
    },
    // 添加行数
    addClick() {
      const obj = {
        orderSort: this.templateData.length + 1,
        itemName: '',
        itemContent: '',
        itemScore: ''
      }
      this.templateData.push(obj)
    },
    // 删除行数
    handleDelete(index) {
      this.templateData.splice(index, 1)
    },
    // 添加新模板项目
    cancelOperation() {
      this.addTableVisible = false
      // this.getReportQuestionsByReportId(this.reportId)
    },
    toAddNewModule() {
      this.templateData = []
      this.moduleName = ''
      this.moduleContent = ''
      this.addTempScoreVisible = true
    },
    submitTable() {
      // alert(JSON.stringify(this.realTableData))
      // alert(JSON.stringify(this.selfTemplate))
      addSelfTemplate(this.selfTemplate).then(res => {
        this.$message({
          message: 'Create SelfTemplate Module Success! 模块新建成功!',
          type: 'success'
        })
        this.addTableVisible = false
        this.getSelfTemplate(this.templateId)
        this.getAvailSelfTemp(this.templateId)
        this.toAddNewModule()
      })
    },
    // 获取现有模板数据
    getAvailSelfTemp(id) {
      this.availSelfTempModules = []
      getSelfByTemplateId(id).then(res => {
        // alert(JSON.stringify(res))
        this.availSelfTempModules = res
      })
    },
    // 获取自定义模板数据
    getSelfTemplate(id) {
      this.selfTempScoresLoading = true
      this.selfTempScores = []
      this.moduleNames = []
      this.modelContents = []
      getTreeByTemplateId(id).then(res => {
        // alert(JSON.stringify(res))
        this.selfTempScoresLoading = false
        this.selfTempScores = res
        this.selfTempScores.forEach((data, index) => {
          if (!validIsNotNull(data.pid)) {
            this.moduleNames.push(data.itemName)
            this.modelContents.push(data.itemContent)
          }
        })
        // alert(JSON.stringify(this.moduleNames))
      })
    },
    // 获取审核人员信息
    getAvailableAuditor(cond, existedAuditors) {
      this.actualAuditors = []
      // alert('已存在数据：' + JSON.stringify(existedAuditors))
      getAuditorByExample(cond).then(res => {
        this.auditors = res
        // 方法一：去除已存在的审核人员 existedAuditors
        if (existedAuditors.length > 0) {
          const arr = []
          if (this.auditors.length > 0) {
            this.auditors.forEach((data, index) => {
              // const obj = {id:data.id,username:data.username}
              arr.push(data.id)
            })
          }
          // alert('源数据：' + JSON.stringify(arr))
          for (let i = 0; i < existedAuditors.length; i++) {
            if (arr.indexOf(existedAuditors[i].id) > -1) {
              arr.splice(arr.indexOf(existedAuditors[i].id), 1)
            }
          }
          this.auditors.forEach((data, index) => {
            if (arr.indexOf(data.id) > -1) {
              this.actualAuditors.push(data)
            }
          })
        } else {
          this.actualAuditors = this.auditors
        }
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
    // 回滚操作
    refreshPlan() {
      this.getPlanInfoByPlanId(this.$route.query.planId)
      this.planHasChanged = false
      this.planTimeChanged = false
      this.auditorsChanged = false
    },
    // todo 保存计划变更
    savePlanChange() {
      // alert(JSON.stringify(this.plan))
      if (this.auditorDatas.length === 0) {
        this.$message({
          message: 'Auditors Needed! 审核人员不可为空!',
          type: 'warning'
        })
        return false
      }
      if (!validIsNotNull(this.plan.planTime)) {
        this.$message({
          message: 'PlanTime Needed! 审核计划时间内容不可为空!',
          type: 'warning'
        })
        return false
      }
      this.plan.auditors = this.auditorDatas
      edit(this.plan).then(res => {
        this.$message({
          message: 'Update AuditPlan Success! 更新审核计划成功!',
          type: 'success'
        })
        this.refreshPlan()
      })
    },
    // 上传附件之前判断
    beforeUpload: function (file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 上传计划模板下附件
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 上传审核计划附件
    submitPlanFileUpload() {
      this.$refs.uploadPlanFile.submit()
    },
    // 监听计划模板附件上传成功
    handleSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.upload.clearFiles()
      this.plan.approvalStatus = '待激活'
      this.getFilesByCond(this.planId, this.templateId)
      this.getPlanInfoByPlanId(this.$route.query.planId)
    },
    // 监听计划自身附件上传成功
    handlePlanFileSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.uploadPlanFile.clearFiles()
      this.getFilesByPlanId(this.planId)
      this.getPlanInfoByPlanId(this.$route.query.planId)
    },
    // 激活审批
    updateApprovalStatus() {
      if (!(this.planFiles.length > 0)) {
        this.$message({
          message: 'Files Must Exist!必须添加相关计划附件作为发起审批的依据',
          type: 'warning'
        })
      } else {
        this.$confirm('确认添加完了？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 发起审批',
          cancelButtonText: 'No 继续添加'
        })
          .then(() => {
            // alert(this.$route.query.planId)
            activatedByPlanId(this.$route.query.planId).then(res => {
              this.$message({
                message: 'Activate Approval Process Success! 审批流程发起成功!',
                type: 'success'
              })
            }).catch(() => {

            })
            this.getPlanInfoByPlanId(this.$route.query.planId)
          })
      }
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
    // 删除审核计划附件
    deletePlanFile(id) {
      const data = []
      data.push(id)
      delAuditPlanFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除审核计划自身附件成功!',
          type: 'success'
        })
        this.getFilesByPlanId(this.planId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除审核计划自身附件失败!',
          type: 'error'
        })
      })
    },
    handleClose(tag) {
      this.auditorDatas.splice(this.auditorDatas.indexOf(tag), 1)
      this.auditorsChanged = this.oldAuditorDatas.length !== this.auditorDatas.length
      this.judgePlanChanged()
      this.selectVisible = false
    },
    // 展开添加审核人员框
    showInput() {
      this.selectVisible = true
      this.$nextTick(_ => {
        this.$refs.addAuditorInput.focus()
      })
      this.getAvailableAuditor(this.cond, this.auditorDatas)
    },
    // 确认输入
    handleSelectConfirm() {
      // alert(JSON.stringify(this.newAuditor))
      const inputValue = this.newAuditor
      if (inputValue) {
        this.auditorDatas.push(inputValue)
      }

      this.auditorsChanged = this.oldAuditorDatas.length !== this.auditorDatas.length
      this.judgePlanChanged()
      this.selectVisible = false
      this.newAuditor = null
    },
    // todo 后续用到-计划时间的变更监控
    handleInputConfirm() {
      this.planTimeChanged = !judgeIsEqual(GMTToDate(this.inputTimeValue), GMTToDate(this.oldPlanTime))
      const inputValue = this.inputTimeValue
      this.planTimeFormatValue = GMTToDate(this.inputTimeValue)
      this.plan.planTime = inputValue
      // alert(this.plan.planTime)
      if (validIsNotNull(inputValue)) {
        this.planTimeInputVisible = false
      } else {
        this.$message({
          message: 'Submit Failed! 审核计划时间内容不可为空!',
          type: 'warning'
        })
      }
      this.judgePlanChanged()
    },
    judgePlanChanged() {
      // 监控审核计划基本信息是否发生了变化
      this.planHasChanged = this.planTimeChanged === true || this.auditorsChanged === true
    },
    // 判断是否存在剩余可选择的审核人员，没有的话800ms后自动关闭
    judgeIsNull() {
      setTimeout(() => {
        if (this.actualAuditors.length === 0) {
          this.selectVisible = false
        }
      }, 800)
    },
    // 计划时间触发变化
    timeChange() {
      this.planTimeInputVisible = true
      this.inputTimeValue = this.plan.planTime
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.planTimeInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.el-table .hr-row {
  font-weight: bold !important;
}

::v-deep .box-card {
  margin: 5px 0;
}

::v-deep .el-table__fixed-right {
  height: 100% !important;
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
</style>
