<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('departments')" @dblclick="handleDeptDbClick()">
        <div class="card-panel-icon-wrapper icon-dept">
          <svg-icon icon-class="dept" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Departments
          </div>
          <count-to :start-val="0" :end-val="departmentCount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('members')" @dblclick="handleUserDbClick()">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Members
          </div>
          <count-to :start-val="0" :end-val="memberCount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('fileCategories')" @dblclick="handleFileCategoryDbClick()">
        <div class="card-panel-icon-wrapper icon-nested">
          <svg-icon icon-class="nested" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            FileCategories
          </div>
          <count-to :start-val="0" :end-val="fileCategoryCount" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('localStorages')" @dblclick="handleFileDbClick()">
        <div class="card-panel-icon-wrapper icon-doc">
          <svg-icon icon-class="doc" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Files
          </div>
          <count-to :start-val="0" :end-val="fileCount" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import crudOverview from '@/api/overview/overview'
import CRUD from '@crud/crud'
import { getOverViewAll } from '@/api/overview/overview'

export default {
  components: {
    CountTo
  },
  cruds() {
    return CRUD({ title: '概览', url: 'api/overview', crudMethod: { ...crudOverview } })
  },
  data() {
    return {
      departmentCount: 123,
      memberCount: 0,
      fileCategoryCount: 0,
      fileCount: 103
    }
  },
  mounted: function() {
    this.getOverView()
  },
  methods: {
    getOverView() {
      getOverViewAll().then(res => {
        // alert(JSON.stringify(res))
        this.departmentCount = res.dept
        this.memberCount = res.user
        this.fileCategoryCount = res.fileCategory
        this.fileCount = res.file
      }).catch(() => {
      })
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleDeptDbClick() {
      this.$router.push(
        {
          path: '/system/dept',
          query: {}
        })
    },
    handleUserDbClick() {
      this.$router.push(
        {
          path: '/system/user',
          query: {}
        })
    },
    handleFileCategoryDbClick() {
      this.$router.push(
        {
          path: '/sys-tools/filecategory',
          query: {}
        })
    },
    handleFileDbClick() {
      this.$router.push(
        {
          path: '/sys-tools/file',
          query: {}
        })
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
    height: 108px;
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

      .icon-dept {
        background: #40c9c6;
      }

      .icon-people {
        background: #36a3f7;
      }

      .icon-nested {
        background: #f4516c;
      }

      .icon-doc {
        background: #34bfa3
      }
    }

    .icon-dept {
      color: #40c9c6;
    }

    .icon-people {
      color: #36a3f7;
    }

    .icon-nested {
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
      font-size: 48px;
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
