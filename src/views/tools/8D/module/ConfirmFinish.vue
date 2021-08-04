<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span class="header-title">确认完成</span>
    </div>
    <div>
      <el-row>
        <el-col span="6">
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
            <el-button slot="reference" v-permission="permission.edit" type="success" :disabled="isFinished"
                       icon="el-icon-check"
            >确认完成
            </el-button>
          </el-popover>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import { editTimeManage } from '@/api/tools/timeManagement'

export default {
  name: 'ConfirmFinish',
  props: ['timeManage', 'curStep', 'curTime', 'confirmVisible', 'isFinished'],
  data() {
    return {
      timeManagement: {
        id: null,
        issueId: this.$props.issueId,
        planStep1: null,
        planTime1: null,
        planStep2: null,
        planTime2: null,
        planStep3: null,
        planTime3: null
      }
    }
  },
  methods: {
    confirmFinished() {
      // 确认D1完成
      this.timeManagement.d1Status = true
      this.timeManagement.d1Time = new Date()
      editTimeManage(this.timeManagement).then(res => {
        this.confirmVisible = false
        this.isFinished = true
        this.$message({
          message: 'Submit Success! D1提交完成!',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
