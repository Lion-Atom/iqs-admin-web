<template>
  <div>

    <el-popover v-model="pop" v-permission="permission.approve" placement="top" width="180" trigger="manual"
                @show="onPopoverShow" @hide="onPopoverHide"
    >
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="doCancel">取消</el-button>
        <el-button type="primary" size="mini" @click="doApprove(data)">确定</el-button>
      </div>
      <el-button slot="reference" :disabled="disabledDle" type="primary" icon="el-icon-thumb" size="mini"
                 @click="toApprove"
      />
    </el-popover>
  </div>
</template>
<script>
import CRUD, { crud } from '@crud/crud'

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
    },
    disabledDle: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String,
      default: '是否直接审批通过吗？'
    }
  },
  data() {
    return {
      pop: false
    }
  },
  methods: {
    doCancel() {
      this.pop = false
    },
    toApprove() {
      this.pop = true
    },
    doApprove(row) {
      alert(JSON.stringify(row))
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
    }
  }
}
</script>
