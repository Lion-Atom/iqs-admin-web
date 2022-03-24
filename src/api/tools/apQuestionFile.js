import request from '@/utils/request'

export function delApQuestionFile(ids) {
  return request({
    url: 'api/apQuestionFile',
    method: 'delete',
    data: ids
  })
}

export function getApQuestionFileByCond(quesId, actId) {
  const params = {
    quesId: quesId,
    actId: actId
  }
  return request({
    url: 'api/apQuestionFile/byCond',
    method: 'get',
    params
  })
}

export default { delApQuestionFile, getApQuestionFileByCond }
