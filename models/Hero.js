// 模型文件
// 引入数据库
const mongoose = require('mongoose')

// 定义模型字段有哪些
const schema = new mongoose.Schema({
  // 模型为name，类型是字符串
  // 英雄--名称
  name:{type:String},
  // 英雄--头像
  avatar:{type:String},
  // 英雄详情--称号
  title:{type:String},
  //  英雄的类型（职业）             ref指定要关联的模型
  categories:[{type:mongoose.SchemaTypes.ObjectId,ref:'Category'}],
  // 英雄详情--操作
  scores:{
    difficult:{type:Number},
    skills:{type:Number},
    attack:{type:Number},
    survive:{type:Number},
  },
  // 英雄详情--技能
  skills:[{
    icon:{type:String},
    name:{type:String},
    description:{type:String},
    tips:{type:String},
  }],
  // 出装方式（顺风、逆风）
  items1:[{ type:mongoose.SchemaTypes.ObjectId,ref:'Item'}],
  items2:[{ type:mongoose.SchemaTypes.ObjectId,ref:'Item'}],
  // 使用技巧
  usageTips:{type:String},
  // 对抗技巧
  battleTips:{type:String},
  // 团战思路
  teamTips:{type:String},
  // 英雄关系（搭档）
  partners:[{
    hero:{type:mongoose.SchemaTypes.ObjectId,ref:'Hero'},
    description:{type:String}
  }],
})


// 导出mongoose模型
module.exports = mongoose.model('Hero',schema)