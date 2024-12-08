const app = getApp()

Page({
  data: {
    room: null,
    users: [],
    isHost: false,
    currentUserId: null,
    pokerCards: [],
    selectedCard: null,
    isPolling: false
  },

  onLoad(options) {
    const { room_id } = options
    const currentRoom = app.globalData.currentRoom

    console.log('[room] onLoad:', { options, currentRoom })

    this.setData({
      pokerCards: app.globalData.pokerCards,
      currentUserId: currentRoom?.userId,
      isHost: currentRoom?.role === 1
    })

    // Start polling room status
    this.startPolling(room_id)
  },

  onUnload() {
    this.stopPolling()
  },

  startPolling(roomId) {
    if (this.data.isPolling) return

    this.setData({ isPolling: true })
    this.pollRoomStatus(roomId)
  },

  stopPolling() {
    this.setData({ isPolling: false })
  },

  async pollRoomStatus(roomId) {
    if (!this.data.isPolling) return

    try {
      const requestData = { room_id: roomId }
      console.log('[pollRoomStatus] Request:', requestData)

      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/votestatus',
          method: 'POST',
          data: requestData,
          success: (res) => {
            console.log('[pollRoomStatus] Response:', res)
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(new Error(`Request failed with status ${res.statusCode}`))
            }
          },
          fail: reject
        })
      })

      console.log('[pollRoomStatus] Result:', result)
      this.setData({
        room: result.room,
        users: result.users
      })
    } catch (error) {
      console.error('[pollRoomStatus] Error:', error)
    }

    if (this.data.isPolling) {
      setTimeout(() => this.pollRoomStatus(roomId), 3000)
    }
  },

  async vote(e) {
    const { value } = e.currentTarget.dataset
    
    try {
      const requestData = {
        user_id: this.data.currentUserId,
        vote_value: value
      }
      console.log('[vote] Request:', requestData)

      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/vote',
          method: 'POST',
          data: requestData,
          success: (res) => {
            console.log('[vote] Response:', res)
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(new Error(`Request failed with status ${res.statusCode}`))
            }
          },
          fail: reject
        })
      })

      console.log('[vote] Result:', result)
      this.setData({ selectedCard: value })
    } catch (error) {
      console.error('[vote] Error:', error)
      wx.showToast({
        title: '投票失败',
        icon: 'none'
      })
    }
  },

  async createNewRound() {
    if (!this.data.isHost) return

    try {
      const requestData = {
        room_id: this.data.room.room_id,
        user_id: this.data.currentUserId
      }
      console.log('[createNewRound] Request:', requestData)

      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/nextround',
          method: 'POST',
          data: requestData,
          success: (res) => {
            console.log('[createNewRound] Response:', res)
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(new Error(`Request failed with status ${res.statusCode}`))
            }
          },
          fail: reject
        })
      })

      console.log('[createNewRound] Result:', result)
      this.setData({ selectedCard: null })
    } catch (error) {
      console.error('[createNewRound] Error:', error)
      wx.showToast({
        title: '创建新回合失败',
        icon: 'none'
      })
    }
  },

  async revealVotes() {
    if (!this.data.isHost) return

    try {
      const requestData = {
        room_id: this.data.room.room_id,
        user_id: this.data.currentUserId
      }
      console.log('[revealVotes] Request:', requestData)

      const result = await new Promise((resolve, reject) => {
        wx.request({
          url: 'https://pokerfaceoff-wxjegzlbvo.cn-hangzhou.fcapp.run/reveal',
          method: 'POST',
          data: requestData,
          success: (res) => {
            console.log('[revealVotes] Response:', res)
            if (res.statusCode === 200) {
              resolve(res.data)
            } else {
              reject(new Error(`Request failed with status ${res.statusCode}`))
            }
          },
          fail: reject
        })
      })

      console.log('[revealVotes] Result:', result)
    } catch (error) {
      console.error('[revealVotes] Error:', error)
      wx.showToast({
        title: '显示投票结果失败',
        icon: 'none'
      })
    }
  },

  onShareAppMessage() {
    const shareData = {
      title: `加入房间: ${this.data.room?.room_name}`,
      path: `/pages/room/room?room_id=${this.data.room?.room_id}`
    }
    console.log('[onShareAppMessage]:', shareData)
    return shareData
  }
}) 