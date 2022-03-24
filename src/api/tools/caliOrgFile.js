import request from '@/utils/request'


export function delCaliOrgFile(ids) {
  return request({
    url: 'api/caliOrgFile',
    method: 'delete',
    data: ids
  })
}

export function getCaliOrgFileByCaliOrgId(id) {
  const params = {
    caliOrgId: id
  }
  return request({
    url: 'api/caliOrgFile/byCaliOrgId',
    method: 'get',
    params
  })
}
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


export default { delCaliOrgFile, getCaliOrgFileByCaliOrgId }
