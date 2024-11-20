require('dotenv').config();
const CommonService = require('./utils'); 

const password = process.env.TWIKOO_PASSWORD;
const twikooUrl = process.env.TWIKOO_URL;

async function backupComments() {
  try {
    // 构建并发送请求
    const response = await CommonService.getPostRequest(password, twikooUrl);
    
    // 检查响应代码并处理数据
    CommonService.checkResponseCode(response);
  } catch (error) {
    console.error('Error during backup:', error);
  }
}

// 调用备份函数
backupComments();