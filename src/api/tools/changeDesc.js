import request from '@/utils/request'

export function editChangeDesc(data) {
  return request({
    url: 'api/changeDesc',
    method: 'put',
    data
  })
}

export function getChangeDescByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/changeDesc/byIssueId',
    method: 'get',
    params
  })
}

export default { editChangeDesc, getChangeDescByIssueId }
