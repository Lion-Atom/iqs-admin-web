import request from '@/utils/request'

export function addPart(data) {
  return request({
    url: 'api/trParticipant',
    method: 'post',
    data
  })
}

export function delPart(ids) {
  return request({
    url: 'api/trParticipant',
    method: 'delete',
    data: ids
  })
}

export function editPart(data) {
  return request({
    url: 'api/trParticipant',
    method: 'put',
    data
  })
}

export function getPartsByTrScheduleId(id) {
  const params = {
    trScheduleId: id
  }
  return request({
    url: 'api/trParticipant/byTrScheduleId',
    method: 'get',
    params
  })
}

export default { addPart, editPart, delPart, getPartsByTrScheduleId }
