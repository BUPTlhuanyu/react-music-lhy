这里用到happypack结合create-react-app进行多线程打包，从效果来看，并没有提升打包速度。这里有一个问题就是postcss与happypack有冲突，无法再new HappyPack中为postcss传入一个函数，作为plugins的值，解决办法是添加postcss.config.js。具体请看项目代码，这里主要贴出一些关键代码：

# webpack.config.withhappypack.js的改动 #

### 1、先在文件顶部引入happypack： ###

const HappyPack = require('happypack');

### 2、然后在module中oneof中将相应的规则改变为如下代码 ###

           {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: "happypack/loader?id=sassRegex",
              sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
              test: sassModuleRegex,
              use: "happypack/loader?id=sassModuleRegex"
            },



### 3、最后在webpack.config.withhappypack.js的plugins中添加： ###

      new HappyPack({
          id:"sassRegex",
          loaders:
              getStyleLoaders(
                  {
                      importLoaders: 2,
                      sourceMap: isEnvProduction && shouldUseSourceMap,
                  },
                  'sass-loader'
              )
        }),
        new HappyPack({
            id:"sassModuleRegex",
            loaders:
                getStyleLoaders(
                    {
                        importLoaders: 2,
                        sourceMap: isEnvProduction && shouldUseSourceMap,
                        modules: true,
                        getLocalIdent: getCSSModuleLocalIdent,
                    },
                    'sass-loader'
                )
        }),

# postcss.config.js #

	const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
	const postcssPresetEnv = require('postcss-preset-env');
	module.exports = {
	    // parser: 'sugarss',
	    // sourceMap: true,
	    ident: 'postcss',
	    // happypack 只接受纯对象，所以改成这样子
	    plugins: [
	        postcssFlexbugsFixes,
	        postcssPresetEnv({
	            autoprefixer: {
	                flexbox: 'no-2009',
	            },
	            stage: 3,
	        })
	    ]
	}