let {getQuestionDetail} = require('../../action/get-questiondetail');
let util = require('../../utils/util');
let app = getApp();
let favo = require('../../action/favo');

let getUserInfoByAuid = function (id, userInfo = []) {
    let res = null;
    let tmp = util.copy(userInfo);

    tmp.forEach((v) => {
        if (id == v.uid) {
            return res = v;
        }
    });

    return res;
};

let getChaseByid = function (id, chase = []) {
    let res = [];

    let tmp = util.copy(chase);

    tmp.forEach((v) => {
        v.time = util.formatTime(new Date(v.time * 1000));
        if (id == v.aid) {
            res.push(v);
        }
    });

    return res;
};

Page({
    data: {
        favoEnabled: false
    },
    onLoad(options) {
        app.showLoading();
        let qid = options.qid;

        favo.get(qid).then(res => {
            this.setData({
                isFavo: res.length
            })
        }).catch(() => {
            // app.loadingError();
        });

        getQuestionDetail({
            qid
        }).then((res) => {

            app.hideLoading();

            let {question} = res;
            let answers = res.answer;
            let sex = question.sex;
            let userInfos = res.userInfo;
            let chases = res.chase;

            question.time = util.formatTime(new Date(question.time * 1000));
            question.sex = sex == 1 ? '男' : '女';

            let answer = answers.map((v) => {
                let userInfo = getUserInfoByAuid(v.auid, userInfos);
                let chase = getChaseByid(v.id, chases);
                v.time = util.formatTimePlus(v.time * 1000).YmdHM;
                return Object.assign(v, {userInfo}, {chase});
            });

            this.setData({
                question,
                answer,
                userInfos,
                favoEnabled: true
            });
        }).catch((res) => {
            app.hideLoading();

            let {errno} = res;
            if (errno == 10011) {
                app.showToast({
                    content: '该问题已删除',
                    confirm() {
                        wx.navigateBack();
                    }
                });
            } else {
                app.loadingError();
            }
        });
    },
    bindFavo(event) {
        let dataset = event.currentTarget.dataset;
        let {qid, type} = dataset

        if (type == 'add') {
            favo.add(qid).then(() => {
                this.setData({
                    isFavo: true
                })
            });
        } else {
            favo.remove(qid).then(() => {
                this.setData({
                    isFavo: false
                })
            });
        }
    }
})