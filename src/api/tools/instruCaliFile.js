import request from '@/utils/request'


export function delCaliFile(ids) {
  return request({
    url: 'api/instruCaliFile',
    method: 'delete',
    data: ids
  })
}

export function getCaliFileByExample(data) {
  return request({
    url: 'api/instruCaliFile/getByExample',
    method: 'post',
    data
  })
}

export default { delCaliFile, getCaliFileByExample }
