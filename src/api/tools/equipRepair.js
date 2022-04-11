import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/equipRepair',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/equipRepair',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/equipRepair',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/equipRepair',
    method: 'put',
    data
  })
}

export function getRepairByEquipId(id) {
  const params = {
    equipId: id
  }
  return request({
    url: 'api/equipRepair/byEquipId',
    method: 'get',
    params
  })
}

export function getRepairById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/equipRepair/byId',
    method: 'get',
    params
  })
}

export function initRepairNum() {
  const params = {}
  return request({
    url: 'api/equipRepair/initRepairNum',
    method: 'get',
    params
  })
}

export default { get, add, edit, del, getRepairByEquipId, getRepairById, initRepairNum }
