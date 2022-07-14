import request from '@/utils/request'


export function delEquipFile(ids) {
  return request({
    url: 'api/equipFile',
    method: 'delete',
    data: ids
  })
}

export function getFilesByExample(data) {
  return request({
    url: 'api/equipFile/byExample',
    method: 'post',
    data
  })
}

export default { delEquipFile, getFilesByExample }
