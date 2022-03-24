import request from '@/utils/request'

export function addQMMethod(data) {
  return request({
    url: 'api/SupplierQMMethod',
    method: 'post',
    data
  })
}

export function delQMMethod(ids) {
  return request({
    url: 'api/SupplierQMMethod',
    method: 'delete',
    data: ids
  })
}

export function editQMMethod(data) {
  return request({
    url: 'api/SupplierQMMethod',
    method: 'put',
    data
  })
}

export function getQMMethodBySupplierId(id) {
  const params = {
    supplierId: id
  }
  return request({
    url: 'api/SupplierQMMethod/bySupplierId',
    method: 'get',
    params
  })
}

export function supplierQMMethodReplace(data) {
  return request({
    url: 'api/SupplierQMMethod/replace',
    method: 'post',
    data
  })
}

export default { addQMMethod, delQMMethod, editQMMethod, getQMMethodBySupplierId,supplierQMMethodReplace }
