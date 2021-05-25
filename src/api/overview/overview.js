import request from '@/utils/request'

export function getOverViewAll() {
  const params = {
    // page: 0,
    // size: 9999,
    // enabled: true
  }
  return request({
    url: '/api/overview/all',
    method: 'get',
    params
  })
}

export function getCountByFileType() {
  const params = {}
  return request({
    url: '/api/overview/file/byFileType',
    method: 'get',
    params
  })
}

export function getCountByFileLevel() {
  const params = {}
  return request({
    url: '/api/overview/file/byFileLevel',
    method: 'get',
    params
  })
}

export default { getOverViewAll, getCountByFileType, getCountByFileLevel }
