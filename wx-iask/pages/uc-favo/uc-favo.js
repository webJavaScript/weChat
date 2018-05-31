/**
 * @author: laoono
 * @date:  2017-07-18
 * @time: 15:02
 * @contact: laoono.com
 * @description: #
 */
let ucFavoTabs = require('../../utils/config').UC_FAVO_TABS
let {getFollowList} = require('../../action/get-getfollowlist');
let {getQuestionDetail} = require('../../action/get-questiondetail');

let favo = require('../../action/favo');
let util = require('../../utils/util');

let Promise = require('../../vendor/es6-promise');

let app = getApp();

let getUserInfoByAnswerId = function (aid, userInfos = []) {
    let userInfo = {};

    userInfos.forEach(item => {
        if (aid == item.uid) {
            userInfo = item;
        }
    })

    return userInfo;
};

let getDataIask = function () {
    let {page} = this.data;

    if (page <= 1) {
        app.showLoading();
    }

    let arr = [];
    let list = [];

    favo.get().then((res = []) => {
        res = res.reverse();

        res.forEach(qid => {
            arr.push(getQuestionDetail({qid}));
        });

        Promise.all(arr).then(res => {
            app.hideLoading();

            res.forEach(item => {
                let [{title, time, id:qid}, answerNum] = [item.question, item.answer.length];
                let auid, content, doctor;

                if (item.answer.length) {
                    auid = item.answer[0].auid;
                    content = item.answer[0].content;
                    doctor = getUserInfoByAnswerId(auid, item.userInfo);
                } else {
                    content = '';
                    doctor = {};
                }

                time = util.formatTimePlus(time * 1000).Ymd;

                list.push({
                    title,
                    time,
                    qid,
                    answerNum,
                    doctor,
                    content
                });
            });

            this.setData({
                num: res.length,
                list
            });
        }).catch(() => {
        });
    }).catch(() => {
        if (page <= 1) {
            this.setData({
                plain: true,
                items: []
            });
        }

        app.hideLoading();
    });
}

let getDataDoctor = function () {

    let {page, pageSize, list} = this.data;

    if (page <= 1) {
        app.showLoading();
    }

    let data = {
        page,
        pageSize
    };

    Object.assign(data, app.saltKey());

    if (page > 1) {
        this.setData({
            loading: true
        });
    }

    getFollowList(data)
        .then((res) => {

            app.hideLoading();

            this.setData({
                list: [...list, ...res.doctor],
                num: res.total,
                page: ++page,
                loading: false
            });
        })
        .catch((res) => {
            app.hideLoading();

            this.setData({
                loading: false
            });

            if (page <= 1) {
                this.setData({
                    plain: true,
                    items: []
                });
            } else {
                if (!res.doctor.length) {
                    this.setData({
                        loading: false
                    });

                    return app.loadingEmpty();
                }
            }

        });

};

let getData = function (type = 'iask') {
    if (type == 'iask') {
        getDataIask.call(this);
    } else {
        getDataDoctor.call(this);
    }
};

Page({
    data: {
        nav: {
            ucFavoTabs: ucFavoTabs,
            value: 'iask'
        },
        page: 1,
        pageSize: app.pageSize,
        loading: false,
        list: [],
        num: 0,
        currValue: 'iask'
    },
    changeTab(event) {
        var nav = this.data.nav;
        let value = event.currentTarget.dataset.value;
        nav.value = value;

        this.setData({
            nav: nav,
            list: [],
            page: 1,
            num: 0,
            currValue: value,
            plain: false
        });

        getData.call(this, value);
    },
    onLoad() {
        getData.call(this);
    },
    onReachBottom() {
        getData.call(this, this.data.currValue);
    }
});