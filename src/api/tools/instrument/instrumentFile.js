import request from '@/utils/request'


export function delInstruFile(ids) {
  return request({
    url: 'api/instruFile',
    method: 'delete',
    data: ids
  })
}

export function getFileByInstruId(id) {
  const params = {
    instruId: id
  }
  return request({
    url: 'api/instruFile/byInstruId',
    method: 'get',
    params
  })
}

export default { delInstruFile, getFileByInstruId }
