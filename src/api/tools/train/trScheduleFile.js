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

export function getFilesByTrScheduleIdAndType(id, type) {
  const params = {
    trScheduleId: id,
    fileType: type
  }
  return request({
    url: 'api/trScheduleFile/byTrScheduleIdAndType',
    method: 'get',
    params
  })
}

export function syncScheduleFile(data) {
  return request({
    url: 'api/trScheduleFile/sync',
    method: 'post',
    data
  })
}

export default {delTrScheduleFile, getFilesByTrScheduleId,getFilesByTrScheduleIdAndType, syncScheduleFile}
