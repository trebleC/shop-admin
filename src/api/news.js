import request from '../request'

export function saveNews(data) {
  return request({
    url: '/saveNews',
    method: 'post',
    data
  })
}
export function queryNews(params) {
  return request({
    url: '/queryNews',
    method: 'get',
    params
  })
}

export function queryNewsList(params) {
  return request({
    url: '/queryNewsList',
    method: 'get',
    params
  })
}

export function removeNews(params) {
  return request({
    url: '/removeNews',
    method: 'get',
    params
  })
}

