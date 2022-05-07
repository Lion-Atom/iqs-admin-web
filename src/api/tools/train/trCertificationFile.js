import request from '@/utils/request'


export function delTrCertificationFile(ids) {
  return request({
    url: 'api/trCertificationFile',
    method: 'delete',
    data: ids
  })
}

export function getFilesByTrCertificationId(id) {
  const params = {
    trCertificationId: id
  }
  return request({
    url: 'api/trCertificationFile/byTrCertificationId',
    method: 'get',
    params
  })
}

export default { delTrCertificationFile, getFilesByTrCertificationId }
