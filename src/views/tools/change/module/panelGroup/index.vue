<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleChartData('draft')"
           @dblclick="handleDbClick('draft',draftStatus,true)">
        <div class="card-panel-icon-wrapper icon-unlock">
          <svg-icon icon-class="unlock" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            1.起草变更信息
          </div>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="draftStep"
                       :status="draftStatus"></el-progress>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleChartData('management')"
           @dblclick="handleDbClick('management',draftStatus,unlockStep.indexOf(2)>-1)">
        <div v-if="unlockStep.indexOf(2)>-1" class="card-panel-icon-wrapper icon-unlock">
          <svg-icon icon-class="unlock" class-name="card-panel-icon"/>
        </div>
        <div v-else class="card-panel-icon-wrapper icon-lock">
          <svg-icon icon-class="lock" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            2.变更信息管理
          </div>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="manageStep" :status="manageStatus"></el-progress>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel" @click="handleChartData('approve')"
           @dblclick="handleDbClick('approve',draftStatus,unlockStep.indexOf(3)>-1)">
        <div v-if="unlockStep.indexOf(3)>-1" class="card-panel-icon-wrapper icon-unlock">
          <svg-icon icon-class="unlock" class-name="card-panel-icon"/>
        </div>
        <div v-else class="card-panel-icon-wrapper icon-lock">
          <svg-icon icon-class="lock" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            3.变更批准/关闭
          </div>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="approveStep" :status="approveStatus"></el-progress>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>

import crudChange from '@/api/overview/overview'
import CRUD from '@crud/crud'

export default {
  components: {},
  cruds() {
    return CRUD({title: '概览', url: 'api/change', crudMethod: {...crudChange}})
  },
  props: ['draftStep', 'draftStatus', 'manageStep', 'manageStatus', 'approveStep', 'approveStatus', 'unlockStep'],
  data() {
    return {}
  },
  mounted: function () {
    this.getChangeInfo()
  },
  methods: {
    // todo 获取变更信息
    getChangeInfo() {
      // alert(JSON.stringify(this.$props.unlockStep))
    },
    // todo 点击面板触发事件
    handleChartData(type) {
      // this.$emit('handleChartData', type)
    },
    handleDbClick(type, status, flag) {
      // alert(status)
      // 权限确认是否可进入
      if (flag) {
        let msg = {
          type: type,
          isActive: true
        }
        this.$emit('handleChartData', msg)
      } else {
        if (status === 'exception') {
          this.$message({
            message: 'The previous step has been refused ! 变更请求未被接受，无法解锁!',
            type: 'warning'
          })
        } else {
          this.$message({
            message: 'The previous step has not been completed ! 上一步尚未完成!',
            type: 'warning'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 188px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-unlock {
        background: #40c9c6;
      }

      .icon-lock {
        background: #f4516c;
      }

      .icon-doc {
        background: #34bfa3
      }
    }

    .icon-unlock {
      color: #40c9c6;
    }

    .icon-lock {
      color: #f4516c;
    }

    .icon-doc {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 108px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
