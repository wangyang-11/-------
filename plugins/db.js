// module.exports导出的是一个函数，接收的是参数APP
module.exports = app => {
  const mongoose = require('mongoose')
  mongoose.set('useFindAndModify', false)  //修复控制台报错
  // 连接数据库
  mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba',{
    // 连接的参数必须要加上
    useNewUrlParser:true
  })
}