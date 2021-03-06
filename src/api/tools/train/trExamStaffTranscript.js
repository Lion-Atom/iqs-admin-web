import request from '@/utils/request'


export function delTrExamStaffTranscript(id) {
  return request({
    url: 'api/trExamStaffTranscript',
    method: 'delete',
    data: id
  })
}

export function getTranscriptByTrExamStaffId(id) {
  const params = {
    trExamStaffId: id
  }
  return request({
    url: 'api/trExamStaffTranscript/byTrExamStaffId',
    method: 'get',
    params
  })
}

export default { delTrExamStaffTranscript, getTranscriptByTrExamStaffId }
