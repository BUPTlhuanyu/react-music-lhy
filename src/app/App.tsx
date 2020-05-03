import React, { Component } from 'react'

import renderRoutes from 'src/app/router'
// 这里可以通过获取外部数据鉴权，然后传递相关的权限信息给renderRoutes来渲染不同的routes逻辑

class App extends Component {
  render() {
    return (
      renderRoutes()
    );
  }
}

export default App;