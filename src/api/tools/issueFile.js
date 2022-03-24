import request from '@/utils/request'

export function getIssueFileByExample(data) {
  return request({
    url: 'api/issueFile/byExample',
    method: 'post',
    data
  })
}

export function delIssueFile(ids) {
  return request({
    url: 'api/issueFile',
    method: 'delete',
    data: ids
  })
}

export function getBindFileByExample(data) {
  return request({
    url: 'api/issueFile/bindFile',
    method: 'post',
    data
  })
}

export function syncTempFile(data) {
  return request({
    url: 'api/issueFile/syncTempFile',
    method: 'post',
    data
  })
}

export default { getIssueFileByExample, delIssueFile, getBindFileByExample,syncTempFile }
