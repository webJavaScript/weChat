// pages/web-view-banner/web-view-banner.js
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewUrls: [
      "http://m.fh21.com.cn/video/view/561072.html",
      "https://m.fh21.com.cn/",
      "http://m.fh21.com.cn/video/view/561045.html",
      "https://m.fh21.com.cn/iask/"
    ],
    imageSrc: "https://m.fh21.com.cn/iask/"
  },
  onLoad: function(options){
    var id = options.id;
    this.setData({
      tabId: id
    })
  },
  onShow: function() {
    console.log('web-view paga iask!');
    if(!this.data.tabId) {
      util.loadingToast(1000);
      wx.reLaunch({
        url: "../tabBar-webView/tabBar-webView?id=iask",
        success: function() {
          wx.hideToast();
        }
      });
    } else {
      util.loadingToast(1000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  
  // },

  
})