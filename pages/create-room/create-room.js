const app = getApp()

Page({
  data: {
    roomName: '',
    isCreating: false
  },

  onLoad() {
    // Check if user info exists
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '提示',
        content: '请先设置用户信息',
        showCancel: false,
        success: () => {
          wx.navigateBack()
        }
      })
    }
  },

  onRoomNameInput(e) {
    this.setData({
      roomName: e.detail.value
    })
  },

  async createRoom() {
    // Double check user info exists
    if (!app.globalData.userInfo) {
      wx.showToast({
        title: '请先设置用户信息',
        icon: 'none'
      })
      wx.navigateBack()
      return
    }

    if (!this.data.roomName.trim()) {
      wx.showToast({
        title: '请输入房间名称',
        icon: 'none'
      })
      return
    }

    this.setData({ isCreating: true })
    
    try {
      const requestData = {
        room_name: this.data.roomName,
        created_by_openid: app.globalData.openid,
        user_name: app.globalData.userInfo.nickName,
        avatar_url: app.globalData.userInfo.avatarUrl
      }
      console.log('[createRoom] Request:', requestData)

      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/createroom',
          method: 'POST',
          data: requestData,
          success: (res) => {
            console.log('[createRoom] Response:', res)
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(new Error(`Request failed with status ${res.statusCode}`))
            }
          },
          fail: reject
        })
      })

      console.log('[createRoom] Result:', result)
      const { user_id, room_id } = result
      
      // Store room info in global data
      app.globalData.currentRoom = {
        roomId: room_id,
        userId: user_id,
        role: 1 // Host
      }
      
      // Navigate to room page
      wx.redirectTo({
        url: `/pages/room/room?room_id=${room_id}`
      })
    } catch (error) {
      console.error('[createRoom] Error:', error)
      wx.showToast({
        title: '创建房间失败',
        icon: 'none'
      })
    } finally {
      this.setData({ isCreating: false })
    }
  }
}) 