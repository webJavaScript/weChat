/*
 * @Author: Sea 
 * @Date: 2017-07-25 10:53:56 
 * @Last Modified by: Sea
 * @Last Modified time: 2017-07-25 11:31:27
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/getdepartment';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getDepartment = function (params = {}) {
    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                if (res.data.errno == 0) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            },
            fail: (res) => {
                reject(res.data);
            }
        });
    });
};