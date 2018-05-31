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
        isSearch: false,
        isLoading: false,
        select: {
            isShow: false,
            title: '',
            nav: [],
            child: []
        },
        questions: [],
        page: 1
    },
    selectNav() {

        var select = this.data.select;
        select.isShow = !select.isShow;

        this.setData({
            select
        })
    },
    selectChild(e) {

        app.showLoading();

        var id = e.currentTarget.dataset.id;
        var select = this.data.select;
        var cur;

        select.nav.forEach(function (el, i) {
            if (el.id == id) {
                cur = i;
                el.check = true;
            } else {
                el.check = false;
            }
        });

        select.isShow = false;
        select.title = select.nav[cur].name;

        getDepartmentHotTags({
            categoryid: select.nav[cur].id
        }).then((res) => {

            var tags = res.hotTags;
            var tag = [];

            tags.forEach(function (el, i) {
                tag.push({
                    name: el,
                    check: false
                });
            });

            select.child = tag;

            this.setData({
                select,
                isSearch: false
            });

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });

        getQuestionList({
            cid1: select.nav[cur].id,
            pageSize: this.data.pageSize,
        }).then((res) => {

            var questions = [];

            res.data.forEach(function (el, i) {
                questions.push({
                    qid: el.qid,
                    title: el.title,
                    content: el.answer_content,
                    time: util.formatTimePlus(el.time * 1000).Ymd,
                    answerNum: el.answers
                })
            });

            this.setData({
                questions,
                isPlain: false,
                isSearch: false,
                page: 1
            });

            if (questions.length != 0) {
                app.toTop();
            }

            app.hideLoading();

        }).catch((err) => {
            if (err = 'nodata') {

                this.setData({
                    isPlain: true,
                    isSearch: false
                });

                app.hideLoading();

            } else {
                app.hideLoading();
                app.loadingError();

            }

        });

    },
    selectGradeson(e) {

        app.showLoading();

        var id = e.currentTarget.dataset.id;
        var select = this.data.select;
        var cur, sonNum;

        select.nav.forEach(function (el, i) {
            if (el.check) {
                cur = i;
            }
        });

        select.child.forEach(function (el, i) {
            if (i == id) {
                el.check = true;
                sonNum = id;
            } else {
                el.check = false;
            }
        });

        this.setData({
            select
        });
        
        getSearch({
            keyword: select.child[sonNum].name,
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
                select,
                questions,
                isPlain: false,
                isSearch: true,
                page: 1
            });

            if (questions.length != 0) {
                app.toTop();
            }

            app.hideLoading();

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });


    },
    onLoad(options) {

        app.showLoading();

        var id = options.dept_id || 1;
        var select = this.data.select;
        var cur;

        getDepartmentList().then((res) => {

            var dep = res.categoryList;

            dep.forEach(function (el, i) {
                if (el.id == id) {
                    el.check = true;
                    cur = i;
                } else {
                    el.check = false;
                }
                select.nav.push(el);
            });

            select.title = select.nav[cur].name;

            getDepartmentHotTags({
                categoryid: select.nav[cur].id
            }).then((res) => {

                var tags = res.hotTags;
                var tag = [];

                tags.forEach(function (el, i) {
                    tag.push({
                        name: el,
                        check: false
                    });
                });

                select.child = tag;

                this.setData({
                    select
                });

            });

        }).catch((err) => {

            app.hideLoading();
            app.loadingError();

        });

        getQuestionList({
            cid1: id,
            pageSize: this.data.pageSize,
            page: 1
        }).then((res) => {

            var questions = [];

            res.data.forEach(function (el, i) {
                questions.push({
                    qid: el.qid,
                    title: el.title,
                    content: el.answer_content,
                    time: util.formatTimePlus(el.time * 1000).Ymd,
                    answerNum: el.answer
                })
            });

            this.setData({
                isPlain: false,
                questions
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
        var select = this.data.select;
        var questions = this.data.questions;
        var cur, sonNum;

        select.nav.forEach(function (el, i) {
            if (el.check) {
                cur = i;
            }
        });

        select.child.forEach(function (el, i) {
            if (el.check) {
                sonNum = i;
            }
        });

        page++;

        if (this.data.isSearch) {
            console.log('加载搜索接口');

            getSearch({
                keyword: select.child[sonNum].name,
                searchType: 1,
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
        } else {
            console.log('加科室接口')
            getQuestionList({
                cid1: select.nav[cur].id,
                pageSize: this.data.pageSize,
                page: page
            }).then((res) => {

                res.data.forEach(function (el, i) {
                    questions.push({
                        qid: el.qid,
                        title: el.title,
                        content: el.answer_content,
                        time: util.formatTimePlus(el.time * 1000).Ymd,
                        answerNum: el.answer
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

            })
        }

    }
})