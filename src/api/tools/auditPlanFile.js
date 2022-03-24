import request from '@/utils/request'

export function delAuditPlanFile(ids) {
  return request({
    url: 'api/auditPlanFile',
    method: 'delete',
    data: ids
  })
}

export function getAuditPlanFileByCond(planId, templateId) {
  const params = {
    planId: planId,
    templateId: templateId
  }
  return request({
    url: 'api/auditPlanFile/byCond',
    method: 'get',
    params
  })
}

export default { delAuditPlanFile, getAuditPlanFileByCond }
