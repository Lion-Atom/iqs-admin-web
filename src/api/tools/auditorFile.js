import request from '@/utils/request'


export function delAuditorFile(ids) {
  return request({
    url: 'api/auditorFile',
    method: 'delete',
    data: ids
  })
}

export function getAuditorFileByIssueId(id) {
  const params = {
    auditorId: id
  }
  return request({
    url: 'api/auditorFile/byAuditorId',
    method: 'get',
    params
  })
}

export default { delAuditorFile, getAuditorFileByIssueId }
