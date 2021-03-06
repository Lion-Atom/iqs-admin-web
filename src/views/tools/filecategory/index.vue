<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable size="small" placeholder="输入文件分类名称搜索" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" @input="change($event)" class="date-item" @change="crud.toQuery"/>
        <el-select v-model="query.enabled" clearable size="small" placeholder="状态" class="filter-item"
                   style="width: 90px" @change="crud.toQuery"
        >
          <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <rrOperation/>
      </div>
      <crudOperation :permission="permission"/>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU"
               :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px"
    >
      <el-form ref="form" inline :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;"/>
        </el-form-item>
        <el-form-item label="分类排序" prop="cateSort">
          <el-input-number
            v-model.number="form.cateSort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            style="width: 370px;"
          />
        </el-form-item>
        <el-form-item label="最高分类">
          <el-radio-group v-model="form.isTop" style="width: 140px">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-radio v-for="item in dict.dept_status" :key="item.id" v-model="form.enabled" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-form-item>
        <el-form-item v-if="form.isTop === '0'" style="margin-bottom: 0;" label="上级分类" prop="pid">
          <treeselect
            v-model="form.pid"
            :load-options="loadFileCategories"
            :options="fileCategories"
            style="width: 370px;"
            placeholder="选择上级分类"
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
      :load="getFileCategoryDatas"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :data="crud.data"
      row-key="id"
      @select="crud.selectChange"
      @select-all="crud.selectAllChange"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55"/>
      <el-table-column label="名称" prop="name"/>
      <el-table-column label="排序" prop="cateSort"/>
      <el-table-column label="描述" prop="description" min-width="200"/>
      <el-table-column label="状态" align="center" prop="enabled">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :disabled="scope.row.id === 0"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled,)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期"/>
      <el-table-column v-if="checkPer(['admin','category:edit','category:del'])" label="操作" width="130px" align="center"
                       fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-dle="scope.row.id === 1"
            msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import crudFileCategory from '@/api/tools/filecategory'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
  id: null,
  name: null,
  isTop: '1',
  subCount: 0,
  pid: null,
  description: '无',
  cateSort: 999,
  enabled: 'true'
}
export default {
  name: 'FileCategory',
  components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件分类', url: 'api/fileCategory', crudMethod: { ...crudFileCategory } })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      fileCategories: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        cateSort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      },
      permission: {
        add: ['admin', 'category:add'],
        edit: ['admin', 'category:edit'],
        del: ['admin', 'category:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ],
      clickOutsideFlag: false,
      childHandleClose: null
    }
  },
  mounted: function() {
    if (this.$route.query.createTime !== undefined) {
      console.log(this.$route.query.createTime)
      const startTime = this.$route.query.createTime + ' 00:00:00'
      const endTime = this.$route.query.createTime + ' 23:59:59'
      this.query.createTime = [startTime, endTime]
      this.crud.toQuery()
    }
  },
  methods: {
    // 监控日期选择器输入变化，强制刷新
    change() {
      this.$forceUpdate()
    },
    getFileCategoryDatas(tree, treeNode, resolve) {
      const params = { pid: tree.id }
      setTimeout(() => {
        crudFileCategory.getFileCategories(params).then(res => {
          resolve(res.content)
        })
      }, 100)
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.pid !== null) {
        form.isTop = '0'
      } else if (form.id !== null) {
        form.isTop = '1'
      }
      form.enabled = `${form.enabled}`
      if (form.id != null) {
        this.getSupFileCategories(form.id)
      } else {
        this.getFileCategories()
      }
    },
    getSupFileCategories(id) {
      crudFileCategory.getFileCategorySuperior(id).then(res => {
        const date = res.content
        this.buildFileCategories(date)
        this.fileCategories = date
      })
    },
    buildFileCategories(fileCategories) {
      fileCategories.forEach(data => {
        if (data.children) {
          this.buildFileCategories(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    getFileCategories() {
      crudFileCategory.getFileCategories({ enabled: true }).then(res => {
        this.fileCategories = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    // 获取弹窗内分类数据
    loadFileCategories({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        crudFileCategory.getFileCategories({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 100)
        })
      }
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (this.form.pid !== null && this.form.pid === this.form.id) {
        this.$message({
          message: '上级文件分类不能为自己',
          type: 'warning'
        })
        return false
      }
      if (this.form.isTop === '1') {
        this.form.pid = null
      }
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.dept_status[val] + '" ' + data.name + '文件分类, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudFileCategory.edit(data).then(res => {
          this.crud.notify(this.dict.label.dept_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.response.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 设置特殊列符合某种规则不允许选中
    checkboxT(row, rowIndex) {
      return row.id !== 0
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
