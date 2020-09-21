const express = require('express')

// 定义App是expressd的实例
const app = express();

// app.set表示在当前express实例上设置一个变量
// secret变量 qwertyuiop1234值，应该放在一个环境变量里
app.set('secret','qwertyuiop1234')

// 跨域模块
app.use(require('cors')())
// 使用await要引入json中间件
app.use(express.json())

app.use('/uploads',express.static(__dirname + '/uploads'))

// 引用过来是一个函数执行并且(app)传值给
require('./plugins/db')(app)
require('./routes/admin')(app)

// 启动
app.listen(3000,()=>{
  console.log('http://localhost:3000')
})