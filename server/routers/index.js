/**
 * 整合所有子路由
 */

const router = require('koa-router')()

const admin = require('./admin')
const favorite = require('./favorite')
const apiProxy = require('./favorite')

router.use('/admin', admin.routes(), admin.allowedMethods())
router.use('/favorite', favorite.routes(), favorite.allowedMethods())
router.use('/api', apiProxy.routes(), apiProxy.allowedMethods())

module.exports = router


