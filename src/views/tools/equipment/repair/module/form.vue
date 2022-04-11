<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="80%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="120px"
    >
      <!--设备信息-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="维修单号" prop="repairNum">
            <el-input v-model="form.repairNum" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称" prop="equipmentId">
            <el-select
              v-if="crud.status.add"
              v-model="form.equipmentId"
              style="width: 220px;"
              placeholder="请选择"
              @change="changeEquipInfo"
            >
              <el-option
                v-for="item in equipments"
                :key="item.id"
                :label="item.equipName"
                :value="item.id"
              />
            </el-select>
            <el-input v-else v-model="equipForm.equipName" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编号" prop="equipNum">
            <el-input v-model="equipForm.equipNum" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备型号" prop="equipModel">
            <el-input v-model="equipForm.equipModel" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备位置" prop="useArea">
            <el-input v-model="equipForm.useArea" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用部门" prop="useDepartName">
            <el-input v-model="equipForm.useDepartName" disabled style="width: 220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--设备维修信息-->
      <el-row>
        <el-col :span="8">
          <el-form-item label="停机时间" prop="shutTime">
            <el-date-picker
              v-model="form.shutTime"
              :picker-options="pickerOptions[0]"
              type="datetime"
              placeholder="请填写停机时间"
              style="width: 220px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="停机人员" prop="shutBy">
            <el-input v-model="form.shutBy" placeholder="请填写停机操作人" style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="是否是故障"
            prop="isFault"
          >
            <el-radio
              v-for="item in judgeFault"
              :key="item.id"
              v-model="form.isFault"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开始维修时间" prop="repairTime">
            <el-date-picker
              v-model="form.repairTime"
              :picker-options="pickerOptions[1]"
              type="datetime"
              placeholder="请填写开始维修时间"
              style="width: 220px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束维修时间" prop="resolveTime">
            <el-date-picker
              v-model="form.resolveTime"
              :picker-options="pickerOptions[2]"
              type="datetime"
              placeholder="请填写结束维修时间"
              style="width: 220px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修人员" prop="repairBy">
            <el-input v-model="form.repairBy" placeholder="请填写维修人员" style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="维修费用" prop="repairCost">
            <el-input v-model="form.repairCost" placeholder="请填写维修费用" style="width: 220px"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障说明" prop="judgeReason">
            <el-input v-model="form.judgeReason" placeholder="请填写故障描述" style="width: 220px"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="维修步骤和过程" prop="repairDesc">
          <el-input type="textarea" :rows="3" v-model="form.repairDesc" placeholder="请填写故障维修步骤和过程"/>
        </el-form-item>
      </el-row>
      <!--更换备件-->
      <el-row style="margin: 5px 0;">
        <el-col :span="24">
          <el-form-item label="更换备件">
            <el-button type="primary" @click="addPart(form.partList)" >新增</el-button>
            <el-table
              :data="form.partList"
              border
              style="width: 100%"
              @row-dblclick="dbSelectedRow"
            >
              <el-table-column prop="partNum" label="备件编号" width="180">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.partNum" v-show="scope.row.isEditor" />
                  <span v-show="!scope.row.isEditor">{{scope.row.partNum}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="partName" label="备件名称" width="180">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.partName" v-show="scope.row.isEditor" />
                  <span v-show="!scope.row.isEditor">{{scope.row.partName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="partSpec" label="备件规格" min-width="150px">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.partSpec" v-show="scope.row.isEditor" />
                  <span v-show="!scope.row.isEditor">{{scope.row.partSpec}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="partQuantity" label="备件数量">
                <template slot-scope="scope">
                  <el-input  type="number" :min=1 :step="1" v-model="scope.row.partQuantity" v-show="scope.row.isEditor" />
                  <span v-show="!scope.row.isEditor">{{scope.row.partQuantity}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="partProperty" label="备件属性">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.partProperty" v-show="scope.row.isEditor" />
                  <span v-show="!scope.row.isEditor">{{scope.row.partProperty}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="partCost" label="备件单价(元)">
                <template slot-scope="scope">
                  <el-input type="text" v-model="scope.row.partCost" @input="(v)=>(scope.row.partCost = v.replace(/[^0-9.]/g,''))" v-show="scope.row.isEditor" />
                  <span v-show="!scope.row.isEditor">{{scope.row.partCost}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
<!--                  <el-button type="warning" @click="edit(scope.row, scope)">编辑</el-button>-->
<!--                  <el-button type="success" @click="savePart(scope.row)">保存</el-button>-->
                  <el-button type="success" @click="deletePart(scope.$index,form.partList)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>

          </el-form-item>
        </el-col>
      </el-row>
      <!--确认-->
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="确认完成"
            prop="isFinished"
          >
            <el-radio
              v-for="item in judgeFault"
              :key="item.id"
              v-model="form.isFinished"
              :label="item.value === 'true'"
            >
              {{ item.label }}
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col v-if="form.isFinished" :span="8">
          <el-form-item label="确认人" prop="confirmBy">
            <el-input v-model="form.confirmBy" placeholder="请填写维修确认人员"/>
          </el-form-item>
        </el-col>
        <el-col v-if="form.isFinished" :span="8">
          <el-form-item label="确认时间" prop="confirmTime">
            <el-date-picker
              v-model="form.confirmTime"
              :picker-options="pickerOptions[3]"
              type="datetime"
              placeholder="请填写确认时间"
              style="width: 220px"
            />
          </el-form-item>
        </el-col>
        <!--上传确认信息-->
        <el-col v-if="form.isFinished" :span="24">
          <el-form-item label="确认单列表">
            <el-table
              ref="table"
              border
              v-loading="repairFilesLoading"
              :data="form.fileList"
              style="width: 100%;margin-bottom: 10px;"
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
              <el-table-column prop="size" label="大小" min-width="80"/>
              <el-table-column prop="type" label="类型" min-width="80"/>
              <el-table-column prop="createBy" label="创建者" min-width="80"/>
              <!--   附件删除   -->
              <el-table-column
                label="操作"
                width="80"
                align="center"
              >
                <template slot-scope="scope">
                  <el-popover
                    :ref="`delRepairFile-popover-${scope.$index}`"
                    v-permission="permission.edit"
                    placement="top"
                    width="180"
                  >
                    <p>确定删除这个附件吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="scope._self.$refs[`delRepairFile-popover-${scope.$index}`].doClose()"
                      >取消
                      </el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deleteRepairFile(scope.row), scope._self.$refs[`delRepairFile-popover-${scope.$index}`].doClose()"
                      >确定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      v-permission="permission.edit"
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      :disabled="form.fileList.length < 2"
                    />
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <el-upload
              class="upload-demo"
              ref="upload"
              :headers="headers"
              :multiple="true"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :action="repairFileUploadApi + '?repairId=' + bindingId "
              :on-error="handleError">
              <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">Within 100M 可上传任意格式文件，且单文件不超过100M</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, {form} from '@crud/crud'
import {getEquipmentByExample, getEquipmentById} from "@/api/tools/equipment";
import {validIsNotNull} from "@/utils/validationUtil";
import {initRepairNum} from "@/api/tools/equipRepair";
import {mapGetters} from "vuex";
import {getToken} from "@/utils/auth";
import {getUid} from "@/api/tools/supplier";
import {delRepairFile, getFilesByRepairId} from "@/api/tools/repairFile";

const defaultForm = {
  id: null,
  equipmentId: null,
  repairNum: null,
  isFault: true,
  shutTime: null,
  shutBy: null,
  repairBy: null,
  repairTime: null,
  resolveTime: null,
  judgeReason: null,
  repairDesc: null,
  repairCost: null,
  confirmBy: null,
  confirmTime: null,
  isFinished: true,
  uid: null,
  fileList: [],
  partList: []
}
export default {
  mixins: [form(defaultForm)],
  props: {
    judgeFault: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'repair:add'],
        edit: ['admin', 'repair:edit'],
        del: ['admin', 'repair:del']
      },
      cond: {
        statusInList: ['已验收']
      },
      equipments: [],
      equipForm: {},
      pickerOptions: [
        {
          /*disabledDate: time => {
            return (
              Date.now() < time.getTime()
            )
          }*/
        },
        {
          //限制开始维修时间不可早于停机时间
          /* disabledDate: time => {
             // 是否限制的判断条件
             if (validIsNotNull(this.form.shutTime)) {
               return (
                 //禁用小于开始时间和大于开始时间一周后的日期
                 new Date(time).getTime() > Date.now() ||
                 new Date(time).getTime() < this.form.shutTime
               )
             } else {
               return false
             }
           }*/
        },
        {
          //限制开始维修时间不可早于停机时间
          /*disabledDate: time => {
            // 是否限制的判断条件
            if (validIsNotNull(this.form.repairTime)) {
              return (
                //禁用小于开始时间和大于开始时间一周后的日期
                new Date(time).getTime() > Date.now() ||
                new Date(time).getTime() < this.form.repairTime
              )
            } else {
              return false
            }
          }*/
        }
      ],
      rules: {
        equipmentId: [
          {required: true, message: '请输入设备名称', trigger: 'blur'}
        ],
        repairNum: [
          {required: true, message: '请输入设备维修单号', trigger: 'blur'}
        ],
        isFault: [
          {required: true, message: '请判断设备是否发生故障', trigger: 'blur'}
        ],
        shutTime: [
          {required: true, message: '请判断设备停机时间', trigger: 'blur'}
        ],
        shutBy: [
          {required: true, message: '请判断设备停机操作人', trigger: 'blur'}
        ],
        repairBy: [
          {required: true, message: '请输入设备维修工人信息', trigger: 'blur'}
        ],
        repairTime: [
          {required: true, message: '请输入设备开始维修信息', trigger: 'blur'}
        ],
        resolveTime: [
          {required: true, message: '请输入设备维修结束信息', trigger: 'blur'}
        ],
        judgeReason: [
          {required: true, message: '请输入设备故障描述', trigger: 'blur'}
        ],
        repairDesc: [
          {required: true, message: '请输入设备维修步骤和过程', trigger: 'blur'}
        ],
        confirmBy: [
          {required: true, message: '请输入本次维修确认人', trigger: 'blur'}
        ],
        confirmTime: [
          {required: true, message: '请输入本次维修确认时间', trigger: 'blur'}
        ],
        isFinished: [
          {required: true, message: '请确认是否提交完成', trigger: 'blur'}
        ]
      },
      bindingId: null,
      repairFilesLoading: false,
      part:{
        partId: null,
        repairId: null,
        partNum: null,
        partName: null,
        partSpec: null,
        partQuantity: null,
        partCost: null,
        isEditor: false
      }
    }
  },
  created: function () {
    this.getAllEquipments(this.cond)
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi',
      'repairFileUploadApi'
    ])
  },
  watch: {},
  mounted() {
  },
  methods: {
    // 获取所有的设备信息
    getAllEquipments(cond) {
      this.equipments = []
      getEquipmentByExample(cond).then(res => {
        this.equipments = res
        // alert(JSON.stringify(this.equipments))
      })
    },
    // 获取设备维修单号
    getInitRepairNum() {
      initRepairNum().then(res => {
        this.form.repairNum = res
      })
    },
    // 监控设备ID变化
    changeEquipInfo(id) {
      getEquipmentById(id).then(res => {
        this.equipForm = res
      })
    },
    getRepairFilesById(id) {
      this.form.fileList = []
      this.repairFilesLoading = true
      getFilesByRepairId(id).then(res => {
        // alert(res)
        this.form.fileList = res
        this.repairFilesLoading = false
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.getAllEquipments(this.cond)
      this.getInitRepairNum()
      this.equipForm = {}
      this.bindingId = null
      this.form.uid = null
      getUid().then(res => {
        this.form.uid = res
        // alert(JSON.stringify(this.form))
        this.bindingId = res
        // alert(this.bindingId)
      })
    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // alert(JSON.stringify(form))
      this.bindingId = form.id
      // 初始化设备信息
      this.changeEquipInfo(form.equipmentId)
      // 获取设备维修确认单信息列表
      this.getRepairFilesById(form.id)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form.fileList))
      // 判断是否确认完成，若确认完成则必须上传确认单
      if (this.form.isFinished && this.form.fileList.length === 0) {
        this.$message.warning("请务必上传确认单等附件！")
        return false
      }
    },
    beforeUpload: function (file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      if (this.form.name === '' || this.form.name === undefined) {
        this.form.name = file.name
      }
      return isLt2M
    },
    // 监听上传成功
    handleSuccess(response, file, fileList) {
      this.getRepairFilesById(this.bindingId)
      setTimeout(() => {
        this.$message.success('上传文件成功!')
      }, 300)
      this.$refs.upload.clearFiles()
    },
    // 删除附件
    deleteRepairFile(row) {
      // alert(row)
      const data = []
      data.push(row.id)
      delRepairFile(data).then(res => {
        this.$message({
          message: 'Del File Success! 删除附件成功!',
          type: 'success'
        })
        this.getRepairFilesById(row.repairId)
      })
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      this.form.name = ''
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    dbSelectedRow(row,index){
      row.isEditor = !row.isEditor
      /*if(row.isEditor) {

        row.isEditor = !row.isEditor
      }*/
    },
    // 新增备件信息
    addPart(tableData,e) {
      // todo 新增前判断是否通过校验
      tableData.push({
        partId: null,
        repairId: this.bindingId,
        partNum: null,
        partName: null,
        partSpec: null,
        partQuantity: null,
        partCost: null,
        isEditor: true
      })
    },
    // 移除备件信息
    deletePart(index,rows) {
      rows.splice(index,1)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
