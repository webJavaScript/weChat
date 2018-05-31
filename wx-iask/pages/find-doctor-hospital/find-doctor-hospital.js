let {
    getHospitalType
} = require('../../action/get-gethospitaltype');
let {
    getProvinceCity
} = require('../../action/get-getprovincecity');
let {
    getHospitalList
} = require('../../action/get-gethospitallist');
let app = getApp();

Page({
    data: {
        pageSize: app.pageSize,
        isLoading: false,
        select: {
            type: 0,
            pid: 0,
            cid: 0,
            isShow: false,
            nav: [{
                title: "医院类型",
                check: false,
                children: [{
                    title: "全部医院",
                    typeid: 0
                }]
            }, {
                title: "全部地区",
                check: false,
                children: [{
                    title: "全国",
                    pid: 0,
                    check: true,
                    gradeson: []
                }]
            }]

        },
        hosList: [],
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
        })

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
            select.nav[0].title = select.nav[0].children[sonNum].title;
            select.type = select.nav[0].children[sonNum].typeid;

            app.showLoading();

            getHospitalList({
                type: select.type,
                province: select.pid,
                limit:this.data.pageSize,
                city: select.cid
            }).then((res) => {

                var hosList = res.hospital;
                var select = this.data.select;
                select.isShow = false;

                hosList.forEach((el) => {
                    if (el.type) {
                        el.type = el.type.slice(0, 2);
                    }
                });

                select.nav.forEach(function (el) {
                    el.check = false;
                });

                this.setData({
                    hosList: hosList,
                    total: res.total,
                    select: select,
                    page: 1
                });

                if (hosList.length != 0) {
                    app.toTop();
                }
                app.hideLoading();

            }).catch(() => {

                app.hideLoading();
                app.loadingError();

            });


        } else if (cur == 1) {

            console.log('导航1');
            select.pid = select.nav[1].children[sonNum].pid;

            if (select.nav[1].children[sonNum].gradeson.length == 0) {
                select.nav[1].title = select.nav[1].children[sonNum].title;
                select.cid = 0;

                app.showLoading();

                getHospitalList({
                    type: select.type,
                    province: select.pid,
                    limit:this.data.pageSize,
                    city: select.cid
                }).then((res) => {

                    var hosList = res.hospital;
                    select.isShow = false;

                    hosList.forEach((el) => {
                        if (el.type) {
                            el.type = el.type.slice(0, 2);
                        }
                    });

                    select.nav.forEach(function (el) {
                        el.check = false;
                    });

                    this.setData({
                        select: select,
                        hosList: hosList,
                        total: res.total,
                        page: 1
                    });

                    if (hosList.length != 0) {
                        app.toTop();
                    }
                    app.hideLoading();

                }).catch(() => {

                    app.hideLoading();
                    app.loadingError();

                });

            }
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

        getHospitalList({
            type: select.type,
            province: select.pid,
            limit:this.data.pageSize,
            city: select.cid
        }).then((res) => {

            var hosList = res.hospital;
            select.isShow = false;
            hosList.forEach((el) => {
                if (el.type) {
                    el.type = el.type.slice(0, 2);
                }
            });

            select.nav.forEach(function (el, i) {
                el.check = false;
            });

            select.nav[cur].title = select.nav[cur].children[sonNum].gradeson[gradesonNum].title;

            this.setData({
                select: select,
                hosList: hosList,
                total: res.total,
                page: 1
            });

            if (hosList.length != 0) {
                app.toTop();
            }
            app.hideLoading();

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });



    },
    onReady() {

        var select = this.data.select;

        app.showLoading();

        getHospitalType().then((res) => {

            res.hospitaltype.forEach(function (el) {
                select.nav[0].children.push({
                    typeid: el.typeid,
                    title: el.typename,
                    check: false
                });
            });

            this.setData({
                select: select
            });

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });

        getProvinceCity().then((res) => {

            res.result.forEach(function (el, i) {

                var prociece = {
                    pid: el.pid,
                    title: el.pname,
                    check: false,
                    gradeson: []
                };
                el.city.forEach((ele) => {
                    prociece.gradeson.push({
                        cid: ele.cid,
                        title: ele.cname
                    });
                });

                select.nav[1].children.push(prociece);

            });

            this.setData({
                select: select
            });

        }).catch(() => {

            app.hideLoading();
            app.loadingError();

        });

        getHospitalList({
            limit: this.data.pageSize,
            type: select.type,
            province: select.pid,
            city: select.cid
        }).then((res) => {

            var hosList = res.hospital;
            hosList.forEach((el) => {
                if (el.type) {
                    el.type = el.type.slice(0, 2);
                }
            });

            this.setData({
                hosList: hosList,
                total: res.total
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
        var hosList = this.data.hosList;

        this.setData({
            isLoading: true
        });

        page++;

        getHospitalList({
            type: select.type,
            province: select.pid,
            limit:this.data.pageSize,
            city: select.cid,
            page: page
        }).then((res) => {

            var addHosList = res.hospital;

            if (addHosList.length == 0) {

                app.loadingEmpty();
                this.setData({
                    isLoading: false
                });

            } else {
                
                addHosList.forEach((el) => {
                    if (el.type) {
                        el.type = el.type.slice(0, 2);
                    }
                });
                hosList = [...hosList, ...addHosList];

                this.setData({
                    select: select,
                    hosList: hosList,
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

})