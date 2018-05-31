var bmap = require('../../libs/bmap-wx.js');

let app = getApp();

function Rad(d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
}

function GetDistance(lat1, lng1, lat2, lng2) {

    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137; // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    s = s.toFixed(2);
    return s;
}

Page({
    data: {
        nav: {
            ucFavoTabs: [{
                    name: '附近医院',
                    value: 'iask'
                },
                {
                    name: '附近药店',
                    value: 'doctor'
                }
            ],
            value: 'iask'
        },
        markers: [],
        total:1,
        curPosition: {}
    },
    changeTab(event) {
        var nav = this.data.nav;
        nav.value = event.currentTarget.dataset.value;
        var self = this;
        var cur;

        app.showLoading();

        nav.ucFavoTabs.forEach(function(el,i){
            if (el.value == nav.value) {
                cur = i;
            }
        });

        // 新建百度地图对象 
        var BMap = new bmap.BMapWX({
            ak: 'UWAc0mqqz9fvxdR0u6oHI96Gquxaovxz'
        });
        // 发起POI检索请求 
        BMap.search({
            "query": nav.ucFavoTabs[cur].name,
            success: function (data) {

                var curPosition = self.data.curPosition;
                var markers = data.wxMarkerData;

                markers.forEach(function (el) {
                    el.dis = GetDistance(curPosition.latitude, curPosition.longitude, el.latitude, el.longitude);
                });

                markers.sort(function (a, b) {
                    return a.dis - b.dis;
                });

                self.setData({
                    markers: markers,
                    total:markers.length
                });

                if(markers.length != 0){
                    app.toTop();
                }
                app.hideLoading();
            },
            fail: function (data) {

                console.log(data)
                app.loadingError();
                
            }
        });

        this.setData({
            nav: nav
        });

    },
    onLoad() {
        var self = this;

        app.showLoading();

        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                self.setData({
                    curPosition: res
                });

                var BMap = new bmap.BMapWX({
                    ak: 'UWAc0mqqz9fvxdR0u6oHI96Gquxaovxz'
                });

                // 发起POI检索请求 
                BMap.search({
                    "query": '医院',
                    success: function (data) {

                        var curPosition = self.data.curPosition;
                        var markers = data.wxMarkerData;

                        markers.forEach(function (el) {
                            el.dis = GetDistance(curPosition.latitude, curPosition.longitude, el.latitude, el.longitude);
                        });
                        markers.sort(function (a, b) {
                            return a.dis - b.dis;
                        });

                        console.log(curPosition)

                        self.setData({
                            markers: markers,
                            total:markers.length
                        });
                        
                        app.hideLoading();

                    },
                    fail: function (data) {

                        console.log(data)
                        app.loadingError();

                    }
                });
            },
            fail(res) {

                app.loadingError();
                console.log(res);

            }
        })
        // 新建百度地图对象 

    }
})