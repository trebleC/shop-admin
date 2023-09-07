import request from '../request'

export function uploadFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    headers:{
        'Content-type': 'multipart/form-data'
      },
    data
  })
}
