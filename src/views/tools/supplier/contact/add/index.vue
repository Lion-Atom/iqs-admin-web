<template>
  <div class="app-container">
    <h3 style="text-align: center;">新建供应商联系人信息</h3>
    <supplier-contact-form :contact-form="contactForm" :is-new="isNew"/>
  </div>
</template>

<script>
import SupplierContactForm from '@/views/tools/supplier/contact/module/supplierContactForm'
import { validIsNotNull } from '@/utils/validationUtil'

export default {
  name: 'SupplierContactAdd',
  components: { SupplierContactForm },
  data() {
    return {
      contactForm: {
        id: null,
        // 基本信息
        name: null,
        supplierId: null,
        gender: null,
        importantLevel: null,
        unit: null,
        title: null,
        jobStatus: null,
        department: null,
        post: null,
        business: null,
        // 联系信息
        workTel: null,
        fax: null,
        phone: null,
        email: null,
        homeTel: null,
        msn: null,
        qq: null,
        zip: null,
        type: null,
        age: null,
        idType: null,
        idNum: null,
        address: null,
        // 附加信息
        birthday: null,
        hobby: null,
        hobbyTags: [],
        avatarName: null,
        avatarPath: null,
        remark: null,
        // 准入资格
        qualifiedDate: null,
        qualifiedScore: null
      },
      isNew: true,
      destroyFormData: false
    }
  },
  created() {

  },
  mounted() {
    if (validIsNotNull(this.$route.query.supplierId)) {
      this.contactForm.supplierId = this.$route.query.supplierId
    }
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
