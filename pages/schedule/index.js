import AV from '../../lib/av-weapp-min'

Page({
  data: {
    week: 0,
    page_title: '赛程',
    matches: [],
    data: [],
    pageIndex: 0,
    pageSize: 10,
    team_color: getApp().globalData.team_color,
    isEmpty: false
  },
  groupBy (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x['attributes'][key]] = rv[x['attributes'][key]] || []).push(x);
      return rv;
    }, {});
  },
  onLoad() {
    this._render()
  },

  _render() {
    wx.showNavigationBarLoading()
    new AV.Query('Matches')
      .descending('date')
      .limit(this.data.pageSize)
      .skip(this.data.pageIndex * this.data.pageSize)
      .find()
      .then((data) => {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        this.setData({
          data: this.data.data.concat(data),
          matches: this.groupBy(this.data.data.concat(data), 'date'),
          isEmpty: false
        })
      })
  },
  onReachBottom() {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    })
    this._render()
  },
  changeWeek(event) {
    this.setData({
      week: event.target.dataset.week
    })
    this._render()
  },

  onPullDownRefresh() {
    this.setData({
      pageIndex: 0
    })
    this.setData({
      data: [],
      matches: [],
      isEmpty: false
    })


    this._render()
  },

  onShareAppMessage() {
    return {
      title: '赛程'
    }
  }
})
