/**
 * Created by liaohuanyu on 2019/4/30.
 */
const router = require('koa-router')()
const apiProxy = require('./../controllers/api')

const routers = router
    .get('/getDiscList', apiProxy.getDiscList)
    .get('/search', apiProxy.search)
    .get('/getSongList', apiProxy.getSongList)
    .get('/getVkey', apiProxy.getVkey)
    .get('/lyric',apiProxy.lyric)


module.exports = routers