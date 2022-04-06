import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/equipment',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/equipment',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/equipment',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/equipment',
    method: 'put',
    data
  })
}

export function getEquipmentById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/equipment/byId',
    method: 'get',
    params
  })
}

export function getEquipmentByExample(data) {
  return request({
    url: 'api/equipment/queryByExample',
    method: 'post',
    data
  })
}

export default { get, add, edit, del, getEquipmentById, getEquipmentByExample }
