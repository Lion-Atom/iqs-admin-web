<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/overview' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item><b>材料所属部门</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
                  @selection-change="crud.selectionChangeHandler">
          <el-table-column prop="departName" label="部门名称"/>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createBy" label="创建者" align="center"/>
          <el-table-column prop="createTime" label="创建日期"/>
        </el-table>-->
    <el-row :gutter="40" class="row-box">  <!--分栏间隔-->
      <el-col id="realExamDp" :xs="12" :sm="12" :md="12" :lg="6" class="card-col"
              v-for="(material, index) in materialDeparts">
        <!--共24份，xs超小型设备，sm小屏设备，md中屏，lg大屏-->
        <el-card class="el-card" @dblclick.native="routeToTarget(material)">
          <div style="padding: 14px;">
            <el-descriptions :column="1" border>
              <template slot="title">
                {{ material.departName }}
              </template>
              <el-descriptions-item label-class-name="exam-depart-item" label="创建者">
                {{ material.createBy }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="exam-depart-item" label="创建时间">
                {{ material.createTime }}
              </el-descriptions-item>
              <el-descriptions-item label-class-name="exam-depart-item" label="状态">
                <el-switch
                  v-model="material.enabled"
                  active-color="#409EFF"
                  inactive-color="#F56C6C"
                  @change="changeEnabled(material, material.enabled)"
                />
              </el-descriptions-item>
              <el-descriptions-item label-class-name="exam-depart-item" label="题库信息">
                <span>{{ material.materialFileList.length }}条  </span>
                <el-popover
                  v-if="material.materialFileList.length > 0"
                  placement="right"
                  width="400"
                  trigger="click">
                  <span>材料信息</span>
                  <el-table ref="table" style="max-height: 200px !important;overflow-y: auto;" :data="material.materialFileList" border @dblclick.native="routeToTarget(material)">
                    <el-table-column prop="name" label="试题名称" :show-overflow-tooltip="true" />
                    <el-table-column prop="author" label="作者"/>
                    <el-table-column label="出处" :formatter="isInternalFormat"/>
                    <el-table-column prop="toolType" label="专业工具"/>
                  </el-table>
                  <el-button type="text" size="small" slot="reference">查看明细</el-button>
                </el-popover>
              </el-descriptions-item>
            </el-descriptions>
            <div class="bottom clearfix">
              <!--              <el-button class="button" type="text">查看</el-button>-->
              <!--todo 是否需要删除？-->
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-permission="permission.edit" :xs="12" :sm="12" :md="12" :lg="6" class="card-col">
        <el-card class="el-card" v-if="toAddExamDepartVisible === true" @click.native="addRealExamDepartHandle">
          <div style="padding: 14px;" class="add-btn">
            <div style="opacity:0.2;font-size: 70px;margin-top: 25px;">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </div>
            <div>添加部门</div>
          </div>
        </el-card>
        <el-card class="el-card" v-else>
          <div style="padding: 14px;">
            <el-descriptions title="新增培训考试关联部门" :column="1" :colon="false">
              <el-descriptions-item>
                <el-form
                  ref="form"
                  :model="form"
                  :rules="rules"
                  size="small"
                  label-width="50px"
                >
                  <el-form-item
                    label="部门"
                    prop="departId"
                  >
                    <TreeSelect
                      v-model="form.departId"
                      :options="departs"
                      :load-options="loadDeparts"
                      :appendToBody="true"
                      class="treePopup"
                      placeholder="选择新员工所在部门"
                      style="width:90% !important;"
                    >
                      <label slot="option-label"
                             slot-scope="{node}"
                             class="treeLabelClass"
                      >
                        <span :title="node.label">{{ node.label }}</span>
                      </label>
                    </TreeSelect>
                  </el-form-item>
                  <!--新增默认状态为：启用-->
                  <el-form-item
                    label="状态"
                    prop="enabled"
                    style="margin-bottom: 0 !important;"
                  >
                    <el-radio
                      v-for="item in dict.dict.job_status"
                      :key="item.id"
                      v-model="form.enabled"
                      :label="item.value === 'true'"
                    >
                      {{ item.label }}
                    </el-radio>
                  </el-form-item>
                </el-form>
                <div class="button">
                  <el-button size="mini" type="text" @click="toCancelAdd">取消</el-button>
                  <el-button size="mini" :loading="crud.status.cu === 2" type="primary" @click="submitExamDepart">确认
                  </el-button>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudMaterialDepart from '@/api/tools/train/materialDepart'
import CRUD, {presenter, form} from '@crud/crud'
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getDepts, getDeptTree} from "@/api/system/dept";

const defaultForm = {
  id: null,
  departId: null,
  enabled: true
}
export default {
  name: 'TrainMaterial',
  components: {TreeSelect},
  cruds() {
    return CRUD({
      title: '培训材料所属部门',
      url: 'api/train/materialDepart',
      crudMethod: {...crudMaterialDepart},
      queryOnPresenterCreated: false
    })
  },
  mixins: [form(defaultForm), presenter()],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'material:add'],
        edit: ['admin', 'material:edit'],
        del: ['admin', 'material:del']
      },
      materialDeparts: [],
      toAddExamDepartVisible: true,
      departs: [],
      rules: {
        departId: [
          {required: true, message: '请选择要添加的部门', trigger: 'blur'}
        ],
        enabled: [
          {required: true, message: '请确认培训材料所属部门状态', trigger: 'blur'}
        ]
      },
      pop: false
    }
  },
  created() {
    this.getTopDept()
    this.getExamDepart()
  },
  methods: {
    // 查询部门数据
    getTopDept() {
      // alert(JSON.stringify(this.user))
      getDeptTree().then(res => {
        this.departs = res.content
      })
    },
    // 查询培训考试关联部门数据
    getExamDepart() {
      crudMaterialDepart.get().then(res => {
        this.materialDeparts = res
      })
    },
    // 添加培训考试部门
    addRealExamDepartHandle() {
      this.toAddExamDepartVisible = false
      this.form = {...defaultForm}
    },
    // 改变状态
    changeEnabled(data, val) {
      // alert(JSON.stringify(data))
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.departName + '该部门参与培训考试, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudMaterialDepart.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        console.log("取消操作！")
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内使用部门数据
    loadDeparts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
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
    // 撤销操作
    toCancelAdd() {
      this.toAddExamDepartVisible = true
    },
    // 提交保存按钮
    submitExamDepart() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          crudMaterialDepart.add(this.form).then(res => {
            this.$notify({
              title: '添加成功',
              type: 'success',
              duration: 1000
            })
            this.loading = false
            this.getExamDepart()
            this.toAddExamDepartVisible = true
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    // 跳转到目标路径
    routeToTarget(materialDept) {
      this.$router.push(
        {
          path: '/training/train-material/detail',
          query: {
            departId: materialDept.departId,
            departName: materialDept.departName
          }
        })
    },
    // 是否来自内部格式化
    isInternalFormat(row, col) {
      if (row.isInternal) {
        return '内部'
      } else {
        return '外部'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

.el-form-item--small.el-form-item {
  margin-bottom: 8px !important;

  > > > .el-form-item__label {
    line-height: 28px !important;
    color: #909399;
    font-weight: normal;
    font-size: 12px !important;
  }
}

.treePopup {
  ::v-deep.vue-treeselect__menu {
    overflow-x: auto !important;
  }

  ::v-deep .vue-treeselect__label {
    overflow: unset;
    text-overflow: unset;
  }
}


::v-deep .vue-treeselect__single-value {
  font-size: 12px !important;
  color: #909399;
}

::v-deep .el-radio__label {
  font-size: 12px !important;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.card-col {
  margin-top: 30px;
}

.add-btn {
  text-align: center;
}
</style>

<style>
.row-box {
  display: flex;
  flex-flow: wrap;
}

.treeLabelClass {
  font-size: 12px !important;
  color: #909399;
}

.row-box .el-card {
  min-width: 100%;
  height: 100%;
  /*margin-right: 20px;*/
  border: 0;
}
</style>
