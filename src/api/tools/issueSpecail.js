import request from '@/utils/request'

export function editSpecial(data) {
  return request({
    url: 'api/issueSpecial',
    method: 'put',
    data
  })
}

export function addSpecial(data) {
  return request({
    url: 'api/issueSpecial',
    method: 'post',
    data
  })
}

export function getSpecialByIssueId(id, type) {
  const params = {
    issueId: id,
    type: type
  }
  return request({
    url: 'api/issueSpecial/byIssueId',
    method: 'get',
    params
  })
}

export function delSpecialByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueSpecial/delByIssueId',
    method: 'get',
    params
  })
}

export default { addSpecial, editSpecial, getSpecialByIssueId, delSpecialByIssueId }
