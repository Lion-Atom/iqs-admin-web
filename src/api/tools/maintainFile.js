import request from '@/utils/request'


export function delMaintainFile(ids) {
  return request({
    url: 'api/maintainFile',
    method: 'delete',
    data: ids
  })
}

export function getFilesByMaintainId(id) {
  const params = {
    maintainId: id
  }
  return request({
    url: 'api/maintainFile/byMaintainId',
    method: 'get',
    params
  })
}

export default { delMaintainFile, getFilesByMaintainId }
