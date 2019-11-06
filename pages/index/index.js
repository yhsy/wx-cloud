//index.js
//获取应用实例
const app = getApp()

// 获取云数据库实例
const db = wx.cloud.database();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 判断是否已登录
    const userInfo = app.globalData.userInfo;

    if (userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // // 在没有 open-type=getUserInfo 版本的兼容处理
      // wx.getUserInfo({
      //   success: res => {
      //     app.globalData.userInfo = res.userInfo
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // })
      // this.getUserInfo()
    }
  },
  // 获取用户个人信息
  getUserInfo: function(e) {
    // 使用云函数
    wx.cloud.callFunction({
      name: 'logins',
      data: {
        a: 10,
        b: 15
      },
      success: (res) => {
        console.log(res)
        // 用户openid
        // console.log(res.result.info.OPENID)
        // 通过云函数拿到用户的openid
        const openId = res.result.info.OPENID
        // 用户信息里面加上openid
        e.detail.userInfo.openid = openId;

        // 全局存储
        app.globalData.userInfo = e.detail.userInfo
        // 当前文件存储
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        // 浏览器本地存储-同步
        wx.setStorageSync('userInfo', e.detail.userInfo)
      }
    })
    // console.log(e)
    // // 需要用户的openid,每个用户唯一标识--借助云函数获取openid
    // app.globalData.userInfo = e.detail.userInfo
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   hasUserInfo: true
    // })
  },
  // 添加商品
  addMall(){
    wx.showToast({
      title: '添加',
    })
    db.collection('emall').add({
      data: {
        title: '商品1',
        price: 18,
        tags: ['books', 'food']
      },
      success: (res) => {
        console.log(res)
        wx.showToast({
          title: '添加商品成功'
        })
      }
    })
  }
})
