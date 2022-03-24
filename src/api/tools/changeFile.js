import request from '@/utils/request'

export function delChangeFile(ids) {
  return request({
    url: 'api/changeFile',
    method: 'delete',
    data: ids
  })
}

export function getChangeFileByCond(data) {
  return request({
    url: 'api/changeFile/byCond',
    method: 'post',
    data
  })
}

export default { delChangeFile, getChangeFileByCond }
