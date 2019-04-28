/**
 * Created by liaohuanyu on 2019/4/28.
 */
const router = require('koa-router')();
const favoriteController = require('./../controllers/favorite')


const routers = router
    .post('/getFavorite',favoriteController.getDataByPage)
    .post('/add',favoriteController.addFavorite)
    .post('/delete',favoriteController.deleteFavorite)
module.exports = routers;