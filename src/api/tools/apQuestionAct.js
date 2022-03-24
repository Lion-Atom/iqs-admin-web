import request from '@/utils/request'

export function editQuesAction(data) {
  return request({
    url: 'api/apQuesAction',
    method: 'put',
    data
  })
}

export function addQuesAction(data) {
  return request({
    url: 'api/apQuesAction',
    method: 'post',
    data
  })
}

export function delQuesAction(data) {
  return request({
    url: 'api/apQuesAction',
    method: 'delete',
    data
  })
}
export function getQuesActionByCond(planId, quesId) {
  const params = {
    planId: planId,
    quesId: quesId
  }
  return request({
    url: 'api/apQuesAction/byCond',
    method: 'get',
    params
  })
}

export default { editQuesAction, addQuesAction, delQuesAction, getQuesActionByCond }
