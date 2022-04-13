<template>
  <div class="app-container">
    <!--问题基本信息-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="header-title">问题基本信息</span>
      </div>
      <div>
        <el-form ref="form" :inline="true" :model="form" class="demo-form-inline">
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="问题标题 :">
                <span>{{ form.issueTitle }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户姓名 :">
                <span>{{ form.customerName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="客户追踪码 :">
                <span>{{ form.caNum }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="产品料号 :">
                <span>{{ form.partNum }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="问题来源 :">
                <span>{{ form.source }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间 :">
                <span>{{ form.initTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="客户/供应商联系电话 :">
                <span>{{ form.phone }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户/供应商邮箱 :">
                <span>{{ form.email }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="问题类型 :">
                <span>{{ form.type }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="初步风险评估 :">
                <span>{{ form.initRisk }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="关联部门 :">
                <span>{{ form.department }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="客户要求时间 :">
                <span>{{ form.customerTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="紧急计划 :">
                <span>{{ form.urgencyPlan }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="具体描述 :">
                <span>{{ form.description }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elRow">
            <el-col :span="12">
              <el-form-item label="状态 :">
                <span>{{ form.status }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="关闭时间 :">
                <span>{{ form.updateTime }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <!--附件管理-->
    <UploadFile
      :issue-id="issueId"
      :permission="permission"
      :is-need="isNeed"
      :step-name="curStep"
      :shadow="never"
    />
  </div>
</template>

<script>
import { getIssueById } from '@/api/tools/issue'
import UploadFile from '../module/uploadFile.vue'

export default {
  name: 'Shutdown',
  props: ['issueId', 'needConfirm'],
  components: { UploadFile },
  data() {
    return {
      permission: {
        add: ['admin', 'd:add'],
        edit: ['admin', 'd:edit'],
        del: ['admin', 'd:del']
      },
      form: {
        id: null,
        issueTitle: null,
        customerName: null,
        caNum: null,
        partNum: null,
        source: 'external',
        urgencyPlan: null,
        initTime: null,
        description: null,
        phone: null,
        email: null,
        type: null,
        isRepeat: null,
        hasSimilar: null,
        initRisk: null,
        department: null,
        customerTime: null,
        other: null,
        supplierDescription: null,
        status: null,
        updateTime: null
      },
      isNeed: false,
      never: 'never',
      curStep: 'D0'
    }
  },
  created() {
    this.issueId = this.$props.issueId
  },
  mounted: function() {
    this.getIssueInfoById(this.issueId)
  },
  methods: {
    // 获取问题基本信息
    getIssueInfoById(id) {
      getIssueById(id).then(res => {
        this.form = res
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}
</style>
