let app = getApp();
let util = require('../../utils/util');
const pageSize = app.pageSize;

let {getDoctorAnswer} = require('../../action/get-getdoctoranswer');

let getData = function (params = {}) {

    let {page, pageSize, answer} = this.data;

    if (page > 1) {
        this.setData({
            loading: true
        });
    } else {
        app.showLoading();
    }

    Object.assign(params, {page, pageSize});

    getDoctorAnswer(params).then(res => {
        app.hideLoading();
        let {answer: _answer, doctor} = res;

        _answer.map(item => {
            item.time = util.formatTimePlus(item.time * 1000).Ymd;
            item.doctor = doctor;
            return item;
        });

        this.setData({
            answer: [...answer, ..._answer],
            page: ++page,
            loading: false
        });
    })
        .catch((res) => {
            let {answer} = res;
            this.setData({
                loading: false
            });

            if (!answer.length) {

                return app.loadingEmpty();
            }

            app.loadingError();
        });
};
Page({
    data: {
        page: 1,
        pageSize,
        loading: false,
        answer: []
    },

    onLoad(options) {
        let doctorid = options.uid;
        this.setData({
            doctorid
        });

        getData.call(this, {doctorid});
    },

    onReachBottom() {
        let {doctorid} = this.data;

        getData.call(this, {doctorid});
    }
});