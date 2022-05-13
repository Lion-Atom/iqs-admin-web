const getters = {
  deployUploadApi: state => state.api.deployUploadApi,
  databaseUploadApi: state => state.api.databaseUploadApi,
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  socketApi: state => state.api.socketApi,
  imagesUploadApi: state => state.api.imagesUploadApi,
  appendixUploadApi: state => state.api.appendixUploadApi,
  auditorUploadApi: state => state.api.auditorUploadApi,
  auditPlanUploadApi: state => state.api.auditPlanUploadApi,
  apQuestionUploadApi: state => state.api.apQuestionUploadApi,
  tempCerUploadApi: state => state.api.tempCerUploadApi,
  tempScoreUploadApi: state => state.api.tempScoreUploadApi,
  supplierUploadApi: state => state.api.supplierUploadApi,
  changeUploadApi: state => state.api.changeUploadApi,
  baseApi: state => state.api.baseApi,
  fileUploadApi: state => state.api.fileUploadApi,
  fileCoverUploadApi: state => state.api.fileCoverUploadApi,
  caliOrgFileUploadApi: state => state.api.caliOrgFileUploadApi,
  instruCaliFileUploadApi: state => state.api.instruCaliFileUploadApi,
  repairFileUploadApi: state => state.api.repairFileUploadApi,
  maintainFileUploadApi: state => state.api.maintainFileUploadApi,
  gridFileUploadApi: state => state.api.gridFileUploadApi,
  trNewStaffFileUploadApi: state => state.api.trNewStaffFileUploadApi,
  trCertificationFileUploadApi: state => state.api.trCertificationFileUploadApi,
  trExamDepartFileUploadApi: state => state.api.trExamDepartFileUploadApi,
  trainMaterialFileUploadApi: state => state.api.trainMaterialFileUploadApi,
  updateAvatarApi: state => state.api.updateAvatarApi,
  updateContactAvatarApi: state => state.api.updateContactAvatarApi,
  qiNiuUploadApi: state => state.api.qiNiuUploadApi,
  sqlApi: state => state.api.sqlApi,
  swaggerApi: state => state.api.swaggerApi,
  sidebarRouters: state => state.permission.sidebarRouters
}
export default getters
