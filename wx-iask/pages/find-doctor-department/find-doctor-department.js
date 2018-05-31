let {
    getDepartment
} = require('../../action/get-getdepartment');


let {
    getDoctorByDepartment
} = require('../../action/get-getdoctorbydepartment');
let app = getApp();

Page({
    data: {
        pageSize:app.pageSize,
        isLoading: false,
        select: {
            ratio: 0,
            grade: '',
            department_id: '',
            isShow: false,
            nav: [{
                title: "全部科室",
                check: false,
                children: [{
                    title: "全部科室",
                    check: true,
                    gradeson: []
                }]
            }, {
                title: "默认排序",
                check: false,
                children: [{
                    title: "默认排序",
                    ratio: 0,
                    check: true,

                }, {
                    title: "按好评率",
                    ratio: 1,
                    check: false
                }]
            }]

        },
        docList: [],
        total: 1,
        page: 1
    },
    selectNav(e) {
        var index = e.currentTarget.id;
        var select = this.data.select;
        var oldIndex;

        select.nav.forEach(function (el, i) {
            if (el.check) {
                oldIndex = i;
            }
        });

        if ((typeof oldIndex) != 'number') {

            select.nav[index].check = true;
            select.isShow = true;

        } else if (oldIndex == index) {

            select.nav[index].check = false;
            select.isShow = false;


        } else {

            select.nav.forEach(function (el, i) {
                if (i == index) {
                    el.check = true;
                } else {
                    el.check = false;
                }
            });
            select.isShow = true;

        }

        this.setData({
            select: select
        });

    },
    selectChild(e) {

        var self = this;
        var select = this.data.select;
        var index = e.currentTarget.id;
        var cur, sonNum;

        select.nav.forEach(function (el, i) {
            if (el.check) {
                cur = i;
            }
        });

        select.nav[cur].children.forEach(function (el, i) {
            if (i == index) {
                el.check = true;
                sonNum = i;
            } else {
                el.check = false;
            }
        });

        if (cur == 0) {
            console.log('导航0');

            if (select.nav[0].children[sonNum].gradeson.length == 0) {
                select.nav[0].title = select.nav[0].children[sonNum].title;
                select.grade = '';
                select.department_id = '';

                app.showLoading();

                getDoctorByDepartment({
                    ratio: select.ratio,
                    pageSize:this.data.pageSize,
                    page: 1
                }).then((res) => {
                    var docList = res.doctorList;
                    select.isShow = false;

                    select.nav.forEach(function (el) {
                        el.check = false;
                    });

                    this.setData({
                        select: select,
                        docList: docList,
                        total: res.total,
                        page: 1
                    });

                    if (docList.length != 0) {
                        app.toTop();
                    }
                    app.hideLoading();

                }).catch(() => {

                    app.hideLoading();
                    app.loadingError();

                });


            }
        } else if (cur == 1) {

            console.log('导航1');
            select.ratio = select.nav[1].children[sonNum].ratio;
            select.nav[1].title = select.nav[1].children[sonNum].title;

            app.showLoading();

            getDoctorByDepartment({
                [select.grade]: select.department_id,
                ratio: select.ratio,
                pageSize:this.data.pageSize,
                page: 1
            }).then((res) => {

                var docList = res.doctorList;
                select.isShow = false;

                select.nav.forEach(function (el) {
                    el.check = false;
                });

                this.setData({
                    select: select,
                    docList: docList,
                    total: res.total,
                    page: 1
                });

                if (docList.length != 0) {
                    app.toTop();
                }
                app.hideLoading();

            }).catch(() => {

                app.hideLoading();
                app.loadingError();

            });

        }

        this.setData({
            select: this.data.select
        });

    },
    selectGradeson(e) {

        var index = e.currentTarget.id;
        var cur, sonNum, gradesonNum;
        var select = this.data.select;

        app.showLoading();

        select.nav.forEach(function (el, i) {
            if (el.check) {
                cur = i;
            }
        });

        select.nav[cur].children.forEach(function (el, i) {
            if (el.check) {
                sonNum = i;
            }
        });

        select.nav[cur].children[sonNum].gradeson.forEach(function (el, i) {
            if (i == index) {
                el.check = true;
                select.cid = el.cid;
                gradesonNum = i;
            } else {
                el.check = false;
            }
        });

        if (gradesonNum == 0) {
            console.log('全部')
            select.grade = 'commonDepartment1';
        } else {
            console.log('其他')
            select.grade = 'commonDepartment2';
        }

        select.department_id = select.nav[cur].children[sonNum].gradeson[gradesonNum].department_id;

        getDoctorByDepartment({
            ratio: select.ratio,
            pageSize:this.data.pageSize,
            [select.grade]: select.nav[cur].children[sonNum].gradeson[gradesonNum].department_id,
            page: 1
        }).then((res) => {

            var docList = res.doctorList;
            select.isShow = false;

            select.nav.forEach(function (el, i) {
                el.check = false;
            });

            if (select.grade == 'commonDepartment1') {
                select.nav[cur].title = select.nav[cur].children[sonNum].title;
            } else {
                select.nav[cur].title = select.nav[cur].children[sonNum].gradeson[gradesonNum].title;
            }

            this.setData({
                docList: docList,
                select: select,
                total: res.total,
                page: 1
            });

            if (docList.length != 0) {
                app.toTop();
            }
            app.hideLoading();

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });

    },
    onLoad(options) {
        var id = options.id;
        var select = this.data.select;
        var self = this;
        var cur;

        app.showLoading();

        getDepartment().then((res) => {

            res.department.forEach(function (el, i) {

                var oneDepart = {
                    department_id: el.department_id,
                    title: el.name,
                    check: false,
                    gradeson: []
                };

                getDepartment({
                    department: el.department_id
                }).then((res) => {

                    oneDepart.gradeson.push({
                        title: '全部',
                        check: oneDepart.check,
                        department_id: el.department_id
                    });

                    res.department.forEach(function (ele) {
                        oneDepart.gradeson.push({
                            title: ele.name,
                            check: false,
                            department_id: ele.department_id
                        });
                    });

                    if (oneDepart.check) {
                        getDoctorByDepartment({
                            [select.grade]: select.department_id,
                            ratio: select.ratio,
                            page: 1
                        }).then((res) => {

                            var docList = res.doctorList;

                            self.setData({
                                select: select,
                                docList: docList,
                                total: res.total,
                                page: 1
                            });

                            app.hideLoading();

                        }).catch(() => {

                            app.hideLoading();
                            app.loadingError();

                        });

                    }

                    self.setData({
                        select: select
                    });

                })
                select.nav[0].children.push(oneDepart);





            });
            if (typeof id != 'undefined') {

                select.nav[0].children.forEach(function (el, index) {

                    if (el.department_id == id) {
                        cur = index;
                    }
                });
                select.nav[0].title = select.nav[0].children[cur].title;
                select.nav[0].children[0].check = false;
                select.nav[0].children[cur].check = true;
                select.grade = 'commonDepartment1';
                select.department_id = id;
            }

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });

        if (typeof id == 'undefined') {

            getDoctorByDepartment({
                pageSize:this.data.pageSize
            }).then((res) => {
                var docList = res.doctorList;

                this.setData({
                    docList: docList,
                    total: res.total
                });

                app.hideLoading();

            }).catch(() => {

                app.hideLoading();
                app.loadingError();

            });

        }

    },
    onReachBottom() {

        var page = this.data.page;
        var select = this.data.select;
        var docList = this.data.docList;


        this.setData({
            isLoading: true
        });

        page++;

        if (this.data.select.grade == '') {

            getDoctorByDepartment({
                ratio: select.ratio,
                pageSize:this.data.pageSize,
                page: page
            }).then((res) => {

                var addDocList = res.doctorList;

                if (addDocList.length == 0) {

                    app.loadingEmpty();
                    this.setData({
                        isLoading: false
                    });

                } else {

                    docList = [...docList, ...addDocList];

                    this.setData({
                        docList: docList,
                        total: res.total,
                        page: page,
                        isLoading: false
                    });

                    app.hideLoading();

                }

            }).catch(() => {

                app.hideLoading();
                app.loadingError();

            });

        } else {

            getDoctorByDepartment({
                ratio: select.ratio,
                pageSize:this.data.pageSize,
                [select.grade]: select.department_id,
                page: page
            }).then((res) => {

                var addDocList = res.doctorList;

                if(addDocList.length == 0){

                    app.loadingEmpty();
                    this.setData({
                        isLoading: false
                    });

                }else{

                    docList = [...docList, ...addDocList];

                    this.setData({
                        docList: docList,
                        total: res.total,
                        page: page,
                        isLoading: false
                    });

                    app.hideLoading();
                    
                }

            }).catch(() => {

                this.setData({
                    isLoading: false
                });

                app.hideLoading();
                app.loadingError();

            });
        }

    }
})