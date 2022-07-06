import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function getAllUser() {
  const params = {
    queryAll: true,
    page: 0,
    size: 9999,
    enabled: true
  }
  return request({
    url: 'api/users',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/users',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/users',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/users',
    method: 'put',
    data
  })
}

export function getUserSuperior(params) {
  return request({
    url: 'api/users/superior',
    method: 'get',
    params
  })
}

export function havDepartMaster(params) {
  return request({
    url: 'api/users/havDepartMaster',
    method: 'get',
    params
  })
}

export function getUserByDeptId(params) {
  return request({
    url: 'api/users/byDeptId',
    method: 'get',
    params
  })
}

export function getUserByDeptIds(data) {
  return request({
    url: 'api/users/byDeptIds',
    method: 'post',
    data
  })
}

export function getApprovers(params) {
  return request({
    url: 'api/users/approvers',
    method: 'get',
    params
  })
}

export function editUser(data) {
  return request({
    url: 'api/users/center',
    method: 'put',
    data
  })
}

export function initPass(data) {
  return request({
    url: 'api/users/initPass',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export default { add, edit, del, getUserSuperior, havDepartMaster, getUserByDeptId,getUserByDeptIds, getAllUser }

