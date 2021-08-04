import request from '@/utils/request'

export function addIssueNum(data) {
  return request({
    url: 'api/issueNum',
    method: 'post',
    data
  })
}

export function delIssueNum(ids) {
  return request({
    url: 'api/issueNum',
    method: 'delete',
    data: ids
  })
}

export function editIssueNum(data) {
  return request({
    url: 'api/issueNum',
    method: 'put',
    data
  })
}

export function getIssueNumByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueNum/byIssueId',
    method: 'get',
    params
  })
}

export default { addIssueNum, editIssueNum, delIssueNum, getIssueNumByIssueId }
