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
    domain:'localhost:3000',
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