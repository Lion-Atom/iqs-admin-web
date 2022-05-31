import request from '@/utils/request'


export function delCaliFileV2(ids) {
  return request({
    url: 'api/instruCaliFileV2',
    method: 'delete',
    data: ids
  })
}

export function getFilesByCaliIdV2(id) {
  const params = {
    caliId: id
  }
  return request({
    url: 'api/instruCaliFileV2/byCaliId',
    method: 'get',
    params
  })
}

export default { delCaliFileV2, getFilesByCaliIdV2 }
