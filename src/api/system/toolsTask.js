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

export default { getToolsTask, getCountByUserId }
