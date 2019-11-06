//index.js
//获取应用实例
const app = getApp()

// 获取云数据库实例
const db = wx.cloud.database();

// 获取当前的时间戳
import { unixTime } from '../../utils/util.js'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarImg: ''
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
    // wx.showToast({
    //   title: '添加',
    // })
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
  },
  // 选择图片
  // 现在本地选择图片
  chooseImg(){
    // 本地选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:(res) => {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        // console.log(tempFilePaths)
        // console.log(typeof tempFilePaths)
        const arrPath = tempFilePaths.split('.')
        // 图片格式-图片扩展名(png/jpg)
        const extName = arrPath[3];
        // unix时间戳
        const utime = unixTime();
        // 图片格式
        // console.log(arrPath[3])

        // 本地预览
        // this.setData({
        //   avatarImg: tempFilePaths
        // })

        // 图片名称(时间戳+图片格式)
        const fName = utime + '.' + extName;
        // console.log(fName)

        // 上传图片到指定目录
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: `emall/img/${fName}`,
          // 指定要上传的文件的小程序临时文件路径
          filePath: tempFilePaths,
          // 成功回调
          success: (res) => {
            console.log(res)
            // 获取云文件ID
            console.log(res.fileID)

            // 通过云文件ID获取图片真实url地址
            wx.cloud.getTempFileURL({
              fileList: [res.fileID],
              success: (res) => {
                console.log(res)
                // get temp file URL
                console.log(res.fileList)
                // console.log(res.fileList[0].tempFileURL)
                this.setData({
                  avatarImg: res.fileList[0].tempFileURL
                })
              },
              fail: (err) => {
                console.log(err)
                // handle error
              }
            })

          },
          fail: err => {
            console.log(err)
            // handle error
          }
        })

      }
    })
  },
  // 上传图片
  uploadImg(){
    wx.showToast({
      title: '上传图片',
    })


  }
})
