/**
 * @author: laoono
 * @date:  2017-07-25
 * @time: 14:36
 * @contact: laoono.com
 * @description: #
 */

let url = require('../utils/config').API_DOMAIN +  '/app/addquestion'

let Promise = require('../vendor/es6-promise');

module.exports.addQuestion = function (params = {}) {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            method: 'POST',
            data: params,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
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