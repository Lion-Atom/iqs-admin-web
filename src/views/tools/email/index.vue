<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;">
    <el-tab-pane label="邮箱配置" name="first">
      <Config />
    </el-tab-pane>
    <el-tab-pane label="发送邮件" name="second">
      <Send />
    </el-tab-pane>
    <el-tab-pane label="使用说明" name="third">
      <div>
        <blockquote class="my-blockquote"> 邮件服务器配置</blockquote>
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
        <blockquote class="my-blockquote">更多帮助</blockquote>
        <pre class="my-code">更多帮助请查看网上教程：<a style="color:#009688"
                                            href="https://www.wealsoft.com/article/art_viewpage.aspx?bid=2&aid=7"
                                            target="_blank"
        >[教程]常见邮箱开通SMTP设置说明</a></pre>
        <!--        <pre class="my-code">更多帮助请查看文档：<a style="color:#009688" href="http://hutool.mydoc.io/#text_319499" target="_black">hutool工具包</a></pre>-->
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Config from './config'
import Send from './send'
export default {
  name: 'Email',
  components: { Config, Send },
  data() {
    return {
      activeName: 'second'
    }
  }
}
</script>

<style scoped>
</style>
