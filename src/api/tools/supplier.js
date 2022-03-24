import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/supplier',
    method: 'get',
    params
  })
}

export function addSupplier(data) {
  return request({
    url: 'api/supplier',
    method: 'post',
    data
  })
}

export function getUid() {
  const params = {}
  return request({
    url: 'api/supplier/getUid',
    method: 'get',
    params
  })
}

export function del(ids) {
  return request({
    url: 'api/supplier',
    method: 'delete',
    data: ids
  })
}

export function editSupplier(data) {
  return request({
    url: 'api/supplier',
    method: 'put',
    data
  })
}

export function getSupplierById(id) {
  const params = {
    supplierId: id
  }
  return request({
    url: 'api/supplier/byId',
    method: 'get',
    params
  })
}

export default { get, addSupplier, editSupplier, del, getSupplierById }
