<template>
  <el-container class="app-container">
    <el-aside style="width: 320px!important;background: #fff !important;padding: 8px 10px !important;">
      <el-card class="box-card" shadow="hover">
        <div class="head-container">
          <div>
            <date-range-picker v-model="query.deadline" class="date-item" @input="dateTimeChange()"
                               start-placeholder="截止开始日期"
                               end-placeholder="截止结束日期"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索
            </el-button>
            <el-button v-if="crud.optShow.reset" class="filter-item" size="mini" type="warning"
                       icon="el-icon-refresh-left"
                       @click="crud.resetQuery()">重置
            </el-button>
            <el-button class="filter-item" size="mini" type="danger" icon="el-icon-upload"
                       @click="flushTrainTip">刷新
            </el-button>
          </div>
        </div>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :data="crud.data"
          style="width: 100%;"
          @selection-change="crud.selectionChangeHandler"
          @row-dblclick="goToTarget"
          :row-class-name="btnType"
        >
          <el-table-column label="事件名称" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" placement="right-start">
                <div slot="content">
                  <el-descriptions border :column="1">
                    <template slot="title">
                      {{ scope.row.bindingName }}
                    </template>
                    <el-descriptions-item label="类型">{{ scope.row.trainType }}</el-descriptions-item>
                    <el-descriptions-item label="截止日期">{{ scope.row.deadline }}</el-descriptions-item>
                    <el-descriptions-item label="剩余天数">{{ scope.row.remainDays }}</el-descriptions-item>
                    <el-descriptions-item label="状态">{{ scope.row.status }}</el-descriptions-item>
                  </el-descriptions>
                </div>
                <span>
                  {{ scope.row.bindingName }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态"/>
        </el-table>
        <!--分页组件-->
        <pagination/>
      </el-card>
    </el-aside>
    <el-container>
      <el-header>
        <el-row :gutter="12">
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'schedule'"
                     @dblclick.native="routerTarget('/training/manage/schedule')">
              <el-button type="text" size="medium" icon="el-icon-date">培训计划
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'trainMaterial'"
                     @dblclick.native="routerTarget('/training/manage/material')">
              <el-button type="text" size="medium" icon="el-icon-document">培训材料</el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'newStaff'"
                     @dblclick.native="routerTarget('/training/manage/newStaff')">
              <el-button type="text" size="medium" icon="el-icon-s-custom">培训记录
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'trainExam'"
                     @dblclick.native="routerTarget('/training/manage/exam')">
              <el-button type="text" size="medium" icon="el-icon-edit">培训考试
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'certificate'"
                     @dblclick.native="routerTarget('/training/manage/certification')">
              <el-button type="text" size="medium" icon="el-icon-tickets">培训证书
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'skillMatrix'"
                     @dblclick.native="routerTarget('/training/manage/skillMatrix')">
              <el-button type="text" size="medium" icon="el-icon-s-grid">员工能力矩阵
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-card v-if="catalogueType === 'schedule'" shadow="hover">
          <div @dblclick="routerTarget('/training/train-schedule')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/train-schedule">
                  <i class="el-icon-date"></i>培训计划
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 培训计划主要由标题、内容、培训人、培训时间、培训地点、培训人数、培训机构和费用、考试、发证等部分构成
  # 培训类型分为内部培训和外部培训两类
  # 培训填写培训时间后可以选择提前到期提醒功能，如需延期可在填写延期原因后重新提交新的培训时间
  # 报名截止时间默认不可超出已设定的培训开始时间
  # 费用项目可根据实际情况选填，默认单位为“元”
  # 人数上限限定了可申请与会的人员数目，培训未结束前可<b>撤销报名</b>,撤销后该员工相关考试记录、培训记录将自动回收
  # 已申请的人员可在报名截止时间之前凭个人账号登陆系统撤销与会申请
  # 培训发布前根据需要上传相关培训材料以及考试试题选择性上传等
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'newStaff'">
          <div @dblclick="routerTarget('/training/new-staff')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/new-staff">
                  <i class="el-icon-s-custom"></i>培训记录
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 员工培训记录是根据<b>培训计划报名成功</b>后生成的员工记录，关联考试的培训需要考试通过后才能确认完成
  # 制造企业中对人员的管理分为两部分：DL（Direct Labor）和IDL（Indirect Labor），即直接员工及间接员工
  # 直接工人：一般是现场工人，他们负责操作机台或流水线，对产品的品质负直接责任；如操作工、车工、钳工、装配工等
  # 间接工人：不直接参与生产加工的人员；如车间主任、库管、工艺、统计（不包括管理部门的）、叉车驾驶员、维修工等
  # 直接工人培训地点多为车间现场，对于操作要求极为严格和慎重，因此需要通过一系列的教育训练、鉴定管理、考核管理、
    津贴管理、品质管理、签约管理等系统化培训使员工的工作质量、工作态度达到企业的要求，并为企业创造更多的价值和利益
  # 员工培训分为两部分：1.新员工培训基础信息（<b>同步相关培训计划</b>后生成）；2.培训的确认单、完成证明等附件上传
  # 完成培训依据：须上传确认完成签字页或者现场培训认可证明等文件
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'certificate'">
          <div @dblclick="routerTarget('/training/certification')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/certification">
                  <i class="el-icon-tickets"></i>培训证书
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 培训证书是制造企业工作人员具备某项职业技能或者匹配其岗位的自身证明
  # 本系统将认证分为特殊工种证明、三方机构证明和在职上岗证三大类，所有认证都具备时效性即需要及时更新
  # 特殊工种证明，如叉车、电工、危险品作业以及金属焊接/切割等技术工种，支持客户自定义输入，需要
  # 三方机构证明，如内审员、计量员等，需要填写签发机构信息并上传有效证件正/反面等
  # <b style="color: red;">在职上岗证</b>，是由是员工上岗前经过系统培训并通过<b>培训考试</b>获得<b>签发证书</b>具备对应职位的上岗资格，需要填写相关的培训时间、内容及考试结果等信息
  # 培训-认证查看面向系统用户是开放的，但删改操作仅限创建者和管理员
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'skillMatrix'">
<!--          <div @dblclick="routerTarget('/training/skill-matrix')">-->
          <div>
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/skill-matrix">
                  <i class="el-icon-s-grid"></i>员工能力矩阵
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 功能暂未开启
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'trainMaterial'">
          <div @dblclick="routerTarget('/training/train-material')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/train-material">
                  <i class="el-icon-document"></i>培训材料
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 培训材料是基于各部门培训相关的资料准备、收集并上传到本系统从而实现所见即可根据需要下载，并支持材料版本的更新迭代
  # 培训材料是分部门管理的，用户创建目标部门后可以进入目标部门下上传相关的材料或者查看、下载、编辑权限内的现有材料
  # 培训材料下载查看面向系统用户是开放的，但删改操作仅限创建者和管理员
  # 培训材料主要属性包括材料名称、编写作者、属于内部还是外部材料以及材料符合标准的验证专业工具、材料本身大小、格式等
  # 材料标准检测的专业工具分为内部和外部两大类，其中内部包括OPL（One Point Lesson）和L&L（Lesson & Learn），外部主要是GB/ISO（即国标）
  # 材料即培训资料上传支持多格式：PDF\XLSX\JPG\TEXT等，基本覆盖了市面上常见格式的文件
  # 材料的版本定义因人而异因此版本此处暂未做强制推送，支持用户自定义版本
  # 材料描述主要是材料内容简介、创作背景、意义等
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'trainExam'">
          <div @dblclick="routerTarget('/training/train-exam')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/train-exam">
                  <i class="el-icon-edit"></i>培训考试
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 培训考试来自<b>培训计划</b>，是基于各部门培训的成果的一个检验，主要分为两个模块:<b>考试题库</b>和<b>考试信息</b>
  # 培训考试是分部门管理的，用户创建目标部门后可以进入目标部门下上传相关的材料或者查看、下载、编辑权限内的现有材料
  # 考试题库中文件仅限上传者和管理员有权限下载查看和删改；也是防止泄题、随意篡改等情况出现
  # 考试信息是对参与培训人员的考试信息汇总，集中记录该部门下参与培训人员的考试日期、内容、成绩、通过与否及补考日期等信息
  # 考试信息中每场考试信息都须上传本次考试的考生答卷，补考日期来自上次考核未通过而设定的“下次考试日期”，当前考试次数暂不设限
        </pre>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import crudTip from '@/api/tools/train/tip'
import eForm from "@/views/tools/training/management/schedule/module/form";
import pagination from "@crud/Pagination";
import udOperation from "@crud/UD.operation";
import DateRangePicker from "@/components/DateRangePicker";
import CRUD, {header, presenter} from "@crud/crud";
import {getByMethodName} from "@/api/system/timing";
import {validIsNotNull} from "@/utils/validationUtil";

export default {
  name: 'TrainOverview',
  components: {eForm, pagination, udOperation, DateRangePicker},
  cruds() {
    return CRUD({
      title: '培训提示',
      url: 'api/train/tip',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudTip}
    })
  },
  mixins: [header(), presenter()],
  data() {
    return {
      catalogueTypes: [
        'schedule',
        'newStaff',
        'certificate',
        'skillMatrix',
        'trainMaterial',
        'trainExam'
      ],
      catalogueType: 'schedule',
      permission: {},
      methodName: 'checkIsToTrain',
      trainTypes: [
        '日程安排',
        '证书'
      ]
    }
  },
  methods: {
    // 跳转
    routerTarget(tar) {
      // alert(tar)
      this.$router.push(
        {
          path: tar
        })
    },
    // 监控时间输入框变化，强制刷新
    dateTimeChange() {
      this.$forceUpdate()
      this.crud.toQuery()
    },
    goToTarget(row) {
      if (row.trainType === '培训计划') {
        this.$router.push(
          {
            path: '/training/manage/schedule',
            query: {}
          })
      } else if (row.trainType === '证书') {
        this.$router.push(
          {
            path: '/training/manage/certification',
            query: {}
          })
      }
    },
    // 调用同步-重新拉取走查培训提示信息
    flushTrainTip() {
      getByMethodName(this.methodName).then(res => {
        this.crud.resetQuery()
      })
    },
    // 根据有效期设置提醒样式
    btnType({row, rowIndex}) {
      const type = row.trainType
      const status = row.status
      if (type === this.trainTypes[0]) {
        // 日程安排
        if (status === '已关闭') {
          return 'alert-type'
        } else {
          return ''
        }
      } else if (type === this.trainTypes[1]) {
        // 证书认证
        if (status === '已过期') {
          return 'alert-type'
        } else if (status === '即将过期') {
          return 'warn-type'
        } else {
          return ''
        }
      }
    }
  }
}

</script>
<style>
.el-table .alert-type {
  color: #C0C0C0;
}

.el-table .warn-type {
  color: #ffa500;
}
</style>
