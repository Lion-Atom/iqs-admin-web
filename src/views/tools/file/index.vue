<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边文件级别-->
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <el-input
            v-model="fileLevelName"
            clearable
            size="small"
            placeholder="输入文件等级名称搜索"
            prefix-icon="el-icon-search"
            class="filter-item"
            @input="getFileLevelDatas"
          />
        </div>
        <el-tree
          :data="fileLevelDatas"
          :load="getFileLevelDatas"
          :props="defaultProps"
          :expand-on-click-node="false"
          lazy
          @node-click="handleLevelNodeClick"
        />
      </el-col>
      <!--文件数据-->
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input
              v-model="query.blurry"
              clearable
              size="small"
              placeholder="输入名称、类型、创建者等搜索"
              style="width: 140px;"
              class="filter-item"
              @keyup.enter.native="crud.toQuery"
              @input="inputChange($event)"
            />
            <date-range-picker
              v-model="query.createTime"
              class="date-item"
              @change="crud.toQuery"
              @input="dateTimeChange($event)"
            />
            <!-- 文件分类筛选，需要更改为树表筛选,暂时注释掉 -->
            <treeselect
              v-model="query.fileCategoryId"
              :options="fileCategories"
              :load-options="loadCategories"
              class="newTree-item"
              placeholder="选择文件分类"
              @input="crud.toQuery"
            />
            <!-- 文件所属部门筛选，需要更改为树表筛选 -->
            <treeselect
              v-model="query.deptId"
              :options="fileDepts"
              :load-options="loadFileDepts"
              class="newTree-item"
              placeholder="选择所属部门"
              @input="crud.toQuery"
            />
            <!-- 审批状态筛选 -->
            <el-select
              v-model="query.approvalStatus"
              clearable
              size="small"
              placeholder="审批状态"
              class="filter-item"
              style="width: 120px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.approval_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
            <!-- 文件类型筛选 -->
            <el-select
              v-model="query.fileType"
              clearable
              size="small"
              placeholder="文件类型"
              class="filter-item"
              style="width: 120px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.file_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
            <el-select
              v-model="query.fileStatus"
              clearable
              size="small"
              placeholder="文件状态"
              class="filter-item"
              style="width: 100px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.file_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>
            <rrOperation />
          </div>
          <crudOperation show="" :permission="permission" />
        </div>
        <!--表单渲染-->
        <el-dialog
          append-to-body
          :close-on-click-modal="false"
          :before-close="cancelOperation"
          :visible.sync="crud.status.cu > 0"
          :title="crud.status.add ? '文件上传' : '编辑文件'"
          width="760px"
          class="dialog"
        >
          <el-form ref="form" :model="form" size="small" label-width="120px">
            <el-form-item label="文件名称">
              <el-input v-model="form.name" style="width: 400px;" />
            </el-form-item>
            <!-- 编辑文件 -->
            <!--            <el-form-item v-if="!crud.status.add" label="真实名称">
                          <el-input v-model="form.realName" style="width: 400px;" />
                        </el-form-item>-->
            <!--            <el-form-item v-if="!crud.status.add" label="文件版本">-->

            <el-form-item v-if="!crud.status.add" label="文件版本">
              <el-input
                v-model="form.version"
                style="width: 400px;color:#fff;!important;background-color: #fff;!important;"
                disabled
              />
            </el-form-item>
            <el-form-item v-if="crud.status.add" label="文件版本">
              <el-input
                v-model="form.version"
                style="width: 200px;color:#fff;!important;background-color: #fff;!important;"
                disabled
              />
              <div v-if="selectVisible" style="display: inline-block;">
                自定义：
                <el-select
                  v-model="verPrefix"
                  size="small"
                  placeholder="支持自定义输入"
                  filterable
                  allow-create
                  class="filter-item"
                  style="width: 100px"
                >
                  <el-option
                    v-for="item in dict.file_version"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!--                <el-autocomplete
                  popper-class="my-autocomplete"
                  v-model="verPrefix"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  style="width: 80px">
                  <i
                    class="el-icon-edit el-input__icon"
                    slot="suffix">
                  </i>
                  <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                  </template>
                </el-autocomplete>-->
                /
                <el-input-number
                  v-model="verNo"
                  style="width: 100px;"
                  :step="1"
                  :min="0"
                  :max="100"
                />
                <el-button type="success" round size="small" @click="inputConfirm">ok</el-button>
              </div>
              <el-button v-else type="primary" plain icon="el-icon-edit" size="small" @click="showInput">自定义版本号
              </el-button>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="文件等级" prop="fileLevel.id" required>
                  <treeselect
                    v-model="form.fileLevel.id"
                    :options="fileLevels"
                    :load-options="loadLevels"
                    style="width: 190px"
                    placeholder="选择文件对应等级"
                    @select="disFileLevel"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件分类" prop="fileCategory.id" required>
                  <treeselect
                    v-model="form.fileCategory.id"
                    :options="fileCategories"
                    :load-options="loadCategories"
                    style="width: 190px"
                    placeholder="选择文件所属分类"
                    @click.native="fileCategoryHandler"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="所属部门" prop="fileDept.id" required>
                  <treeselect
                    v-model="form.fileDept.id"
                    :options="fileDepts"
                    :load-options="loadFileDepts"
                    style="width: 190px"
                    placeholder="选择文件所属部门"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文件用途" prop="fileType">
                  <el-select
                    ref="fileType"
                    v-model="form.fileType"
                    clearable
                    placeholder="--none--"
                    style="width: 190px"
                    @blur.native="blur()"
                  >
                    <el-option
                      v-for="item in dict.file_type"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="保密级别" required>
                  <el-radio-group v-model="form.securityLevel">
                    <el-radio
                      v-for="item in dict.file_security"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col v-if="form.securityLevel === 'external'" :span="24">
                <el-form-item class="bindDept" label="指定开放部门" prop="bindDepts">
                  <treeselect
                    v-model="bindDeptDatas"
                    :options="allDepts"
                    :load-options="loadFileDepts"
                    :multiple="true"
                    style="width: 400px"
                    placeholder="选择文件指定开发的部门，默认为全部"
                    @input="bindDeptsChange"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="!crud.status.add && form.fileStatus !== 'draft' "
                  label="文件状态"
                  prop="fileStatus"
                  required
                >
                  <el-select
                    v-model="form.fileStatus"
                    filterable
                    style="background: none;"
                  >
                    <el-option
                      v-for="item in dict.file_status"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.value === 'draft'"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-else-if="!crud.status.add && form.fileStatus === 'draft'"
                  label="文件状态"
                  prop="fileStatus"
                  required
                >
                  <el-select
                    v-model="form.fileStatus"
                    filterable
                    style="background: none;"
                    disabled
                  >
                    <el-option
                      v-for="item in dict.file_status"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    >
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col v-if="form.fileStatus === 'temp'" :span="12">
                <el-form-item label="过期时间" prop="expirationTime" required>
                  <el-date-picker
                    v-model="form.expirationTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    style="width: 190px"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="!crud.status.add" label="审批状态">
                  <!--                  <span slot="label">
                                      <span class="span-box">
                                        <el-tooltip v-if="comment !== undefined && comment !== null " placement="top" effect="light">
                                          <div slot="content"><b style="color: red">*状态</b>:“已废止”说明申请被驳回
                                            <br/>
                                            <b style="color: red">*原因:</b>{{comment}}
                                            </div>
                                          <i class="el-icon-question"/>
                                        </el-tooltip>
                                        <span>审批状态</span>
                                      </span>
                                    </span>-->
                  <el-tooltip placement="bottom-start" effect="light">
                    <div slot="content" style="width:300px;">
                      <el-steps :active="taskCount" finish-status="success">
                        <el-step
                          v-for="item in approvalProcessList"
                          :title="item.approver"
                          :description="item.approvedResult === undefined ? '待审批':item.approvedResult"
                        />
                      </el-steps>
                      <div v-if="comment !== undefined && comment !== null ">
                        <b style="color: red">*状态</b>:“已废止”说明申请被驳回
                        <br>
                        <b style="color: red">*原因:</b>{{ comment }}
                      </div>
                      <div v-if="form.approvalStatus !== 'approved'">
                        <b style="color: red">*当前审批人:</b>{{ currApproverName }}
                        <div v-if="form.approvalStatus === 'waitingfor' ">
                          <b style="color: red">*已等待时长:</b>{{ waitingTime }}<br>
                          <b style="color: red">
                            <el-button :loading="sendLoading" @click="sendEmail"><i class="el-icon-message-solid" />发送邮件提醒{{
                              currApproverName
                            }}
                            </el-button>
                          </b>
                        </div>
                      </div>
                      <div v-if="form.approvalStatus === 'approved'">
                        <b style="color: red">*当前审批已完成，最后审批人:</b>{{ currApproverName }}
                      </div>
                    </div>
                    <i class="el-icon-question" />
                    <el-select
                      v-model="form.approvalStatus"
                      style="background: none;"
                      disabled
                    >
                      <el-option
                        v-for="item in dict.approval_status"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item v-if="form.approvalStatus === 'waitingfor'">
                  <span slot="label">
                    <span class="span-box">
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">you can choose the owner's approver for faster approval (<b
                          style="color: red"
                        >*</b>Superior has not approved only).<br>
                          默认审批发起者【{{ currCreateName }}】的直接领导，<b style="color: red">直接领导尚未审批情况下</b>，允许切换临时审批者(仅限发起者部门成员)以加快审批进度.</div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                      <span>首批人</span>
                    </span>
                  </span>
                  <el-select
                    v-model="form.superiorId"
                    placeholder="请选择上级"
                    clearable
                    :disabled="isDone"
                  >
                    <el-option
                      v-for="item in superiors"
                      :key="item.id"
                      :label="item.jobs[0].name + '-'+ item.username "
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 发起审批 -->
              <el-col :span="12">
                <el-form-item
                  v-if="!crud.status.add && this.form.fileStatus!=='draft' && this.form.fileStatus!=='obsolete'"
                >
                  <span slot="label">
                    <span class="span-box">
                      <el-tooltip placement="top" effect="light">
                        <div slot="content">Choose 'true' ,you can Upgrade version via uploading new coverFile.<br>切换到“是“可以上传覆盖文件进而发起升版请求.</div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                      <span>是否改版</span>
                    </span>
                  </span>
                  <el-radio-group v-model="form.isRevision" @change="agreeChange">
                    <el-radio
                      v-for="item in dict.common_status"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!--   二次上传文件   -->
            <el-form-item
              v-if="form.isRevision==='true' || (this.form.approvalStatus === 'obsoleted' && this.form.fileStatus === 'draft')"
              :label="uploadCoverFile"
            >
              <el-upload
                ref="coverUpload"
                drag
                :limit="1"
                :before-upload="beforeCover"
                :auto-upload="false"
                :headers="headers"
                :on-success="coverSuccess"
                :on-error="handleError"
                :action="fileCoverUploadApi + '?id=' + form.id+ '&version=' + newVersion + '&approvalStatus=' + form.approvalStatus "
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <!--                <div class="eladmin-upload"><i class="el-icon-upload"/> 添加文件</div>-->
                <div slot="tip" class="el-upload__tip"><i style="color: #ff0000">*</i>文件覆盖操作完成审批后改版才能生效，请做好备份并确认新文件正确性
                </div>
              </el-upload>
              <!--todo 必须上传文件版本号-->
              <el-form-item label="新文件版本" required>
                <el-input
                  v-model="newVersion"
                  style="width: 100px;color:#fff;!important;background-color: #fff;!important;"
                  disabled
                />
                <div v-if="selectVisible" style="display: inline-block;">
                  自定义：
                  <el-select
                    v-model="verPrefix"
                    size="small"
                    placeholder="支持自定义输入"
                    filterable
                    allow-create
                    class="filter-item"
                    style="width: 60px"
                    @change="handleVerPrefix"
                  >
                    <el-option
                      v-for="item in dict.file_version"
                      :key="item.id"
                      :disabled="item.dictSort < verSort"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  /
                  <el-input-number
                    v-model="verNo"
                    style="width: 100px;"
                    :step="1"
                    :min="minVerNo"
                    :max="100"
                  />
                  <el-button type="success" round size="small" @click="inputNewVerConfirm">ok</el-button>
                </div>
                <el-button v-else type="primary" plain icon="el-icon-edit" size="small" @click="showInput" />
              </el-form-item>
              <el-button :loading="loading" type="text" @click="cancelCover">取消上传</el-button>
              <el-button :loading="loading" type="primary" @click="cover">确认覆盖</el-button>
            </el-form-item>

            <el-form-item v-if="!crud.status.add" label="文件概览" prop="fileDetails">
              <router-link
                :to="{path: '/fileManagement/filedetail',
                      query: {
                        fileId: form.id ,
                        name: form.name,
                        realName:form.realName,
                        fileDesc:form.fileDesc
                      }
                }"
              >
                <el-link href="/fileManagement/filedetail" icon="el-icon-view">查看</el-link>
              </router-link>
            </el-form-item>
            <!--   上传文件   -->
            <el-form-item v-if="crud.status.add" label="上传" style="width:520px;">
              <el-upload
                ref="upload"
                class="upload-demo"
                drag
                :limit="1"
                :before-upload="beforeUpload"
                :auto-upload="false"
                :headers="headers"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-remove="handleRemove"
                :on-change="fileChange"
                :action="fileUploadApi + '?name=' + form.name + '&version=' + form.version + '&fileLevelId=' + form.fileLevel.id+ '&fileCategoryId=' + form.fileCategory.id
                  + '&deptId=' + form.fileDept.id+ '&fileStatus=' + 'draft' + '&fileType=' + form.fileType
                  + '&securityLevel=' + form.securityLevel + '&expirationTime=' + form.expirationTime
                  + '&bindingFiles=' + bindFileDatas + '&bindingDepts=' + bindDeptDatas + '&fileDesc=' + form.fileDesc"
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
              </el-upload>
            </el-form-item>
            <!-- 关联文件 -->
            <el-row>
              <el-col>
                <el-form-item label="文件描述" prop="fileDesc">
                  <el-input
                    v-model="form.fileDesc"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 10}"
                    placeholder="请输入文件内容描述"
                    style="width: 400px;"
                    @input="changeDescInput($event)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 关联文件 -->
            <el-form-item label="参考文献" prop="bindFiles">
              <el-select
                v-model="bindFileDatas"
                style="width: 400px"
                multiple
                filterable
                placeholder="请选择"
                @remove-tag="deleteTag"
                @change="changeBindFile"
              >
                <el-option
                  v-for="item in bindFiles"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="bindFileDatas.length>0" label="参考文件列表" prop="bindFiles">
              <div v-for="(item,index) in bindFileItems" :key="item.id" style="margin-left: 5px;">
                <!--                <el-button type="text">-->
                <router-link
                  style="text-decoration:underline;"
                  :to="{path: '/fileManagement/filedetail',
                        query: {
                          fileId: item.id ,
                          name: item.name,
                          realName:item.realName,
                          fileDesc:item.fileDesc
                        }
                  }"
                >
                  {{ '[' + (index + 1) + '] ' + item.name + ',' + item.version }}
                </router-link>
                <!--                </el-button>-->
              </div>
            </el-form-item>
            <el-form-item v-if="!crud.status.add" label="变更说明" prop="changeDesc" required>
              <el-input
                v-model="form.changeDesc"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 30}"
                placeholder="请输入变更说明"
                style="width: 400px;"
                @input="changeDescInput($event)"
              />
            </el-form-item>
            <!--            <el-form-item v-if="form.localStorageTemp" label = "最新变更内容">
                          <el-form ref="localStorageTempForm" :model="form.localStorageTemp" size="small" label-width="120px">
                            <el-form-item label="文件名称">
                              <el-input v-model="form.localStorageTemp.name" style="width: 400px;"/>
                            </el-form-item>
                          </el-form>
                        </el-form-item>-->
            <el-form-item v-if="form.localStorageTemp && form.localStorageTemp.isDel === 0">
              <span slot="label">
                <span class="span-box">
                  <el-tooltip placement="top-start" effect="light">
                    <div slot="content">当前已存在修改提交项，待审批流程走完后或未正式进入审批流程（首批人尚未审批）前方可发起新的编辑提交请求.</div>
                    <i class="el-icon-warning" />
                  </el-tooltip>
                  <span style="color: #f00;">已存在修改</span>
                </span>
              </span>
              <el-button type="text" @click="TempDialogVisible = true">点击查看变更请求</el-button>
            </el-form-item>
            <el-dialog
              title="变更对比"
              :visible.sync="TempDialogVisible"
              append-to-body
              width="95%"
            >
              <el-row>
                <el-col :span="12">
                  <el-divider content-position="left">原版本 {{ form.updateTime }}</el-divider>
                  <el-form ref="form" :model="form" size="small" label-width="120px">
                    <el-form-item label="文件名称">
                      <el-input v-model="form.name" style="width: 400px;" disabled :class="diffName" />
                    </el-form-item>
                    <!-- 编辑文件 -->
                    <!--            <el-form-item v-if="!crud.status.add" label="真实名称">
                                  <el-input v-model="form.realName" style="width: 400px;" />
                                </el-form-item>-->
                    <el-form-item v-if="!crud.status.add" label="文件版本">
                      <!--            <el-form-item label="文件版本">-->
                      <el-input
                        v-model="form.version"
                        style="width: 400px;color:#fff;!important;background-color: #fff;!important;"
                        disabled
                        :class="diffVersion"
                      />
                    </el-form-item>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="文件等级" prop="fileLevel.id" required>
                          <treeselect
                            v-model="form.fileLevel.id"
                            :options="fileLevels"
                            :load-options="loadLevels"
                            style="width: 190px"
                            placeholder="选择文件对应等级"
                            disabled
                            :class="diffLevel"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="文件分类" prop="fileCategory.id" required>
                          <treeselect
                            v-model="form.fileCategory.id"
                            :options="fileCategories"
                            :load-options="loadCategories"
                            style="width: 190px"
                            placeholder="选择文件所属分类"
                            disabled
                            :class="diffCategory"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="所属部门" prop="fileDept.id" required>
                          <treeselect
                            v-model="form.fileDept.id"
                            :options="fileDepts"
                            :load-options="loadFileDepts"
                            style="width: 190px"
                            placeholder="选择文件所属部门"
                            disabled
                            :class="diffDepart"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="文件用途" prop="fileType">
                          <el-select
                            ref="fileType"
                            v-model="form.fileType"
                            clearable
                            placeholder="--none--"
                            style="width: 190px"
                            disabled
                            :class="diffYt"
                          >
                            <el-option
                              v-for="item in dict.file_type"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left">{{ item.label }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="保密级别" required>
                          <el-radio-group v-model="form.securityLevel">
                            <el-radio
                              v-for="item in dict.file_security"
                              :key="item.id"
                              disabled
                              :label="item.value"
                              :class="diffSecurityLevel"
                            >{{ item.label }}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <el-col v-if="form.securityLevel === 'external'" :span="24">
                        <el-form-item class="bindDept" label="指定开放部门" prop="bindDepts">
                          <treeselect
                            v-model="bindDeptDatas"
                            :options="allDepts"
                            :load-options="loadFileDepts"
                            :multiple="true"
                            style="width: 400px"
                            placeholder="选择文件指定开发的部门，默认为全部"
                            disabled
                            :class="diffBindDeptList"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          v-if="!crud.status.add && form.fileStatus !== 'draft' "
                          label="文件状态"
                          prop="fileStatus"
                          required
                        >
                          <el-select
                            v-model="form.fileStatus"
                            filterable
                            style="background: none;"
                            disabled
                            :class="diffFileStatus"
                          >
                            <el-option
                              v-for="item in dict.file_status"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                              :disabled="item.value === 'draft'"
                            >
                              <span style="float: left">{{ item.label }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          v-else-if="!crud.status.add && form.fileStatus === 'draft'"
                          label="文件状态"
                          prop="fileStatus"
                          required
                          :class="diffStyle"
                        >
                          <el-select
                            v-model="form.fileStatus"
                            filterable
                            style="background: none;"
                            disabled
                          >
                            <el-option
                              v-for="item in dict.file_status"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left">{{ item.label }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col v-if="form.fileStatus === 'temp'" :span="12">
                        <el-form-item label="过期时间" prop="expirationTime" required>
                          <el-date-picker
                            v-model="form.expirationTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 190px"
                            :picker-options="pickerOptions"
                            disabled
                            :class="diffExpTime"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item v-if="!crud.status.add" label="审批状态">
                          <el-tooltip placement="top-start" effect="light">
                            <div slot="content" style="width:300px;">
                              <el-steps :active="taskCount" finish-status="success">
                                <el-step
                                  v-for="item in approvalProcessList"
                                  :title="item.approver"
                                  :description="item.approvedResult === undefined ? '待审批':item.approvedResult"
                                />
                              </el-steps>
                              <div v-if="comment !== undefined && comment !== null ">
                                <b style="color: red">*状态</b>:“已废止”说明申请被驳回
                                <br>
                                <b style="color: red">*原因:</b>{{ comment }}
                              </div>
                              <div v-if="form.approvalStatus !== 'approved'">
                                <b style="color: red">*当前审批人:</b>{{ currApproverName }}
                                <div v-if="form.approvalStatus === 'waitingfor' ">
                                  <b style="color: red">*已等待时长:</b>{{ waitingTime }}<br>
                                  <b style="color: red">
                                    <el-button :loading="sendLoading" @click="sendEmail"><i
                                      class="el-icon-message-solid"
                                    />发送邮件提醒{{
                                      currApproverName
                                    }}
                                    </el-button>
                                  </b>
                                </div>
                              </div>
                              <div v-if="form.approvalStatus === 'approved'">
                                <b style="color: red">*当前审批已完成，最后审批人:</b>{{ currApproverName }}
                              </div>
                            </div>
                            <i class="el-icon-question" />
                            <el-select
                              v-model="form.approvalStatus"
                              style="background: none;"
                              disabled
                              :class="diffApprovalStatus"
                            >
                              <el-option
                                v-for="item in dict.approval_status"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-tooltip>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item v-if="form.approvalStatus === 'waitingfor'">
                          <span slot="label">
                            <span class="span-box">
                              <el-tooltip placement="top" effect="light">
                                <div slot="content">you can choose the owner's approver for faster approval (<b
                                  style="color: red"
                                >*</b>Superior has not approved only).<br>
                                  默认审批发起者【{{ currCreateName }}】的直接领导，<b style="color: red">直接领导尚未审批情况下</b>，允许切换临时审批者(仅限发起者部门成员)以加快审批进度.</div>
                                <i class="el-icon-question" />
                              </el-tooltip>
                              <span>首批人</span>
                            </span>
                          </span>
                          <el-select
                            v-model="form.superiorId"
                            placeholder="请选择上级"
                            clearable
                            disabled
                          >
                            <el-option
                              v-for="item in superiors"
                              :key="item.id"
                              :label="item.jobs[0].name + '-'+ item.username "
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- 关联文件 -->
                    <el-row>
                      <el-col>
                        <el-form-item label="文件描述" prop="fileDesc">
                          <el-input
                            v-model="form.fileDesc"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入文件内容描述"
                            style="width: 400px;"
                            disabled
                            :class="diffFileDesc"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- 关联文件 -->
                    <el-form-item label="参考文件" prop="bindFiles">
                      <el-select
                        v-model="bindFileDatas"
                        style="width: 400px"
                        multiple
                        filterable
                        placeholder="请选择"
                        disabled
                        :class="diffBindFiles"
                      >
                        <el-option
                          v-for="item in bindFiles"
                          :key="item.name"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="bindFileDatas.length>0" label="参考文件列表" prop="bindFiles">
                      <div
                        v-for="(item,index) in bindFileItems"
                        :key="item.id"
                        style="margin-left: 5px;"
                      >
                        <a :class="diffBindFileList">
                          {{ '[' + (index + 1) + '] ' + item.name + ',' + item.version }}
                        </a>
                      </div>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col v-if="form.localStorageTemp" :span="12" class="el-col-right">
                  <el-divider content-position="right">在审修改[&nbsp;
                    <i style="color: #1890ff">{{ form.localStorageTemp.changeDesc }}</i>&nbsp;]
                  </el-divider>
                  <el-form
                    ref="localStorageTempForm"
                    :model="form.localStorageTemp"
                    size="small"
                    label-width="120px"
                  >
                    <el-form-item label="文件名称">
                      <el-input v-model="form.localStorageTemp.name" :class="diffName" disabled style="width: 400px;" />
                    </el-form-item>
                    <el-form-item label="文件版本">
                      <el-input
                        v-model="form.localStorageTemp.version"
                        style="width: 400px;color:#fff;!important;background-color: #fff;!important;"
                        disabled
                        :class="diffVersion"
                      />
                    </el-form-item>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="文件等级" prop="fileLevel.id" required>
                          <treeselect
                            v-model="form.localStorageTemp.fileLevel.id"
                            :options="fileTempLevels"
                            :load-options="loadLevels"
                            style="width: 190px"
                            placeholder="选择文件对应等级"
                            disabled
                            :class="diffLevel"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="文件分类" prop="fileCategory.id" required>
                          <treeselect
                            v-model="form.localStorageTemp.fileCategory.id"
                            :options="fileTempCategories"
                            :load-options="loadCategories"
                            style="width: 190px"
                            placeholder="选择文件所属分类"
                            disabled
                            :class="diffCategory"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="所属部门" prop="fileDept.id" required>
                          <treeselect
                            v-model="form.localStorageTemp.fileDept.id"
                            :options="fileTempDepts"
                            :load-options="loadFileDepts"
                            style="width: 190px"
                            placeholder="选择文件所属部门"
                            disabled
                            :class="diffDepart"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="文件用途" prop="fileType">
                          <el-select
                            ref="fileType"
                            v-model="form.localStorageTemp.fileType"
                            clearable
                            placeholder="--none--"
                            style="width: 190px"
                            disabled
                            :class="diffYt"
                          >
                            <el-option
                              v-for="item in dict.file_type"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left">{{ item.label }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="保密级别" required>
                          <el-radio-group v-model="form.localStorageTemp.securityLevel">
                            <el-radio
                              v-for="item in dict.file_security"
                              :key="item.id"
                              disabled
                              :label="item.value"
                              :class="diffSecurityLevel"
                            >{{ item.label }}
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-col>
                      <!--指定开放的部门需要特殊处理-->
                      <el-col v-if="form.localStorageTemp.securityLevel === 'external'" :span="24">
                        <el-form-item class="bindDept" label="指定开放部门" prop="bindDepts">
                          <treeselect
                            v-model="bindTempDeptDatas"
                            :options="allDepts"
                            :load-options="loadFileDepts"
                            :multiple="true"
                            style="width: 400px"
                            disabled
                            :class="diffBindDeptList"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item
                          label="文件状态"
                          prop="fileStatus"
                          required
                        >
                          <el-select
                            v-model="form.localStorageTemp.fileStatus"
                            filterable
                            style="background: none;"
                            disabled
                            :class="diffFileStatus"
                          >
                            <el-option
                              v-for="item in dict.file_status"
                              :key="item.id"
                              :label="item.label"
                              :value="item.value"
                            >
                              <span style="float: left">{{ item.label }}</span>
                              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col v-if="form.localStorageTemp.fileStatus === 'temp'" :span="12">
                        <el-form-item label="过期时间" prop="expirationTime" required>
                          <el-date-picker
                            v-model="form.localStorageTemp.expirationTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 190px"
                            :picker-options="pickerOptions"
                            disabled
                            :class="diffExpTime"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <!--审批状态-->
                        <el-form-item label="审批状态">
                          <el-tooltip placement="top-start" effect="light">
                            <div slot="content" style="width:300px;">
                              <el-steps :active="taskTempCount" finish-status="success">
                                <el-step
                                  v-for="item in approvalProcessTempList"
                                  :title="item.approver"
                                  :description="item.approvedResult === undefined ? '待审批':item.approvedResult"
                                />
                              </el-steps>
                              <div v-if="tempComment !== undefined && tempComment !== null ">
                                <b style="color: red">*状态</b>:“已废止”说明申请被驳回
                                <br>
                                <b style="color: red">*原因:</b>{{ tempComment }}
                              </div>
                              <div v-if="form.localStorageTemp.approvalStatus !== 'approved'">
                                <b style="color: red">*当前审批人:</b>{{ currApproverName }}
                                <div v-if="form.localStorageTemp.approvalStatus === 'waitingfor' ">
                                  <b style="color: red">*已等待时长:</b>{{ waitingTempTime }}<br>
                                  <b style="color: red">
                                    <el-button :loading="sendLoading" @click="sendEmail"><i
                                      class="el-icon-message-solid"
                                    />发送邮件提醒{{
                                      currTempApproverName
                                    }}
                                    </el-button>
                                  </b>
                                </div>
                              </div>
                              <div v-if="form.localStorageTemp.approvalStatus === 'approved'">
                                <b style="color: red">*当前审批已完成，最后审批人:</b>{{ currApproverName }}
                              </div>
                            </div>
                            <i class="el-icon-question" />
                            <el-select
                              v-model="form.localStorageTemp.approvalStatus"
                              style="background: none;"
                              disabled
                              :class="diffApprovalStatus"
                            >
                              <el-option
                                v-for="item in dict.approval_status"
                                :key="item.id"
                                :label="item.label"
                                :value="item.value"
                              />
                            </el-select>
                          </el-tooltip>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col>
                        <el-form-item label="文件描述" prop="fileDesc">
                          <el-input
                            v-model="form.localStorageTemp.fileDesc"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 10}"
                            placeholder="请输入文件内容描述"
                            style="width: 400px;"
                            disabled
                            :class="diffFileDesc"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- 关联参考文件 -->
                    <el-form-item label="参考文件" prop="bindFiles">
                      <el-select
                        v-model="bindTempFileDatas"
                        style="width: 400px"
                        multiple
                        filterable
                        placeholder="请选择"
                        disabled
                        :class="diffBindFiles"
                      >
                        <el-option
                          v-for="item in bindFiles"
                          :key="item.name"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="bindTempFileDatas.length>0" label="参考文件列表" prop="bindFiles">
                      <div
                        v-for="(item,index) in bindTempFileItems"
                        :key="item.id"
                        style="margin-left: 5px;"
                      >
                        <a :class="diffBindFileList">
                          {{ '[' + (index + 1) + '] ' + item.name + ',' + item.version }}
                        </a>
                      </div>
                    </el-form-item>
                    <el-form-item label="变更说明" prop="changeDesc" required>
                      <el-input
                        v-model="form.localStorageTemp.changeDesc"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 30}"
                        placeholder="请输入变更说明"
                        style="width: 400px;"
                        disabled
                      />
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </el-dialog>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-dialog
              title="提示"
              :visible.sync="centerDialogVisible"
              width="30%"
              center
              :modal="false"
              :modal-append-to-body="false"
              top="20%"
            >
              <span>检测到有新的改版操作，不保存相关修改吗？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">再想想</el-button>
                <el-button type="primary" @click="abandonModify">放弃修改</el-button>
              </span>
            </el-dialog>
            <el-button type="text" @click="cancelOperation">取消</el-button>
            <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
            <el-button v-else :loading="crud.status.cu === 2" type="primary" @click="submitConfirm">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%;"
          :row-key="getRowKeys"
          :default-sort="{prop: 'createTime', order: 'descending'}"
          @selection-change="crud.selectionChangeHandler"
          @row-dblclick="dbSelected"
          @row-click="stepsListRowClick"
        >
          <el-table-column :selectable="checkboxT" :reserve-selection="true" type="selection" width="55" />
          <el-table-column prop="name" label="文件名">
            <template slot-scope="scope">
              <el-popover
                :content="'file/' + scope.row.type + '/' + scope.row.realName"
                placement="top-start"
                title="路径"
                width="200"
                trigger="hover"
              >
                <!--可下载文件-->
                <a
                  v-if="isAdmin || scope.row.fileStatus !== 'obsolete' "
                  slot="reference"
                  :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                  class="el-link--primary"
                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                  target="_blank"
                  :download="scope.row.realName"
                >
                  {{ scope.row.name }}
                </a>
                <!--不下载文件-->
                <a
                  v-else
                  slot="reference"
                  class="el-link--primary"
                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #808080;font-size: 13px;"
                  target="_blank"
                  :download="scope.row.realName"
                >
                  {{ scope.row.name }}
                </a>
                <!--自定义指令下载文件（包含txt、jpg等，但chrome浏览器不支持）-->
                <!--                                <span
                                                  style="text-decoration: underline"
                                                  slot="reference"
                                                  v-download="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                                                >
                                                                  {{ scope.row.name }}
                                                                </span>-->
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="path" label="预览图">
            <template slot-scope="{row}">
              <el-image
                :src=" baseApi + '/file/' + row.type + '/' + row.realName"
                :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
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
          <el-table-column prop="suffix" label="文件类型" />
          <el-table-column prop="type" label="类别" />
          <el-table-column prop="size" label="大小" />
          <el-table-column prop="createBy" label="创建者" />
          <el-table-column prop="version" label="版本号" />
          <el-table-column :show-overflow-tooltip="true" prop="fileLevel" label="文件等级">
            <template slot-scope="scope">
              <div>{{ scope.row.fileLevel.name }}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="fileCategory" label="文件分类">
            <template slot-scope="scope">
              <div>{{ scope.row.fileCategory.name }}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="fileDept" label="所属部门">
            <template slot-scope="scope">
              <div>{{ scope.row.fileDept.name }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="fileStatus" label="文件状态" width="100" :formatter="fileStatusFormat" />
          <el-table-column prop="approvalStatus" label="审批状态" width="100" :formatter="approvalStatusFormat" />
          <el-table-column prop="fileType" label="文件用途" width="100" :formatter="fileTypeFormat" />
          <el-table-column prop="createTime" label="创建日期" width="180" sortable />
          <el-table-column prop="updateTime" label="最近修改" width="180" />
          <el-table-column
            v-if="checkPer(['admin','storage:edit','storage:del'])"
            label="操作"
            width="115"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
              />
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudFile, {
  cancelCover,
  getAllAvailFiles,
  getFilesByIds,
  getLatestAppProcess,
  getOtherFiles,
  getPreTrailByFileId,
  getPreTrailByFileTempId,
  rollbackCover
} from '@/api/tools/localStorage'
import { getFileLevels, getFileLevelSuperior } from '@/api/tools/filelevel'
import { getFileCategories, getFileCategorySuperior } from '@/api/tools/filecategory'
import { getDepts, getDeptSuperior, getDeptTree } from '@/api/system/dept'
import { getApprovers } from '@/api/system/user'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect, { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getToken } from '@/utils/auth'
import { edit } from '@/api/system/toolsTask'
import { editApprovalProcess } from '@/api/system/approvalProcess'
import Date from '@/utils/datetime'
import { send } from '@/api/tools/email'
import { judgeArrIsEqual, judgeIsEqual, validIsNotNull } from '@/utils/validationUtil'

let bindingFiles = []
let bindingDepts = []
const ids = []
const defaultForm = {
  id: null,
  version: 'A/0',
  name: '',
  realName: '',
  fileStatus: 'release',
  approvalStatus: '',
  fileType: '--none--',
  securityLevel: 'internal',
  isRevision: 'false',
  fileLevel: { id: null },
  expirationTime: '9999-12-31 00:00:00.152',
  changeDesc: '',
  fileDesc: '',
  fileCategory: { id: null },
  fileDept: { id: null },
  bindFiles: [],
  bindDepts: [],
  superiorId: null,
  localStorageTemp: null
}
export default {
  name: 'File',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['file_status', 'approval_status', 'common_status', 'file_type', 'file_security', 'file_version'],
  data() {
    return {
      refFileVersions: [],
      newVersion: 'A/1',
      verSort: 99,
      newVerList: [],
      verPrefix: 'A',
      minVerNo: 1,
      verNo: 0,
      selectVisible: false,
      isAdmin: false,
      sendLoading: false,
      editFormChanged: 0, // 是否修改标识
      preForm: this.form,
      centerDialogVisible: false,
      count: 0,
      sum: 0,
      coverFileCount: 0,
      rollbackData: {
        lastModifiedDate: null, // 抓取开始编辑的事件以便版本回滚
        approvalStatus: null,
        fileStatus: null,
        storageId: null
      },
      haveFileCount: 0, // 检测有无上传文件
      fileType: null, // 文件类型，监听使用
      fileStatus: null, // 文件状态，监听使用
      approvalStatus: null, // 审批状态，监听使用
      name: null, // 文件名称，监听使用
      fileDept: { id: null }, // 所属部门，监听使用
      fileLevel: { id: null }, // 文件等级，监听使用
      bindDatas: [], // 关联文件，监听使用
      deptDatas: [], // 开放部门，监听使用
      fileDesc: '', // 文件描述，监听使用
      securityLevel: null, // 安全等级
      approveBy: null, // 审批者，监听使用
      delAllLoading: false,
      loading: false,
      height: document.documentElement.clientHeight - 180 + 'px;',
      fileLevelName: '',
      fileCategoryName: '',
      fileCategory: { id: null }, // 文件分类，监听使用
      fileLevels: [], // 文件等级信息
      fileDepts: [], // 文件所属部门信息
      fileCategories: [], // 文件分类信息
      fileTempLevels: [], // 文件临时等级信息
      fileTempDepts: [], // 文件临时所属部门信息
      fileTempCategories: [], // 文件临时分类信息
      fileLevelDatas: [],
      fileCategoryDatas: [],
      fileTypes: [],
      bindFileDatas: [], // 关联文件列表
      bindTempFileDatas: [], // 关联临时文件列表
      bindFiles: [],
      bindDeptDatas: [],
      bindTempDeptDatas: [],
      bindDepts: [],
      bindFileItems: [],
      bindTempFileItems: [],
      fileId: null,
      preTrail: {},
      pickerOptions: {
        shortcuts: [{
          text: '一天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '三天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '两周',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 14)
            picker.$emit('pick', date)
          }
        }, {
          text: '三十天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }]
      },
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      headers: { 'Authorization': getToken() },
      permission: {
        add: ['admin', 'storage:add'],
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      enabledTypeOptions: [
        { key: 'approved', display_name: '已审批' },
        { key: 'waitingfor', display_name: '待审批' },
        { key: 'approve', display_name: '审批' },
        { key: 'obsoleted', display_name: '已作废' }
      ],
      superiors: [],
      isDone: false,
      uploadCoverFile: '',
      comment: null,
      tempComment: null,
      taskCount: 1,
      taskTempCount: 1,
      currApprover: null, // 当前审批人信息
      currApproverName: null, // 当前审批人姓名
      currTempApprover: null, // 当前审批人信息
      currTempApproverName: null, // 当前审批人姓名
      currCreateName: null, // 当前任务发起者
      params: {},
      approvalProcessList: [],
      waitingTime: '',
      approvalProcessTempList: [],
      waitingTempTime: '',
      topFileLevelId: null,
      emailForm: {
        subject: '',
        tos: [],
        content: '',
        isAdminSend: false
      },
      allDepts: [],
      TempDialogVisible: false,
      temp: null,
      diffName: 'common',
      diffVersion: 'common',
      diffLevel: 'common',
      diffCategory: 'common',
      diffDepart: 'common',
      diffYt: 'common',
      diffFileStatus: 'common',
      diffExpTime: 'common',
      diffApprovalStatus: 'common',
      diffFileDesc: 'common',
      diffBindFileList: 'common',
      diffSecurityLevel: 'commonSecurityLevel',
      diffBindDeptList: 'commonBindDeptList',
      diffStyle: null,
      diffBindFiles: []
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'fileUploadApi',
      'fileCoverUploadApi'
    ])
  },
  watch: {
    count: {
      handler(val, oldVal) {
        if (val !== oldVal && val !== 1) {
          this.sum++
        }
      },
      deep: true
    }
  },
  created() {
    this.crud.msg.add = '新增成功，默认密码：123456'
    const Inp = document.getElementsByTagName('input')
    for (let i = 0; i < Inp.length; i++) {
      Inp[i].style.backgroundColor = '#FFFFFF'
    }
    this.isAdmin = this.user.isAdmin
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
    this.getFileCategoryDatas()
    this.getFileCategories()
    this.getFileDepts()
    this.getTopDept()
    //
    this.refFileVersions = this.loadAll()
    if (this.$route.query.fileId !== undefined) {
      this.query.fileId = this.$route.query.fileId
      this.crud.toQuery()
    }
    // 详情返回列表中某一列处于命中状态
    if (this.$route.query.blurry !== undefined) {
      this.query.blurry = this.$route.query.blurry
      // this.crud.toQuery()
      // 刷新表格
      // this.crud.attchTable()
    }
    // 文件类型
    if (this.$route.query.fileType !== undefined) {
      this.query.fileType = this.$route.query.fileType
      this.crud.toQuery()
    }
    // 部门跳转--管理员时候则直接传值，如果不是则需要转为权限内的部门
    if (this.$route.query.deptId !== undefined) {
      this.query.deptId = this.$route.query.deptId
      this.crud.toQuery()
    }
    // 创建事件范围
    if (this.$route.query.createTime !== undefined) {
      // alert(this.$route.query.createTime)
      const startTime = this.$route.query.createTime + ' 00:00:00'
      const endTime = this.$route.query.createTime + ' 23:59:59'
      this.query.createTime = [startTime, endTime]
      this.crud.toQuery()
    }
    // 文件等级名称
    if (this.$route.query.fileLevelName !== undefined) {
      this.fileLevelName = this.$route.query.fileLevelName
      const data = { id: null }
      data.id = this.$route.query.fileLevelId
      // 展开对应的文件级别
      this.handleLevelNodeClick(data)
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.refFileVersions
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return this.dict.file_version
    },
    // 展开添加自定义版本号
    showInput() {
      this.selectVisible = true
      this.$nextTick(_ => {
        this.$refs.addVersionInput.focus()
      })
    },
    // 新增时候自定义文件的版本号
    inputConfirm() {
      this.form.version = this.verPrefix + '/' + this.verNo
      this.selectVisible = false
    },
    // 版本前缀变更
    handleVerPrefix: function(v) {
      const prefix = this.form.version.substring(0, this.form.version.lastIndexOf('/'))
      const no = this.form.version.substring(this.form.version.lastIndexOf('/') + 1, this.form.version.length)
      // alert(no)
      if (prefix === v) {
        this.minVerNo = parseInt(no) + 1
        this.verNo = this.verNo > (parseInt(no) + 1) ? this.verNo : (parseInt(no) + 1)
      } else {
        this.minVerNo = 0
      }
    },
    // 升版时候自定义文件的版本号
    inputNewVerConfirm() {
      this.newVersion = this.verPrefix + '/' + this.verNo
      this.selectVisible = false
    },
    // 选中时候判断是否拥有创建Level 1文件的权限(非管理员无权创建第一级别的文件）
    disFileLevel(val) {
      if (!this.isAdmin && (val.pid === null || val.pid === undefined)) {
        this.topFileLevelId = val.id
        this.$message({
          message: 'No Access!不具备创建一级文件的权限!',
          type: 'warning'
        })
      }
    },
    // 获取所在公司的部门树结构
    getTopDept() {
      getDeptTree().then(res => {
        this.allDepts = res.content
      })
    },
    // 指定可查看部门变化监控
    bindDeptsChange(val) {
      // alert(JSON.stringify(val))
      bindingDepts = []
      const _this = this
      val.forEach(function(data, index) {
        const bind = { storageId: _this.fileId, deptId: data }
        bindingDepts.push(bind)
      })
      // alert(JSON.stringify(this.form.bindDepts))
    },
    // 文件状态格式化处理
    fileStatusFormat(row, column, cellValue) {
      if (row.fileStatus === 'temp') {
        return '临时文件'
      } else if (row.fileStatus === 'draft') {
        return '草稿'
      } else if (row.fileStatus === 'obsolete') {
        return '报废文件'
      } else if (row.fileStatus === 'release') {
        return '正式文件'
      }
    },
    // 审核状态格式化处理
    approvalStatusFormat(row, column, cellValue) {
      if (row.approvalStatus === 'approved') {
        return '已审批'
      } else if (row.approvalStatus === 'waitingfor') {
        return '待审批'
      } else if (row.approvalStatus === 'obsoleted') {
        return '已废止'
      }
    },
    // 文件用途格式化处理
    fileTypeFormat(row, column, cellValue) {
      if (row.fileType === 'policy') {
        return '政策'
      } else if (row.fileType === 'manual') {
        return '手册'
      } else if (row.fileType === 'standard') {
        return '标准'
      } else if (row.fileType === 'instructions') {
        return '说明书'
      } else if (row.fileType === 'templates') {
        return '模板'
      } else if (row.fileType === 'others') {
        return '其他'
      } else {
        return '---'
      }
    },
    // 发起申请，投递邮件
    sendEmail() {
      this.sendLoading = true
      this.emailForm.subject = '文件审批申请，望尽快处理'
      this.emailForm.content = '<p>任务主题：' + this.preTrail.changeDesc + '</p>' +
        '<p>任务发起人：' + this.preTrail.createBy + '</p>' +
        '<p>任务编号：' + this.preTrail.preTrailNo + '</p>'
      // 获取当前审批人的邮箱
      this.emailForm.tos.push(this.currApprover.email)
      // 发送邮件
      send(this.emailForm).then(res => {
        this.$notify({
          title: '提醒邮件已成功送达',
          type: 'success',
          duration: 1000
        })
        this.sendLoading = false
      }).catch(err => {
        this.sendLoading = false
        console.log(err.response.data.message)
      })
    },
    // 编辑后保存确认校验
    submitConfirm() {
      // 发起改版但未上传覆盖文件
      if (this.form.isRevision === 'true' && this.coverFileCount < 1) {
        this.$message({
          message: 'Revision needs new file for this !改版须提交新文件或取消改版',
          type: 'warning'
        })
        return false
      }
      // 如果啥都没改动，则无需保存
      this.watchChangeHandler(this.fileCategory.id, this.form.fileCategory.id) // 文件分类，监听使用
      this.watchChangeHandler(this.fileType, this.form.fileType) // 文件类型，监听使用
      this.watchChangeHandler(this.fileStatus, this.form.fileStatus) // 文件状态，监听使用
      this.watchChangeHandler(this.approvalStatus, this.form.approvalStatus) // 文件审批状态，监听使用
      this.watchChangeHandler(this.name, this.form.name) // 文件名称，监听使用
      this.watchChangeHandler(this.fileDept.id, this.form.fileDept.id) // 所属部门，监听使用
      this.watchChangeHandler(this.fileLevel.id, this.form.fileLevel.id) // 文件等级，监听使用
      this.watchChangeHandler(this.bindDatas, this.bindFileDatas) // 关联文件，监听使用
      this.watchChangeHandler(this.deptDatas, this.bindDeptDatas) // 关联文件，监听使用
      this.watchChangeHandler(this.fileDesc, this.form.fileDesc) // 文件描述，监听使用
      this.watchChangeHandler(this.securityLevel, this.form.securityLevel) // 安全等级，监听使用
      this.watchChangeHandler(this.approveBy, this.form.superiorId) // 当前审批人，监听使用
      if (this.editFormChanged === 0) {
        this.$message({
          message: 'No changes found, no need to save!未发生改动，无需保存',
          type: 'warning'
        })
        return false
      } else {
        if (!validIsNotNull(this.form.changeDesc)) {
          this.$message({
            message: 'Some changes found, must add ChangeDesc! 内容发生变化，请据实填写变更说明',
            type: 'warning'
          })
          return false
        }
      }
      // 如果出于审批状态，则审批者不可为空
      if (this.form.approvalStatus === 'waitingfor' &&
        (this.form.superiorId === null || this.form.superiorId === undefined || this.form.superiorId === '')) {
        this.$message({
          message: 'Approver needed! 审批状态下必须有审批者',
          type: 'warning'
        })
        return false
      }

      // 一级文件权限把控
      if (!this.$store.getters.user.isAdmin && (this.form.fileLevel.id === this.topFileLevelId)) {
        this.$message({
          message: 'No Access!不具备创建一级文件的权限!',
          type: 'warning'
        })
      }
      this.crud.submitCU()

      // alert('原审批者：' + this.approveBy + '-------现审批者：' + this.form.superiorId)
      // 原审批者和现审批者不一致则需要更改成审批流程和任务信息
      // alert(JSON.stringify(this.form.superiorId))
      if (this.form.superiorId !== this.approveBy &&
        validIsNotNull(this.form.superiorId)) {
        // 更新任务信息
        // alert(JSON.stringify(this.form.superiorId))
        this.preTrail.approvedBy = this.form.superiorId
        // alert(JSON.stringify(this.preTrail))
        this.updateApprover(this.preTrail)
        // 更新审批进度信息
        const process = this.approvalProcessList[0]
        process.approvedResult = null
        process.approvedBy = this.form.superiorId
        this.updateAppProcess(process)
      }

      setTimeout(() => {
        this.$router.replace({
          path: '/redirect/fileManagement/file'
        })
      }, 1000)
      // this.crud.resetQuery()
    },
    // 更新任务信息
    updateApprover(data) {
      edit(data).then(res => {
        // alert("更新审批者成功")
      })
    },
    // 更新任务对应的审批进度信息
    updateAppProcess(data) {
      // 更新审批进度信息
      editApprovalProcess(data).then(res => {
        // alert("更新审批信息成功")
      })
    },
    getRowKeys(row) {
      // 指定id传值选中
      return row.id
    },
    // 监控模糊查询输入框变化，强制刷新
    inputChange() {
      this.$forceUpdate()
    },
    // 监控变更记录输入框变化，强制刷新
    changeDescInput() {
      this.$forceUpdate()
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
    },
    // 获取左侧文件级别数据
    getFileLevelDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getFileLevels(params).then(res => {
          // this.topFileLevelId = val.id
          if (resolve) {
            resolve(res.content)
          } else {
            this.fileLevelDatas = res.content
          }
        })
      }, 100)
    },
    // 获取左侧文件分类数据
    getFileCategoryDatas(node, resolve) {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      setTimeout(() => {
        getFileCategories(params).then(res => {
          if (resolve) {
            resolve(res.content)
          } else {
            this.fileCategoryDatas = res.content
          }
        })
      }, 100)
    },
    // 变更绑定项
    changeBindFile(value) {
      // alert(JSON.stringify(value))
      bindingFiles = []
      const _this = this
      value.forEach(function(data, index) {
        const file = { storageId: _this.fileId, bindingStorageId: data }
        bindingFiles.push(file)
      })
      this.getFilesByIds(value)
      // alert('编辑添加的内容：' + JSON.stringify(bindingFiles))
    },
    // 删除绑定项
    deleteTag(value) {
      bindingFiles.forEach(function(data, index) {
        if (data.id === value) {
          bindingFiles.splice(index, value)
        }
      })
      if (bindingFiles.length === 0) {
        this.bindFileItems = []
      } else {
        // 重新抓取绑定文件
        const data = []
        for (const i in bindingFiles) {
          data.push(bindingFiles[i].bindingStorageId)
        }
        // alert(JSON.stringify(data))
        this.getFilesByIds(data)
      }
      // alert(JSON.stringify(bindingFiles))
    },
    // 取消前检测是否存在覆盖文件的编辑操作
    cancelOperation() {
      // coverFileCount监控是否发生了覆盖事件
      if (this.coverFileCount > 0) {
        this.centerDialogVisible = true
      } else {
        this.crud.cancelCU()
        this.$router.replace({
          path: '/redirect/fileManagement/file'
        })
      }
    },
    // 回滚文件覆盖操作，状态返回到编辑前的状态和待审批的数据
    abandonModify() {
      // 删除之后所有的数据，并根据时间抓取编辑前的数据作为恢复依据
      this.rollbackData.storageId = this.form.id
      // alert(JSON.stringify(this.rollbackData))
      rollbackCover(this.rollbackData).then(res => {
        // 不提示撤销信息
        // this.crud.notify('rollback cover Success! 撤销覆盖操作成功！', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.centerDialogVisible = false
      })
      this.crud.cancelCU()
    },
    // 新增与编辑之后做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id == null) {
        this.getFileLevels()
        this.getFileCategories()
        this.getFileDepts()
        this.getAllFiles()
      } else {
        this.getSupFileLevels(form.fileLevel.id)
        this.getSupFileCategories(form.fileCategory.id)
        this.getSupFileDepts(form.fileDept.id)
        if (form.localStorageTemp) {
          this.getSupTempFileLevels(form.localStorageTemp.fileLevel.id)
          this.getSupTempFileCategories(form.localStorageTemp.fileCategory.id)
          this.getSupTempFileDepts(form.localStorageTemp.fileDept.id)
        }
        // this.getFileDepts()
        this.getOtherFiles(form.id)
        this.fileId = form.id
      }
      // this.getRoleLevel()
      form.isRevision = form.isRevision.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.bindFileDatas = []
      this.bindDeptDatas = []
    },
    // 初始化编辑时候的关联文件并初始化版本升级操作计数
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // 初始化下一步版本号
      // alert(JSON.stringify(this.$store.getters.user))
      const prefix = form.version.substring(0, form.version.lastIndexOf('/'))
      const no = form.version.substring(form.version.lastIndexOf('/') + 1, form.version.length)
      // alert(no)
      if (form.approvalStatus === 'obsoleted') {
        this.minVerNo = parseInt(no)
        this.verNo = parseInt(no)
      } else {
        this.minVerNo = parseInt(no) + 1
        this.verNo = parseInt(no) + 1
      }

      this.verPrefix = prefix
      this.newVersion = this.verPrefix + '/' + this.verNo
      // alert(this.verNo)
      // alert(JSON.stringify(prefix))
      // alert(this.newVersion)
      // alert(JSON.stringify(this.dict.file_version))
      this.verSort = 99
      this.dict.file_version.forEach((data, index) => {
        // const fileVersion = { value: data.value, dictSort: data.dictSort }
        // this.newVerList.push(fileVersion)
        if (data.value === prefix) {
          this.verSort = data.dictSort
        }
      })
      // alert(JSON.stringify(this.newVerList))

      // 强制初始化覆盖文件计数为0
      this.coverFileCount = 0
      this.comment = null
      this.tempComment = null
      if (form.isRevision === 'true') {
        this.uploadCoverFile = '上传覆盖文件'
      } else if (form.approvalStatus === 'obsoleted') {
        this.uploadCoverFile = '重新上传文件'
      }
      // && this.form.fileStatus === 'draft'
      // 获取审批领导
      // 编辑前置空变更描述

      this.form.changeDesc = ''

      // 编辑前存储编辑前的可变的属性的数据信息
      this.fileCategory.id = form.fileCategory.id // 文件分类，监听使用
      this.fileType = form.fileType // 文件类型，监听使用
      this.fileStatus = form.fileStatus // 文件状态，监听使用
      this.approvalStatus = form.approvalStatus // 文件审批状态，监听使用
      this.name = form.name // 文件名称，监听使用
      this.fileDept.id = form.fileDept.id // 所属部门，监听使用
      this.fileLevel.id = form.fileLevel.id // 文件等级，监听使用
      this.fileDesc = form.fileDesc
      this.securityLevel = form.securityLevel

      // 抓取当前时间+是否改版，以作回滚用
      this.rollbackData.lastModifiedDate = new Date()
      this.rollbackData.approvalStatus = form.approvalStatus
      this.rollbackData.fileStatus = form.fileStatus
      // 查询可参考文件
      this.getOtherFiles(this.form.id)
      // 查询审批任务信息+审批进度
      // alert(form.localStorageTemp)
      if (validIsNotNull(form.localStorageTemp)) {
        this.getTempPreTrails(form.localStorageTemp.id)
      } else {
        this.getPreTrails(this.form.id)
      }
      // 查询审批进度信息
      this.getApprovalProcessRecord(this.form.id)
      this.bindFileDatas = []
      this.bindTempFileDatas = []
      this.bindDeptDatas = []
      this.bindTempDeptDatas = []
      bindingFiles = []
      bindingDepts = []
      const _this = this
      form.bindFiles.forEach(function(file, index) {
        _this.bindFileDatas.push(file.bindingStorageId)
        const fl = { storageId: _this.fileId, bindingStorageId: file.bindingStorageId }
        bindingFiles.push(fl)
      })
      form.bindDepts.forEach(function(file, index) {
        _this.bindDeptDatas.push(file.deptId)
        const fl = { storageId: _this.fileId, deptId: file.deptId }
        bindingDepts.push(fl)
      })
      // alert("提交的绑定数据："+JSON.stringify(_this.bindFileDatas))
      if (_this.bindFileDatas.length > 0) {
        this.getFilesByIds(_this.bindFileDatas)
      }
      if (form.localStorageTemp) {
        this.temp = form.localStorageTemp
        // 查询审批进度临时信息
        this.getApprovalProcessTempRecord(form.localStorageTemp.id)
        // 查询审批任务临时信息
        this.getTempPreTrails(form.localStorageTemp.id)
        if (form.localStorageTemp.bindTempFiles.length > 0) {
          const bindTempFiles = form.localStorageTemp.bindTempFiles
          bindTempFiles.forEach(function(file, index) {
            _this.bindTempFileDatas.push(file.bindingStorageId)
          })
          // alert(JSON.stringify(_this.bindTempFileDatas))
        }
        if (form.localStorageTemp.bindTempDepts.length > 0) {
          const bindTempDepts = form.localStorageTemp.bindTempDepts
          bindTempDepts.forEach(function(file, index) {
            _this.bindTempDeptDatas.push(file.deptId)
          })
          // alert(JSON.stringify(_this.bindTempFileDatas))
        }
        // 对比两者差距,设置特殊颜色
        // 名称对比
        // alert(validTwo(form.name,this.temp.name))
        if (!judgeIsEqual(form.name, _this.temp.name)) {
          _this.diffName = 'diffName'
        }
        // 版本对比
        if (!judgeIsEqual(form.version, _this.temp.version)) {
          _this.diffVersion = 'diffVersion'
        }
        // 文件等级对比
        if (form.fileLevel.id !== _this.temp.fileLevel.id) {
          _this.diffLevel = 'diffLevel'
        }
        // 文件分类对比
        if (form.fileCategory.id !== _this.temp.fileCategory.id) {
          _this.diffCategory = 'diffCategory'
        }
        // 所属部门对比
        if (form.fileDept.id !== _this.temp.fileDept.id) {
          _this.diffDepart = 'diffDepart'
        }
        // 文件用途对比
        // alert(judgeIsEqual(form.fileType,_this.temp.fileType))
        if (!judgeIsEqual(form.fileType, _this.temp.fileType)) {
          _this.diffYt = 'diffYt'
        }
        // 保密等级对比
        if (!judgeIsEqual(form.securityLevel, _this.temp.securityLevel)) {
          _this.diffSecurityLevel = 'diffSecurityLevel'
        }
        //  指定开放部门对比
        // 文件绑定对比,防止乱序，因此按照相同排序规则排序后再比对;绑定tags和绑定列表表样式两者都要一起控制
        _this.bindDeptDatas.sort(function(a, b) {
          return b - a//	降序，升序则反之
        })
        _this.bindTempDeptDatas.sort(function(a, b) {
          return b - a//	降序，升序则反之
        })
        // alert('原绑定文件：'+JSON.stringify(_this.bindDeptDatas))
        // alert('临时绑定文件：'+JSON.stringify(_this.bindTempDeptDatas))
        // alert(judgeArrIsEqual(_this.bindDeptDatas, _this.bindTempDeptDatas))
        if (!judgeArrIsEqual(_this.bindDeptDatas, _this.bindTempDeptDatas)) {
          _this.diffBindDeptList = 'diffBindDeptList'
        }
        // 文件状态对比
        if (!judgeIsEqual(form.fileStatus, _this.temp.fileStatus)) {
          _this.diffFileStatus = 'diffFileStatus'
        }
        // 文件过期时间对比
        // alert('原过期时间：'+form.expirationTime)
        // alert('现过期时间：'+_this.temp.expirationTime)
        if (!judgeIsEqual(form.expirationTime, _this.temp.expirationTime)) {
          _this.diffExpTime = 'diffExpTime'
        }
        // 审批状态对比
        if (!judgeIsEqual(form.approvalStatus, _this.temp.approvalStatus)) {
          _this.diffApprovalStatus = 'diffApprovalStatus'
        }
        // 文件描述对比
        if (!judgeIsEqual(form.fileDesc, _this.temp.fileDesc)) {
          _this.diffFileDesc = 'diffFileDesc'
        }
        // 文件绑定对比,防止乱序，因此按照相同排序规则排序后再比对;绑定tags和绑定列表表样式两者都要一起控制
        _this.bindDeptDatas.sort(function(a, b) {
          return b - a//	降序，升序则反之
        })
        _this.bindTempFileDatas.sort(function(a, b) {
          return b - a//	降序，升序则反之
        })
        // alert('原绑定文件：'+JSON.stringify(_this.bindFileDatas))
        // alert('临时绑定文件：'+JSON.stringify(_this.bindTempFileDatas))
        // alert(judgeArrIsEqual(_this.bindFileDatas, _this.bindTempFileDatas))
        if (!judgeArrIsEqual(_this.bindFileDatas, _this.bindTempFileDatas)) {
          _this.diffBindFiles = 'diffBindFiles'
          _this.diffBindFileList = 'diffBindFileList'
        }
      }

      if (_this.bindTempFileDatas.length > 0) {
        this.queryTempFilesByIds(_this.bindTempFileDatas)
      }
      // console.log('绑定项的值来源：' + JSON.stringify(form.bindFiles))
      // console.log('初始化编辑的内容：' + JSON.stringify(_this.bindFileDatas))
      _this.bindDatas = _this.bindFileDatas // 关联文件，监听使用
      _this.deptDatas = _this.bindDeptDatas // 开放部门，监听使用
      if (this.form.approvalStatus === 'waitingfor') {
        this.count = 1
      }
    },
    // 获取可选上级
    getSeniors(createBy) {
      this.superiors = []
      getApprovers({ createBy: createBy }).then(res => {
        // alert(JSON.stringify(res))
        this.superiors = res
        if (this.oldSuperiorId === '' || this.oldSuperiorId === null || this.oldSuperiorId === undefined) {
          this.form.superiorId = null
        } else {
          this.form.superiorId = this.oldSuperiorId
        }
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.isRevision === 'true' && this.$refs.coverUpload.uploadFiles.length === 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: 'Revision needs new file for this!' + ' <br/> ' + '改版须提交新文件或取消改版',
          type: 'warning'
        })
        return false
      }
      crud.form.bindFiles = bindingFiles
      crud.form.bindDepts = bindingDepts
      return true
    },
    // 上传文件
    upload() {
      // alert(this.haveFileCount)
      if (this.haveFileCount <= 0) {
        this.$message({
          message: '须上传文件',
          type: 'warning'
        })
        return false
      }
      if (!this.form.fileLevel.id) {
        this.$message({
          message: '文件等级必须设置',
          type: 'warning'
        })
        return false
      }
      if (!this.form.fileDept.id) {
        this.$message({
          message: '文件所属部门必须设置',
          type: 'warning'
        })
        return false
      }
      if (!this.form.fileCategory.id) {
        this.$message({
          message: '文件所属分类必须设置',
          type: 'warning'
        })
        return false
      }
      this.$refs.upload.submit()
    },
    cancelCover() {
      this.form.isRevision = 'false'
    },
    // 上传覆盖文件
    async cover() {
      this.$refs.coverUpload.submit()
    },
    beforeUpload: function(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      if (this.form.name === '' || this.form.name === undefined) {
        this.form.name = file.name
      }
      return isLt2M
    },
    // 删除上传的文件
    handleRemove(file) {
      this.haveFileCount--
    },
    fileChange(a) {
      this.haveFileCount++
    },
    // 改版切换时候判断是否已有审批
    agreeChange(val) {
      if (this.form.approvalStatus === 'waitingfor' && val === 'true') {
        this.$confirm('Replaced file existed! Really cancel the last submission?检测已有覆盖文件待审批，是否确认撤销上一次的提交？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 确定撤销',
          cancelButtonText: 'NO 放弃撤销'
        })
          .then(() => {
            cancelCover(this.form.id).then(res => {
              this.$message({
                type: 'info',
                message: 'Reverse 确定撤销'
              })
              this.coverFileCount++
              this.form.isRevision = 'false'
              this.form.approvalStatus = 'approved'
              this.form.changeDesc = '取消改版'
            })
          })
          .catch(action => {
            this.$message({
              type: 'info',
              message: action === 'cancel'
                ? 'Quit Cover 放弃撤销'
                : 'Reconsider 暂停留本页面，考虑一下'
            })
          })
        this.form.isRevision = 'false'
      }
    },
    beforeCover: function(file) {
      if (!file) {
        this.$message({
          message: '文件必须存在',
          type: 'warning'
        })
        return false
      }
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      // this.form.name = file.name
      return isLt2M
    },
    handleSuccess(response, file, fileList) {
      this.crud.notify('Upload Success! 上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      this.crud.toQuery()
    },
    // 覆盖成功
    coverSuccess(response, file, fileList) {
      // alert(JSON.stringify(response))
      this.coverFileCount++
      this.crud.notify('CoverFile Upload Success! 待审批覆盖文件上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      if (this.coverFileCount > 1) {
        this.form.changeDesc = '撤销上一次覆盖文件后' + '文件内容再次更新，新文件替代原文件,待审批'
      } else {
        if (this.form.approvalStatus === 'obsoleted') {
          this.form.changeDesc = '重新上传新文件，待审批'
        } else {
          this.form.changeDesc = '新文件替代原文件,文件升级版本，待审批'
        }
      }
      // 标注变化
      this.editFormChanged++
      this.form.approvalStatus = 'waitingfor'
      this.form.isRevision = 'false'
      this.preTrail = response
      this.getPreTrails(this.form.id)
      this.crud.toQuery()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      this.form.name = ''
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    // 获取弹窗内可绑定的文件数据
    getAllFiles() {
      getAllAvailFiles().then(res => {
        this.bindFiles = res.content
      }).catch(() => {
      })
    },
    // 获取文件待审批任务项
    getPreTrails(id) {
      // 获取最新的关联任务数据
      getPreTrailByFileId(id, true).then(res => {
        // 任务数目取判断进度条-判断条件：已审批/待审批/已废止
        // 获取（第一个关联任务即直系领导任务）是否已审批，已审批不允许更改第一审批者
        this.isDone = res.content[0].isDone
        this.currCreateName = res.content[0].createBy
        this.preTrail = res.content[0]
        this.getSeniors(res.content[0].createBy)
        // 获取上级领导标识
        this.form.superiorId = res.content[0].approvedBy
        // todo 判断，如果上级不术语本部门，即this.form.superiorId不在this.superiors范围，则不显示

        this.oldSuperiorId = this.form.superiorId
        this.approveBy = this.form.superiorId
        this.currApprover = res.currApprover
        if (res.currApprover !== undefined) {
          this.currApproverName = res.currApprover.username
        }
        if (res.comment !== undefined) {
          this.comment = res.comment
        }
        if (this.form.approvalStatus === 'waitingfor') {
          this.taskCount = (res.content.length - 1) < 0 ? 0 : res.content.length - 1
        } else if (this.form.approvalStatus === 'approved') {
          this.taskCount = res.content.length
        } else if (this.form.approvalStatus === 'obsoleted') {
          this.taskCount = res.content.length
        }
      })
    },
    getTempPreTrails(id) {
      // 获取最新的关联任务数据
      getPreTrailByFileTempId(id, true).then(res => {
        // alert(JSON.stringify(res.currApprover))
        // 修改项替代原项
        // 任务数目取判断进度条-判断条件：已审批/待审批/已废止
        // 获取（第一个关联任务即直系领导任务）是否已审批，已审批不允许更改第一审批者
        this.isDone = res.content[0].isDone
        this.currCreateName = res.content[0].createBy
        this.preTrail = res.content[0]
        this.getSeniors(res.content[0].createBy)
        // 获取上级领导标识
        this.form.superiorId = res.content[0].approvedBy
        // todo 判断，如果上级不术语本部门，即this.form.superiorId不在this.superiors范围，则不显示

        this.oldSuperiorId = this.form.superiorId
        this.approveBy = this.form.superiorId
        this.currApprover = res.currApprover
        if (res.currApprover !== undefined) {
          this.currApproverName = res.currApprover.username
        }
        if (res.comment !== undefined) {
          this.comment = res.comment
        }
        if (this.form.approvalStatus === 'waitingfor') {
          this.taskCount = (res.content.length - 1) < 0 ? 0 : res.content.length - 1
        } else if (this.form.approvalStatus === 'approved') {
          this.taskCount = res.content.length
        } else if (this.form.approvalStatus === 'obsoleted') {
          this.taskCount = res.content.length
        }

        // 下面为临时修改项的展示
        this.currTempApprover = res.currApprover
        if (res.currApprover !== undefined) {
          this.currTempApproverName = res.currApprover.username
        }
        if (res.comment !== undefined) {
          this.tempComment = res.comment
        }
        if (this.temp.approvalStatus === 'waitingfor') {
          this.taskTempCount = (res.content.length - 1) < 0 ? 0 : res.content.length - 1
        } else if (this.temp.approvalStatus === 'approved') {
          this.taskTempCount = res.content.length
        } else if (this.temp.approvalStatus === 'obsoleted') {
          this.taskTempCount = res.content.length
        }
      })
    },
    // 查询审批数据变化
    getApprovalProcessRecord(id) {
      this.approvalProcessList = []
      getLatestAppProcess(id).then(res => {
        // alert(JSON.stringify(res))
        this.approvalProcessList = res.content
        this.waitingTime = res.waitDuration
      })
    },
    // 查询临时审批数据变化
    getApprovalProcessTempRecord(id) {
      this.approvalProcessTempList = []
      getLatestAppProcess(id).then(res => {
        // alert(JSON.stringify(res))
        this.approvalProcessTempList = res.content
        this.waitingTempTime = res.waitDuration
      })
    },
    // 填充文件等级数据
    getFileLevels() {
      getFileLevels({ enabled: true }).then(res => {
        this.fileLevels = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 填充文件分类数据
    getFileCategories() {
      getFileCategories({ enabled: true }).then(res => {
        this.fileCategories = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 文件分类触发同时让文件用途失焦
    fileCategoryHandler() {
      this.$refs.fileType.blur()
    },
    // 填充文件所属部门数据
    getFileDepts() {
      getDepts({ enabled: true }).then(res => {
        this.fileDepts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupFileLevels(levelId) {
      getFileLevelSuperior(levelId).then(res => {
        const data = res.content
        this.buildLevels(data)
        this.fileLevels = data
      })
    },
    // 根据条件获取权限内临时文件分类树表信息
    getSupTempFileLevels(levelId) {
      getFileLevelSuperior(levelId).then(res => {
        const data = res.content
        this.buildLevels(data)
        this.fileTempLevels = data
      })
    },
    buildLevels(data) {
      data.forEach(data => {
        if (data.children) {
          this.buildLevels(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 根据条件获取权限内文件分类树表信息
    getSupFileCategories(cateId) {
      getFileCategorySuperior(cateId).then(res => {
        const data = res.content
        this.buildCategories(data)
        this.fileCategories = data
      })
    },
    // 根据条件获取权限内临时文件分类树表信息
    getSupTempFileCategories(cateId) {
      getFileCategorySuperior(cateId).then(res => {
        const data = res.content
        this.buildCategories(data)
        this.fileTempCategories = data
      })
    },
    // 构建文件分类树表
    buildCategories(data) {
      data.forEach(data => {
        if (data.children) {
          this.buildCategories(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 根据条件获取权限内部门树表信息
    getSupFileDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const data = res.content
        this.buildDepts(data)
        this.fileDepts = data
      })
    },
    // 根据条件获取权限内部门临时树表信息
    getSupTempFileDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const data = res.content
        this.buildDepts(data)
        this.fileTempDepts = data
      })
    },
    // 构建部门树表
    buildDepts(data) {
      data.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 查询可绑定项
    getOtherFiles(fileId) {
      getOtherFiles(fileId).then(res => {
        const data = res.content
        this.bindFiles = data
        // alert('编辑前看到的绑定数据标识集合：' + JSON.stringify(this.bindFiles))
      })
    },
    // 查询文件列表信息
    getFilesByIds(ids) {
      this.bindFileItems = []
      getFilesByIds(ids).then(res => {
        // console.log('绑定的数据集合:' + JSON.stringify(res))
        this.bindFileItems = res
      }).then()
    },
    // 查询文件列表临时信息
    queryTempFilesByIds(ids) {
      this.bindTempFileItems = []
      getFilesByIds(ids).then(res => {
        // console.log('绑定的数据集合:' + JSON.stringify(res))
        this.bindTempFileItems = res
      }).then()
    },
    // 获取弹窗内文件等级数据
    loadLevels({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getFileLevels({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 获取弹窗内文件分类数据
    loadCategories({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getFileCategories({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 获取弹窗内文件所属部门数据
    loadFileDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 切换文件等级
    handleLevelNodeClick(data) {
      if (data.pid === 0) {
        this.query.fileLevelId = null
      } else {
        this.query.fileLevelId = data.id
      }
      // alert(this.query.fileLevelId)
      this.crud.toQuery()
    },
    // 切换文件分类
    handleCategoryNodeClick(data) {
      if (data.pid === 0) {
        this.query.fileCategoryId = null
      } else {
        this.query.fileCategoryId = data.id
      }
      this.crud.toQuery()
    },
    // 某些列禁止改动
    checkboxT(row, rowIndex) {
      // todo 当前的user(除管理员外)与文件创建部门（大含小）不符合，只能看不能修改
      // this.$store.getters.user.isAdmin
      return row.fileLevel.id !== 1
    },
    // 单击时候选中某列
    stepsListRowClick(row, index) {
      // console.log(JSON.stringify(row))
      this.$refs.table.toggleRowSelection(row)
    },
    // 双击选中的行列
    dbSelected(row) {
      // alert(JSON.stringify(row))
      this.checkboxT(row)
      this.$router.push(
        {
          path: '/fileManagement/filedetail',
          query: {
            fileId: row.id,
            name: row.name,
            realName: row.realName,
            fileDesc: row.fileDesc
          }
        })
    },
    watchChangeHandler(val, newVal) {
      if (val !== newVal) {
        this.editFormChanged++
        // this.form.changeDesc += '改动' + this.editFormChanged + ':"' + val + '"->' + '"' + newVal + '"'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

//修改disabled的样式

.dialog > > > .is-disabled .el-input__inner {
  background-color: #ffffff;
  color: #606266;
}

::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 29px;
  line-height: 29px;
  font-size: small;
}

.el-col-left {
  border-right: 1px solid #f00;
}

.el-col-right {
  border-left: 1px solid #dcdfe6;
}

.el-radio__input.is-disabled + span.el-radio__label {
  color: #000;
}

a.router-link-exact-active {
  background-color: orange;
  color: #fff;
}

.el-form-item--small.el-form-item {
  margin-bottom: 12px;
}

.vue-treeselect__input {

}

</style>

<style scoped>
.diffName >>> .el-input__inner {
  color: #ff0000 !important;
}

.diffVersion >>> .el-input__inner {
  color: #ff0000 !important;
}

.diffLevel >>> .vue-treeselect__single-value {
  color: #ff0000 !important;
}

.diffCategory >>> .vue-treeselect__single-value {
  color: #ff0000 !important;
}

.diffDepart >>> .vue-treeselect__single-value {
  color: #ff0000 !important;
}

.diffYt >>> .is-disabled .el-input__inner {
  color: #ff0000 !important;
}

.diffSecurityLevel >>> .is-disabled.is-checked .el-radio__inner {
  border-color: #ff0000 !important;
}

.diffSecurityLevel >>> .is-disabled + span.el-radio__label {
  color: #ff0000 !important;
}

.commonSecurityLevel >>> .is-disabled + span.el-radio__label {
  color: #000 !important;
}

.diffFileStatus >>> .is-disabled .el-input__inner {
  color: #ff0000 !important;
}

.diffExpTime >>> .el-input__inner {
  color: #ff0000 !important;
}

.diffApprovalStatus >>> .is-disabled .el-input__inner {
  color: #ff0000 !important;
}

.diffFileDesc >>> .is-disabled .el-input__inner {
  color: #ff0000 !important;
}

.diffFileDesc >>> .el-textarea__inner {
  color: #ff0000 !important;
}

.diffBindFiles >>> .el-tag.el-tag--info {
  color: #ff0000 !important;
}

.diffBindFileList {
  color: #ff0000 !important;
}

.diffBindDeptList >>> .vue-treeselect__multi-value-label {
  color: #ff0000 !important;
}
::v-deep .el-collapse-item__content{
  padding-bottom: 0 !important;
}
</style>
