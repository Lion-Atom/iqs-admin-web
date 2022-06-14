import request from '@/utils/request'


export function del(ids) {
  return request({
    url: 'api/trExamDepartFile',
    method: 'delete',
    data: ids
  })
}

export function get(params) {
  return request({
    url: 'api/trExamDepartFile',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: 'api/trExamDepartFile',
    method: 'put',
    data
  })
}

export function getExamFilesByExample(data) {
  return request({
    url: 'api/trExamDepartFile/byExample',
    method: 'post',
    data
  })
}

export default {del, get, edit, getExamFilesByExample }
