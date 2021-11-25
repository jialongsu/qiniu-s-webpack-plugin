
const qiniu = require('qiniu');
const path = require('path');
const fs = require('fs');
const lodash = require('lodash');
const Qiniu = require('./src/qiniu');
const {log} = require('./src/utils');

const PLUGIN_NAME = 'qiniu-s-webpack-plugin';
const projectName = path.basename(process.cwd());

class QiuniuPlugin {
  constructor(options) {
    this.qiniu = new Qiniu(options);
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(PLUGIN_NAME, async (compilation, callback) => {
      const fileNameAry = Object.keys(compilation.assets);
      const buildPath = compilation.options.output.path;

      callback();
      await this.batchUpload(fileNameAry, buildPath);
    });
  }

  async batchUpload(fileNameAry, buildPath) {
    const {bucket} = this.qiniu.options;
    const uploadData = {};

    fileNameAry.forEach((filename, index) => {
      uploadData[`${projectName}/${filename}`] = `${buildPath}/${filename}`;
    });

    const uploadAry = await this.batchDelete(Object.keys(uploadData));
    const len = uploadAry.length 
    const maxIndex = len - 1;

    if(len === 0) {
      log(`😭  没有发现需要上传的文件 \n`);
      return;
    }

    log(`⬆️   将上传 ${len} 个文件`);
    uploadAry.forEach(async (key, i) => {
      const filePath = uploadData[key];

      log(`🚀  正在上传第 ${i + 1} 个文件: ${key}`);
      await this.qiniu.putFile(key, filePath);
      if(maxIndex === i) {
        log(`👏  上传完成！`);
      }
    });

  }

  async batchDelete(uploadFilenameAry) {
    const {forceDelete} = this.qiniu.options;
    const resourceList = await this.qiniu.getResouceList(projectName); // 获取之前上传七牛的文件
    const deleteAry = forceDelete ? resourceList : lodash.difference(resourceList, uploadFilenameAry); // 获取需要先在七牛上删除的文件
    const uploadAry = forceDelete ? resourceList : lodash.difference(uploadFilenameAry, resourceList); // 获取需要上传的文件

    if(deleteAry.length > 1) {
      await this.qiniu.batchDeleteFile(deleteAry); // 删除文件
    }

    return uploadAry;
  }

}

module.exports = QiuniuPlugin;