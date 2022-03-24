import request from '@/utils/request'

export function addTimeManage(data) {
  return request({
    url: 'api/timeManagement',
    method: 'post',
    data
  })
}

export function delTimeManage(ids) {
  return request({
    url: 'api/timeManagement',
    method: 'delete',
    data: ids
  })
}

export function editTimeManage(data) {
  return request({
    url: 'api/timeManagement',
    method: 'put',
    data
  })
}

export function getByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/timeManagement/byIssueId',
    method: 'get',
    params
  })
}

export default { getByIssueId, addTimeManage, editTimeManage, delTimeManage }
