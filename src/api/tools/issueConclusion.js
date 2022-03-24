import request from '@/utils/request'

export function editConclusion(data) {
  return request({
    url: 'api/issueConclusion',
    method: 'put',
    data
  })
}

export function getConclusionByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueConclusion/byIssueId',
    method: 'get',
    params
  })
}

export default { editConclusion, getConclusionByIssueId }
