var util = require('../../utils/util.js');

Page({
    data: {},
    onLoad: function(options) {
        util.loadingToast();
        var id = options.id;
        console.log('to page: ', id);
        var url = '';
        switch(id) {
            case 'iask':
                url = "../iask-mfh21/iask-mfh21?id=iask";
                break;
            case 'video':
                url = "../video-mfh21/video-mfh21?id=video"
                break;
            default:
                url = "../index/index"
        }
        wx.reLaunch({url});
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    }
})