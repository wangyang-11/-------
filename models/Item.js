// 模型文件
// 引入数据库
const mongoose = require('mongoose')

// 定义模型字段有哪些
const schema = new mongoose.Schema({
  // 模型为name，类型是字符串
  name:{type:String},
  icon:{type:String},
})


// 导出mongoose模型
module.exports = mongoose.model('Item',schema)