/**
 * @author: laoono
 * @date:  2017-07-18
 * @time: 18:07
 * @contact: laoono.com
 * @description: #
 */

let app = getApp();
let {
    getDoctorDetail
} = require('../../action/get-doctordetail');
let {
    follow
} = require('../../action/follow');

let util = require('../../utils/util');

Page({
    data: {
        btnText: '',
        isExpand: false,
        answerTotal: 0
    },

    bindFollow(event) {

        if (!app.isLoginSync()) {
            return app.showToast({
                title: '登录失败',
                content: '您需要获取微信授权才能使用相关服务,请到"我的"页面获取授权并登录'
            });
        }

        let data = event.currentTarget.dataset;
        let {
            type,
            doctorid
        } = data;
        let params = {
            doctorid,
            type
        };

        Object.assign(params, app.saltKey());

        app.showLoading();

        follow({
            type,
            params
        }).then(() => {
            app.hideLoading();
            let _type = '';
            let btnText = '';

            if (type == 'add') {
                _type = 'cancel';
                btnText = '取消关注';
            } else {
                _type = 'add'
                btnText = '关注';
            }

            this.setData({
                type: _type,
                btnText
            });

        }).catch(() => {
            app.hideLoading();
            app.showToast({
                title: '错误',
                content: '网络错误'
            });
        });
    },
    bindExpand() {
        this.setData({
            isExpand: true
        });
    },

    onLoad(options) {
        app.showLoading();

        let {uid, view} = options;
        let params = Object.assign({
            uid
        }, app.saltKey());

        if (view == 'question-detail') {
            this.setData({
                hideQuestionList: true
            });
        }

        getDoctorDetail(params).then((res) => {
            app.hideLoading();
            let doctor = res.doctor;
            let answer = res.answer;
            let isFollow = doctor.isFollow;
            let type;
            let btnText;

            answer.map((v) => {
                v.time = util.formatTimePlus(v.time * 1000).Ymd;

                return Object.assign(v, {
                    doctor: doctor
                });
            });

            if (isFollow) {
                type = 'cancel';
                btnText = '取消关注';
            } else {
                type = 'add';
                btnText = '关注';
            }

            this.setData({
                doctor,
                answer,
                type: type,
                btnText,
                uid,
                answerTotal: res.answertotal
            });

            wx.setNavigationBarTitle({
                title: doctor.frontend_nickname+'医生主页'
            });

        }).catch(() => {
            app.loadingError();
        });
    }
});