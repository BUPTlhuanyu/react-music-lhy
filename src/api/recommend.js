import {jsonp, ws} from 'common/js/ws'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getDiscList() {
    const url = '/api/getDiscList'

    const data = Object.assign({}, commonParams, {
        picmid: 1,
        rnd: 0.05723217189877294,
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
        categoryId: 10000000,
        sortId: 5,
        sin: 0,
        ein: 29
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

// export function getDiscList() {
//   const url = '/api/getDiscList'
//
//   const data = Object.assign({}, commonParams, {
//     picmid: 1,
//     rnd: 0.05723217189877294,
//     g_tk: 5381,
//     loginUin: 0,
//     hostUin: 0,
//     format: 'json',
//     inCharset: 'utf8',
//     outCharset: 'utf-8',
//     notice: 0,
//     platform: 'yqq.json',
//     needNewCode: 0,
//     categoryId: 10000000,
//     sortId: 5,
//     sin: 0,
//     ein: 29
//   })
//
//   const options = {
//       url,
//       headers:{
//           referer: 'https://c.y.qq.com/',
//           host: 'c.y.qq.com'
//       },
//       data
//   };
//   return ws('GET',options);
// }


export function getSongList(disstid) {
  const url = '/api/getSongList'
  const data = Object.assign({}, commonParams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    g_tk: 5381,
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
