/**
 * @author: laoono
 * @date:  2017-07-17
 * @time: 14:20
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/indexbanner';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getSwiper = function (params = {}) {
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
