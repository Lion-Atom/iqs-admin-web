import request from '@/utils/request'

export function addChangeManagement(data) {
  return request({
    url: 'api/changeManagement',
    method: 'post',
    data
  })
}

export function delChangeManagement(ids) {
  return request({
    url: 'api/changeManagement',
    method: 'delete',
    data: ids
  })
}

export function editChangeManagement(data) {
  return request({
    url: 'api/changeManagement',
    method: 'put',
    data
  })
}

export function getManageByChangeId(id) {
  const params = {
    changeId: id
  }
  return request({
    url: 'api/changeManagement/byChangeId',
    method: 'get',
    params
  })
}

export default {addChangeManagement, delChangeManagement, editChangeManagement, getManageByChangeId}
