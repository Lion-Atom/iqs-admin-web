import request from '@/utils/request'

export function getIssueCause(params) {
  return request({
    url: 'api/issueCause',
    method: 'get',
    params
  })
}

export function getCauseByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueCause/byIssueId',
    method: 'get',
    params
  })
}

export function getIssueCauseSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/issueCause/superior',
    method: 'post',
    data
  })
}

export function addCause(data) {
  return request({
    url: 'api/issueCause',
    method: 'post',
    data
  })
}

export function delCause(ids) {
  return request({
    url: 'api/issueCause',
    method: 'delete',
    data: ids
  })
}

export function editCause(data) {
  return request({
    url: 'api/issueCause',
    method: 'put',
    data
  })
}

export function getIssueCauseByExample(data) {
  return request({
    url: 'api/issueCause/byExample',
    method: 'post',
    data
  })
}

export default {
  addCause,
  editCause,
  delCause,
  getCauseByIssueId,
  getIssueCause,
  getIssueCauseSuperior,
  getIssueCauseByExample
}
