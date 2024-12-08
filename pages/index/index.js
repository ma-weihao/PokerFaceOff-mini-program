// index.js
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },

  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    const hasUserInfo = nickName && avatarUrl && avatarUrl !== defaultAvatarUrl

    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo
    })

    if (hasUserInfo) {
      // Store in globalData when we have complete user info
      app.globalData.userInfo = {
        nickName,
        avatarUrl
      }
    }
  },

  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    const hasUserInfo = nickName && avatarUrl && avatarUrl !== defaultAvatarUrl

    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo
    })

    if (hasUserInfo) {
      // Store in globalData when we have complete user info
      app.globalData.userInfo = {
        nickName,
        avatarUrl
      }
    }
  },

  createRoom() {
    if (!this.data.hasUserInfo) {
      wx.showToast({
        title: '请先设置用户信息',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/create-room/create-room'
    })
  }
})
