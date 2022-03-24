<template>
  <div>
    <!--    <h3 style="text-align: center;">新建变更信息</h3>-->
    <change-form :change-form="changeForm" :is-new="isNew"/>
  </div>
</template>

<script>
import ChangeForm from '@/views/tools/change/module/changeForm'

export default {
  name: "ChangeAdd",
  components: { ChangeForm },
  data() {
    return {
      changeForm: {
        finishedStep: 0,
        changeNum: null,
        reason: null,
        source: null,
        initiator: null,
        department: null,
        initTime: null,
        // 所涉地域
        area: null,
        areaTags: [],
        // 所涉部门
        depart: null,
        departTags: [],
        // 所涉项目
        project: null,
        projectTags: [],
        // 所涉产品
        production: null,
        prodTags: [],
        cost: null,
        isCustomer: null,
        remark: null,
        email: null,
        // 变更范围：文档、过程、工具和其他变更
        scope: null,
        scopeTags: [],
        havAgreement: false,
        approveDepart: null,
        approveBy: null,
        havReport: true,
        isAccepted: true,
        // 解锁范围
        unlockSteps: [1]
      },
      isNew: true
    }
  }
}
</script>

<style scoped>

</style>
