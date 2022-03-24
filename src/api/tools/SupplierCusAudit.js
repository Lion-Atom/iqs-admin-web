import request from '@/utils/request'

export function delCusAudit(ids) {
  return request({
    url: 'api/supplierCusAudit',
    method: 'delete',
    data: ids
  })
}

export function addCusAudit(data) {
  return request({
    url: 'api/supplierCusAudit',
    method: 'post',
    data
  })
}


export function editCusAudit(data) {
  return request({
    url: 'api/supplierCusAudit',
    method: 'put',
    data
  })
}

export function getCusAuditBySupplierId(id) {
  const params = {
    supplierId: id
  }
  return request({
    url: 'api/supplierCusAudit/bySupplierId',
    method: 'get',
    params
  })
}

export function supplierCusAuditReplace(data) {
  return request({
    url: 'api/supplierCusAudit/replace',
    method: 'post',
    data
  })
}

export default {delCusAudit, addCusAudit, editCusAudit, getCusAuditBySupplierId, supplierCusAuditReplace}
