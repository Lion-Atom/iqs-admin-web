import request from '@/utils/request'

export function delAnuAssess(ids) {
  return request({
    url: 'api/supplierAnuAssessment',
    method: 'delete',
    data: ids
  })
}

export function addAnuAssess(data) {
  return request({
    url: 'api/supplierAnuAssessment',
    method: 'post',
    data
  })
}


export function editAnuAssess(data) {
  return request({
    url: 'api/supplierAnuAssessment',
    method: 'put',
    data
  })
}

export function getAnuAssessBySupplierId(id) {
  const params = {
    supplierId: id
  }
  return request({
    url: 'api/supplierAnuAssessment/bySupplierId',
    method: 'get',
    params
  })
}

export function supplierAnuAssessmentReplace(data) {
  return request({
    url: 'api/supplierAnuAssessment/replace',
    method: 'post',
    data
  })
}

export default {delAnuAssess, addAnuAssess, editAnuAssess, getAnuAssessBySupplierId, supplierAnuAssessmentReplace}
