/**
 * Created by liaohuanyu on 2019/1/25.
 */
/**
 * @Description: 对应create-react-app搭建代理（一），
 * 不设置package中proxy的方法，直接走webpack-dev-server中的before函数
 * @author: liaohuanyu
 * @date 2019/1/25
*/
const express = require('express')
const opn = require('opn')
const path = require('path')
const axios = require('axios')
const apiRoutes = express.Router()
apiRoutes.get('/getDiscList', function (req, res) {
    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

// apiRoutes.get('/search', function (req, res) {
//     var url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
//     axios.get(url, {
//         headers: {
//             referer: 'https://y.qq.com/portal/search.html',
//             host: 'c.y.qq.com'
//         },
//         params: req.query
//     }).then((response) => {
//         res.json(response.data)
//     }).catch((e) => {
//         console.log(e)
//     })
// })
//
// apiRoutes.get('/getSongList', function (req, res) {
//     var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
//     axios.get(url, {
//         headers: {
//             referer: 'https://y.qq.com/n/yqq/playsquare/6225968420.html',
//             host: 'c.y.qq.com'
//         },
//         params: req.query
//     }).then((response) => {
//         res.json(response.data)
//     }).catch((e) => {
//         console.log(e)
//     })
// })
//
// apiRoutes.get('/lyric', function (req, res) {
//     var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
//
//     axios.get(url, {
//         headers: {
//             referer: 'https://c.y.qq.com/',
//             host: 'c.y.qq.com'
//         },
//         params: req.query
//     }).then((response) => {
//         var ret = response.data
//         if (typeof ret === 'string') {
//             var reg = /^\w+\(({[^()]+})\)$/
//             var matches = ret.match(reg)
//             if (matches) {
//                 ret = JSON.parse(matches[1])
//             }
//         }
//         res.json(ret)
//     }).catch((e) => {
//         console.log(e)
//     })
// })



module.exports = function(app){
    app.use('/api', apiRoutes)
}





