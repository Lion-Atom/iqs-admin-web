import request from '@/utils/request'

export function delTempCerFile(ids) {
  return request({
    url: 'api/tempCerFile',
    method: 'delete',
    data: ids
  })
}

export function getTempCerFileByCerId(cerId) {
  const params = {
    cerId: cerId
  }
  return request({
    url: 'api/tempCerFile/byCerId',
    method: 'get',
    params
  })
}

export default { delTempCerFile, getTempCerFileByCerId }
