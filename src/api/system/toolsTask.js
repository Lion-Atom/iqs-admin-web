import request from '@/utils/request'

export function getToolsTask(params) {
  return request({
    url: 'api/toolsTask',
    method: 'get',
    params
  })
}

export function getCountByUserId() {
  const params = {}
  return request({
    url: '/api/toolsTask/count',
    method: 'get',
    params
  })
}

export function edit(data) {
  return request({
    url: 'api/toolsTask',
    method: 'put',
    data
  })
}

export function submit(data) {
  return request({
    url: 'api/toolsTask/submit',
    method: 'post',
    data
  })
}

export default { getToolsTask, getCountByUserId, edit, submit }
