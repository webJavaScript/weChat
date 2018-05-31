let {
    getDepartmentList
} = require('../../action/get-departmentlist');
let {
    getDepartmentHotTags
} = require('../../action/get-departmenthottags');
let {
    getSearch
} = require('../../action/get-search');
let {
    getQuestionList
} = require('../../action/get-questionlist');
let util = require('../../utils/util');
let app = getApp();
Page({
    data: {
        isPlain: false,
        pageSize: app.pageSize,
        isLoading: false,
        questions: [],
        keyword:'',
        page: 1
    },
    onLoad(options) {

        app.showLoading();
        
        var keyword = decodeURIComponent(options.keyword);

        getSearch({
            keyword: keyword,
            pageSize:this.data.pageSize,
            searchType: 1
        }).then((res) => {

            var questions = [];

            res.question.forEach(function (el, i) {
                questions.push({
                    qid: el.id,
                    title: el.title,
                    content: el.answer_content,
                    time: util.formatTimePlus(el.answer_time * 1000).Ymd,
                    answerNum: el.answer_nums
                })
            });

            this.setData({
                questions,
                isPlain: false,
                keyword:keyword,
                page: 1
            });

            app.hideLoading();

        }).catch((err) => {

            if (err == 'nodata') {

                this.setData({
                    isPlain: true
                });

                app.hideLoading();

            } else {

                app.hideLoading();
                app.loadingError();

            }

        });

    },
    onReachBottom() {

        this.setData({
            isLoading: true
        });

        var page = this.data.page;
        var questions = this.data.questions;

        page++;

        getSearch({
            keyword: this.data.keyword,
            searchType: 1,
            pageSize:this.data.pageSize,
            page: page
        }).then((res) => {

            res.question.forEach(function (el, i) {
                questions.push({
                    qid: el.id,
                    title: el.title,
                    content: el.answer_content,
                    time: util.formatTimePlus(el.answer_time * 1000).Ymd,
                    answerNum: el.answer_nums
                })
            });

            this.setData({
                questions,
                page,
                isLoading: false
            });

        }).catch((err) => {

            this.setData({
                isLoading: false
            });

            if (err == 'nodata') {

                app.hideLoading();
                app.loadingEmpty();

            } else {

                app.hideLoading();
                app.loadingError();

            }

        });

    }
})