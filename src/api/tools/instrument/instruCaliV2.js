import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/instruCalibrationV2',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/instruCalibrationV2',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/instruCalibrationV2',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/instruCalibrationV2',
    method: 'put',
    data
  })
}

export function getCalibrationByInstruId(id) {
  const params = {
    instruId: id
  }
  return request({
    url: 'api/instruCalibrationV2/byInstruId',
    method: 'get',
    params
  })
}

export function getCalibrationById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/instruCalibrationV2/byId',
    method: 'get',
    params
  })
}


export default { get, add, edit, del, getCalibrationByInstruId, getCalibrationById }
