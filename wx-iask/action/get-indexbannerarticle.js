/**
 * @author: laoono
 * @date:  2017-08-07
 * @time: 11:24
 * @contact: laoono.com
 * @description: #
 */

let config = require('../utils/config');
let url = config.API_DOMAIN + '/app/indexbannerarticle';
let appid = config.APPID;

let Promise = require('../vendor/es6-promise');

module.exports.getIndexBannerArticle = function (params = {}) {
    Object.assign(params, {appid});

    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: params,
            success: (res) => {
                let data = res.data || {};
                if (data.errno == 0 && data.article && data.article.title) {
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