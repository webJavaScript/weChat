/**
 * @author: laoono
 * @date:  2017-07-25
 * @time: 09:56
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let url = config.API_PASSPORT + '/miniapps/login';

let Promise = require('../vendor/es6-promise');

var loginAction = function ({userInfo = {}, params = {}} = {}) {

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

var getUserInfo = function (params = {}) {

    return new Promise(function (resolve, reject) {
        wx.getUserInfo({
            success(res) {
                resolve([res.userInfo, params]);
            },
            fail() {
                reject({code: 403});
            }
        });
    });
};

var login = function () {
    return new Promise(function (resolve, reject) {
        wx.login({
            success(res) {
                let code = res.code;

                if (code) {
                    resolve(code);
                } else {
                    reject(res.errMsg);
                }
            },
        });
    });
};


module.exports = {
    login,
    loginAction,
    getUserInfo,
    init(success = function () {
    }, fail = function () {

    }) {
        login()
            .then(function (code) {
                return getUserInfo({code});
            })
            .then(function (res) {
                let [userInfo, params] = res;
                return loginAction({userInfo, params});
            })
            .then(function (res) {

                let [data, userInfo] = res;

                let {appid, openid} = data;

                let appSalt = {
                    appid,
                    openid,
                }

                wx.setStorageSync('authorize', true);
                wx.setStorageSync('appSalt', appSalt);

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
                }

                ['appSalt', 'authorize'].forEach((v) => {
                    wx.removeStorage({
                        key: v
                    });
                });

                fail(res);
            });
    }
}

