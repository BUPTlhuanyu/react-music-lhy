const dbUtils = require('./../utils/db-util')

const user = {

  /**
   * 数据库创建用户
   * @param  {object} model 用户数据模型
   * @return {object}       mysql执行结果
   */
  async create ( model ) {
    let result = await dbUtils.insertData( 'user', model )
    let result2 = await dbUtils.createTable(
        `CREATE TABLE IF NOT EXISTS user_${model.user_name}(
          id INT PRIMARY KEY AUTO_INCREMENT,
          mid VARCHAR(40),
          singer VARCHAR(40),
          name VARCHAR(40),
          album VARCHAR(40),
          duration INT,
          image VARCHAR(255),
          url VARCHAR(255)
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;`
    )
    return result
  },

  /**
   * 查找一个存在用户的数据
   * @param  {obejct} options 查找条件参数
   * @return {object|null}        查找结果
   */
  async getExistOne(options ) {
    let _sql = `
    SELECT * from user
      where user_name="${options.name}"
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
   * 根据用户名和密码查找用户
   * @param  {object} options 用户名密码对象
   * @return {object|null}         查找结果
   */
  async getOneByUserNameAndPassword( options ) {
    let _sql = `
    SELECT * from user
      where user_password="${options.password}" and user_name="${options.name}"
      limit 1`
    let result = await dbUtils.query( _sql )
    if ( Array.isArray(result) && result.length > 0 ) {
      result = result[0]
    } else {
      result = null
    }
    return result
  }
}


module.exports = user
