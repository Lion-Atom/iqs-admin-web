import request from '@/utils/request'

export function getAllSchedule() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/train/schedule',
    method: 'get',
    params
  })
}

export function get(params) {
  return request({
    url: 'api/train/schedule',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/train/schedule',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/train/schedule',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/train/schedule',
    method: 'put',
    data
  })
}

export function getTrainScheduleById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/train/schedule/byId',
    method: 'get',
    params
  })
}

export default {getAllSchedule,get, add, edit, del, getTrainScheduleById}
