## alias配置

#### tsconfig中的baseurl为'.'

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