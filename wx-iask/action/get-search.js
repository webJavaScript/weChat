/*
 * @Author: Sea 
 * @Date: 2017-08-03 11:28:37 
 * @Last Modified by: Sea
 * @Last Modified time: 2017-08-03 16:07:23
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/search';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getSearch = function (params = {}) {
    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                let data = res.data || {};
                if (data.errno == 0 && data.question && data.question.length) {
                    resolve(res.data);
                }else if(data.question && data.question.length == 0){
                    reject('nodata');
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
