/**
 * Created by liaohuanyu on 2019/4/6.
 */
const path = require('path')
const Koa = require('koa')
// const koaStatic = require('koa-static')
// const views = require('koa-views')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
// const session = require('koa-session-minimal')
// const MysqlStore = require('koa-mysql-session')

const config = require('./config')
const routers = require('./routers/index')

const cors = require('koa2-cors');

const app = new Koa()

// -- 解决跨域问题 -- \\

app.use(cors({
    origin: function (ctx) {
        return 'localhost';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE','OPTIONS'], //设置允许的HTTP请求类型
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// session存储配置
// const sessionMysqlConfig= {
//     user: config.database.USERNAME,
//     password: config.database.PASSWORD,
//     database: config.database.DATABASE,
//     host: config.database.HOST,
// }



// 配置session中间件
// app.use(session({
//     key: 'USER_SID',
//     store: new MysqlStore(sessionMysqlConfig)
// }))

// 配置控制台日志中间件
app.use(koaLogger())

// -- 将POST请求中的data数据存放在ctx.request.body中 -- \\
// 配置ctx.body解析中间件
// 对于POST请求的处理，koa-bodyparser中间件可以把koa2上下文的formData数据
// 解析到ctx.request.body中
app.use(bodyParser())

// 配置静态资源加载中间件
// app.use(koaStatic(
//     path.join(__dirname , './static')
// ))

// 配置服务端模板渲染引擎中间件
// app.use(views(path.join(__dirname, './views'), {
//     extension: 'ejs'
// }))


// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())



// 监听启动端口
app.listen( config.port )
console.log(`the server is start at port ${config.port}`)
