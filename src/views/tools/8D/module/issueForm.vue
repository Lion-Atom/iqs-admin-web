<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title === '新增问题'?crud.status.title:'审核问题 review issue'"
    width="70%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="120px"
    >
      <div v-if="crud.status.add">
        <el-row class="el-row-inline">
          <el-col :span="8">
            <el-form-item
              label="问题标题"
              prop="issueTitle"
            >
              <el-input
                v-model="form.issueTitle"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="客户名称"
              prop="customerName"
            >
              <el-input
                v-model="form.customerName"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="客户追踪码"
              prop="caNum"
            >
              <el-input
                v-model="form.caNum"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="产品料号"
              prop="partNum"
            >
              <el-input
                v-model="form.partNum"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item
              label="问题来源"
              prop="source"
            >
              <el-radio
                v-for="item in dSource"
                :key="item.value"
                v-model="form.source"
                :label="item.value"
              >
                {{ item.value }}
              </el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="紧急计划"
              prop="urgencyPlan"
            >
              <el-input
                v-model="form.urgencyPlan"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label="创建时间"
              prop="initTime"
            >
              <el-date-picker
                v-model="form.initTime"
                style="width:100%;"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="具体描述"
              prop="description"
            >
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 附件管理-->
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <template slot="label">
                <span><i style="color: red">* </i>附件列表</span>
              </template>
              <el-table
                ref="table"
                border
                v-loading="fileLoading"
                :data="form.fileList"
                style="width: 100%;margin-bottom: 10px;"
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
                <el-table-column prop="createBy" label="创建者" min-width="80"/>
                <!--   附件删除   -->
                <el-table-column
                  label="操作"
                  width="80"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-popover
                      :ref="`delIssueFile-popover-${scope.$index}`"
                      v-permission="permission.edit"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除这个附件吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="scope._self.$refs[`delIssueFile-popover-${scope.$index}`].doClose()"
                        >取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="deleteIssueFile(scope.row.id), scope._self.$refs[`delIssueFile-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="form.fileList.length < 2"
                      />
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
              <el-upload
                class="upload-demo"
                ref="upload"
                :headers="headers"
                :multiple="true"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :action="appendixUploadApi + '?issueId=' + this.bindingId + '&stepName=' + this.curStep"
                :on-error="handleError">
                <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且单文件不超过100M</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="crud.status.edit">
        <el-collapse v-model="activeNames" accordion>
          <el-collapse-item title="问题明细" name="1" class="collapse-item">
            <el-row class="el-row-inline">
              <el-col :span="8">
                <el-form-item
                  label="问题标题"
                  prop="issueTitle"
                >
                  <el-input
                    v-model="form.issueTitle"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="客户名称"
                  prop="customerName"
                >
                  <el-input
                    v-model="form.customerName"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="客户追踪码"
                  prop="caNum"
                >
                  <el-input
                    v-model="form.caNum"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="产品料号"
                  prop="partNum"
                >
                  <el-input
                    v-model="form.partNum"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item
                  label="问题来源"
                  prop="source"
                >
                  <el-radio
                    v-for="item in dSource"
                    :key="item.value"
                    v-model="form.source"
                    :label="item.value"
                  >
                    {{ item.value }}
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="紧急计划"
                  prop="urgencyPlan"
                >
                  <el-input
                    v-model="form.urgencyPlan"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="创建时间"
                  prop="initTime"
                >
                  <el-date-picker
                    v-model="form.initTime"
                    style="width:100%;"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="12:00:00"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="具体描述"
                  prop="description"
                >
                  <el-input
                    v-model="form.description"
                    type="textarea"
                    :rows="3"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 附件管理-->
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <template slot="label">
                    <span><i style="color: red">* </i>附件列表</span>
                  </template>
                  <el-table
                    ref="table"
                    border
                    v-loading="fileLoading"
                    :data="form.fileList"
                    style="width: 100%;margin-bottom: 10px;"
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
                    <el-table-column prop="createBy" label="创建者" min-width="80"/>
                    <!--   附件删除   -->
                    <el-table-column
                      label="操作"
                      width="80"
                      align="center"
                    >
                      <template slot-scope="scope">
                        <el-popover
                          :ref="`delIssueFile-popover-${scope.$index}`"
                          v-permission="permission.edit"
                          placement="top"
                          width="180"
                        >
                          <p>确定删除这个附件吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button
                              size="mini"
                              type="text"
                              @click="scope._self.$refs[`delIssueFile-popover-${scope.$index}`].doClose()"
                            >取消
                            </el-button>
                            <el-button
                              type="primary"
                              size="mini"
                              @click="deleteIssueFile(scope.row.id), scope._self.$refs[`delIssueFile-popover-${scope.$index}`].doClose()"
                            >确定
                            </el-button>
                          </div>
                          <el-button
                            slot="reference"
                            v-permission="permission.edit"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                            :disabled="form.fileList.length < 2"
                          />
                        </el-popover>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="headers"
                    :multiple="true"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :action="appendixUploadApi + '?issueId=' + this.bindingId + '&stepName=' + this.curStep"
                    :on-error="handleError">
                    <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且单文件不超过100M</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <!--审核-->
            <el-row v-if="form.status==='待审核' || form.status==='驳回'">
              <el-col :span="8">
                <el-form-item label="审批结论" prop="status">
                  <el-select
                    v-model="approveResult"
                    size="small"
                    placeholder="审批结果"
                    class="filter-item"
                    style="width: 100%"
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
              <el-col v-if="approveResult === false" :span="16">
                <el-form-item label="驳回理由" prop="reason">
                  <el-input
                    v-model="form.reason"
                    placeholder="可填写驳回理由或者修改意见等"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
          <!--审核问题-->
          <el-collapse-item v-if="approveResult === true" title="审核问题" name="2" class="collapse-item">
            <el-row class="el-row-inline">
              <el-col :span="8">
                <el-form-item
                  label="客户/供应商电话"
                  prop="phone"
                >
                  <el-input
                    v-model="form.phone"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="客户/供应商邮箱"
                  prop="email"
                >
                  <el-input
                    v-model="form.email"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="问题类型"
                  prop="type"
                >
                  <el-input
                    v-model="form.type"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="是否为重复发生"
                  prop="isRepeat"
                >
                  <el-radio-group v-model="form.isRepeat">
                    <el-radio
                      v-for="item in dEnabled"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="是否有类似问题"
                  prop="hasSimilar"
                >
                  <el-radio-group v-model="form.hasSimilar">
                    <el-radio
                      v-for="item in dEnabled"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="初步风险评估"
                  prop="initRisk"
                >
                  <el-input
                    v-model="form.initRisk"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="关联部门"
                  prop="department"
                >
                  <el-input
                    v-model="form.department"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="客户要求时间"
                  prop="customerTime"
                >
                  <el-date-picker
                    v-model="form.customerTime"
                    type="datetime"
                    style="width:100%;"
                    placeholder="选择日期时间"
                    default-time="12:00:00"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="补充其他"
                  prop="other"
                >
                  <el-input
                    v-model="form.other"
                    type="textarea"
                    :rows="3"
                    style="width:100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="执行选择"
                  prop="hasReport"
                >
                  <el-radio-group v-model="form.hasReport">
                    <el-radio
                      v-for="item in dExecute"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.value }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!--任命组长-->
                <el-form-item
                  v-if="form.hasReport==='系统8D'"
                  label="指派组长"
                  prop="leaderId"
                >
                  <el-select
                    v-model="form.leaderId"
                    placeholder="请指派组长"
                    style="width:100%;"
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
              </el-col>
              <el-col :span="8">
                <el-form-item
                  v-if="form.hasReport==='系统8D'"
                  label="是否评分"
                  prop="hasScore"
                >
                  <el-radio-group v-model="form.hasScore">
                    <el-radio
                      v-for="item in dEnabled"
                      :key="item.id"
                      :label="item.value"
                    >{{ item.label }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        :disabled="!user.isAdmin && crud.status.edit"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, {form} from '@crud/crud'
import {getAllUser} from '@/api/system/user'
import UploadFile from '@/components/UploadFile'
import {mapGetters} from 'vuex'
import {getToken} from "@/utils/auth";
import {delIssueFile, getIssueFileByExample} from "@/api/tools/issueFile";
import {getUid} from "@/api/tools/supplier";

const defaultForm = {
  id: null,
  issueTitle: null,
  customerName: null,
  caNum: null,
  partNum: null,
  source: 'external',
  urgencyPlan: null,
  initTime: null,
  description: null,
  phone: null,
  email: null,
  leaderId: null,
  type: null,
  isRepeat: null,
  hasSimilar: null,
  initRisk: null,
  department: null,
  customerTime: null,
  other: null,
  hasReport: null,
  hasScore: null,
  hasTempFile: false,
  recoverTempFile: false,
  status: null,
  reason: null,
  fileList: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    dStatus: {
      type: Array,
      required: true
    },
    dSource: {
      type: Array,
      required: true
    },
    dEnabled: {
      type: Array,
      required: true
    },
    dExecute: {
      type: Array,
      required: true
    }
  },
  components: {UploadFile},
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      editTitle: '审核问题',
      headers: {
        'Authorization': getToken()
      },
      approveResult: null,
      taskForm: {},
      rules: {
        issueTitle: [
          {required: true, message: '请输入问题标题', trigger: 'blur'}
        ],
        customerName: [
          {required: true, message: '请输入客户名', trigger: 'blur'}
        ],
        caNum: [
          {required: true, message: '请输入客户追踪码', trigger: 'blur'}
        ],
        partNum: [
          {required: true, message: '请输入产品料号', trigger: 'blur'}
        ],
        source: [
          {required: true, message: '请选择问题来源', trigger: 'blur'}
        ],
        urgencyPlan: [
          {required: true, message: '请输入紧急计划', trigger: 'blur'}
        ],
        initTime: [
          {required: true, message: '请输入创建时间', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请描述下问题具体信息', trigger: 'blur'}
        ],
        /* phone: [
          { required: true, message: '请留下电话便于联系', trigger: 'blur' }
        ],*/
        email: [
          {required: false, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请输入问题类型', trigger: 'blur'}
        ],
        isRepeat: [
          {required: true, message: '请判断是否为重复问题', trigger: 'blur'}
        ],
        hasSimilar: [
          {required: true, message: '请判断是否有类似问题', trigger: 'blur'}
        ],
        initRisk: [
          {required: true, message: '请评估风险程度', trigger: 'blur'}
        ],
        department: [
          {required: true, message: '请输入关联部门', trigger: 'blur'}
        ],
        customerTime: [
          {required: true, message: '请输入客户要求的时间截点', trigger: 'blur'}
        ],
        other: [
          {required: true, message: '请补充完整信息', trigger: 'blur'}
        ],
        hasReport: [
          {required: true, message: '请务必选择是否执行8D', trigger: 'blur'}
        ],
        leaderId: [
          {required: true, message: '请务必指派小组组长', trigger: 'blur'}
        ],
        hasScore: [
          {required: true, message: '请务必选择是否评分', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '审核结论不可为空', trigger: 'blur'}
        ],
        reason: [
          {required: true, message: '请填写驳回理由或者修改意见等', trigger: 'blur'}
        ]
      },
      fileLoading: false,
      members: [],
      activeNames: '1',
      isNeed: true,
      never: 'never',
      curStep: 'D0',
      bindingId: null,
      cond: {
        issueId: null,
        stepName: 'D0'
      },
      approveTypeOptions: [
        {key: false, display_name: '驳回'},
        {key: true, display_name: '同意'}
      ],
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'appendixUploadApi'
    ])
  },
  created() {
    this.user.isAdmin ? this.isNeed = true : this.isNeed = false
    this.user.isAdmin ? this.editTitle = '审核问题' : this.editTitle = '查看问题'
    this.getAvailableUser()
  },
  methods: {
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.bindingId = null
      getUid().then(res => {
        this.bindingId = res
      })
    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.activeNames = '1'
      // alert(JSON.stringify(form))
      if (form.status !== '待审核' && form.status !== '驳回') {
        this.approveResult = true
      } else if (form.status === '驳回') {
        this.approveResult = false
      } else {
        this.approveResult = null
      }
      this.bindingId = form.id
      // 获取设备维修确认单信息列表
      this.getIssueFilesById(form.id)
    },
    // 提交前验证
    [CRUD.HOOK.beforeSubmit](crud, form) {
      if (this.approveResult) {
        this.form.status = "待进行"
        this.form.reason = null
      } else {
        this.form.status = "驳回"
      }
    },
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.members = res.content
      })
    },
    // 获取附件
    getIssueFilesById(id) {
      // alert(issueId + "--对应步骤：--"+stepName)
      this.fileLoading = true
      this.form.fileList = []
      this.cond.issueId = id
      getIssueFileByExample(this.cond).then(res => {
        // alert(res.length)
        this.fileLoading = false
        this.form.fileList = res
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.getIssueFilesById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 600)
      this.$refs.upload.clearFiles()
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
    deleteIssueFile(id) {
      const data = []
      data.push(id)
      delIssueFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getIssueFilesById(this.bindingId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件成功!',
          type: 'error'
        })
      })
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.el-form-item--small.el-form-item {
  margin-bottom: 14px;
}
</style>
