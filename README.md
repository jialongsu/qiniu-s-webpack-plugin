# qiniu-s-webpack-plugin

将打包好的静态资源上传至七牛

## 安装

```sh
npm install -D qiniu-s-webpack-plugin

or 

yarn add -D qiniu-s-webpack-plugin
```

## 使用

```js
const QiniuWebpackPlugin = require('qiniu-s-webpack-plugin');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js',
  },
  plugins: [
    new QiniuWebpackPlugin({
      ...
    })
  ],
};
```

## Options

| Name | Type | Default| Required| Description |
| --- | --- | --- | --- | --- |
|  accessKey   |  string   |  ''   |   true  |  七牛 Access Key   |
|  secretKey   |  string   |  ''  |  true   |  七牛 Secret Key   |
|  bucket   |  string   |  ''   |   true  |  七牛 空间名   |
|  forceDelete   |  boolean   |  false   |  false   |  上传文件前，先强制删除之前上传七牛云上的文件   |
