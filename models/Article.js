// 模型文件
// 引入数据库
const mongoose = require('mongoose')

// 定义模型字段有哪些
const schema = new mongoose.Schema({
  // 模型为name，类型是字符串
  // 文章--名称
  // 文章分类可以写多个所以是categories 类型是数组 数组里面表示具体数据类型ObjectId是分类的ID     ref指定要关联的模型是Category
  categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}],
  title:{type:String},
  body:{type:String},
})


// 导出mongoose模型
module.exports = mongoose.model('Article',schema)