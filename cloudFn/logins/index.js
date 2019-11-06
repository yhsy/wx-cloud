// 引入微信云开发SDK开发包
const cloud = require('wx-server-sdk')

// 初始化云函数
cloud.init()

// 测试-加法函数
exports.main = (event) => {
  // 通过云函数获取用户信息(拿到用户的openid)
  const wxInfo = cloud.getWXContext()

  return {
    sum: event.a + event.b,
    info: wxInfo
  }
}

// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }