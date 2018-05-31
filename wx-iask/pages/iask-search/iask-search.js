/**
 * @author: laoono
 * @date:  2017-07-21
 * @time: 18:54
 * @contact: laoono.com
 * @description: #
 */

let app = getApp();
let history = require('../../action/history');

let getData = function (event) {
    let {value: keyword} = event.detail;

    if (!keyword.trim().length) {
        return app.showToast({
           content: '请输入疾病/症状找问题'
        });
    }

    history.add(keyword).then((res = {}) => {
        let {history: historyList, code} = res;

        if (code == 200) {
            this.setData({
                historyList: historyList.reverse()
            });
        }
    });

    wx.redirectTo({
        url: '/pages/iask-search-result/iask-search-result?keyword=' + encodeURIComponent(keyword)
    });
};

Page({
    data: {
        historyList: [],
        value: ''
    },
    onLoad() {
        history.get().then((res = []) => {
            let historyList = res;

            this.setData({
                historyList: historyList.reverse()
            });

        }).catch(res => res);
    },
    getData,
    bindBack() {
        wx.navigateBack({
            delta: 1
        });
    },
    bindClearHistory() {
        history.remove().then((res = {}) => {
            let {code, history: historyList} = res;

            if (code == 200) {
                this.setData({
                    historyList
                });
            }
        });
    },
    bindClearInput() {
        let value = '';

        this.setData({
            value
        });
    },
    bindInput(event) {
       let {value} = event.detail;

       this.setData({
           value
       })
    }
});
