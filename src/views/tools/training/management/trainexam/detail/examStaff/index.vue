<template>
  <div>
    <el-tabs tab-position="left" style="height: 200px;">
      <el-tab-pane v-for="(item,index) in staffList" :key="item.id">
        <template slot="label">
          {{ item.staffName }}
        </template>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import crudNewStaff from '@/api/tools/train/newStaff'
import {getToken} from "@/utils/auth";
import {mapGetters} from "vuex";

export default {
  name: "ExamStaff",
  props: ['departId'],
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'exam:add'],
        edit: ['admin', 'exam:edit'],
        del: ['admin', 'exam:del']
      },
      cond: {
        departId: null,
        staffType: null
      },
      staffList: []
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'trExamDepartFileUploadApi'
    ])
  },
  created() {
    this.getDlStaff()
  },
  methods: {
    getDlStaff() {
      crudNewStaff.get({departId: this.$props.departId, staffType: '直接员工'}).then(res => {
        // alert(JSON.stringify(res))
        this.staffList = res.content
      })
    }
  }
}
</script>

<style scoped>

</style>
