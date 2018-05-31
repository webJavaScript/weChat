/**
 * @author: laoono
 * @date:  2017-07-27
 * @time: 15:29
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let addUrl = config.API_DOMAIN + '/app/addfollow';
let cancelUrl = config.API_DOMAIN + '/app/cancelfollow';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.follow = function ({type = 'add', params = {}} = {}) {
    let url = type == 'add' ? addUrl : cancelUrl;

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