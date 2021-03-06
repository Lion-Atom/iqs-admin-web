import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/issue',
    method: 'get',
    params
  })
}

export function editIssueAction(data) {
  return request({
    url: 'api/issueAction',
    method: 'put',
    data
  })
}

export function addIssueAction(data) {
  return request({
    url: 'api/issueAction',
    method: 'post',
    data
  })
}

export function delIssueAction(data) {
  return request({
    url: 'api/issueAction',
    method: 'delete',
    data
  })
}

export function getIssueActionByExample(data) {
  return request({
    url: 'api/issueAction/byExample',
    method: 'post',
    data
  })
}

export function getIssueActionById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/issueAction/byId',
    method: 'get',
    params
  })
}

export function getCanRemoveActionByIssueId(id) {
  const params = {
    issueId: id
  }
  return request({
    url: 'api/issueAction/getCanRemove',
    method: 'get',
    params
  })
}

export function getUserAction() {
  const params = {}
  return request({
    url: 'api/issueAction/getUserAction',
    method: 'get',
    params
  })
}

export default {
  get,
  editIssueAction,
  addIssueAction,
  delIssueAction,
  getIssueActionByExample,
  getIssueActionById,
  getCanRemoveActionByIssueId,
  getUserAction
}
