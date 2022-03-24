import request from '@/utils/request'

export function delSupplierFile(ids) {
  return request({
    url: 'api/supplierFile',
    method: 'delete',
    data: ids
  })
}

export function getSupplierFileByCond(data) {
  return request({
    url: 'api/supplierFile/byCond',
    method: 'post',
    data
  })
}

export function supplierFileReplace(data) {
  return request({
    url: 'api/supplierFile/replace',
    method: 'post',
    data
  })
}

export default { delSupplierFile, getSupplierFileByCond }
