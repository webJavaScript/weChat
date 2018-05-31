let {
    getDepartmentByHospital
} = require('../../action/get-getdepartmentbyhospital');


let {
    getDoctorByDepartment
} = require('../../action/get-getdoctorbydepartment');

let app = getApp();

Page({
    data: {
        pageSize: app.pageSize,
        isLoading: false,
        select: {
            ratio: 0,
            grade: '',
            departmentid: '',
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
        hospitalid: 0,
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
        var hospitalid = this.data.hospitalid;
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
                select.departmentid = '';

                app.showLoading();

                getDoctorByDepartment({
                    hospitalid: hospitalid,
                    pageSize:this.data.pageSize,
                    ratio: select.ratio,
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
                hospitalid: hospitalid,
                [select.grade]: select.departmentid,
                pageSize:this.data.pageSize,
                ratio: select.ratio,
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
        var hospitalid = this.data.hospitalid;
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
            select.grade = 'hospitalDepartment1';
        } else {
            console.log('其他')
            select.grade = 'hospitalDepartment2';
        }

        select.departmentid = select.nav[cur].children[sonNum].gradeson[gradesonNum].departmentid;

        getDoctorByDepartment({
            ratio: select.ratio,
            hospitalid: hospitalid,
            pageSize:this.data.pageSize,
            [select.grade]: select.nav[cur].children[sonNum].gradeson[gradesonNum].departmentid,
            page: 1
        }).then((res) => {

            var docList = res.doctorList;
            select.isShow = false;

            select.nav.forEach(function (el, i) {
                el.check = false;
            });

            if (select.grade == 'hospitalDepartment1') {
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

        app.showLoading();

        var hospitalid = options.hosId;
        var select = this.data.select;
        var self = this;
        var cur;

        wx.setNavigationBarTitle({
            title: options.hosTitle
        });

        getDepartmentByHospital({
            hospitalid: hospitalid
        }).then((res) => {

            res.department.forEach(function (el, i) {

                var oneDepart = {
                    departmentid: el.departmentid,
                    title: el.name,
                    check: false,
                    gradeson: []
                };
                oneDepart.gradeson.push({
                    title: '全部',
                    check: false,
                    departmentid: el.departmentid
                });
                el.childs.forEach(function (ele, index) {
                    oneDepart.gradeson.push({
                        title: ele.name,
                        check: false,
                        departmentid: ele.departmentid
                    })
                });

                select.nav[0].children.push(oneDepart);

            });

            self.setData({
                select: select
            });


        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });

        getDoctorByDepartment({
            pageSize:this.data.pageSize,
            hospitalid: hospitalid
        }).then((res) => {

            var docList = res.doctorList;

            this.setData({
                docList: docList,
                total: res.total,
                hospitalid: hospitalid
            });

            app.hideLoading();

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });

    },
    onReachBottom() {

        var page = this.data.page;
        var select = this.data.select;
        var docList = this.data.docList;
        var hospitalid = this.data.hospitalid;

        this.setData({
            isLoading: true
        });

        page++;

        if (this.data.select.grade == '') {

            getDoctorByDepartment({
                hospitalid: hospitalid,
                pageSize:this.data.pageSize,
                ratio: select.ratio,
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
                        hospitalid: hospitalid,
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

        } else {

            getDoctorByDepartment({
                ratio: select.ratio,
                pageSize:this.data.pageSize,
                [select.grade]: select.departmentid,
                hospitalid: hospitalid,
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

                app.hideLoading();
                app.loadingError();

            });

        }

    }
})