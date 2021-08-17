// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // 限制数量
  let num = event.num;
  // 下拉加载数据
  let page = event.page;
  return await db.collection("mydatabase").skip(page).limit(num).get()
}