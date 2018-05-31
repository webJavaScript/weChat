/**
 * @author: laoono
 * @date:  2017-07-27
 * @time: 09:55
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let url = config.API_PASSPORT + '/app/myquestion';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getMyQuestion = function (params = {}) {
    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                if (res.data.errno == 0 && res.data.question.length) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            },
            fail: (res) => {
                reject(res.data);
            }
        });
    })
};