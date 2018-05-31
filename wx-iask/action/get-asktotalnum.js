/**
 * @author: laoono
 * @date:  2017-08-04
 * @time: 13:49
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/asktotalnum';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getAsktotalNum = function (params = {}) {
    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                let data = res.data || {};
                if (data.errno == 0 && data.numbers) {
                    resolve(data);
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