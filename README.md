## 一个适合练手的react项目
##### 时间原因项目不再更新
##### 体会vue与react项目区别
##### 声明：本项目参考了滴滴大佬的vue项目，原vue项目请关注[ustbhuangyi](https://github.com/ustbhuangyi)

## 项目运行
### 后端项目启动
 ##### 安装mysql
 ##### 启动mysql服务:`net start <mysql程序名称>`
 ##### 登录用户: `mysql -uroot -p`
 ##### 输入密码
 ##### 创建数据库：`CREATE DATABASE music;`
 ##### 利用`server/sql/music.sql`中的查询语句创建数据表user
 ##### 启动一个终端，切换到server文件夹下
 ##### `npm install`
 ##### `npm start`

### 前端项目启动
 ##### `npm install`
 ##### `npm run dev`
 ##### 项目中用到的一些自定义types在common/js/typings目录下
 ##### 可以通过dts-gen为没有types的npm包自动生成d.ts声明文件


## 项目笔记
### D1
- [1、搭建项目](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D1/1%E3%80%81%E6%90%AD%E5%BB%BA%E9%A1%B9%E7%9B%AE.md)
- [2、alias与tsconfig的配置](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D1/2%E3%80%81alias%E4%B8%8Etsconfig%E7%9A%84%E9%85%8D%E7%BD%AE.md)

### D2
- [1、Tab组件与路由](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/1%E3%80%81Tab%E7%BB%84%E4%BB%B6%E4%B8%8E%E8%B7%AF%E7%94%B1.md)
- [2、基于better-scroll的react轮播图组件](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/2%E3%80%81%E5%9F%BA%E4%BA%8Ebetter-scroll%E7%9A%84react%E8%BD%AE%E6%92%AD%E5%9B%BE%E7%BB%84%E4%BB%B6.md)
- [3、http-proxy-middleware](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/3%E3%80%81http-proxy-middleware.md)
- [4、create-react-app搭建代理（一）](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/4%E3%80%81create-react-app%E6%90%AD%E5%BB%BA%E4%BB%A3%E7%90%86%EF%BC%88%E4%B8%80%EF%BC%89.md)
- [5、create-react-app搭建代理（二）](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/5%E3%80%81create-react-app%E6%90%AD%E5%BB%BA%E4%BB%A3%E7%90%86%EF%BC%88%E4%BA%8C%EF%BC%89.md)
- [6、scroll组件：移动端滚动](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/6%E3%80%81scroll%E7%BB%84%E4%BB%B6%EF%BC%9A%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%BB%9A%E5%8A%A8.md)
- [7、loading组件](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/7%E3%80%81loading%E7%BB%84%E4%BB%B6.md)
- [8、图片懒加载](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D2/8%E3%80%81%E5%9B%BE%E7%89%87%E6%87%92%E5%8A%A0%E8%BD%BD.md)

### D3
- [1、图片懒加载组件优化](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D3/1%E3%80%81%E5%9B%BE%E7%89%87%E6%87%92%E5%8A%A0%E8%BD%BD%E7%BB%84%E4%BB%B6%E4%BC%98%E5%8C%96.md)
- [2、歌曲信息页&typescript的用法](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D3/2%E3%80%81%E6%AD%8C%E6%9B%B2%E4%BF%A1%E6%81%AF%E9%A1%B5%2Btypescript%E7%9A%84%E7%94%A8%E6%B3%95.md)
- [3、滚动列表复用组件](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D3/3%E3%80%81%E6%BB%9A%E5%8A%A8%E5%88%97%E8%A1%A8%E5%A4%8D%E7%94%A8%E7%BB%84%E4%BB%B6.md)
- [4、异步获取数据&保存组件状态](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D3/4%E3%80%81%E5%BC%82%E6%AD%A5%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE%26%26%E4%BF%9D%E5%AD%98%E7%BB%84%E4%BB%B6%E7%8A%B6%E6%80%81.md)
- [5、除Link外控制路由跳转：withRouter & typescript](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D3/5%E3%80%81%E9%99%A4Link%E5%A4%96%E6%8E%A7%E5%88%B6%E8%B7%AF%E7%94%B1%E8%B7%B3%E8%BD%AC%EF%BC%9AwithRouter%20%26%26%20typescript.md)
- [6、redux使用方法](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D3/6%E3%80%81redux%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95.md)

### D4
- [1、withRouter&connect&typescript的使用](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/withRouter%26connect%26typescript%E7%9A%84%E4%BD%BF%E7%94%A8.md)
- [2、页面切换与异步数据请求bug](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/%E9%A1%B5%E9%9D%A2%E5%88%87%E6%8D%A2%E4%B8%8E%E5%BC%82%E6%AD%A5%E6%95%B0%E6%8D%AE%E8%AF%B7%E6%B1%82bug.md)
- [3、getDerivedStateFromProps使用技巧](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/getDerivedStateFromProps%E4%BD%BF%E7%94%A8%E6%8A%80%E5%B7%A7.md)
- [4、基于react-transition-group的react过渡动画](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/react%E5%8A%A8%E7%94%BBCSSTransition.md)
- [5、react-lodable组件动态导入](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/react-lodable%e7%bb%84%e4%bb%b6%e5%8a%a8%e6%80%81%e5%af%bc%e5%85%a5.md)
- [6、react中输入框防抖debounce](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D4/react%e4%b8%ad%e8%be%93%e5%85%a5%e6%a1%86%e9%98%b2%e6%8a%96debounce.md)

### D5
- [1、typescript约束输入数据结构编写listView可复用组件](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D5/typescript%e7%ba%a6%e6%9d%9f%e8%be%93%e5%85%a5%e6%95%b0%e6%8d%ae%e7%bb%93%e6%9e%84%e7%bc%96%e5%86%99listView%e5%8f%af%e5%a4%8d%e7%94%a8%e7%bb%84%e4%bb%b6.md)
- [2、typescript在react项目中的实践](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D5/typescript%e5%9c%a8react%e9%a1%b9%e7%9b%ae%e4%b8%ad%e7%9a%84%e5%ae%9e%e8%b7%b5.md)
- [3、typescript在react项目中的实践之ref](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D5/typescript%e5%9c%a8react%e9%a1%b9%e7%9b%ae%e4%b8%ad%e7%9a%84%e5%ae%9e%e8%b7%b5%e4%b9%8bref.md)

### D6
- [1、webpack之splitChunks提升打包编译速度](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D6/webpack%e4%b9%8bsplitChunks%e6%8f%90%e5%8d%87%e6%89%93%e5%8c%85%e7%bc%96%e8%af%91%e9%80%9f%e5%ba%a6.md)
- [2、webpack之happypack多线程打包](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/D6/webpack%e4%b9%8bhappypack%e5%a4%9a%e7%ba%bf%e7%a8%8b%e6%89%93%e5%8c%85.md)

### 部署
- [1、react项目本地部署到nginx](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E9%83%A8%E7%BD%B2/1%e3%80%81react%e9%a1%b9%e7%9b%ae%e6%9c%ac%e5%9c%b0%e9%83%a8%e7%bd%b2%e5%88%b0nginx.md)
- [2、gzip优化](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E9%83%A8%E7%BD%B2/2%e3%80%81gzip%e4%bc%98%e5%8c%96.md)

### node后端
- [1、后端项目结构](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/node%e5%90%8e%e7%ab%af/%e5%90%8e%e7%ab%af%e9%a1%b9%e7%9b%ae%e7%bb%93%e6%9e%84.md)
- [2、代理实现本地cookie跨域调试](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/node%e5%90%8e%e7%ab%af/%e4%bb%a3%e7%90%86%e5%ae%9e%e7%8e%b0%e6%9c%ac%e5%9c%b0cookie%e8%b7%a8%e5%9f%9f%e8%b0%83%e8%af%95.md)
- [ ] 3、webpack-dev-server原理分析
- [4、基于session与cookie的登录凭证](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/node%E5%90%8E%E7%AB%AF/%E5%9F%BA%E4%BA%8Esession%E4%B8%8Ecookie%E7%9A%84%E7%99%BB%E5%BD%95%E5%87%AD%E8%AF%81.md)
- [5、cookie+签名实现登录凭证](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/node%E5%90%8E%E7%AB%AF/cookie%2B%E7%AD%BE%E5%90%8D%E5%AE%9E%E7%8E%B0%E7%99%BB%E5%BD%95%E5%87%AD%E8%AF%81.md)

### 调试
- [1、fiddler抓包http进行本地调试](http://note.youdao.com/noteshare?id=70e08556aa386dfc5f649dd6b4b15150&sub=1A34BF503D0A4B85851C7FE8019E1DCD)


## ToDo
- [x] 完善项目中typescript类型
    - [x] store，action类型
    - [x] 数据类型
    - [x] 无状态组件 `React.SFC`
    - [x] 有状态组件
        `readonly state : Readonly<IState>，react已经对props、props的属性与state的属性作了只读处理`
    - [x] react事件类型
    - [x] ref类型 `React.RefObject<Scroll> --> <Scroll ref={this.toplist}></Scroll>`
    - [x] 媒体事件类型 `const { currentTime } : { currentTime: number } = e.target as HTMLMediaElement`
- [x] 项目本地部署
- [ ] 数据与视图分离
- [ ] 组件优化
- [ ] 项目结构的思考，总结
- [ ] create-react-app优化打包
- [ ] electron构建exe
- [ ] 个人中心管理系统
    - [x] mysql数据库表的设计
    - [x] 登录注册
    - [x] koa2-cors解决跨域
    - [x] koa-bodyparser解决post数据的解析与提取
    - [x] 后端API功能实现、postman测试、前端测试:getDataByPage, addFavorite, deleteFavorite
    - [x] cookie:利用webpack的webpack-dev-server代理实现本地cookie跨域调试。
    - [x] cookie + 签名:获取数据库中用户信息
    - [ ] session:
        - [ ] koa-session-minimal 适用于koa2 的session中间件，提供存储介质的读写接口 。
        - [ ] koa-mysql-session 为koa-session-minimal中间件提供MySQL数据库的session数据读写操作。
        - [ ] koa-redis 为koa-session-minimal中间件提供redis的session数据读写操作。
    - [ ] 数据上传，下载
    - [ ] 缓存
    - [ ] 静态服务器
    - [ ] nginx负载均衡，redis存储
    - [ ] 压力测试
    - [ ] 日志
    - [ ] 部署，pm2
    - [ ] websocket, https


## 页面展示
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E5%B1%95%E7%A4%BA/Transition.gif)
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E5%B1%95%E7%A4%BA/home.gif)
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E5%B1%95%E7%A4%BA/lazyload.gif)
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E5%B1%95%E7%A4%BA/player.gif)
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E5%B1%95%E7%A4%BA/scroll.gif)
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/%E5%B1%95%E7%A4%BA/scroll2.gif)
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/node%E5%90%8E%E7%AB%AF/getDataByPage%E6%B5%8B%E8%AF%95.png)
![](https://github.com/BUPTlhuanyu/react-music-lhy/blob/master/blog/node%E5%90%8E%E7%AB%AF/%e7%99%bb%e5%bd%95%e6%b3%a8%e5%86%8c%e6%b7%bb%e5%8a%a0favorite%e7%9a%84%e7%ae%80%e5%8d%95%e6%bc%94%e7%a4%ba.gif)