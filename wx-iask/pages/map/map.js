let app=getApp();

Page({
    data: {
        info: {},
        markers: [{
            iconPath: "/assets/images/icon-map.png",
            latitude: '',
            longitude: '',
            width: 28,
            height: 28
        }]
    },
    onLoad(options) {

        var markers = this.data.markers;
        markers[0].latitude = options.latitude;
        markers[0].longitude = options.longitude;

        this.setData({
            info: options,
            markers: markers
        });

        wx.setNavigationBarTitle({
            title: options.title
        });

    }
})