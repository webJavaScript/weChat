//app.js
let passport = require('./action/passport');
let showLoading = function ({
    title = '加载中...'
} = {}) {
    wx.showToast({
        title,
        icon: 'loading',
        duration: 10000,
        mask: true
    });
};

let loadingEmpty = function ({
    title = '没有更多了'
} = {}) {
    wx.showToast({
        title,
        icon: 'success',
        duration: 1000,
        mask: true
    });
};

let hideLoading = function () {
    wx.hideToast();
};

let showToast = function ({
    title = '',
    content = '',
    confirm = function () {},
    cancel = function () {},
    showCancel = false,
} = {}) {
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        confirmColor: '#6595ff',
        success(res) {
            if (res.confirm) {
                confirm();
            } else if (res.cancel) {
                cancel();
            }
        }
    });
};

let loadingError = function ({
    title = '错误',
    content = '网络异常,请重试',
    confirm = function () {},
    cancel = function () {}
} = {}) {
    wx.hideToast();
    wx.showModal({
        title: title,
        content: content,
        showCancel: false,
        confirmColor: '#6595ff',
        success(res) {
            if (res.confirm) {
                confirm();
            } else if (res.cancel) {
                cancel();
            }
        }
    });
};

let hideToast = function () {
    wx.hideToast();
};

let saltKey = function () {
    return wx.getStorageSync('appSalt');
};

let isLoginSync = function () {
    return (wx.getStorageSync('appSalt') && wx.getStorageSync('authorize')) ? true : false;
};

let toTop = function () {
    if (wx.pageScrollTo) {
        wx.pageScrollTo({
            scrollTop: 0
        });
    }
};

let pageSize = 10;

let reload = function ({reloadCallback = function () {

}}={}) {
    this.setData({
        reloadCallback
    });
};

App({
    onLaunch() {

    },
    globalData: {
        userInfo: null,
        isLogin: false
    },
    passport,
    isLoginSync,
    showLoading,
    hideLoading,
    showToast,
    hideToast,
    loadingEmpty,
    loadingError,
    toTop,
    saltKey,
    pageSize
})