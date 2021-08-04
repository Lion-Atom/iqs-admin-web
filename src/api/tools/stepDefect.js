import request from '@/utils/request'

export function editStepDefect(data) {
  return request({
    url: 'api/stepDefect',
    method: 'put',
    data
  })
}

export function getStepDefectByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/stepDefect/byIssueId',
    method: 'get',
    params
  })
}

export default { editStepDefect, getStepDefectByIssueId }
