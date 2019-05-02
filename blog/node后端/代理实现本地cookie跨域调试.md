#### 问题还原
本地调试的情况下，HOST为A的客户端，发送请求到HOST为B的服务端。但浏览器无法将服务端发来的set-cookie中的cookie内容写入相应domain的cookie中，并且chrome下会隐藏响应头set-cookie。尝试了[链接](https://stackoverflow.com/questions/1134290/cookies-on-localhost-with-explicit-domain)中的方法，都无法搞定。

#### 代理实现本地cookie跨域调试的一些方法
主要的还是利用代理来解决cookie的跨域问题，可以利用nginx作为代理来实现cookie跨域。由于项目是由create-react-app建立的，为了调试方便，因此这里用webpack的webpack-dev-server提供的代理来实现，对应于package.json中proxy对应的代理端口。

**TODO**

- [ ] **多个cookie同步共享**


#### 说明
这里为了实现本地cookie跨域调试，将之前的[5、create-react-app搭建代理（二）](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/5%E3%80%81create-react-app%E6%90%AD%E5%BB%BA%E4%BB%A3%E7%90%86%EF%BC%88%E4%BA%8C%EF%BC%89.md)中对应的server.js弃用，将其代理的请求逻辑添加到server文件夹下基于koa的服务器中。最后需要将基于koa的服务器监听的端口设置为3111，保持与package.json中proxy对应的代理端口一致。

更改package.json的scripts如下：

```
  "scripts": {
    "dev": "node scripts/start.js",
    "serverOld": "node scripts/server.js",
    "startOld": "concurrently \"npm run server\" \"npm run dev\" --prefix \"{time}-{pid}\"",
    "serverNew":"node server/app.js",
    "start":"concurrently \"npm run serverNew\" \"npm run dev\" --prefix \"{time}-{pid}\"",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js"
  }
```

#### 1、cookie跨域后端配置
针对cookie跨域需要注意的是：`credentials: true`，设置后端服务器允许cookie跨域设置。[cookies参考](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
```
app.use(cors({
    origin: function (ctx) {
        return 'http://localhost:3000';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 100,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE','OPTIONS'], //设置允许的HTTP请求类型
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
```

#### 2、后端set-cookie设置cookie值

```
const ckConfig = {
    domain:'localhost',
    path:'/',
    maxAge: 10 * 60 * 1000,
    // expires: new Date('2019-05-15'),
    httpOnly:false,
    overwrite:false
}

//.................................
ctx.cookies.set(
  'cid',
  userResult.user_id,
  ckConfig
)
```

#### 3、前端允许cookie跨域
设置`withCredentials`为`true`：

1、允许set-cookie将cookie设置到浏览器。

2、发送的时候允许携带cookie。
```
    return axios.post(url, data, {withCredentials:true}).then((res) => {
        return Promise.resolve(res.data)
    })
```

---

#### 单独设置cookie的max-age
前端直接设置max-age为0，然后刷新cookies会立即删除对应的cookie。如果是max-age为正数，指定秒数过后，再刷新cookies会删除对应的cookie。

```
document.cookie="cid=1; max-age=0; domain=localhost;path=/"
document.cookie="cid=1; max-age=10; domain=localhost;path=/"
```

后端设置max-age为0，在前端的效果是expires/max-age为N /A，这个cookie永远不会被自动清除，生存周期为N/A，这与前端设置cookie的效果刚好是相反的。

后端设置max-age为正数时，浏览器中的cookie会在相应的时间后删除，当在overwrite为false的时候，只有在该名称的cookie过期的时候，才能被重新设置。当在overwrite为true的时候，都是可以被重新设置的。

后端设置max-age为负数时，这个cookie是已经过期的，浏览器不会种下这个cookie。
```
    domain:'localhost',
    path:'/',
    maxAge: 0,
    // expires: new Date(Date.now() + 100000),
    httpOnly:false,
    overwrite:false
```


#### 单独设置cookie的expire
前端设置cookie的expire，指定时间会删除
```
document.cookie="cid=1;  expires=Mon, 11 Nov 2026 07:34:46 GMT; domain=localhost;path=/"
```

后端代码设置cookie的expire（overwrite的逻辑与max-age的是一致的）：
```
//当前时间一分钟过期：60000ms
expires: new Date(Date.now()+60000),
```

#### 同时设置cookie的expire与max-age
js设置，max-age优先级大于expire
```
cookie立即删除：
document.cookie="cid=1;  expires=Thu, 02 Mar 2019 17:33:46 GMT; max-age=0; domain=localhost;path=/"
cookie在1000s后删除：
document.cookie="cid=1;  expires=Thu, 02 Mar 2019 17:34:16 GMT; max-age=1000; domain=localhost;path=/"
```

后端设置，max-age比expires的优先级高。

```
// 单位是ms
maxAge: 10000,
//当前时间一分钟过期：60000ms
expires: new Date(Date.now()+600000),
```