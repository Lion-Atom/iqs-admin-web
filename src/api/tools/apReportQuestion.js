import request from '@/utils/request'

export function getReportQuestion(params) {
  return request({
    url: 'api/planReportQuestion',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/planReportQuestion',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/planReportQuestion',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/planReportQuestion',
    method: 'delete',
    data: ids
  })
}

export function getReportQuestionByReportId(id) {
  const params = {
    reportId: id
  }
  return request({
    url: 'api/planReportQuestion/byReportId',
    method: 'get',
    params
  })
}

export function downloadQuestion(id) {
  const params = {
    reportId: id
  }
  return request({
    url: 'api/planReportQuestion/exportByReportId',
    method: 'get',
    params
  })
}

export function completedById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/planReportQuestion/completedById',
    method: 'get',
    params
  })
}

export default {
  getReportQuestion,
  add,
  edit,
  del,
  getReportQuestionByReportId,
  downloadQuestion,
  completedById
}
