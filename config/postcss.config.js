/**
 * Created by liaohuanyu on 2019/3/8.
 */
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