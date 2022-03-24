<template>
  <div class="app-container">
    <h3 style="text-align: center;">更新变更信息</h3>
    <change-form v-if="destroyFormData" :change-form="changeForm" :is-new="isNew"/>
  </div>
</template>

<script>
import ChangeForm from '@/views/tools/change/module/changeForm'
import { validIsNotNull } from '@/utils/validationUtil'
import { getChangeById } from '@/api/tools/change'

export default {
  name: 'ChangeAdd',
  components: { ChangeForm },
  data() {
    return {
      changeForm: {
        finishedStep: 3,
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
        scopes: [],
        havAgreement: true,
        approveDepart: null,
        approveBy: null,
        havReport: true,
        isAccepted: true,
        // 解锁范围
        unlockSteps: [1]
      },
      destroyFormData: false,
      isNew: false
    }
  },
  created() {

  },
  mounted() {
    if (validIsNotNull(this.$route.query.changeId)) {
      this.getChangeInfo(this.$route.query.changeId)
    }
  },
  methods: {
    // 获取供应商信息
    getChangeInfo(id) {
      getChangeById(id).then(res => {
        // alert(JSON.stringify(res))
        this.changeForm = res
        // 销毁子组件，而后重新渲染
        // this.destroyFormData = false
        this.$nextTick(() => {
          this.destroyFormData = true
        }, 500)
      })
    }
  }
}
</script>

<style scoped>

</style>
