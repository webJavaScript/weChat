/**
 * @author: laoono
 * @date:  2017-07-21
 * @time: 18:54
 * @contact: laoono.com
 * @description: #
 */


let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/doctordetail';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getDoctorDetail = function (params = {}) {
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
