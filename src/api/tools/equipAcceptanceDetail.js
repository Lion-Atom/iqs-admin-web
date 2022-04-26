import request from '@/utils/request'

export function editEquipAcceptanceDetails(data) {
  return request({
    url: 'api/equipAcceptanceDetail',
    method: 'put',
    data
  })
}

export function getDetailsByAcceptanceId(id) {
  const params = {
    acceptanceId: id
  }
  return request({
    url: 'api/equipAcceptanceDetail/byAcceptanceId',
    method: 'get',
    params
  })
}

export default {editEquipAcceptanceDetails, getDetailsByAcceptanceId}
