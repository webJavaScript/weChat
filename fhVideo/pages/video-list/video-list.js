// pages/video-list/video-list.js
var util = require('../../utils/util.js');
var fhv_config = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    PAGENUM: 10,
    currentPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getVideoList();
  },
  onShow: function() {
    this.setData({
      departmentId: fhv_config['disease-info'].dmId,
      diseaseId: fhv_config['disease-info'].dsId,
      videoListTitle: fhv_config['disease-info'].dsName,
    });
    this.getVideoList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('>>> 当前获取的页面： ', this.data.currentPage);
    if(this.data.currentPage * this.data.PAGENUM > this.data.total){
      util.moreToast();
      return;
    }
    this.getVideoListNextPage(this.data.currentPage + 1);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true
    })
    return {
      title: this.data.videoListTitle
    }
  },
  showVideoDetail: function(ev) {
    var detailUrl = "?id=" + ev.currentTarget.dataset.illnessId;
    wx.navigateTo({
      url: '../detail/detail' + detailUrl,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 获取疾病视频列表
   * 以下两种情况使用storage中的视频列表数据
   * 1.小程序中有videoList缓存，且缓存了要查找的疾病
   * 2.再次打开小程序，用户使用tabBar进入视频列表时
   * *缓存中只缓存了一种疾病的列表
   * *缓存的数据为空时，删除缓存并请求网络数据
   * 
   * 网络数据
   * 请求网络数据，获取到的视频列表为空时，返回首页
   * 有数据时，展示列表数据，并缓存
   * 
   */
  getVideoList: function() {
    var dmid = this.data.departmentId;
    var dsid = this.data.diseaseId;
    var cpn = this.data.currentPage;
    var _this = this;
    wx.setNavigationBarTitle({
      title: fhv_config['disease-info'].dsName
    })
    // 本地数据
    try {
      var list = wx.getStorageSync('videoList');
      if(!!list) {
        if(list.disease_id == this.data.diseaseId) {
          this.setData({
            videoList: list.data,
            total: list.total,
            currentPage: list.cpn
          }, function() {
            if(!_this.data.videoList.length) {
              wx.setStorageSync('videoList', null);
              _this.getVideoList();
            }
          });
          console.log('video list data from storage');
          return;
        }
      }
    } catch(err) {
      console.log('get video list storage failed: ', err);
    }
    util.loadingToast();
    // 网络数据
    wx.request({
      url: fhv_config["fh-config"]["requestUrl"] + "video/api/getlist",
      data: {
        page: cpn,
        department_id: dmid,
        disease_id: dsid,
        pagesize: this.data.PAGENUM,
        fhNow: new Date().getTime()
      },
      method: 'GET', 
      success: function(res){
        var result = res.data.data || {};
        wx.hideToast();
        _this.setData({
          videoList: _this.mergeData([], result.list),
          total: result.total,
          currentPage: cpn
        }, function() {
          console.log('pages/video-list videoList length:', _this.data.videoList.length);
          if(!_this.data.videoList.length) {
            wx.showToast({
              title: "数据加载失败",
              duration: 2000,
              icon: 'none',
              success: function() {
                wx.setStorageSync('videoList', null);
                wx.switchTab({
                  url: '../index/index'
                })
              }
            })
          }
        });
        // 视频列表保存到storage
        try{
          wx.setStorageSync('videoList', {
            data: _this.data.videoList,
            disease_id: _this.data.diseaseId,
            cpn: cpn,
            total: result.total
          })
        }catch(err) {
          console.log('storage videoList failed: ', err);
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  /**
   * 获取更多疾病视频
   */
  getVideoListNextPage: function(currentPageNum) {
    var dmid = this.data.departmentId;
    var dsid = this.data.diseaseId;
    var cpn = currentPageNum;
    var _this = this;
    wx.request({
      url: fhv_config["fh-config"]["requestUrl"] + "video/api/getlist",
      data: {
        page: cpn,
        department_id: dmid,
        disease_id: dsid,
        pagesize: this.data.PAGENUM,
        fhNow: new Date().getTime()
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        var result = res.data.data;
        _this.setData({
          videoList: _this.mergeData(_this.data.videoList, result.list),
          currentPage: cpn
        });
        // 视频列表保存到storage
        try{
          wx.setStorageSync('videoList', {
            data: _this.data.videoList,
            disease_id: _this.data.diseaseId,
            cpn: cpn,
            total: result.total
          })
        }catch(err) {
          console.log('storage videoList failed: ', err);
        }
      },
      fail: function(err) {
        // fail
        console.log('get more video failed: ', err);
      }
    })
  },
  mergeData: function(pData, kData) {
    var newData = [];
    if(!Array.isArray(pData)) {
      for(var key in pData) {
        newData.push(pData[key]);
      }
    } else {
      newData = pData;
    }
    for(var key in kData) {
      newData.push(kData[key]);
    }
    return newData;
  }
})