<template>
  <el-container class="app-container">
    <el-aside>Aside</el-aside>
    <el-container>
      <el-header>
        <el-row :gutter="12">
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'schedule'" @dblclick.native="routerTarget('/training/train-schedule')">
              <el-button type="text" size="medium" icon="el-icon-date">培训安排
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'newStaff'" @dblclick.native="routerTarget('/training/new-staff')">
              <el-button type="text" size="medium" icon="el-icon-s-custom">新员工
              </el-button>
            </el-card>
          </el-col>

          <el-col :span="4">
            <el-card shadow="hover"  @click.native="catalogueType = 'certificate'" @dblclick.native="routerTarget('/training/certification')">
              <el-button type="text" size="medium" icon="el-icon-tickets">证书
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'skillMatrix'" @dblclick.native="routerTarget('/training/skill-matrix')">
              <el-button type="text" size="medium" icon="el-icon-s-grid">员工能力矩阵
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'trainMaterial'" @dblclick.native="routerTarget('/training/train-material')">
              <el-button type="text" size="medium" icon="el-icon-document">培训材料</el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @click.native="catalogueType = 'trainExam'" @dblclick.native="routerTarget('/training/train-exam')">
              <el-button type="text" size="medium" icon="el-icon-edit" >培训考试
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-card v-if="catalogueType === 'schedule'" >
          <div @dblclick="routerTarget('/training/train-schedule')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/train-schedule">
                  <i class="el-icon-date"></i>培训安排
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 培训主要由标题、内容、培训人、培训时间、培训地点、培训人数、培训机构和费用等部分构成
  # 培训类型分为内部培训和外部培训两类
  # 培训填写培训时间后可以选择提前到期提醒功能，如需延期可在填写延期原因后重新提交新的培训时间
  # 报名截止时间默认不可超出已设定的培训开始时间
  # 费用项目可根据实际情况选填，默认单位为“元”
  # 人数上限限定了可申请与会的人员数目
  # 已申请的人员可在报名截止时间之前凭个人账号登陆系统撤销与会申请
  # 培训发布前根据需要选择是否需要上传签到表和问卷调查表
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'newStaff'">
          <div @dblclick="routerTarget('/training/new-staff')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/new-staff">
                  <i class="el-icon-s-custom"></i>新员工
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 新员工入职培训针对新员工入职根据自身工种参与的新人入职培训
  # 制造企业中对人员的管理分为两部分：DL（Direct Labor）和IDL（Indirect Labor），即直接员工及间接员工
  # 直接工人：一般是现场工人，他们负责操作机台或流水线，对产品的品质负直接责任；如操作工、车工、钳工、装配工等
  # 间接工人：不直接参与生产加工的人员；如车间主任、库管、工艺、统计（不包括管理部门的）、叉车驾驶员、维修工等
  # 直接工人入职培训地点多为车间现场，对于操作要求极为严格和慎重，因此需要通过一系列的教育训练、鉴定管理、考核管理、
    津贴管理、品质管理、签约管理等系统化培训使员工的工作质量、工作态度达到企业的要求，并为企业创造更多的价值和利益
  # 新员工入职培训分为两部分：1.新员工培训基础信息；2.入职培训的确认单、完成证明等附件上传
  # 完成新员工入职培训依据：须上传确认完成签字页或者现场培训认可证明等文件
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'certificate'">
          <div @dblclick="routerTarget('/training/certification')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/certification">
                  <i class="el-icon-tickets"></i>证书
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 认证是制造企业工作人员具备某项职业技能或者匹配其岗位的自身证明
  # 本系统将认证分为特殊工种证明、三方机构证明和在职上岗证三大类，所有认证都具备时效性即需要及时更新
  # 特殊工种证明，如叉车、电工、危险品作业以及金属焊接/切割等技术工种，支持客户自定义输入，需要
  # 三方机构证明，如内审员、计量员等，需要填写签发机构信息并上传有效证件正/反面等
  # 在职上岗证，是员工上岗前经过系统培训并通过培训考试获得签发证书具备对应职位的上岗资格，需要填写相关的培训时间、内容及考试结果等信息
  # 培训-认证查看面向系统用户是开放的，但删改操作仅限创建者和管理员
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'skillMatrix'">
          <div @dblclick="routerTarget('/training/skill-matrix')">
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
  # 培训考试是基于各部门培训的成果的一个检验，主要分为两个模块:考试题库和考试信息
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
export default {
  name: 'TrainManagement',
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
      catalogueType: 'schedule'
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
    }
  }
}

</script>

<style scoped>

</style>
