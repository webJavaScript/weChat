let {getMyQuestion} = require('../../action/get-myquestion');
let app = getApp();
let util = require('../../utils/util');
const pageSize = app.pageSize;

let getData = function () {
    let data = {};
    let {page, items} = this.data;

    data.pageSize = pageSize;
    data.page = page;

    Object.assign(data, app.saltKey());

    if (page > 1) {
        this.setData({
            loading: true
        });
    } else {
        app.showLoading();
    }

    getMyQuestion(data).then((res = {}) => {
        app.hideLoading();

        let question = res.question;

        question.forEach(function (v) {
            items.push({
                qid: v.qid,
                title: v.title,
                doctor: v.answer,
                content: v.answer.content,
                time: util.formatTimePlus(v.time * 1000).Ymd,
                answerNum: v.answer_num
            });
        });

        this.setData({
            items,
            page: ++page,
            loading: false
        });
    }).catch((res) => {
        app.hideLoading();

        this.setData({
            loading: false
        });

        let {question} = res;

        if (page <= 1) {
            this.setData({
                plain: true,
                items: []
            });
        } else {
            if (!question.length) {
                this.setData({
                    loading: false
                });

                return app.loadingEmpty();
            }
        }
    })
};

Page({
    data: {
        page: 1,
        items: [],
        loading: false
    },
    onLoad() {
        getData.call(this);
    },
    onReachBottom() {
        getData.call(this);
    }
});