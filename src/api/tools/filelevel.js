import request from '@/utils/request'

export function getFileLevels(params) {
  return request({
    url: 'api/fileLevel',
    method: 'get',
    params
  })
}

export function getFileLevelSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/fileLevel/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/fileLevel',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/fileLevel',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/fileLevel',
    method: 'put',
    data
  })
}

export default { add, edit, del, getFileLevels, getFileLevelSuperior }
