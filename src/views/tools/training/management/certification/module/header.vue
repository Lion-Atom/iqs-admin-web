<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入新员工名称搜索" style="width: 200px;"
              class="filter-item" @input="crud.toQuery"/>

    <date-range-picker v-model="query.dueDate" class="date-item" @input="dateTimeChange()" start-placeholder="到期开始日期"
                       end-placeholder="到期结束日期"/>
    <TreeSelect
      v-model="query.departId"
      :options="departs"
      :load-options="loadDeparts"
      class="newTree-item"
      placeholder="选择所在部门"
      style="width:160px !important;"
      @input="crud.toQuery"
    />
    <el-select v-model="query.certificationType" clearable size="small" placeholder="证书证明类型" class="filter-item"
               style="width: 130px" @change="certificationTypeChange">
      <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                 :value="item.value"/>
    </el-select>
    <el-select v-if="query.certificationType===typeOptions[0].value || query.certificationType===typeOptions[1].value"
               v-model="query.jobType" filterable allow-create clearable
               size="small" placeholder="工种类型"
               class="filter-item"
               style="width: 130px" @change="crud.toQuery">
      <el-option v-for="item in jobTypeOptions" :key="item.value" :label="item.value" :value="item.value"/>
    </el-select>
    <rrOperation/>
  </div>
</template>

<script>
import {header} from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getEquipmentByExample} from "@/api/tools/equipment";
import {getDepts, getDeptTree} from "@/api/system/dept";

export default {
  components: {rrOperation, DateRangePicker, TreeSelect},
  mixins: [header()],
  props: {
    typeOptions: {
      type: Array,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      departs: [],
      jobTypeOptions: [
        {
          value: '叉车'
        },
        {
          value: '电工'
        },
        {
          value: '危险品作业'
        },
        {
          value: '金属焊接/切割'
        }
      ]
    }
  },
  created() {
    this.getTopDept()
  },
  methods: {
    // 获取所在公司的部门树结构
    getTopDept() {
      getDeptTree().then(res => {
        this.departs = res.content
      })
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    // 获取弹窗内使用部门数据
    loadDeparts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 监控证书种类变化
    certificationTypeChange(val) {
      this.$forceUpdate()
      this.query.jobType = null
      if (val === this.typeOptions[0].value) {
        this.jobTypeOptions = [
          {
            value: '叉车'
          },
          {
            value: '电工'
          },
          {
            value: '危险品作业'
          },
          {
            value: '金属焊接/切割'
          },
          {
            value: '其它'
          }
        ]
      } else if (val === this.typeOptions[1].value) {
        this.jobTypeOptions = [
          {
            value: '内审员'
          },
          {
            value: '计量员'
          },
          {
            value: '其它'
          }
        ]
      }
    }
  }
}
</script>
