var scene = require('./utils/scene.js');
var fhConfig = require('./utils/config');
App({
    onShow: options => {
        console.log('App.onShow options: ', options);
        if(options.scene == 1044) {
            console.log('shareTicket: ', options.shareTicket);
            wx.getShareInfo({
                shareTicket: options.shareTicket,
                success: res => {
                    console.log('获取转发信息：', res);
                }
            })
        }
        var sceneCode = scene.getSceneName(options.scene);
        console.log('场景值: ', scene.getSceneName(options.scene));
        if([1007, 1044].indexOf(options.scene) > -1) {
            fhConfig['isShare'] = true;
        }
    },
    onLaunch: options => {
        // this.getUserNetwork();
    }
})