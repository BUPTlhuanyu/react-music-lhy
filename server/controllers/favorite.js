/**
 * Created by liaohuanyu on 2019/4/28.
 */
const favoriteService = require('./../services/favorite')
const favoriteCode = require('./../codes/favorite')
const { verificationSignature } = require('./../utils/crypto')

module.exports = {
    async addFavorite(ctx){
        let data = ctx.request.body
        let result = {
            success: false,
            message: '',
            data: null,
            code: ''
        }
        let existOne  = await favoriteService.getExistOne(data)
        if ( existOne  ) {
            if ( existOne.mid === data.mid + '' ) {

                result.message = favoriteCode.FAIL_SONG_IS_EXIST
                ctx.body = result
                return
            }
        }
        let addResult = await favoriteService.addFavorite( data )
        if ( addResult && addResult.insertId * 1 > 0) {
            result.success = true
        } else {
            result.message = favoriteCode.ERROR_SYS
        }
        ctx.body = result;
    },
    async deleteFavorite(ctx){
        let data = ctx.request.body
        let result = {
            success: false,
            message: '',
            data: null,
            code: ''
        }
        let deleteResult = await favoriteService.deleteFavorite( data )
        if ( deleteResult && deleteResult.affectedRows == 1) {
            result.success = true
        } else {
            result.message = favoriteCode.ERROR_SYS
        }
        ctx.body = result;
    },
    async getDataByPage(ctx){
        let data = ctx.request.body
        let result = {
            success: false,
            message: '',
            data: null,
            code: ''
        }
        let cid = ctx.cookies.get('cid')
        let signature = ctx.cookies.get('signature')
        if(verificationSignature(cid, signature)){
            let getResult = await favoriteService.getDataByPage( data )
            console.log(getResult)
            if ( getResult && getResult.length > 0) {
                result.success = true
                result.data = getResult
            } else {
                result.message = favoriteCode.ERROR_SYS
            }
        }else{
            result.message = favoriteCode.BAD_REQUEST
        }

        ctx.body = result;
    }
}