<template>
  <div class="app-container" @dblclick="back">
    <!--快速导航-->
    <div class="head-container">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/instrument/manage' }">仪器录入</el-breadcrumb-item>
        <el-breadcrumb-item><b>校准明细</b></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>仪器信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <svg-icon icon-class="tool_new" class="tools-avatar"/>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="user"/>
                  内部编码
                  <div class="user-right">{{ instruForm.instruNum }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1"/>
                仪器名称
                <div class="user-right">{{ instruForm.instruName }}</div>
              </li>
              <li>
                <svg-icon icon-class="dept"/>
                仪器型号
                <div class="user-right"> {{ instruForm.instruNum }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone"/>
                资产号
                <div class="user-right">{{ transToNull(instruForm.assetNum) }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq"/>
                出厂日期
                <div class="user-right">{{ transToDate(instruForm.purDate) }}</div>
              </li>
              <li>
                <svg-icon icon-class="email"/>
                使用区域
                <div class="user-right">{{ instruForm.useArea }}</div>
              </li>
              <li>
                <svg-icon icon-class="user"/>
                使用人
                <div class="user-right">{{ instruForm.useBy }}</div>
              </li>
              <li>
                <svg-icon icon-class="email"/>
                存放位置
                <div class="user-right">{{ instruForm.position }}</div>
              </li>
              <li>
                <svg-icon icon-class="user"/>
                保管人
                <div class="user-right">{{ instruForm.keeper }}</div>
              </li>
              <li>
                <svg-icon icon-class="icon"/>
                校准周期
                <div class="user-right">{{ instruForm.caliPeriod }}{{ instruForm.periodUnit }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--校准记录-->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="header-title">校准记录</span>
          </div>
          <div>
            <div class="head-container">
              <eHeader :instru-id="instruId" :cali-results="caliResults" :permission="permission"/>
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
              <el-table-column label="校准日期" :formatter="caliDateFormat" min-width="110"/>
              <el-table-column label="内部校准" :formatter="innerCheckedFormat"/>
              <el-table-column label="外部校准方式" :formatter="isDoorFormat" min-width="120"/>
              <el-table-column label="校准机构" :formatter="caliOrgIdFormat"/>
              <el-table-column prop="caliResult" label="保养结果">
                <template slot-scope="scope">
                  <el-popover v-if="scope.row.caliResult==='不合格'" trigger="hover" placement="top">
                    <p>{{ scope.row.failDesc }}</p>
                    <el-tag slot="reference" class="name-wrapper" type="warning">{{ scope.row.caliResult }}</el-tag>
                  </el-popover>
                  <el-tag v-else class="name-wrapper" type="success">{{ scope.row.caliResult }}</el-tag>
                </template>
              </el-table-column>
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
            <eForm :instru-form="instruForm" :cali-results="caliResults" :cali-status="dict.common_status"
                   :out-check="outCheckOptions"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import crudInstruCaliV2 from '@/api/tools/instrument/instruCaliV2'
import {mapGetters} from 'vuex'
import {getToken} from '@/utils/auth'
import CRUD, {presenter} from "@crud/crud";
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import eHeader from "./module/header";
import eForm from "./module/form";
import {GMTToDate, validIsNotNull} from "@/utils/validationUtil";
import {getInstrumentById} from "@/api/tools/instrument/instrument";

export default {
  name: 'InstruCalibration',
  components: {
    eHeader,
    crudOperation,
    pagination,
    eForm,
    udOperation
  },
  cruds() {
    return CRUD({
      title: '仪器校准',
      url: 'api/instruCalibrationV2',
      crudMethod: {...crudInstruCaliV2},
      queryOnPresenterCreated: false
    })
  },
  mixins: [presenter()],
  dicts: ['common_status'],
  data() {
    return {
      headers: {
        'Authorization': getToken()
      },
      instruId: null,
      instruForm: {},
      permission: {
        add: ['admin', 'instrument:edit'],
        edit: ['admin', 'instrument:edit'],
        del: ['admin', 'instrument:edit']
      },
      caliResults: [
        {
          value: '合格'
        },
        {
          value: '不合格'
        },
      ],
      outCheckOptions: [
        {
          value: 'true',
          label: '上门校准'
        }, {
          value: 'false',
          label: '送出校准'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
    ])
  },
  created: function () {
    if (this.$route.query.instruId !== undefined) {
      this.instruId = this.$route.query.instruId
      this.getInfoByInstruId(this.instruId)
    }
  },
  mounted() {
    this.crud.toQuery()
  },
  methods: {
    // 获取该设备信息
    getInfoByInstruId(id) {
      getInstrumentById(id).then(res => {
        this.instruForm = res
      })
    },
    // 字符串空白处理
    transToNull(val) {
      if (!validIsNotNull(val)) {
        return '--'
      }
    },
    transToDate(date) {
      if (validIsNotNull(date)) {
        return GMTToDate(date)
      } else {
        return '--'
      }
    },
    // 保养日期格式化
    caliDateFormat(row, col) {
      if (validIsNotNull(row.caliDate)) {
        return GMTToDate(row.caliDate)
      } else {
        return '--'
      }
    },
    innerCheckedFormat(row, col) {
      if (row.innerChecked.toString() === 'true') {
        return '是'
      } else {
        return '否'
      }
    },
    isDoorFormat(row, col) {
      if (row.innerChecked.toString() === 'false') {
        if (row.isDoor.toString() === 'true') {
          return '上门校准'
        } else {
          return '送出校准'
        }
      } else {
        return '--'
      }
    },
    caliOrgIdFormat(row, col) {
      if (validIsNotNull(row.caliOrgId)) {
        return row.caliOrgName
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
