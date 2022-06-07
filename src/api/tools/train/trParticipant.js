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

export function batchSavePart(data) {
  return request({
    url: 'api/trParticipant/batchSave',
    method: 'post',
    data
  })
}

export function getTrParticipantByExample(data) {
  return request({
    url: 'api/trParticipant/byExample',
    method: 'post',
    data
  })
}

export default { addPart, editPart, delPart, getPartsByTrScheduleId, batchSavePart, getTrParticipantByExample }
