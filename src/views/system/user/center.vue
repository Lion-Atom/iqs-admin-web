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
                  <a @click="$refs.email.dialog = true">修改邮箱</a>
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
                <Search/>
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
                  class="dialog"
                  :title="taskForm.isDone? '查看任务' : '审核任务'"
                  :visible.sync="dialogFormVisible"
                >
                  <el-form :model="taskForm" size="small" :label-width="formLabelWidth">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="任务名称">
                          <el-input v-model="taskForm.changeDesc" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="任务发起人">
                          <el-input v-model="taskForm.createBy" disabled></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="审批对象">
                          <el-input v-model="taskForm.realName" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="对象类型">
                          <el-input v-model="taskForm.type" disabled></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="对象版本">
                          <el-input v-model="taskForm.version" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="对象大小">
                          <el-input v-model="taskForm.size" disabled></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="最近更新人">
                          <el-input v-model="taskForm.updateBy" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="对象大小">
                          <el-input v-model="taskForm.size" disabled></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="对象位置">
                          <el-input v-model="taskForm.tarPath" disabled></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="审批结论" required>
                          <el-select v-model="taskForm.approveResult" size="small" placeholder="审批结果"
                                     class="filter-item"
                                     style="width: 120px"
                                     :disabled="isHavResult"
                          >
                            <el-option v-for="item in approveTypeOptions" :key="item.key" :label="item.display_name"
                                       :value="item.key"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="审批建议">
                          <el-input v-model="taskForm.comment" :disabled="taskForm.isDone"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelApprove">取 消</el-button>
                    <el-button type="primary" @click="submitApprove(taskForm)">提交</el-button>
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
                  <el-table-column prop="realName" label="文件真实名">
                    <template slot-scope="scope">
                      <el-popover
                        :content="'file/' + scope.row.type + '/' + scope.row.realName"
                        placement="top-start"
                        title="路径"
                        width="200"
                        trigger="hover"
                      >
                        <a
                          slot="reference"
                          :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                          class="el-link--primary"
                          style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                          target="_blank"
                        >
                          {{ scope.row.realName }}
                        </a>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column width="300" prop="changeDesc" label="诉求"/>
                  <!--                                    <el-table-column prop="srcPath" label="原路径" />
                                    <el-table-column prop="tarPath" label="目标路径" />
                                    <el-table-column prop="type" label="类型" />
                                    <el-table-column prop="version" label="目标版本号" />-->
                  <el-table-column prop="createTime" width="150" label="创建时间"/>
                  <el-table-column prop="createBy" label="创建人"/>
                  <el-table-column label="进度" :formatter="isDoneFormat"/>
                  <el-table-column label="审核结果" :formatter="approveResultFormat"/>
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
import CRUD, { presenter, header, crud } from '@crud/crud'
import Search from '../../monitor/log/search'
import crudOperation from '@crud/CRUD.operation'
import udApprove from '@crud/UD.approve'
import pagination from '@crud/Pagination'
import { editUser } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
import crudTask, { submit } from '@/api/system/toolsTask'

export default {
  name: 'Center',
  components: { updatePass, updateEmail, myUpload, Search, crudOperation, udApprove, pagination },
  cruds() {
    return CRUD({ title: '文件', url: 'api/toolsTask', crudMethod: { ...crudTask } })
  },
  mixins: [presenter(), header(), crud()],
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
        approve: ['admin', 'storage:edit']
      },
      oldNickName: null,
      oldPhone: null,
      taskLabel: null,
      dialogFormVisible: false,
      taskForm: {},
      formLabelWidth: '120px',
      approveTypeOptions: [
        { key: false, display_name: '驳回' },
        { key: true, display_name: '同意' }
      ],
      oldResult: null,
      isHavResult: false
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
  },
  mounted() {
    if (this.$route.query.createTime !== undefined) {
      // alert(this.$route.query.createTime)
      const startTime = this.$route.query.createTime + ' 00:00:00'
      const endTime = this.$route.query.createTime + ' 23:59:59'
      this.query.createTime = [startTime, endTime]
      this.crud.toQuery()
    }
  },
  methods: {
    // 获取子组件：udApprove传来的值
    getMsgFormSon(msg) {
      // alert(JSON.stringify(msg.data.approveResult))
      this.dialogFormVisible = msg.show
      this.taskForm = msg.data
      this.oldResult = msg.data.approveResult
      if (this.oldResult === undefined
        || this.oldResult === ''
        || this.oldResult === null) {
        this.isHavResult = false
      } else {
        this.isHavResult = true
      }
    },
    // 取消审批
    cancelApprove() {
      this.taskForm.approveResult = this.oldResult
      this.dialogFormVisible = false
    },
    // 提交审批
    submitApprove(taskForm) {
      if (taskForm.approveResult === 'false') {
        // alert("建议填写修改建议")
      }
      // alert(JSON.stringify(taskForm))
      submit(taskForm).then(res => {
        this.crud.notify('approve Success! 审批完成！', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.dialogFormVisible = false
        this.crud.toQuery()
        this.$refs.table.clearSelection()
      })
    },
    // 某些列禁止改动
    checkboxT(row, rowIndex) {
      // 已审核的不可被选中
      return row.approveResult === undefined
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
    batchApprove(datas) {
      // todo 批量审批
      alert(JSON.stringify(datas))
      datas.foreach(function(data, index) {
        let taskForm = {}
        taskForm = data
        taskForm.approveResult = true
        alert(JSON.stringify(taskForm))
        // 批量审批
        /*submit(taskForm).then(res => {
          this.crud.notify('approve Success! 审批完成！', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.dialogFormVisible = false
          this.crud.toQuery()
          this.$refs.table.clearSelection()
        })*/
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
    // 双击选中的行列，进入审批主页
    dbSelected(row) {
      // alert(JSON.stringify(row))
      this.checkboxT(row)
      this.$router.push(
        {
          path: '/sys-tools/filedetail',
          query: {
            fileId: row.storageId,
            name: row.name,
            realName: row.realName,
            fileDesc: row.fileDesc
          }
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

.dialog > > > .el-input__inner {
  border: none;
  position: relative;
  color: rgba(121, 130, 148, 1);
  text-align: left;
  font-size: 1rem;
}

//修改disabled的样式

.dialog > > > .is-disabled .el-input__inner {
  　　background-color: white;
  　　border-color:  white；
}

// 修改placeholderd的样式

.dialog > > > .el-input__inner::-webkit-input-placeholder {
  color: #ffffff;
  text-align: left;
  font-size: 1rem;
  position: relative;

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
