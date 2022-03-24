import request from '@/utils/request'

export function addPlanReport(data) {
  return request({
    url: 'api/auditPlanReport',
    method: 'post',
    data
  })
}

export function editPlanReport(data) {
  return request({
    url: 'api/auditPlanReport',
    method: 'put',
    data
  })
}

export function getPlanReportByPlanId(id) {
  const params = {
    planId: id
  }
  return request({
    url: 'api/auditPlanReport/byPlanId',
    method: 'get',
    params
  })
}

export function downloadReport(id) {
  const params = {
    reportId: id
  }
  return request({
    url: 'api/auditPlanReport/exportByPlanId',
    method: 'get',
    params
  })
}

export default { addPlanReport,editPlanReport,getPlanReportByPlanId,downloadReport }
