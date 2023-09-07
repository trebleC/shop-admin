import request from '../request'

export function saveDemand(data) {
  return request({
    url: '/saveDemand',
    method: 'post',
    data
  })
}
export function queryDemand(params) {
  return request({
    url: '/queryDemand',
    method: 'get',
    params
  })
}

export function queryDemandList(params) {
  return request({
    url: '/queryDemandList',
    method: 'get',
    params
  })
}

export function removeDemand(params) {
  return request({
    url: '/removeDemand',
    method: 'get',
    params
  })
}

