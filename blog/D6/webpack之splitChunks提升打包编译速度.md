在`react-music-lhy\config\webpack.config.withhappypack.js`中optimization.splitChunks中加入如下代码，将第三方库react以及react-dom单独提取到vender这个chunk中。增加了chunks数量，异步编译打包的chunk数量增加，速度提升不少。

	  cacheGroups: {
              vendor: {
                  test: /[\\/]node_modules[\\/](react|react-dom|redux|rect-redux|react-transition-group|react-router)[\\/]/,
                  name: 'vendor',
                  chunks: 'all',
              }
      }


