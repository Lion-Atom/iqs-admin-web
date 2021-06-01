import request from '@/utils/request'

export function delToolsLogByCond(data) {
  return request({
    url: 'api/toolsLogs/del/byCond',
    method: 'post',
    data
  })
}
