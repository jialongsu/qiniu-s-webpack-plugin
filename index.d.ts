interface Options {
  accessKey: string; // 七牛 Access Key
  secretKey: string; // 七牛 Secret Key
  bucket: string; // 七牛 空间名
  forceDelete: boolean; // 上传文件前，先强制删除之前上传七牛云上的文件
}

declare class QiniuWebpackPlugin {

  constructor( options: Options);
}

export default QiniuWebpackPlugin;