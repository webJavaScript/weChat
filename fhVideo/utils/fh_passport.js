// https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3
// https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=4_3

var config = require('../utils/config.js');
var rewardadd = config['fh-config']['requestUrl'] + 'video/rewardadd/';
var url = 'https://passport.fh21.com.cn/miniapps/login' || config["fh-config"]['requestUrl'];
url = config["fh-config"]['requestUrl'] + 'dvnt071/unifiedorder';
var Promise = require('../vendor/es6-promise.js');

var fhPay = {};
var loginAction = function ({
    userInfo = {},
    params = {}
} = {}) {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: (res) => {
                if (res.data.errno == 0) {
                    resolve([res.data, userInfo]);
                } else {
                    reject([res.data, userInfo]);
                }
            },
            fail: (res) => {
                reject(res.data);
            }
        });
    })
};

var loginFH = () => {
    return new Promise(function (resolve, reject) {
        wx.login({
            success(res) {
                let code = res.code;

                if (code) {
                    resolve(code);
                } else {
                    reject(res.errMsg);
                }
            }
        });
    });
}
var getUserInfo = (params = {}) => {
    return new Promise(function (resolve, reject) {
        wx.getUserInfo({
            success(res) {
                resolve([res.userInfo, params]);
            },
            fail() {
                reject({
                    code: 403
                });
            }
        });
    });
}

var payMent = (params = {}) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            'timeStamp': params.timeStamp,
            'nonceStr': params.nonceStr,
            'package': 'prepay_id=' + params.package,
            'signType': 'MD5',
            'paySign': params.paySign,
            'success': res => {
                wx.hideLoading();
                wx.showLoading({
                    title: '支付成功'
                });
                resolve(params);
                parseAndReward(params);
            },
            'fail': err => {
                wx.hideLoading();
                wx.showLoading({
                    title: '支付失败'
                });
                setTimeout(wx.hideLoading, 1000);
                reject(err);
                // parseAndReward(params);
            }
        });
    })
}
var parseAndReward = function(params = {}) {
    wx.getUserInfo({
        success: function(res){
            // success
            var userInfo = res.userInfo || {};
            rewardBookingNo({
                nickname: userInfo.nickName || '',
                pic: userInfo.avatarUrl || '',
                orderid: params.outTradeNo || '',
                money: params.totalFee || 0,
                remarks: params.message || '',
                phone: ''
            });
        }
    })
}
var rewardBookingNo = function(params = {}) {
    wx.request({
        url: rewardadd,
        data: params,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        fail: function(err) {
            // fail
            console.log('上报订单 >>> err: ',err)
        }
    })
}

module.exports = {
    fhPay,
    loginFH,
    getUserInfo,
    payMent,
    init(total_fee, success = function () {}, fail = function () {}) {
        loginFH()
            .then(function (code) {
                return getUserInfo({
                    code
                });
                // return [{}, code];
            })
            .then(function (res) {
                let [userInfo,
                    params
                ] = res;
                params['total_fee'] = total_fee;
                return loginAction({
                    userInfo,
                    params
                });
            })
            .then(function (res) {

                let [data,
                    userInfo
                ] = res;

                let {
                    appid,
                    openid
                } = data;

                let appSalt = {
                    appid,
                    openid
                }
                try {
                    wx.setStorageSync('authorize', 'true');
                    wx.setStorageSync('appSalt', appSalt);
                } catch (err) {
                    console.log('setStorageSync >>> authorize || appSalt:', err);
                }

                success(userInfo, data);
            })
            .catch(function (res = {}) {

                if (res.code == 403) {
                    wx.showModal({
                        title: '登录失败',
                        content: '您需要获取微信授权才能使用相关服务,请5分钟后关闭微信,重新获取授权并登录',
                        showCancel: false,
                        confirmColor: '#6595ff'
                    });
                } else {
                    wx.showModal({
                        title: '登录失败',
                        content: '网络异常,请重试',
                        showCancel: false,
                        confirmColor: '#6595ff'
                    });
                }['appSalt', 'authorize'].forEach((v) => {
                    wx.removeStorage({
                        key: v
                    });
                });

                fail(res);
            });
    }
}