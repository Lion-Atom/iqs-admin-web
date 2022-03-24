import request from '@/utils/request'

export function delTempScoreFile(ids) {
  return request({
    url: 'api/tempScoreFile',
    method: 'delete',
    data: ids
  })
}

export function getTempScoreFileByScoreId(scoreId) {
  const params = {
    scoreId: scoreId
  }
  return request({
    url: 'api/tempScoreFile/byScoreId',
    method: 'get',
    params
  })
}

export default { delTempScoreFile, getTempScoreFileByScoreId }
