<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission"/>
      <crudOperation :permission="permission"/>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;"
      @selection-change="crud.selectionChangeHandler"
      @row-dblclick="crud.toEdit">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="equipNum" label="设备编号" min-width="100"/>
      <el-table-column prop="equipName" label="设备名称" min-width="100"/>
      <el-table-column prop="acceptParticipant" label="参与人员"/>
      <el-table-column prop="acceptDepartName" label="验收部门"/>
      <el-table-column label="验收状态">
        <template slot-scope="scope">
          <div v-if="scope.row.acceptStatus === '待验收'">
            <el-button type="text" @click="toAcceptEquipment(scope.row)">{{ scope.row.acceptStatus }}</el-button>
          </div>
          <div v-if="scope.row.acceptStatus === '验收中'">
            <el-button type="text" @click="toApproveEquipment(scope.row)">{{ scope.row.acceptStatus }}</el-button>
          </div>
          <div v-if="scope.row.acceptStatus === '已验收' || scope.row.acceptStatus === '已拒收'">
            <span>{{ scope.row.acceptStatus }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="acceptBy" label="验收人"/>
      <el-table-column prop="approveDepartName" label="批准部门"/>
      <el-table-column prop="approveBy" label="批准人"/>
      <el-table-column prop="approveTime" label="验收时间"/>
      <el-table-column prop="createTime" label="创建日期" min-width="150px"/>
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','acceptance:edit','acceptance:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
            :disabled-dle="scope.row.acceptStatus === '已验收'"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination/>
    <!--验收表单渲染-->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible="crud.status.cu > 0"
      :title="crud.status.title"
      width="80%"
    >
      <el-dialog title="设备验收明细" append-to-body :visible.sync="detailVisible" width="60%">
        <el-table
          ref="detailTable"
          v-loading="detailsLoading"
          :data="wgAndRjs"
          height="350"
          :span-method="wgAndRjSpanMethod"
          :header-cell-style="rowClass"
          style="width: 100%;margin-top: -20px;">
          <el-table-column label="明细内容">
            <el-table-column prop="detailCategory" width="40"/>
            <el-table-column prop="detailTitle" width="200"/>
          </el-table-column>
          <el-table-column prop="detailContent" label="有/无/不适用" width="200">
            <template scope="scope">
              <el-radio v-model="scope.row.detailContent" label="有" @change="detailContentChange(scope.row)">有
              </el-radio>
              <el-radio v-model="scope.row.detailContent" label="无" @change="detailContentChange(scope.row)">无
              </el-radio>
              <el-radio v-model="scope.row.detailContent" label="不适用" @change="detailContentChange(scope.row)">不适用
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="detailDesc" label="附注">
            <template scope="scope">
              <el-input
                v-model="scope.row.detailDesc"
                size="mini"
                type="textarea"
                maxlength="500"
                show-word-limit
                autosize
                placeholder="请输入附注"
                suffix-icon="el-icon-edit"
              >{{ scope.row.detailDesc }}
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          ref="otDetailTable"
          v-loading="detailsLoading"
          :data="otDetails"
          :span-method="otSpanMethod"
          :header-cell-style="rowClass"
          style="width: 100%;margin-top: 0;">
          <el-table-column label="明细内容">
            <el-table-column prop="detailCategory" width="40"/>
            <el-table-column width="200">
              <template scope="scope">
                <span>
                  {{ scope.row.detailTitle }}
                  <el-button v-if="needFileItems.indexOf(scope.row.detailTitle)>-1 && scope.row.detailContent==='有'"
                             type="text"
                             @click="toAddAcceptanceDetailFile(scope.row)">上传附件</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="detailContent" label="有/无" width="200">
            <template scope="scope">
              <el-radio v-model="scope.row.detailContent" label="有">有</el-radio>
              <el-radio v-model="scope.row.detailContent" label="无">无</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="isNormal" label="是否正常" width="140">
            <template scope="scope">
              <el-radio v-if="scope.row.detailContent==='有'" v-model="scope.row.isNormal" label="是">是</el-radio>
              <el-radio v-if="scope.row.detailContent==='有'" v-model="scope.row.isNormal" label="否">否</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="faultContent" label="故障内容">
            <template scope="scope">
              <el-input
                v-model="scope.row.detailDesc"
                size="mini"
                type="textarea"
                maxlength="500"
                show-word-limit
                autosize
                placeholder="请输入附注"
                suffix-icon="el-icon-edit"
              >{{ scope.row.detailDesc }}
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
         <el-button @click="detailVisible = false">取 消</el-button>
         <el-button type="primary" @click="submitAcceptanceDetail(wgAndRjs,otDetails)">提 交</el-button>
        </span>
      </el-dialog>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-row>
          <el-col :span="24">
            <el-divider content-position="left">设备出厂信息</el-divider>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="equipmentId">
              <el-select
                v-if="crud.status.add"
                v-model="form.equipmentId"
                style="width: 220px;"
                placeholder="请选择"
                @change="changeEquip"
              >
                <el-option
                  v-for="item in equipments"
                  :key="item.id"
                  :label="item.equipNum+'-'+item.equipName"
                  :value="item.id"
                />
              </el-select>
              <el-input v-else v-model="equipForm.equipName" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备型号" prop="equipModel">
              <el-input v-model="equipForm.equipModel" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备类别" prop="equipType">
              <el-input v-model="equipForm.equipType" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运行状态" prop="equipStatus">
              <el-input v-model="equipForm.equipStatus" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂家" prop="equipProvider">
              <el-input v-model="equipForm.equipProvider" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂编号" prop="factoryNum">
              <el-input v-model="equipForm.factoryNum" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备规格" prop="equipSpec">
              <el-input v-model="equipForm.equipSpec" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备重量" prop="equipWeight">
              <el-input v-model="equipForm.equipWeight" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备尺寸" prop="equipSize">
              <el-input v-model="equipForm.equipSize" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂日期" prop="saleDate">
              <el-date-picker
                v-model="equipForm.saleDate"
                disabled
                type="date"
                placeholder="请填写出厂日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收到日期" prop="receiveDate">
              <el-date-picker
                v-model="equipForm.receiveDate"
                disabled
                type="date"
                placeholder="请填写收货日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备原值" prop="netValue">
              <el-input v-model="equipForm.netValue" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电" prop="equipOltage">
              <el-input v-model="equipForm.equipOltage" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="气" prop="equipAir">
              <el-input v-model="equipForm.equipAir" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="水" prop="equipWater">
              <el-input v-model="equipForm.equipWater" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="其它" prop="equipOther">
              <el-input v-model="equipForm.equipOther" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备位置" prop="useArea">
              <el-input v-model="equipForm.useArea" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="使用部门" prop="useDepart">
              <TreeSelect
                v-model="equipForm.useDepart"
                :options="useDeparts"
                :load-options="loadFileDepts"
                disabled
                placeholder="选择所属部门"
                style="width:220px !important;height: 32px!important; line-height: 32px!important;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--验收信息-->
        <el-row>
          <el-row>
            <el-col :span="24">
              <el-divider content-position="left">设备验收参与信息</el-divider>
              <el-form-item label="参与人员" prop="acceptParticipant">
                <div>
                  <el-tag
                    v-for="tag in form.participantTags"
                    :key="tag"
                    closable
                    :disable-transitions="false"
                    @close="handleParticipantClose(tag)"
                    class="new-part-tag"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    v-if="inputParticipantVisible"
                    ref="participantTagInput"
                    v-model="inputParticipantValue"
                    style="width: 30%"
                    size="small"
                    placeholder="涉及到的相关部门"
                    @keyup.enter.native="handleInputParticipantConfirm"
                    @blur="handleInputParticipantConfirm"
                  />
                  <el-button v-else size="small" style="height: 29px;" @click="showInputDepart">+参与人员
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.acceptStatus !== '待验收'">
            <el-col :span="24">
              <el-divider content-position="left">设备验收明细</el-divider>
            </el-col>
            <el-row>
              <el-col :span="8">
                <el-form-item label="设备验收明细">
                  <el-button type="primary" style="width: 220px!important;" @click="openDetailDialog(form.id)">打开验收明细单
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="验收结果" prop="approveResult">
                  <el-select
                    v-model="form.approveResult"
                    placeholder="请选择验收结果"
                    @change="approveResultChanged"
                    style="width: 220px"
                  >
                    <el-option
                      v-for="item in approveResultOptions"
                      :key="item.label"
                      :label="item.label "
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="验收补充" prop="refuseReason" :rules="refuseReasonRules">
                  <el-input v-model="form.refuseReason" placeholder="可填写拒收理由或者其他补充" style="width: 220px"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="验收部门" prop="acceptDepart">
                  <TreeSelect
                    v-model="form.acceptDepart"
                    :options="useDeparts"
                    :load-options="loadFileDepts"
                    class="newTree-item"
                    placeholder="选择验收人所在部门"
                    style="width:220px !important;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="验收人" prop="acceptBy">
                  <el-select
                    v-model="form.acceptBy"
                    placeholder="请选择验收人"
                    style="width:220px !important;"
                    @input="changeApproveBy($event)"
                  >
                    <el-option
                      v-for="item in acceptBys"
                      :key="item.id"
                      :label="item.jobs[0].name + '-'+ item.username "
                      :value="item.username"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="验收时间" prop="acceptTime">
                  <el-date-picker
                    v-model="form.acceptTime"
                    type="datetime"
                    placeholder="请填写验收日期"
                    style="width:220px !important;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-col :span="8" v-if="form.acceptStatus !== '待验收'">
              <el-form-item label="提交人" prop="submitBy">
                <el-input v-model="form.submitBy" style="width:220px !important;" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.acceptStatus === '已验收' || form.acceptStatus === '已拒收'">
              <el-form-item label="批准部门" prop="approveDepart">
                <TreeSelect
                  v-model="form.approveDepart"
                  :options="useDeparts"
                  :load-options="loadFileDepts"
                  class="newTree-item"
                  placeholder="选择批准验收部门"
                  style="width:220px !important;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="form.acceptStatus === '已验收' || form.acceptStatus === '已拒收'">
              <el-form-item label="批准人" prop="approveBy">
                <el-select
                  v-model="form.approveBy"
                  placeholder="请选择批准人"
                  style="width:220px !important;"
                  @input="changeApproveBy($event)"
                >
                  <el-option
                    v-for="item in approveBys"
                    :key="item.id"
                    :label="item.jobs[0].name + '-'+ item.username "
                    :value="item.username"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--验收提交表单渲染-->
    <el-dialog
      :before-close="handleClose"
      :visible.sync="acceptEquipmentVisible"
      title="验收设备"
      width="80%"
    >
      <!--todo 设备验收明细表格信息-->
      <el-dialog title="设备验收明细" append-to-body :visible.sync="detailVisible" width="60%">
        <el-table
          ref="detailTable"
          v-loading="detailsLoading"
          :data="wgAndRjs"
          height="350"
          :span-method="wgAndRjSpanMethod"
          :header-cell-style="rowClass"
          style="width: 100%;margin-top: -20px;">
          <el-table-column label="明细内容">
            <el-table-column prop="detailCategory" width="40"/>
            <el-table-column prop="detailTitle" width="200"/>
          </el-table-column>
          <el-table-column prop="detailContent" label="有/无/不适用" width="200">
            <template scope="scope">
              <el-radio v-model="scope.row.detailContent" label="有" @change="detailContentChange(scope.row)">有
              </el-radio>
              <el-radio v-model="scope.row.detailContent" label="无" @change="detailContentChange(scope.row)">无
              </el-radio>
              <el-radio v-model="scope.row.detailContent" label="不适用" @change="detailContentChange(scope.row)">不适用
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="detailDesc" label="附注">
            <template scope="scope">
              <el-input
                v-model="scope.row.detailDesc"
                size="mini"
                type="textarea"
                maxlength="500"
                show-word-limit
                autosize
                placeholder="请输入附注"
                suffix-icon="el-icon-edit"
              >{{ scope.row.detailDesc }}
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          ref="otDetailTable"
          v-loading="detailsLoading"
          :data="otDetails"
          :span-method="otSpanMethod"
          :header-cell-style="rowClass"
          style="width: 100%;margin-top: 0;">
          <el-table-column label="明细内容">
            <el-table-column prop="detailCategory" width="40"/>
            <el-table-column width="200">
              <template scope="scope">
                <span>
                  {{ scope.row.detailTitle }}
                  <el-button v-if="needFileItems.indexOf(scope.row.detailTitle)>-1 && scope.row.detailContent==='有'"
                             type="text"
                             @click="toAddAcceptanceDetailFile(scope.row)">上传附件</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="detailContent" label="有/无" width="200">
            <template scope="scope">
              <el-radio v-model="scope.row.detailContent" label="有">有</el-radio>
              <el-radio v-model="scope.row.detailContent" label="无">无</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="isNormal" label="是否正常" width="140">
            <template scope="scope">
              <el-radio v-if="scope.row.detailContent==='有'" v-model="scope.row.isNormal" label="是">是</el-radio>
              <el-radio v-if="scope.row.detailContent==='有'" v-model="scope.row.isNormal" label="否">否</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="faultContent" label="故障内容">
            <template scope="scope">
              <el-input
                v-model="scope.row.detailDesc"
                size="mini"
                type="textarea"
                maxlength="500"
                show-word-limit
                autosize
                placeholder="请输入附注"
                suffix-icon="el-icon-edit"
              >{{ scope.row.detailDesc }}
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
         <el-button @click="detailVisible = false">取 消</el-button>
         <el-button type="primary" @click="submitAcceptanceDetail(wgAndRjs,otDetails)">提 交</el-button>
        </span>
      </el-dialog>
      <el-form
        ref="acceptForm"
        :model="acceptForm"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备名称">
              <el-input v-model="equipForm.equipName" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号">
              <el-input v-model="equipForm.equipNum" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂家">
              <el-input v-model="equipForm.equipProvider" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备类别" prop="equipType">
              <el-input v-model="equipForm.equipType" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂家" prop="equipProvider">
              <el-input v-model="equipForm.equipProvider" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂编号" prop="factoryNum">
              <el-input v-model="equipForm.factoryNum" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备规格" prop="equipSpec">
              <el-input v-model="equipForm.equipSpec" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备重量" prop="equipWeight">
              <el-input v-model="equipForm.equipWeight" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备尺寸" prop="equipSize">
              <el-input v-model="equipForm.equipSize" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂日期" prop="saleDate">
              <el-date-picker
                v-model="equipForm.saleDate"
                disabled
                type="date"
                placeholder="请填写出厂日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收到日期" prop="receiveDate">
              <el-date-picker
                v-model="equipForm.receiveDate"
                disabled
                type="date"
                placeholder="请填写收货日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备原值" prop="netValue">
              <el-input v-model="equipForm.netValue" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="运行状态" prop="equipStatus">
              <el-input v-model="equipForm.equipStatus" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="参与人员" prop="acceptParticipant">
              <el-tag
                v-for="tag in acceptForm.participantTags"
                :key="tag"
                class="new-part-tag"
              >
                {{ tag }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备验收明细">
              <el-button type="primary" style="width: 220px !important;" @click="openDetailDialog(acceptForm.id)">
                打开验收明细单
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收结果" prop="approveResult">
              <el-select
                v-model="acceptForm.approveResult"
                placeholder="请选择验收结果"
                @change="approveResultChanged"
              >
                <el-option
                  v-for="item in approveResultOptions"
                  :key="item.label"
                  :label="item.label "
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收补充" prop="refuseReason" :rules="refuseReasonRules">
              <el-input v-model="acceptForm.refuseReason" placeholder="可填写拒收理由或者其他补充" style="width: 220px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备验收部门" prop="acceptDepart">
              <TreeSelect
                v-model="acceptForm.acceptDepart"
                :options="useDeparts"
                :load-options="loadFileDepts"
                class="newTree-item"
                placeholder="选择验收人所在部门"
                style="width:220px !important;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备验收人" prop="acceptBy">
              <el-select
                v-model="acceptForm.acceptBy"
                placeholder="请选择验收人"
                @change="acceptByChanged"
              >
                <el-option
                  v-for="item in acceptBys"
                  :key="item.id"
                  :label="item.jobs[0].name + '-'+ item.username "
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收时间" prop="acceptTime">
              <el-date-picker
                v-model="acceptForm.acceptTime"
                type="datetime"
                placeholder="请填写验收日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="acceptEquipmentVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAcceptance">提 交</el-button>
      </span>
    </el-dialog>
    <!--批准提交表单渲染-->
    <el-dialog
      :before-close="handleClose"
      :visible.sync="approveEquipmentVisible"
      title="验收设备批准"
      width="80%"
    >
      <el-dialog title="设备验收明细" append-to-body :visible.sync="detailVisible" width="60%">
        <el-table
          ref="detailTable"
          v-loading="detailsLoading"
          :data="wgAndRjs"
          height="350"
          :span-method="wgAndRjSpanMethod"
          :header-cell-style="rowClass"
          style="width: 100%;margin-top: -20px;">
          <el-table-column label="明细内容">
            <el-table-column prop="detailCategory" width="40"/>
            <el-table-column prop="detailTitle" width="200"/>
          </el-table-column>
          <el-table-column prop="detailContent" label="有/无/不适用" width="200">
            <template scope="scope">
              <el-radio v-model="scope.row.detailContent" label="有" @change="detailContentChange(scope.row)">有
              </el-radio>
              <el-radio v-model="scope.row.detailContent" label="无" @change="detailContentChange(scope.row)">无
              </el-radio>
              <el-radio v-model="scope.row.detailContent" label="不适用" @change="detailContentChange(scope.row)">不适用
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="detailDesc" label="附注">
            <template scope="scope">
              <el-input
                v-model="scope.row.detailDesc"
                size="mini"
                type="textarea"
                maxlength="500"
                show-word-limit
                autosize
                placeholder="请输入附注"
                suffix-icon="el-icon-edit"
              >{{ scope.row.detailDesc }}
              </el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          ref="otDetailTable"
          v-loading="detailsLoading"
          :data="otDetails"
          :span-method="otSpanMethod"
          :header-cell-style="rowClass"
          style="width: 100%;margin-top: 0;">
          <el-table-column label="明细内容">
            <el-table-column prop="detailCategory" width="40"/>
            <el-table-column width="200">
              <template scope="scope">
                <span>
                  {{ scope.row.detailTitle }}
                  <el-button v-if="needFileItems.indexOf(scope.row.detailTitle)>-1 && scope.row.detailContent==='有'"
                             type="text"
                             @click="toAddAcceptanceDetailFile(scope.row)">上传附件</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="detailContent" label="有/无" width="200">
            <template scope="scope">
              <el-radio v-model="scope.row.detailContent" label="有">有</el-radio>
              <el-radio v-model="scope.row.detailContent" label="无">无</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="isNormal" label="是否正常" width="140">
            <template scope="scope">
              <el-radio v-if="scope.row.detailContent==='有'" v-model="scope.row.isNormal" label="是">是</el-radio>
              <el-radio v-if="scope.row.detailContent==='有'" v-model="scope.row.isNormal" label="否">否</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="faultContent" label="故障内容">
            <template scope="scope">
              <el-input
                v-model="scope.row.detailDesc"
                size="mini"
                type="textarea"
                maxlength="500"
                show-word-limit
                autosize
                placeholder="请输入附注"
                suffix-icon="el-icon-edit"
              >{{ scope.row.detailDesc }}
              </el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-form
        ref="approveForm"
        :model="approveForm"
        :rules="rules"
        size="small"
        label-width="120px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="待验收设备名称">
              <el-input v-model="equipForm.equipName" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="待验收设备编号">
              <el-input v-model="equipForm.equipNum" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="待验收设备厂家">
              <el-input v-model="equipForm.equipProvider" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备类别" prop="equipType">
              <el-input v-model="equipForm.equipType" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备厂家" prop="equipProvider">
              <el-input v-model="equipForm.equipProvider" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂编号" prop="factoryNum">
              <el-input v-model="equipForm.factoryNum" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备规格" prop="equipSpec">
              <el-input v-model="equipForm.equipSpec" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备重量" prop="equipWeight">
              <el-input v-model="equipForm.equipWeight" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备尺寸" prop="equipSize">
              <el-input v-model="equipForm.equipSize" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出厂日期" prop="saleDate">
              <el-date-picker
                v-model="equipForm.saleDate"
                disabled
                type="date"
                placeholder="请填写出厂日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收到日期" prop="receiveDate">
              <el-date-picker
                v-model="equipForm.receiveDate"
                disabled
                type="date"
                placeholder="请填写收货日期"
                style="width: 220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备原值" prop="netValue">
              <el-input v-model="equipForm.netValue" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="运行状态" prop="equipStatus">
              <el-input v-model="equipForm.equipStatus" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="参与人员" prop="acceptParticipant">
              <el-tag
                v-for="tag in approveForm.participantTags"
                :key="tag"
                class="new-part-tag"
              >
                {{ tag }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <!--验收明细-->
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备验收明细">
              <el-button type="primary" style="width: 220px !important;" @click="openDetailDialog(approveForm.id)">
                查看验收明细单
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收结果" prop="approveResult">
              <el-select
                v-model="approveForm.approveResult"
                placeholder="请选择验收结果"
                disabled
              >
                <el-option
                  v-for="item in approveResultOptions"
                  :key="item.label"
                  :label="item.label "
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收补充" prop="refuseReason" :rules="refuseReasonRules">
              <el-input v-model="approveForm.refuseReason" disabled placeholder="可填写拒收理由或者其他补充" style="width: 220px"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备验收部门" prop="acceptDepart">
              <TreeSelect
                v-model="approveForm.acceptDepart"
                :options="useDeparts"
                :load-options="loadFileDepts"
                class="newTree-item"
                placeholder="选择验收人所在部门"
                style="width:220px !important;"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备验收人" prop="acceptBy">
              <el-select
                v-model="approveForm.acceptBy"
                placeholder="请选择验收人"
                disabled
                style="width: 220px"
              >
                <el-option
                  v-for="item in acceptBys"
                  :key="item.id"
                  :label="item.jobs[0].name + '-'+ item.username "
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收时间" prop="acceptTime">
              <el-date-picker
                v-model="approveForm.acceptTime"
                type="datetime"
                placeholder="请填写验收日期"
                style="width: 220px"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备提交人" prop="submitBy">
              <el-input v-model="approveForm.submitBy" disabled style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收批准部门" prop="approveDepart">
              <TreeSelect
                v-model="approveForm.approveDepart"
                :options="useDeparts"
                :load-options="loadFileDepts"
                class="newTree-item"
                placeholder="选择批准验收部门"
                style="width:220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收批准人" prop="approveBy">
              <el-select
                v-model="approveForm.approveBy"
                placeholder="请选择批准人"
                style="width:220px"
                @input="changeApproveBy($event)"
              >
                <el-option
                  v-for="item in approveBys"
                  :key="item.id"
                  :label="item.jobs[0].name + '-'+ item.username "
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approveEquipmentVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApproval">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import crudEquipAcceptance from '@/api/tools/equipAcceptance'
import eHeader from './module/header'
import CRUD, {crud, form, header, presenter} from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import {mapGetters} from "vuex";
import {getToken} from "@/utils/auth";
import {GMTToDate, judgeIsEqual, validIsNotNull} from "@/utils/validationUtil";
import {getDepts, getDeptTree} from "@/api/system/dept";
import TreeSelect, {LOAD_CHILDREN_OPTIONS} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getEquipmentByExample, getEquipmentById} from "@/api/tools/equipment";
import {getUserByDeptId} from "@/api/system/user";
import {editEquipAcceptanceDetails, getDetailsByAcceptanceId} from "@/api/tools/equipAcceptanceDetail";

const defaultForm = {
  id: null,
  equipmentId: null,
  acceptParticipant: null,
  acceptStatus: '待验收',
  participantTags: [],
  acceptDepart: null,
  approveResult: null,
  refuseReason: null,
  acceptBy: null,
  acceptTime: null,
  approveDepart: null,
  submitBy: null,
  approveBy: null
}
export default {
  name: 'Acceptance',
  components: {eHeader, crudOperation, pagination, udOperation, TreeSelect},
  cruds() {
    return CRUD({
      title: '设备验收',
      url: 'api/equipAcceptance',
      // sort: ['jobSort,asc', 'id,desc'],
      crudMethod: {...crudEquipAcceptance}
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['equip_status'],
  data() {
    return {
      headers: {'Authorization': getToken()},
      permission: {
        add: ['admin', 'acceptance:add'],
        edit: ['admin', 'acceptance:edit'],
        del: ['admin', 'acceptance:del']
      },
      equipForm: {},
      useDeparts: [],
      acceptForm: {
        id: null,
        equipmentId: null,
        acceptParticipant: null,
        acceptStatus: null,
        participantTags: [],
        acceptDepart: null,
        acceptBy: null,
        acceptTime: null,
        approveResult: null,
        refuseReason: null,
        approveDepart: null,
        submitBy: null,
        approveBy: null
      },
      approveForm: {
        id: null,
        equipmentId: null,
        acceptParticipant: null,
        acceptStatus: null,
        participantTags: [],
        acceptDepart: null,
        acceptBy: null,
        acceptTime: null,
        approveResult: null,
        refuseReason: null,
        approveDepart: null,
        submitBy: null,
        approveBy: null
      },
      rules: {
        equipmentId: [
          {required: true, message: '请选择需要验收的设备', trigger: 'blur'}
        ],
        acceptParticipant: [
          {required: true, message: '验收人员不可为空', trigger: 'blur'}
        ],
        acceptDepart: [
          {required: true, message: '验收部门不可为空', trigger: 'blur'}
        ],
        approveResult: [
          {required: true, message: '验收结果不可为空', trigger: ['blur', 'change']}
        ],
        refuseReason: [
          {required: true, message: '请填写验收不通过原因', trigger: 'blur'}
        ],
        acceptBy: [
          {required: true, message: '验收人员不可为空', trigger: 'blur'}
        ],
        acceptTime: [
          {required: true, message: '验收时间不可为空', trigger: 'blur'}
        ],
        submitBy: [
          {required: true, message: '提交人员不可为空', trigger: 'blur'}
        ],
        approveDepart: [
          {required: true, message: '批准人员所在部门不可为空', trigger: 'blur'}
        ],
        approveBy: [
          {required: true, message: '批准人员不可为空', trigger: 'blur'}
        ]
      },
      refuseReasonRules: [
        {required: false}
      ],
      pickerOptions: [
        {
          //出厂日期不可晚于现在时间
          disabledDate: time => {
            return (
              Date.now() <= time.getTime()
            )
          }
        },
        {
          //限制收货时间晚于出场时间
          disabledDate: time => {
            // 是否限制的判断条件
            if (validIsNotNull(this.form.saleDate)) {
              const date = new Date(this.form.saleDate);
              return (
                new Date(time).getTime() <= date
              )
            } else {
              return false
            }
          }
        }
      ],
      equipments: [],
      cond: {
        statusInList: ['待验收']
      },
      approveResultOptions: [
        {
          label: '通过',
          value: '通过'
        },
        {
          label: '不通过',
          value: '不通过'
        }
      ],
      inputParticipantVisible: false,
      inputParticipantValue: null,
      acceptBys: [],
      approveBys: [],
      acceptEquipmentVisible: false,
      approveEquipmentVisible: false,
      detailVisible: false,
      detailsLoading: false,
      details: [],
      otCategory: '运转测试',
      otDetails: [],
      wgAndRjs: [],
      spanOtArr: [],
      spanWRArr: [],
      wrPos: 0,
      needFileItems: ['CMK', 'MSA', 'UPH']
    }
  },
  watch: {
    // 监听deptId
    'form.acceptDepart': 'currAcceptDeptChange',
    'acceptForm.acceptDepart': 'newAcceptDeptChange',
    'form.approveDepart': 'currApproveDeptChange',
    'approveForm.approveDepart': 'newApproveDeptChange'
  },
  computed: {
    ...mapGetters([
      'user',
      'baseApi'
    ])
  },
  created: function () {
    this.getTopDept()
    this.getAllEquipments(this.cond)
    this.crud.optShow = {
      add: true,
      edit: true,
      del: false,
      download: true,
      reset: true
    }
  },
  methods: {
    // 获取所有符合条件的设备信息
    getAllEquipments(cond) {
      this.equipments = []
      getEquipmentByExample(cond).then(res => {
        this.equipments = res
        // alert(JSON.stringify(this.equipments))
      })
    },
    // 监控审批状态选择器输入变化，强制刷新
    changeApproveBy() {
      this.$forceUpdate()
    },
    // 监控设备ID变化
    changeEquip(id) {
      getEquipmentById(id).then(res => {
        this.equipForm = res
      })
    },
    // 获取所在公司的部门树结构
    getTopDept() {
      // alert(JSON.stringify(this.user))
      getDeptTree().then(res => {
        this.useDeparts = res.content
      })
    },
    // 获取弹窗内使用部门数据
    loadFileDepts({action, parentNode, callback}) {
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
    // 检测验收部门变化
    currAcceptDeptChange(deptId) {
      this.acceptBys = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        this.acceptBys = res
        if (this.acceptBys.length > 0) {
          // 若不是同部门成员则需要默认切换到首选默认值
          let usernames = []
          this.acceptBys.forEach((data, index) => {
            usernames.push(data.username)
          })
          if (validIsNotNull(this.form.acceptBy)) {
            if (usernames.indexOf(this.form.acceptBy) === -1) {
              this.form.acceptBy = this.acceptBys[0].username
            }
          } else {
            // 若原无值则设置首选默认值
            this.form.acceptBy = this.acceptBys[0].username
          }
          // alert(usernames.indexOf(this.form.acceptBy))
        } else {
          this.form.acceptBy = null
        }
      })
    },
    newAcceptDeptChange(deptId) {
      this.acceptBys = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        this.acceptBys = res
        if (this.acceptBys.length > 0) {
          // 若不是同部门成员则需要默认切换到首选默认值
          let usernames = []
          this.acceptBys.forEach((data, index) => {
            usernames.push(data.username)
          })
          if (validIsNotNull(this.acceptForm.acceptBy)) {
            if (usernames.indexOf(this.acceptForm.acceptBy) === -1) {
              this.acceptForm.acceptBy = this.acceptBys[0].username
            }
          } else {
            // 若原无值则设置首选默认值
            this.acceptForm.acceptBy = this.acceptBys[0].username
          }
          // alert(usernames.indexOf(this.form.acceptBy))
        } else {
          this.acceptForm.acceptBy = null
        }
        // alert(JSON.stringify(this.users))
        // alert(this.form.acceptBy)
      })
    },
    acceptByChanged(val) {
      this.$forceUpdate()
      // this.$set(this.acceptForm,'acceptBy',val)
    },
    // todo 监听验收结果变化
    approveResultChanged(val) {
      // alert(val)
      if (val === '不通过') {
        this.refuseReasonRules = this.rules.refuseReason
      } else {
        this.refuseReasonRules = [
          {required: false}
        ]
      }
    },
    // 添加验收信息
    toAcceptEquipment(row) {
      // 采用深拷贝方式防止直接“引用”
      this.acceptForm = {...row}
      this.acceptForm.submitBy = this.user.dept.name + '-' + this.user.username
      // alert(JSON.stringify(row))
      // 初始化设备信息
      this.changeEquip(row.equipmentId)
      this.$nextTick(() => {
        this.acceptEquipmentVisible = true
      }, 500)
    },
    openDetailDialog(acceptanceId) {
      this.detailsLoading = true
      this.details = []
      this.otDetails = []
      this.wgAndRjs = []
      this.spanWRArr = []
      this.spanOtArr = []
      getDetailsByAcceptanceId(acceptanceId).then(res => {
        this.details = res
        if (this.details.length > 0) {
          this.details.forEach((data, index) => {
            if (data.detailCategory === this.otCategory) {
              this.otDetails.push(data)
            } else {
              this.wgAndRjs.push(data)
            }
          })
          this.initRowSpan()
          // alert(JSON.stringify(this.spanOtArr))
        }
        this.detailsLoading = false
        // alert(JSON.stringify(this.details))
      })
      this.$nextTick(() => {
        this.detailVisible = true
      }, 300)
    },
    // 初始表格合并
    initRowSpan() {
      let wrPos = 0
      for (let i = 0; i < this.wgAndRjs.length; i++) {
        if (i === 0) {
          this.spanWRArr.push(1);
          wrPos = 0;
        } else {
          // 判断当前对象的指定属性值与上一个对象的指定属性值是否相等
          if (this.wgAndRjs[i].detailCategory === this.wgAndRjs[i - 1].detailCategory) {
            this.spanWRArr[wrPos] += 1;
            this.spanWRArr.push(0);
          } else {
            this.spanWRArr.push(1);
            wrPos = i;
          }
        }
      }
      let otPos = 0
      for (let i = 0; i < this.otDetails.length; i++) {
        if (i === 0) {
          this.spanOtArr.push(1);
          otPos = 0;
        } else {
          // 判断当前对象的指定属性值与上一个对象的指定属性值是否相等
          if (this.otDetails[i].detailCategory === this.otDetails[i - 1].detailCategory) {
            this.spanOtArr[otPos] += 1;
            this.spanOtArr.push(0);
          } else {
            this.spanOtArr.push(1);
            otPos = i;
          }
        }
      }
    },
    // 合并表头
    rowClass({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0 && columnIndex === 0) {
        this.$nextTick(() => {
          if (document.getElementsByClassName(column.id).length !== 0) {
            document.getElementsByClassName(column.id)[0].setAttribute('rowSpan', 2)
            return false
          }
        })
      }
      if (rowIndex === 1 && (columnIndex === 0 || columnIndex === 1)) {
        return {display: 'none'}
      }
    },
    // 合并单元格
    wgAndRjSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.spanWRArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowspan:${_row} colspan:${_col}`);
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
    },
    detailContentChange(row) {
      // alert(JSON.stringify(row))
    },
    // todo 添加设备验收明细CMK/MSA/UPH文件
    toAddAcceptanceDetailFile(row) {
      // row.detailTitle 作为文件类型
      // row.id 作为文件绑定ID
      // alert(JSON.stringify(row))
    },
    // 合并单元格
    otSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        const _row = this.spanOtArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        console.log(`rowspan:${_row} colspan:${_col}`);
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
    },
    // 上传设备验收明细
    // 提交验收信息
    submitAcceptance() {
      // alert(JSON.stringify(this.acceptForm))
      this.$refs['acceptForm'].validate((valid) => {
        if (valid) {
          this.acceptForm.acceptStatus = '验收中'
          crudEquipAcceptance.edit(this.acceptForm).then(res => {
            this.crud.notify('验收信息提交成功!', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.acceptEquipmentVisible = false
            this.crud.toQuery()
          }).catch(() => {

          })
        }
      })
    },
    // 提交验收明细信息
    submitAcceptanceDetail() {
      // alert(JSON.stringify(wgAndRjs))
      // alert(JSON.stringify(otDetails))
      let totalArr = []
      this.wgAndRjs.forEach((data, index) => {
        totalArr.push(data)
      })
      this.otDetails.forEach((data, index) => {
        totalArr.push(data)
      })
      editEquipAcceptanceDetails(totalArr).then(res => {
        this.$message.success("验收明细提交成功")
        this.detailVisible = false
      }).catch(() => {

      })
    },
    // 添加批准信息
    toApproveEquipment(row) {
      this.approveForm = {...row}
      // alert(JSON.stringify(this.form))
      // 初始化设备信息
      this.changeEquip(row.equipmentId)
      this.$nextTick(() => {
        this.approveEquipmentVisible = true
      }, 500)
    },
    // 提交批准信息
    submitApproval() {
      // alert(JSON.stringify(this.approveForm))
      this.$refs['approveForm'].validate((valid) => {
        if (valid) {
          if (this.approveForm.approveResult === '通过') {
            this.approveForm.acceptStatus = '已验收'
          } else if (this.approveForm.approveResult === '不通过') {
            this.approveForm.acceptStatus = '已拒收'
          }
          crudEquipAcceptance.edit(this.approveForm).then(res => {
            this.crud.notify('验收批准信息提交成功!', CRUD.NOTIFICATION_TYPE.SUCCESS)
            this.approveEquipmentVisible = false
            this.crud.toQuery()
          }).catch(() => {

          })
        }
      })
    },
    // 监控数据变化
    currApproveDeptChange(deptId) {
      this.approveBys = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        // alert(JSON.stringify(res))
        this.approveBys = res
        if (this.approveBys.length > 0) {
          // 若不是同部门成员则需要默认切换到首选默认值
          let usernames = []
          this.approveBys.forEach((data, index) => {
            usernames.push(data.username)
          })
          if (validIsNotNull(this.form.approveBy)) {
            if (usernames.indexOf(this.form.approveBy) === -1) {
              this.form.approveBy = this.approveBys[0].username
            }
          } else {
            // 若原无值则设置首选默认值
            this.form.approveBy = this.approveBys[0].username
          }
          // alert(usernames.indexOf(this.form.acceptBy))
        } else {
          this.form.approveBy = null
        }
        // alert(JSON.stringify(this.users))
      })
    },
    // 监控
    newApproveDeptChange(deptId) {
      this.approveBys = []
      // 根据部门标识（val）查找人员信息
      getUserByDeptId({deptId: deptId}).then(res => {
        // alert(JSON.stringify(res))
        this.approveBys = res
        if (this.approveBys.length > 0) {
          // 若不是同部门成员则需要默认切换到首选默认值
          let usernames = []
          this.approveBys.forEach((data, index) => {
            usernames.push(data.username)
          })
          if (validIsNotNull(this.approveForm.approveBy)) {
            if (usernames.indexOf(this.approveForm.approveBy) === -1) {
              this.approveForm.approveBy = this.approveBys[0].username
            }
          } else {
            // 若原无值则设置首选默认值
            this.approveForm.approveBy = this.approveBys[0].username
          }
          // alert(usernames.indexOf(this.form.acceptBy))
        } else {
          this.approveForm.approveBy = null
        }
      })
    },
    // 新增前操作
    [CRUD.HOOK.beforeToAdd]() {
      this.getAllEquipments(this.cond)
      this.equipForm = {}
      // this.equipForm = this.$options.data().equipForm
    },
    // 编辑前操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
      // alert(JSON.stringify(form))
      // 初始化设备信息
      this.changeEquip(form.equipmentId)
    },
    // 提交前做的操作
    [CRUD.HOOK.beforeSubmit]() {
      // alert(JSON.stringify(this.form))
      if (this.form.acceptStatus === '已验收' || this.form.acceptStatus === '已拒收') {
        if (this.form.approveResult === '通过') {
          this.form.acceptStatus = '已验收'
        } else if (this.form.approveResult === '不通过') {
          this.form.acceptStatus = '已拒收'
        }
      }
    },
    // 上次保养日期格式化
    lastMaintainDateFormat(row, col) {
      if (validIsNotNull(row.lastMaintainDate)) {
        return GMTToDate(row.lastMaintainDate)
      } else {
        return null
      }
    },
    // 上次保养日期格式化
    maintainPeriodFormat(row, col) {
      if (validIsNotNull(row.maintainPeriod) && validIsNotNull(row.maintainPeriodUnit)) {
        return row.maintainPeriod + row.maintainPeriodUnit
      } else {
        return null
      }
    },
    // 上次保养日期格式化
    maintainDueDateFormat(row, col) {
      if (validIsNotNull(row.maintainDueDate)) {
        return GMTToDate(row.maintainDueDate)
      } else {
        return null
      }
    },
    // 删除参与人员tag
    handleParticipantClose(tag) {
      this.form.participantTags.splice(this.form.participantTags.indexOf(tag), 1)
      this.form.acceptParticipant = this.form.participantTags.join(',')
    },
    // 参与人员相关
    showInputDepart() {
      this.inputParticipantVisible = true
      this.$nextTick(_ => {
        this.$refs.participantTagInput.$refs.input.focus()
      })
    },
    handleInputParticipantConfirm() {
      const inputValue = this.inputParticipantValue
      if (inputValue) {
        this.form.participantTags.push(inputValue)
      }
      this.form.acceptParticipant = this.form.participantTags.join(',')
      this.inputParticipantVisible = false
      this.inputParticipantValue = ''
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          /*this.$router.replace({
            path: '/redirect/equipment/acceptance'
          })*/
        })
        .catch(_ => {
        });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}

::v-deep .vue-treeselect__control, ::v-deep .vue-treeselect__placeholder, ::v-deep .vue-treeselect__single-value, .newTree-item {
  height: 29px;
  line-height: 29px !important;
  font-size: small;
}

::v-deep .new-part-tag {
  font-size: 13px;
  margin-right: 5px;
  padding: 5px;
  height: 29px;
}

::v-deep .el-tag--small {
  line-height: 18px !important;
}

::v-deep .el-radio {
  margin-right: 10px !important;
}
</style>
