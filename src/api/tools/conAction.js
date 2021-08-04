import request from '@/utils/request'

export function editConAction(data) {
  return request({
    url: 'api/conAction',
    method: 'put',
    data
  })
}

export function clearConAction(data) {
  return request({
    url: 'api/conAction/clear',
    method: 'put',
    data
  })
}

export function getConActionByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/conAction/byIssueId',
    method: 'get',
    params
  })
}

export default { editConAction, clearConAction, getConActionByIssueId }
