// 导出一个函数
module.exports = app => {
  const express = require('express')
  // 引入token模块
  const jwt = require('jsonwebtoken')
  // 引用assert
  const assert = require('http-assert')
  // 引入 用户模型
  const AdminUser = require('../../models/AdminUser')
  // express的一个子路由
  const router = express.Router({
    // 合并url参数
    mergeParams: true
  })
  // 这里要用模型，引入mongoose模型
  // 要匹配动态资源所以下面这句不要了
  // const Category = require('../../models/Category')

  // 创建分类 接口  动态接口把所有categories删掉
  // 创建资源  接口
  router.post('/', async (req, res) => {
    // 创建数据，定义model等于创建的数据
    const model = await req.Model.create(req.body)
    // 发回客户端，让客户端知道完成了，同时创建的数据是什么
    res.send(model)
  })

  // 修改分类 接口
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  // 删除分类 接口
  router.delete('/:id', async (req, res) => {
    // 创建数据，定义model等于创建的数据
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    // 发回客户端，让客户端知道完成了，同时创建的数据是什么
    res.send({
      success: true
    })
  })

  // 资源列表 接口
  router.get('/', async (req, res, next) => {
    // string转为字符串   split以空格分割   pop获取数组的最后一个元素
    const token = String(req.headers.authorization || '').split(' ').pop()
    // 提取token数据
    // 判断token是否存在
    assert(token,401,'请提供jwt token(请先登录)')
    // 顶部引入 jwt = require('jsonwebtoken')模块  jwt.docode方法为解谜不会验证对错  jwt.verify(校验的数据，秘钥)校验     
    const { id } = jwt.verify(token, app.get('secret'))
    // 判断id是否存在
    assert(id,401,'无效的jwt token(请先登录)')
    // req.user表示把user挂载到req上，后面如果需要调用，可以直接调用
    req.user = await AdminUser.findById(id)
    // 判断req.user是否存在
    assert(req.user,401,'请先登录')
    await next()
  }, async (req, res) => {
    const queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    // 执行的方法        populate('parent')关联取出数据因为接口换为通用接口所以写成setOptions(queryOptions)
    const items = await req.Model.find().setOptions(queryOptions).limit(10)
    res.send(items)
  })

  // 获取详情页某一个详情数据的接口
  router.get('/:id', async (req, res) => {
    // 执行的方法
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // rest表示通用类型的接口/:resource匹配动态资源,
  // 中间件的用法：定义这个路由参数
  app.use('/admin/api/rest/:resource', async (req, res, next) => {
    // 转类名，把categories首字母转大写
    const modelName = require('inflection').classify(req.params.resource)
    // 因为动态匹配资源，所以要在url里找
    // 在req上面多挂载一个属性（model），后续就可以使用req.model访问
    req.Model = require(`../../models/${modelName}`)
    // 调用next，处理完之后调用下一个（后续操作）
    next()
  }, router)

  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  // 一定要加upload.single才会有res.file
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // 登录的路由
  app.post('/admin/api/login', async (req, res) => {
    // 解构赋值   等同于  const data = req.body ; const username = data.username
    const { username, password } = req.body
    // 1.根据用户名找用户  密码被散列所以只能通过用户名  找不能通过用户名+密码找

    // findOne表示找一条
    const user = await AdminUser.findOne({
      username: username       //可以简写为一个username
      // .select('+password')找出用户输入的密码
    }).select('+password')
    // asser(判断条件是否存在，错误状态码，返回的信息)代替下面的if
    assert(user,422,'用户不存在')
    // if (!user) {
    //   // 正常情况下是res.send   status(422)表示设定一个状态码这样可以让客户端知道不是正常的200
    //   return res.status(422).send({
    //     message: "用户不存在"
    //   })
    // }
    // 2.校验密码
    // 因为密码是用bcrypt模块加密，所以校验也要用bcrypt  compareSync比较明文和密文是否匹配，返回true /false
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid,422,'密码错误')
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }
    // 3.返回token

    // sign({第一个为要验证的值}，秘钥(自己设置的))
    const token = jwt.sign({ id: user._id }, app.get('secret'))
    // 发给客户端
    res.send({ token })
  })

  // 错误处理函数
  app.use(async(err,req,res,next)=>{
    // console.log(err)
    res.status(err.statusCode || 500).send({
      message:err.message
    })
  })
}