import request from '@/utils/request'

export function editTemplateScores(data) {
  return request({
    url: 'api/templateScore',
    method: 'put',
    data
  })
}

export function getTemplateScoreByCond(data) {
  return request({
    url: 'api/templateScore/byCond',
    method: 'post',
    data
  })
}

export default { editTemplateScores, getTemplateScoreByCond }
