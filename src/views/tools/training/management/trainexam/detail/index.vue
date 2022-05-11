<template>
  <div class="app-container">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/training/management' }">培训概览</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/training/train-exam' }">培训考试</el-breadcrumb-item>
        <el-breadcrumb-item><b>{{ departName }}-培训考试资源</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-container>
      <el-header style="padding: 0 !important;text-align: left;height:auto; font-size: 12px">
        <el-radio-group v-model="defaultRadio">
          <el-radio-button label="考试题库"></el-radio-button>
          <el-radio-button label="考生管理"></el-radio-button>
        </el-radio-group>
      </el-header>
      <el-main v-if="defaultRadio==='考试题库'">
        <exam-bank :depart-id="departId"/>
      </el-main>
      <el-main v-if="defaultRadio==='考生管理'">
        <exam-staff :depart-id="departId"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>

import {GMTToDate} from '@/utils/validationUtil';
import {getToken} from '@/utils/auth';
import {mapGetters} from 'vuex';
import ExamBank from './examBank/index'
import ExamStaff from './examStaff/index'

export default {
  name: "ExamDetail",
  components: { ExamBank, ExamStaff },
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'exam:add'],
        edit: ['admin', 'exam:edit'],
        del: ['admin', 'exam:del']
      },
      departId: null,
      departName: null,
      defaultRadio: '考试题库'
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'trExamDepartFileUploadApi'
    ])
  },
  created() {
    if (this.$route.query.departId !== undefined) {
      this.departId = this.$route.query.departId
      this.departName = this.$route.query.departName
      this.getExamDeptFiles(this.departId)
    }
  },
  mounted() {

  },
  methods: {
    // 查询关联部门下的题库信息
    getExamDeptFiles(departId) {

    },
    // 改变状态
    examDateFormat(row, col) {
      return GMTToDate(row.dueDate)
    }
  }
}
</script>

<style scoped>

</style>
