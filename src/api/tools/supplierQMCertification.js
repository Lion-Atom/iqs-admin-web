import request from '@/utils/request'

export function addQMCer(data) {
  return request({
    url: 'api/SupplierQMCertification',
    method: 'post',
    data
  })
}

export function delQMCer(ids) {
  return request({
    url: 'api/SupplierQMCertification',
    method: 'delete',
    data: ids
  })
}

export function editQMCer(data) {
  return request({
    url: 'api/SupplierQMCertification',
    method: 'put',
    data
  })
}

export function getQMCerBySupplierId(id) {
  const params = {
    supplierId: id
  }
  return request({
    url: 'api/SupplierQMCertification/bySupplierId',
    method: 'get',
    params
  })
}

export function initCerByUid(id) {
  const params = {
    uId: id
  }
  return request({
    url: 'api/SupplierQMCertification/init/byUid',
    method: 'get',
    params
  })
}

export function supplierQMCerReplace(data) {
  return request({
    url: 'api/SupplierQMCertification/replace',
    method: 'post',
    data
  })
}

export default { addQMCer, delQMCer, editQMCer, getQMCerBySupplierId, initCerByUid,supplierQMCerReplace }
