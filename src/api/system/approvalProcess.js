import request from '@/utils/request'

export function getApprovalProcess(params) {
  return request({
    url: 'api/approvalProcess',
    method: 'get',
    params
  })
}

export function editApprovalProcess(data) {
  return request({
    url: 'api/approvalProcess',
    method: 'put',
    data
  })
}

export default { getApprovalProcess, editApprovalProcess }
