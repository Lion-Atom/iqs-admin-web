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

export default { getIssueFileByExample, delIssueFile }
