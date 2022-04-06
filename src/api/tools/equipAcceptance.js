import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/equipAcceptance',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/equipAcceptance',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/equipAcceptance',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/equipAcceptance',
    method: 'put',
    data
  })
}

export function getAcceptanceByEquipId(id) {
  const params = {
    equipId: id
  }
  return request({
    url: 'api/equipAcceptance/byEquipId',
    method: 'get',
    params
  })
}

export function getAcceptanceById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/equipAcceptance/byId',
    method: 'get',
    params
  })
}


export default { get, add, edit, del, getAcceptanceByEquipId, getAcceptanceById }
