/**
 * @author: laoono
 * @date:  2017-07-24
 * @time: 10:47
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/questiondetail';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getQuestionDetail = function (params = {}) {
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
        })
    });
};