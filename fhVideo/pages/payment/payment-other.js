// pages/payment/payment-other.js
var fhv_config = require('../../utils/config.js');
var util = require('../../utils/util.js');
var fh_passport = require('../../utils/fh_passport.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_fee: 2000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  linkPayMent: function (ev) {
    var target = ev.target;
    var total_fee = target.dataset['payMoney'] * 100;
    var authorize = wx.getStorageSync('authorize');
    wx.showLoading({title: '支付中…'});
    if (authorize) {
      var appSalt = wx.getStorageSync('appSalt');
      const payMentData = this.data.payMentData;
      if (appSalt.appid === 'video') {
        if (appSalt.openid && !!payMentData) {
          wx.requestPayment({
            'timeStamp': payMentData.timeStamp,
            'nonceStr': payMentData.nonceStr,
            'package': 'prepay_id=' + payMentData.package,
            'signType': 'MD5',
            'paySign': payMentData.paySign,
            'success': res => {
              console.log('支付成功:', res);
              this.setData({
                payMentData: null
              });
              wx.hideLoading();
              wx.showLoading({title: '支付成功'});
              setTimeout(this.closePay, 1000);
            },
            'fail': err => {
              console.log('支付失败:', err);
              if (/fail cancel/.test(err['errMsg'])) {
                this.setData({
                  payMentData: null
                });
              }
              wx.hideLoading();
              wx.showLoading({title: '支付失败'});
              setTimeout(wx.hideLoading, 1000);
            }
          });
          return;
        }
      }
    }

    fh_passport.init(total_fee, (userInfo, payMentData) => {
      this.setData({
        payMentData
      });
      this.linkPayMent(ev);
    }, err => {
      // 登录失败
      wx.hideLoading();
      wx.showLoading({title: '支付失败'});
      setTimeout(wx.hideLoading, 1000);
    });
  },
  handlerPayInput: function(ev){
    var value = ev.detail.value;
    if(value <= this.data.total_fee) {
      this.setData({
        payMoney: ev.detail.value,
        valide_total_fee: false
      });
    } else {
      this.setData({
        valide_total_fee: true
      })
    }
  },
  handlerMessageInput: function(ev){
    this.setData({
      message: ev.detail.value
    })
  }
})