<template>
  <div>
    <!--缺陷定位-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">缺陷定位</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="saveDefects(stepDefects)">保存</el-button>
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
              <el-checkbox v-model="scope.row.created"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="被检测到" show-overflow-tooltip>
            <template scope="scope">
              <el-checkbox v-model="scope.row.detected"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="可能已被检测到" show-overflow-tooltip>
            <template scope="scope">
              <el-checkbox v-model="scope.row.shouldDetected"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--todo 添加根本原因-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">根本原因分析</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="checkFishBone(crud.data)">查看鱼骨图</el-button>
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
              <span><el-link style="text-decoration:underline;font-size:16px;font-weight: bolder;" type="success"
              >{{ causeName }}</el-link>-5Whys原因分析</span>
            </div>
            <div>
              <el-table
                ref="table"
                v-loading="whyLoading"
                :data="whys"
                style="width: 100%;margin-bottom: 20px;"
              >
                <el-table-column label="序号" width="50" type="index" :index="(index)=>{return index+1}"
                ></el-table-column>
                <el-table-column label="内容" align="center">
                  <template slot-scope="scope">
                    <el-input type="textarea" autosize v-model="scope.row.content" style="width: 90%;"/>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" icon="el-icon-delete"
                               @click="handleDelete(scope.$index, scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <p style="margin-top: -20px;">
                <el-button v-permission="permission.edit" size="mini" type="primary" icon="el-icon-plus"
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
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
                   :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="600px"
        >
          <el-form ref="form" inline :model="form" size="small" label-width="120px">
            <el-form-item label="原因名称" prop="name" required>
              <el-input v-model="form.name" style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="发生/检测" prop="judgeResult" required>
              <el-select v-model="form.judgeResult" size="small" placeholder="发生/检测"
                         class="filter-item"
                         style="width: 370px;"
              >
                <el-option v-for="item in judgeTypeOptions" :key="item.key" :label="item.display_name"
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
              <el-input-number v-model="form.contribution" style="width: 370px;" :precision="2" :step="0.1" :max="100"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="是否是根本原因" prop="isExact" required>
              <el-select v-model="form.isExact" size="small" placeholder="是/否"
                         class="filter-item"
                         style="width: 370px;"
              >
                <el-option v-for="item in resultTypeOptions" :key="item.key" :label="item.display_name"
                           :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="评论" prop="comment" required>
              <el-input
                type="textarea"
                autosize
                v-model="form.comment"
                style="width: 370px;"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          lazy
          :load="getCauseDatas"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :data="crud.data"
          row-key="id"
          @select="crud.selectChange"
          @select-all="crud.selectAllChange"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column type="selection" width="55"/>
          <el-table-column label="原因名称" prop="name" min-width="150"/>
          <el-table-column label="发生/检测 " prop="judgeResult" width="80"/>
          <el-table-column label="确认方法" prop="method" min-width="150"/>
          <el-table-column label="确认结果" prop="result" min-width="150"/>
          <el-table-column label="原因占比" prop="contribution"/>
          <el-table-column v-if="checkPer(['admin','d:edit'])" label="操作" width="250px" align="center"
                           fixed="right"
          >
            <template slot-scope="scope">
              <div>
                <el-button v-permission="permission.edit" size="mini" type="primary" icon="el-icon-plus"
                           @click="toAddCause(scope.row)"
                ></el-button>
                <el-button style="margin-left: 0;" v-permission="permission.edit" :loading="crud.status.cu === 2"
                           v-if="scope.row.pid > 0 " size="mini" type="primary" icon="el-icon-edit"
                           @click="crud.toEdit(scope.row)"
                />
                <!--删除-->
                <el-popover :ref="`delMem-popover-${scope.$index}`" v-permission="permission.edit" placement="top"
                            width="180"
                >
                  <p>确定删除吗?如果存在下级节点则一并删除，此操作不能撤销！</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text"
                               @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >取消
                    </el-button>
                    <el-button type="primary" size="mini"
                               @click="crud.doDelete(scope.row), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                    >确定
                    </el-button>
                  </div>
                  <el-button v-if="scope.row.pid > 0 " slot="reference" v-permission="permission.del"
                             :disabled="scope.row.isLeader === true"
                             type="danger" icon="el-icon-delete" size="mini"
                  />
                </el-popover>
                <el-button v-permission="permission.edit" v-if="scope.row.isExact" size="mini" type="primary"
                           icon="el-icon-edit" @click="toEditWhys(scope.row)"
                >5Whys
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>


    <!--确认完成-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header-title">确认完成</span>
      </div>
      <div>
        <el-row>
          <el-col :span="6">
            确认完成当前步骤：
            <el-popover
              placement="top"
              width="300"
              v-model="confirmVisible"
            >
              <p>您确定所有信息都已填写完毕，此步骤已完成吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="confirmVisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="confirmFinished">确定</el-button>
              </div>
              <el-button :loading="selfLoading" slot="reference" v-permission="permission.edit" type="success"
                         :disabled="isFinished"
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

import { getByIssueId, editTimeManage } from '@/api/tools/timeManagement'
import { getStepDefectByIssueId, editStepDefect } from '@/api/tools/stepDefect'
import crudIssueCause, { getIssueCause } from '@/api/tools/issueCause'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import crudOperation from '@crud/CRUD.operation'
import { editWhys, getWhysByCauseId } from '@/api/tools/causeWhy'

const defaultForm = {
  id: null,
  name: null,
  judgeResult: '发生',
  subCount: 0,
  method: null,
  result: null,
  contribution: null,
  comment: '无',
  isExact: false
}
export default {
  name: 'ForthForm',
  props: ['issueId'],
  dicts: ['common_status'],
  components: { Treeselect, crudOperation },
  cruds() {
    return CRUD({
      title: '原因分析', url: 'api/issueCause',
      crudMethod: { ...crudIssueCause }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      issueId: this.$props.issueId,
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      pop: false,
      selfLoading: false,
      causeLoading: false,
      defectLoading: false,
      stepDefects: [],
      confirmVisible: false,
      curStep: 'd4Status',
      curTime: 'd4Time',
      causeData: [],
      isFinished: false,
      resultTypeOptions: [
        { key: true, display_name: '是' },
        { key: false, display_name: '否' }
      ],
      judgeTypeOptions: [
        { key: '发生', display_name: '发生' },
        { key: '检测', display_name: '检测' }
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
      timeManagement: {},
      innerVisible: false
    }
  },
  created() {
    this.query.issueId = this.$props.issueId
    this.crud.toQuery()
    this.getTimeManagementByIssueId(this.$props.issueId)
  },
  mounted: function() {
    this.getStepDefectByIssueId(this.$props.issueId)
  },
  methods: {
    // 保存缺陷定位信息
    getStepDefectByIssueId(id) {
      this.defectLoading = true
      getStepDefectByIssueId(id).then(res => {
        this.stepDefects = res
        this.defectLoading = false
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
    // 批量保存缺陷定位数据
    saveDefects(data) {
      editStepDefect(data).then(res => {
        this.$message({
          message: 'Save Step-Defect Record Success! 保存缺陷检测定位成功!',
          type: 'success'
        })
        this.isFinished = false
        this.$emit('func', this.isFinished)
      }).catch(() => {
        this.$message({
          message: 'Save Step-Defect Failed! 保存缺陷定位信息失败!',
          type: 'error'
        })
      })
    },
    // 获取原因分析列表子集合
    getCauseDatas(tree, treeNode, resolve) {
      const params = { issueId: this.$props.issueId, pid: tree.id }
      crudIssueCause.getIssueCause(params).then(res => {
        resolve(res.content)
      })
      /*setTimeout(() => {
        crudIssueCause.getIssueCause(params).then(res => {
          resolve(res.content)
        })
      }, 100)*/
    },
    // 新增原因
    toAddCause(data) {
      this.form.pid = data.id
      this.form.issueId = this.$props.issueId
      this.crud.toAdd()
      this.isFinished = false
      this.$emit('func', this.isFinished)
    },
    doCancel() {
      this.pop = false
      this.crud.cancelDelete(this.data)
    },
    toDelete() {
      this.pop = true
    },
    [CRUD.HOOK.afterDelete](crud, data) {
      if (data === this.data) {
        this.pop = false
      }
    },
    onPopoverShow() {
      setTimeout(() => {
        document.addEventListener('click', this.handleDocumentClick)
      }, 0)
    },
    onPopoverHide() {
      document.removeEventListener('click', this.handleDocumentClick)
    },
    handleDocumentClick(event) {
      this.pop = false
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
      this.innerVisible = true
    },
    // 提交5Whys更新
    updateSubmit(whys) {
      let newArr = []
      for (let i = 0; i < whys.length; i++) {
        let why = {}
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
    addClick() { //添加行数
      let obj = {
        orderSort: this.whys.length + 1,
        content: ''
      }
      this.whys.push(obj)
    },
    handleDelete(index) { //删除行数
      this.whys.splice(index, 1)
    },
    checkFishBone(data) {
      // todo 查看鱼骨图
    },
    // 确认完成
    confirmFinished() {
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
          this.$emit('func', this.isFinished)
          this.$message({
            message: 'Submit Success! D4提交完成!',
            type: 'success'
          })
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
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
