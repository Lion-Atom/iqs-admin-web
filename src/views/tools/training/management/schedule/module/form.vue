<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="true"
    :before-close="handleClose"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="72%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="110px"
    >
      <!--培训计划信息-->
      <el-row :gutter="20" type="flex" class="el-row-inline">
        <el-col :span="8">
          <el-form-item label="培训标题" prop="trainTitle">
            <el-input v-model="form.trainTitle" placeholder="请填写培训标题" style="width: 100%;" :disabled="disEdit"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训时间" prop="trainTime">
            <el-date-picker
              v-model="form.trainTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              default-time="10:00:00"
              placeholder="请填写培训时间"
              :picker-options="timeOptions[0]"
              @input="trainTimeChange"
              :disabled="disEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训类型" prop="trainType">
            <el-select
              v-model="form.trainType"
              placeholder="请选择培训类型"
              style="width:100%"
              :disabled="disEdit"
            >
              <el-option
                v-for="item in trainTypes"
                :label="item.value"
                :value="item.value"
                :key="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训人" prop="trainer">
            <!--            <el-input v-model="form.trainer" placeholder="请填写培训人" style="width:100%" :disabled="disEdit"/>-->
            <el-select
              v-model="form.trainer"
              placeholder="请添加培训人"
              filterable
              allow-create
              :disabled="disEdit"
              style="width: 100%;"
            >
              <el-option
                v-for="item in availUsers"
                :key="item.username"
                :label="item.dept.name + '-'+ item.username"
                :value="item.username"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.trainType === '外部'" :span="8">
          <el-form-item label="培训机构" prop="trainIns">
            <el-input v-model="form.trainIns" placeholder="请填写培训机构" style="width:100%" :disabled="disEdit"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训地点" prop="trainLocation">
            <el-input v-model="form.trainLocation" placeholder="请填写培训地址" style="width:100%" :disabled="disEdit"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="培训费用" prop="cost">
            <el-input type="text" v-model="form.cost" placeholder="请填写培训费用"
                      @input="(v)=>(form.cost = v.replace(/[^0-9.]/g,''))" style="width: 100%" :disabled="disEdit">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否考试" prop="isExam">
            <el-radio
              v-for="item in commonStatus"
              :key="item.id"
              v-model="form.isExam"
              :label="item.value === 'true'"
              :disabled="disEdit"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isExam.toString() === 'true'">
          <el-form-item label="是否发证" prop="isCert">
            <el-radio
              v-for="item in commonStatus"
              :key="item.id"
              v-model="form.isCert"
              :label="item.value === 'true'"
              :disabled="disEdit"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="涉及部门" prop="bindDepts">
            <treeselect
              v-model="bindDeptDatas"
              :options="allDepts"
              :load-options="loadAvailDepts"
              :multiple="true"
              style="width: 100%"
              placeholder="选择培训涉及部门"
              @input="bindDeptsChange"
              :disabled="disEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报名截止时间" prop="regDeadline">
            <el-date-picker
              v-model="form.regDeadline"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              default-time="00:00:00"
              placeholder="请填写培训时间"
              :picker-options="timeOptions[1]"
              :disabled="disEdit"
              @focus="regDeadlineInput"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="人数上限" prop="totalNum">
            <el-input type="text" v-model="form.totalNum" placeholder="请填写培训人数上限"
                      @input="(v)=>(form.totalNum = v.replace(/[^0-9.]/g,''))" style="width: 100%" :disabled="disEdit">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="!crud.status.add">
          <el-form-item label="现参与人数" prop="curNum">
            <el-input type="text" v-model="form.curNum" placeholder="请填写现参与人数"
                      @input="(v)=>(form.curNum = v.replace(/[^0-9.]/g,''))" disabled style="width: 100%">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否设置提醒" prop="isRemind">
            <el-radio
              v-for="item in commonStatus"
              :key="item.id"
              v-model="form.isRemind"
              :label="item.value === 'true'"
              :disabled="disEdit"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isRemind.toString() === 'true'">
          <el-form-item label="到期提前提醒" prop="remindDays">
            <el-input placeholder="请输入提醒天数" type="number" :max="maxRemindDays" v-model="form.remindDays"
                      @input="remindDaysMaxValue"
                      style="width: 100%"
                      :disabled="disEdit">
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.scheduleStatus !== '准备中'">
          <el-form-item label="是否改期" prop="isDelay">
            <el-radio
              v-for="item in commonStatus"
              :key="item.id"
              v-model="form.isDelay"
              :label="item.value === 'true'"
              :disabled="form.scheduleStatus==='已关闭'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isDelay.toString() === 'true'">
          <el-form-item label="新培训时间" prop="newTrainTime">
            <el-date-picker
              v-model="form.newTrainTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              default-time="10:00:00"
              placeholder="请填写新的培训时间"
              :picker-options="timeOptions[2]"
              @input="trainTimeChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="form.isDelay.toString() === 'true'">
          <el-form-item label="改期原因" prop="delayDesc">
            <el-input
              v-model="form.delayDesc"
              type="text"
              placeholder="请输入改期原因"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="培训内容" prop="trainContent">
            <el-input
              v-model="form.trainContent"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入培训内容描述"
              style="width: 100%;"
              :disabled="disEdit"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--培训附件信息-->
      <el-row class="el-row-inline" ref="scopeTags">
        <!--新版分类上传培训计划附件-->
        <el-col :span="24">
          <el-form-item prop="scopeTags">
                        <span slot="label">
                              <span class="span-box">
                                <span><i style="color:#f00;">*&nbsp;</i>附件范围</span><br>
                              </span>
                        </span>
            <!--全选操作-->
            <!--            <el-checkbox :indeterminate="isIndeterminate"
                                     v-model="checkAll" @change="handleCheckAllChange">
                          全选
                        </el-checkbox>
                        <div style="margin: 15px 0;"></div>-->
            <el-checkbox-group v-model="form.fileScopeTags" @change="handleCheckedScopeChange">
              <el-checkbox v-for="scope in fileScopes" :label="scope" :key="scope"
                           :disabled="scope === '培训材料' || disEdit || !form.hasEditAuthorized">
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <!--培训材料-->
        <el-col :span="24" ref="materialFiles"
                v-if="form.fileScopeTags !== undefined && form.fileScopeTags.indexOf(materialType) > -1">
          <el-form-item>
               <span slot="label">
                    <span class="span-box">
                      <span><i style="color:#f00;">*&nbsp;</i>{{ materialType }}</span><br>
                    </span>
               </span>
            <!--培训计划材料列表-->
            <div v-if="!disEdit">
              <el-button
                type="primary"
                @click="toUploadMaterialFile(materialType)"
              >新增
              </el-button>
              <el-button
                type="success"
                style="margin-left:-2px;"
                @click="toSelectMaterialFile"
              >自选
              </el-button>
            </div>
            <el-table
              ref="table"
              v-loading="materialFileLoading"
              border
              :data="form.materialFileList"
              style="width: 100%;"
              highlight-current-row
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
              />
              <el-table-column prop="name" label="材料名称" min-width="200">
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
                      :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                      class="el-link--primary"
                      style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                      target="_blank"
                      :download="scope.row.name"
                    >
                      {{ scope.row.name }}
                    </a>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="path" label="预览图">
                <template slot-scope="{row}">
                  <el-image
                    :src=" baseApi + '/file/' + row.type + '/' + row.realName"
                    :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
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
              <el-table-column prop="fileSource" label="文件出处"/>
              <el-table-column prop="size" label="大小"/>
              <el-table-column prop="type" label="类型"/>
              <el-table-column prop="author" label="作者"/>
              <!--   编辑与删除   -->
              <el-table-column
                v-if="!disEdit"
                label="操作"
                min-width="130px"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div>
                    <!--删除-->
                    <el-popover
                      :ref="`delFile-popover-${scope.$index}`"
                      v-permission="permission.edit"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除这个附件吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="scope._self.$refs[`delFile-popover-${scope.$index}`].doClose()"
                        >取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="deleteTrSchedule(scope.row), scope._self.$refs[`delFile-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="form.materialFileList.length===1"
                      />
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!--新增材料-->
            <el-dialog append-to-body :close-on-click-modal="false"
                       :visible.sync="materialDialogVisible" title="培训材料上传" width="70%">
              <el-form ref="materialFile" :rules="fileRules" :model="fileForm" size="small" label-width="80px">
                <el-row :gutter="40" class="row-box">
                  <el-col :span="12">
                    <el-row :gutter="40" class="row-box">
                      <el-col :span="24">
                        <el-form-item label="材料名称" prop="name">
                          <el-input v-model="fileForm.name" placeholder="请填写材料名称" style="width: 100%;"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="来自内部" prop="isInternal">
                          <el-radio
                            v-for="item in commonStatus"
                            :key="item.id"
                            v-model="fileForm.isInternal"
                            :label="item.value === 'true'"
                            @change="currIsInternalChange"
                          >
                            {{ item.label }}
                          </el-radio>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="材料作者" prop="author">
                          <!--                          <el-input v-model="fileForm.author" style="width: 100%;"/>-->
                          <el-select
                            v-model="fileForm.author"
                            placeholder="请添加材料作者"
                            filterable
                            allow-create
                            style="width: 100%;"
                          >
                            <el-option
                              v-for="item in availUsers"
                              :key="item.username"
                              :label="item.dept.name + '-'+ item.username"
                              :value="item.username"
                            />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <!--根据内部/外部选择对应的专业工具-->
                      <el-col :span="12">
                        <el-form-item label="专业工具" prop="toolType">
                          <el-select
                            v-model="fileForm.toolType"
                            filterable
                            allow-create
                            clearable
                            placeholder="可自定义标准认证工具"
                            style="width: 100%;"
                          >
                            <el-option
                              v-for="item in toolTypeOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="材料描述" prop="fileDesc">
                          <el-input
                            v-model="fileForm.fileDesc"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 5}"
                            placeholder="请输入材料内容描述"
                            style="width: 100%;"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <!--   上传文件   -->
                  <el-col :span="12">
                    <el-form-item>
                      <template slot="label">
                        <span><i style="color: red">* </i>材料上传</span>
                      </template>
                      <el-upload
                        ref="materialFileUpload"
                        :limit="1"
                        drag
                        :before-upload="beforeUpload"
                        :auto-upload="false"
                        :headers="headers"
                        :on-change="handleMaterialFileChange"
                        :file-list="materialFileList"
                        :on-success="handleMaterialFileSuccess"
                        :on-error="handleError"
                        :action="trScheduleUploadV2Api + '?name=' + fileForm.name +'&trScheduleId=' + bindingId +'&fileType=' + materialType
                          +'&fileSource=' + fileSourceOption[1] +'&author=' + fileForm.author
             + '&isInternal=' + fileForm.isInternal + '&toolType=' + fileForm.toolType + '&fileDesc=' + fileForm.fileDesc"
                        class="upload-demo"
                      >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="materialDialogVisible = false">取消</el-button>
                <el-button :loading="loading" type="primary" @click="materialFileUpload">确认</el-button>
              </div>
            </el-dialog>
            <!--选择已有-->
            <el-dialog append-to-body :close-on-click-modal="false" :before-close="closeMatSelectDialog"
                       :visible.sync="matSelectDialogVisible" title="自选培训材料" width="50%">
              <div style="text-align: left">
                <el-transfer
                  v-model="materialFileSelectedList"
                  filterable
                  :titles="['材料库', '已选']"
                  :format="{
                      noChecked: '${total}',
                      hasChecked: '${checked}/${total}'
                    }"
                  :data="trMaterialFiles">
                  <!-- 保存操作 转换到培训计划下材料列表中-->
                  <el-button class="transfer-footer" slot="right-footer" size="small"
                             @click="saveSelectedMaterialFile(materialFileSelectedList)">保存
                  </el-button>
                </el-transfer>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>
        <!--培训试题-->
        <el-col :span="24" ref="examFiles"
                v-if="form.fileScopeTags !== undefined && form.fileScopeTags.indexOf(examType) > -1">
          <el-form-item>
               <span slot="label">
                 <span class="span-box">
                   <span><i style="color:#f00;">*&nbsp;</i>{{ examType }}</span><br>
                 </span>
               </span>
            <!--附件-->
            <div v-if="!disEdit">
              <el-button
                type="primary"
                @click="toUploadExamFile(examType)"
              >新增
              </el-button>
              <el-button
                type="success"
                style="margin-left: -2px;"
                @click="toSelectExamFile"
              >自选
              </el-button>
            </div>
            <el-table
              ref="table"
              v-loading="examFileLoading"
              border
              :data="form.examFileList"
              style="width: 100%"
              highlight-current-row
            >
              <el-table-column
                type="index"
                width="50"
                label="序号"
              />
              <el-table-column prop="name" label="试题名称" min-width="200">
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
                      :href="baseApi + '/file/' + scope.row.type + '/' + scope.row.realName"
                      class="el-link--primary"
                      style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
                      target="_blank"
                      :download="scope.row.name"
                    >
                      {{ scope.row.name }}
                    </a>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="path" label="预览图">
                <template slot-scope="{row}">
                  <el-image
                    :src=" baseApi + '/file/' + row.type + '/' + row.realName"
                    :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
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
              <el-table-column prop="fileSource" label="出处"/>
              <el-table-column prop="size" label="大小"/>
              <el-table-column prop="type" label="类型"/>
              <el-table-column prop="createBy" label="上传者"/>
              <!--   编辑与删除   -->
              <el-table-column
                v-if="!disEdit"
                label="操作"
                min-width="130px"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <div>
                    <!--删除-->
                    <el-popover
                      :ref="`delExamFile-popover-${scope.$index}`"
                      v-permission="permission.edit"
                      placement="top"
                      width="180"
                    >
                      <p>确定删除这个附件吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          size="mini"
                          type="text"
                          @click="scope._self.$refs[`delExamFile-popover-${scope.$index}`].doClose()"
                        >取消
                        </el-button>
                        <el-button
                          type="primary"
                          size="mini"
                          @click="deleteTrSchedule(scope.row), scope._self.$refs[`delExamFile-popover-${scope.$index}`].doClose()"
                        >确定
                        </el-button>
                      </div>
                      <el-button
                        slot="reference"
                        v-permission="permission.edit"
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="form.examFileList.length===1"
                      />
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!--新增考试试题-->
            <el-dialog append-to-body :close-on-click-modal="false"
                       :visible.sync="examDialogVisible" title="培训试题上传" width="70%">
              <el-form ref="examFile" :rules="fileRules" :model="fileForm" size="small" label-width="80px">
                <el-row :gutter="40" class="row-box">
                  <el-col :span="12">
                    <el-row :gutter="40" class="row-box">
                      <el-col :span="24">
                        <el-form-item label="试卷名称" prop="name">
                          <el-input v-model="fileForm.name" placeholder="请填写试卷名称" style="width: 100%;"/>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="试卷描述" prop="fileDesc">
                          <el-input
                            v-model="fileForm.fileDesc"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 5}"
                            placeholder="请输入试题内容描述"
                            style="width: 100%;"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-col>
                  <!-- 上传文件 -->
                  <el-col :span="12">
                    <el-form-item>
                      <template slot="label">
                        <span><i style="color: red">* </i>上传</span>
                      </template>
                      <el-upload
                        ref="examFileUpload"
                        :limit="1"
                        drag
                        :before-upload="beforeUpload"
                        :auto-upload="false"
                        :headers="headers"
                        :on-change="handleExamFileChange"
                        :file-list="examFileList"
                        :on-success="handleExamFileSuccess"
                        :on-error="handleError"
                        :action="trScheduleUploadV2Api + '?name=' + fileForm.name +'&trScheduleId=' + bindingId +'&fileType=' + examType
                           +'&fileSource=' + fileSourceOption[1] +'&author=' + fileForm.author
             + '&isInternal=' + fileForm.isInternal + '&toolType=' + fileForm.toolType + '&fileDesc=' + fileForm.fileDesc"
                        class="upload-demo"
                      >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="examDialogVisible = false">取消</el-button>
                <el-button :loading="loading" type="primary" @click="examFileUpload">确认</el-button>
              </div>
            </el-dialog>
            <!--选择已有试题-->
            <el-dialog append-to-body :close-on-click-modal="false" :before-close="closeExamSelectDialog"
                       :visible.sync="examSelectDialogVisible" title="自选培训试题" width="50%">
              <div style="text-align: left">
                <el-transfer
                  v-model="examFileSelectedList"
                  filterable
                  :titles="['试题库', '已选']"
                  :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
                  :data="trExamFiles">
                  <!-- 保存操作 转换到培训计划下材料列表中-->
                  <el-button class="transfer-footer" slot="right-footer" size="small"
                             @click="saveSelectedExamFile(examFileSelectedList)">保存
                  </el-button>
                </el-transfer>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="el-row-inline">
        <el-col :span="8">
          <el-form-item prop="scheduleStatus">
            <template slot="label">
              <el-tooltip style="width: 100%!important;" effect="light" placement="bottom-start">
                <template slot="content">
                  <el-steps :space="200" :active="activeStatusFlag" finish-status="finish">
                    <el-step title="准备中">
                      <template slot="description">
                        <span>尚未发布状态下，可随意修改培训内容，但<b style="color: red;">无法报名</b></span>
                      </template>
                    </el-step>
                    <el-step title="开放中">
                      <template slot="description">
                        <span>开放状态下方可<b style="color: red;">报名</b>和<b style="color: red;">发起改期</b></span>
                      </template>
                    </el-step>
                    <el-step title="已关闭">
                      <template slot="description">
                        <span>培训关闭后<b style="color: red;">仅限查看</b></span>
                      </template>
                    </el-step>
                  </el-steps>
                </template>
                <span>计划状态<i class="el-icon-question"/></span>
              </el-tooltip>
            </template>
            <el-select
              v-model="form.scheduleStatus"
              placeholder="请选择计划状态"
              :disabled="disEdit"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="form.scheduleStatus !=='已关闭' && form.hasEditAuthorized ">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, {form} from '@crud/crud'
import {validIsNotNull} from "@/utils/validationUtil";
import {mapGetters} from "vuex";
import {getUid} from "@/api/tools/supplier";
import {getToken} from "@/utils/auth";
import {delTrScheduleFile, getFilesByTrScheduleIdAndType, syncScheduleFile} from "@/api/tools/train/trScheduleFile";
import Treeselect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getDepts, getDeptTree} from "@/api/system/dept";
import {getMaterialFilesByExample} from "@/api/tools/train/trainMaterialFile";
import {getExamFilesByExample} from "@/api/tools/train/trExamDepartFile";
import {getAllUser} from "@/api/system/user";

const defaultForm = {
  id: null,
  trainTitle: null,
  trainTime: null,
  trainContent: null,
  regDeadline: null,
  trainLocation: null,
  cost: null,
  trainer: null,
  trainIns: null,
  bindDepts: [],
  bindDeptStr: null,
  trainType: null,
  totalNum: 200,
  curNum: 0,
  isRemind: false,
  remindDays: null,
  isDelay: false,
  isExam: false,
  isCert: false,
  newTrainTime: null,
  delayDesc: null,
  scheduleStatus: null, // 证书状态后台走查判断
  uid: null,
  fileScope: '培训材料',
  fileScopeTags: ['培训材料'],
  materialFileList: [],
  examFileList: [],
  hasEditAuthorized: true
}
let bindingDepts = []
const fileScopeOptions = ['培训材料', '培训试题']
export default {
  mixins: [form(defaultForm)],
  components: {Treeselect},
  props: {
    commonStatus: {
      type: Array,
      required: true
    },
    statusOptions: {
      type: Array,
      required: true
    },
    permission: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      headers: {'Authorization': getToken()},
      rules: {
        trainTitle: [
          {required: true, message: '请输入培训标题', trigger: 'blur'}
        ],
        trainTime: [
          {required: true, message: '请填写培训时间', trigger: 'blur'}
        ],
        trainContent: [
          {required: true, message: '请填写培训内容', trigger: 'blur'}
        ],
        regDeadline: [
          {required: true, message: '请填写截止报名时间', trigger: 'blur'}
        ],
        trainLocation: [
          {required: true, message: '请填写培训地点', trigger: 'blur'}
        ],
        trainer: [
          {required: true, message: '请填写培训员', trigger: 'blur'}
        ],
        trainIns: [
          {required: true, message: '请填写培训机构', trigger: 'blur'}
        ],
        trainType: [
          {required: true, message: '请选择培训类型', trigger: 'blur'}
        ],
        totalNum: [
          {required: true, message: '请填写人数上限', trigger: 'blur'}
        ],
        curNum: [
          {required: true, message: '请填写人数上限', trigger: 'blur'}
        ],
        isRemind: [
          {required: true, message: '请选择是否需要提醒', trigger: 'blur'}
        ],
        remindDays: [
          {required: true, message: '请填写提醒天数', trigger: 'blur'}
        ],
        isDelay: [
          {required: true, message: '请确认是否改期', trigger: 'blur'}
        ],
        isExam: [
          {required: true, message: '请确认是否需要考试', trigger: 'blur'}
        ],
        isCert: [
          {required: true, message: '请确认是否发放证书', trigger: 'blur'}
        ],
        newTrainTime: [
          {required: true, message: '请重新投定培训时间', trigger: 'blur'}
        ],
        delayDesc: [
          {required: true, message: '请填写改期原因', trigger: 'blur'}
        ],
        bindDepts: [
          {required: true, message: '请添加培训涉及部门', trigger: 'blur'}
        ],
        scheduleStatus: [
          {required: true, message: '请添加培训计划状态', trigger: 'blur'}
        ],
      },
      fileForm: {
        name: null,
        trScheduleId: null,
        fileType: null,
        fileSource: null,
        author: null,
        isInternal: true,
        toolType: null,
        fileDesc: null
      },
      allDepts: [],
      bindDeptDatas: [],
      fileRules: {
        name: [
          {required: true, message: '请输入文件名称', trigger: 'blur'}
        ],
        author: [
          {required: true, message: '请选择/填写作者', trigger: 'blur'}
        ],
        isInternal: [
          {required: true, message: '请选择材料出处', trigger: 'blur'}
        ],
        toolType: [
          {required: true, message: '请选择专业工具标准', trigger: 'blur'}
        ],
        fileType: [
          {required: true, message: '请选择/填写试卷类型', trigger: 'blur'}
        ]
      },
      departs: [],
      superiors: [],
      reasonRules: [
        {required: false}
      ],
      timeOptions: [
        {
          disabledDate: time => {
            return (
              time.getTime() <= Date.now()
            )
          }
        },
        {
          disabledDate: time => {
            let tarTime
            if (this.form.isDelay.toString() === 'false') {
              tarTime = new Date(this.form.trainTime).getTime()
            } else {
              tarTime = new Date(this.form.newTrainTime).getTime()
            }
            return (
              tarTime < time.getTime() || time.getTime() <= Date.now()
            )
          },
          selectableRange: '00:00:00 - 23:59:59'
        }, {
          disabledDate: time => {
            return (
              // time.getTime() <= new Date(this.form.trainTime).getTime()
              time.getTime() <= new Date(this.form.regDeadline).getTime()
            )
          }
        }
      ],
      bindingId: null,
      filesLoading: false,
      transDialogVisible: false,
      loading: false,
      materialFileList: [],
      examFileList: [],
      trainTypes: [
        {
          label: 'internal',
          value: '内部'
        },
        {
          label: 'external',
          value: '外部'
        }
      ],
      fileTypes: [
        {
          value: '签到表'
        },
        {
          value: '问卷调查'
        }
      ],
      maxRemindDays: 30,
      // 涉及部门
      inputDepartVisible: false,
      inputDepartValue: '',
      fileScopes: fileScopeOptions,
      isIndeterminate: true,
      checkAll: false,
      materialType: '培训材料',
      examType: '培训试题',
      materialFileLoading: false,
      materialFiles: [],
      examFileLoading: false,
      examFiles: [],
      materialDialogVisible: false,
      matSelectDialogVisible: false,
      examSelectDialogVisible: false,
      examDialogVisible: false,
      toolTypeOptions: [
        {
          label: 'OPL',
          value: 'OPL'
        },
        {
          label: 'L&L',
          value: 'L&L'
        }
      ],
      // 培训材料库
      trMaterialFiles: [],
      materialFileSelectedList: [],
      fileSourceOption: [
        '现有',
        '新增'
      ],
      examFileSelectedList: [],
      trExamFiles: [],
      disEdit: false,
      activeStatusFlag: 1,
      availUsers: []
    }
  },
  watch: {
    'form.scheduleStatus': 'scheduleStatusChangeHandler',
    'form.regDeadline'(selectTime) {
      const date = new Date(new Date(selectTime).setHours(0, 0, 0, 0)).getTime()
      let tarTime
      let trainTime
      if (validIsNotNull(this.form.trainTime)) {
        trainTime = new Date(this.form.trainTime)
        tarTime = new Date(new Date(this.form.trainTime).setHours(0, 0, 0, 0)).getTime()
        let hour = trainTime.getHours()
        let min = trainTime.getMinutes()
        let sec = trainTime.getSeconds()
        if (tarTime === date) {
          // 若是截止时间和培训时间相同则不允许超出培训开始时间
          this.timeOptions[1].selectableRange = `'00:00:00 - ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
          // alert(this.timeOptions[1].selectableRange)
        } else {
          this.timeOptions[1].selectableRange = `'00:00:00 - 23:59:59'`
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'trScheduleUploadApi',
      'trScheduleUploadV2Api'
    ])
  },
  created: function () {
    this.getTopDept()
    this.getAvailableUser()
  },
  methods: {
    // 获取所在公司的部门树结构
    getTopDept() {
      getDeptTree().then(res => {
        this.allDepts = res.content
      })
    },
    // 获取人员信息
    getAvailableUser() {
      getAllUser().then(res => {
        this.availUsers = res.content
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.disEdit = false
      this.bindDeptDatas = []
      this.bindingId = null
      this.form.uid = null
      this.form.remindDays = null
      getUid().then(res => {
        this.form.uid = res
        // alert(JSON.stringify(this.form))
        this.bindingId = res
        // alert(this.bindingId)
      })
    },
    // 获取弹窗内文件所属部门数据
    loadAvailDepts({action, parentNode, callback}) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({enabled: true, pid: parentNode.id}).then(res => {
          parentNode.children = res.content.map(function (obj) {
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
    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // alert(JSON.stringify(this.statusOptions))
      this.disEdit = form.scheduleStatus !== this.statusOptions[0].value || !form.hasEditAuthorized;
      const _this = this
      // alert(JSON.stringify(_this.bindDeptDatas))
      _this.bindingId = form.id
      _this.bindDeptDatas = []
      bindingDepts = []
      // 获取培训计划信息列表
      // 获取培训材料列表
      _this.getMaterialFiles(form.id, this.materialType)
      // 获取培训试题列表
      _this.getExamFiles(form.id, this.examType)
      if (form.isDelay.toString() === 'true') {
        _this.getMaxTrRemindDays(form.newTrainTime)
      } else {
        _this.getMaxTrRemindDays(form.trainTime)
      }
      form.bindDepts.forEach(function (dept, index) {
        _this.bindDeptDatas.push(dept.id)
        const fl = {id: dept.id}
        bindingDepts.push(fl)
      })
      // alert(JSON.stringify(_this.bindDeptDatas))
    },
    // 指定可查看部门变化监控
    bindDeptsChange(val) {
      // alert(JSON.stringify(val))
      bindingDepts = []
      val.forEach(function (data, index) {
        const bind = {id: data}
        bindingDepts.push(bind)
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeValidateCU](crud) {
      crud.form.bindDepts = bindingDepts
      return true
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.materialFileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.materialFileList.length === 0) {
        this.$message.warning("请务必上传培训材料信息！")
        return false
      }
      if (this.form.fileScopeTags.indexOf(this.examType) > -1) {
        if (this.form.examFileList.length === 0) {
          this.$message.warning("请务必上传培训试题信息！")
          return false
        }
      }
      if (new Date(this.form.trainTime) === new Date(this.form.newTrainTime)) {
        this.$message.warning("新培训时间与原培训时间一样，请重新设定！")
        return false
      }
      if (new Date(this.form.regDeadline).getTime() <= new Date().getTime()) {
        this.$message.warning("设置不合理：截止时间小于当前时间，请重新设定！")
        return false
      }
      if (this.form.isDelay.toString() === 'true' && new Date(this.form.newTrainTime).getTime() <= new Date().getTime()) {
        this.$message.warning("设置不合理：新培训时间小于当前时间，请重新设定！")
        return false
      }
    },
    // 监控培训计划状态变化
    scheduleStatusChangeHandler(v) {
      if (v === this.statusOptions[0].value) {
        this.activeStatusFlag = 1
      } else if (v === this.statusOptions[1].value) {
        this.activeStatusFlag = 2
      } else if (v === this.statusOptions[2].value) {
        this.activeStatusFlag = 3
      }
    },
    // 获取维修相关确认单信息
    getMaterialFiles(id, materialType) {
      this.form.materialFileList = []
      this.materialFileLoading = true
      this.materialFileSelectedList = []
      getFilesByTrScheduleIdAndType(id, materialType).then(res => {
        // alert(JSON.stringify(res))
        console.log(res)
        this.form.materialFileList = res
        this.materialFileLoading = false
        res.forEach((data, index) => {
          // 获取现有
          if (data.fileSource === this.fileSourceOption[0]) {
            this.materialFileSelectedList.push(data.bindingId)
          }
        })
      })
    },
    // 获取维修相关确认单信息
    getExamFiles(id, examType) {
      this.form.examFileList = []
      this.examFileLoading = true
      getFilesByTrScheduleIdAndType(id, examType).then(res => {
        // alert(JSON.stringify(res))
        console.log(res)
        this.form.examFileList = res
        this.examFileLoading = false
      })
    },
    // 提前提醒最大时间设计
    remindDaysMaxValue(v) {
      if (validIsNotNull(v)) {
        v = v.toString().replace(/[^0-9.]/g, '')
        this.form.remindDays = v > this.maxRemindDays ? this.maxRemindDays : v
      }
    },
    // 监控培训时间变化
    trainTimeChange(val) {
      this.$forceUpdate()
      this.getMaxTrRemindDays(val)
      if (!validIsNotNull(val)) {
        this.form.regDeadline = null
      }
      if (validIsNotNull(this.form.remindDays)) {
        this.remindDaysMaxValue(this.form.remindDays)
      }
    },
    // 获取最大提醒时间
    getMaxTrRemindDays(val) {
      let end = new Date(val).getTime()
      // Math.floor()向下取整，Math.ceil()向上取整
      this.maxRemindDays = Math.ceil((end - new Date().getTime()) / (24 * 3600 * 1000))
      // alert(this.maxRemindDays)
      /*if (validIsNotNull(this.form.remindDays)) {
        this.remindDaysMaxValue(this.form.remindDays)
      }*/
    },
    // ------------上传附件管理--------------
    // 上传前的校验
    beforeUpload: function (file) {
      this.loading = false
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传试卷大小不能超过 100MB!')
      }
      return isLt2M
    },
    // 监听上传成功
    handleMaterialFileSuccess(response, file, materialFileList) {
      this.getMaterialFiles(this.bindingId, this.materialType)
      setTimeout(() => {
        this.$message.success('上传培训材料成功!')
      }, 300)
      this.$refs.materialFileUpload.clearFiles()
      this.materialDialogVisible = false
    },
    // 监听上传成功
    handleExamFileSuccess(response, file, materialFileList) {
      this.getExamFiles(this.bindingId, this.examType)
      setTimeout(() => {
        this.$message.success('上传试卷信息成功!')
      }, 300)
      this.$refs.examFileUpload.clearFiles()
      this.examDialogVisible = false
    },
    handleMaterialFileChange(file, materialFileList) {
      if (!validIsNotNull(this.fileForm.name)) {
        this.fileForm.name = file.name
      }
      this.materialFileList = materialFileList;
    },
    handleExamFileChange(file, examFileList) {
      if (!validIsNotNull(this.fileForm.name)) {
        this.fileForm.name = file.name
      }
      this.examFileList = examFileList;
    },
    // 删除附件
    deleteTrSchedule(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delTrScheduleFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除' + row.fileType + '信息成功!',
          type: 'success'
        })
        if (row.fileType === '培训材料') {
          this.getMaterialFiles(row.trScheduleId, row.fileType)
        } else {
          this.getExamFiles(row.trScheduleId, row.fileType)
        }
        // this.getMaterialFiles(row.trScheduleId,row.fileType)
      })
    },
    // 监听上传失败
    handleError(e, file, materialFileList) {
      this.fileForm.name = ''
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },
    // 监控是否内外部变化
    currIsInternalChange(val) {
      this.fileForm.toolType = null
      if (val.toString() === 'true') {
        this.toolTypeOptions = [
          {
            label: 'OPL',
            value: 'OPL'
          },
          {
            label: 'L&L',
            value: 'L&L'
          }
        ]
      } else if (val.toString() === 'false') {
        this.toolTypeOptions = [
          {
            label: 'GB/ISO',
            value: 'GB/ISO'
          }
        ]
      }
    },
    openTransDialog() {
      if (this.$refs['fileForm'] !== undefined) {
        this.$refs['fileForm'].resetFields()
      }
      this.form.materialFileList = []
      this.transDialogVisible = true
    },
    scoreMaxValue(v) {
      this.fileForm.examScore = v.replace(/[^0-9.]/g, '')
      this.fileForm.examScore = v > 100 ? 100 : v
    },
    // todo 是否通过判断
    currIsPassedChange(val) {
      // alert(val)
    },
    // 取消考试信息提交
    cancelSubmit() {
      if (this.$refs['fileForm'] !== undefined) {
        this.$refs['fileForm'].resetFields()
      }
      this.transDialogVisible = false
    },
    // 上传文件
    uploadScheduleFile() {
      this.$refs['fileForm'].validate((valid) => {
        if (valid) {
          // todo  判断有无文件
          if (this.uploadList.length === 0) {
            this.$message.warning("请上传试卷")
          } else {
            // this.fileForm.examDate = toDateFormat(this.fileForm.examDate)
            this.$refs.fileUpload.submit()
          }
        }
      })
    },
    // 监控附件范围全选与否变化
    handleCheckAllChange: function (val) {
      // alert(val)
      this.form.fileScopeTags = val ? fileScopeOptions : []
      if (this.form.fileScopeTags.length > 0) {
        this.$refs.scopeTags.$el.style.border = '0px solid #f00'
      }
      this.form.fileScope = this.form.fileScopeTags.join(',')
      this.isIndeterminate = false
      // todo 查询对应文件列表信息
      this.getAllChangeTypeFiles()
    },
    // 监控附件范围变化
    handleCheckedScopeChange(value) {
      // alert(JSON.stringify(this.form.fileScopeTags))
      if (this.form.fileScopeTags.length > 0) {
        this.$refs.scopeTags.$el.style.border = '0px solid #f00'
      }
      this.form.fileScope = this.form.fileScopeTags.join(',')
      const checkedCount = value.length
      this.checkAll = checkedCount === this.fileScopes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.fileScopes.length
    },
    // 上传培训材料
    toUploadMaterialFile(materialType) {
      if (this.$refs['materialFile'] !== undefined) {
        this.$refs['materialFile'].resetFields()
      }
      this.fileForm.name = ''
      this.materialDialogVisible = true
    },
    // 选择已有材料文件
    toSelectMaterialFile() {
      // alert(JSON.stringify(bindingDepts))
      if (bindingDepts.length === 0) {
        this.$message.warning("请先选择培训涉及部门")
        return false
      } else {
        let deptIds = []
        bindingDepts.forEach((data, index) => {
          deptIds.push(data.id)
        })
        this.getMaterialFilesByDeptIds(deptIds)
      }
      this.matSelectDialogVisible = true
    },
    // 选择已有材料文件
    toSelectExamFile() {
      if (bindingDepts.length === 0) {
        this.$message.warning("请先选择培训涉及部门")
        return false
      } else {
        let deptIds = []
        bindingDepts.forEach((data, index) => {
          deptIds.push(data.id)
        })
        this.getExamFilesByDeptIds(deptIds)
      }
      this.examSelectDialogVisible = true
    },
    // 根据部门IDS查询相关材料
    getMaterialFilesByDeptIds(deptIds) {
      this.trMaterialFiles = []
      getMaterialFilesByExample({departIds: deptIds}).then(res => {
        // alert(JSON.stringify(res))
        // 处理已选择项目
        res.forEach((file, index) => {
          this.trMaterialFiles.push({
            label: file.departName + '-' + file.name + '-' + file.author,
            //这里的key值一定要是index，否则目标列表无法显示
            key: file.id,
            // disabled:
          })
        })
      })
    },
    // 根据部门IDS查询相关考试试题
    getExamFilesByDeptIds(deptIds) {
      this.trExamFiles = []
      getExamFilesByExample({departIds: deptIds}).then(res => {
        // alert(JSON.stringify(res))
        // 处理已选择项目
        res.forEach((file, index) => {
          this.trExamFiles.push({
            label: file.departName + '-' + file.name,
            // 这里的key值一定要是index，否则目标列表无法显示
            key: file.id
            // disabled:
          })
        })
      })
    },
    // 保存已选择的材料
    saveSelectedMaterialFile(selectedList) {
      // alert(JSON.stringify(selectedList))
      const cond = {
        trScheduleId: this.bindingId,
        fileType: this.materialType,
        bindingFileIds: selectedList
      }
      if (selectedList.length === 0) {
        this.$confirm('确定清空已选材料？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 确认清空',
          cancelButtonText: 'No 考虑一下'
        })
          .then(() => {
            syncScheduleFile(cond).then(res => {
              this.getMaterialFiles(this.bindingId, this.materialType)
              this.$nextTick(() => {
                this.$message.success('保存已选项成功！')
                this.matSelectDialogVisible = false
              }, 500)
            })
          })
          .catch(() => {

          })
      } else {
        syncScheduleFile(cond).then(res => {
          this.getMaterialFiles(this.bindingId, this.materialType)
          this.$nextTick(() => {
            this.$message.success('保存已选项成功！')
            this.matSelectDialogVisible = false
          }, 500)
        })
      }
    },
    // 关闭自选材料之前操作
    closeMatSelectDialog() {
      this.matSelectDialogVisible = false
      this.materialFileSelectedList = []
    },
    // 关闭自选材料之前操作
    closeExamSelectDialog() {
      this.examSelectDialogVisible = false
      this.examFileSelectedList = []
    },
    // 保存考试试题
    saveSelectedExamFile(selectedList) {
      // alert(JSON.stringify(selectedList))
      const cond = {
        trScheduleId: this.bindingId,
        fileType: this.examType,
        bindingFileIds: selectedList
      }
      if (selectedList.length === 0) {
        this.$confirm('确定清空已选试题？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: 'Yes 确认清空',
          cancelButtonText: 'No 考虑一下'
        })
          .then(() => {
            syncScheduleFile(cond).then(res => {
              this.getExamFiles(this.bindingId, this.examType)
              this.$nextTick(() => {
                this.$message.success('保存已选项成功！')
                this.examSelectDialogVisible = false
              }, 500)
            })
          })
          .catch(() => {

          })
      } else {
        syncScheduleFile(cond).then(res => {
          this.getExamFiles(this.bindingId, this.examType)
          this.$nextTick(() => {
            this.$message.success('保存已选项成功！')
            this.examSelectDialogVisible = false
          }, 500)
        })
      }
    },
    toUploadExamFile(examType) {
      if (this.$refs['examFile'] !== undefined) {
        this.$refs['examFile'].resetFields()
      }
      this.fileForm.name = ''
      this.examDialogVisible = true
    },
    // 上传培训材料文件
    materialFileUpload() {
      this.$refs['materialFile'].validate((valid) => {
        if (valid) {
          if (this.materialFileList.length > 0) {
            this.$refs.materialFileUpload.submit()
          } else {
            this.crud.notify('请上传材料', CRUD.NOTIFICATION_TYPE.WARNING)
          }
        }
      })
    },
    // 上传文件
    examFileUpload() {
      this.$refs['examFile'].validate((valid) => {
        if (valid) {
          if (this.examFileList.length > 0) {
            this.$refs.examFileUpload.submit()
          } else {
            this.crud.notify('请上传试题', CRUD.NOTIFICATION_TYPE.WARNING)
          }
        }
      })
    },
    // 关闭前操作
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.crud.cancelCU()
        })
        .catch(_ => {
        })
    },
    regDeadlineInput() {
      if (!validIsNotNull(this.form.trainTime)) {
        this.$message.warning('请优先设定培训时间！')
        return false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

::v-deep .el-table__fixed-right {
  height: 100% !important;
}

::v-deep .el-transfer {
  display: inline-flex;
  align-items: center;

  .el-transfer-panel {
    width: 300px;
  }

  .el-transfer__buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .el-button.el-button--primary {
      margin-left: 0
    }
  }
}

::v-deep .new-el-tag {
  font-size: 14px;
  margin-right: 5px;
  padding: 5px;
  height: 32px;
}

.button-new-tag {
  margin-left: 5px;
  margin-top: 1px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
}

.el-row {
  display: flex;
  flex-wrap: wrap
}
</style>
