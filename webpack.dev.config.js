const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
//     template:'!!ejs-loader!./template.html',
// //     filename:'dist/index.html'
// });
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config');

// commonConfig.devServer = {
//     // contentBase: path.join(__dirname,'./dist'),
//     // publicPath:'/dist/', 
//     hot:true,
//     // inline:true,
//     historyApiFallback:true //解决二级路由下刷新页面显示异常问题
// }
// commonConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
// commonConfig.plugins.push(HtmlWebpackPluginConfig);
// config.plugins.push(new HtmlWebpackPlugin());
module.exports = merge(commonConfig,{
    //entry: './src/index.tsx',
    devServer:{
        hot: true,
        historyApiFallback: true
    },
    module:{
        rules:[
            {
                test: /\.scss$/,
                // include:[path.join(__dirname,'./../','src')],
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: '!!ejs-loader!./template.html'
        })
    ]
})