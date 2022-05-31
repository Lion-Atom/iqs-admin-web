<template>
  <div class="app-container">
    <div class="head-container">
      <eHeader :enable-options="dict.job_status" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="caliOrgName" label="名称"/>
      <el-table-column prop="fax" label="传真"/>
      <el-table-column prop="phone" label="手机号"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="address" label="通讯地址"/>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','caliOrg:edit','caliOrg:del'])"
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
    <eForm :enable-options="dict.job_status" :permission="permission" />
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import {getToken} from '@/utils/auth'
import CRUD, {presenter} from "@crud/crud";
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import eHeader from "./module/header";
import eForm from "./module/form";
import crudCaliOrgV2 from "@/api/tools/instrument/caliOrgV2";

export default {
  name: 'CaliOrgV2',
  components: {
    eHeader,
    crudOperation,
    pagination,
    eForm,
    udOperation
  },
  cruds() {
    return CRUD({
      title: '仪器校准机构',
      url: 'api/caliOrgV2',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudCaliOrgV2}
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['job_status'],
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      permission: {
        add: ['admin', 'caliorg:add'],
        edit: ['admin', 'caliorg:edit'],
        del: ['admin', 'caliorg:del']
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
    ])
  },
  created: function () {
  },
  mounted() {
    this.crud.toQuery()
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      // alert(JSON.stringify(data))
      this.$confirm('此操作将 "' + this.dict.label.job_status[val] + '" ' + data.caliOrgName + '机构, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudCaliOrgV2.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.job_status[val] + '成功', 'success')
        }).catch(err => {
          data.enabled = !data.enabled
          console.log(err.data.message)
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
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
