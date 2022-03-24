import request from '@/utils/request'

export function addExecute(data) {
  return request({
    url: 'api/auditPlanExecute',
    method: 'post',
    data
  })
}

export function getPlanExecuteByPlanId(id) {
  const params = {
    planId: id
  }
  return request({
    url: 'api/auditPlanExecute/byPlanId',
    method: 'get',
    params
  })
}

export default { addExecute,getPlanExecuteByPlanId }
