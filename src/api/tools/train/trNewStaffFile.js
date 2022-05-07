import request from '@/utils/request'


export function delTrNewStaffFile(ids) {
  return request({
    url: 'api/trNewStaffFile',
    method: 'delete',
    data: ids
  })
}

export function getFilesByTrNewStaffId(id) {
  const params = {
    trNewStaffId: id
  }
  return request({
    url: 'api/trNewStaffFile/byTrNewStaffId',
    method: 'get',
    params
  })
}

export default { delTrNewStaffFile, getFilesByTrNewStaffId }
