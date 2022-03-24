<template>
  <div>
    <!--操作栏-->
    <span v-if="isContactBtnShow" class="save-btn">
      <el-button
        type="primary"
        @click="saveContact(contactForm)"
      >保存
      </el-button>
      <el-button
        v-if="!isNew"
        @click="viewContactPdf"
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
                @click="saveContact(contactForm)"
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
          <!--          <el-button
                      type="primary"
                      v-print="'#canvas'"
                      @click="savePdf"
                    >打印
                    </el-button>-->
          <!--<el-button
            type="primary"
            @click="printPdf"
          >打印
          </el-button>-->
          <el-button
            v-if="!isNew"
            type="primary"
            @click="viewContactPdf"
          >预览
          </el-button>
        </template>
      </el-descriptions>
    </el-card>
    <!--信息填写处-->
    <div id="canvas" ref="canvas">
      <el-card shadow="never">
        <el-collapse v-model="activeNames">
          <el-form
            ref="form"
            class="dialog"
            :rules="contactRules"
            :model="contactForm"
            size="small"
            label-width="120px"
          >
            <!--基本信息-->
            <el-collapse-item title="基本信息" name="1" class="collapse-item">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="联系人名称" prop="name" required>
                    <el-input v-model="contactForm.name" style="width: 100%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商名称" prop="supplierId" required>
                    <el-select
                      v-model="contactForm.supplierId"
                      size="small"
                      placeholder="请选择供应商"
                      filterable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in suppliers"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别" prop="gender" required>
                    <el-select
                      v-model="contactForm.gender"
                      size="small"
                      placeholder="请选择性别"
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in genderOptions"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.id }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="重要程度" prop="importantLevel" required>
                    <el-select
                      v-model="contactForm.importantLevel"
                      size="small"
                      placeholder="请选择重要程度"
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.contact_level"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="单位" prop="unit">
                    <el-input v-model="contactForm.unit" style="width: 100%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="称谓" prop="title">
                    <el-input v-model="contactForm.title" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="部门" prop="department">
                    <el-input v-model="contactForm.department" style="width: 100%"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="职务" prop="post">
                    <el-input v-model="contactForm.post" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="在职状态" prop="jobStatus" required>
                    <el-select
                      v-model="contactForm.jobStatus"
                      size="small"
                      placeholder="请选择在职状态"
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.contact_status"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="负责业务" prop="business">
                    <el-input
                      v-model="contactForm.business"
                      type="textarea"
                      autosize
                      placeholder="请输入联系负责业务"
                      style="width: 100%;"
                      :autosize="{ minRows: 2, maxRows: 5}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--联系信息-->
            <el-collapse-item title="联系信息" name="2" class="collapse-item">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="工作电话" prop="workTel">
                    <el-input v-model="contactForm.workTel" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="传真" prop="fax">
                    <el-input v-model="contactForm.fax" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="移动电话" prop="phone">
                    <el-input v-model="contactForm.phone" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="邮件地址" prop="email">
                    <el-input v-model="contactForm.email" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="家庭电话" prop="homeTel">
                    <el-input v-model="contactForm.homeTel" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="MSN" prop="msn">
                    <el-input v-model="contactForm.msn" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="QQ" prop="qq">
                    <el-input v-model="contactForm.qq" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="邮编" prop="zip">
                    <el-input v-model="contactForm.zip" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="人员类型" prop="type">
                    <el-select
                      v-model="contactForm.type"
                      size="small"
                      placeholder="支持自定义输入"
                      filterable
                      allow-create
                      clearable
                      class="filter-item"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="item in dict.contact_type"
                        :key="item.id"
                        :label="item.value"
                        :value="item.value"
                      >
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <!--todo 输入数字-->
                  <el-form-item label="年龄" prop="age">
                    <el-input v-model="contactForm.age" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型" prop="idType">
                    <el-input v-model="contactForm.idNum" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号" prop="idNum">
                    <el-input v-model="contactForm.idNum" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="contactForm.updateBy">
                <el-col :span="8">
                  <el-form-item label="最后更新日期" prop="updateTime">
                    <el-input v-model="contactForm.updateTime" disabled style="width: 100%;"/>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="最后更新用户" prop="updateBy">
                    <el-input v-model="contactForm.updateBy" style="width: 100%;"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="住址" prop="address">
                    <el-input
                      v-model="contactForm.address"
                      type="textarea"
                      autosize
                      placeholder="请输入联系人住址"
                      style="width: 100%;"
                      :autosize="{ minRows: 2, maxRows: 5}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <!--附加信息-->
            <el-collapse-item title="附加信息" name="3" class="collapse-item">
              <el-row class="row-collapse">
                <el-col :span="8">
                  <el-form-item label="生日" prop="birthday">
                    <el-date-picker
                      v-model="contactForm.birthday"
                      type="date"
                      :picker-options="birthdayOption"
                      placeholder="选择生日日期"
                      style="width: 100%;"
                      align="right"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="兴趣爱好" prop="hobby">
                    <!--                  <el-input v-model="contactForm.hobby" style="width: 100%;"/>-->
                    <div style="width: 300px;">
                      <el-tag
                        v-for="tag in contactForm.hobbyTags"
                        :key="tag"
                        closable
                        :disable-transitions="false"
                        @close="handleHobbyClose(tag)"
                      >
                        {{ tag }}
                      </el-tag>
                      <el-input
                        v-if="inputHobbyVisible"
                        ref="hobbyTagInput"
                        v-model="inputHobbyValue"
                        class="input-new-tag"
                        size="small"
                        @keyup.enter.native="handleInputHobbyConfirm"
                        @blur="handleInputHobbyConfirm"
                      />
                      <el-button v-else class="button-new-tag" size="small" @click="showInputHobby">+兴趣</el-button>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <!--              <el-col :span="24">
                  <div style="text-align: center">
                    <div class="el-upload">
                      <img
                        :src="contactForm.avatarName ? baseApi + '/avatar/' + contactForm.avatarName : Avatar"
                        title="点击上传头像"
                        class="avatar"
                        @click="toggleShow"
                      >
                      <myUpload
                        v-model="show"
                        :headers="headers"
                        :url="updateContactAvatarApi + '?contactId=' + contactForm.id"
                        @crop-upload-success="cropUploadSuccess"
                      />
                    </div>
                  </div>
                </el-col>-->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input
                      v-model="contactForm.remark"
                      type="textarea"
                      autosize
                      placeholder="请输入联系人备注信息"
                      style="width: 100%;"
                      :autosize="{ minRows: 2, maxRows: 5}"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <!--联系人附件-->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="联系人信息附件">
                  <span slot="label">
                    <span class="span-box">
                      <span>联系人信息附件</span><br>
                      <el-button
                        type="primary"
                        style="margin-top: 8px;"
                        class="button-new-tag"
                        size="small"
                        @click="toUploadContactFile"
                      >添加联系人附件
                      </el-button>
                    </span>
                  </span>
                    <el-table
                      ref="table"
                      v-loading="contactFilesLoading"
                      border
                      :data="contactFiles"
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
                                  @click="deleteContactFile(scope.row), scope._self.$refs[`delPlanFile-popover-${scope.$index}`].doClose()"
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
          </el-form>
        </el-collapse>
      </el-card>
    </div>
    <!--上传联系人信息对应的附件-->
    <el-dialog
      title="上传附件"
      :visible.sync="contactFileUploadVisible"
      width="28%"
    >
      <div>
        <el-upload
          ref="uploadContactFile"
          drag
          :before-upload="beforeUpload"
          :auto-upload="false"
          :headers="headers"
          :on-success="handleContactFileSuccess"
          :on-error="handleError"
          :action="supplierUploadApi + '?supplierId=' + supplierId+'&contactId=' + contactId + '&fileType=' + fileType "
        >
          <i class="el-icon-upload"/>
          <div class="el-upload__text">将<b style="color: red;">{{ fileType }}</b>相关文件拖到此处，或<em>选取上传</em></div>
          <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且不超过100M</div>
        </el-upload>
        <el-button style="margin-top:8px;" size="small" type="success" @click="submitContactFileUpload">上传到服务器
        </el-button>
      </div>
    </el-dialog>
    <!--打印预览-->
    <el-dialog title="供应商联系人信息" @dblclick.native="operationConfirm" width="70%" @open="isContactBtnShow = false"
               @closed="isContactBtnShow = true" :visible.sync="pdfContactViewVisible">
      <div id="supplierCanvas" ref="supplierCanvas">
        <div class="xItem">
          <h2 style="text-align:center;">{{ contactForm.name + '信息' }}</h2>
        </div>
        <!--基本信息-->
        <div class="xItem">
          <el-descriptions title="基本信息" :column="3">
            <el-descriptions-item label="姓名">{{ transToNullFormat(contactForm.name) }}</el-descriptions-item>
            <!--todo 所属供应商显示需要优化-->
            <el-descriptions-item label="所属供应商">{{ transToNullFormat(supplierName) }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ transToNullFormat(contactForm.gender) }}</el-descriptions-item>

            <el-descriptions-item label="重要程度">{{
                transToNullFormat(contactForm.importantLevel)
              }}
            </el-descriptions-item>
            <el-descriptions-item label="所属单位">{{ transToNullFormat(contactForm.unit) }}</el-descriptions-item>
            <el-descriptions-item label="称谓">{{ transToNullFormat(contactForm.title) }}</el-descriptions-item>

            <el-descriptions-item label="部门">{{ transToNullFormat(contactForm.department) }}</el-descriptions-item>
            <el-descriptions-item label="职务">{{ transToNullFormat(contactForm.post) }}</el-descriptions-item>
            <el-descriptions-item label="在职状态">{{ transToNullFormat(contactForm.jobStatus) }}</el-descriptions-item>

            <el-descriptions-item label="负责业务">{{ transToNullFormat(contactForm.business) }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <!--联系信息-->
        <div class="xItem">
          <el-descriptions title="联系信息" :column="3">
            <el-descriptions-item label="工作电话">{{ transToNullFormat(contactForm.workTel) }}</el-descriptions-item>
            <el-descriptions-item label="传真">{{ transToNullFormat(contactForm.fax) }}</el-descriptions-item>
            <el-descriptions-item label="移动电话">{{ transToNullFormat(contactForm.phone) }}</el-descriptions-item>

            <el-descriptions-item label="邮件地址">{{ transToNullFormat(contactForm.email) }}</el-descriptions-item>
            <el-descriptions-item label="家庭电话">{{ transToNullFormat(contactForm.homeTel) }}</el-descriptions-item>
            <el-descriptions-item label="MSN">{{ transToNullFormat(contactForm.msn) }}</el-descriptions-item>

            <el-descriptions-item label="QQ">{{ transToNullFormat(contactForm.qq) }}</el-descriptions-item>
            <el-descriptions-item label="邮编">{{ transToNullFormat(contactForm.zip) }}</el-descriptions-item>
            <el-descriptions-item label="人员类型">{{ transToNullFormat(contactForm.type) }}</el-descriptions-item>

            <el-descriptions-item label="年龄">{{ transToNullFormat(contactForm.age) }}</el-descriptions-item>
            <el-descriptions-item label="证件类型">{{ transToNullFormat(contactForm.idType) }}</el-descriptions-item>
            <el-descriptions-item label="证件号">{{ transToNullFormat(contactForm.idNum) }}</el-descriptions-item>

            <el-descriptions-item label="住址">{{ transToNullFormat(contactForm.address) }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!--附加信息-->
        <div class="xItem">
          <el-descriptions title="附加信息" :column="2">
            <el-descriptions-item label="生日">{{ dateToNullFormat(contactForm.birthday) }}</el-descriptions-item>
            <el-descriptions-item label="兴趣爱好">
              <span v-if="!contactForm.hobby">{{ transToNullFormat(contactForm.hobby) }}</span>
              <el-tag
                v-else
                v-for="tag in contactForm.hobbyTags"
                :key="tag"
                style="margin-right:2px;"
              >
                {{ tag }}
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="备注">{{ transToNullFormat(contactForm.remark) }}</el-descriptions-item>
          </el-descriptions>
          <el-table
            ref="table"
            v-loading="contactFilesLoading"
            border
            :data="contactFiles"
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

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="outPutContactPdfFn"
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
import {GMTToDate, validIsNotNull} from '@/utils/validationUtil'
import {addContact, editContact} from '@/api/tools/supplierContact'
import {get, getSupplierById, getUid} from '@/api/tools/supplier'
import myUpload from 'vue-image-crop-upload'
import Avatar from '@/assets/images/avatar.png'
import {delSupplierFile, getSupplierFileByCond, supplierFileReplace} from '@/api/tools/SupplierFile'

export default {
  name: 'SupplierContactForm',
  components: {myUpload},
  props: ['contactForm', 'isNew'],
  // 设置数据字典
  dicts: ['contact_type', 'contact_level', 'contact_status'],
  data() {
    return {
      activeNames: ['1', '2', '3'],
      headers: {'Authorization': getToken()},
      permission: {
        edit: ['admin', 'supplier:edit']
      },
      // 时间不可大于现在时间
      birthdayOption: {
        disabledDate(date) {
          return Date.now() < date.getTime()
        }
      },
      suppliers: [],
      contactRules: {
        name: [
          {required: true, message: '请输入供应商联系人名称', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择供应商联系人性别', trigger: 'blur'}
        ],
        supplierId: [
          {required: true, message: '请选择所属供应商', trigger: 'blur'}
        ],
        importantLevel: [
          {required: true, message: '请选择联系人重要程度', trigger: 'blur'}
        ]
      },
      genderOptions: [
        {id: 'male', value: '男'},
        {id: 'female', value: '女'},
        {id: 'none', value: '未知'}
      ],
      inputHobbyVisible: false,
      inputHobbyValue: '',
      Avatar: Avatar,
      show: false,
      fileType: '联系人',
      contactFileUploadVisible: false,
      contactFilesLoading: false,
      contactFiles: [],
      contactId: null,
      supplierId: null,
      pdfContactViewVisible: false,
      isContactBtnShow: true,
      supplierName: ''
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'updateContactAvatarApi',
      'supplierUploadApi'
    ])
  },
  created: function () {
    this.getContactUid()
  },
  mounted() {
    this.initForm()
    this.getAllSupplier()
  },
  methods: {
    initForm() {
      // alert(JSON.stringify(this.$props.contactForm))
      if (!this.$props.isNew) {
        this.getSupplierContactFile(this.$props.contactForm.supplierId, this.$props.contactForm.id)
      }
    },
    // 初始化contactId值
    getContactUid() {
      getUid().then(res => {
        // alert(JSON.stringify(res))
        this.uId = res
      })
    },
    getSupplierContactFile(supplierId, id) {
      // alert(JSON.stringify(this.$props.contactForm))
      this.contactFilesLoading = true
      this.contactFiles = []
      const obj = {
        supplierId: supplierId,
        fileType: '联系人',
        supplierContactId: id
      }
      // alert(JSON.stringify(obj))
      getSupplierFileByCond(obj).then(res => {
        // alert(JSON.stringify(res))
        this.contactFiles = res
        this.contactFilesLoading = false
      })
    },
    // 获取所有的供应商信息
    getAllSupplier() {
      get().then(res => {
        // alert(JSON.stringify(res))
        this.suppliers = res.content
      })
    },
    // 上传公司相关附件
    toUploadContactFile() {
      // alert(this.uId)
      this.supplierId = !this.$props.isNew ? this.$props.contactForm.supplierId : this.uId
      this.contactId = !this.$props.isNew ? this.$props.contactForm.id : this.uId
      // alert(this.supplierId)
      // alert(this.contactId)
      this.fileType = '联系人'
      this.contactFileUploadVisible = true
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
    submitContactFileUpload() {
      this.$refs.uploadContactFile.submit()
    },
    handleContactFileSuccess() {
      this.$message.success('上传文件成功!')
      this.$refs.uploadContactFile.clearFiles()
      this.getSupplierContactFile(this.supplierId, this.contactId)
    },
    // 删除附件
    deleteContactFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delSupplierFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getSupplierContactFile(this.supplierId, this.contactId)
      })
    },
    // 保存供应商联系人信息
    saveContact(form) {
      // alert(JSON.stringify(form))'
      if (!validIsNotNull(form.name)) {
        this.$message({
          message: 'Name of Contact needed! 供应商联系人名称不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.gender)) {
        this.$message({
          message: 'Gender Of Contact needed! 供应商联系人性别不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.supplierId)) {
        this.$message({
          message: 'Supplier needed! 所属供应商不可为空!',
          type: 'error'
        })
      } else if (!validIsNotNull(form.importantLevel)) {
        this.$message({
          message: 'Important-Level Of Contact needed! 联系人重要程度不可为空!',
          type: 'error'
        })
      }
      this.$refs.form.validate().then((valid) => {
        if (!valid) {
          return false
        } else {
          if (!validIsNotNull(form.id)) {
            addContact(form).then(res => {
              this.$message({
                message: 'Create Success! 新建供应商联系人信息保存成功!',
                type: 'success'
              })
              // alert(JSON.stringify(res))
              this.contactForm = res
              this.supplierId = this.contactForm.supplierId
              this.contactId = this.contactForm.id
              //  更新附件信息
              if (this.contactFiles.length > 0) {
                const params = {
                  supplierId: this.supplierId,
                  uId: this.uId,
                  fileTypes: ['联系人'],
                  supplierContactId: this.contactId
                }
                // alert(JSON.stringify(params))
                supplierFileReplace(params).then(res => {
                  // alert("更新附件成功！")
                  this.getSupplierContactFile(this.supplierId, this.contactId)
                })
              }
            })
          } else {
            editContact(form).then(res => {
              this.$message({
                message: 'Update Success! 供应商联系人信息更新成功!',
                type: 'success'
              })
              // alert(JSON.stringify(res))
              this.contactForm = form
            })
          }
        }
      })
    },
    showInputHobby() {
      this.inputHobbyVisible = true
      this.$nextTick(_ => {
        this.$refs.hobbyTagInput.$refs.input.focus()
      })
    },
    handleHobbyClose(tag) {
      this.contactForm.hobbyTags.splice(this.contactForm.hobbyTags.indexOf(tag), 1)
    },
    handleInputHobbyConfirm() {
      const inputValue = this.inputHobbyValue
      if (inputValue) {
        this.contactForm.hobbyTags.push(inputValue)
      }
      this.$props.contactForm.hobby = this.contactForm.hobbyTags.join(',')
      this.inputHobbyVisible = false
      this.inputHobbyValue = ''
    },
    toggleShow() {
      this.show = !this.show
    },
    // 上传成功后的操作
    cropUploadSuccess(jsonData, field) {
      // todo 刷新上传的文件
    },
    backToList() {
      this.$router.push(
        {
          path: '/supplier/supplier-contact-list',
          query: {}
        })
    },
    // todo 打印
    savePdf() {
      /*let prints = document.getElementById('canvas');
      prints.title = "供应商联系人";*/
      // alert(123)
      this.$PDFSave(this.$refs.canvas, this.contactForm.name + '个人信息')
    },
    printPdf() {
      this.$easyPrint('canvas', this.contactForm.name + '个人信息', 'portrait');
    },
    operationConfirm() {
      this.$confirm('导出PDF？继续预览？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '导出PDF',
        cancelButtonText: '继续预览'
      }).then(() => {
        this.outPutContactPdfFn()
      }).catch(() => {

      })
    },
    outPutContactPdfFn() {
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
        this.exportPdf("供应商-" + this.contactForm.name, '#supplierCanvas').then(() => {
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
    viewContactPdf() {
      // alert(this.contactForm.supplierId)
      getSupplierById(this.contactForm.supplierId).then((res) => {
        this.supplierName = res.name
      }).catch(()=>{
        this.$message({
          message: 'Querying Supplier Failed! 查询所属供应商接口出错!',
          type: 'error'
        })
      })
      this.pdfContactViewVisible = true
    }
  }
}
</script>

<style>
.save-btn {
  position: fixed;
  bottom: 10px;
  right: 40%;
  z-index: 9999;
}

#supplierCanvas .xItem {
  padding: 10px 20px;
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

::v-deep .el-input__inner {
  border-radius: 0 !important;
}

::v-deep .el-textarea__inner {
  border-radius: 0 !important;
}
</style>
