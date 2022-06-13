<template>
  <div class="app-container">
    <div class="dashboard-editor-container" v-if="!isActive">
      <!--header:进度条-->
      <panel-group
        v-if="destroyUnlockData"
        @handleChartData="handleChartData"
        :draft-step="draftStep"
        :draft-status="draftStatus"
        :manage-step="manageStep"
        :manage-status="manageStatus"
        :approve-step="approveStep"
        :approve-status="approveStatus"
        :unlock-step="changeForm.unlockSteps"
      />
    </div>
    <div v-if="isActive">
      <!--页头-->
      <el-card class="box-card">
        <el-page-header @back="backToPanel" :content="activeContent">
        </el-page-header>
      </el-card>
      <!--页面内容-->
      <el-card class="box-card">
        <!--起草变更信息-->
        <div v-if="type==='draft'">
          <el-row class="el-row-margin">
            <el-steps :active="changeForm.finishedStep" finish-status="success" simple>
              <el-step id="identity" icon="el-icon-edit">
                <template slot="title">
                  <div>
                    <a class="a" @click="activeIdentityIssue(1,'identity')">步骤 1：识别</a>
                  </div>
                </template>
              </el-step>
              <el-step icon="el-icon-upload">
                <template slot="title">
                  <div>
                    <a class="a" @click="activeIdentityIssue(2,'classify')">步骤 2：分类</a>
                  </div>
                </template>
              </el-step>
              <el-step icon="el-icon-data-analysis">
                <template slot="title">
                  <div>
                    <a class="a" @click="activeIdentityIssue(3,'analyze')">步骤 3：分析</a>
                  </div>
                </template>
              </el-step>
              <el-step icon="el-icon-thumb">
                <template slot="title">
                  <div>
                    <a class="a" @click="activeIdentityIssue(4,'decide')">步骤 4：确认/创建</a>
                  </div>
                </template>
              </el-step>
            </el-steps>
          </el-row>
          <el-row class="el-row-margin">
            <el-form
              ref="changeForm"
              :model="changeForm"
              :rules="changeRules"
              size="small"
              label-width="110px"
            >
              <!--变更识别-->
              <el-card v-if="stepName==='identity'" class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>变更识别</span>
                  <el-button v-if="disDraftEdit === false" style="float: right;" :disabled="isIdentityButtonGray"
                             type="primary"
                             @click="saveChangeForm(1,changeForm,true)">保存
                  </el-button>
                </div>
                <div class="text item">
                  <el-row>
                    <el-col :span="12">
                      <!--变更原因-->
                      <el-form-item
                        label="变更原因"
                        prop="reason"
                        required
                      >
                        <el-select
                          v-model="changeForm.reason"
                          placeholder="请选择变更原因"
                          style="width: 370px;"
                          :disabled="disDraftEdit===true"
                          @change="changeReasonHandler"
                        >
                          <el-option
                            v-for="item in changeReasons"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                      <!--问题来源-->
                      <el-form-item
                        label="变更来源"
                        prop="source"
                        required
                      >
                        <el-radio
                          v-for="item in dict.d_source"
                          :key="item.value"
                          v-model="changeForm.source"
                          :label="item.value"
                          :disabled="disDraftEdit===true"
                          @change="sourceChangeHandler"
                        >
                          {{ item.value }}
                        </el-radio>
                      </el-form-item>
                      <!--发起人信息：人、部门、日期-->
                      <el-form-item
                        label="发起人"
                        prop="initiator"
                        required
                      >
                        <el-input
                          v-model="changeForm.initiator"
                          placeholder="请输入发起人姓名"
                          style="width: 370px;"
                          :disabled="disDraftEdit===true"
                          @input="initiatorChangeHandler"
                        />
                      </el-form-item>
                      <el-form-item
                        label="发起部门"
                        prop="department"
                      >
                        <el-input
                          v-model="changeForm.department"
                          placeholder="请输入发起人所在部门"
                          style="width: 370px;"
                          :disabled="disDraftEdit===true"
                          @input="initDepartChangeHandler"
                        />
                      </el-form-item>
                      <el-form-item
                        label="发起时间"
                        prop="initTime"
                      >
                        <el-date-picker
                          v-model="changeForm.initTime"
                          :picker-options="initTimeOption"
                          type="datetime"
                          style="width: 370px;"
                          placeholder="请填写日期时间"
                          default-time="12:00:00"
                          :disabled="disDraftEdit===true"
                          @change="initTimeChangeHandler"
                        />
                      </el-form-item>
                    </el-col>
                    <!--影响范围-->
                    <el-col :span="12">
                      <!--影响到的地区范围-->
                      <el-form-item label="涉及地域" prop="area" required>
                        <div v-if="disDraftEdit === true">
                          <el-tag
                            v-for="tag in changeForm.areaTags"
                            :key="tag"
                            :disable-transitions="false"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                        </div>
                        <div v-else>
                          <el-tag
                            v-for="tag in changeForm.areaTags"
                            :key="tag"
                            closable
                            :disable-transitions="false"
                            @close="handleAreaClose(tag)"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                          <el-input
                            v-if="inputAreaVisible"
                            ref="areaTagInput"
                            v-model="inputAreaValue"
                            class="input-new-tag"
                            size="small"
                            placeholder="可能影响到的地区、厂区等"
                            @keyup.enter.native="handleInputAreaConfirm"
                            @blur="handleInputAreaConfirm"
                          />
                          <el-button v-else class="button-new-tag" size="small" @click="showInputArea">+涉及地域</el-button>
                        </div>
                      </el-form-item>
                      <!--影响到的部门-->
                      <el-form-item label="涉及部门" prop="depart" required>
                        <div v-if="disDraftEdit === true">
                          <el-tag
                            v-for="tag in changeForm.departTags"
                            :key="tag"
                            :disable-transitions="false"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                        </div>
                        <div v-else>
                          <el-tag
                            v-for="tag in changeForm.departTags"
                            :key="tag"
                            closable
                            :disable-transitions="false"
                            @close="handleDepartClose(tag)"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                          <el-input
                            v-if="inputDepartVisible"
                            ref="departTagInput"
                            v-model="inputDepartValue"
                            class="input-new-tag"
                            size="small"
                            placeholder="涉及到的相关部门"
                            @keyup.enter.native="handleInputDepartConfirm"
                            @blur="handleInputDepartConfirm"
                          />
                          <el-button v-else class="button-new-tag" size="small" @click="showInputDepart">+涉及部门
                          </el-button>
                        </div>
                      </el-form-item>
                      <!--影响到的项目-->
                      <el-form-item label="涉及项目" prop="depart" required>
                        <div v-if="disDraftEdit === true">
                          <el-tag
                            v-for="tag in changeForm.projectTags"
                            :key="tag"
                            :disable-transitions="false"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                        </div>
                        <div v-else>
                          <el-tag
                            v-for="tag in changeForm.projectTags"
                            :key="tag"
                            closable
                            :disable-transitions="false"
                            @close="handleProjectClose(tag)"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                          <el-input
                            v-if="inputProjectVisible"
                            ref="projectTagInput"
                            v-model="inputProjectValue"
                            class="input-new-tag"
                            size="small"
                            placeholder="可能影响到的项目编码及名称等信息"
                            @keyup.enter.native="handleInputProjectConfirm"
                            @blur="handleInputProjectConfirm"
                          />
                          <el-button v-else class="button-new-tag" size="small" @click="showInputProject">+涉及项目
                          </el-button>
                        </div>
                      </el-form-item>
                      <!--影响到的产品-->
                      <el-form-item label="涉及产品" prop="production" required>
                        <div v-if="disDraftEdit === true">
                          <el-tag
                            v-for="tag in changeForm.prodTags"
                            :key="tag"
                            @close="handleProdClose(tag)"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                        </div>
                        <div v-else>
                          <el-tag
                            v-for="tag in changeForm.prodTags"
                            :key="tag"
                            closable
                            :disable-transitions="false"
                            @close="handleProdClose(tag)"
                            class="new-el-tag"
                          >
                            {{ tag }}
                          </el-tag>
                          <el-input
                            v-if="inputProdVisible"
                            ref="prodTagInput"
                            v-model="inputProdValue"
                            class="input-new-tag"
                            size="small"
                            placeholder="可能影响到的产品系列、零件编码/名称等信息"
                            @keyup.enter.native="handleInputProdConfirm"
                            @blur="handleInputProdConfirm"
                          />
                          <el-button v-else class="button-new-tag" size="small" @click="showInputProd">+涉及产品</el-button>
                        </div>
                      </el-form-item>
                      <!--费用评估-->
                      <el-form-item
                        label="费用评估"
                        prop="cost"
                        required
                      >
                        <el-input
                          v-model="changeForm.cost"
                          placeholder="请输入预估费用"
                          style="width: 370px;"
                          :disabled="disDraftEdit===true"
                          @input="costChangeHandler"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
              <!--变更分类-->
              <el-card v-if="stepName==='classify'" class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>变更分类</span>
                </div>
                <div class="text item">
                  <!--动态添加人机料法环等分类-->
                  <el-form-item ref="changeFactors">
                    <span slot="label">
                      <span class="span-box">
                        <span>主要因素</span><br>
                        <el-button
                          v-if="disDraftEdit === false"
                          type="primary"
                          style="margin-top: 8px;"
                          class="button-new-tag"
                          size="small"
                          @click="toAddFactor"
                        >添加因素
                        </el-button>
                      </span>
                    </span>
                    <el-table
                      ref="refTable"
                      border
                      v-loading="changeFactorsLoading"
                      :data="changeFactors"
                      style="width: 100%;"
                      @expand-change="expendFactorSelected"
                    >
                      <el-table-column type="expand">
                        <template slot-scope="props">
                          <!--也可启用下面注释部分的el-descriptions代替el-form-->
                          <el-form label-position="left" class="demo-table-expand">
                            <el-form-item label="影响因素标题">
                              <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="因素变更类型">
                              <span>{{ props.row.type }}</span>
                            </el-form-item>
                            <el-form-item label="因素附件列表">
                              <el-table
                                ref="table"
                                border
                                v-loading="factorFilesLoading"
                                :data="factorFiles"
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
                                <el-table-column prop="createBy" label="创建者" min-width="80" />
                                <!--   附件删除   -->
                                <el-table-column
                                  v-if="disDraftEdit === false"
                                  label="操作"
                                  width="80"
                                  align="center"
                                >
                                  <template slot-scope="scope">
                                      <!--删除-->
                                      <el-popover
                                        :ref="`delFactorFile-popover-${scope.$index}`"
                                        v-permission="permission.edit"
                                        placement="top"
                                        width="180"
                                      >
                                        <p>确定删除这个附件吗？</p>
                                        <div style="text-align: right; margin: 0">
                                          <el-button
                                            size="mini"
                                            type="text"
                                            @click="scope._self.$refs[`delFactorFile-popover-${scope.$index}`].doClose()"
                                          >取消
                                          </el-button>
                                          <el-button
                                            type="primary"
                                            size="mini"
                                            @click="delFactorFile(scope.row), scope._self.$refs[`delFactorFile-popover-${scope.$index}`].doClose()"
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
                                  </template>
                                </el-table-column>
                              </el-table>
                              <el-button
                                v-if="disDraftEdit === false"
                                type="primary"
                                style="margin-top: 8px;"
                                class="button-new-tag"
                                icon="el-icon-plus"
                                size="small"
                                @click="toUploadFactorFile(props.row)"
                              >上传因素附件
                              </el-button>
                            </el-form-item>
                          </el-form>
                        </template>
                      </el-table-column>
                      <el-table-column prop="name" label="主要因素标题"/>
                      <el-table-column label="变更类型">
                        <template slot-scope="scope">
                          <el-tag
                            :type="scope.row.type === '重大变更' ? 'warning' : 'success'"
                            disable-transitions>{{ scope.row.type }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="createBy" label="创建人"/>
                      <el-table-column prop="createTime" label="创建时间"/>
                      <!--   编辑与删除   -->
                      <el-table-column
                        label="操作"
                        width="160px"
                        align="center"
                        fixed="right"
                        v-if="disDraftEdit === false"
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
                              @click="editFactor(scope.row)"
                            />
                            <!--删除-->
                            <el-popover
                              :ref="`delFactor-popover-${scope.$index}`"
                              v-permission="permission.edit"
                              placement="top"
                              width="180"
                            >
                              <p>确定删除本条数据吗？</p>
                              <div style="text-align: right; margin: 0">
                                <el-button
                                  size="mini"
                                  type="text"
                                  @click="scope._self.$refs[`delFactor-popover-${scope.$index}`].doClose()"
                                >取消
                                </el-button>
                                <el-button
                                  type="primary"
                                  size="mini"
                                  @click="delFactor(scope.row.id), scope._self.$refs[`delFactor-popover-${scope.$index}`].doClose()"
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
                  </el-form-item>
                  <!--是否是客户请求-->
                  <el-row class="el-row-margin" style="border: 1px solid #dcdfe6;" >
                    <el-col :span="24">
                      <!--问题来源-->
                      <el-form-item
                        label="是否客户要求"
                        prop="isCustomer"
                        required
                      >
                        <el-radio-group v-model="changeForm.isCustomer">
                          <el-radio
                            v-for="item in dict.common_status"
                            :key="item.id"
                            :label="item.value"
                            disabled
                          >{{ item.label }}
                          </el-radio>
                        </el-radio-group>
                        <el-button v-if="disDraftEdit === false" style="float: right;margin-right: 10px;" type="primary" :disabled="isClassifyButtonGray"
                                   @click="saveChangeForm(2,changeForm,true)">保存
                        </el-button>
                      </el-form-item>
                      <el-form-item
                        v-if="changeForm.isCustomer==='false'"
                        label="备注"
                        prop="remark"
                        required
                      >
                        <el-input
                          :disabled="disDraftEdit === true"
                          v-model="changeForm.remark"
                          type="textarea"
                          :rows="3"
                          placeholder="请输入备注"
                          style="width: 370px;"
                          @input="remarkChangeHandler"
                        />
                      </el-form-item>
                      <el-form-item
                        v-if="changeForm.isCustomer==='true'"
                        label="客户邮箱"
                        prop="email"
                        required
                      >
                        <el-input
                          v-model="changeForm.email"
                          style="width: 370px;"
                          @input="emailChangeHandler"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col v-if="changeForm.isCustomer==='true'" :span="24" ref="cusFiles">
                          <el-form-item>
                            <span slot="label">
                              <span class="span-box">
                               <span><i style="color:#f00;">*&nbsp;</i>{{ cusType }}</span><br>
                               <el-button
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(cusType)"
                               >上传证据
                               </el-button>
                             </span>
                            </span>
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
                                      :ref="`delCusFile-popover-${scope.$index}`"
                                      v-permission="permission.edit"
                                      placement="top"
                                      width="180"
                                    >
                                      <p>确定删除这个附件吗？</p>
                                      <div style="text-align: right; margin: 0">
                                        <el-button
                                          size="mini"
                                          type="text"
                                          @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                        >取消
                                        </el-button>
                                        <el-button
                                          type="primary"
                                          size="mini"
                                          @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                        >确定
                                        </el-button>
                                      </div>
                                      <el-button
                                        slot="reference"
                                        v-permission="permission.edit"
                                        type="danger"
                                        icon="el-icon-delete"
                                        size="mini"
                                        :disabled="cusFiles.length === 1"
                                      />
                                    </el-popover>
                                  </div>
                                </template>
                              </el-table-column>
                            </el-table>
                          </el-form-item>
                        </el-col>
                  </el-row>
                </div>
              </el-card>
              <!--变更分析-->
              <el-card v-if="stepName==='analyze'" class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>变更分析</span>
                  <el-button v-if="disDraftEdit === false"
                             style="float: right;"
                             type="primary"
                             :disabled="isAnalyzeButtonGray"
                             @click="saveChangeForm(3,changeForm,true)">保存
                  </el-button>
                </div>
                <div class="text item">
                  <!--风险分析附件-->
                  <el-row class="el-row-margin">
                    <el-col :span="24" ref="riskAssessFiles">
                      <el-form-item>
                            <span slot="label">
                              <span class="span-box">
                                <span><i style="color:#f00;">*&nbsp;</i>{{ riskAssessType }}</span><br>
                               <el-button
                                 v-if="disDraftEdit === false"
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(riskAssessType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                          <!--   编辑与删除   -->
                          <el-table-column
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                            v-if="disDraftEdit === false"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    :disabled="riskAssessFiles.length === 1"
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--变更范围-->
                  <el-row class="el-row-margin" ref="scopeTags">
                    <el-col :span="12">
                      <el-form-item prop="scopeTags">
                        <span slot="label">
                              <span class="span-box">
                                <span><i style="color:#f00;">*&nbsp;</i>变更范围</span><br>
                              </span>
                        </span>
                        <el-checkbox :disabled="disDraftEdit === true" :indeterminate="isIndeterminate"
                                     v-model="checkAll" @change="handleCheckAllChange">
                          全选
                        </el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="changeForm.scopeTags" @change="handleCheckedScopeChange">
                          <el-checkbox v-for="scope in enableScopes" :label="scope" :key="scope"
                                       :disabled="disDraftEdit === true">
                          </el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--初始化变更范围附件添加列表-->
                  <!--<el-row class="el-row-margin"
                          v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.length >0">
                    <el-col :span="24">
                      <el-form-item v-for="scope in changeForm.scopeTags" required>
                            <span slot="label">
                              <span class="span-box">
                               <span>{{ scope }}</span><br>
                               <el-button
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(scope)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
                        <el-table
                          ref="table"
                          v-loading="scopeFilesLoading"
                          border
                          :data="scopeFiles"
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
                          <el-table-column prop="size" label="大小" min-width="80"/>
                          <el-table-column prop="type" label="类型" min-width="80"/>
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
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
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
                      </el-form-item>
                    </el-col>
                  </el-row>-->
                  <!--文档变更-->
                  <el-row class="el-row-margin"
                          v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(docChangeType) > -1">
                    <el-col :span="24" ref="docChangeFiles">
                      <el-form-item>
                            <span slot="label">
                              <span class="span-box">
                               <span><i style="color:#f00;">*&nbsp;</i>{{ docChangeType }}</span><br>
                               <el-button
                                 v-if="disDraftEdit === false"
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(docChangeType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                          <!--   编辑与删除   -->
                          <el-table-column
                            v-if="disDraftEdit === false"
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    :disabled="docChangeFiles.length===1"
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--过程变更-->
                  <el-row ref="processChangeFiles" class="el-row-margin"
                          v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(processChangeType) > -1">
                    <el-col :span="24">
                      <el-form-item>
                            <span slot="label">
                              <span class="span-box">
                               <span><i style="color:#f00;">*&nbsp;</i>{{ processChangeType }}</span><br>
                               <el-button
                                 v-if="disDraftEdit === false"
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(processChangeType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                          <!--   编辑与删除   -->
                          <el-table-column
                            v-if="disDraftEdit === false"
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    :disabled="processChangeFiles.length === 1"
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--工具变更-->
                  <el-row class="el-row-margin"
                          v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(toolChangeType) > -1">
                    <el-col :span="24" ref="toolChangeFiles">
                      <el-form-item>
                            <span slot="label">
                              <span class="span-box">
                               <span><i style="color:#f00;">*&nbsp;</i>{{ toolChangeType }}</span><br>
                               <el-button
                                 v-if="disDraftEdit === false"
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(toolChangeType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                          <!--   编辑与删除   -->
                          <el-table-column
                            v-if="disDraftEdit === false"
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    :disabled="toolChangeFiles.length === 1 "
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--其他变更-->
                  <el-row class="el-row-margin"
                          v-if="changeForm.scopeTags !== undefined && changeForm.scopeTags.indexOf(otherChangeType) > -1">
                    <el-col :span="24" ref="otherChangeFiles">
                      <el-form-item>
                            <span slot="label">
                              <span class="span-box">
                               <span><i style="color:#f00;">*&nbsp;</i>{{ otherChangeType }}</span><br>
                               <el-button
                                 v-if="disDraftEdit === false"
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(otherChangeType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                          <!--   编辑与删除   -->
                          <el-table-column
                            v-if="disDraftEdit === false"
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    :disabled="otherChangeFiles.length === 1"
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--客户协议-->
                  <el-row class="el-row-margin">
                    <el-col :span="24">
                      <el-form-item
                        label="有无客户协议"
                        prop="havAgreement"
                        required
                      >
                        <el-radio-group v-model="changeForm.havAgreement" @change="havAgreementChangeHandler">
                          <el-radio
                            v-for="item in dict.common_having"
                            :key="item.id"
                            :label="item.value"
                            :disabled="disDraftEdit === true"
                          >{{ item.label }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24" ref="agreeFiles">
                      <el-form-item v-if="changeForm.havAgreement==='true'">
                            <span slot="label">
                              <span class="span-box">
                               <span>{{ agreeType }}</span><br>
                               <el-button
                                 v-if="disDraftEdit === false"
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(agreeType)"
                               >添加协议
                               </el-button>
                             </span>
                            </span>
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
                          <!--   编辑与删除   -->
                          <el-table-column
                            v-if="disDraftEdit === false"
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    :disabled="agreeFiles.length === 1"
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
              <!--变更确认-->
              <el-card v-if="stepName==='decide'" class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                  <span>变更确认/创建</span>
                  <el-button v-if="disDraftEdit === false"
                             style="float: right;"
                             type="primary"
                             :disabled="isDecideButtonGray"
                             @click="saveChangeForm(4,changeForm,true)">保存
                  </el-button>
                </div>
                <div class="text item">
                  <el-row class="el-row-margin">
                    <!--审批部门、审批者姓名-->
                    <el-col :span="24">
                      <el-form-item
                        label="审批部门"
                        prop="approveDepart"
                        required
                      >
                        <el-input
                          v-model="changeForm.approveDepart"
                          placeholder="请输入审批部门"
                          style="width: 370px;"
                          :disabled="disDraftEdit === true"
                          @input="approveDepartChangeHandler"
                        />
                      </el-form-item>
                      <el-form-item
                        label="审批人"
                        prop="approveBy"
                        required
                      >
                        <el-input
                          v-model="changeForm.approveBy"
                          placeholder="请输入审批人姓名"
                          style="width: 370px;"
                          :disabled="disDraftEdit === true"
                          @input="approveByChangeHandler"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--评估报告-->
                  <el-row class="el-row-margin">
                    <el-col :span="24">
                      <el-form-item
                        label="有无评估报告"
                        prop="havReport"
                        required
                      >
                        <el-radio-group v-model="changeForm.havReport" @change="havReportChangeHandler">
                          <el-radio
                            v-for="item in dict.common_having"
                            :key="item.id"
                            :label="item.value"
                            :disabled="disDraftEdit === true"
                          >{{ item.label }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24" ref="evReportFiles">
                      <el-form-item v-if="changeForm.havReport === 'true'" >
                            <span slot="label">
                              <span class="span-box">
                               <span><i style="color:#f00;">*&nbsp;</i>{{ assessReportType }}</span><br>
                               <el-button
                                 v-if="disDraftEdit === false"
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(assessReportType)"
                               >添加报告
                               </el-button>
                             </span>
                            </span>
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
                          <!--   编辑与删除   -->
                          <el-table-column
                            v-if="disDraftEdit === false"
                            label="操作"
                            min-width="130px"
                            align="center"
                            fixed="right"
                          >
                            <template slot-scope="scope">
                              <div>
                                <!--删除-->
                                <el-popover
                                  :ref="`delCusFile-popover-${scope.$index}`"
                                  v-permission="permission.edit"
                                  placement="top"
                                  width="180"
                                >
                                  <p>确定删除这个附件吗？</p>
                                  <div style="text-align: right; margin: 0">
                                    <el-button
                                      size="mini"
                                      type="text"
                                      @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >取消
                                    </el-button>
                                    <el-button
                                      type="primary"
                                      size="mini"
                                      @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                    >确定
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    v-permission="permission.edit"
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="mini"
                                    :disabled="evReportFiles.length === 1"
                                  />
                                </el-popover>
                              </div>
                            </template>
                          </el-table-column>
                        </el-table>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <!--是否同意-->
                  <el-row class="el-row-margin">
                    <el-col :span="24">
                      <el-form-item
                        label="是否同意"
                        prop="isAccepted"
                        required
                      >
                        <el-radio-group v-model="changeForm.isAccepted" @change="acceptChangeHandler">
                          <el-radio
                            v-for="item in dict.common_status"
                            :key="item.id"
                            :label="item.value"
                            :disabled="disDraftEdit === true"
                          >{{ item.label }}
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-form>
          </el-row>
        </div>
        <!--变更管理-->
        <div v-else-if="type==='management'">
          <el-form
            ref="manageForm"
            :model="manageForm"
            :rules="manageRules"
            size="small"
            label-width="160px"
          >
            <el-row class="el-row-margin">
              <el-steps :active="manageForm.finishedStep" finish-status="success" simple>
                <el-step icon="el-icon-edit">
                  <template slot="title">
                    <div>
                      <a class="a" @click="activeManageIssue(1,'manage')">步骤 1：管理</a>
                    </div>
                  </template>
                </el-step>
                <el-step icon="el-icon-upload">
                  <template slot="title">
                    <div>
                      <a class="a" @click="activeManageIssue(2,'ECN')">步骤 2：ECN</a>
                    </div>
                  </template>
                </el-step>
              </el-steps>
            </el-row>
            <el-card v-if="stepMangeName==='manage'" class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>变更管理</span>
                <el-button v-if="disManageEdit === false" :disabled="isManageButtonGray" style="float: right;" type="primary"  @click="saveManageForm">保存
                </el-button>
              </div>
              <div class="text item">
                <!--变更管理-->
                <el-row class="el-row-margin-border">
                  <!--part drawing-->
                  <el-col :span="24">
                    <el-form-item
                      label="零件图纸"
                      prop="partDrawing"
                      required
                      class="el-item-no-margin"
                    >
                      <el-radio-group v-model="manageForm.partDrawing" @change="partDrawingChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="partDrawingFiles" :span="24" v-if="manageForm.partDrawing==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ partDrawingType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(partDrawingType)"
                          >添加证据
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="partDrawingFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--document/sop/wi-->
                <el-row class="el-row-margin-border">
                  <el-col :span="24">
                    <el-form-item
                      label="文档/作业程序/指导书"
                      class="el-item-no-margin"
                      prop="document"
                    >
                      <el-radio-group v-model="manageForm.document" @change="documentChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="docFiles" :span="24" v-if="manageForm.document==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ docType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(docType)"
                          >添加证据
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="docFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--evaluation report-->
                <el-row class="el-row-margin-border">
                  <el-col :span="24">
                    <el-form-item
                      label="评审报告"
                      class="el-item-no-margin"
                      prop="evaluationReport"
                    >
                      <el-radio-group v-model="manageForm.evaluationReport" @change="evaluationReportChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="evaluateFiles" :span="24" v-if="manageForm.evaluationReport==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ evaluateType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(evaluateType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="evaluateFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--PPAP update-->
                <el-row class="el-row-margin-border">
                  <el-col :span="24">
                    <el-form-item
                      label="生产件批准程序"
                      class="el-item-no-margin"
                      prop="ppap"
                    >
                      <el-radio-group v-model="manageForm.ppap" @change="ppapChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="ppapFiles" :span="24" v-if="manageForm.ppap==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ ppapType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(ppapType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="ppapFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--control plan-->
                <el-row class="el-row-margin-border">
                  <el-col :span="24">
                    <el-form-item
                      label="控制计划"
                      class="el-item-no-margin"
                      prop="controlPlan"
                    >
                      <el-radio-group v-model="manageForm.controlPlan" @change="controlPlanChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="controlPlanFiles" :span="24" v-if="manageForm.controlPlan==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ controlPlanType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(controlPlanType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="controlPlanFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--APQP-->
                <el-row class="el-row-margin-border">
                  <el-col :span="24">
                    <el-form-item
                      label="产品质量先期策划"
                      class="el-item-no-margin"
                      prop="apqp"
                    >
                      <el-radio-group v-model="manageForm.apqp" @change="apqpChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="apqpFiles" :span="24" v-if="manageForm.apqp==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ apqpType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(apqpType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="apqpFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--samples part-->
                <el-row class="el-row-margin-border">
                  <el-col :span="24">
                    <el-form-item
                      label="样品零件"
                      class="el-item-no-margin"
                      prop="samplePart"
                    >
                      <el-radio-group v-model="manageForm.samplePart" @change="samplePartChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="samplePartFiles" :span="24" v-if="manageForm.samplePart==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ samplePartType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(samplePartType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="samplePartFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--tools-->
                <el-row class="el-row-margin-border">
                  <el-col :span="24">
                    <el-form-item
                      label="工具"
                      class="el-item-no-margin"
                      prop="tools"
                    >
                      <el-radio-group v-model="manageForm.tools" @change="toolsChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="toolsFiles" :span="24" v-if="manageForm.tools==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>工具</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(toolsType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="toolsFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--other-->
                <el-row class="el-row-margin-border">
                  <!--other-->
                  <el-col :span="24">
                    <el-form-item
                      label="其它"
                      class="el-item-no-margin"
                      prop="other"
                    >
                      <el-radio-group v-model="manageForm.other" @change="otherChangeHandler">
                        <el-radio
                          v-for="item in chooseOptions"
                          :key="item.value"
                          :label="item.value"
                          :disabled="disManageEdit === true"
                        >{{ item.value }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col ref="otherMFiles" :span="24" v-if="manageForm.other==='是'">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>其它</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(otherType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="otherMFiles.length === 0"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
            <!--ECN-->
            <el-card v-if="stepMangeName==='ECN'" class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>产品/过程变更提醒</span>
                <el-button style="float: right;"
                           type="primary"
                           @click="finishManageECN">提交
                </el-button>
              </div>
              <div class="text item">
                <!--产品/过程变更提醒-->
                <el-row class="el-row-margin">
                  <!--ECR Number-->
                  <el-col :span="12">
                    <el-form-item
                      label="变更识别码"
                      prop="changeNum"
                    >
                      <el-input
                        v-model="changeForm.changeNum"
                        disabled
                        style="width: 370px;"
                      />
                    </el-form-item>
                  </el-col>
                  <!--PCN flow chart PCN流程图-->
                  <el-col :span="24" ref="flowFiles">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ PCNFlowType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(PCNFlowType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="flowFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-divider content-position="left">检查变更影响</el-divider>
                <el-row class="el-row-margin">
                  <!--check impact of change 检查变更影响-->
                  <el-col :span="24" ref="recordFiles">
                    <!--记录-->
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ recordType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(recordType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="recordFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                    <!--反馈报告-->
                  <el-col :span="24" ref="evaluateReports">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ mEvaluateType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(mEvaluateType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="evaluateReports.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                    <!--培训记录-->
                  <el-col :span="24" ref="trainRecords">
                    <el-form-item required>
                      <span slot="label">
                        <span class="span-box">
                          <span>{{ trainRecordType }}</span><br>
                          <el-button
                            v-if="disManageEdit === false"
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            size="small"
                            @click="toUploadCusFile(trainRecordType)"
                          >添加附件
                          </el-button>
                        </span>
                      </span>
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
                        <!--   编辑与删除   -->
                        <el-table-column
                          v-if="disManageEdit === false"
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="trainRecords.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-form>
        </div>
        <!--变更同意/关闭-->
        <div v-else-if="type==='approve'">
          <el-form
            ref="approveForm"
            :model="approveForm"
            :rules="approveRules"
            size="small"
            label-width="130px"
          >
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <span>批准/关闭</span>
                <el-button style="float: right;"
                           type="primary"
                           :disabled="isCloseButtonGray"
                           @click="closeApproveForm"
                >批准/关闭
                </el-button>
              </div>
              <div class="text item">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>批准日期信息</span>
                    <el-button style="float: right;"
                               type="primary"
                               :disabled="isApproveButtonGray"
                               @click="saveApproveForm"
                    >保存
                    </el-button>
                  </div>
                  <div>
                    <el-row class="el-row-margin">
                      <!--implemented Date 实现日期-->
                      <el-col :span="12">
                        <el-form-item
                          label="变更实现日期"
                          prop="implementedTime"
                        >
                          <el-date-picker
                            v-model="approveForm.implementedTime"
                            :picker-options="initTimeOption"
                            type="datetime"
                            style="width: 370px;"
                            placeholder="请填写变更实现时间"
                            default-time="12:00:00"
                            @change="implTimeChangeHandler"
                          />
                        </el-form-item>
                      </el-col>
                      <!--送审客户日期-->
                      <el-col :span="12">
                        <el-form-item
                          label="送审客户日期"
                          prop="sendToCusTime"
                        >
                          <el-date-picker
                            v-model="approveForm.sendToCusTime"
                            :picker-options="initTimeOption"
                            type="datetime"
                            style="width: 370px;"
                            placeholder="请填写发给客户审批时间"
                            default-time="12:00:00"
                            @change="StoCusTimeChangeHandler"
                          />
                        </el-form-item>
                      </el-col>
                      <!--客户同意日期-->
                      <el-col :span="12">
                        <el-form-item
                          label="客户同意日期"
                          prop="acceptedByCusTime"
                        >
                          <el-date-picker
                            v-model="approveForm.acceptedByCusTime"
                            :picker-options="initTimeOption"
                            type="datetime"
                            style="width: 370px;"
                            placeholder="请填写客户同意变更的时间"
                            default-time="12:00:00"
                            @change="acceptedByCusTimeChangeHandler"
                          />
                        </el-form-item>
                      </el-col>
                      <!--内部团队同意日期-->
                      <el-col :span="12">
                        <el-form-item
                          label="内部同意日期"
                          prop="acceptedByInternalTime"
                        >
                          <el-date-picker
                            v-model="approveForm.acceptedByInternalTime"
                            :picker-options="initTimeOption"
                            type="datetime"
                            style="width: 370px;"
                            placeholder="请填写内部团队同意变更的时间"
                            default-time="12:00:00"
                            @change="acceptedByInternalTimeChangeHandler"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
                <el-row class="el-row-margin">
                  <el-col :span="24">
                    <!--buyoff report 验收报告-->
                    <el-form-item ref="buyOffFiles" required>
                            <span slot="label">
                              <span class="span-box">
                               <span>{{ buyOffType }}</span><br>
                               <el-button
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(buyOffType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="buyOffFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                    <!--客户同意证明-->
                    <el-form-item ref="cusAcceptFiles" required>
                            <span slot="label">
                              <span class="span-box">
                               <span>{{ cusAcceptType }}</span><br>
                               <el-button
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(cusAcceptType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="cusAcceptFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                    <!--内部同意证明-->
                    <el-form-item ref="internalAcceptFiles" required>
                            <span slot="label">
                              <span class="span-box">
                               <span>{{ internalAcceptType }}</span><br>
                               <el-button
                                 type="primary"
                                 style="margin-top: 8px;"
                                 class="button-new-tag"
                                 size="small"
                                 @click="toUploadCusFile(internalAcceptType)"
                               >添加附件
                               </el-button>
                             </span>
                            </span>
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
                                :ref="`delCusFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCusFile(scope.row), scope._self.$refs[`delCusFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                  :disabled="internalAcceptFiles.length === 1"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-form>
        </div>
      </el-card>
    </div>
    <!--上传变更直系相关附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="cusFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadChangeFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleCusFileSuccess"
          :on-error="handleError"
          :action="changeUploadApi + '?changeId=' + changeId + '&factorId=' + 0 + '&fileType=' + fileType "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ fileType }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitCusFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--上传变更因素相关附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="factorFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadFactorFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleFactorFileSuccess"
          :on-error="handleError"
          :action="changeUploadApi + '?changeId=' + changeId + '&factorId=' + factorId + '&fileType=' + fileType "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ fileType }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitFactorFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--因素新增/编辑弹窗-->
    <el-dialog
      :title="factorOperationTitle"
      :visible.sync="addFactorVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="factorForm"
        :model="factorForm"
        :rules="factorRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          label="主要因素标题"
          prop="name"
          required
        >
          <el-input
            v-model="factorForm.name"
            maxlength="20"
            show-word-limit
            style="width: 320px;"
          />
        </el-form-item>
        <el-form-item
          label="因素变更类型"
          prop="type"
          required
        >
          <el-select
            v-model="factorForm.type"
            placeholder="请选择变更原因"
            style="width: 320px;"
          >
            <el-option
              v-for="item in changeTypeOptions"
              :key="item.value"
              :label="item.value "
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOperation">取 消</el-button>
        <el-button type="primary" @click="submitFactor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {getToken} from '@/utils/auth'
import {mapGetters} from 'vuex'
import PanelGroup from './panelGroup/index'
import {equalsObj, GMTToStr, judgeIsEqual, validIsNotNull} from '@/utils/validationUtil'
import {addChange, editChange, getChangeById} from '@/api/tools/change'
import {addChangeFactor, delChangeFactor, editChangeFactor, getFactorsByChangeId} from '@/api/tools/changeFactor'
import {addChangeManagement, editChangeManagement, getManageByChangeId} from '@/api/tools/changeManagement'
import {addChangeApprove, editChangeApprove, getApproveByChangeId} from '@/api/tools/changeApprove'
import {delChangeFile, getChangeFileByCond} from '@/api/tools/changeFile'

const scopeOptions = ['文档变更', '过程变更', '工具变更', '其他变更']
export default {
  name: 'ChangeForm',
  components: {PanelGroup},
  props: {
    changeForm: {
      type: Object
    },
    isNew: {
      type: Boolean
    }
  },
  // 设置数据字典
  dicts: ['d_source', 'common_status', 'common_having', 'common_factors'],
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'supplier:add'],
        edit: ['admin', 'supplier:edit']
      },
      isIdentityButtonGray: true,
      isClassifyButtonGray: true,
      isAnalyzeButtonGray: true,
      isDecideButtonGray: true,
      draftStep: 100,
      draftStatus: null,
      manageStep: 0,
      manageStatus: null,
      approveStep: 0,
      approveStatus: null,
      // changeForm: null,
      oldChangeForm: {},
      changeRules: {
        reason: [
          {required: true, message: '请选择变更原因', trigger: 'blur'}
        ],
        source: [
          {required: true, message: '请选择变更来源', trigger: 'blur'}
        ],
        initiator: [
          {required: true, message: '请填写变更发起人', trigger: 'blur'}
        ],
        department: [
          {required: true, message: '请填写发起部门', trigger: 'blur'}
        ],
        initTime: [
          {required: true, message: '请填入发起时间', trigger: 'blur'}
        ],
        area: [
          {required: true, message: '请填入可能受到影响的地区、厂区等', trigger: 'blur'}
        ],
        depart: [
          {required: true, message: '请填入涉及到的部门', trigger: 'blur'}
        ],
        project: [
          {required: true, message: '请填入可能受到影响的项目编码及名称等信息', trigger: 'blur'}
        ],
        product: [
          {required: true, message: '请填入可能受到影响的产品系列、零件编码/名称等信息', trigger: 'blur'}
        ],
        isCustomer: [
          {required: true, message: '请判断是否为客户要求', trigger: 'blur'}
        ],
        remark: [
          {required: false, message: '请输入邮箱地址', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        havAgreement: [
          {required: true, message: '请选择是否存在客户协议书', trigger: 'blur'}
        ],
        approveDepart: [
          {required: true, message: '请填写审批部门', trigger: 'blur'}
        ],
        approveBy: [
          {required: true, message: '请填写审批人姓名', trigger: 'blur'}
        ],
        havReport: [
          {required: true, message: '请选择是否有评估报告', trigger: 'blur'}
        ],
        isAccepted: [
          {required: true, message: '请务必选择客户是否同意', trigger: 'blur'}
        ]
      },
      // currentStep: 1,
      // 起草界面激活步骤
      stepName: 'identity',
      // 管理界面激活步骤
      stepMangeName: 'manage',
      isActive: false,
      type: 'draft',
      activeContent: '起草变更信息',
      changeReasons: [
        {
          label: 'Problem from Quality',
          value: '质量出现问题'
        },
        {
          label: 'Change Request',
          value: '正常变更请求'
        }
      ],
      // 涉及地区
      inputAreaVisible: false,
      inputAreaValue: '',
      // 涉及部门
      inputDepartVisible: false,
      inputDepartValue: '',
      // 涉及项目
      inputProjectVisible: false,
      inputProjectValue: '',
      // 涉及产品
      inputProdVisible: false,
      inputProdValue: '',
      // 分类主要因素分布
      changeFactorsLoading: false,
      changeFactors: [],
      oldChangeFactors: [],
      // 因素附件
      factorFilesLoading: false,
      factorFiles: [],
      factorForm: {
        changeId: null,
        name: '',
        type: null
      },
      destroyUnlockData: true,
      // 时间不可大于现在时间
      initTimeOption: {
        disabledDate(date) {
          return Date.now() < date.getTime()
        }
      },
      factorRules: {
        name: [
          {required: true, message: '请填写变更因素标题', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请填写变更因素类型', trigger: 'blur'}
        ]
      },
      changeTypeOptions: [
        {
          label: 'Major Change',
          value: '重大变更'
        },
        {
          label: 'Minor Change',
          value: '微小变更'
        }
      ],
      factorOperationTitle: '',
      addFactorVisible: false,
      // 变更ID
      changeId: null,
      // 变更因素ID
      factorId: null,
      // 上传变更直系附件
      cusFileUploadVisible: false,
      // 上传变更因素附件
      factorFileUploadVisible: false,
      fileType: '客户要求',
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
      // 客户附件列表
      cusFilesLoading: false,
      cusFiles: [],
      oldCusFiles: [],
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
      checkAll: false,
      enableScopes: scopeOptions,
      isIndeterminate: true,
      scopeFilesLoading: false,
      scopeFiles: [],
      // 客户协议书列表
      agreeFilesLoading: false,
      agreeFiles: [],
      // 审批评估附件列表
      evReportFilesLoading: false,
      evReportFiles: [],
      oldEvReportFiles: [],
      // 监控起草信息变化
      // --识别--
      isReasonChanged: false,
      isSourceChanged: false,
      isInitiatorChanged: false,
      isInitDepartChanged: false,
      isInitTimeChanged: false,
      isAreaChanged: false,
      isDepartChanged: false,
      isProjectChanged: false,
      isProductChanged: false,
      isCostChanged: false,
      // --分类--
      isFactorsChanged: false,
      isEmailChanged: false,
      isRemarkChanged: false,
      isCusFilesChanged: false,
      // --分析--
      isScopeChanged: false,
      isHavAgreeChanged: false,
      // --确认/创建--
      isApproveDepartChanged: false,
      isApproveByChanged: false,
      isHavReportChanged: false,
      isEvReportFilesChanged: false,
      isAcceptedChanged: false,
      // ----变更管理----
      isManageButtonGray : true,
      isPartDrawingChanged: false,
      isDocumentChanged: false,
      isEvaluationReportChanged: false,
      isPpapChanged: false,
      isControlPlanChanged: false,
      isApqpChanged: false,
      isSamplePartChanged: false,
      isToolsChanged: false,
      isOtherChanged: false,
      oldManageForm: {},
      manageForm: {
        partDrawing: null,
        document: null,
        evaluationReport: null,
        ppap: null,
        controlPlan: null,
        apqp: null,
        samplePart: null,
        tools: null,
        other: null,
        finishedStep: 0
      },
      manageRules: {
        partDrawing: [
          {required: true, message: '请选择零件图纸是否变更', trigger: 'blur'}
        ],
        document: [
          {required: true, message: '请选择文档/作业程序/指导书是否变更', trigger: 'blur'}
        ],
        evaluationReport: [
          {required: true, message: '请选择文档/作业程序/指导书是否变更', trigger: 'blur'}
        ],
        ppap: [
          {required: true, message: '请选择生产件批准程序是否变更', trigger: 'blur'}
        ],
        controlPlan: [
          {required: true, message: '请选择管制计划是否变更', trigger: 'blur'}
        ],
        apqp: [
          {required: true, message: '请选择产品质量先期策划是否变更', trigger: 'blur'}
        ],
        samplePart: [
          {required: true, message: '请选择样品零件是否变更', trigger: 'blur'}
        ],
        tools: [
          {required: true, message: '请选择工具是否变更', trigger: 'blur'}
        ],
        other: [
          {required: true, message: '请选择工具是否变更', trigger: 'blur'}
        ]
      },
      chooseOptions: [
        {
          label: 'go',
          value: '是'
        },
        {
          label: 'Not go',
          value: '不是'
        },
        {
          label: 'NA',
          value: 'NA'
        }
      ],
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
      // -----变更通过/关闭------
      isApproveButtonGray: true,
      isCloseButtonGray: true,
      isImplementedTimeChanged: false,
      isSendToCusTimeChanged: false,
      isAcceptedByCusTimeChanged: false,
      isAcceptedByInternalTimeChanged: false,
      approveForm: {
        implementedTime: null,
        sendToCusTime: null,
        acceptedByCusTime: null,
        acceptedByInternalTime: null,
        finishedStep: 1,
      },
      approveRules: {
        implementedTime: [
          {required: true, message: '请填写变更实现时间', trigger: 'blur'}
        ],
        /* sendToCusTime: [
          { required: true, message: '请填写发给客户审批时间', trigger: 'blur' }
        ],
        acceptedByCusTime: [
          { required: true, message: '请填写客户同意变更的时间', trigger: 'blur' }
        ], */
        acceptedByInternalTime: [
          {required: true, message: '请填写内部团队同意变更的时间', trigger: 'blur'}
        ]
      },
      oldApproveForm: {},
      // 验收报告附件
      buyOffFilesLoading: false,
      buyOffFiles: [],
      // 客户同意证明
      cusAcceptFilesLoading: false,
      cusAcceptFiles: [],
      // 内部同意证明
      internalAcceptFilesLoading: false,
      internalAcceptFiles: [],
      disDraftEdit: false,
      disManageEdit: false
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'changeUploadApi'
    ])
  },
  watch: {
    // 'changeForm.source': {
    //   handler: (newVal, oldVal) => {
    //     alert('新值:' + newVal)
    //     alert('旧值:' + oldVal)
    //   },
    //   immediate: false,
    //   deep: true
    // }
  },
  created: function () {
  },
  mounted() {
    this.initLoadAsync()
    this.initChangeForm(this.stepName)
  },
  methods: {
    initLoadAsync() {
      this.oldChangeForm = JSON.parse(JSON.stringify(this.changeForm))
      if (validIsNotNull(this.changeForm.id)) {
        this.getChangeInfo(this.changeForm.id)
        // 查询各要素
        this.getOldChangeFactors(this.changeForm.id)
        // 查询客户要求证明
        this.getOldCusFiles(this.changeForm.id, this.cusType)
        // 查询评估报告
        this.getOldEvaluateFiles(this.changeForm.id, this.assessReportType)
        /*const approve = JSON.stringify(this.changeForm.approve)
        // alert(JSON.stringify(this.changeForm.approve))
        if (validIsNotNull(approve) && approve !== '{}') {
          // 控制进入批准流程后-变更管理-不可编辑
          // alert(1)
          this.getOldChangeApprove(this.changeForm.id)
        }*/
        this.getOldChangeManage(this.changeForm.id)
        this.getOldChangeApprove(this.changeForm.id)
      }
    },
    // 初始化changeForm数据
    initChangeForm(stepName) {
      // alert(stepName)
      // 获取初始化数据中，进程
      // alert(this.changeForm.havAgreement)
      this.changeForm.isCustomer = validIsNotNull(this.changeForm.isCustomer) ? this.changeForm.isCustomer.toString() : null
      this.changeForm.havAgreement = validIsNotNull(this.changeForm.havAgreement) ? this.changeForm.havAgreement.toString() : null
      this.changeForm.havReport = validIsNotNull(this.changeForm.havReport) ? this.changeForm.havReport.toString() : null
      this.changeForm.isAccepted = validIsNotNull(this.changeForm.isAccepted) ? this.changeForm.isAccepted.toString() : null
      // 起草-识别-改变初始化
      this.initIdentityChange()
      // 起草-分类-改变初始化
      this.initClassifyChange()
      // 起草-分析-改变初始化
      this.initAnalyzeChange()
      // 起草-确认/创建-改变初始化
      this.initDecideChange()
      // todo 管理-管理/ECN-改变初始化
      this.initManageChange()
      // 批准/关闭-改变初始化
      this.initApproveChange()
      if (validIsNotNull(this.changeForm.finishedStep)) {
        const step = this.changeForm.finishedStep
        if (step - 4 === 0) {
          this.draftStep = 100
          if (judgeIsEqual(this.changeForm.isAccepted.toString(), 'true')) {
            this.draftStatus = 'success'
          } else {
            this.draftStatus = 'exception'
          }
        } else if (step - 4 === -1) {
          this.draftStep = 75
        } else if (step - 4 === -2) {
          this.draftStep = 50
        } else if (step - 4 === -3) {
          this.draftStep = 25
        } else {
          this.draftStep = 0
        }
      }
      // alert(JSON.stringify(this.changeForm.management))
      const management = JSON.stringify(this.changeForm.management)
      const approve = JSON.stringify(this.changeForm.approve)
      if (validIsNotNull(management) && management !== '{}') {
        // 控制进入管理流程后-变更起草-不可编辑
        this.disDraftEdit = true
        this.getChangeManagement(this.changeForm.id)
      }
      // alert(JSON.stringify(this.changeForm.approve))
      if (validIsNotNull(approve) && approve !== '{}') {
        // 控制进入批准流程后-变更管理-不可编辑
        // alert(1)
        this.disManageEdit = true
        this.getChangeApprove(this.changeForm.id)
      }
      if (validIsNotNull(this.changeForm.id)) {
        this.changeId = this.changeForm.id
        // this.getChangeInfo(this.changeId)
        // alert(this.changeId)
        if (stepName === 'classify') {
          // 查询各要素
          this.getChangeFactors(this.changeForm.id)
          // 查询客户要求证明
          this.getCusFiles(this.changeId, this.cusType)
        } else if (stepName === 'analyze') {
          // 风险评估附件
          this.getRiskAssessFiles(this.changeId, this.riskAssessType)
          // 变更范围各附件
          this.getDocChangeFiles(this.changeId, this.docChangeType)
          this.getProcessChangeFiles(this.changeId, this.processChangeType)
          this.getToolChangeFiles(this.changeId, this.toolChangeType)
          this.getOtherChangeFiles(this.changeId, this.otherChangeType)
          if(this.changeForm.havAgreement.toString() === 'true'){
            this.getAgreeFiles(this.changeId, this.agreeType)
          }
        } else if (stepName === 'decide') {
          // 清空前页面样式，防止干扰
          // this.$refs.docChangeFiles.$el.style.border = 'none'
          // this.$refs.processChangeFiles.$el.style.border = 'none'
          // this.$refs.toolChangeFiles.$el.style.border = 'none'
          // this.$refs.otherChangeFiles.$el.style.border = 'none'
          // 评估报告
          if(this.changeForm.havReport.toString() === 'true'){
            this.getAssessReports(this.changeId, this.assessReportType)
          }
        } else if (stepName === 'manage') {
          // 变更管理模块附件
          this.getPartDrawingFiles(this.changeId, this.partDrawingType)
          this.getDocFiles(this.changeId, this.docType)
          this.getEvaluateFiles(this.changeId, this.evaluateType)
          this.getPpapFiles(this.changeId, this.ppapType)
          this.getControlPlanFiles(this.changeId, this.controlPlanType)
          this.getApqpFiles(this.changeId, this.apqpType)
          this.getSamplePart(this.changeId, this.samplePartType)
          this.getToolsFiles(this.changeId, this.toolsType)
          this.getOtherFiles(this.changeId, this.otherType)
        } else if (stepName === 'ECN') {
          // ECN附件管理
          this.getPCNFlowFiles(this.changeId, this.PCNFlowType)
          this.getRecordFiles(this.changeId, this.recordType)
          this.getEvaluateReports(this.changeId, this.mEvaluateType)
          this.getTrainRecords(this.changeId, this.trainRecordType)
        } else if (stepName === 'approve') {
          // 变更批准/通过附件
          this.getBuyOffFiles(this.changeId, this.buyOffType)
          this.getCusAcceptFiles(this.changeId, this.cusAcceptType)
          this.getInternalAcceptFiles(this.changeId, this.internalAcceptType)
        }
      }
    },
    initIdentityChange() {
      this.isReasonChanged = false
      this.isSourceChanged = false
      this.isInitiatorChanged = false
      this.isInitDepartChanged = false
      this.isInitTimeChanged = false
      this.isAreaChanged = false
      this.isDepartChanged = false
      this.isProjectChanged = false
      this.isProductChanged = false
      this.isCostChanged = false
      this.isIdentityButtonGray = true
    },
    initClassifyChange() {
      this.isEmailChanged = false
      this.isRemarkChanged = false
      this.isCusFilesChanged = false
      this.isClassifyButtonGray = true
    },
    initAnalyzeChange() {
      this.isScopeChanged = false
      this.isHavAgreeChanged = false
      this.isAnalyzeButtonGray = true
    },
    initDecideChange() {
      this.isApproveDepartChanged = false
      this.isApproveByChanged = false
      this.isEvReportFilesChanged = false
      this.isAcceptedChanged = false
      this.isDecideButtonGray = true
    },
    initManageChange() {
        this.isManageButtonGray = true
        this.isPartDrawingChanged = false
        this.isDocumentChanged = false
        this.isEvaluationReportChanged = false
        this.isPpapChanged =  false
        this.isControlPlanChanged = false
        this.isApqpChanged = false
        this.isSamplePartChanged = false
        this.isToolsChanged = false
        this.isOtherChanged = false
    },
    initApproveChange() {
      this.isImplementedTimeChanged = false
      this.isSendToCusTimeChanged = false
      this.isAcceptedByCusTimeChanged = false
      this.isAcceptedByInternalTimeChanged = false
      this.isApproveButtonGray = true
    },
    handleChartData(msg) {
      // alert(JSON.stringify(msg))
      this.isActive = msg.isActive
      this.type = msg.type
      // alert(this.type)
      if (this.type === 'draft') {
        this.activeContent = '1.起草变更信息'
        this.stepName = 'identity'
      } else if (this.type === 'management') {
        this.activeContent = '2.变更信息管理'
        this.stepName = 'manage'
      } else if (this.type === 'approve') {
        this.activeContent = '3.变更批准/关闭'
        this.stepName = 'approve'
      }
      this.initChangeForm(this.stepName)
    },
    backToPanel() {
      // 切换前判断是否有变化
      // 识别项有无变化
      if (!this.isIdentityButtonGray) {
          this.$confirm('检测到【识别信息】发生了变化，切换前是否先保存？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: 'Yes 是',
            cancelButtonText: 'No 否'
          })
            .then(() => {
              this.saveChangeForm(1,this.changeForm,false)
              // this.initChangeForm()
              // 延时跳转
              /*setTimeout(() => {
                this.isActive = false
              }, 300)*/
            })
            .catch(() => {
              this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
              this.initChangeForm()
              // 延时跳转
              setTimeout(() => {
                this.isActive = false
              }, 300)
            })
      } else if (!this.isClassifyButtonGray) {
        // 分类项有无变化
        this.$confirm('检测到【分类信息】发生了变化，切换前是否先保存？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            this.saveChangeForm(2,this.changeForm, false)
            // this.initChangeForm()
            // 延时跳转
            /*setTimeout(() => {
              this.isActive = false
            }, 300)*/
          })
          .catch(() => {
            this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
            this.initChangeForm()
            // 延时跳转
            setTimeout(() => {
              this.isActive = false
            }, 300)
          })
      } else if (!this.isAnalyzeButtonGray) {
        // 分类项有无变化
        this.$confirm('检测到【分析信息】发生了变化，切换前是否先保存？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            this.saveChangeForm(3,this.changeForm, false)
            // this.initChangeForm()
            // 延时跳转
            /*setTimeout(() => {
              this.isActive = false
            }, 300)*/
          })
          .catch(() => {
            this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
            this.initChangeForm()
            // 延时跳转
            setTimeout(() => {
              this.isActive = false
            }, 300)
          })
      } else if (!this.isDecideButtonGray) {
        // 分类项有无变化
        this.$confirm('检测到【确认/创建信息】发生了变化，切换前是否先保存？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            this.saveChangeForm(4,this.changeForm,false)
            // this.initChangeForm()
            // 延时跳转
            /*setTimeout(() => {
              this.isActive = false
            }, 300)*/
          })
          .catch(() => {
            this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
            this.initChangeForm()
            // 延时跳转
            setTimeout(() => {
              this.isActive = false
            }, 300)
          })
      } else if (!this.isManageButtonGray) {
        // 分类项有无变化
        this.$confirm('检测到【管理信息-管理】发生了变化，切换前是否先保存？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            this.saveManageForm(false)
            // this.initChangeForm()
            // 延时跳转
            /*setTimeout(() => {
              this.isActive = false
            }, 300)*/
          })
          .catch(() => {
            this.manageForm = JSON.parse(JSON.stringify(this.oldManageForm))
            this.initChangeForm()
            // 延时跳转
            setTimeout(() => {
              this.isActive = false
            }, 300)
          })
      } else if (!this.isApproveButtonGray) {
        // 分类项有无变化
        this.$confirm('检测到【批准/关闭信息】发生了变化，切换前是否先保存？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 是',
          cancelButtonText: 'No 否'
        })
          .then(() => {
            this.saveApproveForm()
            // this.initChangeForm()
            // 延时跳转
            setTimeout(() => {
              this.isActive = false
            }, 300)
          })
          .catch(() => {
            this.approveForm = JSON.parse(JSON.stringify(this.oldApproveForm))
            this.initChangeForm()
            // 延时跳转
            setTimeout(() => {
              this.isActive = false
            }, 300)
          })
      } else {
        this.isActive = false
      }
    },
    getChangeInfo(id) {
      getChangeById(id).then(res => {
        // alert(JSON.stringify(res))
        this.oldChangeForm = res
        // 销毁子组件，而后重新渲染
        // this.destroyFormData = false
        this.$nextTick(() => {

        }, 300)
      })
    },
    // 激活-起草下四步骤
    activeIdentityIssue(step, stepName) {
      // alert(this.changeForm.isAccepted)
      // alert("----前一个页面："+this.stepName)
      // alert(this.step)
      // 跳转前查看是否符合跳转条件，即：判断当前页面所有必填项目是否都完备了
      if(this.stepName === 'classify' && stepName !== 'identity') {
        // 变更因素列表判断有无
        if(this.changeFactors.length === 0) {
          this.$message({
            message: '4M+1E Needed! 请务必添加变更影响主要因素数据!',
            type: 'warning'
          })
          this.$refs.changeFactors.$el.style.border = '1px solid #f00'
          return false
        } else {
          // todo 分类----判断是否对应附件都上传了？并打开未上传的附件
        }

        // 证明是客户要求所需证据判断有无
        if (this.changeForm.isCustomer.toString() === 'true') {
          if (this.cusFiles.length === 0) {
            this.$message({
              message: 'CusFiles Needed! 请务必上传客户要求所需附件证明!',
              type: 'warning'
            })
            this.$refs.cusFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
      } else if (this.stepName === 'analyze' && stepName === 'decide') {
        // 分析页面判断是否附件上传了等情况
        // 风险评估
        if (this.riskAssessFiles.length === 0) {
          this.$message({
            message: 'Risk Assessment Files Needed! 请务必上传风险评估附件!',
            type: 'warning'
          })
          this.$refs.riskAssessFiles.$el.style.border = '1px solid #f00'
          return false
        }
        // 变更范围附件判断
        if (this.changeForm.scopeTags.indexOf(this.docChangeType) > -1) {
          if (this.docChangeFiles.length === 0) {
            this.$message({
              message: 'Document Change Files Needed! 请上传关联文档变更的相关附件!',
              type: 'warning'
            })
            this.$refs.docChangeFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if (this.changeForm.scopeTags.indexOf(this.processChangeType) > -1) {
          if (this.processChangeFiles.length === 0) {
            this.$message({
              message: 'Process Change Files Needed! 请上传关联过程变更的相关附件!',
              type: 'warning'
            })
            this.$refs.processChangeFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if (this.changeForm.scopeTags.indexOf(this.toolChangeType) > -1) {
          if (this.toolChangeFiles.length === 0) {
            this.$message({
              message: 'Tools Change Files Needed! 请上传关联工具变更的相关附件!',
              type: 'warning'
            })
            this.$refs.toolChangeFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if (this.changeForm.scopeTags.indexOf(this.otherChangeType) > -1) {
          if (this.otherChangeFiles.length === 0) {
            this.$message({
              message: 'Other Change Files Needed! 请上传关联其他变更的相关附件!',
              type: 'warning'
            })
            this.$refs.otherChangeFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        // 有无客户协议
        if (this.changeForm.havAgreement.toString() === 'true') {
          if (this.agreeFiles.length === 0) {
            this.$message({
              message: 'Customer Agreement/Order Files Needed! 请务必上传客户协议/要求相关附件!',
              type: 'warning'
            })
            this.$refs.agreeFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
      } else if (this.stepName === 'decide' && stepName === 'decide') {
        // 评估报告
        if (this.changeForm.havReport.toString() === 'true') {
          if (this.evReportFiles.length === 0) {
            this.$message({
              message: 'Assessment Reports Needed! 请务必上传评估报告等相关附件!',
              type: 'warning'
            })
            this.$refs.evReportFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
      }
      // 限制串口跳转
      if (this.changeForm.finishedStep >= (step - 1)) {
        // 切换前判断是否有变化
        // 识别项有无变化
        if (!this.isIdentityButtonGray) {
            this.$confirm('检测到【识别信息】发生了变化，切换前是否先保存？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: 'Yes 是',
              cancelButtonText: 'No 否'
            })
              .then(() => {
                this.saveChangeForm(1,this.changeForm,true,stepName)
                /*setTimeout(() => {
                  this.stepName = stepName
                }, 300)*/
              })
              .catch(() => {
                this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
                setTimeout(() => {
                  this.stepName = stepName
                  this.initChangeForm(this.stepName)
                }, 300)
              })
        } else if (!this.isClassifyButtonGray) {
          // 分类项有无变化
            this.$confirm('检测到【分类信息】发生了变化，切换前是否先保存？', '确认信息', {
              distinguishCancelAndClose: true,
              confirmButtonText: 'Yes 是',
              cancelButtonText: 'No 否'
            })
              .then(() => {
                this.saveChangeForm(2,this.changeForm,true,stepName)
                /*setTimeout(() => {
                  this.stepName = stepName
                }, 300)*/
              })
              .catch(() => {
                this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
                setTimeout(() => {
                  this.stepName = stepName
                  this.initChangeForm(this.stepName)
                }, 300)
              })
        } else if (!this.isAnalyzeButtonGray) {
          // 分析项有无变化
          this.$confirm('检测到【分析信息】发生了变化，切换前是否先保存？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: 'Yes 是',
            cancelButtonText: 'No 否'
          })
            .then(() => {
              this.saveChangeForm(3,this.changeForm,true,stepName)
              /*setTimeout(() => {
                this.stepName = stepName
              }, 300)*/
            })
            .catch(() => {
              this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
              setTimeout(() => {
                this.stepName = stepName
                this.initChangeForm(this.stepName)
              }, 300)
            })
        } else if (!this.isDecideButtonGray) {
          // 确认/创建项有无变化
          this.$confirm('检测到【确认/创建信息】发生了变化，切换前是否先保存？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: 'Yes 是',
            cancelButtonText: 'No 否'
          })
            .then(() => {
              this.saveChangeForm(4,this.changeForm,true,stepName)
              /*setTimeout(() => {
                this.stepName = stepName
              }, 300)*/
            })
            .catch(() => {
              this.changeForm = JSON.parse(JSON.stringify(this.oldChangeForm))
              setTimeout(() => {
                this.stepName = stepName
                this.initChangeForm(this.stepName)
              }, 300)
            })
        } else {
          this.$nextTick(() => {
            this.stepName = stepName
            this.initChangeForm(this.stepName)
          }, 300)
        }
      } else {
        this.$message({
          message: 'The previous step has not been completed ! 上一步尚未完成!',
          type: 'warning'
        })
      }
    },
    // 激活-管理下二步骤
    activeManageIssue(step, stepName) {
      // alert(this.changeForm.isAccepted)
      // 限制串口跳转
      if (this.manageForm.finishedStep >= (step - 1)) {
        // 判断“是”相关附件是否都上传
        if(this.manageForm.partDrawing === '是') {
          if(this.partDrawingFiles.length === 0) {
            this.$message({
              message: 'Part Drawing Files Needed! 请务必上传零件图纸等相关附件!',
              type: 'warning'
            })
            this.$refs.partDrawingFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.document === '是') {
          if(this.docFiles.length === 0) {
            this.$message({
              message: 'Document/SOP/WI Files Needed! 请务必上传文档、标准作业程序、工作指导书等相关附件!',
              type: 'warning'
            })
            this.$refs.docFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.evaluationReport === '是') {
          if(this.evaluateFiles.length === 0) {
            this.$message({
              message: 'Evaluation Reports Needed! 请务必上传审批或评估等相关附件!',
              type: 'warning'
            })
            this.$refs.evaluateFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.ppap === '是') {
          if(this.ppapFiles.length === 0) {
            this.$message({
              message: 'Production Part Approval Process Files Needed! 请务必上传生产件批准程序相关附件!',
              type: 'warning'
            })
            this.$refs.ppapFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.controlPlan === '是') {
          if(this.controlPlanFiles.length === 0) {
            this.$message({
              message: 'Control Plan Files Needed! 请务必上传指控计划相关附件!',
              type: 'warning'
            })
            this.$refs.controlPlanFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.apqp === '是') {
          if(this.apqpFiles.length === 0) {
            this.$message({
              message: 'Advanced Product Quality Planning Files Needed! 请务必上传产品质量先期策划相关附件!',
              type: 'warning'
            })
            this.$refs.apqpFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.samplePart === '是') {
          if(this.samplePartFiles.length === 0) {
            this.$message({
              message: 'Sample Part Files Needed! 请务必上传样品相关附件!',
              type: 'warning'
            })
            this.$refs.samplePartFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.tools === '是') {
          if(this.toolsFiles.length === 0) {
            this.$message({
              message: 'Tools Files Needed! 请务必上传工具类相关附件!',
              type: 'warning'
            })
            this.$refs.toolsFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        if(this.manageForm.other === '是') {
          if(this.otherMFiles.length === 0) {
            this.$message({
              message: 'Other Files Needed! 请上传其他方面的相关附件!',
              type: 'warning'
            })
            this.$refs.otherMFiles.$el.style.border = '1px solid #f00'
            return false
          }
        }
        // 监控是否切换前保存
        if (!this.isManageButtonGray) {
          this.$confirm('检测到【管理信息-管理】发生了变化，切换前是否先保存？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: 'Yes 是',
            cancelButtonText: 'No 否'
          })
            .then(() => {
              this.saveManageForm(true, stepName)
            })
            .catch(() => {
              this.manageForm = JSON.parse(JSON.stringify(this.oldManageForm))
              // 延时跳转
              setTimeout(() => {
                this.stepMangeName = stepName
                this.initChangeForm(this.stepMangeName)
              }, 300)
            })
        } else {
          this.$nextTick(() => {
            this.stepMangeName = stepName
            this.initChangeForm(this.stepMangeName)
          }, 300)
        }
      } else {
        this.$message({
          message: 'The previous step has not been completed ! 上一步尚未完成!',
          type: 'warning'
        })
      }
    },
    // 查询影响因素
    getChangeFactors(changeId) {
      this.changeFactorsLoading = true
      this.changeFactors = []
      getFactorsByChangeId(changeId).then(res => {
        // alert(JSON.stringify(res))
        this.changeFactors = res
        this.changeFactorsLoading = false
        if (this.changeFactors.length > 0) {
          this.$refs.changeFactors.$el.style.border = 'none'
        } else {
          this.$refs.changeFactors.$el.style.border = '1px solid #f00'
        }
        /*if(judgeArrIsEqual(this.changeFactors,)) {

        }*/
        // this.judgeClassifyChange()
      })
    },
    getOldChangeFactors(changeId) {
      this.oldChangeFactors = []
      getFactorsByChangeId(changeId).then(res => {
        // alert(JSON.stringify(res))
        this.oldChangeFactors = res
      })
    },
    // 获取客户要求附件信息
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
        if (this.cusFiles.length > 0) {
          this.$refs.cusFiles.$el.style.border = 'none'
        } else {
          this.$refs.cusFiles.$el.style.border = '1px solid #f00'
          this.isClassifyButtonGray = true
        }
        this.judgeClassifyChange()
      })
    },
    getOldCusFiles(changeId, fileType) {
      // alert(fileType)
      this.oldCusFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType
      }
      getChangeFileByCond(obj).then(res => {
        this.oldCusFiles = res
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
        if (this.riskAssessFiles.length > 0) {
          this.$refs.riskAssessFiles.$el.style.border = 'none'
        } else {
          this.$refs.riskAssessFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.processChangeFiles.length > 0) {
          this.$refs.processChangeFiles.$el.style.border = 'none'
        } else {
          this.$refs.processChangeFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.toolChangeFiles.length > 0) {
          this.$refs.toolChangeFiles.$el.style.border = 'none'
        } else {
          this.$refs.toolChangeFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.otherChangeFiles.length > 0) {
          this.$refs.otherChangeFiles.$el.style.border = 'none'
        } else {
          this.$refs.otherChangeFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.agreeFiles.length > 0) {
          this.$refs.agreeFiles.$el.style.border = 'none'
        } else {
          this.$refs.agreeFiles.$el.style.border = '1px solid #f00'
        }
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
        console.log(res)
        // alert(JSON.stringify(res))
        this.evReportFiles = res
        this.evReportFilesLoading = false
        if (this.evReportFiles.length > 0) {
          this.$refs.evReportFiles.$el.style.border = 'none'
        } else {
          this.$refs.evReportFiles.$el.style.border = '1px solid #f00'
        }
        // this.isEvReportFilesChanged = !equalsObj(this.oldEvReportFiles, this.evReportFiles);
        // this.judgeDecideChange()
      })
    },
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
        if (this.partDrawingFiles.length > 0) {
          this.$refs.partDrawingFiles.$el.style.border = 'none'
        } else {
          this.$refs.partDrawingFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.docFiles.length > 0) {
          this.$refs.docFiles.$el.style.border = 'none'
        } else {
          this.$refs.docFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.evaluateFiles.length > 0) {
          this.$refs.evaluateFiles.$el.style.border = 'none'
        } else {
          this.$refs.evaluateFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.ppapFiles.length > 0) {
          this.$refs.ppapFiles.$el.style.border = 'none'
        } else {
          this.$refs.ppapFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.controlPlanFiles.length > 0) {
          this.$refs.controlPlanFiles.$el.style.border = 'none'
        } else {
          this.$refs.controlPlanFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.apqpFiles.length > 0) {
          this.$refs.apqpFiles.$el.style.border = 'none'
        } else {
          this.$refs.apqpFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.samplePartFiles.length > 0) {
          this.$refs.samplePartFiles.$el.style.border = 'none'
        } else {
          this.$refs.samplePartFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.toolsFiles.length > 0) {
          this.$refs.toolsFiles.$el.style.border = 'none'
        } else {
          this.$refs.toolsFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.otherMFiles.length > 0) {
          this.$refs.otherMFiles.$el.style.border = 'none'
        } else {
          this.$refs.otherMFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.flowFiles.length > 0) {
          this.$refs.flowFiles.$el.style.border = 'none'
        } else {
          this.$refs.flowFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.recordFiles.length > 0) {
          this.$refs.recordFiles.$el.style.border = 'none'
        } else {
          this.$refs.recordFiles.$el.style.border = '1px solid #f00'
        }
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
        if (this.evaluateReports.length > 0) {
          this.$refs.evaluateReports.$el.style.border = 'none'
        } else {
          this.$refs.evaluateReports.$el.style.border = '1px solid #f00'
        }
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
        if (this.trainRecords.length > 0) {
          this.$refs.trainRecords.$el.style.border = 'none'
        } else {
          this.$refs.trainRecords.$el.style.border = '1px solid #f00'
        }
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
        this.judgeCloseApproveChange()
        this.buyOffFilesLoading = false
        if (this.buyOffFiles.length > 0) {
          this.$refs.buyOffFiles.$el.style.border = 'none'
        } else {
          this.$refs.buyOffFiles.$el.style.border = '1px solid #f00'
        }
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
        this.judgeCloseApproveChange()
        this.cusAcceptFilesLoading = false
        if (this.cusAcceptFiles.length > 0) {
          this.$refs.cusAcceptFiles.$el.style.border = 'none'
        } else {
          this.$refs.cusAcceptFiles.$el.style.border = '1px solid #f00'
        }
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
        this.judgeCloseApproveChange()
        this.internalAcceptFilesLoading = false
        if (this.internalAcceptFiles.length > 0) {
          this.$refs.internalAcceptFiles.$el.style.border = 'none'
        } else {
          this.$refs.internalAcceptFiles.$el.style.border = '1px solid #f00'
        }
      })
    },
    // 查询变更管理信息
    getChangeManagement(changeId) {
      // alert(changeId)
      getManageByChangeId(changeId).then(res => {
        this.manageForm = res
        if (this.manageForm.finishedStep === 0) {
          this.manageStep = 0
        } else if (this.manageForm.finishedStep === 1) {
          this.manageStep = 50
        }
        if (this.manageForm.finishedStep === 2) {
          this.manageStep = 100
          this.manageStatus = 'success'
        }
      })
    },
    // 获取原变更管理信息
    getOldChangeManage(changeId) {
      getManageByChangeId(changeId).then(res => {
        this.oldManageForm = res
      })
    },
    // 查询变更批准/关闭信息
    getChangeApprove(changeId) {
      // alert(changeId)
      getApproveByChangeId(changeId).then(res => {
        this.approveForm = res
        // alert(JSON.stringify(this.approveForm))
        if (this.approveForm.finishedStep === 0) {
          this.approveStep = 0
        } else if (this.approveForm.finishedStep === 1) {
          this.approveStep = 50
        } else if (this.approveForm.finishedStep === 2) {
          this.approveStep = 100
          this.approveStatus = 'success'
        }
      })
    },
    // 获取原批准信息
    getOldChangeApprove(changeId) {
      // alert(changeId)
      getApproveByChangeId(changeId).then(res => {
        this.oldApproveForm = res
      })
    },
    // 保存变更信息
    saveChangeForm(step, form, backFlag,stepName) {
      // alert(JSON.stringify(form))
      let formName = '识别信息'
      if (this.stepName === 'identity') {
        formName = '识别信息'
      } else if (this.stepName === 'classify') {
        formName = '分类信息'
      } else if (this.stepName === 'analyze') {
        formName = '分析信息'
      } else if (this.stepName === 'decide') {
        formName = '确认/创建信息'
      }
      this.$refs.changeForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          // todo 新增/保存 变更信息
          // todo根据所处step判断不可无附件信息,可能有附件上传的 2、3、4
          if (step === 2) {
            // todo 主要因素下附件的判断？是否需要判断
            // 证明是客户要求所需证据--已在跳转时候判断
            if (this.changeForm.isCustomer.toString() === 'true') {
              if (this.cusFiles.length === 0) {
                this.$message({
                  message: 'CusFiles Needed! 请务必上传客户要求所需附件证明!',
                  type: 'warning'
                })
                this.$refs.cusFiles.$el.style.border = '1px solid #f00'
                return false
              }
            }
          } else if (step === 3) {
            // 风险评估
            if (this.riskAssessFiles.length === 0) {
              this.$message({
                message: 'Risk Assessment Files Needed! 请务必上传风险评估附件!',
                type: 'warning'
              })
              this.$refs.riskAssessFiles.$el.style.border = '1px solid #f00'
              return false
            }
            // 变更范围附件判断
            if(this.changeForm.scopeTags.length < 1) {
              this.$message({
                message: 'Scope Of Change Needed! 【变更范围】至少选择一项!',
                type: 'warning'
              })
              this.$refs.scopeTags.$el.style.border = '1px solid #f00'
              return false
            }
            if (this.changeForm.scopeTags.indexOf(this.docChangeType) > -1) {
              if (this.docChangeFiles.length === 0) {
                this.$message({
                  message: 'Document Change Files Needed! 请上传关联文档变更的相关附件!',
                  type: 'warning'
                })
                this.$refs.docChangeFiles.$el.style.border = '1px solid #f00'
                return false
              }
            }
            if (this.changeForm.scopeTags.indexOf(this.processChangeType) > -1) {
              if (this.processChangeFiles.length === 0) {
                this.$message({
                  message: 'Process Change Files Needed! 请上传关联过程变更的相关附件!',
                  type: 'warning'
                })
                this.$refs.processChangeFiles.$el.style.border = '1px solid #f00'
                return false
              }
            }
            if (this.changeForm.scopeTags.indexOf(this.toolChangeType) > -1) {
              if (this.toolChangeFiles.length === 0) {
                this.$message({
                  message: 'Tools Change Files Needed! 请上传关联工具变更的相关附件!',
                  type: 'warning'
                })
                this.$refs.toolChangeFiles.$el.style.border = '1px solid #f00'
                return false
              }
            }
            if (this.changeForm.scopeTags.indexOf(this.otherChangeType) > -1) {
              if (this.otherChangeFiles.length === 0) {
                this.$message({
                  message: 'Other Change Files Needed! 请上传关联其他变更的相关附件!',
                  type: 'warning'
                })
                this.$refs.otherChangeFiles.$el.style.border = '1px solid #f00'
                return false
              }
            }
            // 有无客户协议
            if (this.changeForm.havAgreement.toString() === 'true') {
              if (this.agreeFiles.length === 0) {
                this.$message({
                  message: 'Customer Agreement/Order Files Needed! 请务必上传客户协议/要求相关附件!',
                  type: 'warning'
                })
                this.$refs.agreeFiles.$el.style.border = '1px solid #f00'
                return false
              }
            }
          } else if (step === 4) {
            // 评估报告
            if (this.changeForm.havReport.toString() === 'true') {
              if (this.evReportFiles.length === 0) {
                this.$message({
                  message: 'Assessment Reports Needed! 请务必上传评估报告等相关附件!',
                  type: 'warning'
                })
                this.$refs.evReportFiles.$el.style.border = '1px solid #f00'
                return false
              }
            }
          }
          // 满足条件的新增/编辑操作
          if (!validIsNotNull(form.id)) {
            // 新增
            form.finishedStep = 1
            addChange(form).then(res => {
              this.$message({
                message: 'Create Success! 新建变更信息保存成功!',
                type: 'success'
              })
              this.changeForm = res
              this.changeForm.id = res.id
              // this.isNew = false
              if (form.source === '客户') {
                this.changeForm.isCustomer = 'true'
              } else {
                this.changeForm.isCustomer = 'false'
              }
              this.initLoadAsync()
              // this.initChangeForm()
              if(validIsNotNull(stepName)) {
                setTimeout(() => {
                  this.stepName = stepName
                }, 300)
              }
              this.initChangeForm(this.stepName)
              this.isActive = backFlag
            })
          } else {
            // 编辑
            // alert(form.finishedStep)
            if (form.finishedStep < step) {
              form.finishedStep = step
            }
            this.destroyUnlockData = false
            editChange(form).then(res => {
              this.$message({
                message: 'Edit Success! 保存变更信息[' + formName + ']保存成功!',
                type: 'success'
              })
              // alert(res)
              // this.changeForm = res
              this.initLoadAsync()
              // this.initChangeForm()
              this.changeForm.unlockSteps = res.steps
              this.changeForm.changeNum = res.num
              this.$nextTick(() => {
                this.destroyUnlockData = true
              }, 300)
              if(validIsNotNull(stepName)) {
                setTimeout(() => {
                  this.stepName = stepName
                }, 300)
              }
              this.initChangeForm(this.stepName)
              this.isActive = backFlag
            })
          }
          // todo 新建时候到达第四步骤后提示是否跳转到“变更管理”模块中去
        }
      })
    },
    // 监控变更原因变化
    changeReasonHandler(val) {
      // alert("---新值："+val)
      // alert("---旧值："+this.oldChangeForm.reason)
      // alert(judgeIsEqual(val, this.oldChangeForm.reason))
      this.isReasonChanged = !judgeIsEqual(val, this.oldChangeForm.reason)
      this.judgeIdentityChange()
    },
    // 监控问题来源变化
    sourceChangeHandler(val) {
      if (val === '客户') {
        this.changeForm.isCustomer = 'true'
      } else {
        this.changeForm.isCustomer = 'false'
      }
      // alert("---新值："+val)
      // alert("---旧值："+this.oldChangeForm.source)
      this.isSourceChanged = !judgeIsEqual(val, this.oldChangeForm.source)
      this.judgeIdentityChange()
    },
    // 监控发起者变化
    initiatorChangeHandler(val) {
      // alert("---新值："+val)
      // alert("---旧值："+this.oldChangeForm.initiator)
      this.isInitiatorChanged = !judgeIsEqual(validIsNotNull(val) ? val.trim() : null, this.oldChangeForm.initiator)
      this.judgeIdentityChange()
    },
    // 监控发起部门变化
    initDepartChangeHandler(val) {
      // alert("---新值："+val)
      // alert("---旧值："+this.oldChangeForm.initiator)
      this.isInitDepartChanged = !judgeIsEqual(validIsNotNull(val) ? val.trim() : null, this.oldChangeForm.department)
      this.judgeIdentityChange()
    },
    // 监控发起时间变化
    initTimeChangeHandler(val) {
      // alert("---新值："+GMTToStr(val))
      // alert("---旧值："+this.oldChangeForm.initTime)
      this.isInitTimeChanged = !judgeIsEqual(validIsNotNull(val) ? GMTToStr(val) : null, this.oldChangeForm.initTime)
      this.judgeIdentityChange()
    },
    costChangeHandler(val) {
      this.isCostChanged = !judgeIsEqual(validIsNotNull(val) ? val.trim() : null, this.oldChangeForm.cost)
      this.judgeIdentityChange()
    },
    // 监控识别数据属性变化
    judgeIdentityChange() {
      this.isIdentityButtonGray = !(this.isReasonChanged || this.isSourceChanged || this.isInitiatorChanged || this.isInitDepartChanged ||
        this.isInitTimeChanged || this.isAreaChanged || this.isDepartChanged || this.isProjectChanged || this.isProductChanged || this.isCostChanged)
    },
    emailChangeHandler(val) {
      this.isEmailChanged = !judgeIsEqual(validIsNotNull(val) ? val.trim() : null, this.oldChangeForm.email)
      this.judgeClassifyChange()
    },
    remarkChangeHandler(val) {
      this.isRemarkChanged = !judgeIsEqual(validIsNotNull(val) ? val.trim() : null, this.oldChangeForm.remark)
      this.judgeClassifyChange()
    },
    // 监控分类数据属性变化
    judgeClassifyChange() {
      this.isClassifyButtonGray = !(this.isEmailChanged || this.isRemarkChanged)
    },
    // 切换有无客户协议
    havAgreementChangeHandler(val) {
      // alert(val)
      if (val.toString() === 'false') {
        this.$refs.agreeFiles.$el.style.border = 'none'
      } else {
        this.getAgreeFiles(this.changeId, this.agreeType)
      }
      this.isHavAgreeChanged = !judgeIsEqual(val.toString(), this.oldChangeForm.havAgreement.toString())
      this.judgeAnalyzeChange()
    },
    // 涉及部门相关
    showInputArea() {
      this.inputAreaVisible = true
      this.$nextTick(_ => {
        this.$refs.areaTagInput.$refs.input.focus()
      })
    },
    handleAreaClose(tag) {
      this.changeForm.areaTags.splice(this.changeForm.areaTags.indexOf(tag), 1)
      this.changeForm.area = this.changeForm.areaTags.join(',')
      // alert('----现有的地区范围：'+this.changeForm.area)
      // alert('----原有的地区范围：'+this.oldChangeForm.area)
      this.isAreaChanged = !judgeIsEqual(this.changeForm.area, this.oldChangeForm.area)
      this.judgeIdentityChange()
    },
    handleInputAreaConfirm() {
      const inputValue = this.inputAreaValue
      if (inputValue) {
        this.changeForm.areaTags.push(inputValue)
      }
      this.changeForm.area = this.changeForm.areaTags.join(',')
      this.inputAreaVisible = false
      this.inputAreaValue = ''
      // alert('----现有的地区范围：'+this.changeForm.area)
      // alert('----原有的地区范围：'+this.oldChangeForm.area)
      this.isAreaChanged = !judgeIsEqual(this.changeForm.area, this.oldChangeForm.area)
      this.judgeIdentityChange()
    },
    // 涉及部门相关
    showInputDepart() {
      this.inputDepartVisible = true
      this.$nextTick(_ => {
        this.$refs.departTagInput.$refs.input.focus()
      })
    },
    // 删除部门tag
    handleDepartClose(tag) {
      this.changeForm.departTags.splice(this.changeForm.departTags.indexOf(tag), 1)
      this.changeForm.depart = this.changeForm.departTags.join(',')
      this.isDepartChanged = !judgeIsEqual(this.changeForm.depart, this.oldChangeForm.depart)
      this.judgeIdentityChange()
    },
    handleInputDepartConfirm() {
      const inputValue = this.inputDepartValue
      if (inputValue) {
        this.changeForm.departTags.push(inputValue)
      }
      this.changeForm.depart = this.changeForm.departTags.join(',')
      this.inputDepartVisible = false
      this.inputDepartValue = ''
      this.isDepartChanged = !judgeIsEqual(this.changeForm.depart, this.oldChangeForm.depart)
      this.judgeIdentityChange()
    },
    // 涉及项目相关
    showInputProject() {
      this.inputProjectVisible = true
      this.$nextTick(_ => {
        this.$refs.projectTagInput.$refs.input.focus()
      })
    },
    handleProjectClose(tag) {
      this.changeForm.projectTags.splice(this.changeForm.projectTags.indexOf(tag), 1)
      this.changeForm.project = this.changeForm.projectTags.join(',')
      this.isProjectChanged = !judgeIsEqual(this.changeForm.project, this.oldChangeForm.project)
      this.judgeIdentityChange()
    },
    handleInputProjectConfirm() {
      const inputValue = this.inputProjectValue
      if (inputValue) {
        this.changeForm.projectTags.push(inputValue)
      }
      this.changeForm.project = this.changeForm.projectTags.join(',')
      this.inputProjectVisible = false
      this.inputProjectValue = ''
      this.isProjectChanged = !judgeIsEqual(this.changeForm.project, this.oldChangeForm.project)
      this.judgeIdentityChange()
    },
    // 涉及产品相关
    showInputProd() {
      // alert(this.changeForm.prodTags)
      this.inputProdVisible = true
      this.$nextTick(_ => {
        this.$refs.prodTagInput.$refs.input.focus()
      })
    },
    handleProdClose(tag) {
      this.changeForm.prodTags.splice(this.changeForm.prodTags.indexOf(tag), 1)
      this.changeForm.production = this.changeForm.prodTags.join(',')
      this.isProductChanged = !judgeIsEqual(this.changeForm.production, this.oldChangeForm.production)
      this.judgeIdentityChange()
    },
    handleInputProdConfirm() {
      const inputValue = this.inputProdValue
      if (inputValue) {
        this.changeForm.prodTags.push(inputValue)
      }
      this.changeForm.production = this.changeForm.prodTags.join(',')
      this.inputProdVisible = false
      this.inputProdValue = ''
      this.isProductChanged = !judgeIsEqual(this.changeForm.production, this.oldChangeForm.production)
      this.judgeIdentityChange()
    },
    // 触发行展开事件
    expendFactorSelected(row, expandedRows) {
      const _this = this
      if (expandedRows.length > 1) {
        _this.expands = []
        if (row) {
          _this.expands.push(row)
        }
        _this.$refs.refTable.toggleRowExpansion(expandedRows[0])
      } else {
        _this.expands = []
      }
      _this.factorId = row.id
      // 查询因素对应的附件列表信息
      _this.getFactorFiles(row.changeId, row.name, row.id)
    },
    // 获取客户协议附件
    getFactorFiles(changeId, fileType, factorId) {
      this.factorFilesLoading = true
      this.factorFiles = []
      const obj = {
        changeId: changeId,
        fileType: fileType,
        factorId: factorId
      }
      getChangeFileByCond(obj).then(res => {
        this.factorFiles = res
        this.factorFilesLoading = false
      })
    },
    // 上传变更直系相关附件
    toUploadCusFile(type) {
      // this.changeId
      // alert(type)
      this.fileType = type
      this.cusFileUploadVisible = true
    },
    // 上传变更因素相关附件
    toUploadFactorFile(row) {
      this.fileType = row.name
      this.factorFileUploadVisible = true
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
    // 上传变更直系对应的附件
    submitCusFileUpload() {
      this.$refs.uploadChangeFile.submit()
    },
    // 上传问题对应的附件
    submitFactorFileUpload() {
      this.$refs.uploadFactorFile.submit()
    },
    // 上传因素附件成功
    handleFactorFileSuccess() {
      this.$message.success('上传文件成功!')
      this.$refs.uploadFactorFile.clearFiles()
      // 刷新因素下附件列表
      this.getFactorFiles(this.changeId, this.fileType, this.factorId)
    },
    // 上传变更相关附件成功
    handleCusFileSuccess() {
      this.$message.success('上传文件成功!')
      this.$refs.uploadChangeFile.clearFiles()
      // 刷新附件列表
      if (this.fileType === this.cusType) {
        this.getCusFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.riskAssessType) {
        this.getRiskAssessFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.agreeType) {
        this.getAgreeFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.assessReportType) {
        this.getAssessReports(this.changeId, this.fileType)
      } else if (this.fileType === this.docChangeType) {
        this.getDocChangeFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.processChangeType) {
        this.getProcessChangeFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.toolChangeType) {
        this.getToolChangeFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.otherChangeType) {
        this.getOtherChangeFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.buyOffType) {
        this.getBuyOffFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.cusAcceptType) {
        this.getCusAcceptFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.internalAcceptType) {
        this.getInternalAcceptFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.partDrawingType) {
        this.getPartDrawingFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.docType) {
        this.getDocFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.evaluateType) {
        this.getEvaluateFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.controlPlanType) {
        this.getControlPlanFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.ppapType) {
        this.getPpapFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.apqpType) {
        this.getApqpFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.samplePartType) {
        this.getSamplePart(this.changeId, this.fileType)
      } else if (this.fileType === this.toolsType) {
        this.getToolsFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.otherType) {
        this.getOtherFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.PCNFlowType) {
        this.getPCNFlowFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.recordType) {
        this.getRecordFiles(this.changeId, this.fileType)
      } else if (this.fileType === this.mEvaluateType) {
        this.getEvaluateReports(this.changeId, this.fileType)
      } else if (this.fileType === this.trainRecordType) {
        this.getTrainRecords(this.changeId, this.fileType)
      }
    },
    // 删除变更直系附件
    deleteCusFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delChangeFile(data).then(res => {
        // 刷新附件列表
        if (row.fileType === this.cusType) {
          this.getCusFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.riskAssessType) {
          this.getRiskAssessFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.agreeType) {
          this.getAgreeFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.assessReportType) {
          this.getAssessReports(this.changeId, row.fileType)
        } else if (row.fileType === this.docChangeType) {
          this.getDocChangeFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.processChangeType) {
          this.getProcessChangeFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.toolChangeType) {
          this.getToolChangeFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.otherChangeType) {
          this.getOtherChangeFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.buyOffType) {
          this.getBuyOffFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.cusAcceptType) {
          this.getCusAcceptFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.internalAcceptType) {
          this.getInternalAcceptFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.partDrawingType) {
          this.getPartDrawingFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.docType) {
          this.getDocFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.evaluateType) {
          this.getEvaluateFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.ppapType) {
          this.getPpapFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.controlPlanType) {
          this.getControlPlanFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.apqpType) {
          this.getApqpFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.samplePartType) {
          this.getSamplePart(this.changeId, row.fileType)
        } else if (row.fileType === this.toolsType) {
          this.getToolsFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.otherType) {
          this.getOtherFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.PCNFlowType) {
          this.getPCNFlowFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.recordType) {
          this.getRecordFiles(this.changeId, row.fileType)
        } else if (row.fileType === this.mEvaluateType) {
          this.getEvaluateReports(this.changeId, row.fileType)
        } else if (this.fileType === this.trainRecordType) {
          this.getTrainRecords(this.changeId, row.fileType)
        }
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
      })
    },
    // 编辑问题
    editFactor(row) {
      this.factorForm = row
      this.factorOperationTitle = '编辑因素'
      this.addFactorVisible = true
    },
    // 关闭弹窗前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          // todo 刷新因素列表
          // this.getReportQuestionsByChangeId(this.changeId)
        })
        .catch(_ => {
        })
    },
    cancelOperation() {
      this.addFactorVisible = false
      // 刷新因素列表
      this.getChangeFactors(this.changeId)
    },
    // 提交因素
    submitFactor() {
      this.$refs.factorForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          //  新增、编辑因素
          this.factorForm.changeId = this.changeId
          // 根据标识判断新增/编辑
          if (!validIsNotNull(this.factorForm.id)) {
            addChangeFactor(this.factorForm).then(res => {
              this.$message({
                message: 'Add Factor Success! 添加影响因素成功!',
                type: 'success'
              })
              this.addFactorVisible = false
              this.getChangeFactors(this.changeId)
            })
          } else {
            editChangeFactor(this.factorForm).then(res => {
              this.$message({
                message: 'Update Factor Success! 更新影响因素成功!',
                type: 'success'
              })
              this.addFactorVisible = false
              this.getChangeFactors(this.changeId)
            })
          }
        }
      })
    },
    // 删除因素
    delFactor(id) {
      const data = []
      data.push(id)
      delChangeFactor(data).then(res => {
        this.$message({
          message: 'Del Success! 删除因素成功!',
          type: 'success'
        })
        this.getChangeFactors(this.changeId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除因素失败!',
          type: 'error'
        })
      })
    },
    // 删除变更因素下附件
    delFactorFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delChangeFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getFactorFiles(row.changeId, row.fileType, row.factorId)
      })
    },
    handleCheckAllChange: function(val) {
      // alert(val)
      this.changeForm.scopeTags = val ? scopeOptions : []
      if(this.changeForm.scopeTags.length > 0) {
        this.$refs.scopeTags.$el.style.border = '0px solid #f00'
      }
      this.changeForm.scope = this.changeForm.scopeTags.join(',')
      this.isIndeterminate = false
      // alert(JSON.stringify(this.changeForm.scopeTags))
      this.isScopeChanged = !judgeIsEqual(this.changeForm.scope, this.oldChangeForm.scope)
      this.judgeAnalyzeChange()
      this.getAllChangeTypeFiles()
    },
    // 主要是渲染所有变更范围附件是否为空的样式
    getAllChangeTypeFiles() {
      if (this.changeForm.scopeTags.indexOf(this.docChangeType) > -1) {
        this.getDocChangeFiles(this.changeForm.id, this.docChangeType)
      }
      if (this.changeForm.scopeTags.indexOf(this.processChangeType) > -1) {
        this.getProcessChangeFiles(this.changeForm.id, this.processChangeType)
      }
      if (this.changeForm.scopeTags.indexOf(this.toolChangeType) > -1) {
        this.getToolChangeFiles(this.changeForm.id, this.toolChangeType)
      }
      if (this.changeForm.scopeTags.indexOf(this.otherChangeType) > -1) {
        this.getOtherChangeFiles(this.changeForm.id, this.otherChangeType)
      }
    },
    handleCheckedScopeChange(value) {
      // alert(JSON.stringify(this.changeForm.scopeTags))
      if(this.changeForm.scopeTags.length > 0) {
        this.$refs.scopeTags.$el.style.border = '0px solid #f00'
      }
      this.changeForm.scope = this.changeForm.scopeTags.join(',')
      const checkedCount = value.length
      this.checkAll = checkedCount === this.enableScopes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.enableScopes.length
      this.isScopeChanged = !judgeIsEqual(this.changeForm.scope, this.oldChangeForm.scope)
      this.judgeAnalyzeChange()
      this.getAllChangeTypeFiles()
    },
    // 监控是否置灰保存按钮
    judgeAnalyzeChange() {
      this.isAnalyzeButtonGray = !(this.isScopeChanged || this.isHavAgreeChanged)
    },
    approveDepartChangeHandler(val) {
      this.isApproveDepartChanged = !judgeIsEqual(val, this.oldChangeForm.approveDepart)
      this.judgeDecideChange()
    },
    approveByChangeHandler(val) {
      alert("---新值："+val)
      alert("---旧值："+this.oldChangeForm.approveBy)
      alert(judgeIsEqual(val, this.oldChangeForm.approveBy))
      this.isApproveByChanged = !judgeIsEqual(val, this.oldChangeForm.approveBy)
      this.judgeDecideChange()
    },
    havReportChangeHandler(val) {
      // alert(val)
      if (val.toString() === 'false') {
        this.$refs.evReportFiles.$el.style.border = 'none'
      } else {
        this.getAssessReports(this.changeId, this.assessReportType)
      }
      this.isHavReportChanged = !judgeIsEqual(val.toString(), this.oldChangeForm.havReport.toString())
      this.judgeDecideChange()
    },
    acceptChangeHandler(val) {
      // alert(val)
      if (val.toString() === 'false') {
        this.$message({
          message: 'Notice! Will be Refused! 注意！当前不同意变更!',
          type: 'warning'
        })
      }
      this.isAcceptedChanged = !judgeIsEqual(val.toString(), this.oldChangeForm.isAccepted.toString())
      this.judgeDecideChange()
    },
    judgeDecideChange() {
      this.isDecideButtonGray = !(this.isApproveDepartChanged || this.isApproveByChanged || this.isHavReportChanged || this.isEvReportFilesChanged || this.isAcceptedChanged)
    },
    toAddFactor() {
      this.factorForm = {}
      this.factorOperationTitle = '新增因素'
      this.addFactorVisible = true
    },
    // 零件图纸切换
    partDrawingChangeHandler(val) {
      if (val === '是') {
        this.getPartDrawingFiles(this.changeId, this.partDrawingType)
      }
      this.isPartDrawingChanged = !judgeIsEqual(val, this.oldManageForm.partDrawing)
      this.judgeManageChange()
    },
    documentChangeHandler(val) {
      if (val === '是') {
        this.getDocFiles(this.changeId, this.docType)
      }
      this.isDocumentChanged = !judgeIsEqual(val, this.oldManageForm.document)
      this.judgeManageChange()
    },
    evaluationReportChangeHandler(val) {
      if (val === '是') {
        this.getEvaluateFiles(this.changeId, this.evaluateType)
      }
      this.isEvaluationReportChanged = !judgeIsEqual(val, this.oldManageForm.evaluationReport)
      this.judgeManageChange()
    },
    ppapChangeHandler(val) {
      if (val === '是') {
        this.getPpapFiles(this.changeId, this.ppapType)
      }
      this.isPpapChanged = !judgeIsEqual(val, this.oldManageForm.ppap)
      this.judgeManageChange()
    },
    controlPlanChangeHandler(val) {
      if (val === '是') {
        this.getControlPlanFiles(this.changeId, this.controlPlanType)
      }
      this.isControlPlanChanged = !judgeIsEqual(val, this.oldManageForm.controlPlan)
      this.judgeManageChange()
    },
    apqpChangeHandler(val) {
      if (val === '是') {
        this.getApqpFiles(this.changeId, this.apqpType)
      }
      this.isApqpChanged = !judgeIsEqual(val, this.oldManageForm.apqp)
      this.judgeManageChange()
    },
    samplePartChangeHandler(val) {
      if (val === '是') {
        this.getSamplePart(this.changeId, this.samplePartType)
      }
      this.isSamplePartChanged = !judgeIsEqual(val, this.oldManageForm.samplePart)
      this.judgeManageChange()
    },
    toolsChangeHandler(val) {
      if (val === '是') {
        this.getToolsFiles(this.changeId, this.toolsType)
      }
      this.isToolsChanged = !judgeIsEqual(val, this.oldManageForm.tools)
      this.judgeManageChange()
    },
    otherChangeHandler(val) {
      if (val === '是') {
        this.getOtherFiles(this.changeId, this.otherType)
      }
      this.isOtherChanged = !judgeIsEqual(val, this.oldManageForm.other)
      this.judgeManageChange()
    },
    judgeManageChange() {
      this.isManageButtonGray = !(this.isPartDrawingChanged || this.isDocumentChanged || this.isEvaluationReportChanged ||
        this.isPpapChanged || this.isControlPlanChanged || this.isApqpChanged || this.isSamplePartChanged || this.isToolsChanged || this.isOtherChanged
      )
    },
    // 保存变更管理信息
    saveManageForm(backFlag,stepName) {
      // alert('manageForm:' + JSON.stringify(this.manageForm))
      this.$refs.manageForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          // 新增/保存 变更管理信息
          // 判断“是”相关附件是否都上传
          if(this.manageForm.partDrawing === '是') {
            if(this.partDrawingFiles.length === 0) {
              this.$message({
                message: 'Part Drawing Files Needed! 请务必上传零件图纸等相关附件!',
                type: 'warning'
              })
              this.$refs.partDrawingFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.document === '是') {
            if(this.docFiles.length === 0) {
              this.$message({
                message: 'Document/SOP/WI Files Needed! 请务必上传文档、标准作业程序、工作指导书等相关附件!',
                type: 'warning'
              })
              this.$refs.docFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.evaluationReport === '是') {
            if(this.evaluateFiles.length === 0) {
              this.$message({
                message: 'Evaluation Reports Needed! 请务必上传审批或评估等相关附件!',
                type: 'warning'
              })
              this.$refs.evaluateFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.ppap === '是') {
            if(this.ppapFiles.length === 0) {
              this.$message({
                message: 'Production Part Approval Process Files Needed! 请务必上传生产件批准程序相关附件!',
                type: 'warning'
              })
              this.$refs.ppapFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.controlPlan === '是') {
            if(this.controlPlanFiles.length === 0) {
              this.$message({
                message: 'Control Plan Files Needed! 请务必上传指控计划相关附件!',
                type: 'warning'
              })
              this.$refs.controlPlanFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.apqp === '是') {
            if(this.apqpFiles.length === 0) {
              this.$message({
                message: 'Advanced Product Quality Planning Files Needed! 请务必上传产品质量先期策划相关附件!',
                type: 'warning'
              })
              this.$refs.apqpFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.samplePart === '是') {
            if(this.samplePartFiles.length === 0) {
              this.$message({
                message: 'Sample Part Files Needed! 请务必上传样品相关附件!',
                type: 'warning'
              })
              this.$refs.samplePartFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.tools === '是') {
            if(this.toolsFiles.length === 0) {
              this.$message({
                message: 'Tools Files Needed! 请务必上传工具类相关附件!',
                type: 'warning'
              })
              this.$refs.toolsFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          if(this.manageForm.other === '是') {
            if(this.otherMFiles.length === 0) {
              this.$message({
                message: 'Other Files Needed! 请上传其他方面的相关附件!',
                type: 'warning'
              })
              this.$refs.otherMFiles.$el.style.border = '1px solid #f00'
              return false
            }
          }
          //  新增、编辑变更管理信息
          this.manageForm.changeId = this.changeId
          // 根据标识判断新增/编辑
          if (!validIsNotNull(this.manageForm.id)) {
            this.manageForm.finishedStep = 1
            addChangeManagement(this.manageForm).then(res => {
              this.$message({
                message: 'Add Change Management Success! 添加变更管理信息成功!',
                type: 'success'
              })
              this.changeForm.management = res
              this.initLoadAsync()
              // this.initChangeForm()
              if(validIsNotNull(stepName)) {
                setTimeout(() => {
                  this.stepMangeName = stepName
                }, 300)
              }
              this.initChangeForm(this.stepMangeName)
              this.isActive = backFlag
            })
          } else {
            editChangeManagement(this.manageForm).then(res => {
              this.$message({
                message: 'Update Change Management Success! 更新变更管理信息成功!',
                type: 'success'
              })
              // alert(JSON.stringify(res))
              this.changeForm.management = this.manageForm
              this.changeForm.unlockSteps = res.steps
              this.changeForm.changeNum = res.num
              this.initLoadAsync()
              // this.initChangeForm()
              if(validIsNotNull(stepName)) {
                setTimeout(() => {
                  this.stepMangeName = stepName
                }, 300)
              }
              this.initChangeForm(this.stepMangeName)
              this.isActive = backFlag
            })
          }
          // this.getChangeManagement(this.changeId)
        }
      })
    },
    // 保存管理ECN
    finishManageECN() {
      this.manageForm.finishedStep = 2
      // 判断附件是否都上传
      // PCN流程图判空
      if (this.flowFiles.length === 0) {
        this.$message({
          message: 'PCN Flow Chart Files Needed! 请务必上传PCN流程图等相关附件!',
          type: 'warning'
        })
        this.$refs.flowFiles.$el.style.border = '1px solid #f00'
        return false
      }
      // 变更记录判空
      if (this.recordFiles.length === 0) {
        this.$message({
          message: 'Record Of Change Needed! 请务必上传变更相关记录!',
          type: 'warning'
        })
        this.$refs.recordFiles.$el.style.border = '1px solid #f00'
        return false
      }
      // 反馈报告判空
      if (this.evaluateReports.length === 0) {
        this.$message({
          message: 'Evaluate Reports Needed! 请务必上传反馈报告等相关附件!',
          type: 'warning'
        })
        this.$refs.evaluateReports.$el.style.border = '1px solid #f00'
        return false
      }
      // 培训记录判空
      if (this.trainRecords.length === 0) {
        this.$message({
          message: 'Training Records Needed! 请务必上传培训记录相关附件!',
          type: 'warning'
        })
        this.$refs.trainRecords.$el.style.border = '1px solid #f00'
        return false
      }
      editChangeManagement(this.manageForm).then(res => {
        this.$message({
          message: 'Submit Success! 提交ECN信息成功!',
          type: 'success'
        })
        this.changeForm.management = this.manageForm
        this.changeForm.unlockSteps = res.steps
        this.initChangeForm(this.stepMangeName)
      })
    },
    // 监控完成变更时间变化
    implTimeChangeHandler(val) {
      this.isImplementedTimeChanged = !judgeIsEqual(validIsNotNull(val) ? GMTToStr(val) : null, this.oldApproveForm.implementedTime)
      this.judgeApproveChange()
    },
    // 监控发送给客户时间变化
    StoCusTimeChangeHandler(val) {
      this.isSendToCusTimeChanged = !judgeIsEqual(validIsNotNull(val) ? GMTToStr(val) : null, this.oldApproveForm.sendToCusTime)
      this.judgeApproveChange()
    },
    // 监控客户接受时间变化
    acceptedByCusTimeChangeHandler(val) {
      this.isAcceptedByCusTimeChanged = !judgeIsEqual(validIsNotNull(val) ? GMTToStr(val) : null, this.oldApproveForm.acceptedByCusTime)
      this.judgeApproveChange()
    },
    // 监控内部团队接受时间变化
    acceptedByInternalTimeChangeHandler(val) {
      this.isAcceptedByInternalTimeChanged = !judgeIsEqual(validIsNotNull(val) ? GMTToStr(val) : null, this.oldApproveForm.acceptedByInternalTime)
      this.judgeApproveChange()
    },
    // 监控批准/关闭变化
    judgeApproveChange() {
      this.isApproveButtonGray = !(this.isImplementedTimeChanged || this.isSendToCusTimeChanged || this.isAcceptedByCusTimeChanged || this.isAcceptedByInternalTimeChanged)
      this.judgeCloseApproveChange()
    },
    // 保存变更批准/关闭
    saveApproveForm() {
      // alert('approveForm'+JSON.stringify(form))
      this.$refs.approveForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          // 新增/保存 变更批准/关闭信息
          // this.changeForm.unlockSteps.push(3)
          //  新增、编辑变更管理信息
          this.approveForm.changeId = this.changeId
          // 根据标识判断新增/编辑
          if (!validIsNotNull(this.approveForm.id)) {
            this.approveForm.finishedStep = 1
            addChangeApprove(this.approveForm).then(res => {
              this.$message({
                message: 'Add Change Approve/Close Success! 添加变更批准/关闭信息成功!',
                type: 'success'
              })
              this.changeForm.approve = res
              this.initLoadAsync()
              this.initChangeForm()
              setTimeout(() => {
                this.judgeCloseApproveChange()
              }, 300)
            })
          } else {
            editChangeApprove(this.approveForm).then(res => {
              this.$message({
                message: 'Update Change Approve/Close Success! 更新变更批准/关闭信息成功!',
                type: 'success'
              })
              this.changeForm.approve = this.approveForm
              this.initLoadAsync()
              this.initChangeForm()
              setTimeout(() => {
                this.judgeCloseApproveChange()
              }, 300)
            })
          }
          this.getChangeApprove(this.changeId)
        }
      })
    },
    judgeCloseApproveChange() {
      if (this.approveForm.finishedStep === 2) {
        this.isCloseButtonGray = true
      } else {
        let acceptClose = false
        acceptClose = !(this.buyOffFiles.length === 0 || this.cusAcceptFiles.length === 0 || this.internalAcceptFiles.length === 0)
        this.isCloseButtonGray = !(this.isApproveButtonGray && acceptClose)
      }
      // let acceptClose = false
      // acceptClose = !(this.buyOffFiles.length === 0 || this.cusAcceptFiles.length === 0 || this.internalAcceptFiles.length === 0);
      // this.isCloseButtonGray = !(this.isApproveButtonGray && acceptClose)
    },
    // 关闭变更批准
    closeApproveForm() {
      // 判断附件是否为空
      /* if(this.buyOffFiles.length === 0 ) {
        this.$message({
          message: 'Change BuyOff Reports Needed! 验收报告等附件不可为空!',
          type: 'warning'
        })
        this.$refs.buyOffFiles.$el.style.border = '1px solid #f00'
        return false
      }
      if(this.cusAcceptFiles.length === 0 ) {
        this.$message({
          message: 'Accepted By Customer Reports Needed! 缺少重要的客户同意证明附件!',
          type: 'warning'
        })
        this.$refs.cusAcceptFiles.$el.style.border = '1px solid #f00'
        return false
      }
      if(this.internalAcceptFiles.length === 0 ) {
        this.$message({
          message: 'Internal Team Accepted Reports Needed! 缺少内部团队同意证明附件!',
          type: 'warning'
        })
        this.$refs.internalAcceptFiles.$el.style.border = '1px solid #f00'
        return false
      } */
      this.approveForm.changeId = this.changeId
      this.approveForm.finishedStep = 2
      editChangeApprove(this.approveForm).then(res => {
        this.$message({
          message: 'Update Change Approve/Close Success! 更新变更批准/关闭信息成功!',
          type: 'success'
        })
        this.changeForm.approve = this.approveForm
        this.initLoadAsync()
        this.initChangeForm()
        setTimeout(() => {
          this.judgeCloseApproveChange()
        }, 300)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}

::v-deep .el-form-item--small.el-form-item {
  margin: 14px 0 !important;
}

::v-deep .el-step__title.is-finish {
  //color: #008000;
}

.el-row-margin {
  margin-bottom: 5px;
}

::v-deep .new-el-tag {
  font-size: 14px;
  margin-right: 5px;
  padding: 5px;
  height: 32px;
}

.a:hover {
  color: #00eaff;
  /*鼠标悬停颜色*/
}

.a:active {
  color: #F00;
  /*鼠标点击颜色*/
}

.card-panel {
  height: 88px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #FFBA00;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);

  &:hover {
    .card-panel-icon-wrapper {
      color: #fff;
    }

    .icon-unlock {
      background: #40c9c6;
    }

    .icon-lock {
      background: #f4516c;
    }

    .icon-doc {
      background: #34bfa3
    }
  }

  .icon-unlock {
    color: #40c9c6;
  }

  .icon-lock {
    color: #f4516c;
  }

  .icon-doc {
    color: #34bfa3
  }

  .card-panel-icon-wrapper {
    float: left;
    margin: 14px 0 0 14px;
    padding: 16px;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }

  .card-panel-icon {
    float: left;
    font-size: 28px;
  }

  .card-panel-description {
    float: right;
    font-weight: bold;
    margin: 26px 26px 26px 0px;

    .card-panel-text {
      line-height: 36px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 28px;
      margin-bottom: 12px;
    }

    .card-panel-num {
      font-size: 20px;
    }
  }
}

.button-new-tag {
  margin-left: 5px;
  margin-top: 1px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
}

.demo-table-expand .el-form-item--small.el-form-item {
  border: none;
  margin: 10px 8px !important;
}

.el-row-margin-border {
  border: 0.5px solid #e6ebf5;
}

.el-item-no-margin {
  margin: 5px 0;
}
</style>
