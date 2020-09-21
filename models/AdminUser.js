// 模型文件
// 引入数据库
const mongoose = require('mongoose')

// 定义模型字段有哪些
const schema = new mongoose.Schema({
  username: { type: String },
  password: {
    type: String,
    // 编辑界面密码不显示
    select:false,
    set: function (val) {  //或者直接set(){}
    // 散列密码（加密）
      return require('bcrypt').hashSync(val,10)
    }
  },
})


// 导出mongoose模型
module.exports = mongoose.model('AdminUser', schema)