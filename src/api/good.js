import request from '../request'

export function saveGood(data) {
  return request({
    url: '/saveGood',
    method: 'post',
    data
  })
}
export function queryGood(params) {
  return request({
    url: '/queryGood',
    method: 'get',
    params
  })
}

export function queryGoodList(params) {
  return request({
    url: '/queryGoodList',
    method: 'get',
    params
  })
}

export function deleteGood(params) {
  return request({
    url: '/deleteGood',
    method: 'get',
    params
  })
}


export function setHot(params) {
  return request({
    url: '/setHot',
    method: 'get',
    params
  })
}

export function queryHotGoodList(params) {
  return request({
    url: '/queryHotGoodList',
    method: 'get',
    params
  })
}

