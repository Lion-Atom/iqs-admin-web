<template>
  <el-container class="app-container">
    <el-aside>Aside</el-aside>
    <el-container>
      <el-header>
        <el-row :gutter="12">
          <el-col :span="4">
            <el-card shadow="hover" @dblclick.native="routerTarget('/training/train-schedule')">
              <el-button type="text" size="medium" icon="el-icon-date" @click="catalogueType = 'schedule'">培训安排
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @dblclick.native="routerTarget('/training/new-staff')">
              <el-button type="text" size="medium" icon="el-icon-s-custom" @click="catalogueType = 'newStaff'">新员工
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @dblclick.native="routerTarget('/training/certificate')">
              <el-button type="text" size="medium" icon="el-icon-tickets" @click="catalogueType = 'certificate'">证书
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @dblclick.native="routerTarget('/training/skill-matrix')">
              <el-button type="text" size="medium" icon="el-icon-s-grid" @click="catalogueType = 'skillMatrix'">员工能力矩阵
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @dblclick.native="routerTarget('/training/train-material')">
              <el-button type="text" size="medium" icon="el-icon-document" @click="catalogueType = 'trainMaterial'">
                培训材料
              </el-button>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card shadow="hover" @dblclick.native="routerTarget('/training/train-exam')">
              <el-button type="text" size="medium" icon="el-icon-edit" @click="catalogueType = 'trainExam'">培训考试
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
  # 新员工入职培训分为两步：1.开启新员工培训；2.是否完成入职培训的确认
  # 完成新员工入职培训依据：须上传确认完成签字页或者现场培训认可证明等
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'certificate'">
          <div @dblclick="routerTarget('/training/certificate')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/certificate">
                  <i class="el-icon-tickets"></i>证书
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 邮件服务器的SMTP地址，可选，默认为smtp,如smtp.163.com和smtp.qq.com等等
  # 邮件服务器的SMTP端口，可选，默认465或者25
  # 发件人（必须正确，否则发送失败）
  # 用户名，默认为发件人邮箱前缀
  # 密码（注意，某些邮箱需要为SMTP服务单独设置密码即发送开启验证后生成的登录，如QQ和163等等）
  # 是否开启ssl，默认开启
  # Tips:发送报554,请检查测试发送的内容是否合法，可适当修改为正式用词
  # 可支持本地图片发送，远程功能暂未开启
        </pre>
          </div>
        </el-card>
        <el-card v-if="catalogueType === 'skillMatrix'">
          <div @dblclick="routerTarget('/training/skill-matrix')">
            <blockquote class="my-blockquote">
              <el-link>
                <router-link to="/training/train-material">
                  <i class="el-icon-s-grid"></i>员工能力矩阵
                </router-link>
              </el-link>
            </blockquote>
            <pre class="my-code">
  # 邮件服务器的SMTP地址，可选，默认为smtp,如smtp.163.com和smtp.qq.com等等
  # 邮件服务器的SMTP端口，可选，默认465或者25
  # 发件人（必须正确，否则发送失败）
  # 用户名，默认为发件人邮箱前缀
  # 密码（注意，某些邮箱需要为SMTP服务单独设置密码即发送开启验证后生成的登录，如QQ和163等等）
  # 是否开启ssl，默认开启
  # Tips:发送报554,请检查测试发送的内容是否合法，可适当修改为正式用词
  # 可支持本地图片发送，远程功能暂未开启
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
  # 邮件服务器的SMTP地址，可选，默认为smtp,如smtp.163.com和smtp.qq.com等等
  # 邮件服务器的SMTP端口，可选，默认465或者25
  # 发件人（必须正确，否则发送失败）
  # 用户名，默认为发件人邮箱前缀
  # 密码（注意，某些邮箱需要为SMTP服务单独设置密码即发送开启验证后生成的登录，如QQ和163等等）
  # 是否开启ssl，默认开启
  # Tips:发送报554,请检查测试发送的内容是否合法，可适当修改为正式用词
  # 可支持本地图片发送，远程功能暂未开启
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
  # 邮件服务器的SMTP地址，可选，默认为smtp,如smtp.163.com和smtp.qq.com等等
  # 邮件服务器的SMTP端口，可选，默认465或者25
  # 发件人（必须正确，否则发送失败）
  # 用户名，默认为发件人邮箱前缀
  # 密码（注意，某些邮箱需要为SMTP服务单独设置密码即发送开启验证后生成的登录，如QQ和163等等）
  # 是否开启ssl，默认开启
  # Tips:发送报554,请检查测试发送的内容是否合法，可适当修改为正式用词
  # 可支持本地图片发送，远程功能暂未开启
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
