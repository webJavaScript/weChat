/**
 * @author: laoono
 * @date:  2017-07-27
 * @time: 19:07
 * @contact: laoono.com
 * @description: #
 */

let Promise = require('../vendor/es6-promise');
let key = 'favoList';

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

let get = function (id = 0) {
    let items = [];
    let data = null;

    return new Promise(function (resolve, reject) {
        wx.getStorage({
            key,
            success(res) {
                data = res.data;

                if (id) {

                    if (includes(id, data)) {
                        items.push(id);
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

let add = function (id = 0) {

    return get().then(res => res
        , res => res
    ).then(res => {
        let _favo = res || [];

        let favo = _favo.filter(item => item != id);

        favo.push(id);

        return new Promise(function (resolve, reject) {
            wx.setStorage({
                key,
                data: favo,
                success() {
                    resolve({code: 200});
                },
                fail(res) {
                    reject(res);
                }
            });
        });
    });

};

let remove = function (id = 0) {

    return get().then(res => res, res => res)
        .then(res => {
            let _favo = res || [];

            let favo = _favo.filter(item => item != id);

            return new Promise(function (resolve, reject) {
                wx.setStorage({
                    key,
                    data: favo,
                    success() {
                        resolve({code: 200});
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