<template>
  <div class="app-container">
    <h3 style="text-align: center;">更新供应商联系人信息</h3>
    <supplier-contact-form v-if="destroyFormData" :contact-form="contactForm" :is-new="isNew" />
  </div>
</template>

<script>
import SupplierContactForm from '@/views/tools/supplier/contact/module/supplierContactForm'
import { validIsNotNull } from '@/utils/validationUtil'
import { getContactById } from '@/api/tools/supplierContact'

export default {
  name: 'SupplierContactUpdate',
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
        updateBy: null,
        updateTime: null,
        // 附加信息
        birthday: null,
        hobby: null,
        hobbyTags: [],
        avatarName: null,
        avatarPath: null,
        remark: null
      },
      destroyFormData: false,
      isNew: false,
      contactId: null
    }
  },
  mounted() {
    if (validIsNotNull(this.$route.query.contactId)) {
      this.getContact(this.$route.query.contactId)
      this.contactId = this.$route.query.contactId
    }
  },
  methods: {
    // 获取供应商信息
    getContact(id) {
      getContactById(id).then(res => {
        this.contactForm = res
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
