Component({
  properties: {
    url: {
      type: String,
      value: '/pages/schedule/index',
    }
  },

  data: {
    showShareButton: true
  },

  ready() {
    if (getCurrentPages().length == 1) {
      this.setData({
        showShareButton: false
      })
    }
  }
})
