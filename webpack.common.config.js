const path = require('path');
module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    output:{
        path : path.resolve(__dirname,'./dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        // library: 'my-library',
        // libraryTarget: 'umd'
        // publicPath: '/dist/'
    },
    devtool:'source-map',
    // devtool: 'cheap-module-eval-source-map', //dev
    // devtool:'cheap-module-source-map', //prod 
    resolve:{
        extensions:['.ts','.tsx','.js','.json']
    },
    module:{
        rules:[
            {
                test:/\.tsx?$/,
                loader:'ts-loader',
                exclude:/node_modules/
            },
            {
                enforce:'pre',
                test:/\.js$/,
                loader:'source-map-loader'
            }
        ]
    },
    // externals:{
    //     'react':'React',
    //     'react-dom':'ReactDom'
    // },
    plugins:[
    ]
}