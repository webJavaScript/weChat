// pages/index/index.js
var util = require('../../utils/util.js');
var fhv_config = require('../../utils/config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    departments: null,
    sub_departments: null,
    sub_sliceId: ['all'],
    swipers: [{
      indicatorDots: true,
      indicatorColor: "rgba(0,0,0,0.3)",
      indicatorActiveColor: "#000000",
      autoplay: true,
      interval: 3000,
      duration: 500,
      circular: true,
      vertical: false,
      previousMargin: "0px",
      nextMargin: "0px",
      displayMultipleItems: 1,
      skipHiddenItemLayout: false,
      bindchange: null,
      bindanimationfinish: null,
      current: 0,
      currentItemId: "",
      list: [
        {
          src: "https://file.fh21static.com/fhfile1/M00/61/84/oYYBAFpLTyiAVunnAAJfYNU1Zzw19.jpeg",
          text: ''
        },
        {
          src: "https://file.fh21static.com/fhfile1/M00/61/8B/ooYBAFpLTzWAZDehAAJDCAlGkqY03.jpeg",
          text: ''
        },
        {
          src: "https://file.fh21static.com/fhfile1/M00/61/7D/ooYBAFpGHH-AMJTnAAGmFOjpzsg97.jpeg",
          text: ''
        }
      ]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    });
    try {
      const sysInfo = wx.getSystemInfoSync();

    } catch(err) {

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getDepartments();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDepartments();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  getDepartments: function () {
    var sub_sliceId = this.data.sub_sliceId;
    var _this = this;
    var _now = new Date().getTime();
    util.loadingToast(3000);
    if (this.data.hasDepartments) {
      var departments = wx.getStorageSync('departments');
      var isUpdata = departments.lastModefiy == util.formatDate({notFullTime: true});
      // 当日最新数据
      if(isUpdata) {
        this.setData({
          departments: departments.data.data,
          sub_departments: this.setSubDepartmentsData(departments.data.data, sub_sliceId)
        });
        wx.hideToast();
        return;
      }
    }
    wx.request({
      url: fhv_config["fh-config"]["requestUrl"] + "video/api/getdd",
      data: {
        "fhNow": _now
      },
      dataType: 'json',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        var departments = res.data.data;
        _this.setData({
          departments: departments,
          sub_departments: _this.setSubDepartmentsData(departments, sub_sliceId)
        });
        _this.setDiseaseInfo();
        wx.setStorage({
          key: 'departments',
          data: {
            data: res.data,
            lastModefiy: util.formatDate({
              date: !!res.data.servertime ? new Date(res.data.servertime * 1000) : _now,
              notFullTime: true
            })
          },
          success: function (res) {
            // success
            _this.setData({
              hasDepartments: true
            })
          }
        });

        wx.hideToast();
      },
      fail: function (err) {
        // fail
        console.log(fhv_config["fh-config"]["requestUrl"] + "video/api/getdd?fhNow=" + _now, err);
        util.loadingToast();
      }
    })
  },
  // 更多
  showMoreDis: function (ev) {
    var target = ev.currentTarget;
    var showId = target.dataset.diseaseId;
    var sub_sliceId = this.data.sub_sliceId;
    sub_sliceId.push(showId);
    this.setData({
      sub_sliceId: sub_sliceId,
      sub_departments: this.setSubDepartmentsData(this.data.departments, sub_sliceId)
    })
  },
  // 收起
  foldedMoreDis: function (ev) {
    var target = ev.currentTarget;
    var showId = target.dataset.diseaseId;
    var sub_sliceId = this.data.sub_sliceId;
    sub_sliceId.splice(sub_sliceId.indexOf(showId), 1);
    this.setData({
      toViewId: 'dm-id-' + showId,
      sub_sliceId: sub_sliceId,
      sub_departments: this.setSubDepartmentsData(this.data.departments, sub_sliceId)
    })
  },
  //
  getDisList: function (ev) {
    var illIds = ev.currentTarget.dataset.diseaseId.split('_');
    var dmId = illIds[0];
    var dsId = illIds[1];
    var listTitle = ev.currentTarget.dataset.title;
    var getListUrl = "?page=1&department_id=" + dmId + "&disease_id=" + dsId + "&pagesize=10&list_title=" + listTitle;
    
    fhv_config['disease-info'].dmId = dmId;
    fhv_config['disease-info'].dsId = dsId;
    fhv_config['disease-info'].dsName = listTitle;
    // wx.navigateTo({
    wx.switchTab({
      url: '../video-list/video-list',
      fail: err => {
        console.log('to page video-list failed: ', err);
      }
    })
  },
  /**
   * 将departments中的disease处理成数组
   * @dms -> departments
   */
  parseDepartments: function (dms) {
    for (var key in dms) {
      var dis = dms[key];
      dis['disease_info'] = this.JSONValueToArray(dis['disease_info']);
    }
    return dms;
  },
  setSubDepartmentsData: function (dms, sliceDmId) {
    var newdms = this.copyObject(dms);
    for (var key in newdms) {
      var dis = newdms[key];
      var fullDis = dis['disease_info'];
      dis['disease_info'] = this.arraySlice10(this.JSONValueToArray(dis['disease_info']));
      dis['isHide'] = false;
      sliceDmId && sliceDmId.forEach(id => {
        if (id === dis['department_id']) {
          dis['isHide'] = true;
          dis['disease_info'] = this.JSONValueToArray(fullDis);
        }
      });

    }
    return this.parseDepartments(newdms);
    // this.setData({
    //   sub_departments: newdms
    // })
  },
  /**
   * 将json中的值强制写进一个新的数组
   */
  JSONValueToArray: function (json) {
    var newArray = [];
    if (Array.isArray(json)) return json;
    for (var key in json) {
      newArray.push(json[key]);
    }
    return newArray;
  },
  arraySlice10: function (data) {
    return data.slice(0, 11);
  },
  copyObject: function (obj) {
    var newObj = {};
    for (var key in obj) {
      newObj[key] = typeof obj[key] == 'object' ? this.copyObject(obj[key]) : obj[key];
    }
    return newObj;
  },
  /**
   * 打开banner页面 web-view
   * @param {*} ev 
   */
  toImageWebView(ev) {
    // tabBar页面 需要使用switchTab跳转
    // wx.switchTab({
    //   url: '../video-mfh21/video-mfh21'
    // })
    // wx.navigateTo({
    //   url: "../web-view-banner/web-view-banner"
    // })
  },
  /**
   * 设置diseases 的默认信息
   */
  setDiseaseInfo: function() {
    var subDm = this.data.sub_departments;
    var dm0 = subDm[0];
    var dis0 = dm0['disease_info'][0];
    if(!fhv_config['disease-info'].dmId) {
      fhv_config['disease-info'].dmId = dm0.department_id;
    }
    if(!fhv_config['disease-info'].dsId) {
      fhv_config['disease-info'].dsId = dis0.disease_id;
    }
    if(!fhv_config['disease-info'].dsName) {
      fhv_config['disease-info'].dsName = dis0.disease_name;
    }
  }
})