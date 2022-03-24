import request from '@/utils/request'

export function addChangeApprove(data) {
  return request({
    url: 'api/changeApprove',
    method: 'post',
    data
  })
}

export function delChangeApprove(ids) {
  return request({
    url: 'api/changeApprove',
    method: 'delete',
    data: ids
  })
}

export function editChangeApprove(data) {
  return request({
    url: 'api/changeApprove',
    method: 'put',
    data
  })
}

export function getApproveByChangeId(id) {
  const params = {
    changeId: id
  }
  return request({
    url: 'api/changeApprove/byChangeId',
    method: 'get',
    params
  })
}

export default {addChangeApprove, delChangeApprove, editChangeApprove, getApproveByChangeId}
