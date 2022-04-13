import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/equipMaintenance',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/equipMaintenance',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/equipMaintenance',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/equipMaintenance',
    method: 'put',
    data
  })
}

export function getMaintenanceByEquipId(id) {
  const params = {
    equipId: id
  }
  return request({
    url: 'api/equipMaintenance/byEquipId',
    method: 'get',
    params
  })
}

export function getMaintenanceById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/equipMaintenance/byId',
    method: 'get',
    params
  })
}


export default { get, add, edit, del, getMaintenanceByEquipId, getMaintenanceById }
