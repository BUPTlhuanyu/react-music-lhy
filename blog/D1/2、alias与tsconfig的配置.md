## alias配置

#### tsconfig中的baseurl为'.'

##### 首先在paths.js写好路径，如下
```
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
    //配置别名appComponents
  appComponents: resolveApp('src/app/components'),
  appCommon:resolveApp('src/common'),
  appApi:resolveApp('src/api'),
  appActions: resolveApp('src/app/actions'),
  appReducers: resolveApp('src/app/reducers'),
  appReusablecomponents: resolveApp('src/app/reusablecomponents'),
  appStore: resolveApp('src/app/store'),

  appRouter:resolveApp('src/router'),
  appTsConfig: resolveApp('tsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json'))
};
```

##### 然后配置webpack.config.js中的alias

```
          'src':paths.appSrc,
          'components':paths.appComponents,
          'common':paths.appCommon,
          'api':paths.appApi,
          'reuse':paths.appReusablecomponents,
          'actions':paths.appActions,
          'reducers':paths.appReducers,
          'store':paths.appStore
```

##### tsconfig的配置
tsconfig.json文件下配置baseUrl与paths
```
    "paths":{
      "src/*":["src/*"],
      "components/*":["src/app/components/*"],
      "common/*":["src/common/*"],
      "api/*":["src/api/*"],
      "reuse/*":["src/app/reusablecomponents/*"],
      "actions/*":["src/app/actions/*"],
      "reducers/*":["src/app/reducers/*"],
      "store/*":["src/app/store/*"]
    }
```

上述配置的含义是：当页面引用的时候解析的基础路径是tsconfig文件为基础的“./”路径，该项目中也就是项目根目录，paths表示路径映射，相对于baseUrl。
例子：

```
    app.tsx
    import Header from 'components/header/Header'
    /*等价于下面*/
    import Header from 'src/app/components/header/Header'
    /*也等价于下面*/
    import Header from './components/header/Header'
```

#### tsconfig中的baseurl为'src'
只需在在tsconfig.json文件下配置baseUrl与paths
```
    "baseUrl":"src",
    "paths":{
      "src/*":["./*"],
      "components/*":["./app/components/*"],
      "common/*":["./common/*"],
      "api/*":["./api/*"],
      "reuse/*":["./app/reusablecomponents/*"],
      "actions/*":["./app/actions/*"],
      "reducers/*":["./app/reducers/*"],
      "store/*":["./app/store/*"]
    }
```

### 总结
在webpack与typescript结合使用的情况下，需要配置alias以及tsconfig下的baseUrl与paths，并且paths中配置某个文件夹下的路径的时候两处的“/*”一定不能省略。
```
"components/*":["src/app/components/*"]
```