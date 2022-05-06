<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.blurry" clearable size="small" placeholder="输入新员工名称搜索" style="width: 200px;"
              class="filter-item" @keyup.enter.native="crud.toQuery"/>

    <date-range-picker v-model="query.createTime" class="date-item" @input="dateTimeChange()" start-placeholder="录入开始日期"
                       end-placeholder="录入结束日期" />
    <TreeSelect
      v-model="query.departId"
      :options="departs"
      :load-options="loadDeparts"
      class="newTree-item"
      placeholder="选择验收部门"
      style="width:160px !important;"
      @input="crud.toQuery"
    />
    <el-select v-model="query.staffType" clearable size="small" placeholder="员工种类" class="filter-item"
               style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in typeOptions" :key="item.value" :label="item.label + ' - ' +item.value "
                 :value="item.value"/>
    </el-select>
    <el-select v-model="query.isFinished" clearable size="small" placeholder="完成状态" class="filter-item"
               style="width: 120px" @change="crud.toQuery">
      <el-option v-for="item in finishStatus" :key="item.value" :label="item.label" :value="item.value"/>
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
    finishStatus: {
      type: Array,
      required: true
    },
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
    }
  },
  created() {
    this.getTopDept()
  },
  methods:{
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
    loadDeparts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
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
    }
  }
}
</script>
