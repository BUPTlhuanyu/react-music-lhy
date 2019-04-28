const allConfig = require("./../config")
const config = allConfig.database
const mysql = require("mysql")

const pool = mysql.createPool({
  host     :  config.HOST,
  user     : config.USERNAME,
  password : config.PASSWORD,
  database : config.DATABASE
})

let query = function( sql, values ) {

  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        resolve( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

let createTable = function( sql ) {
  return query( sql, [] )
}


let findDataById = function( table,  id ) {
  let  _sql =  "SELECT * FROM ?? WHERE user_id = ? "
  return query( _sql, [ table, id, start, end ] )
}


let findDataByPage = function( table, start, end ) {
  let  _sql =  "SELECT * FROM ??  LIMIT ? , ?"
  return query( _sql, [ table,  start, end ] )
}

// 例子
// var post  = {id: 1, title: 'Hello MySQL'};
// var query = connection.query('INSERT INTO posts SET ?', post, function(err, result) {
//     // Neat!
// });
// console.log(query.sql); // INSERT INTO posts SET `id` = 1, `title` = 'Hello MySQL'
let insertData = function( table, values ) {
  let _sql = "INSERT INTO ?? SET ?"
  return query( _sql, [ table, values ] )
}


let updateData = function( table, values, id ) {
  let _sql = "UPDATE ?? SET ? WHERE user_id = ?"
  return query( _sql, [ table, values, id ] )
}


let deleteDataByField = function( table, Field ) {
  let _sql = "DELETE FROM ?? WHERE ?"
  return query( _sql, [ table, Field ] )
}


let select = function( table, keys ) {
  let  _sql =  "SELECT ?? FROM ?? "
  return query( _sql, [ keys, table ] )
}

let count = function( table ) {
  let  _sql =  "SELECT COUNT(*) AS total_count FROM ?? "
  return query( _sql, [ table ] )
}

module.exports = {
  query,
  createTable,
  findDataById,
  findDataByPage,
  deleteDataByField,
  insertData,
  updateData,
  select,
  count,
}
