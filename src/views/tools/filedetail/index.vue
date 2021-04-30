<template>
  <div class="app-container">
    <h2><i class="el-icon-document" />{{ realName }}</h2>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-form ref="form" :model="form" size="small" label-width="200px">
        <el-collapse-item title="Profile 轮廓" name="1">
          <el-form-item label="Revision 改版">
            <el-radio-group v-model="form.isRevision" :disabled="form.id === user.id">
              <el-radio
                v-for="item in dict.common_status"
                :key="item.id"
                :label="item.value"
              >{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Title 名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="Document Category 文件分类" prop="fileCategory.id" required>
            <treeselect
              v-model="form.fileCategory.id"
              :options="fileCategories"
              :load-options="loadCategories"
              style="width: 178px"
              placeholder="选择文件对应分类"
            />
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="Organization 所属组织" name="2">
          <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
          <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
        </el-collapse-item>
        <el-collapse-item title="Process 所属过程" name="3">
          <div>简化流程：设计简洁直观的操作流程；</div>
          <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
          <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
        </el-collapse-item>
        <el-collapse-item title="可控 Controllability" name="4">
          <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
          <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
        </el-collapse-item>
      </el-form>
    </el-collapse>
  </div>
</template>

<script>
import crudFileCategory, { getFileCategories } from '@/api/system/filecategory'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'

const defaultForm = {
  id: null,
  name: null,
  isRevision: 'false',
  pid: null,
  description: '无',
  cateSort: 999,
  fileLevel: { id: null },
  fileCategory: { id: null },
  enabled: 'true'
}
export default {
  name: 'FileDetail',
  // components: { Treeselect, crudOperation, rrOperation, udOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '文件明细', url: 'api/fileCategory', crudMethod: { ...crudFileCategory }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['file_status', 'common_status'],
  data() {
    return {
      id: null,
      realName: '',
      activeNames: ['1'],
      headers: { 'Authorization': getToken() },
      permission: {
        add: ['admin', 'storage:add'],
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      fileCategories: []
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'fileUploadApi'
    ])
  },
  mounted: function() {
    this.id = this.$route.query.fileId
    this.realName = this.$route.query.realName
    console.log(this.id)
  },
  methods: {
    handleChange(val) {
      console.log(val)
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
