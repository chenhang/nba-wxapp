import AV from '../../lib/av-weapp-min'
import F2 from '../../f2-canvas/lib/f2';

Page({
  data: {
    match: {},
    team_color: getApp().globalData.team_color,
    started: false,
    drawPts: {
      lazyLoad: true
    },
    drawFourFactor: {
      lazyLoad: true
    },
    drawShotLogHome: {
      lazyLoad: true
    },
    drawShotLogAway: {
      lazyLoad: true
    }
  },

  onLoad(options) {
    wx.showNavigationBarLoading()
    new AV.Query('Matches')
      .equalTo('id', options.id)
      .find()
      .then((data) => {
        const team_colors = data[0].attributes.team_colors
        this.setData({
          match: data[0]
        })

        this.onShareAppMessage = () => ({
          title: `${data[0].attributes.teams[0]} vs ${data[0].attributes.teams[1]}`
        })
        this.ptsArea = this.selectComponent('#points-area');
        this.ptsArea.init((canvas, width, height) => {
          const source = data[0].attributes.vs_pts;
          const chart = new F2.Chart({
            el: canvas,
            width,
            height
          });
          chart.source(source)
          chart.axis('x', false)
          chart.scale('Home Lead', {
            max: data[0].attributes.max_lead,
            min: -data[0].attributes.max_lead
          });
          chart.tooltip({
            triggerOff: 'touchend',
          })
          chart.interval().position('x*Home Lead').color('Home Lead', function (y) {
            if (y > 0) {
              return team_colors[data[0].attributes.teams[1]]
            } else {
              return team_colors[data[0].attributes.teams[0]]
            }
          });
          chart.render();
          return chart;
        });
        this.fourFactorBar = this.selectComponent('#four-factor-bar');
        this.fourFactorBar.init((canvas, width, height) => {
          const source = data[0].attributes.four_factors;
          console.log(source)
          const chart = new F2.Chart({
            el: canvas,
            width,
            height
          });
          chart.source(source)
          chart.legend(false)
          chart.tooltip({
            triggerOff: 'touchend',
            onChange: function (obj) {
              obj.items.map(item => {
                const { name, value, origin } = item;
                if (origin.category == 'OffRtg') {
                  item.value = Math.abs(origin.origin_value) + " (>=" + Math.round(Math.abs(value) * 1000) / 10 + "%)";
                } else {
                  item.value = Math.round(Math.abs(origin.origin_value) * 1000) / 10 + "% (>=" + Math.round(Math.abs(value) * 1000) / 10 + "%)";
                }
              });
            }
          })
          chart.scale('value', {
            max: 1,
            min: -1
          });
          chart.coord({
            transposed: true
          });
          chart.axis('category', {
            line: F2.Global._defaultAxis.line,
            grid: null
          });
          chart.axis('value', {
            line: null,
            grid: F2.Global._defaultAxis.grid,
            label: function label(text, index, total) {
              var textCfg = {};
              if (index === 0) {
                textCfg.textAlign = 'left';
              } else if (index === total - 1) {
                textCfg.textAlign = 'right';
              }
              // textCfg.text = (text + "").replace('-', '')
              return textCfg;
            }
          });
          chart.interval().position('category*value').color('Team', function (team) {
            return team_colors[team]
          }).adjust('stack');
          chart.render();
          return chart;
        });
        this.shotlogAway = this.selectComponent('#shotlog-0');
        this.shotlogAway.init((canvas, width, height) => {
          const source = data[0].attributes.shotlog[1];
          const chart = new F2.Chart({
            el: canvas,
            width,
            height
          });
          chart.coord('polar', {
            transposed: true,
            endAngle: 2 * Math.PI,
            startAngle: Math.PI / 2,
            innerRadius: 0.3
          });
          chart.source(source, {
            percent: {
              max: 100
            }
          })
          chart.axis('name', {
            grid: {
              lineDash: null,
              type: 'arc'
            },
            line: null,
            label: {
              fontSize: 10,
            }
          });
          chart.axis('percent', false);
          chart.tooltip({
            triggerOff: 'touchend',
          });
          chart.interval().position('name*percent').color(team_colors[data[0].attributes.teams[1]]);
          chart.render();
          return chart;
        });

        this.shotlogHome = this.selectComponent('#shotlog-1');
        this.shotlogHome.init((canvas, width, height) => {
          const source = data[0].attributes.shotlog[0];
          const chart = new F2.Chart({
            el: canvas,
            width,
            height
          });
          console.log(source)
          chart.coord('polar', {
            transposed: true,
            endAngle: 2 * Math.PI,
            startAngle: Math.PI / 2,
            innerRadius: 0.3
          });
          chart.source(source, {
            percent: {
              max: 100
            }
          })
          chart.axis('name', {
            grid: {
              lineDash: null,
              type: 'arc'
            },
            line: null,
            label: {
              fontSize: 10,
            }
          });
          chart.axis('percent', false);
          chart.tooltip({
            triggerOff: 'touchend',
          });
          chart.interval().position('name*percent').color(team_colors[data[0].attributes.teams[0]]);
          chart.render();
          return chart;
        });
        
        
        wx.hideNavigationBarLoading()

      })
  },

  onShareAppMessage() {
    return {
      title: '赛后统计'
    }
  }
})
