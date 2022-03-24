import request from '@/utils/request'

export function addSelfTemplate(data) {
  return request({
    url: 'api/selfTemplate',
    method: 'post',
    data
  })
}

export function editSelfTemplate(data) {
  return request({
    url: 'api/selfTemplate',
    method: 'put',
    data
  })
}

export function getTempModuleByCond(data) {
  return request({
    url: 'api/selfTemplate/byExample',
    method: 'post',
    data
  })
}

export function getSelfByTemplateId(id) {
  const params = {
    templateId: id
  }
  return request({
    url: 'api/selfTemplate/byTemplateId',
    method: 'get',
    params
  })
}

export function getTreeByTemplateId(id) {
  const params = {
    templateId: id
  }
  return request({
    url: 'api/selfTemplate/tree/byTemplateId',
    method: 'get',
    params
  })
}

export function getById(id) {
  const params = {
    id: id
  }
  return request({
    url: 'api/selfTemplate/byId',
    method: 'get',
    params
  })
}

export function delSelfTemplate(ids) {
  return request({
    url: 'api/selfTemplate',
    method: 'delete',
    data: ids
  })
}

export function updateTempModule(data) {
  return request({
    url: 'api/selfTemplate/update',
    method: 'post',
    data
  })
}

export default { addSelfTemplate, editSelfTemplate, getSelfByTemplateId, delSelfTemplate, updateTempModule, getTreeByTemplateId, getById }
