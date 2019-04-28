/**
 * Created by liaohuanyu on 2019/4/28.
 */
const favoriteModel = require('./../models/favorite')
const favoriteCode = require('./../codes/favorite')

const favorite = {
    /**
     * 添加喜欢的歌曲信息
     * @param  {object} data 歌曲信息与用户名
     * @return {object}      创建结果
     */
    async addFavorite(data){
        let result = favoriteModel.addFavorite(data)
        return result
    },
    /**
     * 查找是否存在该歌曲
     * @param  {object} data 歌曲信息与用户名
     * @return {object}      创建结果
     */
    async getExistOne(data){
        let resultData = await favoriteModel.getExistOne({
            'userName': data.userName,
            'mid': data.mid
        })
        return resultData
    },
    /**
     * 查找是否存在该歌曲
     * @param  {object} data 歌曲信息与用户名
     * @return {object}      创建结果
     */
    async deleteFavorite(data){
        let resultData = await favoriteModel.deleteFavorite({
            'userName': data.userName,
            'mid': data.mid
        })
        return resultData
    },
    /**
     * 分页获取歌曲
     * @param  {object} data 歌曲信息与用户名
     * @return {object}      创建结果
     */
    async getDataByPage(data ) {
        let result = await favoriteModel.getDataByPage(data)
        return result
    }
}

module.exports = favorite;
