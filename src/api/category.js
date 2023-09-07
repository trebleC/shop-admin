import request from '../request'

export function saveCategory(data) {
  return request({
    url: '/saveCategory',
    method: 'post',
    data
  })
}

export function queryCategoryList() {
  return request({
    url: '/queryCategoryList',
    method: 'get'
  })
}

export function deleteCategory(params) {
  return request({
    url: '/deleteCategory',
    method: 'get',
    params
  })
}

export function queryCategoryMap() {
  return request({
    url: '/queryCategoryMap',
    method: 'get',
  })
}
