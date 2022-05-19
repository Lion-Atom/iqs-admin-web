import request from '@/utils/request'


export function delTrScheduleFile(ids) {
  return request({
    url: 'api/trScheduleFile',
    method: 'delete',
    data: ids
  })
}

export function getFilesByTrScheduleId(id) {
  const params = {
    trScheduleId: id
  }
  return request({
    url: 'api/trScheduleFile/byTrScheduleId',
    method: 'get',
    params
  })
}

export default { delTrScheduleFile, getFilesByTrScheduleId }
