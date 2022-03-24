import request from '@/utils/request'

export function editPlanTemplate(data) {
  return request({
    url: 'api/auditPlanTemplate',
    method: 'put',
    data
  })
}

export function getPlanTemplateByPlanId(id) {
  const params = {
    planId: id
  }
  return request({
    url: 'api/auditPlanTemplate/byPlanId',
    method: 'get',
    params
  })
}

export function getPlanTemplateByType(type) {
  const params = {
    templateType: type
  }
  return request({
    url: 'api/auditPlanTemplate/byTemplateType',
    method: 'get',
    params
  })
}

export function editPlanTempContent(data) {
  return request({
    url: 'api/auditPlanTemplate/content',
    method: 'put',
    data
  })
}

export default { editPlanTemplate, getPlanTemplateByPlanId, getPlanTemplateByType, editPlanTempContent }
