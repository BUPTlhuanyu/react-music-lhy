/**
 * Created by liaohuanyu on 2019/1/24.
 */
/**
 * @Description: 适合自己配置webpack时的代理服务器的搭建
 * @author: liaohuanyu
 * @date 2019/1/25
*/
const express = require('express')
const opn = require('opn')
const path = require('path')
const axios = require('axios')
const app = express()
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

app.use('/api', apiRoutes)

module.exports = function(compiler, port){
    const proxyMiddleware = require('http-proxy-middleware')
    const devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: '/',
        quiet: true
    })
    const hotMiddleware = require('webpack-hot-middleware')(compiler)
    const historyApiFallback = require('connect-history-api-fallback')
    app.use(historyApiFallback());
    // serve webpack bundle output
    app.use(devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware)

    // serve pure static assets
    // const staticPath = path.posix.join('/', 'static')
    // app.use(staticPath, express.static('./static'))

    const uri = 'http://localhost:' + port

    let _resolve
    const readyPromise = new Promise(resolve => {
        _resolve = resolve
    })

    console.log('> Starting dev server...')
    devMiddleware.waitUntilValid(() => {
        console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
        if ( process.env.NODE_ENV !== 'testing') {
            opn(uri)
        }
        _resolve()
    })
    const server = app.listen(port)
}




