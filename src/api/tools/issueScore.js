import request from '@/utils/request'

export function editIssueScores(data) {
  return request({
    url: 'api/issueScore',
    method: 'put',
    data
  })
}

export function getScoresByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueScore/byIssueId',
    method: 'get',
    params
  })
}

export default { editIssueScores, getScoresByIssueId }
