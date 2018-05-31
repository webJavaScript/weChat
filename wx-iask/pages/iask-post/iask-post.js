/**
 * @author: laoono
 * @date:  2017-07-17
 * @time: 18:11
 * @contact: laoono.com
 * @description: #
 */

let {
    addQuestion
} = require('../../action/post-addquestion');
let {
    getDoctorDetail
} = require('../../action/get-doctordetail');

let {upload} = require('../../action/upload');
let app = getApp();

let util = require('../../utils/util');

let validateContent = function (v = '') {
    let len = v.length;

    return len < 20 ? false : true;
};

let validateAge = function (v = '') {
    let reg = /^\d{4}-\d{2}-\d{2}$/gi;

    return reg.test(v) ? true : false;
};

let {start: dateStart, end: dateEnd} = util.formatTimePlus();

Page({
    data: {
        items: [
            {
                name: '1',
                value: '男'
            },
            {
                name: '2',
                value: '女'
            },
        ],
        date: '请选择',
        content: '',
        doc: {},
        isFirstUploadSuccess: false,
        uploadImages: [],
        postEnabled: false,
        touid: 0,
        dateStart,
        dateEnd
    },

    bindDelUploadImages(event) {
        var that = this;

        wx.showActionSheet({
            itemColor: '#333',
            itemList: ['确定'],
            success: (res) => {
                if (res.tapIndex != 0) return;
                let src = event.currentTarget.dataset.src;
                let uploadImages = that.data.uploadImages.filter(item => item.src != src);

                that.setData({uploadImages});
            },
            fail: (res) => {
            }
        });
    },

    bindDateChange(e) {
        this.setData({
            date: e.detail.value
        });
    },
    bindContentConfirm(e) {
        this.setData({
            content: e.detail.value
        });
    },

    iaskPost(e) {
        let data = e.detail.value;
        let params = app.saltKey();
        let {touid} = this.data;

        if (typeof this.data.doc.uid != 'undefined') {
            data.uid = this.data.doc.uid;
        }

        if (!validateContent(this.data.content)) {
            return app.showToast({
                title: '提交失败',
                content: '病情描述20字以上',
            });
        }

        if (data.sex.length <= 0) {
            return app.showToast({
                title: '提交失败',
                content: '请选择性别',
            });
        }

        if (!validateAge(this.data.date)) {
            return app.showToast({
                title: '提交失败',
                content: '请选择出生年份',
            });
        }

        let uploadImages = this.data.uploadImages;
        let image = [];

        uploadImages.forEach(item => {
            image.push(item.src);
        });

        Object.assign(data, params, {image: image.join(',')});

        if (touid) {
            Object.assign(data, {touid});
        }

        app.showLoading({
            title: '提交中',
        });

        addQuestion(data).then(function (res) {
            console.log(res);

            let {questionid} = res;

            app.hideToast();

            wx.redirectTo({
                url: '/pages/question-detail/question-detail?qid=' + questionid
            });

        }).catch(function () {
            app.hideToast();

            app.showToast({
                title: '提交失败',
                content: '请重试',
            });
        });
    },
    onReady() {
        if (!app.isLoginSync()) {

            this.setData({
                postEnabled: true
            });

            return app.showToast({
                title: '登录失败',
                content: '您需要获取微信授权才能使用相关服务,请到"我的"页面获取授权并登录',
                showCancel: true,
                confirm() {
                    wx.switchTab({
                        url: '/pages/uc/uc'
                    });
                }
            });
        }
    },
    onLoad(options) {

        if (typeof options.uid != 'undefined') {
            let {uid} = options

            app.showLoading();

            getDoctorDetail({
                uid
            }).then((res) => {

                app.hideLoading();

                var doc = res.doctor;
                doc.answers = res.answertotal;

                this.setData({
                    doc
                });


            }).catch(() => {

                app.loadingError();
            });

            this.setData({
                touid: uid
            });
        }
    },
    bindUpload() {
        let uploadImages = this.data.uploadImages;

        upload().then(res => {
            let {host, filePath, pic} = res;

            uploadImages.push({
                src: host + pic,
                wxPic: filePath
            });

            this.setData({
                uploadImages,
                isFirstUploadSuccess: true,
            });

        }, res => res);
    }
});