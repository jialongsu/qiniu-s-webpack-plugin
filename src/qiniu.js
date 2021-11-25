const qiniu = require('qiniu');
const path = require('path');
const {log} = require('./utils');

class Qiniu {
  options = {
    accessKey: '', 
    secretKey: '',
    bucket: '',
  };

  constructor(options) {
    const {accessKey, secretKey, bucket} = options;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const _options = {
      scope: bucket,
    };
    const putPolicy = new qiniu.rs.PutPolicy(_options);
    const config = new qiniu.conf.Config();
    this.options = options;
    this.uploadToken=putPolicy.uploadToken(mac);
    this.formUploader = new qiniu.form_up.FormUploader(config);
    this.bucketManager = new qiniu.rs.BucketManager(mac, config);
  }

  putFile(key, filePath) {
    const putExtra = new qiniu.form_up.PutExtra();

    return new Promise((resolve, reject) => {
      this.formUploader.putFile(this.uploadToken, key, filePath, putExtra, function (respErr,
        respBody, respInfo) {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode == 200) {
          resolve();
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          reject(respBody);
        }
      });
    });
  }

  getResouceList(prefix) {
    const {bucket} = this.options;

    var options = {
      // limit: 10,
      prefix
    };

    log('🗓   正在获取历史数据...');
    return new Promise((resolve, reject) => {
      this.bucketManager.listPrefix(bucket, options, function (err, respBody, respInfo) {
        if (err) {
          throw err;
        }
        if (respInfo.statusCode == 200) {
          const resourceList = respBody.items.map((item) => item.key);
          log('👏  获取历史数据成功，正在对比文件...\n');
          resolve(resourceList);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          reject(respBody);
        }
      });
    });
  }

  batchDeleteFile(filenameAry) {
    const {bucket} = this.options;
    var deleteOperations = [];

    if(filenameAry && filenameAry.length > 1){
      deleteOperations = filenameAry.map((filename) =>  qiniu.rs.deleteOp(bucket, filename));
    }

    log('🤡  正在删除文件...');
    return new Promise((resolve, reject) => {
      this.bucketManager.batch(deleteOperations, function (err, respBody, respInfo) {
        if (err) {
          throw err;
        } else {
          log('👏  删除完成！\n');
          resolve();
        }
      });
    });
  }
}

module.exports = Qiniu;