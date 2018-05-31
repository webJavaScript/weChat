/**
 * @author: laoono
 * @date:  2017-07-21
 * @time: 18:54
 * @contact: laoono.com
 * @description: #
 */

let {getDepartmentList} = require('../../action/get-departmentlist');
let {getAsktotalNum} = require('../../action/get-asktotalnum');
let app = getApp();
let {DEPARTMENT: department} = require('../../utils/config');

let Promise = require('../../vendor/es6-promise');

let getData = function () {
    app.showLoading();

    let promisA = getAsktotalNum().then(res => {
        let {askNums} = res.numbers;

        this.setData({
            askNums
        });
    });
    let promisB = getDepartmentList().then(res => {
        app.hideLoading();

        let {categoryList} = res;

        let num = 4;
        let row = num - Math.ceil(categoryList.length % num);
        let tail = [];

        if (row != num) {
            Array.from({length: row}).forEach(() => {
                tail.push({
                    id: -1,
                    name: 'null'
                });
            });
        }


        this.setData({
            categoryList: [...categoryList, ...tail]
        });
    }).catch(() => {
        app.loadingError();
    });

    Promise.all([promisA, promisB]).then(() => {
        wx.stopPullDownRefresh();
    }).catch(() => {
        wx.stopPullDownRefresh();
    })
};

Page({
    data: {
        department,
        askNums: '-'
    },
    onLoad() {
        getData.call(this);
    },
    bindToDepartment(event) {
        let {id} = event.currentTarget.dataset;

        if (id > 0) {
            wx.navigateTo({
                url: '/pages/department/department?dept_id=' + id
            });
        }
    },
    onPullDownRefresh() {
        getData.call(this);
    }
});
