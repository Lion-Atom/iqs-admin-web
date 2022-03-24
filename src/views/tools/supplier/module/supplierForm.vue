<template>
  <div>
    <!--操作栏-->
    <span v-if="isBtnShow" class="save-btn">
      <el-button
        type="primary"
        @click="saveSupplier(supplierForm)"
      >保存
      </el-button>
      <el-button
        v-if="!isNew"
        @click="pdfViewVisible = true"
        type="warning"
      >预览
      </el-button>
      <el-button
        type="success"
        @click="backToList"
      >返回
      </el-button>
    </span>
    <el-card class="box-card" shadow="never">
      <el-descriptions style="background-color: #ffffff;">
        <template slot="title">
          <div>
            <span>
              <el-button
                type="primary"
                @click="saveSupplier(supplierForm)"
              >保存
              </el-button>
              <el-button
                v-if="!isNew"
                type="primary"
                @click="backToList"
              >返回
              </el-button>
            </span>
          </div>
        </template>
        <template slot="extra">
          <!--<el-button
            type="primary"
            @click="savePdf"
            v-print = "'#canvas'"
          >打印
          </el-button>-->
          <!--<el-button
            type="primary"
            @click="outPutPdfFn"
          >打印
          </el-button>-->
          <el-button
            v-if="!isNew"
            type="primary"
            @click="pdfViewVisible = true"
          >预览
          </el-button>
        </template>
      </el-descriptions>
    </el-card>
    <!--信息填写处-->
    <!--    <div id="supplierCanvas" ref="supplierCanvas">-->
    <div>
      <el-card shadow="never">
        <el-collapse v-model="activeNames">
          <el-form
            ref="form"
            class="dialog"
            :rules="supplierRules"
            :model="supplierForm"
            size="small"
            label-width="120px"
          >
            <!--基本信息-->
            <el-collapse-item title="基本信息" name="1" class="collapse-item">
              <el-row>
                <el-col :span="8">
                  <el-form-item v-if="isNew===true" label="供应商编号" required>
                    <el-input placeholder="新增后自动生成" disabled style="width: 100%;"/>
                  </el-form-item>
                  <el-form-item v-if="isNew!==true" label="供应商编号" prop="supplierCode" required>
                    <el-input v-model="supplierForm.supplierCode" disabled style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商类别" prop="type" required>
                    <el-select
                      v-model="supplierForm.type"
                      size="small"
                      placeholder="可自定义类别"
                      filterable
                      allow-create
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.supplier_type"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="产品级别" prop="level" required>
                    <el-select
                      v-model="supplierForm.level"
                      size="small"
                      placeholder="可自定义级别"
                      filterable
                      allow-create
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.supplier_level"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="供应商名称" prop="name" required>
                    <el-input v-model="supplierForm.name" style="width: 100%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商简称" prop="abb">
                    <el-input v-model="supplierForm.abb" style="width: 100%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="准入供应商" prop="isQualified">
                    <el-select
                      v-model="supplierForm.isQualified"
                      size="small"
                      placeholder="请选择是否准入"
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.common_status"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="供应商产品" prop="production" required>
                    <!--              <el-input v-model="supplierForm.production" style="width: 100%;"/>-->
                    <div style="border-left:1px #C0C4CC solid;width: 100%">
                      <el-tag
                        v-for="tag in supplierForm.prodTags"
                        :key="tag"
                        closable
                        :disable-transitions="false"
                        @close="handleProdClose(tag)"
                      >
                        {{ tag }}
                      </el-tag>
                      <el-input
                        v-if="inputProdVisible"
                        ref="prodTagInput"
                        v-model="inputProdValue"
                        class="input-new-tag"
                        size="small"
                        @keyup.enter.native="handleInputProdConfirm"
                        @blur="handleInputProdConfirm"
                      />
                      <el-button v-else class="button-new-tag" size="small" @click="showInputProd">+产品</el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="供应商简介" prop="profile">
                    <el-input
                      v-model="supplierForm.profile"
                      type="textarea"
                      autosize
                      placeholder="请输入内容"
                      style="width: 100%;"
                      :autosize="{ minRows: 2, maxRows: 5}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--公司信息-->
            <el-collapse-item title="公司信息" name="2" class="collapse-item">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="国家地区" prop="country">
                    <el-input v-model="supplierForm.country" style="width: 100%;"/>
                    <!--              <el-select
                                    v-model="supplierForm.country"
                                    size="small"
                                    placeholder="支持自定义输入"
                                    filterable
                                    allow-create
                                    clearable
                                    class="filter-item"
                                    style="width: 100%"
                                  >
                                    <el-option
                                      v-for="item in dict.supplier_settlement"
                                      :key="item.id"
                                      :label="item.value"
                                      :value="item.value"
                                    />
                                  </el-select>-->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="省(州)" prop="provincial">
                    <el-input v-model="supplierForm.provincial" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="市(县)" prop="city">
                    <el-input v-model="supplierForm.city" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="邮政编号" prop="zip">
                    <el-input v-model="supplierForm.zip" style="width: 100%;"/>
                    <!--              <el-select
                                    v-model="supplierForm.country"
                                    size="small"
                                    placeholder="支持自定义输入"
                                    filterable
                                    allow-create
                                    clearable
                                    class="filter-item"
                                    style="width: 100%"
                                  >
                                    <el-option
                                      v-for="item in dict.supplier_settlement"
                                      :key="item.id"
                                      :label="item.value"
                                      :value="item.value"
                                    />
                                  </el-select>-->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="传真" prop="fax">
                    <el-input v-model="supplierForm.fax" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="通讯地址" prop="address">
                    <el-input v-model="supplierForm.address" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="DUNS编码" prop="dunsNum">
                    <el-input v-model="supplierForm.dunsNum" style="width: 100%;"/>
                    <!--              <el-select
                                    v-model="supplierForm.country"
                                    size="small"
                                    placeholder="支持自定义输入"
                                    filterable
                                    allow-create
                                    clearable
                                    class="filter-item"
                                    style="width: 100%"
                                  >
                                    <el-option
                                      v-for="item in dict.supplier_settlement"
                                      :key="item.id"
                                      :label="item.value"
                                      :value="item.value"
                                    />
                                  </el-select>-->
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="法人名称" prop="leyalPerson">
                    <el-input v-model="supplierForm.leyalPerson" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="成立时间" prop="foundationDate">
                    <el-date-picker
                      v-model="supplierForm.foundationDate"
                      :picker-options="regTimeOption"
                      type="date"
                      placeholder="选择成立日期"
                      style="width: 100%;"
                      align="right"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="注册ID" prop="regId">
                    <el-input v-model="supplierForm.regId" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="注册时间" prop="regDate">
                    <el-date-picker
                      v-model="supplierForm.regDate"
                      type="date"
                      placeholder="选择注册日期"
                      style="width: 100%;"
                      :picker-options="regTimeOption"
                      align="right"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="经营状态" prop="status" required>
                    <!--                  <el-input v-model="supplierForm.status" style="width: 100%;"/>-->
                    <el-select
                      v-model="supplierForm.status"
                      clearable
                      size="small"
                      placeholder="经营状态选择"
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in statusOptions"
                        :key="item.key"
                        :label="item.display_name"
                        :value="item.display_name"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="在线咨询" prop="onlineConsul">
                    <el-input v-model="supplierForm.onlineConsul" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="邮箱" prop="companyEmail">
                    <el-input v-model="supplierForm.companyEmail" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="公司主页" prop="webSite">
                    <el-input v-model="supplierForm.webSite" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="经营范围" prop="companyScope">
                    <el-input
                      v-model="supplierForm.companyScope"
                      type="textarea"
                      autosize
                      placeholder="请输入内容"
                      style="width: 100%;"
                      :autosize="{ minRows: 2, maxRows: 5}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!--公司信息-附件-->
              <el-row>
                <el-col :span="24">
                  <el-form-item>
                  <span slot="label">
                    <span class="span-box">
                      <span>公司信息附件</span><br>
                      <el-button
                        type="primary"
                        class="button-new-tag"
                        size="small"
                        @click="toUploadCompanyFile"
                      >添加公司附件
                      </el-button>
                    </span>
                  </span>
                    <el-table
                      ref="table"
                      v-loading="companyFilesLoading"
                      border
                      :data="companyFiles"
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
                              :ref="`delComFile-popover-${scope.$index}`"
                              v-permission="permission.edit"
                              placement="top"
                              width="180"
                            >
                              <p>确定删除这个附件吗？</p>
                              <div style="text-align: right; margin: 0">
                                <el-button
                                  size="mini"
                                  type="text"
                                  @click="scope._self.$refs[`delComFile-popover-${scope.$index}`].doClose()"
                                >取消
                                </el-button>
                                <el-button
                                  type="primary"
                                  size="mini"
                                  @click="deleteCompanyFile(scope.row), scope._self.$refs[`delComFile-popover-${scope.$index}`].doClose()"
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
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--联系人信息-->
            <el-collapse-item v-if="!isNew" title="联系人信息" name="3" class="collapse-item">
              <el-row>
                <!--联系人列表-->
                <el-button @click="toAddContact">添加联系人</el-button>
                <el-col :span="24">
                  <el-table
                    ref="table"
                    v-loading="contactsLoading"
                    border
                    :data="contacts"
                    style="width: 100%;"
                    highlight-current-row
                  >
                    <el-table-column
                      type="index"
                      width="50"
                      label="序号"
                    />
                    <el-table-column prop="name" label="联系人名称" width="120">
                      <template slot-scope="scope">
                        <router-link
                          style="text-decoration:underline;color: #00a0e9;"
                          :to="{
                          path: '/supplier/supplier-contact-update',
                          query: {
                            contactId: scope.row.id
                          }
                        }"
                        >
                          {{ scope.row.name }}
                        </router-link>
                      </template>
                    </el-table-column>
                    <el-table-column prop="importantLevel" label="重要程度" width="120"/>
                    <el-table-column prop="gender" label="性别" width="80"/>
                    <el-table-column prop="jobStatus" label="在职状态"/>
                    <el-table-column prop="type" label="人员类型"/>
                    <el-table-column prop="workTel" label="工作电话"/>
                    <el-table-column prop="phone" label="手机号"/>
                    <el-table-column prop="email" label="邮箱地址"/>
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
                            :ref="`delContact-popover-${scope.$index}`"
                            v-permission="permission.edit"
                            placement="top"
                            width="180"
                          >
                            <p>确定删除这个联系人吗？</p>
                            <div style="text-align: right; margin: 0">
                              <el-button
                                size="mini"
                                type="text"
                                @click="scope._self.$refs[`delContact-popover-${scope.$index}`].doClose()"
                              >取消
                              </el-button>
                              <el-button
                                type="primary"
                                size="mini"
                                @click="deleteContact(scope.row), scope._self.$refs[`delContact-popover-${scope.$index}`].doClose()"
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
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--物流信息-->
            <el-collapse-item title="物流信息" name="4" class="collapse-item">
              <el-row class="row-collapse">
                <el-col :span="8">
                  <el-form-item label="运送方式" prop="deliveryMethod" required>
                    <!--                  <el-input v-model="supplierForm.deliveryMethod" style="width: 100%;"/>-->
                    <el-select
                      v-model="supplierForm.deliveryMethod"
                      size="small"
                      placeholder="可自定义运送方式"
                      filterable
                      allow-create
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.supplier_delivery"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="物流公司" prop="logistics">
                    <div style="width: 300px;">
                      <el-tag
                        v-for="tag in supplierForm.logisticsTags"
                        :key="tag"
                        closable
                        :disable-transitions="false"
                        @close="handleLogisticsClose(tag)"
                      >
                        {{ tag }}
                      </el-tag>
                      <el-input
                        v-if="inputLogisticsVisible"
                        ref="logisticsTagInput"
                        v-model="inputLogisticsValue"
                        class="input-new-tag"
                        size="small"
                        @keyup.enter.native="handleInputLogisticsConfirm"
                        @blur="handleInputLogisticsConfirm"
                      />
                      <el-button v-else class="button-new-tag" size="small" @click="showInputLogistics">+物流公司
                      </el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--财务信息-->
            <el-collapse-item title="财务信息" name="5" class="collapse-item">
              <el-row class="row-collapse">
                <el-col :span="8">
                  <el-form-item label="结算方式" prop="settlement">
                    <!--              <el-input v-model="supplierForm.settlement" style="width: 100%;"/>-->
                    <el-select
                      v-model="supplierForm.settlement"
                      size="small"
                      placeholder="支持自定义输入"
                      filterable
                      allow-create
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.supplier_settlement"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="币种" prop="currency">
                    <!--              <el-input v-model="supplierForm.currency" style="width: 100%;"/>-->
                    <el-select
                      v-model="supplierForm.currency"
                      size="small"
                      placeholder="支持自定义输入"
                      filterable
                      allow-create
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.supplier_currency"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开户行" prop="bankName">
                    <el-input v-model="supplierForm.bankName" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="户名" prop="accountName">
                    <el-input v-model="supplierForm.accountName" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="账号" prop="bankAccount">
                    <el-input
                      v-model="supplierForm.bankAccount"
                      place-holder="支持最多19位数字"
                      type="text"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      :maxlength="19"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="税号" prop="dutyParagraph">
                    <el-input v-model="supplierForm.dutyParagraph" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--财务附件-->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="财务信息附件">
                  <span slot="label">
                    <span class="span-box">
                      <span>财务信息附件</span><br>
                      <el-button
                        type="primary"
                        style="margin-top: 8px;"
                        class="button-new-tag"
                        size="small"
                        @click="toUploadAccountFile"
                      >添加财务附件
                      </el-button>
                    </span>
                  </span>
                    <el-table
                      ref="table"
                      v-loading="accountFilesLoading"
                      border
                      :data="accountFiles"
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
                                  @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--公司数据-->
            <el-collapse-item title="公司数据" name="6" class="collapse-item">
              <el-row class="row-collapse">
                <el-col :span="8">
                  <el-form-item label="员工总数" prop="empTotal">
                    <el-input v-model="supplierForm.empTotal" type="number" :min=null style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="管理层数目" prop="manNum">
                    <el-input
                      v-model="supplierForm.manNum"
                      type="number"
                      :min=null
                      :step="1"
                      :max="supplierForm.empTotal"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="普通员工数目" prop="workerNum">
                    <el-input v-model="supplierForm.workerNum" :min=null type="number" :max="supplierForm.empTotal"
                              style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-collapse">
                <el-col :span="8">
                  <el-form-item label="日工作时长(时)" prop="dailyHour">
                    <el-input
                      type="number"
                      v-model="supplierForm.dailyHour"
                      :precision="1"
                      :step="0.5"
                      :min="0"
                      :max="24"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="周工作天数(天)" prop="workDay">
                    <el-input
                      v-model="supplierForm.workDay"
                      type="number"
                      :precision="1"
                      :step="0.5"
                      :min="0"
                      :max="7"
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <el-input
                      style="width: 100%;"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="row-collapse">
                <el-col :span="24">
                  <!--todo 近三年来营业状况-->
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--质量管理认证信息-->
            <el-collapse-item title="质量管理认证" name="7" class="collapse-item">
              <el-row>
                <!--质量管理认证列表-->
                <el-col :span="24">
                  <el-table
                    ref="table"
                    border
                    :data="certifications"
                    style="width: 100%;"
                    :row-class-name="cerTableRowClassName"
                  >
                    <el-table-column
                      type="index"
                      width="50"
                      label="序号"
                    />
                    <el-table-column prop="itemName" label="认证项目" min-width="120">
                      <template slot-scope="scope">
                        <el-input
                          v-if="isNew"
                          :id="'itemName_'+scope.$index"
                          v-model="scope.row.itemName"
                          placeholder="请输入认证项目名称"
                          @input="itemNameChange(scope.$index,scope.row)"
                        />
                        <el-autocomplete
                          v-else
                          class="inline-input"
                          v-model="scope.row.itemName"
                          :fetch-suggestions="querySearch"
                          placeholder="请输入项目名称"
                          :trigger-on-focus="false"
                          @select="itemNameChange(scope.$index,scope.row)"
                        ></el-autocomplete>
                      </template>
                    </el-table-column>
                    <el-table-column label="已发布" width="60">
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.issued"
                          style="margin: 10px 10px 0 10px;"
                          :disabled="scope.row.planned"
                          @change="issuedChange(scope.$index,scope.row)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="计划中" width="60">
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.planned"
                          style="margin: 10px 10px 0 10px;"
                          :disabled="scope.row.issued"
                          @change="plannedChange(scope.$index,scope.row)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="认证机构" min-width="100">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.sgs"
                          :disabled="scope.row.planned"
                          placeholder="请输入认证机构"
                          @input="sgsChange(scope.$index,scope.row)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="认证码" min-width="100">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.cerNum"
                          :disabled="scope.row.planned"
                          placeholder="请输入认证标识码"
                          @input="cerNumChange(scope.$index,scope.row)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="认证日期" min-width="100" :formatter="releaseDateFormat">
                      <template slot-scope="scope">
                        <el-date-picker
                          v-model="scope.row.releaseDate"
                          :picker-options="regTimeOption"
                          :disabled="scope.row.planned"
                          type="date"
                          placeholder="选择认证日期"
                          style="width: 100%;"
                          align="right"
                          @input="relDateChange(scope.$index,scope.row)"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="失效日期" min-width="100" :formatter="expireDateFormat">
                      <template slot-scope="scope">
                        <el-date-picker
                          v-model="scope.row.expireDate"
                          :disabled="scope.row.planned"
                          :picker-options="expireDateOption"
                          type="date"
                          placeholder="选择失效日期"
                          style="width: 100%;"
                          align="right"
                          @input="expireDateChange(scope.$index,scope.row)"
                        />
                      </template>
                    </el-table-column>
                    <!--   编辑与删除   -->
                    <el-table-column
                      label="操作"
                      width="150px"
                      align="center"
                      fixed="right"
                    >
                      <template slot-scope="scope">
                        <div>
                          <el-button
                            type="primary"
                            size="mini"
                            @click="saveSupplierQMCer(scope.row,scope.$index)"
                          >
                            {{ scope.row.id ? '更新' : '新增' }}
                          </el-button>
                          <!--删除-->
                          <!--                        <el-popover
                                                    :ref="`delQMCer-popover-${scope.row.itemName}`"
                                                    v-permission="permission.edit"
                                                    placement="top"
                                                    width="180"
                                                  >
                                                    <p>确定删除这条认证信息吗？</p>
                                                    <div style="text-align: right; margin: 0">
                                                      <el-button
                                                        size="mini"
                                                        type="text"
                                                        @click="scope._self.$refs[`delQMCer-popover-${scope.row.itemName}`].doClose()"
                                                      >取消
                                                      </el-button>
                                                      <el-button
                                                        type="primary"
                                                        size="mini"
                                                        @click="deleteCer(scope.row), scope._self.$refs[`delQMCer-popover-${scope.row.itemName}`].doClose()"
                                                      >确定
                                                      </el-button>
                                                    </div>
                                                    <el-button
                                                      slot="reference"
                                                      v-permission="permission.edit"
                                                      :disabled="scope.$index < 5"
                                                      v-if="scope.row.id"
                                                      type="danger"
                                                      icon="el-icon-delete"
                                                      size="mini"
                                                    />
                                                  </el-popover>-->
                          <el-button
                            v-permission="permission.edit"
                            v-if="scope.row.id"
                            type="danger"
                            size="mini"
                            @click.native="deleteCer(scope.row)"
                          >删除
                          </el-button>
                          <el-button
                            v-permission="permission.edit"
                            v-if="!scope.row.id"
                            type="danger"
                            size="mini"
                            @click.native="cancelCer(scope.$index,scope.row)"
                          >取消
                          </el-button>

                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-button :disabled="disAdd" @click="toAddSupplierQMCer">添加认证</el-button>
              </el-row>
            </el-collapse-item>
            <!--客户审核信息-->
            <el-collapse-item title="客户审核信息" name="8" class="collapse-item">
              <el-row>
                <el-col :span="24">
                  <el-button
                    type="primary"
                    plain
                    @click="toAddCusAudit"
                  >添加客户审核信息
                  </el-button>
                  <el-table
                    ref="table"
                    v-loading="cusAuditLoading"
                    border
                    :data="cusAudits"
                    style="width: 100%;"
                    @expand-change="expendCusAuditSelected"
                    highlight-current-row
                  >
                    <!--扩展列：客户审核信息相关附件-->
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <!--也可启用下面注释部分的el-descriptions代替el-form-->
                        <el-form label-position="left" class="demo-table-expand">
                          <el-form-item label="客户名称">
                            <span>{{ props.row.customerName }}</span>
                          </el-form-item>
                          <el-form-item label="审核方法">
                            <span>{{ props.row.auditMethod }}</span>
                          </el-form-item>
                          <el-form-item label="审核时间">
                            <span>{{ props.row.auditDate }}</span>
                          </el-form-item>
                          <el-form-item label="审核结果">
                            <span>{{ props.row.auditResult }}</span>
                          </el-form-item>
                          <el-form-item label="附件列表">
                            <el-table
                              ref="table"
                              border
                              v-loading="cusAuditFileLoading"
                              :data="cusAuditFiles"
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
                                          @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                              @click="toUploadCusAuditFile(props.row)"
                            >上传客户审核附件
                            </el-button>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column
                      type="index"
                      width="50"
                      label="序号"
                    />
                    <el-table-column prop="customerName" label="客户名称" min-width="80"/>
                    <el-table-column prop="auditMethod" label="审核方法" width="140"/>
                    <el-table-column prop="auditDate" label="审核日期" min-width="120"/>
                    <el-table-column prop="auditResult" label="审核结果" min-width="80"/>
                    <!--   编辑与删除   -->
                    <el-table-column
                      label="操作"
                      width="130px"
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
                            @click="editCusAudit(scope.row)"
                          />
                          <!--删除-->
                          <el-popover
                            :ref="`delCusAudit-popover-${scope.$index}`"
                            v-permission="permission.edit"
                            placement="top"
                            width="180"
                          >
                            <p>确定删除本条数据吗？</p>
                            <div style="text-align: right; margin: 0">
                              <el-button
                                size="mini"
                                type="text"
                                @click="scope._self.$refs[`delCusAudit-popover-${scope.$index}`].doClose()"
                              >取消
                              </el-button>
                              <el-button
                                type="primary"
                                size="mini"
                                @click="deleteNum(scope.row), scope._self.$refs[`delCusAudit-popover-${scope.$index}`].doClose()"
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
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--审核管理工具-->
            <el-collapse-item title="质量管理工具" name="9" class="collapse-item">
              <el-row>
                <div>
                  <el-button
                    type="primary"
                    plain
                    @click="toAddQMMethod"
                  >添加质量管理工具
                  </el-button>
                </div>
                <el-table
                  ref="table"
                  :loading="qmMethodLoading"
                  border
                  :data="qmMethods"
                  style="width: 100%;"
                  highlight-current-row
                >
                  <el-table-column
                    type="index"
                    width="50"
                    label="序号"
                  />
                  <el-table-column prop="methodName" label="质量管理工具名称" min-width="160"/>
                  <el-table-column label="已使用" min-width="80">
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.isUsed"
                        style="margin: 10px 10px 0 10px;"
                        disabled
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="notUsed" label="未使用" min-width="80">
                    <template slot-scope="scope">
                      <el-checkbox
                        v-model="scope.row.notUsed"
                        style="margin: 10px 10px 0 10px;"
                        disabled
                      />
                    </template>
                  </el-table-column>
                  <!--   编辑与删除   -->
                  <el-table-column
                    label="操作"
                    width="130px"
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
                          @click="editMethod(scope.row)"
                        />
                        <!--删除-->
                        <el-popover
                          :ref="`delMethod-popover-${scope.$index}`"
                          v-permission="permission.edit"
                          placement="top"
                          width="180"
                        >
                          <p>确定删除本条数据吗？</p>
                          <div style="text-align: right; margin: 0">
                            <el-button
                              size="mini"
                              type="text"
                              @click="scope._self.$refs[`delMethod-popover-${scope.$index}`].doClose()"
                            >取消
                            </el-button>
                            <el-button
                              type="primary"
                              size="mini"
                              @click="deleteMethod(scope.row), scope._self.$refs[`delMethod-popover-${scope.$index}`].doClose()"
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
              </el-row>
            </el-collapse-item>
            <!--子供应商-->
            <el-collapse-item title="供应商准入信息" name="10" class="collapse-item">
              <el-row>
                <el-row class="row-collapse">
                  <el-col :span="12">
                    <el-form-item label="获取准入时间" prop="qualifiedDate">
                      <el-date-picker
                        v-model="supplierForm.qualifiedDate"
                        :picker-options="regTimeOption"
                        type="date"
                        placeholder="选择认证日期"
                        style="width: 100%;"
                        align="right"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="准入资格得分" prop="qualifiedScore">
                      <el-input
                        v-model="supplierForm.qualifiedScore"
                        type="number"
                        min="0"
                        max="100"
                        @input="qualifiedScoreChange(arguments[0],100)"
                        @change="qualifiedScoreChange(arguments[0],100)"
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item>
                  <span slot="label">
                    <span class="span-box">
                      <span>准入文件报告</span><br>
                      <el-button
                        type="primary"
                        style="margin-top: 8px;"
                        class="button-new-tag"
                        size="small"
                        @click="toUploadQualifiedFile"
                      >添加准入报告
                      </el-button>
                    </span>
                  </span>
                      <el-table
                        ref="table"
                        v-loading="qualifiedFileLoading"
                        border
                        :data="qualifiedFiles"
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
                                :ref="`delQualifiedFile-popover-${scope.$index}`"
                                v-permission="permission.edit"
                                placement="top"
                                width="180"
                              >
                                <p>确定删除这个附件吗？</p>
                                <div style="text-align: right; margin: 0">
                                  <el-button
                                    size="mini"
                                    type="text"
                                    @click="scope._self.$refs[`delQualifiedFile-popover-${scope.$index}`].doClose()"
                                  >取消
                                  </el-button>
                                  <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteCompanyFile(scope.row), scope._self.$refs[`delQualifiedFile-popover-${scope.$index}`].doClose()"
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
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-row>
            </el-collapse-item>
            <!--年度评估-->
            <el-collapse-item title="年度评估报告" name="11" class="collapse-item">
              <div>
                <el-button
                  type="primary"
                  plain
                  @click="toAddAnnualAssess"
                >添加年度报告
                </el-button>
              </div>
              <el-table
                ref="table"
                v-loading="anuAssessLoading"
                border
                :data="anuAssess"
                style="width: 100%;"
                @expand-change="expendAnuAssessSelected"
                highlight-current-row
              >
                <!--扩展列：年度报告相关附件-->
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <!--也可启用下面注释部分的el-descriptions代替el-form-->
                    <el-form label-position="left" class="demo-table-expand">
                      <el-form-item label="评估标题">
                        <span>{{ props.row.assessName }}</span>
                      </el-form-item>
                      <el-form-item label="评估日期">
                        <span>{{ props.row.assessDate }}</span>
                      </el-form-item>
                      <el-form-item label="评估得分">
                        <span>{{ props.row.assessScore }}</span>
                      </el-form-item>
                      <el-form-item label="附件列表">
                        <el-table
                          ref="table"
                          border
                          v-loading="anuAssessFileLoading"
                          :data="anuAssessFiles"
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
                                      @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                          @click="toUploadAnuAssessFile(props.row)"
                        >上传年度评估报告
                        </el-button>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column
                  type="index"
                  width="50"
                  label="序号"
                />
                <el-table-column prop="assessName" label="评估标题" min-width="80"/>
                <el-table-column label="评估日期" min-width="120" :formatter="assessDateFormat"/>
                <el-table-column prop="assessScore" label="评估得分" min-width="100"/>
                <el-table-column prop="createBy" label="创建人" min-width="80"/>
                <!--   编辑与删除   -->
                <el-table-column
                  label="操作"
                  width="130px"
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
                        @click="editAnuAssess(scope.row)"
                      />
                      <!--删除-->
                      <el-popover
                        :ref="`delAnuAssess-popover-${scope.$index}`"
                        v-permission="permission.edit"
                        placement="top"
                        width="180"
                      >
                        <p>确定删除本条数据吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button
                            size="mini"
                            type="text"
                            @click="scope._self.$refs[`delAnuAssess-popover-${scope.$index}`].doClose()"
                          >取消
                          </el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            @click="deleteAnuAssess(scope.row), scope._self.$refs[`delAnuAssess-popover-${scope.$index}`].doClose()"
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
            </el-collapse-item>
            <!--供应商审核信息-->
            <el-collapse-item title="供应商审核信息" name="12" class="collapse-item">
              <!--            <el-descriptions border column="1">
                            <el-descriptions-item label="审核计划附件">
                              <el-button
                                type="primary"
                                plain
                                @click="toUploadPlanFile"
                              >添加审核计划
                              </el-button>
                              <el-table
                                ref="table"
                                border
                                v-loading="auditPlanFileLoading"
                                :data="auditPlanFiles"
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
                                <el-table-column prop="createBy" label="创建者" />
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
                                            @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                            <el-descriptions-item v-if="auditPlanFiles.length>0" label="审核信息">
                              <el-row >
                                <el-col :span="8">
                                  <el-form-item label="审核日期" prop="auditDate">
                                    <el-date-picker
                                      v-model="supplierForm.auditDate"
                                      :picker-options="regTimeOption"
                                      type="date"
                                      placeholder="请输入审核日期"
                                      style="width: 100%;"
                                      align="right"
                                    />
                                  </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                  <el-form-item label="审核结果" prop="auditResult">
                                    <el-input v-model="supplierForm.auditResult" style="width: 100%;"/>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                  <el-form-item label="问题解决状态" prop="questionStatus">
                                    <el-select
                                      v-model="supplierForm.questionStatus"
                                      size="small"
                                      placeholder="请选择问题解决状态"
                                      clearable
                                      class="filter-item"
                                      style="width: 100%"
                                    >
                                      <el-option
                                        v-for="item in quesStatusOptions"
                                        :key="item.label"
                                        :label="item.value"
                                        :value="item.value"
                                      />
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                              </el-row>
                              <el-descriptions border column="1" style="margin: 5px;">
                                <el-descriptions-item label="问题发现附件">
                                  <el-row>
                                    <el-button
                                      type="primary"
                                      plain
                                      @click="toUploadQuesFile"
                                    >添加问题附件
                                    </el-button>
                                    <el-table
                                      ref="table"
                                      border
                                      v-loading="auditQuesFileLoading"
                                      :data="auditQuesFiles"
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
                                      <el-table-column prop="createBy" label="创建者" />
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
                                                  @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                                  </el-row>
                                </el-descriptions-item>
                              </el-descriptions>
                              <el-descriptions border column="1" style="margin: 5px;">
                                <el-descriptions-item label="状态选择附件">
                                  <el-row>
                                    <el-button
                                      type="primary"
                                      plain
                                      @click="toUploadStatusFile"
                                    >添加证明
                                    </el-button>
                                    <el-table
                                      ref="table"
                                      border
                                      v-loading="auditStatusFileLoading"
                                      :data="auditStatusFiles"
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
                                      <el-table-column prop="createBy" label="创建者" />
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
                                                  @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
                                  </el-row>
                                </el-descriptions-item>
                              </el-descriptions>
                            </el-descriptions-item>
                          </el-descriptions>-->
              <!--审核计划-->
              <el-row class="row-card">
                <el-button
                  type="primary"
                  plain
                  @click="toUploadPlanFile"
                >添加审核计划
                </el-button>
                <el-table
                  ref="table"
                  border
                  v-loading="auditPlanFileLoading"
                  :data="auditPlanFiles"
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
                              @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
              </el-row>
              <!--审核信息-->
              <el-row class="row-card" v-if="auditPlanFiles.length>0">
                <el-col :span="8">
                  <el-form-item label="审核日期" prop="auditDate">
                    <el-date-picker
                      v-model="supplierForm.auditDate"
                      :picker-options="regTimeOption"
                      type="date"
                      placeholder="请输入审核日期"
                      style="width: 100%;"
                      align="right"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="审核结果" prop="auditResult">
                    <el-input v-model="supplierForm.auditResult" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="问题解决状态" prop="questionStatus">
                    <el-select
                      v-model="supplierForm.questionStatus"
                      size="small"
                      placeholder="请选择问题解决状态"
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in quesStatusOptions"
                        :key="item.label"
                        :label="item.value"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--问题发现附件-->
              <el-row class="row-card" v-if="auditPlanFiles.length>0 && supplierForm.auditResult">
                <el-button
                  type="primary"
                  plain
                  @click="toUploadQuesFile"
                >添加问题附件
                </el-button>
                <el-table
                  ref="table"
                  border
                  v-loading="auditQuesFileLoading"
                  :data="auditQuesFiles"
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
                              @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
              </el-row>
              <!--问题状态附件-->
              <el-row class="row-card"
                      v-if="auditPlanFiles.length>0 && supplierForm.auditResult && supplierForm.questionStatus">
                <el-button
                  type="primary"
                  plain
                  @click="toUploadStatusFile"
                >添加证明
                </el-button>
                <el-table
                  ref="table"
                  border
                  v-loading="auditStatusFileLoading"
                  :data="auditStatusFiles"
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
                              @click="deleteCompanyFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
              </el-row>
            </el-collapse-item>
          </el-form>
        </el-collapse>
      </el-card>
    </div>
    <!--上传公司、财务、准入报告对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="companyFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadCompanyFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleCompanyFileSuccess"
          :on-error="handleError"
          :action="supplierUploadApi + '?supplierId=' + supplierId+'&contactId=' + 0 + '&fileType=' + fileType "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ fileType }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitCompanyFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--新增/编辑客户审核数据弹窗-->
    <el-dialog
      :title="cusAuditOperationTitle"
      :visible.sync="addCusAuditsVisible"
      width="500px"
      :before-close="handleCloseCusAudit"
    >
      <el-form
        class="cusAuditForm"
        ref="cusAuditForm"
        :model="cusAuditForm"
        :rules="cusAuditRules"
        size="small"
        label-width="80px"
      >
        <el-form-item
          label="客户名称"
          prop="customerName"
        >
          <el-input
            v-model="cusAuditForm.customerName"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item
          label="审核方法"
          prop="auditMethod"
        >
          <el-input
            v-model="cusAuditForm.auditMethod"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item
          label="审核时间"
          prop="auditDate"
        >
          <el-date-picker
            v-model="cusAuditForm.auditDate"
            :picker-options="regTimeOption"
            type="date"
            style="width: 100%;"
            placeholder="选择日期时间"
            default-time="12:00:00"
          />
        </el-form-item>
        <el-form-item
          label="审核结果"
          prop="auditResult"
        >
          <el-input
            v-model="cusAuditForm.auditResult"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="cancelSubmitCusAudit(cusAuditForm)">取 消</el-button>
            <el-button type="primary" @click="submitCusAudit">确 定</el-button>
          </span>
    </el-dialog>
    <!--新增/编辑年度报告数据弹窗-->
    <el-dialog
      :title="anuAssessOperationTitle"
      :visible.sync="addAnuAssessVisible"
      width="500px"
      :before-close="handleCloseCusAudit"
    >
      <el-form
        class="cusAuditForm"
        ref="anuAssessForm"
        :model="anuAssessForm"
        :rules="anuAssessRules"
        size="small"
        label-width="80px"
      >
        <el-form-item
          label="标题"
          prop="assessName"
          v-if="anuAssessForm.assessDate"
        >
          <el-input
            v-model="anuAssessForm.assessName"
            style="width: 100%;"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="评估日期"
          prop="assessDate"
          required
        >
          <el-date-picker
            v-model="anuAssessForm.assessDate"
            :picker-options="regTimeOption"
            type="date"
            style="width: 100%;"
            placeholder="选择评估日期"
            @input="assessDateChange"
          />
        </el-form-item>
        <el-form-item
          label="评估得分"
          prop="assessScore"
          required
        >
          <el-input
            v-model="anuAssessForm.assessScore"
            type="number"
            min="0"
            max="100"
            @input="assessScoreChange(arguments[0],100)"
            @change="assessScoreChange(arguments[0],100)"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmitAnuAssess(anuAssessForm)">取 消</el-button>
        <el-button type="primary" @click="submitAnuAssess">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增/编辑质量管理工具数据弹窗-->
    <el-dialog
      :title="methodOperationTitle"
      :visible.sync="addMethodVisible"
      width="500px"
      :before-close="handleCloseCusAudit"
    >
      <el-form
        class="cusAuditForm"
        ref="methodForm"
        :model="methodForm"
        :rules="methodRules"
        size="small"
        label-width="100px"
      >
        <el-form-item
          label="工具标题"
          prop="methodName"
        >
          <!--          <el-input
                      v-model="methodForm.methodName"
                      style="width: 100%;"
                    />-->
          <el-select
            v-model="methodForm.methodName"
            size="small"
            placeholder="可输入自定义工具"
            filterable
            allow-create
            clearable
            class="filter-item"
            style="width: 100%"
          >
            <el-option
              v-for="item in dict.qm_method"
              :key="item.id"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="已使用"
          prop="isUsed"
        >
          <el-checkbox
            v-model="methodForm.isUsed"
            @change="isUsedChange"
          />
        </el-form-item>
        <el-form-item
          label="未使用"
          prop="notUsed"
        >
          <el-checkbox
            v-model="methodForm.notUsed"
            @change="notUsedChange"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmitMethod(methodForm)">取 消</el-button>
        <el-button type="primary" @click="submitMethod">确 定</el-button>
      </span>
    </el-dialog>
    <!--上传客户审核对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="cusAuditFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadCusAuditFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleCusAuditFileSuccess"
          :on-error="handleError"
          :action="supplierUploadApi + '?supplierId=' + supplierId+'&contactId=' + cusAuditId + '&fileType=' + fileType "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ fileType }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitCusAuditFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--上传年度评估报告对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="cusAuditFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadCusAuditFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleCusAuditFileSuccess"
          :on-error="handleError"
          :action="supplierUploadApi + '?supplierId=' + supplierId+'&contactId=' + cusAuditId + '&fileType=' + fileType "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ fileType }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitCusAuditFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--打印预览-->
    <el-dialog title="供应商信息" @dblclick.native="operationConfirm" width="70%" @open="isBtnShow = false"
               @closed="isBtnShow = true" :visible.sync="pdfViewVisible">
      <div id="supplierCanvas" ref="supplierCanvas">
        <div class="xItem">
          <h2 style="text-align:center;">{{ supplierForm.name + '信息' }}</h2>
        </div>
        <!--用户信息-->
        <div class="xItem">
          <el-descriptions title="用户信息" :column="3">
            <el-descriptions-item label="供应商编号">{{ transToNullFormat(supplierForm.supplierCode) }}</el-descriptions-item>
            <el-descriptions-item label="供应商类别">{{ transToNullFormat(supplierForm.type) }}</el-descriptions-item>
            <el-descriptions-item label="产品级别">{{ transToNullFormat(supplierForm.level) }}</el-descriptions-item>
            <el-descriptions-item label="供应商名称">{{ transToNullFormat(supplierForm.name) }}</el-descriptions-item>
            <el-descriptions-item label="供应商简称">{{ transToNullFormat(supplierForm.abb) }}</el-descriptions-item>
            <el-descriptions-item label="准入供应商">{{ boolToNullFormat(supplierForm.isQualified) }}
            </el-descriptions-item>
            <el-descriptions-item label="供应商产品">
              <el-tag
                v-for="tag in supplierForm.prodTags"
                :key="tag"
                style="margin-right:2px; "
              >
                {{ tag }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="供应商简介">{{ transToNullFormat(supplierForm.profile) }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <!--公司信息-->
        <div class="xItem">
          <el-descriptions title="公司信息" :column="3">
            <el-descriptions-item label="国家地区">{{ transToNullFormat(supplierForm.country) }}</el-descriptions-item>
            <el-descriptions-item label="省（州）">{{ transToNullFormat(supplierForm.provincial) }}</el-descriptions-item>
            <el-descriptions-item label="市（县）">{{ transToNullFormat(supplierForm.city) }}</el-descriptions-item>

            <el-descriptions-item label="邮政编号">{{ transToNullFormat(supplierForm.zip) }}</el-descriptions-item>
            <el-descriptions-item label="传真">{{ transToNullFormat(supplierForm.fax) }}</el-descriptions-item>
            <el-descriptions-item label="通讯地址">{{ transToNullFormat(supplierForm.address) }}</el-descriptions-item>

            <el-descriptions-item label="DUNS编码">{{ transToNullFormat(supplierForm.dunsNum) }}</el-descriptions-item>
            <el-descriptions-item label="法人名称">{{ transToNullFormat(supplierForm.leyalPerson) }}</el-descriptions-item>
            <el-descriptions-item label="成立时间">{{
                dateToNullFormat(supplierForm.foundationDate)
              }}
            </el-descriptions-item>

            <el-descriptions-item label="注册ID">{{ transToNullFormat(supplierForm.regId) }}</el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ dateToNullFormat(supplierForm.regDate) }}</el-descriptions-item>
            <el-descriptions-item label="经营状态">{{ transToNullFormat(supplierForm.status) }}</el-descriptions-item>

            <el-descriptions-item label="在线咨询">{{ transToNullFormat(supplierForm.onlineConsul) }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ transToNullFormat(supplierForm.companyEmail) }}</el-descriptions-item>
            <el-descriptions-item label="公司主页">{{ transToNullFormat(supplierForm.webSite) }}</el-descriptions-item>

            <el-descriptions-item label="经营范围">{{ transToNullFormat(supplierForm.companyScope) }}</el-descriptions-item>

          </el-descriptions>
          <el-table
            ref="table"
            v-loading="companyFilesLoading"
            border
            :data="companyFiles"
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
          </el-table>
        </div>
        <!--联系人信息-->
        <div class="xItem">
          <el-descriptions title="联系人信息"></el-descriptions>
          <el-table
            ref="table"
            v-loading="contactsLoading"
            border
            style="width: 100%;"
            :data="contacts"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column prop="name" label="联系人" min-width="80">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column prop="importantLevel" label="重要程度" width="80"/>
            <el-table-column prop="gender" label="性别" width="80"/>
            <el-table-column prop="jobStatus" label="在职状态"/>
            <el-table-column prop="type" label="人员类型"/>
            <el-table-column prop="workTel" label="工作电话"/>
            <el-table-column prop="phone" label="手机号"/>
            <el-table-column prop="email" label="邮箱地址"/>
          </el-table>
        </div>
        <!--物流信息-->
        <div class="xItem">
          <el-descriptions title="物流信息" :column="2">
            <el-descriptions-item label="运送方式">{{
                transToNullFormat(supplierForm.deliveryMethod)
              }}
            </el-descriptions-item>
            <el-descriptions-item label="物流公司">
              <el-tag
                v-for="tag in supplierForm.logisticsTags"
                :key="tag"
                style="margin-right:2px; "
              >
                {{ tag }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <!--财务信息-->
        <div class="xItem">
          <el-descriptions title="财务信息" :column="3">
            <el-descriptions-item label="结算方式">{{ transToNullFormat(supplierForm.settlement) }}</el-descriptions-item>
            <el-descriptions-item label="币种">{{ transToNullFormat(supplierForm.currency) }}</el-descriptions-item>
            <el-descriptions-item label="开户行">{{ transToNullFormat(supplierForm.bankName) }}</el-descriptions-item>

            <el-descriptions-item label="户名">{{ transToNullFormat(supplierForm.accountName) }}</el-descriptions-item>
            <el-descriptions-item label="账号">{{ transToNullFormat(supplierForm.bankAccount) }}</el-descriptions-item>
            <el-descriptions-item label="税号">{{ transToNullFormat(supplierForm.dutyParagraph) }}</el-descriptions-item>
          </el-descriptions>
          <el-table
            ref="table"
            v-loading="accountFilesLoading"
            border
            :data="accountFiles"
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
          </el-table>
        </div>
        <!--公司数据-->
        <div class="xItem">
          <el-descriptions title="公司数据" :column="3">
            <el-descriptions-item label="员工总数">{{ transToNullFormat(supplierForm.empTotal) }}</el-descriptions-item>
            <el-descriptions-item label="管理层数目">{{ transToNullFormat(supplierForm.manNum) }}</el-descriptions-item>
            <el-descriptions-item label="普通员工数目">{{ transToNullFormat(supplierForm.workerNum) }}</el-descriptions-item>

            <el-descriptions-item label="日工作时长(时)">{{
                transToNullFormat(supplierForm.dailyHour)
              }}
            </el-descriptions-item>
            <el-descriptions-item label="周工作天数(天)">{{ transToNullFormat(supplierForm.workDay) }}</el-descriptions-item>

          </el-descriptions>
        </div>
        <!--质量管理认证-->
        <div class="xItem">
          <el-descriptions title="质量管理认证"></el-descriptions>
          <el-table
            ref="table"
            border
            :data="certifications"
            style="width: 100%;"
            :row-class-name="cerTableRowClassName"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column prop="itemName" label="认证项目" min-width="120"/>
            <el-table-column label="已发布" width="60">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.issued"
                  disabled
                  style="margin: 10px 10px 0 10px;"
                />
              </template>
            </el-table-column>
            <el-table-column label="计划中" width="60">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.planned"
                  disabled
                  style="margin: 10px 10px 0 10px;"
                />
              </template>
            </el-table-column>
            <el-table-column prop="sgs" label="认证机构" min-width="100"/>
            <el-table-column prop="cerNum" label="认证码" min-width="100"/>
            <el-table-column label="认证日期" min-width="100" :formatter="releaseDateFormat">
              <template slot-scope="scope">
                {{ dateToNullFormat(scope.row.releaseDate) }}
              </template>
            </el-table-column>
            <el-table-column label="失效日期" min-width="100" :formatter="expireDateFormat">
              <template slot-scope="scope">
                {{ dateToNullFormat(scope.row.expireDate) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--客户审核信息-->
        <div class="xItem">
          <el-descriptions title="客户审核信息"></el-descriptions>
          <el-table
            ref="table"
            v-loading="cusAuditLoading"
            border
            :data="cusAudits"
            style="width: 100%;"
            highlight-current-row
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column prop="customerName" label="客户名称" min-width="80"/>
            <el-table-column prop="auditMethod" label="审核方法" width="140"/>
            <el-table-column prop="auditDate" label="审核日期" min-width="120"/>
            <el-table-column prop="auditResult" label="审核结果" min-width="80"/>
          </el-table>
        </div>
        <!--质量管理工具-->
        <div class="xItem">
          <el-descriptions title="质量管理工具"></el-descriptions>
          <el-table
            ref="table"
            :loading="qmMethodLoading"
            border
            :data="qmMethods"
            style="width: 100%;"
            highlight-current-row
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column prop="methodName" label="质量管理工具名称" min-width="160"/>
            <el-table-column label="已使用" min-width="80">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.isUsed"
                  style="margin: 10px 10px 0 10px;"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column prop="notUsed" label="未使用" min-width="80">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.notUsed"
                  style="margin: 10px 10px 0 10px;"
                  disabled
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--供应商准入信息-->
        <div class="xItem">
          <el-descriptions title="供应商准入信息" :column="2">
            <el-descriptions-item label="获取准入时间">{{
                dateToNullFormat(supplierForm.qualifiedDate)
              }}
            </el-descriptions-item>
            <el-descriptions-item label="准入资格得分">{{
                transToNullFormat(supplierForm.qualifiedScore)
              }}
            </el-descriptions-item>
          </el-descriptions>
          <el-table
            ref="table"
            v-loading="qualifiedFileLoading"
            border
            :data="qualifiedFiles"
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
          </el-table>
        </div>
        <!--年度评估报告-->
        <div class="xItem">
          <el-descriptions title="年度评估报告"></el-descriptions>
          <el-table
            ref="table"
            v-loading="anuAssessLoading"
            border
            :data="anuAssess"
            style="width: 100%;"
            highlight-current-row
          >
            <el-table-column
              type="index"
              width="50"
              label="序号"
            />
            <el-table-column prop="assessName" label="评估标题" min-width="80"/>
            <el-table-column label="评估日期" min-width="120" :formatter="assessDateFormat"/>
            <el-table-column prop="assessScore" label="评估得分" min-width="100"/>
            <el-table-column prop="createBy" label="创建人" min-width="80"/>
          </el-table>
        </div>
        <!--供应商审核信息-->
        <div class="xItem">
          <el-descriptions title="供应商审核信息"></el-descriptions>
          <el-table
            ref="table"
            border
            v-loading="auditPlanFileLoading"
            :data="auditPlanFiles"
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
          </el-table>
          <el-descriptions v-if="auditPlanFiles.length>0" :column="3">
            <el-descriptions-item label="审核日期">{{ dateToNullFormat(supplierForm.auditDate) }}</el-descriptions-item>
            <el-descriptions-item label="审核结果">{{ transToNullFormat(supplierForm.auditResult) }}</el-descriptions-item>
            <el-descriptions-item label="问题解决状态">{{
                transToNullFormat(supplierForm.questionStatus)
              }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="outPutPdfFn"
          type="danger"
          icon="el-icon-download"
          size="mini"
        >导 出
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from '@/utils/auth'
import {mapGetters} from 'vuex'
import {GMTToDate, GMTToYear, judgeIsEqual, validIsNotNull} from '@/utils/validationUtil'
import {addSupplier, editSupplier, getUid} from '@/api/tools/supplier'
import {delSupplierFile, getSupplierFileByCond, supplierFileReplace} from '@/api/tools/SupplierFile'
import {del, getContactBySupplierId} from '@/api/tools/supplierContact'
import {
  addQMCer,
  delQMCer,
  editQMCer,
  getQMCerBySupplierId,
  supplierQMCerReplace
} from '@/api/tools/supplierQMCertification'
import {
  addCusAudit,
  delCusAudit,
  editCusAudit,
  getCusAuditBySupplierId,
  supplierCusAuditReplace
} from '@/api/tools/SupplierCusAudit'
import {
  addAnuAssess,
  delAnuAssess,
  editAnuAssess,
  getAnuAssessBySupplierId,
  supplierAnuAssessmentReplace
} from '@/api/tools/SupplierAnuAsess'
import {
  addQMMethod,
  delQMMethod,
  editQMMethod,
  getQMMethodBySupplierId,
  supplierQMMethodReplace
} from "@/api/tools/supplierQMMethod";

export default {
  name: 'SupplierForm',
  props: ['supplierForm', 'isNew'],
  // 设置数据字典
  dicts: ['supplier_type', 'supplier_level', 'supplier_settlement',
    'supplier_currency', 'supplier_delivery', 'common_status',
    'qm_method', 'qm_certification'],
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      supplierId: null,
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'supplier:add'],
        edit: ['admin', 'supplier:edit']
      },
      supplierRules: {
        name: [
          {required: true, message: '请输入供应商名称', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请为供应商分类', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '请选择供应商级别', trigger: 'blur'}
        ],
        production: [
          {required: true, message: '请添加供应商产品', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '经营状态不可为空', trigger: 'blur'}
        ],
        deliveryMethod: [
          {required: true, message: '请选择运送方式', trigger: 'blur'}
        ]
      },
      inputProdVisible: false,
      inputProdValue: '',
      inputLogisticsVisible: false,
      inputLogisticsValue: '',
      statusOptions: [
        {key: true, display_name: '开业'},
        {key: false, display_name: '停业'}
      ],
      // 时间不可大于现在时间
      regTimeOption: {
        disabledDate(date) {
          return Date.now() < date.getTime()
        }
      },
      expireDateOption: {
        disabledDate(date) {
          return date.getTime() < Date.now()
        }
      },
      uId: null,
      fileType: '',
      companyFilesLoading: false,
      companyFileUploadVisible: false,
      companyFiles: [],
      accountFilesLoading: false,
      accountFiles: [],
      contactsLoading: false,
      contacts: [],
      certificationsLoading: false,
      certifications: [
        {
          id: null,
          supplierId: null,
          itemName: 'ISO9001-2015',
          issued: false,
          planned: false,
          sgs: '',
          cerNum: '',
          releaseDate: null,
          expireDate: null,
          styleType: null
        },
        {
          id: null,
          supplierId: null,
          itemName: 'IATF16949-2016',
          issued: false,
          planned: false,
          sgs: '',
          cerNum: '',
          releaseDate: null,
          expireDate: null,
          styleType: null
        },
        {
          id: null,
          supplierId: null,
          itemName: 'ISO14001-2015',
          issued: false,
          planned: false,
          sgs: '',
          cerNum: '',
          releaseDate: null,
          expireDate: null,
          styleType: null
        },
        {
          id: null,
          supplierId: null,
          itemName: 'ISO45001-2018',
          issued: false,
          planned: false,
          sgs: '',
          cerNum: '',
          releaseDate: null,
          expireDate: null,
          styleType: null
        },
        {
          id: null,
          supplierId: null,
          itemName: 'VDA6.3-2016',
          issued: false,
          planned: false,
          sgs: '',
          cerNum: '',
          releaseDate: null,
          expireDate: null,
          styleType: null
        }
      ],
      cersList: [],
      rowChangedList: [],
      rowItemNameChangeList: [],
      rowIssuedChangeList: [],
      rowPlannedChangedList: [],
      rowSgsChangedList: [],
      rowCerNumChangedList: [],
      rowRelDateChangedList: [],
      rowExpireDateChangedList: [],
      rowItemNameList: [],
      rowIssuedList: [],
      rowPlannedList: [],
      rowSgsList: [],
      rowCerNumList: [],
      rowRelDateList: [],
      rowExpireDateList: [],
      rowStyleList: [],
      initCerItems: ['ISO9001-2015', 'IATF16949-2016', 'ISO14001-2015', 'ISO45001-2018', 'VDA6.3-2016'],
      isInitData: false,
      // 客户审核信息
      cusAuditLoading: false,
      cusAudits: [],
      addCusAuditsVisible: false,
      cusAuditOperationTitle: '',
      cusAuditForm: {
        supplierId: null,
        customerName: null,
        auditMethod: null,
        auditDate: null,
        auditResult: null
      },
      cusAuditRules: {
        customerName: [
          {required: true, message: '客户名称不可为空', trigger: 'blur'}
        ],
        auditMethod: [
          {required: true, message: '审核方法不可为空', trigger: 'blur'}
        ],
        auditDate: [
          {required: true, message: '请输入审核日期', trigger: 'blur'}
        ],
        auditResult: [
          {required: true, message: '请据实输入审核结果', trigger: 'blur'}
        ]
      },
      // 客户审核-附件信息
      cusAuditFileLoading: false,
      cusAuditFiles: [],
      cusAuditId: null,
      cusAuditFileUploadVisible: false,
      // 质量审核工具
      disAdd: false,
      qmMethodLoading: false,
      qmMethods: [],
      methodOperationTitle: '',
      addMethodVisible: false,
      methodForm: {
        methodName: '',
        isUsed: false,
        notUsed: true
      },
      methodRules: {
        methodName: [
          {required: true, message: '请输入质量管理工具名称', trigger: 'blur'}
        ]
      },
      // 准入资格报告
      qualifiedFileLoading: false,
      qualifiedFiles: [],
      // 年度报告
      anuAssessLoading: false,
      anuAssess: [],
      anuAssessOperationTitle: '',
      addAnuAssessVisible: false,
      anuAssessForm: {
        assessName: '',
        assessDate: null,
        assessScore: null
      },
      anuAssessRules: {
        assessDate: [
          {required: true, message: '请输入评估年份日期', trigger: 'blur'}
        ],
        assessScore: [
          {required: true, message: '请输入本次评估得分', trigger: 'blur'}
        ]
      },
      // 年度评估-附件信息
      anuAssessFileLoading: false,
      anuAssessFiles: [],
      // 审核信息
      quesStatusOptions: [
        {
          label: 'closed',
          value: '关闭'
        },
        {
          label: 'opened',
          value: '开启'
        }
      ],
      auditPlanFileLoading: false,
      auditPlanFiles: [],
      auditQuesFileLoading: false,
      auditQuesFiles: [],
      auditStatusFileLoading: false,
      auditStatusFiles: [],
      pdfViewVisible: false,
      isBtnShow: true
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'supplierUploadApi'
    ])
  },
  created: function () {
    this.getSupplierUid()
  },
  mounted() {
    this.initForm()
    this.cersList = this.loadAll();
  },
  methods: {
    initForm: function () {
      // alert(JSON.stringify(this.$props.isNew))
      if (!this.$props.isNew) {
        // alert(JSON.stringify(this.$props.supplierForm))
        this.$props.supplierForm.isQualified = validIsNotNull(this.$props.supplierForm.isQualified) ? this.$props.supplierForm.isQualified.toString() : 'false'
        this.getSupplierComFile(this.$props.supplierForm.id)
        this.getSupplierQualifiedFile(this.$props.supplierForm.id)
        this.getSupplierAuditPlanFile(this.$props.supplierForm.id)
        this.getSupplierAuditQuesFile(this.$props.supplierForm.id)
        this.getSupplierAuditStatusFile(this.$props.supplierForm.id)
        this.getSupplierAccountFile(this.$props.supplierForm.id)
        this.getSupplierContact(this.$props.supplierForm.id)
        this.getSupplierQMCer(this.$props.supplierForm.id)
        this.getSupplierCusAudit(this.$props.supplierForm.id)
        this.getSupplierAnuAssess(this.$props.supplierForm.id)
        this.getSupplierMethod(this.$props.supplierForm.id)
      } else {
        // 初始化审核管理认证信息
        this.rowChangedList = []
        this.rowItemNameList = []
        this.rowIssuedList = []
        this.rowSgsList = []
        this.rowCerNumList = []
        this.rowRelDateList = []
        this.rowExpireDateList = []
        this.rowIssuedChangeList = []
        this.rowPlannedChangedList = []
        this.rowSgsChangedList = []
        this.rowCerNumChangedList = []
        this.rowRelDateChangedList = []
        this.rowExpireDateChangedList = []
        this.rowItemNameList = []
        this.rowItemNameChangeList = []
        this.certifications.forEach((data, index) => {
          this.rowIssuedChangeList.push(false)
          this.rowPlannedChangedList.push(false)
          this.rowItemNameChangeList.push(false)
          this.rowSgsChangedList.push(false)
          this.rowCerNumChangedList.push(false)
          this.rowRelDateChangedList.push(false)
          this.rowExpireDateChangedList.push(false)
          this.rowChangedList.push(false)
          this.rowItemNameList.push(data.itemName)
          this.rowIssuedList.push(data.issued)
          this.rowPlannedList.push(data.planned)
          this.rowSgsList.push(data.sgs)
          this.rowCerNumList.push(data.cerNum)
          this.rowRelDateList.push(data.releaseDate)
          this.rowExpireDateList.push(data.expireDate)
        })
      }
    },
    querySearch(queryString, cb) {
      let cers = this.cersList;
      var results = queryString ? cers.filter(this.createFilter(queryString)) : cers;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
        {"value": "ISO9001-2015"},
        {"value": "IATF16949-2016"},
        {"value": "ISO14001-2015"},
        {"value": "ISO45001-2018"},
        {"value": "VDA6.3-2016"}
      ];
    },
    getSupplierUid() {
      getUid().then(res => {
        // alert(JSON.stringify(res))
        this.uId = res
        // this.initSupplierQMCer(this.uId)
      })
    },
    // 编辑记录
    editCusAudit(row) {
      this.cusAuditForm = row
      this.cusAuditOperationTitle = '编辑客户审核数据'
      this.addCusAuditsVisible = true
    },
    // 编辑记录
    editAnuAssess(row) {
      this.anuAssessForm = row
      this.anuAssessOperationTitle = '编辑评估年度'
      this.addAnuAssessVisible = true
    },
    // 编辑质量管理工具信息
    editMethod(row) {
      this.methodForm = row
      this.methodOperationTitle = '编辑质量管理工具'
      this.addMethodVisible = true
    },
    // 添加客户审核数据
    toAddCusAudit() {
      this.cusAuditForm = {}
      this.cusAuditOperationTitle = '新增客户审核数据'
      this.addCusAuditsVisible = true
    },
    // 添加年度报告
    toAddAnnualAssess() {
      this.anuAssessForm = {}
      this.anuAssessOperationTitle = '新增评估年度'
      this.addAnuAssessVisible = true
    },
    // 添加质量管理工具信息
    toAddQMMethod() {
      this.methodForm = {}
      this.methodOperationTitle = '新增质量管理工具'
      this.addMethodVisible = true
    },
    // 关闭弹窗前操作
    handleCloseCusAudit(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },

    // 取消提交客户审核信息
    cancelSubmitCusAudit(form) {
      if (this.cusAuditOperationTitle === '编辑客户审核数据') {
        this.getSupplierCusAudit(form.supplierId)
      }
      this.addCusAuditsVisible = false
    },
    // 取消提交年度审核信息
    cancelSubmitAnuAssess(form) {
      if (this.anuAssessOperationTitle === '编辑评估年度') {
        this.getSupplierAnuAssess(form.supplierId)
      }
      this.addAnuAssessVisible = false
    },
    // 取消提交客户审核信息
    cancelSubmitMethod(form) {
      if (this.methodOperationTitle === '编辑质量管理工具') {
        this.getSupplierMethod(form.supplierId)
      }
      this.addMethodVisible = false
    },
    // 已使用变化
    isUsedChange(val) {
      this.methodForm.notUsed = !val;
    },
    // 未使用变化
    notUsedChange(val) {
      this.methodForm.isUsed = !val;
    },
    // 评估时间
    assessDateChange(date) {
      this.anuAssessForm.assessName = GMTToYear(date) + '年度评估'
    },
    // 提交客户审核信息
    submitCusAudit() {
      this.$refs.cusAuditForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.cusAuditForm.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
          if (this.cusAuditForm.id === undefined) {
            addCusAudit(this.cusAuditForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增客户审核记录成功!',
                type: 'success'
              })
              this.getSupplierCusAudit(this.cusAuditForm.supplierId)
            })
          } else {
            editCusAudit(this.cusAuditForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 变更客户审核记录成功!',
                type: 'success'
              })
              this.getSupplierCusAudit(this.cusAuditForm.supplierId)
            })
          }
          this.addCusAuditsVisible = false
        }
      })
    },
    // 提交客户审核信息
    submitAnuAssess() {
      this.$refs.anuAssessForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.anuAssessForm.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
          if (this.anuAssessForm.id === undefined) {
            addAnuAssess(this.anuAssessForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增评估年份信息成功!',
                type: 'success'
              })
              this.getSupplierAnuAssess(this.anuAssessForm.supplierId)
            })
          } else {
            editAnuAssess(this.anuAssessForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 变更评估年份信息成功!',
                type: 'success'
              })
              this.getSupplierAnuAssess(this.anuAssessForm.supplierId)
            })
          }
          this.addAnuAssessVisible = false
        }
      })
    },
    // 提交质量管理工具信息
    submitMethod() {
      this.$refs.methodForm.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          this.methodForm.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
          if (this.methodForm.id === undefined) {
            addQMMethod(this.methodForm).then(res => {
              this.$message({
                message: 'Add Record Success! 新增质量管理工具信息成功!',
                type: 'success'
              })
              this.getSupplierMethod(this.methodForm.supplierId)
            })
          } else {
            editQMMethod(this.methodForm).then(res => {
              this.$message({
                message: 'Edit Record Success! 变更质量管理工具信息成功!',
                type: 'success'
              })
              this.getSupplierMethod(this.methodForm.supplierId)
            })
          }
          this.addMethodVisible = false
        }
      })
    },
    // 删除客户审核记录
    deleteNum(row) {
      // alert(JSON.stringify(id))
      const data = []
      data.push(row.id)
      delCusAudit(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除客户审核记录成功!',
          type: 'success'
        })
        this.getSupplierCusAudit(row.supplierId)
      }).catch(() => {
        this.$message({
          message: 'Del Record Failed! 删除客户审核记录失败!',
          type: 'error'
        })
      })
    },
    // 删除年度评估信息
    deleteAnuAssess(row) {
      const data = []
      data.push(row.id)
      delAnuAssess(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除年度评估信息成功!',
          type: 'success'
        })
        this.getSupplierAnuAssess(row.supplierId)
      }).catch(() => {
        this.$message({
          message: 'Del Record Failed! 删除年度评估信息失败!',
          type: 'error'
        })
      })
    },
    // 删除质量管理工具信息
    deleteMethod(row) {
      const data = []
      data.push(row.id)
      delQMMethod(data).then(res => {
        this.$message({
          message: 'Del Record Success! 删除质量管理工具信息成功!',
          type: 'success'
        })
        this.getSupplierMethod(row.supplierId)
      }).catch(() => {
        this.$message({
          message: 'Del Record Failed! 删除质量管理工具信息失败!',
          type: 'error'
        })
      })
    },
    // 获取供应商质量管理认证信息
    getSupplierQMCer(id) {
      this.certificationsLoading = true
      this.certifications = []
      this.rowChangedList = []
      this.rowIssuedList = []
      this.rowSgsList = []
      this.rowCerNumList = []
      this.rowRelDateList = []
      this.rowExpireDateList = []
      this.rowIssuedChangeList = []
      this.rowPlannedChangedList = []
      this.rowSgsChangedList = []
      this.rowCerNumChangedList = []
      this.rowRelDateChangedList = []
      this.rowExpireDateChangedList = []
      this.rowStyleList = []
      this.rowItemNameList = []
      this.rowItemNameChangeList = []
      getQMCerBySupplierId(id).then(res => {
        // alert(JSON.stringify(res))
        this.certifications = res
        this.certificationsLoading = false
        this.certifications.forEach((data, index) => {
          this.rowItemNameChangeList.push(false)
          this.rowIssuedChangeList.push(false)
          this.rowPlannedChangedList.push(false)
          this.rowSgsChangedList.push(false)
          this.rowCerNumChangedList.push(false)
          this.rowRelDateChangedList.push(false)
          this.rowExpireDateChangedList.push(false)
          this.rowChangedList.push(false)
          this.rowItemNameList.push(data.itemName)
          this.rowIssuedList.push(data.issued)
          this.rowPlannedList.push(data.planned)
          this.rowSgsList.push(data.sgs)
          this.rowCerNumList.push(data.cerNum)
          this.rowRelDateList.push(data.releaseDate)
          this.rowExpireDateList.push(data.expireDate)
          this.rowStyleList.push(data.styleType)
        })
      })
    },
    /*initSupplierQMCer(id) {
      // alert(id)
      this.certificationsLoading = true
      this.certifications = []
      this.rowChangedList = []
      this.rowIssuedList = []
      this.rowSgsList = []
      this.rowCerNumList = []
      this.rowRelDateList = []
      this.rowExpireDateList = []
      this.rowIssuedChangeList = []
      this.rowPlannedChangedList = []
      this.rowSgsChangedList = []
      this.rowCerNumChangedList = []
      this.rowRelDateChangedList = []
      this.rowExpireDateChangedList = []
      initCerByUid(id).then(res => {
        // alert(JSON.stringify(res))
        this.certifications = res
        this.certificationsLoading = false
        this.certifications.forEach((data, index) => {
          this.rowIssuedChangeList.push(false)
          this.rowPlannedChangedList.push(false)
          this.rowSgsChangedList.push(false)
          this.rowCerNumChangedList.push(false)
          this.rowRelDateChangedList.push(false)
          this.rowExpireDateChangedList.push(false)
          this.rowChangedList.push(false)
          this.rowIssuedList.push(data.issued)
          this.rowPlannedList.push(data.planned)
          this.rowSgsList.push(data.sgs)
          this.rowCerNumList.push(data.cerNum)
          this.rowRelDateList.push(data.releaseDate)
          this.rowExpireDateList.push(data.expireDate)
        })
      })
    },*/
    // 保存认证信息
    saveSupplierQMCer(data, index) {
      // alert(JSON.stringify(data.expireDate))
      // alert(index)
      if (!validIsNotNull(data.itemName)) {
        this.$message({
          message: 'ItemName needed! 认证项目名称不可为空!',
          type: 'error'
        })
        let id = document.getElementById('itemName_' + index)
        id.setAttribute('style', 'border-color:#f00;')
        return false
      }
      // 当已发布时候，须对其他项判空;切换为计划中认证机构等都要重置为空
      if (data.issued) {
        if (!validIsNotNull(data.sgs)) {
          this.$message({
            message: 'Issued need SGS! 已发布状态下认证信息不可为空!',
            type: 'error'
          })
          // let id = document.getElementById(data.itemName)
          // id.setAttribute('style','border:1px #f00 solid;')
          return false
        } else if (!validIsNotNull(data.cerNum)) {
          this.$message({
            message: 'Issued need Certification Number! 已发布状态下认证码不可为空!',
            type: 'error'
          })
          return false
        } else if (!validIsNotNull(data.releaseDate)) {
          this.$message({
            message: 'Issued need Certification ReleaseDate! 已发布状态下发布生效日期不可为空!',
            type: 'error'
          })
          return false
        } else if (!validIsNotNull(data.expireDate)) {
          this.$message({
            message: 'Issued need Certification ExpireDate! 已发布状态下失效日期不可为空!',
            type: 'error'
          })
          return false
        }
      }
      if (!validIsNotNull(data.id)) {
        data.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
        addQMCer(data).then(res => {
          this.disAdd = false
          this.$message({
            message: 'Add Certification Success! 添加认证信息成功!',
            type: 'success'
          })
          // alert(JSON.stringify(res))
          // 重置各行各列值集内容
          this.resetColAndRow(index, res)
          // alert("新的认证信息："+JSON.stringify(this.certifications[index]))
          this.restCerChanged(index)
          // 刷新列表-重置样式
          if (!this.$props.isNew) {
            this.getSupplierQMCer(data.supplierId)
          }
        })
      } else {
        editQMCer(data).then(res => {
          this.$message({
            message: 'Update Certification Success! 更新认证信息成功!',
            type: 'success'
          })
          // alert(JSON.stringify(res))
          this.certifications[index] = res
          // alert(JSON.stringify(this.certifications[index]))
          console.log(this.certifications[index])
          this.restCerChanged(index)
          // 刷新列表-重置样式
          if (!this.$props.isNew) {
            this.getSupplierQMCer(data.supplierId)
          }
        })
      }
    },
    // 重置行列数值
    resetColAndRow(index, res) {
      // 重置行数值
      this.certifications[index].id = res.id
      this.certifications[index].itemName = res.itemName
      this.certifications[index].supplierId = res.supplierId
      this.certifications[index].issued = res.issued
      this.certifications[index].planned = res.planned
      this.certifications[index].sgs = res.sgs
      this.certifications[index].cerNum = res.cerNum
      this.certifications[index].releaseDate = res.releaseDate
      this.certifications[index].expireDate = res.expireDate
      this.certifications[index].styleType = res.styleType
      // 重置列数据
      this.rowItemNameList[index] = res.itemName
      this.rowIssuedList[index] = res.issued
      this.rowPlannedList[index] = res.planned
      this.rowSgsList[index] = res.sgs
      this.rowCerNumList[index] = res.cerNum
      this.rowRelDateList[index] = res.releaseDate
      this.rowExpireDateList[index] = res.expireDate
      this.rowStyleList[index] = res.styleType
      // alert(JSON.stringify(this.certifications))
    },
    // 重置变更
    restCerChanged(index) {
      // alert("重置生效")
      this.rowIssuedChangeList[index] = false
      this.rowIssuedChangeList[index] = false
      this.rowPlannedChangedList[index] = false
      this.rowSgsChangedList[index] = false
      this.rowCerNumChangedList[index] = false
      this.rowRelDateChangedList[index] = false
      this.rowExpireDateChangedList[index] = false
      this.rowChangedList[index] = false
    },
    // 公司附件
    getSupplierComFile(id) {
      this.companyFilesLoading = true
      this.companyFiles = []
      const obj = {
        supplierId: id,
        fileType: '公司'
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.companyFiles = res
        this.companyFilesLoading = false
      })
    },
    // 准入资格附件
    getSupplierQualifiedFile(id) {
      this.qualifiedFileLoading = true
      this.qualifiedFiles = []
      const obj = {
        supplierId: id,
        fileType: '准入报告'
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.qualifiedFiles = res
        this.qualifiedFileLoading = false
      })
    },
    // 获取审核计划附件
    getSupplierAuditPlanFile(id) {
      this.auditPlanFileLoading = true
      this.auditPlanFiles = []
      const obj = {
        supplierId: id,
        fileType: '审核计划'
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.auditPlanFiles = res
        this.auditPlanFileLoading = false
      })
    },
    // 获取审核问题附件
    getSupplierAuditQuesFile(id) {
      this.auditQuesFileLoading = true
      this.auditQuesFiles = []
      const obj = {
        supplierId: id,
        fileType: '审核问题'
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.auditQuesFiles = res
        this.auditQuesFileLoading = false
      })
    },
    // 获取审核状态附件
    getSupplierAuditStatusFile(id) {
      this.auditStatusFileLoading = true
      this.auditStatusFiles = []
      const obj = {
        supplierId: id,
        fileType: '审核状态'
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.auditStatusFiles = res
        this.auditStatusFileLoading = false
      })
    },
    // 获取供应商客户审核信息
    getSupplierCusAudit(id) {
      this.cusAuditLoading = true
      this.cusAudits = []
      getCusAuditBySupplierId(id).then(res => {
        // alert(JSON.stringify(res))
        this.cusAudits = res
        this.cusAuditLoading = false
      })
    },
    // 获取年度报告信息
    getSupplierAnuAssess(id) {
      this.anuAssessLoading = true
      this.anuAssess = []
      getAnuAssessBySupplierId(id).then(res => {
        // alert(JSON.stringify(res))
        this.anuAssess = res
        this.anuAssessLoading = false
      })
    },
    // 获取质量管理工具信息
    getSupplierMethod(id) {
      this.methodLoading = true
      this.qmMethods = []
      getQMMethodBySupplierId(id).then(res => {
        // alert(JSON.stringify(res))
        this.qmMethods = res
        this.methodLoading = false
      })
    },
    // 获取供应商联系人
    getSupplierContact(id) {
      this.contactsLoading = false
      this.contacts = []
      getContactBySupplierId(id).then(res => {
        // alert(JSON.stringify(res))
        this.contacts = res
        this.contactsLoading = false
      })
    },
    // 添加管理审核认证信息
    toAddSupplierQMCer() {
      // alert("即将添加认证信息")
      const obj = {
        id: null,
        supplierId: null,
        itemName: '',
        issued: false,
        planned: false,
        sgs: '',
        cerNum: '',
        releaseDate: null,
        expireDate: null
      }
      this.certifications.push(obj)
      this.disAdd = true
    },
    // 删除联系人信息
    deleteContact(row) {
      const data = []
      data.push(row.id)
      del(data).then(res => {
        this.$message({
          message: 'Del Contact Success! 删除联系人成功!',
          type: 'success'
        })
        this.getSupplierContact(this.$props.supplierForm.id)
      }).catch(() => {
        this.$message({
          message: 'Del Contact Failed! 删除联系人失败!',
          type: 'error'
        })
      })
    },
    //监控认证信息表格变化
    issuedChange(index, row) {
      // alert(row.issued)
      this.rowIssuedChangeList[index] = this.rowIssuedList[index] !== row.issued;
      this.judgeRowChange(index)
    },
    cerTableRowClassName({row, rowIndex}) {
      // alert(JSON.stringify(row))
      const type = row.styleType
      if (validIsNotNull(type)) {
        if (type === 'alert') {
          return 'overdue-row'
        } else if (type === 'warn') {
          return 'soon-row'
        }
      } else {
        return ''
      }
    },
    // 计划中选择变化
    plannedChange(index, row) {
      // alert(row.planned)
      if (row.planned) {
        this.$confirm('【计划】状态下，认证机构、ID码、认证日期、失效日期等无须填写，已有数值将会自动置空？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 确定状态',
          cancelButtonText: 'No 回滚状态'
        })
          .then(() => {
            row.planned = true
            row.sgs = null
            row.cerNum = null
            row.releaseDate = null
            row.expireDate = null
            this.rowPlannedChangedList[index] = this.rowPlannedList[index] !== row.planned;
            this.rowSgsChangedList[index] = !judgeIsEqual(this.rowSgsList[index], validIsNotNull(row.sgs) ? row.sgs.trim() : '');
            this.rowCerNumChangedList[index] = !judgeIsEqual(this.rowCerNumList[index], validIsNotNull(row.cerNum) ? row.cerNum.trim() : '');
            this.rowRelDateChangedList[index] = !judgeIsEqual(this.rowRelDateList[index], validIsNotNull(row.releaseDate) ? GMTToDate(row.releaseDate) : '');
            this.rowExpireDateChangedList[index] = !judgeIsEqual(this.rowExpireDateList[index], validIsNotNull(row.expireDate) ? GMTToDate(row.expireDate) : '');
            this.judgeRowChange(index)
          })
          .catch(() => {
            row.planned = false
            this.rowPlannedChangedList[index] = false;
            this.judgeRowChange(index)
          })
      } else {
        this.rowPlannedChangedList[index] = this.rowPlannedList[index] !== row.planned;
        this.judgeRowChange(index)
      }
    },
    itemNameChange(index, row) {
      if (validIsNotNull(row.itemName)) {
        let id = document.getElementById('itemName_' + index)
        id.setAttribute('style', 'border-color:#C0C4CC;')
      }
      this.rowItemNameChangeList[index] = !judgeIsEqual(this.rowItemNameList[index], validIsNotNull(row.itemName) ? row.itemName.trim() : '');
      this.judgeRowChange(index)
    },
    // 认证机构变化
    sgsChange(index, row) {
      this.rowSgsChangedList[index] = !judgeIsEqual(this.rowSgsList[index], validIsNotNull(row.sgs) ? row.sgs.trim() : '');
      this.judgeRowChange(index)
    },
    // 认证码变化
    cerNumChange(index, row) {
      this.rowCerNumChangedList[index] = !judgeIsEqual(this.rowCerNumList[index], validIsNotNull(row.cerNum) ? row.cerNum.trim() : '');
      this.judgeRowChange(index)
    },
    // 认证时间变化
    relDateChange(index, row) {
      // alert(JSON.stringify(this.rowRelDateChangedList))
      this.rowRelDateChangedList[index] = !judgeIsEqual(this.rowRelDateList[index], validIsNotNull(row.releaseDate) ? GMTToDate(row.releaseDate) : '');
      this.judgeRowChange(index)
    },
    expireDateChange(index, row) {
      let expireDate = validIsNotNull(row.expireDate) ? GMTToDate(row.expireDate) : ''
      this.rowExpireDateChangedList[index] = !judgeIsEqual(this.rowExpireDateList[index], expireDate);
      this.judgeRowChange(index)
      // 获取过期时间天数差
      // alert(expireDate)
      // let days = dateDiff(row.expireDate)
      // if(days<0){
      //   //
      // }
    },
    judgeRowChange(index) {
      this.rowChangedList[index] = this.rowItemNameChangeList[index] || this.rowIssuedChangeList[index] || this.rowPlannedChangedList[index] || this.rowSgsChangedList[index] ||
        this.rowCerNumChangedList[index] || this.rowRelDateChangedList[index] || this.rowExpireDateChangedList[index]
      // alert("序号" + index + "是否改变了：" + this.rowChangedList[index])
    },
    // 删除认证信息
    deleteCer(row) {
      // alert(JSON.stringify(row))
      const data = []
      data.push(row.id)
      delQMCer(data).then(res => {
        this.$message({
          message: 'Del Certification Success! 删除认证信息成功!',
          type: 'success'
        })
        this.getSupplierQMCer(row.supplierId)
      }).catch(() => {
        this.$message({
          message: 'Del Certification Failed! 删除认证信息失败!',
          type: 'error'
        })
      })
    },
    // 取消认证信息的添加
    cancelCer(index, row) {
      // alert(JSON.stringify(row))
      // alert(index)
      this.certifications.pop()
      this.disAdd = false
    },
    // 发布日期格式
    releaseDateFormat(row, col) {
      if (validIsNotNull(row.releaseDate)) {
        return GMTToDate(row.releaseDate)
      }
    },
    // 失效日期格式
    expireDateFormat(row, col) {
      if (validIsNotNull(row.expireDate)) {
        return GMTToDate(row.expireDate)
      }
    },
    assessDateFormat(row, col) {
      if (validIsNotNull(row.assessDate)) {
        return GMTToDate(row.assessDate)
      }
    },
    // 展开客户审核信息行
    expendCusAuditSelected(row, expands) {
      // alert(this.uId)
      this.cusAuditId = row.id
      this.supplierId = row.supplierId
      this.getCusAuditFile(this.supplierId, this.cusAuditId)
    },
    // 展开年度审核报告信息行
    expendAnuAssessSelected(row, expands) {
      // alert(this.uId)
      this.cusAuditId = row.id
      this.supplierId = row.supplierId
      this.getAnuAssessFile(this.supplierId, this.cusAuditId)
    },
    // 查询客户审核附件列表
    getCusAuditFile(supplierId, cusAuditId) {
      this.cusAuditFileLoading = true
      this.cusAuditFiles = []
      const obj = {
        supplierId: supplierId,
        fileType: '客户审核',
        supplierContactId: cusAuditId
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.cusAuditFiles = res
        this.cusAuditFileLoading = false
      })
    },
    // 查询年度评估附件列表
    getAnuAssessFile(supplierId, anuAssessId) {
      this.anuAssessFileLoading = true
      this.anuAssessFiles = []
      const obj = {
        supplierId: supplierId,
        fileType: '年度评估',
        supplierContactId: anuAssessId
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.anuAssessFiles = res
        this.anuAssessFileLoading = false
      })
    },
    // 获取财务相关附件
    getSupplierAccountFile(id) {
      this.accountFilesLoading = true
      this.accountFiles = []
      const obj = {
        supplierId: id,
        fileType: '财务'
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.accountFiles = res
        this.accountFilesLoading = false
      })
    },
    showInputProd() {
      this.inputProdVisible = true
      this.$nextTick(_ => {
        this.$refs.prodTagInput.$refs.input.focus()
      })
    },
    handleProdClose(tag) {
      this.supplierForm.prodTags.splice(this.supplierForm.prodTags.indexOf(tag), 1)
      this.$props.supplierForm.production = this.supplierForm.prodTags.join(',')
    },
    handleInputProdConfirm() {
      const inputValue = this.inputProdValue
      if (inputValue) {
        this.supplierForm.prodTags.push(inputValue)
      }
      this.$props.supplierForm.production = this.supplierForm.prodTags.join(',')
      this.inputProdVisible = false
      this.inputProdValue = ''
    },
    showInputLogistics() {
      this.inputLogisticsVisible = true
      this.$nextTick(_ => {
        this.$refs.logisticsTagInput.$refs.input.focus()
      })
    },
    handleLogisticsClose(tag) {
      this.supplierForm.logisticsTags.splice(this.supplierForm.logisticsTags.indexOf(tag), 1)
      this.$props.supplierForm.logistics = this.supplierForm.logisticsTags.join(',')
    },
    handleInputLogisticsConfirm() {
      const inputValue = this.inputLogisticsValue.trim()
      if (inputValue) {
        this.supplierForm.logisticsTags.push(inputValue)
      }
      this.$props.supplierForm.logistics = this.supplierForm.logisticsTags.join(',')
      this.inputLogisticsVisible = false
      this.inputLogisticsValue = ''
    },
    // 上传公司相关附件
    toUploadCusAuditFile(row) {
      this.supplierId = row.supplierId
      this.cusAuditId = row.id
      // alert(this.supplierId)
      this.fileType = '客户审核'
      this.cusAuditFileUploadVisible = true
    },
    // 上传公司相关附件
    toUploadAnuAssessFile(row) {
      this.supplierId = row.supplierId
      this.cusAuditId = row.id
      // alert(this.supplierId)
      this.fileType = '年度评估'
      this.cusAuditFileUploadVisible = true
    },
    // 上传公司相关附件
    toUploadCompanyFile() {
      // alert(this.uId)
      this.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
      // alert(this.supplierId)
      this.fileType = '公司'
      this.companyFileUploadVisible = true
    },
    // 上传审核计划附件
    toUploadPlanFile() {
      // alert(this.uId)
      this.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
      // alert(this.supplierId)
      this.fileType = '审核计划'
      this.companyFileUploadVisible = true
    },
    // 上传审核计划附件
    toUploadStatusFile() {
      // alert(this.uId)
      this.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
      // alert(this.supplierId)
      this.fileType = '审核状态'
      this.companyFileUploadVisible = true
    },
    // 上传审核计划附件
    toUploadQuesFile() {
      // alert(this.uId)
      this.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
      // alert(this.supplierId)
      this.fileType = '审核问题'
      this.companyFileUploadVisible = true
    },
    // 上传财务信息相关附件
    toUploadAccountFile() {
      this.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
      this.fileType = '财务'
      this.companyFileUploadVisible = true
    },
    // 上传财务信息相关附件
    toUploadQualifiedFile() {
      this.supplierId = !this.$props.isNew ? this.$props.supplierForm.id : this.uId
      this.fileType = '准入报告'
      this.companyFileUploadVisible = true
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
    submitCompanyFileUpload() {
      // alert(this.supplierId)
      this.$refs.uploadCompanyFile.submit()
    },
    submitCusAuditFileUpload() {
      this.$refs.uploadCusAuditFile.submit()
    },
    handleCompanyFileSuccess() {
      this.$message.success('上传文件成功!')
      this.$refs.uploadCompanyFile.clearFiles()
      if (this.fileType === '财务') {
        this.getSupplierAccountFile(this.supplierId)
      } else if (this.fileType === '公司') {
        this.getSupplierComFile(this.supplierId)
      } else if (this.fileType === '准入报告') {
        this.getSupplierQualifiedFile(this.supplierId)
      } else if (this.fileType === '审核计划') {
        this.getSupplierAuditPlanFile(this.supplierId)
      } else if (this.fileType === '审核状态') {
        this.getSupplierAuditStatusFile(this.supplierId)
      } else if (this.fileType === '审核问题') {
        this.getSupplierAuditQuesFile(this.supplierId)
      }
    },
    handleCusAuditFileSuccess() {
      this.$message.success('上传文件成功!')
      this.$refs.uploadCusAuditFile.clearFiles()
      if (this.fileType === '客户审核') {
        this.getCusAuditFile(this.supplierId, this.cusAuditId)
      } else if (this.fileType === '年度评估') {
        this.getAnuAssessFile(this.supplierId, this.cusAuditId)
      }
    },
    // 删除附件
    deleteCompanyFile(row) {
      const data = []
      data.push(row.id)
      delSupplierFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        // alert(row.fileType)
        if (row.fileType === '财务') {
          this.getSupplierAccountFile(row.supplierId)
        } else if (row.fileType === '公司') {
          this.getSupplierComFile(row.supplierId)
        } else if (row.fileType === '准入报告') {
          this.getSupplierQualifiedFile(row.supplierId)
        } else if (row.fileType === '审核计划') {
          this.getSupplierAuditPlanFile(row.supplierId)
        } else if (row.fileType === '审核状态') {
          this.getSupplierAuditStatusFile(row.supplierId)
        } else if (row.fileType === '审核问题') {
          this.getSupplierAuditQuesFile(row.supplierId)
        } else if (row.fileType === '客户审核') {
          this.getCusAuditFile(row.supplierId, row.id)
        } else if (row.fileType === '年度评估') {
          this.getAnuAssessFile(row.supplierId, row.id)
        }
      }).catch(() => {
        this.$message({
          message: 'Del File Failed! 删除附件失败!',
          type: 'error'
        })
      })
    },
    // 保存供应商信息
    saveSupplier(form) {
      // alert(JSON.stringify(this.uId))
      // alert(form.name)
      if (!validIsNotNull(form.name)) {
        this.$message({
          message: 'Name of Supplier needed! 供应商名称不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.type)) {
        this.$message({
          message: 'Type Of Supplier needed! 供应商类别不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.level)) {
        this.$message({
          message: 'Level of Supplier needed! 供应商级别不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.production)) {
        this.$message({
          message: 'Production of Supplier needed! 供应商产品不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.status)) {
        this.$message({
          message: 'Status of Supplier needed! 供应经营状态不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.deliveryMethod)) {
        this.$message({
          message: 'DeliveryMethod of Supplier needed! 供应商物流运送方式不可为空!',
          type: 'error'
        })
      }
      this.$refs.form.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          if (!validIsNotNull(form.id)) {
            addSupplier(form).then(res => {
              this.$message({
                message: 'Create Success! 新建供应商信息保存成功!',
                type: 'success'
              })
              // alert(JSON.stringify(res))
              this.supplierForm = res
              this.supplierId = this.supplierForm.id
              // 更新附件信息
              const params = {
                supplierId: this.supplierId,
                uId: this.uId,
                supplierContactId: null,
                fileTypes: []
              }
              if (this.companyFiles.length > 0) {
                params.fileTypes = ['公司']
                supplierFileReplace(params).then(res => {
                  // alert("更新公司附件成功！")
                  this.getSupplierComFile(this.supplierId)
                })
              }
              if (this.accountFiles.length > 0) {
                params.fileTypes = ['财务']
                supplierFileReplace(params).then(res => {
                  // alert("更新财务附件成功！")
                  this.getSupplierAccountFile(this.supplierId)
                })
              }
              if (this.qualifiedFiles.length > 0) {
                params.fileTypes = ['准入报告']
                supplierFileReplace(params).then(res => {
                  // alert("更新财务附件成功！")
                  this.getSupplierQualifiedFile(this.supplierId)
                })
              }
              if (this.auditPlanFiles.length > 0) {
                params.fileTypes = ['审核计划']
                supplierFileReplace(params).then(res => {
                  // alert("更新财务附件成功！")
                  this.getSupplierAuditPlanFile(this.supplierId)
                })
              }
              if (this.auditQuesFiles.length > 0) {
                params.fileTypes = ['审核问题']
                supplierFileReplace(params).then(res => {
                  // alert("更新财务附件成功！")
                  this.getSupplierAuditQuesFile(this.supplierId)
                })
              }
              if (this.auditStatusFiles.length > 0) {
                params.fileTypes = ['审核状态']
                supplierFileReplace(params).then(res => {
                  // alert("更新财务附件成功！")
                  this.getSupplierAuditStatusFile(this.supplierId)
                })
              }
              // 自动批量更新绑定客户审核等特殊附件信息
              params.fileTypes = ['客户审核', '年度评估']
              params.supplierContactId = 0
              supplierFileReplace(params).then(res => {
                // alert("更新绑定客户审核附件成功")
              })

              // 更新绑定质量管理认证信息
              if (this.certifications.length > 0) {
                const cerObj = {
                  supplierId: this.supplierId,
                  uId: this.uId
                }
                supplierQMCerReplace(cerObj).then(res => {
                  // alert("更新质量管理认证信息成功！")
                  this.getSupplierQMCer(this.supplierId)
                })
              }
              // 更新绑定客户审核信息
              if (this.cusAudits.length > 0) {
                const params = {
                  supplierId: this.supplierId,
                  uId: this.uId
                }
                supplierCusAuditReplace(params).then(res => {
                  // alert("更新质量管理认证信息成功！")
                  this.getSupplierCusAudit(this.supplierId)
                })
              }
              // 更新绑定年度评估报告信息
              if (this.anuAssess.length > 0) {
                const params = {
                  supplierId: this.supplierId,
                  uId: this.uId
                }
                supplierAnuAssessmentReplace(params).then(res => {
                  // alert("更新质量管理认证信息成功！")
                  this.getSupplierAnuAssess(this.supplierId)
                })
              }
              // 更新绑定质量管理工具信息
              if (this.qmMethods.length > 0) {
                const params = {
                  supplierId: this.supplierId,
                  uId: this.uId
                }
                // alert("将要更新质量管理认证信息成功！")
                supplierQMMethodReplace(params).then(res => {
                  // alert("更新质量管理认证信息成功！")
                  this.getSupplierMethod(this.supplierId)
                })
              }
              this.$router.push(
                {
                  path: '/supplier/supplier-update',
                  query: {
                    supplierId: this.$props.supplierForm.id
                  }
                })
            })
          } else {
            this.supplierId = form.id
            editSupplier(form).then(res => {
              this.$message({
                message: 'Update Success! 供应商信息更新成功!',
                type: 'success'
              })
              // alert(JSON.stringify(res))
              this.supplierForm = form
            })
          }
        }
      })
    },
    // 添加联系人
    toAddContact() {
      // alert
      // 跳转到供应商编辑明细中
      this.$router.push(
        {
          path: '/supplier/supplier-contact-add',
          query: {
            supplierId: this.$props.supplierForm.id
          }
        })
    },
    // 年度评估得分
    assessScoreChange(val, maxNum) {
      //转换数字类型
      this.anuAssessForm.assessScore = Number(val)
      //重新渲染
      this.$nextTick(() => {
        //比较输入的值和最大值，返回小的
        let num = Math.min(Number(val), maxNum)
        //输入负值的情况下， = 0（可根据实际需求更该）
        if (num < 0) {
          this.anuAssessForm.assessScore = 0
        } else {
          //反之
          this.anuAssessForm.assessScore = num
        }
      })
    },
    // 准入得分
    qualifiedScoreChange(val, maxNum) {
      //转换数字类型
      this.supplierForm.qualifiedScore = Number(val)
      //重新渲染
      this.$nextTick(() => {
        //比较输入的值和最大值，返回小的
        let num = Math.min(Number(val), maxNum)
        //输入负值的情况下， = 0（可根据实际需求更该）
        if (num < 0) {
          this.supplierForm.qualifiedScore = 0
        } else {
          //反之
          this.supplierForm.qualifiedScore = num
        }
      })
    },
    backToList() {
      this.$router.push(
        {
          path: '/supplier/supplier-list',
          query: {}
        })
    },
    // todo 打印
    savePdf() {
      // alert('todo---即将设计打印模板')
      /*let prints = document.getElementById('canvas');
      prints.title = "供应商-"+ this.supplierForm.name;*/
      this.$PDFSave(this.$refs.supplierCanvas, this.supplierForm.name + '信息')
    },
    outPutPdfFn() {
      let vm = this;
      const A4_WIDTH = 592.28;
      const A4_HEIGHT = 841.89;
      // $myLoading 自定义等待动画组件，实现导出事件的异步等待交互
      // this.$loading('正在导出pdf，请稍候。。。', true);
      const loading = this.myLoading();
      vm.$nextTick(() => {
        // dom的id。
        let target = document.getElementById('supplierCanvas');
        let pageHeight = target.scrollWidth / A4_WIDTH * A4_HEIGHT;
        // 获取分割dom，此处为class类名为item的dom
        let lableListID = document.getElementsByClassName('xItem');
        // 进行分割操作，当dom内容已超出a4的高度，则将该dom前插入一个空dom，把他挤下去，分割
        for (let i = 0; i < lableListID.length; i++) {
          let multiple = Math.ceil((lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight);
          if (this.isSplit(lableListID, i, multiple * pageHeight)) {
            let divParent = lableListID[i].parentNode; // 获取该div的父节点
            let newNode = document.createElement('div');
            newNode.className = 'emptyDiv';
            newNode.style.background = '#ffffff';
            let _H = multiple * pageHeight - (lableListID[i].offsetTop + lableListID[i].offsetHeight);
            newNode.style.height = _H + 100 + 'px';
            newNode.style.width = '100%';
            let next = lableListID[i].nextSibling; // 获取div的下一个兄弟节点
            // 判断兄弟节点是否存在
            console.log(next);
            if (next) {
              // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
              divParent.insertBefore(newNode, next);
            } else {
              // 不存在则直接添加到最后,appendChild默认添加到divParent的最后
              divParent.appendChild(newNode);
            }
          }
        }
        // 传入title和dom标签，此处是 #content
        // 异步函数，导出成功后处理交互
        this.exportPdf("供应商-" + this.supplierForm.name, '#supplierCanvas').then(() => {
          // 自定义等待动画关闭
          // this.$myLoading(false);
          loading.close()
          this.$message({
            type: 'success',
            message: '导出成功'
          });
          this.detailSHow = false;
          let empDivList = document.getElementsByClassName('emptyDiv');
          for (let i = empDivList.length; i >= 0; i--) {
            //删除元素
            if (empDivList[i] != null) {
              empDivList[i].parentNode.removeChild(empDivList[i]);
            }
          }
        })
          .catch(() => {
            // this.$myLoading(false);
            loading.close()
            this.$message({
              type: 'error',
              message: '导出失败，请重试'
            });
          });
      });
    },
    isSplit(nodes, index, pageHeight) {
      // 计算当前这块dom是否跨越了a4大小，以此分割
      return nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight - 20;
    },
    // 常规字符判空转换
    transToNullFormat(val) {
      if (!validIsNotNull(val)) {
        return '--'
      } else {
        return val
      }
    },
    // 时间判空转换
    dateToNullFormat(time) {
      if (!validIsNotNull(time)) {
        return '--'
      } else {
        return GMTToDate(time)
      }
    },
    // 时间判空转换
    boolToNullFormat(b) {
      if (b !== true && b !== false) {
        return '--'
      } else {
        return b === true ? '是' : '否'
      }
    },
    operationConfirm() {
      this.$confirm('导出PDF？继续预览？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '导出PDF',
        cancelButtonText: '继续预览'
      }).then(() => {
        this.outPutPdfFn()
      }).catch(() => {

      })
    },
  }
}
</script>

<style>
.el-table .overdue-row {
  background-color: #f00 !important;
}

.el-table .soon-row {
  background-color: #e6a23c !important;
}

#supplierCanvas .xItem {
  padding: 10px 20px;
}

.save-btn {
  position: fixed;
  bottom: 10px;
  right: 40%;
  z-index: 9999;
}

.print-btn {
  position: fixed;
  top: 10%;
  right: 20%;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .box-card {
  margin-bottom: 5px;

  .el-card__body {
    padding: 0 10px;
  }

  .el-descriptions__header {
    margin: 10px;
  }
}

.el-tag + .el-tag {
  margin-left: 2px;
}

.button-new-tag {
  margin-left: 5px;
  margin-top: 1px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0 !important;
}

::v-deep .el-form-item--small.el-form-item {
  border: 0.5px #75c39f solid;
  margin-bottom: 0 !important;
}

.cusAuditForm .el-form-item--small.el-form-item {
  border: none;
  margin-bottom: 14px !important;
}

.demo-table-expand .el-form-item--small.el-form-item {
  border: none;
  margin: 10px 8px !important;
}

::v-deep .el-input__inner {
  border-radius: 0 !important;
}

::v-deep .el-textarea__inner {
  border-radius: 0 !important;
}

::v-deep .el-table__fixed-right {
  height: 100% !important;
}

.row-card {
  margin: 10px;
}
</style>
