import request from '@/utils/request'

export function getGridFileByExample(data) {
  return request({
    url: 'api/gridFile/getByExample',
    method: 'post',
    data
  })
}

export function delGridFile(ids) {
  return request({
    url: 'api/gridFile',
    method: 'delete',
    data: ids
  })
}

export default { getGridFileByExample, delGridFile }
