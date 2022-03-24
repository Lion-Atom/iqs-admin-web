import request from '@/utils/request'

export function getMembersByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/teamMember/byIssueId',
    method: 'get',
    params
  })
}

export function addMember(data) {
  return request({
    url: 'api/teamMember',
    method: 'post',
    data
  })
}

export function delMember(ids) {
  return request({
    url: 'api/teamMember',
    method: 'delete',
    data: ids
  })
}

export function editMember(data) {
  return request({
    url: 'api/teamMember',
    method: 'put',
    data
  })
}

export default { getMembersByIssueId, addMember, delMember, editMember }
