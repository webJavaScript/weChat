/**
 * @author: laoono
 * @date:  2017-07-31
 * @time: 10:18
 * @contact: laoono.com
 * @description: #
 */
let url = 'https://iask.fh21.com.cn' + '/app/uploadimage';

let Promise = require('../vendor/es6-promise');

module.exports.upload = function () {

    return new Promise(function (resolve, reject) {

        wx.chooseImage({
            count: 1,
            success: res => {
                var tempFilePaths = res.tempFilePaths
                let filePath = tempFilePaths[0];

                wx.uploadFile({
                    url,
                    filePath,
                    name: 'uploaded',
                    success: (res) => {
                        var data = JSON.parse(res.data);

                        Object.assign(data, {filePath})

                        if (data.errno == 0) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    },
                    fail: (res) => {
                        console.log(res, 'fail');
                        reject(res);
                    }
                })
            }
        });
    });
};
