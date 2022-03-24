import request from '@/utils/request'

export function getAuditPlans(params) {
  return request({
    url: 'api/auditPlan',
    method: 'get',
    params
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

export function submitAuditPlan(id) {
  const params = {
    planId: id
  }
  return request({
    url: 'api/auditPlan/submit',
    method: 'get',
    params
  })
}

export function activatedByPlanId(id) {
  const params = {
    planId: id
  }
  return request({
    url: 'api/auditPlan/activate',
    method: 'get',
    params
  })
}

export function getAuditPlanByExample(data) {
  return request({
    url: 'api/auditPlan/byExample',
    method: 'post',
    data
  })
}

export function getAuditPlanByExampleV2(data) {
  return request({
    url: 'api/auditPlan/byExampleV2',
    method: 'post',
    data
  })
}

export function getCountByStatus() {
  const params = {}
  return request({
    url: 'api/auditPlan/byStatus',
    method: 'get',
    params
  })
}

export function getCountByAuditPlanYear() {
  const params = {}
  return request({
    url: '/api/auditPlan/getByYear',
    method: 'get',
    params
  })
}

export function getCountByAuditPlanMonth() {
  const params = {}
  return request({
    url: '/api/auditPlan/getByMonth',
    method: 'get',
    params
  })
}

export default { add, edit, del, getAuditPlans, getAuditPlanById, getAuditPlanByExample,getAuditPlanByExampleV2,
  activatedByPlanId, submitAuditPlan, getCountByStatus,getCountByAuditPlanYear,getCountByAuditPlanMonth }
