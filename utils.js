const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class CommonService {
  static ACCESS_TOKEN = 'accessToken';
  static COLLECTION = 'collection';
  static EVENT = 'event';
  static COMMENT = 'comment';
  static COMMENT_EXPORT_FOR_ADMIN = 'COMMENT_EXPORT_FOR_ADMIN';
  static TWIKOO_COMMENT_JSON = 'twikoo-comment';

  /**
   * 构建请求对象
   *
   * @param {string} password - twikoo 密码
   * @param {string} twikooUrl - twikoo 地址
   * @return {Promise} - Axios promise
   */
  static getPostRequest(password, twikooUrl) {
    const body = CommonService.buildAdminCommentExportParams(CommonService.md5(password));
    return axios.post(twikooUrl, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * MD5 hash function
   *
   * @param {string} data - Data to hash
   * @return {string} - MD5 hash
   */
  static md5(data) {
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * 处理成功的HTTP响应。
   *
   * @param {Object} response - HTTP响应对象，包含服务器返回的数据。
   */
  static checkResponseCode(response) {
    const data = response.data;
    const errorCode = data.code;

    switch (errorCode) {
      case 1024:
      case 1001:
        console.warn(data.message);
        break;
      default:
        CommonService.handleValidData(data, response.data);
        break;
    }
  }

  /**
   * 将 json 内容保存到文件
   *
   * @param {string} content - json 响应内容
   * @return {boolean} - 是否保存成功
   */
  static saveToFile(content) {
    try {
      const jsonData = content;
      const currentDate = new Date().toISOString().split('T')[0];
      const fileNameWithDate = `${CommonService.TWIKOO_COMMENT_JSON}-${currentDate}.json`;
      const dataArray = jsonData.data;

      fs.writeFileSync(fileNameWithDate, JSON.stringify(dataArray, null, 2));
      console.info(`File saved successfully: ${path.resolve(fileNameWithDate)}`);
      return true;
    } catch (error) {
      console.error('Failed to create JSON file:', error);
      return false;
    }
  }
  /**
   * 构建请求参数
   *
   * @param {string} password - twikoo 密码
   * @return {Object} - 请求参数对象
   */
  static buildAdminCommentExportParams(password) {
    return {
      [CommonService.ACCESS_TOKEN]: password,
      [CommonService.COLLECTION]: CommonService.COMMENT,
      [CommonService.EVENT]: CommonService.COMMENT_EXPORT_FOR_ADMIN
    };
  }

  /**
   * 处理有效数据
   *
   * @param {Object} data - 包含待处理数据的对象
   * @param {string} entity - 评论数据内容
   */
  static handleValidData(data, entity) {
    if (data.data && data.data.length > 0) {
      console.log(entity)
      console.info(CommonService.saveToFile(entity) ? 'File has been saved locally' : 'Failed to write or save file');
    } else {
      console.error('Data is empty, please check if there are any comments, or check using Postman');
    }
  }
}

module.exports = CommonService;