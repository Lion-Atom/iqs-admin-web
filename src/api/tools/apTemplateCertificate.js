import request from '@/utils/request'

export function addTempCertificate(data) {
  return request({
    url: 'api/templateCertificate',
    method: 'post',
    data
  })
}

export function editTempCertificate(data) {
  return request({
    url: 'api/templateCertificate',
    method: 'put',
    data
  })
}

export function delTempCertificate(ids) {
  return request({
    url: 'api/templateCertificate',
    method: 'delete',
    data: ids
  })
}

export function getTempCertificateByTemplateId(id) {
  const params = {
    templateId: id
  }
  return request({
    url: 'api/templateCertificate/byTemplateId',
    method: 'get',
    params
  })
}

export default { addTempCertificate, editTempCertificate, delTempCertificate, getTempCertificateByTemplateId }
