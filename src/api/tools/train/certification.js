import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/train/certification',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/train/certification',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/train/certification',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/train/certification',
    method: 'put',
    data
  })
}

export function getTrainCertificationById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/train/certification/byId',
    method: 'get',
    params
  })
}

export default {get, add, edit, del, getTrainCertificationById}
