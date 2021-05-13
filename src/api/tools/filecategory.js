import request from '@/utils/request'

export function getFileCategories(params) {
  return request({
    url: 'api/fileCategory',
    method: 'get',
    params
  })
}

export function getFileCategorySuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/fileCategory/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/fileCategory',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/fileCategory',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/fileCategory',
    method: 'put',
    data
  })
}

export default { add, edit, del, getFileCategories, getFileCategorySuperior }
