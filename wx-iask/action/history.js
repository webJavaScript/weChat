/**
 * @author: laoono
 * @date:  2017-08-03
 * @time: 21:37
 * @contact: laoono.com
 * @description: #
 */

let Promise = require('../vendor/es6-promise');
let key = 'historyList';

try {
    if (wx.getStorageSync(key).length == 0) {
        wx.setStorageSync(key, []);
    }
} catch (e) {
    wx.setStorageSync(key, []);
}

let includes = function (id, data = []) {
    let res = '';

    data.forEach(item => {
        if (item == id) {
            res = id;
        }
    });

    return res;
};

let get = function (keyword = '') {
    let items = [];
    let data = null;
    return new Promise(function (resolve, reject) {
        wx.getStorage({
            key,
            success(res) {
                data = res.data;

                if (keyword) {
                    if (includes(keyword, data)) {
                        items.push(keyword);
                    } else {
                        items = [];
                    }
                } else {
                    items = data;
                }

                if (items.length) {
                    resolve(items);
                } else {
                    reject(items);
                }
            },
            fail() {
                reject(data);
            }
        });
    });
};

let add = function (keyword = 0) {

    return get().then(res => res
        , res => res
    ).then(res => {
        let history = res || [];

        if (!includes(keyword, history)) {
            history.push(keyword);
        }

        let len = history.length;
        let maxLen = 20;

        if (len >= maxLen) {
            history.splice(0, len - maxLen);
        }

        return new Promise(function (resolve, reject) {
            wx.setStorage({
                key,
                data: history,
                success() {
                    resolve({code: 200, history});
                },
                fail(res) {
                    reject(res);
                }
            });
        });
    });

};

let remove = function (keyword = '') {
    let argLen = arguments.length;

    return get().then(res => res, res => res)
        .then(res => {
            let _history = res || [];

            let history = [];

            if (argLen == 0) {
                history = [];
            } else {
                history = _history.filter(item => item != keyword);
            }

            return new Promise(function (resolve, reject) {
                wx.setStorage({
                    key,
                    data: history,
                    success() {
                        resolve({code: 200, history});
                    },
                    fail(res) {
                        reject(res);
                    }
                });
            });
        });
}

module.exports = {
    add,
    remove,
    get
};