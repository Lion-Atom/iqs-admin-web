<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img
                  :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar"
                  title="点击上传头像"
                  class="avatar"
                  @click="toggleShow"
                >
                <myUpload
                  v-model="show"
                  :headers="headers"
                  :url="updateAvatarApi"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login"/>
                  登录账号
                  <div class="user-right">{{ user.username }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1"/>
                用户昵称
                <div class="user-right">{{ user.nickName }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept"/>
                所属部门
                <div class="user-right"> {{ user.dept.name }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone"/>
                手机号码
                <div class="user-right">{{ user.phone }}</div>
              </li>
              <li>
                <svg-icon icon-class="email"/>
                用户邮箱
                <div class="user-right">{{ user.email }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq"/>
                安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码&nbsp;</a>
                  <!--                  <a @click="$refs.email.dialog = true">修改邮箱</a>-->
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户资料" name="first">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                style="margin-top: 10px;"
                size="small"
                label-width="65px"
              >
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%"/>
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;"/>
                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.gender" style="width: 178px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <!--    个人任务    -->
            <el-tab-pane :label="taskLabel" name="second">
              <!-- 工具栏 -->
              <div class="head-container">
                <div v-if="crud.props.searchToggle">
                  <el-input
                    v-model="query.blurry"
                    clearable
                    size="small"
                    placeholder="请输入你要搜索的内容"
                    style="width: 180px;"
                    class="filter-item"
                    @keyup.enter.native="crud.toQuery"
                  />
                  <date-range-picker
                    v-model="query.createTime"
                    class="date-item"
                    @change="crud.toQuery"
                    @input="changeDate($event)"
                  />
                  <el-select
                    v-if="user.isAdmin"
                    v-model="query.selfFlag"
                    clearable
                    size="small"
                    placeholder="查询范围"
                    class="filter-item"
                    style="width: 100px"
                    @change="crud.toQuery"
                    @input="changeScope($event)"
                  >
                    <el-option
                      v-for="item in scopeTypeOptions"
                      :key="item.key"
                      :label="item.display_name"
                      :value="item.key"
                    />
                  </el-select>
                  <!--任务类型-->
                  <el-select
                    v-model="query.type"
                    clearable
                    size="small"
                    placeholder="任务类型"
                    class="filter-item"
                    style="width: 100px"
                    @change="crud.toQuery"
                    @input="changeType($event)"
                  >
                    <el-option
                      v-for="item in trailTypeOptions"
                      :key="item.key"
                      :label="item.display_name"
                      :value="item.key"
                    />
                  </el-select>
                  <!--审批状态-->
                  <el-select
                    v-model="query.isDone"
                    clearable
                    size="small"
                    placeholder="审批状态"
                    class="filter-item"
                    style="width: 100px"
                    @change="crud.toQuery"
                    @input="changeStatus($event)"
                  >
                    <el-option
                      v-for="item in enabledTypeOptions"
                      :key="item.key"
                      :label="item.display_name"
                      :value="item.key"
                    />
                  </el-select>
                  <el-select
                    v-if="query.isDone"
                    v-model="query.approveResult"
                    clearable
                    size="small"
                    placeholder="审批结论"
                    class="filter-item"
                    style="width: 100px"
                    @change="crud.toQuery"
                    @input="changeResult($event)"
                  >
                    <el-option
                      v-for="item in resultTypeOptions"
                      :key="item.key"
                      :label="item.display_name"
                      :value="item.key"
                    />
                  </el-select>
                  <rrOperation/>
                </div>
                <crudOperation>
                  <el-button
                    slot="left"
                    class="filter-item"
                    type="danger"
                    icon="el-icon-thumb"
                    size="mini"
                    :loading="crud.loading"
                    :disabled="crud.selections.length === 0"
                    @click="batchApprove(crud.selections)"
                  >
                    审批
                  </el-button>
                </crudOperation>
              </div>
              <!-- 任务列表 -->
              <div>
                <!--审批任务-->
                <el-dialog
                  append-to-body
                  class="taskDialog"
                  :title="taskForm.isDone? '查看任务' : '审核任务'"
                  :visible.sync="dialogFormVisible"
                >
                  <el-form ref="taskForm" :model="taskForm" size="small" :label-width="formLabelWidth">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="任务名称">
                          <el-input v-model="taskForm.changeDesc" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="任务单号">
                          <el-input v-model="taskForm.preTrailNo" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="任务发起人">
                          <el-input v-model="taskForm.ownerName" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="审批对象">
                          <el-input v-model="taskForm.storageName" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="对象类型">
                          <el-input v-model="taskForm.type" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="taskForm.type !== '8D'">
                      <el-col :span="12">
                        <el-form-item label="对象版本">
                          <el-input v-model="taskForm.version" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="对象大小">
                          <el-input v-model="taskForm.size" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="taskForm.type !== '8D'">
                      <el-col :span="12">
                        <el-form-item label="最近更新人">
                          <el-input v-model="taskForm.updateBy" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="对象大小">
                          <el-input v-model="taskForm.size" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="taskForm.type === '文件'">
                      <el-col :span="23">
                        <el-form-item label="对象位置">
                          <el-input v-model="taskForm.tarPath" disabled/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="1">
                        <!--文件下载-->
                        <a
                          :href="baseApi + '/file/' + taskForm.fileType + '/' + taskForm.realName"
                          class="el-link--primary"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;"
                        >
                          <i style="line-height:1.5;font-size: 24px;" class="el-icon-download"/>
                        </a>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col v-if="taskForm.type === '文件'" :span="12">
                        <el-form-item label="审批结论" required>
                          <el-select
                            v-model="taskForm.approveResult"
                            size="small"
                            placeholder="审批结果"
                            class="filter-item"
                            style="width: 120px"
                            :disabled="isHavResult"
                            @change="resultHandler"
                          >
                            <el-option
                              v-for="item in approveTypeOptions"
                              :key="item.key"
                              :label="item.display_name"
                              :value="item.key"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item v-if="taskForm.isDone" label="完成时间">
                          <el-input v-model="taskForm.updateTime" disabled/>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="taskForm.type === '文件' && taskForm.approveResult === false ">
                      <el-col :span="24">
                        <el-form-item label="驳回理由" required>
                          <el-input
                            v-model="taskForm.comment"
                            placeholder="可填写驳回理由或者修改意见等"
                            :disabled="taskForm.isDone"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div v-if="!taskForm.isDone && taskForm.type !== '8D'" slot="footer" class="dialog-footer">
                    <el-button @click="cancelApprove">取 消</el-button>
                    <el-button type="primary" @click="submitApprove(taskForm)">提交</el-button>
                  </div>
                  <div v-if="taskForm.type === '8D'">
                    <el-form
                      ref="issueForm"
                      :model="issueForm"
                      :rules="issueRules"
                      size="small"
                      label-width="160px"
                    >
                      <el-collapse v-model="activeNames" accordion>
                        <el-collapse-item title="问题明细" name="1" class="collapse-item">
                          <el-form-item
                            label="问题标题"
                            prop="issueTitle"
                          >
                            <el-input
                              v-model="issueForm.issueTitle"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="客户名"
                            prop="customerName"
                          >
                            <el-input
                              v-model="issueForm.customerName"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="客户追踪码"
                            prop="caNum"
                          >
                            <el-input
                              v-model="issueForm.caNum"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="产品料号"
                            prop="partNum"
                          >
                            <el-input
                              v-model="issueForm.partNum"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="问题来源"
                            prop="source"
                          >
                            <el-radio
                              v-for="item in dict.d_source"
                              :key="item.value"
                              v-model="issueForm.source"
                              :label="item.value"
                            >
                              {{ item.value }}
                            </el-radio>
                          </el-form-item>
                          <el-form-item
                            label="紧急计划"
                            prop="urgencyPlan"
                          >
                            <el-input
                              v-model="issueForm.urgencyPlan"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="创建时间"
                            prop="initTime"
                          >
                            <el-date-picker
                              v-model="issueForm.initTime"
                              style="width: 370px;"
                              type="datetime"
                              placeholder="选择日期时间"
                              default-time="12:00:00"
                            />
                          </el-form-item>
                          <el-form-item
                            label="具体描述"
                            prop="description"
                          >
                            <el-input
                              v-model="issueForm.description"
                              type="textarea"
                              :rows="3"
                              style="width: 370px;"
                            />
                          </el-form-item>
                        </el-collapse-item>
                        <!--审核问题-->
                        <el-collapse-item title="审核问题" name="2" class="collapse-item">
                          <el-form-item
                            label="客户/供应商联系电话"
                            prop="phone"
                          >
                            <el-input
                              v-model="issueForm.phone"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="客户/供应商邮箱"
                            prop="email"
                          >
                            <el-input
                              v-model="issueForm.email"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="问题类型"
                            prop="type"
                          >
                            <el-input
                              v-model="issueForm.type"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="是否为重复发生问题"
                            prop="isRepeat"
                          >
                            <el-radio-group v-model="issueForm.isRepeat">
                              <el-radio
                                v-for="item in dict.common_status"
                                :key="item.id"
                                :label="item.value"
                              >{{ item.label }}
                              </el-radio>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item
                            label="是否有类似问题"
                            prop="hasSimilar"
                          >
                            <el-radio-group v-model="issueForm.hasSimilar">
                              <el-radio
                                v-for="item in dict.common_status"
                                :key="item.id"
                                :label="item.value"
                              >{{ item.label }}
                              </el-radio>
                            </el-radio-group>
                          </el-form-item>
                          <el-form-item
                            label="初步风险评估"
                            prop="initRisk"
                          >
                            <el-input
                              v-model="issueForm.initRisk"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="关联部门"
                            prop="department"
                          >
                            <el-input
                              v-model="issueForm.department"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="客户要求时间"
                            prop="customerTime"
                          >
                            <el-date-picker
                              v-model="issueForm.customerTime"
                              type="datetime"
                              style="width: 370px;"
                              placeholder="选择日期时间"
                              default-time="12:00:00"
                            />
                          </el-form-item>
                          <el-form-item
                            label="其他"
                            prop="other"
                          >
                            <el-input
                              v-model="issueForm.other"
                              type="textarea"
                              :rows="3"
                              style="width: 370px;"
                            />
                          </el-form-item>
                          <el-form-item
                            label="执行选择"
                            prop="hasReport"
                          >
                            <el-radio-group v-model="issueForm.hasReport">
                              <el-radio
                                v-for="item in dict.d_execute"
                                :key="item.id"
                                :label="item.value"
                              >{{ item.value }}
                              </el-radio>
                            </el-radio-group>
                          </el-form-item>
                          <!--todo 任命组长-->
                          <el-form-item
                            v-if="issueForm.hasReport==='系统8D'"
                            label="指派组长"
                            prop="leaderId"
                          >
                            <el-select
                              v-model="issueForm.leaderId"
                              placeholder="请指派组长"
                              style="width: 370px;"
                              filterable
                            >
                              <el-option
                                v-for="item in members"
                                :key="item.id"
                                :label="item.dept.name + '-'+item.jobs[0].name + '-'+ item.username "
                                :value="item.id"
                              />
                            </el-select>
                          </el-form-item>
                          <el-form-item
                            v-if="issueForm.hasReport==='系统8D'"
                            label="是否评分"
                            prop="hasScore"
                          >
                            <el-radio-group v-model="issueForm.hasScore">
                              <el-radio
                                v-for="item in dict.common_status"
                                :key="item.id"
                                :label="item.value"
                              >{{ item.label }}
                              </el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </el-collapse-item>
                        <!--添加附件及其列表-->
                        <el-collapse-item title="附件管理" name="3" class="collapse-item">
                          <UploadFile
                            :issue-id="taskForm.storageId"
                            :permission="permission"
                            :is-need="isNeed"
                            :step-name="curStep"
                            :shadow="never"
                          />
                        </el-collapse-item>
                      </el-collapse>
                    </el-form>
                    <div
                      v-if="!taskForm.isDone && taskForm.type === '8D'"
                      slot="footer"
                      style="margin-left: 85% !important; margin-top: 10px;"
                    >
                      <el-button
                        type="text"
                        @click="cancelCu"
                      >
                        取消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="submitIssue"
                      >
                        确认
                      </el-button>
                    </div>
                  </div>
                </el-dialog>
                <!--任务审批列表-->
                <el-table
                  ref="table"
                  v-loading="crud.loading"
                  :data="crud.data"
                  :row-key="getRowKeys"
                  style="width: 100%;"
                  @selection-change="crud.selectionChangeHandler"
                  @row-dblclick="dbSelected"
                  @row-click="stepsListRowClick"
                >
                  <el-table-column :selectable="checkboxT" :reserve-selection="true" type="selection" width="55"/>
                  <el-table-column prop="storageName" label="对象名称">
                    <template slot-scope="scope">
                      <el-popover
                        placement="top-start"
                        title="审批诉求"
                        width="300"
                        trigger="hover"
                      >
                        <div>{{ scope.row.changeDesc }}</div>
                        <a
                          slot="reference"
                          :href="baseApi + '/file/' + scope.row.fileType + '/' + scope.row.realName"
                          class="el-link--primary"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                          target="_blank"
                          :download="scope.row.realName"
                        >
                          {{ scope.row.storageName }}
                        </a>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="preTrailNo" width="180" label="任务单号"/>
                  <el-table-column prop="type" label="类型"/>
                  <!--                                    <el-table-column prop="srcPath" label="原路径" />
                                    <el-table-column prop="tarPath" label="目标路径" />
                                    <el-table-column prop="version" label="目标版本号" />-->
                  <el-table-column prop="createTime" width="150" label="创建时间"/>
                  <el-table-column prop="createBy" label="创建人"/>
                  <el-table-column label="进度" :formatter="isDoneFormat"/>
                  <el-table-column label="审核结果" :formatter="approveResultFormat"/>
                  <el-table-column v-if="user.isAdmin" width="120" prop="approver" label="审核人"/>
                  <el-table-column
                    label="操作"
                    width="80"
                    align="center"
                    fixed="right"
                  >
                    <template slot-scope="scope">
                      <udApprove
                        :data="scope.row"
                        :permission="permission"
                        @func="getMsgFormSon"
                      />
                    </template>
                  </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination/>
              </div>
            </el-tab-pane>
            <!--    操作日志    -->
            <!--            <el-tab-pane label="操作日志" name="third">
                          <el-table v-loading="loading" :data="data" style="width: 100%;">
                            <el-table-column prop="description" label="行为" />
                            <el-table-column prop="requestIp" label="IP" />
                            <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源" />
                            <el-table-column prop="browser" label="浏览器" />
                            <el-table-column prop="time" label="请求耗时" align="center">
                              <template slot-scope="scope">
                                <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                                <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                                <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                              </template>
                            </el-table-column>
                            <el-table-column
                              align="right"
                            >
                              <template slot="header">
                                <div style="display:inline-block;float: right;cursor: pointer" @click="init">创建日期<i class="el-icon-refresh" style="margin-left: 40px" /></div>
                              </template>
                              <template slot-scope="scope">
                                <span>{{ scope.row.createTime }}</span>
                              </template>
                            </el-table-column>
                          </el-table>
                          &lt;!&ndash;分页组件&ndash;&gt;
                          <el-pagination
                            :total="total"
                            :current-page="page + 1"
                            style="margin-top: 8px;"
                            layout="total, prev, pager, next, sizes"
                            @size-change="sizeChange"
                            @current-change="pageChange"
                          />
                        </el-tab-pane>-->
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <updateEmail ref="email" :email="user.email"/>
    <updatePass ref="pass"/>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { mapGetters } from 'vuex'
import updatePass from './center/updatePass'
import updateEmail from './center/updateEmail'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { isvalidPhone } from '@/utils/validate'
import CRUD, { crud, header, presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udApprove from '@crud/UD.approve'
import pagination from '@crud/Pagination'
import { editUser, getAllUser } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
import crudTask, { batchSubmitTask, submitTask } from '@/api/system/toolsTask'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import UploadFile from '@/components/UploadFile'
import { edit, getIssueById } from '@/api/tools/issue'
import { validIsNotNull } from '@/utils/validationUtil'

export default {
  name: 'Center',
  components: {
    updatePass,
    updateEmail,
    myUpload,
    rrOperation,
    DateRangePicker,
    crudOperation,
    udApprove,
    pagination,
    UploadFile
  },
  cruds() {
    return CRUD({ title: '文件', url: 'api/toolsTask', crudMethod: { ...crudTask } })
  },
  mixins: [presenter(), header(), crud()],
  dicts: ['d_status', 'd_process', 'd_source', 'common_status', 'd_execute'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      show: false,
      Avatar: Avatar,
      activeName: 'second',
      saveLoading: false,
      headers: {
        'Authorization': getToken()
      },
      form: {},
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      },
      permission: {
        approve: ['admin', 'storage:edit'],
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      oldNickName: null,
      oldPhone: null,
      taskLabel: null,
      dialogFormVisible: false,
      taskForm: {},
      formLabelWidth: '100px',
      approveTypeOptions: [
        { key: false, display_name: '驳回' },
        { key: true, display_name: '同意' }
      ],
      oldResult: null,
      isHavResult: false,
      scopeTypeOptions: [
        { key: false, display_name: '全部' },
        { key: true, display_name: '本人' }
      ],
      enabledTypeOptions: [
        { key: false, display_name: '待处理' },
        { key: true, display_name: '已完成' }
      ],
      trailTypeOptions: [
        { key: '文件', display_name: '文件' },
        { key: '8D', display_name: '8D' }
      ],
      resultTypeOptions: [
        { key: true, display_name: '同意' },
        { key: false, display_name: '驳回' }
      ],
      activeNames: ['2'],
      issueForm: {},
      issueRules: {
        issueTitle: [
          { required: true, message: '请输入问题标题', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '请输入客户名', trigger: 'blur' }
        ],
        caNum: [
          { required: true, message: '请输入客户追踪码', trigger: 'blur' }
        ],
        partNum: [
          { required: true, message: '请输入产品料号', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择问题来源', trigger: 'blur' }
        ],
        urgencyPlan: [
          { required: true, message: '请输入紧急计划', trigger: 'blur' }
        ],
        initTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请描述下问题具体信息', trigger: 'blur' }
        ],
        /* phone: [
          { required: true, message: '请留下电话便于联系', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],*/
        type: [
          { required: true, message: '请输入问题类型', trigger: 'blur' }
        ],
        isRepeat: [
          { required: true, message: '请判断是否为重复问题', trigger: 'blur' }
        ],
        hasSimilar: [
          { required: true, message: '请判断是否有类似问题', trigger: 'blur' }
        ],
        initRisk: [
          { required: true, message: '请评估风险程度', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入关联部门', trigger: 'blur' }
        ],
        customerTime: [
          { required: true, message: '请输入客户要求的时间截点', trigger: 'blur' }
        ],
        other: [
          { required: true, message: '请补充完整信息', trigger: 'blur' }
        ],
        hasReport: [
          { required: true, message: '请务必选择是否执行8D', trigger: 'blur' }
        ],
        leaderId: [
          { required: true, message: '请务必指派小组组长', trigger: 'blur' }
        ],
        hasScore: [
          { required: true, message: '请务必选择是否评分', trigger: 'blur' }
        ]
      },
      members: [],
      isNeed: true,
      never: 'never',
      curStep: 'D0'
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi',
      'baseApi'
    ])
  },
  created() {
    // alert(JSON.stringify(this.$store.getters.user))
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: false
      // reset: true //reset与默认初始“待处理”冲突，节约时间暂不处理
    }
    this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone }
    store.dispatch('GetInfo').then(() => {
    })
    this.oldNickName = this.user.nickName
    this.oldPhone = this.user.phone
    if (this.user.isAdmin === true) {
      this.taskLabel = '全部任务'
    } else {
      this.taskLabel = '个人任务'
    }
    this.getAvailableUser()
  },
  mounted() {
    if (this.$route.query.createTime !== undefined) {
      // alert(this.$route.query.createTime)
      const startTime = this.$route.query.createTime + ' 00:00:00'
      const endTime = this.$route.query.createTime + ' 23:59:59'
      this.query.createTime = [startTime, endTime]
      console.log(this.query.createTime)
      this.crud.toQuery()
    }
  },
  methods: {
    // 获取子组件：udApprove传来的值
    getMsgFormSon(msg) {
      this.dialogFormVisible = msg.show
      this.taskForm = msg.data
      this.oldResult = msg.data.approveResult
      if (msg.data.type === '8D') {
        if (msg.data.isDone) {
          this.isNeed = false
        }
        this.getIssueInfoById(msg.data.storageId)
      }
      this.isHavResult = validIsNotNull(this.oldResult)
    },
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.members = res.content
      })
    },
    // 查询问题信息
    getIssueInfoById(id) {
      // alert(id)
      // alert(JSON.stringify(this.dict.common_status))
      this.issueForm = {}
      getIssueById(id).then(res => {
        this.issueForm = res
        if (validIsNotNull(this.issueForm.isRepeat)) {
          this.issueForm.isRepeat = this.issueForm.isRepeat.toString()
        }
        if (validIsNotNull(this.issueForm.hasSimilar)) {
          this.issueForm.hasSimilar = this.issueForm.hasSimilar.toString()
        }
        if (validIsNotNull(this.issueForm.hasScore)) {
          this.issueForm.hasScore = this.issueForm.hasScore.toString()
        }
      })
    },

    // 监控审批状态选择器输入变化，强制刷新
    changeDate() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控审批状态选择器输入变化，强制刷新
    changeScope() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控审批状态选择器输入变化，强制刷新
    changeStatus() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控审批状态选择器输入变化，强制刷新
    changeType() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 监控审批结论选择器输入变化，强制刷新
    changeResult() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 取消审核
    cancelCu() {
      this.dialogFormVisible = false
    },
    // 提交审核问题信息
    submitIssue() {
      // alert(JSON.stringify(this.issueForm))
      this.$refs.issueForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          edit(this.issueForm).then(res => {
            this.$message({
              message: 'Audit Issue Success! 审核成功!',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.crud.toQuery()
          })
        }
      })
    },
    // 取消审批
    cancelApprove() {
      this.taskForm.approveResult = this.oldResult
      this.dialogFormVisible = false
    },
    // 提交审批
    submitApprove(taskForm) {
      // 提交前必须判断是否添加审批结论
      if (taskForm.approveResult === undefined || taskForm.approveResult === null || taskForm.approveResult === '') {
        this.$message({
          message: 'ApproveResult must not null ! \n 必须填写审批结论方可提交',
          type: 'warning'
        })
        return false
      }
      if (taskForm.approveResult === false) {
        // alert("建议填写修改建议")
        if(!validIsNotNull(taskForm.comment)){
          this.$message({
            message: 'Comment must not null when choosing "No" ! \n 请给出驳回理由！',
            type: 'warning'
          })
          return false
        }
      }
      // alert(JSON.stringify(taskForm))
      submitTask(taskForm).then(res => {
        this.crud.notify('approve Success! 审批完成！', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.dialogFormVisible = false
        this.crud.toQuery()
        this.$refs.table.clearSelection()
      })
    },
    // 某些列禁止改动
    checkboxT(row, rowIndex) {
      // 已审核的不可被选中
      return row.approveResult === undefined && row.type !== '8D'
    },
    toggleShow() {
      this.show = !this.show
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.init()
      }
    },
    beforeInit() {
      this.url = '/api/toolsTask'
      return true
    },
    cropUploadSuccess(jsonData, field) {
      store.dispatch('GetInfo').then(() => {
      })
    },
    // 进度格式化
    isDoneFormat(row, col) {
      // alert(JSON.stringify(row))
      if (row.isDone === true) {
        return '已审批'
      } else {
        return '未审批'
      }
    },
    // 审批结果格式化
    approveResultFormat(row, col) {
      if (row.approveResult === true) {
        return '同意'
      } else if (row.approveResult === false) {
        return '驳回'
      }
    },
    // 人员信息提交
    doSubmit() {
      if (this.$refs['form']) {
        if (this.form.nickName === this.oldNickName && this.form.phone === this.oldPhone) {
          this.$message({
            message: 'No changes found, no need to save!未发生改动，无需再保存',
            type: 'warning'
          })
          return false
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            editUser(this.form).then(() => {
              this.crud.notify('Edit Success! 编辑成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
              store.dispatch('GetInfo').then(() => {
              })
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    },
    // 审批（支持批量）
    batchApprove(tasks) {
      // 批量审批
      // alert(JSON.stringify(tasks))
      batchSubmitTask(tasks).then(res => {
        this.crud.notify('approve Success! 审批完成！', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.dialogFormVisible = false
        this.crud.toQuery()
        this.$refs.table.clearSelection()
      })
    },
    // 命中选中列
    getRowKeys(row) {
      return row.id
    },
    // 单击时候选中某列
    stepsListRowClick(row) {
      // alert(JSON.stringify(row.approveResult))
      // 已审批项不可选中
      if (row.approveResult !== true && row.approveResult !== false) {
        this.$refs.table.toggleRowSelection(row)
      }
    },
    resultHandler(val) {
      if (val) {
        this.taskForm.approveResult = val
      } else {
        this.taskForm.approveResult = val
      }
    },
    // 双击选中的行列，进入审批主页
    dbSelected(row) {
      // alert(JSON.stringify(row))
      this.checkboxT(row)
      if (row.type === '文件') {
        this.$router.push(
          {
            path: '/fileManagement/filedetail',
            query: {
              fileId: row.storageId,
              name: row.storageName,
              realName: row.realName,
              fileDesc: row.fileDesc
            }
          })
      } else if (row.type === '8D') {
        this.$router.push(
          {
            path: '/8D/issue',
            query: {}
          })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

//修改disabled的样式

.taskDialog > > > .is-disabled .el-input__inner {
  background-color: #ffffff;
  color: #000000;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info {
  padding-left: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }

  .user-right {
    float: right;

    a {
      color: #317EF3;
    }
  }
}
</style>
