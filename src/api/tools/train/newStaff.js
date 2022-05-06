import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/train/newStaff',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/train/newStaff',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/train/newStaff',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/train/newStaff',
    method: 'put',
    data
  })
}

export function getTrainNewStaffById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/train/newStaff/byId',
    method: 'get',
    params
  })
}

export default {get, add, edit, del, getTrainNewStaffById}
