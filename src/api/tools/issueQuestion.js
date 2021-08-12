import request from '@/utils/request'

export function editQuestion(data) {
  return request({
    url: 'api/issueQuestion',
    method: 'put',
    data
  })
}

export function getQuestionByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueQuestion/byIssueId',
    method: 'get',
    params
  })
}

export default { editQuestion, getQuestionByIssueId }
