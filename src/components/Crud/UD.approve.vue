<template>
  <div v-if="!data.isDone">

    <el-popover
      v-model="pop"
      v-permission="permission.approve"
      placement="top"
      width="180"
      trigger="manual"
      @show="onPopoverShow"
      @hide="onPopoverHide"
    >
      <p>{{ msg }}</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="doCancel(data)">先看看</el-button>
        <el-button v-if="data.type !== '8D'" type="primary" size="mini" @click="doApprove(data)">确定</el-button>
        <el-button v-else type="primary" size="mini" @click="gotoIssue(data)">确定</el-button>
      </div>
      <el-button
        slot="reference"
        type="primary"
        icon="el-icon-thumb"
        size="mini"
        @click="toApprove"
      />
    </el-popover>
  </div>
  <div v-else>
    <el-button
      type="primary"
      icon="el-icon-view"
      size="mini"
      @click="gotoDetail(data)"
    />
  </div>
</template>
<script>
import CRUD, { crud } from '@crud/crud'
import { submitTask } from '@/api/system/toolsTask'

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
    }
  },
  data() {
    return {
      pop: false,
      emitMsg: {
        data: {},
        show: true
      },
      msg: null,
      taskForm: {}
    }
  },
  mounted() {
    if (this.data.type !== '8D') {
      this.msg = '是否直接审批通过吗？'
    } else {
      this.msg = '是否前往8D进行审批？'
    }
  },
  methods: {
    doCancel(row) {
      this.pop = false
      this.emitMsg.data = row
      this.$emit('func', this.emitMsg)
    },
    toApprove() {
      this.pop = true
    },
    gotoDetail(row) {
      // 查看任务信息
      this.pop = false
      this.emitMsg.data = row
      this.$emit('func', this.emitMsg)
    },
    // 前往8D列表
    gotoIssue(row) {
      if (row.type === '8D') {
        this.$router.push(
          {
            path: '/8D/issue',
            query: {}
          })
      }
    },
    doApprove(row) {
      // alert(JSON.stringify(row))
      this.taskForm = row
      this.taskForm.approveResult = true
      submitTask(this.taskForm).then(res => {
        this.crud.notify('approve Success! 审批完成！', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.pop = false
        this.crud.toQuery()
      })
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
