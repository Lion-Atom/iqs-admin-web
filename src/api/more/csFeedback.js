import request from '@/utils/request'
import {getTrainExamStaffById} from "@/api/tools/train/examStaff";

export function get(params) {
  return request({
    url: 'api/csFeedback',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/csFeedback',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/csFeedback',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/csFeedback',
    method: 'put',
    data
  })
}

export default {get, add, edit, del}
