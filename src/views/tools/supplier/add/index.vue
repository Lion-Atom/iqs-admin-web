<template>
  <div class="app-container">
    <h3 style="text-align: center;">新建供应商信息</h3>
    <supplier-form :supplier-form="supplierForm" :is-new="isNew" />
  </div>
</template>

<script>
import SupplierForm from '@/views/tools/supplier/module/supplierForm'

export default {
  name: 'SupplierAdd',
  components: { SupplierForm },
  data() {
    return {
      supplierForm: {
        id: null,
        // 基本信息
        supplierCode: null,
        isQualified: null,
        type: null,
        name: null,
        abb: null,
        level: null,
        profile: null,
        production: null,
        prodTags: [],
        // 公司信息
        country: null,
        provincial: null,
        city: null,
        zip: null,
        address: null,
        fax: null,
        deliveryMethod: null,
        status: null,
        dunsNum: null,
        leyalPerson: null,
        foundationDate: null,
        regId: null,
        regDate: null,
        companyEmail: null,
        onlineConsul: null,
        webSite: null,
        companyScope: null,
        // 公司数据
        empTotal: null,
        manNum: null,
        workerNum: null,
        tempNum: null,
        dailyHour: null,
        workDay: null,
        thirdTurnover: null,
        secondTurnover: null,
        nowTurnover: null,
        forecastTurnover: null,
        // 物流信息
        logistics: null,
        logisticsTags: [],
        // 财务信息
        settlement: null,
        currency: null,
        bankAccount: null,
        bankName: null,
        accountName: null,
        dutyParagraph: null,
        // 准入信息
        qualifiedDate: null,
        qualifiedScore: null,
        // 审核信息
        auditDate: null,
        auditResult: null,
        questionStatus: null
      },
      isNew: true,
      destroyFormData: false
    }
  },
  created() {

  },
  mounted() {
    this.initForm()
  },
  methods: {
    // 获取供应商信息
    initForm() {
      // 销毁子组件，而后重新渲染
      // this.destroyFormData = false
      this.$nextTick(() => {
        this.destroyFormData = true
      }, 500)
    }
  }
}
</script>

<style scoped>

</style>
