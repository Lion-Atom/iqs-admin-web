import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/supplierContact',
    method: 'get',
    params
  })
}

export function addContact(data) {
  return request({
    url: 'api/supplierContact',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/supplierContact',
    method: 'delete',
    data: ids
  })
}

export function editContact(data) {
  return request({
    url: 'api/supplierContact',
    method: 'put',
    data
  })
}

export function getContactById(id) {
  const params = {
    contactId: id
  }
  return request({
    url: 'api/supplierContact/byId',
    method: 'get',
    params
  })
}

export function getContactBySupplierId(id) {
  const params = {
    supplierId: id
  }
  return request({
    url: 'api/supplierContact/bySupplierId',
    method: 'get',
    params
  })
}

export default { get, addContact, del, editContact, getContactById, getContactBySupplierId }
