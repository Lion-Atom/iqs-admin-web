import request from '@/utils/request'

export function getAllFiles() {
  const params = {
    page: 0,
    size: 9999,
    enabled: true
  }
  return request({
    url: 'api/localStorage',
    method: 'get',
    params
  })
}

/**
 * 获取可参考文件
 */
export function getAllAvailFiles() {
  const params = {
    page: 0,
    size: 9999,
    enabled: true,
    isReference: true
  }
  return request({
    url: 'api/localStorage',
    method: 'get',
    params
  })
}

export function getFileById(id) {
  const params = {
    fileId: id
  }
  return request({
    url: 'api/localStorage/byId',
    method: 'get',
    params
  })
}

export function getPreTrailByFileId(id, flag) {
  const params = {
    fileId: id,
    latestVersion: flag
  }
  return request({
    url: 'api/localStorage/getPreTrailByFileId',
    method: 'get',
    params
  })
}

export function getPreTrailByFileTempId(id, flag) {
  const params = {
    fileTempId: id,
    latestVersion: flag
  }
  return request({
    url: 'api/localStorage/getPreTrailByFileTempId',
    method: 'get',
    params
  })
}

export function getLatestAppProcess(id) {
  const params = {
    fileId: id
  }
  return request({
    url: 'api/localStorage/getApprovalProcessByFileId',
    method: 'get',
    params
  })
}

export function getAppProcessListByFileId(id) {
  const params = {
    fileId: id
  }
  return request({
    url: 'api/localStorage/getApprovalProcessListByFileId',
    method: 'get',
    params
  })
}

export function getOtherFiles(id) {
  const params = {
    page: 0,
    size: 9999,
    id: id,
    enabled: true,
    isReference: true
  }
  return request({
    url: 'api/localStorage',
    method: 'get',
    params
  })
}

export function getAllFilesAnonymousAccess(id) {
  const params = {
    page: 0,
    size: 9999,
    anonymousAccess: true,
    enabled: true
  }
  return request({
    url: 'api/localStorage',
    method: 'get',
    params
  })
}

export function getFilesByIds(data) {
  return request({
    url: 'api/localStorage/byIds',
    method: 'post',
    data
  })
}

export function getTempFilesByIds(data) {
  return request({
    url: 'api/localStorage/tempByIds',
    method: 'post',
    data
  })
}

export function cancelCover(data) {
  return request({
    url: 'api/localStorage/undo',
    method: 'post',
    data
  })
}

export function rollbackCover(data) {
  return request({
    url: 'api/localStorage/rollBackCover',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/localStorage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/localStorage/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/localStorage',
    method: 'put',
    data
  })
}

export function getFileByExample(data) {
  return request({
    url: 'api/localStorage/byExample',
    method: 'post',
    data
  })
}

export default { add, edit, del, getFileByExample }
