import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/train/tip',
    method: 'get',
    params
  })
}

export default {get}
