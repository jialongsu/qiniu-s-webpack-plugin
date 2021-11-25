const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const QiniuWebpackPlugin = require('../index');

const accessKey = 'VYwtO-X8RlQhEGP-bSCt72X5O0A5hAkEtJvuPI9s';
const secretKey = 'lfNL6s3Y5RnWQ0gr7dREGIHoBH_-PCCsZOSuv_yI';
const bucket = 'livelab-website-assets';

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash:8].js',
    clean: true,
    publicPath: 'http://webassets.livelab.com.cn/example/'
  },
  devServer:{
    hot: true,
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
  //     {
  //       test: /\.js$/,
  //       include: path.resolve(__dirname, './src'),
  //       use: [
  //         {
  //           loader: 'babel-loader',
  //           options: {
  //             presets: [
  //               "@babel/preset-env",
  //             ],
  //             plugins: [
  //               [
  //                 '@babel/plugin-transform-runtime',
  //                 {
  //                   // 将es6转为es5时会有很多通用的函数被内联到文件中，
  //                   // 如：使用class 会有一个classCallCheck的函数，如果在多个文件中使用class，那么这个函数都会重复存在于这些文件中
  //                   // 将helpers设置true，则会将这些通用函数通过模块引用的方式来使用，减少了不必要的代码
  //                   "helpers": true, 
  //                   // corejs使用runtime-corejs来开启polyfill
  //                   "corejs": 3,
  //                   // 使用generate时，会在全局环境上注入generate的实现函数，这样会造成全局污染
  //                   // regenerator为true，通过模块引入的方式来调用generate
  //                   "regenerator": true,
  //                 }
  //               ]
  //             ],
  //           }
  //         },
  //       ],
  //     },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset', 
        generator: {
          filename: 'image/[name].[contenthash:8][ext][query]'
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.ejs'
    }),
    new QiniuWebpackPlugin({
      accessKey,
      secretKey,
      bucket,
      // forceDelete: true,
    }),
  ],


  devServer: {

  }

}