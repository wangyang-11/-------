// 模型文件
// 引入数据库
const mongoose = require('mongoose')

// 定义模型字段有哪些
const schema = new mongoose.Schema({
  name:{type:String},
  items:[{
    image:{type:String},
    url:{type:String},
  }]
})


// 导出mongoose模型
module.exports = mongoose.model('Ad',schema)