// pages/detail/detail.js
var fhv_config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var fh_passport = require('../../utils/fh_passport.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShare: fhv_config['isShare'],
    videoHeight: parseFloat(util.windowWidth * 9 / 16) + 'px'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      videoId: options.id,
      videoHeight: parseFloat(util.windowWidth * 9 / 16) + 'px'
    });
    
    wx.getNetworkType({
      success: res => {
        this.autoPlayVideoInNetwork(res.networkType);
      }
    });
    wx.onNetworkStatusChange(res => {
      this.autoPlayVideoInNetwork(res.networkType);
    })
    this.getVideoDetail();
    this.getVideoList();
    wx.showShareMenu({
      withShareTicket: true,
      success: res => {
        console.log('get shareTicket of showShareMenu: ', res);
      }
    });
    if(!this.data.isShare) {
      const pages = getCurrentPages();
      console.log('分享来的吗？', pages);
      if(pages.length <= 1) {
        this.setData({
          isShare: true
        })
      }
    }
    // wx.hideShareMenu();
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var videoInfo = this.data.videoInfo;
    if(res.from == 'button') {
      console.log('click target bind onShareAppMessage:', res.target);
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log(location)
    return {
      title: videoInfo['shorttitle'],
      imageUrl: videoInfo['litpic'] + '_215x172',
      // path: '/pages/detail/detail?isShare=1&id=' + this.data.videoId,
      success: res => {
        console.log('转发成功: ', res);
      }
    }
  },
  switchTabHome: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  getVideoDetail: function() {
    var vid = this.data.videoId;
    var _this = this;
    wx.request({
      url: fhv_config["fh-config"]["requestUrl"] + "video/api/getdetail",
      data: {
        id: vid,
        fhNow: new Date().getTime()
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        var result = res.data.data;
        console.log('video detail: ', result);
        _this.setData({
          videoInfo: result
        })
      },
      fail: function(err) {
        // fail
        console.log(fhv_config["fh-config"]["requestUrl"] + "video/api/getdetail?id=" + vid, err);
      }
    });
  },
  getVideoList: function() {
    try{
      var videoList = wx.getStorageSync('videoList');
      if(!!videoList) {
        this.setData({
          videoList: videoList.data
        })
      } else {
        console.log('详情页 > 获取videoList失败!');
      }
    } catch(err) {
      console.log('详情页 > 获取videoList失败: ', err);
    }
  },
  showVideoDetail: function(ev) {
    var detailUrl = "?id=" + ev.currentTarget.dataset.illnessId;
    wx.navigateTo({
      url: './detail' + detailUrl,
    })
  },
  autoPlayVideoInNetwork: function(type) {
    var autoplay = type == 'wifi';
    util.getNetworkType(type);
    this.setData({
      videoAutoPlay: autoplay
    })
  },
  videoPlay: function() {
    wx.getNetworkType({
      success: res => {
        this.autoPlayVideoInNetwork(res.networkType);
      }
    });
    wx.onNetworkStatusChange(res => {
      this.autoPlayVideoInNetwork(res.networkType);
    })
  },
  linkPay: function() {
    this.setData({
      showPayLink: true
    })
  },
  linkPayMent: function(ev){
    var target = ev.target;
    console.log('target: ', target);
    var authorize = wx.getStorageSync('authorize');
    if(authorize) {
      var appSalt = wx.getStorageSync('appSalt');
      if(appSalt.appid === 'video'){
        if(appSalt.openid) {
          var time_stamp = (+new Date()).toString().slice(0, -3);
          var nonce_str = Math.random().toString(36).substr(2, 32);
          var signString = 'appId=wxb24ece1d8fe0a938&nonceStr=' + nonce_str + '&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=' + time_stamp;
          var pay_sign = '1234567890' || MD5(signString + '&key=' + fh_passport.payKey).toUpperCase();
          wx.requestPayment({
            'timeStamp': time_stamp,
            'nonceStr': nonce_str,
            'package': 'prepay_id=wx2017033010242291fcfe0db70013888888',
            'signType': 'MD5',
            'paySign': pay_sign,
            'success':function(res){
              console.log('支付成功:', res);
            },
            'fail':function(res){
              console.log('支付失败:', res);
            }
         });
         return;
        }
      }
    }

    fh_passport.init(() => {
      this.linkPayMent(ev);
      this.setData({
        showPayLink: false
      })
    }, err => {
      // 登录失败
      
    });
  }
})