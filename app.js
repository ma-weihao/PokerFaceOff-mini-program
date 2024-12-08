// app.js
App({
  onLaunch() {
    // Initialize user data
    this.globalData.userInfo = wx.getStorageSync('userInfo') || null;
    this.globalData.currentRoom = wx.getStorageSync('currentRoom') || null;
    
    // Login
    wx.login({
      success: res => {
        this.globalData.openid = res.code;
      }
    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    currentRoom: null,
    // Available poker cards
    pokerCards: [0, 1, 3, 5, 8, 13, -2] // -2 represents "skip"
  }
})
