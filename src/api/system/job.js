import request from '@/utils/request'

export function getAllJob() {
  const params = {
    page: 0,
    size: 9999,
    enabled: true
  }
  return request({
    url: 'api/job/queryAll',
    method: 'get',
    params
  })
}

export function getJobs(params) {
  return request({
    url: 'api/job',
    method: 'get',
    params
  })
}

export function getJobSuperior(ids) {
  const data = ids.length || ids.length === 0 ? ids : Array.of(ids)
  return request({
    url: 'api/job/superior',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/job',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/job',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/job',
    method: 'put',
    data
  })
}

export default { add, edit, del, getAllJob, getJobs, getJobSuperior }
