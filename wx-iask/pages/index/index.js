let {indicatorDots, autoplay, interval, duration, indicatorColor, indicatorActiveColor, circular} = require('../../module/swiper');

let {getSwiper} = require('../../action/get-swiper');
let {getLaterQuestion} = require('../../action/get-laterquestion');
let {getLatestNnswerDoctor} = require('../../action/get-getlatestanswerdoctor')

let Promise = require('../../vendor/es6-promise');
let config = require('../../utils/config');

let getData = function () {

    let promisA = getSwiper().then((res) => {
        let urls = res.banners;

/*        res.banners.forEach((item) => {
            urls.push(item.litpic);
        });*/

        this.setData({
            imgUrls: urls
        });
    }, (res) => {
    });

    let promisB = getLaterQuestion({num: 3}).then((res) => {
        let list = res.data;

        this.setData({
            laterQuestion: list
        });
    }).catch(() => {
        this.setData({
            isPlain: true
        })
    });

    let promisC = getLatestNnswerDoctor({num: 6}).then(res => {
        let {onlineDoctors} = res;

        this.setData({
            onlineDoctors
        });

    }).catch(() => {

    });


    Promise.all([promisA, promisB, promisC]).then(() => {
        wx.stopPullDownRefresh();
    }).catch(() => {
        wx.stopPullDownRefresh();
    });
};

Page({
    data: {
        imgUrls: [],
        indicatorDots: indicatorDots,
        autoplay: autoplay,
        interval: interval,
        duration: duration,
        indicatorColor: indicatorColor,
        indicatorActiveColor: indicatorActiveColor,
        circular: circular,
        title: config.APP_NAME + config.APP_NAME_TAIL
    },

    onLoad() {
        getData.call(this);
    },

    onShareAppMessage() {
        let {title} = this.data;

        return {
            title: title,
            path: '/pages/index/index'
        }
    },
    onPullDownRefresh() {
        getData.call(this);
    },
    bindToSwiperDetail(event) {
        let {weixinisurl, articleid, title} = event.currentTarget.dataset;

        if (weixinisurl) {
            wx.navigateTo({
                url: '/pages/article-detail/article-detail?articleid=' + articleid + '&title=' + title
            });
        }
    }
});