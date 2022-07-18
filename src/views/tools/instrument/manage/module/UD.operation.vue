<template>
  <div>
    <el-button
      v-if="data.caliStatus !== '无需校准'"
      v-permission="permission.edit"
      :loading="crud.status.cu === 2"
      size="mini"
      :type="initBtnType(data)"
      @click="checkDetails(data)"
    >
      {{ initMaintainOperation(data) }}
    </el-button>
    <el-button v-permission="permission.edit" :loading="crud.status.cu === 2"  size="mini"
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
      if (data.lastCaliDate) {
        if (data.caliStatus === '超时未校准') {
          return 'danger'
        } else if(data.caliStatus === 'INSTRU_CALI_STATUS_SOON_OVERDUE'){
          return 'warning'
        } else {
          return 'success'
        }
      }
    },
    initMaintainOperation(data) {
      if (data.lastCaliDate) {
        if (data.caliStatus === '超时未校准') {
          return '校准'
        } else {
          return '查校'
        }
      } else {
        return '校准'
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
          path: '/instrument/calibration',
          query: {
            instruId: row.id
          }
        })
    }
  }
}
</script>
