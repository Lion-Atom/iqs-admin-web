// 适配 Nginx 反向代理
const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 部署包上传
    deployUploadApi: baseUrl + '/api/deploy/upload',
    // SQL脚本上传
    databaseUploadApi: baseUrl + '/api/database/upload',
    // 实时控制台
    socketApi: baseUrl + '/websocket?token=kl',
    // 图片上传
    imagesUploadApi: baseUrl + '/api/localStorage/pictures',
    // 8D附件上传
    appendixUploadApi: baseUrl + '/api/issueFile',
    // 审核人员附件上传
    auditorUploadApi: baseUrl + '/api/auditorFile',
    // 审核计划附件上传
    auditPlanUploadApi: baseUrl + '/api/auditPlanFile',
    // 审核报告下问题点附件上传
    apQuestionUploadApi: baseUrl + '/api/apQuestionFile',
    // VDA6.3模板下认证信息附件上传
    tempCerUploadApi: baseUrl + '/api/tempCerFile',
    // VDA6.3模板下认证信息附件上传
    tempScoreUploadApi: baseUrl + '/api/tempScoreFile',
    // 供应商下附件上传
    supplierUploadApi: baseUrl + '/api/supplierFile',
    // 变更模块下附件上传
    changeUploadApi: baseUrl + '/api/changeFile',
    // 修改头像
    updateAvatarApi: baseUrl + '/api/users/updateAvatar',
    // 修改头像
    updateContactAvatarApi: baseUrl + '/api/users/supplierContact',
    // 上传文件到七牛云
    qiNiuUploadApi: baseUrl + '/api/qiNiuContent',
    // Sql 监控
    sqlApi: baseUrl + '/druid/index.html',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html',
    // 文件上传
    fileUploadApi: baseUrl + '/api/localStorage',
    // 仪器校验机构附件上传
    caliOrgFileUploadApi: baseUrl + '/api/caliOrgFile',
    // 仪器校验报告上传
    instruCaliFileUploadApi: baseUrl + '/api/instruCaliFile',
    // 设备维修确认单上传
    repairFileUploadApi: baseUrl + '/api/repairFile',
    // 设备维修确认单上传
    maintainFileUploadApi: baseUrl + '/api/maintainFile',
    // 台账附件上传
    gridFileUploadApi: baseUrl + '/api/gridFile',
    // 新员工培训附件上传
    trNewStaffFileUploadApi: baseUrl + '/api/trNewStaffFile',
    // 培训-认证附件上传
    trCertificationFileUploadApi: baseUrl + '/api/trCertificationFile',
    // 培训考试题库上传
    trExamDepartFileUploadApi: baseUrl + '/api/trExamDepartFile',
    // 培训材料上传
    trainMaterialFileUploadApi: baseUrl + '/api/trainMaterialFile',
    // 培训材料覆盖上传
    trainMaterialFileCoverApi: baseUrl + '/api/trainMaterialFile/updateFile',
    // 文件覆盖上传
    // fileCoverUploadApi: baseUrl + '/api/localStorage/cover',
    // 文件覆盖上传
    fileCoverUploadApi: baseUrl + '/api/localStorage/upload/preTrailV2',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api
