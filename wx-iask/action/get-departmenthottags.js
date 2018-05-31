/*
 * @Author: Sea 
 * @Date: 2017-08-02 18:19:17 
 * @Last Modified by:   Sea 
 * @Last Modified time: 2017-08-02 18:19:17 
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/departmenthottags';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getDepartmentHotTags = function (params = {}) {

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
