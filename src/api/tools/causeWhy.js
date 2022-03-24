import request from '@/utils/request'

export function getWhysByCauseId(id) {
  const params = {
    causeId: id
  }
  return request({
    url: 'api/why/byCauseId',
    method: 'get',
    params
  })
}

export function getWhysByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/why/byIssueId',
    method: 'get',
    params
  })
}

export function addWhys(data) {
  return request({
    url: 'api/why',
    method: 'post',
    data
  })
}

export function editWhys(data) {
  return request({
    url: 'api/why',
    method: 'put',
    data
  })
}

export default { getWhysByCauseId, getWhysByIssueId, addWhys, editWhys }
