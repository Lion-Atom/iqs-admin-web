<template>
  <div>
    <el-button
      v-if="data.maintainLevel"
      v-permission="permission.edit"
      :loading="crud.status.cu === 2"
      :disabled="disabledEdit"
      size="mini"
      :type="initBtnType(data)"
      @click="checkDetails(data)"
    >
      {{ initMaintainOperation(data) }}
    </el-button>
    <el-button v-permission="permission.edit" :loading="crud.status.cu === 2" :disabled="disabledEdit" size="mini"
               type="primary" icon="el-icon-edit" style="text-align: right; margin: 0" @click="crud.toEdit(data)"/>
  </div>
</template>
<script>
import CRUD, {crud} from '@crud/crud'
import {validIsNotNull} from "@/utils/validationUtil";

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
      pop: false,
      maintainType: ''
    }
  },
  created() {
    // this.initBtnType()
  },
  methods: {
    initBtnType(data) {
      if (data.lastMaintainDate) {
        if (data.maintainStatus === '超期未保养') {
          return 'danger'
        } else {
          return 'success'
        }
      } else {
        return 'warning'
      }
    },
    initMaintainOperation(data) {
      if (data.lastMaintainDate) {
        if (data.maintainStatus === '超期未保养') {
          return '保养'
        } else {
          return '查看'
        }
      } else {
        return '保养'
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
