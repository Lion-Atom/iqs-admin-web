import request from '@/utils/request'

export function getAuditPlans(params) {
  return request({
    url: 'api/auditPlan',
    method: 'get',
    params
  })
}

export function getAuditPlanSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/auditPlan/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/auditPlan',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/auditPlan',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/auditPlan',
    method: 'put',
    data
  })
}

export function getAuditPlanById(id) {
  const params = {
    planId: id
  }
  return request({
    url: 'api/auditPlan/byId',
    method: 'get',
    params
  })
}

export default { add, edit, del, getAuditPlans, getAuditPlanSuperior, getAuditPlanById }
