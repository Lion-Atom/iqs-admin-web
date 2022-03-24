<template>
  <div>
    <el-descriptions style="margin-top: 15px;" border :column="1">
      <template slot="title">
        <div>
          <span>{{ template.name }}
            <el-button
              v-if="!planDisabled"
              type="text"
              icon="el-icon-refresh-left"
              @click="initTemplateInfo"
            />
          </span>
        </div>
      </template>
      <!--<template slot="extra">
        <el-button
          v-if="!planDisabled"
          type="primary"
          size="small"
          @click="saveTemplateContent"
        >保存
        </el-button>
      </template>-->
      <el-descriptions-item label="基本信息">
        <div @dblclick="beforeInfoClose">
          <div v-if="basicInfoVisible === true">
            <el-descriptions>
              <template slot="title">
                <span>VDA 6.3 审核基础信息</span>
              </template>
              <template slot="extra">
                <i v-if="!closeMin" class="el-icon-zoom-out" @click="basicInfoVisible = false"/>
                <el-button
                  v-if="closeMin"
                  type="primary"
                  size="small"
                  :disabled="planDisabled"
                  @click="saveTemplateContent"
                >保存
                </el-button>
              </template>
              <el-descriptions-item label="审核编号">{{ plan.auditNo }}</el-descriptions-item>
              <el-descriptions-item label="计划时间">{{ plan.planTime }}</el-descriptions-item>
              <el-descriptions-item label="审核地点">{{ plan.address }}</el-descriptions-item>
              <el-descriptions-item label="审核产线">{{ plan.line }}</el-descriptions-item>
              <el-descriptions-item label="审核原因">{{ plan.reason }}</el-descriptions-item>
              <el-descriptions-item label="审核人员">
                <div>
                  <div class="tag-group">
                    <el-tag
                      v-for="item in auditorDatas"
                      :key="item.id"
                      class="tag-list"
                      size="small"
                      :disable-transitions="false"
                    >
                      {{ item.username }}
                    </el-tag>
                  </div>
                </div>
              </el-descriptions-item>
              <!--模板内容基础信息-->
              <el-descriptions-item label="审核时间" label-class-name="my-label">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-date-picker
                    v-if="auditTimeInputVisible"
                    ref="auditTimeInput"
                    v-model="inputTimeValue"
                    type="datetime"
                    size="mini"
                    default-time="12:00:00"
                    placeholder="请填写审核日期时间"
                    suffix-icon="el-icon-date"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="timeChange"
                  >
                    {{ content.auditTime }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.auditTime }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="DUNS编码" label-class-name="my-label">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="dunsNumInputVisible"
                    ref="dunsNumInput"
                    v-model="inputDunsNumValue"
                    size="mini"
                    placeholder="请输入内容"
                    @keyup.enter.native="handleDunsInputConfirm"
                    @blur="handleDunsInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="dunsChange"
                  >
                    {{ content.dunsNum }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.dunsNum }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="详细地址" label-class-name="my-label">
                <el-input
                  v-if="addressInputVisible"
                  ref="addressInput"
                  v-model="inputAddressValue"
                  size="mini"
                  type="textarea"
                  style="min-width: 300px!important;"
                  maxlength="500"
                  show-word-limit
                  autosize
                  placeholder="请输入内容"
                  suffix-icon="el-icon-edit"
                  @blur="handleInputAddressConfirm"
                />
                <el-button
                  v-else
                  class="myBtn"
                  type="text"
                  style="padding: 0 !important;font-size: 12px !important;display: inline-block;"
                  icon="el-icon-edit"
                  :disabled="planDisabled"
                  @click.native="addressChange"
                >
                  {{ content.address }}
                </el-button>
              </el-descriptions-item>
              <!--被审核组织负责人姓名-->
              <el-descriptions-item label="被审核组织负责人姓名" label-class-name="my-label">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="chargeNameInputVisible"
                    ref="chargeNameInput"
                    v-model="inputChargeNameValue"
                    size="mini"
                    placeholder="请输入姓名"
                    @keyup.enter.native="handleChargeNameInputConfirm"
                    @blur="handleChargeNameInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="chargeNameChange"
                  >
                    {{ content.chargeName }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.chargeName }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织负责人手机号码">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="chargePhoneInputVisible"
                    ref="chargePhoneInput"
                    v-model="inputChargePhoneValue"
                    size="mini"
                    placeholder="请输入手机号码"
                    @keyup.enter.native="handleChargePhoneInputConfirm"
                    @blur="handleChargePhoneInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="chargePhoneChange"
                  >
                    {{ content.chargePhone }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.chargePhone }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织负责人邮箱">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="chargeEmailInputVisible"
                    ref="chargeEmailInput"
                    v-model="inputChargeEmailValue"
                    size="mini"
                    placeholder="请输入邮箱"
                    @keyup.enter.native="handleChargeEmailInputConfirm"
                    @blur="handleChargeEmailInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="chargeEmailChange"
                  >
                    {{ content.chargeEmail }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.chargeEmail }}
                </div>
              </el-descriptions-item>
              <!--被审核组织质量负责人-->
              <el-descriptions-item label="被审核组织质量负责人姓名" label-class-name="my-label">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="qualityNameInputVisible"
                    ref="qualityNameInput"
                    v-model="inputQualityNameValue"
                    size="mini"
                    placeholder="请输入姓名"
                    @keyup.enter.native="handleQualityNameInputConfirm"
                    @blur="handleQualityNameInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="qualityNameChange"
                  >
                    {{ content.qualityName }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.qualityName }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织质量负责人手机号码">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="qualityPhoneInputVisible"
                    ref="qualityPhoneInput"
                    v-model="inputQualityPhoneValue"
                    size="mini"
                    placeholder="请输入手机号码"
                    @keyup.enter.native="handleQualityPhoneInputConfirm"
                    @blur="handleQualityPhoneInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="qualityPhoneChange"
                  >
                    {{ content.qualityPhone }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.qualityPhone }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织质量负责人邮箱">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="qualityEmailInputVisible"
                    ref="qualityPhoneInput"
                    v-model="inputQualityEmailValue"
                    size="mini"
                    placeholder="请输入邮箱"
                    @keyup.enter.native="handleQualityEmailInputConfirm"
                    @blur="handleQualityEmailInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="qualityEmailChange"
                  >
                    {{ content.qualityEmail }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.qualityEmail }}
                </div>
              </el-descriptions-item>
              <!--被审核组织生产负责人-->
              <el-descriptions-item label="被审核组织生产负责人姓名" label-class-name="my-label">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="prodNameInputVisible"
                    ref="prodNameInput"
                    v-model="inputProdNameValue"
                    size="mini"
                    placeholder="请输入姓名"
                    @keyup.enter.native="handleProdNameInputConfirm"
                    @blur="handleProdNameInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="prodNameChange"
                  >
                    {{ content.productName }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.productName }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织生产负责人手机号码">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="prodPhoneInputVisible"
                    ref="prodPhoneInput"
                    v-model="inputProdPhoneValue"
                    size="mini"
                    placeholder="请输入手机号码"
                    @keyup.enter.native="handleProdPhoneInputConfirm"
                    @blur="handleProdPhoneInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="prodPhoneChange"
                  >
                    {{ content.productPhone }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.productPhone }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织生产负责人邮箱">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="prodEmailInputVisible"
                    ref="prodEmailInput"
                    v-model="inputProdEmailValue"
                    size="mini"
                    placeholder="请输入手机号码"
                    @keyup.enter.native="handleProdEmailInputConfirm"
                    @blur="handleProdEmailInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="prodEmailChange"
                  >
                    {{ content.productEmail }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.productEmail }}
                </div>
              </el-descriptions-item>
              <!--被审核组织研发负责人-->
              <el-descriptions-item label="被审核组织研发负责人姓名" label-class-name="my-label">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="techNameInputVisible"
                    ref="techNameInput"
                    v-model="inputTechNameValue"
                    size="mini"
                    placeholder="请输入姓名"
                    @keyup.enter.native="handleTechNameInputConfirm"
                    @blur="handleTechNameInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="techNameChange"
                  >
                    {{ content.techName }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.techName }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织研发负责人手机号码">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="techPhoneInputVisible"
                    ref="techPhoneInput"
                    v-model="inputTechPhoneValue"
                    size="mini"
                    placeholder="请输入手机号码"
                    @keyup.enter.native="handleTechPhoneInputConfirm"
                    @blur="handleTechPhoneInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="techPhoneChange"
                  >
                    {{ content.techPhone }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.techPhone }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="被审核组织研发负责人邮箱">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="techEmailInputVisible"
                    ref="techEmailInput"
                    v-model="inputTechEmailValue"
                    size="mini"
                    placeholder="请输入手机号码"
                    @keyup.enter.native="handleTechEmailInputConfirm"
                    @blur="handleTechEmailInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="techEmailChange"
                  >
                    {{ content.techEmail }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.techEmail }}
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="产品类别">
                <div v-if="plan.approvalStatus !== '待审批'">
                  <el-input
                    v-if="prodTypeInputVisible"
                    ref="prodTypeInput"
                    v-model="inputProdTypeValue"
                    size="mini"
                    placeholder="请输入内容"
                    @keyup.enter.native="handleProdTypeInputConfirm"
                    @blur="handleProdTypeInputConfirm"
                  />
                  <el-button
                    v-else
                    type="text"
                    style="padding: 0 !important;font-size: 12px !important;"
                    icon="el-icon-edit"
                    :disabled="planDisabled"
                    @click.native="prodTypeChange"
                  >
                    {{ content.productType }}
                  </el-button>
                </div>
                <div v-else>
                  {{ content.productType }}
                </div>
              </el-descriptions-item>
              <!--过程产线注释，同 审核产线-->
              <!--              <el-descriptions-item label="过程产线">
                              <div v-if="plan.approvalStatus !== '待审批'">
                                <el-input
                                  v-if="processTypeInputVisible"
                                  ref="processTypeInput"
                                  v-model="inputProcessTypeValue"
                                  size="mini"
                                  placeholder="请输入内容"
                                  @keyup.enter.native="handleProTypeInputConfirm"
                                  @blur="handleProTypeInputConfirm"
                                />
                                <el-button
                                  v-else
                                  type="text"
                                  style="padding: 0 !important;font-size: 12px !important;"
                                  icon="el-icon-edit"
                                  @click.native="processTypeChange"
                                  :disabled="planDisabled"
                                >
                                  {{ content.processType }}
                                </el-button>
                              </div>
                              <div v-else>
                                {{ content.processType }}
                              </div>
                            </el-descriptions-item>-->
              <el-descriptions-item label="其他">
                <el-input
                  v-if="otherInputVisible"
                  ref="otherInput"
                  v-model="inputOtherValue"
                  size="mini"
                  type="textarea"
                  style="min-width: 300px!important;"
                  maxlength="500"
                  show-word-limit
                  autosize
                  placeholder="请输入内容"
                  suffix-icon="el-icon-edit"
                  @blur="handleInputOtherConfirm"
                />
                <el-button
                  v-else
                  class="myBtn"
                  type="text"
                  style="padding: 0 !important;font-size: 12px !important;display: inline-block;"
                  icon="el-icon-edit"
                  :disabled="planDisabled"
                  @click.native="otherChange"
                >
                  {{ content.other }}
                </el-button>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="1" border style="margin-top: 10px;">
              <template slot="title">
                <span>证书有效性</span>
              </template>
              <template slot="extra">
                <el-button
                  type="primary"
                  size="small"
                  :disabled="planDisabled"
                  @click="toAddCertificates"
                >添加证书
                </el-button>
              </template>
              <!--新增/编辑数据弹窗-->
              <el-descriptions-item label="证书列表">
                <el-table
                  ref="table"
                  v-loading="certificatesLoading"
                  :data="certificates"
                  style="width: 100%;"
                  :row-class-name="cerRowClassName"
                  @expand-change="expendCerSelected"
                >
                  <el-table-column type="expand">
                    <!--添加审核体系证书附件-->
                    <template slot-scope="props">
                      <!--也可启用下面注释部分的el-descriptions代替el-form-->
                      <el-form label-position="left" class="demo-table-expand">
                        <el-form-item label="认证体系名称">
                          <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="认证机构">
                          <span>{{ props.row.sgs }}</span>
                        </el-form-item>
                        <el-form-item label="认证号码">
                          <span>{{ props.row.cerNum }}</span>
                        </el-form-item>
                        <el-form-item label="有效期">
                          <span>{{ props.row.validDate }}</span>
                        </el-form-item>
                        <el-form-item label="证书附件列表">
                          <el-table
                            ref="table"
                            v-loading="cerFilesLoading"
                            :data="cerFiles"
                            style="width: 100%;"
                            highlight-current-row
                          >
                            <el-table-column
                              type="index"
                              width="50"
                              label="序号"
                            />
                            <el-table-column prop="name" label="附件名称" min-width="200">
                              <template slot-scope="scope">
                                <el-popover
                                  :content="'file/' + scope.row.type + '/' + scope.row.name"
                                  placement="top-start"
                                  title="路径"
                                  width="200"
                                  trigger="hover"
                                >
                                  <!--可下载文件-->
                                  <a
                                    slot="reference"
                                    :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.name"
                                    class="el-link--primary"
                                    style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                                    target="_blank"
                                    :download="scope.row.realName"
                                  >
                                    {{ scope.row.realName }}
                                  </a>
                                </el-popover>
                              </template>
                            </el-table-column>
                            <el-table-column prop="path" label="预览图">
                              <template slot-scope="{row}">
                                <el-image
                                  :src=" baseApi + '/file/' + row.type + '/' + row.name"
                                  :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.name]"
                                  fit="contain"
                                  lazy
                                  class="el-avatar"
                                >
                                  <div slot="error">
                                    <i class="el-icon-document"/>
                                  </div>
                                </el-image>
                              </template>
                            </el-table-column>
                            <el-table-column prop="size" label="大小" min-width="120"/>
                            <el-table-column prop="type" label="附件类型" min-width="120"/>
                            <el-table-column prop="createBy" label="创建者"/>
                            <!--   编辑与删除   -->
                            <el-table-column
                              label="操作"
                              min-width="130px"
                              align="center"
                              fixed="right"
                            >
                              <template slot-scope="scope">
                                <div>
                                  <!--删除-->
                                  <el-popover
                                    :ref="`delPlanFile-popover-${scope.$index}`"
                                    v-permission="permission.edit"
                                    placement="top"
                                    width="180"
                                  >
                                    <p>确定删除这个附件吗？</p>
                                    <div style="text-align: right; margin: 0">
                                      <el-button
                                        size="mini"
                                        type="text"
                                        @click="scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
                                      >取消
                                      </el-button>
                                      <el-button
                                        type="primary"
                                        size="mini"
                                        @click="deleteCerFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
                                      >确定
                                      </el-button>
                                    </div>
                                    <el-button
                                      slot="reference"
                                      v-permission="permission.edit"
                                      type="danger"
                                      icon="el-icon-delete"
                                      size="mini"
                                    />
                                  </el-popover>
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                          <el-button
                            type="primary"
                            style="margin-top: 8px;"
                            class="button-new-tag"
                            icon="el-icon-plus"
                            size="small"
                            @click="toUploadFile(props.row)"
                          >上传证书附件
                          </el-button>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="认证体系名称"/>
                  <el-table-column prop="sgs" label="认证机构"/>
                  <el-table-column prop="cerNum" label="认证号码"/>
                  <el-table-column label="有效期" :formatter="validDateFormatter"/>
                  <el-table-column prop="isOverdue" label="是否过期">
                    <template slot-scope="scope">
                      {{ scope.row.isOverdue ? '是' : '否' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="createBy" label="创建人"/>
                  <el-table-column prop="createTime" label="创建时间"/>
                  <!--   编辑与删除   -->
                  <el-table-column
                    label="操作"
                    width="160px"
                    align="center"
                    fixed="right"
                  >
                    <template slot-scope="scope">
                      <div>
                        <!--编辑-->
                        <el-button
                          slot="reference"
                          v-permission="permission.edit"
                          size="mini"
                          type="primary"
                          icon="el-icon-edit"
                          @click="editCertificate(scope.row)"
                        />
                        <!--删除-->
                        <el-popover
                          :ref="`delMem-popover-${scope.$index}`"
                          v-permission="permission.edit"
                          placement="top"
                          width="180"
                        >
                          <p>确定删除本条数据吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button
                              size="mini"
                              type="text"
                              @click="scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                            >取消
                            </el-button>
                            <el-button
                              type="primary"
                              size="mini"
                              @click="delCertificate(scope.row.id), scope._self.$refs[`delMem-popover-${scope.$index}`].doClose()"
                            >确定
                            </el-button>
                          </div>
                          <el-button
                            slot="reference"
                            v-permission="permission.edit"
                            type="danger"
                            icon="el-icon-delete"
                            size="mini"
                          />
                        </el-popover>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-button v-else type="text" icon="el-icon-zoom-in" @click="basicInfoVisible = true">查看VDA 6.3 审核基本信息明细
          </el-button>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="问题清单">
        <div @dblclick="beforeQuestClose">
          <div v-if="quesListVisible === true">
            <el-descriptions>
              <template slot="title">
                <span>VDA 6.3 问题清单</span>
              </template>
              <template slot="extra">
                <i v-if="!closeMin" class="el-icon-zoom-out" @click="quesListVisible = false"/>
                <el-button
                  v-if="closeMin"
                  type="primary"
                  size="small"
                  :disabled="planDisabled"
                  @click="saveTemplateScore"
                >保存
                </el-button>
              </template>
            </el-descriptions>
            <el-table
              ref="table"
              v-loading="scoreLoading"
              :data="templateScores"
              border
              style="width: 100%;"
              :row-class-name="tableRowClassName"
              @expand-change="expendScoreSelected"
            >
              <el-table-column type="expand">
                <!--添加审核体系证书附件-->
                <template slot-scope="props">
                  <!--也可启用下面注释部分的el-descriptions代替el-form-->
                  <el-form label-position="left" class="demo-table-expand">
                    <el-form-item label="项目名称">
                      <span>{{ props.row.itemName ? props.row.itemName : props.row.pItemName }}</span>
                    </el-form-item>
                    <el-form-item label="项目内容">
                      <span>{{ props.row.content }}</span>
                    </el-form-item>
                    <el-form-item label="分数">
                      <span>{{ props.row.score }}</span>
                    </el-form-item>
                    <el-form-item label="备注">
                      <span>{{ props.row.remark }}</span>
                    </el-form-item>
                    <el-form-item v-if="props.row.isNeed" label="证书附件列表">
                      <el-table
                        ref="table"
                        v-loading="scoreFilesLoading"
                        :data="scoreFiles"
                        style="width: 100%;"
                        highlight-current-row
                      >
                        <el-table-column
                          type="index"
                          width="50"
                          label="序号"
                        />
                        <el-table-column prop="name" label="附件名称" min-width="200">
                          <template slot-scope="scope">
                            <el-popover
                              :content="'file/' + scope.row.type + '/' + scope.row.name"
                              placement="top-start"
                              title="路径"
                              width="200"
                              trigger="hover"
                            >
                              <!--可下载文件-->
                              <a
                                slot="reference"
                                :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.name"
                                class="el-link--primary"
                                style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                                target="_blank"
                                :download="scope.row.realName"
                              >
                                {{ scope.row.realName }}
                              </a>
                            </el-popover>
                          </template>
                        </el-table-column>
                        <el-table-column prop="path" label="预览图">
                          <template slot-scope="{row}">
                            <el-image
                              :src=" baseApi + '/file/' + row.type + '/' + row.name"
                              :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.name]"
                              fit="contain"
                              lazy
                              class="el-avatar"
                            >
                              <div slot="error">
                                <i class="el-icon-document"/>
                              </div>
                            </el-image>
                          </template>
                        </el-table-column>
                        <el-table-column prop="size" label="大小" min-width="120"/>
                        <el-table-column prop="type" label="附件类型" min-width="120"/>
                        <el-table-column prop="createBy" label="创建者"/>
                        <!--   编辑与删除   -->
                        <el-table-column
                          label="操作"
                          min-width="130px"
                          align="center"
                          fixed="right"
                        >
                          <template slot-scope="scope">
                            <div>
                              <!--删除-->
                              <el-popover
                                :ref="`delTempScoreFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delTempScoreFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteScoreFile(scope.row), scope._self.$refs[`delTempScoreFile-popover-${scope.$index}`].doClose()"
                                  >确定
                                  </el-button>
                                </div>
                                <el-button
                                  slot="reference"
                                  v-permission="permission.edit"
                                  type="danger"
                                  icon="el-icon-delete"
                                  size="mini"
                                />
                              </el-popover>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                      <el-button
                        v-if="!planDisabled"
                        type="primary"
                        style="margin-top: 8px;"
                        class="button-new-tag"
                        icon="el-icon-plus"
                        size="small"
                        @click="toUploadScoreFile(props.row)"
                      >上传问题附件
                      </el-button>
                    </el-form-item>
                  </el-form>
                  <!--                  <el-descriptions border :column="1">
                                      <el-descriptions-item label="项目名称">
                                        {{ props.row.itemName?props.row.itemName:props.row.pItemName }}
                                      </el-descriptions-item>
                                      <el-descriptions-item label="项目内容">
                                        {{ props.row.content }}
                                      </el-descriptions-item>
                                      <el-descriptions-item label="分数">
                                        {{ props.row.score }}
                                      </el-descriptions-item>
                                      <el-descriptions-item label="备注">
                                        {{ props.row.remark }}
                                      </el-descriptions-item>
                                      <el-descriptions-item v-if="props.row.isNeed" label="证书附件列表">
                                        <el-table
                                          ref="table"
                                          v-loading="scoreFilesLoading"
                                          :data="scoreFiles"
                                          style="width: 100%;"
                                          highlight-current-row
                                        >
                                          <el-table-column
                                            type="index"
                                            width="50"
                                            label="序号"
                                          >
                                          </el-table-column>
                                          <el-table-column prop="name" label="附件名称" min-width="200">
                                            <template slot-scope="scope">
                                              <el-popover
                                                :content="'file/' + scope.row.type + '/' + scope.row.name"
                                                placement="top-start"
                                                title="路径"
                                                width="200"
                                                trigger="hover"
                                              >
                                                &lt;!&ndash;可下载文件&ndash;&gt;
                                                <a
                                                  slot="reference"
                                                  :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.name"
                                                  class="el-link&#45;&#45;primary"
                                                  style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                                                  target="_blank"
                                                  :download="scope.row.realName"
                                                >
                                                  {{ scope.row.realName }}
                                                </a>
                                              </el-popover>
                                            </template>
                                          </el-table-column>
                                          <el-table-column prop="path" label="预览图">
                                            <template slot-scope="{row}">
                                              <el-image
                                                :src=" baseApi + '/file/' + row.type + '/' + row.name"
                                                :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.name]"
                                                fit="contain"
                                                lazy
                                                class="el-avatar"
                                              >
                                                <div slot="error">
                                                  <i class="el-icon-document"/>
                                                </div>
                                              </el-image>
                                            </template>
                                          </el-table-column>
                                          <el-table-column prop="size" label="大小" min-width="120"/>
                                          <el-table-column prop="type" label="附件类型" min-width="120"/>
                                          <el-table-column prop="createBy" label="创建者"/>
                                          &lt;!&ndash;   编辑与删除   &ndash;&gt;
                                          <el-table-column
                                            label="操作"
                                            min-width="130px"
                                            align="center"
                                            fixed="right"
                                          >
                                            <template slot-scope="scope">
                                              <div>
                                                &lt;!&ndash;删除&ndash;&gt;
                                                <el-popover
                                                  :ref="`delTempScoreFile-popover-${scope.$index}`"
                                                  v-permission="permission.edit"
                                                  placement="top"
                                                  width="180"
                                                >
                                                  <p>确定删除这个附件吗？</p>
                                                  <div style="text-align: right; margin: 0">
                                                    <el-button
                                                      size="mini"
                                                      type="text"
                                                      @click="scope._self.$refs[`delTempScoreFile-popover-${scope.$index}`].doClose()"
                                                    >取消
                                                    </el-button>
                                                    <el-button
                                                      type="primary"
                                                      size="mini"
                                                      @click="deleteScoreFile(scope.row), scope._self.$refs[`delTempScoreFile-popover-${scope.$index}`].doClose()"
                                                    >确定
                                                    </el-button>
                                                  </div>
                                                  <el-button
                                                    slot="reference"
                                                    v-permission="permission.edit"
                                                    type="danger"
                                                    icon="el-icon-delete"
                                                    size="mini"
                                                  />
                                                </el-popover>
                                              </div>
                                            </template>
                                          </el-table-column>
                                        </el-table>
                                        <el-button
                                          type="primary"
                                          style="margin-top: 8px;"
                                          class="button-new-tag"
                                          icon="el-icon-plus"
                                          size="small"
                                          @click="toUploadScoreFile(props.row)"
                                          v-if="!planDisabled"
                                        >上传问题附件
                                        </el-button>
                                      </el-descriptions-item>
                                    </el-descriptions>-->
                </template>
              </el-table-column>
              <el-table-column prop="itemName" label="项目名称" width="100px">
                <template slot-scope="scope">
                  {{ scope.row.itemName }}<i
                  v-if="scope.row.isSpecial && scope.row.itemName!==undefined"
                  style="color: red"
                >*</i>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="项目内容" min-width="350px"/>
              <el-table-column prop="score" label="打分" width="120px">
                <template slot-scope="scope">
                  <span v-if="scope.row.isNeed">
                     <!--处理NA情况对应null不显示的问题:设置NA对应键值为-1，后台计算时候过滤“score=-1”-->
                    <el-select
                      v-model="scope.row.score"
                      filterable
                      size="small"
                      :disabled="planDisabled"
                      placeholder="请打分"
                      class="filter-item"
                      style="width: 100px"
                      @change="scoreChangeHander(scope.row)"
                    >
                      <el-option v-for="item in scoreDict" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                  </span>
                  <span v-else>
                    {{ scope.row.score }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" min-width="200px">
                <template slot-scope="scope">
                  <span v-if="scope.row.isNeed">
                    <el-input
                      v-model="scope.row.remark"
                      size="mini"
                      type="textarea"
                      maxlength="500"
                      show-word-limit
                      autosize
                      placeholder="请输入备注"
                      suffix-icon="el-icon-edit"
                      :disabled="planDisabled"
                    >{{ scope.row.remark }}</el-input>
                  </span>
                  <span v-else>/</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-else>
            <el-button icon="el-icon-zoom-in" type="text" @click="quesListVisible = true">查看VDA 6.3 问题清单明细</el-button>
          </div>
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <!--上传模板认证信息对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="cerFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadCerFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleCerFileSuccess"
          :on-error="handleError"
          :action="tempCerUploadApi + '?cerId=' + certificateId "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ uploadDiaTitle }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitCerFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--上传模板问题打分清单信息对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="scoreFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadScoreFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleScoreFileSuccess"
          :on-error="handleError"
          :action="tempScoreUploadApi + '?scoreId=' + scoreId "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ uploadScoreDiaTitle }}</b>相关文件拖到此处，或<em>选取上传</em>
          </div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitScoreFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--认证信息弹窗-->
    <el-dialog
      :title="certificateOperationTitle"
      :visible.sync="addCertificateVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="certificateForm"
        :model="certificateForm"
        :rules="certificateRules"
        size="small"
        label-width="120px"
      >
        <el-form-item
          label="认证系统名称"
          prop="name"
        >
          <el-input
            v-model="certificateForm.name"
            maxlength="30"
            show-word-limit
            style="width: 320px;"
          />
        </el-form-item>
        <el-form-item
          label="认证机构"
          prop="sgs"
        >
          <el-input
            v-model="certificateForm.sgs"
            maxlength="30"
            show-word-limit
            style="width: 320px;"
          />
        </el-form-item>
        <el-form-item
          label="认证号码"
          prop="cerNum"
        >
          <el-input
            v-model="certificateForm.cerNum"
            maxlength="30"
            show-word-limit
            style="width: 320px;"
          />
        </el-form-item>
        <el-form-item
          label="有效期限"
          prop="validDate"
        >
          <el-date-picker
            v-model="certificateForm.validDate"
            :picker-options="validTimeOption"
            type="date"
            style="width: 200px;"
            placeholder="选择有效期限"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOperation">取 消</el-button>
        <el-button type="primary" @click="submitCertificate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getAuditPlanById} from '@/api/tools/auditPlan'
import {GMTToDate, GMTToStr, judgeIsEqual, validIsNotNull} from '@/utils/validationUtil'
import {editPlanTempContent, getPlanTemplateByPlanId} from '@/api/tools/auditPlanTemplate'
import {editTemplateScores, getTemplateScoreByCond} from '@/api/tools/templateScore'
import {
  addTempCertificate,
  delTempCertificate,
  editTempCertificate,
  getTempCertificateByTemplateId
} from '@/api/tools/apTemplateCertificate'
import {getToken} from '@/utils/auth'
import {delTempCerFile, getTempCerFileByCerId} from '@/api/tools/tempCerFile'
import {delTempScoreFile, getTempScoreFileByScoreId} from '@/api/tools/tempScoreFile'

export default {
  name: 'VDATemplate',
  props: ['planId', 'templateId', 'disabled'],
  data() {
    return {
      // 认证时间不可大于现在时间
      validTimeOption: {
        disabledDate(date) {
          return date.getTime() <= Date.now()
        }
      },
      content: {
        name: '', // 审核模板内容名称
        auditTime: '', // 审核日期
        dunsNum: '', // DUNS编码
        address: '', // 详细地址
        chargeName: '', // 被审核组织负责人用户名
        chargePhone: '', // 被审核组织负责人手机号码
        chargeEmail: '', // 被审核组织负责人邮箱
        qualityName: '', // 质量
        qualityPhone: '',
        qualityEmail: '',
        salesName: '', // 销售
        salesPhone: '',
        salesEmail: '',
        productName: '', // 生产
        productPhone: '',
        productEmail: '',
        techName: '', // 研发
        techPhone: '',
        techEmail: '',
        productType: '', // 产品类别
        processType: '', // 执行过程
        other: '' // 其他
      },
      plan: null,
      template: null,
      auditorDatas: [],
      auditTimeInputVisible: false,
      inputTimeValue: '',
      dunsNumInputVisible: false,
      inputDunsNumValue: '',
      addressInputVisible: false,
      inputAddressValue: '',
      chargeNameInputVisible: false,
      inputChargeNameValue: '',
      processTypeInputVisible: false,
      inputProcessTypeValue: '',
      prodTypeInputVisible: false,
      inputProdTypeValue: '',
      otherInputVisible: false,
      inputOtherValue: '',
      chargePhoneInputVisible: false,
      inputChargePhoneValue: '',
      chargeEmailInputVisible: false,
      inputChargeEmailValue: '',
      qualityNameInputVisible: false,
      inputQualityNameValue: '',
      qualityPhoneInputVisible: false,
      inputQualityPhoneValue: '',
      qualityEmailInputVisible: false,
      inputQualityEmailValue: '',
      prodNameInputVisible: false,
      inputProdNameValue: '',
      prodPhoneInputVisible: false,
      inputProdPhoneValue: '',
      prodEmailInputVisible: false,
      inputProdEmailValue: '',
      techNameInputVisible: false,
      inputTechNameValue: '',
      techPhoneInputVisible: false,
      inputTechPhoneValue: '',
      techEmailInputVisible: false,
      inputTechEmailValue: '',
      scoreLoading: false,
      templateScores: [],
      planDisabled: true,
      scoreDict: [
        {
          label: 0,
          value: 0
        },
        {
          label: 4,
          value: 4
        },
        {
          label: 6,
          value: 6
        },
        {
          label: 8,
          value: 8
        },
        {
          label: 10,
          value: 10
        },
        {
          label: 'NA',
          value: -1
        }

      ],
      basicInfoVisible: false,
      quesListVisible: false,
      certificatesLoading: false,
      certificates: [],
      cerFilesLoading: false,
      cerFiles: [],
      certificateForm: {
        name: '',
        sgs: '',
        cerNum: '',
        validDate: null,
        isOverdue: false
      },
      oldName: null,
      oldSgs: null,
      oldValidDate: null,
      oldCerNum: null,
      certificateRules: {
        name: [
          {required: true, message: '请填写认证的体系名称', trigger: 'blur'}
        ],
        sgs: [
          {required: true, message: '请填写认证机构', trigger: 'blur'}
        ],
        cerNum: [
          {required: true, message: '请填写认证号码', trigger: 'blur'}
        ],
        validDate: [
          {required: true, message: '请输入截至有效期限', trigger: 'blur'}
        ]
      },
      certificateOperationTitle: '编辑认证信息',
      addCertificateVisible: false,
      headers: {
        'Authorization': getToken()
      },
      permission: {
        edit: ['admin', 'plan:edit']
      },
      certificateId: null,
      cerFileUploadVisible: false,
      uploadDiaTitle: '',
      scoreId: null,
      scoreFilesLoading: false,
      scoreFiles: [],
      scoreFileUploadVisible: false,
      uploadScoreDiaTitle: '',
      isPlan: false,
      closeMin: false,
      scopeTags: ['P2', 'P3', 'P4', 'P5', 'P6', 'P7']
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'tempCerUploadApi',
      'tempScoreUploadApi'
    ])
  },
  created: function () {
  },
  mounted() {
    // alert(this.$props.planId)
    this.getPlanInfoByPlanId(this.$props.planId)
    // this.getTemplateScore(this.$props.templateId)
    this.getTempCertificate(this.$props.templateId)
    this.initTemplateInfo()
  },
  methods: {
    beforeInfoClose() {
      this.$confirm('确认缩放VDA 6.3 审核基本信息？')
        .then(_ => {
          this.basicInfoVisible = false
        })
        .catch(_ => {
        })
    },
    beforeQuestClose() {
      this.$confirm('确认缩放VDA 6.3 审核问题清单信息？')
        .then(_ => {
          this.quesListVisible = false
        })
        .catch(_ => {
        })
    },
    getPlanInfoByPlanId(id) {
      // alert(id)
      this.auditorDatas = []
      getAuditPlanById(id).then(res => {
        // alert(JSON.stringify(res))
        this.plan = res
        if (this.plan.status !== '计划') {
          this.basicInfoVisible = true
          this.quesListVisible = true
          this.closeMin = true
          this.scopeTags = this.plan.scope.split(',')
          // alert(JSON.stringify(this.scopeTags))
          this.getTemplateScore(this.$props.templateId, this.scopeTags, true)
        } else {
          this.getTemplateScore(this.$props.templateId, this.scopeTags, false)
        }
        if (res.auditors.length > 0) {
          this.auditorDatas = res.auditors
        }
      })
    },
    initTemplateInfo() {
      this.planDisabled = this.$props.disabled
      // alert(this.planDisabled)
      getPlanTemplateByPlanId(this.$props.planId).then(res => {
        // alert(JSON.stringify(res.content))
        this.template = res
        this.content = res.content
        // alert(JSON.stringify(this.content.processType))
      })
    },
    // 获取模板问题清单信息
    getTemplateScore(templateId, lineTags, b) {
      // alert(templateId)
      const cond = {
        templateId: templateId,
        itemTypes: lineTags,
        isActive: b
      }
      this.scoreLoading = true
      this.templateScores = []
      getTemplateScoreByCond(cond).then(res => {
        // alert(JSON.stringify(res))
        this.scoreLoading = false
        this.templateScores = res
        /* this.templateScores.forEach((data,index)=>{
          this.tempRemarkInputVisible.push(false)
        })*/
      }).catch(err => {
        this.scoreLoading = false
      })
    },
    // 获取VDA6.3模板下认证有效性信息
    getTempCertificate(templateId) {
      this.certificatesLoading = true
      this.certificates = []
      getTempCertificateByTemplateId(templateId).then(res => {
        this.certificatesLoading = false
        this.certificates = res
      }).catch(err => {
        this.certificatesLoading = false
      })
    },
    // 输入审核日期确认
    handleInputConfirm() {
      // 监控审核日期变化
      this.content.auditTime = validIsNotNull(this.inputTimeValue) ? GMTToStr(this.inputTimeValue):''
      this.auditTimeInputVisible = false
    },
    timeChange() {
      this.auditTimeInputVisible = true
      this.inputTimeValue = validIsNotNull(this.content.auditTime) ? this.content.auditTime : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.auditTimeInput.focus()
      })
    },

    // 输入DUNS编码确认
    handleDunsInputConfirm() {
      this.content.dunsNum = this.inputDunsNumValue.trim()
      this.dunsNumInputVisible = false
    },
    dunsChange() {
      this.dunsNumInputVisible = true
      this.inputDunsNumValue = validIsNotNull(this.content.dunsNum) ? this.content.dunsNum : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.dunsNumInput.$refs.input.focus()
      })
    },
    // 输入地址确认
    handleInputAddressConfirm() {
      this.content.address = this.inputAddressValue.trim()
      this.addressInputVisible = false
    },
    addressChange() {
      this.addressInputVisible = true
      this.inputAddressValue = validIsNotNull(this.content.address) ? this.content.address : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.addressInput.focus()
      })
    },
    // 输入其他确认
    handleInputOtherConfirm() {
      this.content.other = this.inputOtherValue.trim()
      this.otherInputVisible = false
    },
    otherChange() {
      this.otherInputVisible = true
      this.inputOtherValue = validIsNotNull(this.content.other) ? this.content.other : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.otherInput.focus()
      })
    },
    // 输入产品类别确认
    handleProdTypeInputConfirm() {
      this.content.productType = this.inputProdTypeValue.trim()
      this.prodTypeInputVisible = false
    },
    prodTypeChange() {
      this.prodTypeInputVisible = true
      this.inputProdTypeValue = validIsNotNull(this.content.productType) ? this.content.productType : ''
      this.$nextTick(() => {
        // 自动聚焦输入框文字
        this.$refs.prodTypeInput.$refs.input.focus()
      })
    },
    // 输入过程确认
    handleProTypeInputConfirm() {
      this.content.processType = this.inputProcessTypeValue.trim()
      this.processTypeInputVisible = false
    },
    processTypeChange() {
      this.processTypeInputVisible = true
      this.inputProcessTypeValue = validIsNotNull(this.content.processType) ? this.content.processType : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.processTypeInput.$refs.input.focus()
      })
    },
    // 输入被审查组织负责人确认
    handleChargeNameInputConfirm() {
      this.content.chargeName = this.inputChargeNameValue.trim()
      this.chargeNameInputVisible = false
    },
    chargeNameChange() {
      this.chargeNameInputVisible = true
      this.inputChargeNameValue = validIsNotNull(this.content.chargeName) ? this.content.chargeName : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.chargeNameInput.$refs.input.focus()
      })
    },
    // 输入被审查组织负责人电话确认
    handleChargePhoneInputConfirm() {
      this.content.chargePhone = this.inputChargePhoneValue.trim()
      this.chargePhoneInputVisible = false
    },
    chargePhoneChange() {
      this.chargePhoneInputVisible = true
      this.inputChargePhoneValue = validIsNotNull(this.content.chargePhone) ? this.content.chargePhone : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.chargePhoneInput.$refs.input.focus()
      })
    },
    handleChargeEmailInputConfirm() {
      this.content.chargeEmail = this.inputChargeEmailValue.trim()
      this.chargeEmailInputVisible = false
    },
    chargeEmailChange() {
      this.chargeEmailInputVisible = true
      this.inputChargeEmailValue = validIsNotNull(this.content.chargeEmail) ? this.content.chargeEmail : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.chargeEmailInput.$refs.input.focus()
      })
    },
    handleQualityNameInputConfirm() {
      this.content.qualityName = this.inputQualityNameValue.trim()
      this.qualityNameInputVisible = false
    },
    qualityNameChange() {
      this.qualityNameInputVisible = true
      this.inputQualityNameValue = validIsNotNull(this.content.qualityName) ? this.content.qualityName : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.qualityNameInput.$refs.input.focus()
      })
    },
    // 输入质量号码确认
    handleQualityPhoneInputConfirm() {
      this.content.qualityPhone = this.inputQualityPhoneValue.trim()
      this.qualityPhoneInputVisible = false
    },
    qualityPhoneChange() {
      this.qualityPhoneInputVisible = true
      this.inputQualityPhoneValue = validIsNotNull(this.content.qualityPhone) ? this.content.qualityPhone : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.qualityPhoneInput.$refs.input.focus()
      })
    },
    // 输入质量邮箱确认
    handleQualityEmailInputConfirm() {
      this.content.qualityEmail = this.inputQualityEmailValue.trim()
      this.qualityEmailInputVisible = false
    },
    qualityEmailChange() {
      this.qualityEmailInputVisible = true
      this.inputQualityEmailValue = validIsNotNull(this.content.qualityEmail) ? this.content.qualityEmail : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.qualityEmailInput.$refs.input.focus()
      })
    },
    // 输入生产姓名确认
    handleProdNameInputConfirm() {
      this.content.productName = this.inputProdNameValue.trim()
      this.prodNameInputVisible = false
    },
    prodNameChange() {
      this.prodNameInputVisible = true
      this.inputProdNameValue = validIsNotNull(this.content.productName) ? this.content.productName : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.prodNameInput.$refs.input.focus()
      })
    },
    // 输入生产号码确认
    handleProdPhoneInputConfirm() {
      this.content.productPhone = this.inputProdPhoneValue.trim()
      this.prodPhoneInputVisible = false
    },
    prodPhoneChange() {
      this.prodPhoneInputVisible = true
      this.inputProdPhoneValue = validIsNotNull(this.content.productPhone) ? this.content.productPhone : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.prodPhoneInput.$refs.input.focus()
      })
    },
    // 输入生产邮箱确认
    handleProdEmailInputConfirm() {
      this.content.productEmail = this.inputProdEmailValue.trim()
      this.prodEmailInputVisible = false
    },
    prodEmailChange() {
      this.prodEmailInputVisible = true
      this.inputProdEmailValue = validIsNotNull(this.content.productEmail) ? this.content.productEmail : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.prodEmailInput.$refs.input.focus()
      })
    },
    // 输入生产姓名确认
    handleTechNameInputConfirm() {
      this.content.techName = this.inputTechNameValue.trim()
      this.techNameInputVisible = false
    },
    techNameChange() {
      this.techNameInputVisible = true
      this.inputTechNameValue = validIsNotNull(this.content.techName) ? this.content.techName : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.techNameInput.$refs.input.focus()
      })
    },
    // 输入生产号码确认
    handleTechPhoneInputConfirm() {
      this.content.techPhone = this.inputTechPhoneValue.trim()
      this.techPhoneInputVisible = false
    },
    techPhoneChange() {
      this.techPhoneInputVisible = true
      this.inputTechPhoneValue = validIsNotNull(this.content.techPhone) ? this.content.techPhone : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.techPhoneInput.$refs.input.focus()
      })
    },
    // 输入生产邮箱确认
    handleTechEmailInputConfirm() {
      this.content.techEmail = this.inputTechEmailValue.trim()
      this.techEmailInputVisible = false
    },
    techEmailChange() {
      this.techEmailInputVisible = true
      this.inputTechEmailValue = validIsNotNull(this.content.techEmail) ? this.content.techEmail : ''
      this.$nextTick(_ => {
        // 自动聚焦输入框文字
        this.$refs.techEmailInput.$refs.input.focus()
      })
    },
    // 保存（更新模板内容）
    saveTemplateContent() {
      // alert('保存模板基础信息') // 内容判空设置
      // todo  alert(JSON.stringify(this.content))
      if (!validIsNotNull(this.content.auditTime)) {
        this.$message({
          message: 'Submit Failed! 模板审核日期不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.content.dunsNum)) {
        this.$message({
          message: 'Submit Failed! 审核DUNS编码不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      }  else if (!validIsNotNull(this.content.address)) {
        this.$message({
          message: 'Submit Failed! 审核地址不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.content.chargeName)) {
        this.$message({
          message: 'Submit Failed! 被审核组织负责人用户名不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.content.qualityName)) {
        this.$message({
          message: 'Submit Failed! 被审核组织质量负责人用户名不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.content.salesName)) {
        this.$message({
          message: 'Submit Failed! 被审核组织销售负责人用户名不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.content.productName)) {
        this.$message({
          message: 'Submit Failed! 被审核组织生产负责人用户名不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      } else if (!validIsNotNull(this.content.techName)) {
        this.$message({
          message: 'Submit Failed! 被审核组织研发负责人用户名不可为空!',
          type: 'warning'
        })
        // this.getReportInfoByPlanId(this.planId)
        return false
      }
      editPlanTempContent(this.content).then(res => {
        this.$message({
          message: 'Save Content Success! 保存模板基础信息成功!',
          type: 'success'
        })
        this.initTemplateInfo()
      })
    },
    // todo  监控打分清单项目变化
    scoreChangeHander(data) {
      // alert(JSON.stringify(data))
    },
    // todo 保存打分问题清单信息
    saveTemplateScore() {
      // alert(JSON.stringify(this.templateScores))
      console.log(this.templateScores)
      // alert('保存打分问题清单信息')
      editTemplateScores(this.templateScores).then(res => {
        this.$message({
          message: 'Submit Score Success! 提交问题清单分数成功!',
          type: 'success'
        })
        this.getTemplateScore(this.$props.templateId, this.scopeTags, true)
        this.$emit('func',true)
      })
    },
    // 根据有效期设置提醒样式
    tableRowClassName({row, rowIndex}) {
      if (row.isNeed === false) {
        return 'hr-row'
      }
    },
    // 证书有效性证明
    cerRowClassName({row, rowIndex}) {
      if (row.isOverdue === true) {
        return 'red-row'
      }
    },
    // 预添加证书
    toAddCertificates() {
      this.certificateForm = {}
      this.certificateOperationTitle = '新增认证有效性信息'
      this.addCertificateVisible = true
    },
    // 编辑问题
    editCertificate(row) {
      this.certificateForm = row
      this.certificateOperationTitle = '编辑认证有效性信息'
      this.addCertificateVisible = true
      this.oldName = row.name
      this.oldSgs = row.sgs
      this.oldValidDate = row.validDate
      this.oldCerNum = row.cerNum
    },
    cancelOperation() {
      this.addCertificateVisible = false
      this.getTempCertificate(this.$props.templateId)
    },
    validDateFormatter(row, col) {
      return GMTToDate(row.validDate)
    },
    // 关闭弹窗前操作
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.getTempCertificate(this.$props.templateId)
        })
        .catch(_ => {
        })
    },
    // 提交编辑/新增认证信息
    submitCertificate() {
      if (judgeIsEqual(this.oldName, this.certificateForm.name.trim()) &&
        judgeIsEqual(this.oldSgs, this.certificateForm.sgs.trim()) &&
        judgeIsEqual(this.oldCerNum, this.certificateForm.cerNum) &&
        judgeIsEqual(this.oldValidDate, this.certificateForm.validDate)) {
        this.$message({
          message: 'No Changes Found! 未检测到改动，无需重复提交!',
          type: 'warning'
        })
        return false
      }
      this.$refs.certificateForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.certificateForm.templateId = this.$props.templateId
          // 根据标识判断新增/编辑
          if (!validIsNotNull(this.certificateForm.id)) {
            // alert("这是新增")
            addTempCertificate(this.certificateForm).then(res => {
              this.$message({
                message: 'Add Certificate Success! 新增认证信息成功!',
                type: 'success'
              })
              this.getTempCertificate(this.$props.templateId)
            })
          } else {
            // 编辑认证信息
            editTempCertificate(this.certificateForm).then(res => {
              this.$message({
                message: 'Edit Certificate Success! 更改认证信息成功!',
                type: 'success'
              })
              this.getTempCertificate(this.$props.templateId)
            })
          }
          this.addCertificateVisible = false
        }
      })
    },
    // 删除认证信息
    delCertificate(id) {
      const data = []
      data.push(id)
      delTempCertificate(data).then(res => {
        this.$message({
          message: 'Del Certificate Success! 删除认证信息成功!',
          type: 'success'
        })
        this.getTempCertificate(this.$props.templateId)
      }).catch(() => {
        this.$message({
          message: 'Del Failed! 删除认证信息失败!',
          type: 'error'
        })
      })
    },
    // 展开认证信息
    expendCerSelected(row, expandedRows) {
      // alert(row.id)
      this.certificateId = row.id
      // todo 查询认证有效信息对应的附件列表信息
      this.getCertificateFile(row.id)
    },
    // 准备上传问题对应的文件
    toUploadFile(row) {
      this.cerFileUploadVisible = true
      // this.uploadDiaTitle = '上传['+row.name+']相关附件'
      this.uploadDiaTitle = row.name
    },
    // 准备上传问题对应的文件
    toUploadScoreFile(row) {
      // alert(JSON.stringify(row))
      this.scoreFileUploadVisible = true
      this.uploadScoreDiaTitle = validIsNotNull(row.itemName) ? row.pItemName + '-' + row.itemName : row.pItemName + '-' + row.content
    },
    // 上传附件之前判断
    beforeUpload: function (file) {
      // alert(JSON.stringify(file))
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    // 上传问题对应的附件
    submitCerFileUpload() {
      this.$refs.uploadCerFile.submit()
    },
    submitScoreFileUpload() {
      this.$refs.uploadScoreFile.submit()
    },
    // 监听认证信息对应的附件上传成功
    handleCerFileSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.uploadCerFile.clearFiles()
      this.getCertificateFile(this.certificateId)
    },
    // 监听打分信息对应的附件上传成功
    handleScoreFileSuccess(response, file, fileList) {
      this.$message.success('上传文件成功!')
      this.$refs.uploadScoreFile.clearFiles()
      this.getTempScoreFile(this.scoreId)
    },
    // 根据问题点查询对应的附件
    getCertificateFile(cerId) {
      // alert(JSON.stringify(this.quesId))
      // todo 查询问题点对应的附件列表信息
      this.cerFilesLoading = true
      this.cerFiles = []
      getTempCerFileByCerId(cerId).then(res => {
        // alert(JSON.stringify(res))
        this.cerFiles = res
        this.cerFilesLoading = false
      })
    },
    // 删除认证信息对应的附件
    deleteCerFile(row) {
      const data = []
      data.push(row.id)
      delTempCerFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getCertificateFile(row.cerId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件失败!',
          type: 'error'
        })
      })
    },
    expendScoreSelected(row, expandedRows) {
      // alert(row.id)
      this.scoreId = row.id
      // todo 查询认证有效信息对应的附件列表信息
      this.getTempScoreFile(row.id)
    },
    // 根据问题点查询对应的附件
    getTempScoreFile(scoreId) {
      // alert(JSON.stringify(this.scoreId))
      this.scoreFilesLoading = true
      this.scoreFiles = []
      getTempScoreFileByScoreId(scoreId).then(res => {
        // alert(JSON.stringify(res))
        this.scoreFiles = res
        this.scoreFilesLoading = false
      })
    },
    // 删除问题打分信息对应的附件
    deleteScoreFile(row) {
      const data = []
      data.push(row.id)
      delTempScoreFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getTempScoreFile(row.scoreId)
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件失败!',
          type: 'error'
        })
      })
    }
  }
}
</script>
<style>
.el-table .hr-row {
  font-weight: bold !important;
}

.el-table .red-row {
  color: #ff0000 !important;
}

.my-content {
  background: #FDE2E2;
}

.my-label {
  color: #f00;
}

</style>
<style rel="stylesheet/scss" lang="scss" scoped>

.demo-table-expand {
  font-size: 0;
  margin-left: 20px;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}

.tag-list {
  margin-right: 5px !important;
  text-align: left !important;
  //line-height: 1.5 !important;
  display: inline-block !important;
}

.myBtn {
  word-wrap: break-word !important;
  word-break: break-all !important;
  white-space: normal !important;
}

.el-button--text {
  color: #606266 !important;
}

</style>
