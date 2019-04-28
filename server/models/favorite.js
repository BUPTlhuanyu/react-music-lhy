/**
 * Created by liaohuanyu on 2019/4/28.
 */
const dbUtils = require('./../utils/db-util')
const favorite = {
    async addFavorite(data){
        let table = `user_${data.userName}`;
        let values = {
            mid : data.mid,
            singer : data.singer,
            name : data.name,
            album : data.album,
            duration : data.duration,
            image : data.image,
            url : data.url
        }
        let result = await dbUtils.insertData(table, values)
        return result
    },
    async deleteFavorite(data){
        let table = `user_${data.userName}`;
        let values = {
            mid : data.mid
        }
        let result = await dbUtils.deleteDataByField(table, values)
        return result
    },
    async getFavorite(){

    },
    /**
     * 查找一个存在用户的数据
     * @param  {obejct} options 查找条件参数
     * @return {object|null}        查找结果
     */
    async getExistOne(options ) {
        let _sql = `
    SELECT * from user_${options.userName}
      where mid="${options.mid}"
      limit 1`
        let result = await dbUtils.query( _sql )
        if ( Array.isArray(result) && result.length > 0 ) {
            result = result[0]
        } else {
            result = null
        }
        return result
    },
    /**
     * 获取用户喜欢的歌单
     * @param  {obejct} data 查找条件参数
     * @return {object|null}        查找结果
     */
    async getDataByPage(data ) {
        let table = `user_${data.userName}`;
        let start = 0;
        let end = 20;
        let result = await dbUtils.findDataByPage( table, start, end )
        return result
    }
}


module.exports = favorite