import request from '@/utils/request'


export function delRepairFile(ids) {
  return request({
    url: 'api/repairFile',
    method: 'delete',
    data: ids
  })
}

export function getFilesByRepairId(id) {
  const params = {
    repairId: id
  }
  return request({
    url: 'api/repairFile/byRepairId',
    method: 'get',
    params
  })
}
/*
export function delByCaliOrgIdAndName(id,name) {
  const params = {
    caliOrgId: id,
    realName: name
  }
  return request({
    url: 'api/caliOrgFile/delByCaliOrgIdAndName',
    method: 'get',
    params
  })
}
*/


export default { delRepairFile, getFilesByRepairId }
