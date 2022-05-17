import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/train/examStaff',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/train/examStaff',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/train/examStaff',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/train/examStaff',
    method: 'put',
    data
  })
}

export function getTrainExamStaffById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/train/examStaff/byId',
    method: 'get',
    params
  })
}

export default {get, add, edit, del, getTrainExamStaffById}
