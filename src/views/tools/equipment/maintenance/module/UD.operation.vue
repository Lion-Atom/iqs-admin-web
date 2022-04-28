<template>
  <div>
    <el-button
      v-if="data.maintainLevel"
      v-permission="permission.edit"
      :loading="crud.status.cu === 2"
      :disabled="disabledEdit"
      size="mini"
      :type="data.lastMaintainDate ?'success':'warning'"
      @click="checkDetails(data)"
    >
      {{ data.lastMaintainDate ? '查看' : '保养' }}
    </el-button>
    <el-button v-permission="permission.edit" :loading="crud.status.cu === 2" :disabled="disabledEdit" size="mini"
               type="primary" icon="el-icon-edit" style="text-align: right; margin: 0" @click="crud.toEdit(data)"/>
  </div>
</template>
<script>
import CRUD, {crud} from '@crud/crud'

export default {
  mixins: [crud()],
  props: {
    data: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
    disabledEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pop: false
    }
  },
  methods: {
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
    // 查看审批文件等
    checkDetails(row) {
      this.$router.push(
        {
          path: '/maintenance/detail',
          query: {
            equipId: row.id
          }
        })
    }
  }
}
</script>
