/*
 * @Author: Sea 
 * @Date: 2017-07-24 18:34:57 
 * @Last Modified by: Sea
 * @Last Modified time: 2017-07-25 10:35:03
 */

let config = require('../utils/config');
let url = config.API_HOSPITAL + '/app/getdepartmentbyhospital';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getDepartmentByHospital = function (params = {}) {
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