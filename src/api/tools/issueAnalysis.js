import request from '@/utils/request'

export function editAnalysis(data) {
  return request({
    url: 'api/issueAnalysis',
    method: 'put',
    data
  })
}

export function getAnalysisByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueAnalysis/byIssueId',
    method: 'get',
    params
  })
}

export default { editAnalysis, getAnalysisByIssueId }
