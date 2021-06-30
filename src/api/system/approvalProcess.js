import request from '@/utils/request'

export function getApprovalProcess(params) {
  return request({
    url: 'api/approvalProcess',
    method: 'get',
    params
  })
}

export default { getApprovalProcess }
