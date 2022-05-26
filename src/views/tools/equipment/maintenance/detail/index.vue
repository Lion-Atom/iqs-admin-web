<template>
  <div class="app-container" @dblclick="back">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/equipment/maintenance' }">保养录入</el-breadcrumb-item>
        <el-breadcrumb-item><b>保养明细</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>设备信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <svg-icon icon-class="tools" class="tools-avatar"/>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="user"/>
                  设备编号
                  <div class="user-right">{{ equipForm.equipNum }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1"/>
                设备名称
                <div class="user-right">{{ equipForm.equipName }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept"/>
                设备型号
                <div class="user-right"> {{ equipForm.equipModel }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone"/>
                资产号
                <div class="user-right">{{ equipForm.assetNum }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq"/>
                厂家
                <div class="user-right">{{ equipForm.equipProvider }}</div>
              </li>
              <li>
                <svg-icon icon-class="email"/>
                使用部门
                <div class="user-right">{{ equipForm.useDepartName }}</div>
              </li>
              <li>
                <svg-icon icon-class="icon"/>
                所在位置
                <div class="user-right">{{ equipForm.useArea }}</div>
              </li>
              <li>
                <svg-icon icon-class="icon"/>
                保养等级
                <div class="user-right">{{ equipForm.maintainLevel }}</div>
              </li>
              <li>
                <svg-icon icon-class="icon"/>
                保养周期
                <div class="user-right">{{ equipForm.maintainPeriod }}{{ equipForm.maintainPeriodUnit }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--保养记录-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header-title">保养计划</span>
          </div>
          <div>
            <div class="head-container">
              <eHeader :equip-id="equipId" :maintain-status="maintainResultOptions" :permission="permission"/>
              <crudOperation :permission="permission"/>
            </div>
            <!--表格渲染-->
            <el-table
              ref="table"
              v-loading="crud.loading"
              :data="crud.data"
              style="width: 100%;"
              @selection-change="crud.selectionChangeHandler"
              @row-dblclick="crud.toEdit">
              <el-table-column type="selection" width="55"/>
              <!--              <el-table-column prop="repairNum" label="维修单号" min-width="120" />-->
              <el-table-column label="保养日期" :formatter="maintainDateFormat"/>
              <el-table-column prop="maintainBy" label="保养人"/>
              <el-table-column prop="maintainDuration" label="保养时长"/>
              <el-table-column prop="confirmBy" label="确认人"/>
              <el-table-column prop="maintainResult" label="保养结果"/>
              <el-table-column prop="maintainDesc" label="保养反馈" :show-overflow-tooltip='true' />
              <el-table-column prop="createTime" label="创建日期" min-width="140"/>
              <!--   编辑与删除   -->
              <el-table-column
                v-if="checkPer(['admin','maintain:edit','maintain:del'])"
                label="操作"
                width="130px"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <udOperation
                    :data="scope.row"
                    :permission="permission"
                  />
                </template>
              </el-table-column>
            </el-table>
            <!--分页组件-->
            <pagination/>
            <!--表单渲染-->
            <eForm :equip-form="equipForm"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import crudMaintenance from '@/api/tools/equipMaintenance'
import {mapGetters} from 'vuex'
import {getToken} from '@/utils/auth'
import {getEquipmentById} from "@/api/tools/equipment";
import CRUD, {presenter} from "@crud/crud";
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import eHeader from "./module/header";
import eForm from "./module/form";
import {GMTToDate, validIsNotNull} from "@/utils/validationUtil";

export default {
  name: 'MaintainDetail',
  components: {
    eHeader,
    crudOperation,
    pagination,
    eForm,
    udOperation
  },
  cruds() {
    return CRUD({
      title: '设备保养',
      url: 'api/equipMaintenance',
      // query: { equipmentId: this.$route.query.equipId },
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudMaintenance},
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter()],
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      equipId: null,
      equipForm: {},
      permission: {
        add: ['admin', 'maintain:add'],
        edit: ['admin', 'maintain:edit'],
        del: ['admin', 'maintain:del']
      },
      maintainResultOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
    ])
  },
  created: function () {
    if (this.$route.query.equipId !== undefined) {
      this.equipId = this.$route.query.equipId
      this.getInfoByEquipId(this.equipId)
      this.getMaintainInfoByEquipId(this.equipId)
    }
  },
  mounted() {
    this.crud.toQuery()
  },
  methods: {
    // 获取该设备信息
    getInfoByEquipId(id) {
      getEquipmentById(id).then(res => {
        this.equipForm = res
      })
    },
    // todo 查询设备下保养记录
    getMaintainInfoByEquipId(id) {

    },
    // 上传附件之前判断
    beforeUpload: function (file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.upload.clearFiles()
    },
    cancel() {
      this.approvalVisible = false
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    // 保养日期格式化
    maintainDateFormat(row, col) {
      if (validIsNotNull(row.maintainDate)) {
        return GMTToDate(row.maintainDate)
      } else {
        return '--'
      }
    },
    // 返回列表
    back() {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;
}

.elRow {
  border-bottom: 1px solid #808080;
}

.el-form-item--small.el-form-item {
  margin-bottom: 10px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.tools-avatar {
  width: 120px;
  height: 120px;
  border-radius: 10%;
}

.user-info {
  padding-left: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }

  .user-right {
    float: right;

    a {
      color: #317EF3;
    }
  }
}
</style>
