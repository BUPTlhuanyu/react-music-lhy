/**
 * Created by liaohuanyu on 2019/4/7.
 */
/**
 * restful api 子路由
 */

const router = require('koa-router')()
const userInfoController = require('./../controllers/user-info')

const routers = router
    .get('/user/getUserInfo', userInfoController.getUserInfo)
    .post('/user/signIn', userInfoController.signIn)
    .post('/user/signUp', userInfoController.signUp)


module.exports = routers