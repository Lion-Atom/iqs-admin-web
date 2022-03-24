<template>
  <div class="app-container">
    <h3 style="text-align: center;">更新供应商信息</h3>
    <supplier-form v-if="destroyFormData" :supplier-form="supplierForm" :is-new="isNew" />
  </div>
</template>

<script>
import SupplierForm from '@/views/tools/supplier/module/supplierForm'
import { validIsNotNull } from '@/utils/validationUtil'
import { getSupplierById } from '@/api/tools/supplier'

export default {
  name: 'SupplierUpdate',
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
      isNew: false,
      destroyFormData: false
    }
  },
  created() {

  },
  mounted() {
    if (validIsNotNull(this.$route.query.supplierId)) {
      this.getSupplier(this.$route.query.supplierId)
    }
  },
  methods: {
    // 获取供应商信息
    getSupplier(id) {
      getSupplierById(id).then(res => {
        this.supplierForm = res
        // 销毁子组件，而后重新渲染
        // alert(JSON.stringify(this.supplierForm))
        // this.destroyFormData = false
        if(!validIsNotNull(JSON.stringify((this.supplierForm.logisticsTags))) ||
          JSON.stringify(this.supplierForm.logisticsTags) === '[""]'){
          // alert(1)
          this.supplierForm.logisticsTags = []
        }
        // alert(JSON.stringify(this.supplierForm.logisticsTags))
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
