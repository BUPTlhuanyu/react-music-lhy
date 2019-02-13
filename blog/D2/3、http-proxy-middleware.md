# http-proxy-middleware #

本文翻译自Github[ http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)官方文档

### 核心概念 ###

Proxy中间件配置.

#### proxy([context,] config) ####

	var proxy = require('http-proxy-middleware')

	var apiProxy = proxy('/api', { target: 'http://www.example.org' })
	//                   \____/   \_____________________________/
	//                     |                    |
	//                   context             options

	// 'apiProxy' is now ready to be used as middleware in a server.

- context: 确定哪些请求被代理到目标主机
- options.target: 目标主机(协议 + 主机名)

#### proxy(uri [, config])简写 ####

	// 上述配置可简写为:
	var apiProxy = proxy('http://www.example.org/api')

例子：

	proxy('http://www.example.org:8000/api')
	// proxy('/api', {target: 'http://www.example.org:8000'});

	proxy('http://www.example.org:8000/api/books/*/**.json')
	// proxy('/api/books/*/**.json', {target: 'http://www.example.org:8000'});

	proxy('http://www.example.org:8000/api', { changeOrigin: true })
	// proxy('/api', {target: 'http://www.example.org:8000', changeOrigin: true});

### 匹配规则 ###

匹配规则参照的标准为[RFC 3986 path](https://tools.ietf.org/html/rfc3986#section-3.3)

         foo://example.com:8042/over/there?name=ferret#nose
         \_/   \______________/\_________/ \_________/ \__/
          |           |            |            |        |
       scheme     authority       path        query   fragment

#### 路径匹配 ####

- proxy({...}) - 所有请求都被代理.
- proxy('/', {...}) - 所有请求都被代理
- proxy('/api', {...}) - 所有paths以/api开始的请求都被代理

#### 多个路径匹配 ####

- proxy(['/api', '/ajax', '/someotherpath'], {...})

注意：在多个径匹配的时候不能使用通配符。

#### 通配符路径匹配 ####
- proxy('**', {...}) 所有请求都被代理.
- proxy('**/*.html', {...}) 以.html结尾的请求都被代理
- proxy('/*.html', {...}) 路径为根目录下html文件的请求被代理
- proxy('/api/**/*.html', {...}) 在/api路径下以.html结尾的请求被代理
- proxy(['/api/**', '/ajax/**'], {...}) /api路径与ajax路径的请求被代理
- proxy(['/api/**', '!**/bad.json'], {...}) /api路径下所有不是对bad.json的请求被代理

#### 自定义匹配 ####

	/**
	 * @return {Boolean}
	 */
	var filter = function(pathname, req) {
	  return pathname.match('^/api') && req.method === 'GET'
	}

	var apiProxy = proxy(filter, { target: 'http://www.example.org' })

### WebSocket ###

	// verbose api
	proxy('/', { target: 'http://echo.websocket.org', ws: true })

	// shorthand
	proxy('http://echo.websocket.org', { ws: true })

	// shorter shorthand
	proxy('ws://echo.websocket.org')



