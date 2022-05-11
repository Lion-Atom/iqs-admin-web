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
    url: 'api/trExamDepartFile/byDepartId',
    method: 'get',
    params
  })
}

export default {del, get}
