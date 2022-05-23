import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/jobs',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/jobs',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/jobs',
    method: 'put',
    data
  })
}

export function updateIsPause(id) {
  return request({
    url: 'api/jobs/' + id,
    method: 'put'
  })
}

export function execution(id) {
  return request({
    url: 'api/jobs/exec/' + id,
    method: 'put'
  })
}

export function getByMethodName(methodName) {
  const params = {
    methodName: methodName
  }
  return request({
    url: 'api/jobs/byMethodName',
    method: 'get',
    params
  })
}

export default { del, updateIsPause, execution, add, edit, getByMethodName }
