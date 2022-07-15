import request from '@/utils/request'


export function delCsFeedbackFile(ids) {
  return request({
    url: 'api/csFeedbackFile',
    method: 'delete',
    data: ids
  })
}

export function getFilesByCsFeedbackId(id) {
  const params = {
    csFeedbackId: id
  }
  return request({
    url: 'api/csFeedbackFile/byCsFeedbackId',
    method: 'get',
    params
  })
}

export default { delCsFeedbackFile, getFilesByCsFeedbackId }
