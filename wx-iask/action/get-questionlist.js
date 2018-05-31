/*
 * @Author: Sea 
 * @Date: 2017-08-03 13:34:01 
 * @Last Modified by: Sea
 * @Last Modified time: 2017-08-03 15:49:40
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/questionlist';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getQuestionList = function (params = {}) {
    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                let data = res.data || {};
                if (data.errno == 0 && data.data && data.data.length) {
                    resolve(res.data);
                } else if(data.data && data.data.length == 0){
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
