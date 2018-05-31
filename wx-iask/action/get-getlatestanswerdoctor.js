/**
 * @author: laoono
 * @date:  2017-08-05
 * @time: 07:21
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/getlatestanswerdoctor';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getLatestNnswerDoctor = function (params = {}) {
    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                let data = res.data || {};
                if (data.errno == 0 && data.onlineDoctors && data.onlineDoctors.length) {
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
 