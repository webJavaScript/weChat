/*
 * @Author: Sea 
 * @Date: 2017-08-02 17:50:17 
 * @Last Modified by: Sea
 * @Last Modified time: 2017-08-02 17:51:37
 */
let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/departmentlist';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getDepartmentList = function (params = {}) {

    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                if (res.data.errno == 0 && res.data.categoryList.length) {
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
