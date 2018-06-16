import AV from './lib/av-weapp-min.js'

AV.init({
  appId: "La05PTS8ResiAVfEbhHVjKpX-gzGzoHsz",
  appKey: "546w8UMaA5wulN316MSRVWoB"
})
//app.js
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '更新失败',
        content: '网络问题，请稍后再试（不影响应用使用）。',
        showCancel: false
      })
    })
  },
  globalData: {
    team_color: { "MIL": "00471B", "GSW": "FDB927", "MIN": "005083", "MIA": "98002E", "ATL": "E13A3E", "BOS": "008348", "DET": "006BB6", "NYK": "006BB6", "EST": "00559A", "WST": "EC003D", "DEN": "4D90CD", "DAL": "061922", "BKN": "061922", "POR": "061922", "OKC": "007DC3", "TOR": "CE1141", "CHI": "CE1141", "SAS": "061922", "CHA": "1D1160", "UTA": "002B5C", "CLE": "860038", "HOU": "CE1141", "WAS": "002B5C", "LAL": "FDB927", "PHI": "ED174C", "MEM": "7399C6", "LAC": "ED174C", "SAC": "724C9F", "ORL": "007DC5", "PHX": "E56020", "IND": "FFC633", "NOP": "002B5C" }
  }
})